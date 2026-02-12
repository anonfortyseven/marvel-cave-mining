/*
 * mining-game.js - Guano Extraction Mini-Game
 * The Marvel Cave Mining Company
 *
 * Canvas-based mining mini-game where the player extracts guano deposits
 * from a cave chamber. Equivalent to Oregon Trail hunting.
 */
(function () {
  'use strict';

  var canvas, ctx;
  var animFrame = null;
  var gameRunning = false;
  var gamePhase = 'instructions'; // instructions | playing | results
  var callback = null;
  var params = {};

  // Timing
  var SESSION_TIME = 45; // seconds
  var timeLeft = SESSION_TIME;
  var lastTimestamp = 0;

  // Colors
  var CLR = {
    bg: '#000000',
    amber: '#D4A017',
    brown: '#8B4513',
    orange: '#CC7722',
    gray: '#888888',
    darkGray: '#444444',
    blue: '#1a3a5c',
    red: '#CC3333',
    green: '#2d6b2d',
    guano: '#6B5B3A',
    guanoLight: '#8B7B5A',
    lantern: 'rgba(212, 160, 23, 0.12)',
    white: '#DDDDDD'
  };

  // Player
  var player = {
    x: 300, y: 300, w: 20, h: 32,
    vx: 0, speed: 160,
    facing: 1, // 1=right, -1=left
    swinging: false, swingTimer: 0,
    carrying: false, carryWeight: 0,
    health: 100
  };

  // Cart
  var cart = { x: 40, y: 328, w: 50, h: 32, collected: 0, capacity: 500 };

  // Deposits
  var deposits = [];
  var fallenGuano = [];
  var DEPOSIT_HP = 3;

  // Hazards
  var bats = [];
  var stalactites = [];
  var gasPockets = [];
  var batSpawnTimer = 0;
  var stalactiteTimer = 0;
  var gasTimer = 0;

  // Lantern
  var lanternRadius = 140;
  var lanternFlickerTimer = 0;
  var lanternDark = false;

  // Results
  var results = { guanoCollected: 0, healthPenalty: 0, oilUsed: 0 };

  // Keys
  var keys = {};

  // Cave decorations
  var stalactiteDecor = [];
  var wallRocks = [];

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
  }

  function resetGame(p) {
    params = p || {};
    timeLeft = SESSION_TIME;
    gamePhase = 'instructions';
    gameRunning = true;
    keys = {};

    player.x = 300;
    player.y = 300;
    player.vx = 0;
    player.facing = 1;
    player.swinging = false;
    player.swingTimer = 0;
    player.carrying = false;
    player.carryWeight = 0;
    player.health = params.crewHealth || 100;

    cart.collected = 0;

    deposits = [];
    fallenGuano = [];
    bats = [];
    stalactites = [];
    gasPockets = [];
    batSpawnTimer = 3;
    stalactiteTimer = 5;
    gasTimer = 8;

    lanternRadius = 100 + (params.oilLevel || 80) * 0.5;
    lanternFlickerTimer = 0;
    lanternDark = false;

    results = { guanoCollected: 0, healthPenalty: 0, oilUsed: 0 };

    // Generate deposits based on chamber yield
    var yieldFactor = Math.min((params.chamberYield || 300) / 500, 1);
    var numDeposits = 5 + Math.floor(yieldFactor * 6);
    for (var i = 0; i < numDeposits; i++) {
      var onCeiling = Math.random() < 0.5;
      deposits.push({
        x: 120 + Math.random() * 480,
        y: onCeiling ? (30 + Math.random() * 40) : (60 + Math.random() * 80),
        w: 20 + Math.random() * 16,
        h: 14 + Math.random() * 10,
        hp: DEPOSIT_HP,
        weight: 30 + Math.floor(Math.random() * 50),
        onCeiling: onCeiling
      });
    }

    // Generate decorative stalactites
    stalactiteDecor = [];
    for (var s = 0; s < 12; s++) {
      stalactiteDecor.push({
        x: 20 + Math.random() * 600,
        h: 15 + Math.random() * 30
      });
    }

    // Wall rocks
    wallRocks = [];
    for (var r = 0; r < 8; r++) {
      wallRocks.push({
        x: Math.random() * 620,
        y: 340 + Math.random() * 30,
        w: 10 + Math.random() * 20,
        h: 6 + Math.random() * 12
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

    // Timer
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      showResults();
      return;
    }

    // Player movement
    player.vx = 0;
    if (keys['ArrowLeft']) { player.vx = -player.speed; player.facing = -1; }
    if (keys['ArrowRight']) { player.vx = player.speed; player.facing = 1; }
    if (player.carrying) player.vx *= 0.6; // slower when carrying

    player.x += player.vx * dt;
    if (player.x < 10) player.x = 10;
    if (player.x > 610) player.x = 610;

    // Swing pickaxe
    if (keys['Space'] && !player.swinging && !player.carrying) {
      player.swinging = true;
      player.swingTimer = 0.3;
      checkPickaxeHit();
    }
    if (player.swinging) {
      player.swingTimer -= dt;
      if (player.swingTimer <= 0) player.swinging = false;
    }

    // Auto-collect fallen guano when near cart
    if (player.carrying && Math.abs(player.x - (cart.x + cart.w / 2)) < 40 &&
        player.y > 280) {
      var space = cart.capacity - cart.collected;
      var loaded = Math.min(player.carryWeight, space);
      cart.collected += loaded;
      results.guanoCollected += loaded;
      player.carrying = false;
      player.carryWeight = 0;
    }

    // Pick up fallen guano
    if (!player.carrying) {
      for (var i = fallenGuano.length - 1; i >= 0; i--) {
        var fg = fallenGuano[i];
        if (Math.abs(player.x - fg.x) < 30 && player.y > 280) {
          player.carrying = true;
          player.carryWeight = fg.weight;
          fallenGuano.splice(i, 1);
          break;
        }
      }
    }

    // Fallen guano gravity
    for (var f = 0; f < fallenGuano.length; f++) {
      if (fallenGuano[f].y < 340) {
        fallenGuano[f].y += 200 * dt;
        if (fallenGuano[f].y > 340) fallenGuano[f].y = 340;
      }
    }

    // Bats
    batSpawnTimer -= dt;
    if (batSpawnTimer <= 0) {
      batSpawnTimer = 2 + Math.random() * 4;
      bats.push({
        x: Math.random() < 0.5 ? -20 : 660,
        y: 40 + Math.random() * 100,
        vx: (Math.random() < 0.5 ? 1 : -1) * (100 + Math.random() * 80),
        wingPhase: 0
      });
      // Ensure bat goes inward
      if (bats[bats.length - 1].x > 320) bats[bats.length - 1].vx = -Math.abs(bats[bats.length - 1].vx);
      else bats[bats.length - 1].vx = Math.abs(bats[bats.length - 1].vx);
    }
    for (var b = bats.length - 1; b >= 0; b--) {
      var bat = bats[b];
      bat.x += bat.vx * dt;
      bat.y += Math.sin(bat.wingPhase * 6) * 30 * dt;
      bat.wingPhase += dt * 8;
      // Hit player
      if (Math.abs(bat.x - player.x) < 18 && Math.abs(bat.y - player.y - 10) < 20) {
        player.health -= 3;
        results.healthPenalty += 3;
        bats.splice(b, 1);
        continue;
      }
      if (bat.x < -30 || bat.x > 670) bats.splice(b, 1);
    }

    // Falling stalactites
    stalactiteTimer -= dt;
    if (stalactiteTimer <= 0) {
      stalactiteTimer = 3 + Math.random() * 4;
      stalactites.push({
        x: 60 + Math.random() * 520,
        y: 0,
        vy: 0,
        falling: false,
        warningTimer: 1.0
      });
    }
    for (var st = stalactites.length - 1; st >= 0; st--) {
      var stl = stalactites[st];
      if (!stl.falling) {
        stl.warningTimer -= dt;
        if (stl.warningTimer <= 0) stl.falling = true;
      } else {
        stl.vy += 400 * dt;
        stl.y += stl.vy * dt;
        // Hit player
        if (Math.abs(stl.x - player.x) < 14 && stl.y >= player.y - 32 && stl.y <= player.y) {
          player.health -= 10;
          results.healthPenalty += 10;
          stalactites.splice(st, 1);
          continue;
        }
        if (stl.y > 380) {
          stalactites.splice(st, 1);
        }
      }
    }

    // Gas pockets
    gasTimer -= dt;
    if (gasTimer <= 0) {
      gasTimer = 6 + Math.random() * 6;
      gasPockets.push({
        x: 100 + Math.random() * 440,
        y: 280,
        radius: 50 + Math.random() * 40,
        life: 3 + Math.random() * 2,
        alpha: 0
      });
    }
    for (var g = gasPockets.length - 1; g >= 0; g--) {
      var gas = gasPockets[g];
      gas.life -= dt;
      if (gas.life > 2) {
        gas.alpha = Math.min(gas.alpha + dt * 0.5, 0.4);
      } else {
        gas.alpha -= dt * 0.3;
      }
      // Damage player in gas
      if (Math.abs(player.x - gas.x) < gas.radius && player.y > 260 && gas.alpha > 0.1) {
        player.health -= 5 * dt;
        results.healthPenalty += 5 * dt;
      }
      if (gas.life <= 0) gasPockets.splice(g, 1);
    }

    // Lantern flicker
    var oilLevel = params.oilLevel || 80;
    results.oilUsed = SESSION_TIME - timeLeft;
    if (oilLevel < 40) {
      lanternFlickerTimer -= dt;
      if (lanternFlickerTimer <= 0) {
        lanternDark = !lanternDark;
        lanternFlickerTimer = lanternDark ? 0.2 + Math.random() * 0.3 : 0.5 + Math.random() * 1.0;
      }
    }

    // Check health
    if (player.health <= 0) {
      player.health = 0;
      showResults();
    }
  }

  function checkPickaxeHit() {
    var reachX = player.x + player.facing * 24;
    for (var i = 0; i < deposits.length; i++) {
      var dep = deposits[i];
      if (Math.abs(reachX - (dep.x + dep.w / 2)) < dep.w &&
          Math.abs((player.y - 16) - dep.y) < 80) {
        dep.hp--;
        if (dep.hp <= 0) {
          fallenGuano.push({
            x: dep.x + dep.w / 2,
            y: dep.y + dep.h,
            weight: dep.weight,
            w: dep.w * 0.8,
            h: dep.h * 0.7
          });
          deposits.splice(i, 1);
        }
        return;
      }
    }
  }

  function showResults() {
    gamePhase = 'results';
    results.guanoCollected = Math.floor(cart.collected);
    results.healthPenalty = Math.floor(results.healthPenalty);
    results.oilUsed = Math.round(results.oilUsed * 10) / 10;
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

  function drawCave() {
    // Ceiling
    ctx.fillStyle = CLR.darkGray;
    ctx.fillRect(0, 0, 640, 20);
    for (var i = 0; i < 640; i += 3) {
      var h = 15 + Math.sin(i * 0.05) * 8 + Math.sin(i * 0.13) * 4;
      ctx.fillRect(i, 0, 3, h);
    }

    // Decorative stalactites
    ctx.fillStyle = CLR.gray;
    for (var s = 0; s < stalactiteDecor.length; s++) {
      var sd = stalactiteDecor[s];
      ctx.beginPath();
      ctx.moveTo(sd.x - 4, 0);
      ctx.lineTo(sd.x + 4, 0);
      ctx.lineTo(sd.x, sd.h);
      ctx.fill();
    }

    // Floor
    ctx.fillStyle = CLR.brown;
    ctx.fillRect(0, 360, 640, 40);
    ctx.fillStyle = CLR.darkGray;
    for (var j = 0; j < 640; j += 4) {
      var fh = 360 - Math.sin(j * 0.08) * 5 - Math.sin(j * 0.2) * 2;
      ctx.fillRect(j, fh, 4, 400 - fh);
    }

    // Wall rocks
    ctx.fillStyle = '#555555';
    for (var r = 0; r < wallRocks.length; r++) {
      var wr = wallRocks[r];
      ctx.fillRect(wr.x, wr.y, wr.w, wr.h);
    }
  }

  function drawDeposits() {
    for (var i = 0; i < deposits.length; i++) {
      var dep = deposits[i];
      var intensity = dep.hp / DEPOSIT_HP;
      ctx.fillStyle = CLR.guano;
      ctx.fillRect(dep.x, dep.y, dep.w, dep.h);
      ctx.fillStyle = CLR.guanoLight;
      ctx.fillRect(dep.x + 2, dep.y + 2, dep.w - 4, dep.h / 2);
      // Damage cracks
      if (dep.hp < DEPOSIT_HP) {
        ctx.strokeStyle = CLR.amber;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dep.x + dep.w / 2, dep.y);
        ctx.lineTo(dep.x + dep.w / 2 + (1 - intensity) * 6, dep.y + dep.h);
        ctx.stroke();
      }
    }
  }

  function drawFallenGuano() {
    ctx.fillStyle = CLR.guano;
    for (var i = 0; i < fallenGuano.length; i++) {
      var fg = fallenGuano[i];
      ctx.fillRect(fg.x - fg.w / 2, fg.y, fg.w, fg.h);
      ctx.fillStyle = CLR.guanoLight;
      ctx.fillRect(fg.x - fg.w / 2 + 2, fg.y + 1, fg.w - 4, fg.h / 2);
      ctx.fillStyle = CLR.guano;
    }
  }

  function drawCart() {
    // Wheels
    ctx.fillStyle = CLR.darkGray;
    ctx.beginPath();
    ctx.arc(cart.x + 10, cart.y + cart.h, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cart.x + cart.w - 10, cart.y + cart.h, 6, 0, Math.PI * 2);
    ctx.fill();

    // Cart body
    ctx.fillStyle = CLR.brown;
    ctx.fillRect(cart.x, cart.y, cart.w, cart.h);
    ctx.strokeStyle = CLR.orange;
    ctx.lineWidth = 2;
    ctx.strokeRect(cart.x, cart.y, cart.w, cart.h);

    // Fill level
    var fillPct = cart.collected / cart.capacity;
    if (fillPct > 0) {
      ctx.fillStyle = CLR.guano;
      var fillH = cart.h * fillPct;
      ctx.fillRect(cart.x + 2, cart.y + cart.h - fillH, cart.w - 4, fillH);
    }

    // Label
    ctx.fillStyle = CLR.amber;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CART', cart.x + cart.w / 2, cart.y - 4);
  }

  function drawPlayer() {
    var px = Math.floor(player.x);
    var py = Math.floor(player.y);

    // Body
    ctx.fillStyle = CLR.orange;
    ctx.fillRect(px - 5, py - 24, 10, 16); // torso
    // Head
    ctx.fillStyle = CLR.white;
    ctx.fillRect(px - 4, py - 32, 8, 8);
    // Hard hat
    ctx.fillStyle = CLR.amber;
    ctx.fillRect(px - 5, py - 34, 10, 4);
    // Legs
    ctx.fillStyle = CLR.brown;
    ctx.fillRect(px - 4, py - 8, 4, 8);
    ctx.fillRect(px, py - 8, 4, 8);

    // Pickaxe arm
    if (player.swinging) {
      var swingAngle = (1 - player.swingTimer / 0.3) * Math.PI * 0.6;
      ctx.strokeStyle = CLR.gray;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + player.facing * 5, py - 20);
      var tipX = px + player.facing * (10 + Math.cos(swingAngle) * 18);
      var tipY = py - 20 - Math.sin(swingAngle) * 14 + 10;
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      // Pickaxe head
      ctx.fillStyle = CLR.gray;
      ctx.fillRect(tipX - 3, tipY - 2, 6, 4);
    } else {
      // Holding pickaxe idle
      ctx.strokeStyle = CLR.gray;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + player.facing * 5, py - 18);
      ctx.lineTo(px + player.facing * 14, py - 10);
      ctx.stroke();
    }

    // Carrying guano indicator
    if (player.carrying) {
      ctx.fillStyle = CLR.guano;
      ctx.fillRect(px - 6, py - 28, 12, 6);
    }

    // Lantern glow
    if (!lanternDark) {
      var grad = ctx.createRadialGradient(px, py - 16, 5, px, py - 16, lanternRadius);
      grad.addColorStop(0, 'rgba(212, 160, 23, 0.10)');
      grad.addColorStop(0.5, 'rgba(212, 160, 23, 0.05)');
      grad.addColorStop(1, 'rgba(212, 160, 23, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(px - lanternRadius, py - 16 - lanternRadius, lanternRadius * 2, lanternRadius * 2);
    }
  }

  function drawBats() {
    ctx.fillStyle = CLR.darkGray;
    for (var i = 0; i < bats.length; i++) {
      var bat = bats[i];
      var wingUp = Math.sin(bat.wingPhase) > 0;
      // Body
      ctx.fillStyle = '#332222';
      ctx.fillRect(bat.x - 3, bat.y - 2, 6, 4);
      // Wings
      ctx.fillRect(bat.x - 10, bat.y + (wingUp ? -4 : 0), 8, 2);
      ctx.fillRect(bat.x + 2, bat.y + (wingUp ? -4 : 0), 8, 2);
      // Eyes
      ctx.fillStyle = CLR.red;
      ctx.fillRect(bat.x - 2, bat.y - 2, 1, 1);
      ctx.fillRect(bat.x + 1, bat.y - 2, 1, 1);
    }
  }

  function drawStalactites() {
    for (var i = 0; i < stalactites.length; i++) {
      var stl = stalactites[i];
      if (!stl.falling) {
        // Warning shimmer
        var flash = Math.sin(stl.warningTimer * 12) > 0;
        ctx.fillStyle = flash ? CLR.red : CLR.amber;
        ctx.beginPath();
        ctx.moveTo(stl.x - 5, 0);
        ctx.lineTo(stl.x + 5, 0);
        ctx.lineTo(stl.x, 20);
        ctx.fill();
      } else {
        ctx.fillStyle = CLR.gray;
        ctx.beginPath();
        ctx.moveTo(stl.x - 5, stl.y);
        ctx.lineTo(stl.x + 5, stl.y);
        ctx.lineTo(stl.x, stl.y + 18);
        ctx.fill();
      }
    }
  }

  function drawGasPockets() {
    for (var i = 0; i < gasPockets.length; i++) {
      var gas = gasPockets[i];
      if (gas.alpha > 0.01) {
        ctx.fillStyle = 'rgba(180, 180, 30, ' + gas.alpha + ')';
        ctx.beginPath();
        ctx.arc(gas.x, gas.y, gas.radius, 0, Math.PI * 2);
        ctx.fill();
        // Particles
        ctx.fillStyle = 'rgba(200, 200, 50, ' + (gas.alpha * 0.5) + ')';
        for (var p = 0; p < 4; p++) {
          var px = gas.x + Math.cos(p * 1.5 + gas.life * 2) * gas.radius * 0.5;
          var py = gas.y + Math.sin(p * 2 + gas.life * 3) * gas.radius * 0.3;
          ctx.fillRect(px - 1, py - 1, 3, 3);
        }
      }
    }
  }

  function drawHUD() {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, 640, 18);

    ctx.fillStyle = CLR.amber;
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('TIME: ' + Math.ceil(timeLeft) + 's', 10, 14);

    ctx.textAlign = 'center';
    ctx.fillText('GUANO: ' + Math.floor(cart.collected) + '/' + cart.capacity + ' lbs', 320, 14);

    ctx.textAlign = 'right';
    var healthColor = player.health > 50 ? CLR.amber : (player.health > 25 ? CLR.orange : CLR.red);
    ctx.fillStyle = healthColor;
    ctx.fillText('HEALTH: ' + Math.floor(player.health), 630, 14);

    if (player.carrying) {
      ctx.fillStyle = CLR.white;
      ctx.textAlign = 'center';
      ctx.fillText('Carrying ' + player.carryWeight + ' lbs - bring to CART!', 320, 390);
    }
  }

  function drawInstructions() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, 640, 400);

    ctx.fillStyle = CLR.amber;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GUANO EXTRACTION', 320, 60);

    ctx.font = '12px monospace';
    ctx.fillStyle = CLR.white;
    var lines = [
      'Extract bat guano from the cave chamber!',
      '',
      'CONTROLS:',
      'Arrow Keys .... Move left/right',
      'Space ......... Swing pickaxe',
      '',
      'INSTRUCTIONS:',
      '- Hit deposits 3 times to dislodge guano',
      '- Walk over fallen guano to pick it up',
      '- Carry guano to the CART on the left',
      '- Avoid bats, falling rocks, and gas!',
      '',
      'TIME LIMIT: ' + SESSION_TIME + ' seconds',
      'CART CAPACITY: ' + cart.capacity + ' lbs'
    ];
    for (var i = 0; i < lines.length; i++) {
      ctx.fillStyle = (i === 2 || i === 7) ? CLR.amber : CLR.white;
      ctx.fillText(lines[i], 320, 100 + i * 18);
    }

    ctx.fillStyle = CLR.amber;
    ctx.font = '14px monospace';
    ctx.fillText('Press SPACE or ENTER to begin', 320, 375);
  }

  function drawResults() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, 640, 400);

    ctx.fillStyle = CLR.amber;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXTRACTION COMPLETE', 320, 80);

    ctx.font = '14px monospace';
    ctx.fillStyle = CLR.white;
    ctx.fillText('Guano Collected: ' + results.guanoCollected + ' lbs', 320, 140);
    ctx.fillText('Health Penalty: ' + results.healthPenalty, 320, 170);
    ctx.fillText('Oil Used: ' + results.oilUsed, 320, 200);

    var rating;
    if (results.guanoCollected >= 400) rating = 'EXCELLENT HAUL!';
    else if (results.guanoCollected >= 250) rating = 'Good work, miner.';
    else if (results.guanoCollected >= 100) rating = 'Meager results.';
    else rating = 'Barely anything...';

    ctx.fillStyle = CLR.amber;
    ctx.font = '16px monospace';
    ctx.fillText(rating, 320, 260);

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
      drawResults();
      return;
    }

    // Game scene
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, 640, 400);

    // Darken when lantern is dark
    drawCave();
    drawDeposits();
    drawFallenGuano();
    drawCart();
    drawGasPockets();
    drawPlayer();
    drawBats();
    drawStalactites();
    drawHUD();

    // Darkness overlay for low oil
    if (lanternDark) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, 640, 400);
      // Small glow around player
      var glow = ctx.createRadialGradient(player.x, player.y - 16, 3, player.x, player.y - 16, 30);
      glow.addColorStop(0, 'rgba(212, 160, 23, 0.15)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(player.x - 30, player.y - 46, 60, 60);
    }
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

  window.MiningGame = {
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
