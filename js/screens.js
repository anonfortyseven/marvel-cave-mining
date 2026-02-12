/* ============================================
   Screens.js - All Game Screens
   The Marvel Cave Mining Company
   Integrated with GameState, Engine, CaveData
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

  var CAVE_SCENE = [
    '  .:*~*:._.:*~*:._.:*~*:._.:*~*:.',
    '   ~  Drip... drip... drip...  ~',
    '  . The lantern flickers softly . ',
    '  .:*~*:._.:*~*:._.:*~*:._.:*~*:.'
  ].join('\n');

  function gs() {
    return window.GameState && window.GameState.state ? window.GameState.state : null;
  }

  function formatDate(state) {
    if (!state || !state.date) return '1884';
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var d = state.date;
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
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

  // 1. Title Screen
  function titleScreen() {
    var html = '<div class="title-art">' + CAVE_ART + '</div>\n';
    html += '<div class="title-name text-glow-strong">The Marvel Cave Mining Company</div>\n';
    html += '<div class="subtitle">Stone County, Missouri &bull; 1884</div>\n';
    html += '<div style="margin-top:16px"></div>';
    UI.render(html);
    UI.animateBats();
    UI.promptChoice([
      { key: '1', label: 'Start a New Expedition', value: 'new' },
      { key: '2', label: 'Learn About the Cave', value: 'learn' },
      { key: '3', label: 'Top Ten Foremen', value: 'top' },
      { key: '4', label: 'End', value: 'end' }
    ], function (val) {
      switch (val) {
        case 'new': UI.fadeTransition(professionScreen); break;
        case 'learn': UI.fadeTransition(learnScreen); break;
        case 'top': UI.fadeTransition(topTenScreen); break;
        case 'end':
          UI.render('<div class="text-center text-glow" style="margin-top:80px;font-size:14px">' +
            'Thanks for playing!<br><br><span class="text-dim">The Marvel Cave Mining Company<br>1884</span></div>');
          break;
      }
    });
  }

  // 2. Profession Screen
  function professionScreen() {
    var html = '<div class="text-lg text-glow">Choose Your Background</div>';
    html += '<hr class="separator-double">';
    html += '<div class="text-dim" style="margin:6px 0">Your choice determines starting funds, contract difficulty, and score multiplier.</div>';

    html += '<div class="box" style="margin:6px 0"><div class="box-title">1. Investor from St. Louis</div>';
    html += '<div class="text-bright">Starting Funds: $1,600 &bull; Contract: 8 tons &bull; Score: x1</div>';
    html += '<div class="text-dim">You bankrolled this operation from your parlor.</div></div>';

    html += '<div class="box" style="margin:6px 0"><div class="box-title">2. Experienced Miner</div>';
    html += '<div class="text-bright">Starting Funds: $800 &bull; Contract: 12 tons &bull; Score: x2</div>';
    html += '<div class="text-dim">You worked the lead mines in Joplin. You know rock.</div></div>';

    html += '<div class="box" style="margin:6px 0"><div class="box-title">3. Local Ozark Farmer</div>';
    html += '<div class="text-bright">Starting Funds: $400 &bull; Contract: 15 tons &bull; Score: x3</div>';
    html += '<div class="text-dim">You heard about the guano money and left your failing homestead.</div></div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Investor from St. Louis', value: 'investor' },
      { key: '2', label: 'Experienced Miner', value: 'miner' },
      { key: '3', label: 'Local Ozark Farmer', value: 'farmer' }
    ], function (val) {
      window.GameState.init({ profession: val });
      UI.fadeTransition(crewScreen);
    });
  }

  // 3. Crew Naming
  function crewScreen() {
    var names = [];
    UI.render('<div class="text-lg text-glow">Name Your Mining Crew</div><hr class="separator-double">' +
      '<div class="text-dim" style="margin:6px 0">Name your foreman and four miners. The foreman\'s death ends the expedition.</div>');
    askName(0);

    function askName(index) {
      var labels = ['Foreman', 'Rope Man', 'Lamp Keeper', 'Blast Man', 'Cart Driver'];
      var defaults = ['', 'Buck', 'Jesse', 'Hank', 'Earl'];
      UI.promptText(labels[index] + ': ', function (val) {
        if (!val) val = defaults[index] || labels[index];
        names.push(val);
        UI.append('<div class="text-green"> -> ' + UI.escapeHtml(labels[index]) + ': ' + UI.escapeHtml(val) + '</div>');
        if (index < 4) askName(index + 1);
        else finishCrew();
      }, { defaultValue: defaults[index] });
    }

    function finishCrew() {
      var state = gs();
      if (state) {
        state.foreman.name = names[0];
        for (var i = 0; i < 4 && i < state.crew.length; i++) state.crew[i].name = names[i + 1];
      }
      UI.append('<div style="margin-top:10px" class="text-bright">Your crew is assembled!</div>');
      UI.pressEnter(function () { UI.fadeTransition(seasonScreen); });
    }
  }

  // 4. Season
  function seasonScreen() {
    var html = '<div class="text-lg text-glow">Choose Starting Season</div><hr class="separator-double">';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">1. Spring (March)</div><div class="text-dim">Flooding HIGH. Long runway to fill contract.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">2. Summer (June)</div><div class="text-dim">Ideal conditions. Bats active = more guano and danger.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">3. Fall (September)</div><div class="text-dim">Good conditions but short clock before winter.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">4. Winter (December)</div><div class="text-dim">Supply routes frozen. Bats hibernating. Hard mode.</div></div>';
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
      UI.fadeTransition(storeScreen);
    });
  }

  // 5. Store
  function storeScreen() {
    if (window.Store && window.Store.show) {
      window.Store.show(function () {
        var state = gs();
        if (state) {
          state.isUnderground = true;
          state.currentChamber = 'cathedral_entrance';
          state.currentZone = 'zone1';
          if (state.discoveredChambers.indexOf('cathedral_entrance') === -1) state.discoveredChambers.push('cathedral_entrance');
        }
        UI.fadeTransition(landmarkScreen);
      });
    } else { UI.fadeTransition(statusScreen); }
  }

  function landmarkScreen() {
    var state = gs();
    var chamberId = state ? state.currentChamber : 'cathedral_entrance';
    var lines = window.Content ? window.Content.getLandmarkText(chamberId) : ['You descend into the cave...'];
    UI.render('<div style="white-space:pre-wrap;line-height:2">' + UI.escapeHtml(lines.join('\n')) + '</div>');
    UI.pressEnter(function () { UI.fadeTransition(statusScreen); });
  }

  // 6. Status Screen
  function statusScreen() {
    var state = gs();
    if (!state) { titleScreen(); return; }
    var chamber = getChamberData(state.currentChamber);
    var chamberName = chamber ? chamber.name : (state.isUnderground ? 'Unknown' : 'Marmaros');
    var depth = chamber ? chamber.depth : 0;

    var html = '<div class="text-bright text-glow">The Marvel Cave &mdash; ' + formatDate(state) + '</div><hr class="separator-double">';
    if (state.isUnderground) html += '<pre class="text-dim" style="font-size:8px;line-height:1.2;margin:4px 0">' + CAVE_SCENE + '</pre>';
    html += '<div style="margin:4px 0">Location: <span class="text-bright">' + UI.escapeHtml(chamberName) + '</span>';
    if (state.isUnderground) html += ' (Depth: ' + depth + ' ft)';
    html += '</div>';
    if (chamber && chamber.description) html += '<div class="zone-desc">' + UI.escapeHtml(chamber.description) + '</div>';
    html += '<hr class="separator">';

    html += '<div class="text-bright" style="margin:4px 0">Crew:</div>';
    html += '<div class="status-row"><span class="status-label">' + UI.escapeHtml(state.foreman.name) + ' (Foreman)</span><span>' + healthLabel(state.foreman.health) + '</span></div>';
    for (var i = 0; i < state.crew.length; i++) {
      var m = state.crew[i];
      if (m.alive) html += '<div class="status-row"><span class="status-label">' + UI.escapeHtml(m.name) + '</span><span>' + healthLabel(m.health) + '</span></div>';
      else html += '<div class="status-row text-gray"><span>' + UI.escapeHtml(m.name) + '</span><span>Deceased</span></div>';
    }
    html += '<hr class="separator">';

    html += '<div class="status-grid">';
    html += si('Food', Math.round(state.food) + ' lbs');
    html += si('Lantern Oil', state.lanternOil.toFixed(1) + ' gal');
    html += si('Rope', state.rope + ' ft');
    html += si('Timber', state.timber);
    html += si('Dynamite', state.dynamite);
    html += si('Candles', state.candles);
    html += si('Donkeys', state.donkeys.count);
    html += si('Cash', '$' + state.cash.toFixed(2));
    html += '</div><hr class="separator">';

    html += '<div>Guano Shipped: <span class="text-bright">' + state.guanoShipped.toFixed(1) + '</span> / ' + state.contractTarget + ' tons</div>';
    html += '<div>' + UI.progressBar(state.guanoShipped, state.contractTarget, 300) + '</div>';
    if (state.guanoStockpile > 0) html += '<div class="text-dim">Stockpile: ' + state.guanoStockpile.toFixed(2) + ' tons</div>';
    html += '<div style="margin-top:4px">Pace: <span class="text-amber">' + state.workPace + '</span> | Rations: <span class="text-amber">' + state.rationLevel + '</span></div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Continue mining', value: 'mine' },
      { key: '2', label: 'Open menu', value: 'menu' }
    ], function (val) {
      if (val === 'mine') advanceGame();
      else UI.fadeTransition(menuScreen);
    });
  }

  function si(label, value) {
    return '<div class="status-row"><span class="status-label">' + label + ':</span><span class="status-value">' + value + '</span></div>';
  }

  // 7. Menu
  function menuScreen() {
    var state = gs();
    var html = '<div class="text-lg text-glow">Action Menu</div><hr class="separator-double">';
    var opts;
    if (state && !state.isUnderground) {
      opts = [
        { key: '1', label: 'Enter the cave', value: 'enter' },
        { key: '2', label: 'Visit Marmaros Outfitters', value: 'store' },
        { key: '3', label: 'Ship guano (' + (state.guanoStockpile || 0).toFixed(1) + ' tons)', value: 'ship' },
        { key: '4', label: 'Rest the crew', value: 'rest' },
        { key: '5', label: 'Check supplies', value: 'supplies' },
        { key: '9', label: 'Return to status', value: 'status' }
      ];
    } else {
      opts = [
        { key: '1', label: 'Continue mining', value: 'mine' },
        { key: '2', label: 'Change work pace', value: 'pace' },
        { key: '3', label: 'Change rations', value: 'rations' },
        { key: '4', label: 'Descend deeper', value: 'descend' },
        { key: '5', label: 'Ascend toward surface', value: 'ascend' },
        { key: '6', label: 'Rest the crew', value: 'rest' },
        { key: '7', label: 'Check supplies', value: 'supplies' },
        { key: '9', label: 'Return to status', value: 'status' }
      ];
    }
    UI.render(html);
    UI.promptChoice(opts, function (val) {
      switch (val) {
        case 'mine': advanceGame(); break;
        case 'pace': changePace(); break;
        case 'rations': changeRations(); break;
        case 'descend': attemptDescent(); break;
        case 'ascend': attemptAscent(); break;
        case 'rest': restDay(); break;
        case 'supplies': supplyScreen(); break;
        case 'enter': enterCave(); break;
        case 'store': UI.fadeTransition(function () { Store.show(function () { statusScreen(); }); }); break;
        case 'ship': shipGuano(); break;
        case 'status': UI.fadeTransition(statusScreen); break;
      }
    });
  }

  function changePace() {
    UI.render('<div class="text-lg text-glow">Set Work Pace</div><hr class="separator">');
    UI.promptChoice([
      { key: '1', label: 'Careful - 0.5x output, health recovers', value: 'careful' },
      { key: '2', label: 'Steady - 1x output, neutral', value: 'steady' },
      { key: '3', label: 'Grueling - 1.5x output, health decays', value: 'grueling' }
    ], function (v) { var s = gs(); if (s) s.workPace = v; UI.showNotification('Pace: ' + v, 1000); setTimeout(function () { UI.fadeTransition(statusScreen); }, 1100); });
  }

  function changeRations() {
    UI.render('<div class="text-lg text-glow">Set Rations</div><hr class="separator">');
    UI.promptChoice([
      { key: '1', label: 'Full - ~12 lbs/day, health bonus', value: 'full' },
      { key: '2', label: 'Half - ~6 lbs/day, slight penalty', value: 'half' },
      { key: '3', label: 'Scraps - ~3 lbs/day, serious penalty', value: 'scraps' }
    ], function (v) { var s = gs(); if (s) s.rationLevel = v; UI.showNotification('Rations: ' + v, 1000); setTimeout(function () { UI.fadeTransition(statusScreen); }, 1100); });
  }

  function enterCave() {
    var state = gs();
    if (state) {
      state.isUnderground = true;
      state.currentChamber = 'cathedral_entrance';
      state.currentZone = 'zone1';
      if (state.discoveredChambers.indexOf('cathedral_entrance') === -1) state.discoveredChambers.push('cathedral_entrance');
    }
    UI.fadeTransition(landmarkScreen);
  }

  function attemptDescent() {
    var state = gs();
    if (!state) return;
    var chamber = getChamberData(state.currentChamber);
    if (!chamber) { UI.showNotification('Cannot descend', 1200); return; }
    var deeper = (chamber.connectedTo || []).filter(function (id) { var c = getChamberData(id); return c && c.depth > chamber.depth; });
    if (deeper.length === 0) { UI.render('<div class="text-amber">No deeper passages from here.</div>'); UI.pressEnter(function () { menuScreen(); }); return; }
    if (state.rope < 20) { UI.render('<div class="text-red">Not enough rope! Need 20+ ft.</div>'); UI.pressEnter(function () { menuScreen(); }); return; }

    var html = '<div class="text-lg text-glow">Descent</div><hr class="separator"><div class="text-dim">Passages deeper:</div>';
    var opts = [];
    for (var i = 0; i < deeper.length; i++) {
      var t = getChamberData(deeper[i]);
      opts.push({ key: String(i + 1), label: (t ? t.name : deeper[i]) + ' (' + (t ? t.depth : '?') + ' ft)' + (t && t.isOptional ? ' [RISKY]' : ''), value: deeper[i] });
    }
    opts.push({ key: '0', label: 'Go back', value: 'back' });
    UI.render(html);
    UI.promptChoice(opts, function (val) {
      if (val === 'back') { menuScreen(); return; }
      state.rope = Math.max(0, state.rope - 20);
      state.currentChamber = val;
      var nc = getChamberData(val);
      if (nc) state.currentZone = nc.zone;
      if (state.discoveredChambers.indexOf(val) === -1) state.discoveredChambers.push(val);
      // Check easter egg then show landmark
      if (window.Content) {
        var egg = window.Content.getEasterEgg(val);
        if (egg) {
          UI.render('<div class="event-highlight" style="margin:10px 0">' + egg.text.join('<br>') + '</div>');
          UI.pressEnter(function () { UI.fadeTransition(landmarkScreen); });
          return;
        }
      }
      UI.fadeTransition(landmarkScreen);
    });
  }

  function attemptAscent() {
    var state = gs();
    if (!state) return;
    var chamber = getChamberData(state.currentChamber);
    if (!chamber) return;
    var shallower = (chamber.connectedTo || []).filter(function (id) { var c = getChamberData(id); return c && c.depth < chamber.depth; });
    if (shallower.length === 0) {
      state.isUnderground = false;
      state.currentChamber = 'marmaros';
      state.currentZone = 'surface';
      UI.render('<div class="text-bright">You emerge from the cave into daylight at Marmaros.</div>');
      UI.pressEnter(function () { statusScreen(); });
      return;
    }
    // Pick shallowest
    var best = shallower[0]; var bestD = 9999;
    for (var i = 0; i < shallower.length; i++) { var c = getChamberData(shallower[i]); if (c && c.depth < bestD) { bestD = c.depth; best = shallower[i]; } }
    state.currentChamber = best;
    var t = getChamberData(best);
    if (t) state.currentZone = t.zone;
    if (best === 'marmaros') { state.isUnderground = false; UI.render('<div class="text-bright">You emerge at Marmaros.</div>'); }
    else { UI.render('<div class="text-bright">You ascend to ' + (t ? t.name : 'the previous chamber') + '.</div>'); }
    UI.pressEnter(function () { statusScreen(); });
  }

  function restDay() {
    var state = gs();
    if (!state) return;
    var orig = state.workPace;
    state.workPace = 'careful';
    if (window.Engine) {
      var r = window.Engine.advanceDay();
      state.workPace = orig;
      var html = '<div class="text-bright">The crew rests for a full day.</div>';
      if (r && r.messages.length > 0) { html += '<div class="text-dim" style="margin-top:6px">'; for (var i = 0; i < r.messages.length; i++) html += UI.escapeHtml(r.messages[i]) + '<br>'; html += '</div>'; }
      UI.render(html);
    } else { state.workPace = orig; UI.render('<div class="text-bright">The crew rests. Health improves.</div>'); }
    UI.pressEnter(function () { statusScreen(); });
  }

  function shipGuano() {
    var state = gs();
    if (!state || state.guanoStockpile <= 0) { UI.render('<div class="text-dim">No guano to ship.</div>'); UI.pressEnter(function () { menuScreen(); }); return; }
    UI.render('<div class="text-lg text-glow">Ship Guano</div><hr class="separator">' +
      '<div>Stockpile: <span class="text-bright">' + state.guanoStockpile.toFixed(2) + ' tons</span></div>' +
      '<div>Revenue: $700/ton - $50 shipping = $650/ton net</div><div>Payment arrives in 14 days</div>');
    UI.promptChoice([
      { key: '1', label: 'Ship all', value: 'all' },
      { key: '2', label: 'Cancel', value: 'no' }
    ], function (v) {
      if (v === 'no') { menuScreen(); return; }
      if (window.Economy) {
        var r = window.Economy.shipGuano(state.guanoStockpile, state);
        UI.render('<div class="text-bright">' + (r.message || 'Shipped!') + '</div>');
      } else {
        var t = state.guanoStockpile; state.guanoShipped += t; state.guanoStockpile = 0; state.cash += t * 650;
        UI.render('<div class="text-bright">Shipped ' + t.toFixed(1) + ' tons for $' + (t * 650).toFixed(2) + '</div>');
      }
      UI.pressEnter(function () { statusScreen(); });
    });
  }

  function supplyScreen() {
    var state = gs();
    if (!state) return;
    var html = '<div class="text-lg text-glow">Supply Inventory</div><hr class="separator-double">';
    var items = [['Donkeys', state.donkeys.count], ['Food', Math.round(state.food) + ' lbs'], ['Lantern Oil', state.lanternOil.toFixed(1) + ' gal'],
      ['Rope', state.rope + ' ft'], ['Timber', state.timber], ['Dynamite', state.dynamite], ['Clothing', state.clothing + ' sets'], ['Candles', state.candles]];
    for (var i = 0; i < items.length; i++) html += '<div class="store-item"><span>' + items[i][0] + '</span><span class="text-bright">' + items[i][1] + '</span></div>';
    html += '<hr class="separator"><div class="store-item"><span class="text-bright">Cash</span><span class="text-yellow">$' + state.cash.toFixed(2) + '</span></div>';
    html += '<div class="store-item"><span>Guano stockpile</span><span class="text-bright">' + state.guanoStockpile.toFixed(2) + ' tons</span></div>';
    UI.render(html);
    UI.pressEnter(function () { UI.fadeTransition(menuScreen); });
  }

  // ---- GAME ADVANCE ----
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
      if (state.gameOver) { showDayResults(r, function () { gameOverScreen(state.gameOverReason); }); return; }
      if (state.guanoShipped >= state.contractTarget && state.contractTarget > 0) { showDayResults(r, endingScreen); return; }
      if (r.eventsTriggered && r.eventsTriggered.length > 0) { showDayResults(r, function () { statusScreen(); }); return; }
      statusScreen();
    } else {
      var alive = countAlive(state) - (state.foreman.alive ? 1 : 0);
      state.food = Math.max(0, state.food - alive * 2.4);
      if (state.isUnderground) state.lanternOil = Math.max(0, state.lanternOil - 0.5);
      state.guanoMined += alive * 0.05; state.guanoStockpile += alive * 0.05;
      state.totalDays++;
      if (state.date) state.date = new Date(state.date.getTime() + 86400000);
      statusScreen();
    }
  }

  function showDayResults(r, cb) {
    var html = '<div class="text-bright">Day ' + (r.day || '?') + '</div><hr class="separator">';
    for (var i = 0; i < r.messages.length; i++) {
      var msg = r.messages[i];
      var cls = msg.indexOf('SHORTAGE') >= 0 || msg.indexOf('died') >= 0 || msg.indexOf('killed') >= 0 ? 'text-red' :
        msg.indexOf('Payment') >= 0 || msg.indexOf('Mined') >= 0 ? 'text-green' : 'text-amber';
      html += '<div class="' + cls + '">' + UI.escapeHtml(msg) + '</div>';
    }
    UI.render(html);
    UI.pressEnter(cb);
  }

  // 9. Death Screen
  function deathScreen(name, cause) {
    var state = gs();
    var art = GRAVESTONE_ART.replace('~~~NAME~~~', padCenter(name || 'Unknown', 11)).replace('~~~CAUSE~~~', padCenter(cause || '', 11)).replace('~~~DATE~~~', padCenter(formatDate(state), 11));
    var html = '<div class="gravestone">' + art + '</div>';
    html += '<div class="text-center text-dim" style="margin-top:10px">';
    if (window.Content && cause) {
      var cid = cause.toLowerCase().replace(/[\s-]+/g, '_');
      var dm = window.Content.getDeathMessage(cid);
      if (dm && dm.message) html += dm.message.join('<br>');
      else html += UI.escapeHtml(name) + ' has died of ' + UI.escapeHtml(cause) + '.';
    } else { html += UI.escapeHtml(name || 'A crew member') + ' has died.'; }
    html += '</div>';
    UI.render(html);
    UI.pressEnter(function () {
      var s = gs();
      if (s && !s.foreman.alive) gameOverScreen('The foreman has died. The expedition is over.');
      else if (s && countAlive(s) <= 1) gameOverScreen('All crew members have perished.');
      else statusScreen();
    });
  }

  // 10. Game Over
  function gameOverScreen(reason) {
    UI.render('<div class="text-center" style="margin-top:30px"><div class="text-red text-lg">THE EXPEDITION HAS ENDED</div><hr class="separator">' +
      '<div class="text-bright" style="margin:12px 0">' + UI.escapeHtml(reason || 'Your expedition is over.') + '</div></div>');
    UI.promptChoice([{ key: '1', label: 'View final score', value: 'score' }, { key: '2', label: 'Return to title', value: 'title' }], function (v) {
      if (v === 'score') scoringScreen(); else UI.fadeTransition(titleScreen);
    });
  }

  // 14. Ending
  function endingScreen() {
    var state = gs();
    UI.render('<div class="text-lg text-glow text-center" style="margin-top:20px">CONTRACT FULFILLED!</div><hr class="separator-double">' +
      '<div class="text-bright text-center" style="margin:12px 0">You shipped ' + (state ? state.guanoShipped.toFixed(1) : '?') + ' tons of guano.</div>' +
      '<hr class="separator"><div class="text-dim text-center">What will you do now?</div>');
    UI.promptChoice([
      { key: '1', label: 'Sell everything and leave', value: 'sell' },
      { key: '2', label: 'Turn the cave into a tourist attraction', value: 'tour' },
      { key: '3', label: 'Search deeper', value: 'deep' }
    ], function (v) {
      var h;
      if (v === 'tour') {
        h = '<div class="text-center text-glow" style="margin-top:20px"><div class="text-lg">The Visionary</div><br><div class="text-dim">' +
          'You saw what others could not. The cave itself was the treasure.<br><br>In 1889, William Lynch would begin giving tours.<br>In 1950, Silver Dollar City would rise.<br>You were ahead of your time.</div></div>';
      } else if (v === 'deep') {
        h = '<div class="text-center text-glow" style="margin-top:20px"><div class="text-lg">The Gambler</div><br><div class="text-dim">' +
          'One more descent. One more haul.<br>The cave whispers of riches below...</div></div>';
      } else {
        h = '<div class="text-center text-glow" style="margin-top:20px"><div class="text-lg">The Pragmatist</div><br><div class="text-dim">' +
          'You take your earnings, tip your hat,<br>and ride the stagecoach back to civilization.</div></div>';
      }
      UI.render(h);
      UI.pressEnter(scoringScreen);
    });
  }

  // 15. Scoring
  function scoringScreen() {
    var state = gs();
    if (!state) { titleScreen(); return; }
    var bd = window.Scoring ? window.Scoring.calculateScore(state) : null;
    var html = '<div class="text-lg text-glow text-center">Final Score</div><hr class="separator-double"><table class="score-table">';
    if (bd) {
      html += sr('Survivors', bd.survivors) + sr('Resources', bd.resources) + sr('Contract', bd.contracts) + sr('Discoveries', bd.discoveries);
      html += '<tr class="score-total"><td>Subtotal</td><td>' + bd.subtotal + '</td></tr></table>';
      if (bd.multiplierReasons.length > 0) { html += '<div class="text-dim" style="margin:6px 0">Multipliers:</div>'; for (var i = 0; i < bd.multiplierReasons.length; i++) html += '<div class="text-amber text-sm">  ' + bd.multiplierReasons[i] + '</div>'; }
      html += '<table class="score-table"><tr class="score-total"><td>FINAL SCORE</td><td>' + bd.finalScore + '</td></tr></table>';
      html += '<div class="text-center text-glow" style="margin:12px 0;font-size:14px">' + window.Scoring.getRank(bd.finalScore) + '</div>';
      window.Scoring.saveScore(state.foreman.name, bd.finalScore, { profession: state.profession });
    } else {
      var tot = Math.floor(state.guanoShipped * 100 + countAlive(state) * 200 + state.discoveredChambers.length * 50);
      html += sr('Guano', Math.floor(state.guanoShipped * 100)) + sr('Survivors', countAlive(state) * 200) + sr('Exploration', state.discoveredChambers.length * 50);
      html += '<tr class="score-total"><td>TOTAL</td><td>' + tot + '</td></tr></table>';
    }
    UI.render(html);
    UI.promptChoice([{ key: '1', label: 'Top Ten', value: 'top' }, { key: '2', label: 'Play Again', value: 'again' }, { key: '3', label: 'Title', value: 'title' }], function (v) {
      if (v === 'top') UI.fadeTransition(function () { topTenScreen(true); });
      else if (v === 'again') UI.fadeTransition(professionScreen);
      else UI.fadeTransition(titleScreen);
    });
  }
  function sr(l, p) { return '<tr><td>' + l + '</td><td>' + p + '</td></tr>'; }

  // 16. Top Ten
  function topTenScreen(fromScore) {
    var scores = window.Scoring ? window.Scoring.getTopTen() : [];
    var html = '<div class="text-lg text-glow text-center">Top Ten Foremen</div><hr class="separator-double">';
    if (scores.length === 0) html += '<div class="text-center text-dim" style="margin:20px 0">No scores yet.</div>';
    else for (var i = 0; i < scores.length; i++) html += '<div class="leaderboard-entry"><span class="leaderboard-rank">' + (i + 1) + '.</span><span class="leaderboard-name">' + UI.escapeHtml(scores[i].name) + '</span><span class="leaderboard-score">' + scores[i].score + '</span></div>';
    UI.render(html);
    if (fromScore) UI.promptChoice([{ key: '1', label: 'Play Again', value: 'a' }, { key: '2', label: 'Title', value: 't' }], function (v) { UI.fadeTransition(v === 'a' ? professionScreen : titleScreen); });
    else UI.pressEnter(function () { UI.fadeTransition(titleScreen); });
  }

  // 17. Learn
  function learnScreen() {
    var pages = [
      { title: 'The Osage and the Devil\'s Den', text: 'The Osage people knew Marvel Cave as the "Devil\'s Den"\nand considered it sacred and dangerous. They marked the\nentrance with V-shaped carvings as warnings.\n\nWhite settlers discovered the cave in the 1840s.' },
      { title: 'The Mining Company (1884)', text: 'The Marble Cave Mining and Manufacturing Company was\nfounded in 1884 to extract bat guano.\n\nAt $700 per ton, guano was worth the danger.\nMiners used carbide lanterns, hemp ropes, and dynamite.' },
      { title: 'The Cave System', text: 'Marvel Cave features the Cathedral Room - the largest\ncave entrance room in America, over 200 feet tall.\n\nThe cave extends over 500 feet deep with underground\nrivers and lakes. Temperature stays 60\u00B0F year-round.' },
      { title: 'The Bald Knobbers', text: 'The Bald Knobbers were vigilantes active in the 1880s.\nOriginally formed to combat lawlessness, some factions\nbecame violent. Disbanded after hangings in 1889.' },
      { title: 'From Mine to Marvel', text: 'After the guano was exhausted, William Lynch bought\nthe cave in 1889 and began giving tours.\n\nIn 1950, the Herschend family built Silver Dollar City.\nToday Marvel Cave draws visitors from around the world.' }
    ];
    show(0);
    function show(idx) {
      UI.render('<div class="text-lg text-glow">' + UI.escapeHtml(pages[idx].title) + '</div><div class="text-dim text-sm">Page ' + (idx + 1) + '/' + pages.length + '</div><hr class="separator"><div style="white-space:pre-wrap;line-height:2">' + UI.escapeHtml(pages[idx].text) + '</div>');
      var o = [];
      if (idx < pages.length - 1) o.push({ key: 'n', label: 'Next', value: 'n' });
      if (idx > 0) o.push({ key: 'p', label: 'Previous', value: 'p' });
      o.push({ key: 'q', label: 'Back', value: 'q' });
      UI.promptChoice(o, function (v) { if (v === 'n') show(idx + 1); else if (v === 'p') show(idx - 1); else UI.fadeTransition(titleScreen); });
    }
  }

  function eventScreen(data) {
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

  window.Screens = {
    title: titleScreen, profession: professionScreen, crew: crewScreen, season: seasonScreen,
    store: storeScreen, status: statusScreen, menu: menuScreen, event: eventScreen,
    death: deathScreen, gameOver: gameOverScreen, ending: endingScreen, scoring: scoringScreen,
    topTen: topTenScreen, learn: learnScreen, supply: supplyScreen, advance: advanceGame
  };
})();
