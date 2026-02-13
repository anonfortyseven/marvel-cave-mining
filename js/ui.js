/* ============================================
   UI.js - UI Rendering Utilities
   The Marvel Cave Mining Company
   ============================================ */

(function () {
  'use strict';

  var screenEl = null;
  var statusBarEl = null;
  var actionBarEl = null;
  var currentKeyHandler = null;
  var activeAnimations = [];

  function getScreen() {
    if (!screenEl) screenEl = document.getElementById('screen');
    return screenEl;
  }

  function getStatusBar() {
    if (!statusBarEl) statusBarEl = document.getElementById('status-bar');
    return statusBarEl;
  }

  function getActionBar() {
    if (!actionBarEl) actionBarEl = document.getElementById('action-bar');
    return actionBarEl;
  }

  // Remove any active keyboard handler
  function clearKeyHandler() {
    if (currentKeyHandler) {
      document.removeEventListener('keydown', currentKeyHandler);
      currentKeyHandler = null;
    }
  }

  // Render HTML content to screen element
  function render(content) {
    var el = getScreen();
    clearKeyHandler();
    el.innerHTML = content;
    el.scrollTop = 0;
  }

  // Append HTML to screen without clearing
  function append(content) {
    var el = getScreen();
    el.innerHTML += content;
  }

  // === STATUS BAR ===
  function renderStatusBar(state) {
    var bar = getStatusBar();
    if (!state) { bar.classList.remove('visible'); return; }

    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dateStr = state.date ? months[state.date.getMonth()] + ' ' + state.date.getDate() : '';

    var loc = 'Marmaros';
    if (state.isUnderground && window.CaveData) {
      var ch = window.CaveData.getChamber(state.currentChamber);
      if (ch) loc = ch.name;
    }

    var partyCount = (state.foreman && state.foreman.alive ? 1 : 0);
    for (var i = 0; i < (state.crew || []).length; i++) {
      if (state.crew[i].alive) partyCount++;
    }

    var morale = state.morale !== undefined ? state.morale : 50;
    var moraleCls = morale > 60 ? 'morale-high' : (morale > 30 ? 'morale-mid' : 'morale-low');

    bar.innerHTML =
      sbItem('', dateStr) +
      sbItem('', loc) +
      sbItem('Crew', partyCount + '/5') +
      sbItem('HP', getShortHealth(state.foreman ? state.foreman.health : 0)) +
      sbItem('$', state.cash.toFixed(0)) +
      sbItem('Food', Math.round(state.food)) +
      sbItem('Oil', state.lanternOil.toFixed(1)) +
      sbItem('Guano', state.guanoShipped.toFixed(1) + '/' + state.contractTarget + 't') +
      '<span class="sb-item"><span class="sb-label">Morale</span>' +
      '<span class="morale-bar"><span class="morale-fill ' + moraleCls + '" style="width:' + morale + '%"></span></span></span>';

    bar.classList.add('visible');
  }

  function sbItem(label, value) {
    if (label) {
      return '<span class="sb-item"><span class="sb-label">' + label + '</span> <span class="sb-value">' + value + '</span></span>';
    }
    return '<span class="sb-item"><span class="sb-value">' + value + '</span></span>';
  }

  function getShortHealth(val) {
    if (val <= 34) return '<span class="health-good">OK</span>';
    if (val <= 69) return '<span class="health-fair">Fair</span>';
    if (val <= 104) return '<span class="health-poor">Poor</span>';
    return '<span class="health-bad">Bad</span>';
  }

  // === ACTION BAR ===
  // actions: [{key: '1', label: 'Mine', value: 'mine', primary: bool, danger: bool}, ...]
  // callback: function(value)
  function renderActionBar(actions, callback) {
    var bar = getActionBar();
    clearKeyHandler();

    var html = '<div class="action-grid">';
    var keyMap = {};

    for (var i = 0; i < actions.length; i++) {
      var a = actions[i];
      var key = a.key || String(i + 1);
      var cls = 'action-btn';
      if (a.primary) cls += ' btn-primary';
      if (a.danger) cls += ' btn-danger';

      html += '<button class="' + cls + '" data-key="' + key + '" data-value="' + (a.value !== undefined ? a.value : i) + '">';
      html += '<span class="btn-key">' + key + '</span> ' + escapeHtml(a.label);
      html += '</button>';

      keyMap[key.toLowerCase()] = a.value !== undefined ? a.value : i;
    }
    html += '</div>';
    bar.innerHTML = html;
    bar.classList.add('visible');

    // Click/touch handlers
    var btns = bar.querySelectorAll('.action-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function () {
        var val = this.getAttribute('data-value');
        // Try to match original value type
        if (keyMap.hasOwnProperty(this.getAttribute('data-key').toLowerCase())) {
          val = keyMap[this.getAttribute('data-key').toLowerCase()];
        }
        clearKeyHandler();
        bar.classList.remove('visible');
        callback(val);
      });
    }

    // Keyboard handler
    function handler(e) {
      var pressed = e.key.toLowerCase();
      if (keyMap.hasOwnProperty(pressed)) {
        e.preventDefault();
        clearKeyHandler();
        bar.classList.remove('visible');
        callback(keyMap[pressed]);
      }
    }
    currentKeyHandler = handler;
    document.addEventListener('keydown', handler);
  }

  function hideActionBar() {
    var bar = getActionBar();
    bar.classList.remove('visible');
    bar.innerHTML = '';
  }

  // Show/hide bars for gameplay vs non-gameplay screens
  function showBars() {
    getStatusBar().classList.add('visible');
  }

  function hideBars() {
    getStatusBar().classList.remove('visible');
    getStatusBar().innerHTML = '';
    hideActionBar();
  }

  // === ANIMATION SYSTEM ===
  function startAnimation(element, frames, intervalMs) {
    if (!element || !frames || frames.length === 0) return null;
    intervalMs = intervalMs || 500;
    var idx = 0;
    var id = setInterval(function () {
      idx = (idx + 1) % frames.length;
      element.textContent = frames[idx];
    }, intervalMs);
    var anim = { id: id, element: element };
    activeAnimations.push(anim);
    return anim;
  }

  function stopAllAnimations() {
    for (var i = 0; i < activeAnimations.length; i++) {
      clearInterval(activeAnimations[i].id);
    }
    activeAnimations = [];
  }

  // Typewriter effect - returns a promise
  function typeWriter(el, text, speed) {
    speed = speed || 30;
    return new Promise(function (resolve) {
      var i = 0;
      el.classList.add('typewriter-active');
      el.classList.add('blink-cursor');
      function tick() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(tick, speed);
        } else {
          el.classList.remove('typewriter-active');
          el.classList.remove('blink-cursor');
          resolve();
        }
      }
      tick();
    });
  }

  // Show numbered menu choices with arrow navigation + OK button
  function promptChoice(options, callback) {
    clearKeyHandler();
    var selectedIdx = 0;

    var html = '<div class="menu-options" id="menu-choices">';
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var key = opt.key || String(i + 1);
      html += '<div class="menu-option' + (i === 0 ? ' selected' : '') + '" data-key="' + key + '" data-idx="' + i + '">';
      html += '  <span class="key">' + key + '</span>. ' + escapeHtml(opt.label);
      html += '</div>';
    }
    html += '</div>';

    // Arrow nav buttons + OK
    html += '<div class="nav-buttons">';
    html += '<button class="nav-btn" id="nav-up" aria-label="Previous"><span class="nav-arrow">&#9650;</span></button>';
    html += '<button class="nav-btn nav-ok" id="nav-ok">OK</button>';
    html += '<button class="nav-btn" id="nav-down" aria-label="Next"><span class="nav-arrow">&#9660;</span></button>';
    html += '</div>';
    append(html);

    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    var keyMap = {};
    var keyList = [];
    for (var j = 0; j < options.length; j++) {
      var k = options[j].key || String(j + 1);
      keyMap[k.toLowerCase()] = options[j].value !== undefined ? options[j].value : j;
      keyList.push(k.toLowerCase());
    }

    var menuOptions = el.querySelectorAll('#menu-choices .menu-option');

    function updateHighlight() {
      for (var m = 0; m < menuOptions.length; m++) {
        menuOptions[m].classList.toggle('selected', m === selectedIdx);
      }
      // Scroll selected into view
      if (menuOptions[selectedIdx]) {
        menuOptions[selectedIdx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    function confirmSelection() {
      var chosenKey = keyList[selectedIdx];
      if (keyMap.hasOwnProperty(chosenKey)) {
        clearKeyHandler();
        callback(keyMap[chosenKey]);
      }
    }

    // Click/tap on options
    menuOptions.forEach(function (optEl) {
      optEl.addEventListener('click', function () {
        var clickIdx = parseInt(this.getAttribute('data-idx'), 10);
        selectedIdx = clickIdx;
        updateHighlight();
        confirmSelection();
      });
    });

    // Nav button handlers
    var upBtn = document.getElementById('nav-up');
    var downBtn = document.getElementById('nav-down');
    var okBtn = document.getElementById('nav-ok');

    if (upBtn) upBtn.addEventListener('click', function (e) {
      e.preventDefault();
      selectedIdx = (selectedIdx - 1 + options.length) % options.length;
      updateHighlight();
    });
    if (downBtn) downBtn.addEventListener('click', function (e) {
      e.preventDefault();
      selectedIdx = (selectedIdx + 1) % options.length;
      updateHighlight();
    });
    if (okBtn) okBtn.addEventListener('click', function (e) {
      e.preventDefault();
      confirmSelection();
    });

    function handler(e) {
      var pressed = e.key;
      if (pressed === 'ArrowUp' || pressed === 'Up') {
        e.preventDefault();
        selectedIdx = (selectedIdx - 1 + options.length) % options.length;
        updateHighlight();
        return;
      }
      if (pressed === 'ArrowDown' || pressed === 'Down') {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % options.length;
        updateHighlight();
        return;
      }
      if (pressed === 'Enter') {
        e.preventDefault();
        confirmSelection();
        return;
      }
      // Direct key press still works
      var lp = pressed.toLowerCase();
      if (keyMap.hasOwnProperty(lp)) {
        e.preventDefault();
        clearKeyHandler();
        callback(keyMap[lp]);
      }
    }

    currentKeyHandler = handler;
    document.addEventListener('keydown', handler);
  }

  // Text input prompt with submit button
  function promptText(label, callback, opts) {
    clearKeyHandler();
    opts = opts || {};
    var maxLen = opts.maxLength || 20;
    var defaultVal = opts.defaultValue || '';

    var html = '<div class="game-input-line">';
    html += '<span class="prompt-label">' + escapeHtml(label) + '</span>';
    html += '<input type="text" class="game-input" maxlength="' + maxLen + '" value="' + escapeHtml(defaultVal) + '" autofocus>';
    html += '<button class="submit-btn" id="input-submit">GO</button>';
    html += '</div>';
    append(html);

    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    var inputs = el.querySelectorAll('.game-input');
    var input = inputs.length > 0 ? inputs[inputs.length - 1] : null;
    if (input) {
      setTimeout(function () { input.focus(); }, 50);

      function doSubmit() {
        var val = input.value.trim();
        if (val.length > 0 || opts.allowEmpty) {
          clearKeyHandler();
          input.disabled = true;
          var btn = input.parentNode.querySelector('.submit-btn');
          if (btn) btn.disabled = true;
          callback(val);
        }
      }

      // Submit button click
      var submitBtn = input.parentNode.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
          e.preventDefault();
          doSubmit();
        });
      }

      function handler(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSubmit();
        }
      }

      currentKeyHandler = handler;
      document.addEventListener('keydown', handler);
    }
  }

  // Number input prompt with submit button
  function promptNumber(label, callback, opts) {
    clearKeyHandler();
    opts = opts || {};
    var min = opts.min || 0;
    var max = opts.max || 9999;
    var defaultVal = opts.defaultValue || '';

    var html = '<div class="game-input-line">';
    html += '<span class="prompt-label">' + escapeHtml(label) + '</span>';
    html += '<input type="text" class="game-input" inputmode="numeric" value="' + defaultVal + '" autofocus>';
    html += '<button class="submit-btn" id="input-submit">GO</button>';
    html += '</div>';
    append(html);

    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    var inputs = el.querySelectorAll('.game-input');
    var input = inputs.length > 0 ? inputs[inputs.length - 1] : null;
    if (input) {
      setTimeout(function () { input.focus(); }, 50);

      function doSubmit() {
        var val = parseInt(input.value, 10);
        if (isNaN(val)) val = 0;
        if (val < min) val = min;
        if (val > max) val = max;
        clearKeyHandler();
        input.disabled = true;
        input.value = val;
        var btn = input.parentNode.querySelector('.submit-btn');
        if (btn) btn.disabled = true;
        callback(val);
      }

      // Submit button click
      var submitBtn = input.parentNode.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
          e.preventDefault();
          doSubmit();
        });
      }

      function handler(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSubmit();
        }
      }

      currentKeyHandler = handler;
      document.addEventListener('keydown', handler);
    }
  }

  // Show a temporary notification overlay
  function showNotification(text, duration) {
    duration = duration || 2000;
    var container = document.getElementById('game-container');
    var note = document.createElement('div');
    note.className = 'notification';
    note.textContent = text;
    container.appendChild(note);

    setTimeout(function () {
      note.classList.add('fade-out');
      setTimeout(function () {
        if (note.parentNode) note.parentNode.removeChild(note);
      }, 300);
    }, duration);
  }

  // Draw a bordered box with optional title
  function drawBox(title, content, opts) {
    opts = opts || {};
    var width = opts.width || 60;
    var lines = content.split('\n');

    var top = '\u2554' + repeat('\u2550', width - 2) + '\u2557';
    var bottom = '\u255A' + repeat('\u2550', width - 2) + '\u255D';
    var result = top + '\n';

    if (title) {
      var titleLine = '\u2551 ' + title + repeat(' ', width - 4 - title.length) + ' \u2551';
      var sep = '\u2560' + repeat('\u2550', width - 2) + '\u2563';
      result += titleLine + '\n' + sep + '\n';
    }

    for (var i = 0; i < lines.length; i++) {
      var stripped = stripHtml(lines[i]);
      var pad = width - 4 - stripped.length;
      if (pad < 0) pad = 0;
      result += '\u2551 ' + lines[i] + repeat(' ', pad) + ' \u2551\n';
    }

    result += bottom;
    return result;
  }

  // Fade transition between screens
  function fadeTransition(callback) {
    var el = getScreen();
    el.classList.add('screen-fade-out');
    setTimeout(function () {
      el.classList.remove('screen-fade-out');
      stopAllAnimations();
      callback();
      el.classList.add('screen-fade-in');
      setTimeout(function () {
        el.classList.remove('screen-fade-in');
      }, 300);
    }, 300);
  }

  // Bat animation on title screen
  function animateBats() {
    var el = getScreen();
    var batChars = ['/\\v/\\', '~\\v/~', '^\\v/^'];
    for (var i = 0; i < 3; i++) {
      var bat = document.createElement('span');
      bat.className = 'bat';
      bat.textContent = batChars[i % batChars.length];
      bat.style.top = (40 + Math.random() * 60) + 'px';
      bat.style.left = (50 + Math.random() * 400) + 'px';
      bat.style.animationDelay = (-Math.random() * 4) + 's';
      el.appendChild(bat);
    }
  }

  // "Press ENTER to continue" - prominent tappable button
  function pressEnter(callback) {
    clearKeyHandler();
    append('<div style="margin-top:14px;text-align:center">' +
      '<button class="continue-btn" id="press-enter-prompt">CONTINUE</button>' +
      '</div>');

    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      clearKeyHandler();
      callback();
    }

    setTimeout(function () {
      var prompt = document.getElementById('press-enter-prompt');
      if (prompt) prompt.addEventListener('click', fire);
    }, 50);

    function handler(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fire();
      }
    }
    currentKeyHandler = handler;
    document.addEventListener('keydown', handler);
  }

  // Wait for any key - prominent tappable button
  function pressAnyKey(callback) {
    clearKeyHandler();
    append('<div style="margin-top:10px;text-align:center">' +
      '<button class="continue-btn continue-btn-sm" id="press-any-prompt">CONTINUE</button>' +
      '</div>');

    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      clearKeyHandler();
      callback();
    }

    setTimeout(function () {
      var prompt = document.getElementById('press-any-prompt');
      if (prompt) prompt.addEventListener('click', fire);
    }, 50);

    function handler(e) {
      e.preventDefault();
      fire();
    }
    currentKeyHandler = handler;
    document.addEventListener('keydown', handler);
  }

  // --- Helpers ---

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function repeat(ch, n) {
    if (n <= 0) return '';
    var s = '';
    for (var i = 0; i < n; i++) s += ch;
    return s;
  }

  function stripHtml(str) {
    return str.replace(/<[^>]*>/g, '');
  }

  function formatMoney(amount) {
    return '$' + (Math.round(amount * 100) / 100).toFixed(2);
  }

  function healthLabel(val) {
    if (window.HealthSystem && window.HealthSystem.getHealthLabel) {
      var label = window.HealthSystem.getHealthLabel(val);
      var cls = (window.HealthSystem.getHealthClass) ? window.HealthSystem.getHealthClass(val) : 'health-good';
      return '<span class="' + cls + '">' + label + '</span>';
    }
    if (val <= 34) return '<span class="health-good">Good</span>';
    if (val <= 69) return '<span class="health-fair">Fair</span>';
    if (val <= 104) return '<span class="health-poor">Poor</span>';
    return '<span class="health-bad">Very Poor</span>';
  }

  function progressBar(value, max, width) {
    max = max || 100;
    width = width || 180;
    var pct = Math.max(0, Math.min(100, (value / max) * 100));
    var cls = pct > 60 ? 'good' : (pct > 25 ? '' : 'danger');
    return '<div class="progress-bar" style="width:min(' + width + 'px,80vw)">' +
      '<div class="progress-fill ' + cls + '" style="width:' + pct + '%"></div></div>';
  }

  // --- Public API ---
  window.UI = {
    render: render,
    append: append,
    typeWriter: typeWriter,
    promptChoice: promptChoice,
    promptText: promptText,
    promptNumber: promptNumber,
    showNotification: showNotification,
    drawBox: drawBox,
    fadeTransition: fadeTransition,
    animateBats: animateBats,
    pressEnter: pressEnter,
    pressAnyKey: pressAnyKey,
    clearKeyHandler: clearKeyHandler,
    escapeHtml: escapeHtml,
    formatMoney: formatMoney,
    healthLabel: healthLabel,
    progressBar: progressBar,
    repeat: repeat,
    getScreen: getScreen,
    // New APIs
    renderStatusBar: renderStatusBar,
    renderActionBar: renderActionBar,
    hideActionBar: hideActionBar,
    showBars: showBars,
    hideBars: hideBars,
    startAnimation: startAnimation,
    stopAllAnimations: stopAllAnimations
  };

})();
