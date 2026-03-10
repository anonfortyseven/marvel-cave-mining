/* ============================================
   Screens.js - All Game Screens
   The Marvel Cave Mining Company
   Flat action bar, no submenu, integrated art
   ============================================ */

(function () {
  'use strict';

  var CAVE_ART = [
    '              .  *  .    *   .  *',
    '         .  __|_____|__  .    *  .',
    '        .  /            \\  .   .  ',
    '     *    / THE  DEVIL\'S \\   *    ',
    '    .    /     DEN        \\    .  ',
    '        |  \\\\\\\\\\\\/////// |      ',
    '        |   \\\\\\\\//////   |      ',
    '         \\    \\\\\\/////   /      ',
    '          \\    \\\\///    /        ',
    '           \\    \\/    /          ',
    '            \\       /            ',
    '             \\  .  /             ',
    '              \\../               '
  ].join('\n');

  var GRAVESTONE_ART = [
    '         ___________',
    '        /           \\',
    '       /    R.I.P.   \\',
    '      |               |',
    '      |   HERE LIES   |',
    '      |               |',
    '      |  ~~~NAME~~~   |',
    '      |               |',
    '      |  ~~~CAUSE~~~  |',
    '      |               |',
    '      |  ~~~DATE~~~   |',
    '      |_______________|',
    '     /|               |\\',
    '    /_|_______________|_\\',
    '   ////////////////////////'
  ].join('\n');

  var FIELD_NOTES_MEMORY = {
    readPages: {},
    lastPage: 0
  };

  function gs() {
    return window.GameState && window.GameState.state ? window.GameState.state : null;
  }

  function formatDate(state) {
    if (!state || !state.date) return '1884';
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[state.date.getMonth()] + ' ' + state.date.getDate() + ', ' + state.date.getFullYear();
  }

  function healthLabel(val) {
    if (val <= 34) return '<span class="health-good">Good</span>';
    if (val <= 69) return '<span class="health-fair">Fair</span>';
    if (val <= 104) return '<span class="health-poor">Poor</span>';
    if (val <= 139) return '<span class="health-bad">Very Poor</span>';
    return '<span class="health-bad">Critical</span>';
  }

  function padCenter(str, width) {
    str = String(str);
    if (str.length >= width) return str.substring(0, width);
    var pad = width - str.length;
    var left = Math.floor(pad / 2);
    return UI.repeat(' ', left) + str + UI.repeat(' ', pad - left);
  }

  function countAlive(state) {
    if (!state) return 0;
    var count = 0;
    if (state.foreman && state.foreman.alive) count++;
    for (var i = 0; i < (state.crew || []).length; i++) {
      if (state.crew[i].alive) count++;
    }
    return count;
  }

  function getChamberData(chamberId) {
    if (window.CaveData) return window.CaveData.getChamber(chamberId);
    return null;
  }

  function buildGenericCaveArt(chamberId) {
    var chamber = getChamberData(chamberId);
    var label = chamber ? chamber.name.toUpperCase() : 'UNMAPPED STONE';
    label = label.substring(0, 23);
    return [
      '        .      .     .        ',
      '     .      ________      .   ',
      '          /          \\        ',
      '         /            \\       ',
      '        | ' + padCenter(label, 23) + ' |',
      '        |     CAVE CHAMBER    |',
      '         \\                  / ',
      '          \\________________/  '
    ].join('\n');
  }

  function getArt(chamberId) {
    if (window.AsciiArt && window.AsciiArt.getChamberArt) {
      var art = window.AsciiArt.getChamberArt(chamberId);
      if (art) {
        return art
          .replace(/-?\d+\s*ft\.?-?/gi, '')
          .replace(/-?\d+ft-?/gi, '');
      }
    }
    return buildGenericCaveArt(chamberId);
  }

  function getAmbient(chamberId) {
    if (window.AsciiArt && window.AsciiArt.getAmbientText) return window.AsciiArt.getAmbientText(chamberId);
    return '';
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  var TEXT_VARIANTS = {
    mining: [
      'Steel rings. Sacks fill.',
      'Dust lifts. The haul grows.',
      'You scrape profit out of stink and stone.',
      'Another filthy shift. Another heavier pile.',
      'Lanterns sway. The work does not stop.',
      'The chamber gives up a little more.'
    ],
    descend: [
      'Rope pays out into colder dark.',
      'The light above shrinks fast.',
      'Down you go, one careful rung at a time.',
      'The cave pulls you deeper.',
      'Boots slide. Hands hold.',
      'Every step down feels earned.'
    ],
    ascend: [
      'You haul toward thinner dark.',
      'The rope bites back, but you keep climbing.',
      'Every rung buys better air.',
      'Upward at last.',
      'The chamber falls away beneath your boots.',
      'Shoulders burn. The exit does not move.'
    ],
    restSurface: [
      'Open air steadies the crew.',
      'One quiet day above ground.',
      'Daylight and dry boots do some good.',
      'No picks today. Just recovery.',
      'The ridge gives you one calm day.',
      'Surface air feels almost medicinal.'
    ],
    restUnderground: [
      'Boots off. Lamps low. Breathe slow.',
      'The cave watches while you sleep.',
      'No digging. Just low voices and sore hands.',
      'One still day beneath the mountain.',
      'You rest, if this counts as rest.',
      'The crew lies down before the dark.'
    ],
    dayAdvance: [
      'The ledger moves one day forward.',
      'Another day spent bargaining with stone.',
      'Time passes. The mountain does not.',
      'One more day off the contract.',
      'The calendar turns underground.',
      'The work keeps its count.'
    ]
  };

  var RETURN_CHAMBER_TEXT = {
    cathedral_entrance: ['Back at the Den mouth. Cold air climbs out.', 'Same sinkhole. Same pull downward.'],
    cathedral_floor: ['Back under the huge roof and the bat-noise.', 'The Cathedral opens around you again.'],
    serpentine_passage: ['Back in the narrow haul throat.', 'The passage twists and expects you to follow.'],
    cloud_room: ['Mist, stink, and money again.', 'The Cloud Room comes back at your lungs first.']
  };

  var SCENE_SUMMARIES = {
    marmaros: ['Marmaros above the Den.', ''],
    cathedral_entrance: ['The Devil\'s Den opens under the trees.', 'Cold air rises. Daylight does not.'],
    the_sentinel: ['The Sentinel stands where men get quiet.', 'The stone keeps the fork.'],
    cathedral_floor: ['The Cathedral Room spreads wide beneath the bats.', 'Forward for haul. Sideways for the Spring Room.'],
    serpentine_passage: ['The haul route pinches into twisting stone.', 'Every sack fights this passage twice.'],
    egyptian_room: ['Smooth stone and old naming games.', 'The room looks grander than the work in it.'],
    gulf_of_doom: ['A black drop opens at the ledge.', 'Rich dirt. Bad footing.'],
    fat_mans_misery: ['Stone closes in until breathing becomes strategy.', 'Turn sideways and keep moving.'],
    the_dungeon: ['Low ceiling. Rust streaks. Mean air.', 'The room punishes tired crews.'],
    spring_room: ['Orange stone and clear water off the main line.', ''],
    blondies_throne: ['Flowstone rises like a seat no man earned.', 'Even miners lower their voices here.'],
    cloud_room: ['Low vapor hangs over the upper-cave money room.', 'Good guano. Bad lungs.'],
    mammoth_room: ['The bats own the roof above you.', 'The sound gets into your teeth.'],
    lost_river: ['Black water runs beside the route.', 'Nobody on the surface can answer where it goes.'],
    lake_genevieve: ['A still lake stops the room cold.', 'Every ripple feels too loud.'],
    lake_miriam: ['Deeper water keeps its own silence.', 'Even the echoes pull back.'],
    waterfall_room: ['A white fall tears through the dark.', 'This is the deep prize and it knows it.']
  };

  var STATUS_TAGLINES = {
    marmaros: 'Town above. Contract ticking.',
    cathedral_entrance: 'Cold air. Long rope.',
    the_sentinel: 'The fork waits here.',
    cathedral_floor: 'Main haul or side mercy.',
    serpentine_passage: 'Tight path. Slow loads.',
    egyptian_room: 'Grand room. Hard work.',
    gulf_of_doom: 'Mind the ledge.',
    fat_mans_misery: 'Breathe out. Slide through.',
    the_dungeon: 'Low roof. Bitter air.',
    spring_room: 'Clear water. Full-day healing.',
    blondies_throne: 'Quiet room. Good dirt.',
    cloud_room: 'Rich haul. Poison air.',
    mammoth_room: 'Bat empire overhead.',
    lost_river: 'Black water beside the route.',
    lake_genevieve: 'Still water. Hidden depth.',
    lake_miriam: 'Deep quiet.',
    waterfall_room: 'Thunder and the deepest haul.'
  };

  var PROFESSION_PITCHES = {
    mine_foreman: 'Most forgiving start. Best balance of money and stamina.',
    geologist: 'Sharper extraction, tighter margins, less trust from the crew.',
    farmer: 'Hardier body, thinner purse, rougher start.',
    drifter: 'Almost no cushion. Highest score if you survive.'
  };

  var SEASON_PITCHES = {
    spring: 'Fast water. Bad floods.',
    summer: 'Bad air. Steady access.',
    fall: 'Best season.',
    winter: 'Cold. Costly. Mean.'
  };

  function getCharacterDraft() {
    return window.Characters && window.Characters.getDraft ? window.Characters.getDraft() : null;
  }

  function getCharacterMeta(candidate) {
    return candidate && candidate.effects ? candidate.effects.slice(0, 2).join(' • ') : '';
  }

  function getCharacterBadges(candidate) {
    if (!candidate) return [];
    var badges = [];
    if (candidate.effects && candidate.effects[0]) {
      badges.push({ text: candidate.effects[0], tone: 'primary' });
    }
    if (candidate.effects && candidate.effects[1]) {
      badges.push({ text: candidate.effects[1], tone: 'secondary' });
    }
    return badges;
  }

  function getDoctrineDetailBullets(doctrine) {
    if (!doctrine) return [];
    var haul = 'Balanced haul.';
    if (doctrine.id === 'crew_first') haul = 'Lighter haul, steadier crew.';
    else if (doctrine.id === 'profit_first') haul = 'Heavier haul if the line holds.';
    else if (doctrine.id === 'deep_chase') haul = 'Best for deeper chambers and rare finds.';
    var strain = 'Crew strain stays manageable.';
    if (doctrine.id === 'crew_first') strain = 'Lowest crew strain of the four.';
    else if (doctrine.id === 'profit_first') strain = 'Highest strain and shortest tempers.';
    else if (doctrine.id === 'deep_chase') strain = 'Moderate strain, worse when you linger deep.';
    var supply = 'Normal supply burn.';
    if (doctrine.id === 'crew_first') supply = 'Food runs longer, oil matters less.';
    else if (doctrine.id === 'profit_first') supply = 'Food and rope run hot.';
    else if (doctrine.id === 'deep_chase') supply = 'Rope and oil matter most.';
    return [haul, strain, supply];
  }

  function getDoctrineCardMeta(doctrine) {
    if (!doctrine) return '';
    var bits = [];
    if (doctrine.id === 'steady_contract') bits = ['Even haul', 'Normal supply'];
    else if (doctrine.id === 'crew_first') bits = ['Low strain', 'Food lasts longer'];
    else if (doctrine.id === 'profit_first') bits = ['Big haul', 'Runs hot'];
    else if (doctrine.id === 'deep_chase') bits = ['Deeper route', 'Oil & rope'];
    return bits.join(' • ');
  }

  function getMaxDepthReached(state) {
    var maxDepth = state && state.expedition && state.expedition.moments ? (state.expedition.moments.maxDepth || 0) : 0;
    if (!state || !window.CaveData) return maxDepth;
    if (state.currentChamber) {
      var current = getChamberData(state.currentChamber);
      if (current) maxDepth = Math.max(maxDepth, current.depth || 0);
    }
    var seen = state.discoveredChambers || [];
    for (var i = 0; i < seen.length; i++) {
      var chamber = getChamberData(seen[i]);
      if (chamber) maxDepth = Math.max(maxDepth, chamber.depth || 0);
    }
    return maxDepth;
  }

  function getFieldNotesState() {
    var state = gs();
    if (state && state.story) {
      if (!state.story.fieldNotes) state.story.fieldNotes = { readPages: {}, lastPage: 0 };
      if (!state.story.fieldNotes.readPages) state.story.fieldNotes.readPages = {};
      if (typeof state.story.fieldNotes.lastPage !== 'number') state.story.fieldNotes.lastPage = 0;
      return state.story.fieldNotes;
    }
    return FIELD_NOTES_MEMORY;
  }

  function getScoreDetails(state) {
    var details = { profession: state && state.profession ? state.profession : '' };
    if (window.Characters && window.Characters.buildScoreDetails) {
      var extra = window.Characters.buildScoreDetails(state);
      for (var key in extra) {
        if (extra.hasOwnProperty(key)) details[key] = extra[key];
      }
    }
    return details;
  }

  function getCrewByRole(state, roleId) {
    if (!state || !state.crew) return null;
    for (var i = 0; i < state.crew.length; i++) {
      if (state.crew[i].alive && state.crew[i].role === roleId) return state.crew[i];
    }
    return null;
  }

  function getRandomCrewCampQuote(state) {
    var pool = [
      { role: 'ropeman', lines: ['Rope held today. Might hold tomorrow. Might not.', 'I check every knot twice. The unlucky ones didn\'t.'] },
      { role: 'lampkeeper', lines: ['I\'ll trim the wicks. We ain\'t losing the line in the dark. Not tonight.', 'Oil\'s thin but I can stretch it. Done worse with less.'] }
    ];
    var pick = pool[Math.floor(Math.random() * pool.length)];
    var crew = getCrewByRole(state, pick.role);
    var speaker = crew ? crew.name : 'A crewman';
    var line = pick.lines[Math.floor(Math.random() * pick.lines.length)];
    return speaker + ' says, "' + line + '"';
  }

  function getSceneSummary(chamberId) {
    return SCENE_SUMMARIES[chamberId] || ['Fresh stone ahead.', 'The cave gives nothing freely.'];
  }

  function getStatusTagline(chamberId, chamber) {
    if (STATUS_TAGLINES[chamberId]) return STATUS_TAGLINES[chamberId];
    if (chamber && chamber.description) return chamber.description;
    return 'Keep the crew fed, the lamps full, and the rope dry.';
  }

  function trimStoryLine(text, maxLen) {
    if (!text) return '';
    var clean = String(text).replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLen) return clean;
    return clean.slice(0, maxLen - 1).replace(/\s+\S*$/, '') + '…';
  }

  function renderReadablePanel(title, lead, opts) {
    opts = opts || {};
    var classes = 'readable-screen' + (opts.narrow ? ' readable-screen--narrow' : '');
    var html = '<div class="' + classes + '">';
    html += '<div class="readable-frame">';
    if (opts.brand) {
      html += '<div class="readable-brand">Marvel Cave Mining Co.</div>';
    }
    html += '<div class="readable-header">';
    if (opts.kicker) html += '<div class="readable-kicker">' + UI.escapeHtml(opts.kicker) + '</div>';
    html += '<div class="readable-title text-glow">' + UI.escapeHtml(title) + '</div>';
    html += '<hr class="' + (opts.doubleRule === false ? 'separator' : 'separator-double') + '">';
    if (lead) html += '<div class="readable-lead">' + UI.escapeHtml(lead) + '</div>';
    if (opts.meta && opts.meta.length) {
      html += '<div class="selection-meta-row">';
      for (var i = 0; i < opts.meta.length; i++) {
        html += '<div class="selection-meta-pill">' + UI.escapeHtml(opts.meta[i]) + '</div>';
      }
      html += '</div>';
    }
    if (opts.note) html += '<div class="readable-note">' + UI.escapeHtml(opts.note) + '</div>';
    html += '</div>';
    if (opts.bodyHtml) html += '<div class="readable-body' + (opts.bodyClass ? ' ' + opts.bodyClass : '') + '">' + opts.bodyHtml + '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function clampPct(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  function formatStateLabel(value) {
    if (!value) return '';
    if (value === 'full') return 'Full Rations';
    if (value === 'half') return 'Half Rations';
    if (value === 'scraps') return 'Scraps';
    if (value === 'none') return 'No Rations';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function getToneFromPct(pct) {
    if (pct >= 70) return 'good';
    if (pct >= 40) return 'warn';
    return 'danger';
  }

  function getHealthPct(member) {
    var max = window.HealthSystem ? window.HealthSystem.DEATH_THRESHOLD : 140;
    if (!member || !member.alive) return 0;
    return clampPct((1 - (member.health / max)) * 100);
  }

  function buildMeter(pct, tone) {
    return '<div class="dash-meter"><div class="dash-meter-fill meter-' + tone + '" style="width:' + clampPct(pct) + '%"></div></div>';
  }

  function buildMetricCard(label, value, pct, meta) {
    var tone = getToneFromPct(pct);
    var html = '<div class="metric-card metric-card-' + tone + '">';
    html += '<div class="metric-label">' + UI.escapeHtml(label) + '</div>';
    html += '<div class="metric-value">' + UI.escapeHtml(value) + '</div>';
    html += buildMeter(pct, tone);
    if (meta) html += '<div class="metric-meta">' + UI.escapeHtml(meta) + '</div>';
    html += '</div>';
    return html;
  }

  function buildInfoChip(label, value) {
    return '<div class="info-chip"><span class="info-chip-label">' + UI.escapeHtml(label) + '</span><span class="info-chip-value">' + UI.escapeHtml(value) + '</span></div>';
  }

  function getCrewRoleLabel(member, isForeman) {
    if (isForeman) return 'Lead';
    if (!member || !member.role) return 'Miner';
    if (member.role === 'ropeman') return 'Rope';
    if (member.role === 'lampkeeper') return 'Lamp';
    if (member.role === 'blastman') return 'Blast';
    if (member.role === 'cartdriver') return 'Cart';
    return 'Miner';
  }

  function buildCrewCard(member, isForeman) {
    var pct = getHealthPct(member);
    var tone = member && member.alive ? getToneFromPct(pct) : 'danger';
    var label = member && member.alive && window.HealthSystem ? window.HealthSystem.getHealthLabel(member.health) : 'Lost';
    var html = '<div class="crew-card crew-card-' + tone + (member && !member.alive ? ' crew-card-dead' : '') + '">';
    html += '<div class="crew-card-head"><div class="crew-name">' + UI.escapeHtml(member ? member.name : 'Unknown') + '</div>';
    html += '<div class="crew-role">' + UI.escapeHtml(getCrewRoleLabel(member, isForeman)) + '</div></div>';
    html += '<div class="crew-meter-line">' + buildMeter(pct, tone) + '<span class="crew-health-label">' + UI.escapeHtml(label) + '</span></div>';
    html += '</div>';
    return html;
  }

  function buildDetailCard(label, value, note, tone) {
    var cls = 'detail-card' + (tone ? ' detail-card-' + tone : '');
    var html = '<div class="' + cls + '">';
    html += '<div class="detail-card-label">' + UI.escapeHtml(label) + '</div>';
    html += '<div class="detail-card-value">' + UI.escapeHtml(value) + '</div>';
    if (note) html += '<div class="detail-card-note">' + UI.escapeHtml(note) + '</div>';
    html += '</div>';
    return html;
  }

  function buildCrewBadge(label, tone) {
    return '<span class="roll-call-badge roll-call-badge-' + (tone || 'warn') + '">' + UI.escapeHtml(label) + '</span>';
  }

  function buildCrewConditionCard(member, isForeman, state) {
    var pct = getHealthPct(member);
    var tone = member && member.alive ? getToneFromPct(pct) : 'danger';
    var roleLabel = getCrewRoleLabel(member, isForeman);
    var profile = window.Expedition && window.Expedition.getCrewData ? window.Expedition.getCrewData(state, member) : null;
    var traitName = profile && profile.traitName ? profile.traitName : 'Steady Soul';
    var moodLabel = member && member.alive && window.Expedition && window.Expedition.getCrewMoodLabel
      ? window.Expedition.getCrewMoodLabel(profile)
      : (member && member.alive ? 'Steady' : 'Lost');
    var moodTone = member && member.alive && window.Expedition && window.Expedition.getCrewMoodTone
      ? window.Expedition.getCrewMoodTone(profile)
      : tone;
    var healthLabel = member && member.alive && window.HealthSystem
      ? window.HealthSystem.getHealthLabel(member.health)
      : 'Dead';
    var meterValue = member && member.alive ? (pct + '% ready') : 'Lost';

    var html = '<div class="roll-call-card roll-call-card-' + tone + (member && !member.alive ? ' roll-call-card-dead' : '') + '">';
    html += '<div class="roll-call-top">';
    html += '<div class="roll-call-copy">';
    html += '<div class="roll-call-name">' + UI.escapeHtml(member ? member.name : 'Unknown') + '</div>';
    html += '<div class="roll-call-role">' + UI.escapeHtml(roleLabel) + '</div>';
    html += '</div>';
    html += '<div class="roll-call-status stat-tone-' + tone + '">' + UI.escapeHtml(healthLabel) + '</div>';
    html += '</div>';
    html += '<div class="roll-call-badges">';
    html += buildCrewBadge(traitName, 'warn');
    html += buildCrewBadge(moodLabel, moodTone);
    html += '</div>';
    html += '<div class="roll-call-healthline">';
    html += '<span class="roll-call-healthcopy">Condition</span>';
    html += '<span class="roll-call-healthcopy stat-tone-' + tone + '">' + UI.escapeHtml(meterValue) + '</span>';
    html += '</div>';
    html += buildMeter(member && member.alive ? pct : 0, tone);
    html += '</div>';
    return html;
  }

  function renderScenePanel(options) {
    options = options || {};
    var html = '<div class="scene-panel">';
    if (options.imageHtml) html += options.imageHtml;
    else if (options.art) html += '<pre class="' + UI.escapeHtml(options.artClass || 'title-art title-art--scene') + '">' + UI.escapeHtml(options.art) + '</pre>';
    if (options.kicker) html += '<div class="scene-kicker">' + UI.escapeHtml(options.kicker) + '</div>';
    if (options.headline) html += '<div class="scene-copy">' + UI.escapeHtml(options.headline) + '</div>';
    if (options.subline) html += '<div class="scene-copy-sub">' + UI.escapeHtml(options.subline) + '</div>';
    if (options.note) html += '<div class="scene-copy-note">' + UI.escapeHtml(options.note) + '</div>';
    html += '</div>';
    UI.render(html);
  }

  function summarizeMessages(messages, limit) {
    var items = [];
    if (!messages || !messages.length) return items;
    for (var i = 0; i < messages.length; i++) {
      if (items.indexOf(messages[i]) === -1) items.push(messages[i]);
      if (items.length >= (limit || 3)) break;
    }
    return items;
  }

  function getWorstHealthValue(state) {
    if (!state || !window.HealthSystem) return 0;
    var members = [state.foreman].concat(state.crew || []);
    var worst = 0;
    for (var i = 0; i < members.length; i++) {
      if (!members[i] || !members[i].alive) continue;
      if (members[i].health > worst) worst = members[i].health;
    }
    return worst;
  }

  function getRecoveryShiftLine(beforeValue, afterValue) {
    if (!window.HealthSystem) return '';
    var beforeLabel = window.HealthSystem.getHealthLabel(beforeValue);
    var afterLabel = window.HealthSystem.getHealthLabel(afterValue);
    if (beforeLabel === afterLabel) {
      return 'The crew comes back stronger.';
    }
    return 'Worst condition: ' + beforeLabel + ' -> ' + afterLabel + '.';
  }

  var HUD_DISPLAY_NAMES = {
    cathedral_entrance: 'The Devil\'s Den'
  };

  function getHudChamberName(chamberId, chamber) {
    if (HUD_DISPLAY_NAMES[chamberId]) return HUD_DISPLAY_NAMES[chamberId];
    return chamber ? chamber.name : 'Unknown';
  }

  function getAverageHealthPct(state) {
    if (!state) return 0;
    var members = [state.foreman].concat(state.crew || []);
    var total = 0;
    var count = 0;
    for (var i = 0; i < members.length; i++) {
      if (members[i] && members[i].alive) {
        total += getHealthPct(members[i]);
        count++;
      }
    }
    return count ? clampPct(total / count) : 0;
  }

  function buildHeartMeter(pct) {
    var filled = Math.round(clampPct(pct) / 20);
    var html = '<div class="hud-heart-row">';
    for (var i = 0; i < 5; i++) {
      html += '<span class="hud-heart' + (i < filled ? ' is-filled' : '') + '">&#9829;</span>';
    }
    html += '</div>';
    return html;
  }

  function buildHudBar(pct, tone) {
    return '<div class="hud-bar"><div class="hud-bar-fill tone-' + tone + '" style="width:' + clampPct(pct) + '%"></div></div>';
  }

  function buildHudMeterSection(title, value, pct, tone, compact) {
    var html = '<div class="' + (compact ? 'hud-readiness-item' : 'hud-section') + '">';
    if (compact) {
      html += '<div class="hud-readiness-head"><div class="hud-section-title">' + UI.escapeHtml(title) + '</div><div class="hud-meter-value">' + UI.escapeHtml(value) + '</div></div>';
    } else {
      html += '<div class="hud-section-title">' + UI.escapeHtml(title) + '</div>';
      html += '<div class="hud-meter-head">';
      html += '<div class="hud-meter-value">' + UI.escapeHtml(value) + '</div>';
      html += '</div>';
    }
    html += buildHudBar(pct, tone);
    html += '</div>';
    return html;
  }

  function buildReadinessBlock(avgHealthPct, morale, foodDays, foodPct, oilDays, oilPct, ropeDrops, ropePct) {
    var html = '<div class="hud-panel-block hud-readiness-block"><div class="hud-panel-title">Readiness</div>';
    html += '<div class="hud-readiness-health"><div class="hud-section-title">Health</div>' + buildHeartMeter(avgHealthPct) + '</div>';
    html += '<div class="hud-readiness-list">';
    html += buildHudMeterSection('Morale', morale + '%', morale, getToneFromPct(morale), true);
    html += buildHudMeterSection('Food & Water', foodDays + ' days', foodPct, getToneFromPct(foodPct), true);
    html += buildHudMeterSection('Oil', oilDays + ' shifts', oilPct, getToneFromPct(oilPct), true);
    html += buildHudMeterSection('Rope', ropeDrops + ' drops', ropePct, getToneFromPct(ropePct), true);
    html += '</div></div>';
    return html;
  }

  function buildHudStatRow(label, value, tone) {
    return '<div class="hud-stat-row">' +
      '<span class="hud-stat-label">' + UI.escapeHtml(label) + '</span>' +
      '<span class="hud-stat-value stat-tone-' + UI.escapeHtml(tone || 'warn') + '">' + UI.escapeHtml(value) + '</span>' +
      '</div>';
  }

  function getCashTone(cash) {
    if (cash >= 60) return 'good';
    if (cash >= 0) return 'warn';
    return 'danger';
  }

  function buildLedgerCard(title, value, note, tone, valueClass) {
    var html = '<div class="hud-ledger-card">';
    html += '<div class="hud-ledger-copy">';
    html += '<div class="hud-ledger-label">' + UI.escapeHtml(title) + '</div>';
    html += '<div class="hud-ledger-value' + (valueClass || '') + ' stat-tone-' + tone + '">' + UI.escapeHtml(value) + '</div>';
    html += '</div></div>';
    return html;
  }

  function buildLedgerPanel(state, dayNum, duration) {
    var shipped = state.guanoShipped || 0;
    var stockpile = state.guanoStockpile || 0;
    var mined = state.guanoMined || 0;
    var cashTone = getCashTone(state.cash);
    var guanoTone = mined >= 3 ? 'good' : (mined >= 1 ? 'warn' : 'danger');
    var daysElapsed = Math.max(0, Math.min(duration, state.totalDays || 0));
    var daysLeft = Math.max(0, duration - Math.floor(daysElapsed));
    var timePct = clampPct((daysElapsed / Math.max(1, duration)) * 100);
    var timeTone = daysLeft <= 3 ? 'danger' : (daysLeft <= 7 ? 'warn' : 'good');
    var html = '<div class="hud-panel-block hud-ledger-block">';
    html += '<div class="hud-panel-title">Ledger</div>';
    html += '<div class="hud-ledger-grid">';
    html += buildLedgerCard('Guano', mined.toFixed(1) + 't', '', guanoTone, ' hud-ledger-value--haul');
    html += buildLedgerCard('Cash', UI.formatMoney(state.cash), '', cashTone, ' hud-ledger-value--money');
    html += '</div>';
    html += '<div class="hud-ledger-rows">';
    html += buildHudStatRow('In Sacks', stockpile.toFixed(1) + 't', stockpile > 0 ? 'warn' : 'good');
    html += buildHudStatRow('Turned In', shipped.toFixed(1) + 't', shipped > 0 ? 'good' : 'warn');
    html += '</div>';
    html += '<div class="hud-ledger-contract">';
    html += '<div class="hud-ledger-contract-head"><span class="hud-ledger-contract-label">Day</span><span class="hud-ledger-contract-value stat-tone-' + timeTone + '">' + dayNum + '/' + duration + '</span></div>';
    html += buildHudBar(timePct, timeTone);
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildChoiceList(title, options, currentValue) {
    var html = '<div class="hud-section hud-choice-section">';
    html += '<div class="hud-section-title">' + UI.escapeHtml(title) + '</div>';
    html += '<div class="hud-choice-list">';
    for (var i = 0; i < options.length; i++) {
      var active = options[i].value === currentValue;
      html += '<span class="hud-choice-chip' + (active ? ' is-active' : '') + '">' + UI.escapeHtml(options[i].label) + '</span>';
    }
    html += '</div></div>';
    return html;
  }

  function buildNoticeList(title, items) {
    var html = '<div class="hud-section hud-choice-section">';
    html += '<div class="hud-section-title">' + UI.escapeHtml(title) + '</div>';
    html += '<div class="hud-notice-list">';
    for (var i = 0; i < items.length; i++) {
      html += '<div class="hud-notice-line">' + UI.escapeHtml(items[i]) + '</div>';
    }
    html += '</div></div>';
    return html;
  }

  function maybeLaunchSurfaceSetPiece(state) {
    if (!state || !window.Expedition || !window.Expedition.maybeGetSurfaceSetPiece) return false;
    var setPiece = window.Expedition.maybeGetSurfaceSetPiece(state);
    if (!setPiece) return false;
    launchSurfaceSetPiece(state, setPiece);
    return true;
  }

  function getFallbackFireInTheHoleResult() {
    return {
      label: 'Bucket Line Held',
      summary: 'You get a few people clear, catch one ridiculous bundle, and keep the story alive for another night.',
      cash: 2.5,
      morale: 4,
      items: {},
      healthPenalty: 4,
      citizensSaved: 1,
      pantsBundles: 1,
      redCaught: false,
      redLine: 'Red is still yelling about the pants.'
    };
  }

  function applyFireInTheHoleResult(state, result, options) {
    options = options || {};
    if (!state || !result) return;
    var cashReward = result.cash || 0;
    var moraleReward = result.morale || 0;
    var itemsReward = result.items || {};
    var healthPenalty = result.healthPenalty || 0;

    if (options.trainingMode) {
      cashReward = 0;
      moraleReward = Math.max(2, Math.round(moraleReward * 0.5));
      itemsReward = {};
      healthPenalty = 0;
    }

    if (cashReward) state.cash += cashReward;
    if (moraleReward) state.morale = Math.max(0, Math.min(100, (state.morale || 50) + moraleReward));
    if (itemsReward) {
      for (var k in itemsReward) {
        if (itemsReward.hasOwnProperty(k)) state[k] = (state[k] || 0) + itemsReward[k];
      }
    }
    if (healthPenalty && window.HealthSystem && state.foreman && state.foreman.alive) {
      var collapsed = window.HealthSystem.applyDamage(state.foreman, healthPenalty);
      if (window.Expedition && window.Expedition.ensureState) window.Expedition.ensureState(state);
      if (collapsed && state.expedition && state.expedition.pendingNotices) state.expedition.pendingNotices.push('The foreman comes back singed and half-dragged, but still in the book.');
    }
    if (typeof state.baldKnobberThreat === 'number') {
      state.baldKnobberThreat = Math.max(0, state.baldKnobberThreat - (result.citizensSaved >= 2 ? 2 : 1));
    }
    if (window.Expedition && window.Expedition.ensureState) {
      window.Expedition.ensureState(state);
      if (state.expedition && state.expedition.pendingNotices) {
        if (result.redCaught) state.expedition.pendingNotices.push('Red Flanders spends the rest of the night swearing the Bald Knobbers still owe him a pair of pants.');
        else state.expedition.pendingNotices.push('By dawn everybody in Marmaros knows Red Flanders lost his pants before he lost his nerve.');
      }
    }
    if (window.GameState && window.GameState.save) window.GameState.save();

    return {
      label: result.label,
      summary: result.summary,
      redLine: result.redLine,
      cash: cashReward,
      morale: moraleReward,
      healthPenalty: healthPenalty,
      citizensSaved: result.citizensSaved || 0,
      pantsBundles: result.pantsBundles || 0,
      redCaught: !!result.redCaught,
      items: itemsReward
    };
  }

  function buildFireInTheHoleSummary(result) {
    result = result || getFallbackFireInTheHoleResult();
    var lead = result.summary || 'You get people clear and come out of the smoke with a story worth telling.';
    var note = result.redLine || (result.redCaught ? 'Red got his pants back.' : 'Red is still yelling about the pants.');
    var body = '<div class="detail-card-grid detail-card-grid--two">';
    body += buildDetailCard('Saved', String(result.citizensSaved || 0), 'pulled clear', 'good');
    body += buildDetailCard('Pants', String(result.pantsBundles || 0), 'bonus bundles', 'warn');
    body += buildDetailCard('Cash', UI.formatMoney(result.cash || 0), 'town gratitude', 'good');
    body += buildDetailCard('Morale', '+' + (result.morale || 0), 'story for the tavern', 'good');
    if (result.healthPenalty) body += buildDetailCard('Burns', '+' + result.healthPenalty, 'singed on the run', 'danger');
    body += '</div>';
    return {
      title: result.label || 'Fire In The Hole',
      lead: lead,
      note: note,
      bodyHtml: '<div style="margin-top:12px">' + body + '</div>'
    };
  }

  function resolveSurfaceSetPiece(state, setPiece, result, options) {
    options = options || {};
    if (window.Audio_Manager) Audio_Manager.play('town');
    var applied = applyFireInTheHoleResult(state, result, options);
    var summary = buildFireInTheHoleSummary(applied);
    UI.render(renderReadablePanel(
      summary.title,
      summary.lead,
      {
        kicker: setPiece.kicker || 'Special Event',
        narrow: true,
        note: summary.note,
        bodyHtml: summary.bodyHtml
      }
    ));
    UI.pressEnter(function () {
      if (state && state.gameOver) {
        gameOverScreen(state.gameOverReason || 'Burned fighting the Marmaros fire');
      } else if (typeof options.onComplete === 'function') {
        options.onComplete();
      } else {
        statusScreen();
      }
    });
  }

  function launchSurfaceSetPiece(state, setPiece, options) {
    options = options || {};
    UI.hideBars();
    UI.render(renderReadablePanel(
      setPiece.title,
      setPiece.text,
      {
        kicker: setPiece.kicker || 'Special Event',
        narrow: true,
        note: setPiece.note
      }
    ));
    UI.pressEnter(function () {
      var gameObj = window[setPiece.game];
      if (window.Audio_Manager) Audio_Manager.play('minigame');
      if (!gameObj || typeof gameObj.start !== 'function') {
        resolveSurfaceSetPiece(state, setPiece, getFallbackFireInTheHoleResult(), options);
        return;
      }
      gameObj.start({
        day: window.GameState && window.GameState.getDisplayDayNumber ? window.GameState.getDisplayDayNumber(state) : Math.floor((state.totalDays || 0)) + 1,
        threat: state.baldKnobberThreat || 0,
        cash: state.cash || 0,
        trainingMode: !!options.trainingMode
      }, function (result) {
        if (result == null) {
          if (window.Audio_Manager) Audio_Manager.play('town');
          if (typeof options.onComplete === 'function') options.onComplete();
          else statusScreen();
          return;
        }
        resolveSurfaceSetPiece(state, setPiece, result || getFallbackFireInTheHoleResult(), options);
      });
    });
  }

  function playFireInTheHole(options) {
    var state = gs();
    if (!state) { titleScreen(); return; }
    if (window.Expedition && window.Expedition.ensureState) window.Expedition.ensureState(state);
    launchSurfaceSetPiece(state, {
      id: 'fire_in_the_hole_replay',
      type: 'minigame',
      game: 'FireInTheHoleGame',
      title: 'Fire In The Hole',
      kicker: options && options.trainingMode ? 'Town Drill' : 'Marmaros At Night',
      text: options && options.trainingMode
        ? 'Marmaros runs the bucket wagon drill again. Bells ring. Fire jumps the street. Red Flanders still swears somebody stole his pants.'
        : 'Bald Knobbers torch Main Street, the depot is catching, and Red Flanders is already yelling about his stolen pants.',
      note: options && options.trainingMode
        ? 'Town drill only. Light reward. No real harm.'
        : 'Save people first. Bonus bundles second.'
    }, options || {});
  }

  function buildCrewRoster(state) {
    var html = '<div class="hud-panel-block hud-crew-panel" id="hud-crew-panel" role="button" tabindex="0" aria-label="View crew details"><div class="hud-panel-title">Crew</div><div class="hud-roster">';
    var roster = [{ member: state.foreman, role: 'Foreman' }];
    for (var i = 0; i < state.crew.length; i++) {
      roster.push({ member: state.crew[i], role: getCrewRoleLabel(state.crew[i], false) });
    }
    for (var j = 0; j < roster.length; j++) {
      var member = roster[j].member;
      var profile = window.Expedition && window.Expedition.getCrewData ? window.Expedition.getCrewData(state, member) : null;
      var tone = member && member.alive ? getToneFromPct(getHealthPct(member)) : 'danger';
      var status = member && member.alive && window.HealthSystem ? window.HealthSystem.getHealthLabel(member.health) : 'Dead';
      var moodTone = member && member.alive && window.Expedition && window.Expedition.getCrewMoodTone ? window.Expedition.getCrewMoodTone(profile) : tone;
      var meta = roster[j].role;
      html += '<div class="hud-roster-row">' +
        '<div class="hud-roster-id">' +
        '<span class="hud-roster-name">' + UI.escapeHtml(member ? member.name : 'Unknown') + '</span>' +
        '<span class="hud-roster-role">' + UI.escapeHtml(meta) + '</span>' +
        '</div>' +
        '<span class="hud-roster-status stat-tone-' + moodTone + '">' + UI.escapeHtml(status) + '</span>' +
        '</div>';
    }
    html += '</div></div>';
    return html;
  }

  function getDescendTargets(chamber) {
    if (!chamber || !window.CaveData || !window.CaveData.getDescendTargets) return [];
    return window.CaveData.getDescendTargets(chamber.id);
  }

  function canMineCurrentChamber(state) {
    if (!state || !state.isUnderground) return false;
    var chamber = getChamberData(state.currentChamber);
    return !!(chamber && chamber.canMine);
  }

  function buildActionDeck(actions, selectedIdx) {
    var html = '<div class="hud-action-grid">';
    for (var i = 0; i < actions.length; i++) {
      var action = actions[i];
      html += '<button class="hud-action-tile' + (i === selectedIdx ? ' is-selected' : '') + (action.primary ? ' is-primary' : '') + (action.secondary ? ' is-secondary' : '') + (action.utility ? ' is-utility' : '') + (action.opportunity ? ' is-opportunity' : '') + (action.disabled ? ' is-disabled' : '') + '"' +
        ' data-index="' + i + '"' + (action.disabled ? ' disabled aria-disabled="true"' : '') + '>' +
        '<span class="hud-action-key">' + UI.escapeHtml(action.key) + '</span>' +
        (action.badge ? '<span class="hud-action-badge">' + UI.escapeHtml(action.badge) + '</span>' : '') +
        '<span class="hud-action-label">' + UI.escapeHtml(action.label) + '</span>' +
        '</button>';
    }
    html += '</div>';
    return html;
  }

  function bindGameplayHud(actions, selectedIdx) {
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.hud-action-tile'));
    var continueBtn = document.getElementById('hud-continue');
    var crewPanel = document.getElementById('hud-crew-panel');

    function setSelected(nextIdx) {
      if (!tiles.length) return;
      selectedIdx = (nextIdx + tiles.length) % tiles.length;
      var state = gs();
      if (state && actions[selectedIdx]) state.lastHudAction = actions[selectedIdx].value;
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].classList.toggle('is-selected', i === selectedIdx);
      }
    }

    function runSelected() {
      if (!actions[selectedIdx]) return;
      if (actions[selectedIdx].disabled) {
        UI.showNotification(actions[selectedIdx].disabledLabel || 'Not available here', 1200);
        return;
      }
      UI.clearKeyHandler();
      handleAction(actions[selectedIdx].value);
    }

    tiles.forEach(function (tile, idx) {
      tile.addEventListener('click', function (e) {
        e.preventDefault();
        setSelected(idx);
        runSelected();
      });
    });

    if (continueBtn) {
      continueBtn.addEventListener('click', function (e) {
        e.preventDefault();
        runSelected();
      });
    }

    function openCrewPanel() {
      UI.clearKeyHandler();
      handleAction('crew');
    }

    if (crewPanel) {
      crewPanel.addEventListener('click', function (e) {
        e.preventDefault();
        openCrewPanel();
      });
      crewPanel.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCrewPanel();
        }
      });
    }

    UI.setKeyHandler(function (e) {
      var pressed = e.key.toLowerCase();
      for (var i = 0; i < actions.length; i++) {
        if (pressed === String(actions[i].key).toLowerCase()) {
          e.preventDefault();
          setSelected(i);
          runSelected();
          return;
        }
      }
      if (pressed === 'arrowleft' || pressed === 'arrowup') {
        e.preventDefault();
        setSelected(selectedIdx - 1);
        return;
      }
      if (pressed === 'arrowright' || pressed === 'arrowdown') {
        e.preventDefault();
        setSelected(selectedIdx + 1);
        return;
      }
      if (pressed === 'enter' || pressed === ' ') {
        e.preventDefault();
        runSelected();
      }
    });
  }

  // =========================================
  // 1. TITLE SCREEN
  // =========================================
  function titleScreen() {
    UI.hideBars();
    if (window.Audio_Manager) Audio_Manager.play('title');

    var html = '';
    var titlePath = window.Images && Images.getImagePath ? Images.getImagePath('title') : '';
    html += '<div class="title-hero">';
    if (titlePath) {
      html += '<div class="title-hero-frame"><img src="' + titlePath + '" class="title-hero-image" alt="" loading="eager" fetchpriority="high"></div>';
    } else {
      var titleArt = window.AsciiArt && window.AsciiArt.getTitleArt ? window.AsciiArt.getTitleArt() : '';
      if (titleArt) {
        html += '<div class="native-art-panel native-art-panel--title">';
        html += '<pre class="title-art title-art--hero">' + UI.escapeHtml(titleArt) + '</pre>';
        html += '</div>';
      }
    }
    html += '<div class="title-kicker">Ozarks Contract Work · 1884</div>';
    html += '<div class="title-name text-glow-strong">Marvel Cave Mining Co.</div>\n';
    html += '<div class="title-lead">Take the contract. Beat the cave. Bring the haul home.</div>\n';
    html += '<div class="title-stakes">';
    html += '<div class="title-stake"><span class="title-stake-value">20</span><span class="title-stake-label">Days</span></div>';
    html += '<div class="title-stake"><span class="title-stake-value">3</span><span class="title-stake-label">On The Line</span></div>';
    html += '<div class="title-stake"><span class="title-stake-value">Your</span><span class="title-stake-label">Cut of the Haul</span></div>';
    html += '</div>';
    html += '<div style="margin-top:18px"></div>';
    UI.render(html);
    // CRT boot flicker effect
    var screen = UI.getScreen();
    screen.classList.add('crt-boot');
    setTimeout(function () { screen.classList.remove('crt-boot'); }, 850);
    UI.animateBats();
    UI.promptChoice([
      { key: '1', label: 'Sign the 20-Day Contract', value: 'new', tone: 'featured', badge: 'START' },
      { key: '2', label: 'Top Ten Expeditions', value: 'top', tone: 'subtle' }
    ], function (val) {
      switch (val) {
        case 'new':
          if (window.Characters && window.Characters.startDraft) window.Characters.startDraft();
          UI.transition(professionScreen);
          break;
        case 'top':
          UI.transition(topTenScreen);
          break;
      }
    });
  }

  // =========================================
  // 2. PROFESSION SCREEN
  // =========================================
  function professionScreen() {
    UI.hideBars();
    var draft = window.Characters && window.Characters.startDraft ? window.Characters.startDraft() : null;
    var leads = draft ? draft.leads.slice().sort(function (a, b) {
      return (a.gender === 'female' ? 1 : 0) - (b.gender === 'female' ? 1 : 0);
    }) : [];
    var options = [];

    for (var i = 0; i < leads.length; i++) {
      options.push({
        key: String(i + 1),
        label: leads[i].name,
        value: leads[i].id,
        description: leads[i].story,
        badges: getCharacterBadges(leads[i]),
        confirmOnClick: false
      });
    }

    UI.render(renderReadablePanel(
      'Choose Your Lead',
      '',
      {
        kicker: 'Lead draft',
        narrow: true,
        brand: true
      }
    ));
    UI.promptChoice(options, function (val) {
      var selected = window.Characters && window.Characters.selectLead ? window.Characters.selectLead(val) : null;
      if (!selected) {
        UI.transition(titleScreen);
        return;
      }
      window.GameState.init({
        profession: selected.professionId || val,
        runId: draft ? draft.runId : ''
      });
      if (window.Characters && window.Characters.applyDraftToState) {
        window.Characters.applyDraftToState(gs());
      }
      UI.transition(crewScreen);
    }, {
      cardGrid: true,
      confirmOnClick: false,
      hideGroups: true,
      selectButtonLabel: 'SELECT'
    });
  }

  // =========================================
  // 3. CREW DRAFT
  // =========================================
  function crewScreen() {
    UI.hideBars();
    var state = gs();
    var draft = getCharacterDraft();
    var lead = window.Characters && window.Characters.getSelectedLead ? window.Characters.getSelectedLead() : null;
    if (!state || !draft || !lead) {
      UI.transition(professionScreen);
      return;
    }

    var ropeChoices = window.Characters ? window.Characters.getChoices('ropeman').slice().sort(function (a, b) {
      return (a.gender === 'female' ? 1 : 0) - (b.gender === 'female' ? 1 : 0);
    }) : [];
    var options = [];
    for (var i = 0; i < ropeChoices.length; i++) {
      options.push({
        key: String(i + 1),
        label: ropeChoices[i].name,
        value: ropeChoices[i].id,
        description: ropeChoices[i].story,
        badges: getCharacterBadges(ropeChoices[i]),
        confirmOnClick: false
      });
    }

    UI.render(renderReadablePanel(
      'Choose Your Rope Hand',
      '',
      {
        kicker: 'Crew draft 1 of 2',
        narrow: true,
        brand: true
      }
    ));
    UI.promptChoice(options, function (val) {
      if (window.Characters && window.Characters.selectCrew) {
        window.Characters.selectCrew('ropeman', val);
      }
      if (window.Characters && window.Characters.applyDraftToState) {
        window.Characters.applyDraftToState(state);
      }
      UI.transition(lampkeeperScreen);
    }, {
      cardGrid: true,
      confirmOnClick: false,
      hideGroups: true,
      selectButtonLabel: 'SELECT'
    });
  }

  function lampkeeperScreen() {
    UI.hideBars();
    var state = gs();
    var lead = window.Characters && window.Characters.getSelectedLead ? window.Characters.getSelectedLead() : null;
    if (!state || !lead) {
      UI.transition(professionScreen);
      return;
    }

    var lampChoices = window.Characters ? window.Characters.getChoices('lampkeeper').slice().sort(function (a, b) {
      return (a.gender === 'female' ? 1 : 0) - (b.gender === 'female' ? 1 : 0);
    }) : [];
    var options = [];
    for (var i = 0; i < lampChoices.length; i++) {
      options.push({
        key: String(i + 1),
        label: lampChoices[i].name,
        value: lampChoices[i].id,
        description: lampChoices[i].story,
        badges: getCharacterBadges(lampChoices[i]),
        confirmOnClick: false
      });
    }

    UI.render(renderReadablePanel(
      'Choose Your Lamp Keeper',
      '',
      {
        kicker: 'Crew draft 2 of 2',
        narrow: true,
        brand: true
      }
    ));
    UI.promptChoice(options, function (val) {
      if (window.Characters && window.Characters.selectCrew) {
        window.Characters.selectCrew('lampkeeper', val);
      }
      if (window.Characters && window.Characters.applyDraftToState) {
        window.Characters.applyDraftToState(state);
      }
      UI.transition(seasonScreen);
    }, {
      cardGrid: true,
      confirmOnClick: false,
      hideGroups: true,
      selectButtonLabel: 'SELECT'
    });
  }

  // =========================================
  // 4. SEASON
  // =========================================
  function seasonScreen() {
    UI.hideBars();
    UI.render(renderReadablePanel(
      'Choose Starting Season',
      '',
      {
        kicker: 'Start month',
        narrow: true,
        brand: true
      }
    ));
    UI.promptChoice([
      { key: '1', label: 'Spring (March)', value: 'spring', description: SEASON_PITCHES.spring, confirmOnClick: false },
      { key: '2', label: 'Summer (June)', value: 'summer', description: SEASON_PITCHES.summer, confirmOnClick: false },
      { key: '3', label: 'Fall (September)', value: 'fall', description: SEASON_PITCHES.fall, confirmOnClick: false, tone: 'featured', badge: 'RECOMMENDED' },
      { key: '4', label: 'Winter (December)', value: 'winter', description: SEASON_PITCHES.winter, confirmOnClick: false }
    ], function (val) {
      var state = gs();
      if (state) {
        state.season = val;
        var m = { spring: 2, summer: 5, fall: 8, winter: 11 };
        state.date = new Date(1884, m[val], 1);
        state.startDate = new Date(1884, m[val], 1);
      }
      UI.transition(doctrineScreen);
    }, {
      cardGrid: true,
      hideNav: true,
      confirmOnClick: false,
      selectButtonLabel: 'SELECT'
    });
  }

  function doctrineScreen() {
    UI.hideBars();
    var state = gs();
    if (!state) { titleScreen(); return; }
    var doctrine = window.Expedition && window.Expedition.getDoctrine ? window.Expedition.getDoctrine(state.expedition && state.expedition.doctrine) : null;
    UI.render(renderReadablePanel(
      'Choose Pace',
      '',
      {
        kicker: 'Crew orders',
        narrow: true,
        brand: true
      }
    ));
    var doctrineOptions = window.Expedition ? window.Expedition.getDoctrineOptions() : [];
    for (var i = 0; i < doctrineOptions.length; i++) {
      var current = window.Expedition.getDoctrine(doctrineOptions[i].value);
      doctrineOptions[i].badges = [];
      doctrineOptions[i].meta = '';
      doctrineOptions[i].description = current.summary;
      doctrineOptions[i].confirmOnClick = false;
    }
    UI.promptChoice(doctrineOptions, function (value) {
      if (window.Expedition && window.Expedition.setDoctrine) {
        window.Expedition.setDoctrine(state, value);
      }
      UI.transition(storeScreen);
    }, {
      cardGrid: true,
      hideNav: true,
      confirmOnClick: false,
      selectButtonLabel: 'SELECT'
    });
  }

  // =========================================
  // 5. STORE (initial outfitting)
  // =========================================
  function storeScreen() {
    UI.hideBars();
    if (window.Store && window.Store.show) {
      window.Store.show(function () {
        var state = gs();
        if (state) {
          state.isUnderground = true;
          state.currentChamber = 'cathedral_entrance';
          state.currentZone = 'zone1';
          if (state.discoveredChambers.indexOf('cathedral_entrance') === -1) state.discoveredChambers.push('cathedral_entrance');
        }
        UI.transition(landmarkScreen);
      });
    } else { UI.transition(statusScreen); }
  }

  // =========================================
  // LANDMARK (first visit to a chamber)
  // =========================================
  function landmarkScreen() {
    UI.hideBars();
    var state = gs();
    var chamberId = state ? state.currentChamber : 'cathedral_entrance';
    var chamber = getChamberData(chamberId);
    var art = getArt(chamberId);
    var seen = !!(state && state.visitedChambers && state.visitedChambers[chamberId]);
    var lines = getSceneSummary(chamberId);
    if (seen) {
      var shortPool = RETURN_CHAMBER_TEXT[chamberId] || ['You return to familiar stone.', 'The chamber feels known now.', 'Back through the same passage, different day.'];
      lines = [pick(shortPool)];
    } else if (state && state.visitedChambers) {
      state.visitedChambers[chamberId] = true;
    }
    if (state && window.Expedition) {
      window.Expedition.noteChamberVisit(state, chamberId);
      var legacyEcho = window.Expedition.claimLegacyEcho(state, chamberId);
      if (legacyEcho) {
        lines[1] = legacyEcho.line;
        if (legacyEcho.note) lines[2] = legacyEcho.note;
      } else if (window.Expedition.getStoryLines) {
        var story = window.Expedition.getStoryLines(state, chamberId);
        if (story) {
          lines[0] = story.headline || lines[0];
          if (story.subline) lines[1] = story.subline;
          if (story.note) lines[2] = story.note;
        }
      }
    }
    renderScenePanel({
      art: art,
      artClass: 'title-art title-art--scene',
      kicker: chamber ? chamber.name : 'Unmapped Stone',
      headline: lines[0] || 'Fresh stone ahead.',
      subline: lines[1] || '',
      note: lines[2] || ''
    });
    UI.pressEnter(function () { UI.transition(statusScreen); });
  }

  // =========================================
  // 6. STATUS SCREEN - THE MAIN GAMEPLAY HUB
  //    All actions visible in bottom action bar
  //    No submenu!
  // =========================================
  function statusScreen() {
    var state = gs();
    if (!state) { titleScreen(); return; }
    if (state.gameOver) { gameOverScreen(state.gameOverReason); return; }
    if (window.Expedition && window.Expedition.ensureState) window.Expedition.ensureState(state);

    state.marketPrice = state.companySalePrice || state.marketPrice || (window.Economy ? window.Economy.GUANO_PRICE_PER_TON : 700);

    // Play context-appropriate music
    if (window.Audio_Manager) Audio_Manager.playForContext(state);
    UI.hideBars();

    var chamber = getChamberData(state.currentChamber);
    var chamberName = getHudChamberName(state.currentChamber, chamber);
    var depth = chamber ? chamber.depth : 0;

    // Apply depth color theme
    var screen = UI.getScreen();
    screen.classList.remove('depth-shallow', 'depth-mid', 'depth-deep', 'depth-abyss');
    if (state.isUnderground && chamber) {
      if (depth >= 500) screen.classList.add('depth-abyss');
      else if (depth >= 350) screen.classList.add('depth-deep');
      else if (depth >= 200) screen.classList.add('depth-mid');
      else screen.classList.add('depth-shallow');
    }

    // === BUILD HUD ===
    var duration = state.gameDuration || 20;
    var dayNum = window.GameState && window.GameState.getDisplayDayNumber ? window.GameState.getDisplayDayNumber(state) : Math.min(Math.floor((state.totalDays || 0)) + 1, duration);
    var chamberId = state.currentChamber || 'marmaros';
    var partySize = countAlive(state);
    var foodPerDay = 2.4;
    if (state.rationLevel === 'half') foodPerDay = 1.2;
    else if (state.rationLevel === 'scraps') foodPerDay = 0.6;
    else if (state.rationLevel === 'none') foodPerDay = 0;
    var totalFoodPerDay = foodPerDay * partySize;
    var foodDays = totalFoodPerDay > 0 ? Math.floor(state.food / totalFoodPerDay) : 99;
    var oilDays = state.lanternOil > 0 ? Math.floor(state.lanternOil / 0.5) : 0;
    var ropeDrops = Math.floor(state.rope / 20);
    var morale = state.morale !== undefined ? state.morale : 50;
    var foodPct = clampPct((foodDays / 9) * 100);
    var oilPct = clampPct((oilDays / 8) * 100);
    var ropePct = clampPct((ropeDrops / 8) * 100);
    var avgHealthPct = getAverageHealthPct(state);
    var scenePath = '';
    var sceneArt = '';
    if (state.isUnderground) {
      scenePath = window.Images && Images.getChamberImagePath ? Images.getChamberImagePath(chamberId) : '';
    } else {
      scenePath = window.Images ? (Images.getImagePath('town') || Images.getImagePath('surface')) : '';
    }
    var summary = getSceneSummary(chamberId);
    var headline = summary[0] || getStatusTagline(chamberId, chamber);
    var subline = summary.length > 1 ? summary[1] : getStatusTagline(chamberId, chamber);
    var doctrine = window.Expedition && window.Expedition.getDoctrine ? window.Expedition.getDoctrine(state.expedition && state.expedition.doctrine) : null;
    var chamberPersona = window.Expedition && window.Expedition.getChamberPersona ? window.Expedition.getChamberPersona(chamberId) : null;
    var expeditionStory = window.Expedition && window.Expedition.getStoryLines ? window.Expedition.getStoryLines(state, chamberId) : null;
    var warnings = window.Expedition && window.Expedition.getWarnings ? window.Expedition.getWarnings(state) : [];
    var avgPressure = 0;
    if (window.Expedition && window.Expedition.getCrewData) {
      var pressureMembers = [state.foreman].concat(state.crew || []);
      var pressureTotal = 0;
      var pressureCount = 0;
      for (var pm = 0; pm < pressureMembers.length; pm++) {
        if (!pressureMembers[pm]) continue;
        var pressureProfile = window.Expedition.getCrewData(state, pressureMembers[pm]);
        if (pressureProfile) {
          pressureTotal += pressureProfile.pressure || 0;
          pressureCount++;
        }
      }
      avgPressure = pressureCount ? Math.round(pressureTotal / pressureCount) : 0;
    }
    if (expeditionStory) {
      headline = expeditionStory.headline || headline;
      subline = expeditionStory.subline || subline;
    }
    if (!state.isUnderground && window.Expedition && window.Expedition.getTownSnapshot) {
      var townSnapshot = window.Expedition.getTownSnapshot(state);
      if (townSnapshot) {
        headline = townSnapshot.headline || headline;
        subline = '';
      }
    }
    headline = trimStoryLine(headline, state.isUnderground ? 74 : 92);
    subline = trimStoryLine(subline, state.isUnderground ? 96 : 116);
    if (state.isUnderground) subline = '';

    var actions = [];
    var musicLabel = (window.Audio_Manager && Audio_Manager.isEnabled()) ? 'Music Off' : 'Music On';
    if (state.isUnderground) {
      var deeperConnections = getDescendTargets(chamber);
      if (chamberId === 'spring_room') {
        actions.push({
          label: 'Take the Spring',
          value: 'spring_heal',
          primary: true,
          note: 'Clear water and a full day of healing'
        });
      } else {
        var canMine = canMineCurrentChamber(state);
        actions.push({
          label: canMine ? 'Mine' : 'Go Deeper',
          value: 'mine',
          primary: true,
          note: canMine ? (chamberPersona ? chamberPersona.title : 'Work the room') : 'Mining starts lower in the cave',
          disabled: !canMine,
          disabledLabel: 'Mining starts deeper in the cave'
        });
      }
      if (deeperConnections.length > 0) {
        actions.push({ label: 'Descend', value: 'descend', note: deeperConnections.length > 1 ? deeperConnections.length + ' routes open' : 'One route open' });
      }
      actions.push({ label: 'Ascend', value: 'ascend', note: 'Climb toward daylight' });
      actions.push({ label: 'Pace', value: 'doctrine', note: doctrine ? doctrine.name : 'Set the pace' });
      if (chamberId !== 'spring_room') {
        actions.push({ label: 'Rest', value: 'rest', note: chamberPersona && chamberPersona.tags.indexOf('sanctuary') !== -1 ? 'This room can soothe them' : 'Recover for a day' });
      }
      actions.push({ label: musicLabel, value: 'music', note: 'Toggle soundtrack' });
    } else {
      actions.push({ key: '1', label: 'Enter Cave', value: 'enter', primary: true });
      actions.push({ key: '2', label: 'Rest Day', value: 'rest', secondary: true });
      actions.push({ key: '3', label: 'Visit Town', value: 'town' });
      actions.push({
        key: '4',
        label: 'Ship Guano',
        value: 'ship',
        disabled: state.guanoStockpile <= 0.01,
        disabledLabel: 'Yard clear.',
        opportunity: state.guanoStockpile > 0.01,
        badge: state.guanoStockpile > 0.01 ? 'READY' : ''
      });
      actions.push({ key: '5', label: 'Pace', value: 'doctrine', utility: true });
      actions.push({ key: '6', label: musicLabel, value: 'music', utility: true });
    }
    if (state.isUnderground) {
      for (var a = 0; a < actions.length; a++) actions[a].key = String(a + 1);
    }

    var selectedIdx = 0;
    if (state.lastHudAction) {
      for (var s = 0; s < actions.length; s++) {
        if (actions[s].value === state.lastHudAction) {
          selectedIdx = s;
          break;
        }
      }
    }
    if (actions[selectedIdx] && actions[selectedIdx].disabled) {
      for (var ae = 0; ae < actions.length; ae++) {
        if (!actions[ae].disabled) {
          selectedIdx = ae;
          break;
        }
      }
    }

    var html = '<div class="hud-shell">';
    html += '<div class="hud-header">';
    html += '<div class="hud-header-top"><span class="hud-header-day">Day ' + dayNum + ' of ' + duration + '</span><span class="hud-header-date">' + formatDate(state) + '</span></div>';
    html += '<div class="hud-header-place">' + UI.escapeHtml(chamberName);
    if (state.isUnderground && depth > 0) html += '<span class="hud-header-depth">' + depth + ' ft</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="hud-body">';
    html += '<aside class="hud-rail hud-rail-left">';
    html += buildReadinessBlock(avgHealthPct, morale, foodDays, foodPct, oilDays, oilPct, ropeDrops, ropePct);
    html += '</aside>';

    html += '<main class="hud-center">';
    html += '<div class="hud-scene-frame">';
    if (sceneArt) {
      html += '<pre class="title-art hud-scene-ascii">' + UI.escapeHtml(sceneArt) + '</pre>';
    } else if (scenePath) {
      html += '<img src="' + scenePath + '" class="hud-scene-image" alt="" loading="' + (dayNum <= 2 ? 'eager' : 'lazy') + '" fetchpriority="' + (dayNum <= 2 ? 'high' : 'auto') + '">';
    } else {
      html += '<div class="hud-scene-fallback">No Image</div>';
    }
    html += '</div>';
    html += '<div class="hud-story-panel">';
    html += '<div class="hud-story-primary">' + UI.escapeHtml(headline) + '</div>';
    if (subline) html += '<div class="hud-story-secondary">' + UI.escapeHtml(subline) + '</div>';
    html += '</div>';
    html += '</main>';

    html += '<aside class="hud-rail hud-rail-right">';
    html += buildLedgerPanel(state, dayNum, duration);
    html += buildCrewRoster(state);
    html += '</aside>';
    html += '</div>';

    html += buildActionDeck(actions, selectedIdx);
    html += '<div class="hud-continue-wrap"><button class="hud-continue-btn" id="hud-continue">CONTINUE</button></div>';
    html += '</div>';

    UI.render(html);
    state.lastHudAction = actions[selectedIdx] ? actions[selectedIdx].value : actions[0].value;
    bindGameplayHud(actions, selectedIdx);
  }

  function si(label, value) {
    return '<div class="status-row"><span class="status-label">' + label + ':</span><span class="status-value">' + value + '</span></div>';
  }

  function crewChip(name, health, alive, isForeman) {
    if (!alive) return '<span class="crew-chip crew-chip-dead">' + UI.escapeHtml(name) + ' \u2020</span>';
    var cls = 'crew-chip';
    if (health <= 34) cls += ' crew-chip-good';
    else if (health <= 69) cls += ' crew-chip-fair';
    else if (health <= 104) cls += ' crew-chip-poor';
    else cls += ' crew-chip-vpoor';
    if (isForeman) cls += ' crew-chip-foreman';
    var label = window.HealthSystem ? window.HealthSystem.getHealthLabel(health) : '';
    return '<span class="' + cls + '">' + UI.escapeHtml(name) + ' <span class="chip-health">' + label + '</span></span>';
  }

  // =========================================
  // ACTION HANDLER - routes all actions
  // =========================================
  function handleAction(action) {
    var state = gs();
    switch (action) {
      case 'mine':
        if (!canMineCurrentChamber(state)) {
          UI.showNotification('Descend deeper before you can mine', 1200);
          setTimeout(statusScreen, 1300);
          break;
        }
        chooseMiningApproach();
        break;
      case 'spring_heal': springHealDay(); break;
      case 'descend': attemptDescent(); break;
      case 'ascend': attemptAscent(); break;
      case 'doctrine': doctrineAdjustScreen(); break;
      case 'crew': crewAssignmentScreen(); break;
      case 'rest': restDay(); break;
      case 'enter': enterCave(); break;
      case 'town': visitTown(); break;
      case 'ship': shipGuano(); break;
      case 'music':
        if (window.Audio_Manager) {
          var on = Audio_Manager.toggle();
          UI.showNotification(on ? 'Music On' : 'Music Off', 1000);
        }
        statusScreen();
        break;
      default: statusScreen(); break;
    }
  }

  // =========================================
  // ACTION IMPLEMENTATIONS
  // =========================================

  function doctrineAdjustScreen() {
    UI.hideBars();
    var state = gs();
    if (!state || !window.Expedition) { statusScreen(); return; }
    var doctrine = window.Expedition.getDoctrine(state.expedition && state.expedition.doctrine);
    UI.render(renderReadablePanel(
      'Change Pace',
      'Pick a new pace.',
      {
        kicker: 'Crew orders',
        narrow: true
      }
    ));
    UI.promptChoice(window.Expedition.getDoctrineOptions(), function (value) {
      if (state.expedition && state.expedition.doctrine !== value) {
        state.morale = Math.max(0, (state.morale || 50) - 2);
        if (state.expedition && state.expedition.crew) {
          var ids = Object.keys(state.expedition.crew);
          for (var i = 0; i < ids.length; i++) {
            state.expedition.crew[ids[i]].pressure = Math.min(100, (state.expedition.crew[ids[i]].pressure || 0) + 3);
          }
        }
      }
      window.Expedition.setDoctrine(state, value);
      UI.showNotification('Pace: ' + window.Expedition.getDoctrine(value).name, 1200);
      setTimeout(function () { UI.transition(statusScreen); }, 1300);
    });
  }

  function changePace() { doctrineAdjustScreen(); }

  function changeRations() {
    doctrineAdjustScreen();
  }

  function handleDayAdvanceResult(state, result, onContinue, options) {
    options = options || {};
    if (!result) {
      if (typeof onContinue === 'function') onContinue();
      else statusScreen();
      return true;
    }
    if (result.deaths && result.deaths.length > 0) {
      showDayResults(result, function () {
        var cause = options.deathCause || (result.eventsTriggered && result.eventsTriggered.length > 0 ? result.eventsTriggered[0].eventName : 'the cave');
        deathScreen(result.deaths[0], cause);
      });
      return true;
    }
    if (state.gameOver) {
      showDayResults(result, function () { gameOverScreen(state.gameOverReason); });
      return true;
    }
    if (options.forceDisplay || (result.eventsTriggered && result.eventsTriggered.length > 0)) {
      showDayResults(result, typeof onContinue === 'function' ? onContinue : statusScreen);
      return true;
    }
    return false;
  }

  function enterCave() {
    var state = gs();
    if (state) {
      state.isUnderground = true;
      state.currentChamber = 'cathedral_entrance';
      state.currentZone = 'zone1';
      if (state.discoveredChambers.indexOf('cathedral_entrance') === -1) state.discoveredChambers.push('cathedral_entrance');
    }
    UI.transition(landmarkScreen);
  }

  function visitTown() {
    UI.hideBars();
    if (window.Town && window.Town.show) {
      window.Town.show(function () {
        UI.transition(statusScreen);
      });
    } else {
      // Fallback: just go to general store
      if (window.Store && window.Store.show) {
        window.Store.show(function () { UI.transition(statusScreen); });
      } else {
        statusScreen();
      }
    }
  }

  function attemptDescent() {
    UI.hideBars();
    var state = gs();
    if (!state) return;
    var chamber = getChamberData(state.currentChamber);
    if (!chamber) { UI.showNotification('Cannot descend', 1200); setTimeout(statusScreen, 1300); return; }

    var deeper = getDescendTargets(chamber);

    if (deeper.length === 0) {
      UI.render('<div class="text-amber">The stone offers no passage deeper. This is as far as the earth opens.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }
    if (state.rope < 20) {
      UI.render('<div class="text-red">Not enough rope. Twenty feet minimum or you\'re jumping blind.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }

    function descendTo(targetId) {
      var firstVisit = !state.visitedChambers || !state.visitedChambers[targetId];
      state.rope = Math.max(0, state.rope - 20);
      state.currentChamber = targetId;
      var nc = getChamberData(targetId);
      if (nc) state.currentZone = nc.zone;
      if (state.discoveredChambers.indexOf(targetId) === -1) state.discoveredChambers.push(targetId);

      if (window.Content) {
        var egg = window.Content.getEasterEgg(targetId);
        if (egg) {
          UI.render('<div class="event-highlight" style="margin:10px 0">' + egg.text.join('<br>') + '</div>');
          UI.pressEnter(function () { UI.transition(landmarkScreen); });
          return;
        }
      }
      state.travelDay = 'descend';
      var result = window.Engine ? window.Engine.advanceDay() : null;
      if (handleDayAdvanceResult(state, result, function () {
        if (firstVisit) UI.transition(landmarkScreen);
        else statusScreen();
      }, {
        forceDisplay: true,
        deathCause: 'the climb down'
      })) return;
      if (firstVisit) UI.transition(landmarkScreen);
      else statusScreen();
    }

    if (deeper.length === 1) {
      descendTo(deeper[0].id);
      return;
    }

    var html = renderReadablePanel(
      'Descent',
      deeper.length > 1 ? 'Pick the next passage.' : 'One route still goes on.',
      {
        kicker: chamber ? chamber.name : 'Underground',
        narrow: true,
        doubleRule: false
      }
    );
    var opts = [];
    for (var i = 0; i < deeper.length; i++) {
      var option = deeper[i];
      var targetId = option.id;
      var t = option.chamber || getChamberData(targetId);
      var label = t ? t.name : targetId;
      var desc = t ? getStatusTagline(t.id, t) : 'Unknown route.';
      var meta = '';
      if (option.routeKind === 'branch') {
        desc = 'Side branch. ' + desc;
        meta = 'Optional branch';
      } else {
        desc = 'Main route. ' + desc;
        meta = 'Main haul route';
      }
      if (t) {
        if (option.routeKind === 'main' && t.depth <= chamber.depth) {
          meta += ' - route continues below';
        } else {
          meta += ' - ' + t.depth + ' ft';
        }
      }
      opts.push({ key: String(i + 1), label: label, value: targetId, description: desc, meta: meta });
    }
    opts.push({ key: '0', label: 'Stay here', value: 'back', description: 'Keep your footing and do not spend rope.' });

    UI.render(html);
    UI.promptChoice(opts, function (val) {
      if (val === 'back') { statusScreen(); return; }
      descendTo(val);
    });
  }

  function attemptAscent() {
    var state = gs();
    if (!state) return;
    var chamber = getChamberData(state.currentChamber);
    if (!chamber) return;

    var ascentTarget = window.CaveData && window.CaveData.getAscendTarget
      ? window.CaveData.getAscendTarget(state.currentChamber)
      : null;

    if (!ascentTarget) {
      // At the top - exit cave
      state.isUnderground = false;
      state.currentChamber = 'marmaros';
      state.currentZone = 'surface';
      state.travelDay = 'surface_ascent';
      var surfaceResult = window.Engine ? window.Engine.advanceDay() : null;
      if (handleDayAdvanceResult(state, surfaceResult, function () { statusScreen(); }, {
        forceDisplay: true,
        deathCause: 'the climb out'
      })) return;
      statusScreen();
      return;
    }

    state.currentChamber = ascentTarget.id;
    var t = getChamberData(ascentTarget.id);
    if (t) state.currentZone = t.zone;

    if (ascentTarget.id === 'marmaros' || !t) {
      state.isUnderground = false;
      state.currentChamber = 'marmaros';
      state.currentZone = 'surface';
      state.travelDay = 'surface_ascent';
      var topResult = window.Engine ? window.Engine.advanceDay() : null;
      if (handleDayAdvanceResult(state, topResult, function () { statusScreen(); }, {
        forceDisplay: true,
        deathCause: 'the climb out'
      })) return;
    } else {
      state.travelDay = 'ascend';
      var climbResult = window.Engine ? window.Engine.advanceDay() : null;
      if (handleDayAdvanceResult(state, climbResult, function () { statusScreen(); }, {
        forceDisplay: true,
        deathCause: 'the climb'
      })) return;
    }
    statusScreen();
  }

  function restDay() {
    UI.hideBars();
    var state = gs();
    if (!state) return;

    if (state.isUnderground) {
      var campfireFrame = '';
      if (window.AsciiArt && window.AsciiArt.getAnimation) {
        var campfire = window.AsciiArt.getAnimation('campfire');
        if (campfire && campfire.frames && campfire.frames.length > 0) campfireFrame = campfire.frames[0];
      }
      var campHtml = '<div class="text-lg text-glow">Camp in the Dark</div><hr class="separator">';
      if (campfireFrame) campHtml += '<pre class="title-art">' + UI.escapeHtml(campfireFrame) + '</pre>';
      campHtml += '<div class="text-dim" style="font-style:italic">' + UI.escapeHtml(getRandomCrewCampQuote(state)) + '</div>';
      UI.render(campHtml);
      UI.pressEnter(function () { resolveRestDay(state); });
      return;
    }

    resolveRestDay(state);
  }

  function springHealDay() {
    UI.hideBars();
    var state = gs();
    if (!state) return;
    var worstBefore = getWorstHealthValue(state);
    var originalPace = state.workPace;
    state.workPace = 'careful';
    state.restingDay = true;
    var result = window.Engine ? window.Engine.advanceDay() : null;
    state.workPace = originalPace;
    if (window.HealthSystem && window.HealthSystem.applyPartyHealing) {
      var healed = window.HealthSystem.applyPartyHealing(state, 36);
      if (result && healed.length) {
        result.messages.unshift('The Spring Room gives the crew a day back.');
        result.messages.splice(1, 0, getRecoveryShiftLine(worstBefore, getWorstHealthValue(state)));
      }
    }
    if (handleDayAdvanceResult(state, result, statusScreen)) return;
    renderScenePanel({
      kicker: 'Sanctuary',
      headline: 'The spring gives the line a day back.',
      subline: getRecoveryShiftLine(worstBefore, getWorstHealthValue(state)),
      note: ''
    });
    UI.pressEnter(function () { statusScreen(); });
  }

  function resolveRestDay(state) {
    var worstBefore = getWorstHealthValue(state);
    var orig = state.workPace;
    var restingUnderground = !!state.isUnderground;
    var chamberPersona = restingUnderground && window.Expedition && window.Expedition.getChamberPersona
      ? window.Expedition.getChamberPersona(state.currentChamber)
      : null;
    state.workPace = 'careful';
    state.restingDay = true;

    if (window.Engine) {
      var r = window.Engine.advanceDay();
      state.workPace = orig;
      if (window.HealthSystem && window.HealthSystem.applyPartyHealing) {
        var healAmount = restingUnderground
          ? (chamberPersona && chamberPersona.tags && chamberPersona.tags.indexOf('sanctuary') !== -1 ? 24 : 20)
          : 24;
        var healed = window.HealthSystem.applyPartyHealing(state, healAmount);
        if (healed.length > 0) {
          r.messages.unshift('Real rest takes hold. The whole line comes back stronger.');
          r.messages.splice(1, 0, getRecoveryShiftLine(worstBefore, getWorstHealthValue(state)));
        }
      }
      var dayArt = (window.AsciiArt && window.AsciiArt.getGameplayArt) ? window.AsciiArt.getGameplayArt(state.isUnderground ? 'night' : 'day') : '';
      var restMessages = summarizeMessages(r && r.messages ? r.messages : [], 2);
      renderScenePanel({
        art: dayArt,
        kicker: state.isUnderground ? 'Underground Rest' : 'Surface Rest',
        headline: state.isUnderground ? pick(TEXT_VARIANTS.restUnderground) : pick(TEXT_VARIANTS.restSurface),
        subline: restMessages[0] || '',
        note: restMessages[1] || ''
      });
    } else {
      state.workPace = orig;
      renderScenePanel({
        kicker: 'Rest',
        headline: 'The crew rests.',
        subline: 'Slow recovery is still recovery.'
      });
    }
    if (state.gameOver) {
      UI.pressEnter(function () { gameOverScreen(state.gameOverReason); });
      return;
    }
    UI.pressEnter(function () { statusScreen(); });
  }

  function shipGuano(options) {
    options = options || {};
    UI.hideBars();
    var state = gs();
    if (!state || state.guanoStockpile <= 0) {
      UI.render(renderReadablePanel(
        'Turn In Guano',
        'No sacks are ready for the company clerk.',
        { kicker: 'Company yard', narrow: true, brand: true }
      ));
      UI.pressEnter(function () {
        if (typeof options.onComplete === 'function') options.onComplete();
        else statusScreen();
      });
      return;
    }

    var companyRate = state.companySalePrice || (window.Economy ? window.Economy.GUANO_PRICE_PER_TON : 700);
    var payPerTon = window.Economy && window.Economy.getEffectivePayPerTon
      ? window.Economy.getEffectivePayPerTon(state)
      : (window.Economy ? window.Economy.getPayPerTon(state) : Math.round(companyRate * 0.10 * 100) / 100);
    var tons = state.guanoStockpile;
    var payout = Math.round(tons * payPerTon * 100) / 100;
    var loadClass = tons >= 3 ? 'Heavy load' : (tons >= 1.5 ? 'Good load' : 'Light load');
    var shipBody = '<div class="detail-card-grid detail-card-grid--two">';
    shipBody += '<div class="detail-card detail-card-good"><div class="detail-card-label">Load Ready</div><div class="detail-card-value">' + UI.escapeHtml(loadClass) + '</div><div class="detail-card-note">' + UI.escapeHtml(tons.toFixed(1) + ' tons stacked at the yard') + '</div></div>';
    shipBody += '<div class="detail-card detail-card-warn"><div class="detail-card-label">Your Cut</div><div class="detail-card-value">' + UI.escapeHtml(UI.formatMoney(payout)) + '</div><div class="detail-card-note">Only today\'s yard load pays out.</div></div>';
    shipBody += '</div>';
    UI.render(renderReadablePanel(
      'Turn In Guano',
      'Hand the sacks over. Take your share.',
      {
        kicker: 'Company yard',
        narrow: true,
        brand: true,
        bodyHtml: shipBody
      }
    ));

    UI.promptChoice([
      { key: '1', label: 'Settle the load', value: 'all' },
      { key: '2', label: 'Hold until tomorrow', value: 'hold' },
      { key: '0', label: 'Back', value: 'no' }
    ], function (v) {
      if (v === 'no') {
        if (typeof options.onComplete === 'function') options.onComplete();
        else statusScreen();
        return;
      }
      if (v === 'hold') {
      UI.render(renderReadablePanel(
        'Hold The Load',
        'You leave the sacks stacked for another day.',
        { kicker: 'Company yard', narrow: true, brand: true }
      ));
        UI.pressEnter(function () {
          if (typeof options.onComplete === 'function') options.onComplete();
          else statusScreen();
        });
        return;
      }

      state.guanoShipped += tons;
      state.bestShipmentTons = Math.max(state.bestShipmentTons || 0, tons);
      state.guanoStockpile = 0;
      state.totalRevenue = Math.round(((state.totalRevenue || 0) + payout) * 100) / 100;
      state.cash = Math.round((state.cash + payout) * 100) / 100;
      state.companyGrossSales = Math.round(((state.companyGrossSales || 0) + (tons * companyRate)) * 100) / 100;
      var settledBody = '<div class="detail-card-grid detail-card-grid--two">';
      settledBody += '<div class="detail-card detail-card-warn"><div class="detail-card-label">Paid Out</div><div class="detail-card-value">' + UI.escapeHtml(UI.formatMoney(payout)) + '</div><div class="detail-card-note">Your cut for this yard load.</div></div>';
      settledBody += '<div class="detail-card detail-card-good"><div class="detail-card-label">Yard</div><div class="detail-card-value">Cleared</div><div class="detail-card-note">' + UI.escapeHtml(tons.toFixed(1) + ' tons moved onto the company books') + '</div></div>';
      settledBody += '</div>';
      UI.render(renderReadablePanel(
        'Load Settled',
        'Campbell clears the yard and counts out your share.',
        {
          kicker: 'Company yard',
          narrow: true,
          brand: true,
          bodyHtml: settledBody
        }
      ));
      UI.pressEnter(function () {
        if (typeof options.onComplete === 'function') options.onComplete();
        else statusScreen();
      });
    });
    var shipMenu = document.getElementById('menu-choices');
    if (shipMenu) shipMenu.classList.add('settlement-menu-options');
  }

  function crewAssignmentScreen() {
    UI.hideBars();
    var state = gs();
    if (!state) return;
    var roster = [state.foreman].concat(state.crew || []);
    var pressureTotal = 0;
    var pressureCount = 0;
    for (var i = 0; i < roster.length; i++) {
      if (!roster[i] || !roster[i].alive) continue;
      var profile = window.Expedition && window.Expedition.getCrewData ? window.Expedition.getCrewData(state, roster[i]) : null;
      pressureTotal += profile ? (profile.pressure || 0) : 0;
      pressureCount++;
    }
    var avgPressure = pressureCount ? Math.round(pressureTotal / pressureCount) : 0;
    var moodSummary = window.Expedition && window.Expedition.getCrewMoodLabel
      ? window.Expedition.getCrewMoodLabel({ pressure: avgPressure })
      : 'Steady';
    var moodTone = window.Expedition && window.Expedition.getCrewMoodTone
      ? window.Expedition.getCrewMoodTone({ pressure: avgPressure })
      : 'good';
    var body = '<div class="detail-card-grid detail-card-grid--three">';
    body += buildDetailCard('Crew', countAlive(state) + '/' + roster.length, 'still answering the roll', countAlive(state) === roster.length ? 'good' : 'warn');
    body += buildDetailCard('Morale', clampPct(state.morale || 50) + '%', 'whole line mood', getToneFromPct(state.morale || 50));
    body += buildDetailCard('Strain', moodSummary, 'how the line is holding', moodTone);
    body += '</div>';
    body += '<div class="roll-call-grid">';
    for (var i = 0; i < roster.length; i++) {
      var member = roster[i];
      if (!member) continue;
      body += buildCrewConditionCard(member, i === 0, state);
    }
    body += '</div>';
    UI.render(renderReadablePanel(
      'Crew Condition',
      countAlive(state) === roster.length ? 'All hands answer the roll.' : 'The line is still carrying the cost of the cave.',
      {
        kicker: 'Roll call',
        narrow: true,
        meta: ['Pace ' + formatStateLabel(state.workPace || 'steady')],
        bodyHtml: body
      }
    ));
    UI.pressEnter(function () { statusScreen(); });
  }

  function supplyScreen() {
    UI.hideBars();
    var state = gs();
    if (!state) return;
    var foodPerDay = state.rationLevel === 'half' ? 1.2 : state.rationLevel === 'scraps' ? 0.6 : state.rationLevel === 'none' ? 0 : 2.4;
    var foodDays = foodPerDay > 0 ? Math.floor(state.food / (foodPerDay * Math.max(1, countAlive(state)))) : 99;
    var oilShifts = Math.floor(state.lanternOil / 0.5);
    var ropeDrops = Math.floor(state.rope / 20);
    var body = '<div class="detail-card-grid detail-card-grid--two">';
    body += buildDetailCard('Cash', UI.formatMoney(state.cash), 'on hand', state.cash >= 8 ? 'good' : 'warn');
    body += buildDetailCard('Guano', state.guanoStockpile.toFixed(1) + ' tons', 'waiting in sacks', state.guanoStockpile >= 1 ? 'good' : 'warn');
    body += buildDetailCard('Food & Water', String(foodDays) + ' days', 'at current rations', foodDays >= 4 ? 'good' : 'danger');
    body += buildDetailCard('Oil', String(oilShifts) + ' shifts', 'lamp reserve', oilShifts >= 4 ? 'good' : 'warn');
    body += buildDetailCard('Rope', String(ropeDrops) + ' drops', 'safe descents left', ropeDrops >= 4 ? 'good' : 'warn');
    body += buildDetailCard('Pace', formatStateLabel(state.workPace || 'steady'), 'how the crew is working', state.workPace === 'careful' ? 'good' : (state.workPace === 'steady' ? 'warn' : 'danger'));
    body += '</div>';
    body += '<div class="summary-strip">';
    body += '<div class="summary-strip-copy">Guano mined: <span class="text-bright">' + state.guanoMined.toFixed(1) + ' tons</span></div>';
    body += '<div class="summary-strip-copy">Turned in: <span class="text-bright">' + state.guanoShipped.toFixed(1) + ' tons</span></div>';
    body += '</div>';
    UI.render(renderReadablePanel(
      'Expedition Ledger',
      'What keeps the crew working and paid.',
      { kicker: 'Quick read', narrow: true, bodyHtml: body }
    ));
    UI.pressEnter(function () { statusScreen(); });
  }

  function chooseMiningApproach() {
    var state = gs();
    if (!state) return;
    state.miningChoice = 'main_vein';
    runChoiceEncounterThenMine();
  }

  function runEncounter(encounter, onDone) {
    var state = gs();
    var art = (window.AsciiArt && window.AsciiArt.getEventArt) ? (window.AsciiArt.getEventArt('rockfall') || '') : '';
    var html = '';
    if (art) html += '<pre class="title-art">' + UI.escapeHtml(art) + '</pre>';
    html += renderReadablePanel(
      encounter.title,
      encounter.text,
      {
        kicker: encounter.kicker || 'Decision',
        narrow: true
      }
    );
    UI.render(html);
    var opts = [];
    for (var i = 0; i < encounter.options.length; i++) {
      opts.push({ key: encounter.options[i].key, label: encounter.options[i].label, value: String(i) });
    }
    UI.promptChoice(opts, function (value) {
      var result = encounter.options[parseInt(value, 10)].apply(state) || {};
      var lines = result.lines || (Array.isArray(result) ? result : ['Done.']);
      UI.render(renderReadablePanel(
        encounter.title,
        lines[0] || 'Done.',
        {
          kicker: encounter.kicker || 'Decision',
          narrow: true
        }
      ));
      UI.pressEnter(function () {
        if (onDone) onDone(result);
      });
    });
  }

  function runChoiceEncounterThenMine() {
    var state = gs();
    if (!state) { advanceGame(); return; }
    if (window.Expedition && window.Expedition.maybeGetSetPiece) {
      var setPiece = window.Expedition.maybeGetSetPiece(state);
      if (setPiece) {
        runEncounter(setPiece, function (result) {
          if (result && result.advanceDay) {
            advanceGame();
          } else {
            statusScreen();
          }
        });
        return;
      }
    }
    if (!window.EventSystem || !window.EventSystem.maybeGetChoiceEncounter) { advanceGame(); return; }
    var enc = window.EventSystem.maybeGetChoiceEncounter(state);
    if (!enc) { advanceGame(); return; }
    runEncounter(enc, function () { advanceGame(); });
  }

  // =========================================
  // GAME ADVANCE (mine for a day)
  // =========================================
  function advanceGame() {
    var state = gs();
    if (!state) return;

    if (window.Engine) {
      var prevBase = window.Engine.BASE_MINING_RATE;
      if (state.dailyYieldMultiplier && state.dailyYieldMultiplier > 0) {
        window.Engine.BASE_MINING_RATE = prevBase * state.dailyYieldMultiplier;
      }
      var r = window.Engine.advanceDay();
      window.Engine.BASE_MINING_RATE = prevBase;
      state.dailyYieldMultiplier = 0;
      if (handleDayAdvanceResult(state, r, function () { statusScreen(); })) return;
      // Normal day - just go back to status
      statusScreen();
    } else {
      // Fallback if engine not loaded
      var alive = countAlive(state) - (state.foreman.alive ? 1 : 0);
      state.food = Math.max(0, state.food - alive * 2.4);
      if (state.isUnderground) state.lanternOil = Math.max(0, state.lanternOil - 0.5);
      state.guanoMined += alive * 0.05;
      state.guanoStockpile += alive * 0.05;
      if (window.GameState && window.GameState.advanceDate) window.GameState.advanceDate(1);
      statusScreen();
    }
  }

  function showDayResults(r, cb) {
    UI.hideBars();
    var artKey = 'mining';
    if (r.travelDay === 'descend') artKey = 'descend';
    else if (r.travelDay === 'ascend' || r.travelDay === 'surface_ascent') artKey = 'ascend';
    else if (r.guanoMinedToday <= 0) artKey = gs() && gs().isUnderground ? 'night' : 'day';
    var mineArt = (window.AsciiArt && window.AsciiArt.getGameplayArt) ? window.AsciiArt.getGameplayArt(artKey) : '';
    var leadLine = r.guanoMinedToday && r.guanoMinedToday > 0 ? pick(TEXT_VARIANTS.mining) : pick(TEXT_VARIANTS.dayAdvance);
    if (r.travelDay === 'descend') leadLine = pick(TEXT_VARIANTS.descend);
    else if (r.travelDay === 'ascend' || r.travelDay === 'surface_ascent') leadLine = pick(TEXT_VARIANTS.ascend);
    var html = '<div class="scene-panel">';
    if (mineArt) html += '<pre class="title-art">' + UI.escapeHtml(mineArt) + '</pre>';
    html += '<div class="scene-kicker">Day ' + (r.day || '?') + ' &mdash; ' + formatDate(gs()) + '</div>';
    html += '<div class="scene-copy">' + UI.escapeHtml(leadLine) + '</div>';
    html += '<div class="result-stack">';
    var shown = 0;
    var limit = r.travelDay ? 2 : 3;
    for (var i = 0; i < r.messages.length; i++) {
      var msg = r.messages[i];
      if (msg.indexOf('MILESTONE_') === 0) {
        var mArt = '';
        if (window.AsciiArt && window.AsciiArt.getGameplayArt) {
          if (msg === 'MILESTONE_25') mArt = window.AsciiArt.getGameplayArt('milestone25');
          if (msg === 'MILESTONE_50') mArt = window.AsciiArt.getGameplayArt('milestone50');
          if (msg === 'MILESTONE_75') mArt = window.AsciiArt.getGameplayArt('milestone75');
        }
        if (mArt) html += '<pre class="title-art">' + UI.escapeHtml(mArt) + '</pre>';
        continue;
      }
      if (shown >= limit) continue;
      var cls = msg.indexOf('SHORTAGE') >= 0 || msg.indexOf('collapse') >= 0 || msg.indexOf('dragged clear') >= 0 || msg.indexOf('hauled toward cleaner air') >= 0 ? 'text-red' :
        msg.indexOf('Payment') >= 0 || msg.indexOf('Mined') >= 0 ? 'text-green' : 'text-amber';
      html += '<div class="result-line ' + cls + '">' + UI.escapeHtml(msg) + '</div>';
      shown++;
    }
    html += '</div>';
    if (r.eventsTriggered && r.eventsTriggered.length > 0 && window.AsciiArt && window.AsciiArt.getEventArt) {
      var eId = r.eventsTriggered[0].eventId || '';
      var eArt = window.AsciiArt.getEventArt(eId);
      if (eArt) html += '<pre class="title-art">' + UI.escapeHtml(eArt) + '</pre>';
    }
    html += '</div>';
    UI.render(html);
    UI.pressEnter(cb);
  }

  function buildFinaleStat(label, value, toneClass, extraClass) {
    return '<div class="finale-stat' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<div class="finale-stat-label">' + UI.escapeHtml(label) + '</div>' +
      '<div class="finale-stat-value' + (toneClass ? ' ' + toneClass : '') + '">' + UI.escapeHtml(value) + '</div>' +
      '</div>';
  }

  function getRunDebrief(state, outcome) {
    if (!state) return '';
    var totalCrew = 1 + (state.crew ? state.crew.length : 0);
    var allAlive = countAlive(state) === totalCrew;
    if (outcome === 'success') {
      if (allAlive) return 'All three came home, and that decided the run.';
      if ((state.bestShipmentTons || 0) >= 2) return 'One strong yard load carried the contract farther than anything else.';
      if (state.expedition && state.expedition.moments && (state.expedition.moments.maxDepth || 0) >= 450) return 'The deepest chambers paid back the risk.';
      if ((state.morale || 0) >= 65) return 'The line stayed steadier than the cave expected.';
      return 'The lamps held long enough to make the haul count.';
    }
    if ((state.foodShortageDays || 0) >= 2 || /food|water/i.test(state.gameOverReason || '')) return 'Food & Water failed before anything else.';
    if ((state.lanternOil || 0) <= 0 || /oil|lamp/i.test(state.gameOverReason || '')) return 'The lamps gave out before the mountain did.';
    if ((state.rope || 0) <= 0 || /rope/i.test(state.gameOverReason || '')) return 'Rope ran short, and the cave got stronger from there.';
    if ((state.morale || 0) <= 20 || /morale/i.test(state.gameOverReason || '')) return 'Morale broke before the line did.';
    return 'Attrition beat the contract a little at a time.';
  }

  function getFinalePayload(outcome, state, reason, scoreData) {
    var survivors = countAlive(state);
    var totalCrew = 1 + state.crew.length;
    var hauled = (state.guanoMined || 0).toFixed(1) + ' tons';
    var cash = UI.formatMoney(state.cash || 0);
    var allAlive = survivors === totalCrew;
    var discovered = (state.discoveredChambers || []).length;
    var rank = scoreData && window.Scoring ? window.Scoring.getRank(scoreData.finalScore) : '';
    var archetype = window.Expedition && window.Expedition.getEndingArchetype ? window.Expedition.getEndingArchetype(state, outcome) : null;

    if (archetype) {
      return {
        imageKey: outcome === 'success' ? 'victory' : 'town',
        kicker: outcome === 'success' ? 'Books closed' : 'Expedition ended',
        title: archetype.title,
        lead: archetype.lead,
        body: archetype.body,
        rank: rank
      };
    }

    if (outcome === 'success') {
      var settlement = state.finalSettlement || { autoSoldTons: 0 };
      var settlementNote = settlement.autoSoldTons > 0
        ? ' The clerk weighs the last ' + settlement.autoSoldTons.toFixed(1) + ' tons still stacked in sacks.'
        : '';
      var successTitle = allAlive ? 'You Beat The Devil\'s Den' : 'Twenty Days Under';
      var successLead = 'Twenty hard days end with ' + hauled + ' pulled out of the Den and the company books settled.';
      var successBody = [
        allAlive
          ? 'All three come back into daylight, and Marmaros counts that as a win worth remembering.' + settlementNote
          : 'The books close in your favor, even if the mountain made the line pay for it.' + settlementNote
      ];

      return {
        imageKey: 'victory',
        kicker: 'Books closed',
        title: successTitle,
        lead: successLead,
        body: successBody,
        rank: rank
      };
    }

    var failureTitle = 'The Contract Breaks First';

    var failureBody = [
      hauled !== '0.0 tons'
        ? 'You come back with enough to remember and not enough to call it a win.'
        : 'The mountain keeps the haul and leaves you with the lesson.'
    ];

    return {
      imageKey: 'town',
      kicker: 'Expedition ended',
      title: failureTitle,
      lead: 'The twenty-day gamble is over.',
      body: failureBody,
      rank: rank
    };
  }

  function finaleScreen(outcome, reason) {
    UI.hideBars();
    var state = gs();
    if (!state) { titleScreen(); return; }

    if (window.Economy && window.Economy.settleFinalAccounts && !state.finalSettlement) {
      window.Economy.settleFinalAccounts(state);
    }

    if (window.Audio_Manager) {
      Audio_Manager.play(outcome === 'success' ? 'title' : 'gameover');
    }

    var scoreData = window.Scoring ? window.Scoring.calculateScore(state) : null;
    if (scoreData && window.Scoring && !state.finalScoreRecorded) {
      window.Scoring.saveScore(state.foreman.name, scoreData.finalScore, getScoreDetails(state));
      state.finalScoreRecorded = true;
    }
    if (window.Expedition && window.Expedition.recordLegacy) {
      window.Expedition.recordLegacy(state, outcome, reason, scoreData);
    }

    var payload = getFinalePayload(outcome, state, reason, scoreData);
    var debrief = getRunDebrief(state, outcome);
    var crewHome = countAlive(state) + '/' + (1 + state.crew.length);
    var maxDepth = getMaxDepthReached(state);
    var finaleArt = window.AsciiArt && window.AsciiArt.getScoringArt
      ? window.AsciiArt.getScoringArt(outcome === 'success' ? 'trophy' : 'ledger')
      : '';
    var html = '';
    if (finaleArt) {
      html += '<div class="native-art-panel native-art-panel--finale">';
      html += '<pre class="title-art title-art--scene">' + UI.escapeHtml(finaleArt) + '</pre>';
      html += '</div>';
    }
    html += '<div class="finale-screen">';
    html += '<div class="finale-kicker">' + UI.escapeHtml(payload.kicker) + '</div>';
    html += '<div class="finale-title text-glow-strong">' + UI.escapeHtml(payload.title) + '</div>';
    html += '<div class="finale-lead">' + UI.escapeHtml(payload.lead) + '</div>';
    if (payload.rank) {
      html += '<div class="finale-banner"><span class="finale-banner-label">Remembered As</span><span class="finale-banner-value">' + UI.escapeHtml(payload.rank) + '</span></div>';
    }
    html += '<div class="finale-body">';
    var bodyLines = (payload.body || []).slice(0, 1);
    for (var i = 0; i < bodyLines.length; i++) {
      html += '<p class="finale-paragraph' + (i === 1 ? ' finale-paragraph--echo' : '') + '">' + UI.escapeHtml(bodyLines[i]) + '</p>';
    }
    html += '</div>';
    if (debrief) {
      html += '<div class="finale-debrief">' + UI.escapeHtml(debrief) + '</div>';
    }
    html += '<div class="finale-stat-grid">';
    html += buildFinaleStat('Cut Earned', UI.formatMoney(state.cash || 0), state.cash >= 0 ? 'stat-tone-warn' : 'stat-tone-danger', 'finale-stat--featured');
    html += buildFinaleStat('Guano Hauled', (state.guanoMined || 0).toFixed(1) + 't', 'stat-tone-good');
    html += buildFinaleStat('Line Home', crewHome, countAlive(state) === (1 + state.crew.length) ? 'stat-tone-good' : 'stat-tone-danger');
    html += buildFinaleStat('Depth Reached', maxDepth + ' ft', 'stat-tone-warn');
    html += '</div>';
    html += '</div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Top Ten', value: 'top' },
      { key: '2', label: 'Play Again', value: 'again' },
      { key: '3', label: 'Title', value: 'title' }
    ], function (v) {
      if (v === 'top') UI.transition(function () { topTenScreen(true); });
      else if (v === 'again') UI.transition(professionScreen);
      else UI.transition(titleScreen);
    });
    var finaleMenu = document.getElementById('menu-choices');
    if (finaleMenu) finaleMenu.classList.add('finale-menu-options');
  }

  // =========================================
  // RESCUE SCREEN
  // =========================================
  function deathScreen(name, cause) {
    UI.hideBars();
    if (window.Audio_Manager && window.Audio_Manager.playForContext) window.Audio_Manager.playForContext(gs());
    var rescueLead = (name || 'The crewman') + ' goes down hard, but the line gets them back out of it.';
    var rescueNote = cause
      ? 'Too close on ' + cause + '. Everybody remembers it.'
      : 'Too close for comfort. Close enough to change the next decision.';
    UI.render(renderReadablePanel(
      'Narrow Escape',
      rescueLead,
      {
        kicker: 'Pulled clear',
        narrow: true,
        note: rescueNote
      }
    ));
    UI.pressEnter(function () {
      statusScreen();
    });
  }

  // =========================================
  // GAME OVER
  // =========================================
  function gameOverScreen(reason) {
    var state = gs();
    finaleScreen(state && state.completedRun ? 'success' : 'failure', reason);
  }

  // =========================================
  // ENDING
  // =========================================
  function endingScreen() {
    finaleScreen('success');
  }

  // =========================================
  // SCORING
  // =========================================
  function scoringScreen() {
    UI.hideBars();
    var state = gs();
    if (!state) { titleScreen(); return; }
    var bd = window.Scoring ? window.Scoring.calculateScore(state) : null;

    var html = '<div class="text-lg text-glow text-center">Final Score</div><hr class="separator-double"><table class="score-table">';
    if (bd) {
      html += sr('Survivors', bd.survivors) + sr('Resources', bd.resources) + sr('Full Run', bd.contracts) + sr('Discoveries', bd.discoveries);
      html += '<tr class="score-total"><td>Subtotal</td><td>' + bd.subtotal + '</td></tr></table>';
      if (bd.multiplierReasons.length > 0) {
        html += '<div class="text-dim" style="margin:6px 0">Multipliers:</div>';
        for (var i = 0; i < bd.multiplierReasons.length; i++) html += '<div class="text-amber text-sm">  ' + bd.multiplierReasons[i] + '</div>';
      }
      html += '<table class="score-table"><tr class="score-total"><td>FINAL SCORE</td><td>' + bd.finalScore + '</td></tr></table>';
      html += '<div class="text-center text-glow" style="margin:12px 0;font-size:14px">' + window.Scoring.getRank(bd.finalScore) + '</div>';
      window.Scoring.saveScore(state.foreman.name, bd.finalScore, getScoreDetails(state));
    } else {
      var tot = Math.floor(state.guanoShipped * 100 + countAlive(state) * 200 + state.discoveredChambers.length * 50);
      html += sr('Guano', Math.floor(state.guanoShipped * 100)) + sr('Survivors', countAlive(state) * 200) + sr('Exploration', state.discoveredChambers.length * 50);
      html += '<tr class="score-total"><td>TOTAL</td><td>' + tot + '</td></tr></table>';
    }

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Top Ten', value: 'top' },
      { key: '2', label: 'Play Again', value: 'again' },
      { key: '3', label: 'Title', value: 'title' }
    ], function (v) {
      if (v === 'top') UI.transition(function () { topTenScreen(true); });
      else if (v === 'again') UI.transition(professionScreen);
      else UI.transition(titleScreen);
    });
  }

  function sr(l, p) { return '<tr><td>' + l + '</td><td>' + p + '</td></tr>'; }

  // =========================================
  // TOP TEN
  // =========================================
  function topTenScreen(fromScore) {
    UI.hideBars();
    var scores = window.Scoring ? window.Scoring.getTopTen() : [];
    var html = '<div class="text-lg text-glow text-center">Top Ten Expeditions</div><hr class="separator-double">';
    if (scores.length === 0) html += '<div class="text-center text-dim" style="margin:20px 0">No scores yet.</div>';
    else {
      for (var i = 0; i < scores.length; i++) {
        html += '<div class="leaderboard-entry"><span class="leaderboard-rank">' + (i + 1) + '.</span>' +
          '<span class="leaderboard-name">' + UI.escapeHtml(scores[i].name) + '</span>' +
          '<span class="leaderboard-score">' + scores[i].score + '</span></div>';
      }
    }
    UI.render(html);
    if (fromScore) {
      UI.promptChoice([
        { key: '1', label: 'Play Again', value: 'a' },
        { key: '2', label: 'Title', value: 't' }
      ], function (v) { UI.transition(v === 'a' ? professionScreen : titleScreen); });
    } else {
      UI.pressEnter(function () { UI.transition(titleScreen); });
    }
  }

  // =========================================
  // LEARN ABOUT THE CAVE
  // =========================================
  function learnScreen() {
    UI.hideBars();
    var pages = [
      { title: 'The Osage and the Devil\'s Den', text: 'Long before miners, the Osage marked this sinkhole as dangerous ground. Bat noise, cold air, and hidden water gave the place its underworld reputation.' },
      { title: 'The Spanish Expeditions (1541)', text: 'Spanish explorers went down looking for gold and glory. They found neither, but their pine ladders turned up centuries later deep in the cave.' },
      { title: 'The Blow Expedition (1869)', text: 'Henry T. Blow\'s men dropped into the cave searching for lead. Lamplight fooled them into thinking limestone was marble, and the wrong name stuck.' },
      { title: 'Marvel Cave Mining Co. (Game Story)', text: 'In this telling, Jones and Powell turn the cave into a twenty-day guano contract business: company money up front, percentage pay on every load, and risk for everyone below.' },
      { title: 'Marmaros: The Mining Town', text: 'Marmaros sprang up fast above the cave with stores, workshops, and hopeful families. When the guano ran out, the town died with it.' },
      { title: 'The Cathedral Room', text: 'The Cathedral Room is so large it dwarfs anything the miners could build. Its debris cone, the Underground Mountain, rises like a second hill inside the cave.' },
      { title: 'The Lynch Era (1889-1927)', text: 'William Henry Lynch bought the cave, opened tours, and forced a road into the hills. His daughters later dropped the word Marble and renamed it Marvel Cave.' },
      { title: 'Silver Dollar City (1950-Present)', text: 'The Herschends modernized access, built the ride out, and turned the old mining settlement into a living 1880s town. That attraction became Silver Dollar City.' },
      { title: 'The Living Cave', text: 'Marvel Cave is still active, still wet, and still full of bats. The deepest public rooms run down to the Lost River and the waterfall chambers more than 500 feet below the ridge.' }
    ];
    var notesState = getFieldNotesState();
    showIndex();

    function markRead(idx) {
      notesState.readPages[idx] = true;
      notesState.lastPage = idx;
    }

    function showIndex() {
      UI.render(renderReadablePanel(
        'Field Notes',
        'Choose a page from the company folder.',
        {
          kicker: 'Reference file',
          narrow: true,
          meta: ['Pages ' + pages.length]
        }
      ));
      var options = [];
      for (var i = 0; i < pages.length; i++) {
        options.push({
          key: String(i + 1),
          label: pages[i].title,
          value: i,
          description: notesState.readPages[i] ? 'Read' : 'Unread',
          badge: notesState.lastPage === i ? 'CURRENT' : (notesState.readPages[i] ? 'READ' : 'NEW')
        });
      }
      options.push({ key: '0', label: 'Back', value: 'quit' });
      UI.promptChoice(options, function (v) {
        if (v === 'quit') {
          UI.transition(titleScreen);
          return;
        }
        show(v);
      }, {
        hideNav: true,
        extraKeys: {
          r: function () {
            show(notesState.lastPage || 0);
          }
        }
      });
    }

    function show(idx) {
      markRead(idx);
      UI.render(renderReadablePanel(
        pages[idx].title,
        pages[idx].text,
        {
          kicker: 'Field notes',
          narrow: true,
          meta: ['Page ' + (idx + 1) + ' of ' + pages.length]
        }
      ));
      var o = [];
      if (idx < pages.length - 1) o.push({ key: 'n', label: 'Next', value: 'n' });
      if (idx > 0) o.push({ key: 'p', label: 'Previous', value: 'p' });
      o.push({ key: 'i', label: 'Back to Index', value: 'i' });
      o.push({ key: '0', label: 'Exit', value: 'q' });
      UI.promptChoice(o, function (v) {
        if (v === 'n') show(idx + 1);
        else if (v === 'p') show(idx - 1);
        else if (v === 'i') showIndex();
        else UI.transition(titleScreen);
      }, { hideNav: true });
    }
  }

  // =========================================
  // EVENT SCREEN
  // =========================================
  function eventScreen(data) {
    UI.hideBars();
    if (!data) { statusScreen(); return; }
    var eArt = (window.AsciiArt && window.AsciiArt.getEventArt) ? window.AsciiArt.getEventArt((data.eventId || '').toLowerCase()) : '';
    var html = (eArt ? '<pre class="title-art">' + UI.escapeHtml(eArt) + '</pre>' : '');
    html += '<div class="text-lg text-glow">' + UI.escapeHtml(data.eventName || 'Event') + '</div><hr class="separator">';
    if (data.eventDescription) html += '<div class="text-amber">' + UI.escapeHtml(data.eventDescription) + '</div>';
    if (data.messages) {
      for (var i = 0; i < data.messages.length; i++) {
        var cls = data.messages[i].indexOf('collapse') >= 0 || data.messages[i].indexOf('dragged clear') >= 0 || data.messages[i].indexOf('hauled toward cleaner air') >= 0 ? 'text-red' : 'text-bright';
        html += '<div class="' + cls + '">' + UI.escapeHtml(data.messages[i]) + '</div>';
      }
    }
    UI.render(html);
    UI.pressEnter(function () { statusScreen(); });
  }

  // =========================================
  // PUBLIC API
  // =========================================
  window.Screens = {
    title: titleScreen,
    profession: professionScreen,
    crew: crewScreen,
    season: seasonScreen,
    doctrine: doctrineScreen,
    store: storeScreen,
    status: statusScreen,
    event: eventScreen,
    death: deathScreen,
    gameOver: gameOverScreen,
    ending: endingScreen,
    scoring: scoringScreen,
    topTen: topTenScreen,
    learn: learnScreen,
    supply: supplyScreen,
    shipGuano: shipGuano,
    advance: advanceGame,
    landmark: landmarkScreen,
    playFireInTheHole: playFireInTheHole
  };
})();
