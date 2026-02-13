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
    var html = '<div class="text-lg text-glow">Choose Your Background</div>';
    html += '<hr class="separator-double">';
    html += '<div class="text-dim" style="margin:6px 0">Your choice determines starting funds and score multiplier.</div>';

    html += '<div class="box" style="margin:6px 0"><div class="box-title">1. Investor</div>';
    html += '<div class="text-bright">$1,600 &bull; 8 ton contract &bull; Score: x1</div>';
    html += '<div class="text-dim">You bankrolled this from your St. Louis parlor.</div></div>';

    html += '<div class="box" style="margin:6px 0"><div class="box-title">2. Miner</div>';
    html += '<div class="text-bright">$800 &bull; 12 ton contract &bull; Score: x2</div>';
    html += '<div class="text-dim">You worked the lead mines in Joplin. You know rock.</div></div>';

    html += '<div class="box" style="margin:6px 0"><div class="box-title">3. Farmer</div>';
    html += '<div class="text-bright">$400 &bull; 15 ton contract &bull; Score: x3</div>';
    html += '<div class="text-dim">You heard about the guano money and left your homestead.</div></div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Investor from St. Louis', value: 'investor' },
      { key: '2', label: 'Experienced Miner', value: 'miner' },
      { key: '3', label: 'Local Ozark Farmer', value: 'farmer' }
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
    var names = [];
    UI.render('<div class="text-lg text-glow">Name Your Mining Crew</div><hr class="separator-double">' +
      '<div class="text-dim" style="margin:6px 0">Name your foreman and four miners.</div>');
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
      UI.pressEnter(function () { UI.transition(seasonScreen); });
    }
  }

  // =========================================
  // 4. SEASON
  // =========================================
  function seasonScreen() {
    UI.hideBars();
    var html = '<div class="text-lg text-glow">Choose Starting Season</div><hr class="separator-double">';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">1. Spring</div><div class="text-dim">March. Flooding risk. Long runway.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">2. Summer</div><div class="text-dim">June. Ideal conditions. Bats active.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">3. Fall</div><div class="text-dim">September. Good conditions, short clock.</div></div>';
    html += '<div class="box" style="margin:6px 0"><div class="box-title">4. Winter</div><div class="text-dim">December. Supply routes frozen. Hard mode.</div></div>';
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

    // === BUILD MAIN CONTENT ===
    var html = '';

    // Pixel art image for location
    if (window.Images) {
      if (state.isUnderground) {
        html += Images.getCaveImage(state.currentChamber);
      } else {
        html += Images.getImageHtml('town');
      }
    }

    // Chamber art
    var art = getArt(state.currentChamber);
    if (art) {
      html += '<pre class="chamber-art">' + art + '</pre>';
    }

    // Location header
    html += '<div class="text-bright text-glow">' + UI.escapeHtml(chamberName);
    if (state.isUnderground && depth > 0) html += ' <span class="text-dim">(' + depth + ' ft deep)</span>';
    html += '</div>';

    // Chamber description
    if (chamber && chamber.description) {
      html += '<div class="zone-desc">' + UI.escapeHtml(chamber.description) + '</div>';
    }

    // Ambient text and animation
    if (state.isUnderground) {
      var ambient = getAmbient(state.currentChamber);
      if (ambient) html += '<div class="ambient-text">' + UI.escapeHtml(ambient) + '</div>';

      // Pick ambient animation based on zone
      var animId = null;
      if (chamber) {
        var zone = chamber.zone || '';
        if (state.currentChamber === 'bat_colony' || state.currentChamber === 'cathedral_floor') animId = 'bat_wings';
        else if (zone === 'zone4' || zone === 'zone5') animId = 'stalactite_drip';
        else if (state.currentChamber === 'cloud_room' || state.currentChamber === 'the_narrows') animId = 'cave_wind';
        else animId = 'torch_flicker';
      }
      if (animId && window.AsciiArt) {
        var anim = window.AsciiArt.getAnimation(animId);
        if (anim) {
          html += '<pre class="ambient-anim" id="status-anim">' + anim.frames[0] + '</pre>';
        }
      }
    }

    html += '<hr class="separator">';

    // Crew health compact
    html += '<div class="text-sm">';
    html += '<span>' + UI.escapeHtml(state.foreman.name) + ' ' + healthLabel(state.foreman.health) + '</span>';
    for (var i = 0; i < state.crew.length; i++) {
      var m = state.crew[i];
      if (m.alive) {
        html += ' &bull; <span>' + UI.escapeHtml(m.name) + ' ' + healthLabel(m.health) + '</span>';
      } else {
        html += ' &bull; <span class="text-gray">' + UI.escapeHtml(m.name) + ' \u2020</span>';
      }
    }
    html += '</div>';

    html += '<hr class="separator">';

    // Key stats in grid
    html += '<div class="status-grid">';
    html += si('Guano', state.guanoShipped.toFixed(1) + ' / ' + state.contractTarget + ' tons');
    html += si('Stockpile', state.guanoStockpile.toFixed(2) + ' tons');
    html += si('Cash', '$' + state.cash.toFixed(2));
    html += si('Food', Math.round(state.food) + ' lbs');
    html += si('Oil', state.lanternOil.toFixed(1) + ' gal');
    html += si('Pace', state.workPace);
    html += si('Rations', state.rationLevel);
    html += si('Rope', state.rope + ' ft');
    html += '</div>';

    // Progress bar
    html += '<div style="margin:4px 0">' + UI.progressBar(state.guanoShipped, state.contractTarget) + '</div>';

    UI.render(html);

    // Start ambient animation if present
    if (state.isUnderground) {
      var animEl = document.getElementById('status-anim');
      if (animEl && window.AsciiArt) {
        var animId2 = null;
        if (chamber) {
          var zone2 = chamber.zone || '';
          if (state.currentChamber === 'bat_colony' || state.currentChamber === 'cathedral_floor') animId2 = 'bat_wings';
          else if (zone2 === 'zone4' || zone2 === 'zone5') animId2 = 'stalactite_drip';
          else if (state.currentChamber === 'cloud_room' || state.currentChamber === 'the_narrows') animId2 = 'cave_wind';
          else animId2 = 'torch_flicker';
        }
        if (animId2) {
          var anim2 = window.AsciiArt.getAnimation(animId2);
          if (anim2) UI.startAnimation(animEl, anim2.frames, anim2.interval);
        }
      }
    }

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
        { key: 'm', label: musicLabel, value: 'music' }
      ];
    } else {
      actions = [
        { key: '1', label: 'Enter Cave', value: 'enter', primary: true },
        { key: '2', label: 'Visit Town', value: 'town' },
        { key: '3', label: 'Ship Guano', value: 'ship' },
        { key: '4', label: 'Rest', value: 'rest' },
        { key: '5', label: 'Supplies', value: 'supplies' },
        { key: '6', label: 'Save', value: 'save' },
        { key: 'm', label: musicLabel, value: 'music' }
      ];
    }

    UI.renderActionBar(actions, function (val) {
      handleAction(val);
    });
  }

  function si(label, value) {
    return '<div class="status-row"><span class="status-label">' + label + ':</span><span class="status-value">' + value + '</span></div>';
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

    var deeper = (chamber.connectedTo || []).filter(function (id) {
      var c = getChamberData(id);
      return c && c.depth > chamber.depth;
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
      UI.hideBars();
      UI.render('<div class="text-bright">You emerge from the cave into daylight at Marmaros.</div>');
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
      UI.hideBars();
      UI.render('<div class="text-bright">You emerge at Marmaros.</div>');
    } else {
      UI.hideBars();
      UI.render('<div class="text-bright">You ascend to ' + (t ? t.name : 'the previous chamber') + '.</div>');
    }
    UI.pressEnter(function () { statusScreen(); });
  }

  function restDay() {
    UI.hideBars();
    var state = gs();
    if (!state) return;
    var orig = state.workPace;
    state.workPace = 'careful';

    if (window.Engine) {
      var r = window.Engine.advanceDay();
      state.workPace = orig;
      var html = '<div class="text-bright">The crew rests for a full day.</div>';
      if (r && r.messages.length > 0) {
        html += '<div class="text-dim" style="margin-top:6px">';
        for (var i = 0; i < r.messages.length; i++) html += UI.escapeHtml(r.messages[i]) + '<br>';
        html += '</div>';
      }
      UI.render(html);
    } else {
      state.workPace = orig;
      UI.render('<div class="text-bright">The crew rests. Health improves.</div>');
    }
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
      { title: 'The Osage and the Devil\'s Den', text: 'The Osage people knew Marvel Cave as the "Devil\'s Den"\nand considered it sacred and dangerous. They marked the\nentrance with V-shaped carvings as warnings.\n\nWhite settlers discovered the cave in the 1840s.' },
      { title: 'The Mining Company (1884)', text: 'The Marble Cave Mining and Manufacturing Company was\nfounded in 1884 to extract bat guano.\n\nAt $700 per ton, guano was worth the danger.\nMiners used carbide lanterns, hemp ropes, and dynamite.' },
      { title: 'The Cave System', text: 'Marvel Cave features the Cathedral Room - the largest\ncave entrance room in America, over 200 feet tall.\n\nThe cave extends over 500 feet deep with underground\nrivers and lakes. Temperature stays 60\u00B0F year-round.' },
      { title: 'The Bald Knobbers', text: 'The Bald Knobbers were vigilantes active in the 1880s.\nOriginally formed to combat lawlessness, some factions\nbecame violent. Disbanded after hangings in 1889.' },
      { title: 'From Mine to Marvel', text: 'After the guano was exhausted, William Lynch bought\nthe cave in 1889 and began giving tours.\n\nIn 1950, the Herschend family built Silver Dollar City.\nToday Marvel Cave draws visitors from around the world.' }
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
