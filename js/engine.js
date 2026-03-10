// engine.js - Core game engine for The Marvel Cave Mining Company
// Daily update cycle: date, environment, health, resources, work output, events

window.Engine = {
  // Pace multipliers for work output
  PACE_MULTIPLIER: {
    'careful':  0.5,
    'steady':   1.0,
    'grueling': 1.5
  },

  TRAVEL_DAY_COST: 0.25,

  // Base guano mining rate per worker per day (tons)
  BASE_MINING_RATE: 0.06,

  // Track the results of the last processed day
  lastDayResults: null,

  // Advance one day - the main game loop step
  advanceDay: function() {
    var state = window.GameState.state;
    if (!state || state.gameOver) return null;

    var timeCost = this.getTimeCost(state);
    var results = this.processDay(state, timeCost);
    results.timeCost = timeCost;
    this.lastDayResults = results;

    // Advance the calendar
    window.GameState.advanceDate(timeCost);

    // Check game over conditions
    this.checkGameOver(state);

    return results;
  },

  getTimeCost: function(state) {
    if (!state) return 1;
    if (state.travelDay === 'descend' || state.travelDay === 'ascend' || state.travelDay === 'surface_ascent') {
      return this.TRAVEL_DAY_COST;
    }
    return 1;
  },

  // Process all daily updates - returns a results object
  processDay: function(state, timeCost) {
    timeCost = typeof timeCost === 'number' ? timeCost : 1;
    if (window.Expedition && window.Expedition.prepareDay) {
      window.Expedition.prepareDay(state);
    }

    var travelDay = state.travelDay || '';
    var restingDay = !!state.restingDay;

    var results = {
      date: new Date(state.date.getTime()),
      day: window.GameState && window.GameState.getDisplayDayNumber ? window.GameState.getDisplayDayNumber(state) : Math.floor((state.totalDays || 0)) + 1,
      travelDay: travelDay,
      restingDay: restingDay,
      messages: [],
      healthResults: [],
      resourcesConsumed: null,
      paymentsReceived: [],
      eventsTriggered: [],
      guanoMinedToday: 0,
      discoveries: [],
      deaths: []
    };

    // 1. Update inflation
    window.Economy.updateInflation(state, timeCost);

    // 2. Process pending payments
    var payments = window.Economy.processPendingPayments(state);
    if (payments.length > 0) {
      results.paymentsReceived = payments;
      for (var p = 0; p < payments.length; p++) {
        results.messages.push('Payment received: $' + payments[p].amount.toFixed(2) + ' for ' + payments[p].description);
      }
    }

    // 3. Consume daily resources
    var consumption = window.Economy.consumeDailyResources(state, timeCost);
    results.resourcesConsumed = consumption;
    if (consumption.shortages.length > 0) {
      for (var s = 0; s < consumption.shortages.length; s++) {
        var shortageLabel = consumption.shortages[s] === 'food' ? 'food and water' : consumption.shortages[s];
        results.messages.push('SHORTAGE: Out of ' + shortageLabel + '!');
      }
    }

    // 4. Update crew health
    var originalPace = state.workPace;
    if (travelDay) {
      state.workPace = 'careful';
    }
    var healthResults = window.HealthSystem.updatePartyHealth(state, timeCost);
    state.workPace = originalPace;
    results.healthResults = healthResults;
    for (var h = 0; h < healthResults.length; h++) {
      if (healthResults[h].died) {
        results.messages.push(healthResults[h].name + ' nearly goes under and has to be dragged clear.');
        results.deaths.push(healthResults[h].name);
      }
    }

    if (restingDay) {
      results.messages.push('No picks swing today. The crew stays down and truly rests.');
    }

    if ((state.foodShortageDays || 0) > 0 && (state.foodShortageDays || 0) < 2) {
      results.messages.push('The line is running dry on food and water.');
    }

    // 5. Calculate work output (if underground and working)
    if (state.isUnderground && !travelDay && !restingDay) {
      var mined = this.calculateWorkOutput(state);
      if (mined > 0) {
        state.guanoMined += mined;
        state.guanoStockpile += mined;
        results.guanoMinedToday = mined;
        results.messages.push('Mined ' + mined.toFixed(3) + ' tons of guano today.');

      }
    }

    // 6. Roll for random events
    var events = restingDay ? [] : window.EventSystem.rollForEvents(state, timeCost);
    results.eventsTriggered = events;
    for (var e = 0; e < events.length; e++) {
      results.messages.push('--- ' + events[e].eventName + ' ---');
      for (var m = 0; m < events[e].messages.length; m++) {
        results.messages.push(events[e].messages[m]);
      }
      // Collect deaths from events
      if (events[e].deaths) {
        for (var d = 0; d < events[e].deaths.length; d++) {
          results.deaths.push(events[e].deaths[d]);
        }
      }
    }

    // 7. Tick event cooldowns
    window.EventSystem.tickCooldowns(state, timeCost);

    // 7b. Tick temporary state flags (tavern scenes, etc.)
    this.tickTemporaryFlags(state, timeCost);

    // 8. Morale updates
    this.updateMorale(state, results, timeCost);

    if (window.Expedition && window.Expedition.finishDay) {
      window.Expedition.finishDay(state, results);
    }

    state.travelDay = '';
    state.restingDay = false;

    return results;
  },

  // Calculate guano mining output for the day
  calculateWorkOutput: function(state) {
    // Count working miners
    var minerCount = 0;
    for (var i = 0; i < state.crew.length; i++) {
      if (state.crew[i].alive && state.crew[i].health < window.HealthSystem.VERY_POOR_MAX) {
        // Crew in Very Poor health work at reduced rate
        if (state.crew[i].health > window.HealthSystem.POOR_MAX) {
          minerCount += 0.25; // very poor = 25% efficiency
        } else if (state.crew[i].health > window.HealthSystem.FAIR_MAX) {
          minerCount += 0.5; // poor = 50% efficiency
        } else if (state.crew[i].health > window.HealthSystem.GOOD_MAX) {
          minerCount += 0.75; // fair = 75% efficiency
        } else {
          minerCount += 1.0; // good = full efficiency
        }
      }
    }

    // Foreman contributes at 50% (managing, not just mining)
    if (state.foreman.alive && state.foreman.health < window.HealthSystem.VERY_POOR_MAX) {
      minerCount += 0.5;
    }

    if (minerCount <= 0) return 0;

    // Base output
    var output = minerCount * this.BASE_MINING_RATE;

    // Pace multiplier
    var paceMultiplier = this.PACE_MULTIPLIER[state.workPace] || 1.0;
    output *= paceMultiplier;

    // Lead profession bonus
    var profession = window.CaveData && window.CaveData.PROFESSIONS ? window.CaveData.PROFESSIONS[state.profession] : null;
    if (profession && profession.miningBonus) {
      output *= (1 + profession.miningBonus);
    }

    // Chamber yield modifier (if cave data is available)
    if (window.CaveData) {
      var chamber = window.CaveData.getChamber(state.currentChamber);
      if (chamber && chamber.guanoYield) {
        var yieldMod = window.CaveData.getGuanoMultiplier(chamber.guanoYield);
        output *= yieldMod;
      }
    }

    // Rope check - need rope to haul effectively
    if (state.rope < 20) {
      output *= 0.5; // halved without adequate rope
    }

    // Equipment bonuses
    if (state.equipment) {
      if (state.equipment.toolUpgrade) output *= 1.15;
    }

    // Morale multiplier (50 = neutral, >50 = bonus, <50 = penalty)
    var morale = state.morale !== undefined ? state.morale : 50;
    var moraleMod = 0.8 + (morale / 250); // range 0.8 (morale=0) to 1.2 (morale=100)
    output *= moraleMod;

    if (window.Expedition && window.Expedition.modifyOutput) {
      output = window.Expedition.modifyOutput(state, output);
    }

    return Math.round(output * 1000) / 1000;
  },

  // Check game over conditions
  checkGameOver: function(state) {
    if ((state.foodShortageDays || 0) >= 2) {
      state.gameOver = true;
      state.gameOverReason = 'Two days without food and water force the line back to daylight under escort.';
      return true;
    }

    // Ran out of time
    var duration = state.gameDuration || 20;
    if (state.totalDays >= duration) {
      state.gameOver = true;
      state.completedRun = true;
      state.gameOverReason = 'Twenty days are gone. The company clerk closes the books on whatever haul you got out.';
      return true;
    }

    // Broke and starving with no pending payments
    if (state.cash <= 0 && state.food <= 0 && state.pendingPayments.length === 0 && state.guanoStockpile <= 0) {
      state.gameOver = true;
      state.gameOverReason = 'No food and water. No coin. No load in the yard. The contract breaks before you do.';
      return true;
    }

    return false;
  },

  // Move to a new chamber
  moveToChamber: function(chamberId) {
    var state = window.GameState.state;
    state.currentChamber = chamberId;

    // Update zone from CaveData
    if (window.CaveData) {
      var chamber = window.CaveData.getChamber(chamberId);
      if (chamber) {
        state.currentZone = chamber.zone;
      }
    }

    // Track chamber discovery
    if (state.discoveredChambers.indexOf(chamberId) === -1) {
      state.discoveredChambers.push(chamberId);
    }
  },

  // Enter the cave
  enterCave: function() {
    var state = window.GameState.state;
    state.isUnderground = true;
    this.moveToChamber('cathedral_entrance');
  },

  // Exit the cave to surface
  exitCave: function() {
    var state = window.GameState.state;
    state.isUnderground = false;
    state.currentZone = 'surface';
    state.currentChamber = 'marmaros';
  },

  // Set work pace
  setPace: function(pace) {
    if (['careful', 'steady', 'grueling'].indexOf(pace) !== -1) {
      window.GameState.state.workPace = pace;
    }
  },

  // Set ration level
  setRations: function(level) {
    if (['full', 'half', 'scraps', 'none'].indexOf(level) !== -1) {
      window.GameState.state.rationLevel = level;
    }
  },

  // Format a date for display
  formatDate: function(date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  },

  // Tick down short-lived state flags (used by town/tavern scenes)
  tickTemporaryFlags: function(state, timeCost) {
    if (!state) return;
    var step = typeof timeCost === 'number' ? timeCost : 1;

    if (state.calmFocusDays && state.calmFocusDays > 0) state.calmFocusDays = Math.max(0, state.calmFocusDays - step);
    if (state.airAwareDays && state.airAwareDays > 0) state.airAwareDays = Math.max(0, state.airAwareDays - step);

    // Per-chamber mapping timers
    if (state.mappedChambers && typeof state.mappedChambers === 'object') {
      for (var k in state.mappedChambers) {
        if (!state.mappedChambers.hasOwnProperty(k)) continue;
        state.mappedChambers[k] -= step;
        if (state.mappedChambers[k] <= 0) delete state.mappedChambers[k];
      }
    }

    // Tavern scene cooldowns
    if (state.tavernSceneCooldowns && typeof state.tavernSceneCooldowns === 'object') {
      for (var id in state.tavernSceneCooldowns) {
        if (!state.tavernSceneCooldowns.hasOwnProperty(id)) continue;
        state.tavernSceneCooldowns[id] -= step;
        if (state.tavernSceneCooldowns[id] <= 0) delete state.tavernSceneCooldowns[id];
      }
    }
  },

  // Update morale for the day
  updateMorale: function(state, results, timeCost) {
    if (state.morale === undefined) state.morale = 50;
    var old = state.morale;
    var step = typeof timeCost === 'number' ? timeCost : 1;
    var moraleDelta = 0;

    if (state.isUnderground) {
      moraleDelta -= 1; // decay underground
      if (state.workPace === 'grueling') moraleDelta -= 1;
    } else {
      moraleDelta += 2; // recover on surface
    }

    // Low food penalty
    if (state.food <= 0) moraleDelta -= 3;
    else if (state.rationLevel === 'scraps') moraleDelta -= 1;

    if (window.Expedition && window.Expedition.getCrewData) {
      var ropeProfile = state.crew[0] ? window.Expedition.getCrewData(state, state.crew[0]) : null;
      var lampProfile = state.crew[1] ? window.Expedition.getCrewData(state, state.crew[1]) : null;
      if (ropeProfile && ropeProfile.traitId === 'grim_joker' && state.isUnderground) moraleDelta += 1;
      if (lampProfile && lampProfile.traitId === 'night_singer' && !state.isUnderground) moraleDelta += 1;
    }

    state.morale += moraleDelta * step;

    // Clamp
    state.morale = Math.max(0, Math.min(100, Math.round(state.morale * 100) / 100));

    // Mutiny warning
    if (state.morale < 20 && old >= 20) {
      results.messages.push('The men speak in low voices. They\'re weighing whether you\'re worth following.');
    }
    if (state.morale <= 10) {
      results.messages.push('Mutiny hangs in the air thick as guano dust. Do something or lose them.');
    }
  },

  // Get a summary of current status
  getStatusSummary: function() {
    var state = window.GameState.state;
    return {
      date: this.formatDate(state.date),
      location: state.isUnderground ? state.currentZone : 'Surface Camp',
      partySize: window.GameState.getPartySize(),
      foremanHealth: window.HealthSystem.getHealthLabel(state.foreman.health),
      cash: state.cash,
      food: state.food,
      guanoMined: state.guanoMined,
      guanoStockpile: state.guanoStockpile,
      workPace: state.workPace,
      rationLevel: state.rationLevel,
      season: state.season
    };
  }
};
