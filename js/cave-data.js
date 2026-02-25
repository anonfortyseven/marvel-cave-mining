/*
 * cave-data.js
 * The Marvel Cave Mining Company
 * All zone definitions, chamber data, and the cave map graph.
 * Based on the real speleological record of Marvel Cave, Stone County, Missouri.
 * Globals: window.CaveData
 */
(function () {
  'use strict';

  // ─── Zone Definitions ────────────────────────────────────────────
  var ZONES = {
    surface: {
      id: 'surface',
      name: 'Surface - Marmaros',
      depthRange: [0, 0],
      description: 'Twenty-eight souls scratching out a living on Roark Mountain. Below them, the earth is hollow.',
      ambient: 'daylight'
    },
    zone1: {
      id: 'zone1',
      name: 'Cathedral Room',
      depthRange: [0, 230],
      description: 'A cathedral of stone larger than anything man ever built. Two hundred four feet from floor to dome. The darkness here has weight.',
      ambient: 'dim'
    },
    zone2: {
      id: 'zone2',
      name: 'Upper Passages',
      depthRange: [230, 350],
      description: 'Serpentine corridors bored through Mississippian limestone by waters older than memory. The walls narrow as you go.',
      ambient: 'dark'
    },
    zone3: {
      id: 'zone3',
      name: 'Middle Depths',
      depthRange: [350, 420],
      description: 'Fifty-eight degrees year-round, winter or summer. The ammonia hangs so thick your eyes water before your lamp does.',
      ambient: 'pitch_black'
    },
    zone4: {
      id: 'zone4',
      name: 'Deep Chambers',
      depthRange: [420, 500],
      description: 'Vast halls crusted with centuries of guano. Forty thousand gray bats roost in the dark overhead like a living ceiling.',
      ambient: 'pitch_black'
    },
    zone5: {
      id: 'zone5',
      name: 'The Abyss',
      depthRange: [500, 505],
      description: 'Five hundred five feet down. The Lost River thunders in the blackness. This is as deep as any man has gone and come back.',
      ambient: 'pitch_black'
    }
  };

  // ─── Chamber Definitions ─────────────────────────────────────────
  var CHAMBERS = {

    // === SURFACE ====================================================
    marmaros: {
      id: 'marmaros',
      name: 'Marmaros',
      zone: 'surface',
      depth: 0,
      guanoYield: 'none',
      primaryHazard: null,
      hazardModifiers: {},
      description: 'Mud streets, pine-board buildings, and the stink of guano drying in the sun. Twenty-eight people call this home. Most won\'t stay.',
      historicalFeature: 'T. Hodges Jones planted this settlement in 1884 atop the very mountain he meant to hollow out. Hotel, store, school, pottery works — a town built on bat shit and optimism. They named it Marmaros, Greek for marble, on account of a geologist\'s mistake fifteen years prior. The marble was limestone. The money was real.',
      connectedTo: ['cathedral_entrance'],
      isOptional: false,
      canMine: false,
      canRest: true,
      canResupply: true,
      discoveryPoints: 0
    },

    // === ZONE 1: Cathedral Room ====================================
    cathedral_entrance: {
      id: 'cathedral_entrance',
      name: 'The Devil\'s Den',
      zone: 'zone1',
      depth: 94,
      guanoYield: 'none',
      primaryHazard: 'fall',
      hazardModifiers: { fall: 0.05 },
      description: 'Ninety-four feet of nothing between the lip and the dark. Wind moans up from below like something breathing.',
      historicalFeature: 'The Osage carved warning marks into the oaks — a sideways V meaning do not enter. They say a young brave chased a bear over the edge and the earth swallowed them both. In 1541 the Spanish came looking for gold and eternal youth. They found neither but left their pine ladders three hundred feet down, where they rotted for three centuries undisturbed.',
      connectedTo: ['marmaros', 'the_sentinel'],
      isOptional: false,
      canMine: false,
      canRest: false,
      canResupply: false,
      discoveryPoints: 10
    },

    the_sentinel: {
      id: 'the_sentinel',
      name: 'The Sentinel',
      zone: 'zone1',
      depth: 230,
      guanoYield: 'low',
      primaryHazard: 'rockfall',
      hazardModifiers: { rockfall: 0.03 },
      description: 'A limestone pillar thick as a granary silo, standing alone in the void like it was put there on purpose. Maybe it was.',
      historicalFeature: 'Stalactite met stalagmite and fused across millennia into this single column. It guards the crevice to the Spring Room. Tour guides will later joke that if the Sentinel falls, the entire Cathedral dome comes down — two hundred four feet of mountain crashing into the void. Nobody laughs very hard.',
      connectedTo: ['cathedral_entrance', 'cathedral_floor'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 15
    },

    cathedral_floor: {
      id: 'cathedral_floor',
      name: 'Cathedral Room Floor',
      zone: 'zone1',
      depth: 235,
      guanoYield: 'medium',
      primaryHazard: 'bat_swarm',
      hazardModifiers: { bat_swarm: 0.10, bad_air: 0.05 },
      description: 'The Underground Mountain — a cone of debris a hundred and twenty-four feet high, built from everything that ever fell through the Den. Bones included.',
      historicalFeature: 'Millennia of soil, stone, and unlucky animals tumbled through the sinkhole to build this hill inside a hill. The Cathedral Room could swallow the Statue of Liberty whole. Nearby stands the Liberty Bell — a fifty-five-foot hollow stalagmite split by a crack that mirrors the real one in Philadelphia. Whether God has a sense of humor or the earth does, the effect is the same.',
      connectedTo: ['the_sentinel', 'serpentine_passage'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 20
    },

    // === ZONE 2: Upper Passages ====================================
    serpentine_passage: {
      id: 'serpentine_passage',
      name: 'Serpentine Passage',
      zone: 'zone2',
      depth: 260,
      guanoYield: 'low',
      primaryHazard: 'cave_in',
      hazardModifiers: { cave_in: 0.08, stuck: 0.10 },
      description: 'The passage twists like a wounded snake. Scalloped walls worn smooth by water that hasn\'t flowed here in a million years.',
      historicalFeature: 'Every curve in this tunnel is a fossil of the river that carved it — pressurized water boring through bedrock when this limestone sat at the bottom of a shallow sea. The undercut banks tell the story plain as writing if you know how to read stone. Most men don\'t. They just squeeze through and try not to think about the weight above.',
      connectedTo: ['cathedral_floor', 'egyptian_room', 'gulf_of_doom'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 15
    },

    egyptian_room: {
      id: 'egyptian_room',
      name: 'The Egyptian Room',
      zone: 'zone2',
      depth: 300,
      guanoYield: 'medium',
      primaryHazard: 'bad_air',
      hazardModifiers: { bad_air: 0.12, bat_swarm: 0.06 },
      description: 'Flat ceiling polished to a mirror sheen. Hold your lamp up and it looks like marble. It ain\'t. That mistake cost men their fortunes.',
      historicalFeature: 'The Lynch daughters — Miriam and Genevieve, half-mad with Egyptology — named every bump and shadow in here. King Tut\'s Sarcophagus. The Sphinx\'s Nose. Cleopatra\'s Sandal. Pretty names for limestone. It was this very ceiling that Henry T. Blow\'s men mistook for pure marble in \'69, christening the whole system Marble Cave and launching an industry built on a geologist\'s error.',
      connectedTo: ['serpentine_passage', 'fat_mans_misery'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 20
    },

    gulf_of_doom: {
      id: 'gulf_of_doom',
      name: 'Gulf of Doom',
      zone: 'zone2',
      depth: 350,
      guanoYield: 'very_high',
      primaryHazard: 'fall',
      hazardModifiers: { fall: 0.20, cave_in: 0.10, bad_air: 0.08 },
      description: 'A hundred feet of vertical nothing. Drop a rock and you won\'t hear it land. The guano on these ledges is worth dying for. Some did.',
      historicalFeature: 'They called it bottomless because thrown stones made no sound. The truth is worse — the floor is a soup of clay and ancient guano so thick it swallows everything without a trace. Three miners went into the Gulf in the \'80s. Their lamps were found on the ledges. The men were not. The Osage had a name for this place too but nobody alive remembers it.',
      connectedTo: ['serpentine_passage'],
      isOptional: true,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 50
    },

    fat_mans_misery: {
      id: 'fat_mans_misery',
      name: "Fat Man's Misery",
      zone: 'zone2',
      depth: 320,
      guanoYield: 'low',
      primaryHazard: 'stuck',
      hazardModifiers: { stuck: 0.15, cave_in: 0.05 },
      description: 'Four feet seven inches of clearance. Seven feet long. You turn sideways, exhale everything, and pray your shoulders clear.',
      historicalFeature: 'The tightest throat in the whole system. A three-hundred-pound man from Springfield got stuck here so tight they greased him with lard and hauled on his ankles with rope. He came free minus most of his shirt and all of his dignity. The guides call it Tall Man\'s Headache when ladies are present.',
      connectedTo: ['egyptian_room', 'the_dungeon'],
      isOptional: false,
      canMine: false,
      canRest: false,
      canResupply: false,
      discoveryPoints: 20
    },

    // === ZONE 3: Middle Depths =====================================
    the_dungeon: {
      id: 'the_dungeon',
      name: 'The Dungeon',
      zone: 'zone3',
      depth: 340,
      guanoYield: 'medium',
      primaryHazard: 'bad_air',
      hazardModifiers: { bad_air: 0.15, flooding: 0.05, cave_in: 0.06 },
      description: 'Iron oxide bleeds through the limestone in dark red streaks. The walls look like something was butchered here. The smell doesn\'t help.',
      historicalFeature: 'Rust-colored mineral stains run down the rock like dried blood — vivid enough that later guides will spin tales of Spanish torture chambers and Osage sacrifice. It\'s just iron leaching through the stone. But in the lamplight, alone, with the ammonia burning your eyes, knowing the geology doesn\'t make it any less unnerving.',
      connectedTo: ['fat_mans_misery', 'spring_room'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 20
    },

    spring_room: {
      id: 'spring_room',
      name: 'Spring Room',
      zone: 'zone3',
      depth: 360,
      guanoYield: 'none',
      primaryHazard: null,
      hazardModifiers: { flooding: 0.03 },
      description: 'Orange calcite blazes on every surface. Hidden waterfalls murmur behind the stone. It sounds like rain in a place that has never seen the sky.',
      historicalFeature: 'Tucked behind the Sentinel through a crevice most men walk past without seeing. The orange calcite catches lamplight and throws it back warm as sunset. The cascading water sounds like a summer storm. Small wonder the conquistadors believed they\'d found the Fountain of Youth — this room feels like it belongs to a different world than the one above.',
      connectedTo: ['the_dungeon', 'blondies_throne'],
      isOptional: false,
      canMine: false,
      canRest: true,
      canResupply: false,
      discoveryPoints: 25
    },

    blondies_throne: {
      id: 'blondies_throne',
      name: "Blondie's Throne",
      zone: 'zone3',
      depth: 400,
      guanoYield: 'high',
      primaryHazard: 'bat_swarm',
      hazardModifiers: { bat_swarm: 0.15, bad_air: 0.10 },
      description: 'A throne of flowstone rising in pale tiers from the guano-crusted floor. Something about its shape makes men lower their voices.',
      historicalFeature: 'Named for young Charles "Blondie" Smallwood, a tow-headed boy who wandered from his tour group and was found hours later, fast asleep in the flowstone\'s lap like a child in a chair. The guides named the formation on the spot. The Osage left offerings here — small stones arranged in patterns that don\'t occur in nature. Whether Blondie\'s throne or something older, the place has a pull to it.',
      connectedTo: ['spring_room', 'cloud_room'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 25
    },

    // === ZONE 4: Deep Chambers =====================================
    cloud_room: {
      id: 'cloud_room',
      name: 'Cloud Room',
      zone: 'zone4',
      depth: 420,
      guanoYield: 'very_high',
      primaryHazard: 'bad_air',
      hazardModifiers: { bad_air: 0.18, bat_swarm: 0.12, cave_in: 0.06 },
      description: 'The ceiling goes from smooth stone to pitted dolomite — pocked and rolling like thunderheads frozen in rock. Guano cakes the floor inches thick.',
      historicalFeature: 'The geology shifts here without warning. Polished limestone gives way to dolomite so porous it looks like petrified storm clouds pressing down on you. The floor holds the richest guano deposits in the upper system — centuries of accumulation from the colony above. Miners call this the money room. Work fast. The air is poison.',
      connectedTo: ['blondies_throne', 'mammoth_room', 'lost_river'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 30
    },

    mammoth_room: {
      id: 'mammoth_room',
      name: 'Mammoth Room',
      zone: 'zone4',
      depth: 450,
      guanoYield: 'high',
      primaryHazard: 'bat_swarm',
      hazardModifiers: { bat_swarm: 0.25, bad_air: 0.15, disease: 0.10 },
      description: 'The shrieking hits you before the smell does. Forty thousand gray bats hang from the ceiling like a living carpet. Their eyes catch the lamplight in pairs.',
      historicalFeature: 'No lamp has ever been permanently mounted here and none ever will. This is the bats\' cathedral. Eighty thousand once roosted on these walls — forty thousand remain, each one eating its weight in insects every night, pouring from the Den at dusk in a vortex visible for miles. It was here Blow\'s men found the Spanish ladders in \'69 — notched pine trunks three centuries old, left by conquistadors who climbed down and, by all evidence, climbed back up in a hurry.',
      connectedTo: ['cloud_room', 'waterfall_room'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 35
    },

    // === ZONE 4/5 optional: Subterranean Lakes ====================
    lost_river: {
      id: 'lost_river',
      name: 'Lost River',
      zone: 'zone4',
      depth: 460,
      guanoYield: 'medium',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.20, fall: 0.08 },
      description: 'Black water surfaces from the bedrock, flows thirty feet through open air, and plunges back into the stone. Where it comes from or goes, no man knows.',
      historicalFeature: 'The Lost River appears and vanishes like something that doesn\'t want to be followed. Its source is unmapped. Its destination is unmapped. When rain falls heavy on Roark Mountain the karst funnels it down and the river swells from a trickle to a torrent in minutes, filling passages to the ceiling. Men who\'ve seen it say the water rises faster than a man can run.',
      connectedTo: ['cloud_room', 'lake_genevieve'],
      isOptional: true,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 35
    },

    lake_genevieve: {
      id: 'lake_genevieve',
      name: 'Lake Genevieve',
      zone: 'zone5',
      depth: 480,
      guanoYield: 'low',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.15, hypothermia: 0.10 },
      description: 'Still as black glass. Thirty-four feet deep and fifty-six degrees cold. Your lamp reflects off the surface and you can\'t tell which way is up.',
      historicalFeature: 'Lynch named it for his eldest daughter. Divers will later map submerged passages plunging a hundred and ten feet below the waterline, with lateral tunnels branching into silt-choked darkness no one has entered. Coins and trinkets from early visitors glint on ledges below the surface like offerings to something patient.',
      connectedTo: ['lost_river', 'lake_miriam'],
      isOptional: true,
      canMine: false,
      canRest: true,
      canResupply: false,
      discoveryPoints: 40
    },

    lake_miriam: {
      id: 'lake_miriam',
      name: 'Lake Miriam',
      zone: 'zone5',
      depth: 500,
      guanoYield: 'medium',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.18, hypothermia: 0.12, lost: 0.10 },
      description: 'Chest-deep in fifty-six-degree water through a passage barely four feet high. Beyond it, silence so complete you can hear your own blood.',
      historicalFeature: 'Named for Lynch\'s younger daughter. Few miners had cause to come this far and fewer still had the nerve. The chamber is silent but for the metronomic drip of water from the ceiling — each drop striking the lake with a sound like a clock ticking in an empty house. The Osage spoke of a place beneath the earth where the living could hear the dead. This feels like it.',
      connectedTo: ['lake_genevieve'],
      isOptional: true,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 45
    },

    // === ZONE 5: The Abyss ========================================
    waterfall_room: {
      id: 'waterfall_room',
      name: 'Waterfall Room',
      zone: 'zone5',
      depth: 505,
      guanoYield: 'very_high',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.22, fall: 0.12, cave_in: 0.08, bad_air: 0.10, hypothermia: 0.08 },
      description: 'Five hundred and five feet down. A fifty-foot waterfall roars out of the dark and vanishes into a pool that has no visible bottom. This is the end of the known world.',
      historicalFeature: 'The deepest point any man has reached and returned from. The Lost River completes its journey here in a fifty-foot cascade that fills the chamber with mist and thunder. When the rains come heavy the water rises to the ceiling and this room becomes a tomb. The guano here is the richest in the system — worth a fortune to any man willing to work in a place the earth clearly never intended him to be. Beyond the falls, the river goes somewhere. Nobody has followed it. Yet.',
      connectedTo: ['mammoth_room'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 60
    }
  };

  // ─── Guano Yield Multipliers ─────────────────────────────────────
  var GUANO_YIELDS = {
    none: 0,
    low: 1,
    medium: 2,
    high: 4,
    very_high: 7
  };

  // ─── Hazard Types ────────────────────────────────────────────────
  var HAZARD_TYPES = {
    cave_in: {
      id: 'cave_in',
      name: 'Cave-In',
      damageRange: [15, 40],
      canKill: true,
      affectsEquipment: true,
      blocksPassage: true
    },
    bat_swarm: {
      id: 'bat_swarm',
      name: 'Bat Swarm',
      damageRange: [5, 20],
      canKill: false,
      affectsEquipment: false,
      blocksPassage: false
    },
    bad_air: {
      id: 'bad_air',
      name: 'Bad Air',
      damageRange: [8, 25],
      canKill: true,
      affectsEquipment: false,
      blocksPassage: false
    },
    flooding: {
      id: 'flooding',
      name: 'Flooding',
      damageRange: [20, 50],
      canKill: true,
      affectsEquipment: true,
      blocksPassage: true
    },
    fall: {
      id: 'fall',
      name: 'Fall',
      damageRange: [25, 60],
      canKill: true,
      affectsEquipment: true,
      blocksPassage: false
    },
    rockfall: {
      id: 'rockfall',
      name: 'Rockfall',
      damageRange: [10, 35],
      canKill: true,
      affectsEquipment: true,
      blocksPassage: false
    },
    stuck: {
      id: 'stuck',
      name: 'Stuck in Passage',
      damageRange: [3, 10],
      canKill: false,
      affectsEquipment: false,
      blocksPassage: true
    },
    disease: {
      id: 'disease',
      name: 'Disease',
      damageRange: [5, 15],
      canKill: true,
      affectsEquipment: false,
      blocksPassage: false
    },
    hypothermia: {
      id: 'hypothermia',
      name: 'Hypothermia',
      damageRange: [10, 30],
      canKill: true,
      affectsEquipment: false,
      blocksPassage: false
    },
    lost: {
      id: 'lost',
      name: 'Lost in Darkness',
      damageRange: [5, 15],
      canKill: true,
      affectsEquipment: false,
      blocksPassage: true
    }
  };

  // ─── Descent Routes (ordered paths through the cave) ─────────────
  var MAIN_ROUTE = [
    'marmaros',
    'cathedral_entrance',
    'the_sentinel',
    'cathedral_floor',
    'serpentine_passage',
    'egyptian_room',
    'fat_mans_misery',
    'the_dungeon',
    'spring_room',
    'blondies_throne',
    'cloud_room',
    'mammoth_room',
    'waterfall_room'
  ];

  var OPTIONAL_BRANCHES = {
    gulf_of_doom: {
      branchFrom: 'serpentine_passage',
      chambers: ['gulf_of_doom'],
      isDeadEnd: true,
      riskLevel: 'extreme'
    },
    underground_lakes: {
      branchFrom: 'cloud_room',
      chambers: ['lost_river', 'lake_genevieve', 'lake_miriam'],
      isDeadEnd: true,
      riskLevel: 'high'
    }
  };

  // ─── Season Modifiers (affect cave conditions) ───────────────────
  var SEASON_MODIFIERS = {
    spring: {
      floodingMod: 1.5,
      batActivity: 1.2,
      temperature: 'cool',
      description: 'The Ozarks thaw and every creek feeds the Lost River. The deep chambers flood without warning.'
    },
    summer: {
      floodingMod: 0.8,
      batActivity: 1.5,
      temperature: 'warm',
      description: 'Forty thousand bats at peak frenzy. The ammonia could strip paint. Bring a mask or lose your lungs.'
    },
    fall: {
      floodingMod: 0.6,
      batActivity: 0.8,
      temperature: 'cool',
      description: 'The colony settles into torpor. The cave goes quiet as a graveyard. Best working season there is.'
    },
    winter: {
      floodingMod: 0.4,
      batActivity: 0.3,
      temperature: 'cold',
      description: 'Ice seals the Den. Prices double in Marmaros. Inside the cave it\'s fifty-eight degrees same as always, but getting there might kill you.'
    }
  };

  // ─── Supply Items (available at Marmaros store) ──────────────────
  var STORE_ITEMS = {
    lantern_oil: {
      id: 'lantern_oil',
      name: 'Lantern Oil',
      unit: 'gallon',
      basePrice: 1.50,
      weight: 8,
      description: 'Whale oil. Burns clean if the wick is trimmed. A gallon lasts two days underground, less if the men get nervous and turn them up.'
    },
    candles: {
      id: 'candles',
      name: 'Tallow Candles',
      unit: 'box of 12',
      basePrice: 0.40,
      weight: 2,
      description: 'Tallow and wick. When the flame turns blue, the air is killing you. When it goes out, you\'re already dead.'
    },
    rope: {
      id: 'rope',
      name: 'Hemp Rope',
      unit: '50-foot coil',
      basePrice: 2.00,
      weight: 15,
      description: 'Manila hemp. Fifty feet per coil. Essential for every descent, every haul, every life saved or lost.'
    },
    timber: {
      id: 'timber',
      name: 'Shoring Timber',
      unit: 'bundle',
      basePrice: 3.00,
      weight: 40,
      description: 'Green pine, rough-cut. Brace it under a ceiling and it holds the mountain up. For a while.'
    },
    food: {
      id: 'food',
      name: 'Food Rations',
      unit: 'week supply',
      basePrice: 2.50,
      weight: 20,
      description: 'Salt pork, hardtack, parched corn, and coffee. A working man eats three pounds a day or he stops being a working man.'
    },
    water: {
      id: 'water',
      name: 'Water Barrels',
      unit: 'barrel',
      basePrice: 0.50,
      weight: 60,
      description: 'Roark Creek water, boiled and barreled. The cave springs run cold and clean but they run when they please, not when you\'re thirsty.'
    },
    blasting_powder: {
      id: 'blasting_powder',
      name: 'Blasting Powder',
      unit: 'keg',
      basePrice: 8.00,
      weight: 25,
      description: 'Black powder in a twenty-five-pound keg. One spark in the wrong place and they\'ll bury what\'s left of you in a tobacco tin.'
    },
    pickaxes: {
      id: 'pickaxes',
      name: 'Pickaxes',
      unit: 'each',
      basePrice: 3.50,
      weight: 10,
      description: 'Forged iron head, hickory handle. Dulls fast on Ozark limestone. Sharpen it nightly or you\'re swinging a club.'
    },
    shovels: {
      id: 'shovels',
      name: 'Shovels',
      unit: 'each',
      basePrice: 2.00,
      weight: 8,
      description: 'Square-point, ash handle. You\'ll be shoveling bat droppings twelve hours a day. Don\'t think about it.'
    },
    guano_sacks: {
      id: 'guano_sacks',
      name: 'Guano Sacks',
      unit: 'bundle of 10',
      basePrice: 1.00,
      weight: 3,
      description: 'Waxed burlap, double-stitched. Fifty pounds per sack. The wax keeps the nitrogen in and the stink mostly out.'
    },
    medicine: {
      id: 'medicine',
      name: 'Medicine Chest',
      unit: 'kit',
      basePrice: 5.00,
      weight: 5,
      description: 'Laudanum, quinine, linen bandages, and a bone saw. The laudanum does most of the doctorin\'.'
    },
    respirator: {
      id: 'respirator',
      name: 'Cloth Respirator',
      unit: 'each',
      basePrice: 1.00,
      weight: 0.5,
      description: 'Muslin soaked in vinegar. Cuts the ammonia enough to keep you conscious. Barely.'
    }
  };

  // ─── Profession Definitions ──────────────────────────────────────
  var PROFESSIONS = {
    mine_foreman: {
      id: 'mine_foreman',
      name: 'Mine Foreman',
      startingMoney: 120,
      startingCrew: 4,
      contractTarget: 4,
      miningBonus: 0,
      tradeBonus: 0.10,
      healthBonus: 0,
      scoreMultiplier: 1.0,
      description: 'Hired by Jones himself out of the Joplin lead fields. You know mines. You know men. You know what the dark does to both.'
    },
    geologist: {
      id: 'geologist',
      name: 'Geologist',
      startingMoney: 90,
      startingCrew: 3,
      contractTarget: 6,
      miningBonus: 0.15,
      tradeBonus: 0,
      healthBonus: 0,
      scoreMultiplier: 1.25,
      description: 'Sent by Barton County money men to assay the deposits. You read stone like scripture but the men don\'t trust a man who\'d rather study a rock than dig it.'
    },
    farmer: {
      id: 'farmer',
      name: 'Farmer Turned Miner',
      startingMoney: 60,
      startingCrew: 4,
      contractTarget: 8,
      miningBonus: 0,
      tradeBonus: 0,
      healthBonus: 0.10,
      scoreMultiplier: 1.5,
      description: 'The corn failed. The hogs died. Then you heard bat shit sells for $700 a ton and you sold the mule to buy a pick.'
    },
    drifter: {
      id: 'drifter',
      name: 'Drifter',
      startingMoney: 30,
      startingCrew: 2,
      contractTarget: 10,
      miningBonus: 0,
      tradeBonus: 0,
      healthBonus: 0,
      scoreMultiplier: 2.0,
      description: 'No history. No references. No money. You walked into Marmaros with thirty dollars and a willingness to go where other men won\'t.'
    }
  };

  // ─── Helper Functions ────────────────────────────────────────────
  function getChamber(id) {
    return CHAMBERS[id] || null;
  }

  function getZone(id) {
    return ZONES[id] || null;
  }

  function getConnections(chamberId) {
    var chamber = CHAMBERS[chamberId];
    if (!chamber) return [];
    return chamber.connectedTo.map(function (id) {
      return CHAMBERS[id];
    }).filter(Boolean);
  }

  function getChambersInZone(zoneId) {
    var results = [];
    for (var key in CHAMBERS) {
      if (CHAMBERS[key].zone === zoneId) {
        results.push(CHAMBERS[key]);
      }
    }
    return results;
  }

  function getMinableChambers() {
    var results = [];
    for (var key in CHAMBERS) {
      if (CHAMBERS[key].canMine) {
        results.push(CHAMBERS[key]);
      }
    }
    return results;
  }

  function getMainRouteIndex(chamberId) {
    return MAIN_ROUTE.indexOf(chamberId);
  }

  function getNextMainChamber(chamberId) {
    var idx = MAIN_ROUTE.indexOf(chamberId);
    if (idx === -1 || idx >= MAIN_ROUTE.length - 1) return null;
    return CHAMBERS[MAIN_ROUTE[idx + 1]];
  }

  function getPrevMainChamber(chamberId) {
    var idx = MAIN_ROUTE.indexOf(chamberId);
    if (idx <= 0) return null;
    return CHAMBERS[MAIN_ROUTE[idx - 1]];
  }

  function isOnMainRoute(chamberId) {
    return MAIN_ROUTE.indexOf(chamberId) !== -1;
  }

  function getGuanoMultiplier(yieldLevel) {
    return GUANO_YIELDS[yieldLevel] || 0;
  }

  // ─── Public API ──────────────────────────────────────────────────
  window.CaveData = {
    ZONES: ZONES,
    CHAMBERS: CHAMBERS,
    HAZARD_TYPES: HAZARD_TYPES,
    GUANO_YIELDS: GUANO_YIELDS,
    MAIN_ROUTE: MAIN_ROUTE,
    OPTIONAL_BRANCHES: OPTIONAL_BRANCHES,
    SEASON_MODIFIERS: SEASON_MODIFIERS,
    STORE_ITEMS: STORE_ITEMS,
    PROFESSIONS: PROFESSIONS,

    getChamber: getChamber,
    getZone: getZone,
    getConnections: getConnections,
    getChambersInZone: getChambersInZone,
    getMinableChambers: getMinableChambers,
    getMainRouteIndex: getMainRouteIndex,
    getNextMainChamber: getNextMainChamber,
    getPrevMainChamber: getPrevMainChamber,
    isOnMainRoute: isOnMainRoute,
    getGuanoMultiplier: getGuanoMultiplier
  };
})();
