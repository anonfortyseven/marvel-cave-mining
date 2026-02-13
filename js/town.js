/* ============================================
   Town.js - Town Hub & Specialty Shops
   The Marvel Cave Mining Company
   Marmaros, Stone County, Missouri - 1884
   ============================================ */

(function () {
  'use strict';

  // ─── Town ASCII Art ──────────────────────────────────────────────
  var TOWN_ART = [
    '            ~          ~          ~',
    '        ~  /|\\     ~  /|\\     ~  /|\\',
    '    ______/ | \\____/ | \\____/ | \\______',
    '   |   GENERAL   |  BLACKSMITH  |      |',
    '   |    STORE     |   & FORGE   |TAVERN|',
    '   |   [=====]    |   [/\\/\\]    | [~~] |',
    '   |   |    |     |   |    |    | |  | |',
    '   |___|____|_____|___|____|____|_|__|_|',
    '   =====================================',
    '      MARMAROS -- Stone County, MO',
    '   ====================================='
  ].join('\n');

  // ─── Tavern Micro-Scenes (family-friendly) ─────────────────────
  // Random vignettes that can trigger on entering the Lantern Tavern.
  // Small buffs/flags only; designed to keep the core loop intact.
  var TAVERN_SCENES = [
    {
      id: 'red_rule',
      who: 'Red Sullivan',
      chance: 0.14,
      cooldown: 2,
      condition: function (state) { return !!state; },
      text: [
        'Red wipes a mug and nods toward your crew.',
        '"You\'ve got good people. Don\'t grind \'em into dust. Steady wins this cave."'
      ],
      choices: [
        {
          key: '1',
          label: '"You\'re right. We\'ll keep it steady."',
          apply: function (state) {
            state.workPace = 'steady';
            state.morale = Math.min(100, (state.morale || 50) + 5);
            return 'You promise to keep a steady pace.';
          }
        },
        {
          key: '2',
          label: '"We\'ll be fine."',
          apply: function (state) {
            state.morale = Math.max(0, (state.morale || 50) - 2);
            return 'The crew hears you. They don\'t look thrilled.';
          }
        },
        {
          key: '3',
          label: '"Any advice for getting around down there?"',
          apply: function (state) {
            state.calmFocusDays = Math.max(state.calmFocusDays || 0, 2);
            state.morale = Math.min(100, (state.morale || 50) + 3);
            return 'Red points out a few landmarks. "Mark your turns. Don\'t rush."';
          }
        }
      ]
    },
    {
      id: 'red_stew',
      who: 'Red Sullivan',
      chance: 0.04,
      cooldown: 5,
      condition: function (state) {
        var morale = state && state.morale !== undefined ? state.morale : 50;
        return morale <= 35 || (state && state.food <= 15);
      },
      text: [
        'Red slides a bowl of warm stew across the bar.',
        '"No charge. Warm food makes better decisions."'
      ],
      choices: [
        {
          key: '1',
          label: 'Accept (thank him)',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 8);
            if (state.foreman && state.foreman.alive) window.HealthSystem.applyHealing(state.foreman, 5);
            return 'It\'s simple, hearty, and exactly what you needed.';
          }
        },
        {
          key: '2',
          label: 'Share it with the crew',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 10);
            return 'You split the stew. Laughter returns to the table.';
          }
        },
        {
          key: '3',
          label: 'Decline (save it for someone else)',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 2);
            return 'Red nods, respectful. "That\'s a kind choice."';
          }
        }
      ]
    },
    {
      id: 'penny_trivia',
      who: 'Penny Mae',
      chance: 0.12,
      cooldown: 2,
      condition: function (state) { return !!state; },
      text: [
        'Penny Mae pops up beside your table.',
        '"Quiz time! Which is scarier: a dark tunnel… or a quiet one?"'
      ],
      choices: [
        {
          key: '1',
          label: '"The quiet one."',
          apply: function (state) {
            state.taffy = (state.taffy || 0) + 1;
            state.morale = Math.min(100, (state.morale || 50) + 6);
            return '"Correct!" She hands you a little twist of taffy.';
          }
        },
        {
          key: '2',
          label: '"The dark one."',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 4);
            return 'She giggles. "Fair! But quiet means you can\'t hear trouble coming."';
          }
        },
        {
          key: '3',
          label: '"Both. That\'s why we stick together."',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 6);
            return 'She nods solemnly. "That\'s the best answer."';
          }
        }
      ]
    },
    {
      id: 'penny_sweet_deal',
      who: 'Penny Mae',
      chance: 0.08,
      cooldown: 3,
      condition: function (state) { return state && state.cash >= 1; },
      text: [
        'Penny Mae whispers like it\'s a secret.',
        '"Two bits gets you a \"bravery bundle\". Three taffies. No arguing."'
      ],
      choices: [
        {
          key: '1',
          label: 'Pay $0.50 for the bundle',
          apply: function (state) {
            state.cash = Math.round((state.cash - 0.5) * 100) / 100;
            state.taffy = (state.taffy || 0) + 3;
            state.morale = Math.min(100, (state.morale || 50) + 4);
            return 'She ties the bag tight and beams. "Bravery\'s better when it\'s chewy."';
          }
        },
        {
          key: '2',
          label: 'Tell her a funny story instead',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 5);
            return 'She laughs so hard she almost drops the taffy. The whole table smiles.';
          }
        },
        {
          key: '3',
          label: 'Decline (save your money)',
          apply: function (state) {
            return '"Suit yourself," she says, not offended at all.';
          }
        }
      ]
    },
    {
      id: 'eli_napkin_map',
      who: 'Eli Wren',
      chance: 0.10,
      cooldown: 3,
      condition: function (state) { return state && state.cash >= 1; },
      text: [
        'A traveler with a pencil behind his ear sketches lines on a napkin.',
        '"I don\'t draw treasure. I draw exits."'
      ],
      choices: [
        {
          key: '1',
          label: 'Pay $1 for the napkin map',
          apply: function (state) {
            state.cash = Math.round((state.cash - 1) * 100) / 100;
            if (!state.mappedChambers) state.mappedChambers = {};
            state.mappedChambers[state.currentChamber] = 3;
            state.morale = Math.min(100, (state.morale || 50) + 2);
            return 'He hands it over. The lines are simple, but you feel steadier already.';
          }
        },
        {
          key: '2',
          label: 'Ask him to teach you (no charge)',
          apply: function (state) {
            state.calmFocusDays = Math.max(state.calmFocusDays || 0, 1);
            state.morale = Math.min(100, (state.morale || 50) + 3);
            return '"Watch for the shapes," he says. "The cave repeats itself, but not exactly."';
          }
        },
        {
          key: '3',
          label: 'Decline politely',
          apply: function (state) {
            return 'He tips his hat and folds the napkin away.';
          }
        }
      ]
    },
    {
      id: 'eli_air_pockets',
      who: 'Eli Wren',
      chance: 0.07,
      cooldown: 4,
      condition: function (state) { return !!state; },
      text: [
        'Eli taps the table twice, like a code.',
        '"Sometimes the air turns sharp. If your light feels wrong… don\'t argue with it."'
      ],
      choices: [
        {
          key: '1',
          label: 'Listen carefully',
          apply: function (state) {
            state.airAwareDays = Math.max(state.airAwareDays || 0, 2);
            state.morale = Math.min(100, (state.morale || 50) + 2);
            return 'You pack cloths where you can reach them fast.';
          }
        },
        {
          key: '2',
          label: 'Ask what to do if it happens',
          apply: function (state) {
            state.airAwareDays = Math.max(state.airAwareDays || 0, 1);
            return '"Stay together. Move slow. Get to a place you already know," he says.';
          }
        },
        {
          key: '3',
          label: 'Nod and change the subject',
          apply: function (state) {
            return 'You don\'t press him. Some warnings are better left simple.';
          }
        }
      ]
    }
  ];

  // ─── Shop Definitions (3 shops) ─────────────────────────────────
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
      name: 'Ozark Blacksmith & Forge',
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
          name: 'Tool Upgrade',
          price: 20,
          description: '+15% mining output',
          stateKey: 'toolUpgrade',
          equipment: true
        },
        {
          name: 'Hunting Knife',
          price: 8,
          description: 'Reduces raid losses, +survival',
          stateKey: 'huntingKnife',
          equipment: true
        },
        {
          name: 'Walking Stick',
          price: 6,
          description: '-20% fall damage',
          stateKey: 'walkingStick',
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
      secondMiniGame: 'TaffyGame',
      secondMiniGamePrompt: 'Penny Mae\'s taffy cart is here! Pull some taffy?',
      greetings: [
        '"Pull up a stool! What\'s your poison?"',
        '"Welcome to the Lantern! Stew\'s hot and Penny Mae\'s got fresh taffy."',
        '"Ain\'t seen you in a while, friend. Figured the cave got ya!"',
        '"Step on in! Leave your worries at the door -- they\'ll keep."'
      ],
      items: [
        {
          name: 'Hot Meal',
          price: 2,
          description: '+5 morale, +5 health',
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
        },
        {
          name: 'Taffy',
          price: 0.50,
          description: '+10 morale when consumed',
          stateKey: 'taffy',
          equipment: false,
          consumable: true
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

  // --- Tavern micro-scenes helpers ---
  function ensureTavernState(state) {
    if (!state.tavernSceneCooldowns) state.tavernSceneCooldowns = {};
    if (!state.mappedChambers) state.mappedChambers = {};
    if (!state.calmFocusDays) state.calmFocusDays = 0;
    if (!state.airAwareDays) state.airAwareDays = 0;
  }

  function canRunTavernScene(scene, state) {
    if (!scene || !state) return false;
    ensureTavernState(state);
    if (state.tavernSceneCooldowns[scene.id] && state.tavernSceneCooldowns[scene.id] > 0) return false;
    if (scene.condition && !scene.condition(state)) return false;
    return true;
  }

  function maybeRunTavernScene(shop) {
    var state = gs();
    if (!state || !shop || shop.id !== 'tavern') return false;
    ensureTavernState(state);

    // 60%: no scene (go straight to menu)
    if (Math.random() < 0.60) return false;

    // Filter eligible scenes
    var eligible = [];
    for (var i = 0; i < TAVERN_SCENES.length; i++) {
      if (canRunTavernScene(TAVERN_SCENES[i], state)) eligible.push(TAVERN_SCENES[i]);
    }
    if (eligible.length === 0) return false;

    // Weighted roll by chance
    var total = 0;
    for (var j = 0; j < eligible.length; j++) total += (eligible[j].chance || 0);
    if (total <= 0) return false;

    var r = Math.random() * total;
    var pick = eligible[0];
    for (var k = 0; k < eligible.length; k++) {
      r -= (eligible[k].chance || 0);
      if (r <= 0) { pick = eligible[k]; break; }
    }

    // Render scene
    UI.hideBars();
    var html = '<div class="text-lg text-glow">The Lantern Tavern</div><hr class="separator">';
    html += '<div class="text-amber" style="margin:6px 0">' + UI.escapeHtml(pick.who) + '</div>';
    for (var t = 0; t < pick.text.length; t++) {
      html += '<div class="text-bright" style="margin:4px 0">' + UI.escapeHtml(pick.text[t]) + '</div>';
    }
    UI.render(html);

    var opts = [];
    for (var c = 0; c < pick.choices.length; c++) {
      opts.push({ key: pick.choices[c].key, label: pick.choices[c].label, value: String(c) });
    }
    UI.promptChoice(opts, function (val) {
      var idx = parseInt(val, 10);
      var choice = pick.choices[idx];
      var msg = '';
      if (choice && choice.apply) {
        msg = choice.apply(state) || '';
      }

      // Set cooldown
      state.tavernSceneCooldowns[pick.id] = pick.cooldown || 2;
      save();

      // Show result, then return to the shop menu
      var html2 = '<div class="text-bright" style="margin:10px 0">' + UI.escapeHtml(msg || 'Done.') + '</div>';
      UI.render(html2);
      UI.pressEnter(function () { showShop(shop); });
    });

    return true;
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
          UI.transition(townCallback);
        }
      } else {
        var shop = SHOPS[val];
        trackVisit(shop.id);
        UI.transition(function () {
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
          UI.transition(showTownHub);
        });
        return;
      }
    }

    var state = gs();
    if (!state) { showTownHub(); return; }
    ensureEquipment(state);

    // Random tavern micro-scene (family-friendly)
    if (shop.id === 'tavern') {
      if (maybeRunTavernScene(shop)) return;
    }

    // Build shop screen
    var art = getShopArt(shop.id);
    var html = '';
    // Pixel art shop image
    if (window.Images) html += Images.getShopImage(shop.id);
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

    // Second mini-game option (e.g. Taffy at the Tavern)
    if (shop.secondMiniGame) {
      menuOptions.push({
        key: String(idx),
        label: shop.secondMiniGamePrompt,
        value: 'minigame2'
      });
      menuActions.push({ type: 'minigame2' });
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
        UI.transition(showTownHub);
        return;
      }

      if (val === 'minigame') {
        launchMiniGame(shop);
        return;
      }

      if (val === 'minigame2') {
        launchMiniGame(shop, true);
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
  function launchMiniGame(shop, useSecond) {
    var gameGlobal = useSecond ? shop.secondMiniGame : shop.miniGame;
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

    // Switch to mini-game music
    if (window.Audio_Manager) Audio_Manager.play('minigame');

    gameObj.start(params, function (result) {
      // Resume town music
      if (window.Audio_Manager) Audio_Manager.play('town');

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
