/* ============================================
   Store.js - General Store (Marmaros Outfitters)
   The Marvel Cave Mining Company
   ============================================ */

(function () {
  'use strict';

  var STORE_ASCII = [
    '     _____________________________',
    '    |  MARMAROS OUTFITTERS        |',
    '    |  ___   ___   ___   ___      |',
    '    | |___| |___| |___| |___|     |',
    '    | |   | |   | |   | |   |     |',
    '    |_|___|_|___|_|___|_|___|_____|',
    '       |                     |',
    '    ===|=====================|===',
    '       |   General Store     |',
    '    ===|=====================|===',
  ].join('\n');

  // Store categories mapped to GameState flat properties
  var CATEGORIES = [
    {
      key: 'food',
      stateKey: 'food',
      name: 'Food & Water',
      unit: 'pounds',
      price: 0.08,
      description: 'Salt pork, hardtack, coffee, and cask water. Cheap enough to buy, deadly to skip.',
      recommended: { mine_foreman: 110, geologist: 100, farmer: 96, drifter: 88 },
      min: 0,
      max: 1200
    },
    {
      key: 'lanternOil',
      stateKey: 'lanternOil',
      name: 'Lantern Oil',
      unit: 'gallons',
      price: 0.25,
      description: 'Lamp oil for long shifts under stone. No flame, no crew.',
      recommended: { mine_foreman: 8, geologist: 7, farmer: 6, drifter: 5 },
      min: 0,
      max: 40
    },
    {
      key: 'rope',
      stateKey: 'rope',
      name: 'Rope',
      unit: 'feet',
      price: 0.02,
      description: 'Manila hemp. Every deeper chamber spends it twice: down and back out.',
      recommended: { mine_foreman: 240, geologist: 220, farmer: 200, drifter: 180 },
      min: 0,
      max: 1000
    }
  ];

  var currentCategory = 0;
  var cart = {};
  var onCompleteCallback = null;

  function initCart() {
    cart = {};
    for (var i = 0; i < CATEGORIES.length; i++) {
      cart[CATEGORIES[i].key] = 0;
    }
    currentCategory = 0;
  }

  function getStartingCash() {
    if (window.GameState && window.GameState.state) {
      return window.GameState.state.cash || 0;
    }
    return 120;
  }

  function getProfession() {
    if (window.GameState && window.GameState.state) {
      return window.GameState.state.profession || 'mine_foreman';
    }
    return 'mine_foreman';
  }

  function getDoctrine() {
    var state = window.GameState && window.GameState.state ? window.GameState.state : null;
    return window.Expedition && state ? window.Expedition.getDoctrine(state.expedition && state.expedition.doctrine) : null;
  }

  function getSharePercent() {
    var state = window.GameState && window.GameState.state ? window.GameState.state : null;
    var share = window.Economy && window.Economy.getMinerShareRate ? window.Economy.getMinerShareRate(state) : 0.10;
    return Math.round(share * 100);
  }

  function getRecommendedQuantity(cat, prof) {
    var rec = (cat.recommended[prof] !== undefined) ? cat.recommended[prof] : 0;
    var doctrine = getDoctrine();
    if (!doctrine) return rec;
    if (doctrine.id === 'crew_first') {
      if (cat.key === 'food') rec = Math.round(rec * 1.15);
      if (cat.key === 'lanternOil') rec = Math.round(rec * 1.1);
    } else if (doctrine.id === 'profit_first') {
      if (cat.key === 'food') rec = Math.round(rec * 0.85);
      if (cat.key === 'rope') rec = Math.round(rec * 1.05);
    } else if (doctrine.id === 'deep_chase') {
      if (cat.key === 'rope') rec = Math.round(rec * 1.18);
      if (cat.key === 'lanternOil') rec = Math.round(rec * 1.08);
    }
    return rec;
  }

  function clampQty(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function buildPresets(cat, rec, maxAfford) {
    var maxAllowed = Math.min(cat.max, maxAfford);
    var safe = clampQty(rec, cat.min, maxAllowed);
    var lean = clampQty(Math.round(rec * 0.75), cat.min, maxAllowed);
    var heavy = clampQty(Math.round(rec * 1.25), cat.min, maxAllowed);
    return [
      { label: 'Lean', value: lean },
      { label: 'Safe', value: safe },
      { label: 'Heavy', value: heavy }
    ];
  }

  function getRecommendationText(cat, rec, state) {
    var partySize = 0;
    if (state) {
      if (state.foreman && state.foreman.alive) partySize++;
      for (var i = 0; i < (state.crew || []).length; i++) {
        if (state.crew[i].alive) partySize++;
      }
    }
    if (!partySize) partySize = 3;

    if (cat.key === 'food') {
      var foodDays = Math.max(1, Math.floor(rec / (partySize * 2.4)));
      return 'About ' + foodDays + ' days safe.';
    }
    if (cat.key === 'lanternOil') {
      var shifts = Math.max(1, Math.floor(rec / 0.5));
      return 'About ' + shifts + ' shifts safe.';
    }
    if (cat.key === 'rope') {
      var drops = Math.max(1, Math.floor(rec / 20));
      return 'About ' + drops + ' drops safe.';
    }
    return 'Recommended load.';
  }

  function getCartTotal() {
    var total = 0;
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      total += (cart[cat.key] || 0) * cat.price;
    }
    return Math.round(total * 100) / 100;
  }

  function getRemainingCash() {
    return Math.round((getStartingCash() - getCartTotal()) * 100) / 100;
  }

  function getSummaryReadinessLine() {
    var state = window.GameState && window.GameState.state ? window.GameState.state : null;
    var partySize = 0;
    if (state) {
      if (state.foreman && state.foreman.alive) partySize++;
      for (var i = 0; i < (state.crew || []).length; i++) {
        if (state.crew[i].alive) partySize++;
      }
    }
    if (!partySize) partySize = 3;
    var foodDays = Math.max(1, Math.floor((cart.food || 0) / (partySize * 2.4)));
    var oilShifts = Math.max(1, Math.floor((cart.lanternOil || 0) / 0.5));
    var ropeDrops = Math.max(1, Math.floor((cart.rope || 0) / 20));
    var daysBelow = Math.max(1, Math.min(foodDays, oilShifts, ropeDrops));
    return 'Safe for about ' + daysBelow + ' days below.';
  }

  function packRecommendedCart() {
    initCart();
    var prof = getProfession();
    var remainingCash = getStartingCash();
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      var rec = getRecommendedQuantity(cat, prof);
      var maxAfford = cat.price > 0 ? Math.floor(remainingCash / cat.price) : cat.max;
      maxAfford = Math.max(0, Math.min(cat.max, maxAfford));
      var qty = clampQty(rec, cat.min, maxAfford);
      cart[cat.key] = qty;
      remainingCash = Math.round((remainingCash - (qty * cat.price)) * 100) / 100;
    }
  }

  // Show the store intro
  function showStoreIntro(callback) {
    onCompleteCallback = callback;
    initCart();
    if (window.Audio_Manager) Audio_Manager.stop(1800);

    var state = window.GameState && window.GameState.state ? window.GameState.state : null;
    var voice = window.NarrativeCast && window.NarrativeCast.getShopVoice ? window.NarrativeCast.getShopVoice('general_store', state) : null;
    var shopLine = voice && voice.line ? voice.line : '"Take what keeps the line standing and sign for it cleanly."';

    var html = '<div class="readable-screen readable-screen--narrow"><div class="readable-frame shop-screen shop-screen--general_store">';
    html += '<div class="native-art-panel native-art-panel--shop">';
    html += '<pre class="title-art title-art--shop">' + UI.escapeHtml(STORE_ASCII) + '</pre>\n';
    html += '</div>';
    html += '<div class="readable-header">';
    html += '<div class="readable-kicker">Company Supply</div>';
    html += '<div class="readable-title text-glow">Company Office & Outfitters</div>';
    html += '<hr class="separator-double">';
    html += '<div class="readable-lead">' + UI.escapeHtml(shopLine) + '</div>';
    html += '<div class="selection-meta-row">';
    html += '<div class="selection-meta-pill">Cash ' + UI.formatMoney(getStartingCash()) + '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div></div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Pack the Safe Load', value: 'safe', description: 'Fastest way underground.', tone: 'featured', badge: 'BEST START' },
      { key: '2', label: 'Choose Each Supply', value: 'custom', description: 'Pack it yourself.', tone: 'subtle' }
    ], function (value) {
      if (value === 'safe') {
        packRecommendedCart();
        showSummary();
        return;
      }
      showCategory(0);
    }, {
      compact: true
    });
  }

  // Show a single category for purchasing
  function showCategory(index) {
    currentCategory = index;
    var cat = CATEGORIES[index];
    var prof = getProfession();
    var rec = getRecommendedQuantity(cat, prof);
    var remaining = getRemainingCash();
    var unitSingular = cat.unit.replace(/s$/, '');
    var maxAfford = cat.price > 0 ? Math.floor(remaining / cat.price) : 0;
    if (maxAfford > cat.max) maxAfford = cat.max;
    if (maxAfford < 0) maxAfford = 0;
    var state = window.GameState && window.GameState.state ? window.GameState.state : null;
    var presets = buildPresets(cat, rec, maxAfford);
    var recommendationText = getRecommendationText(cat, rec, state);

    var html = '<div class="readable-screen readable-screen--narrow">';
    html += '<div class="readable-kicker">Outfitting ' + (index + 1) + ' of ' + CATEGORIES.length + '</div>';
    html += '<div class="readable-title text-glow">' + cat.name + '</div>';
    html += '<hr class="separator-double">';
    html += '<div class="readable-lead">' + UI.escapeHtml(cat.description) + '</div>';
    html += '<div class="readable-note">' + UI.escapeHtml(UI.formatMoney(cat.price) + ' / ' + unitSingular + ' • ' + UI.formatMoney(remaining) + ' cash • up to ' + maxAfford + ' ' + cat.unit) + '</div>';
    html += '</div>';

    UI.render(html);

    var defaultVal = rec <= maxAfford ? rec : maxAfford;
    UI.promptQuantity({
      label: 'How many ' + cat.unit + '?',
      unit: cat.unit,
      min: cat.min,
      max: Math.min(cat.max, maxAfford),
      defaultValue: defaultVal,
      step: cat.key === 'lanternOil' ? 1 : 1,
      pricePerUnit: cat.price,
      startingCash: getStartingCash(),
      currentCartTotal: getCartTotal() - ((cart[cat.key] || 0) * cat.price),
      currentInCart: cart[cat.key] || 0,
      recommended: rec,
      recommendationText: recommendationText,
      presets: presets,
      hideCurrentInCart: true
    }, function (val) {
      if (val > maxAfford) {
        val = maxAfford;
        UI.showNotification('Your purse says ' + val + '. No credit.', 1500);
      }
      if (val > cat.max) val = cat.max;
      cart[cat.key] = val;

      if (currentCategory < CATEGORIES.length - 1) {
        showCategory(currentCategory + 1);
      } else {
        showSummary();
      }
    });
  }

  // Show purchase summary
  function showSummary() {
    var total = getCartTotal();
    var remaining = getStartingCash() - total;

    var html = '<div class="readable-screen readable-screen--narrow">';
    html += '<div class="readable-kicker text-center">Final check</div>';
    html += '<div class="readable-title text-glow text-center" style="margin-bottom:8px">Purchase Summary</div>';
    html += '<hr class="separator-double">';

    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      var qty = cart[cat.key] || 0;
      if (qty <= 0) continue;
      html += '<div class="store-item">';
      html += '<span>' + cat.name + '</span>';
      html += '<span class="store-price">' + qty + ' ' + cat.unit + '</span>';
      html += '</div>';
    }

    html += '<hr class="separator-double">';
    html += '<div class="store-item"><span class="text-bright">Total:</span>';
    html += '<span class="store-total">' + UI.formatMoney(total) + '</span></div>';
    html += '<div class="store-item"><span>Cash left:</span>';
    html += '<span class="text-yellow">' + UI.formatMoney(remaining) + '</span></div>';
    html += '<div class="readable-note text-center" style="margin-top:10px">' + UI.escapeHtml(getSummaryReadinessLine()) + '</div>';
    html += '<div style="margin-top:10px"></div>';
    html += '</div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Take the load to the Den', value: 'accept' },
      { key: '2', label: 'Pack again', value: 'redo' },
    ], function (val) {
      if (val === 'accept') {
        applyPurchases();
        UI.showNotification('Campbell closes the ledger. "Bring the sacks back heavy."', 1200);
        setTimeout(function () {
          if (onCompleteCallback) onCompleteCallback();
        }, 1300);
      } else {
        initCart();
        showCategory(0);
      }
    });
  }

  // Apply purchased items to game state (flat properties)
  function applyPurchases() {
    if (!window.GameState || !window.GameState.state) return;

    var state = window.GameState.state;
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      var qty = cart[cat.key] || 0;
      state[cat.stateKey] = (state[cat.stateKey] || 0) + qty;
    }
    state.cash = getRemainingCash();
    state.totalExpenses = (state.totalExpenses || 0) + getCartTotal();

    if (window.GameState.save) {
      window.GameState.save();
    }
  }

  // --- Public API ---
  window.Store = {
    show: showStoreIntro,
    CATEGORIES: CATEGORIES,
    getCart: function () { return cart; },
    getCartTotal: getCartTotal
  };

})();
