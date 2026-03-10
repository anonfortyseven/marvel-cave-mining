(function () {
  'use strict';

  var CAST = {
    jed_campbell: {
      id: 'jed_campbell',
      displayName: 'Jedidiah Campbell',
      firstRevealName: 'Jed Campbell',
      anchorLocation: 'Company office by the weigh station',
      voiceRules: [
        'Formal and controlled.',
        'Speaks like a contract with a pulse.',
        'Gets more careful as the run thins out.'
      ],
      rolesOwned: ['company office', 'weigh-ins', 'settlement', 'outfitting', 'official notices'],
      arcStages: ['confident', 'careful', 'disoriented'],
      headlinePools: [],
      eventHooks: ['company advance', 'infrastructure loss', 'crew liability'],
      shopHooks: ['general_store'],
      crewHooks: ['crew_safety']
    },
    shad_heller: {
      id: 'shad_heller',
      displayName: 'Shad Heller',
      firstRevealName: 'Shad Heller',
      anchorLocation: 'Forge and mayor\'s bench',
      voiceRules: [
        'Short and declarative.',
        'Dry humor only.',
        'Drops into civic formality when the town is at stake.'
      ],
      rolesOwned: ['forge', 'old cave truth', 'town safety', 'civic matters'],
      arcStages: ['practical', 'truth_teller', 'staying_put'],
      headlinePools: [],
      eventHooks: ['bad rope', 'damage', 'Bald Knobber talk'],
      shopHooks: ['blacksmith'],
      crewHooks: ['route_warning']
    },
    june_ward: {
      id: 'june_ward',
      displayName: 'June Ward',
      firstRevealName: 'June Ward',
      anchorLocation: 'Sweet shop counter by the hotel porch',
      voiceRules: [
        'Quick and specific.',
        'Warm without getting soft.',
        'Funny because she notices too much.'
      ],
      rolesOwned: ['sweets', 'taffy pull', 'Gazette voice', 'town warmth', 'comic relief'],
      arcStages: ['bright', 'watchful', 'quiet'],
      headlinePools: [
        'MARMAROS BEGINS ANOTHER DAY AT THE DEN',
        'CAVE ROAD STIRS EARLY ON ROARK MOUNTAIN',
        'COMPANY YARD OPENS FOR ANOTHER SHIFT',
        'STORE, FORGE, AND TAVERN KEEP THE CAMP IN MOTION',
        'OZARK MINING CAMP TAKES THE DAY AS IT COMES',
        'LAMPS GO DOWN AGAIN BENEATH THE RIDGE',
        'MARMAROS KEEPS ITS PORCHES FULL AND ITS WAGONS MOVING',
        'ANOTHER CONTRACT DAY OPENS OVER MARVEL CAVE'
      ],
      eventHooks: ['crew sickness', 'morale drift', 'town headlines'],
      shopHooks: ['sweets', 'taffy'],
      crewHooks: []
    },
    william_lynch: {
      id: 'william_lynch',
      displayName: 'William Lynch',
      firstRevealName: 'The well-dressed stranger',
      anchorLocation: 'Never the same place twice',
      voiceRules: [
        'Measured and observant.',
        'Asks questions instead of giving speeches.',
        'Feels slightly out of register with Marmaros.'
      ],
      rolesOwned: ['future-facing outsider scenes', 'tavern observations', 'late-run reframe'],
      arcStages: ['stranger', 'named', 'future_reader'],
      headlinePools: [],
      eventHooks: ['tavern scene', 'hotel porch scene', 'cave-mouth scene'],
      shopHooks: ['tavern'],
      crewHooks: []
    }
  };

  var STORY_DEFAULTS = {
    cast: {
      jedStage: 0,
      shadStage: 0,
      juneStage: 0,
      lynchStage: 0,
      lynchKnown: false,
      shadProjectStage: 0,
      lastJuneCrewMention: '',
      lastJedConcernBeat: '',
      lastTownSpeakerByLocation: {},
      lynchEarlySeen: false,
      lynchMidSeen: false,
      lynchLateSeen: false
    }
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pick(arr, idx) {
    if (!arr || !arr.length) return '';
    if (typeof idx === 'number') return arr[idx % arr.length];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getDay(state) {
    return state && typeof state.totalDays === 'number' ? state.totalDays : 0;
  }

  function hauled(state) {
    return ((state && state.guanoShipped) || 0) + ((state && state.guanoStockpile) || 0);
  }

  function crewDeaths(state) {
    if (!state) return 0;
    var dead = state.foreman && !state.foreman.alive ? 1 : 0;
    for (var i = 0; i < (state.crew || []).length; i++) {
      if (!state.crew[i].alive) dead++;
    }
    return dead;
  }

  function lowestLivingCrew(state) {
    if (!state) return null;
    var pool = [];
    if (state.foreman && state.foreman.alive) pool.push(state.foreman);
    for (var i = 0; i < (state.crew || []).length; i++) {
      if (state.crew[i].alive) pool.push(state.crew[i]);
    }
    if (!pool.length) return null;
    pool.sort(function (a, b) { return (a.health || 0) - (b.health || 0); });
    return pool[0];
  }

  function getDeadMember(state) {
    if (!state) return null;
    if (state.foreman && !state.foreman.alive) return state.foreman;
    for (var i = 0; i < (state.crew || []).length; i++) {
      if (!state.crew[i].alive) return state.crew[i];
    }
    return null;
  }

  function ensureState(state) {
    if (!state) return;
    if (!state.story) state.story = clone(STORY_DEFAULTS);
    if (!state.story.cast) state.story.cast = clone(STORY_DEFAULTS.cast);
    syncStages(state);
  }

  function syncStages(state) {
    if (!state) return;
    if (!state.story) state.story = clone(STORY_DEFAULTS);
    if (!state.story.cast) state.story.cast = clone(STORY_DEFAULTS.cast);
    var cast = state.story.cast;
    var day = getDay(state);
    var totalHaul = hauled(state);
    var deaths = crewDeaths(state);

    cast.jedStage = totalHaul >= 3.5 ? 1 : 0;
    if (day >= 13 || (day >= 9 && totalHaul < 1.8)) cast.jedStage = 2;

    cast.shadStage = day >= 7 ? 1 : 0;
    if (day >= 14 || deaths > 0) cast.shadStage = 2;

    cast.juneStage = day >= 6 ? 1 : 0;
    if (deaths > 0 || day >= 15) cast.juneStage = 2;

    cast.lynchStage = 0;
    if (cast.lynchKnown || cast.lynchMidSeen) cast.lynchStage = 1;
    if (cast.lynchLateSeen || day >= 16) cast.lynchStage = 2;

    cast.shadProjectStage = 0;
    if (day >= 8) cast.shadProjectStage = 1;
    if (day >= 15) cast.shadProjectStage = 2;
  }

  function getCharacter(id) {
    return CAST[id] || null;
  }

  function getJedVoice(state, shopId) {
    syncStages(state);
    var stage = state.story.cast.jedStage;
    if (shopId === 'general_store') {
      if (stage === 0) {
        return 'Campbell taps the rope coils. "Buy enough. I prefer ledgers to condolences."';
      }
      if (stage === 1) {
        return 'Campbell checks the manifest first. "Keep the lamps full. Thin margins make careless men."';
      }
      return 'Campbell lowers his voice. "The company still expects a fair return. Bring back a clean one."';
    }
    if (stage === 0) return 'Campbell means the contract and believes the cave will keep its side of it.';
    if (stage === 1) return 'Campbell sounds steady. His eyes keep going to the scales.';
    return 'Campbell has stopped speaking in promises. He talks in positions, terms, and what may still be recoverable.';
  }

  function getShadVoice(state, shopId) {
    syncStages(state);
    var stage = state.story.cast.shadStage;
    var projectStage = state.story.cast.shadProjectStage;
    if (shopId === 'blacksmith') {
      if (stage === 0) return 'Shad glances at your tools once. "Steel is fine. Rope probably isn\'t. Happens."';
      if (stage === 1) return 'Shad sets a piton on the anvil. "Three men worked that squeeze last spring. Two came up. Buy better iron."';
      if (projectStage >= 2) return 'Shad is heating long curved letters in the back of the forge. He does not explain them. "Town\'ll need a new sign soon enough."';
      return 'Shad keeps hammering while he talks. "The cave doesn\'t hate you. It just does not care how much you paid to come here."';
    }
    if (projectStage >= 2) return 'Shad has a plan for Marmaros after the sacks stop moving. He does not dress it up as hope.';
    return 'Shad answers like a man handing over a tool: brief, solid, and not interested in hearing it admired.';
  }

  function getJuneVoice(state, context) {
    syncStages(state);
    var stage = state.story.cast.juneStage;
    var dead = getDeadMember(state);

    if (context === 'sweets') {
      if (dead && stage >= 2) return 'June slides a paper sack across the counter. "Sugar will not fix town talk, but it helps while people are having it."';
      if (stage >= 2) return 'June taps the candy jar. "When the money gets thin, people either pray or chew. I can help with the second one."';
      if (stage >= 1) return 'June grins without looking up from the molasses slab. "If the cave has the line in a temper, I sell the cure by the ounce."';
      return 'June breaks a peppermint stick in two. "Marmaros runs on bad bets, good sugar, and whoever still laughs last."';
    }
    if (context === 'taffy') {
      return 'June hooks the warm taffy high and grins sideways. "You pull sugar long enough, you learn patience. Same as rope work, only sweeter."';
    }
    if (dead && stage >= 2) {
      return 'June keeps the joke light and the pause long. "Town feels smaller when a lamp comes back missing the hand behind it."';
    }
    return 'June has the local gift of making welcome sound like a joke at your expense and somehow kinder for it.';
  }

  function getLynchDisplayName(state) {
    ensureState(state);
    return state.story.cast.lynchKnown ? CAST.william_lynch.displayName : CAST.william_lynch.firstRevealName;
  }

  function getLynchSighting(state) {
    syncStages(state);
    var cast = state.story.cast;
    var townVisits = state.expedition && state.expedition.moments ? (state.expedition.moments.townVisits || 0) : 0;
    var sightings = [
      'A well-dressed stranger stands on the hotel porch counting cave wagons instead of clouds.',
      'The stranger from the porch is by the cave mouth now, looking up more than down.',
      'Lynch pauses in the middle of town as if he can already see what comes after the wagons.'
    ];
    if (cast.lynchLateSeen || cast.lynchStage >= 2) return sightings[2];
    if (cast.lynchMidSeen || cast.lynchStage >= 1) return sightings[1];
    return sightings[townVisits % 2];
  }

  function getPaperSubhead(state) {
    var season = state && state.season ? state.season : 'fall';
    var dead = crewDeaths(state);
    var totalHaul = hauled(state);
    var fireSeen = !!(state && state.expedition && state.expedition.moments && state.expedition.moments.setPiecesSeen.fire_in_the_hole);

    if (dead > 0) {
      return 'Neighbors speak softly, but the yard and the porches keep their watch.';
    }
    if (fireSeen) {
      return 'Main Street is set in order again and the bucket-line talk has not yet settled.';
    }
    if (totalHaul >= 3.5) {
      return 'Good loads at the scales have given the whole camp something to discuss.';
    }
    if (season === 'spring') {
      return 'Spring mud, cave wages, and hill talk are all moving at once.';
    }
    if (season === 'summer') {
      return 'Warm weather keeps the street busy and the cave road busier still.';
    }
    if (season === 'winter') {
      return 'Cold weather sharpens every errand from the company yard to the forge.';
    }
    return 'Store counter, forge fire, and hotel porch all keep pace with the cave road.';
  }

  function getHeadline(state) {
    syncStages(state);
    var townVisits = state.expedition && state.expedition.moments ? (state.expedition.moments.townVisits || 0) : 0;
    var headlinePool = CAST.june_ward.headlinePools.slice();
    if (crewDeaths(state) > 0) {
      headlinePool = [
        'MARMAROS KEEPS ITS PORCH LIGHTS LATE TONIGHT',
        'A HARD DAY BELOW BRINGS A QUIETER EVENING TO CAMP',
        'TOWN SPEAKS LOW AFTER HARD NEWS FROM THE CAVE'
      ];
    } else if (hauled(state) >= 3.5) {
      headlinePool = [
        'FULLER SACKS DRAW A CROWD TO THE SCALES',
        'GOOD LOADS PUT THE COMPANY YARD IN FINE HUMOR',
        'MARMAROS SEES A BETTER DAY AT THE WEIGH STATION'
      ];
    } else if (state.expedition && state.expedition.moments && state.expedition.moments.setPiecesSeen.fire_in_the_hole) {
      headlinePool = [
        'MAIN STREET SET RIGHT AGAIN AFTER THE FIRE',
        'BUCKET BRIGADE STILL EARNS PRAISE IN MARMAROS',
        'TOWN TAKES STOCK AFTER A NIGHT OF FIRE AND WATER'
      ];
    }
    return {
      paperHeadline: pick(headlinePool, townVisits),
      paperSubhead: getPaperSubhead(state),
      headline: pick([
        'Marmaros keeps one eye on the cave road and one on the scales.',
        'The camp runs on wagons, weather, and whatever comes back up the Den.',
        'By supper the whole ridge usually knows how the day below has gone.'
      ], townVisits),
      rumor: getLynchSighting(state)
    };
  }

  function getShopVoice(shopId, state) {
    syncStages(state);
    if (shopId === 'general_store') {
      return {
        speakerId: 'jed_campbell',
        speakerName: CAST.jed_campbell.displayName,
        line: getJedVoice(state, shopId)
      };
    }
    if (shopId === 'blacksmith') {
      return {
        speakerId: 'shad_heller',
        speakerName: CAST.shad_heller.displayName,
        line: getShadVoice(state, shopId)
      };
    }
    if (shopId === 'sweets') {
      return {
        speakerId: 'june_ward',
        speakerName: CAST.june_ward.displayName,
        line: getJuneVoice(state, 'sweets')
      };
    }
    if (shopId === 'tavern') {
      return {
        speakerId: 'william_lynch',
        speakerName: getLynchDisplayName(state),
        line: 'The stranger in the good coat has taken the quietest table in the room.'
      };
    }
    return null;
  }

  function getTownLine(context, state) {
    syncStages(state);
    if (context === 'company_advance') {
      return {
        speakerId: 'jed_campbell',
        speakerName: CAST.jed_campbell.displayName,
        line: 'Campbell initials the advance in one motion. "Settled against final pay. I trust that is understood."'
      };
    }
    if (context === 'town_hub') {
      return {
        speakerId: 'june_ward',
        speakerName: CAST.june_ward.displayName,
        line: getHeadline(state).headline
      };
    }
    return null;
  }

  function getArcMoment(characterId, state) {
    syncStages(state);
    var cast = state.story.cast;
    var day = getDay(state);
    var townVisits = state.expedition && state.expedition.moments ? (state.expedition.moments.townVisits || 0) : 0;

    if (characterId === 'william_lynch') {
      if (!cast.lynchEarlySeen && townVisits >= 1 && day >= 2) {
        cast.lynchEarlySeen = true;
        cast.lastTownSpeakerByLocation.tavern = 'william_lynch';
        return {
          speakerId: 'william_lynch',
          speakerName: CAST.william_lynch.firstRevealName,
          title: 'A Stranger At The Lantern',
          text: 'A courteous man in travel clothes asks whether the Cathedral Room feels larger in person than in rumor. He does not ask what the guano weighs. He asks what the room feels like when the lamps are low.',
          choices: [
            { key: '1', label: 'Tell him it is bigger than any story.', result: 'He thanks you and asks no second question, which somehow makes the first one linger.' },
            { key: '2', label: 'Tell him miners do not work by wonder.', result: 'He smiles politely. "No. But towns sometimes do."' }
          ]
        };
      }
      if (!cast.lynchMidSeen && townVisits >= 3 && day >= 8) {
        cast.lynchMidSeen = true;
        cast.lynchKnown = true;
        cast.lastTownSpeakerByLocation.tavern = 'william_lynch';
        return {
          speakerId: 'william_lynch',
          speakerName: CAST.william_lynch.displayName,
          title: 'William Lynch Introduces Himself',
          text: 'The stranger finally offers his card: William Lynch, from Canada. He asks how quickly the upper deposits have thinned and whether anyone has ever charged simply to let people look.',
          choices: [
            { key: '1', label: 'Answer the first question.', result: 'Lynch listens like a surveyor, not a gossip.' },
            { key: '2', label: 'Answer the second.', result: 'Lynch nods once. "Then perhaps the wrong thing is being weighed in Marmaros."' }
          ]
        };
      }
      if (!cast.lynchLateSeen && townVisits >= 5 && day >= 15) {
        cast.lynchLateSeen = true;
        cast.lynchKnown = true;
        cast.lastTownSpeakerByLocation.tavern = 'william_lynch';
        return {
          speakerId: 'william_lynch',
          speakerName: CAST.william_lynch.displayName,
          title: 'Lynch On The Ridge',
          text: 'Lynch stands where he can see the sinkhole and the road at once. "You have all been measuring the cave by what can be hauled out of it," he says. "That is one measure. It is not the only one."',
          choices: [
            { key: '1', label: 'Ask what he means.', result: 'He looks back toward town. "Ask me again when the ledgers stop looking healthy."' },
            { key: '2', label: 'Tell him guano still pays.', result: 'He agrees at once. "Yes. For now."' }
          ]
        };
      }
      return null;
    }
    return null;
  }

  window.NarrativeCast = {
    getCharacter: getCharacter,
    ensureState: ensureState,
    syncStages: syncStages,
    getTownLine: getTownLine,
    getHeadline: getHeadline,
    getArcMoment: getArcMoment,
    getShopVoice: getShopVoice,
    getLynchDisplayName: getLynchDisplayName
  };
})();
