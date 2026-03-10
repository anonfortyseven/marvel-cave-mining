(function () {
  'use strict';

  var FIRST_NAMES = {
    male: [
      'Amos', 'August', 'Benjamin', 'Calvin', 'Cassius', 'Charles', 'Clyde', 'Daniel', 'Edgar', 'Elias',
      'Emmett', 'Everett', 'Franklin', 'Gideon', 'Harrison', 'Henry', 'Hugh', 'Isaiah', 'Jasper', 'Joel',
      'Jonah', 'Levi', 'Lucian', 'Luther', 'Marshall', 'Miles', 'Nathaniel', 'Orville', 'Otis', 'Percy',
      'Phineas', 'Reed', 'Roscoe', 'Rufus', 'Samuel', 'Silas', 'Solomon', 'Sterling', 'Thomas', 'Virgil',
      'Walter', 'Warren', 'Wesley', 'Wilbur', 'William', 'Asa', 'Elijah', 'Abram', 'Theodore', 'Felix'
    ],
    female: [
      'Ada', 'Adelaide', 'Alma', 'Beatrice', 'Birdie', 'Clara', 'Cora', 'Daisy', 'Delia', 'Edith',
      'Eleanor', 'Eliza', 'Ellen', 'Elsie', 'Etta', 'Flora', 'Georgia', 'Harriet', 'Hattie', 'Ida',
      'Inez', 'Josephine', 'June', 'Lila', 'Louisa', 'Lucy', 'Mabel', 'Mae', 'Margaret', 'Martha',
      'Matilda', 'Minnie', 'Nellie', 'Nora', 'Olive', 'Pearl', 'Rosalie', 'Ruby', 'Sadie', 'Sarah',
      'Theodora', 'Viola', 'Virginia', 'Winnie', 'Agnes', 'Caroline', 'Della', 'Frances', 'Lenora', 'Opal'
    ]
  };

  var SURNAMES = [
    'Ashby', 'Atwood', 'Barrett', 'Beckett', 'Bell', 'Bishop', 'Boone', 'Bradford', 'Briggs', 'Briscoe',
    'Callahan', 'Carter', 'Chadwick', 'Cole', 'Collins', 'Conley', 'Crockett', 'Dalton', 'Dillard', 'Dorsey',
    'Doyle', 'Durham', 'Ellison', 'Farrow', 'Finch', 'Fletcher', 'Foster', 'Gentry', 'Givens', 'Goodwin',
    'Granger', 'Hale', 'Harlan', 'Harper', 'Hatcher', 'Hollis', 'Holloway', 'Hutchins', 'Ingram', 'Jarvis',
    'Keating', 'Keller', 'Kendrick', 'Langley', 'Lawson', 'Lively', 'Maddox', 'Mercer', 'Merritt', 'Monroe',
    'Nash', 'Norwood', 'Owens', 'Palmer', 'Pritchard', 'Quarles', 'Radford', 'Ramsey', 'Redding', 'Rigsby',
    'Roark', 'Rollins', 'Sawyer', 'Saylor', 'Sheffield', 'Slade', 'Sutton', 'Talbot', 'Tate', 'Templeton',
    'Thayer', 'Tilley', 'Tolliver', 'Vance', 'Waller', 'Ward', 'Whitaker', 'Wilcox', 'Wilder', 'Winslow',
    'Yates', 'Aldridge', 'Barlow', 'Crowley', 'Dawson', 'Fannin', 'Greer', 'Hadley', 'Iverson', 'Jamison',
    'Kincaid', 'Lockhart', 'Mallory', 'Pennington', 'Rutledge', 'Tatum', 'Weatherby', 'Whitlow', 'Workman', 'Yarbrough'
  ];

  var SUFFIXES = ['', '', '', '', 'Jr.', 'Sr.', 'II', 'III', 'IV'];

  var LEAD_TEMPLATES = [
    {
      id: 'mine_foreman',
      gender: 'male',
      title: 'Company Boss',
      professionId: 'mine_foreman',
      traitId: 'ledger_eye',
      traitName: 'Ledger Eye',
      traitNote: 'Better sale price when the sacks start moving.',
      story: 'Joplin boss.',
      effects: ['Safer start', 'Better pay']
    },
    {
      id: 'geologist',
      gender: 'female',
      title: 'Stone Scholar',
      professionId: 'geologist',
      traitId: 'stone_reader',
      traitName: 'Stone Reader',
      traitNote: 'Pulls more haul from the right face of rock.',
      story: 'Reads rich stone.',
      effects: ['More haul', 'Reads rooms']
    },
    {
      id: 'farmer',
      gender: 'female',
      title: 'Hard Season Survivor',
      professionId: 'farmer',
      traitId: 'camp_preacher',
      traitName: 'Camp Preacher',
      traitNote: 'Keeps surface recovery steadier and the crew from turning sour.',
      story: 'Holds steady.',
      effects: ['Better recovery', 'Steadier morale']
    },
    {
      id: 'drifter',
      gender: 'male',
      title: 'No-Past Walker',
      professionId: 'drifter',
      traitId: 'iron_nerve',
      traitName: 'Iron Nerve',
      traitNote: 'Shaves damage when the line goes bad.',
      story: 'No cushion.',
      effects: ['Less damage', 'Big score']
    }
  ];

  var CREW_TEMPLATES = {
    ropeman: [
      {
        id: 'rope_ridge_runner',
        gender: 'male',
        title: 'Ridge Runner',
        traitId: 'sure_footed',
        traitName: 'Sure-Footed',
        traitNote: 'Takes less damage when footing gets ugly.',
        story: 'Good on ladders.',
        effects: ['Less fall damage', 'Strong climber']
      },
      {
        id: 'rope_old_hand',
        gender: 'female',
        title: 'Lead Country Veteran',
        traitId: 'old_hand',
        traitName: 'Old Hand',
        traitNote: 'Cuts a little strain from each underground day.',
        story: 'Lead-country veteran.',
        effects: ['Less strain', 'Steady descents']
      },
      {
        id: 'rope_load_bearer',
        gender: 'male',
        title: 'Load Bearer',
        traitId: 'load_bearer',
        traitName: 'Load Bearer',
        traitNote: 'Boosts haul when the rope stores stay healthy.',
        story: 'Built for weight.',
        effects: ['Higher haul', 'Needs rope']
      },
      {
        id: 'rope_grim_joker',
        gender: 'female',
        title: 'Wakehouse Wit',
        traitId: 'grim_joker',
        traitName: 'Grim Joker',
        traitNote: 'Shaves off pressure and morale loss on hard days.',
        story: 'Keeps them laughing.',
        effects: ['Softer morale loss', 'Less pressure']
      }
    ],
    lampkeeper: [
      {
        id: 'lamp_cold_flame',
        gender: 'female',
        title: 'Cold Flame',
        traitId: 'cold_flame',
        traitName: 'Cold Flame',
        traitNote: 'Burns less oil and keeps better light in foul air.',
        story: 'Spares every drop.',
        effects: ['Uses less oil', 'Safer air']
      },
      {
        id: 'lamp_air_nose',
        gender: 'male',
        title: 'Air Nose',
        traitId: 'air_nose',
        traitName: 'Air Nose',
        traitNote: 'Cuts health strain when the cave air goes mean.',
        story: 'Smells bad air.',
        effects: ['Less bad-air strain', 'Early warning']
      },
      {
        id: 'lamp_night_singer',
        gender: 'female',
        title: 'Night Singer',
        traitId: 'night_singer',
        traitName: 'Night Singer',
        traitNote: 'Turns dark camp nights into better morale and steadier recovery.',
        story: 'Low hymns.',
        effects: ['Better camp morale', 'Stronger rest']
      },
      {
        id: 'lamp_quiet_hands',
        gender: 'male',
        title: 'Quiet Hands',
        traitId: 'quiet_hands',
        traitName: 'Quiet Hands',
        traitNote: 'Protects oil and steadies the line when nerves start jumping.',
        story: 'Quiet mechanic.',
        effects: ['Uses less oil', 'Less panic']
      }
    ]
  };

  var currentDraft = null;

  function hashString(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function createRng(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var x = t;
      x = Math.imul(x ^ x >>> 15, x | 1);
      x ^= x + Math.imul(x ^ x >>> 7, x | 61);
      return ((x ^ x >>> 14) >>> 0) / 4294967296;
    };
  }

  function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function maybeSuffix(rng) {
    var suffix = pick(rng, SUFFIXES);
    return suffix ? (' ' + suffix) : '';
  }

  function makeRunId() {
    var now = Date.now().toString(36);
    var rand = Math.floor(Math.random() * 1679616).toString(36);
    return 'run-' + now + '-' + rand;
  }

  function uniqueName(rng, gender, usedNames, allowSuffix) {
    var firstPool = FIRST_NAMES[gender] || FIRST_NAMES.male;
    var attempts = 0;
    while (attempts < 1000) {
      var name = pick(rng, firstPool) + ' ' + pick(rng, SURNAMES) + (allowSuffix ? maybeSuffix(rng) : '');
      if (!usedNames[name]) {
        usedNames[name] = true;
        return name;
      }
      attempts++;
    }
    return pick(rng, firstPool) + ' ' + pick(rng, SURNAMES);
  }

  function hydrateCandidate(rng, template, slotRole, usedNames, allowSuffix) {
    return {
      id: template.id,
      role: slotRole,
      title: template.title,
      gender: template.gender,
      genderLabel: template.gender === 'female' ? 'Woman' : 'Man',
      name: uniqueName(rng, template.gender, usedNames, allowSuffix),
      professionId: template.professionId || null,
      traitId: template.traitId,
      traitName: template.traitName,
      traitNote: template.traitNote,
      story: template.story,
      effects: template.effects.slice()
    };
  }

  function buildDraft(seedLabel) {
    var seed = seedLabel || makeRunId();
    var rng = createRng(hashString(seed));
    var usedNames = {};

    return {
      runId: seed,
      leads: LEAD_TEMPLATES.map(function (template) {
        return hydrateCandidate(rng, template, 'foreman', usedNames, true);
      }),
      ropeman: CREW_TEMPLATES.ropeman.map(function (template) {
        return hydrateCandidate(rng, template, 'ropeman', usedNames, false);
      }),
      lampkeeper: CREW_TEMPLATES.lampkeeper.map(function (template) {
        return hydrateCandidate(rng, template, 'lampkeeper', usedNames, false);
      }),
      selectedLead: null,
      selectedCrew: {
        ropeman: null,
        lampkeeper: null
      }
    };
  }

  function getDraft() {
    if (!currentDraft) currentDraft = buildDraft();
    return currentDraft;
  }

  function startDraft() {
    currentDraft = buildDraft();
    return currentDraft;
  }

  function getChoices(slot) {
    var draft = getDraft();
    if (slot === 'foreman' || slot === 'lead') return draft.leads.slice();
    return (draft[slot] || []).slice();
  }

  function findChoice(slot, id) {
    var choices = getChoices(slot);
    for (var i = 0; i < choices.length; i++) {
      if (choices[i].id === id) return choices[i];
    }
    return null;
  }

  function selectLead(id) {
    var draft = getDraft();
    draft.selectedLead = findChoice('lead', id);
    return draft.selectedLead;
  }

  function selectCrew(role, id) {
    var draft = getDraft();
    draft.selectedCrew[role] = findChoice(role, id);
    return draft.selectedCrew[role];
  }

  function getSelectedLead() {
    return getDraft().selectedLead || null;
  }

  function getSelectedCrew(role) {
    var draft = getDraft();
    return draft.selectedCrew[role] || null;
  }

  function getProfessionData(professionId) {
    return window.CaveData && window.CaveData.PROFESSIONS ? window.CaveData.PROFESSIONS[professionId] : null;
  }

  function applyMemberProfile(state, slotId, member, candidate) {
    if (!state || !member || !candidate) return;
    member.name = candidate.name;
    member.gender = candidate.gender;
    member.story = candidate.story;
    member.characterTitle = candidate.title;
    member.characterId = candidate.id;
    if (window.Expedition && window.Expedition.ensureState) {
      window.Expedition.ensureState(state);
    }
    if (state.expedition && state.expedition.crew) {
      var profile = state.expedition.crew[slotId] || {};
      profile.role = slotId;
      profile.traitId = candidate.traitId;
      profile.traitName = candidate.traitName;
      profile.traitNote = candidate.traitNote;
      profile.characterId = candidate.id;
      profile.characterTitle = candidate.title;
      profile.story = candidate.story;
      profile.gender = candidate.gender;
      profile.effects = candidate.effects.slice();
      state.expedition.crew[slotId] = profile;
    }
  }

  function applyDraftToState(state) {
    var draft = getDraft();
    if (!state || !draft || !draft.selectedLead) return;
    state.runId = draft.runId;
    state.leadTemplateId = draft.selectedLead.id;
    state.profession = draft.selectedLead.professionId || state.profession;
    applyMemberProfile(state, 'foreman', state.foreman, draft.selectedLead);
    if (draft.selectedCrew.ropeman && state.crew[0]) {
      state.crew[0].role = 'ropeman';
      applyMemberProfile(state, 'ropeman', state.crew[0], draft.selectedCrew.ropeman);
    }
    if (draft.selectedCrew.lampkeeper && state.crew[1]) {
      state.crew[1].role = 'lampkeeper';
      applyMemberProfile(state, 'lampkeeper', state.crew[1], draft.selectedCrew.lampkeeper);
    }
  }

  function buildLeadScoreDetails(state) {
    if (!state) return {};
    return {
      runId: state.runId || '',
      leadTemplateId: state.leadTemplateId || '',
      profession: state.profession || '',
      leadTitle: state.foreman && state.foreman.characterTitle ? state.foreman.characterTitle : '',
      roster: [
        state.foreman ? state.foreman.name : '',
        state.crew && state.crew[0] ? state.crew[0].name : '',
        state.crew && state.crew[1] ? state.crew[1].name : ''
      ]
    };
  }

  window.Characters = {
    startDraft: startDraft,
    getDraft: getDraft,
    getChoices: getChoices,
    selectLead: selectLead,
    selectCrew: selectCrew,
    getSelectedLead: getSelectedLead,
    getSelectedCrew: getSelectedCrew,
    applyDraftToState: applyDraftToState,
    getProfessionData: getProfessionData,
    buildScoreDetails: buildLeadScoreDetails
  };
})();
