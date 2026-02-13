/*
 * taffy-game.js - Taffy Pulling Mini-Game
 * The Marvel Cave Mining Company
 *
 * Canvas-based Simon Says pattern-matching mini-game at Penny's
 * Sweet Shop. Watch the coloured sequence, then repeat it.
 */
(function () {
  'use strict';

  var canvas, ctx, scale;
  var animFrame = null;
  var gameRunning = false;
  var gamePhase = 'title'; // title | watch | input | round-result | results
  var callback = null;

  // Colors - retro amber-on-black
  var CLR = {
    bg:     '#0a0a0a',
    text:   '#d4a055',
    bright: '#f0c070',
    dim:    '#8a6830',
    green:  '#5cb85c',
    red:    '#c0392b',
    yellow: '#f0d060',
    blue:   '#4a90d9',
    white:  '#dddddd'
  };

  // Button layout (diamond arrangement, center at 320, 200)
  var BTN_SIZE = 80;
  var BUTTONS = [
    { id: 'up',    label: '\u25B2', color: CLR.green,  cx: 320, cy: 130 },
    { id: 'right', label: '\u25B6', color: CLR.yellow, cx: 400, cy: 200 },
    { id: 'down',  label: '\u25BC', color: CLR.red,    cx: 320, cy: 270 },
    { id: 'left',  label: '\u25C0', color: CLR.blue,   cx: 240, cy: 200 }
  ];

  var KEY_MAP = {
    'ArrowUp':    'up',
    'ArrowRight': 'right',
    'ArrowDown':  'down',
    'ArrowLeft':  'left'
  };

  // Timing
  var lastTimestamp = 0;
  var phaseTimer = 0;

  // Rounds
  var TOTAL_ROUNDS = 5;
  var currentRound = 0;
  var roundsWon = 0;

  // Sequence
  var sequence = [];
  var seqIndex = 0;
  var SHOW_INTERVAL = 0.6; // seconds per item shown
  var showTimer = 0;

  // Player input
  var inputIndex = 0;
  var inputCorrect = true;

  // Visual feedback
  var litButton = null;   // id of currently-lit button during show phase
  var flashButton = null;  // id of button player pressed
  var flashColor = null;   // 'green' correct or 'red' wrong
  var flashTimer = 0;

  // Taffy animation
  var taffyStretch = 0; // 0..1 for sine wave amplitude
  var taffyWave = 0;

  // Round result display
  var roundResultTimer = 0;
  var roundResultText = '';

  // Title screen timer
  var titleTimer = 0;

  // Watch prompt timer
  var watchPromptTimer = 0;
  var WATCH_PROMPT_DUR = 1.2;

  // Event references for cleanup
  var boundKeyDown = null;
  var boundTouchStart = null;

  // -------- INIT --------

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
    scale = canvas.width / 640;
  }

  function resetGame() {
    gamePhase = 'title';
    gameRunning = true;
    currentRound = 0;
    roundsWon = 0;
    sequence = [];
    litButton = null;
    flashButton = null;
    taffyStretch = 0;
    taffyWave = 0;
    titleTimer = 2.5;
  }

  function startRound() {
    currentRound++;
    if (currentRound > TOTAL_ROUNDS) {
      showResults();
      return;
    }
    // Build sequence: length = 2 + currentRound (so 3..7)
    var seqLen = 2 + currentRound;
    sequence = [];
    var dirs = ['up', 'right', 'down', 'left'];
    for (var i = 0; i < seqLen; i++) {
      sequence.push(dirs[Math.floor(Math.random() * 4)]);
    }
    seqIndex = 0;
    inputIndex = 0;
    inputCorrect = true;
    litButton = null;
    flashButton = null;

    // Show "Watch carefully!" then start watch phase
    gamePhase = 'watch-prompt';
    watchPromptTimer = WATCH_PROMPT_DUR;
  }

  function beginWatch() {
    gamePhase = 'watch';
    seqIndex = 0;
    showTimer = 0.3; // brief pause before first light
    litButton = null;
  }

  // -------- INPUT --------

  function handleInput(dir) {
    if (gamePhase === 'title') return;
    if (gamePhase === 'results') {
      endGame();
      return;
    }
    if (gamePhase !== 'input') return;

    flashButton = dir;
    taffyStretch = 1;

    if (dir === sequence[inputIndex]) {
      flashColor = 'green';
      flashTimer = 0.3;
      inputIndex++;
      if (inputIndex >= sequence.length) {
        // Round won
        roundsWon++;
        roundResultText = 'Correct!';
        roundResultTimer = 1.0;
        gamePhase = 'round-result';
      }
    } else {
      // Wrong
      flashColor = 'red';
      flashTimer = 0.5;
      inputCorrect = false;
      roundResultText = 'Wrong!';
      roundResultTimer = 1.0;
      gamePhase = 'round-result';
    }
  }

  function onKeyDown(e) {
    var dir = KEY_MAP[e.code];
    if (dir) {
      e.preventDefault();
      handleInput(dir);
    }
    if ((e.code === 'Space' || e.code === 'Enter') && gamePhase === 'results') {
      e.preventDefault();
      endGame();
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var tx = (touch.clientX - rect.left) * (canvas.width / rect.width);
    var ty = (touch.clientY - rect.top) * (canvas.height / rect.height);

    // Check button hits
    for (var i = 0; i < BUTTONS.length; i++) {
      var b = BUTTONS[i];
      var bx = (b.cx - BTN_SIZE / 2) * scale;
      var by = (b.cy - BTN_SIZE / 2) * scale;
      var bw = BTN_SIZE * scale;
      var bh = BTN_SIZE * scale;
      if (tx >= bx && tx <= bx + bw && ty >= by && ty <= by + bh) {
        handleInput(b.id);
        return;
      }
    }

    // Tap anywhere on results to continue
    if (gamePhase === 'results') {
      endGame();
    }
  }

  // -------- UPDATE --------

  function update(dt) {
    taffyWave += dt * 3;
    if (taffyStretch > 0) taffyStretch = Math.max(taffyStretch - dt * 2.5, 0);
    if (flashTimer > 0) flashTimer -= dt;

    if (gamePhase === 'title') {
      titleTimer -= dt;
      if (titleTimer <= 0) {
        startRound();
      }
      return;
    }

    if (gamePhase === 'watch-prompt') {
      watchPromptTimer -= dt;
      if (watchPromptTimer <= 0) {
        beginWatch();
      }
      return;
    }

    if (gamePhase === 'watch') {
      showTimer -= dt;
      if (showTimer <= 0) {
        if (seqIndex < sequence.length) {
          litButton = sequence[seqIndex];
          seqIndex++;
          showTimer = SHOW_INTERVAL;
        } else {
          // Done showing, player's turn
          litButton = null;
          gamePhase = 'input';
          inputIndex = 0;
        }
      }
      // Brief gap between lights
      if (showTimer < SHOW_INTERVAL * 0.15) {
        litButton = null;
      }
      return;
    }

    if (gamePhase === 'round-result') {
      roundResultTimer -= dt;
      if (roundResultTimer <= 0) {
        startRound();
      }
      return;
    }
  }

  // -------- RESULTS --------

  function showResults() {
    gamePhase = 'results';
  }

  function getReward() {
    if (roundsWon >= 5) return { label: 'Taffy Master!',    cash: 2, morale: 10, taffy: 2 };
    if (roundsWon >= 3) return { label: 'Sweet work!',      cash: 1, morale: 5,  taffy: 1 };
    if (roundsWon >= 1) return { label: 'A bit sticky...',  cash: 0, morale: 3,  taffy: 0 };
    return { label: 'All tangled up!', cash: 0, morale: 1,  taffy: 0 };
  }

  function endGame() {
    gameRunning = false;
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }

    document.removeEventListener('keydown', boundKeyDown);
    canvas.removeEventListener('touchstart', boundTouchStart);

    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');

    var reward = getReward();
    var items = {};
    if (reward.taffy > 0) items.taffy = reward.taffy;

    setTimeout(function () {
      if (callback) callback({ cash: reward.cash, morale: reward.morale, items: items });
    }, 1000);
  }

  // -------- RENDERING --------

  function drawButton(b, lit, flash, fColor) {
    var bx = (b.cx - BTN_SIZE / 2) * scale;
    var by = (b.cy - BTN_SIZE / 2) * scale;
    var bw = BTN_SIZE * scale;
    var bh = BTN_SIZE * scale;

    // Background
    var bgAlpha = lit ? 1.0 : 0.35;
    ctx.globalAlpha = bgAlpha;
    ctx.fillStyle = b.color;
    ctx.fillRect(bx, by, bw, bh);
    ctx.globalAlpha = 1;

    // Border
    if (flash && flashTimer > 0) {
      ctx.strokeStyle = fColor === 'green' ? CLR.green : CLR.red;
      ctx.lineWidth = 4 * scale;
    } else if (lit) {
      ctx.strokeStyle = CLR.white;
      ctx.lineWidth = 3 * scale;
    } else {
      ctx.strokeStyle = CLR.dim;
      ctx.lineWidth = 2 * scale;
    }
    ctx.strokeRect(bx, by, bw, bh);

    // Arrow label
    ctx.fillStyle = lit ? CLR.white : CLR.text;
    ctx.font = (20 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.label, b.cx * scale, b.cy * scale);
    ctx.textBaseline = 'alphabetic';
  }

  function drawTaffy() {
    // Two "hands" pulling taffy
    var lx = 160 * scale;
    var rx = 480 * scale;
    var ty = 200 * scale;
    var handW = 24 * scale;
    var handH = 30 * scale;

    // Hands
    ctx.fillStyle = CLR.dim;
    ctx.fillRect(lx - handW, ty - handH / 2, handW, handH);
    ctx.fillRect(rx, ty - handH / 2, handW, handH);

    // Taffy strand - sine wave between hands
    ctx.strokeStyle = '#e8a0c0';
    ctx.lineWidth = 8 * scale;
    ctx.beginPath();
    var amp = 12 + taffyStretch * 18;
    for (var i = 0; i <= 40; i++) {
      var t = i / 40;
      var px = lx + t * (rx - lx);
      var py = ty + Math.sin(t * Math.PI * 3 + taffyWave) * amp * scale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Taffy highlight
    ctx.strokeStyle = '#f0c8d8';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    for (var j = 0; j <= 40; j++) {
      var t2 = j / 40;
      var px2 = lx + t2 * (rx - lx);
      var py2 = ty - 3 * scale + Math.sin(t2 * Math.PI * 3 + taffyWave) * amp * scale;
      if (j === 0) ctx.moveTo(px2, py2);
      else ctx.lineTo(px2, py2);
    }
    ctx.stroke();
  }

  function drawSequenceDots() {
    if (gamePhase !== 'input' && gamePhase !== 'watch') return;

    var total = sequence.length;
    var dotR = 5 * scale;
    var gap = 16 * scale;
    var startX = 320 * scale - ((total - 1) * gap) / 2;
    var dotY = 60 * scale;

    for (var i = 0; i < total; i++) {
      var filled = false;
      if (gamePhase === 'watch' && i < seqIndex) filled = true;
      if (gamePhase === 'input' && i < inputIndex) filled = true;

      ctx.beginPath();
      ctx.arc(startX + i * gap, dotY, dotR, 0, Math.PI * 2);
      if (filled) {
        ctx.fillStyle = CLR.green;
        ctx.fill();
      } else {
        ctx.strokeStyle = CLR.dim;
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();
      }
    }
  }

  function drawHUD() {
    ctx.fillStyle = CLR.text;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Round ' + Math.min(currentRound, TOTAL_ROUNDS) + '/' + TOTAL_ROUNDS, 20 * scale, 385 * scale);

    ctx.textAlign = 'right';
    ctx.fillText('Score: ' + roundsWon + '/' + TOTAL_ROUNDS, 620 * scale, 385 * scale);
  }

  function drawTitle() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = (16 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TAFFY PULLING', 320 * scale, 100 * scale);

    ctx.fillStyle = CLR.text;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText("at Penny's Sweet Shop", 320 * scale, 130 * scale);

    ctx.fillStyle = CLR.dim;
    ctx.fillText('Watch the sequence, then', 320 * scale, 180 * scale);
    ctx.fillText('repeat it with arrow keys', 320 * scale, 200 * scale);
    ctx.fillText('or tap the buttons!', 320 * scale, 220 * scale);

    drawTaffy();

    ctx.fillStyle = CLR.dim;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Starting soon...', 320 * scale, 350 * scale);
  }

  function drawWatchPrompt() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = (14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Round ' + currentRound, 320 * scale, 160 * scale);

    ctx.fillStyle = CLR.yellow;
    ctx.font = (12 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Watch carefully!', 320 * scale, 220 * scale);

    ctx.fillStyle = CLR.dim;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Sequence length: ' + sequence.length, 320 * scale, 270 * scale);
  }

  function drawRoundResult() {
    // Keep the game screen but overlay the result text
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var isCorrect = roundResultText === 'Correct!';
    ctx.fillStyle = isCorrect ? CLR.green : CLR.red;
    ctx.font = (20 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(roundResultText, 320 * scale, 200 * scale);

    drawHUD();
  }

  function drawResultsScreen() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var reward = getReward();

    ctx.fillStyle = CLR.bright;
    ctx.font = (16 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TAFFY PULLING DONE', 320 * scale, 70 * scale);

    ctx.fillStyle = CLR.text;
    ctx.font = (12 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Rounds Won: ' + roundsWon + ' / ' + TOTAL_ROUNDS, 320 * scale, 130 * scale);

    var rColor = roundsWon >= 5 ? CLR.green : (roundsWon >= 3 ? CLR.yellow : (roundsWon >= 1 ? CLR.text : CLR.red));
    ctx.fillStyle = rColor;
    ctx.font = (14 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(reward.label, 320 * scale, 180 * scale);

    ctx.fillStyle = CLR.text;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    if (reward.cash > 0) {
      ctx.fillText('Earned: $' + reward.cash, 320 * scale, 220 * scale);
    }
    ctx.fillText('Morale +' + reward.morale, 320 * scale, 245 * scale);
    if (reward.taffy > 0) {
      ctx.fillStyle = '#e8a0c0';
      ctx.fillText('Got ' + reward.taffy + ' taffy!', 320 * scale, 270 * scale);
    }

    ctx.fillStyle = CLR.dim;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Press SPACE or tap to continue', 320 * scale, 340 * scale);
  }

  function drawGameplay() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = CLR.text;
    ctx.font = (12 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TAFFY PULLING', 320 * scale, 25 * scale);

    // Phase instruction
    ctx.fillStyle = CLR.dim;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    if (gamePhase === 'watch') {
      ctx.fillStyle = CLR.yellow;
      ctx.fillText('WATCH...', 320 * scale, 44 * scale);
    } else if (gamePhase === 'input') {
      ctx.fillStyle = CLR.green;
      ctx.fillText('YOUR TURN!', 320 * scale, 44 * scale);
    }

    drawSequenceDots();
    drawTaffy();

    // Draw buttons
    for (var i = 0; i < BUTTONS.length; i++) {
      var b = BUTTONS[i];
      var isLit = (litButton === b.id);
      var isFlash = (flashButton === b.id && flashTimer > 0);
      drawButton(b, isLit, isFlash, flashColor);
    }

    drawHUD();
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gamePhase) {
      case 'title':
        drawTitle();
        break;
      case 'watch-prompt':
        drawWatchPrompt();
        break;
      case 'watch':
      case 'input':
        drawGameplay();
        break;
      case 'round-result':
        drawRoundResult();
        break;
      case 'results':
        drawResultsScreen();
        break;
    }
  }

  // -------- GAME LOOP --------

  function gameLoop(timestamp) {
    if (!gameRunning) return;

    var dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    update(dt);
    render();

    animFrame = requestAnimationFrame(gameLoop);
  }

  // -------- PUBLIC API --------

  window.TaffyGame = {
    start: function (p, cb) {
      init();
      callback = cb || null;
      resetGame();

      var screen = document.getElementById('screen');
      if (screen) screen.classList.add('hidden');
      canvas.classList.remove('hidden');

      boundKeyDown = onKeyDown;
      boundTouchStart = onTouchStart;
      document.addEventListener('keydown', boundKeyDown);
      canvas.addEventListener('touchstart', boundTouchStart);

      lastTimestamp = performance.now();
      animFrame = requestAnimationFrame(gameLoop);
    },

    stop: function () {
      if (gamePhase === 'watch' || gamePhase === 'input') {
        showResults();
      }
      endGame();
    }
  };
})();
