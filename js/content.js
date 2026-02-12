/*
 * content.js
 * The Marvel Cave Mining Company
 * All game text: descriptions, event messages, dialogue, death messages,
 * educational content, and easter eggs.
 * Globals: window.Content
 */
(function () {
  'use strict';

  // ─── Educational Landmark Descriptions ───────────────────────────
  // Oregon Trail style "You have reached..." text for each chamber
  var LANDMARK_TEXT = {
    marmaros: [
      'You have arrived at Marmaros, a dusty mining settlement',
      'perched on the wooded ridgetop above Marvel Cave.',
      '',
      'A handful of rough-hewn buildings line the single road:',
      'a general store, a boardinghouse, and a shed that serves',
      'as both post office and assay station. Mule teams wait',
      'by the cave entrance, ready to haul guano to the rail',
      'depot at Branson.',
      '',
      'William Henry Lynch established this outpost in 1869',
      'after purchasing mining rights to the cave from the',
      'Osage Nation. The guano trade has drawn men from across',
      'the Ozarks seeking their fortune underground.'
    ],
    cathedral_entrance: [
      'You stand at the mouth of Marvel Cave.',
      '',
      'A natural sinkhole forty feet across yawns open in the',
      'forest floor. Wooden ladders and rope rigging descend',
      'into the darkness below. The air rising from the pit',
      'is cool and carries a faint mineral smell.',
      '',
      'The Osage people called this place the "Devil\'s Den"',
      'and avoided it. White settlers discovered it in the',
      '1840s, but systematic exploration did not begin until',
      'after the Civil War.',
      '',
      'The entrance drops 200 feet into the largest cave',
      'entrance room in America.'
    ],
    the_sentinel: [
      'Before you stands The Sentinel.',
      '',
      'A massive stalagmite nearly thirty feet tall rises from',
      'the cavern floor like a silent guardian. Mineral deposits',
      'have built this formation over tens of thousands of years,',
      'one slow drip at a time.',
      '',
      'Miners have come to regard The Sentinel with a',
      'superstitious reverence. Some tip their hats as they pass.',
      'Others leave small offerings of tobacco at its base,',
      'a habit borrowed from the Osage.',
      '',
      'The formation is composed of calcite deposited by',
      'mineral-rich water seeping through the limestone above.'
    ],
    cathedral_floor: [
      'You have descended to the floor of the Cathedral Room.',
      '',
      'This is the largest cave entrance room in the Americas,',
      'spanning over two acres. The ceiling soars seventy feet',
      'overhead, lost in shadow. Your lantern illuminates only',
      'a small circle of the vast space.',
      '',
      'Thick deposits of bat guano cover the floor in places,',
      'some several feet deep. The smell is powerful. This is',
      'what you came for -- bat guano, rich in nitrogen and',
      'phosphorus, valued as fertilizer across the South.',
      '',
      'The Cathedral Room alone contains enough guano to fill',
      'hundreds of wagons.'
    ],
    serpentine_passage: [
      'You enter the Serpentine Passage.',
      '',
      'The grand scale of the Cathedral Room gives way to a',
      'twisting, turning tunnel barely six feet high. The walls',
      'press close, slick with moisture. Your lantern throws',
      'wild shadows as you navigate the curves.',
      '',
      'This passage was carved by an ancient underground river',
      'that has long since found another path. The smooth,',
      'water-worn walls bear the marks of millennia.',
      '',
      'Miners must haul all their guano back through this',
      'passage by hand. It is slow, exhausting work.'
    ],
    egyptian_room: [
      'You have entered the Egyptian Room.',
      '',
      'Strange mineral formations line the walls, creating',
      'patterns that early explorers thought resembled Egyptian',
      'hieroglyphs and temple columns. The resemblance is',
      'uncanny in flickering lantern light.',
      '',
      'These formations are actually flowstone deposits --',
      'sheets of calcite laid down by water flowing over the',
      'cave walls. The "hieroglyphs" are natural patterns',
      'created by varying mineral content in the water.',
      '',
      'William Henry Lynch once charged tourists 50 cents',
      'to view this room before he turned to mining.'
    ],
    gulf_of_doom: [
      'You stand at the edge of the Gulf of Doom.',
      '',
      'A vast chasm opens before you, its bottom invisible',
      'in the absolute darkness below. When you drop a stone,',
      'you count to four before hearing it strike bottom.',
      '',
      'Rich guano deposits crust the ledges around the rim,',
      'deposited by bats who roost in the upper walls of the',
      'void. This is some of the richest guano in the cave,',
      'but reaching it means working on narrow ledges above',
      'a fatal drop.',
      '',
      'At least three miners have fallen to their deaths here.',
      'Their bodies were never recovered.'
    ],
    fat_mans_misery: [
      'You have reached Fat Man\'s Misery.',
      '',
      'The passage narrows dramatically to barely eighteen',
      'inches wide. You must turn sideways, exhale fully, and',
      'shuffle through inch by inch. Equipment must be passed',
      'ahead by hand.',
      '',
      'This infamous squeeze point has stopped many an explorer.',
      'One tale tells of a 300-pound man who became wedged so',
      'tightly that his companions greased him with lard and',
      'pulled him free with ropes.',
      '',
      'Beyond this point, there is no easy escape from the',
      'cave. Consider your supplies carefully before proceeding.'
    ],
    the_dungeon: [
      'You have entered The Dungeon.',
      '',
      'The ceiling drops to barely four feet. You must crouch',
      'or crawl. The air is thick, stale, and carries a sharp',
      'ammonia tang that burns your eyes and throat.',
      '',
      'Candles burn dim here, a warning of poor air quality.',
      'Experienced miners know that a guttering flame means',
      'dangerous levels of carbon dioxide or methane. If your',
      'candle goes out, you leave immediately.',
      '',
      'The ammonia comes from decomposing bat guano, which',
      'releases nitrogen compounds as it breaks down. Prolonged',
      'exposure causes "bat fever" -- a persistent lung illness.'
    ],
    spring_room: [
      'You have found the Spring Room.',
      '',
      'A natural spring bubbles from a crack in the limestone',
      'wall, collecting in a clear pool before disappearing',
      'into a crevice in the floor. The air here is noticeably',
      'fresher than the surrounding passages.',
      '',
      'This is the only reliable water source in the deep cave.',
      'Miners rest here to fill their canteens, wash their',
      'faces, and catch their breath. Some have carved their',
      'initials into the soft limestone walls.',
      '',
      'The water temperature is a constant 56 degrees',
      'Fahrenheit, year round. It tastes faintly of minerals',
      'but is clean and safe to drink.'
    ],
    blondies_throne: [
      'You have reached Blondie\'s Throne.',
      '',
      'A massive flowstone formation rises from the chamber',
      'floor, shaped roughly like a high-backed chair. Thick',
      'guano deposits surround it on all sides.',
      '',
      'This chamber is named after "Blondie" Putnam, a miner',
      'who claimed it as his personal territory in 1872. He',
      'sat atop the flowstone during lunch breaks, presiding',
      'over the darkness like a king on his throne.',
      '',
      'Blondie mined this chamber alone for three years before',
      'a lung ailment forced him to the surface for good. He',
      'never returned underground.'
    ],
    cloud_room: [
      'You have entered the Cloud Room.',
      '',
      'A thick, acrid haze hangs in the air -- ammonia vapor',
      'rising from the deepest guano deposits in the upper',
      'cave. Your eyes water and your lungs burn. Without',
      'a respirator, you can endure perhaps thirty minutes.',
      '',
      'This was the primary mining chamber, where the largest',
      'crews worked the richest deposits. The guano here is',
      'several feet deep in places, accumulated over centuries.',
      '',
      'Many miners who worked the Cloud Room developed chronic',
      'lung ailments. The connection between bat guano dust',
      'and the fungal disease histoplasmosis would not be',
      'understood for another sixty years.'
    ],
    mammoth_room: [
      'You have entered the Mammoth Room.',
      '',
      'The noise hits you first -- a deafening, high-pitched',
      'shrieking that fills the enormous chamber. Your lantern',
      'reveals a ceiling alive with movement: eighty thousand',
      'gray bats, packed shoulder to shoulder overhead.',
      '',
      'The gray bat (Myotis grisescens) is the dominant species',
      'here. They roost in vast colonies during the summer,',
      'emerging at dusk in a living river that can take twenty',
      'minutes to pass. Their droppings are the source of the',
      'guano that drives the mining economy.',
      '',
      'Working beneath a colony this size requires nerve and',
      'a strong stomach. The bats are not aggressive, but a',
      'startled swarm can disorient and injure a miner badly.'
    ],
    lost_river: [
      'You have discovered the Lost River.',
      '',
      'An underground river emerges from a crack in the rock',
      'wall, flows for perhaps fifty feet through the chamber,',
      'and vanishes into another fissure on the far side.',
      '',
      'No one knows where this river comes from or where it',
      'goes. Dye tests have been inconclusive. The water level',
      'rises unpredictably, sometimes flooding the passage in',
      'minutes with no warning.',
      '',
      'Miners have learned to watch for a subtle change in the',
      'sound of the water. A deeper, more resonant tone means',
      'a flood surge is coming from upstream.'
    ],
    lake_genevieve: [
      'You have reached Lake Genevieve.',
      '',
      'A perfectly still underground lake stretches before you,',
      'its surface reflecting your lantern like a dark mirror.',
      'The water is so clear and so still that it is difficult',
      'to tell where air ends and water begins.',
      '',
      'William Henry Lynch named this lake after his daughter.',
      'It is roughly 100 feet across, and its true depth has',
      'never been measured. The water maintains a constant',
      '56 degrees year-round.',
      '',
      'Coins and small artifacts dropped by early visitors',
      'still glint on the visible ledges below the surface,',
      'undisturbed by current or tide.'
    ],
    lake_miriam: [
      'You have discovered Lake Miriam.',
      '',
      'A second underground lake, deeper and more remote than',
      'Lake Genevieve. The passage to reach it requires wading',
      'through chest-deep water for thirty yards.',
      '',
      'The chamber is utterly silent except for the slow,',
      'rhythmic drip of water from the ceiling. The darkness',
      'beyond your lantern is absolute and total.',
      '',
      'Few miners ventured this far into the cave system.',
      'Those who did reported an eerie sense of peace, as',
      'though the weight of the earth above had squeezed',
      'all urgency from the world.'
    ],
    waterfall_room: [
      'You have reached the Waterfall Room.',
      '',
      'A waterfall plunges over 400 feet into a mist-shrouded',
      'abyss below you. The roar of falling water is constant',
      'and disorienting, filling the chamber with a deep',
      'vibration you feel in your chest.',
      '',
      'This is the deepest accessible point in Marvel Cave,',
      'and the guano deposits here are the richest of all.',
      'But everything is slick with mist, every surface',
      'treacherous, every foothold uncertain.',
      '',
      'Only the bravest or most desperate miners worked the',
      'Waterfall Room. The guano hauled from this depth was',
      'worth a premium, but the cost in broken bones and',
      'ruined health was immense.'
    ]
  };

  // ─── Random Event Messages ───────────────────────────────────────
  var EVENT_MESSAGES = {
    cave_in: [
      'A deep rumble shakes the passage. Rocks crash down from the ceiling!',
      'The timber supports groan and snap. The roof is coming down!',
      'A section of ceiling collapses without warning. Dust and debris fill the air.',
      'The ground shudders and a wall of rock blocks the passage behind you.',
      'Cracks spider across the ceiling. You barely dive clear as tons of rock come down.'
    ],
    bat_swarm: [
      'A shrieking cloud of bats erupts from the darkness overhead!',
      'Thousands of bats take flight at once. The air is thick with leathery wings.',
      'Your lantern startles a roosting colony. Bats swarm around you in a frenzy.',
      'A river of bats pours through the passage, battering you with their wings.',
      'The bats descend in a screeching, chaotic mass. You can barely see your hand.'
    ],
    bad_air: [
      'The candle flame gutters and dims. The air here is dangerously foul.',
      'A wave of dizziness hits you. The ammonia fumes are overwhelming.',
      'Your eyes burn and your lungs ache. The air quality is deteriorating fast.',
      'The flame on your lantern turns blue. Methane. You need to move. Now.',
      'A sickly-sweet smell fills the passage. Carbonic gas is pooling in this low spot.'
    ],
    flooding: [
      'A distant roar grows louder. Water is rising fast!',
      'The river surges without warning. Cold water rushes through the passage.',
      'Rainwater from the surface pours down through cracks in the ceiling.',
      'The underground stream has overflowed its banks. The path is submerged.',
      'Flash flood! Brown water churns through the chamber at alarming speed.'
    ],
    fall: [
      'The ground gives way beneath your feet!',
      'A loose rock slides and you tumble down a steep slope.',
      'Your foot finds empty air where solid ground should be.',
      'The ledge crumbles and you scramble for a handhold.',
      'You slip on wet flowstone and slide toward the edge.'
    ],
    rockfall: [
      'A boulder breaks free from the ceiling and crashes down nearby.',
      'Loose rocks tumble from the wall, striking your equipment.',
      'A shelf of limestone sheers off and shatters on the floor.',
      'Pebbles rain from above -- a warning of larger rocks to follow.',
      'A rockfall blocks half the passage. You\'ll need to clear a path.'
    ],
    stuck: [
      'The passage narrows. One of your crew gets wedged tight.',
      'The squeeze point is tighter than expected. Someone is stuck.',
      'A crew member\'s pack catches on a rock outcrop. They cannot move.',
      'The passage is too narrow for your equipment. Time is wasted finding a way through.'
    ],
    disease: [
      'A crew member develops a racking cough. Bat fever.',
      'One of your miners collapses with chills and fever. The cave sickness has taken hold.',
      'The dust from the guano has done its work. A miner cannot stop coughing.',
      'Histoplasmosis. The fungus in the guano has infected one of your crew.'
    ],
    hypothermia: [
      'The cold water has sapped the warmth from your bones.',
      'A crew member is shivering uncontrollably. They need warmth.',
      'After wading through the flooded passage, the cold sets in dangerously.',
      'Wet clothing and cave temperatures are a deadly combination.'
    ],
    lost: [
      'The passage branches in ways your map doesn\'t show. Which way?',
      'Your landmarks have vanished. Nothing looks familiar.',
      'A wrong turn leads to a dead end. You must backtrack.',
      'The darkness is total. Without a working lantern, you are blind and lost.'
    ],

    // === Positive / Neutral Events ===
    good_find: [
      'You discover a rich pocket of undisturbed guano. Excellent yield today.',
      'A side alcove holds guano deposits several feet deep. A lucky find.',
      'Your geologist spots an unusually rich formation. Mining goes well.',
      'The guano in this section is dry and easy to sack. Good working conditions.'
    ],
    rest_event: [
      'The crew rests by the underground spring. Spirits improve.',
      'A brief rest and a drink of cool spring water restore some strength.',
      'The crew takes a meal break. Salt pork and hardtack never tasted so good.',
      'An hour\'s rest in the Spring Room does wonders for morale.'
    ],
    equipment_break: [
      'A pickaxe handle snaps. You\'ll need to use a spare.',
      'Your best shovel bends against a rock. It\'s still usable, but barely.',
      'A rope frays and must be replaced from your supplies.',
      'The lantern glass cracks. You patch it, but it throws less light.'
    ],
    crew_morale: [
      'The crew sings a hymn as they work. The cave rings with harmony.',
      'Someone tells a joke. Laughter echoes through the passages.',
      'A crew member finds a beautiful crystal formation. Spirits lift.',
      'The foreman shares a flask of whiskey. Morale improves considerably.'
    ]
  };

  // ─── Death Messages ──────────────────────────────────────────────
  var DEATH_MESSAGES = {
    bat_fever: {
      title: 'Bat Fever',
      message: [
        'You have died of bat fever.',
        '',
        'The fungal spores in the guano dust have destroyed',
        'your lungs. What began as a persistent cough became',
        'a wasting illness no frontier medicine could cure.',
        '',
        'Histoplasmosis would not be identified as a disease',
        'until 1906. You never knew what killed you.'
      ]
    },
    cave_in: {
      title: 'Cave-In',
      message: [
        'You have been killed in a cave-in.',
        '',
        'Tons of Ozark limestone came down without warning,',
        'burying you and your crew beneath the rubble.',
        '',
        'Your body was never recovered. The passage was',
        'sealed permanently by the collapse.'
      ]
    },
    fall: {
      title: 'Fatal Fall',
      message: [
        'You have fallen to your death.',
        '',
        'A misstep on a slick ledge sent you tumbling',
        'into the darkness below. The fall was mercifully',
        'short, but the landing was not.',
        '',
        'The cave keeps what it takes.'
      ]
    },
    gulf_of_doom_fall: {
      title: 'Lost to the Gulf of Doom',
      message: [
        'You have fallen into the Gulf of Doom.',
        '',
        'The narrow ledge gave way and you plunged into',
        'the bottomless void. Your lantern flickered as',
        'you fell, growing smaller and smaller until the',
        'darkness swallowed it entirely.',
        '',
        'Your body was never found, like the three miners',
        'who came before you.'
      ]
    },
    drowning: {
      title: 'Drowned',
      message: [
        'You have drowned in the cave.',
        '',
        'The underground river rose faster than you could',
        'retreat. Cold, dark water filled the passage and',
        'there was nowhere to go.',
        '',
        'They found your lantern wedged between two rocks,',
        'still faintly warm.'
      ]
    },
    lost_in_darkness: {
      title: 'Lost in Darkness',
      message: [
        'You have been lost in the darkness.',
        '',
        'When the last lantern failed, absolute darkness',
        'closed in. You wandered the passages by touch,',
        'growing weaker, until you could walk no more.',
        '',
        'Your remains were found years later by a survey',
        'team, seated against a wall, hand still clutching',
        'an empty lantern.'
      ]
    },
    lung_sickness: {
      title: 'Lung Sickness',
      message: [
        'You have died of lung sickness.',
        '',
        'Months of breathing ammonia fumes and guano dust',
        'have filled your lungs with fluid. The coughing',
        'that started as an annoyance became agony, then',
        'silence.',
        '',
        'You are buried in the small cemetery above the',
        'cave. The headstone reads simply: "A Miner."'
      ]
    },
    snakebite: {
      title: 'Snakebite',
      message: [
        'You have died of snakebite.',
        '',
        'A timber rattlesnake, disturbed from its den near',
        'the cave entrance, struck without warning. The',
        'nearest doctor was two days\' ride away.',
        '',
        'The venom worked quickly. By nightfall, it was over.'
      ]
    },
    starvation: {
      title: 'Starvation',
      message: [
        'You have starved to death.',
        '',
        'Deep in the cave with no supplies and no way to',
        'forage, hunger became your constant companion,',
        'then your executioner.',
        '',
        'You should have turned back when the rations ran low.'
      ]
    },
    hypothermia: {
      title: 'Hypothermia',
      message: [
        'You have died of exposure.',
        '',
        'Soaked by the underground river and unable to',
        'build a fire in the depths, the cold crept in',
        'slowly. First the shivering stopped. Then the',
        'confusion began. Then sleep came, and did not leave.',
        '',
        'The cave is always 60 degrees. It does not sound',
        'cold until your clothes are wet and your fire is out.'
      ]
    },
    bad_air: {
      title: 'Suffocation',
      message: [
        'You have suffocated.',
        '',
        'The oxygen ran out in the sealed passage. There',
        'was no warning -- the candle simply dimmed and went',
        'out, and a terrible drowsiness overcame you.',
        '',
        'Carbonic gas is heavier than air. It pools in low',
        'places. By the time you noticed, it was too late.'
      ]
    }
  };

  // ─── Gravestone Template ─────────────────────────────────────────
  var GRAVESTONE = {
    template: [
      '       ___________',
      '      /           \\',
      '     /  R.I.P.     \\',
      '    |               |',
      '    |  {name}       |',
      '    |               |',
      '    |  {cause}      |',
      '    |               |',
      '    |  {date}       |',
      '    |               |',
      '    |  Depth: {depth}ft |',
      '    |_______________|',
      '    |               |',
      '   /|               |\\',
      '  / |_______________| \\',
      ' /                     \\'
    ],
    epitaphs: [
      'Gone to glory.',
      'Taken by the mountain.',
      'The cave keeps its own.',
      'Rest now, weary miner.',
      'Deeper than any man should go.',
      'The darkness was patient.',
      'He dug too deep.',
      'Remembered by none, mourned by few.',
      'Another soul the cave has claimed.',
      'The Ozarks giveth and the Ozarks taketh away.'
    ]
  };

  // ─── Bald Knobber Encounter Dialogue ─────────────────────────────
  var BALD_KNOBBER_DIALOGUE = {
    intro: [
      'The trail ahead is blocked by four men on horseback.',
      'They wear crude masks made from flour sacks, with',
      'horns fashioned from cane stalks. Each carries a',
      'hickory switch and a revolver.',
      '',
      '"Hold up there, miner," says the leader. "We\'re the',
      'law in these hills. You\'re carrying an awful lot of',
      'guano through Bald Knobber territory."'
    ],
    options: [
      {
        id: 'pay_toll',
        text: 'Pay their toll (lose 20% of your guano)',
        response: [
          '"Smart man," the leader says, taking his share.',
          '"You can pass. And remember -- we\'re watching',
          'these roads. You\'ll pay every time."',
          '',
          'The Bald Knobbers were a vigilante group active in',
          'Taney and Christian counties from 1883 to 1889.',
          'While they began as a law-and-order movement, many',
          'devolved into extortion and intimidation.'
        ],
        outcome: { guanoLoss: 0.20, healthLoss: 0, timeLoss: 0, reputationChange: -5 }
      },
      {
        id: 'negotiate',
        text: 'Try to negotiate a smaller toll',
        response: [
          'You stand your ground and bargain hard. The leader',
          'studies you for a long moment.',
          '',
          '"Ten percent. And you carry a message to Lynch for us.',
          'Tell him the Knobbers want a word about water rights."',
          '',
          'The Bald Knobbers\' disputes with local landowners',
          'often centered on resource access -- water, timber,',
          'and mineral rights in the Ozark hills.'
        ],
        outcome: { guanoLoss: 0.10, healthLoss: 0, timeLoss: 1, reputationChange: 0 }
      },
      {
        id: 'fight',
        text: 'Refuse and prepare to fight',
        response: [
          'You draw your knife. Your crew grabs their pickaxes.',
          '',
          'The fight is brief and ugly. Two of the Knobbers',
          'flee. The other two put up a struggle before',
          'retreating into the woods, bruised and cursing.',
          '',
          'You\'ve made enemies today. The Bald Knobbers have',
          'long memories and a talent for midnight visits.',
          '',
          'Several crew members are hurt in the scuffle.'
        ],
        outcome: { guanoLoss: 0, healthLoss: 15, timeLoss: 0, reputationChange: 10 }
      },
      {
        id: 'sneak',
        text: 'Try to sneak past using a back trail',
        response: [
          'You know these hills. There\'s an old deer trail',
          'that winds around the ridge. It adds hours to the',
          'journey and the footing is treacherous, but you',
          'might avoid the confrontation entirely.',
          '',
          'After a tense detour through heavy brush, you',
          'emerge on the road beyond the Knobbers\' position.',
          '',
          'You lose time, but keep your guano and your hide.'
        ],
        outcome: { guanoLoss: 0, healthLoss: 5, timeLoss: 2, reputationChange: 0 }
      }
    ],
    historical_note: 'The Bald Knobbers of Taney County, Missouri, were a vigilante group formed in 1883 by Captain Nat Kinney. Originally organized to combat lawlessness in the Ozarks after the Civil War, the group grew to over 1,000 members before splintering into factions. Some became little better than the criminals they opposed, engaging in arson, whippings, and murder. The group was finally broken up after the public hanging of two Knobbers in Ozark, Missouri, in 1889.'
  };

  // ─── Bat Swarm Decision Text ─────────────────────────────────────
  var BAT_SWARM_DECISIONS = {
    intro: [
      'A massive colony of bats erupts from the ceiling!',
      'Thousands of shrieking, leathery-winged creatures',
      'fill the passage. You can barely hear yourself think.',
      '',
      'What do you do?'
    ],
    options: [
      {
        id: 'hold_ground',
        text: 'Hold your ground and cover your head',
        response: 'You crouch low and shield your face. The swarm batters you with their wings but passes in a few terrifying minutes. Minor scratches and bruises.',
        healthCost: 5,
        timeCost: 0,
        lanternRisk: 0.1
      },
      {
        id: 'retreat',
        text: 'Retreat to the previous chamber',
        response: 'You back out quickly. The swarm pours past you in the passage. Safe, but you\'ve lost time and will need to wait for them to settle before proceeding.',
        healthCost: 0,
        timeCost: 2,
        lanternRisk: 0.05
      },
      {
        id: 'push_through',
        text: 'Push through the swarm',
        response: 'You lower your head and charge forward. Bats slam into you from every direction. Your lantern nearly goes out. You emerge on the other side, battered but through.',
        healthCost: 12,
        timeCost: 0,
        lanternRisk: 0.30
      },
      {
        id: 'use_fire',
        text: 'Wave your lantern to drive them away',
        response: 'The fire scatters some bats but enrages others. The swarm intensifies around you before finally dispersing. You\'ve used extra oil.',
        healthCost: 8,
        timeCost: 1,
        lanternRisk: 0.15,
        oilCost: 1
      }
    ]
  };

  // ─── Store / Shopkeeper Dialogue ─────────────────────────────────
  var SHOPKEEPER_DIALOGUE = {
    greeting: [
      '"Welcome to Marmaros General Supply. I\'m Herschel Barnes.',
      'You\'ll be needin\' provisions if you\'re headed below.',
      'I stock everything a miner needs, and I don\'t extend credit."'
    ],
    browse: [
      '"Take your time. Look around. But remember -- the',
      'cave don\'t care what you forgot to buy. Better to',
      'spend a dollar now than wish you had one later."'
    ],
    low_funds: [
      '"Hmm. You\'re a bit light in the purse, friend.',
      'I\'d recommend at least oil, food, and rope.',
      'Everything else is a luxury you might not need.',
      'Then again, you might."'
    ],
    farewell: [
      '"Good luck down there. And I mean that sincerely.',
      'I\'ve buried too many customers already this year."'
    ],
    buy_response: [
      '"Good choice. You\'ll be glad you have that."',
      '"Smart purchase. That\'ll serve you well below."',
      '"I\'ll have the mules load that up for you."',
      '"Solid gear. Take care of it and it\'ll take care of you."'
    ],
    haggle_response: [
      '"My prices are fair and final. This ain\'t a bazaar."',
      '"You\'re welcome to shop elsewhere. Oh wait -- there',
      'ain\'t an elsewhere. Price stands."',
      '"I\'ve got mouths to feed too, miner. Price is firm."'
    ],
    item_descriptions: {
      lantern_oil: '"Whale oil, best quality. Your lantern is your life down there."',
      candles: '"Tallow candles. Good for backup light. Also tells you if the air\'s gone bad -- when the flame shrinks, you leave."',
      rope: '"Hemp rope, fifty-foot coils. You\'ll want at least two."',
      timber: '"Shoring timber. Heavy as sin, but it\'s the difference between a mine and a grave."',
      food: '"Salt pork, hardtack, dried beans, and coffee. Enough to keep a man working for a week."',
      water: '"Clean water from Roark Creek. The spring down below helps, but don\'t count on it alone."',
      blasting_powder: '"Black powder. Handle it like your life depends on it, because it does."',
      pickaxes: '"Good steel heads. They\'ll dull on that limestone, so bring spares."',
      shovels: '"For scooping guano. Not glamorous work, but it pays."',
      guano_sacks: '"Waxed burlap. Holds fifty pounds of guano each. Bring plenty."',
      medicine: '"Laudanum, quinine, bandages, and a bone saw. I hope you won\'t need the saw."',
      respirator: '"Cloth mask for the fumes. Better than nothing, but not by much."'
    }
  };

  // ─── Season Descriptions ─────────────────────────────────────────
  var SEASON_TEXT = {
    spring: {
      title: 'Spring',
      description: [
        'Spring has come to the Ozarks. Dogwood blossoms line',
        'the ridges and the creeks run high with snowmelt.',
        '',
        'Rain is frequent. The underground rivers are swollen',
        'and flooding risk is at its peak. But the bats are',
        'returning from their winter roosts, and fresh guano',
        'deposits await below.'
      ],
      warning: 'Flooding risk is HIGH this season.'
    },
    summer: {
      title: 'Summer',
      description: [
        'Summer settles over the Ozarks like a wool blanket.',
        'The heat drives men underground, where the cave holds',
        'a constant 60 degrees.',
        '',
        'The bat colonies are at peak population. The guano',
        'deposits are the thickest of the year, but so are',
        'the ammonia fumes. Work crews must rotate frequently.'
      ],
      warning: 'Bat activity is HIGH. Bad air risk is elevated.'
    },
    fall: {
      title: 'Fall',
      description: [
        'The oaks and hickories blaze red and gold across the',
        'ridges. The air is crisp and dry.',
        '',
        'The bats are leaving for their winter hibernation sites.',
        'Mining conditions improve as the colonies thin. The dry',
        'weather reduces flooding risk. This is the best season',
        'for deep operations.'
      ],
      warning: 'Conditions are FAVORABLE. This is peak mining season.'
    },
    winter: {
      title: 'Winter',
      description: [
        'Ice glazes the cave entrance and snow blankets the',
        'hills. The road to Branson is often impassable.',
        '',
        'Deep inside, the cave temperature holds steady, but',
        'the entrance passages are frigid. Most bats have',
        'departed. Mining is difficult but not impossible.',
        'Getting guano to market is the real challenge.'
      ],
      warning: 'Transport difficulties. Hypothermia risk near the entrance.'
    }
  };

  // ─── Profession Descriptions ─────────────────────────────────────
  var PROFESSION_TEXT = {
    investor: {
      title: 'Investor',
      description: [
        'You are a man of means from Springfield, looking to',
        'turn a profit on the booming guano trade. You have',
        'capital to invest but no mining experience.',
        '',
        'You start with the most money ($1,600) and can hire',
        'well, but your lack of experience means a lower score',
        'multiplier (x1). This is business, not adventure.'
      ],
      starting_text: 'You arrive at Marmaros with a full purse and high expectations. Time to make money.'
    },
    miner: {
      title: 'Miner',
      description: [
        'You are an experienced miner with years of work',
        'in lead and zinc mines across the Ozarks. You know',
        'how to read the rock and keep men alive underground.',
        '',
        'You start with moderate funds ($800) and a solid crew.',
        'Your experience earns a fair score multiplier (x2).',
        'This is what you were born to do.'
      ],
      starting_text: 'You arrive at Marmaros with steady hands and a miner\'s eye. The cave awaits.'
    },
    farmer: {
      title: 'Farmer Turned Miner',
      description: [
        'The drought wiped out your crops. Mining bat guano',
        'isn\'t what you imagined for your life, but a man',
        'has to feed his family.',
        '',
        'You start with little money ($400) and no mining',
        'experience, but your grit earns the highest score',
        'multiplier (x3). Fortune favors the desperate.'
      ],
      starting_text: 'You arrive at Marmaros with callused hands and an empty wallet. It\'s this or lose the farm.'
    }
  };

  // ─── Final Decision Text (3 Endings) ─────────────────────────────
  var FINAL_DECISIONS = {
    intro: [
      'Your mining season is coming to an end. You\'ve hauled',
      '{guano_amount} pounds of guano to the surface and your',
      'crew is {crew_status}.',
      '',
      'You face a final decision.'
    ],
    options: [
      {
        id: 'sell_and_leave',
        title: 'Sell Your Guano and Leave',
        description: [
          'You can sell your guano at market price and head home.',
          'The money is modest but certain. You\'ll live to see',
          'another season.',
          '',
          'This is the safe choice.'
        ],
        scoreMultiplier: 1.0
      },
      {
        id: 'one_more_run',
        title: 'One More Run Into the Deep',
        description: [
          'The Waterfall Room still holds the richest deposits.',
          'One more trip could double your haul. But your crew',
          'is tired, your supplies are thin, and the cave has',
          'been waiting patiently for you to make a mistake.',
          '',
          'High risk. High reward.'
        ],
        scoreMultiplier: 1.5
      },
      {
        id: 'invest_in_cave',
        title: 'Invest in the Cave\'s Future',
        description: [
          'You\'ve seen what this cave could become. Not just a',
          'mine, but a wonder. You can invest your profits in',
          'improving the cave infrastructure -- better ladders,',
          'walkways, lighting -- turning Marvel Cave into a',
          'tourist attraction.',
          '',
          'This is what the Lynches eventually did. By 1894,',
          'Marvel Cave was drawing visitors from across the',
          'country. Today it sits at the heart of Silver Dollar',
          'City, one of Missouri\'s most popular attractions.',
          '',
          'Less immediate profit, but the highest score.'
        ],
        scoreMultiplier: 2.0
      }
    ]
  };

  // ─── Traveler News / Historical Flavor Text ──────────────────────
  var TRAVELER_NEWS = [
    'A traveler reports that General Custer has been defeated at Little Bighorn. The frontier is in turmoil.',
    'Word from St. Louis: the price of guano fertilizer has risen sharply. Good news for miners.',
    'A circuit preacher passed through Marmaros. He says the railroad will reach Branson within five years.',
    'Travelers report a cholera outbreak in Springfield. Best to avoid the city.',
    'A mule skinner says the road to Branson is washed out. Guano shipments will be delayed.',
    'News from the territorial capital: Missouri is debating new mining safety regulations.',
    'A drummer selling patent medicine claims his tonic cures bat fever. No one believes him.',
    'Word is that Nat Kinney and his Bald Knobbers are causing trouble again in Taney County.',
    'A geologist from the University says Marvel Cave may be the deepest in the Ozarks.',
    'Travelers report a bear was seen near the cave entrance. The mules are nervous.',
    'A newspaper from Kansas City reports that bat guano is being tested as a component in explosives.',
    'An old Osage man passed through. He warned against disturbing the spirits below the mountain.',
    'Silver has been discovered in a cave near Joplin. Half the miners in the county have gone to stake claims.',
    'A photographer from back East wants to take pictures inside the cave. He\'s offering to pay for a guide.',
    'The temperance movement has closed three saloons in Forsyth. Miners are not pleased.',
    'Word from Washington: President Hayes is sending surveyors to map the Ozark caves.',
    'A traveling show passed through with a trained bear and a woman who reads fortunes. She predicted rain.',
    'Two miners from the Granby lead mines arrived today. They say conditions here are worse.',
    'A letter from your family reports that crops are doing well this year. Good news from home.',
    'The stagecoach driver says he saw lights in the cave at night. The miners call him a fool.'
  ];

  // ─── Easter Egg Text ─────────────────────────────────────────────
  var EASTER_EGGS = {
    osage_v_marks: {
      trigger: 'cathedral_entrance',
      chance: 0.15,
      text: [
        'You notice strange V-shaped marks carved into the',
        'limestone near the cave entrance. They are old --',
        'very old. The edges have been softened by centuries',
        'of mineral deposits.',
        '',
        'These are Osage trail markers, carved long before',
        'European settlers arrived. The V-marks indicated',
        'a significant landmark or spiritual site.',
        '',
        'The Osage considered this cave sacred -- a doorway',
        'to the underworld. They left offerings but did not',
        'enter the deepest chambers.',
        '',
        'You have discovered the Osage V-marks. (+50 discovery points)'
      ],
      reward: { discoveryPoints: 50 }
    },
    spanish_gold: {
      trigger: 'gulf_of_doom',
      chance: 0.10,
      text: [
        'Wedged in a crevice near the Gulf of Doom, you find',
        'a tarnished Spanish coin -- a silver real, dated 1743.',
        '',
        'Local legend says that Spanish conquistadors explored',
        'these caves in the 1700s, searching for gold and',
        'silver. They found neither, but the tales persisted.',
        '',
        'William Henry Lynch himself spent years searching',
        'for "Spanish treasure" in the cave before turning',
        'to the more reliable guano trade.',
        '',
        'You have discovered the Spanish coin. (+75 discovery points)'
      ],
      reward: { discoveryPoints: 75 }
    },
    harold_bell_wright: {
      trigger: 'spring_room',
      chance: 0.12,
      text: [
        'Carved into the wall near the spring, you find a',
        'name and date: "H.B. Wright, 1903."',
        '',
        'Harold Bell Wright was a preacher and novelist who',
        'lived in the Ozarks and explored Marvel Cave. His',
        'bestselling novel "The Shepherd of the Hills" (1907)',
        'was inspired by the landscape and people of this',
        'region.',
        '',
        'The book would make the Ozarks famous and eventually',
        'draw tourists to Marvel Cave by the thousands.',
        '',
        'You have discovered Harold Bell Wright\'s signature. (+60 discovery points)'
      ],
      reward: { discoveryPoints: 60 }
    },
    charlie_sullivan: {
      trigger: 'waterfall_room',
      chance: 0.08,
      text: [
        'Near the base of the waterfall, you find a rusted',
        'tin box hidden in a rock niche. Inside is a leather',
        'journal, badly water-damaged but still partly legible.',
        '',
        'The journal belongs to one "Charlie Sullivan," a miner',
        'who worked the Waterfall Room alone in the winter of',
        '1878. His entries describe the isolation, the constant',
        'roar of water, and a growing conviction that something',
        'lived in the deepest pools.',
        '',
        'The last entry reads: "I have seen it. God forgive me,',
        'I have seen it in the water."',
        '',
        'Charlie Sullivan was never heard from again.',
        '',
        'You have discovered Charlie Sullivan\'s journal. (+100 discovery points)'
      ],
      reward: { discoveryPoints: 100 }
    },
    civil_war_cache: {
      trigger: 'the_dungeon',
      chance: 0.10,
      text: [
        'Behind a loose stone in The Dungeon, you discover',
        'a cache of Civil War-era supplies: Confederate',
        'cartridge boxes, a canteen stamped "C.S.A.," and',
        'a faded letter from a soldier to his wife.',
        '',
        'During the Civil War, both Union and Confederate',
        'forces used Ozark caves as hideouts and supply',
        'depots. Taney County saw bitter guerrilla warfare',
        'between 1861 and 1865.',
        '',
        'The letter is dated September 1863 and expresses',
        'hope that the war will end soon. It never reached',
        'its destination.',
        '',
        'You have discovered a Civil War cache. (+65 discovery points)'
      ],
      reward: { discoveryPoints: 65 }
    },
    blind_cave_fish: {
      trigger: 'lake_genevieve',
      chance: 0.20,
      text: [
        'In the clear water of Lake Genevieve, your lantern',
        'reveals small, pale fish drifting slowly near the',
        'bottom. They are completely white and eyeless.',
        '',
        'These are Ozark cavefish (Amblyopsis rosae), one of',
        'the rarest fish in North America. They evolved in',
        'total darkness, losing their eyes and pigmentation',
        'over thousands of generations.',
        '',
        'They navigate by sensing vibrations in the water.',
        'The species would not be formally described by',
        'science until 1898.',
        '',
        'You have discovered the blind cavefish. (+55 discovery points)'
      ],
      reward: { discoveryPoints: 55 }
    }
  };

  // ─── Status Screen Text ──────────────────────────────────────────
  var STATUS_TEXT = {
    health: {
      excellent: 'Your crew is in fine health.',
      good: 'Your crew is in fair condition.',
      fair: 'Some of your crew are ailing.',
      poor: 'Several crew members are seriously ill.',
      critical: 'Your crew is barely able to work. Many are sick or injured.',
      dying: 'Your crew is in desperate condition. Without rest or medicine, men will die.'
    },
    morale: {
      high: 'Morale is high. The crew works with purpose.',
      good: 'Morale is steady. No complaints.',
      fair: 'Morale is slipping. The men grumble.',
      low: 'Morale is low. The crew is restless and sullen.',
      critical: 'Morale has collapsed. Some talk of abandoning the operation.'
    },
    supplies: {
      well_stocked: 'Your supplies are plentiful.',
      adequate: 'You have adequate supplies for now.',
      low: 'Supplies are running low. You should resupply soon.',
      critical: 'Supplies are critically low. You must resupply immediately.',
      empty: 'You are out of essential supplies.'
    },
    pace: {
      careful: 'You are moving carefully, checking every handhold.',
      steady: 'You maintain a steady working pace.',
      aggressive: 'You are pushing the crew hard. Speed over safety.',
      reckless: 'You are mining recklessly. The crew is uneasy.'
    }
  };

  // ─── Tutorial / Help Text ────────────────────────────────────────
  var HELP_TEXT = {
    welcome: [
      'THE MARVEL CAVE MINING COMPANY',
      '==============================',
      '',
      'The year is 1884. You are a guano miner in the',
      'Ozark Mountains of southwest Missouri.',
      '',
      'Marvel Cave -- one of the largest caves in the',
      'region -- is rich with bat guano, a valuable',
      'fertilizer. Your job is to descend into the cave,',
      'mine guano, and haul it to the surface for sale.',
      '',
      'But the cave is dangerous. Cave-ins, flooding,',
      'bad air, bat swarms, and the ever-present risk of',
      'getting lost in the darkness will test your skill',
      'and your nerve.',
      '',
      'Manage your crew, supplies, and health carefully.',
      'The cave does not forgive mistakes.'
    ],
    controls: [
      'CONTROLS',
      '--------',
      'Use the number keys or click to select options.',
      'Press ENTER or SPACE to advance text.',
      '',
      'At each chamber, you can:',
      '  1. Mine guano (if deposits exist)',
      '  2. Rest (at certain locations)',
      '  3. Check supplies and crew status',
      '  4. Descend deeper into the cave',
      '  5. Ascend toward the surface',
      '  6. Explore optional side passages'
    ],
    tips: [
      'MINING TIPS',
      '-----------',
      '- Always carry extra lantern oil. Darkness kills.',
      '- Watch your candle flame. If it dims, the air is bad.',
      '- The Spring Room is the only safe rest point underground.',
      '- Shoring timber prevents cave-ins. Don\'t skip it.',
      '- Respirators reduce lung damage in the Cloud Room.',
      '- The Gulf of Doom has the richest guano but is deadly.',
      '- Listen for changes in water sounds. Floods come fast.',
      '- Fall is the best mining season. Spring is the worst.',
      '- A good crew is worth more than good equipment.'
    ]
  };

  // ─── Title Screen Text ───────────────────────────────────────────
  var TITLE_TEXT = {
    title: 'THE MARVEL CAVE MINING COMPANY',
    subtitle: 'An Ozark Adventure',
    year: '~ Missouri, 1884 ~',
    prompt: 'Press any key to begin',
    credits: [
      'Inspired by The Oregon Trail',
      'Based on the real history of Marvel Cave',
      'Stone County, Missouri'
    ]
  };

  // ─── Mining Result Text ──────────────────────────────────────────
  var MINING_TEXT = {
    success: [
      'Your crew works steadily, filling sack after sack with rich guano.',
      'The deposits here are thick and easy to harvest. A productive session.',
      'Hard work, foul air, but the guano sacks are heavy. A good haul.',
      'Your miners find a rich vein of guano. Sacks fill quickly.'
    ],
    poor: [
      'The deposits here are thin and scattered. Slim pickings.',
      'More rock than guano in this section. Disappointing.',
      'The guano is mixed with so much limestone debris that the yield is poor.',
      'Your crew works hard but has little to show for it.'
    ],
    exhausted: [
      'This chamber has been mined out. Nothing left worth harvesting.',
      'Previous miners have stripped this section clean.',
      'Only dust remains where guano once lay. Time to move on.'
    ],
    interrupted: [
      'Mining is interrupted by a disturbance in the cave.',
      'Your crew is forced to stop work and deal with a problem.',
      'An unexpected event halts mining operations.'
    ]
  };

  // ─── Miscellaneous / UI Text ─────────────────────────────────────
  var UI_TEXT = {
    confirm_descend: 'Descend deeper into the cave?',
    confirm_ascend: 'Begin the climb back toward the surface?',
    confirm_mine: 'Set up mining operations here?',
    confirm_rest: 'Rest here and tend to the crew?',
    confirm_quit: 'Abandon the mining operation and return to the surface?',
    no_oil: 'You are out of lantern oil. You must turn back or risk the darkness.',
    no_food: 'You are out of food. Your crew grows weak with hunger.',
    no_rope: 'You are out of rope. You cannot safely descend further.',
    crew_dead: 'Your last crew member has died. You are alone in the darkness.',
    game_over: 'Your mining operation has come to an end.',
    press_continue: 'Press any key to continue...',
    loading: 'Loading...',
    saving: 'Recording your progress...'
  };

  // ─── Scoring Text ────────────────────────────────────────────────
  var SCORING_TEXT = {
    categories: {
      guano_hauled: 'Guano Hauled to Surface',
      chambers_explored: 'Chambers Explored',
      discoveries: 'Historical Discoveries',
      crew_survived: 'Crew Members Survived',
      health_remaining: 'Health Remaining',
      profession_bonus: 'Profession Multiplier',
      ending_bonus: 'Ending Choice Bonus'
    },
    ranks: [
      { minScore: 0, title: 'Tenderfoot', description: 'You barely scratched the surface.' },
      { minScore: 200, title: 'Greenhorn', description: 'You survived, but just barely.' },
      { minScore: 500, title: 'Working Miner', description: 'A respectable effort underground.' },
      { minScore: 1000, title: 'Experienced Miner', description: 'You know your way in the dark.' },
      { minScore: 2000, title: 'Master Miner', description: 'The cave holds few secrets from you.' },
      { minScore: 3500, title: 'Cave Legend', description: 'Songs will be sung about your deeds.' },
      { minScore: 5000, title: 'King of the Mountain', description: 'You have conquered Marvel Cave itself. Blondie Putnam would be proud.' }
    ]
  };

  // ─── Helper Functions ────────────────────────────────────────────
  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getEventMessage(eventType) {
    var messages = EVENT_MESSAGES[eventType];
    if (!messages || messages.length === 0) return '';
    return getRandomItem(messages);
  }

  function getDeathMessage(causeId) {
    return DEATH_MESSAGES[causeId] || DEATH_MESSAGES.cave_in;
  }

  function getLandmarkText(chamberId) {
    var lines = LANDMARK_TEXT[chamberId];
    if (!lines) return ['You have entered an unexplored chamber.'];
    return lines;
  }

  function getRandomEpitaph() {
    return getRandomItem(GRAVESTONE.epitaphs);
  }

  function getRandomNews() {
    return getRandomItem(TRAVELER_NEWS);
  }

  function getShopkeeperLine(category) {
    var lines = SHOPKEEPER_DIALOGUE[category];
    if (!lines) return '';
    if (typeof lines === 'string') return lines;
    if (Array.isArray(lines)) return lines.join('\n');
    return '';
  }

  function getStatusText(category, level) {
    var cat = STATUS_TEXT[category];
    if (!cat) return '';
    return cat[level] || '';
  }

  function getMiningText(result) {
    var messages = MINING_TEXT[result];
    if (!messages) return '';
    return getRandomItem(messages);
  }

  function getEasterEgg(chamberId) {
    for (var key in EASTER_EGGS) {
      var egg = EASTER_EGGS[key];
      if (egg.trigger === chamberId && Math.random() < egg.chance) {
        return egg;
      }
    }
    return null;
  }

  function formatGravestone(name, cause, date, depth) {
    return GRAVESTONE.template.map(function (line) {
      return line
        .replace('{name}', name)
        .replace('{cause}', cause)
        .replace('{date}', date)
        .replace('{depth}', depth);
    });
  }

  // ─── Public API ──────────────────────────────────────────────────
  window.Content = {
    LANDMARK_TEXT: LANDMARK_TEXT,
    EVENT_MESSAGES: EVENT_MESSAGES,
    DEATH_MESSAGES: DEATH_MESSAGES,
    GRAVESTONE: GRAVESTONE,
    BALD_KNOBBER_DIALOGUE: BALD_KNOBBER_DIALOGUE,
    BAT_SWARM_DECISIONS: BAT_SWARM_DECISIONS,
    SHOPKEEPER_DIALOGUE: SHOPKEEPER_DIALOGUE,
    SEASON_TEXT: SEASON_TEXT,
    PROFESSION_TEXT: PROFESSION_TEXT,
    FINAL_DECISIONS: FINAL_DECISIONS,
    TRAVELER_NEWS: TRAVELER_NEWS,
    EASTER_EGGS: EASTER_EGGS,
    STATUS_TEXT: STATUS_TEXT,
    HELP_TEXT: HELP_TEXT,
    TITLE_TEXT: TITLE_TEXT,
    MINING_TEXT: MINING_TEXT,
    UI_TEXT: UI_TEXT,
    SCORING_TEXT: SCORING_TEXT,

    getRandomItem: getRandomItem,
    getEventMessage: getEventMessage,
    getDeathMessage: getDeathMessage,
    getLandmarkText: getLandmarkText,
    getRandomEpitaph: getRandomEpitaph,
    getRandomNews: getRandomNews,
    getShopkeeperLine: getShopkeeperLine,
    getStatusText: getStatusText,
    getMiningText: getMiningText,
    getEasterEgg: getEasterEgg,
    formatGravestone: formatGravestone
  };
})();
