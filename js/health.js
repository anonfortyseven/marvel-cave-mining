// health.js - Health system for The Marvel Cave Mining Company
// Health scale: 0-140+. Lower is better. 140+ = collapse threshold.
// In this game, a collapse means the line drags you clear in time.

window.HealthSystem = {
  // Health thresholds
  GOOD_MAX: 34,
  FAIR_MAX: 69,
  POOR_MAX: 104,
  VERY_POOR_MAX: 139,
  DEATH_THRESHOLD: 140,

  // Get a human-readable label for a health value
  getHealthLabel: function(value) {
    if (value <= this.GOOD_MAX) return 'Good';
    if (value <= this.FAIR_MAX) return 'Fair';
    if (value <= this.POOR_MAX) return 'Poor';
    if (value <= this.VERY_POOR_MAX) return 'Very Poor';
    return 'Critical';
  },

  // Get health label CSS class
  getHealthClass: function(value) {
    if (value <= this.GOOD_MAX) return 'health-good';
    if (value <= this.FAIR_MAX) return 'health-fair';
    if (value <= this.POOR_MAX) return 'health-poor';
    if (value <= this.VERY_POOR_MAX) return 'health-vpoor';
    return 'health-bad';
  },

  // Calculate ration penalty based on ration level
  getRationPenalty: function(rationLevel) {
    switch (rationLevel) {
      case 'full':   return 0;
      case 'half':   return 5;
      case 'scraps': return 12;
      case 'none':   return 25;
      default:       return 0;
    }
  },

  getFoodWaterPenalty: function(foodShortageDays) {
    if (!foodShortageDays || foodShortageDays <= 0) return 0;
    if (foodShortageDays >= 2) return 26;
    return 8;
  },

  // Calculate pace penalty based on work pace
  getPacePenalty: function(workPace) {
    switch (workPace) {
      case 'careful':  return -3;  // slight recovery bonus
      case 'steady':   return 0;
      case 'grueling': return 8;
      default:         return 0;
    }
  },

  // Calculate air quality penalty based on zone and depth
  getAirQualityPenalty: function(zone, daysUnderground) {
    var basePenalty = 0;

    // Zone-based air quality (matches CaveData zone IDs)
    switch (zone) {
      case 'surface':  basePenalty = 0; break;
      case 'zone1':    basePenalty = 2; break;  // Cathedral Room
      case 'zone2':    basePenalty = 4; break;  // Upper Passages
      case 'zone3':    basePenalty = 6; break;  // Middle Depths
      case 'zone4':    basePenalty = 8; break;  // Deep Chambers
      case 'zone5':    basePenalty = 10; break; // The Abyss
      default:         basePenalty = 1; break;
    }

    // Extended time underground worsens air (stale air accumulation)
    if (daysUnderground > 7) {
      basePenalty += Math.floor((daysUnderground - 7) / 3);
    }

    return basePenalty;
  },

  // Calculate depth penalty (deeper = more health risk)
  getDepthPenalty: function(zone) {
    switch (zone) {
      case 'surface':  return 0;
      case 'zone1':    return 1;  // Cathedral Room
      case 'zone2':    return 2;  // Upper Passages
      case 'zone3':    return 4;  // Middle Depths
      case 'zone4':    return 6;  // Deep Chambers
      case 'zone5':    return 8;  // The Abyss
      default:         return 0;
    }
  },

  // Calculate darkness penalty (based on remaining light sources)
  getDarknessPenalty: function(lanternOil) {
    if (lanternOil >= 0.5) return 0;   // well-lit
    if (lanternOil >= 0.25) return 3;  // dim
    return 12; // near darkness - major penalty
  },

  // Update health for a single crew member
  // Returns the new health value and whether they hit collapse threshold
  updateHealth: function(member, state, timeScale) {
    if (!member.alive) return { health: member.health, died: false };
    timeScale = typeof timeScale === 'number' ? timeScale : 1;
    var restingDay = !!(state && state.restingDay);

    var currentHealth = member.health;
    var foodWaterPenalty = this.getFoodWaterPenalty(state.foodShortageDays || 0);

    // Base recovery: health trends toward 0 (good) at -10% of current
    var baseRecovery = -Math.floor(currentHealth * 0.10);

    // Surface recovery bonus
    if (!state.isUnderground) {
      baseRecovery -= 5;  // extra recovery on surface
    }
    if (restingDay) {
      baseRecovery -= state.isUnderground ? 14 : 12;
    }

    // Calculate all penalties
    var rationPenalty = this.getRationPenalty(state.rationLevel);
    var pacePenalty = this.getPacePenalty(state.workPace);

    var airPenalty = 0;
    var depthPenalty = 0;
    var darknessPenalty = 0;

    if (state.isUnderground) {
      airPenalty = this.getAirQualityPenalty(state.currentZone, state.daysUnderground);
      depthPenalty = this.getDepthPenalty(state.currentZone);
      darknessPenalty = this.getDarknessPenalty(state.lanternOil);
      if (restingDay) {
        airPenalty = Math.round(airPenalty * 0.25);
        depthPenalty = 0;
        darknessPenalty = Math.round(darknessPenalty * 0.25);
      }
    }
    if (restingDay) {
      pacePenalty = 0;
    }

    // Sum total delta
    var dailyDelta = baseRecovery + rationPenalty + foodWaterPenalty + pacePenalty + airPenalty + depthPenalty + darknessPenalty;
    var profession = window.CaveData && window.CaveData.PROFESSIONS ? window.CaveData.PROFESSIONS[state.profession] : null;
    if (profession && profession.healthBonus) {
      if (dailyDelta > 0) dailyDelta = Math.round(dailyDelta * (1 - profession.healthBonus));
      else if (dailyDelta < 0) dailyDelta = Math.round(dailyDelta * (1 + profession.healthBonus));
    }
    if (window.Expedition && window.Expedition.modifyHealthDelta) {
      dailyDelta = window.Expedition.modifyHealthDelta(member, state, dailyDelta);
    }

    var delta = Math.round(dailyDelta * timeScale * 100) / 100;

    // Apply delta
    var newHealth = currentHealth + delta;

    // Clamp to minimum 0
    if (newHealth < 0) newHealth = 0;

    member.health = Math.round(newHealth * 100) / 100;
    if (restingDay && member.health < this.DEATH_THRESHOLD) {
      member.needsRescue = false;
    }

    // Check collapse threshold
    var died = this.checkDeath(member);

    return { health: member.health, died: died, delta: delta };
  },

  // Check if a crew member has hit collapse threshold (health >= 140)
  checkDeath: function(member) {
    if (member.health >= this.DEATH_THRESHOLD) {
      member.health = this.DEATH_THRESHOLD;
      member.needsRescue = true;
      return true;
    }
    return false;
  },

  // Update health for all living party members
  updatePartyHealth: function(state, timeScale) {
    var results = [];

    // Update foreman
    var foremanResult = this.updateHealth(state.foreman, state, timeScale);
    foremanResult.name = state.foreman.name;
    foremanResult.role = 'foreman';
    results.push(foremanResult);

    // Update each crew member
    for (var i = 0; i < state.crew.length; i++) {
      var crewResult = this.updateHealth(state.crew[i], state, timeScale);
      crewResult.name = state.crew[i].name;
      crewResult.role = state.crew[i].role;
      results.push(crewResult);
    }

    return results;
  },

  // Apply direct damage to a member (from events)
  applyDamage: function(member, amount) {
    if (!member.alive) return false;
    var state = window.GameState && window.GameState.state ? window.GameState.state : null;
    if (state && window.Expedition && window.Expedition.adjustDamage) {
      amount = window.Expedition.adjustDamage(member, amount, state);
    }
    member.health += amount;
    return this.checkDeath(member);
  },

  // Apply direct healing to a member
  applyHealing: function(member, amount) {
    if (!member.alive) return;
    member.health = Math.max(0, member.health - amount);
    if (member.health <= this.POOR_MAX) member.needsRescue = false;
  },

  applyPartyHealing: function(state, amount) {
    var healed = [];
    if (!state || !amount || amount <= 0) return healed;

    if (state.foreman && state.foreman.alive) {
      this.applyHealing(state.foreman, amount);
      healed.push(state.foreman.name);
    }

    for (var i = 0; i < (state.crew || []).length; i++) {
      if (!state.crew[i].alive) continue;
      this.applyHealing(state.crew[i], amount);
      healed.push(state.crew[i].name);
    }

    return healed;
  },

  updateDonkeyHealth: function() {
    return false;
  }
};
