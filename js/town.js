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
        'Red polishes a glass that will never be clean and studies your crew with eyes that have seen too many mining parties come through this door.',
        '"I been pouring drinks in Marmaros since \'82. You know how many crews I\'ve outfitted? Fourteen. You know how many came back whole? Three. Steady wins this cave. The greedy ones are buried in it."'
      ],
      choices: [
        {
          key: '1',
          label: '"We\'ll keep it steady. Your word on it."',
          apply: function (state) {
            state.workPace = 'steady';
            state.morale = Math.min(100, (state.morale || 50) + 5);
            return 'Red nods slowly. "That\'s what the smart ones say. Now let\'s see if you mean it."';
          }
        },
        {
          key: '2',
          label: '"We\'ll be fine, Red."',
          apply: function (state) {
            state.morale = Math.max(0, (state.morale || 50) - 2);
            return 'Red says nothing. He has heard those exact words before, from men who are not here to say them again.';
          }
        },
        {
          key: '3',
          label: '"What have you heard about the deeper chambers?"',
          apply: function (state) {
            state.calmFocusDays = Math.max(state.calmFocusDays || 0, 2);
            state.morale = Math.min(100, (state.morale || 50) + 3);
            return 'Red lowers his voice. "Past the Serpentine, mark every turn. The cave repeats itself but not exactly. And if you hear water changing pitch -- don\'t think. Run."';
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
        'Red slides a bowl of venison stew across the bar without being asked. It steams in the lamplight.',
        '"On the house. I had a cousin in the lead mines at Granby. He said the hardest part wasn\'t the digging. It was remembering you was human. Eat."'
      ],
      choices: [
        {
          key: '1',
          label: 'Accept (thank him)',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 8);
            if (state.foreman && state.foreman.alive) window.HealthSystem.applyHealing(state.foreman, 5);
            return 'The stew tastes like the surface. Like daylight and woodsmoke and a world where things grow upward.';
          }
        },
        {
          key: '2',
          label: 'Share it with the crew',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 10);
            return 'You split the bowl five ways. It is not enough for anyone and exactly enough for everyone. Someone laughs. It has been a while since anyone laughed.';
          }
        },
        {
          key: '3',
          label: 'Decline (save it for someone worse off)',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 2);
            return 'Red nods. "That is the first kind thing I have seen a miner do all week. I will remember it."';
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
        'Penny Mae appears beside your table like a small, determined ghost. Her taffy cart rattles behind her.',
        '"My grandma used to sing a song about this cave. Wanna hear a piece? She said: \'The Devil built a house of stone, and filled it full of wings. He hid his treasure in the deep, where the blind fish sings.\' What do you reckon the treasure is?"'
      ],
      choices: [
        {
          key: '1',
          label: '"Gold. It\'s always gold."',
          apply: function (state) {
            state.taffy = (state.taffy || 0) + 1;
            state.morale = Math.min(100, (state.morale || 50) + 6);
            return 'She wrinkles her nose. "That\'s what the Spaniards thought too. Here, have a taffy for trying." She presses a warm twist of molasses candy into your hand.';
          }
        },
        {
          key: '2',
          label: '"The cave itself is the treasure."',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 4);
            return 'Her eyes go wide. "That\'s what Grandma said! She said the people who lived here first knew that. The Osage. They didn\'t dig. They just... listened."';
          }
        },
        {
          key: '3',
          label: '"I don\'t know, but I aim to find out."',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 6);
            return 'She grins like someone who knows a secret. "The blind fish sings," she whispers. "In the lake at the bottom. If you ever get that deep, listen for it." She leaves a taffy on the table and vanishes back to her cart.';
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
        'Penny Mae leans in conspiratorially, smelling of molasses and woodsmoke.',
        '"I got a bravery bundle. Three taffies and a lucky penny I found by the sinkhole. Fifty cents. The penny is not negotiable."'
      ],
      choices: [
        {
          key: '1',
          label: 'Pay $0.50 for the bundle',
          apply: function (state) {
            state.cash = Math.round((state.cash - 0.5) * 100) / 100;
            state.taffy = (state.taffy || 0) + 3;
            state.morale = Math.min(100, (state.morale || 50) + 4);
            return 'She ties the bag tight with twine and drops in a penny worn smooth as a river stone. "The penny came from the cave. Grandma said things that come from the cave want to go back. So you take it down there and it\'ll show you the way home."';
          }
        },
        {
          key: '2',
          label: 'Tell her a story from the cave instead',
          apply: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 5);
            return 'You tell her about the Cathedral Room. How big it is. How the bats spiral at dusk. She listens with her mouth open and her eyes wide and for a moment you remember that wonder is possible even in a place that wants to kill you.';
          }
        },
        {
          key: '3',
          label: 'Decline (save your money)',
          apply: function (state) {
            return '"Your loss," she says cheerfully. "The penny was real lucky. I only tripped twice carrying it."';
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
        'An old man sits alone in the corner, sketching lines on a napkin with a carpenter\'s pencil. His hands are scarred. His eyes are the pale blue of a man who has spent too long in the dark.',
        '"I don\'t draw treasure," he says without looking up. "I draw exits. A man who knows his exits don\'t need treasure."'
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
            return 'He slides the napkin across the table. The lines are crude but precise. You recognize the Serpentine Passage. A side passage is marked with an X and the words: "DO NOT." He offers no further explanation.';
          }
        },
        {
          key: '2',
          label: 'Ask how he knows the cave so well',
          apply: function (state) {
            state.calmFocusDays = Math.max(state.calmFocusDays || 0, 1);
            state.morale = Math.min(100, (state.morale || 50) + 3);
            return '"I worked the Blow expedition in \'69. Thirty years ago. We found the Spanish ladders in the Mammoth Room. Three hundred year old pine and they was still standing." He pauses. "We found other things too. Things that wasn\'t Spanish and wasn\'t Osage and wasn\'t anything I got a word for. The cave repeats itself, friend. But not exactly."';
          }
        },
        {
          key: '3',
          label: 'Decline politely',
          apply: function (state) {
            return 'He folds the napkin carefully into his vest pocket. "Suit yourself. But if you make it to the Waterfall Room, look behind the falls. There\'s markings. Old ones. Older than the Spaniards." He says nothing more.';
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
        'Eli Wren catches your arm as you pass his table. His grip is stronger than an old man\'s grip should be.',
        '"The air down there has moods. When your candle flame turns blue, the cave is breathing something you should not be. When the flame shrinks, there ain\'t enough air for both of you and the fire. When the flame goes out..." He trails off. "Don\'t let the flame go out."'
      ],
      choices: [
        {
          key: '1',
          label: 'Listen carefully to every word',
          apply: function (state) {
            state.airAwareDays = Math.max(state.airAwareDays || 0, 2);
            state.morale = Math.min(100, (state.morale || 50) + 2);
            return 'He nods, satisfied. "Carry a wet cloth. When the ammonia hits, press it to your face and breathe through it. The men who died of lung sickness -- they breathed it raw. Don\'t be them." You pack cloths where you can reach them fast.';
          }
        },
        {
          key: '2',
          label: 'Ask what he saw down there in 1869',
          apply: function (state) {
            state.airAwareDays = Math.max(state.airAwareDays || 0, 1);
            return 'His pale eyes go distant. "We found the Spanish ladders. Three hundred years underground and the pine was still solid. But there was other wood down there too. Older. Hardwood that don\'t grow in Missouri. I never could figure how it got five hundred feet underground." He finishes his drink. "Stay together. Move slow. Get to a place you already know. That\'s all the wisdom I got."';
          }
        },
        {
          key: '3',
          label: 'Nod and change the subject',
          apply: function (state) {
            return 'You pull your arm free gently. Eli watches you go with those pale cave-blind eyes. "The water remembers," he says to your back. You do not ask him what he means.';
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
        '"Herschel Barnes. I stock what you need to go underground and most of what you need to come back up. I don\'t extend credit."',
        '"Fresh hemp rope in yesterday. Good and strong. You will want it. The cave eats rope like a mule eats oats."',
        '"Back again? That means you\'re still alive. I consider that a personal recommendation for my merchandise."',
        '"The smart ones buy oil first. The dead ones bought dynamite first. Draw your own conclusions."'
      ]
    },
    {
      id: 'blacksmith',
      name: 'Ozark Blacksmith & Forge',
      keeper: 'Jebediah Colt',
      miniGame: 'SharpenGame',
      miniGamePrompt: 'Care to test your arm at the grindstone?',
      greetings: [
        '"Jebediah Colt. I shoe mules and I sharpen steel. If you want conversation, go to Red\'s. If you want to live, come to me."',
        '"Iron don\'t lie. Good steel keeps a man alive. Bad steel keeps a widow fed. Which do you want?"',
        '"I forged every pickaxe that ever went into that cave. Most of them came back. Most of the men did too."',
        '"Step in. Don\'t touch nothing hot. What do you need?"'
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
        '"The Lantern Tavern. Pull up a stool. You look like a man who has been underground. I can always tell by the eyes."',
        '"Stew is hot. Penny Mae has fresh taffy. And old Eli is in his corner, drawing maps on napkins nobody asked for. Welcome."',
        '"Ain\'t seen you in a while. I figured the cave got you. Glad to be wrong. Drink?"',
        '"Come in. Leave your worries at the door. The Bald Knobbers leave theirs at the trail. We are all pretending here."'
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
