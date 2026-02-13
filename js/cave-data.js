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
      description: 'The mining settlement of Marmaros, perched on Roark Mountain above the Devil\'s Den.',
      ambient: 'daylight'
    },
    zone1: {
      id: 'zone1',
      name: 'Cathedral Room',
      depthRange: [0, 230],
      description: 'A colossal bell-shaped chamber, the largest cave entrance room in the United States. 204 feet high, 225 feet wide, 411 feet long.',
      ambient: 'dim'
    },
    zone2: {
      id: 'zone2',
      name: 'Upper Passages',
      depthRange: [230, 350],
      description: 'Winding passages carved by ancient pressurized water, narrowing as they descend through Mississippian limestone strata.',
      ambient: 'dark'
    },
    zone3: {
      id: 'zone3',
      name: 'Middle Depths',
      depthRange: [350, 420],
      description: 'Deep chambers where the constant temperature holds at 58 degrees. The air grows thick with ammonia from centuries of bat guano.',
      ambient: 'pitch_black'
    },
    zone4: {
      id: 'zone4',
      name: 'Deep Chambers',
      depthRange: [420, 500],
      description: 'Enormous caverns rich with guano deposits. Home to the 40,000-strong gray bat colony.',
      ambient: 'pitch_black'
    },
    zone5: {
      id: 'zone5',
      name: 'The Abyss',
      depthRange: [500, 505],
      description: 'The deepest reaches, 505 feet below the surface. The Lost River\'s waterfall roars in the darkness.',
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
      description: 'A rough frontier settlement of 28 souls perched on Roark Mountain above Marvel Cave.',
      historicalFeature: 'Founded in 1884 by T. Hodges Jones and the Marble Cave Mining and Manufacturing Company. The town boasts a hotel, general store, school, pottery shop, and furniture factory. Named "Marmaros" -- Greek for marble -- after the 1869 expedition\'s mistaken identification of the cave ceiling as pure marble.',
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
      description: 'A gaping 94-foot sinkhole plunges into the largest cave entrance room in America.',
      historicalFeature: 'The Osage people called this entrance "Devil\'s Den" and marked surrounding trees with a sideways V as warning. Legend tells of a young brave who fell to his death here while chasing a bear. In 1541, Spanish conquistadors descended seeking gold and the Fountain of Youth, leaving behind notched pine ladders found three centuries later.',
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
      description: 'A towering limestone column stands guard at the heart of the Cathedral Room, 230 feet below the surface.',
      historicalFeature: 'This massive column formed when a stalactite and stalagmite fused together over millennia. Positioned directly before the narrow crevice leading to the Spring Room, guides playfully claimed The Sentinel was the sole structural pillar preventing the Cathedral Room\'s 204-foot dome from catastrophic collapse.',
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
      description: 'The vast floor of the Cathedral Room, atop the 124-foot debris pile called the Underground Mountain.',
      historicalFeature: 'The Cathedral Room could contain the entire Statue of Liberty with room to spare. In 1963, aeronaut Don Piccard set an underground altitude record by flying a hot air balloon inside this chamber. The 124-foot conical debris pile formed over thousands of years as soil, rock, and animals fell through the sinkhole. The Liberty Bell -- a 55-foot hollow stalagmite with a crack mimicking the real bell -- stands nearby.',
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
      description: 'A meandering, snake-like tunnel with deeply scalloped walls, carved by ancient pressurized water.',
      historicalFeature: 'The Serpentine Passage connects the Cathedral Room to the Egyptian Room. Its winding architecture preserves a fossilized record of the cave\'s ancient hydrology -- the deeply undercut limestone banks reveal the erosive power of water that bored through the bedrock millions of years ago.',
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
      description: 'A chamber with an extraordinarily flat, polished ceiling shaped like the sole of a giant inverted shoe.',
      historicalFeature: 'Named by Miriam and Genevieve Lynch for their fascination with Egyptology, this room is more accurately called the Shoe Room. Tour guides point out formations called King Tutankhamen\'s Sarcophagus, the Sphinx\'s Nose, and Cleopatra\'s Sandal. The polished limestone ceiling was mistaken for pure marble by the 1869 Henry T. Blow expedition, giving rise to the "Marble Cave" misnomer that defined the cave\'s entire industrial era.',
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
      description: 'A yawning 100-foot vertical shaft beneath the heel of the Shoe Room. The richest guano deposits crust the ledges.',
      historicalFeature: 'Early explorers believed this pit was literally bottomless -- rocks hurled into the abyss produced no sound upon impact. The scientific explanation: the floor lies buried beneath a thick, viscous mixture of soft cavern clay and nitrogen-dense bat guano that absorbs all kinetic energy. At least three miners vanished into this void during the 1880s. Their lanterns were found, but the men were not.',
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
      description: 'The passage constricts to 4 feet 7 inches high and extends 7 feet. You must turn sideways and exhale to squeeze through.',
      historicalFeature: 'Also known as Tall Man\'s Headache, this is the absolute narrowest bottleneck in the cave system. One tale tells of a 300-pound man who became wedged so tightly that his companions had to grease him with lard and haul him free with ropes. The passage requires significant physical stooping and maneuvering.',
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
      description: 'A narrow, oppressive passage where heavy iron oxide leaches through the limestone, staining the walls blood-red.',
      historicalFeature: 'The intense rust-colored streaks of iron oxide running down the rock walls appear remarkably like dried blood. During the early 20th century, theatrical cave guides exploited this mineral staining to spin sensationalized tales, falsely claiming the passage was a torture chamber used by Spanish conquistadors.',
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
      description: 'A hidden chamber coated in brilliant orange calcite, with concealed waterfalls cascading over terraced stone.',
      historicalFeature: 'Concealed behind The Sentinel through an easily overlooked crevice, this chamber\'s walls blaze with vibrant orange calcite. Several hidden subterranean waterfalls cascade continuously, creating an auditory illusion that mimics heavy rainfall. This concealed beauty and the ethereal glow of the orange stone directly fueled 16th-century folklore that Marvel Cave housed the mythical Fountain of Youth.',
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
      description: 'A massive, tiered flowstone formation rises like a throne from the cavern floor. Thick guano deposits surround it.',
      historicalFeature: 'Named after young Charles "Blondie" Smallwood, who became separated from his tour group in the early 20th century. After a frantic search, cave guides discovered the blonde-haired boy fast asleep, nestled safely within the undulating tiers of the flowstone. The formation earned its permanent name that day.',
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
      description: 'The ceiling transitions from smooth limestone to heavily porous dolomite, its undulating surface resembling dense storm clouds.',
      historicalFeature: 'Unlike the polished Mississippian limestone observed in adjacent chambers, the ceiling here transitions abruptly into highly porous dolomite. The heavily textured, pocketed surface closely resembles a dense, rolling canopy of low-hanging storm clouds. The richest guano accumulations in the upper cave system cake the floor.',
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
      description: 'An enormous unlit chamber alive with the shrieking of tens of thousands of gray bats.',
      historicalFeature: 'Left entirely un-modernized and devoid of permanent electric lighting, the Mammoth Room serves as the primary hibernaculum for the cave\'s 40,000-strong bat colony -- historically over 80,000. It was here in 1869 that the Blow expedition discovered the decaying "Spanish ladders" -- notched pine tree trunks left by 1541 conquistadors. The federally endangered gray bat (Myotis grisescens) roosts on these walls. Every dusk, the bats pour from the sinkhole in a tornadic vortex, consuming 24 million insects nightly.',
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
      description: 'A dark subterranean river surfaces briefly from the bedrock before plunging back into the stone.',
      historicalFeature: 'This underground river appears from nowhere, flows briefly through the open chamber, and vanishes back into the rock matrix. Its source and ultimate destination remain unmapped. During intense surface rainfall, the massive influx of water percolating through the karst system causes the river to rapidly and violently swell, filling passages in minutes.',
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
      description: 'A perfectly still underground lake, 34 feet deep, reflects your lantern like a dark mirror. The water is 56 degrees year-round.',
      historicalFeature: 'Named by William Henry Lynch after his daughter. Sub-aquatic surveys have mapped submerged passages plunging to 110 feet below the water\'s surface, though many lateral phreatic tunnels remain entirely unexplored due to severe silt-out conditions. Coins and artifacts dropped by early tourists still glint on visible ledges below the surface.',
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
      description: 'A second, deeper lake connected by a low, half-submerged passage requiring chest-deep wading.',
      historicalFeature: 'The more remote of Marvel Cave\'s two underground lakes, named after Lynch\'s second daughter. The passage to reach it requires wading through chest-deep 56-degree water. The chamber beyond is utterly silent except for the slow drip of water from the ceiling. Few miners ever ventured this far.',
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
      description: 'At 505 feet below the surface, a roaring 50-foot waterfall plunges into the deepest accessible chamber.',
      historicalFeature: 'The absolute lowest accessible point of Marvel Cave. The chamber is dominated by a cascading 50-foot waterfall fed entirely by the subterranean Lost River. During heavy surface rainfall, the influx of water frequently exceeds drainage capacity, causing this room to flood completely to its ceiling. Only the bravest or most desperate miners worked here, and the guano they hauled out was worth its weight in gold.',
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
      description: 'Spring rains swell the Lost River. Flash flooding risk is severe.'
    },
    summer: {
      floodingMod: 0.8,
      batActivity: 1.5,
      temperature: 'warm',
      description: 'The 40,000-strong bat colony is at peak activity. The ammonia is choking.'
    },
    fall: {
      floodingMod: 0.6,
      batActivity: 0.8,
      temperature: 'cool',
      description: 'Bats begin hibernation in the Mammoth Room. The cave grows quiet.'
    },
    winter: {
      floodingMod: 0.4,
      batActivity: 0.3,
      temperature: 'cold',
      description: 'Ice forms at the Devil\'s Den entrance. Deep inside, the temperature holds steady at 58 degrees.'
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
      description: 'Whale oil for your carbide lanterns. You burn through a gallon every two days underground.'
    },
    candles: {
      id: 'candles',
      name: 'Tallow Candles',
      unit: 'box of 12',
      basePrice: 0.40,
      weight: 2,
      description: 'Backup light source. Also serves as a crude air quality test -- if the flame dims, get out.'
    },
    rope: {
      id: 'rope',
      name: 'Hemp Rope',
      unit: '50-foot coil',
      basePrice: 2.00,
      weight: 15,
      description: 'Essential for descending steep passages and hauling guano bags.'
    },
    timber: {
      id: 'timber',
      name: 'Shoring Timber',
      unit: 'bundle',
      basePrice: 3.00,
      weight: 40,
      description: 'Used to brace tunnel ceilings and prevent cave-ins. Heavy but life-saving.'
    },
    food: {
      id: 'food',
      name: 'Food Rations',
      unit: 'week supply',
      basePrice: 2.50,
      weight: 20,
      description: 'Salt pork, hardtack, dried beans, and coffee. A miner works hard and eats harder.'
    },
    water: {
      id: 'water',
      name: 'Water Barrels',
      unit: 'barrel',
      basePrice: 0.50,
      weight: 60,
      description: 'Purified water from Roark Creek. The cave spring can supplement, but you cannot rely on it alone.'
    },
    blasting_powder: {
      id: 'blasting_powder',
      name: 'Blasting Powder',
      unit: 'keg',
      basePrice: 8.00,
      weight: 25,
      description: 'Black powder for opening new passages. Handle with extreme care.'
    },
    pickaxes: {
      id: 'pickaxes',
      name: 'Pickaxes',
      unit: 'each',
      basePrice: 3.50,
      weight: 10,
      description: 'A miner\'s primary tool. They dull quickly against the Ozark limestone.'
    },
    shovels: {
      id: 'shovels',
      name: 'Shovels',
      unit: 'each',
      basePrice: 2.00,
      weight: 8,
      description: 'For scooping guano into sacks. The work is as unpleasant as it sounds.'
    },
    guano_sacks: {
      id: 'guano_sacks',
      name: 'Guano Sacks',
      unit: 'bundle of 10',
      basePrice: 1.00,
      weight: 3,
      description: 'Burlap sacks reinforced with wax to hold bat guano. Each sack holds about 50 pounds.'
    },
    medicine: {
      id: 'medicine',
      name: 'Medicine Chest',
      unit: 'kit',
      basePrice: 5.00,
      weight: 5,
      description: 'Laudanum, quinine, bandages, and a bone saw. Frontier medicine at its finest.'
    },
    respirator: {
      id: 'respirator',
      name: 'Cloth Respirator',
      unit: 'each',
      basePrice: 1.00,
      weight: 0.5,
      description: 'A simple cloth mask to filter ammonia fumes. Better than nothing, but not by much.'
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
      description: 'Hired by T. Hodges Jones himself. Experienced in Missouri lead mining.'
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
      description: 'Sent by Barton County investors to assess the guano deposits.'
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
      description: 'Heard guano sells at $700 a ton and left the homestead.'
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
      description: 'Drifted in from the territories. Nothing to lose.'
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
