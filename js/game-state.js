// game-state.js - Core game state management
// The Marvel Cave Mining Company — Stone County, Missouri, 1884

window.GameState = {
  defaults: {
    foreman: { name: 'Expedition Lead', health: 0, alive: true },
    crew: [
      { name: 'Rope Hand', health: 0, alive: true, role: 'ropeman' },
      { name: 'Lamp Keeper', health: 0, alive: true, role: 'lampkeeper' }
    ],

    // Core resources for the shorter contract
    food: 0,
    lanternOil: 0,
    rope: 0,
    cash: 24,

    // Progress
    currentZone: 'surface',
    currentChamber: 'marmaros',
    guanoMined: 0,
    guanoStockpile: 0,
    guanoShipped: 0,

    // Time — 20-day fixed contract
    gameDuration: 20,
    date: null, // set in init
    startDate: null,
    daysUnderground: 0,
    daysOnSurface: 0,
    totalDays: 0,
    workPace: 'steady',
    rationLevel: 'full',
    foodShortageDays: 0,
    season: 'summer',
    profession: 'mine_foreman',
    scoreMultiplier: 1,

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
    companyName: 'Marvel Cave Mining Co.',
    companySalePrice: 700,
    contractShareRate: 0.10,
    companyGrossSales: 0,

    // Morale & Equipment
    morale: 50,
    equipment: {
      toolUpgrade: false,
      huntingKnife: false,
      walkingStick: false
    },
    taffy: 0,

    // Tavern micro-scenes (family-friendly)
    tavernSceneCooldowns: {},
    calmFocusDays: 0,
    airAwareDays: 0,
    mappedChambers: {},

    // Event tracking
    activeEvents: [],
    eventCooldowns: {},
    baldKnobberThreat: 0,

    // Game meta
    gameOver: false,
    gameOverReason: '',
    score: 0,
    isUnderground: false,
    restingDay: false,
    completedRun: false,
    finalSettlement: null,
    bestShipmentTons: 0,
    story: {
      cast: {
        jedStage: 0,
        shadStage: 0,
        juneStage: 0,
        lynchStage: 0,
        lynchKnown: false,
        shadProjectStage: 0,
        lastJuneCrewMention: '',
        lastJedConcernBeat: '',
        lastTownSpeakerByLocation: {}
      },
      fieldNotes: {
        readPages: {},
        lastPage: 0
      }
    },

    // Expanded gameplay systems
    visitedChambers: {},
    marketPrice: 700,
    marketHistory: [],
    miningChoice: 'main_vein',
    lastMilestoneShown: 0
  },

  state: null,

  init: function(options) {
    this.state = JSON.parse(JSON.stringify(this.defaults));
    this.deleteSave();

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
    this.state.discoveredChambers = ['marmaros'];

    if (options) {
      if (options.runId) this.state.runId = options.runId;
      if (options.foremanName) this.state.foreman.name = options.foremanName;
      if (options.profession) {
        this.state.profession = options.profession;
        // Look up profession data from CaveData
        var profData = window.CaveData && window.CaveData.PROFESSIONS[options.profession];
        if (profData) {
          this.state.cash = profData.startingMoney;
          this.state.scoreMultiplier = profData.scoreMultiplier;
          this.state.contractShareRate = 0.10;
          // Adjust crew count based on profession
          var targetCrew = profData.startingCrew;
          while (this.state.crew.length > targetCrew) {
            this.state.crew.pop();
          }
        }
      }
      if (options.crewNames && Array.isArray(options.crewNames)) {
        for (var i = 0; i < options.crewNames.length && i < this.state.crew.length; i++) {
          this.state.crew[i].name = options.crewNames[i];
        }
      }
      if (options.season) this.state.season = options.season;
    }

    if (window.Expedition && window.Expedition.ensureState) {
      window.Expedition.ensureState(this.state);
      window.Expedition.syncCrewRoster(this.state);
    }

    if (window.NarrativeCast && window.NarrativeCast.ensureState) {
      window.NarrativeCast.ensureState(this.state);
    }

    if (window.Characters && window.Characters.applyDraftToState) {
      window.Characters.applyDraftToState(this.state);
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

  roundQuarterDay: function(value) {
    return Math.round(value * 4) / 4;
  },

  getElapsedDays: function(state) {
    var s = state || this.state;
    return s && typeof s.totalDays === 'number' ? s.totalDays : 0;
  },

  getDisplayDayNumber: function(state) {
    var s = state || this.state;
    if (!s) return 1;
    var duration = s.gameDuration || 20;
    return Math.min(Math.floor(this.getElapsedDays(s)) + 1, duration);
  },

  advanceDate: function(dayAmount) {
    var s = this.state;
    dayAmount = typeof dayAmount === 'number' ? dayAmount : 1;
    if (dayAmount < 0) dayAmount = 0;

    s.date = new Date(s.date.getTime() + (86400000 * dayAmount));
    s.totalDays = this.roundQuarterDay((s.totalDays || 0) + dayAmount);
    if (s.isUnderground) s.daysUnderground = this.roundQuarterDay((s.daysUnderground || 0) + dayAmount);
    else s.daysOnSurface = this.roundQuarterDay((s.daysOnSurface || 0) + dayAmount);
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
    return false;
  },

  load: function() {
    return false;
  },

  hasSave: function() { return false; },
  deleteSave: function() {
    try {
      localStorage.removeItem('marvelCaveSave');
    } catch (e) {
      // ignore storage failure
    }
  }
};
