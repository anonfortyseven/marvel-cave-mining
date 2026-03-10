/*
 * grandfathers-mansion-game.js - Grandfather's Mansion Maze
 * The Marvel Cave Mining Company
 *
 * A compact funhouse maze in Marmaros. Find the heirlooms,
 * avoid the roaming shadows, and make it to the study door
 * before the hall clocks run down.
 */
(function () {
  'use strict';

  var WIDTH = 640;
  var HEIGHT = 400;
  var TILE = 28;
  var MAZE_X = 110;
  var MAZE_Y = 62;
  var TOTAL_TIME = 50;

  var canvas, ctx, scale;
  var animFrame = null;
  var callback = null;
  var gameRunning = false;
  var gamePhase = 'instructions'; // instructions | playing | results
  var lastTimestamp = 0;

  var CLR = {
    bg: '#061014',
    panel: '#0d1a21',
    panelDeep: '#081114',
    copper: '#b46e40',
    bright: '#e0b26c',
    dim: '#7a5a37',
    white: '#f2e3c4',
    blue: '#8f2934',
    blueDeep: '#30080d',
    green: '#76b26f',
    red: '#d46a43',
    shadow: '#d7d8dc',
    floorA: '#13222b',
    floorB: '#102029',
    wall: '#4b3626',
    wallEdge: '#7a5a37',
    door: '#35553d',
    doorLocked: '#4b3626'
  };

  var LAYOUT = [
    '###############',
    '#S..#.......#E#',
    '#.#.#.#####.#.#',
    '#.#.#.....#.#.#',
    '#.#.#####.#.#.#',
    '#...#...#.#...#',
    '###.#.#.#.###.#',
    '#a..#.#b#...#.#',
    '#.#.#.#.###.#.#',
    '#..c..#.....#.#',
    '###############'
  ];

  var player = null;
  var startCell = null;
  var exitCell = null;
  var collectibles = [];
  var totalCollectibles = 0;
  var collectedCount = 0;
  var hits = 0;
  var steps = 0;
  var timeLeft = TOTAL_TIME;
  var result = null;
  var messageText = '';
  var messageTimer = 0;

  var patrols = [];

  var boundKeyDown = null;
  var boundTouchStart = null;
  var boundMouseDown = null;

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
    scale = canvas.width / WIDTH;
  }

  function resetGame() {
    gameRunning = true;
    gamePhase = 'instructions';
    lastTimestamp = 0;
    player = {
      x: 1,
      y: 1,
      invuln: 0
    };
    collectibles = [];
    patrols = [];
    totalCollectibles = 0;
    collectedCount = 0;
    hits = 0;
    steps = 0;
    timeLeft = TOTAL_TIME;
    result = null;
    messageText = '';
    messageTimer = 0;
    parseLayout();
    buildPatrols();
  }

  function parseLayout() {
    collectibles.length = 0;
    totalCollectibles = 0;
    startCell = null;
    exitCell = null;
    for (var y = 0; y < LAYOUT.length; y++) {
      for (var x = 0; x < LAYOUT[y].length; x++) {
        var ch = LAYOUT[y].charAt(x);
        if (ch === 'S') {
          startCell = { x: x, y: y };
          player.x = x;
          player.y = y;
        } else if (ch === 'E') {
          exitCell = { x: x, y: y };
        } else if (ch === 'a' || ch === 'b' || ch === 'c') {
          collectibles.push({
            id: ch,
            x: x,
            y: y,
            found: false
          });
          totalCollectibles++;
        }
      }
    }
  }

  function buildPatrols() {
    patrols = [
      {
        x: 1,
        y: 5,
        speed: 2.1,
        seg: 0,
        path: [
          { x: 1, y: 5 },
          { x: 3, y: 5 },
          { x: 3, y: 7 },
          { x: 1, y: 7 }
        ]
      },
      {
        x: 11,
        y: 1,
        speed: 1.9,
        seg: 0,
        path: [
          { x: 11, y: 1 },
          { x: 13, y: 1 },
          { x: 13, y: 3 },
          { x: 11, y: 3 }
        ]
      }
    ];
  }

  function isWall(x, y) {
    if (y < 0 || y >= LAYOUT.length || x < 0 || x >= LAYOUT[0].length) return true;
    return LAYOUT[y].charAt(x) === '#';
  }

  function findCollectibleAt(x, y) {
    for (var i = 0; i < collectibles.length; i++) {
      if (!collectibles[i].found && collectibles[i].x === x && collectibles[i].y === y) {
        return collectibles[i];
      }
    }
    return null;
  }

  function setMessage(text, duration) {
    messageText = text || '';
    messageTimer = duration || 1.4;
  }

  function startPlay() {
    gamePhase = 'playing';
    timeLeft = TOTAL_TIME;
    setMessage('Find the three heirlooms, then reach the study door.', 2.2);
  }

  function tryMove(dx, dy) {
    if (gamePhase !== 'playing') return;
    var nx = player.x + dx;
    var ny = player.y + dy;
    if (isWall(nx, ny)) {
      setMessage('Dead end.', 0.8);
      return;
    }

    player.x = nx;
    player.y = ny;
    steps++;

    var prize = findCollectibleAt(nx, ny);
    if (prize) {
      prize.found = true;
      collectedCount++;
      if (prize.id === 'a') setMessage('Pocket watch found.', 1.4);
      else if (prize.id === 'b') setMessage('Portrait token found.', 1.4);
      else setMessage('Cane handle found.', 1.4);
    }

    if (exitCell && nx === exitCell.x && ny === exitCell.y) {
      if (collectedCount >= totalCollectibles) {
        finish(true);
      } else {
        setMessage('The study door is still locked.', 1.2);
      }
    }
  }

  function handleDirection(dir) {
    if (gamePhase === 'instructions') {
      startPlay();
      return;
    }
    if (gamePhase === 'results') {
      endGame();
      return;
    }
    if (dir === 'up') tryMove(0, -1);
    else if (dir === 'down') tryMove(0, 1);
    else if (dir === 'left') tryMove(-1, 0);
    else if (dir === 'right') tryMove(1, 0);
  }

  function onKeyDown(e) {
    if (e.code === 'Escape') {
      e.preventDefault();
      abortGame();
      return;
    }

    if (gamePhase === 'instructions') {
      if (e.code === 'Space' || e.code === 'Enter' || e.code.indexOf('Arrow') === 0) {
        e.preventDefault();
        startPlay();
      }
      return;
    }

    if (gamePhase === 'results') {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        endGame();
      }
      return;
    }

    if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); handleDirection('up'); }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); handleDirection('down'); }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); handleDirection('left'); }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); handleDirection('right'); }
  }

  function getPointerDir(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    var x = (clientX - rect.left) * (canvas.width / rect.width);
    var y = (clientY - rect.top) * (canvas.height / rect.height);
    if (gamePhase !== 'playing') return 'start';
    if (x < canvas.width * 0.33) return 'left';
    if (x > canvas.width * 0.67) return 'right';
    if (y < canvas.height * 0.5) return 'up';
    return 'down';
  }

  function onTouchStart(e) {
    e.preventDefault();
    var touch = e.touches[0];
    var dir = getPointerDir(touch.clientX, touch.clientY);
    if (dir === 'start') {
      if (gamePhase === 'instructions') startPlay();
      else if (gamePhase === 'results') endGame();
      return;
    }
    handleDirection(dir);
  }

  function onMouseDown(e) {
    var dir = getPointerDir(e.clientX, e.clientY);
    if (dir === 'start') {
      if (gamePhase === 'instructions') startPlay();
      else if (gamePhase === 'results') endGame();
      return;
    }
    handleDirection(dir);
  }

  function updatePatrol(patrol, dt) {
    var next = patrol.path[(patrol.seg + 1) % patrol.path.length];
    var dx = next.x - patrol.x;
    var dy = next.y - patrol.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var step = patrol.speed * dt;

    if (dist <= step || dist === 0) {
      patrol.x = next.x;
      patrol.y = next.y;
      patrol.seg = (patrol.seg + 1) % patrol.path.length;
      return;
    }

    patrol.x += (dx / dist) * step;
    patrol.y += (dy / dist) * step;
  }

  function checkPatrolHits() {
    if (player.invuln > 0) return;
    for (var i = 0; i < patrols.length; i++) {
      var dx = patrols[i].x - player.x;
      var dy = patrols[i].y - player.y;
      if ((dx * dx) + (dy * dy) <= 0.18) {
        hits++;
        player.invuln = 1.4;
        timeLeft = Math.max(0, timeLeft - 6);
        player.x = startCell.x;
        player.y = startCell.y;
        setMessage('The hall turns on you. Lose 6 seconds.', 1.6);
        break;
      }
    }
  }

  function finish(escaped) {
    var cash = 0;
    var morale = 1 + collectedCount;
    var focusDays = 0;

    if (escaped) {
      cash += 0.9;
      morale += 2;
      focusDays = collectedCount >= totalCollectibles ? 2 : 1;
    }
    cash += collectedCount * 0.35;
    if (timeLeft >= 18) cash += 0.4;
    if (hits === 0) {
      cash += 0.35;
      morale += 1;
    }
    cash = Math.round(cash * 100) / 100;

    var label = escaped ? 'Study Door Found' : 'Turned Around';
    var summary = escaped
      ? 'You read the crooked halls and found the study.'
      : 'The house beats the clock, but you carry a little of its pattern back with you.';
    if (escaped && hits === 0) {
      label = 'Master Of The Crooked House';
      summary = 'You ghost through the mansion without giving the shadows a handhold.';
    }

    result = {
      label: label,
      summary: summary,
      cash: cash,
      morale: morale,
      focusDays: focusDays,
      items: {},
      escaped: escaped,
      heirlooms: collectedCount,
      timeLeft: Math.max(0, Math.ceil(timeLeft)),
      hits: hits
    };
    gamePhase = 'results';
  }

  function update(dt) {
    if (gamePhase !== 'playing') return;

    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      finish(false);
      return;
    }

    if (player.invuln > 0) player.invuln = Math.max(0, player.invuln - dt);
    if (messageTimer > 0) messageTimer = Math.max(0, messageTimer - dt);

    for (var i = 0; i < patrols.length; i++) {
      updatePatrol(patrols[i], dt);
    }
    checkPatrolHits();
  }

  function drawFrame() {
    var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, CLR.panel);
    grad.addColorStop(1, CLR.panelDeep);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = CLR.copper;
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(10 * scale, 10 * scale, canvas.width - 20 * scale, canvas.height - 20 * scale);
    ctx.strokeStyle = '#203642';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(18 * scale, 18 * scale, canvas.width - 36 * scale, canvas.height - 36 * scale);
  }

  function drawMaze() {
    for (var y = 0; y < LAYOUT.length; y++) {
      for (var x = 0; x < LAYOUT[y].length; x++) {
        var px = (MAZE_X + x * TILE) * scale;
        var py = (MAZE_Y + y * TILE) * scale;
        var tile = LAYOUT[y].charAt(x);
        if (tile === '#') {
          ctx.fillStyle = CLR.wall;
          ctx.fillRect(px, py, TILE * scale, TILE * scale);
          ctx.fillStyle = CLR.wallEdge;
          ctx.fillRect(px + 3 * scale, py + 3 * scale, TILE * scale - 6 * scale, 6 * scale);
        } else {
          ctx.fillStyle = ((x + y) % 2 === 0) ? CLR.floorA : CLR.floorB;
          ctx.fillRect(px, py, TILE * scale, TILE * scale);
          ctx.strokeStyle = 'rgba(242, 227, 196, 0.05)';
          ctx.lineWidth = 1 * scale;
          ctx.strokeRect(px, py, TILE * scale, TILE * scale);
        }

        if (tile === 'E') {
          ctx.fillStyle = collectedCount >= totalCollectibles ? CLR.door : CLR.doorLocked;
          ctx.fillRect(px + 4 * scale, py + 4 * scale, (TILE - 8) * scale, (TILE - 8) * scale);
          ctx.fillStyle = collectedCount >= totalCollectibles ? CLR.green : CLR.dim;
          ctx.fillRect(px + 11 * scale, py + 11 * scale, 6 * scale, 6 * scale);
        }
      }
    }
  }

  function drawCollectibles() {
    for (var i = 0; i < collectibles.length; i++) {
      var c = collectibles[i];
      if (c.found) continue;
      var cx = (MAZE_X + c.x * TILE + TILE / 2) * scale;
      var cy = (MAZE_Y + c.y * TILE + TILE / 2) * scale;
      ctx.fillStyle = CLR.bright;
      ctx.fillRect(cx - 8 * scale, cy - 8 * scale, 16 * scale, 16 * scale);
      ctx.fillStyle = CLR.panelDeep;
      ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.id === 'a' ? 'W' : (c.id === 'b' ? 'P' : 'C'), cx, cy + 3 * scale);
      ctx.textAlign = 'left';
    }
  }

  function drawPatrols() {
    for (var i = 0; i < patrols.length; i++) {
      var p = patrols[i];
      var px = (MAZE_X + p.x * TILE + TILE / 2) * scale;
      var py = (MAZE_Y + p.y * TILE + TILE / 2) * scale;
      ctx.fillStyle = 'rgba(215, 216, 220, 0.18)';
      ctx.beginPath();
      ctx.arc(px, py, 10 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = CLR.shadow;
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      ctx.fillStyle = CLR.white;
      ctx.fillRect(px - 4 * scale, py - 3 * scale, 2 * scale, 2 * scale);
      ctx.fillRect(px + 2 * scale, py - 3 * scale, 2 * scale, 2 * scale);
    }
  }

  function drawPlayer() {
    var flash = player.invuln > 0 && Math.floor(player.invuln * 10) % 2 === 0;
    if (flash) return;
    var px = (MAZE_X + player.x * TILE + TILE / 2) * scale;
    var py = (MAZE_Y + player.y * TILE + TILE / 2) * scale;
    ctx.fillStyle = CLR.blue;
    ctx.fillRect(px - 8 * scale, py - 7 * scale, 16 * scale, 16 * scale);
    ctx.fillStyle = CLR.white;
    ctx.fillRect(px - 5 * scale, py - 14 * scale, 10 * scale, 5 * scale);
    ctx.fillStyle = CLR.copper;
    ctx.fillRect(px - 9 * scale, py - 9 * scale, 18 * scale, 3 * scale);
  }

  function drawHud() {
    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(12 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText("GRANDFATHER'S MANSION", 28 * scale, 34 * scale);

    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillStyle = CLR.white;
    ctx.fillText('Heirlooms ' + collectedCount + '/' + totalCollectibles, 28 * scale, 52 * scale);
    ctx.fillText('Hits ' + hits, 256 * scale, 52 * scale);
    ctx.fillStyle = timeLeft <= 12 ? CLR.red : CLR.green;
    ctx.fillText('Clock ' + Math.max(0, Math.ceil(timeLeft)), 512 * scale, 52 * scale);

    if (messageTimer > 0 && messageText) {
      ctx.fillStyle = 'rgba(8, 17, 20, 0.94)';
      ctx.fillRect(86 * scale, 360 * scale, 468 * scale, 22 * scale);
      ctx.strokeStyle = CLR.copper;
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(86 * scale, 360 * scale, 468 * scale, 22 * scale);
      ctx.fillStyle = CLR.white;
      ctx.textAlign = 'center';
      ctx.fillText(messageText, 320 * scale, 375 * scale);
      ctx.textAlign = 'left';
    }
  }

  function drawEscHint() {
    ctx.fillStyle = CLR.dim;
    ctx.font = Math.floor(7 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('ESC EXIT', 612 * scale, 388 * scale);
    ctx.textAlign = 'left';
  }

  function drawControlChip(x, y, keyLabel, actionLabel) {
    ctx.fillStyle = CLR.panelDeep;
    ctx.fillRect(x * scale, y * scale, 214 * scale, 42 * scale);
    ctx.strokeStyle = CLR.dim;
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(x * scale, y * scale, 214 * scale, 42 * scale);
    ctx.textAlign = 'left';
    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(7 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(keyLabel, (x + 12) * scale, (y + 16) * scale);
    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(6 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(actionLabel, (x + 12) * scale, (y + 31) * scale);
    ctx.textAlign = 'center';
  }

  function drawInstructions() {
    drawFrame();
    ctx.fillStyle = CLR.panel;
    ctx.fillRect(58 * scale, 40 * scale, 524 * scale, 300 * scale);
    ctx.strokeStyle = CLR.copper;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(58 * scale, 40 * scale, 524 * scale, 300 * scale);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(15 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("GRANDFATHER'S MANSION", 320 * scale, 84 * scale);

    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('FIND THE THREE HEIRLOOMS. THEN BEAT THE STUDY DOOR.', 320 * scale, 124 * scale);

    drawControlChip(88, 154, 'ARROWS / WASD', 'move room to room');
    drawControlChip(338, 154, 'ESC', 'leave town');
    drawControlChip(88, 206, 'SHADOWS', 'each hit costs 6 seconds');
    drawControlChip(338, 206, 'TOUCH', 'tap a side to move');

    ctx.fillStyle = CLR.green;
    ctx.fillText('A CLEAN RUN SHARPENS YOUR HEAD FOR THE CAVE.', 320 * scale, 280 * scale);

    ctx.fillStyle = CLR.bright;
    ctx.fillText('PRESS SPACE OR TAP TO ENTER', 320 * scale, 320 * scale);
    ctx.textAlign = 'left';
    drawEscHint();
  }

  function drawResults() {
    drawFrame();
    ctx.fillStyle = CLR.panel;
    ctx.fillRect(62 * scale, 42 * scale, 516 * scale, 296 * scale);
    ctx.strokeStyle = CLR.copper;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(62 * scale, 42 * scale, 516 * scale, 296 * scale);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(result.label.toUpperCase(), 320 * scale, 82 * scale);
    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(result.summary, 320 * scale, 112 * scale);

    drawResultStat(94, 146, 'HEIRLOOMS', String(result.heirlooms), CLR.bright);
    drawResultStat(344, 146, 'CLOCK', String(result.timeLeft), result.timeLeft > 10 ? CLR.green : CLR.red);
    drawResultStat(94, 220, 'PAY', '$' + result.cash.toFixed(2), CLR.green);
    drawResultStat(344, 220, 'FOCUS', result.focusDays > 0 ? '+' + result.focusDays + 'D' : '--', result.focusDays > 0 ? CLR.blue : CLR.dim);

    ctx.fillStyle = result.hits === 0 ? CLR.green : CLR.red;
    ctx.fillText(result.hits === 0 ? 'NO SHADOW TOUCHES' : ('SHADOW HITS ' + result.hits), 320 * scale, 306 * scale);
    ctx.fillStyle = CLR.bright;
    ctx.fillText('PRESS SPACE OR TAP TO LEAVE', 320 * scale, 340 * scale);
    ctx.textAlign = 'left';
    drawEscHint();
  }

  function drawResultStat(x, y, label, value, color) {
    ctx.fillStyle = CLR.panelDeep;
    ctx.fillRect(x * scale, y * scale, 202 * scale, 56 * scale);
    ctx.strokeStyle = CLR.dim;
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(x * scale, y * scale, 202 * scale, 56 * scale);
    ctx.fillStyle = CLR.dim;
    ctx.font = Math.floor(7 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(label, (x + 12) * scale, (y + 18) * scale);
    ctx.fillStyle = color || CLR.white;
    ctx.font = Math.floor(12 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(value, (x + 12) * scale, (y + 42) * scale);
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
    drawFrame();
    drawMaze();
    drawCollectibles();
    drawPatrols();
    drawPlayer();
    drawHud();
    drawEscHint();
  }

  function abortGame() {
    gameRunning = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    document.removeEventListener('keydown', boundKeyDown);
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
    canvas.removeEventListener('touchstart', boundTouchStart);
    canvas.removeEventListener('mousedown', boundMouseDown);
    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');

    if (callback) {
      setTimeout(function () {
        callback(result || {
          label: 'Turned Around',
          summary: 'The house beats the clock.',
          cash: 0,
          morale: 1,
          focusDays: 0,
          items: {},
          escaped: false,
          heirlooms: collectedCount,
          timeLeft: 0,
          hits: hits
        });
      }, 120);
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

  window.GrandfathersMansionGame = {
    start: function (params, cb) {
      init();
      callback = cb || null;
      resetGame(params || {});

      var screen = document.getElementById('screen');
      if (screen) screen.classList.add('hidden');
      canvas.classList.remove('hidden');

      boundKeyDown = onKeyDown;
      boundTouchStart = onTouchStart;
      boundMouseDown = onMouseDown;

      document.addEventListener('keydown', boundKeyDown);
      canvas.addEventListener('touchstart', boundTouchStart, { passive: false });
      canvas.addEventListener('mousedown', boundMouseDown);

      lastTimestamp = performance.now();
      animFrame = requestAnimationFrame(gameLoop);
    },

    stop: function () {
      if (gamePhase === 'playing') finish(false);
      endGame();
    }
  };
})();
