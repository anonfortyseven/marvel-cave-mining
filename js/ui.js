/* ============================================
   UI.js - UI Rendering Utilities
   The Marvel Cave Mining Company
   ============================================ */

(function () {
  'use strict';

  var screenEl = null;
  var currentKeyHandler = null;

  function getScreen() {
    if (!screenEl) {
      screenEl = document.getElementById('screen');
    }
    return screenEl;
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

  // Show numbered menu choices and handle keyboard selection
  // options: [{key: '1', label: 'text', value: any}, ...]
  // callback: function(selectedValue)
  function promptChoice(options, callback) {
    clearKeyHandler();
    var html = '<div class="menu-options">';
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var key = opt.key || String(i + 1);
      html += '<div class="menu-option" data-key="' + key + '">';
      html += '  <span class="key">' + key + '</span>. ' + escapeHtml(opt.label);
      html += '</div>';
    }
    html += '</div>';
    append(html);

    // Scroll to bottom
    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    // Build lookup
    var keyMap = {};
    for (var j = 0; j < options.length; j++) {
      var k = options[j].key || String(j + 1);
      keyMap[k.toLowerCase()] = options[j].value !== undefined ? options[j].value : j;
    }

    // Click support
    var menuOptions = el.querySelectorAll('.menu-option');
    menuOptions.forEach(function (optEl) {
      optEl.addEventListener('click', function () {
        var clickKey = this.getAttribute('data-key').toLowerCase();
        if (keyMap.hasOwnProperty(clickKey)) {
          clearKeyHandler();
          callback(keyMap[clickKey]);
        }
      });
    });

    function handler(e) {
      var pressed = e.key.toLowerCase();
      if (keyMap.hasOwnProperty(pressed)) {
        e.preventDefault();
        clearKeyHandler();
        callback(keyMap[pressed]);
      }
    }

    currentKeyHandler = handler;
    document.addEventListener('keydown', handler);
  }

  // Text input prompt
  // label: prompt text, callback: function(value)
  function promptText(label, callback, opts) {
    clearKeyHandler();
    opts = opts || {};
    var maxLen = opts.maxLength || 20;
    var defaultVal = opts.defaultValue || '';

    var html = '<div class="game-input-line">';
    html += '<span class="prompt-label">' + escapeHtml(label) + '</span>';
    html += '<input type="text" class="game-input" maxlength="' + maxLen + '" value="' + escapeHtml(defaultVal) + '" autofocus>';
    html += '</div>';
    append(html);

    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    var inputs = el.querySelectorAll('.game-input');
    var input = inputs.length > 0 ? inputs[inputs.length - 1] : null;
    if (input) {
      setTimeout(function () { input.focus(); }, 50);

      function handler(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var val = input.value.trim();
          if (val.length > 0 || opts.allowEmpty) {
            clearKeyHandler();
            input.disabled = true;
            callback(val);
          }
        }
      }

      currentKeyHandler = handler;
      document.addEventListener('keydown', handler);
    }
  }

  // Number input prompt
  function promptNumber(label, callback, opts) {
    clearKeyHandler();
    opts = opts || {};
    var min = opts.min || 0;
    var max = opts.max || 9999;
    var defaultVal = opts.defaultValue || '';

    var html = '<div class="game-input-line">';
    html += '<span class="prompt-label">' + escapeHtml(label) + '</span>';
    html += '<input type="text" class="game-input" value="' + defaultVal + '" autofocus>';
    html += '</div>';
    append(html);

    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    var inputs = el.querySelectorAll('.game-input');
    var input = inputs.length > 0 ? inputs[inputs.length - 1] : null;
    if (input) {
      setTimeout(function () { input.focus(); }, 50);

      function handler(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var val = parseInt(input.value, 10);
          if (isNaN(val)) val = 0;
          if (val < min) val = min;
          if (val > max) val = max;
          clearKeyHandler();
          input.disabled = true;
          input.value = val;
          callback(val);
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

  // "Press ENTER to continue" prompt
  function pressEnter(callback) {
    clearKeyHandler();
    append('<div class="text-dim" style="margin-top:12px">Press ENTER to continue...</div>');

    var el = getScreen();
    el.scrollTop = el.scrollHeight;

    function handler(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearKeyHandler();
        callback();
      }
    }
    currentKeyHandler = handler;
    document.addEventListener('keydown', handler);
  }

  // Wait for any key
  function pressAnyKey(callback) {
    clearKeyHandler();
    append('<div class="text-dim" style="margin-top:8px">Press any key...</div>');
    function handler(e) {
      e.preventDefault();
      clearKeyHandler();
      callback();
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

  // Format currency
  function formatMoney(amount) {
    return '$' + (Math.round(amount * 100) / 100).toFixed(2);
  }

  // Health to label (health: 0=best, 140+=dead, lower is better)
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

  // Progress bar HTML
  function progressBar(value, max, width) {
    max = max || 100;
    width = width || 180;
    var pct = Math.max(0, Math.min(100, (value / max) * 100));
    var cls = pct > 60 ? 'good' : (pct > 25 ? '' : 'danger');
    return '<div class="progress-bar" style="width:' + width + 'px">' +
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
    getScreen: getScreen
  };

})();
