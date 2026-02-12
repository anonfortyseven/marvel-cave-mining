// health.js - Health system for The Marvel Cave Mining Company
// Health scale: 0-140+. Lower is better. 140+ = death.

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
    return 'Dead';
  },

  // Get health label CSS class
  getHealthClass: function(value) {
    if (value <= this.GOOD_MAX) return 'health-good';
    if (value <= this.FAIR_MAX) return 'health-fair';
    if (value <= this.POOR_MAX) return 'health-poor';
    if (value <= this.VERY_POOR_MAX) return 'health-vpoor';
    return 'health-dead';
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
  getDarknessPenalty: function(lanternOil, candles) {
    if (lanternOil >= 0.5 && candles >= 2) return 0;  // well-lit
    if (lanternOil >= 0.25 || candles >= 1) return 3;  // dim
    return 12; // near darkness - major penalty
  },

  // Update health for a single crew member
  // Returns the new health value and whether they died
  updateHealth: function(member, state) {
    if (!member.alive) return { health: member.health, died: false };

    var currentHealth = member.health;

    // Base recovery: health trends toward 0 (good) at -10% of current
    var baseRecovery = -Math.floor(currentHealth * 0.10);

    // Surface recovery bonus
    if (!state.isUnderground) {
      baseRecovery -= 5;  // extra recovery on surface
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
      darknessPenalty = this.getDarknessPenalty(state.lanternOil, state.candles);
    }

    // Sum total delta
    var delta = baseRecovery + rationPenalty + pacePenalty + airPenalty + depthPenalty + darknessPenalty;

    // Apply delta
    var newHealth = currentHealth + delta;

    // Clamp to minimum 0
    if (newHealth < 0) newHealth = 0;

    member.health = newHealth;

    // Check death
    var died = this.checkDeath(member);

    return { health: newHealth, died: died, delta: delta };
  },

  // Check if a crew member has died (health >= 140)
  checkDeath: function(member) {
    if (member.health >= this.DEATH_THRESHOLD) {
      member.alive = false;
      return true;
    }
    return false;
  },

  // Update health for all living party members
  updatePartyHealth: function(state) {
    var results = [];

    // Update foreman
    var foremanResult = this.updateHealth(state.foreman, state);
    foremanResult.name = state.foreman.name;
    foremanResult.role = 'foreman';
    results.push(foremanResult);

    // Update each crew member
    for (var i = 0; i < state.crew.length; i++) {
      var crewResult = this.updateHealth(state.crew[i], state);
      crewResult.name = state.crew[i].name;
      crewResult.role = state.crew[i].role;
      results.push(crewResult);
    }

    return results;
  },

  // Apply direct damage to a member (from events)
  applyDamage: function(member, amount) {
    if (!member.alive) return false;
    member.health += amount;
    return this.checkDeath(member);
  },

  // Apply direct healing to a member
  applyHealing: function(member, amount) {
    if (!member.alive) return;
    member.health = Math.max(0, member.health - amount);
  },

  // Update donkey health (simpler model)
  updateDonkeyHealth: function(donkeys, state) {
    if (donkeys.count <= 0) return;

    var delta = 0;

    // Base recovery
    delta -= Math.floor(donkeys.health * 0.08);

    // Ration penalty (donkeys also need food)
    if (state.rationLevel === 'half') delta += 3;
    else if (state.rationLevel === 'scraps') delta += 8;
    else if (state.rationLevel === 'none') delta += 15;

    // Pace penalty
    if (state.workPace === 'grueling') delta += 5;

    // Depth penalty for donkeys
    if (state.isUnderground) {
      delta += this.getDepthPenalty(state.currentZone) * 2; // donkeys suffer more underground
    }

    donkeys.health = Math.max(0, donkeys.health + delta);

    // Donkeys can die too
    if (donkeys.health >= this.DEATH_THRESHOLD) {
      donkeys.count--;
      donkeys.health = Math.floor(donkeys.health * 0.5); // surviving donkeys stressed
      if (donkeys.count < 0) donkeys.count = 0;
      return true; // a donkey died
    }
    return false;
  }
};
