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

  var TAVERN_SCENES = [];

  // ─── Shop Definitions (3 shops) ─────────────────────────────────
  var SHOPS = [
    {
      id: 'general_store',
      name: 'Company Office & Outfitters',
      keeper: 'Jedidiah Campbell',
      useExistingStore: true,
      greetings: [
        '"The company provides what the contract requires."',
        '"Take what keeps the line moving and sign for it cleanly."'
      ]
    },
    {
      id: 'blacksmith',
      name: 'Shad Heller\'s Forge',
      keeper: 'Shad Heller',
      miniGame: 'SharpenGame',
      miniGamePrompt: 'Care to test your arm at the grindstone?',
      greetings: [
        '"Steel first. Talking after."',
        '"Bring me tools, not excuses."'
      ],
      items: [
        {
          name: 'Tool Upgrade',
          price: 3.5,
          description: '+15% mining output',
          featured: true,
          stateKey: 'toolUpgrade',
          equipment: true
        },
        {
          name: 'Hunting Knife',
          price: 1.25,
          description: 'Reduces raid losses, +survival',
          stateKey: 'huntingKnife',
          equipment: true
        },
        {
          name: 'Walking Stick',
          price: 0.75,
          description: '-20% fall damage',
          stateKey: 'walkingStick',
          equipment: true
        }
      ]
    },
    {
      id: 'sweets',
      name: "June Ward's Sweet Shop",
      keeper: 'June Ward',
      miniGame: 'TaffyGame',
      miniGamePrompt: 'Join June at the taffy hook?',
      greetings: [
        '"Candy first. Complaints after."',
        '"If the cave put you in a mood, I sell the cure by the ounce."'
      ],
      items: [
        {
          name: 'Peppermint Stick',
          price: 0.02,
          description: '+1 morale',
          stateKey: null,
          equipment: false,
          consumable: false,
          onPurchase: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 1);
            return 'June snaps a peppermint stick across the counter. "There. Now you can complain with style."';
          }
        },
        {
          name: 'Rock Candy',
          price: 0.03,
          description: '+2 morale',
          stateKey: null,
          equipment: false,
          consumable: false,
          onPurchase: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 2);
            return 'The sugar crunches loud enough to make the whole town seem less severe for a minute.';
          }
        },
        {
          name: 'Molasses Taffy',
          price: 0.05,
          description: '+4 morale',
          stateKey: null,
          equipment: false,
          consumable: false,
          onPurchase: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 4);
            return 'June wraps the warm pull in wax paper. "If this does not improve your temper, have another and lie about it."';
          }
        },
        {
          name: 'Coffee & Cinnamon Roll',
          price: 0.10,
          description: '+5 morale',
          featured: true,
          stateKey: null,
          equipment: false,
          consumable: false,
          onPurchase: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 5);
            return 'Hot coffee, sticky sugar, and one blessed hour where nobody smells like guano.';
          }
        }
      ]
    },
    {
      id: 'tavern',
      name: 'The Lantern Tavern',
      keeper: 'House table',
      miniGame: 'CardsGame',
      miniGamePrompt: 'Fancy a hand of Cave Draw?',
      greetings: [
        '"Stew is hot. Somebody is always listening."',
        '"Eat first. Lose money after."'
      ],
      items: [
        {
          name: 'Hot Meal',
          price: 0.2,
          description: '+5 morale, +5 health',
          featured: true,
          stateKey: null,
          equipment: false,
          consumable: false,
          onPurchase: function (state) {
            state.morale = Math.min(100, (state.morale || 50) + 5);
            if (window.HealthSystem && window.HealthSystem.applyPartyHealing) {
              window.HealthSystem.applyPartyHealing(state, 5);
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

  function detailCard(label, value, note, tone) {
    var cls = 'detail-card' + (tone ? ' detail-card-' + tone : '');
    var html = '<div class="' + cls + '">';
    html += '<div class="detail-card-label">' + UI.escapeHtml(label) + '</div>';
    html += '<div class="detail-card-value">' + UI.escapeHtml(value) + '</div>';
    if (note) html += '<div class="detail-card-note">' + UI.escapeHtml(note) + '</div>';
    html += '</div>';
    return html;
  }

  function getShopArt(shopId) {
    if (window.AsciiArt && window.AsciiArt.getShopArt) {
      return window.AsciiArt.getShopArt(shopId);
    }
    return null;
  }

  function buildPartySnapshot(state) {
    var party = [];
    if (!state) return party;

    if (state.foreman) {
      party.push({
        name: state.foreman.name,
        role: 'Foreman',
        health: state.foreman.health,
        alive: state.foreman.alive !== false
      });
    }

    for (var i = 0; i < (state.crew || []).length; i++) {
      party.push({
        name: state.crew[i].name,
        role: state.crew[i].role || 'Crew',
        health: state.crew[i].health,
        alive: state.crew[i].alive !== false
      });
    }

    return party;
  }

  function handleMiniGameResult(result) {
    var state = gs();
    if (!state || !result) return;
    if (result.cash) state.cash = Math.round((state.cash + result.cash) * 100) / 100;
    if (result.morale) {
      state.morale = Math.min(100, Math.max(0, (state.morale || 50) + result.morale));
    }
    if (result.focusDays) {
      state.calmFocusDays = Math.max(0, (state.calmFocusDays || 0) + result.focusDays);
    }
    if (result.airAwareDays) {
      state.airAwareDays = Math.max(0, (state.airAwareDays || 0) + result.airAwareDays);
    }
    if (result.healing && window.HealthSystem) {
      if (state.foreman && state.foreman.alive) {
        window.HealthSystem.applyHealing(state.foreman, result.healing);
      }
      for (var i = 0; i < (state.crew || []).length; i++) {
        if (state.crew[i].alive) {
          window.HealthSystem.applyHealing(state.crew[i], result.healing);
        }
      }
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

  function showMiniGameSummary(result, returnFn) {
    var cards = '';
    if (result.cashLabel) {
      cards += '<div class="detail-card detail-card-warn"><div class="detail-card-label">Cash</div><div class="detail-card-value">' + UI.escapeHtml(result.cashLabel) + '</div></div>';
    } else if (result.cash && result.cash > 0) {
      cards += '<div class="detail-card detail-card-good"><div class="detail-card-label">Cash</div><div class="detail-card-value">Earned ' + UI.formatMoney(result.cash) + '</div></div>';
    } else if (result.cash && result.cash < 0) {
      cards += '<div class="detail-card detail-card-danger"><div class="detail-card-label">Cash</div><div class="detail-card-value">Lost ' + UI.formatMoney(Math.abs(result.cash)) + '</div></div>';
    }
    if (result.morale && result.morale > 0) {
      cards += '<div class="detail-card detail-card-good"><div class="detail-card-label">Morale</div><div class="detail-card-value">+' + result.morale + '</div></div>';
    } else if (result.morale && result.morale < 0) {
      cards += '<div class="detail-card detail-card-danger"><div class="detail-card-label">Morale</div><div class="detail-card-value">' + result.morale + '</div></div>';
    }
    if (result.focusDays && result.focusDays > 0) {
      cards += '<div class="detail-card detail-card-good"><div class="detail-card-label">Focus</div><div class="detail-card-value">+' + result.focusDays + ' days</div></div>';
    }
    if (result.airAwareDays && result.airAwareDays > 0) {
      cards += '<div class="detail-card detail-card-good"><div class="detail-card-label">Air Sense</div><div class="detail-card-value">+' + result.airAwareDays + ' days</div></div>';
    }
    if (result.healingLabel) {
      cards += '<div class="detail-card detail-card-good"><div class="detail-card-label">Healing</div><div class="detail-card-value">' + UI.escapeHtml(result.healingLabel) + '</div></div>';
    } else if (result.healing && result.healing > 0) {
      cards += '<div class="detail-card detail-card-good"><div class="detail-card-label">Healing</div><div class="detail-card-value">Party healed</div></div>';
    }
    if (result.items) {
      for (var k in result.items) {
        if (result.items.hasOwnProperty(k) && result.items[k] > 0) {
          cards += '<div class="detail-card detail-card-good"><div class="detail-card-label">Gain</div><div class="detail-card-value">+' + result.items[k] + ' ' + UI.escapeHtml(k) + '</div></div>';
        }
      }
    }

    var html = '<div class="readable-screen readable-screen--narrow">';
    html += '<div class="readable-frame">';
    html += '<div class="readable-header">';
    html += '<div class="readable-kicker">Town result</div>';
    html += '<div class="readable-title text-glow">' + UI.escapeHtml(result.label || 'Marmaros Night') + '</div>';
    html += '<hr class="separator-double">';
    if (result.summary) html += '<div class="readable-lead">' + UI.escapeHtml(result.summary) + '</div>';
    html += '</div>';
    html += '<div class="readable-body"><div class="detail-card-grid detail-card-grid--two">' + cards + '</div></div>';
    html += '</div>';
    html += '</div>';

    UI.render(html);
    UI.pressEnter(function () { returnFn(); });
  }

  function launchTownMiniGame(gameGlobal, returnFn) {
    var gameObj = window[gameGlobal];
    if (!gameObj || typeof gameObj.start !== 'function') {
      UI.showNotification('Mini-game unavailable', 1200);
      setTimeout(function () { UI.transition(returnFn); }, 1300);
      return;
    }

    var state = gs();
    var params = {
      playerCash: state ? state.cash : 0,
      playerMorale: state ? (state.morale || 50) : 50,
      party: buildPartySnapshot(state)
    };

    if (window.Audio_Manager) Audio_Manager.play('minigame');
    gameObj.start(params, function (result) {
      if (window.Audio_Manager) Audio_Manager.play('town');
      if (!result) {
        UI.transition(returnFn);
        return;
      }
      handleMiniGameResult(result);
      showMiniGameSummary(result, returnFn);
    });
  }

  // --- Tavern micro-scenes helpers ---
  function ensureTavernState(state) {
    if (!state.tavernSceneCooldowns) state.tavernSceneCooldowns = {};
    if (!state.mappedChambers) state.mappedChambers = {};
    if (!state.calmFocusDays) state.calmFocusDays = 0;
    if (!state.airAwareDays) state.airAwareDays = 0;
  }

  function showCastMoment(moment, returnFn) {
    if (!moment) return false;
    var html = '<div class="readable-screen readable-screen--narrow">';
    html += '<div class="readable-frame">';
    html += '<div class="readable-header">';
    html += '<div class="readable-kicker">Lantern Tavern</div>';
    html += '<div class="readable-title text-glow">' + UI.escapeHtml(moment.title || moment.speakerName || 'Town Talk') + '</div>';
    html += '<hr class="separator-double">';
    if (moment.speakerName) html += '<div class="readable-note">' + UI.escapeHtml(moment.speakerName) + '</div>';
    html += '<div class="readable-lead">' + UI.escapeHtml(moment.text || '') + '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    UI.render(html);

    var choices = (moment.choices || []).map(function (choice) {
      return {
        key: choice.key,
        label: choice.label,
        value: choice.key
      };
    });
    choices.push({ key: '0', label: 'Leave it there', value: 'leave' });
    UI.promptChoice(choices, function (value) {
      if (value === 'leave') {
        UI.transition(returnFn);
        return;
      }
      var selected = null;
      for (var i = 0; i < (moment.choices || []).length; i++) {
        if (moment.choices[i].key === value) {
          selected = moment.choices[i];
          break;
        }
      }
      var summary = selected && selected.result ? selected.result : 'The talk lingers after the glasses stop moving.';
      showMiniGameSummary({
        label: moment.title || 'Town Talk',
        summary: summary
      }, returnFn);
    });
  }

  function maybeRunTavernScene(shop) {
    var state = gs();
    if (!state || !window.NarrativeCast || !window.NarrativeCast.getArcMoment) return false;
    if ((state.totalDays || 0) < 8) return false;
    if (!state.expedition || !state.expedition.moments) return false;
    if ((state.expedition.moments.townVisits || 0) % 3 !== 0) return false;
    var moment = window.NarrativeCast.getArcMoment('william_lynch', state);
    if (!moment) return false;
    showCastMoment(moment, showTownHub);
    return true;
  }

  function getShopMeta(shop, state) {
    return ['Cash ' + UI.formatMoney(state.cash)];
  }

  function buildShopOption(shop, item, idx) {
    var state = gs();
    var owned = item.equipment && item.stateKey && state && state.equipment && state.equipment[item.stateKey];
    var note = item.description || '';
    if (owned) note = 'Already packed.';
    var badge = owned ? 'OWNED' : (item.featured ? 'BEST PICK' : '');
    return {
      key: String(idx),
      label: item.name,
      value: 'buy_' + (idx - 1),
      description: note,
      meta: UI.formatMoney(item.price),
      badge: badge,
      tone: item.featured && !owned ? 'featured' : '',
      disabled: !!owned,
      disabledLabel: item.name + ' is already packed.'
    };
  }

  // ─── Town Hub Screen ─────────────────────────────────────────────
  function showTownHub(callback) {
    townCallback = callback || townCallback;
    var state = gs();
    if (window.Audio_Manager) Audio_Manager.play('town');
    if (state && window.Expedition && window.Expedition.ensureState) {
      window.Expedition.ensureState(state);
      state.expedition.moments.townVisits = (state.expedition.moments.townVisits || 0) + 1;
    }
    var townSnapshot = window.Expedition && window.Expedition.getTownSnapshot ? window.Expedition.getTownSnapshot(state) : null;
    var townLine = window.NarrativeCast && window.NarrativeCast.getTownLine ? window.NarrativeCast.getTownLine('town_hub', state) : null;
    var party = buildPartySnapshot(state);
    var aliveCount = party.filter(function (member) {
      return member && member.alive;
    }).length;
    var townArt = window.AsciiArt && window.AsciiArt.getTownArt ? window.AsciiArt.getTownArt() : getArt('marmaros');

    var html = '';
    html += '<div class="readable-screen">';
    html += '<div class="readable-frame town-hub-screen">';
    if (townArt) {
      html += '<div class="native-art-panel native-art-panel--town">';
      html += '<pre class="title-art title-art--town">' + UI.escapeHtml(townArt) + '</pre>';
      html += '</div>';
    }
    html += '<div class="town-paper">';
    html += '<div class="town-paper-masthead">THE MARMAROS GAZETTE</div>';
    html += '<div class="town-paper-rule"></div>';
    html += '<div class="town-paper-edition">Stone County, Missouri &bull; Evening Edition</div>';
    html += '<div class="town-paper-headline">' + UI.escapeHtml(townSnapshot ? (townSnapshot.paperHeadline || townSnapshot.headline || 'Another shift opens over the Den') : 'Another shift opens over the Den') + '</div>';
    html += '<div class="town-paper-subhead">' + UI.escapeHtml(townSnapshot ? (townSnapshot.paperSubhead || townSnapshot.rumor || 'Stock up, get patched, and head back below.') : 'Stock up, get patched, and head back below.') + '</div>';
    html += '</div>';
    if (townSnapshot && townSnapshot.opportunity) {
      html += '<div class="town-opportunity-callout">';
      html += '<div class="town-opportunity-kicker">Town Talk <span class="town-opportunity-key">T</span></div>';
      html += '<div class="town-opportunity-title">' + UI.escapeHtml(townSnapshot.opportunity.label) + '</div>';
      if (townSnapshot.opportunity.description) {
        html += '<div class="town-opportunity-copy">' + UI.escapeHtml(townSnapshot.opportunity.description) + '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    UI.render(html);

    var options = [
      {
        key: '1',
        group: 'Work',
        label: 'Sell Guano',
        value: 'ship_guano',
        description: state && state.guanoStockpile > 0.01 ? state.guanoStockpile.toFixed(1) + ' tons waiting at the yard.' : 'Yard clear for now.',
        disabled: !(state && state.guanoStockpile > 0.01),
        disabledLabel: 'No load is waiting at the yard.',
        tone: state && state.guanoStockpile > 0.01 ? 'warn' : 'muted',
        badge: state && state.guanoStockpile > 0.01 ? 'READY' : ''
      },
      {
        key: '2',
        group: 'Work',
        label: 'Company Office & Outfitters',
        value: 0,
        description: 'Ledger and supplies.'
      },
      {
        key: '3',
        group: 'Work',
        label: 'Shad Heller\'s Forge',
        value: 1,
        description: 'Steel and warnings.'
      },
      {
        key: '4',
        group: 'Recovery',
        label: "June Ward's Sweet Shop",
        value: 2,
        description: 'Sugar and coffee.'
      },
      {
        key: '5',
        group: 'Recovery',
        label: 'The Lantern Tavern',
        value: 3,
        description: 'Stew and cards.'
      },
      {
        key: '6',
        group: 'Side Shows',
        label: 'Fire In The Hole',
        value: 'fire_in_the_hole',
        description: 'Burning Main Street drill.'
      },
      {
        key: '7',
        group: 'Side Shows',
        label: "Grandfather's Mansion",
        value: 'grandfathers_mansion',
        description: 'Beat the maze.'
      },
      {
      key: '0',
      group: 'Return',
      label: 'Back Underground',
      value: 'leave',
      description: 'Head back to the Den.'
    }];

    function handleTownOpportunity() {
      if (!(townSnapshot && townSnapshot.opportunity)) return;
      var result = townSnapshot.opportunity.apply(state);
      save();
      UI.render(
        '<div class="readable-screen readable-screen--narrow">' +
          '<div class="readable-frame">' +
            '<div class="readable-header">' +
              '<div class="readable-kicker">Town talk</div>' +
              '<div class="readable-title text-glow">' + UI.escapeHtml(townSnapshot.opportunity.label) + '</div>' +
              '<hr class="separator-double">' +
              '<div class="readable-lead">' + UI.escapeHtml(result) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
      UI.pressEnter(function () { UI.transition(showTownHub); });
    }

    UI.promptChoice(options, function (val) {
      if (val === 'leave') {
        if (townCallback) {
          UI.transition(townCallback);
        }
      } else if (val === 'ship_guano') {
        if (window.Screens && window.Screens.shipGuano) {
          window.Screens.shipGuano({
            onComplete: function () { UI.transition(showTownHub); }
          });
        } else {
          UI.transition(showTownHub);
        }
      } else if (val === 'fire_in_the_hole') {
        if (window.Screens && window.Screens.playFireInTheHole) {
          window.Screens.playFireInTheHole({
            trainingMode: true,
            onComplete: function () { UI.transition(showTownHub); }
          });
        } else {
          UI.showNotification('Fire drill unavailable', 1200);
          setTimeout(function () { UI.transition(showTownHub); }, 1300);
        }
      } else if (val === 'grandfathers_mansion') {
        launchTownMiniGame('GrandfathersMansionGame', showTownHub);
      } else {
        var shop = SHOPS[val];
        trackVisit(shop.id);
        UI.transition(function () {
          showShop(shop);
        });
      }
    }, {
      extraKeys: townSnapshot && townSnapshot.opportunity ? {
        t: handleTownOpportunity
      } : null
    });
    var menu = document.getElementById('menu-choices');
    if (menu) menu.classList.add('town-menu-options');
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
    var voice = window.NarrativeCast && window.NarrativeCast.getShopVoice ? window.NarrativeCast.getShopVoice(shop.id, state) : null;
    var html = '<div class="readable-screen readable-screen--narrow">';
    html += '<div class="readable-frame shop-screen shop-screen--' + UI.escapeHtml(shop.id) + '">';
    if (art) {
      html += '<div class="native-art-panel native-art-panel--shop">';
      html += '<pre class="title-art title-art--shop">' + UI.escapeHtml(art) + '</pre>\n';
      html += '</div>';
    }
    html += '<div class="readable-header">';
    html += '<div class="readable-kicker">' + UI.escapeHtml(shop.id === 'sweets' ? 'Sweet Counter' : shop.id === 'tavern' ? 'Lantern Tavern' : shop.id === 'blacksmith' ? 'Forge' : 'Company Supply') + '</div>';
    html += '<div class="readable-title text-glow">' + UI.escapeHtml(shop.name) + '</div>';
    html += '<hr class="separator-double">';
    html += '<div class="readable-lead">' + UI.escapeHtml((voice && voice.line) || randomGreeting(shop)) + '</div>';
    html += '<div class="selection-meta-row">';
    var shopMeta = getShopMeta(shop, state);
    for (var s = 0; s < shopMeta.length; s++) {
      html += '<div class="selection-meta-pill">' + UI.escapeHtml(shopMeta[s]) + '</div>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div></div>';

    UI.render(html);

    // Build menu options
    var menuOptions = [];
    var menuActions = [];
    var idx = 1;

    // Items for sale
    for (var i = 0; i < (shop.items || []).length; i++) {
      var item = shop.items[i];
      var option = buildShopOption(shop, item, idx);
      option.value = 'buy_' + i;
      menuOptions.push(option);
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
    var menu = document.getElementById('menu-choices');
    if (menu) {
      menu.classList.add('shop-menu-options', 'shop-menu-options--' + shop.id);
    }
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
      playerMorale: state ? (state.morale || 50) : 50,
      party: buildPartySnapshot(state)
    };

    // Switch to mini-game music
    if (window.Audio_Manager) Audio_Manager.play('minigame');

    gameObj.start(params, function (result) {
      // Resume town music
      if (window.Audio_Manager) Audio_Manager.play('town');

      if (result) {
        handleMiniGameResult(result);
        showMiniGameSummary(result, function () { showShop(shop); });
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
