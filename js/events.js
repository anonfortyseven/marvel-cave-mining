// events.js - Event system for The Marvel Cave Mining Company
// Random events by zone with probability tables

window.EventSystem = {
  // Cooldown period (in days) before same event can repeat
  DEFAULT_COOLDOWN: 3,

  crewQuips: {
    ropeman: [
      "That rope's fraying — I can feel it!",
      'Keep your knots tight and your feet tighter.',
      'One bad handhold and we all pay for it.',
      'Rope first, bravado second.'
    ],
    lampkeeper: [
      'Hold still — I need this flame to stay true.',
      'If the light dies, we die with it.',
      'Bad air makes the lantern dance. I do not like it.',
      'Stay in the glow and keep moving.'
    ],
    blastman: [
      'Loose rock means loose graves. Mind your heads.',
      'I can break stone. I cannot mend a crushed skull.',
      'Flood water and powder do not mix — move!',
      'Hear that rumble? The cave is warning us.'
    ],
    cartdriver: [
      'Keep the line moving — donkeys spook easy down here.',
      'The track is slick as grease; watch your footing.',
      'If we drop this load, we lose half a day.',
      'I can haul through this, but not at a dead run.'
    ]
  },

  getCrewQuipForEvent: function(state, eventId) {
    if (!state || !state.crew) return null;
    var roleForEvent = {
      cave_in: 'blastman',
      flooding: 'cartdriver',
      bad_air: 'lampkeeper',
      bat_swarm: 'lampkeeper',
      rockfall: 'blastman',
      equipment_break: 'ropeman',
      snakebite: 'ropeman',
      bat_fever: 'lampkeeper',
      lost: 'cartdriver',
      exhaustion: 'cartdriver',
      hypothermia: 'lampkeeper',
      lung_sickness: 'lampkeeper',
      broken_bone: 'ropeman'
    };

    var role = roleForEvent[eventId];
    if (!role || !this.crewQuips[role]) return null;

    var speaker = null;
    for (var i = 0; i < state.crew.length; i++) {
      if (state.crew[i].alive && state.crew[i].role === role) {
        speaker = state.crew[i];
        break;
      }
    }

    var line = this.crewQuips[role][Math.floor(Math.random() * this.crewQuips[role].length)];
    if (!line) return null;
    return (speaker ? speaker.name : 'A crewman') + ': "' + line + '"';
  },

  // --- CAVE EVENT DEFINITIONS ---
  caveEvents: {
    'cave_in': {
      name: 'Cave-In',
      description: 'The Mississippian limestone fractures and collapses from the ceiling!',
      zones: ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'],
      probability: 0.04,
      cooldown: 5,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        // Random crew member takes damage
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 30 + Math.floor(Math.random() * 40); // 30-70 damage
        results.messages.push(victim.name + ' is struck by falling rocks!');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + ' was killed in the cave-in.');
          results.deaths.push(victim.name);
        } else {
          results.messages.push(victim.name + '\'s health: ' + window.HealthSystem.getHealthLabel(victim.health));
        }
        // May lose timber
        if (state.timber > 0) {
          var lost = Math.min(state.timber, Math.floor(Math.random() * 5) + 1);
          state.timber -= lost;
          results.messages.push(lost + ' timber lost in the collapse.');
        }
        return results;
      }
    },

    'flooding': {
      name: 'Flooding',
      description: 'The Lost River swells with rainwater from the surface!',
      zones: ['zone3', 'zone4', 'zone5'],
      probability: 0.05,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('The Lost River surges! Flash flooding fills the passage in minutes!');
        // Everyone takes minor damage, supplies may be lost
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 10 + Math.floor(Math.random() * 15);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('The entire party is soaked and chilled.');
        // Lose some food and candles
        var foodLost = Math.min(state.food, Math.floor(Math.random() * 10) + 5);
        state.food -= foodLost;
        results.messages.push(foodLost + ' lbs of food ruined by water.');
        var oilLost = Math.min(state.lanternOil, (Math.random() * 0.5) + 0.25);
        state.lanternOil = Math.max(0, state.lanternOil - oilLost);
        results.messages.push('Lantern oil spilled in the flood.');
        return results;
      }
    },

    'bad_air': {
      name: 'Bad Air',
      description: 'Ammonia from centuries of bat guano chokes the chamber.',
      zones: ['zone3', 'zone4', 'zone5'],
      probability: 0.06,
      cooldown: 3,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Thick ammonia from the guano deposits makes the air hard to breathe.');
        if (state.airAwareDays && state.airAwareDays > 0) {
          results.messages.push('You cover your mouths with cloth and keep close.');
        }
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 15 + Math.floor(Math.random() * 20);
          if (state.airAwareDays && state.airAwareDays > 0) damage = Math.floor(damage * 0.7);
          var died = window.HealthSystem.applyDamage(living[i], damage);
          if (died) {
            results.messages.push(living[i].name + ' collapses and does not get back up.');
            results.deaths.push(living[i].name);
          }
        }
        if (results.deaths.length === 0) {
          results.messages.push('Everyone is dizzy and retching from the fumes.');
        }
        return results;
      }
    },

    'bat_swarm': {
      name: 'Bat Swarm',
      description: 'The gray bat colony erupts in a spiraling vortex toward the surface!',
      zones: ['zone1', 'zone2', 'zone3', 'zone4'],
      probability: 0.07,
      cooldown: 2,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Tens of thousands of gray bats spiral past in a roaring vortex!');
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 5 + Math.floor(Math.random() * 10);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('Scratches and bites from the swarm. The bats consume 24 million insects a night — they don\'t appreciate the intrusion.');
        // Oil consumption spikes from panicked movement
        state.lanternOil = Math.max(0, state.lanternOil - 0.25);
        results.messages.push('Lantern oil spilled in the commotion.');
        return results;
      }
    },

    'rockfall': {
      name: 'Rockfall',
      description: 'Dissolved limestone crumbles from the passage walls!',
      zones: ['zone2', 'zone3', 'zone4', 'zone5'],
      probability: 0.05,
      cooldown: 3,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 15 + Math.floor(Math.random() * 25);
        results.messages.push('Weathered limestone breaks free and tumbles onto ' + victim.name + '!');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + ' was crushed by falling rocks.');
          results.deaths.push(victim.name);
        }
        return results;
      }
    },

    'equipment_break': {
      name: 'Equipment Break',
      description: 'The cave\'s constant moisture corrodes the equipment!',
      zones: ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'],
      probability: 0.06,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        // Lose a random piece of equipment
        var options = [];
        if (state.rope > 20) options.push('rope');
        if (state.timber > 3) options.push('timber');
        if (state.dynamite > 2) options.push('dynamite');
        if (options.length === 0) {
          results.messages.push('Equipment is wearing down but nothing breaks.');
          return results;
        }
        var broken = options[Math.floor(Math.random() * options.length)];
        switch (broken) {
          case 'rope':
            var lost = Math.floor(Math.random() * 30) + 10;
            state.rope = Math.max(0, state.rope - lost);
            results.messages.push(lost + ' feet of rope snapped!');
            break;
          case 'timber':
            var lost2 = Math.floor(Math.random() * 5) + 1;
            state.timber = Math.max(0, state.timber - lost2);
            results.messages.push(lost2 + ' timber supports cracked!');
            break;
          case 'dynamite':
            var lost3 = Math.floor(Math.random() * 3) + 1;
            state.dynamite = Math.max(0, state.dynamite - lost3);
            results.messages.push(lost3 + ' sticks of dynamite ruined by moisture!');
            break;
        }
        return results;
      }
    },

    'snakebite': {
      name: 'Snakebite',
      description: 'An Ozark copperhead strikes from the rocks near the entrance!',
      zones: ['zone1', 'zone2'],
      probability: 0.04,
      cooldown: 5,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 20 + Math.floor(Math.random() * 30);
        results.messages.push(victim.name + ' was bitten by a copperhead lurking in the upper passages!');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + ' died from the venom.');
          results.deaths.push(victim.name);
        } else {
          results.messages.push(victim.name + ' needs rest to recover.');
        }
        return results;
      }
    },

    'bat_fever': {
      name: 'Bat Fever',
      description: 'Histoplasmosis from inhaling fungal spores in the bat guano.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4'],
      probability: 0.03,
      cooldown: 7,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 25 + Math.floor(Math.random() * 20);
        results.messages.push(victim.name + ' has come down with cave fever — the guano harbors a lung fungus!');
        window.HealthSystem.applyDamage(victim, damage);
        results.messages.push(victim.name + ' shivers with fever and cannot draw a full breath.');
        return results;
      }
    },

    'lost': {
      name: 'Lost',
      description: 'The scalloped passages twist and branch into darkness.',
      zones: ['zone3', 'zone4', 'zone5'],
      probability: 0.04,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Every passage looks the same — water-carved scallops and branching tunnels. The party is lost!');
        // Extra resource consumption (wandering uses oil and food)
        state.lanternOil = Math.max(0, state.lanternOil - 0.5);
        var foodLost = Math.floor(Math.random() * 5) + 3;
        state.food = Math.max(0, state.food - foodLost);
        results.messages.push('Lost half a day finding the way back. Extra rations consumed.');
        // Minor health hit from stress
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          window.HealthSystem.applyDamage(living[i], 5);
        }
        return results;
      }
    },

    'exhaustion': {
      name: 'Exhaustion',
      description: 'The crew is pushed beyond their limits.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'],
      probability: 0.05,
      cooldown: 3,
      // Only triggers on grueling pace
      condition: function(state) { return state.workPace === 'grueling'; },
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('The grueling pace takes its toll!');
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 10 + Math.floor(Math.random() * 15);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('Everyone is bone-tired. Work output suffers.');
        return results;
      }
    },

    'hypothermia': {
      name: 'Hypothermia',
      description: 'The constant 58-degree air and dripping water drain body heat.',
      zones: ['zone4', 'zone5'],
      probability: 0.04,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('At 505 feet deep, the constant 58-degree air and dripping water are deadly!');
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 12 + Math.floor(Math.random() * 15);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('Wet clothes and the cave\'s relentless chill sap everyone\'s strength.');
        return results;
      }
    },

    'lung_sickness': {
      name: 'Lung Sickness',
      description: 'Nitrogen-rich guano dust inflames the lungs.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4'],
      probability: 0.03,
      cooldown: 7,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 20 + Math.floor(Math.random() * 25);
        results.messages.push(victim.name + ' develops a racking cough from the ammonia-laden guano dust!');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + ' choked to death on cave dust.');
          results.deaths.push(victim.name);
        } else {
          results.messages.push(victim.name + ' will have trouble breathing for days.');
        }
        return results;
      }
    },

    'broken_bone': {
      name: 'Broken Bone',
      description: 'The wet limestone is treacherous underfoot.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'],
      probability: 0.03,
      cooldown: 6,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 35 + Math.floor(Math.random() * 25);
        if (state.equipment && state.equipment.walkingStick) {
          damage = Math.floor(damage * 0.8);
          results.messages.push(victim.name + '\'s walking stick helps break the fall.');
        }
        results.messages.push(victim.name + ' slips and breaks a bone!');
        window.HealthSystem.applyDamage(victim, damage);
        results.messages.push(victim.name + ' will need time to heal.');
        return results;
      }
    }
  },

  // --- SURFACE EVENT DEFINITIONS ---
  surfaceEvents: {
    'bald_knobber_raid': {
      name: 'Bald Knobber Raid',
      description: 'The Bald Knobbers have come calling!',
      probability: 0.03,
      cooldown: 7,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Bald Knobbers ride into Marmaros under cover of night!');
        // Steal cash and supplies
        var cashStolen = Math.min(state.cash, Math.floor(Math.random() * 50) + 20);
        if (state.equipment && state.equipment.huntingKnife) {
          cashStolen = Math.floor(cashStolen * 0.5);
          results.messages.push('Your hunting knife deters the worst of the theft.');
        }
        state.cash -= cashStolen;
        results.messages.push('They steal $' + cashStolen.toFixed(2) + ' from the strongbox.');
        // May steal food
        if (Math.random() < 0.5) {
          var foodStolen = Math.min(state.food, Math.floor(Math.random() * 20) + 10);
          state.food -= foodStolen;
          results.messages.push(foodStolen + ' lbs of food taken.');
        }
        // May injure someone
        if (Math.random() < 0.3) {
          var living = window.GameState.getLivingParty();
          if (living.length > 0) {
            var victim = living[Math.floor(Math.random() * living.length)];
            window.HealthSystem.applyDamage(victim, 20);
            results.messages.push(victim.name + ' was roughed up by the raiders.');
          }
        }
        state.baldKnobberThreat = Math.min(10, state.baldKnobberThreat + 2);
        return results;
      }
    },

    'stagecoach_delay': {
      name: 'Stagecoach Delay',
      description: 'The roads up Roark Mountain are impassable.',
      probability: 0.05,
      cooldown: 5,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('The supply wagon can\'t make it up the Roark Mountain road!');
        // Delay all pending payments by an extra 3 days
        for (var i = 0; i < state.pendingPayments.length; i++) {
          state.pendingPayments[i].dueDate = new Date(
            state.pendingPayments[i].dueDate.getTime() + (3 * 86400000)
          );
        }
        results.messages.push('All incoming payments delayed by 3 days.');
        return results;
      }
    },

    'supply_wagon': {
      name: 'Supply Wagon',
      description: 'A passing supply wagon offers goods at a discount!',
      probability: 0.04,
      cooldown: 6,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('A supply wagon passes through! They offer surplus goods.');
        // Give some free supplies
        var foodGain = Math.floor(Math.random() * 20) + 10;
        state.food += foodGain;
        results.messages.push('You receive ' + foodGain + ' lbs of food.');
        if (Math.random() < 0.5) {
          var oilGain = Math.floor(Math.random() * 3) + 1;
          state.lanternOil += oilGain;
          results.messages.push('Plus ' + oilGain + ' gallons of oil!');
        }
        return results;
      }
    },

    'traveler': {
      name: 'Traveler',
      description: 'A traveler passes through with news.',
      probability: 0.06,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var tips = [
          'A traveler warns of Bald Knobber activity on Roark Mountain.',
          'A traveler mentions the deepest guano deposits lie past the Mammoth Room, 450 feet down.',
          'A traveler shares news from Springfield — bat guano fetches $700 a ton for fertilizer.',
          'An old Osage hunter says the cave is Devil\'s Den. His people have avoided it for generations.',
          'A traveler says the Marble Cave Mining Company in Barton County is watching your operation closely.'
        ];
        var tip = tips[Math.floor(Math.random() * tips.length)];
        results.messages.push(tip);
        // Small morale boost (minor healing)
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          window.HealthSystem.applyHealing(living[i], 3);
        }
        results.messages.push('The company lifts everyone\'s spirits.');
        return results;
      }
    },

    'fire': {
      name: 'Camp Fire',
      description: 'Fire breaks out in the Marmaros supply depot!',
      probability: 0.02,
      cooldown: 10,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Fire breaks out in the supply depot at Marmaros!');
        // Destroy some supplies
        var foodLost = Math.min(state.food, Math.floor(Math.random() * 30) + 15);
        state.food -= foodLost;
        results.messages.push(foodLost + ' lbs of food destroyed.');
        if (state.dynamite > 0 && Math.random() < 0.3) {
          var dynLost = Math.min(state.dynamite, Math.floor(Math.random() * 5) + 1);
          state.dynamite -= dynLost;
          results.messages.push(dynLost + ' sticks of dynamite lost! (Carefully moved the rest.)');
        }
        // Someone may get burned
        if (Math.random() < 0.4) {
          var living = window.GameState.getLivingParty();
          if (living.length > 0) {
            var victim = living[Math.floor(Math.random() * living.length)];
            window.HealthSystem.applyDamage(victim, 15);
            results.messages.push(victim.name + ' was burned fighting the fire.');
          }
        }
        return results;
      }
    }
  },

  // Roll for random events based on current state
  rollForEvents: function(state) {
    var triggered = [];
    var events = state.isUnderground ? this.caveEvents : this.surfaceEvents;

    for (var eventId in events) {
      var event = events[eventId];

      // Check cooldown
      if (state.eventCooldowns[eventId] && state.eventCooldowns[eventId] > 0) {
        continue;
      }

      // Check zone restriction (cave events only)
      if (event.zones && event.zones.indexOf(state.currentZone) === -1) {
        continue;
      }

      // Check condition (if any)
      if (event.condition && !event.condition(state)) {
        continue;
      }

      // Roll probability (with small dynamic modifiers)
      var prob = event.probability;

      // Tavern scene bonuses: make it less likely to get lost / bad air when prepared
      if (eventId === 'lost') {
        if (state.calmFocusDays && state.calmFocusDays > 0) prob *= 0.5;
        if (state.mappedChambers && state.mappedChambers[state.currentChamber]) prob *= 0.4;
      }
      if (eventId === 'bad_air') {
        if (state.airAwareDays && state.airAwareDays > 0) prob *= 0.7;
      }

      // Roll probability
      if (Math.random() < prob) {
        // Event triggers!
        var result = event.effect(state);
        result.eventId = eventId;
        result.eventName = event.name;
        result.eventDescription = event.description;
        var quip = this.getCrewQuipForEvent(state, eventId);
        if (quip) result.messages.push(quip);
        triggered.push(result);

        // Set cooldown
        state.eventCooldowns[eventId] = event.cooldown || this.DEFAULT_COOLDOWN;
      }
    }

    return triggered;
  },

  // Decrease all cooldowns by 1 (call each day)
  tickCooldowns: function(state) {
    for (var eventId in state.eventCooldowns) {
      if (state.eventCooldowns[eventId] > 0) {
        state.eventCooldowns[eventId]--;
      }
      if (state.eventCooldowns[eventId] <= 0) {
        delete state.eventCooldowns[eventId];
      }
    }
  },

  // Get a random discovery event for a chamber (one-time events)
  checkDiscovery: function(chamber, state) {
    if (!chamber || !chamber.discovery) return null;

    var flag = chamber.discovery.flag;
    if (state[flag]) return null; // already discovered

    // Mark as discovered
    state[flag] = true;

    return {
      name: chamber.discovery.name,
      description: chamber.discovery.description,
      messages: [chamber.discovery.description],
      points: chamber.discovery.points || 0
    };
  }
};
