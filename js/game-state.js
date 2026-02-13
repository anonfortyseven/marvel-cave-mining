// game-state.js - Core game state management
// The Marvel Cave Mining Company - 1884

window.GameState = {
  defaults: {
    foreman: { name: 'Player', health: 0, alive: true },
    crew: [
      { name: 'Miner 1', health: 0, alive: true, role: 'ropeman' },
      { name: 'Miner 2', health: 0, alive: true, role: 'lampkeeper' },
      { name: 'Miner 3', health: 0, alive: true, role: 'blastman' },
      { name: 'Miner 4', health: 0, alive: true, role: 'cartdriver' }
    ],
    donkeys: { count: 2, health: 0 },

    // Resources (flat)
    food: 200,
    lanternOil: 10,
    rope: 200,
    timber: 50,
    dynamite: 20,
    cash: 800,

    // Progress
    currentZone: 'surface',
    currentChamber: 'marmaros',
    guanoMined: 0,
    guanoStockpile: 0,
    guanoShipped: 0,
    contractTarget: 12,

    // Time
    date: null, // set in init
    startDate: null,
    daysUnderground: 0,
    daysOnSurface: 0,
    totalDays: 0,
    workPace: 'steady',
    rationLevel: 'full',
    season: 'summer',
    profession: 'miner',
    scoreMultiplier: 2,

    // Discovery
    discoveredChambers: [],
    foundSpanishLadder: false,
    foundLostRiver: false,
    foundSpanishGold: false,
    foundBlondiesThrone: false,
    foundUndergroundLakes: false,
    foundOsageMarks: false,
    foundHaroldBellWright: false,
    foundCharlieSullivan: false,
    foundCivilWarCache: false,
    foundBlindCavefish: false,

    // Economy
    pendingPayments: [],
    totalRevenue: 0,
    totalExpenses: 0,
    contracts: [],
    inflationRate: 1.0,

    // Morale & Equipment
    morale: 50,
    equipment: {
      toolUpgrade: false,
      huntingKnife: false,
      walkingStick: false
    },
    taffy: 0,

    // Event tracking
    activeEvents: [],
    eventCooldowns: {},
    baldKnobberThreat: 0,

    // Game meta
    gameOver: false,
    gameOverReason: '',
    score: 0,
    isUnderground: false
  },

  state: null,

  init: function(options) {
    this.state = JSON.parse(JSON.stringify(this.defaults));

    // Default to June 1884
    var startMonth = 5; // June (0-indexed)
    if (options && options.season) {
      switch (options.season) {
        case 'spring': startMonth = 2; break;
        case 'summer': startMonth = 5; break;
        case 'fall': startMonth = 8; break;
        case 'winter': startMonth = 11; break;
      }
    }
    this.state.date = new Date(1884, startMonth, 1);
    this.state.startDate = new Date(1884, startMonth, 1);

    if (options) {
      if (options.foremanName) this.state.foreman.name = options.foremanName;
      if (options.profession) {
        this.state.profession = options.profession;
        // Set cash and contract based on profession
        switch (options.profession) {
          case 'investor':
            this.state.cash = 1600;
            this.state.contractTarget = 8;
            this.state.scoreMultiplier = 1;
            break;
          case 'miner':
            this.state.cash = 800;
            this.state.contractTarget = 12;
            this.state.scoreMultiplier = 2;
            break;
          case 'farmer':
            this.state.cash = 400;
            this.state.contractTarget = 15;
            this.state.scoreMultiplier = 3;
            break;
        }
      }
      if (options.crewNames && Array.isArray(options.crewNames)) {
        for (var i = 0; i < options.crewNames.length && i < this.state.crew.length; i++) {
          this.state.crew[i].name = options.crewNames[i];
        }
      }
      if (options.season) this.state.season = options.season;
    }

    return this.state;
  },

  getSeason: function(date) {
    var month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  },

  advanceDate: function() {
    var s = this.state;
    s.date = new Date(s.date.getTime() + 86400000);
    s.totalDays++;
    if (s.isUnderground) s.daysUnderground++;
    else s.daysOnSurface++;
    s.season = this.getSeason(s.date);
  },

  getLivingParty: function() {
    var party = [];
    if (this.state.foreman.alive) party.push(this.state.foreman);
    for (var i = 0; i < this.state.crew.length; i++) {
      if (this.state.crew[i].alive) party.push(this.state.crew[i]);
    }
    return party;
  },

  getLivingCrewCount: function() {
    var count = 0;
    for (var i = 0; i < this.state.crew.length; i++) {
      if (this.state.crew[i].alive) count++;
    }
    return count;
  },

  getPartySize: function() {
    return (this.state.foreman.alive ? 1 : 0) + this.getLivingCrewCount();
  },

  // Get depth of current chamber
  getCurrentDepth: function() {
    if (window.CaveData) {
      var chamber = window.CaveData.getChamber(this.state.currentChamber);
      if (chamber) return chamber.depth;
    }
    return 0;
  },

  // Get zone ID for current chamber
  getCurrentZoneId: function() {
    if (window.CaveData) {
      var chamber = window.CaveData.getChamber(this.state.currentChamber);
      if (chamber) return chamber.zone;
    }
    return this.state.currentZone;
  },

  save: function() {
    try {
      var saveData = JSON.parse(JSON.stringify(this.state));
      saveData.date = this.state.date.getTime();
      saveData.startDate = this.state.startDate.getTime();
      for (var i = 0; i < saveData.pendingPayments.length; i++) {
        if (saveData.pendingPayments[i].dueDate instanceof Date) {
          saveData.pendingPayments[i].dueDate = saveData.pendingPayments[i].dueDate.getTime();
        }
      }
      localStorage.setItem('marvelCaveSave', JSON.stringify(saveData));
      return true;
    } catch (e) { return false; }
  },

  load: function() {
    try {
      var raw = localStorage.getItem('marvelCaveSave');
      if (!raw) return false;
      var saveData = JSON.parse(raw);
      saveData.date = new Date(saveData.date);
      saveData.startDate = new Date(saveData.startDate);
      for (var i = 0; i < saveData.pendingPayments.length; i++) {
        if (typeof saveData.pendingPayments[i].dueDate === 'number') {
          saveData.pendingPayments[i].dueDate = new Date(saveData.pendingPayments[i].dueDate);
        }
      }
      // Migration: consolidate old equipment/items
      if (saveData.equipment) {
        if (saveData.equipment.pickaxeUpgrade || saveData.equipment.timberHandles) {
          saveData.equipment.toolUpgrade = true;
        }
        if (saveData.equipment.beltKnife && !saveData.equipment.huntingKnife) {
          saveData.equipment.huntingKnife = true;
        }
        delete saveData.equipment.pickaxeUpgrade;
        delete saveData.equipment.lanternRepair;
        delete saveData.equipment.beltKnife;
        delete saveData.equipment.timberHandles;
      }
      if (saveData.hardCandy !== undefined) delete saveData.hardCandy;
      if (saveData.whiskey !== undefined) delete saveData.whiskey;
      if (saveData.candles !== undefined) delete saveData.candles;
      if (saveData.clothing !== undefined) delete saveData.clothing;

      this.state = saveData;
      return true;
    } catch (e) { return false; }
  },

  hasSave: function() { return localStorage.getItem('marvelCaveSave') !== null; },
  deleteSave: function() { localStorage.removeItem('marvelCaveSave'); }
};
