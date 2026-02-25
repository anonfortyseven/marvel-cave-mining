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
    return '<span class="health-bad">Dead</span>';
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

  function getArt(chamberId) {
    if (window.AsciiArt && window.AsciiArt.getChamberArt) return window.AsciiArt.getChamberArt(chamberId);
    return '';
  }

  function getAmbient(chamberId) {
    if (window.AsciiArt && window.AsciiArt.getAmbientText) return window.AsciiArt.getAmbientText(chamberId);
    return '';
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
      { role: 'ropeman', lines: ['That rope held today. It\'ll hold tomorrow.', 'Tie it right tonight, and we live to laugh about this in town.'] },
      { role: 'lampkeeper', lines: ['I\'ll trim the wicks before dawn. We won\'t lose the light.', 'Oil\'s low, but I can make every drop count.'] },
      { role: 'blastman', lines: ['Stone\'s stubborn, but it always cracks in the end.', 'Tomorrow I\'ll place the charge cleaner. Less waste, more ore.'] },
      { role: 'cartdriver', lines: ['Donkeys are fed and calm. We\'ll haul fast at first light.', 'Tracks are muddy, but I can keep the loads moving.'] }
    ];
    var pick = pool[Math.floor(Math.random() * pool.length)];
    var crew = getCrewByRole(state, pick.role);
    var speaker = crew ? crew.name : 'A crewman';
    var line = pick.lines[Math.floor(Math.random() * pick.lines.length)];
    return speaker + ' says, "' + line + '"';
  }

  // =========================================
  // 1. TITLE SCREEN
  // =========================================
  function titleScreen() {
    UI.hideBars();
    if (window.Audio_Manager) Audio_Manager.play('title');

    var html = '';
    // Pixel art image
    if (window.Images) html += Images.getImageHtml('title');

    var art = (window.AsciiArt && window.AsciiArt.getTitleArt) ? window.AsciiArt.getTitleArt() : CAVE_ART;
    html += '<div class="title-art">' + art + '</div>\n';
    html += '<div class="title-name text-glow-strong">The Marvel Cave Mining Company</div>\n';
    html += '<div class="subtitle">Stone County, Missouri &bull; 1884</div>\n';
    html += '<div style="margin-top:16px"></div>';
    UI.render(html);
    // CRT boot flicker effect
    var screen = UI.getScreen();
    screen.classList.add('crt-boot');
    setTimeout(function () { screen.classList.remove('crt-boot'); }, 850);
    UI.animateBats();
    UI.promptChoice([
      { key: '1', label: 'Start a New Expedition', value: 'new' },
      { key: '2', label: 'Continue Saved Game', value: 'load' },
      { key: '3', label: 'Learn About the Cave', value: 'learn' },
      { key: '4', label: 'Top Ten Foremen', value: 'top' }
    ], function (val) {
      switch (val) {
        case 'new': UI.transition(professionScreen); break;
        case 'load':
          if (window.GameState && window.GameState.hasSave()) {
            window.GameState.load();
            UI.transition(statusScreen);
          } else {
            UI.showNotification('No saved game found', 1500);
          }
          break;
        case 'learn': UI.transition(learnScreen); break;
        case 'top': UI.transition(topTenScreen); break;
      }
    });
  }

  // =========================================
  // 2. PROFESSION SCREEN
  // =========================================
  function professionScreen() {
    UI.hideBars();
    var profs = window.CaveData ? window.CaveData.PROFESSIONS : {};
    var keys = ['mine_foreman', 'geologist', 'farmer', 'drifter'];

    var html = '<div class="text-lg text-glow">Choose Your Background</div>';
    html += '<hr class="separator-double">';
    html += '<div class="text-dim" style="margin:6px 0">Your 30-day mining contract with the Marble Cave Mining Co. begins now.</div>';

    for (var i = 0; i < keys.length; i++) {
      var p = profs[keys[i]];
      if (!p) continue;
      var crew = p.startingCrew + 1; // +1 for foreman
      html += '<div class="box" style="margin:6px 0"><div class="box-title">' + (i + 1) + '. ' + UI.escapeHtml(p.name) + '</div>';
      html += '<div class="text-bright">$' + p.startingMoney + ' &bull; ' + p.contractTarget + ' ton contract &bull; Crew: ' + crew + ' &bull; Score: x' + p.scoreMultiplier + '</div>';
      html += '<div class="text-dim">' + UI.escapeHtml(p.description) + '</div></div>';
    }

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Mine Foreman', value: 'mine_foreman' },
      { key: '2', label: 'Geologist', value: 'geologist' },
      { key: '3', label: 'Farmer Turned Miner', value: 'farmer' },
      { key: '4', label: 'Drifter', value: 'drifter' }
    ], function (val) {
      window.GameState.init({ profession: val });
      UI.transition(crewScreen);
    });
  }

  // =========================================
  // 3. CREW NAMING
  // =========================================
  function crewScreen() {
    UI.hideBars();
    var state = gs();
    var crewCount = state ? state.crew.length : 4;
    var totalCount = crewCount + 1; // +1 for foreman
    var names = [];
    UI.render('<div class="text-lg text-glow">Name Your Mining Crew</div><hr class="separator-double">' +
      '<div class="text-dim" style="margin:6px 0">Name your foreman and ' + crewCount + ' miner' + (crewCount !== 1 ? 's' : '') + '.</div>');
    askName(0);

    function askName(index) {
      var labels = ['Foreman', 'Rope Man', 'Lamp Keeper', 'Blast Man', 'Cart Driver'];
      var defaults = ['', 'Buck', 'Jesse', 'Hank', 'Earl'];
      if (index >= totalCount) { finishCrew(); return; }
      var label = labels[index] || ('Miner ' + index);
      var defVal = defaults[index] || label;
      UI.promptText(label + ': ', function (val) {
        if (!val) val = defVal;
        names.push(val);
        UI.append('<div class="text-green"> -> ' + UI.escapeHtml(label) + ': ' + UI.escapeHtml(val) + '</div>');
        if (index < totalCount - 1) askName(index + 1);
        else finishCrew();
      }, { defaultValue: defVal });
    }

    function finishCrew() {
      var state = gs();
      if (state) {
        state.foreman.name = names[0];
        for (var i = 0; i < state.crew.length; i++) if (names[i + 1]) state.crew[i].name = names[i + 1];
      }
      UI.append('<div style="margin-top:10px" class="text-bright">Your crew is assembled!</div>');
      UI.pressEnter(function () { UI.transition(seasonScreen); });
    }
  }

  // =========================================
  // 4. SEASON
  // =========================================
  function seasonScreen() {
    UI.hideBars();
    var html = '<div class="text-lg text-glow">Choose Starting Season</div><hr class="separator-double">';
    html += '<div class="text-dim" style="margin:6px 0">Your 30-day contract begins on the 1st of the month.</div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">1. Spring</div><div class="text-dim">March. Spring rains swell the Lost River. Flash flooding risk is severe.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">2. Summer</div><div class="text-dim">June. The 40,000-strong bat colony is at peak activity. The ammonia is choking.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">3. Fall</div><div class="text-dim">September. Bats begin hibernation in the Mammoth Room. The cave grows quiet.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">4. Winter</div><div class="text-dim">December. Ice at the Devil\'s Den entrance. Inflation doubled. Hard mode.</div></div>';
    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Spring (March)', value: 'spring' },
      { key: '2', label: 'Summer (June)', value: 'summer' },
      { key: '3', label: 'Fall (September)', value: 'fall' },
      { key: '4', label: 'Winter (December)', value: 'winter' }
    ], function (val) {
      var state = gs();
      if (state) {
        state.season = val;
        var m = { spring: 2, summer: 5, fall: 8, winter: 11 };
        state.date = new Date(1884, m[val], 1);
        state.startDate = new Date(1884, m[val], 1);
      }
      UI.transition(storeScreen);
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

    // Show chamber art line-by-line typewriter style
    var art = getArt(chamberId);
    var lines = window.Content ? window.Content.getLandmarkText(chamberId) : ['You descend into the cave...'];

    var html = '';
    if (art) html += '<pre class="chamber-art" id="landmark-art"></pre>';
    html += '<div id="landmark-text" style="white-space:pre-wrap;line-height:2"></div>';
    UI.render(html);

    var artEl = document.getElementById('landmark-art');
    var textEl = document.getElementById('landmark-text');

    // Typewriter: art lines, then description
    var artLines = art ? art.split('\n') : [];
    var artIdx = 0;

    function typeArtLine() {
      if (artIdx < artLines.length) {
        artEl.textContent += (artIdx > 0 ? '\n' : '') + artLines[artIdx];
        artIdx++;
        setTimeout(typeArtLine, 60);
      } else {
        // Now typewriter the description
        typeDescription(0);
      }
    }

    function typeDescription(i) {
      if (i < lines.length) {
        textEl.textContent += (i > 0 ? '\n' : '') + lines[i];
        setTimeout(function () { typeDescription(i + 1); }, 100);
      } else {
        UI.pressEnter(function () { UI.transition(statusScreen); });
      }
    }

    if (artLines.length > 0) {
      typeArtLine();
    } else {
      typeDescription(0);
    }
  }

  // =========================================
  // 6. STATUS SCREEN - THE MAIN GAMEPLAY HUB
  //    All actions visible in bottom action bar
  //    No submenu!
  // =========================================
  function statusScreen() {
    var state = gs();
    if (!state) { titleScreen(); return; }

    // Play context-appropriate music
    if (window.Audio_Manager) Audio_Manager.playForContext(state);

    // Update status bar
    UI.renderStatusBar(state);

    var chamber = getChamberData(state.currentChamber);
    var chamberName = chamber ? chamber.name : (state.isUnderground ? 'Unknown' : 'Marmaros');
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

    // === BUILD DASHBOARD ===
    var html = '';
    var duration = state.gameDuration || 30;
    var dayNum = Math.min(state.totalDays + 1, duration);
    var daysLeft = Math.max(0, duration - state.totalDays);

    // Chamber image (compact for dashboard)
    var chamberId = state.currentChamber || 'marmaros';
    if (window.Images) {
      html += state.isUnderground ? Images.getCaveImage(chamberId, true) : Images.getCaveImage('marmaros', true);
    }

    // Day counter (large, prominent)
    var dayClass = daysLeft <= 5 ? 'sb-danger' : (daysLeft <= 10 ? 'sb-warn' : '');
    html += '<div class="day-counter ' + dayClass + '">DAY ' + dayNum + ' of ' + duration + '</div>';

    // Date + location line
    html += '<div class="dash-location">';
    html += '<span class="text-dim">' + formatDate(state) + '</span> &bull; ';
    html += '<span class="text-bright">' + UI.escapeHtml(chamberName) + '</span>';
    if (state.isUnderground && depth > 0) html += ' <span class="text-dim">(' + depth + ' ft)</span>';
    html += '</div>';

    html += '<hr class="separator">';

    // Crew health row — compact chips
    html += '<div class="crew-row">';
    html += crewChip(state.foreman.name, state.foreman.health, state.foreman.alive, true);
    for (var i = 0; i < state.crew.length; i++) {
      html += crewChip(state.crew[i].name, state.crew[i].health, state.crew[i].alive, false);
    }
    if (state.donkeys.count > 0) {
      html += '<span class="crew-chip crew-chip-donkey">' + state.donkeys.count + ' donkey' + (state.donkeys.count > 1 ? 's' : '') + '</span>';
    }
    html += '</div>';

    // Resources grid (compact 2-column)
    var partySize = countAlive(state);
    var foodPerDay = 2.4;
    if (state.rationLevel === 'half') foodPerDay = 1.2;
    else if (state.rationLevel === 'scraps') foodPerDay = 0.6;
    else if (state.rationLevel === 'none') foodPerDay = 0;
    var totalFoodPerDay = foodPerDay * partySize + (state.donkeys ? state.donkeys.count : 0);
    var foodDays = totalFoodPerDay > 0 ? Math.floor(state.food / totalFoodPerDay) : 99;
    var oilDays = state.lanternOil > 0 ? Math.floor(state.lanternOil / 0.5) : 0;
    var foodCls = foodDays > 10 ? 'sb-ok' : (foodDays >= 4 ? 'sb-warn' : 'sb-danger');
    var oilCls = oilDays > 8 ? 'sb-ok' : (oilDays >= 3 ? 'sb-warn' : 'sb-danger');

    var morale = state.morale !== undefined ? state.morale : 50;
    var moraleCls = morale > 60 ? 'morale-high' : (morale > 30 ? 'morale-mid' : 'morale-low');

    html += '<div class="resource-grid">';
    html += si('Cash', '$' + state.cash.toFixed(0));
    html += si('Food', '<span class="' + foodCls + '">' + Math.round(state.food) + ' lbs (~' + foodDays + 'd)</span>');
    html += si('Oil', '<span class="' + oilCls + '">' + state.lanternOil.toFixed(1) + ' gal (~' + oilDays + 'd)</span>');
    html += si('Rope', state.rope + ' ft');
    html += si('Pace', state.workPace);
    html += si('Rations', state.rationLevel);
    html += '</div>';

    // Morale bar
    html += '<div class="dash-morale"><span class="status-label">Morale:</span> ' +
      '<span class="morale-bar"><span class="morale-fill ' + moraleCls + '" style="width:' + morale + '%"></span></span>' +
      ' <span class="text-dim">' + morale + '%</span></div>';

    // Guano contract progress (most prominent)
    html += '<div class="guano-progress-wrap">';
    html += '<div class="status-label">Contract: Guano ' + state.guanoShipped.toFixed(1) + ' / ' + state.contractTarget + ' tons';
    if (state.guanoStockpile > 0.01) html += ' <span class="text-dim">(+' + state.guanoStockpile.toFixed(2) + ' stockpiled)</span>';
    html += '</div>';
    html += UI.progressBar(state.guanoShipped, state.contractTarget);
    html += '</div>';

    // Chamber description (compact flavor)
    if (chamber && chamber.description) {
      html += '<div class="zone-desc">' + UI.escapeHtml(chamber.description) + '</div>';
    }

    if (state.isUnderground) {
      if (state.lastAmbientDay !== state.totalDays) {
        state.lastAmbientDay = state.totalDays;
        state.currentAmbientText = getAmbient(state.currentChamber);
      }
      if (state.currentAmbientText) {
        html += '<div class="text-dim" style="margin-top:6px;font-style:italic">' + UI.escapeHtml(state.currentAmbientText) + '</div>';
      }
    }

    UI.render(html);

    // === BUILD ACTION BAR ===
    var actions;
    var musicLabel = (window.Audio_Manager && Audio_Manager.isEnabled()) ? 'Music Off' : 'Music On';
    if (state.isUnderground) {
      actions = [
        { key: '1', label: 'Mine', value: 'mine', primary: true },
        { key: '2', label: 'Descend', value: 'descend' },
        { key: '3', label: 'Ascend', value: 'ascend' },
        { key: '4', label: 'Pace', value: 'pace' },
        { key: '5', label: 'Rations', value: 'rations' },
        { key: '6', label: 'Rest', value: 'rest' },
        { key: '7', label: 'Map', value: 'map' },
        { key: '8', label: musicLabel, value: 'music' }
      ];
    } else {
      actions = [
        { key: '1', label: 'Enter Cave', value: 'enter', primary: true },
        { key: '2', label: 'Visit Town', value: 'town' },
        { key: '3', label: 'Ship Guano', value: 'ship' },
        { key: '4', label: 'Rest', value: 'rest' },
        { key: '5', label: 'Supplies', value: 'supplies' },
        { key: '6', label: 'Save', value: 'save' },
        { key: '7', label: musicLabel, value: 'music' }
      ];
    }

    UI.renderActionBar(actions, function (val) {
      handleAction(val);
    });
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
    switch (action) {
      case 'mine': advanceGame(); break;
      case 'descend': attemptDescent(); break;
      case 'ascend': attemptAscent(); break;
      case 'pace': changePace(); break;
      case 'rations': changeRations(); break;
      case 'rest': restDay(); break;
      case 'map': showCaveMap(); break;
      case 'enter': enterCave(); break;
      case 'town': visitTown(); break;
      case 'ship': shipGuano(); break;
      case 'supplies': supplyScreen(); break;
      case 'save': saveGame(); break;
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

  function changePace() {
    UI.hideBars();
    UI.render('<div class="text-lg text-glow">Set Work Pace</div><hr class="separator">');
    UI.promptChoice([
      { key: '1', label: 'Careful - 0.5x output, health recovers', value: 'careful' },
      { key: '2', label: 'Steady - 1x output, neutral', value: 'steady' },
      { key: '3', label: 'Grueling - 1.5x output, health decays', value: 'grueling' }
    ], function (v) {
      var s = gs();
      if (s) s.workPace = v;
      UI.showNotification('Pace: ' + v, 1000);
      setTimeout(function () { UI.transition(statusScreen); }, 1100);
    });
  }

  function changeRations() {
    UI.hideBars();
    UI.render('<div class="text-lg text-glow">Set Rations</div><hr class="separator">');
    UI.promptChoice([
      { key: '1', label: 'Full - ~12 lbs/day, health bonus', value: 'full' },
      { key: '2', label: 'Half - ~6 lbs/day, slight penalty', value: 'half' },
      { key: '3', label: 'Scraps - ~3 lbs/day, serious penalty', value: 'scraps' }
    ], function (v) {
      var s = gs();
      if (s) s.rationLevel = v;
      UI.showNotification('Rations: ' + v, 1000);
      setTimeout(function () { UI.transition(statusScreen); }, 1100);
    });
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

    var curRouteIdx = window.CaveData ? window.CaveData.getMainRouteIndex(state.currentChamber) : -1;
    var deeper = (chamber.connectedTo || []).filter(function (id) {
      var c = getChamberData(id);
      if (!c) return false;
      if (c.depth > chamber.depth) return true;
      // Allow same-depth progression if it's the next chamber on the main route
      if (c.depth === chamber.depth && window.CaveData) {
        var targetIdx = window.CaveData.getMainRouteIndex(id);
        return targetIdx > curRouteIdx && targetIdx !== -1;
      }
      return false;
    });

    if (deeper.length === 0) {
      UI.render('<div class="text-amber">No deeper passages from here.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }
    if (state.rope < 20) {
      UI.render('<div class="text-red">Not enough rope! Need 20+ ft to descend.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }

    var html = '<div class="text-lg text-glow">Descent</div><hr class="separator">';
    html += '<div class="text-dim">Choose a passage:</div>';
    var opts = [];
    for (var i = 0; i < deeper.length; i++) {
      var t = getChamberData(deeper[i]);
      var label = (t ? t.name : deeper[i]) + ' (' + (t ? t.depth : '?') + ' ft)';
      if (t && t.isOptional) label += ' [RISKY]';
      opts.push({ key: String(i + 1), label: label, value: deeper[i] });
    }
    opts.push({ key: '0', label: 'Go back', value: 'back' });

    UI.render(html);
    UI.promptChoice(opts, function (val) {
      if (val === 'back') { statusScreen(); return; }
      state.rope = Math.max(0, state.rope - 20);
      state.currentChamber = val;
      var nc = getChamberData(val);
      if (nc) state.currentZone = nc.zone;
      if (state.discoveredChambers.indexOf(val) === -1) state.discoveredChambers.push(val);

      // Check easter egg
      if (window.Content) {
        var egg = window.Content.getEasterEgg(val);
        if (egg) {
          UI.render('<div class="event-highlight" style="margin:10px 0">' + egg.text.join('<br>') + '</div>');
          UI.pressEnter(function () { UI.transition(landmarkScreen); });
          return;
        }
      }
      UI.transition(landmarkScreen);
    });
  }

  function attemptAscent() {
    var state = gs();
    if (!state) return;
    var chamber = getChamberData(state.currentChamber);
    if (!chamber) return;

    var shallower = (chamber.connectedTo || []).filter(function (id) {
      var c = getChamberData(id);
      return c && c.depth < chamber.depth;
    });

    if (shallower.length === 0) {
      // At the top - exit cave
      state.isUnderground = false;
      state.currentChamber = 'marmaros';
      state.currentZone = 'surface';
      if (window.Engine) window.Engine.advanceDay();
      UI.hideBars();
      UI.render('<div class="text-bright">You emerge from the cave into daylight at Marmaros.</div>' +
        '<div class="text-dim" style="margin-top:8px">Your crew spends a full day hauling ropes, tools, and guano sacks to the surface before camp can be struck.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }

    // Pick shallowest
    var best = shallower[0];
    var bestD = 9999;
    for (var i = 0; i < shallower.length; i++) {
      var c = getChamberData(shallower[i]);
      if (c && c.depth < bestD) { bestD = c.depth; best = shallower[i]; }
    }

    state.currentChamber = best;
    var t = getChamberData(best);
    if (t) state.currentZone = t.zone;

    if (best === 'marmaros' || !t) {
      state.isUnderground = false;
      state.currentChamber = 'marmaros';
      state.currentZone = 'surface';
      if (window.Engine) window.Engine.advanceDay();
      UI.hideBars();
      UI.render('<div class="text-bright">You emerge at Marmaros.</div>' +
        '<div class="text-dim" style="margin-top:8px">Your crew hauls gear up the final rope ladder and squints into daylight. The climb has cost a full day and every shoulder aches.</div>');
    } else {
      if (window.Engine) window.Engine.advanceDay();
      UI.hideBars();
      UI.render('<div class="text-bright">You ascend to ' + (t ? t.name : 'the previous chamber') + '.</div>' +
        '<div class="text-dim" style="margin-top:8px">Your crew hauls equipment hand-over-hand up wet limestone and fraying rope. A full day is spent climbing and securing the line.</div>');
    }
    UI.pressEnter(function () { statusScreen(); });
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
      var campHtml = '<div class="text-lg text-glow">Night in Camp</div><hr class="separator">';
      if (campfireFrame) campHtml += '<pre class="title-art">' + UI.escapeHtml(campfireFrame) + '</pre>';
      campHtml += '<div class="text-dim" style="font-style:italic">' + UI.escapeHtml(getRandomCrewCampQuote(state)) + '</div>';
      UI.render(campHtml);
      UI.pressEnter(function () { resolveRestDay(state); });
      return;
    }

    resolveRestDay(state);
  }

  function resolveRestDay(state) {
    var orig = state.workPace;
    state.workPace = 'careful';

    if (window.Engine) {
      var r = window.Engine.advanceDay();
      state.workPace = orig;
      var html = state.isUnderground
        ? '<div class="text-bright">The crew rests underground for the day.</div>'
        : '<div class="text-bright">Your crew rests for the day in Marmaros. Health recovers slightly.</div>';
      if (r && r.messages.length > 0) {
        html += '<div class="text-dim" style="margin-top:6px">';
        for (var i = 0; i < r.messages.length; i++) html += UI.escapeHtml(r.messages[i]) + '<br>';
        html += '</div>';
      }
      UI.render(html);
    } else {
      state.workPace = orig;
      UI.render('<div class="text-bright">Your crew rests for the day. Health improves.</div>');
    }
    UI.pressEnter(function () { statusScreen(); });
  }

  function showCaveMap() {
    UI.hideBars();
    var state = gs();
    if (!state || !window.CaveData || !window.CaveData.CHAMBERS) {
      UI.render('<div class="text-dim">Map data unavailable.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }

    var zoneLabels = {
      zone1: 'Zone 1 - Cathedral Room',
      zone2: 'Zone 2 - Upper Passages',
      zone3: 'Zone 3 - Middle Depths',
      zone4: 'Zone 4 - Deep Chambers',
      zone5: 'Zone 5 - The Abyss'
    };
    var zoneOrder = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'];
    var lines = [];
    lines.push('CAVE MAP (Discovered chambers shown)');
    lines.push('');

    for (var z = 0; z < zoneOrder.length; z++) {
      var zoneId = zoneOrder[z];
      var zoneChambers = [];
      for (var id in window.CaveData.CHAMBERS) {
        if (!window.CaveData.CHAMBERS.hasOwnProperty(id)) continue;
        var ch = window.CaveData.CHAMBERS[id];
        if (ch.zone === zoneId) zoneChambers.push(ch);
      }
      zoneChambers.sort(function (a, b) { return a.depth - b.depth; });
      if (zoneChambers.length === 0) continue;
      lines.push(zoneLabels[zoneId] || zoneId);
      for (var i = 0; i < zoneChambers.length; i++) {
        var c = zoneChambers[i];
        var discovered = state.discoveredChambers && state.discoveredChambers.indexOf(c.id) !== -1;
        var name = discovered ? c.name : '???';
        if (state.currentChamber === c.id) name = '[' + name + ']';
        lines.push('  ' + c.depth + 'ft - ' + name);
      }
      lines.push('');
    }

    UI.render('<div class="text-lg text-glow">Surveyor\'s Cave Map</div><hr class="separator">' +
      '<pre class="title-art" style="font-size:13px;line-height:1.25">' + UI.escapeHtml(lines.join('\\n')) + '</pre>' +
      '<div class="text-dim">[brackets] mark your current chamber.</div>');
    UI.pressEnter(function () { statusScreen(); });
  }

  function shipGuano() {
    UI.hideBars();
    var state = gs();
    if (!state || state.guanoStockpile <= 0) {
      UI.render('<div class="text-dim">No guano to ship.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }

    UI.render('<div class="text-lg text-glow">Ship Guano</div><hr class="separator">' +
      '<div>Stockpile: <span class="text-bright">' + state.guanoStockpile.toFixed(2) + ' tons</span></div>' +
      '<div>Revenue: $700/ton - $50 shipping = $650/ton net</div>' +
      '<div>Payment arrives in 14 days</div>');

    UI.promptChoice([
      { key: '1', label: 'Ship all', value: 'all' },
      { key: '2', label: 'Cancel', value: 'no' }
    ], function (v) {
      if (v === 'no') { statusScreen(); return; }
      if (window.Economy) {
        var r = window.Economy.shipGuano(state.guanoStockpile, state);
        UI.render('<div class="text-bright">' + (r.message || 'Shipped!') + '</div>');
      } else {
        var t = state.guanoStockpile;
        state.guanoShipped += t;
        state.guanoStockpile = 0;
        state.cash += t * 650;
        UI.render('<div class="text-bright">Shipped ' + t.toFixed(1) + ' tons</div>');
      }
      UI.pressEnter(function () { statusScreen(); });
    });
  }

  function supplyScreen() {
    UI.hideBars();
    var state = gs();
    if (!state) return;
    var html = '<div class="text-lg text-glow">Supply Inventory</div><hr class="separator-double">';
    var items = [
      ['Donkeys', state.donkeys.count],
      ['Food', Math.round(state.food) + ' lbs'],
      ['Lantern Oil', state.lanternOil.toFixed(1) + ' gal'],
      ['Rope', state.rope + ' ft'],
      ['Timber', state.timber],
      ['Dynamite', state.dynamite]
    ];
    for (var i = 0; i < items.length; i++) {
      html += '<div class="store-item"><span>' + items[i][0] + '</span><span class="text-bright">' + items[i][1] + '</span></div>';
    }

    // Equipment
    if (state.equipment) {
      html += '<hr class="separator"><div class="text-bright">Equipment:</div>';
      var equips = [];
      if (state.equipment.toolUpgrade) equips.push('Tool Upgrade');
      if (state.equipment.huntingKnife) equips.push('Hunting Knife');
      if (state.equipment.walkingStick) equips.push('Walking Stick');
      html += '<div class="text-dim">' + (equips.length > 0 ? equips.join(', ') : 'None') + '</div>';
    }

    // Consumables
    var morale = state.morale !== undefined ? state.morale : 50;
    html += '<hr class="separator">';
    html += '<div class="store-item"><span class="text-bright">Cash</span><span class="text-yellow">$' + state.cash.toFixed(2) + '</span></div>';
    html += '<div class="store-item"><span>Guano stockpile</span><span class="text-bright">' + state.guanoStockpile.toFixed(2) + ' tons</span></div>';
    html += '<div class="store-item"><span>Morale</span><span class="text-bright">' + morale + '%</span></div>';
    if (state.taffy > 0) html += '<div class="store-item"><span>Taffy</span><span class="text-bright">' + state.taffy + '</span></div>';

    UI.render(html);
    UI.pressEnter(function () { statusScreen(); });
  }

  function saveGame() {
    var state = gs();
    if (state && window.GameState && window.GameState.save) {
      var ok = window.GameState.save();
      UI.showNotification(ok ? 'Game Saved!' : 'Save failed', 1200);
    }
    setTimeout(statusScreen, 1300);
  }

  // =========================================
  // GAME ADVANCE (mine for a day)
  // =========================================
  function advanceGame() {
    var state = gs();
    if (!state) return;

    if (window.Engine) {
      var r = window.Engine.advanceDay();
      if (!r) { statusScreen(); return; }

      if (r.deaths && r.deaths.length > 0) {
        showDayResults(r, function () {
          var cause = r.eventsTriggered && r.eventsTriggered.length > 0 ? r.eventsTriggered[0].eventName : 'the cave';
          deathScreen(r.deaths[0], cause);
        });
        return;
      }
      if (state.gameOver) {
        showDayResults(r, function () { gameOverScreen(state.gameOverReason); });
        return;
      }
      if (state.guanoShipped >= state.contractTarget && state.contractTarget > 0) {
        showDayResults(r, endingScreen);
        return;
      }
      if (r.eventsTriggered && r.eventsTriggered.length > 0) {
        showDayResults(r, function () { statusScreen(); });
        return;
      }
      // Normal day - just go back to status
      statusScreen();
    } else {
      // Fallback if engine not loaded
      var alive = countAlive(state) - (state.foreman.alive ? 1 : 0);
      state.food = Math.max(0, state.food - alive * 2.4);
      if (state.isUnderground) state.lanternOil = Math.max(0, state.lanternOil - 0.5);
      state.guanoMined += alive * 0.05;
      state.guanoStockpile += alive * 0.05;
      state.totalDays++;
      if (state.date) state.date = new Date(state.date.getTime() + 86400000);
      statusScreen();
    }
  }

  function showDayResults(r, cb) {
    UI.hideBars();
    var html = '<div class="text-bright">Day ' + (r.day || '?') + ' &mdash; ' + formatDate(gs()) + '</div><hr class="separator">';
    for (var i = 0; i < r.messages.length; i++) {
      var msg = r.messages[i];
      var cls = msg.indexOf('SHORTAGE') >= 0 || msg.indexOf('died') >= 0 || msg.indexOf('killed') >= 0 ? 'text-red' :
        msg.indexOf('Payment') >= 0 || msg.indexOf('Mined') >= 0 ? 'text-green' : 'text-amber';
      html += '<div class="' + cls + '">' + UI.escapeHtml(msg) + '</div>';
    }
    UI.render(html);
    UI.pressEnter(cb);
  }

  // =========================================
  // DEATH SCREEN
  // =========================================
  function deathScreen(name, cause) {
    UI.hideBars();
    if (window.Audio_Manager) Audio_Manager.play('gameover');
    var state = gs();

    // Try death art
    var deathArt = '';
    if (window.AsciiArt && window.AsciiArt.getDeathArt) {
      var artCause = cause ? cause.toLowerCase().replace(/[\s-]+/g, '_') : '';
      deathArt = window.AsciiArt.getDeathArt(artCause);
    }

    var art = GRAVESTONE_ART
      .replace('~~~NAME~~~', padCenter(name || 'Unknown', 11))
      .replace('~~~CAUSE~~~', padCenter(cause || '', 11))
      .replace('~~~DATE~~~', padCenter(formatDate(state), 11));

    var html = '';
    if (window.Images) html += Images.getImageHtml('death');
    if (deathArt) html += '<pre class="chamber-art">' + deathArt + '</pre>';
    html += '<div class="gravestone">' + art + '</div>';
    html += '<div class="text-center text-dim" style="margin-top:10px">';

    if (window.Content && cause) {
      var cid = cause.toLowerCase().replace(/[\s-]+/g, '_');
      var dm = window.Content.getDeathMessage(cid);
      if (dm && dm.message) html += dm.message.join('<br>');
      else html += UI.escapeHtml(name) + ' has died of ' + UI.escapeHtml(cause) + '.';
    } else {
      html += UI.escapeHtml(name || 'A crew member') + ' has died.';
    }
    html += '</div>';

    UI.render(html);
    UI.pressEnter(function () {
      var s = gs();
      if (s && !s.foreman.alive) gameOverScreen('The foreman has died. The expedition is over.');
      else if (s && countAlive(s) <= 1) gameOverScreen('All crew members have perished.');
      else statusScreen();
    });
  }

  // =========================================
  // GAME OVER
  // =========================================
  function gameOverScreen(reason) {
    UI.hideBars();
    UI.render('<div class="text-center" style="margin-top:30px">' +
      '<div class="text-red text-lg">THE EXPEDITION HAS ENDED</div><hr class="separator">' +
      '<div class="text-bright" style="margin:12px 0">' + UI.escapeHtml(reason || 'Your expedition is over.') + '</div></div>');
    UI.promptChoice([
      { key: '1', label: 'View final score', value: 'score' },
      { key: '2', label: 'Return to title', value: 'title' }
    ], function (v) {
      if (v === 'score') scoringScreen();
      else UI.transition(titleScreen);
    });
  }

  // =========================================
  // ENDING (contract fulfilled)
  // =========================================
  function endingScreen() {
    UI.hideBars();
    if (window.Audio_Manager) Audio_Manager.play('title');
    var state = gs();

    var trophyArt = '';
    if (window.AsciiArt && window.AsciiArt.getScoringArt) trophyArt = window.AsciiArt.getScoringArt('trophy');

    var html = '';
    if (window.Images) html += Images.getImageHtml('victory');
    if (trophyArt) html += '<pre class="title-art">' + trophyArt + '</pre>';
    html += '<div class="text-lg text-glow text-center" style="margin-top:10px">CONTRACT FULFILLED!</div><hr class="separator-double">';
    html += '<div class="text-bright text-center" style="margin:12px 0">You shipped ' + (state ? state.guanoShipped.toFixed(1) : '?') + ' tons of guano.</div>';
    html += '<hr class="separator"><div class="text-dim text-center">What will you do now?</div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Sell everything and leave', value: 'sell' },
      { key: '2', label: 'Turn the cave into a tourist attraction', value: 'tour' },
      { key: '3', label: 'Search deeper for treasure', value: 'deep' }
    ], function (v) {
      var h;
      if (v === 'tour') {
        h = '<div class="text-center text-glow" style="margin-top:20px"><div class="text-lg">The Visionary</div><br>' +
          '<div class="text-dim">You saw what others could not. The cave was the treasure.<br><br>' +
          'In 1889, William Lynch would begin giving tours.<br>In 1950, Silver Dollar City would rise.<br>' +
          'You were ahead of your time.</div></div>';
      } else if (v === 'deep') {
        h = '<div class="text-center text-glow" style="margin-top:20px"><div class="text-lg">The Gambler</div><br>' +
          '<div class="text-dim">One more descent. One more haul.<br>The cave whispers of riches below...</div></div>';
      } else {
        h = '<div class="text-center text-glow" style="margin-top:20px"><div class="text-lg">The Pragmatist</div><br>' +
          '<div class="text-dim">You take your earnings, tip your hat,<br>and ride the stagecoach back to civilization.</div></div>';
      }
      UI.render(h);
      UI.pressEnter(scoringScreen);
    });
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
      html += sr('Survivors', bd.survivors) + sr('Resources', bd.resources) + sr('Contract', bd.contracts) + sr('Discoveries', bd.discoveries);
      html += '<tr class="score-total"><td>Subtotal</td><td>' + bd.subtotal + '</td></tr></table>';
      if (bd.multiplierReasons.length > 0) {
        html += '<div class="text-dim" style="margin:6px 0">Multipliers:</div>';
        for (var i = 0; i < bd.multiplierReasons.length; i++) html += '<div class="text-amber text-sm">  ' + bd.multiplierReasons[i] + '</div>';
      }
      html += '<table class="score-table"><tr class="score-total"><td>FINAL SCORE</td><td>' + bd.finalScore + '</td></tr></table>';
      html += '<div class="text-center text-glow" style="margin:12px 0;font-size:14px">' + window.Scoring.getRank(bd.finalScore) + '</div>';
      window.Scoring.saveScore(state.foreman.name, bd.finalScore, { profession: state.profession });
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
    var html = '<div class="text-lg text-glow text-center">Top Ten Foremen</div><hr class="separator-double">';
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
      { title: 'The Osage and the Devil\'s Den', text: 'The Osage people recognized this ominous sinkhole atop Roark Mountain by 1500, calling it "Devil\'s Den." The fluttering of thousands of bat wings and the echoes of subterranean waterfalls emanating from the abyss led them to believe it was a gateway to the underworld.\n\nLegend tells of a young Osage brave who fell while chasing a bear into the sinkhole. The Osage marked surrounding trees with a sideways "V" as warning to all who passed.' },
      { title: 'The Spanish Expeditions (1541)', text: 'In 1541, Spanish conquistadors descended into the cave seeking gold and the mythical Fountain of Youth. They found neither, but left behind notched pine tree ladders deep in the Mammoth Room.\n\nThese "Spanish ladders" were discovered three centuries later in 1869, providing physical proof of the earliest European exploration of Marvel Cave.' },
      { title: 'The Blow Expedition (1869)', text: 'Henry T. Blow, a St. Louis lead mining magnate, led six miners into Devil\'s Den in 1869. They lowered themselves 200 feet by rope into the Cathedral Room.\n\nFinding no lead, they reached a chamber with a flat, polished ceiling. Deceived by lamplight, they identified it as pure marble. The "Marble Cave" misnomer was born -- it was ordinary Mississippian limestone.' },
      { title: 'The Marble Cave Mining Co. (1884)', text: 'In 1882, T. Hodges Jones and Truman S. Powell tested the marble claims -- the "marble" was just limestone. But they found something better: massive deposits of nitrogen-rich bat guano.\n\nIn 1884, Jones founded the Marble Cave Mining and Manufacturing Company. Guano sold at $700 per ton for fertilizer and gunpowder. Donkeys were lowered by rope to pull ore carts through the passages.' },
      { title: 'Marmaros: The Mining Town', text: 'The mining boom birthed Marmaros ("Greek for marble") in 1884 -- a settlement of 28 souls with a hotel, general store, school, pottery shop, and furniture factory.\n\nBy 1889, after four and a half years, the guano was exhausted and the company collapsed. Marmaros was abandoned, and its remnants were burned by the Bald Knobbers, the violent Ozark vigilante group.' },
      { title: 'The Cathedral Room', text: 'The Cathedral Room is the largest cave entrance room in the United States: 204 feet high, 225 feet wide, 411 feet long. It could hold the Statue of Liberty with room to spare.\n\nA 124-foot conical debris pile called the "Underground Mountain" rises from the floor. In 1963, Don Piccard set an underground altitude record by flying a hot air balloon inside this chamber.' },
      { title: 'The Lynch Era (1889-1927)', text: 'William Henry Lynch bought the cave and surrounding land for $10,000 in 1889, sight unseen. He opened it to tourists in 1894 -- early tours lasted eight exhausting hours by candlelight.\n\nLynch personally built Missouri Highway 76 to connect the cave to Branson. After his death in 1927, his daughters Genevieve and Miriam renamed it "Marvel Cave," saying "Marble was untrue! Marvel was all truth."' },
      { title: 'Silver Dollar City (1950-Present)', text: 'In 1950, Hugo Herschend and his family secured a 99-year lease. They replaced wooden ladders with concrete walkways and in 1957 built a cable-train funicular to carry visitors up from 505 feet below.\n\nThe Army Corps of Engineers said it was impossible. The Herschends built it anyway. To entertain visitors waiting above ground, they recreated Marmaros as an 1880s craft village -- which became Silver Dollar City.' },
      { title: 'The Living Cave', text: 'Marvel Cave is a "wet" active cave -- formations are still growing. The constant temperature is 58\u00B0F year-round. Over 40,000 gray bats (federally endangered) roost in the Mammoth Room, consuming 24 million insects nightly.\n\nThe cave descends 505 feet to the Waterfall Room, where a 50-foot waterfall fed by the Lost River marks the deepest accessible point. Lake Genevieve and Lake Miriam, named for Lynch\'s daughters, hold waters 34 feet deep with passages mapped to 110 feet below the surface.' }
    ];
    show(0);
    function show(idx) {
      UI.render('<div class="text-lg text-glow">' + UI.escapeHtml(pages[idx].title) + '</div>' +
        '<div class="text-dim text-sm">Page ' + (idx + 1) + '/' + pages.length + '</div><hr class="separator">' +
        '<div style="white-space:pre-wrap;line-height:2">' + UI.escapeHtml(pages[idx].text) + '</div>');
      var o = [];
      if (idx < pages.length - 1) o.push({ key: 'n', label: 'Next', value: 'n' });
      if (idx > 0) o.push({ key: 'p', label: 'Previous', value: 'p' });
      o.push({ key: 'q', label: 'Back', value: 'q' });
      UI.promptChoice(o, function (v) {
        if (v === 'n') show(idx + 1);
        else if (v === 'p') show(idx - 1);
        else UI.transition(titleScreen);
      });
    }
  }

  // =========================================
  // EVENT SCREEN
  // =========================================
  function eventScreen(data) {
    UI.hideBars();
    if (!data) { statusScreen(); return; }
    var html = '<div class="text-lg text-glow">' + UI.escapeHtml(data.eventName || 'Event') + '</div><hr class="separator">';
    if (data.eventDescription) html += '<div class="text-amber">' + UI.escapeHtml(data.eventDescription) + '</div>';
    if (data.messages) {
      for (var i = 0; i < data.messages.length; i++) {
        var cls = data.messages[i].indexOf('died') >= 0 || data.messages[i].indexOf('killed') >= 0 ? 'text-red' : 'text-bright';
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
    advance: advanceGame,
    landmark: landmarkScreen
  };
})();
