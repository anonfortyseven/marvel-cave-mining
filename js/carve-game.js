/*
 * carve-game.js - Wood Carving Mini-Game
 * The Marvel Cave Mining Company
 *
 * Canvas-based trace-the-path game at Ridgetop Woodcraft.
 * Whittle a shape by following a dotted outline with a chisel cursor.
 */
(function () {
  'use strict';

  var canvas, ctx, scale;
  var animFrame = null;
  var gameRunning = false;
  var gamePhase = 'instructions'; // instructions | playing | results
  var callback = null;
  var params = {};

  // Timing
  var SESSION_TIME = 30;
  var timeLeft = SESSION_TIME;
  var lastTimestamp = 0;

  // Colors
  var CLR = {
    bg: '#0a0a0a',
    amber: '#d4a055',
    bright: '#f0c070',
    dim: '#8a6830',
    green: '#5cb85c',
    red: '#c0392b',
    yellow: '#f0d060',
    copper: '#b87333',
    wood: '#c49a6c',
    woodDark: '#8b6d4a',
    woodGrain: '#a07848',
    white: '#e0d0c0'
  };

  // Cursor / chisel
  var cursor = { x: 0, y: 0, angle: 0 };
  var CURSOR_SPEED = 3;

  // Shape
  var shapePoints = [];
  var segments = [];
  var tracedSegments = [];
  var tracePercent = 0;
  var chipCount = 0;
  var chipParticles = [];
  var shapeName = '';

  // Keys
  var keys = {};

  // Touch state
  var touchActive = false;
  var touchId = null;

  // Results
  var results = { cash: 0, morale: 0, items: {} };
  var resultLabel = '';

  // Shape definitions
  var SHAPES = {
    'Walking Stick': [
      { x: 300, y: 100 }, { x: 310, y: 100 }, { x: 330, y: 110 },
      { x: 340, y: 130 }, { x: 330, y: 145 }, { x: 320, y: 150 },
      { x: 320, y: 220 }, { x: 320, y: 300 }
    ],
    'Bird': [
      { x: 220, y: 200 }, { x: 250, y: 170 }, { x: 290, y: 155 },
      { x: 330, y: 150 }, { x: 370, y: 155 }, { x: 400, y: 170 },
      { x: 420, y: 185 }, { x: 400, y: 200 }, { x: 350, y: 210 },
      { x: 280, y: 210 }
    ],
    'Fish': [
      { x: 230, y: 200 }, { x: 260, y: 170 }, { x: 300, y: 160 },
      { x: 350, y: 160 }, { x: 390, y: 175 }, { x: 410, y: 200 },
      { x: 390, y: 225 }, { x: 350, y: 240 }, { x: 300, y: 240 },
      { x: 260, y: 230 }
    ],
    'Star': [
      { x: 320, y: 120 }, { x: 335, y: 175 }, { x: 395, y: 175 },
      { x: 348, y: 212 }, { x: 365, y: 268 }, { x: 320, y: 235 },
      { x: 275, y: 268 }, { x: 292, y: 212 }, { x: 245, y: 175 },
      { x: 305, y: 175 }
    ]
  };

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
    scale = canvas.width / 640;
  }

  function pickShape() {
    var names = Object.keys(SHAPES);
    shapeName = names[Math.floor(Math.random() * names.length)];
    shapePoints = SHAPES[shapeName];

    // Build segments between consecutive points (closed loop)
    segments = [];
    tracedSegments = [];
    for (var i = 0; i < shapePoints.length; i++) {
      var a = shapePoints[i];
      var b = shapePoints[(i + 1) % shapePoints.length];
      segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      tracedSegments.push(false);
    }

    // Start cursor at first point
    cursor.x = shapePoints[0].x;
    cursor.y = shapePoints[0].y;
    cursor.angle = 0;
  }

  function resetGame(p) {
    params = p || {};
    timeLeft = SESSION_TIME;
    gamePhase = 'instructions';
    gameRunning = true;
    keys = {};
    touchActive = false;
    touchId = null;
    chipCount = 0;
    chipParticles = [];
    tracePercent = 0;
    resultLabel = '';
    results = { cash: 0, morale: 0, items: {} };
    pickShape();
  }

  // Distance from point to line segment
  function distToSegment(px, py, x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
    var t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    var projX = x1 + t * dx;
    var projY = y1 + t * dy;
    return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
  }

  function updateTrace() {
    var onPath = false;
    var threshold = 20 * scale;
    var traceThreshold = 12 * scale;

    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      var dist = distToSegment(cursor.x, cursor.y, seg.x1, seg.y1, seg.x2, seg.y2);
      if (dist < traceThreshold && !tracedSegments[i]) {
        tracedSegments[i] = true;
      }
      if (dist < threshold) {
        onPath = true;
      }
    }

    // If cursor is moving and off path, chip!
    var moving = keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown'] || touchActive;
    if (moving && !onPath) {
      chipCount++;
      // Spawn chip particles
      for (var p = 0; p < 3; p++) {
        chipParticles.push({
          x: cursor.x + (Math.random() - 0.5) * 10,
          y: cursor.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 80,
          vy: -30 - Math.random() * 50,
          life: 0.6 + Math.random() * 0.4,
          size: 2 + Math.random() * 3
        });
      }
    }

    // Calculate trace percentage
    var traced = 0;
    for (var j = 0; j < tracedSegments.length; j++) {
      if (tracedSegments[j]) traced++;
    }
    tracePercent = Math.floor((traced / tracedSegments.length) * 100);
  }

  function getTouchPos(touch) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function onTouchStart(e) {
    e.preventDefault();
    if (gamePhase === 'instructions') {
      gamePhase = 'playing';
      lastTimestamp = performance.now();
      return;
    }
    if (gamePhase === 'results') {
      endGame();
      return;
    }
    if (e.touches.length > 0 && !touchActive) {
      touchActive = true;
      touchId = e.touches[0].identifier;
      var pos = getTouchPos(e.touches[0]);
      cursor.x = pos.x;
      cursor.y = pos.y;
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (!touchActive || gamePhase !== 'playing') return;
    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        var oldX = cursor.x;
        var oldY = cursor.y;
        var pos = getTouchPos(e.changedTouches[i]);
        cursor.x = pos.x;
        cursor.y = pos.y;
        cursor.angle = Math.atan2(cursor.y - oldY, cursor.x - oldX);
        break;
      }
    }
  }

  function onTouchEnd(e) {
    e.preventDefault();
    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        touchActive = false;
        touchId = null;
        break;
      }
    }
  }

  function onKeyDown(e) {
    keys[e.code] = true;
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      e.preventDefault();
    }
    if (gamePhase === 'instructions' && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      gamePhase = 'playing';
      lastTimestamp = performance.now();
    }
    if (gamePhase === 'results' && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      endGame();
    }
  }

  function onKeyUp(e) {
    keys[e.code] = false;
  }

  function update(dt) {
    if (gamePhase !== 'playing') return;

    // Timer
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      showResults();
      return;
    }

    // Move cursor with keys
    var moved = false;
    var spd = CURSOR_SPEED * scale;
    if (keys['ArrowLeft']) { cursor.x -= spd; cursor.angle = Math.PI; moved = true; }
    if (keys['ArrowRight']) { cursor.x += spd; cursor.angle = 0; moved = true; }
    if (keys['ArrowUp']) { cursor.y -= spd; cursor.angle = -Math.PI / 2; moved = true; }
    if (keys['ArrowDown']) { cursor.y += spd; cursor.angle = Math.PI / 2; moved = true; }

    // Diagonal angle correction
    if (keys['ArrowLeft'] && keys['ArrowUp']) cursor.angle = -Math.PI * 0.75;
    if (keys['ArrowLeft'] && keys['ArrowDown']) cursor.angle = Math.PI * 0.75;
    if (keys['ArrowRight'] && keys['ArrowUp']) cursor.angle = -Math.PI * 0.25;
    if (keys['ArrowRight'] && keys['ArrowDown']) cursor.angle = Math.PI * 0.25;

    // Clamp cursor to board area
    cursor.x = Math.max(80 * scale, Math.min(560 * scale, cursor.x));
    cursor.y = Math.max(60 * scale, Math.min(350 * scale, cursor.y));

    // Update tracing
    if (moved || touchActive) {
      updateTrace();
    }

    // Update chip particles
    for (var i = chipParticles.length - 1; i >= 0; i--) {
      var p = chipParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt;
      p.life -= dt;
      if (p.life <= 0) chipParticles.splice(i, 1);
    }

    // Check 100% completion
    if (tracePercent >= 100) {
      showResults();
    }
  }

  function showResults() {
    gamePhase = 'results';

    if (tracePercent >= 90 && chipCount < 3) {
      resultLabel = 'Master Carver!';
      results = { cash: 4, morale: 8, items: {} };
    } else if (tracePercent >= 70 && chipCount < 5) {
      resultLabel = 'Fine work!';
      results = { cash: 2, morale: 5, items: {} };
    } else if (tracePercent >= 50) {
      resultLabel = 'Rough but recognizable';
      results = { cash: 1, morale: 3, items: {} };
    } else {
      resultLabel = 'Firewood...';
      results = { cash: 0, morale: 1, items: {} };
    }
  }

  function endGame() {
    gameRunning = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchmove', onTouchMove);
    canvas.removeEventListener('touchend', onTouchEnd);

    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');

    setTimeout(function () {
      if (callback) callback(results);
    }, 1000);
  }

  // ------- RENDERING -------

  function drawWoodBoard() {
    // Board background
    ctx.fillStyle = CLR.wood;
    ctx.fillRect(70 * scale, 50 * scale, 500 * scale, 310 * scale);

    // Wood grain lines
    ctx.strokeStyle = CLR.woodGrain;
    ctx.lineWidth = 1;
    for (var i = 0; i < 18; i++) {
      var y = (55 + i * 17) * scale;
      ctx.beginPath();
      ctx.moveTo(70 * scale, y);
      for (var x = 70; x <= 570; x += 20) {
        ctx.lineTo(x * scale, y + Math.sin(x * 0.03 + i) * 2 * scale);
      }
      ctx.stroke();
    }

    // Board border
    ctx.strokeStyle = CLR.woodDark;
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(70 * scale, 50 * scale, 500 * scale, 310 * scale);
  }

  function drawOutline() {
    // Draw dotted outline for untraced, solid bright for traced
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      ctx.beginPath();
      ctx.moveTo(seg.x1 * scale, seg.y1 * scale);
      ctx.lineTo(seg.x2 * scale, seg.y2 * scale);

      if (tracedSegments[i]) {
        ctx.strokeStyle = CLR.bright;
        ctx.lineWidth = 3 * scale;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = CLR.dim;
        ctx.lineWidth = 2 * scale;
        ctx.setLineDash([4 * scale, 4 * scale]);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Start marker
    var sp = shapePoints[0];
    ctx.fillStyle = CLR.green;
    ctx.beginPath();
    ctx.arc(sp.x * scale, sp.y * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('START', sp.x * scale, (sp.y - 10) * scale);
  }

  function drawChisel() {
    var cx = cursor.x;
    var cy = cursor.y;
    var a = cursor.angle;
    var sz = 8 * scale;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);

    // Chisel shape (triangle pointing in movement direction)
    ctx.fillStyle = CLR.copper;
    ctx.beginPath();
    ctx.moveTo(sz, 0);
    ctx.lineTo(-sz * 0.6, -sz * 0.5);
    ctx.lineTo(-sz * 0.6, sz * 0.5);
    ctx.closePath();
    ctx.fill();

    // Handle
    ctx.fillStyle = CLR.woodDark;
    ctx.fillRect(-sz * 1.4, -sz * 0.3, sz * 0.8, sz * 0.6);

    ctx.restore();
  }

  function drawChipParticles() {
    for (var i = 0; i < chipParticles.length; i++) {
      var p = chipParticles[i];
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = CLR.woodDark;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size * scale, p.size * scale);
    }
    ctx.globalAlpha = 1;
  }

  function drawHUD() {
    // Top bar background
    ctx.fillStyle = 'rgba(10, 10, 10, 0.85)';
    ctx.fillRect(0, 0, canvas.width, 44 * scale);

    // Progress bar
    ctx.fillStyle = CLR.dim;
    ctx.fillRect(10 * scale, 6 * scale, 200 * scale, 12 * scale);
    ctx.fillStyle = CLR.amber;
    ctx.fillRect(10 * scale, 6 * scale, 200 * (tracePercent / 100) * scale, 12 * scale);
    ctx.strokeStyle = CLR.bright;
    ctx.lineWidth = 1;
    ctx.strokeRect(10 * scale, 6 * scale, 200 * scale, 12 * scale);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(tracePercent + '% TRACED', 10 * scale, 35 * scale);

    // Timer
    ctx.fillStyle = timeLeft <= 10 ? CLR.red : CLR.bright;
    ctx.textAlign = 'right';
    ctx.fillText('TIME: ' + Math.ceil(timeLeft), (canvas.width - 10 * scale), 14 * scale);

    // Chips counter
    ctx.fillStyle = chipCount >= 5 ? CLR.red : CLR.amber;
    ctx.textAlign = 'center';
    ctx.fillText('CHIPS: ' + chipCount, canvas.width / 2, 14 * scale);

    // Shape name
    ctx.fillStyle = CLR.dim;
    ctx.font = Math.floor(7 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Carving: ' + shapeName, canvas.width / 2, 35 * scale);
  }

  function drawInstructions() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(16 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('WOOD CARVING', canvas.width / 2, 50 * scale);

    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Ridgetop Woodcraft', canvas.width / 2, 75 * scale);

    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillStyle = CLR.white;
    var lines = [
      'Follow the dotted path',
      'with your chisel cursor.',
      '',
      'CONTROLS:',
      'Arrow Keys .. Move chisel',
      'Touch ...... Drag to trace',
      '',
      'Stay on the path!',
      'Going off-path chips',
      'the wood.',
      '',
      'Trace as much as you',
      'can in 30 seconds.'
    ];
    for (var i = 0; i < lines.length; i++) {
      ctx.fillStyle = (i === 3) ? CLR.amber : CLR.white;
      ctx.fillText(lines[i], canvas.width / 2, (110 + i * 18) * scale);
    }

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER or tap to start', canvas.width / 2, 375 * scale);
  }

  function drawResults() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CARVING COMPLETE', canvas.width / 2, 60 * scale);

    // Result rating
    var ratingColor = results.cash >= 4 ? CLR.green : (results.cash >= 2 ? CLR.amber : (results.cash >= 1 ? CLR.yellow : CLR.red));
    ctx.fillStyle = ratingColor;
    ctx.font = Math.floor(12 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(resultLabel, canvas.width / 2, 110 * scale);

    // Stats
    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Shape: ' + shapeName, canvas.width / 2, 160 * scale);
    ctx.fillText('Traced: ' + tracePercent + '%', canvas.width / 2, 185 * scale);
    ctx.fillText('Chips: ' + chipCount, canvas.width / 2, 210 * scale);

    // Rewards
    ctx.fillStyle = CLR.green;
    ctx.fillText('Earned: $' + results.cash, canvas.width / 2, 255 * scale);
    ctx.fillStyle = CLR.amber;
    ctx.fillText('Morale: +' + results.morale, canvas.width / 2, 280 * scale);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER or tap', canvas.width / 2, 345 * scale);
    ctx.fillText('to continue', canvas.width / 2, 365 * scale);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gamePhase === 'instructions') {
      drawInstructions();
      return;
    }

    if (gamePhase === 'results') {
      drawResults();
      return;
    }

    // Game scene
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWoodBoard();
    drawOutline();
    drawChipParticles();
    drawChisel();
    drawHUD();
  }

  function gameLoop(timestamp) {
    if (!gameRunning) return;

    var dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    update(dt);
    render();

    animFrame = requestAnimationFrame(gameLoop);
  }

  // ------- PUBLIC API -------

  window.CarveGame = {
    start: function (p, cb) {
      init();
      callback = cb || null;
      resetGame(p || {});

      var screen = document.getElementById('screen');
      if (screen) screen.classList.add('hidden');
      canvas.classList.remove('hidden');

      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      canvas.addEventListener('touchstart', onTouchStart, { passive: false });
      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      canvas.addEventListener('touchend', onTouchEnd, { passive: false });

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
