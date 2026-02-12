/*
 * cave-data.js
 * The Marvel Cave Mining Company
 * All zone definitions, chamber data, and the cave map graph.
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
      description: 'The small mining village above Marvel Cave.',
      ambient: 'daylight'
    },
    zone1: {
      id: 'zone1',
      name: 'Cathedral Room',
      depthRange: [0, 200],
      description: 'A vast entrance cavern with 70-foot ceilings.',
      ambient: 'dim'
    },
    zone2: {
      id: 'zone2',
      name: 'Upper Passages',
      depthRange: [200, 350],
      description: 'Narrow winding tunnels carved by ancient water.',
      ambient: 'dark'
    },
    zone3: {
      id: 'zone3',
      name: 'Middle Depths',
      depthRange: [350, 500],
      description: 'Deep chambers where daylight is a distant memory.',
      ambient: 'pitch_black'
    },
    zone4: {
      id: 'zone4',
      name: 'Deep Chambers',
      depthRange: [500, 600],
      description: 'Enormous caverns rich with guano and danger.',
      ambient: 'pitch_black'
    },
    zone5: {
      id: 'zone5',
      name: 'The Abyss',
      depthRange: [600, 800],
      description: 'The deepest reaches where few return unchanged.',
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
      description: 'A rough mining settlement perched on the ridge above Marvel Cave.',
      historicalFeature: 'Founded by William Henry Lynch in 1869, Marmaros served as the supply hub for all mining expeditions into the cave below.',
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
      name: 'Cathedral Room Entrance',
      zone: 'zone1',
      depth: 50,
      guanoYield: 'none',
      primaryHazard: 'fall',
      hazardModifiers: { fall: 0.05 },
      description: 'A gaping sinkhole opens into a cavern so vast its walls vanish in the lantern light.',
      historicalFeature: 'The Osage people called this entrance the "Devil\'s Den." The natural sinkhole drops 200 feet into the largest cave entrance room in America.',
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
      depth: 100,
      guanoYield: 'low',
      primaryHazard: 'rockfall',
      hazardModifiers: { rockfall: 0.03 },
      description: 'A towering stalagmite stands guard at the heart of the Cathedral Room.',
      historicalFeature: 'This massive stalagmite formation rises nearly 30 feet from the cavern floor. Miners named it The Sentinel, believing it watched over all who entered the depths.',
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
      depth: 200,
      guanoYield: 'medium',
      primaryHazard: 'bat_swarm',
      hazardModifiers: { bat_swarm: 0.10, bad_air: 0.05 },
      description: 'The vast floor of the Cathedral Room, 200 feet below the entrance. Guano cakes the ground.',
      historicalFeature: 'The Cathedral Room floor spans over two acres underground. The ceiling soars 70 feet above, and the walls echo every sound a hundred times over.',
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
      depth: 250,
      guanoYield: 'low',
      primaryHazard: 'cave_in',
      hazardModifiers: { cave_in: 0.08, stuck: 0.10 },
      description: 'A twisting, narrowing tunnel that snakes deeper into the earth.',
      historicalFeature: 'This winding passage was named by early explorers who likened its curves to a great serpent. The walls press close, and more than one miner has gotten wedged tight.',
      connectedTo: ['cathedral_floor', 'egyptian_room', 'gulf_of_doom'],
      isOptional: false,
      canMine: true,
      canRest: false,
      canResupply: false,
      discoveryPoints: 15
    },

    egyptian_room: {
      id: 'egyptian_room',
      name: 'Egyptian Room',
      zone: 'zone2',
      depth: 280,
      guanoYield: 'medium',
      primaryHazard: 'bad_air',
      hazardModifiers: { bad_air: 0.12, bat_swarm: 0.06 },
      description: 'Strange formations line the walls like the columns of an ancient temple.',
      historicalFeature: 'Victorian explorers thought these formations resembled Egyptian hieroglyphs and temple columns. The room was a popular stop on Lynch\'s early cave tours before mining operations began.',
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
      depth: 400,
      guanoYield: 'very_high',
      primaryHazard: 'fall',
      hazardModifiers: { fall: 0.20, cave_in: 0.10, bad_air: 0.08 },
      description: 'A yawning chasm plunges into absolute darkness. The richest guano deposits crust the ledges.',
      historicalFeature: 'Named for the bottomless appearance of its central pit. At least three miners vanished into this void during the 1880s. Their lanterns were found, but the men were not.',
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
      description: 'The passage narrows to barely eighteen inches. You must turn sideways and exhale to squeeze through.',
      historicalFeature: 'This infamous squeeze point stopped many an explorer. One tale tells of a 300-pound man who became wedged so tightly that his companions had to grease him with lard and pull him free with ropes.',
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
      depth: 380,
      guanoYield: 'medium',
      primaryHazard: 'bad_air',
      hazardModifiers: { bad_air: 0.15, flooding: 0.05, cave_in: 0.06 },
      description: 'A low-ceilinged chamber of oppressive darkness. The air is thick and foul.',
      historicalFeature: 'So named because miners felt imprisoned by its crushing low ceiling and stale air. Candles burned dim here, a warning sign of dangerous gases that many ignored at their peril.',
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
      depth: 420,
      guanoYield: 'none',
      primaryHazard: null,
      hazardModifiers: { flooding: 0.03 },
      description: 'A natural spring bubbles from the rock. The air is cool and fresh, a rare mercy in the depths.',
      historicalFeature: 'This underground spring provided the only reliable water source deep in the cave. Miners rested here to fill canteens and catch their breath. The water is cold, clear, and tastes faintly of minerals.',
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
      depth: 460,
      guanoYield: 'high',
      primaryHazard: 'bat_swarm',
      hazardModifiers: { bat_swarm: 0.15, bad_air: 0.10 },
      description: 'A massive flowstone formation rises like a throne. Thick guano deposits surround it.',
      historicalFeature: 'Named after a miner called "Blondie" Putnam who claimed this chamber as his personal mining territory. He sat atop the flowstone formation during lunch breaks, presiding over the darkness like a king.',
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
      depth: 530,
      guanoYield: 'very_high',
      primaryHazard: 'bad_air',
      hazardModifiers: { bad_air: 0.18, bat_swarm: 0.12, cave_in: 0.06 },
      description: 'Thick clouds of ammonia vapor hang in the air. The richest guano deposits in the upper cave.',
      historicalFeature: 'The ammonia fumes from decades of bat guano accumulation created a perpetual haze that miners called "the cloud." Many suffered lung ailments from working here without protection. It was the primary mining chamber.',
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
      depth: 560,
      guanoYield: 'high',
      primaryHazard: 'bat_swarm',
      hazardModifiers: { bat_swarm: 0.25, bad_air: 0.15, disease: 0.10 },
      description: 'An enormous chamber alive with the shrieking of eighty thousand bats.',
      historicalFeature: 'Home to one of the largest bat colonies in the Ozarks. Over 80,000 gray bats roost here seasonally. The sound is deafening, the smell overpowering. During evening flights, the bats pour from the cave entrance in a living river that takes twenty minutes to pass.',
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
      depth: 550,
      guanoYield: 'medium',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.20, fall: 0.08 },
      description: 'A dark underground river appears from the rock and vanishes just as mysteriously.',
      historicalFeature: 'This subterranean river surfaces briefly before plunging back into the rock. Its source and destination remain unknown. Miners learned to fear the sound of rising water, as flash floods could fill this passage in minutes.',
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
      depth: 600,
      guanoYield: 'low',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.15, hypothermia: 0.10 },
      description: 'A perfectly still underground lake reflects your lantern like a dark mirror.',
      historicalFeature: 'Named by Lynch after his daughter. The lake is 100 feet across and its depth has never been measured. The water is 56 degrees year-round. Coins and artifacts dropped by early tourists still glint on the visible ledges below the surface.',
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
      depth: 630,
      guanoYield: 'medium',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.18, hypothermia: 0.12, lost: 0.10 },
      description: 'A second, deeper lake connected by a low, half-submerged passage.',
      historicalFeature: 'The more remote of Marvel Cave\'s two underground lakes. Few miners ventured this far. The passage to reach it requires wading through chest-deep water, and the chamber beyond is utterly silent except for the slow drip of water from the ceiling.',
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
      depth: 700,
      guanoYield: 'very_high',
      primaryHazard: 'flooding',
      hazardModifiers: { flooding: 0.22, fall: 0.12, cave_in: 0.08, bad_air: 0.10, hypothermia: 0.08 },
      description: 'A 420-foot waterfall roars into the deepest chamber. The richest deposits lie at the bottom, soaked in mist.',
      historicalFeature: 'The deepest accessible point in Marvel Cave. A waterfall plunges over 400 feet into a mist-shrouded abyss. The roar of water is constant and disorienting. Only the bravest or most desperate miners worked here, and the guano they hauled out was worth its weight in gold.',
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
      description: 'Spring rains swell the underground rivers.'
    },
    summer: {
      floodingMod: 0.8,
      batActivity: 1.5,
      temperature: 'warm',
      description: 'The bats are most active. The cave air is thick.'
    },
    fall: {
      floodingMod: 0.6,
      batActivity: 0.8,
      temperature: 'cool',
      description: 'The bats begin to hibernate. The cave grows quiet.'
    },
    winter: {
      floodingMod: 0.4,
      batActivity: 0.3,
      temperature: 'cold',
      description: 'Ice forms at the entrance. Deep inside, the temperature holds steady at 60 degrees.'
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
      startingCrew: 6,
      miningBonus: 0,
      tradeBonus: 0.10,
      healthBonus: 0,
      scoreMultiplier: 1.0,
      description: 'Experienced and well-funded, but no score bonus.'
    },
    geologist: {
      id: 'geologist',
      name: 'Geologist',
      startingMoney: 90,
      startingCrew: 4,
      miningBonus: 0.15,
      tradeBonus: 0,
      healthBonus: 0,
      scoreMultiplier: 1.25,
      description: 'Knows the rock. Better yields, modest score bonus.'
    },
    farmer: {
      id: 'farmer',
      name: 'Farmer Turned Miner',
      startingMoney: 60,
      startingCrew: 5,
      miningBonus: 0,
      tradeBonus: 0,
      healthBonus: 0.10,
      scoreMultiplier: 1.5,
      description: 'Strong back, light purse. Higher score multiplier.'
    },
    drifter: {
      id: 'drifter',
      name: 'Drifter',
      startingMoney: 30,
      startingCrew: 3,
      miningBonus: 0,
      tradeBonus: 0,
      healthBonus: 0,
      scoreMultiplier: 2.0,
      description: 'Nothing to lose. Double score multiplier if you survive.'
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
