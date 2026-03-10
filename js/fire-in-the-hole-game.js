/*
 * fire-in-the-hole-game.js - Marmaros Fire Brigade Mini-Game
 * The Marvel Cave Mining Company
 *
 * Story-driven surface mini-game inspired by Silver Dollar City's Fire In The Hole.
 * Dodge through burning Marmaros, pull townsfolk clear of the flames,
 * and catch Red Flanders' missing-pants bundle before the whole street goes up.
 */
(function () {
  'use strict';

  var canvas, ctx, scale;
  var animFrame = null;
  var callback = null;
  var params = {};
  var gameRunning = false;
  var gamePhase = 'instructions'; // instructions | playing | results
  var lastTimestamp = 0;

  var WIDTH = 640;
  var HEIGHT = 400;
  var DURATION = 27;
  var TARGET_DISTANCE = 2600;
  var PLAYER_BASE_X = 110;
  var PLAYER_MIN_X = 64;
  var PLAYER_MAX_X = 176;
  var PLAYER_SPEED = 190;

  var CLR = {
    skyTop: '#180909',
    skyBottom: '#4a1508',
    smoke: '#251515',
    smokeLight: '#51312b',
    amber: '#d4a055',
    bright: '#f3c978',
    dim: '#8c6530',
    ash: '#463733',
    road: '#2e1f19',
    roadLine: '#81512b',
    fire: '#ff6a00',
    fireHot: '#ffd56a',
    red: '#d14b33',
    blue: '#8f2934',
    green: '#76c16a',
    rope: '#b89052',
    wood: '#704525',
    tan: '#caa06a',
    black: '#090909',
    white: '#f2ddc4'
  };

  var lanes = [308, 238, 168];
  var player = null;
  var objects = [];
  var sparks = [];
  var results = null;
  var worldDistance = 0;
  var timeLeft = DURATION;
  var storyBeat = 0;
  var districtLabel = 'Main Street';
  var messageText = '';
  var messageTimer = 0;
  var redBubbleTimer = 0;
  var keys = {};

  var boundKeyDown = onKeyDown;
  var boundKeyUp = onKeyUp;
  var boundTouchStart = onTouchStart;
  var boundMouseDown = onMouseDown;

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
    scale = canvas.width / WIDTH;
    ctx.imageSmoothingEnabled = false;
  }

  function resetGame(p) {
    params = p || {};
    gameRunning = true;
    gamePhase = 'instructions';
    lastTimestamp = 0;
    timeLeft = DURATION;
    worldDistance = 0;
    storyBeat = 0;
    districtLabel = 'Main Street';
    messageText = '';
    messageTimer = 0;
    redBubbleTimer = 0;
    sparks = [];
    results = null;
    keys = {};

    player = {
      x: PLAYER_BASE_X,
      lane: 1,
      targetLane: 1,
      y: lanes[1],
      jump: 0,
      vy: 0,
      hits: 0,
      invuln: 0,
      citizens: 0,
      pantsBundles: 0,
      redCaught: false
    };

    buildRun();
  }

  function buildRun() {
    objects = [];

    queueObject(240, 'pickup', 2, { pickupType: 'citizen' });
    queueObject(330, 'obstacle', 1, { obstacleType: 'beam' });
    queueObject(430, 'pickup', 0, { pickupType: 'pants_bundle' });
    queueObject(520, 'obstacle', 2, { obstacleType: 'fire' });
    queueObject(620, 'pickup', 1, { pickupType: 'citizen' });
    queueObject(730, 'obstacle', 0, { obstacleType: 'fire' });
    queueObject(860, 'obstacle', 1, { obstacleType: 'beam' });

    queueObject(1070, 'pickup', 1, { pickupType: 'red_bundle' });
    queueObject(1170, 'obstacle', 2, { obstacleType: 'fire' });
    queueObject(1275, 'pickup', 0, { pickupType: 'citizen' });
    queueObject(1370, 'pickup', 2, { pickupType: 'citizen' });
    queueObject(1480, 'obstacle', 0, { obstacleType: 'fire' });
    queueObject(1590, 'pickup', 1, { pickupType: 'pants_bundle' });

    queueObject(1810, 'pickup', 2, { pickupType: 'citizen' });
    queueObject(1920, 'obstacle', 1, { obstacleType: 'beam' });
    queueObject(2030, 'pickup', 0, { pickupType: 'citizen' });
    queueObject(2140, 'obstacle', 2, { obstacleType: 'fire' });
    queueObject(2245, 'pickup', 1, { pickupType: 'pants_bundle' });
    queueObject(2350, 'pickup', 0, { pickupType: 'citizen' });
    queueObject(2460, 'obstacle', 1, { obstacleType: 'fire' });

    var fillerX = 560;
    while (fillerX < 2440) {
      fillerX += 150 + Math.random() * 120;
      if (Math.random() < 0.55) {
        queueObject(fillerX, 'obstacle', Math.floor(Math.random() * 3), {
          obstacleType: Math.random() < 0.5 ? 'fire' : 'beam'
        });
      } else {
        var types = ['citizen', 'citizen', 'citizen', 'pants_bundle'];
        queueObject(fillerX, 'pickup', Math.floor(Math.random() * 3), {
          pickupType: types[Math.floor(Math.random() * types.length)]
        });
      }
    }

    objects.sort(function (a, b) { return a.worldX - b.worldX; });
  }

  function queueObject(worldX, kind, lane, extra) {
    var obj = {
      worldX: worldX,
      kind: kind,
      lane: lane,
      hit: false,
      collected: false,
      w: 42,
      h: 28
    };
    if (extra) {
      for (var key in extra) {
        if (extra.hasOwnProperty(key)) obj[key] = extra[key];
      }
    }
    objects.push(obj);
  }

  function setMessage(text, duration) {
    messageText = text;
    messageTimer = duration || 2.4;
  }

  function moveLane(delta) {
    if (gamePhase !== 'playing') return;
    player.targetLane = Math.max(0, Math.min(2, player.targetLane + delta));
  }

  function jump() {
    if (gamePhase !== 'playing') return;
    if (player.jump > 1) return;
    player.vy = 330;
  }

  function handlePrimaryAction() {
    if (gamePhase === 'instructions') {
      gamePhase = 'playing';
      lastTimestamp = performance.now();
      setMessage('Bells over Marmaros. Run the bucket wagon.', 2.8);
      return;
    }
    if (gamePhase === 'results') {
      endGame();
      return;
    }
    jump();
  }

  function onKeyDown(e) {
    if (e.code === 'Escape') {
      e.preventDefault();
      abortGame();
      return;
    }
    keys[e.code] = true;
    if (gamePhase === 'instructions' || gamePhase === 'results') {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handlePrimaryAction();
      }
      return;
    }

    if (e.code === 'ArrowUp') {
      e.preventDefault();
      moveLane(1);
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      moveLane(-1);
    } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      e.preventDefault();
    } else if (e.code === 'Space') {
      e.preventDefault();
      jump();
    }
  }

  function onKeyUp(e) {
    keys[e.code] = false;
  }

  function handlePointer(x, y) {
    if (gamePhase === 'instructions' || gamePhase === 'results') {
      handlePrimaryAction();
      return;
    }

    if (x > WIDTH * 0.6 || (y > HEIGHT * 0.33 && y < HEIGHT * 0.66)) {
      jump();
      return;
    }
    if (y < HEIGHT * 0.33) moveLane(1);
    else moveLane(-1);
  }

  function onTouchStart(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.changedTouches[0];
    var x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    var y = (touch.clientY - rect.top) * (canvas.height / rect.height);
    handlePointer(x, y);
  }

  function onMouseDown(e) {
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) * (canvas.width / rect.width);
    var y = (e.clientY - rect.top) * (canvas.height / rect.height);
    handlePointer(x, y);
  }

  function update(dt) {
    if (gamePhase !== 'playing') return;

    timeLeft -= dt;
    worldDistance += (172 + Math.min(58, worldDistance * 0.018)) * dt;
    if (worldDistance >= TARGET_DISTANCE || timeLeft <= 0) {
      showResults();
      return;
    }

    if (messageTimer > 0) messageTimer -= dt;
    if (player.invuln > 0) player.invuln -= dt;
    if (redBubbleTimer > 0) redBubbleTimer -= dt;

    if (keys.ArrowLeft) player.x -= PLAYER_SPEED * dt;
    if (keys.ArrowRight) player.x += PLAYER_SPEED * dt;
    if (player.x < PLAYER_MIN_X) player.x = PLAYER_MIN_X;
    if (player.x > PLAYER_MAX_X) player.x = PLAYER_MAX_X;

    player.y += (lanes[player.targetLane] - player.y) * Math.min(1, dt * 10);
    player.jump += player.vy * dt;
    player.vy -= 760 * dt;
    if (player.jump < 0) {
      player.jump = 0;
      player.vy = 0;
    }

    if (worldDistance > 820 && storyBeat < 1) {
      storyBeat = 1;
      districtLabel = 'Flanders Hotel';
      setMessage('Hotel ahead. Red Flanders is making a scene.', 2.8);
      redBubbleTimer = 5;
    } else if (worldDistance > 1710 && storyBeat < 2) {
      storyBeat = 2;
      districtLabel = 'Supply Depot';
      setMessage('Depot ahead. Save the company stores.', 2.8);
    } else if (worldDistance > 2280 && storyBeat < 3) {
      storyBeat = 3;
      districtLabel = 'Water Trough Run';
      setMessage('Plunge the wagon through the spray and get clear.', 2.5);
    }

    maybeSpawnSparks(dt);
    updateSparks(dt);
    updateObjects();
  }

  function maybeSpawnSparks(dt) {
    var count = 1 + Math.floor((params.threat || 0) * 0.25);
    for (var i = 0; i < count; i++) {
      if (Math.random() < dt * 12) {
        sparks.push({
          x: WIDTH + Math.random() * 50,
          y: 90 + Math.random() * 230,
          vx: -120 - Math.random() * 90,
          vy: -20 + Math.random() * 40,
          life: 0.7 + Math.random() * 0.8,
          size: 2 + Math.random() * 3,
          hot: Math.random() < 0.4
        });
      }
    }
  }

  function updateSparks(dt) {
    for (var i = sparks.length - 1; i >= 0; i--) {
      sparks[i].x += sparks[i].vx * dt;
      sparks[i].y += sparks[i].vy * dt;
      sparks[i].life -= dt;
      if (sparks[i].life <= 0 || sparks[i].x < -20) sparks.splice(i, 1);
    }
  }

  function updateObjects() {
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      if (obj.hit || obj.collected) continue;

      var screenX = obj.worldX - worldDistance + player.x;
      if (screenX < -80 || screenX > WIDTH + 90) continue;

      var sameLane = obj.lane === player.targetLane;
      var overlap = Math.abs(screenX - player.x) < 28;
      if (!sameLane || !overlap) continue;

      if (obj.kind === 'obstacle') {
        var jumpClear = 24;
        if (player.jump <= jumpClear && player.invuln <= 0) {
          obj.hit = true;
          player.hits++;
          player.invuln = 0.85;
          setMessage(obj.obstacleType === 'fire' ? 'Flame licks across the wagon path.' : 'You slam through smoke and splinters.', 1.4);
          spawnImpact(screenX, lanes[obj.lane]);
        }
      } else if (obj.kind === 'pickup') {
        obj.collected = true;
        collectPickup(obj.pickupType);
      }
    }
  }

  function spawnImpact(x, y) {
    for (var i = 0; i < 12; i++) {
      sparks.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y - 12 + (Math.random() - 0.5) * 16,
        vx: -30 + Math.random() * 60,
        vy: -55 + Math.random() * 110,
        life: 0.3 + Math.random() * 0.5,
        size: 2 + Math.random() * 3,
        hot: Math.random() < 0.7
      });
    }
  }

  function collectPickup(type) {
    if (type === 'citizen') {
      player.citizens++;
      setMessage('Another townsman pulled clear of the smoke.', 1.6);
      return;
    }
    if (type === 'pants_bundle') {
      player.pantsBundles++;
      setMessage('A flying bundle of trousers lands in the wagon.', 1.8);
      return;
    }
    if (type === 'red_bundle') {
      player.redCaught = true;
      player.pantsBundles++;
      redBubbleTimer = 3;
      setMessage('You catch Red Flanders\' bundle as he hollers about the missing pants.', 2.3);
    }
  }

  function getReward() {
    var cash = player.citizens * 1 + player.pantsBundles * 0.5 + (player.redCaught ? 1.5 : 0);
    cash = Math.round(cash * 100) / 100;
    var morale = player.citizens * 3 + player.pantsBundles + (player.redCaught ? 2 : 0);
    if (player.citizens >= 3) morale += 2;
    if (player.hits === 0) morale += 2;
    var healthPenalty = Math.min(18, player.hits * 4);
    var score = cash + player.citizens * 8 + player.pantsBundles * 4 + (player.redCaught ? 8 : 0) - player.hits * 5;

    var label = 'Through The Smoke';
    var summary = 'A few good saves through smoke and sparks.';
    if (score >= 42) {
      label = 'Marmaros Miracle';
      summary = 'The bucket line holds. Marmaros stays on its feet.';
    } else if (score >= 28) {
      label = 'Bucket Brigade Hero';
      summary = 'You pull people clear while the bells pound all night.';
    } else if (score <= 10) {
      label = 'Burned But Breathing';
      summary = 'Singed, coughing, but still in one piece.';
    }

    return {
      label: label,
      summary: summary,
      redLine: player.redCaught
        ? 'Red got his pants back.'
        : 'Red is still yelling about the pants.',
      cash: cash,
      morale: morale,
      healthPenalty: healthPenalty,
      citizensSaved: player.citizens,
      pantsBundles: player.pantsBundles,
      redCaught: player.redCaught,
      items: {}
    };
  }

  function showResults() {
    results = getReward();
    gamePhase = 'results';
  }

  function abortGame() {
    gameRunning = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }

    document.removeEventListener('keydown', boundKeyDown);
    document.removeEventListener('keyup', boundKeyUp);
    canvas.removeEventListener('touchstart', boundTouchStart);
    canvas.removeEventListener('mousedown', boundMouseDown);

    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');

    if (callback) {
      setTimeout(function () {
        callback(null);
      }, 90);
    }
  }

  function endGame() {
    gameRunning = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }

    document.removeEventListener('keydown', boundKeyDown);
    document.removeEventListener('keyup', boundKeyUp);
    canvas.removeEventListener('touchstart', boundTouchStart);
    canvas.removeEventListener('mousedown', boundMouseDown);

    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');

    if (callback) {
      setTimeout(function () {
        callback(results || getReward());
      }, 150);
    }
  }

  function drawRect(x, y, w, h, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(x * scale, y * scale, w * scale, h * scale);
    }
  }

  function drawText(text, x, y, color, size, align) {
    ctx.fillStyle = color || CLR.white;
    ctx.font = (size * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = align || 'left';
    ctx.fillText(text, x * scale, y * scale);
    ctx.textAlign = 'left';
  }

  function drawEscHint() {
    drawText('ESC EXIT', 612, 390, CLR.dim, 6, 'right');
  }

  function drawWrappedText(text, x, y, maxWidth, lineHeight, color, size, align, maxLines) {
    ctx.fillStyle = color || CLR.white;
    ctx.font = (size * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = align || 'left';
    var paragraphs = String(text || '').split('\n');
    var linesDrawn = 0;
    for (var p = 0; p < paragraphs.length; p++) {
      var words = paragraphs[p].split(' ');
      var line = '';
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + ' ' + words[i] : words[i];
        if (ctx.measureText(test).width > maxWidth * scale && line) {
          if (typeof maxLines === 'number' && linesDrawn >= maxLines) {
            ctx.textAlign = 'left';
            return linesDrawn;
          }
          ctx.fillText(line, x * scale, (y + linesDrawn * lineHeight) * scale);
          line = words[i];
          linesDrawn++;
        } else {
          line = test;
        }
      }
      if (line) {
        if (typeof maxLines === 'number' && linesDrawn >= maxLines) {
          ctx.textAlign = 'left';
          return linesDrawn;
        }
        ctx.fillText(line, x * scale, (y + linesDrawn * lineHeight) * scale);
        linesDrawn++;
      }
    }
    ctx.textAlign = 'left';
    return linesDrawn;
  }

  function drawControlChip(x, y, keyLabel, actionLabel) {
    drawRect(x, y, 216, 42, '#120b0b', CLR.dim);
    drawText(keyLabel, x + 14, y + 17, CLR.bright, 7, 'left');
    drawText(actionLabel, x + 14, y + 33, CLR.white, 6, 'left');
  }

  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, HEIGHT * scale);
    grad.addColorStop(0, CLR.skyTop);
    grad.addColorStop(1, CLR.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.smoke;
    for (var i = 0; i < 5; i++) {
      var sx = ((i * 130) - (worldDistance * 0.18 % 130));
      ctx.fillRect(sx * scale, (38 + (i % 2) * 18) * scale, 120 * scale, 44 * scale);
    }

    drawBuildings();
    drawRoad();
    drawSparks();
  }

  function drawBuildings() {
    var parallax = worldDistance * 0.35;
    for (var i = 0; i < 7; i++) {
      var bx = ((i * 110) - (parallax % 110)) - 20;
      var bh = 70 + (i % 3) * 18;
      drawRect(bx, 110 - bh, 88, bh, CLR.black, null);
      if (i % 2 === 0) drawFireColumn(bx + 18, 114 - bh, 20, 26);
      drawRect(bx + 10, 118 - bh, 14, 14, CLR.fireHot, CLR.fire);
      drawRect(bx + 42, 126 - bh, 14, 14, CLR.fireHot, CLR.fire);
    }

    if (worldDistance > 760 && worldDistance < 1490) {
      drawRect(428, 82, 120, 94, '#160e0d', CLR.red);
      drawRect(454, 118, 22, 22, CLR.fireHot, CLR.fire);
      drawRect(497, 118, 22, 22, CLR.fireHot, CLR.fire);
      drawText('HOTEL', 448, 94, CLR.bright, 9, 'left');
      if (redBubbleTimer > 0) drawSpeechBubble();
    }

    if (worldDistance > 1670) {
      drawRect(448, 92, 138, 96, '#1a100d', CLR.rope);
      drawText('DEPOT', 470, 106, CLR.bright, 10, 'left');
      drawFireColumn(475, 76, 28, 32);
      drawFireColumn(536, 72, 24, 28);
    }
  }

  function drawSpeechBubble() {
    drawRect(354, 20, 244, 48, '#1c100e', CLR.bright);
    drawText('RED: "NO PANTS! KNOBBERS TOOK EM!"', 366, 40, CLR.white, 8, 'left');
    drawText('SADIE: "CATCH THE BUNDLE, FOOL!"', 366, 56, CLR.bright, 8, 'left');
  }

  function drawRoad() {
    drawRect(0, 140, WIDTH, 220, CLR.road, null);
    for (var i = 0; i < 3; i++) {
      ctx.strokeStyle = CLR.roadLine;
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(0, lanes[i] * scale + 18 * scale);
      ctx.lineTo(canvas.width, lanes[i] * scale + 18 * scale);
      ctx.stroke();
    }
    drawRect(0, 340, WIDTH, 60, '#0f0f12', null);
  }

  function drawSparks() {
    for (var i = 0; i < sparks.length; i++) {
      ctx.fillStyle = sparks[i].hot ? CLR.fireHot : CLR.fire;
      ctx.fillRect(sparks[i].x * scale, sparks[i].y * scale, sparks[i].size * scale, sparks[i].size * scale);
    }
  }

  function drawFireColumn(x, y, w, h) {
    ctx.fillStyle = CLR.fire;
    ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
    ctx.fillStyle = CLR.fireHot;
    ctx.fillRect((x + 4) * scale, (y + 5) * scale, (w - 8) * scale, (h - 8) * scale);
  }

  function drawObjects() {
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      if (obj.hit || obj.collected) continue;
      var screenX = obj.worldX - worldDistance + PLAYER_BASE_X;
      if (screenX < -50 || screenX > WIDTH + 50) continue;
      var y = lanes[obj.lane];
      if (obj.kind === 'pickup') {
        drawPickup(obj.pickupType, screenX, y);
      } else {
        drawObstacle(obj.obstacleType, screenX, y);
      }
    }
  }

  function drawPickup(type, x, y) {
    if (type === 'citizen') {
      drawRect(x - 8, y - 22, 16, 22, CLR.blue, CLR.white);
      drawRect(x - 5, y - 34, 10, 10, CLR.white, null);
      return;
    }
    if (type === 'pants_bundle') {
      drawRect(x - 18, y - 18, 36, 18, CLR.red, CLR.bright);
      drawText('PANTS', x - 16, y - 4, CLR.white, 6, 'left');
      return;
    }
    if (type === 'red_bundle') {
      drawRect(x - 18, y - 18, 36, 18, CLR.red, CLR.bright);
      drawText('PANTS', x - 16, y - 4, CLR.white, 6, 'left');
    }
  }

  function drawObstacle(type, x, y) {
    if (type === 'fire') {
      drawFireColumn(x - 18, y - 20, 36, 28);
      return;
    }
    if (type === 'beam') {
      drawRect(x - 24, y - 16, 48, 14, CLR.wood, CLR.tan);
      drawRect(x - 18, y - 26, 12, 10, CLR.ash, null);
      return;
    }
    if (type === 'knobber') {
      drawRect(x - 12, y - 24, 24, 24, '#dfdfd0', CLR.black);
      drawRect(x - 9, y - 18, 18, 18, CLR.black, null);
      drawRect(x + 10, y - 12, 16, 4, CLR.wood, null);
    }
  }

  function drawPlayer() {
    var px = player.x;
    var py = player.y - player.jump;
    var flash = player.invuln > 0 && Math.floor(player.invuln * 10) % 2 === 0;
    if (flash) return;

    drawRect(px - 26, py - 18, 26, 16, '#6f4529', CLR.tan);
    drawRect(px - 22, py - 8, 6, 14, '#3f2b1f', null);
    drawRect(px - 12, py - 8, 6, 14, '#3f2b1f', null);
    drawRect(px - 6, py - 34, 16, 22, '#3f2b1f', CLR.tan);
    drawRect(px - 2, py - 46, 8, 8, CLR.tan, null);
    drawRect(px - 5, py - 50, 14, 5, CLR.black, null);
    drawRect(px - 8, py - 38, 4, 18, CLR.blue, null);
    drawRect(px + 4, py - 20, 10, 14, CLR.fireHot, CLR.fire);
  }

  function drawHUD() {
    drawRect(10, 10, 620, 38, '#0d0d12', CLR.dim);
    drawText('FIRE IN THE HOLE', 24, 30, CLR.bright, 10, 'left');
    drawText(districtLabel.toUpperCase(), 318, 30, CLR.white, 8, 'center');
    drawText('TIME ' + Math.max(0, Math.ceil(timeLeft)), 610, 30, CLR.bright, 8, 'right');

    drawRect(18, 54, 604, 10, '#181818', CLR.dim);
    drawRect(20, 56, Math.max(0, Math.min(600, (worldDistance / TARGET_DISTANCE) * 600)), 6, CLR.fireHot, null);

    drawText('Saved ' + player.citizens, 20, 82, CLR.white, 8, 'left');
    drawText('Pants ' + player.pantsBundles, 170, 82, CLR.white, 8, 'left');
    drawText('Hits ' + player.hits, 320, 82, player.hits > 2 ? CLR.red : CLR.white, 8, 'left');
    var liveReward = Math.round((player.citizens * 1 + player.pantsBundles * 0.5 + (player.redCaught ? 1.5 : 0)) * 100) / 100;
    drawText('Reward $' + liveReward.toFixed(2), 470, 82, CLR.bright, 8, 'left');

    if (messageTimer > 0) {
      drawRect(62, 356, 516, 26, '#120e0c', CLR.bright);
      drawText(messageText, 320, 374, CLR.white, 8, 'center');
    }
  }

  function drawInstructions() {
    drawBackground();
    drawRect(56, 34, 528, 300, '#080809', CLR.bright);
    drawText('FIRE IN THE HOLE', 320, 80, CLR.bright, 14, 'center');
    drawText('TOWN DRILL', 320, 106, CLR.white, 8, 'center');

    drawWrappedText('Save townsfolk. Dodge fire. Grab the pants bundles for bonus.', 320, 138, 446, 18, CLR.white, 7, 'center', 2);

    drawControlChip(90, 180, 'UP / DOWN', 'switch lanes');
    drawControlChip(334, 180, 'LEFT / RIGHT', 'shift wagon');
    drawControlChip(90, 232, 'SPACE', 'jump fire');
    drawControlChip(334, 232, 'ESC', 'leave town');

    drawWrappedText('Touch: top or bottom moves lanes. Tap right to jump.', 320, 292, 430, 16, CLR.bright, 6, 'center', 2);
    drawText('RED FLANDERS IS AHEAD YELLING ABOUT HIS PANTS.', 320, 322, CLR.red, 7, 'center');
    drawText('SPACE OR TAP TO START', 320, 352, CLR.fireHot, 8, 'center');
    drawEscHint();
  }

  function drawResults() {
    drawBackground();
    drawRect(52, 42, 536, 300, '#090909', CLR.bright);
    drawText(results.label.toUpperCase(), 320, 84, CLR.bright, 13, 'center');
    drawWrappedText(results.summary, 320, 112, 420, 18, CLR.white, 7, 'center', 2);

    drawResultStat(98, 154, 'SAVED', String(results.citizensSaved), CLR.white);
    drawResultStat(346, 154, 'PANTS', String(results.pantsBundles || 0), CLR.red);
    drawResultStat(98, 228, 'GRATITUDE', '$' + results.cash.toFixed(2), CLR.bright);
    drawResultStat(346, 228, 'MORALE', '+' + results.morale, CLR.green);

    if (results.healthPenalty > 0) {
      drawText('BURN HITS +' + results.healthPenalty, 320, 304, CLR.red, 8, 'center');
    } else {
      drawText('CLEAN RUN', 320, 304, CLR.green, 8, 'center');
    }
    drawWrappedText(results.redCaught ? 'RED GOT THE PANTS BACK.' : 'RED IS STILL YELLING ABOUT THE PANTS.', 320, 320, 440, 16, CLR.red, 7, 'center', 2);

    drawText('PRESS SPACE OR TAP TO CONTINUE', 320, 368, CLR.fireHot, 8, 'center');
    drawEscHint();
  }

  function drawResultStat(x, y, label, value, valueColor) {
    drawRect(x, y, 196, 58, '#120f10', CLR.dim);
    drawText(label, x + 12, y + 18, CLR.dim, 7, 'left');
    drawText(value, x + 12, y + 44, valueColor || CLR.white, 12, 'left');
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
    drawBackground();
    drawObjects();
    drawPlayer();
    drawHUD();
    drawEscHint();
  }

  function gameLoop(timestamp) {
    if (!gameRunning) return;
    var dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;
    update(dt);
    render();
    animFrame = requestAnimationFrame(gameLoop);
  }

  window.FireInTheHoleGame = {
    start: function (p, cb) {
      init();
      callback = cb || null;
      resetGame(p || {});

      var screen = document.getElementById('screen');
      if (screen) screen.classList.add('hidden');
      canvas.classList.remove('hidden');

      document.addEventListener('keydown', boundKeyDown);
      document.addEventListener('keyup', boundKeyUp);
      canvas.addEventListener('touchstart', boundTouchStart, { passive: false });
      canvas.addEventListener('mousedown', boundMouseDown);

      lastTimestamp = performance.now();
      animFrame = requestAnimationFrame(gameLoop);
    },

    stop: function () {
      if (gamePhase === 'playing') showResults();
      endGame();
    }
  };
})();
