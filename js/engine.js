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

        // Milestone markers for UI celebration art
        var pct = state.contractTarget > 0 ? (state.guanoShipped + state.guanoStockpile) / state.contractTarget : 0;
        if (pct >= 0.75 && state.lastMilestoneShown < 75) { state.lastMilestoneShown = 75; results.messages.push('MILESTONE_75'); }
        else if (pct >= 0.50 && state.lastMilestoneShown < 50) { state.lastMilestoneShown = 50; results.messages.push('MILESTONE_50'); }
        else if (pct >= 0.25 && state.lastMilestoneShown < 25) { state.lastMilestoneShown = 25; results.messages.push('MILESTONE_25'); }
      }
    }

    // 6b. Mining method risks
    if (state.isUnderground && state.miningChoice === 'side_passage' && Math.random() < 0.2) {
      results.messages.push('A side tunnel slumps and nearly buries the lead team.');
      var livingSide = window.GameState.getLivingParty();
      if (livingSide.length > 0) {
        var sideVictim = livingSide[Math.floor(Math.random() * livingSide.length)];
        window.HealthSystem.applyDamage(sideVictim, 18 + Math.floor(Math.random() * 12));
        results.messages.push(sideVictim.name + ' is bruised by a cave-in while scouting the side passage.');
      }
    }
    if (state.isUnderground && state.miningChoice === 'blasting') {
      if (state.dynamite > 0) state.dynamite -= 1;
      if (Math.random() < 0.15) {
        var livingBlast = window.GameState.getLivingParty();
        if (livingBlast.length > 0) {
          var blastVictim = livingBlast[Math.floor(Math.random() * livingBlast.length)];
          var blastDied = window.HealthSystem.applyDamage(blastVictim, 25 + Math.floor(Math.random() * 20));
          results.messages.push('Powder flash! ' + blastVictim.name + ' catches flying stone.');
          if (blastDied) {
            results.messages.push(blastVictim.name + ' was killed in the blast.');
            results.deaths.push(blastVictim.name);
          }
        }
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

    // 8b. Tick temporary state flags (tavern scenes, etc.)
    this.tickTemporaryFlags(state);

    // 9. Check contracts
    var contractResults = window.Economy.checkContracts(state);
    for (var c = 0; c < contractResults.length; c++) {
      results.messages.push(contractResults[c].message);
    }

    // 9b. Crew scouting can reveal adjacent chambers without travel
    if (state.isUnderground && state.crewAssignment === 'scouting' && window.CaveData) {
      var current = window.CaveData.getChamber(state.currentChamber);
      if (current && current.connectedTo) {
        for (var sc = 0; sc < current.connectedTo.length; sc++) {
          var cid = current.connectedTo[sc];
          if (state.discoveredChambers.indexOf(cid) === -1) {
            state.discoveredChambers.push(cid);
            results.messages.push('Scouts map a new adjacent chamber: ' + (window.CaveData.getChamber(cid).name || cid) + '.');
          }
        }
      }
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

    // Crew assignment impact
    if (state.crewAssignment === 'scouting') output *= 0.8;
    if (state.crewAssignment === 'guarding') output *= 0.9;

    // Mining method impact
    if (state.miningChoice === 'side_passage') {
      var sideRoll = Math.random();
      if (sideRoll < 0.3) {
        output *= 1.5;
      } else if (sideRoll < 0.5) {
        output *= 0.2;
      }
    } else if (state.miningChoice === 'blasting') {
      output *= 2.0;
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
      state.gameOverReason = 'The foreman is dead. Without him the crew scatters like quail.';
      return true;
    }

    // All crew dead
    if (window.GameState.getLivingCrewCount() === 0) {
      state.gameOver = true;
      state.gameOverReason = 'Every last man is dead. The cave keeps what it takes.';
      return true;
    }

    // Ran out of time (30-day contract expired)
    var duration = state.gameDuration || 30;
    if (state.totalDays >= duration) {
      state.gameOver = true;
      state.gameOverReason = 'Thirty days gone. The contract is dust. Time to reckon what you\'ve earned and what you\'ve lost.';
      return true;
    }

    // Broke and starving with no pending payments
    if (state.cash <= 0 && state.food <= 0 && state.pendingPayments.length === 0 && state.guanoStockpile <= 0) {
      state.gameOver = true;
      state.gameOverReason = 'No food. No coin. No guano to sell. The mountain has beaten you hollow.';
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
  tickTemporaryFlags: function(state) {
    if (!state) return;

    if (state.calmFocusDays && state.calmFocusDays > 0) state.calmFocusDays--;
    if (state.airAwareDays && state.airAwareDays > 0) state.airAwareDays--;

    // Per-chamber mapping timers
    if (state.mappedChambers && typeof state.mappedChambers === 'object') {
      for (var k in state.mappedChambers) {
        if (!state.mappedChambers.hasOwnProperty(k)) continue;
        state.mappedChambers[k]--;
        if (state.mappedChambers[k] <= 0) delete state.mappedChambers[k];
      }
    }

    // Tavern scene cooldowns
    if (state.tavernSceneCooldowns && typeof state.tavernSceneCooldowns === 'object') {
      for (var id in state.tavernSceneCooldowns) {
        if (!state.tavernSceneCooldowns.hasOwnProperty(id)) continue;
        state.tavernSceneCooldowns[id]--;
        if (state.tavernSceneCooldowns[id] <= 0) delete state.tavernSceneCooldowns[id];
      }
    }
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
