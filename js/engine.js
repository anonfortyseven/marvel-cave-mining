// engine.js - Core game engine for The Marvel Cave Mining Company
// Daily update cycle: date, environment, health, resources, work output, events

window.Engine = {
  // Pace multipliers for work output
  PACE_MULTIPLIER: {
    'careful':  0.5,
    'steady':   1.0,
    'grueling': 1.5
  },

  // Base guano mining rate per worker per day (tons)
  BASE_MINING_RATE: 0.05,

  // Donkey hauling bonus (multiplier per donkey)
  DONKEY_HAULING_BONUS: 0.15,

  // Track the results of the last processed day
  lastDayResults: null,

  // Advance one day - the main game loop step
  advanceDay: function() {
    var state = window.GameState.state;
    if (!state || state.gameOver) return null;

    var results = this.processDay(state);
    this.lastDayResults = results;

    // Advance the calendar
    window.GameState.advanceDate();

    // Check game over conditions
    this.checkGameOver(state);

    return results;
  },

  // Process all daily updates - returns a results object
  processDay: function(state) {
    var results = {
      date: new Date(state.date.getTime()),
      day: state.totalDays + 1,
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
    window.Economy.updateInflation(state);

    // 2. Process pending payments
    var payments = window.Economy.processPendingPayments(state);
    if (payments.length > 0) {
      results.paymentsReceived = payments;
      for (var p = 0; p < payments.length; p++) {
        results.messages.push('Payment received: $' + payments[p].amount.toFixed(2) + ' for ' + payments[p].description);
      }
    }

    // 3. Consume daily resources
    var consumption = window.Economy.consumeDailyResources(state);
    results.resourcesConsumed = consumption;
    if (consumption.shortages.length > 0) {
      for (var s = 0; s < consumption.shortages.length; s++) {
        results.messages.push('SHORTAGE: Out of ' + consumption.shortages[s] + '!');
      }
    }

    // 4. Update crew health
    var healthResults = window.HealthSystem.updatePartyHealth(state);
    results.healthResults = healthResults;
    for (var h = 0; h < healthResults.length; h++) {
      if (healthResults[h].died) {
        results.messages.push(healthResults[h].name + ' has died.');
        results.deaths.push(healthResults[h].name);
      }
    }

    // 5. Update donkey health
    var donkeyDied = window.HealthSystem.updateDonkeyHealth(state.donkeys, state);
    if (donkeyDied) {
      results.messages.push('A donkey has died! ' + state.donkeys.count + ' remaining.');
    }

    // 6. Calculate work output (if underground and working)
    if (state.isUnderground) {
      var mined = this.calculateWorkOutput(state);
      if (mined > 0) {
        state.guanoMined += mined;
        state.guanoStockpile += mined;
        results.guanoMinedToday = mined;
        results.messages.push('Mined ' + mined.toFixed(3) + ' tons of guano today.');
      }
    }

    // 7. Roll for random events
    var events = window.EventSystem.rollForEvents(state);
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

    // 8. Tick event cooldowns
    window.EventSystem.tickCooldowns(state);

    // 9. Check contracts
    var contractResults = window.Economy.checkContracts(state);
    for (var c = 0; c < contractResults.length; c++) {
      results.messages.push(contractResults[c].message);
    }

    // 10. Morale updates
    this.updateMorale(state, results);

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

    // Donkey hauling bonus
    if (state.donkeys.count > 0) {
      output *= (1 + state.donkeys.count * this.DONKEY_HAULING_BONUS);
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

    // Dynamite bonus for breaking through hard rock
    if (state.dynamite > 0) {
      output *= 1.1; // 10% bonus
    }

    // Equipment bonuses
    if (state.equipment) {
      if (state.equipment.toolUpgrade) output *= 1.15;
    }

    // Morale multiplier (50 = neutral, >50 = bonus, <50 = penalty)
    var morale = state.morale !== undefined ? state.morale : 50;
    var moraleMod = 0.8 + (morale / 250); // range 0.8 (morale=0) to 1.2 (morale=100)
    output *= moraleMod;

    return Math.round(output * 1000) / 1000;
  },

  // Check game over conditions
  checkGameOver: function(state) {
    // Foreman dead
    if (!state.foreman.alive) {
      state.gameOver = true;
      state.gameOverReason = 'The foreman has died. The operation is over.';
      return true;
    }

    // All crew dead
    if (window.GameState.getLivingCrewCount() === 0) {
      state.gameOver = true;
      state.gameOverReason = 'All crew members have perished. The operation cannot continue.';
      return true;
    }

    // Ran out of time (30-day contract expired)
    var duration = state.gameDuration || 30;
    if (state.totalDays >= duration) {
      state.gameOver = true;
      state.gameOverReason = 'Your ' + duration + '-day mining contract has expired. Time to settle accounts.';
      return true;
    }

    // Broke and starving with no pending payments
    if (state.cash <= 0 && state.food <= 0 && state.pendingPayments.length === 0 && state.guanoStockpile <= 0) {
      state.gameOver = true;
      state.gameOverReason = 'No food, no money, no prospects. The operation has failed.';
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

  // Update morale for the day
  updateMorale: function(state, results) {
    if (state.morale === undefined) state.morale = 50;
    var old = state.morale;

    if (state.isUnderground) {
      state.morale -= 1; // decay underground
      if (state.workPace === 'grueling') state.morale -= 1;
    } else {
      state.morale += 2; // recover on surface
    }

    // Low food penalty
    if (state.food <= 0) state.morale -= 3;
    else if (state.rationLevel === 'scraps') state.morale -= 1;

    // Clamp
    state.morale = Math.max(0, Math.min(100, state.morale));

    // Mutiny warning
    if (state.morale < 20 && old >= 20) {
      results.messages.push('The crew grumbles about conditions. Morale is dangerously low!');
    }
    if (state.morale <= 10) {
      results.messages.push('The crew threatens mutiny! Rest or improve conditions soon.');
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
