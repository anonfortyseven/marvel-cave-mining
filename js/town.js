/* ============================================
   Town.js - Town Hub & Specialty Shops
   The Marvel Cave Mining Company
   Marmaros, Stone County, Missouri - 1884
   ============================================ */

(function () {
  'use strict';

  // ─── Town ASCII Art ──────────────────────────────────────────────
  var TOWN_ART = [
    '          ~       ~        ~       ~',
    '      ~  /|\\   ~ /|\\  ~  /|\\  ~  /|\\',
    '    ____/ | \\__/ | \\__/ | \\__/ | \\____',
    '   |  GENERAL |BLACKSMITH|SWEETS|KNIFE |',
    '   |  STORE   | & FORGE  | SHOP |WORKS |',
    '   |  [===]   |  [/\\/\\]  | [~~] | [/|] |',
    '   |  |  |    |  |  |   | |  | | |  | |',
    '   |__|__|____|__|__|___|_|__|_|_|__|_|',
    '   ===================================',
    '     MARMAROS -- Stone County, MO',
    '   ==================================='
  ].join('\n');

  // ─── Shop Definitions ────────────────────────────────────────────
  var SHOPS = [
    {
      id: 'general_store',
      name: 'Marmaros Outfitters',
      keeper: 'Herschel Barnes',
      useExistingStore: true,
      greetings: [
        '"Stock up well, friend. The cave don\'t forgive the unprepared."',
        '"Mornin\'! Got fresh rope in yesterday. Good hemp, strong as iron."',
        '"Back again? Must mean you\'re still alive. That\'s good for business."',
        '"I keep a tally of who buys what. The smart ones buy oil first."'
      ]
    },
    {
      id: 'blacksmith',
      name: 'Ozark Blacksmith',
      keeper: 'Jebediah Colt',
      miniGame: 'SharpenGame',
      miniGamePrompt: 'Care to test your arm at the grindstone?',
      greetings: [
        '"Need somethin\' fixed? Or maybe you wanna try the grindstone?"',
        '"Iron don\'t lie, friend. Good steel keeps a man alive down there."',
        '"I forged every pickaxe that ever went into that cave. Ain\'t lost one yet."',
        '"Step in, warm yourself by the forge. What can old Jeb do for ya?"'
      ],
      items: [
        {
          name: 'Pickaxe Upgrade',
          price: 25,
          description: '+10% mining output',
          stateKey: 'pickaxeUpgrade',
          equipment: true
        },
        {
          name: 'Lantern Repair Kit',
          price: 15,
          description: '-15% oil consumption',
          stateKey: 'lanternRepair',
          equipment: true
        },
        {
          name: 'Blade Sharpening',
          price: 5,
          description: 'Hones your tools to a fine edge',
          stateKey: null,
          equipment: false,
          onPurchase: function (state) {
            state.cash += 2;
            return 'Jeb works the grindstone with practiced hands. Your blades sing.';
          }
        }
      ]
    },
    {
      id: 'sweet_shop',
      name: 'Penny\'s Sweet Shop',
      keeper: 'Penny Mae Dawson',
      miniGame: 'TaffyGame',
      miniGamePrompt: 'Help me pull this batch of taffy!',
      greetings: [
        '"Oh! A customer! Try the taffy, it\'s fresh pulled this mornin\'!"',
        '"Welcome, welcome! You look like you could use somethin\' sweet."',
        '"Penny Mae\'s got just the thing to lift your spirits, sugar."',
        '"Come in out of the dust! I got candy that\'ll make you forget your troubles."'
      ],
      items: [
        {
          name: 'Taffy',
          price: 0.50,
          description: '+10 morale when consumed',
          stateKey: 'taffy',
          equipment: false,
          consumable: true
        },
        {
          name: 'Hard Candy',
          price: 0.25,
          description: '+5 morale when consumed',
          stateKey: 'hardCandy',
          equipment: false,
          consumable: true
        }
      ]
    },
    {
      id: 'knife_works',
      name: 'Stone County Knife Works',
      keeper: 'Silas Whitmore',
      greetings: [
        '"Fine steel. Won\'t find better this side of Springfield."',
        '"Every blade I sell, I\'d carry myself. That\'s my guarantee."',
        '"A man without a knife in these hills ain\'t much of a man."',
        '"Don\'t touch the display blades. You want to hold one, you buy it."'
      ],
      items: [
        {
          name: 'Hunting Knife',
          price: 8,
          description: '+5% survival in events',
          stateKey: 'huntingKnife',
          equipment: true
        },
        {
          name: 'Belt Knife',
          price: 5,
          description: 'Reduces Bald Knobber losses',
          stateKey: 'beltKnife',
          equipment: true
        }
      ]
    },
    {
      id: 'woodcraft',
      name: 'Ridgetop Woodcraft',
      keeper: 'Old Man Hemlock',
      miniGame: 'CarveGame',
      miniGamePrompt: 'Whittle a piece?',
      greetings: [
        '"Take your time... I ain\'t goin\' nowhere."',
        '"Wood\'s got a soul, son. You just gotta listen for it."',
        '"Been carvin\' since before your daddy was born. Reckon I know a thing or two."',
        '"Sit a spell. Let me show you what these old hands can still do."'
      ],
      items: [
        {
          name: 'Walking Stick',
          price: 6,
          description: '-20% fall damage in events',
          stateKey: 'walkingStick',
          equipment: true
        },
        {
          name: 'Timber Handles',
          price: 3,
          description: '+5% mining output',
          stateKey: 'timberHandles',
          equipment: true
        }
      ]
    },
    {
      id: 'tavern',
      name: 'The Lantern Tavern',
      keeper: 'Red Sullivan',
      miniGame: 'CardsGame',
      miniGamePrompt: 'Fancy a hand of Cave Draw?',
      greetings: [
        '"Pull up a stool! What\'s your poison?"',
        '"Welcome to the Lantern! Whiskey\'s strong and the stew\'s hot."',
        '"Ain\'t seen you in a while, friend. Figured the cave got ya!"',
        '"Step on in! Leave your worries at the door -- they\'ll keep."'
      ],
      items: [
        {
          name: 'Whiskey',
          price: 1,
          description: '+8 morale, -3 health',
          stateKey: 'whiskey',
          equipment: false,
          consumable: true
        },
        {
          name: 'Hot Meal',
          price: 2,
          description: '+5 morale, +5 health (immediate)',
          stateKey: null,
          equipment: false,
          consumable: false,
          onPurchase: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 5);
            if (state.foreman && state.foreman.alive) {
              state.foreman.health = Math.max(0, state.foreman.health - 5);
            }
            return 'A steaming plate of venison stew with cornbread. Warms you to the bone.';
          }
        }
      ]
    }
  ];

  // ─── Module State ────────────────────────────────────────────────
  var visitedShops = [];
  var townCallback = null;

  // ─── Helpers ─────────────────────────────────────────────────────
  function gs() {
    return window.GameState && window.GameState.state ? window.GameState.state : null;
  }

  function save() {
    if (window.GameState && window.GameState.save) {
      window.GameState.save();
    }
  }

  function ensureEquipment(state) {
    if (!state.equipment) state.equipment = {};
  }

  function randomGreeting(shop) {
    var g = shop.greetings;
    return g[Math.floor(Math.random() * g.length)];
  }

  function getShopArt(shopId) {
    if (window.AsciiArt && window.AsciiArt.getShopArt) {
      return window.AsciiArt.getShopArt(shopId);
    }
    return null;
  }

  function handleMiniGameResult(result) {
    var state = gs();
    if (!state || !result) return;
    if (result.cash) state.cash += result.cash;
    if (result.morale) {
      state.morale = Math.min(100, Math.max(0, (state.morale || 50) + result.morale));
    }
    if (result.items) {
      for (var k in result.items) {
        if (result.items.hasOwnProperty(k)) {
          state[k] = (state[k] || 0) + result.items[k];
        }
      }
    }
    save();
  }

  function trackVisit(shopId) {
    if (visitedShops.indexOf(shopId) === -1) {
      visitedShops.push(shopId);
    }
  }

  // ─── Town Hub Screen ─────────────────────────────────────────────
  function showTownHub(callback) {
    townCallback = callback || townCallback;
    var state = gs();

    var html = '<pre class="title-art">' + TOWN_ART + '</pre>\n';
    html += '<div class="text-bright text-center" style="margin:8px 0">';
    html += 'Welcome to Marmaros!</div>\n';
    html += '<div class="text-dim text-center" style="margin-bottom:4px">';
    html += 'A small mining settlement perched above Marvel Cave.</div>\n';

    if (state) {
      html += '<div class="text-center">Cash: <span class="text-yellow">';
      html += UI.formatMoney(state.cash) + '</span></div>\n';
    }

    html += '<hr class="separator">';
    html += '<div class="text-bright" style="margin:4px 0">Where would you like to go?</div>\n';

    UI.render(html);

    var options = [];
    for (var i = 0; i < SHOPS.length; i++) {
      var visited = visitedShops.indexOf(SHOPS[i].id) !== -1;
      var label = SHOPS[i].name + ' - ' + SHOPS[i].keeper;
      if (visited) label += ' [visited]';
      options.push({
        key: String(i + 1),
        label: label,
        value: i
      });
    }
    options.push({
      key: '0',
      label: 'Return to cave',
      value: 'leave'
    });

    UI.promptChoice(options, function (val) {
      if (val === 'leave') {
        if (townCallback) {
          UI.fadeTransition(townCallback);
        }
      } else {
        var shop = SHOPS[val];
        trackVisit(shop.id);
        UI.fadeTransition(function () {
          showShop(shop);
        });
      }
    });
  }

  // ─── Generic Shop Screen ─────────────────────────────────────────
  function showShop(shop) {
    // Route to existing Store module for the general store
    if (shop.useExistingStore) {
      if (window.Store && window.Store.show) {
        window.Store.show(function () {
          UI.fadeTransition(showTownHub);
        });
        return;
      }
    }

    var state = gs();
    if (!state) { showTownHub(); return; }
    ensureEquipment(state);

    // Build shop screen
    var art = getShopArt(shop.id);
    var html = '';
    if (art) {
      html += '<pre class="title-art">' + art + '</pre>\n';
    }

    html += '<div class="text-lg text-glow" style="margin:6px 0">';
    html += UI.escapeHtml(shop.name) + '</div>\n';
    html += '<div class="text-dim" style="margin-bottom:2px">';
    html += 'Proprietor: ' + UI.escapeHtml(shop.keeper) + '</div>\n';

    // Shopkeeper greeting
    html += '<div class="text-amber" style="margin:8px 0;font-style:italic">';
    html += UI.escapeHtml(randomGreeting(shop)) + '</div>\n';

    // Cash display
    html += '<div style="margin:4px 0">Cash: <span class="text-yellow">';
    html += UI.formatMoney(state.cash) + '</span></div>\n';
    html += '<hr class="separator">';

    UI.render(html);

    // Build menu options
    var menuOptions = [];
    var menuActions = [];
    var idx = 1;

    // Items for sale
    for (var i = 0; i < (shop.items || []).length; i++) {
      var item = shop.items[i];
      var owned = item.equipment && item.stateKey && state.equipment[item.stateKey];
      var label = item.name + ' - ' + UI.formatMoney(item.price);
      if (item.description) label += ' (' + item.description + ')';
      if (owned) label += ' [OWNED]';

      menuOptions.push({
        key: String(idx),
        label: label,
        value: 'buy_' + i
      });
      menuActions.push({ type: 'buy', index: i });
      idx++;
    }

    // Mini-game option
    if (shop.miniGame) {
      menuOptions.push({
        key: String(idx),
        label: shop.miniGamePrompt,
        value: 'minigame'
      });
      menuActions.push({ type: 'minigame' });
      idx++;
    }

    // Leave shop
    menuOptions.push({
      key: '0',
      label: 'Leave shop',
      value: 'leave'
    });

    UI.promptChoice(menuOptions, function (val) {
      if (val === 'leave') {
        UI.fadeTransition(showTownHub);
        return;
      }

      if (val === 'minigame') {
        launchMiniGame(shop);
        return;
      }

      // Handle purchase
      if (typeof val === 'string' && val.indexOf('buy_') === 0) {
        var buyIdx = parseInt(val.replace('buy_', ''), 10);
        handlePurchase(shop, buyIdx);
      }
    });
  }

  // ─── Purchase Handler ────────────────────────────────────────────
  function handlePurchase(shop, itemIndex) {
    var state = gs();
    if (!state) { showShop(shop); return; }
    ensureEquipment(state);

    var item = shop.items[itemIndex];
    if (!item) { showShop(shop); return; }

    // Equipment: one-time purchase check
    if (item.equipment && item.stateKey) {
      if (state.equipment[item.stateKey]) {
        UI.showNotification('Already purchased!', 1200);
        setTimeout(function () { showShop(shop); }, 1300);
        return;
      }

      // Can afford?
      if (state.cash < item.price) {
        UI.showNotification('Not enough cash!', 1200);
        setTimeout(function () { showShop(shop); }, 1300);
        return;
      }

      // Purchase equipment
      state.cash = Math.round((state.cash - item.price) * 100) / 100;
      state.totalExpenses = (state.totalExpenses || 0) + item.price;
      state.equipment[item.stateKey] = true;
      save();

      var msg = 'Purchased ' + item.name + ' for ' + UI.formatMoney(item.price) + '!';
      UI.showNotification(msg, 1500);
      setTimeout(function () { showShop(shop); }, 1600);
      return;
    }

    // One-time effect items (like Hot Meal or Blade Sharpening)
    if (item.onPurchase && !item.consumable) {
      if (state.cash < item.price) {
        UI.showNotification('Not enough cash!', 1200);
        setTimeout(function () { showShop(shop); }, 1300);
        return;
      }

      state.cash = Math.round((state.cash - item.price) * 100) / 100;
      state.totalExpenses = (state.totalExpenses || 0) + item.price;
      var flavorText = item.onPurchase(state);
      save();

      var html = '<div class="text-bright" style="margin:10px 0">';
      html += UI.escapeHtml(flavorText) + '</div>';
      UI.render(html);
      UI.pressEnter(function () { showShop(shop); });
      return;
    }

    // Consumable items: ask for quantity
    if (item.consumable && item.stateKey) {
      var maxAfford = item.price > 0 ? Math.floor(state.cash / item.price) : 0;
      if (maxAfford <= 0) {
        UI.showNotification('Not enough cash!', 1200);
        setTimeout(function () { showShop(shop); }, 1300);
        return;
      }

      var html = '<div class="text-bright">' + UI.escapeHtml(item.name) + '</div>';
      html += '<div class="text-dim">' + UI.escapeHtml(item.description) + '</div>';
      html += '<div style="margin:4px 0">Price: <span class="text-yellow">';
      html += UI.formatMoney(item.price) + '</span> each</div>';
      html += '<div>You can afford up to <span class="text-bright">' + maxAfford + '</span></div>';
      var current = state[item.stateKey] || 0;
      if (current > 0) {
        html += '<div class="text-dim">Currently have: ' + current + '</div>';
      }

      UI.render(html);
      UI.promptNumber('How many? ', function (qty) {
        if (qty <= 0) {
          showShop(shop);
          return;
        }
        if (qty > maxAfford) qty = maxAfford;

        var cost = Math.round(qty * item.price * 100) / 100;
        state.cash = Math.round((state.cash - cost) * 100) / 100;
        state.totalExpenses = (state.totalExpenses || 0) + cost;
        state[item.stateKey] = (state[item.stateKey] || 0) + qty;
        save();

        var msg = 'Bought ' + qty + ' ' + item.name + ' for ' + UI.formatMoney(cost) + '!';
        UI.showNotification(msg, 1500);
        setTimeout(function () { showShop(shop); }, 1600);
      }, { min: 0, max: maxAfford, defaultValue: '1' });
      return;
    }

    // Fallback: item with onPurchase callback (consumable + onPurchase, e.g. hot meal)
    if (item.onPurchase) {
      if (state.cash < item.price) {
        UI.showNotification('Not enough cash!', 1200);
        setTimeout(function () { showShop(shop); }, 1300);
        return;
      }

      state.cash = Math.round((state.cash - item.price) * 100) / 100;
      state.totalExpenses = (state.totalExpenses || 0) + item.price;
      var result = item.onPurchase(state);
      save();

      var html2 = '<div class="text-bright" style="margin:10px 0">';
      html2 += UI.escapeHtml(result) + '</div>';
      UI.render(html2);
      UI.pressEnter(function () { showShop(shop); });
      return;
    }

    // Should not reach here
    showShop(shop);
  }

  // ─── Mini-Game Launcher ──────────────────────────────────────────
  function launchMiniGame(shop) {
    var gameGlobal = shop.miniGame;
    var gameObj = window[gameGlobal];

    // Graceful fallback if mini-game not loaded
    if (!gameObj || typeof gameObj.start !== 'function') {
      var html = '<div class="text-dim" style="margin:10px 0">';
      html += '"Ah, looks like the ' + UI.escapeHtml(shop.miniGamePrompt.toLowerCase());
      html += ' ain\'t ready just yet. Come back another time."</div>';
      UI.render(html);
      UI.pressEnter(function () { showShop(shop); });
      return;
    }

    var state = gs();
    var params = {
      shopId: shop.id,
      keeper: shop.keeper,
      playerCash: state ? state.cash : 0,
      playerMorale: state ? (state.morale || 50) : 50
    };

    gameObj.start(params, function (result) {
      if (result) {
        handleMiniGameResult(result);

        // Show result summary
        var html = '<div class="text-bright" style="margin:10px 0">Results:</div>';
        if (result.cash && result.cash > 0) {
          html += '<div class="text-green">  Earned ' + UI.formatMoney(result.cash) + '</div>';
        } else if (result.cash && result.cash < 0) {
          html += '<div class="text-red">  Lost ' + UI.formatMoney(Math.abs(result.cash)) + '</div>';
        }
        if (result.morale && result.morale > 0) {
          html += '<div class="text-green">  Morale +' + result.morale + '</div>';
        } else if (result.morale && result.morale < 0) {
          html += '<div class="text-red">  Morale ' + result.morale + '</div>';
        }
        if (result.items) {
          for (var k in result.items) {
            if (result.items.hasOwnProperty(k) && result.items[k] > 0) {
              html += '<div class="text-green">  +' + result.items[k] + ' ' + k + '</div>';
            }
          }
        }

        UI.render(html);
        UI.pressEnter(function () { showShop(shop); });
      } else {
        showShop(shop);
      }
    });
  }

  // ─── Public API ──────────────────────────────────────────────────
  window.Town = {
    show: function (callback) {
      showTownHub(callback);
    },
    SHOPS: SHOPS,
    visitedShops: visitedShops,
    getVisitedCount: function () {
      return visitedShops.length;
    },
    resetVisited: function () {
      visitedShops.length = 0;
    }
  };

})();
