// scoring.js - Scoring system for The Marvel Cave Mining Company
// Final score calculation and top-ten persistence

window.Scoring = {
  // Point values
  POINTS: {
    SURVIVOR_FOREMAN: 100,
    SURVIVOR_CREW: 50,
    SURVIVOR_DONKEY: 20,
    PER_TON_GUANO_MINED: 10,
    PER_TON_GUANO_SHIPPED: 15,
    PER_DOLLAR_CASH: 0.1,
    CONTRACT_FULFILLED: 200,
    DISCOVERY_BASE: 50,

    // Specific discovery bonuses
    FORMATIONS: 75,
    UNDERGROUND_RIVER: 100,
    CATHEDRAL_ROOM: 100,
    BAT_COLONY: 50,
    MINERAL_DEPOSITS: 75,
    INDIAN_ARTIFACTS: 150,
    BLIND_CAVEFISH: 75,
    BOTTOMLESS_PIT: 125
  },

  // Score multipliers
  MULTIPLIERS: {
    ALL_CREW_ALIVE: 1.5,
    NO_DEATHS: 2.0,
    EARLY_FINISH: 1.25,    // finished before October
    ALL_DISCOVERIES: 2.0
  },

  // Calculate final score
  calculateScore: function(state) {
    var breakdown = {
      survivors: 0,
      resources: 0,
      contracts: 0,
      discoveries: 0,
      subtotal: 0,
      multiplier: 1.0,
      multiplierReasons: [],
      finalScore: 0
    };

    // --- Survivor points ---
    if (state.foreman.alive) {
      breakdown.survivors += this.POINTS.SURVIVOR_FOREMAN;
    }
    for (var i = 0; i < state.crew.length; i++) {
      if (state.crew[i].alive) {
        breakdown.survivors += this.POINTS.SURVIVOR_CREW;
      }
    }
    breakdown.survivors += state.donkeys.count * this.POINTS.SURVIVOR_DONKEY;

    // --- Resource points ---
    breakdown.resources += Math.floor(state.guanoMined * this.POINTS.PER_TON_GUANO_MINED);
    breakdown.resources += Math.floor(state.guanoShipped * this.POINTS.PER_TON_GUANO_SHIPPED);
    breakdown.resources += Math.floor(state.cash * this.POINTS.PER_DOLLAR_CASH);

    // --- Contract points ---
    for (var c = 0; c < state.contracts.length; c++) {
      if (state.contracts[c].fulfilled) {
        breakdown.contracts += this.POINTS.CONTRACT_FULFILLED;
      }
    }

    // --- Discovery points --- (flags match GameState defaults)
    if (state.foundSpanishLadder) breakdown.discoveries += this.POINTS.FORMATIONS;
    if (state.foundLostRiver) breakdown.discoveries += this.POINTS.UNDERGROUND_RIVER;
    if (state.foundBlondiesThrone) breakdown.discoveries += this.POINTS.CATHEDRAL_ROOM;
    if (state.foundUndergroundLakes) breakdown.discoveries += this.POINTS.BAT_COLONY;
    if (state.foundSpanishGold) breakdown.discoveries += this.POINTS.MINERAL_DEPOSITS;
    if (state.foundOsageMarks) breakdown.discoveries += this.POINTS.INDIAN_ARTIFACTS;
    if (state.foundBlindCavefish) breakdown.discoveries += this.POINTS.BLIND_CAVEFISH;
    if (state.foundCivilWarCache) breakdown.discoveries += this.POINTS.BOTTOMLESS_PIT;

    // Chamber discovery bonus
    breakdown.discoveries += state.discoveredChambers.length * this.POINTS.DISCOVERY_BASE;

    // --- Subtotal ---
    breakdown.subtotal = breakdown.survivors + breakdown.resources + breakdown.contracts + breakdown.discoveries;

    // --- Multipliers ---

    // All crew survived
    var allCrewAlive = true;
    for (var j = 0; j < state.crew.length; j++) {
      if (!state.crew[j].alive) { allCrewAlive = false; break; }
    }
    if (allCrewAlive && state.foreman.alive) {
      breakdown.multiplier *= this.MULTIPLIERS.ALL_CREW_ALIVE;
      breakdown.multiplierReasons.push('Every soul came back alive (x' + this.MULTIPLIERS.ALL_CREW_ALIVE + ')');
    }

    // No deaths at all (including donkeys at full count)
    if (allCrewAlive && state.foreman.alive && state.donkeys.count >= 2) {
      breakdown.multiplier *= this.MULTIPLIERS.NO_DEATHS;
      breakdown.multiplierReasons.push('Not a man nor beast lost to the mountain (x' + this.MULTIPLIERS.NO_DEATHS + ')');
    }

    // Early finish (before day 20 of 30)
    if (state.totalDays < 20 && state.guanoShipped >= state.contractTarget) {
      breakdown.multiplier *= this.MULTIPLIERS.EARLY_FINISH;
      breakdown.multiplierReasons.push('Contract filled ahead of schedule (x' + this.MULTIPLIERS.EARLY_FINISH + ')');
    }

    // All discoveries (match GameState flags)
    var allDiscoveries = state.foundSpanishLadder && state.foundLostRiver &&
      state.foundBlondiesThrone && state.foundUndergroundLakes &&
      state.foundSpanishGold && state.foundOsageMarks &&
      state.foundBlindCavefish && state.foundCivilWarCache;
    if (allDiscoveries) {
      breakdown.multiplier *= this.MULTIPLIERS.ALL_DISCOVERIES;
      breakdown.multiplierReasons.push('Every secret the cave holds, laid bare (x' + this.MULTIPLIERS.ALL_DISCOVERIES + ')');
    }

    // Morale bonus
    var morale = state.morale !== undefined ? state.morale : 50;
    if (morale >= 70) {
      breakdown.subtotal += 100;
      breakdown.multiplierReasons.push('Crew in high spirits — men would follow you again (+100 pts)');
    }

    // Town visitor bonus
    if (window.Town && window.Town.visitedShops && window.Town.visitedShops.length >= 3) {
      breakdown.multiplier *= 1.1;
      breakdown.multiplierReasons.push('Patron of every shop in Marmaros (x1.1)');
    }

    // --- Final score ---
    breakdown.finalScore = Math.floor(breakdown.subtotal * breakdown.multiplier);

    // Store on state
    state.score = breakdown.finalScore;

    return breakdown;
  },

  // Get score rank/title
  getRank: function(score) {
    if (score >= 3000) return 'King of the Underground Mountain';
    if (score >= 2000) return 'Master of the Devil\'s Den';
    if (score >= 1200) return 'Veteran Foreman';
    if (score >= 700)  return 'Ozark Spelunker';
    if (score >= 300)  return 'Greenhorn with Grit';
    if (score >= 50)   return 'Tenderfoot';
    return 'Cave Fodder';
  },

  // --- TOP TEN BOARD ---

  STORAGE_KEY: 'marvelCaveTopTen',

  // Get top ten scores from localStorage
  getTopTen: function() {
    try {
      var raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  // Save a score to the top ten board
  saveScore: function(name, score, details) {
    var topTen = this.getTopTen();
    var entry = {
      name: name,
      score: score,
      rank: this.getRank(score),
      date: new Date().toISOString(),
      details: details || {}
    };

    topTen.push(entry);

    // Sort descending by score
    topTen.sort(function(a, b) { return b.score - a.score; });

    // Keep only top 10
    if (topTen.length > 10) {
      topTen = topTen.slice(0, 10);
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topTen));
    } catch (e) {
      console.error('Failed to save top ten:', e);
    }

    return topTen;
  },

  // Check if a score qualifies for the top ten
  isTopTenScore: function(score) {
    var topTen = this.getTopTen();
    if (topTen.length < 10) return true;
    return score > topTen[topTen.length - 1].score;
  },

  // Clear the top ten board
  clearTopTen: function() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // Format score breakdown for display
  formatBreakdown: function(breakdown) {
    var lines = [];
    lines.push('=== THE RECKONING ===');
    lines.push('');
    lines.push('Survivors:    ' + breakdown.survivors + ' pts');
    lines.push('Resources:    ' + breakdown.resources + ' pts');
    lines.push('Contracts:    ' + breakdown.contracts + ' pts');
    lines.push('Discoveries:  ' + breakdown.discoveries + ' pts');
    lines.push('---');
    lines.push('Subtotal:     ' + breakdown.subtotal + ' pts');
    lines.push('');
    if (breakdown.multiplierReasons.length > 0) {
      lines.push('Multipliers:');
      for (var i = 0; i < breakdown.multiplierReasons.length; i++) {
        lines.push('  ' + breakdown.multiplierReasons[i]);
      }
      lines.push('Total multiplier: x' + breakdown.multiplier.toFixed(2));
      lines.push('');
    }
    lines.push('FINAL SCORE:  ' + breakdown.finalScore + ' pts');
    lines.push('Rank: ' + window.Scoring.getRank(breakdown.finalScore));
    return lines.join('\n');
  }
};
