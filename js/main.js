/* ============================================
   Main.js - Entry Point & Game Flow Controller
   The Marvel Cave Mining Company
   ============================================ */

(function () {
  'use strict';

  var initialized = false;

  // Master screen flow states
  var FLOW = {
    TITLE: 'title',
    PROFESSION: 'profession',
    CREW: 'crew',
    SEASON: 'season',
    STORE: 'store',
    GAMEPLAY: 'gameplay',
    EVENT: 'event',
    ENDING: 'ending',
    SCORING: 'scoring',
    GAMEOVER: 'gameover',
    TOWN: 'town'
  };

  var currentFlow = FLOW.TITLE;

  function init() {
    if (initialized) return;
    initialized = true;

    // Verify critical elements exist
    var screen = document.getElementById('screen');
    if (!screen) {
      document.body.innerHTML = '<div style="color:red;padding:20px">Error: #screen element not found</div>';
      return;
    }

    // Start with title screen
    currentFlow = FLOW.TITLE;
    if (window.Screens && window.Screens.title) {
      window.Screens.title();
    } else {
      screen.innerHTML = '<div class="text-center text-glow" style="margin-top:60px">' +
        'The Marvel Cave Mining Company<br><br>' +
        '<span class="text-dim">Loading...</span></div>';
    }
  }

  // Navigate to a specific screen
  function goTo(screenName, data) {
    currentFlow = screenName;

    if (!window.Screens) return;

    switch (screenName) {
      case FLOW.TITLE:
        UI.fadeTransition(function () { Screens.title(); });
        break;
      case FLOW.PROFESSION:
        UI.fadeTransition(function () { Screens.profession(); });
        break;
      case FLOW.CREW:
        UI.fadeTransition(function () { Screens.crew(); });
        break;
      case FLOW.SEASON:
        UI.fadeTransition(function () { Screens.season(); });
        break;
      case FLOW.STORE:
        UI.fadeTransition(function () { Screens.store(); });
        break;
      case FLOW.GAMEPLAY:
        UI.fadeTransition(function () { Screens.status(); });
        break;
      case FLOW.EVENT:
        UI.fadeTransition(function () { Screens.event(data); });
        break;
      case FLOW.ENDING:
        UI.fadeTransition(function () { Screens.ending(data); });
        break;
      case FLOW.SCORING:
        UI.fadeTransition(function () { Screens.scoring(); });
        break;
      case FLOW.GAMEOVER:
        UI.fadeTransition(function () { Screens.gameOver(data); });
        break;
      case FLOW.TOWN:
        UI.fadeTransition(function () { if (window.Town) Town.show(function () { Screens.status(); }); });
        break;
    }
  }

  // Get current flow state
  function getCurrentFlow() {
    return currentFlow;
  }

  // Trigger initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

  // Public API
  window.Main = {
    init: init,
    goTo: goTo,
    getCurrentFlow: getCurrentFlow,
    FLOW: FLOW
  };

})();
