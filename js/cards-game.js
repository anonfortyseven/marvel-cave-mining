/*
 * cards-game.js - Cave Draw Card Game
 * The Marvel Cave Mining Company
 *
 * Canvas-based 3-card poker variant at The Lantern Tavern.
 * "Cave Draw" - a card game popular among the miners.
 */
(function () {
  'use strict';

  var canvas, ctx, scale;
  var animFrame = null;
  var gameRunning = false;
  var gamePhase = 'instructions'; // instructions | betting | selecting | revealing | roundResult | finalResults
  var callback = null;
  var params = {};

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
    felt: '#1a5c2a',
    feltDark: '#0e3d1a',
    cardFace: '#f5f0e0',
    cardBack: '#8b2500',
    white: '#e0d0c0',
    black: '#1a1a1a'
  };

  // Card constants
  var CARD_W = 80;
  var CARD_H = 110;
  var RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  var RANK_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  var SUITS = [
    { name: 'Spades', symbol: '\u2660', color: CLR.black },
    { name: 'Hearts', symbol: '\u2665', color: CLR.red },
    { name: 'Diamonds', symbol: '\u2666', color: CLR.red },
    { name: 'Clubs', symbol: '\u2663', color: CLR.black }
  ];

  // Entry fee
  var ENTRY_FEE = 2;
  var MAX_ROUNDS = 3;

  // Game state
  var deck = [];
  var playerHand = [];
  var houseHand = [];
  var selectedCards = []; // indices of selected player cards (0-2)
  var round = 0;
  var totalWinnings = 0;
  var roundsWon = 0;
  var playerCash = 0;

  // Animation
  var revealTimer = 0;
  var revealIndex = 0;
  var houseRevealed = [false, false, false];
  var flipAnimations = [0, 0, 0]; // 0 = face-down, 1 = face-up, 0.5 = mid-flip
  var resultDelay = 0;
  var roundResultText = '';
  var roundResultColor = CLR.white;
  var lastTimestamp = 0;

  // Touch / click state
  var drawButtonRect = { x: 0, y: 0, w: 0, h: 0 };

  // Keys
  var keys = {};

  // Results
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
        deck.push({ rank: RANKS[r], suit: SUITS[s], value: RANK_VALUES[RANKS[r]] });
      }
    }
    // Shuffle
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }
  }

  function dealCards() {
    buildDeck();
    playerHand = [deck.pop(), deck.pop(), deck.pop()];
    houseHand = [deck.pop(), deck.pop(), deck.pop()];
    selectedCards = [];
    houseRevealed = [false, false, false];
    flipAnimations = [0, 0, 0];
    revealTimer = 0;
    revealIndex = 0;
    resultDelay = 0;
    roundResultText = '';
  }

  function evaluateHand(hand) {
    var sorted = hand.slice().sort(function (a, b) { return a.value - b.value; });
    var v0 = sorted[0].value;
    var v1 = sorted[1].value;
    var v2 = sorted[2].value;

    // Three of a kind
    if (v0 === v1 && v1 === v2) {
      return { rank: 4, name: 'Three of a Kind', high: v2 };
    }

    // Straight (3 consecutive)
    var isStraight = (v2 - v1 === 1 && v1 - v0 === 1);
    // Ace-low straight: A-2-3
    var aceLow = (v0 === 2 && v1 === 3 && v2 === 14);
    if (isStraight || aceLow) {
      return { rank: 3, name: 'Straight', high: aceLow ? 3 : v2 };
    }

    // Pair
    if (v0 === v1 || v1 === v2 || v0 === v2) {
      var pairVal = v0 === v1 ? v0 : (v1 === v2 ? v1 : v0);
      return { rank: 2, name: 'Pair', high: pairVal };
    }

    // High card
    return { rank: 1, name: 'High Card', high: v2 };
  }

  function compareHands() {
    var ph = evaluateHand(playerHand);
    var hh = evaluateHand(houseHand);

    if (ph.rank > hh.rank) return 1;
    if (ph.rank < hh.rank) return -1;
    if (ph.high > hh.high) return 1;
    if (ph.high < hh.high) return -1;
    return 0;
  }

  function doSwap() {
    for (var i = 0; i < selectedCards.length; i++) {
      var idx = selectedCards[i];
      if (deck.length > 0) {
        playerHand[idx] = deck.pop();
      }
    }
    selectedCards = [];
  }

  function startReveal() {
    gamePhase = 'revealing';
    revealIndex = 0;
    revealTimer = 0;
  }

  function resolveRound() {
    var result = compareHands();
    if (result > 0) {
      roundsWon++;
      totalWinnings += 4; // $4 payout
      roundResultText = 'You win! +$4';
      roundResultColor = CLR.green;
    } else if (result < 0) {
      roundResultText = 'Red Sullivan wins!';
      roundResultColor = CLR.red;
    } else {
      totalWinnings += 2; // money back
      roundResultText = 'Tie! $2 returned';
      roundResultColor = CLR.yellow;
    }
    gamePhase = 'roundResult';
    resultDelay = 0;
  }

  function nextRound() {
    round++;
    if (round >= MAX_ROUNDS || playerCash + totalWinnings - (round + 1) * ENTRY_FEE < 0) {
      showFinalResults();
      return;
    }
    // Check if player can afford next entry
    var currentCash = playerCash + totalWinnings - round * ENTRY_FEE;
    if (currentCash < ENTRY_FEE) {
      showFinalResults();
      return;
    }
    dealCards();
    gamePhase = 'selecting';
  }

  function quitGame() {
    showFinalResults();
  }

  function showFinalResults() {
    gamePhase = 'finalResults';

    var netCash = totalWinnings - round * ENTRY_FEE;
    var morale = 0;
    if (roundsWon >= 2) {
      morale = 5;
    } else if (roundsWon === 1) {
      morale = 2;
    }

    results = { cash: netCash, morale: morale, items: {} };
  }

  function resetGame(p) {
    params = p || {};
    playerCash = params.playerCash || params.cash || 0;
    gamePhase = 'instructions';
    gameRunning = true;
    keys = {};
    round = 0;
    totalWinnings = 0;
    roundsWon = 0;
    results = { cash: 0, morale: 0, items: {} };
    lastTimestamp = 0;
  }

  function toggleCardSelection(idx) {
    if (gamePhase !== 'selecting') return;
    if (idx < 0 || idx > 2) return;

    var pos = selectedCards.indexOf(idx);
    if (pos >= 0) {
      selectedCards.splice(pos, 1);
    } else if (selectedCards.length < 2) {
      selectedCards.push(idx);
    }
  }

  function getCardX(idx, isHouse) {
    var startX = (canvas.width - (3 * CARD_W * scale + 2 * 20 * scale)) / 2;
    return startX + idx * (CARD_W + 20) * scale;
  }

  function getCardY(idx, isHouse) {
    if (isHouse) return 40 * scale;
    var baseY = 240 * scale;
    if (selectedCards.indexOf(idx) >= 0) {
      baseY -= 12 * scale;
    }
    return baseY;
  }

  function getTouchPos(e) {
    var rect = canvas.getBoundingClientRect();
    var touch = e.changedTouches ? e.changedTouches[0] : e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function handleClick(pos) {
    if (gamePhase === 'instructions') {
      if (playerCash < ENTRY_FEE) {
        endGame();
        return;
      }
      round = 1;
      dealCards();
      gamePhase = 'selecting';
      lastTimestamp = performance.now();
      return;
    }

    if (gamePhase === 'selecting') {
      // Check if a player card was tapped
      for (var i = 0; i < 3; i++) {
        var cx = getCardX(i, false);
        var cy = getCardY(i, false);
        if (pos.x >= cx && pos.x <= cx + CARD_W * scale &&
            pos.y >= cy && pos.y <= cy + CARD_H * scale) {
          toggleCardSelection(i);
          return;
        }
      }

      // Check draw button
      if (pos.x >= drawButtonRect.x && pos.x <= drawButtonRect.x + drawButtonRect.w &&
          pos.y >= drawButtonRect.y && pos.y <= drawButtonRect.y + drawButtonRect.h) {
        doSwap();
        startReveal();
        return;
      }
      return;
    }

    if (gamePhase === 'roundResult') {
      if (resultDelay > 1.0) {
        nextRound();
      }
      return;
    }

    if (gamePhase === 'finalResults') {
      endGame();
      return;
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    var pos = getTouchPos(e);
    handleClick(pos);
  }

  function onMouseDown(e) {
    var pos = getTouchPos(e);
    handleClick(pos);
  }

  function onKeyDown(e) {
    keys[e.code] = true;

    if (gamePhase === 'instructions' && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      if (playerCash < ENTRY_FEE) {
        endGame();
        return;
      }
      round = 1;
      dealCards();
      gamePhase = 'selecting';
      lastTimestamp = performance.now();
      return;
    }

    if (gamePhase === 'selecting') {
      if (e.code === 'Digit1' || e.code === 'Numpad1') toggleCardSelection(0);
      if (e.code === 'Digit2' || e.code === 'Numpad2') toggleCardSelection(1);
      if (e.code === 'Digit3' || e.code === 'Numpad3') toggleCardSelection(2);
      if (e.code === 'Enter' || e.code === 'KeyD') {
        e.preventDefault();
        doSwap();
        startReveal();
      }
      if (e.code === 'KeyQ') {
        quitGame();
      }
      return;
    }

    if (gamePhase === 'roundResult' && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      if (resultDelay > 1.0) {
        nextRound();
      }
      return;
    }

    if (gamePhase === 'roundResult' && e.code === 'KeyQ') {
      quitGame();
      return;
    }

    if (gamePhase === 'finalResults' && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      endGame();
      return;
    }
  }

  function onKeyUp(e) {
    keys[e.code] = false;
  }

  function update(dt) {
    if (gamePhase === 'revealing') {
      revealTimer += dt;
      // Reveal one card every 0.5 seconds
      if (revealTimer > 0.5 && revealIndex < 3) {
        if (flipAnimations[revealIndex] < 1) {
          flipAnimations[revealIndex] += dt * 4;
          if (flipAnimations[revealIndex] >= 0.5 && !houseRevealed[revealIndex]) {
            houseRevealed[revealIndex] = true;
          }
          if (flipAnimations[revealIndex] >= 1) {
            flipAnimations[revealIndex] = 1;
            revealIndex++;
            revealTimer = 0;
          }
        }
      }
      // All revealed
      if (revealIndex >= 3) {
        resolveRound();
      }
    }

    if (gamePhase === 'roundResult') {
      resultDelay += dt;
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
    canvas.removeEventListener('mousedown', onMouseDown);

    canvas.classList.add('hidden');
    var screen = document.getElementById('screen');
    if (screen) screen.classList.remove('hidden');

    setTimeout(function () {
      if (callback) callback(results);
    }, 1000);
  }

  // ------- RENDERING -------

  function drawFeltTable() {
    ctx.fillStyle = CLR.feltDark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Felt surface
    ctx.fillStyle = CLR.felt;
    var pad = 20 * scale;
    ctx.fillRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);

    // Subtle felt texture dots
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (var i = 0; i < 60; i++) {
      var dx = pad + Math.random() * (canvas.width - pad * 2);
      var dy = pad + Math.random() * (canvas.height - pad * 2);
      ctx.fillRect(dx, dy, 2 * scale, 2 * scale);
    }

    // Border line
    ctx.strokeStyle = CLR.dim;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);
  }

  function drawCardFace(x, y, card) {
    var w = CARD_W * scale;
    var h = CARD_H * scale;

    // Card background
    ctx.fillStyle = CLR.cardFace;
    ctx.fillRect(x, y, w, h);

    // Card border
    ctx.strokeStyle = CLR.dim;
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeRect(x, y, w, h);

    // Rank and suit
    ctx.fillStyle = card.suit.color;
    ctx.font = Math.floor(14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(card.rank, x + 5 * scale, y + 18 * scale);

    ctx.font = Math.floor(18 * scale) + 'px serif';
    ctx.fillText(card.suit.symbol, x + 5 * scale, y + 36 * scale);

    // Center symbol
    ctx.font = Math.floor(28 * scale) + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.suit.symbol, x + w / 2, y + h / 2 + 8 * scale);

    // Bottom rank (inverted)
    ctx.font = Math.floor(14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(card.rank, x + w - 5 * scale, y + h - 8 * scale);
  }

  function drawCardBack(x, y) {
    var w = CARD_W * scale;
    var h = CARD_H * scale;

    ctx.fillStyle = CLR.cardBack;
    ctx.fillRect(x, y, w, h);

    // Cross-hatch pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    var step = 8 * scale;
    for (var i = -h; i < w + h; i += step) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i + h, y + h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + i + h, y);
      ctx.lineTo(x + i, y + h);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = CLR.copper;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(x + 3 * scale, y + 3 * scale, w - 6 * scale, h - 6 * scale);
  }

  function drawCardWithFlip(x, y, card, flipProgress) {
    var w = CARD_W * scale;
    var h = CARD_H * scale;

    // Flip animation: scale width based on progress
    var absProgress;
    var showFace;
    if (flipProgress <= 0.5) {
      absProgress = 1 - flipProgress * 2; // 1 -> 0
      showFace = false;
    } else {
      absProgress = (flipProgress - 0.5) * 2; // 0 -> 1
      showFace = true;
    }

    var drawW = w * absProgress;
    var drawX = x + (w - drawW) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(drawX, y, drawW, h);
    ctx.clip();

    if (showFace) {
      drawCardFace(drawX, y, card);
    } else {
      drawCardBack(drawX, y);
    }
    ctx.restore();
  }

  function drawPlayerCards() {
    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOUR HAND', canvas.width / 2, 232 * scale);

    for (var i = 0; i < playerHand.length; i++) {
      var cx = getCardX(i, false);
      var cy = getCardY(i, false);

      // Selection highlight
      if (selectedCards.indexOf(i) >= 0) {
        ctx.strokeStyle = CLR.yellow;
        ctx.lineWidth = 3 * scale;
        ctx.strokeRect(cx - 3 * scale, cy - 3 * scale,
          CARD_W * scale + 6 * scale, CARD_H * scale + 6 * scale);
      }

      drawCardFace(cx, cy, playerHand[i]);

      // Card number label
      ctx.fillStyle = CLR.dim;
      ctx.font = Math.floor(7 * scale) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[' + (i + 1) + ']', cx + CARD_W * scale / 2, cy + CARD_H * scale + 14 * scale);
    }
  }

  function drawHouseCards() {
    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("RED'S HAND", canvas.width / 2, 32 * scale);

    for (var i = 0; i < houseHand.length; i++) {
      var cx = getCardX(i, true);
      var cy = getCardY(i, true);

      if (gamePhase === 'revealing' || gamePhase === 'roundResult' || gamePhase === 'finalResults') {
        drawCardWithFlip(cx, cy, houseHand[i], flipAnimations[i]);
      } else {
        drawCardBack(cx, cy);
      }
    }
  }

  function drawDrawButton() {
    var bw = 120 * scale;
    var bh = 30 * scale;
    var bx = (canvas.width - bw) / 2;
    var by = 375 * scale;

    drawButtonRect = { x: bx, y: by, w: bw, h: bh };

    ctx.fillStyle = CLR.copper;
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = CLR.bright;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = CLR.white;
    ctx.font = Math.floor(10 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DRAW', canvas.width / 2, by + 20 * scale);
  }

  function drawGameHUD() {
    // Round counter
    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Hand ' + round + '/' + MAX_ROUNDS, 30 * scale, 195 * scale);

    // Winnings
    ctx.textAlign = 'right';
    var net = totalWinnings - round * ENTRY_FEE;
    ctx.fillStyle = net >= 0 ? CLR.green : CLR.red;
    ctx.fillText('Net: $' + net, (canvas.width - 30 * scale), 195 * scale);

    // Hand evaluation
    if (playerHand.length === 3) {
      var handEval = evaluateHand(playerHand);
      ctx.fillStyle = CLR.yellow;
      ctx.textAlign = 'center';
      ctx.fillText(handEval.name, canvas.width / 2, 195 * scale);
    }
  }

  function drawInstructions() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(16 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CAVE DRAW', canvas.width / 2, 40 * scale);

    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('The Lantern Tavern', canvas.width / 2, 62 * scale);

    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillStyle = CLR.white;

    var lines = [
      '$2 entry per hand (up to 3)',
      '',
      'RULES:',
      '3 cards dealt to you and',
      'Red Sullivan. Swap 0-2 of',
      'your cards, then compare.',
      '',
      'HAND RANKS (best to worst):',
      ' Three of a Kind',
      ' Straight (3 in a row)',
      ' Pair',
      ' High Card',
      '',
      'CONTROLS:',
      '1-3 .. Select cards to swap',
      'ENTER/D .. Draw (swap cards)',
      'Q ........ Quit early'
    ];

    for (var i = 0; i < lines.length; i++) {
      ctx.fillStyle = (i === 2 || i === 7 || i === 13) ? CLR.amber : CLR.white;
      ctx.fillText(lines[i], canvas.width / 2, (85 + i * 16) * scale);
    }

    if (playerCash < ENTRY_FEE) {
      ctx.fillStyle = CLR.red;
      ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText("You can't afford $2!", canvas.width / 2, 370 * scale);
      ctx.fillText('Press ENTER to leave', canvas.width / 2, 388 * scale);
    } else {
      ctx.fillStyle = CLR.bright;
      ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText('Your cash: $' + playerCash, canvas.width / 2, 365 * scale);
      ctx.fillText('Press ENTER or tap to play', canvas.width / 2, 388 * scale);
    }
  }

  function drawSelectingPhase() {
    drawFeltTable();
    drawHouseCards();
    drawPlayerCards();
    drawDrawButton();
    drawGameHUD();

    // Instruction text
    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(7 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SELECT cards to swap, then DRAW', canvas.width / 2, 213 * scale);
  }

  function drawRevealPhase() {
    drawFeltTable();
    drawHouseCards();
    drawPlayerCards();
    drawGameHUD();

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Revealing...', canvas.width / 2, 213 * scale);
  }

  function drawRoundResult() {
    drawFeltTable();
    drawHouseCards();
    drawPlayerCards();
    drawGameHUD();

    // Result text
    ctx.fillStyle = roundResultColor;
    ctx.font = Math.floor(12 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(roundResultText, canvas.width / 2, 213 * scale);

    // Show hand names
    var ph = evaluateHand(playerHand);
    var hh = evaluateHand(houseHand);
    ctx.fillStyle = CLR.dim;
    ctx.font = Math.floor(7 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('You: ' + ph.name + '  |  Red: ' + hh.name, canvas.width / 2, 385 * scale);

    if (resultDelay > 1.0) {
      ctx.fillStyle = CLR.bright;
      ctx.font = Math.floor(8 * scale) + 'px "Press Start 2P", monospace';
      ctx.fillText('ENTER=Next  Q=Quit', canvas.width / 2, 370 * scale);
    }
  }

  function drawFinalResults() {
    ctx.fillStyle = CLR.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(14 * scale) + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, 60 * scale);

    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Hands played: ' + round, canvas.width / 2, 110 * scale);
    ctx.fillText('Hands won: ' + roundsWon, canvas.width / 2, 135 * scale);

    var net = results.cash;
    ctx.fillStyle = net >= 0 ? CLR.green : CLR.red;
    ctx.font = Math.floor(11 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Net: ' + (net >= 0 ? '+$' + net : '-$' + Math.abs(net)), canvas.width / 2, 180 * scale);

    // Morale
    var moraleText;
    if (roundsWon >= 2) {
      moraleText = 'Lucky hand!';
    } else if (roundsWon === 1) {
      moraleText = 'Not bad!';
    } else {
      moraleText = 'Better luck next time';
    }

    ctx.fillStyle = CLR.amber;
    ctx.font = Math.floor(10 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText(moraleText, canvas.width / 2, 230 * scale);

    if (results.morale > 0) {
      ctx.fillStyle = CLR.yellow;
      ctx.fillText('Morale: +' + results.morale, canvas.width / 2, 260 * scale);
    }

    ctx.fillStyle = CLR.bright;
    ctx.font = Math.floor(9 * scale) + 'px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER or tap', canvas.width / 2, 330 * scale);
    ctx.fillText('to leave the tavern', canvas.width / 2, 350 * scale);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gamePhase === 'instructions') {
      drawInstructions();
      return;
    }
    if (gamePhase === 'selecting') {
      drawSelectingPhase();
      return;
    }
    if (gamePhase === 'revealing') {
      drawRevealPhase();
      return;
    }
    if (gamePhase === 'roundResult') {
      drawRoundResult();
      return;
    }
    if (gamePhase === 'finalResults') {
      drawFinalResults();
      return;
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
      if (gamePhase !== 'finalResults') {
        showFinalResults();
      }
      endGame();
    }
  };
})();
