(function () {
  'use strict';

  var LEGACY_KEY = 'marvelCaveLegacyRuns';

  var DOCTRINES = {
    steady_contract: {
      id: 'steady_contract',
      name: 'Steady',
      summary: 'Safest first run.',
      detail: 'Keep the crew fed, the lamps full, and the sacks moving.',
      pace: 'steady',
      rations: 'full',
      yieldMod: 1.0,
      dangerMod: 0.95,
      wonderMod: 1.0,
      priceMod: 1.0
    },
    crew_first: {
      id: 'crew_first',
      name: 'Careful',
      summary: 'Slow haul. Calm crew.',
      detail: 'Work carefully and keep everybody fit enough to climb back out.',
      pace: 'careful',
      rations: 'full',
      yieldMod: 0.86,
      dangerMod: 0.78,
      wonderMod: 0.95,
      priceMod: 1.0
    },
    profit_first: {
      id: 'profit_first',
      name: 'Hard Push',
      summary: 'Big haul. Big strain.',
      detail: 'Push the crew hard and pull as much money out of the cave as you can.',
      pace: 'grueling',
      rations: 'half',
      yieldMod: 1.24,
      dangerMod: 1.16,
      wonderMod: 0.82,
      priceMod: 1.08
    },
    deep_chase: {
      id: 'deep_chase',
      name: 'Deep Chase',
      summary: 'Best for deep rooms.',
      detail: 'Push farther into the cave for richer seams and stranger finds.',
      pace: 'steady',
      rations: 'full',
      yieldMod: 0.96,
      dangerMod: 1.06,
      wonderMod: 1.28,
      priceMod: 1.0
    }
  };

  var CHAMBER_PERSONAS = {
    cathedral_entrance: {
      title: 'Threshold',
      short: 'Cold air climbs out. The cave is inviting you down.',
      yieldMod: 0.65,
      air: 6,
      water: 4,
      bats: 10,
      stabilityDrain: 1,
      wonder: 10,
      tags: ['entry']
    },
    the_sentinel: {
      title: 'Watchpost',
      short: 'A disciplined room. Good place to gather yourself.',
      yieldMod: 0.9,
      air: 7,
      water: 5,
      bats: 14,
      stabilityDrain: 2,
      wonder: 14,
      tags: ['steady']
    },
    cathedral_floor: {
      title: 'Money Room',
      short: 'Wide, loud, profitable, and split by one merciful side fork.',
      yieldMod: 1.08,
      air: 10,
      water: 8,
      bats: 22,
      stabilityDrain: 3,
      wonder: 18,
      tags: ['bat_heavy', 'rich']
    },
    serpentine_passage: {
      title: 'Choke Point',
      short: 'Every load out has to win a fight with the passage.',
      yieldMod: 0.92,
      air: 11,
      water: 9,
      bats: 10,
      stabilityDrain: 4,
      wonder: 8,
      tags: ['tight']
    },
    egyptian_room: {
      title: 'False Majesty',
      short: 'Grand shapes, tricky footing, and men who stare too long.',
      yieldMod: 1.02,
      air: 16,
      water: 10,
      bats: 18,
      stabilityDrain: 3,
      wonder: 22,
      tags: ['wonder']
    },
    gulf_of_doom: {
      title: 'Devil\'s Bargain',
      short: 'The richest ledges often hang over the worst fall.',
      yieldMod: 1.22,
      air: 18,
      water: 16,
      bats: 20,
      stabilityDrain: 7,
      wonder: 18,
      tags: ['risk', 'rich']
    },
    the_dungeon: {
      title: 'Punisher',
      short: 'The room that turns fatigue into mistakes.',
      yieldMod: 1.05,
      air: 22,
      water: 18,
      bats: 12,
      stabilityDrain: 5,
      wonder: 10,
      tags: ['cruel']
    },
    spring_room: {
      title: 'Sanctuary',
      short: 'A hidden side room where the cave remembers mercy.',
      yieldMod: 0.75,
      air: 8,
      water: 18,
      bats: 6,
      stabilityDrain: 1,
      wonder: 28,
      tags: ['sanctuary', 'wonder']
    },
    blondies_throne: {
      title: 'Pilgrimage',
      short: 'Even hard men lower their voices here.',
      yieldMod: 1.0,
      air: 16,
      water: 10,
      bats: 10,
      stabilityDrain: 2,
      wonder: 30,
      tags: ['wonder']
    },
    cloud_room: {
      title: 'Gold Rush',
      short: 'Best upper-cave haul, worst upper-cave air.',
      yieldMod: 1.28,
      air: 26,
      water: 12,
      bats: 30,
      stabilityDrain: 4,
      wonder: 18,
      tags: ['rich', 'bat_heavy']
    },
    mammoth_room: {
      title: 'Bat Empire',
      short: 'The ceiling owns the room. You are tolerated inside it.',
      yieldMod: 1.15,
      air: 24,
      water: 12,
      bats: 34,
      stabilityDrain: 4,
      wonder: 24,
      tags: ['bat_heavy', 'wonder']
    },
    lost_river: {
      title: 'Flood Gate',
      short: 'The main haul now runs beside water that can erase the route.',
      yieldMod: 1.08,
      air: 18,
      water: 30,
      bats: 12,
      stabilityDrain: 5,
      wonder: 26,
      tags: ['water', 'wonder']
    },
    lake_genevieve: {
      title: 'Still Nerve',
      short: 'Quiet enough to hear fear think.',
      yieldMod: 0.88,
      air: 14,
      water: 22,
      bats: 8,
      stabilityDrain: 2,
      wonder: 32,
      tags: ['water', 'wonder']
    },
    lake_miriam: {
      title: 'Deep Quiet',
      short: 'The cave stops talking and that is somehow worse.',
      yieldMod: 0.9,
      air: 16,
      water: 28,
      bats: 8,
      stabilityDrain: 3,
      wonder: 34,
      tags: ['water', 'wonder']
    },
    waterfall_room: {
      title: 'Crown Chamber',
      short: 'Thunder, mist, and the kind of haul legends are built on.',
      yieldMod: 1.36,
      air: 22,
      water: 34,
      bats: 18,
      stabilityDrain: 6,
      wonder: 38,
      tags: ['water', 'rich', 'wonder']
    }
  };

  var TRAITS_BY_ROLE = {
    foreman: [
      { id: 'stone_reader', name: 'Stone Reader', note: 'Finds the richer face in ugly ground.' },
      { id: 'iron_nerve', name: 'Iron Nerve', note: 'Settles the line when danger spikes.' },
      { id: 'ledger_eye', name: 'Ledger Eye', note: 'Turns haul into cleaner profit.' },
      { id: 'camp_preacher', name: 'Camp Preacher', note: 'Keeps bitter days from poisoning the crew.' }
    ],
    ropeman: [
      { id: 'sure_footed', name: 'Sure-Footed', note: 'Slides less, catches more.' },
      { id: 'old_hand', name: 'Old Hand', note: 'Never wastes a climb.' },
      { id: 'load_bearer', name: 'Load Bearer', note: 'Makes the line feel lighter.' },
      { id: 'grim_joker', name: 'Grim Joker', note: 'Laughs at exactly the right time.' }
    ],
    lampkeeper: [
      { id: 'cold_flame', name: 'Cold Flame', note: 'Coaxes extra life from every lamp.' },
      { id: 'air_nose', name: 'Air Nose', note: 'Feels bad air before the flame tells on it.' },
      { id: 'night_singer', name: 'Night Singer', note: 'Steadies camp with low songs in the dark.' },
      { id: 'quiet_hands', name: 'Quiet Hands', note: 'Keeps panic from spilling the oil.' }
    ]
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getLegacyRuns() {
    try {
      var raw = localStorage.getItem(LEGACY_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveLegacyRuns(runs) {
    try {
      localStorage.setItem(LEGACY_KEY, JSON.stringify(runs.slice(0, 6)));
    } catch (e) {
      // ignore storage failure
    }
  }

  function getMemberId(member, fallback) {
    if (!member) return fallback || 'unknown';
    if (member.expeditionId) return member.expeditionId;
    if (fallback) {
      member.expeditionId = fallback;
      return fallback;
    }
    return member.role || 'crew';
  }

  function avgPressure(state) {
    ensureState(state);
    var ids = Object.keys(state.expedition.crew || {});
    if (!ids.length) return 0;
    var total = 0;
    for (var i = 0; i < ids.length; i++) {
      total += state.expedition.crew[ids[i]].pressure || 0;
    }
    return total / ids.length;
  }

  function avgBond(state) {
    ensureState(state);
    var ids = Object.keys(state.expedition.crew || {});
    if (!ids.length) return 50;
    var total = 0;
    for (var i = 0; i < ids.length; i++) {
      total += state.expedition.crew[ids[i]].bond || 50;
    }
    return total / ids.length;
  }

  function countAlive(state) {
    var count = 0;
    if (state.foreman && state.foreman.alive) count++;
    for (var i = 0; i < (state.crew || []).length; i++) {
      if (state.crew[i].alive) count++;
    }
    return count;
  }

  function getDoctrine(id) {
    return DOCTRINES[id] || DOCTRINES.steady_contract;
  }

  function getChamberPersona(chamberId) {
    return CHAMBER_PERSONAS[chamberId] || {
      title: 'Unknown Stone',
      short: 'Every chamber writes its own rules.',
      yieldMod: 1.0,
      air: 14,
      water: 12,
      bats: 12,
      stabilityDrain: 3,
      wonder: 14,
      tags: []
    };
  }

  function assignTrait(role) {
    var pool = TRAITS_BY_ROLE[role] || [];
    if (!pool.length) return { id: 'steady_soul', name: 'Steady Soul', note: 'Plain, reliable work.' };
    return pick(pool);
  }

  function syncCrewRoster(state) {
    if (!state || !state.expedition) return;
    var roster = [
      { id: 'foreman', member: state.foreman, role: 'foreman' },
      { id: 'ropeman', member: state.crew[0], role: 'ropeman' },
      { id: 'lampkeeper', member: state.crew[1], role: 'lampkeeper' }
    ];

    for (var i = 0; i < roster.length; i++) {
      var slot = roster[i];
      if (!slot.member) continue;
      slot.member.expeditionId = slot.id;
      if (!state.expedition.crew[slot.id]) {
        var trait = assignTrait(slot.role);
        state.expedition.crew[slot.id] = {
          role: slot.role,
          traitId: trait.id,
          traitName: trait.name,
          traitNote: trait.note,
          pressure: roleBasePressure(slot.role),
          bond: 58
        };
      }
    }
  }

  function roleBasePressure(role) {
    if (role === 'foreman') return 14;
    if (role === 'ropeman') return 18;
    if (role === 'lampkeeper') return 16;
    return 15;
  }

  function ensureState(state) {
    if (!state) return;
    if (!state.expedition) state.expedition = {};
    var ex = state.expedition;
    if (!ex.doctrine) ex.doctrine = 'steady_contract';
    if (!ex.cavePulse) {
      ex.cavePulse = { air: 22, water: 18, bats: 24, stability: 82, wonder: 28 };
    }
    if (!ex.director) {
      ex.director = { beat: 'calm', tension: 22, lastSetPieceDay: -99, lastPayoffDay: -99, lastDisasterDay: -99 };
    }
    if (!ex.chambers) ex.chambers = {};
    if (!ex.crew) ex.crew = {};
    if (!ex.moments) {
      ex.moments = {
        setPiecesSeen: {},
        maxDepth: 0,
        dramaticWins: 0,
        disasters: 0,
        townVisits: 0,
        investorAdvanceTaken: false,
        legacyRecorded: false
      };
    }
    if (!ex.legacyPreview) ex.legacyPreview = getLegacyRuns();
    if (!ex.legacySeen) ex.legacySeen = {};
    if (!ex.pendingNotices) ex.pendingNotices = [];
    if (!ex.titleWhisperDismissed) ex.titleWhisperDismissed = false;
    syncCrewRoster(state);
    applyDoctrineProfile(state);
    if (window.NarrativeCast && window.NarrativeCast.ensureState) {
      window.NarrativeCast.ensureState(state);
    }
  }

  function applyDoctrineProfile(state) {
    if (!state || !state.expedition) return;
    var doctrine = getDoctrine(state.expedition.doctrine);
    state.workPace = doctrine.pace;
    state.rationLevel = doctrine.rations;
  }

  function getCrewData(state, member) {
    ensureState(state);
    var id = getMemberId(member);
    return state.expedition.crew[id] || null;
  }

  function getCrewMoodLabel(memberState) {
    if (!memberState) return 'Steady';
    var pressure = memberState.pressure || 0;
    if (pressure >= 78) return 'Breaking';
    if (pressure >= 58) return 'Frayed';
    if (pressure >= 34) return 'Strained';
    return 'Steady';
  }

  function getCrewMoodTone(memberState) {
    var pressure = memberState ? (memberState.pressure || 0) : 0;
    if (pressure >= 78) return 'danger';
    if (pressure >= 58) return 'warn';
    return 'good';
  }

  function noteChamberVisit(state, chamberId) {
    ensureState(state);
    if (!chamberId) return;
    var token = chamberId + ':' + state.totalDays;
    if (state.expedition.lastVisitToken === token) return;
    state.expedition.lastVisitToken = token;
    if (!state.expedition.chambers[chamberId]) {
      state.expedition.chambers[chamberId] = { visits: 0, familiarity: 0, exhaustion: 0 };
    }
    state.expedition.chambers[chamberId].visits++;
    state.expedition.chambers[chamberId].familiarity = clamp(state.expedition.chambers[chamberId].familiarity + 1, 0, 4);
  }

  function getChamberState(state, chamberId) {
    ensureState(state);
    if (!state.expedition.chambers[chamberId]) {
      state.expedition.chambers[chamberId] = { visits: 0, familiarity: 0, exhaustion: 0 };
    }
    return state.expedition.chambers[chamberId];
  }

  function updateDirector(state) {
    ensureState(state);
    var ex = state.expedition;
    var pulse = ex.cavePulse;
    var doctrine = getDoctrine(ex.doctrine);
    var hauled = state.guanoShipped + state.guanoStockpile;
    var elapsed = Math.max(1, state.totalDays + 1);
    var haulRate = hauled / elapsed;
    var thinHaul = elapsed >= 4 && haulRate < 0.14;
    var hotHaul = haulRate >= 0.24 || hauled >= 3.5;
    var pressure = avgPressure(state);

    var tension = 18;
    if (state.isUnderground) tension += 16;
    if (thinHaul) tension += 10;
    if (state.cash < 25) tension += 6;
    if (state.food < 35) tension += 8;
    if (state.lanternOil < 1.5) tension += 8;
    if (state.rope < 60) tension += 6;
    tension += Math.round((100 - pulse.stability) * 0.18);
    tension += Math.round(pulse.water * 0.08);
    tension += Math.round(pulse.air * 0.07);
    tension += Math.round(pressure * 0.2);
    tension = Math.round(tension * doctrine.dangerMod);
    ex.director.tension = clamp(tension, 0, 100);

    if (state.isUnderground && (pulse.water >= 72 || pulse.stability <= 34 || pressure >= 78)) {
      ex.director.beat = 'crisis';
    } else if (pulse.wonder >= 74 && doctrine.wonderMod >= 1.0) {
      ex.director.beat = 'wonder';
    } else if (thinHaul || state.cash < 15 || pulse.air >= 66) {
      ex.director.beat = 'dread';
    } else if (hotHaul || ex.director.lastPayoffDay >= state.totalDays - 1) {
      ex.director.beat = 'payoff';
    } else {
      ex.director.beat = 'calm';
    }
  }

  function pulseDecay(state) {
    ensureState(state);
    var pulse = state.expedition.cavePulse;
    pulse.air = clamp(pulse.air - 8, 10, 100);
    pulse.water = clamp(pulse.water - 6, 8, 100);
    pulse.bats = clamp(pulse.bats - 4, 10, 100);
    pulse.stability = clamp(pulse.stability + 5, 0, 100);
    pulse.wonder = clamp(pulse.wonder - 3, 12, 100);
  }

  function prepareDay(state) {
    ensureState(state);
    applyDoctrineProfile(state);
    var ex = state.expedition;
    if (!state.isUnderground) {
      pulseDecay(state);
      updateDirector(state);
      return;
    }

    noteChamberVisit(state, state.currentChamber);
    var pulse = ex.cavePulse;
    var persona = getChamberPersona(state.currentChamber);
    var doctrine = getDoctrine(ex.doctrine);
    pulse.air = clamp(pulse.air + persona.air - (doctrine.id === 'crew_first' ? 2 : 0) + (doctrine.id === 'profit_first' ? 2 : 0), 0, 100);
    pulse.water = clamp(pulse.water + persona.water + (state.season === 'spring' ? 4 : 0), 0, 100);
    pulse.bats = clamp(pulse.bats + persona.bats, 0, 100);
    pulse.stability = clamp(pulse.stability - persona.stabilityDrain - (doctrine.id === 'profit_first' ? 2 : 0), 0, 100);
    pulse.wonder = clamp(pulse.wonder + Math.round(persona.wonder * doctrine.wonderMod * 0.35), 0, 100);
    updateDirector(state);
  }

  function modifyOutput(state, output) {
    ensureState(state);
    var doctrine = getDoctrine(state.expedition.doctrine);
    var persona = getChamberPersona(state.currentChamber);
    var chamber = getChamberState(state, state.currentChamber);
    var beat = state.expedition.director.beat;

    output *= doctrine.yieldMod;
    output *= persona.yieldMod || 1.0;
    output *= 1 + (chamber.familiarity * 0.03);
    output *= 1 - (chamber.exhaustion * 0.05);
    if (beat === 'payoff') output *= 1.14;
    if (beat === 'crisis') output *= 0.84;
    if (beat === 'wonder') output *= 1.06;
    if (state.expedition.cavePulse.air >= 72) output *= 0.9;
    if (state.expedition.cavePulse.stability <= 36) output *= 0.88;

    var foreman = getCrewData(state, state.foreman);
    var ropeman = state.crew[0] ? getCrewData(state, state.crew[0]) : null;
    var lampkeeper = state.crew[1] ? getCrewData(state, state.crew[1]) : null;
    if (foreman && foreman.traitId === 'stone_reader') output *= 1.08;
    if (foreman && foreman.traitId === 'ledger_eye' && state.guanoStockpile > 0.25) output *= 1.04;
    if (ropeman && ropeman.traitId === 'load_bearer' && state.rope >= 40) output *= 1.04;
    if (lampkeeper && lampkeeper.traitId === 'cold_flame' && state.lanternOil >= 0.5) output *= 1.03;
    return Math.round(output * 1000) / 1000;
  }

  function modifyEventProbability(state, eventId, probability) {
    ensureState(state);
    var ex = state.expedition;
    var pulse = ex.cavePulse;
    var beat = ex.director.beat;
    var persona = getChamberPersona(state.currentChamber);
    var doctrine = getDoctrine(ex.doctrine);
    var next = probability * doctrine.dangerMod;

    if (beat === 'crisis') next *= 1.25;
    if (beat === 'calm') next *= 0.85;
    if (beat === 'payoff') next *= 0.92;

    if (eventId === 'bad_air' || eventId === 'lung_sickness') {
      next *= 1 + (pulse.air / 140);
      if (persona.tags.indexOf('sanctuary') !== -1) next *= 0.75;
    }
    if (eventId === 'flooding') {
      next *= 1 + (pulse.water / 100);
      if (persona.tags.indexOf('water') !== -1) next *= 1.25;
    }
    if (eventId === 'bat_swarm' || eventId === 'bat_fever') {
      next *= 1 + (pulse.bats / 120);
      if (persona.tags.indexOf('bat_heavy') !== -1) next *= 1.2;
    }
    if (eventId === 'cave_in' || eventId === 'rockfall' || eventId === 'equipment_break') {
      next *= 1 + ((100 - pulse.stability) / 120);
      if (persona.tags.indexOf('tight') !== -1 || persona.tags.indexOf('risk') !== -1) next *= 1.15;
    }

    return next;
  }

  function modifyOilConsumption(state, amount) {
    ensureState(state);
    var lampkeeper = state.crew[1] ? getCrewData(state, state.crew[1]) : null;
    if (lampkeeper && (lampkeeper.traitId === 'cold_flame' || lampkeeper.traitId === 'quiet_hands')) {
      return Math.max(0.25, Math.round(amount * 0.85 * 100) / 100);
    }
    return amount;
  }

  function modifyHealthDelta(member, state, delta) {
    ensureState(state);
    var crewState = getCrewData(state, member);
    var doctrine = getDoctrine(state.expedition.doctrine);
    if (doctrine.id === 'crew_first') delta -= 2;
    if (doctrine.id === 'profit_first') delta += 2;
    if (crewState) {
      if (crewState.traitId === 'old_hand' && state.isUnderground) delta -= 1;
      if (crewState.traitId === 'air_nose' && state.isUnderground && state.expedition.cavePulse.air >= 60) delta -= 2;
      if (crewState.traitId === 'camp_preacher' && !state.isUnderground) delta -= 1;
      if (crewState.pressure >= 78) delta += 3;
      else if (crewState.pressure <= 20) delta -= 1;
    }
    return delta;
  }

  function adjustDamage(member, amount, state) {
    ensureState(state);
    var crewState = getCrewData(state, member);
    var doctrine = getDoctrine(state.expedition.doctrine);
    var adjusted = amount;

    if (doctrine.id === 'crew_first') adjusted *= 0.92;
    if (doctrine.id === 'profit_first') adjusted *= 1.05;

    if (crewState) {
      if (crewState.traitId === 'sure_footed') adjusted *= 0.86;
      if (crewState.traitId === 'cold_flame' && state.expedition.cavePulse.air >= 60) adjusted *= 0.88;
      if (crewState.traitId === 'iron_nerve' && state.expedition.director.beat === 'crisis') adjusted *= 0.9;
      if (crewState.pressure >= 78) adjusted *= 1.08;
    }

    var bond = avgBond(state);
    if (adjusted >= 18 && bond >= 68 && Math.random() < 0.18) {
      adjusted = Math.max(4, adjusted - 5);
      state.expedition.pendingNotices.push('Someone on the line yanks ' + member.name + ' clear before the worst of it lands.');
      if (crewState) crewState.bond = clamp(crewState.bond + 2, 0, 100);
    }

    return Math.max(1, Math.round(adjusted));
  }

  function drainPressure(state, amount) {
    ensureState(state);
    var ids = Object.keys(state.expedition.crew || {});
    for (var i = 0; i < ids.length; i++) {
      state.expedition.crew[ids[i]].pressure = clamp(state.expedition.crew[ids[i]].pressure - amount, 0, 100);
    }
  }

  function raisePressure(state, amount) {
    ensureState(state);
    var ids = Object.keys(state.expedition.crew || {});
    for (var i = 0; i < ids.length; i++) {
      state.expedition.crew[ids[i]].pressure = clamp(state.expedition.crew[ids[i]].pressure + amount, 0, 100);
    }
  }

  function finishDay(state, results) {
    ensureState(state);
    var ex = state.expedition;
    var persona = getChamberPersona(state.currentChamber);
    var ropeman = state.crew[0] ? getCrewData(state, state.crew[0]) : null;
    var lampkeeper = state.crew[1] ? getCrewData(state, state.crew[1]) : null;

    if (state.isUnderground) {
      var chamberData = window.CaveData ? window.CaveData.getChamber(state.currentChamber) : null;
      ex.moments.maxDepth = Math.max(ex.moments.maxDepth, chamberData ? (chamberData.depth || 0) : 0);
    }

    if (results.guanoMinedToday > 0) {
      ex.director.lastPayoffDay = state.totalDays;
      if (state.currentChamber) {
        var chamber = getChamberState(state, state.currentChamber);
        chamber.exhaustion = clamp(chamber.exhaustion + (results.guanoMinedToday > 0.18 ? 1 : 0.5), 0, 4);
      }
      if (results.guanoMinedToday >= 0.2) ex.moments.dramaticWins++;
    }

    if (results.deaths && results.deaths.length) {
      ex.director.lastDisasterDay = state.totalDays;
      ex.moments.disasters++;
      raisePressure(state, 18);
    } else if (results.eventsTriggered && results.eventsTriggered.length) {
      raisePressure(state, 8);
    } else if (!state.isUnderground) {
      drainPressure(state, 10);
    } else {
      drainPressure(state, 4);
    }

    if (results.resourcesConsumed && results.resourcesConsumed.shortages && results.resourcesConsumed.shortages.length) {
      raisePressure(state, 10);
    }

    if (persona.tags.indexOf('sanctuary') !== -1 && state.isUnderground && results.guanoMinedToday === 0) {
      drainPressure(state, 6);
      state.morale = Math.min(100, (state.morale || 50) + 4);
      if (state.foreman && state.foreman.alive && window.HealthSystem) {
        window.HealthSystem.applyHealing(state.foreman, 4);
      }
      results.messages.push('The chamber gives the crew one rare easy breath.');
    }

    if (results.eventsTriggered && results.eventsTriggered.length === 0 && state.isUnderground && avgBond(state) >= 66 && Math.random() < 0.25) {
      results.messages.push('The crew moves like men who finally trust one another in the dark.');
      var ids = Object.keys(ex.crew);
      for (var i = 0; i < ids.length; i++) {
        ex.crew[ids[i]].bond = clamp(ex.crew[ids[i]].bond + 1, 0, 100);
      }
    }

    if (ropeman && ropeman.traitId === 'grim_joker' && !results.deaths.length) {
      drainPressure(state, 2);
    }

    if (lampkeeper && lampkeeper.traitId === 'night_singer' && !results.deaths.length) {
      drainPressure(state, state.isUnderground ? 2 : 3);
      state.morale = clamp((state.morale || 50) + 1, 0, 100);
      if ((state.workPace === 'careful' || !state.isUnderground) && window.HealthSystem) {
        if (state.foreman && state.foreman.alive) window.HealthSystem.applyHealing(state.foreman, 1);
        for (var j = 0; j < (state.crew || []).length; j++) {
          if (state.crew[j] && state.crew[j].alive) window.HealthSystem.applyHealing(state.crew[j], 1);
        }
      }
    }

    while (ex.pendingNotices.length) {
      results.messages.push(ex.pendingNotices.shift());
    }

    updateDirector(state);
  }

  function getBeatLabel(state) {
    ensureState(state);
    var beat = state.expedition.director.beat;
    if (beat === 'crisis') return 'Crisis';
    if (beat === 'wonder') return 'Wonder';
    if (beat === 'payoff') return 'Payoff';
    if (beat === 'dread') return 'Dread';
    return 'Calm';
  }

  function getWarnings(state) {
    ensureState(state);
    var warnings = [];
    var pulse = state.expedition.cavePulse;
    if (pulse.air >= 66) {
      var airWarnings = [
        'The air has gone sour.',
        'Every breath is costing more.',
        'The chamber is turning foul.'
      ];
      warnings.push(pick(airWarnings));
    }
    if (pulse.water >= 70) warnings.push('You can hear water gaining.');
    if (pulse.bats >= 74) warnings.push('The ceiling is waking up.');
    if (pulse.stability <= 38) warnings.push('The rock sounds loose.');
    if (!warnings.length) {
      if (state.expedition.director.beat === 'wonder') warnings.push('The cave is showing off.');
      else if (state.expedition.director.beat === 'payoff') warnings.push('The haul feels hot today.');
      else if (state.expedition.director.beat === 'dread') warnings.push('The haul has gone thin.');
      else warnings.push('');
    }
    return warnings.filter(Boolean).slice(0, 2);
  }

  function getStoryLines(state, chamberId) {
    ensureState(state);
    var persona = getChamberPersona(chamberId);
    var chamberState = getChamberState(state, chamberId);
    var doctrine = getDoctrine(state.expedition.doctrine);
    var warnings = getWarnings(state);
    var lead = persona.short;
    if (chamberState.exhaustion >= 3 && chamberState.visits >= 3) {
      lead = 'The crew knows the room now, and the room is starting to give less back.';
    } else if (chamberState.familiarity >= 3 && chamberState.visits >= 2) {
      lead = 'The chamber is still dangerous, but it no longer feels unreadable.';
    }
    return {
      headline: lead,
      subline: warnings[0],
      note: ''
    };
  }

  function getDoctrineOptions() {
    return [
      { key: '1', label: DOCTRINES.steady_contract.name, value: 'steady_contract', description: DOCTRINES.steady_contract.summary },
      { key: '2', label: DOCTRINES.crew_first.name, value: 'crew_first', description: DOCTRINES.crew_first.summary },
      { key: '3', label: DOCTRINES.profit_first.name, value: 'profit_first', description: DOCTRINES.profit_first.summary },
      { key: '4', label: DOCTRINES.deep_chase.name, value: 'deep_chase', description: DOCTRINES.deep_chase.summary }
    ];
  }

  function getTownSnapshot(state) {
    if (!state) {
      return {
        headline: 'Marmaros waits over the Den.',
        rumor: '',
        paperHeadline: 'SHIFT BELLS RING AGAIN OVER THE DEN',
        paperSubhead: '',
        shopNote: '',
        opportunity: null
      };
    }
    ensureState(state);
    var castHeadline = window.NarrativeCast && window.NarrativeCast.getHeadline
      ? window.NarrativeCast.getHeadline(state)
      : null;

    var opportunity = null;
    if (
      state.totalDays >= 7 &&
      (state.guanoShipped + state.guanoStockpile) >= 4 &&
      state.cash < 7 &&
      !state.expedition.moments.investorAdvanceTaken
    ) {
      opportunity = {
        key: '9',
        label: 'Company Advance ($6)',
        value: 'investor',
        description: 'Settled against final pay.',
        apply: function (gameState) {
          gameState.cash += 6;
          gameState.totalRevenue += 6;
          gameState.expedition.moments.investorAdvanceTaken = true;
          raisePressure(gameState, 6);
          gameState.expedition.pendingNotices.push('Campbell has put town money on your back now. The whole ridge knows it.');
          var line = window.NarrativeCast && window.NarrativeCast.getTownLine
            ? window.NarrativeCast.getTownLine('company_advance', gameState)
            : null;
          return line && line.line ? line.line : 'Campbell fronts six dollars and writes it straight against final pay.';
        }
      };
    }

    return {
      headline: castHeadline ? castHeadline.headline : 'Marmaros watches the ridge and your ledger.',
      rumor: castHeadline ? castHeadline.rumor : '',
      paperHeadline: castHeadline ? castHeadline.paperHeadline : 'SHIFT BELLS RING AGAIN OVER THE DEN',
      paperSubhead: castHeadline ? castHeadline.paperSubhead : '',
      shopNote: '',
      opportunity: opportunity
    };
  }

  function gameStateMorale(state) {
    return state && state.morale !== undefined ? state.morale : 50;
  }

  function getShopReaction(shopId, state) {
    if (!state || !window.NarrativeCast || !window.NarrativeCast.getShopVoice) return '';
    ensureState(state);
    var voice = window.NarrativeCast.getShopVoice(shopId, state);
    return voice && voice.line ? voice.line : '';
  }

  function getTitleWhisper() {
    var runs = getLegacyRuns();
    if (!runs.length) return '';
    var latest = runs[0];
    if (latest.outcome === 'success') {
      return 'The mountain remembers ' + latest.foreman + ', who hauled ' + latest.hauled.toFixed(1) + ' tons.';
    }
    return latest.foreman + ' did not beat the mountain last time.';
  }

  function claimLegacyEcho(state, chamberId) {
    ensureState(state);
    if (!chamberId || state.expedition.legacySeen[chamberId]) return null;
    var runs = getLegacyRuns();
    if (!runs.length) return null;
    for (var i = 0; i < runs.length; i++) {
      var run = runs[i];
      if (run.chamber !== chamberId) continue;
      state.expedition.legacySeen[chamberId] = true;
      if (run.outcome === 'success') {
        state.rope += 10;
        return {
          line: 'Old chalk arrows still mark the best footing here. Somebody good came through before you.',
          note: '+10 ft rope saved by the old route.'
        };
      }
      state.morale = Math.max(0, (state.morale || 50) - 2);
      return {
        line: 'You find initials scratched into the stone and a warning line rubbed almost smooth by damp fingers.',
        note: 'The mountain remembers who failed here.'
      };
    }
    return null;
  }

  function maybeGetSetPiece(state) {
    ensureState(state);
    if (!state.isUnderground) return null;
    if (state.totalDays - state.expedition.director.lastSetPieceDay < 3) return null;

    var pulse = state.expedition.cavePulse;
    var beat = state.expedition.director.beat;
    var persona = getChamberPersona(state.currentChamber);
    var seen = state.expedition.moments.setPiecesSeen;

    if (!seen.flash_flood && pulse.water >= 72 && (persona.tags.indexOf('water') !== -1 || state.currentZone === 'zone5')) {
      return buildFlashFloodSetPiece();
    }
    if (!seen.blackout && (state.lanternOil < 1 || (pulse.air >= 70 && beat === 'crisis'))) {
      return buildBlackoutSetPiece();
    }
    if (!seen.bat_storm && pulse.bats >= 76 && persona.tags.indexOf('bat_heavy') !== -1) {
      return buildBatStormSetPiece();
    }
    if (!seen.hidden_grotto && beat === 'wonder' && persona.tags.indexOf('wonder') !== -1) {
      return buildHiddenGrottoSetPiece();
    }
    if (!seen.rival_claim && beat !== 'calm' && persona.tags.indexOf('rich') !== -1 && state.totalDays >= 4) {
      return buildRivalClaimSetPiece();
    }
    return null;
  }

  function maybeGetSurfaceSetPiece(state) {
    ensureState(state);
    if (!state || state.isUnderground) return null;
    if (state.currentChamber !== 'marmaros') return null;
    if (state.totalDays < 3) return null;
    if (state.expedition.moments.setPiecesSeen.fire_in_the_hole) return null;

    var hauled = state.guanoShipped + state.guanoStockpile;
    if (hauled < 0.5 && state.totalDays < 5) return null;

    state.expedition.moments.setPiecesSeen.fire_in_the_hole = true;
    return {
      id: 'fire_in_the_hole',
      type: 'minigame',
      game: 'FireInTheHoleGame',
      title: 'Fire In The Hole',
      kicker: 'Marmaros At Night',
      text: 'Bells break the ridge. Bald Knobbers torch the main street, the depot is catching, and Red Flanders is half out the hotel window in red long johns shouting that the thieves stole his pants.',
      note: 'Run the bucket wagon through burning Marmaros. Save cash, food, rope, and anybody still waving through the smoke.'
    };
  }

  function finalizeSetPiece(state, id) {
    ensureState(state);
    state.expedition.moments.setPiecesSeen[id] = true;
    state.expedition.director.lastSetPieceDay = state.totalDays;
  }

  function randomLivingMember(state) {
    var party = [];
    if (state.foreman && state.foreman.alive) party.push(state.foreman);
    for (var i = 0; i < state.crew.length; i++) {
      if (state.crew[i].alive) party.push(state.crew[i]);
    }
    if (!party.length) return null;
    return pick(party);
  }

  function buildFlashFloodSetPiece() {
    return {
      id: 'flash_flood',
      title: 'Flash Flood',
      kicker: 'Set Piece',
      text: 'The river changes pitch and every man on the line goes still. Water is already moving where there was dry stone a minute ago.',
      options: [
        {
          key: '1',
          label: 'Cut loose the haul and climb fast',
          apply: function (state) {
            var lost = Math.min(state.guanoStockpile, 0.25 + Math.random() * 0.25);
            state.guanoStockpile = Math.max(0, state.guanoStockpile - lost);
            drainPressure(state, 2);
            finalizeSetPiece(state, 'flash_flood');
            return { advanceDay: true, lines: ['You save the crew but lose ' + lost.toFixed(2) + ' tons in the rush.', 'Nobody forgets how close the water came.'] };
          }
        },
        {
          key: '2',
          label: 'Hold the line and save the sacks',
          apply: function (state) {
            var victim = randomLivingMember(state);
            if (victim && window.HealthSystem) window.HealthSystem.applyDamage(victim, 18 + Math.floor(Math.random() * 8));
            state.guanoStockpile += 0.12;
            raisePressure(state, 8);
            finalizeSetPiece(state, 'flash_flood');
            return { advanceDay: true, lines: ['You drag the haul through rising water and keep most of it.', victim ? victim.name + ' takes the worst of the scramble.' : 'The crew comes out shaking and soaked.'] };
          }
        }
      ]
    };
  }

  function buildBlackoutSetPiece() {
    return {
      id: 'blackout',
      title: 'Lantern Blackout',
      kicker: 'Set Piece',
      text: 'A lamp gutters, another coughs blue, and then the dark shuts like a door. The rope is the only thing that still feels real.',
      options: [
        {
          key: '1',
          label: 'Freeze, relight, and give the cave the day',
          apply: function (state) {
            state.lanternOil = Math.max(0, state.lanternOil - 0.5);
            state.dailyYieldMultiplier = 0.55;
            drainPressure(state, 3);
            finalizeSetPiece(state, 'blackout');
            return { advanceDay: true, lines: ['You stay alive by doing almost nothing.', 'The day is mostly lost, but the crew keeps its nerve.'] };
          }
        },
        {
          key: '2',
          label: 'Feel the rope and keep hauling blind',
          apply: function (state) {
            var victim = randomLivingMember(state);
            if (victim && window.HealthSystem) window.HealthSystem.applyDamage(victim, 14 + Math.floor(Math.random() * 10));
            state.dailyYieldMultiplier = 1.3;
            raisePressure(state, 10);
            finalizeSetPiece(state, 'blackout');
            return { advanceDay: true, lines: ['You steal a shift back from the dark.', victim ? victim.name + ' comes away bruised and furious.' : 'The dark taxes everyone by the time the lamp is back.'] };
          }
        }
      ]
    };
  }

  function buildBatStormSetPiece() {
    return {
      id: 'bat_storm',
      title: 'Bat Storm',
      kicker: 'Set Piece',
      text: 'The roof of the chamber peels open into wings. Noise replaces thought. Dust, droppings, and panic all hit at once.',
      options: [
        {
          key: '1',
          label: 'Hold fast and let the swarm spend itself',
          apply: function (state) {
            state.lanternOil = Math.max(0, state.lanternOil - 0.25);
            drainPressure(state, 1);
            finalizeSetPiece(state, 'bat_storm');
            return { advanceDay: true, lines: ['You keep the crew low and tight until the storm passes.', 'No extra haul, but no catastrophe either.'] };
          }
        },
        {
          key: '2',
          label: 'Work through it while the guano falls fresh',
          apply: function (state) {
            state.dailyYieldMultiplier = 1.45;
            raisePressure(state, 7);
            finalizeSetPiece(state, 'bat_storm');
            return { advanceDay: true, lines: ['You work under a living ceiling and come away with a filthy windfall.', 'Everyone will remember the sound more than the money.'] };
          }
        }
      ]
    };
  }

  function buildHiddenGrottoSetPiece() {
    return {
      id: 'hidden_grotto',
      title: 'Hidden Grotto',
      kicker: 'Set Piece',
      text: 'Behind a shelf of flowstone, the chamber opens into something untouched and almost beautiful enough to make the work feel small.',
      options: [
        {
          key: '1',
          label: 'Mark it, rest in it, and move carefully',
          apply: function (state) {
            drainPressure(state, 8);
            state.morale = Math.min(100, (state.morale || 50) + 8);
            state.dailyYieldMultiplier = 0.7;
            finalizeSetPiece(state, 'hidden_grotto');
            return { advanceDay: true, lines: ['The crew gets one miraculous quiet day under the mountain.', 'Everybody walks back out of the grotto lighter than they entered it.'] };
          }
        },
        {
          key: '2',
          label: 'Strip the seam before anybody else finds it',
          apply: function (state) {
            state.dailyYieldMultiplier = 1.5;
            getChamberState(state, state.currentChamber).exhaustion = clamp(getChamberState(state, state.currentChamber).exhaustion + 1.5, 0, 4);
            finalizeSetPiece(state, 'hidden_grotto');
            return { advanceDay: true, lines: ['You turn wonder into haul before the moment cools.', 'The grotto never feels quite as magical again.'] };
          }
        }
      ]
    };
  }

  function buildRivalClaimSetPiece() {
    return {
      id: 'rival_claim',
      title: 'Claim Jumpers',
      kicker: 'Set Piece',
      text: 'Lantern light answers lantern light farther down the room. Another crew has found your working face and likes it just fine.',
      options: [
        {
          key: '1',
          label: 'Split the seam and keep the peace',
          apply: function (state) {
            state.dailyYieldMultiplier = 0.72;
            drainPressure(state, 2);
            finalizeSetPiece(state, 'rival_claim');
            return { advanceDay: true, lines: ['Nobody gets rich, but nobody gets buried for pride either.', 'The contract slows down for one day and keeps moving.'] };
          }
        },
        {
          key: '2',
          label: 'Push them off your line',
          apply: function (state) {
            state.dailyYieldMultiplier = 1.22;
            raisePressure(state, 6);
            var victim = randomLivingMember(state);
            if (victim && Math.random() < 0.45 && window.HealthSystem) window.HealthSystem.applyDamage(victim, 12 + Math.floor(Math.random() * 10));
            finalizeSetPiece(state, 'rival_claim');
            return { advanceDay: true, lines: ['You keep the room and make enemies in the process.', victim ? victim.name + ' catches a rough shove in the dark.' : 'The cave echoes with language nobody is proud of later.'] };
          }
        }
      ]
    };
  }

  function recordLegacy(state, outcome, reason, scoreData) {
    if (!state) return;
    ensureState(state);
    if (state.expedition.moments.legacyRecorded) return;
    var runs = getLegacyRuns();
    runs.unshift({
      foreman: state.foreman ? state.foreman.name : 'Unknown',
      outcome: outcome,
      doctrine: state.expedition.doctrine,
      chamber: state.currentChamber,
      hauled: state.guanoMined || 0,
      cash: state.cash || 0,
      survivors: countAlive(state),
      discoveries: (state.discoveredChambers || []).length,
      reason: reason || '',
      score: scoreData ? scoreData.finalScore : (state.score || 0),
      timestamp: Date.now()
    });
    saveLegacyRuns(runs);
    state.expedition.moments.legacyRecorded = true;
  }

  function getEndingArchetype(state, outcome) {
    if (!state) return null;
    ensureState(state);
    var doctrine = getDoctrine(state.expedition.doctrine);
    var survivors = countAlive(state);
    var total = 1 + state.crew.length;
    var discoveries = (state.discoveredChambers || []).length;
    var cash = state.cash || 0;

    if (outcome === 'success') {
      if (doctrine.id === 'crew_first' && survivors === total) {
        return {
          title: 'Keeper of the Crew',
          lead: 'You proved there was money in the cave without spending men like rope.',
          body: [
            'Marmaros talks about your ledger, but the crew talks about something rarer: a foreman worth following into the dark twice.',
            'The town starts sending nervous families your way whenever a new crew forms. Your name becomes a kind of warranty.'
          ]
        };
      }
      if (doctrine.id === 'profit_first' && cash >= 140) {
        return {
          title: 'Guano Baron',
          lead: 'You did not just make money. You bent the whole town around your haul.',
          body: [
            'The merchants of Marmaros stop calling you lucky and start calling you dangerous.',
            'When another sinkhole rumor starts up in the Ozarks, people ask whether you are already on your way.'
          ]
        };
      }
      if (doctrine.id === 'deep_chase' && discoveries >= 8) {
        return {
          title: 'Seeker of the Underdeep',
          lead: 'The haul was real, but the stories were richer.',
          body: [
            'You come back with enough proof to make sensible men curious and superstitious men nervous.',
            'Years later, when the cave opens to sightseers, half the legends they repeat begin with one of your runs.'
          ]
        };
      }
      return {
        title: 'Builder of Marmaros',
        lead: 'You turn twenty brutal days into a working enterprise.',
        body: [
          'The books close, the camp is louder, and Roark Mountain has one less mystery about whether it can be worked at scale.',
          'Your success does not tame the cave. It simply teaches the next crew where to start.'
        ]
      };
    }

    if (doctrine.id === 'deep_chase' && discoveries >= 7) {
      return {
        title: 'Lost To Wonder',
        lead: 'You did not come back rich, but you saw enough to poison ordinary life forever.',
        body: [
          'The money slips away. The images do not.',
          'People in Marmaros will say the cave took your good sense before it took anything else.'
        ]
      };
    }
    if (survivors <= 1) {
      return {
        title: 'The Cave Gets The Last Word',
        lead: 'The run ends as a warning story told by people who were not there.',
        body: [
          'Marmaros keeps the tale because towns built on dangerous money collect such tales the way caves collect echoes.',
          'What mattered in the dark is reduced to one line on a porch: they pushed too far.'
        ]
      };
    }
    return {
      title: 'The Contract Slips Away',
      lead: 'You come back with enough to remember and not enough to call it a win.',
      body: [
        'The mountain does not always beat a man cleanly. Sometimes it just leaves him short.',
        'That may be the crueler ending, because it still sounds like maybe one more run would have done it.'
      ]
    };
  }

  window.Expedition = {
    DOCTRINES: DOCTRINES,
    ensureState: ensureState,
    syncCrewRoster: syncCrewRoster,
    getDoctrine: getDoctrine,
    getDoctrineOptions: getDoctrineOptions,
    setDoctrine: function (state, doctrineId) {
      ensureState(state);
      if (DOCTRINES[doctrineId]) state.expedition.doctrine = doctrineId;
      applyDoctrineProfile(state);
    },
    applyDoctrineProfile: applyDoctrineProfile,
    getChamberPersona: getChamberPersona,
    noteChamberVisit: noteChamberVisit,
    getChamberState: getChamberState,
    prepareDay: prepareDay,
    modifyOutput: modifyOutput,
    modifyEventProbability: modifyEventProbability,
    modifyOilConsumption: modifyOilConsumption,
    modifyHealthDelta: modifyHealthDelta,
    adjustDamage: adjustDamage,
    finishDay: finishDay,
    getBeatLabel: getBeatLabel,
    getWarnings: getWarnings,
    getStoryLines: getStoryLines,
    getCrewData: getCrewData,
    getCrewMoodLabel: getCrewMoodLabel,
    getCrewMoodTone: getCrewMoodTone,
    maybeGetSetPiece: maybeGetSetPiece,
    maybeGetSurfaceSetPiece: maybeGetSurfaceSetPiece,
    getTownSnapshot: getTownSnapshot,
    getShopReaction: getShopReaction,
    getTitleWhisper: getTitleWhisper,
    claimLegacyEcho: claimLegacyEcho,
    recordLegacy: recordLegacy,
    getEndingArchetype: getEndingArchetype,
    getLegacyRuns: getLegacyRuns
  };
})();
