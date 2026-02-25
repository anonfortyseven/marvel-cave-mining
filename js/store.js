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
      name: 'Food Rations',
      unit: 'pounds',
      price: 0.20,
      description: 'Salt pork, hardtack, parched corn, and coffee black as perdition',
      recommended: { mine_foreman: 200, geologist: 150, farmer: 120, drifter: 80 },
      min: 0,
      max: 2000
    },
    {
      key: 'lanternOil',
      stateKey: 'lanternOil',
      name: 'Lantern Oil',
      unit: 'gallons',
      price: 3.00,
      description: 'Whale oil for the lamps. Two days per gallon if you\'re careful. You won\'t be.',
      recommended: { mine_foreman: 10, geologist: 8, farmer: 6, drifter: 4 },
      min: 0,
      max: 100
    },
    {
      key: 'rope',
      stateKey: 'rope',
      name: 'Rope',
      unit: 'feet',
      price: 0.10,
      description: 'Manila hemp, three-strand. The only thing between your men and the dark.',
      recommended: { mine_foreman: 300, geologist: 250, farmer: 200, drifter: 100 },
      min: 0,
      max: 1000
    },
    {
      key: 'timber',
      stateKey: 'timber',
      name: 'Timber Supports',
      unit: 'boards',
      price: 0.50,
      description: 'Green pine, rough-cut. Holds the mountain off your skull if you brace it right.',
      recommended: { mine_foreman: 40, geologist: 30, farmer: 25, drifter: 15 },
      min: 0,
      max: 200
    },
    {
      key: 'dynamite',
      stateKey: 'dynamite',
      name: 'Dynamite',
      unit: 'sticks',
      price: 2.00,
      description: 'Nobel\'s patent. Sweats nitroglycerin in the heat. Handle accordingly.',
      recommended: { mine_foreman: 15, geologist: 12, farmer: 10, drifter: 5 },
      min: 0,
      max: 50
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

  // Show the store intro
  function showStoreIntro(callback) {
    onCompleteCallback = callback;
    initCart();

    var shopLine = '';
    if (window.Content && window.Content.getShopkeeperLine) {
      shopLine = window.Content.getShopkeeperLine();
    } else {
      shopLine = '"Buy what you need. Leave what you don\'t. I ain\'t in the advice business."';
    }

    var html = '<pre class="title-art">' + STORE_ASCII + '</pre>\n';
    html += '<div class="text-bright text-center" style="margin:8px 0">';
    html += 'Marmaros Outfitters — Herschel Barnes, Prop.</div>\n';
    html += '<div class="text-dim text-center" style="margin-bottom:8px">';
    html += UI.escapeHtml(shopLine) + '</div>\n';
    html += '<div class="text-center">Cash available: <span class="text-yellow">';
    html += UI.formatMoney(getStartingCash()) + '</span></div>\n';

    UI.render(html);
    UI.pressEnter(function () {
      showCategory(0);
    });
  }

  // Show a single category for purchasing
  function showCategory(index) {
    currentCategory = index;
    var cat = CATEGORIES[index];
    var prof = getProfession();
    var rec = (cat.recommended[prof] !== undefined) ? cat.recommended[prof] : 0;
    var remaining = getRemainingCash();
    var maxAfford = cat.price > 0 ? Math.floor(remaining / cat.price) : 0;
    if (maxAfford > cat.max) maxAfford = cat.max;
    if (maxAfford < 0) maxAfford = 0;

    var html = '<div class="text-bright">Item ' + (index + 1) + ' of ' + CATEGORIES.length + '</div>';
    html += '<hr class="separator-double">';
    html += '<div class="text-lg text-glow" style="margin:6px 0">' + cat.name + '</div>';
    html += '<div class="text-dim">' + cat.description + '</div>';
    html += '<div style="margin:6px 0">';
    html += 'Price: <span class="text-yellow">' + UI.formatMoney(cat.price) + '</span> per ' + cat.unit.replace(/s$/, '');
    html += '</div>';
    html += '<div class="text-dim">Recommended: <span class="text-amber">' + rec + ' ' + cat.unit + '</span></div>';
    html += '<div style="margin:4px 0">Cash remaining: <span class="text-yellow">' + UI.formatMoney(remaining) + '</span>';
    html += '  (max: ' + maxAfford + ')</div>';

    if (cart[cat.key] > 0) {
      html += '<div class="text-green">In cart: ' + cart[cat.key] + ' ' + cat.unit + '</div>';
    }

    UI.render(html);

    var defaultVal = rec <= maxAfford ? rec : maxAfford;
    UI.promptNumber('How many ' + cat.unit + '? ', function (val) {
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
    }, { min: cat.min, max: Math.min(cat.max, maxAfford), defaultValue: String(defaultVal) });
  }

  // Show purchase summary
  function showSummary() {
    var total = getCartTotal();
    var remaining = getStartingCash() - total;

    var html = '<div class="text-lg text-glow text-center" style="margin-bottom:8px">Purchase Summary</div>';
    html += '<hr class="separator-double">';

    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      var qty = cart[cat.key] || 0;
      var cost = Math.round(qty * cat.price * 100) / 100;
      html += '<div class="store-item">';
      html += '<span>' + cat.name + ': ' + qty + ' ' + cat.unit + '</span>';
      html += '<span class="store-price">' + UI.formatMoney(cost) + '</span>';
      html += '</div>';
    }

    html += '<hr class="separator-double">';
    html += '<div class="store-item"><span class="text-bright">Total:</span>';
    html += '<span class="store-total">' + UI.formatMoney(total) + '</span></div>';
    html += '<div class="store-item"><span>Remaining cash:</span>';
    html += '<span class="text-yellow">' + UI.formatMoney(remaining) + '</span></div>';
    html += '<div style="margin-top:10px"></div>';

    UI.render(html);
    UI.promptChoice([
      { key: '1', label: 'Load the mules and ride for the Den', value: 'accept' },
      { key: '2', label: 'Reconsider your provisions', value: 'redo' },
    ], function (val) {
      if (val === 'accept') {
        applyPurchases();
        UI.showNotification('Barnes nods. "Don\'t come back short."', 1200);
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
    state.cash = getRemainingCash() + 5; // petty cash after outfitting
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
