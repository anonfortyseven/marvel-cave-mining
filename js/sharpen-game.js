/*
 * sharpen-game.js - Blade Sharpening Mini-Game
 * The Marvel Cave Mining Company
 *
 * Canvas-based timing/rhythm mini-game at the Blacksmith.
 * A marker oscillates across a meter bar; press SPACE/tap
 * when it lands in the green sweet spot to score a hit.
 */
(function () {
  'use strict';

  var canvas, ctx, scale;
  var animFrame = null;
  var gameRunning = false;
  var gamePhase = 'countdown'; // countdown | playing | result-flash | results
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
    white:  '#dddddd'
  };

  // Timing
  var lastTimestamp = 0;
  var countdownTimer = 0;
  var countdownNum = 3;
  var resultDelay = 0;

  // Meter
  var METER_W = 400;
  var METER_H = 28;
  var METER_X = 120; // centered: (640 - 400) / 2
  var METER_Y = 210;

  // Marker
  var markerPos = 0; // 0..1 across the meter
  var markerDir = 1;
  var markerSpeed = 1.2; // full sweeps per second at round 1

  // Sweet spot
  var sweetStart = 0;
  var sweetEnd = 0;
  var sweetPct = 0.25; // percentage of bar that is green

  // Rounds
  var TOTAL_ROUNDS = 8;
  var currentRound = 0;
  var totalHits = 0;
  var roundActive = false;
  var struck = false;

  // Visual feedback
  var hitFlashTimer = 0;
  var missFlashTimer = 0;
  var sparks = [];
  var sparkBurstTimer = 0;

  // Touch / input
  var boundKeyDown = null;
  var boundTouchStart = null;

  // -------- INIT --------

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
    scale = canvas.width / 640;
  }

  function resetGame() {
    gamePhase = 'countdown';
    gameRunning = true;
    countdownTimer = 0;
    countdownNum = 3;
    currentRound = 0;
    totalHits = 0;
    sparks = [];
    hitFlashTimer = 0;
    missFlashTimer = 0;
    struck = false;
    roundActive = false;
    resultDelay = 0;
    startRound();
  }

  function startRound() {
    currentRound++;
    if (currentRound > TOTAL_ROUNDS) {
      showResults();
      return;
    }
    // Sweet spot shrinks: 25% down to ~12%
    sweetPct = 0.25 - (currentRound - 1) * (0.13 / (TOTAL_ROUNDS - 1));
    sweetStart = 0.5 - sweetPct / 2;
    sweetEnd = 0.5 + sweetPct / 2;

    // Speed increases each round
    markerSpeed = 1.2 + (currentRound - 1) * 0.18;

    markerPos = 0;
    markerDir = 1;
    struck = false;
    roundActive = true;
  }

  // -------- INPUT --------

  function onStrike() {
    if (gamePhase === 'countdown') return;
    if (gamePhase === 'results') {
      endGame();
      return;
    }
    if (gamePhase !== 'playing' || !roundActive || struck) return;

    struck = true;
    roundActive = false;

    if (markerPos >= sweetStart && markerPos <= sweetEnd) {
      // HIT
      totalHits++;
      hitFlashTimer = 0.35;
      // Spawn sparks
      var sparkX = METER_X + markerPos * METER_W;
      var sparkY = METER_Y;
      for (var i = 0; i < 10; i++) {
        sparks.push({
          x: sparkX,
          y: sparkY,
          vx: (Math.random() - 0.5) * 160,
          vy: -60 - Math.random() * 120,
          life: 0.4 + Math.random() * 0.4
        });
      }
    } else {
      // MISS
      missFlashTimer = 0.35;
    }
    // Pause briefly then advance round
    sparkBurstTimer = 0.7;
  }

  function onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      onStrike();
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    onStrike();
  }

  // -------- UPDATE --------

  function update(dt) {
    // Countdown phase
    if (gamePhase === 'countdown') {
      countdownTimer += dt;
      if (countdownTimer >= 1) {
        countdownTimer -= 1;
        countdownNum--;
        if (countdownNum < 0) {
          gamePhase = 'playing';
        }
      }
      return;
    }

    // Results delay
    if (gamePhase === 'result-flash') {
      resultDelay -= dt;
      if (resultDelay <= 0) {
        gamePhase = 'results';
      }
      return;
    }

    if (gamePhase !== 'playing') return;

    // Move marker
    if (roundActive) {
      markerPos += markerDir * markerSpeed * dt;
      if (markerPos >= 1) { markerPos = 1; markerDir = -1; }
      if (markerPos <= 0) { markerPos = 0; markerDir = 1; }
    }

    // Inter-round timer after strike
    if (struck && sparkBurstTimer > 0) {
      sparkBurstTimer -= dt;
      if (sparkBurstTimer <= 0) {
        startRound();
      }
    }

    // Update sparks
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 200 * dt; // gravity
      s.life -= dt;
      if (s.life <= 0) sparks.splice(i, 1);
    }

    // Flash timers
    if (hitFlashTimer > 0) hitFlashTimer -= dt;
    if (missFlashTimer > 0) missFlashTimer -= dt;
  }

  // -------- RESULTS --------

  function showResults() {
    gamePhase = 'result-flash';
    resultDelay = 0.5;
  }

  function getReward() {
    if (totalHits >= 7) return { label: 'Master Smith!', cash: 3, morale: 10 };
    if (totalHits >= 5) return { label: 'Good work!', cash: 2, morale: 5 };
    if (totalHits >= 3) return { label: 'Decent effort', cash: 1, morale: 3 };
    return { label: 'Needs practice', cash: 0, morale: 1 };
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
    setTimeout(function () {
      if (callback) callback({ cash: reward.cash, morale: reward.morale, items: {} });
    }, 1000);
  }

  // -------- RENDERING --------

  function drawBlade() {
    var cx = 320 * scale;
    var by = 155 * scale;
    // Blade: trapezoid
    ctx.fillStyle = CLR.dim;
    ctx.beginPath();
    ctx.moveTo((260) * scale, by);
    ctx.lineTo((380) * scale, by);
    ctx.lineTo((370) * scale, (by + 20 * scale));
    ctx.lineTo((270) * scale, (by + 20 * scale));
    ctx.closePath();
    ctx.fill();
    // Highlight edge
    ctx.strokeStyle = CLR.bright;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(260 * scale, by);
    ctx.lineTo(380 * scale, by);
    ctx.stroke();
    // Handle
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(372 * scale, (by - 2 * scale), 40 * scale, 24 * scale);
  }

  function drawWhetstone() {
    // Whetstone rectangle at bottom
    var wx = 200 * scale;
    var wy = 290 * scale;
    var ww = 240 * scale;
    var wh = 30 * scale;
    ctx.fillStyle = '#555555';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = '#666666';
    ctx.fillRect(wx + 4 * scale, wy + 2 * scale, ww - 8 * scale, wh * 0.4);
    // Base / anvil stand
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect((280) * scale, (320) * scale, 80 * scale, 40 * scale);
    ctx.fillRect((260) * scale, (355) * scale, 120 * scale, 10 * scale);
  }

  function drawMeter() {
    var mx = METER_X * scale;
    var my = METER_Y * scale;
    var mw = METER_W * scale;
    var mh = METER_H * scale;

    // Bar background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(mx, my, mw, mh);

    // Sweet spot zone
    var sx = mx + sweetStart * mw;
    var sw = (sweetEnd - sweetStart) * mw;
    ctx.fillStyle = 'rgba(92, 184, 92, 0.35)';
    ctx.fillRect(sx, my, sw, mh);
    ctx.strokeStyle = CLR.green;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(sx, my, sw, mh);

    // Border
    ctx.strokeStyle = CLR.dim;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(mx, my, mw, mh);

    // Marker (bright triangle + line)
    if (roundActive || struck) {
      var mkx = mx + markerPos * mw;
      ctx.fillStyle = CLR.bright;
      ctx.strokeStyle = CLR.bright;
      ctx.lineWidth = 3 * scale;
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mkx, my - 4 * scale);
      ctx.lineTo(mkx, my + mh + 4 * scale);
      ctx.stroke();
      // Triangle above
      ctx.beginPath();
      ctx.moveTo(mkx, my - 2 * scale);
      ctx.lineTo(mkx - 6 * scale, my - 12 * scale);
      ctx.lineTo(mkx + 6 * scale, my - 12 * scale);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawSparks() {
    for (var i = 0; i < sparks.length; i++) {
      var s = sparks[i];
      var alpha = Math.max(s.life / 0.8, 0);
      ctx.fillStyle = 'rgba(240, 208, 96, ' + alpha.toFixed(2) + ')';
      ctx.fillRect(s.x * scale - 2 * scale, s.y * scale - 2 * scale, 4 * scale, 4 * scale);
    }
  }

  function drawHUD() {
    ctx.fillStyle = CLR.text;
    ctx.font = (12 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Round ' + Math.min(currentRound, TOTAL_ROUNDS) + '/' + TOTAL_ROUNDS, 20 * scale, 385 * scale);

    ctx.textAlign = 'right';
    ctx.fillText('Hits: ' + totalHits, 620 * scale, 385 * scale);
  }

  function drawFlash() {
    if (hitFlashTimer > 0) {
      var a = (hitFlashTimer / 0.35) * 0.25;
      ctx.fillStyle = 'rgba(92, 184, 92, ' + a.toFixed(2) + ')';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // HIT text
      ctx.fillStyle = CLR.green;
      ctx.font = (18 * scale) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HIT!', 320 * scale, 265 * scale);
    }
    if (missFlashTimer > 0) {
      var am = (missFlashTimer / 0.35) * 0.2;
      ctx.fillStyle = 'rgba(192, 57, 43, ' + am.toFixed(2) + ')';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = CLR.red;
      ctx.font = (18 * scale) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MISS', 320 * scale, 265 * scale);
    }
  }

  function drawCountdown() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.text;
    ctx.font = (14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BLADE SHARPENING', 320 * scale, 100 * scale);

    ctx.fillStyle = CLR.dim;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Press SPACE or tap when the', 320 * scale, 150 * scale);
    ctx.fillText('marker hits the green zone!', 320 * scale, 170 * scale);

    if (countdownNum > 0) {
      ctx.fillStyle = CLR.bright;
      ctx.font = (36 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText('' + countdownNum, 320 * scale, 280 * scale);
    } else {
      ctx.fillStyle = CLR.green;
      ctx.font = (28 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText('GO!', 320 * scale, 280 * scale);
    }
  }

  function drawResults() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var reward = getReward();

    ctx.fillStyle = CLR.bright;
    ctx.font = (16 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SHARPENING COMPLETE', 320 * scale, 80 * scale);

    ctx.fillStyle = CLR.text;
    ctx.font = (12 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Hits: ' + totalHits + ' / ' + TOTAL_ROUNDS, 320 * scale, 140 * scale);

    var ratingColor = totalHits >= 7 ? CLR.green : (totalHits >= 5 ? CLR.yellow : (totalHits >= 3 ? CLR.text : CLR.red));
    ctx.fillStyle = ratingColor;
    ctx.font = (14 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(reward.label, 320 * scale, 190 * scale);

    ctx.fillStyle = CLR.text;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    if (reward.cash > 0) {
      ctx.fillText('Earned: $' + reward.cash, 320 * scale, 230 * scale);
    }
    ctx.fillText('Morale +' + reward.morale, 320 * scale, 255 * scale);

    ctx.fillStyle = CLR.dim;
    ctx.font = (10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Press SPACE or tap to continue', 320 * scale, 340 * scale);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gamePhase === 'countdown') {
      drawCountdown();
      return;
    }

    if (gamePhase === 'results') {
      drawResults();
      return;
    }

    // Playing / result-flash
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = CLR.text;
    ctx.font = (14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BLADE SHARPENING', 320 * scale, 30 * scale);

    drawBlade();
    drawMeter();
    drawWhetstone();
    drawSparks();
    drawFlash();
    drawHUD();
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

  window.SharpenGame = {
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
      if (gamePhase === 'playing') {
        showResults();
      }
      endGame();
    }
  };
})();
