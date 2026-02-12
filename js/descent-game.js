/*
 * descent-game.js - Rope Descent Mini-Game
 * The Marvel Cave Mining Company
 *
 * Canvas-based rope descent mini-game where the player descends into
 * the cave while avoiding obstacles. Equivalent to Oregon Trail river crossing.
 */
(function () {
  'use strict';

  var canvas, ctx;
  var animFrame = null;
  var gameRunning = false;
  var gamePhase = 'instructions'; // instructions | playing | results
  var callback = null;
  var params = {};

  // Colors
  var CLR = {
    bg: '#000000',
    amber: '#D4A017',
    brown: '#8B4513',
    orange: '#CC7722',
    gray: '#888888',
    darkGray: '#444444',
    blue: '#1a3a5c',
    lightBlue: '#3a6a9c',
    red: '#CC3333',
    white: '#DDDDDD',
    rope: '#C8A850'
  };

  // Game state
  var depth = 0;
  var targetDepth = 300;
  var speed = 0;
  var maxSpeed = 200;
  var baseSpeed = 40;
  var playerX = 320;
  var playerSwing = 0; // -1 to 1 (rope swing offset)
  var braking = false;
  var hits = 0;
  var flashTimer = 0;
  var lastTimestamp = 0;

  // Rope
  var ropeQuality = 80;
  var ropeStrain = 0;

  // Obstacles
  var obstacles = [];
  var obstacleSpawnDist = 0;
  var SPAWN_INTERVAL = 60; // pixels of depth between spawns

  // Wall segments for visual variety
  var wallSegments = [];
  var WALL_SEGMENT_HEIGHT = 20;

  // Particles (water spray, dust)
  var particles = [];

  // Keys
  var keys = {};

  // Results
  var results = { outcome: 'clean', healthPenalty: 0, ropeUsed: 0 };

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
  }

  function resetGame(p) {
    params = p || {};
    targetDepth = params.depth || 300;
    ropeQuality = params.ropeQuality || 80;
    gamePhase = 'instructions';
    gameRunning = true;
    keys = {};

    depth = 0;
    speed = 0;
    playerX = 320;
    playerSwing = 0;
    braking = false;
    hits = 0;
    flashTimer = 0;
    ropeStrain = 0;

    obstacles = [];
    obstacleSpawnDist = 0;
    particles = [];

    results = { outcome: 'clean', healthPenalty: 0, ropeUsed: 0 };

    // Generate wall profile
    generateWalls();

    // Pre-generate some obstacles
    for (var d = 40; d < targetDepth; d += SPAWN_INTERVAL) {
      generateObstacle(d);
    }
  }

  function generateWalls() {
    wallSegments = [];
    var leftBase = 80;
    var rightBase = 560;
    for (var d = 0; d <= targetDepth + 200; d += WALL_SEGMENT_HEIGHT) {
      leftBase += (Math.random() - 0.5) * 30;
      rightBase += (Math.random() - 0.5) * 30;
      leftBase = Math.max(40, Math.min(180, leftBase));
      rightBase = Math.max(460, Math.min(600, rightBase));
      wallSegments.push({
        depth: d,
        left: leftBase,
        right: rightBase,
        leftColor: Math.random() > 0.7 ? CLR.brown : CLR.darkGray,
        rightColor: Math.random() > 0.7 ? CLR.brown : CLR.darkGray
      });
    }
  }

  function generateObstacle(atDepth) {
    var type = Math.random();
    var wallIdx = Math.floor(atDepth / WALL_SEGMENT_HEIGHT);
    var leftWall = 100;
    var rightWall = 540;
    if (wallIdx < wallSegments.length) {
      leftWall = wallSegments[wallIdx].left;
      rightWall = wallSegments[wallIdx].right;
    }
    var midX = (leftWall + rightWall) / 2;
    var rangeW = rightWall - leftWall;

    if (type < 0.4) {
      // Loose rock jutting from wall
      var fromLeft = Math.random() < 0.5;
      obstacles.push({
        type: 'rock',
        depth: atDepth,
        x: fromLeft ? leftWall : (rightWall - 40 - Math.random() * 30),
        w: 30 + Math.random() * 40,
        h: 12 + Math.random() * 10,
        fromLeft: fromLeft
      });
    } else if (type < 0.7) {
      // Narrow ledge
      obstacles.push({
        type: 'ledge',
        depth: atDepth,
        x: leftWall + 20 + Math.random() * (rangeW - 120),
        w: 60 + Math.random() * 80,
        h: 8
      });
    } else {
      // Water spray zone
      obstacles.push({
        type: 'water',
        depth: atDepth,
        x: midX - 30 + (Math.random() - 0.5) * rangeW * 0.4,
        radius: 30 + Math.random() * 20,
        h: 0
      });
    }
  }

  function onKeyDown(e) {
    keys[e.code] = true;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      e.preventDefault();
    }
    if (gamePhase === 'instructions' && (e.code === 'Space' || e.code === 'Enter')) {
      gamePhase = 'playing';
      lastTimestamp = performance.now();
    }
    if (gamePhase === 'results' && (e.code === 'Space' || e.code === 'Enter')) {
      endGame();
    }
  }

  function onKeyUp(e) {
    keys[e.code] = false;
  }

  function update(dt) {
    if (gamePhase !== 'playing') return;

    // Speed control
    braking = keys['Space'];
    if (keys['ArrowDown']) {
      speed = Math.min(speed + 120 * dt, maxSpeed);
    } else if (keys['ArrowUp'] || braking) {
      speed = Math.max(speed - 150 * dt, 0);
    } else {
      // Gravity pulls down, slight acceleration
      speed = Math.min(speed + 30 * dt, baseSpeed + 20);
    }

    if (braking) {
      speed = Math.max(speed * 0.92, 0);
    }

    // Swing left/right
    if (keys['ArrowLeft']) {
      playerSwing = Math.max(playerSwing - 2.5 * dt, -1);
    } else if (keys['ArrowRight']) {
      playerSwing = Math.min(playerSwing + 2.5 * dt, 1);
    } else {
      // Return to center
      playerSwing *= (1 - 1.5 * dt);
    }

    // Get wall positions for current depth
    var wallIdx = Math.floor(depth / WALL_SEGMENT_HEIGHT);
    var leftWall = 100;
    var rightWall = 540;
    if (wallIdx < wallSegments.length) {
      leftWall = wallSegments[wallIdx].left;
      rightWall = wallSegments[wallIdx].right;
    }

    var centerX = (leftWall + rightWall) / 2;
    var swingRange = (rightWall - leftWall) / 2 - 20;
    playerX = centerX + playerSwing * swingRange;

    // Advance depth
    depth += speed * dt;

    // Rope strain based on speed and quality
    ropeStrain += (speed / maxSpeed) * dt * (100 / Math.max(ropeQuality, 20));

    // Flash timer
    if (flashTimer > 0) flashTimer -= dt;

    // Check collisions with obstacles
    for (var i = 0; i < obstacles.length; i++) {
      var obs = obstacles[i];
      if (obs.hit) continue;
      var relY = obs.depth - depth;
      if (relY > -10 && relY < 20) {
        if (obs.type === 'rock' || obs.type === 'ledge') {
          if (playerX > obs.x - 8 && playerX < obs.x + obs.w + 8) {
            obs.hit = true;
            hits++;
            flashTimer = 0.3;
            // Spawn dust particles
            for (var p = 0; p < 6; p++) {
              particles.push({
                x: playerX + (Math.random() - 0.5) * 20,
                y: 200 + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 60,
                vy: (Math.random() - 0.5) * 40,
                life: 0.5 + Math.random() * 0.3,
                color: CLR.brown
              });
            }
          }
        } else if (obs.type === 'water') {
          var dist = Math.abs(playerX - obs.x);
          if (dist < obs.radius) {
            obs.hit = true;
            hits++;
            flashTimer = 0.3;
            // Spawn water particles
            for (var w = 0; w < 8; w++) {
              particles.push({
                x: playerX + (Math.random() - 0.5) * 20,
                y: 200 + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 80,
                vy: -20 - Math.random() * 40,
                life: 0.4 + Math.random() * 0.3,
                color: CLR.lightBlue
              });
            }
          }
        }
      }
    }

    // Update particles
    for (var pi = particles.length - 1; pi >= 0; pi--) {
      var part = particles[pi];
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.vy += 60 * dt;
      part.life -= dt;
      if (part.life <= 0) particles.splice(pi, 1);
    }

    // Check completion
    if (depth >= targetDepth) {
      depth = targetDepth;
      showResults();
    }
  }

  function showResults() {
    gamePhase = 'results';

    if (hits === 0) {
      results.outcome = 'clean';
      results.healthPenalty = 0;
    } else if (hits <= 2) {
      results.outcome = 'minor';
      results.healthPenalty = 10 + Math.floor(Math.random() * 11);
    } else if (hits <= 4) {
      results.outcome = 'major';
      results.healthPenalty = 30 + Math.floor(Math.random() * 21);
    } else {
      results.outcome = 'fall';
      results.healthPenalty = 50 + Math.floor(Math.random() * 30);
    }

    results.ropeUsed = Math.ceil(targetDepth / 10);
  }

  function endGame() {
    gameRunning = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);

    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');

    if (callback) callback(results);
  }

  // ------- RENDERING -------

  function drawWalls() {
    // Draw cave walls scrolling upward
    for (var i = 0; i < wallSegments.length; i++) {
      var seg = wallSegments[i];
      var screenY = (seg.depth - depth) * 2 + 50; // map depth to screen Y
      if (screenY < -WALL_SEGMENT_HEIGHT * 2 || screenY > 420) continue;

      var nextSeg = wallSegments[i + 1] || seg;

      // Left wall
      ctx.fillStyle = seg.leftColor;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(seg.left, screenY);
      ctx.lineTo(nextSeg.left, screenY + WALL_SEGMENT_HEIGHT * 2);
      ctx.lineTo(0, screenY + WALL_SEGMENT_HEIGHT * 2);
      ctx.fill();

      // Left wall texture
      ctx.fillStyle = 'rgba(100,80,60,0.3)';
      for (var t = 0; t < 3; t++) {
        var tx = Math.random() * seg.left;
        var ty = screenY + Math.random() * WALL_SEGMENT_HEIGHT * 2;
        ctx.fillRect(tx, ty, 3 + Math.random() * 5, 2);
      }

      // Right wall
      ctx.fillStyle = seg.rightColor;
      ctx.beginPath();
      ctx.moveTo(640, screenY);
      ctx.lineTo(seg.right, screenY);
      ctx.lineTo(nextSeg.right, screenY + WALL_SEGMENT_HEIGHT * 2);
      ctx.lineTo(640, screenY + WALL_SEGMENT_HEIGHT * 2);
      ctx.fill();

      // Right wall texture
      ctx.fillStyle = 'rgba(100,80,60,0.3)';
      for (var tr = 0; tr < 3; tr++) {
        var trx = seg.right + Math.random() * (640 - seg.right);
        var trty = screenY + Math.random() * WALL_SEGMENT_HEIGHT * 2;
        ctx.fillRect(trx, trty, 3 + Math.random() * 5, 2);
      }
    }
  }

  function drawObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
      var obs = obstacles[i];
      var screenY = (obs.depth - depth) * 2 + 200;
      if (screenY < -30 || screenY > 430) continue;

      if (obs.hit) {
        ctx.globalAlpha = 0.3;
      }

      if (obs.type === 'rock') {
        ctx.fillStyle = CLR.gray;
        ctx.fillRect(obs.x, screenY, obs.w, obs.h);
        ctx.fillStyle = '#666666';
        ctx.fillRect(obs.x + 2, screenY + 2, obs.w - 4, obs.h / 2);
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(obs.x, screenY + obs.h, obs.w, 3);
      } else if (obs.type === 'ledge') {
        ctx.fillStyle = CLR.brown;
        ctx.fillRect(obs.x, screenY, obs.w, obs.h);
        ctx.fillStyle = '#6B3A13';
        ctx.fillRect(obs.x, screenY, obs.w, 3);
      } else if (obs.type === 'water') {
        // Water spray zone
        ctx.fillStyle = 'rgba(58, 106, 156, 0.25)';
        ctx.beginPath();
        ctx.arc(obs.x, screenY, obs.radius, 0, Math.PI * 2);
        ctx.fill();
        // Spray dots
        ctx.fillStyle = 'rgba(100, 160, 220, 0.5)';
        for (var w = 0; w < 6; w++) {
          var angle = (w / 6) * Math.PI * 2 + depth * 0.02;
          var dist = obs.radius * (0.3 + Math.sin(angle * 3) * 0.3);
          ctx.fillRect(obs.x + Math.cos(angle) * dist - 1, screenY + Math.sin(angle) * dist - 1, 3, 3);
        }
      }

      ctx.globalAlpha = 1;
    }
  }

  function drawRope() {
    // Rope from top to player
    ctx.strokeStyle = CLR.rope;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(320, 0);

    // Rope curves based on swing
    var midY = 100;
    var cpX = 320 + playerSwing * 40;
    ctx.quadraticCurveTo(cpX, midY, playerX, 200);
    ctx.stroke();

    // Rope quality visual - frayed sections
    if (ropeQuality < 60) {
      ctx.strokeStyle = CLR.orange;
      ctx.lineWidth = 1;
      var frayY = 80 + Math.sin(depth * 0.1) * 20;
      ctx.beginPath();
      ctx.moveTo(cpX - 3, frayY);
      ctx.lineTo(cpX + 3, frayY + 5);
      ctx.stroke();
    }
  }

  function drawPlayer() {
    var px = Math.floor(playerX);
    var py = 200;

    // Hit flash
    if (flashTimer > 0 && Math.floor(flashTimer * 10) % 2 === 0) {
      ctx.fillStyle = CLR.red;
    } else {
      ctx.fillStyle = CLR.orange;
    }

    // Body
    ctx.fillRect(px - 5, py - 8, 10, 16);
    // Head
    ctx.fillStyle = CLR.white;
    ctx.fillRect(px - 4, py - 16, 8, 8);
    // Hard hat
    ctx.fillStyle = CLR.amber;
    ctx.fillRect(px - 5, py - 18, 10, 4);
    // Arms (gripping rope)
    ctx.fillStyle = CLR.orange;
    ctx.fillRect(px - 8, py - 6, 4, 3);
    ctx.fillRect(px + 4, py - 6, 4, 3);
    // Legs (dangling)
    ctx.fillStyle = CLR.brown;
    ctx.fillRect(px - 4, py + 8, 4, 8);
    ctx.fillRect(px + 1, py + 8, 4, 8);

    // Lantern glow
    var grad = ctx.createRadialGradient(px, py, 5, px, py, 80);
    grad.addColorStop(0, 'rgba(212, 160, 23, 0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(px - 80, py - 80, 160, 160);
  }

  function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(p.life * 2, 0);
      ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
    }
    ctx.globalAlpha = 1;
  }

  function drawDepthMeter() {
    // Depth bar on left
    var barX = 15;
    var barY = 40;
    var barH = 320;
    var barW = 8;

    ctx.fillStyle = CLR.darkGray;
    ctx.fillRect(barX, barY, barW, barH);

    var progress = Math.min(depth / targetDepth, 1);
    ctx.fillStyle = CLR.amber;
    ctx.fillRect(barX, barY, barW, barH * progress);

    // Marker
    ctx.fillStyle = CLR.white;
    ctx.fillRect(barX - 3, barY + barH * progress - 2, barW + 6, 4);

    // Labels
    ctx.fillStyle = CLR.amber;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0', barX + barW / 2, barY - 4);
    ctx.fillText(targetDepth + 'ft', barX + barW / 2 + 4, barY + barH + 14);
  }

  function drawHUD() {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, 640, 22);

    ctx.fillStyle = CLR.amber;
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('DEPTH: ' + Math.floor(depth) + ' / ' + targetDepth + ' ft', 40, 16);

    ctx.textAlign = 'center';
    ctx.fillText('SPEED: ' + Math.floor(speed), 320, 16);

    ctx.textAlign = 'right';
    var hitColor = hits === 0 ? CLR.amber : (hits <= 2 ? CLR.orange : CLR.red);
    ctx.fillStyle = hitColor;
    ctx.fillText('HITS: ' + hits, 625, 16);

    // Brake indicator
    if (braking) {
      ctx.fillStyle = CLR.red;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BRAKE', 320, 395);
    }

    // Speed bar
    ctx.fillStyle = CLR.darkGray;
    ctx.fillRect(580, 30, 50, 8);
    var speedPct = speed / maxSpeed;
    ctx.fillStyle = speedPct > 0.7 ? CLR.red : (speedPct > 0.4 ? CLR.orange : CLR.amber);
    ctx.fillRect(580, 30, 50 * speedPct, 8);
  }

  function drawDarkness() {
    // Gradient darkness at bottom of screen (going deeper)
    var grad = ctx.createLinearGradient(0, 300, 0, 400);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 300, 640, 100);

    // Slight darkness at top
    var gradTop = ctx.createLinearGradient(0, 0, 0, 80);
    gradTop.addColorStop(0, 'rgba(0,0,0,0.5)');
    gradTop.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradTop;
    ctx.fillRect(0, 22, 640, 80);
  }

  function drawInstructions() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, 640, 400);

    ctx.fillStyle = CLR.amber;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ROPE DESCENT', 320, 50);

    ctx.font = '12px monospace';
    ctx.fillStyle = CLR.white;
    var lines = [
      'Descend ' + targetDepth + ' feet into the cave!',
      '',
      'CONTROLS:',
      'Down Arrow .... Descend faster',
      'Up Arrow ...... Slow descent',
      'Left/Right .... Swing on rope',
      'Space ......... Brake (full stop)',
      '',
      'HAZARDS:',
      '- Loose rocks jut from cave walls',
      '- Narrow ledges block your path',
      '- Water spray zones obscure vision',
      '',
      'Avoid obstacles by swinging left/right.',
      'Going faster = less reaction time!',
      '',
      'Rope Quality: ' + ropeQuality + '%'
    ];
    for (var i = 0; i < lines.length; i++) {
      ctx.fillStyle = (i === 2 || i === 8) ? CLR.amber : CLR.white;
      ctx.fillText(lines[i], 320, 90 + i * 18);
    }

    ctx.fillStyle = CLR.amber;
    ctx.font = '14px monospace';
    ctx.fillText('Press SPACE or ENTER to begin', 320, 380);
  }

  function drawResultsScreen() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, 640, 400);

    ctx.fillStyle = CLR.amber;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DESCENT COMPLETE', 320, 70);

    ctx.font = '14px monospace';
    ctx.fillStyle = CLR.white;
    ctx.fillText('Depth Reached: ' + Math.floor(depth) + ' ft', 320, 120);
    ctx.fillText('Obstacles Hit: ' + hits, 320, 148);
    ctx.fillText('Rope Used: ' + results.ropeUsed + ' ft', 320, 176);

    var outcomeText, outcomeColor;
    switch (results.outcome) {
      case 'clean':
        outcomeText = 'CLEAN DESCENT - No injuries!';
        outcomeColor = CLR.amber;
        break;
      case 'minor':
        outcomeText = 'Minor scrapes and bruises.';
        outcomeColor = CLR.orange;
        break;
      case 'major':
        outcomeText = 'Serious injuries sustained!';
        outcomeColor = CLR.red;
        break;
      case 'fall':
        outcomeText = 'TERRIBLE FALL! Crew in danger!';
        outcomeColor = CLR.red;
        break;
      default:
        outcomeText = 'Descent complete.';
        outcomeColor = CLR.amber;
    }

    ctx.fillStyle = outcomeColor;
    ctx.font = '16px monospace';
    ctx.fillText(outcomeText, 320, 230);

    if (results.healthPenalty > 0) {
      ctx.fillStyle = CLR.red;
      ctx.font = '14px monospace';
      ctx.fillText('Health Penalty: -' + results.healthPenalty, 320, 265);
    }

    ctx.fillStyle = CLR.amber;
    ctx.font = '14px monospace';
    ctx.fillText('Press SPACE or ENTER to continue', 320, 340);
  }

  function render() {
    ctx.clearRect(0, 0, 640, 400);

    if (gamePhase === 'instructions') {
      drawInstructions();
      return;
    }

    if (gamePhase === 'results') {
      drawResultsScreen();
      return;
    }

    // Game scene
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, 640, 400);

    drawWalls();
    drawObstacles();
    drawRope();
    drawPlayer();
    drawParticles();
    drawDarkness();
    drawDepthMeter();
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

  window.DescentGame = {
    start: function (p, cb) {
      init();
      callback = cb || null;
      resetGame(p || {});

      var screen = document.getElementById('screen');
      if (screen) screen.classList.add('hidden');
      canvas.classList.remove('hidden');

      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);

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
