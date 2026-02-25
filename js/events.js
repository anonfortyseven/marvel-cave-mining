// events.js - Event system for The Marvel Cave Mining Company
// Random events by zone with probability tables

window.EventSystem = {
  // Cooldown period (in days) before same event can repeat
  DEFAULT_COOLDOWN: 3,

  crewQuips: {
    ropeman: [
      "That rope's fraying. I can feel it in my hands and I do not like what my hands are telling me.",
      'Keep your knots tight and your feet tighter. The cave tests both.',
      'One bad handhold and we all pay for it. I have buried men who trusted bad rope.',
      'Rope first. Bravado second. Survival always.',
      "I have been doing this for fourteen years. The scared ones live longer. Remember that.",
      "Check the anchor. Check it again. The third check is the one that saves your life.",
      "I tied a bowline on my mother's clothesline when I was six. Haven't stopped tying knots since.",
      "Slow is smooth and smooth is alive. Rush the rope and the rope will rush you into the ground."
    ],
    lampkeeper: [
      'Hold still. I need this flame to stay true. Our lives are exactly as long as this wick.',
      'If the light dies, we die with it. That is not poetry. That is arithmetic.',
      'Bad air makes the lantern dance. When the flame dances, I do not dance with it. I leave.',
      'Stay in the glow. The dark out there is not empty. It is patient.',
      "Oil's low. I can stretch it but I cannot create it. We need to think about going up.",
      'That blue tinge on the flame? Methane. The cave is breathing something we should not be.',
      "I have seen a man walk ten feet past his lantern's reach and never come back. Ten feet.",
      "The flame tells you things if you watch it. Right now it is saying we should not be here."
    ],
    blastman: [
      'Loose rock means loose graves. Mind your heads and mind your prayers.',
      'I can break stone. I cannot mend a crushed skull. The order of operations matters.',
      'Flood water and powder do not mix. If the water comes, leave the powder. Leave everything.',
      'Hear that rumble? The cave is clearing its throat. When it speaks, we listen.',
      "I have cracked open mountains. This cave is different. It pushes back.",
      "That crack in the ceiling was not there yesterday. The limestone remembers every charge we set.",
      "Dynamite is simple. Light the fuse, walk away. It is the walking away part men get wrong.",
      "The rock here is Mississippian limestone. Three hundred million years old. It has opinions about being disturbed."
    ],
    cartdriver: [
      'Keep the line moving. These donkeys spook easy and a spooked donkey in a cave is a disaster with hooves.',
      'Track is slick as sin. Watch your footing or watch the donkey step on you.',
      'We drop this load, we lose half a day. I do not have half a day to lose.',
      'I can haul through this, but not at a dead run. The cart was not built for heroics.',
      "The donkeys know something we don't. Look at their ears. They hear things in the rock.",
      "I have driven carts through worse. Not much worse. But worse.",
      "Fifty pounds a sack. Four sacks a load. Eight loads a day. The arithmetic of bat dung.",
      "The mules on the surface have it easy. These poor donkeys got lowered down here by rope and they have not forgiven us."
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
      description: 'A sound like God clearing His throat. The Mississippian limestone fractures and the ceiling comes down.',
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
        results.messages.push(victim.name + ' disappears under a wall of falling stone.');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + ' was buried. The cave keeps what it takes.');
          results.deaths.push(victim.name);
        } else {
          results.messages.push(victim.name + ' crawls free, bloodied but breathing. Health: ' + window.HealthSystem.getHealthLabel(victim.health));
        }
        // May lose timber
        if (state.timber > 0) {
          var lost = Math.min(state.timber, Math.floor(Math.random() * 5) + 1);
          state.timber -= lost;
          results.messages.push(lost + ' timber splintered like matchsticks in the collapse.');
        }
        return results;
      }
    },

    'flooding': {
      name: 'Flooding',
      description: 'A sound like distant thunder that gets less distant very fast. The Lost River swells with surface rain.',
      zones: ['zone3', 'zone4', 'zone5'],
      probability: 0.05,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Brown water fills the passage in minutes. There is nowhere to go but up.');
        // Everyone takes minor damage, supplies may be lost
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 10 + Math.floor(Math.random() * 15);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('The entire party is soaked to the bone. The fifty-eight-degree air begins its patient work.');
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
      description: 'The candle flame shrinks to a blue whisper. Ammonia from centuries of bat guano chokes the chamber.',
      zones: ['zone3', 'zone4', 'zone5'],
      probability: 0.06,
      cooldown: 3,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('The ammonia hits your throat like a fist. Thick, invisible, centuries old.');
        if (state.airAwareDays && state.airAwareDays > 0) {
          results.messages.push('You cover your mouths with cloth and keep close.');
        }
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 15 + Math.floor(Math.random() * 20);
          if (state.airAwareDays && state.airAwareDays > 0) damage = Math.floor(damage * 0.7);
          var died = window.HealthSystem.applyDamage(living[i], damage);
          if (died) {
            results.messages.push(living[i].name + ' collapses. The coughing stops. That is worse than the coughing.');
            results.deaths.push(living[i].name);
          }
        }
        if (results.deaths.length === 0) {
          results.messages.push('Everyone is retching. Eyes streaming. The cave does not apologize.');
        }
        return results;
      }
    },

    'bat_swarm': {
      name: 'Bat Swarm',
      description: 'The ceiling comes alive. Forty thousand gray bats erupt in a shrieking, spiraling vortex.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4'],
      probability: 0.07,
      cooldown: 2,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('A river of bats pours through the passage. You cannot see. You cannot hear. You can only endure.');
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 5 + Math.floor(Math.random() * 10);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('Scratches and bites from the swarm. Forty thousand bats that eat twenty-four million insects a night do not appreciate the intrusion.');
        // Oil consumption spikes from panicked movement
        state.lanternOil = Math.max(0, state.lanternOil - 0.25);
        results.messages.push('Lantern oil spilled in the commotion.');
        return results;
      }
    },

    'rockfall': {
      name: 'Rockfall',
      description: 'A shelf of limestone sheers off with a sound like a rifle shot.',
      zones: ['zone2', 'zone3', 'zone4', 'zone5'],
      probability: 0.05,
      cooldown: 3,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 15 + Math.floor(Math.random() * 25);
        results.messages.push('A boulder the size of a whiskey barrel breaks free and tumbles onto ' + victim.name + '.');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + ' did not get up. The mountain shrugged and a man died.');
          results.deaths.push(victim.name);
        }
        return results;
      }
    },

    'equipment_break': {
      name: 'Equipment Break',
      description: 'The cave\'s constant moisture and mineral-laden air have been working on your equipment.',
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
      description: 'Four feet of Ozark malice coiled in the rocks. A timber rattlesnake strikes before you see it.',
      zones: ['zone1', 'zone2'],
      probability: 0.04,
      cooldown: 5,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 20 + Math.floor(Math.random() * 30);
        results.messages.push(victim.name + ' was bitten by a timber rattler coiled in the rocks. It struck before anyone saw it.');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + ' died of the venom. The nearest doctor was in Forsyth. Two days away.');
          results.deaths.push(victim.name);
        } else {
          results.messages.push(victim.name + '\'s arm swells black as a bruise. Rest is the only medicine that matters.');
        }
        return results;
      }
    },

    'bat_fever': {
      name: 'Bat Fever',
      description: 'It starts as a cough. It always starts as a cough. Histoplasmosis from the guano fungus.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4'],
      probability: 0.03,
      cooldown: 7,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 25 + Math.floor(Math.random() * 20);
        results.messages.push(victim.name + ' has come down with cave fever. The guano dust harbors a fungus that colonizes the lungs.');
        window.HealthSystem.applyDamage(victim, damage);
        results.messages.push(victim.name + ' shivers with fever and cannot draw a full breath. Science won\'t name this disease for sixty years.');
        return results;
      }
    },

    'lost': {
      name: 'Lost',
      description: 'Every passage looks the same. Every shadow is a fork you do not remember.',
      zones: ['zone3', 'zone4', 'zone5'],
      probability: 0.04,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Every passage looks the same. Water-carved scallops and branching tunnels. Your landmarks have vanished.');
        // Extra resource consumption (wandering uses oil and food)
        state.lanternOil = Math.max(0, state.lanternOil - 0.5);
        var foodLost = Math.floor(Math.random() * 5) + 3;
        state.food = Math.max(0, state.food - foodLost);
        results.messages.push('Lost half a day wandering before the passage came familiar again. Extra rations consumed in the dark.');
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
      description: 'The body has limits. You have found them.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'],
      probability: 0.05,
      cooldown: 3,
      // Only triggers on grueling pace
      condition: function(state) { return state.workPace === 'grueling'; },
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('The grueling pace takes its toll. The body has limits and you have found them.');
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 10 + Math.floor(Math.random() * 15);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('Every man is bone-tired. They move like men underwater. Work output suffers accordingly.');
        return results;
      }
    },

    'hypothermia': {
      name: 'Hypothermia',
      description: 'Fifty-eight degrees does not sound cold until everything you own is soaked through.',
      zones: ['zone4', 'zone5'],
      probability: 0.04,
      cooldown: 4,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('Five hundred feet deep. Wet clothes. Fifty-eight degrees. The cold does not rush. It is patient.');
        var living = window.GameState.getLivingParty();
        for (var i = 0; i < living.length; i++) {
          var damage = 12 + Math.floor(Math.random() * 15);
          window.HealthSystem.applyDamage(living[i], damage);
        }
        results.messages.push('The shivering is constant now. When it stops, that is when it gets dangerous.');
        return results;
      }
    },

    'lung_sickness': {
      name: 'Lung Sickness',
      description: 'The guano dust has done its patient work. A racking cough that will not stop.',
      zones: ['zone1', 'zone2', 'zone3', 'zone4'],
      probability: 0.03,
      cooldown: 7,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        var living = window.GameState.getLivingParty();
        if (living.length === 0) return results;
        var victim = living[Math.floor(Math.random() * living.length)];
        var damage = 20 + Math.floor(Math.random() * 25);
        results.messages.push(victim.name + ' doubles over with a racking cough that echoes off the walls like a death rattle.');
        var died = window.HealthSystem.applyDamage(victim, damage);
        if (died) {
          results.messages.push(victim.name + '\'s cough went silent. That was not a good sign. It was the last sign.');
          results.deaths.push(victim.name);
        } else {
          results.messages.push(victim.name + ' will be breathing through a wet cloth for days. If breathing at all.');
        }
        return results;
      }
    },

    'broken_bone': {
      name: 'Broken Bone',
      description: 'Wet flowstone. One wrong step. Gravity does the rest.',
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
        if (state.crewAssignment === 'guarding') {
          results.messages.push('Your guarding detail spots masked riders early and secures the camp. The Bald Knobbers move on.');
          return results;
        }
        results.messages.push('Flour-sack masks with cane-stalk horns. Hickory switches and revolvers. The Bald Knobbers have come calling.');
        // Steal cash and supplies
        var cashStolen = Math.min(state.cash, Math.floor(Math.random() * 50) + 20);
        if (state.equipment && state.equipment.huntingKnife) {
          cashStolen = Math.floor(cashStolen * 0.5);
          results.messages.push('Your hunting knife deters the worst of the theft.');
        }
        state.cash -= cashStolen;
        results.messages.push('They take $' + cashStolen.toFixed(2) + ' from the strongbox. "A toll," the leader says. "For using our roads."');
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
            results.messages.push(victim.name + ' caught a hickory switch across the jaw for looking at a Knobber wrong.');
          }
        }
        state.baldKnobberThreat = Math.min(10, state.baldKnobberThreat + 2);
        return results;
      }
    },

    'stagecoach_delay': {
      name: 'Stagecoach Delay',
      description: 'The Roark Mountain road has surrendered to mud and gravity.',
      probability: 0.05,
      cooldown: 5,
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        results.messages.push('The supply wagon is mired axle-deep on the Roark Mountain road. Nothing is getting through.');
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

    'stockpile_spoilage': {
      name: 'Stockpile Spoilage',
      description: 'Moisture and heat begin ruining surface-stored guano sacks.',
      probability: 0.04,
      cooldown: 4,
      condition: function(state) { return state.guanoStockpile > 0.2; },
      effect: function(state) {
        var results = { messages: [], deaths: [] };
        if (state.crewAssignment === 'guarding') {
          results.messages.push('The guarding crew keeps tarps tight and sacks dry. No spoilage today.');
          return results;
        }
        var lost = Math.min(state.guanoStockpile, 0.1 + Math.random() * 0.25);
        state.guanoStockpile = Math.max(0, state.guanoStockpile - lost);
        results.messages.push('Rain and mold ruin ' + lost.toFixed(2) + ' tons of stored guano.');
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
          'A traveler warns of Bald Knobber activity on Roark Mountain. "Travel by day," he says. "Or don\'t travel."',
          'A prospector passing through says the richest guano lies past the Mammoth Room, four hundred fifty feet down. His eyes say he has been there. His hands say he did not enjoy it.',
          'News from Springfield: bat guano is fetching seven hundred dollars a ton for fertilizer and gunpowder components. The number hangs in the air like a promise.',
          'An old Osage man passes through without stopping. He leaves tobacco at the cave entrance and speaks to no one. The cave entrance is quieter for a day afterward.',
          'A drummer from Kansas City mentions the Marble Cave Mining Company in Barton County is watching your operation. Competition or curiosity, he cannot say.',
          'A circuit preacher warns that the cave is ungodly. He has never been inside it. The men who have been inside say nothing.',
          'A stagecoach driver swears he saw lights moving inside the cave at midnight. No one was underground. No one will explain it.',
          'An old-timer says the Spaniards left more than ladders down there. He taps his nose and orders another whiskey.'
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

  // Choice-based encounters layered on top of passive events
  choiceEvents: [
    {
      id: 'unstable_passage',
      title: 'Unstable Passage',
      text: 'A cracked section groans ahead. Shore it or squeeze through?',
      options: [
        { key: '1', label: 'Shore it up (cost 2 timber, safe)', apply: function(state){ if(state.timber>=2){state.timber-=2; return ['You brace the ceiling with fresh timber and pass safely.'];} return ['Not enough timber. You squeeze through anyway.', 'Loose stone clips a shoulder.']; } },
        { key: '2', label: 'Squeeze through (risky)', apply: function(state){ var out=['You squeeze sideways through splintered rock.']; if(Math.random()<0.4){ var v=window.GameState.getLivingParty()[0]; if(v){window.HealthSystem.applyDamage(v,18); out.push(v.name+' is hurt by falling rubble.');}} else out.push('You clear it without incident.'); return out; } }
      ]
    },
    {
      id: 'rival_miners',
      title: 'Rival Miners',
      text: 'Another crew claims your vein.',
      options: [
        { key: '1', label: 'Share the vein (split yield)', apply: function(state){ state.dailyYieldMultiplier = 0.5; return ['You split the chamber and keep the peace.']; } },
        { key: '2', label: 'Stake your claim (possible confrontation)', apply: function(state){ var out=['You stand your ground.']; if(Math.random()<0.35){ var v=window.GameState.getLivingParty()[0]; if(v){window.HealthSystem.applyDamage(v,15); out.push(v.name+' takes a blow in the scuffle.');}} else { state.dailyYieldMultiplier = 1.25; out.push('The rivals back off; you keep the richer seam.'); } return out; } }
      ]
    },
    {
      id: 'injured_crew',
      title: 'Injured Crewman',
      text: 'A crewman twists hard on wet stone.',
      options: [
        { key: '1', label: 'Rest him (lose a worker for 2 days)', apply: function(state){ state.injuredCrewDays=(state.injuredCrewDays||0)+2; return ['You set a splint and lighten his load for two days.']; } },
        { key: '2', label: 'Push through (risk of death)', apply: function(state){ var out=['You keep the line moving.']; var v=window.GameState.getLivingParty()[0]; if(v&&Math.random()<0.15){v.alive=false; out.push(v.name+' collapses and does not rise.');} else if(v){window.HealthSystem.applyDamage(v,20); out.push(v.name+' soldiers on through pain.');} return out; } }
      ]
    },
    {
      id: 'strange_sounds',
      title: 'Strange Sounds Deeper',
      text: 'A hollow knocking echoes from a side throat.',
      options: [
        { key: '1', label: 'Investigate (uses a day, might find secret)', apply: function(state){ state.extraDayCost=true; if(window.CaveData){var c=window.CaveData.getChamber(state.currentChamber); if(c&&c.connectedTo){ for(var i=0;i<c.connectedTo.length;i++){ if(state.discoveredChambers.indexOf(c.connectedTo[i])===-1){state.discoveredChambers.push(c.connectedTo[i]); return ['You spend the day scouting and chart a hidden connection.'];}}}} return ['You lose a day chasing echoes and find nothing but stone.']; } },
        { key: '2', label: 'Ignore it', apply: function(){ return ['You keep to the known route and press on.']; } }
      ]
    },
    {
      id: 'supply_trader',
      title: 'Passing Trader',
      text: 'A mule train offers emergency supplies at steep markup.',
      options: [
        { key: '1', label: 'Buy emergency bundle ($8)', apply: function(state){ if(state.cash>=8){state.cash-=8; state.food+=12; state.lanternOil+=1; return ['You buy food and oil at a painful price.'];} return ['You cannot afford the trader\'s terms.']; } },
        { key: '2', label: 'Refuse', apply: function(){ return ['You save your cash and trust your stores.']; } }
      ]
    },
    {
      id: 'old_shaft',
      title: 'Old Shaft',
      text: 'A rotted ladder descends to an old pocket seam.',
      options: [
        { key: '1', label: 'Climb down carefully (risk/reward)', apply: function(state){ var out=['You test each rung and descend.']; if(Math.random()<0.25){ var v=window.GameState.getLivingParty()[0]; if(v){window.HealthSystem.applyDamage(v,16); out.push('A rung snaps and '+v.name+' is injured.');}} else { state.guanoStockpile += 0.25; out.push('You recover extra high-grade guano: +0.25 tons.'); } return out; } },
        { key: '2', label: 'Leave it', apply: function(){ return ['You leave the rotten shaft untouched.']; } }
      ]
    }
  ],

  maybeGetChoiceEncounter: function(state) {
    if (!state || Math.random() > 0.22) return null;
    return this.choiceEvents[Math.floor(Math.random() * this.choiceEvents.length)];
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
