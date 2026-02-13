/*
 * cards-game.js - Blackjack at The Lantern Tavern
 * The Marvel Cave Mining Company
 *
 * Simple canvas-based blackjack (21) against Red Sullivan.
 */
(function () {
  'use strict';

  var canvas, ctx, scale;
  var animFrame = null;
  var gameRunning = false;
  var gamePhase = 'instructions'; // instructions | playing | dealerTurn | result | final
  var callback = null;
  var params = {};

  var CLR = {
    bg: '#0a0a0a',
    amber: '#d4a055',
    bright: '#f0c070',
    dim: '#8a6830',
    green: '#5cb85c',
    red: '#c0392b',
    yellow: '#f0d060',
    copper: '#b87333',
    felt: '#1a5c2a',
    feltDark: '#0e3d1a',
    cardFace: '#f5f0e0',
    cardBack: '#8b2500',
    white: '#e0d0c0',
    black: '#1a1a1a'
  };

  var CARD_W = 60;
  var CARD_H = 84;
  var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  var SUITS = [
    { symbol: '\u2660', color: '#1a1a1a' },
    { symbol: '\u2665', color: '#c0392b' },
    { symbol: '\u2666', color: '#c0392b' },
    { symbol: '\u2663', color: '#1a1a1a' }
  ];

  var BET = 2;
  var MAX_HANDS = 5;

  var deck = [];
  var playerHand = [];
  var dealerHand = [];
  var dealerHidden = true;
  var playerCash = 0;
  var handsPlayed = 0;
  var handsWon = 0;
  var totalNet = 0;
  var resultText = '';
  var resultColor = CLR.white;
  var dealerTimer = 0;
  var lastTimestamp = 0;

  var keys = {};
  var results = { cash: 0, morale: 0, items: {} };

  function init() {
    canvas = document.getElementById('minigame-canvas');
    ctx = canvas.getContext('2d');
    scale = canvas.width / 640;
  }

  function buildDeck() {
    deck = [];
    for (var s = 0; s < SUITS.length; s++) {
      for (var r = 0; r < RANKS.length; r++) {
        deck.push({ rank: RANKS[r], suit: SUITS[s] });
      }
    }
    // Shuffle
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = deck[i]; deck[i] = deck[j]; deck[j] = tmp;
    }
  }

  function cardValue(card) {
    if (card.rank === 'A') return 11;
    if ('JQK'.indexOf(card.rank) >= 0) return 10;
    return parseInt(card.rank, 10);
  }

  function handTotal(hand) {
    var total = 0;
    var aces = 0;
    for (var i = 0; i < hand.length; i++) {
      var v = cardValue(hand[i]);
      if (v === 11) aces++;
      total += v;
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  }

  function isBlackjack(hand) {
    return hand.length === 2 && handTotal(hand) === 21;
  }

  function dealNewHand() {
    if (deck.length < 15) buildDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    dealerHidden = true;
    resultText = '';
    handsPlayed++;
    gamePhase = 'playing';

    // Check for immediate blackjack
    if (isBlackjack(playerHand)) {
      dealerHidden = false;
      if (isBlackjack(dealerHand)) {
        resolveHand('push');
      } else {
        resolveHand('blackjack');
      }
    }
  }

  function playerHit() {
    if (gamePhase !== 'playing') return;
    playerHand.push(deck.pop());
    if (handTotal(playerHand) > 21) {
      dealerHidden = false;
      resolveHand('bust');
    }
  }

  function playerStand() {
    if (gamePhase !== 'playing') return;
    dealerHidden = false;
    gamePhase = 'dealerTurn';
    dealerTimer = 0;
  }

  function dealerPlay(dt) {
    dealerTimer += dt;
    if (dealerTimer < 0.6) return;
    dealerTimer = 0;

    if (handTotal(dealerHand) < 17) {
      dealerHand.push(deck.pop());
    } else {
      // Dealer stands — resolve
      var pt = handTotal(playerHand);
      var dt2 = handTotal(dealerHand);
      if (dt2 > 21) resolveHand('dealerBust');
      else if (pt > dt2) resolveHand('win');
      else if (pt < dt2) resolveHand('lose');
      else resolveHand('push');
    }
  }

  function resolveHand(outcome) {
    gamePhase = 'result';
    switch (outcome) {
      case 'blackjack':
        resultText = 'Blackjack! +$3';
        resultColor = CLR.yellow;
        totalNet += 3;
        handsWon++;
        break;
      case 'win':
        resultText = 'You win! +$2';
        resultColor = CLR.green;
        totalNet += 2;
        handsWon++;
        break;
      case 'dealerBust':
        resultText = 'Red busts! +$2';
        resultColor = CLR.green;
        totalNet += 2;
        handsWon++;
        break;
      case 'bust':
        resultText = 'Bust! -$2';
        resultColor = CLR.red;
        totalNet -= 2;
        break;
      case 'lose':
        resultText = 'Red wins! -$2';
        resultColor = CLR.red;
        totalNet -= 2;
        break;
      case 'push':
        resultText = 'Push — tie!';
        resultColor = CLR.amber;
        break;
    }
  }

  function nextHandOrEnd() {
    if (handsPlayed >= MAX_HANDS || playerCash + totalNet < BET) {
      showFinal();
    } else {
      dealNewHand();
    }
  }

  function showFinal() {
    gamePhase = 'final';
    var morale = handsWon >= 3 ? 5 : (handsWon >= 1 ? 2 : 0);
    results = { cash: totalNet, morale: morale, items: {} };
  }

  function resetGame(p) {
    params = p || {};
    playerCash = params.playerCash || params.cash || 0;
    gamePhase = 'instructions';
    gameRunning = true;
    keys = {};
    handsPlayed = 0;
    handsWon = 0;
    totalNet = 0;
    resultText = '';
    results = { cash: 0, morale: 0, items: {} };
    lastTimestamp = 0;
    buildDeck();
  }

  // --- INPUT ---

  function handleClick() {
    if (gamePhase === 'instructions') {
      if (playerCash < BET) { endGame(); return; }
      dealNewHand();
      return;
    }
    if (gamePhase === 'result') {
      nextHandOrEnd();
      return;
    }
    if (gamePhase === 'final') {
      endGame();
      return;
    }
  }

  function onKeyDown(e) {
    keys[e.code] = true;

    if (gamePhase === 'instructions') {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (playerCash < BET) { endGame(); return; }
        dealNewHand();
      }
      return;
    }

    if (gamePhase === 'playing') {
      if (e.code === 'KeyH' || e.code === 'Digit1') { playerHit(); }
      if (e.code === 'KeyS' || e.code === 'Digit2') { playerStand(); }
      if (e.code === 'KeyQ') { showFinal(); }
      return;
    }

    if (gamePhase === 'result') {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        nextHandOrEnd();
      }
      if (e.code === 'KeyQ') { showFinal(); }
      return;
    }

    if (gamePhase === 'final') {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        endGame();
      }
      return;
    }
  }

  function onKeyUp(e) { keys[e.code] = false; }

  function onTouchStart(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.changedTouches ? e.changedTouches[0] : e;
    var y = (touch.clientY - rect.top) * (canvas.height / rect.height);

    if (gamePhase === 'playing') {
      // Top half = hit, bottom half = stand
      if (y < canvas.height * 0.5) playerHit();
      else playerStand();
      return;
    }
    handleClick();
  }

  function onMouseDown(e) {
    var rect = canvas.getBoundingClientRect();
    var y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (gamePhase === 'playing') {
      if (y < canvas.height * 0.5) playerHit();
      else playerStand();
      return;
    }
    handleClick();
  }

  // --- RENDERING ---

  function drawFelt() {
    ctx.fillStyle = CLR.feltDark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var p = 15 * scale;
    ctx.fillStyle = CLR.felt;
    ctx.fillRect(p, p, canvas.width - p * 2, canvas.height - p * 2);
    ctx.strokeStyle = CLR.dim;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(p, p, canvas.width - p * 2, canvas.height - p * 2);
  }

  function drawCard(x, y, card, faceDown) {
    var w = CARD_W * scale;
    var h = CARD_H * scale;
    if (faceDown) {
      ctx.fillStyle = CLR.cardBack;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = CLR.copper;
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(x + 3 * scale, y + 3 * scale, w - 6 * scale, h - 6 * scale);
      return;
    }
    ctx.fillStyle = CLR.cardFace;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = CLR.dim;
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = card.suit.color;
    ctx.font = Math.floor(12 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(card.rank, x + 4 * scale, y + 16 * scale);
    ctx.font = Math.floor(16 * scale) + 'px serif';
    ctx.fillText(card.suit.symbol, x + 4 * scale, y + 32 * scale);
    ctx.font = Math.floor(22 * scale) + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.suit.symbol, x + w / 2, y + h / 2 + 8 * scale);
  }

  function drawHand(hand, y, hidden) {
    var totalW = hand.length * (CARD_W + 10) * scale - 10 * scale;
    var startX = (canvas.width - totalW) / 2;
    for (var i = 0; i < hand.length; i++) {
      var x = startX + i * (CARD_W + 10) * scale;
      drawCard(x, y, hand[i], hidden && i === 1);
    }
  }

  function drawTotal(hand, y, hidden) {
    ctx.font = Math.floor(10 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    if (hidden) {
      ctx.fillStyle = CLR.dim;
      ctx.fillText(cardValue(hand[0]) + ' + ?', canvas.width / 2, y);
    } else {
      var t = handTotal(hand);
      ctx.fillStyle = t > 21 ? CLR.red : CLR.white;
      ctx.fillText(String(t), canvas.width / 2, y);
    }
  }

  function drawInstructions() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(16 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BLACKJACK', canvas.width / 2, 40 * scale);

    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('The Lantern Tavern', canvas.width / 2, 62 * scale);

    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillStyle = CLR.white;
    var lines = [
      '$2 per hand  |  Up to 5 hands',
      '',
      'Get closer to 21 than Red',
      'without going over.',
      '',
      'Aces = 1 or 11',
      'Face cards = 10',
      'Blackjack (21 in 2) pays $3',
      '',
      'CONTROLS:',
      'H or 1 .... Hit (draw card)',
      'S or 2 .... Stand (hold)',
      'Q ......... Quit early'
    ];
    for (var i = 0; i < lines.length; i++) {
      ctx.fillStyle = (i === 9) ? CLR.amber : CLR.white;
      ctx.fillText(lines[i], canvas.width / 2, (90 + i * 18) * scale);
    }

    if (playerCash < BET) {
      ctx.fillStyle = CLR.red;
      ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText("Can't afford $2!", canvas.width / 2, 370 * scale);
    } else {
      ctx.fillStyle = CLR.bright;
      ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText('Cash: $' + playerCash, canvas.width / 2, 360 * scale);
      ctx.fillText('Press ENTER to play', canvas.width / 2, 382 * scale);
    }
  }

  function drawPlayingPhase() {
    drawFelt();

    // Dealer
    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("RED'S HAND", canvas.width / 2, 32 * scale);
    drawHand(dealerHand, 40 * scale, dealerHidden);
    drawTotal(dealerHand, 138 * scale, dealerHidden);

    // Player
    ctx.fillStyle = CLR.white;
    ctx.fillText('YOUR HAND', canvas.width / 2, 172 * scale);
    drawHand(playerHand, 180 * scale, false);
    drawTotal(playerHand, 278 * scale, false);

    // HUD
    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Hand ' + handsPlayed + '/' + MAX_HANDS, 25 * scale, 310 * scale);
    ctx.textAlign = 'right';
    ctx.fillStyle = totalNet >= 0 ? CLR.green : CLR.red;
    ctx.fillText('Net: ' + (totalNet >= 0 ? '+' : '') + '$' + totalNet, canvas.width - 25 * scale, 310 * scale);

    // Result overlay
    if (gamePhase === 'result') {
      ctx.fillStyle = resultColor;
      ctx.font = Math.floor(14 * scale) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(resultText, canvas.width / 2, 345 * scale);

      ctx.fillStyle = CLR.bright;
      ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText('ENTER=Next  Q=Quit', canvas.width / 2, 375 * scale);
    }

    // Controls hint during play
    if (gamePhase === 'playing') {
      ctx.fillStyle = CLR.bright;
      ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[H]it    [S]tand    [Q]uit', canvas.width / 2, 345 * scale);
    }

    if (gamePhase === 'dealerTurn') {
      ctx.fillStyle = CLR.amber;
      ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Red is thinking...', canvas.width / 2, 345 * scale);
    }
  }

  function drawFinal() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SESSION OVER', canvas.width / 2, 60 * scale);

    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Hands played: ' + handsPlayed, canvas.width / 2, 120 * scale);
    ctx.fillText('Hands won: ' + handsWon, canvas.width / 2, 145 * scale);

    ctx.fillStyle = totalNet >= 0 ? CLR.green : CLR.red;
    ctx.font = Math.floor(12 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Net: ' + (totalNet >= 0 ? '+$' + totalNet : '-$' + Math.abs(totalNet)), canvas.width / 2, 195 * scale);

    var msg = handsWon >= 3 ? 'Hot streak!' : (handsWon >= 1 ? 'Not bad!' : 'Better luck next time');
    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(msg, canvas.width / 2, 240 * scale);

    if (results.morale > 0) {
      ctx.fillStyle = CLR.yellow;
      ctx.fillText('Morale: +' + results.morale, canvas.width / 2, 270 * scale);
    }

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to leave', canvas.width / 2, 340 * scale);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gamePhase === 'instructions') { drawInstructions(); return; }
    if (gamePhase === 'final') { drawFinal(); return; }
    drawPlayingPhase();
  }

  function update(dt) {
    if (gamePhase === 'dealerTurn') {
      dealerPlay(dt);
    }
  }

  function endGame() {
    gameRunning = false;
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');
    setTimeout(function () { if (callback) callback(results); }, 1000);
  }

  function gameLoop(timestamp) {
    if (!gameRunning) return;
    var dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;
    update(dt);
    render();
    animFrame = requestAnimationFrame(gameLoop);
  }

  window.CardsGame = {
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
      canvas.addEventListener('mousedown', onMouseDown);
      lastTimestamp = performance.now();
      animFrame = requestAnimationFrame(gameLoop);
    },
    stop: function () {
      if (gamePhase !== 'final') showFinal();
      endGame();
    }
  };
})();
