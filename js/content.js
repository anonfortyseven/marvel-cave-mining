/*
 * content.js
 * The Marvel Cave Mining Company
 * All game text: descriptions, event messages, dialogue, death messages,
 * educational content, and easter eggs.
 * Globals: window.Content
 */
(function () {
  'use strict';

  // ─── Educational Landmark Descriptions ───────────────────────────
  // Oregon Trail style "You have reached..." text for each chamber
  var LANDMARK_TEXT = {
    marmaros: [
      'You have arrived at Marmaros.',
      '',
      'Twenty-eight souls cling to this ridgetop like moss',
      'on a headstone. A hotel that is mostly roof. A general',
      'store that smells of lye and ambition. A shed where a',
      'man will weigh your guano and lie about the scales.',
      '',
      'Mule teams stamp in the mud by the cave mouth, waiting',
      'to drag another load of bat dung down to Branson. The',
      'Greek word for marble -- that is what they named this',
      'place, after the Blow expedition mistook limestone for',
      'something worth having.',
      '',
      'The Bald Knobbers ride these hills after dark. Keep',
      'your lantern lit and your business to yourself.'
    ],
    cathedral_entrance: [
      'You stand at the mouth of the Devil\'s Den.',
      '',
      'Forty feet across, the sinkhole yawns in the forest',
      'floor like a wound that will not close. The Osage',
      'carved warnings into the trees -- a sideways V that',
      'meant: do not enter. They said a young brave fell',
      'here chasing a bear and the earth swallowed him whole.',
      '',
      'Rope ladders and crude timber rigging descend into',
      'a darkness so complete it seems to drink your lantern',
      'light. The air rising from below is fifty-eight degrees',
      'and smells of centuries.',
      '',
      'The drop is two hundred feet. The largest cave',
      'entrance room in America waits at the bottom.',
      'In 1541, Spanish conquistadors lowered themselves',
      'on notched pine logs. Some came back up. Some did not.'
    ],
    the_sentinel: [
      'Before you stands The Sentinel.',
      '',
      'Thirty feet of calcite risen from the cavern floor,',
      'built one patient drip at a time over millennia. It',
      'stands where stalactite met stalagmite and fused into',
      'a column that looks, in the lantern-flicker, almost',
      'like something keeping watch.',
      '',
      'The guides tell tourists it is the only thing holding',
      'up the Cathedral Room ceiling. The tourists believe',
      'them. Your crew tips their hats as they pass, a habit',
      'no one remembers starting.',
      '',
      'Old tobacco offerings sit at its base. Osage, some',
      'say. Others say the miners leave them. No one claims',
      'to have seen who.'
    ],
    cathedral_floor: [
      'You stand on the floor of the Cathedral Room.',
      '',
      'Two acres of darkness. The ceiling is two hundred',
      'feet overhead and lost to shadow -- you could stand',
      'the Statue of Liberty in here and she would not',
      'scrape her torch. Your lantern is a candle in a',
      'cathedral built by water and time.',
      '',
      'The guano lies thick in places. Centuries of it,',
      'deposited by the gray bat colonies that spiral',
      'from the sinkhole at dusk in a living tornado',
      'that takes twenty minutes to pass. The smell hits',
      'your throat like a fist.',
      '',
      'Atop the 124-foot debris pile called the Underground',
      'Mountain, the bones of animals that fell through the',
      'sinkhole over millennia lie mixed with the dung of',
      'eighty thousand bats. This is what you came for.',
      'God help you.'
    ],
    serpentine_passage: [
      'You enter the Serpentine Passage.',
      '',
      'The Cathedral Room releases you into a gut of stone',
      'barely six feet high, twisting like something alive.',
      'The walls are scalloped smooth by ancient pressurized',
      'water that bored through this bedrock a million years',
      'before you were born.',
      '',
      'Every sack of guano you harvest must come back',
      'through here on a man\'s shoulders. One sack at a',
      'time. Fifty pounds each. The passage does not care',
      'about your schedule.',
      '',
      'The walls are scarred with pick marks from miners',
      'who tried to widen it. The limestone won.'
    ],
    egyptian_room: [
      'You have entered the Egyptian Room.',
      '',
      'The ceiling here is flat and polished like the sole',
      'of a giant\'s boot. In 1869, the Blow expedition held',
      'up their lanterns and declared it pure marble. It was',
      'ordinary Mississippian limestone. But the mistake gave',
      'this cave its name and its fortune.',
      '',
      'Miriam and Genevieve Lynch, daughters of the man who',
      'bought the cave, named the formations: King Tut\'s',
      'Sarcophagus. Cleopatra\'s Sandal. The Sphinx\'s Nose.',
      'They were girls playing make-believe three hundred',
      'feet underground. The names stuck.',
      '',
      'Lynch charged tourists fifty cents to see this room.',
      'Then the guano trade paid better, and the tourists',
      'stopped coming. Now you are here with a shovel instead',
      'of a lantern tour.'
    ],
    gulf_of_doom: [
      'You stand at the edge of the Gulf of Doom.',
      '',
      'A hundred-foot vertical shaft drops beneath the heel',
      'of the Egyptian Room into nothing. Drop a stone and',
      'listen. You will not hear it land. The bottom is a',
      'deep slurry of cavern clay and nitrogen-rich guano',
      'that swallows everything without sound.',
      '',
      'The richest deposits in the cave crust the ledges',
      'around the rim. Three miners have fallen here. Their',
      'lanterns were found. The men were not.',
      '',
      'Early explorers called this pit bottomless, and they',
      'were not entirely wrong. Some depths are not meant',
      'to be measured.'
    ],
    fat_mans_misery: [
      'You have reached Fat Man\'s Misery.',
      '',
      'Four feet seven inches of headroom. Seven feet of',
      'passage. You must turn sideways, empty your lungs,',
      'and shuffle through an inch at a time while the',
      'Ozarks press against your chest and spine.',
      '',
      'They say a three-hundred-pound man got wedged here',
      'so tight his crew greased him with lard and hauled',
      'him out with rope. They say he never went underground',
      'again. They say a lot of things in Marmaros.',
      '',
      'Beyond this point, the cave does not let go easily.',
      'Check your oil. Check your rope. Check your nerve.'
    ],
    the_dungeon: [
      'You have entered The Dungeon.',
      '',
      'The ceiling drops to four feet. Iron oxide leaches',
      'through the limestone in thick rust-colored streaks',
      'that look, in your lantern light, exactly like dried',
      'blood running down the walls.',
      '',
      'Cave guides told tourists this was a Spanish torture',
      'chamber. It was not. It is just stone bleeding iron,',
      'the way stone does when water has ten thousand years',
      'to work. But the ammonia is real, and the air burns',
      'your eyes and throat.',
      '',
      'A guttering candle flame means bad air. If it goes',
      'out, you leave. There is no negotiating with carbon',
      'dioxide. It pools in low places and waits.'
    ],
    spring_room: [
      'You have found the Spring Room.',
      '',
      'Hidden behind The Sentinel through a crevice most men',
      'walk past without seeing, the walls here blaze with',
      'orange calcite so vivid it looks painted. Concealed',
      'waterfalls cascade over terraced stone, filling the',
      'chamber with a sound like heavy rain.',
      '',
      'Sixteenth-century Spaniards heard this water and saw',
      'these glowing walls and believed they had found the',
      'Fountain of Youth. They had not. But you can see how',
      'a man might think so.',
      '',
      'The water is fifty-six degrees, clear as glass, and',
      'safe to drink. Miners have carved their names here.',
      'Some of the names are very old. Some are in languages',
      'you do not recognize.'
    ],
    blondies_throne: [
      'You have reached Blondie\'s Throne.',
      '',
      'A massive flowstone formation rises from the chamber',
      'floor in undulating tiers, shaped like a high-backed',
      'chair designed by a patient god. Thick guano deposits',
      'surround it on all sides.',
      '',
      'They named it for young Charles "Blondie" Smallwood,',
      'who got separated from his tour group and was found',
      'hours later fast asleep in the flowstone\'s embrace,',
      'blonde hair dusty with calcite, dreaming whatever',
      'children dream three hundred feet underground.',
      '',
      'The guano here is rich. The bats thick. The air foul.',
      'But there is something about this room that makes men',
      'speak in whispers, as if someone is still sleeping.'
    ],
    cloud_room: [
      'You have entered the Cloud Room.',
      '',
      'The ceiling changes here. The smooth limestone gives',
      'way to porous dolomite, pocked and undulating like a',
      'bank of storm clouds frozen in stone. Below this false',
      'sky, the richest guano deposits in the upper cave',
      'lie several feet deep.',
      '',
      'The ammonia is a living thing in this room. It fills',
      'your skull and burns your lungs. Without a cloth over',
      'your face you can endure maybe thirty minutes before',
      'the coughing starts. A year from now, some of these',
      'men will have a cough that never leaves.',
      '',
      'They will call it bat fever. The disease is really',
      'histoplasmosis -- a fungus that lives in the guano',
      'dust. No one will identify it for another sixty years.'
    ],
    mammoth_room: [
      'You have entered the Mammoth Room.',
      '',
      'The shrieking hits you first. Forty thousand gray bats',
      'packed shoulder to shoulder on the ceiling, every one',
      'of them screaming. The sound is not of this world. It',
      'fills the enormous unlit chamber with a vibration you',
      'feel in your teeth.',
      '',
      'This room is deliberately left dark. No permanent',
      'lights. The bats are federally endangered and this is',
      'their hibernaculum. At dusk they pour from the sinkhole',
      'in a spiraling vortex that devours twenty-four million',
      'insects a night.',
      '',
      'It was here, in 1869, that the Blow expedition found',
      'the Spanish ladders -- notched pine logs left by',
      'conquistadors three centuries earlier. Still standing.',
      'Still holding. The wood remembers what the men forgot.'
    ],
    lost_river: [
      'You have discovered the Lost River.',
      '',
      'It surfaces from a crack in the rock like a secret',
      'told under duress, flows fifty feet through open air,',
      'and plunges back into the stone without explanation.',
      'No one knows where it comes from. No one knows where',
      'it goes. Dye tests have failed.',
      '',
      'The water level rises without warning. A change in',
      'the sound -- deeper, more resonant -- means a surge',
      'is coming from upstream. When the surface rains, the',
      'water percolates through the karst and this river',
      'becomes a fury that fills passages to the ceiling.',
      '',
      'Respect the river. It was here before the cave had',
      'a name, and it will be here after the name is forgotten.'
    ],
    lake_genevieve: [
      'You have reached Lake Genevieve.',
      '',
      'A perfectly still underground lake, thirty-four feet',
      'deep, reflects your lantern like a black mirror. The',
      'water is so clear and so motionless that you cannot',
      'tell where air ends and water begins until your boot',
      'breaks the surface.',
      '',
      'William Henry Lynch named it for his daughter. Sub-',
      'aquatic surveys have mapped passages plunging to a',
      'hundred and ten feet below the surface. Most remain',
      'unexplored. The silt-outs are too dangerous.',
      '',
      'Coins dropped by early tourists still glint on the',
      'ledges below. Sometimes, in the stillness, something',
      'pale and eyeless moves beneath the surface. It is',
      'only the cavefish. Probably.'
    ],
    lake_miriam: [
      'You have discovered Lake Miriam.',
      '',
      'The passage to reach it requires wading chest-deep',
      'through fifty-six-degree water for thirty yards in',
      'absolute darkness. Most men turn back. The ones who',
      'do not find a chamber so silent that their own pulse',
      'sounds like drumming.',
      '',
      'Lynch named this one for his other daughter. Miriam',
      'never saw it. Neither did Genevieve. The names were',
      'given from the surface, by a father who loved his',
      'children more than he understood the dark.',
      '',
      'Few miners come this far. Those who do sit for a',
      'while in the silence and then leave without speaking.',
      'Some say the weight of the earth above squeezes all',
      'urgency from the world. Others say the cave is',
      'listening, and they do not want to be heard.'
    ],
    waterfall_room: [
      'You have reached the Waterfall Room.',
      '',
      'Five hundred and five feet below the surface. The',
      'deepest accessible point. A fifty-foot waterfall fed',
      'by the Lost River plunges into a mist-shrouded pool',
      'with a roar that fills your chest like a second heart.',
      '',
      'Everything is slick. Every surface treacherous. The',
      'mist soaks through your clothes in minutes and the',
      'fifty-eight-degree air begins its patient work on',
      'your body heat.',
      '',
      'The guano here is the richest in the cave and the',
      'most dangerous to reach. Only the bravest or most',
      'desperate miners worked this room. The premium they',
      'earned was paid in broken bones and ruined lungs.',
      '',
      'Somewhere behind the falls, the rock is marked with',
      'symbols that do not match any known alphabet. They',
      'are very old. They may be older than the cave itself.'
    ]
  };

  // ─── Random Event Messages ───────────────────────────────────────
  var EVENT_MESSAGES = {
    cave_in: [
      'A sound like God clearing His throat. The ceiling comes down.',
      'The timber supports groan, then scream, then snap. Run.',
      'No warning. Just weight. Tons of Ozark limestone where air used to be.',
      'The ground shudders and a wall of rubble seals the passage behind you like a tomb.',
      'Cracks race across the ceiling like lightning frozen in stone. You dive. Not everyone does.'
    ],
    bat_swarm: [
      'The ceiling comes alive. Forty thousand wings and forty thousand screams.',
      'A river of bats pours through the passage. You cannot see. You cannot hear. You can only endure.',
      'Your lantern startles the colony and they erupt -- a shrieking, churning cloud of leather and teeth.',
      'The swarm hits you like weather. Like a storm made of bones and rage.',
      'They pour past you for twenty minutes. You count the seconds because counting is all you can do.'
    ],
    bad_air: [
      'The candle flame shrinks to a blue whisper. Get out.',
      'Ammonia so thick you can taste it. Your eyes stream. Your lungs rebel.',
      'A sweetness in the air that should not be there. Carbonic gas pooling in the low spots. Move.',
      'The lantern flame turns blue. Methane. The cave is telling you something and you should listen.',
      'Dizziness hits like a fist. The guano fumes have been working on you and you did not notice until now.'
    ],
    flooding: [
      'A sound like distant thunder that gets less distant very fast.',
      'The Lost River surges. Brown water fills the passage in minutes. There is nowhere to go but up.',
      'Surface rain finds its way down through a thousand cracks. The cave is drowning and you are in it.',
      'The stream overflows its banks without apology. Cold water. Fast water. Rising water.',
      'Flash flood. The water does not care about your schedule or your supplies or your life.'
    ],
    fall: [
      'The ground gives way and so does your stomach.',
      'A loose rock. A wet boot. A long moment of understanding.',
      'Your foot finds empty air where the floor promised to be.',
      'The ledge crumbles like a broken promise. You grab for stone. Stone does not grab back.',
      'Wet flowstone. One wrong step. Gravity does the rest.'
    ],
    rockfall: [
      'A boulder the size of a whiskey barrel breaks free overhead.',
      'Rocks tumble from the wall like the mountain shrugging.',
      'A shelf of limestone sheers off with a sound like a rifle shot.',
      'Pebbles first. Then stones. The mountain gives its warnings in ascending order.',
      'A rockfall blocks half the passage. The other half looks at you with indifference.'
    ],
    stuck: [
      'The passage narrows and someone gets wedged like a cork in a bottle.',
      'The squeeze point is tighter than your map suggested. Someone is not going anywhere.',
      'A crew member\'s pack catches on a rock tooth. They cannot move forward or back.',
      'The passage laughs at your equipment and refuses to let it through.'
    ],
    disease: [
      'It starts as a cough. It always starts as a cough.',
      'Chills. Fever. The guano fungus has found a new home in a miner\'s lungs.',
      'The dust has done its patient work. A man who was fine yesterday cannot stand today.',
      'Histoplasmosis. The word will not exist for sixty years. The disease does not wait.'
    ],
    hypothermia: [
      'Fifty-eight degrees does not sound cold until everything you own is soaked through.',
      'The shivering stops. That is when it gets dangerous.',
      'Wet clothes and cave air. The combination is older than medicine and more reliable.',
      'The cold does not rush. It is patient. It has all the time in the world.'
    ],
    lost: [
      'Every passage looks the same. Every shadow is a fork you do not remember.',
      'Your landmarks have vanished. The cave has rearranged itself when you were not looking.',
      'A wrong turn leads to a dead end that looks exactly like the right turn.',
      'Without a working lantern you are blind and lost and the cave is very, very large.'
    ],

    // === Positive / Neutral Events ===
    good_find: [
      'A side alcove thick with undisturbed guano. Your men grin like they struck gold.',
      'The deposits here are deep and dry. A lucky find on a day you needed one.',
      'Your geologist spots a formation and says a word that means money. The shovels come out.',
      'Rich guano. Easy access. Good air. Days like this keep men coming back underground.'
    ],
    rest_event: [
      'The crew rests by the spring. Clean water and silence. The cave is generous today.',
      'Cool water. A pause in the work. The men remember they are alive.',
      'Salt pork and hardtack by lantern light. No one complains. No one has the energy.',
      'An hour in the Spring Room. The orange walls glow. Something about this place gives a man back to himself.'
    ],
    equipment_break: [
      'A pickaxe handle snaps mid-swing. The limestone does not even notice.',
      'Your best shovel bends against rock that has been waiting since the Carboniferous.',
      'A rope frays where you cannot see it until you can. Replace it. Now.',
      'The lantern glass cracks. You patch it with what you have. It throws half the light.'
    ],
    crew_morale: [
      'Someone starts a hymn. One by one the others join. The cave has never heard harmony before.',
      'A joke so bad it is good. Laughter bouncing off limestone. The darkness retreats an inch.',
      'A crew member finds a crystal formation like frozen starlight. Nobody touches it. Everyone stares.',
      'The foreman passes a flask. One sip each. Morale improves more than the whiskey warrants.'
    ]
  };

  // ─── Death Messages ──────────────────────────────────────────────
  var DEATH_MESSAGES = {
    bat_fever: {
      title: 'Bat Fever',
      message: [
        'You have died of bat fever.',
        '',
        'It started as a cough you ignored. Then a cough',
        'you couldn\'t ignore. Then a silence where your',
        'breathing used to be.',
        '',
        'The fungus in the guano dust colonized your lungs',
        'like the Spaniards colonized this cave. Thoroughly',
        'and without asking permission.',
        '',
        'Histoplasmosis won\'t have a name for sixty years.',
        'You never knew what killed you. Neither will the',
        'next man who works this room.'
      ]
    },
    cave_in: {
      title: 'Cave-In',
      message: [
        'You have been killed in a cave-in.',
        '',
        'The mountain decided it was done holding itself',
        'up. The sound was brief. So were you.',
        '',
        'Tons of Ozark limestone. A space where a man',
        'used to be. The passage sealed itself like a',
        'wound closing, and the cave moved on without you.',
        '',
        'They did not recover the body. The cave keeps',
        'what it takes, and it does not negotiate.'
      ]
    },
    fall: {
      title: 'Fatal Fall',
      message: [
        'You have fallen to your death.',
        '',
        'One wet boot on slick flowstone. A moment of',
        'perfect clarity as gravity explained itself.',
        'The fall was not long. The landing was thorough.',
        '',
        'Your lantern hit the floor before you did and',
        'went out. The darkness arrived a moment early,',
        'like a host preparing for a guest.',
        '',
        'The cave keeps what it takes.'
      ]
    },
    gulf_of_doom_fall: {
      title: 'Lost to the Gulf of Doom',
      message: [
        'You have fallen into the Gulf of Doom.',
        '',
        'The ledge crumbled and you went into the shaft',
        'feet-first with your lantern still lit. Your crew',
        'watched the light fall. It got smaller. Then it',
        'got very small. Then it was gone.',
        '',
        'They never heard you land. The clay-and-guano',
        'slurry at the bottom absorbs everything. Sound.',
        'Light. Men.',
        '',
        'You are the fourth. You will not be the last.'
      ]
    },
    drowning: {
      title: 'Drowned',
      message: [
        'You have drowned in the cave.',
        '',
        'The Lost River rose faster than you could think',
        'the word "retreat." Cold water. Dark water. Water',
        'that filled every passage and left no air for a',
        'man who needed some.',
        '',
        'They found your lantern wedged between two rocks,',
        'still faintly warm. They did not find you.',
        '',
        'The river does not know your name.'
      ]
    },
    lost_in_darkness: {
      title: 'Lost in Darkness',
      message: [
        'You have been lost in the darkness.',
        '',
        'The last lantern sputtered and died and the dark',
        'came in like a flood. You walked by touch. You',
        'walked by memory. You walked until you couldn\'t.',
        '',
        'A survey team found your remains years later,',
        'seated against a wall with an empty lantern in',
        'your hand and your face turned toward a passage',
        'that would have led to the surface.',
        '',
        'Two hundred yards. You were two hundred yards',
        'from daylight.'
      ]
    },
    lung_sickness: {
      title: 'Lung Sickness',
      message: [
        'You have died of lung sickness.',
        '',
        'Months of ammonia and guano dust. Your lungs',
        'filled with what they could not expel. The',
        'coughing became a language you spoke fluently',
        'and then the language went silent.',
        '',
        'You are buried in the small cemetery above the',
        'cave. The headstone reads: "A Miner." No name.',
        'The stonemason charged by the letter and your',
        'crew was short on funds.'
      ]
    },
    snakebite: {
      title: 'Snakebite',
      message: [
        'You have died of snakebite.',
        '',
        'A timber rattlesnake. Four feet of Missouri',
        'malice coiled in the rocks near the entrance.',
        'It struck before you saw it and the venom',
        'worked faster than the nearest doctor could ride.',
        '',
        'The nearest doctor was in Forsyth. Two days away.',
        'The snake did not extend that courtesy.',
        '',
        'By nightfall it was done.'
      ]
    },
    starvation: {
      title: 'Starvation',
      message: [
        'You have starved to death.',
        '',
        'Deep in the cave with empty packs and no way',
        'to forage. Hunger kept you company for a while.',
        'Then it stopped being company and started being',
        'a landlord.',
        '',
        'The cave is full of things. Limestone. Water.',
        'Bats. Guano. None of it is food.',
        '',
        'You should have turned back when the hardtack',
        'ran out. But you didn\'t, and now you know why',
        'they call this place the Devil\'s Den.'
      ]
    },
    hypothermia: {
      title: 'Hypothermia',
      message: [
        'You have died of exposure.',
        '',
        'Fifty-eight degrees. It does not sound cold.',
        'It does not need to sound cold. Wet clothes and',
        'no fire will kill a man at fifty-eight degrees',
        'with the same patience the cave applies to',
        'everything.',
        '',
        'First the shivering stopped. You thought that',
        'was good. It was not good. Then sleep came,',
        'warm and heavy as a quilt, and you let it.',
        '',
        'The cave does not hurry.'
      ]
    },
    bad_air: {
      title: 'Suffocation',
      message: [
        'You have suffocated.',
        '',
        'Carbonic gas. Heavier than air. Pooling in the',
        'low spots like invisible water. The candle dimmed',
        'and you thought it was the oil. It was not the oil.',
        '',
        'A terrible drowsiness. A thought half-formed.',
        'A breath that did not come.',
        '',
        'The gas was already there when you arrived.',
        'It was patient. It did not need to be anything',
        'else.'
      ]
    }
  };

  // ─── Gravestone Template ─────────────────────────────────────────
  var GRAVESTONE = {
    template: [
      '       ___________',
      '      /           \\',
      '     /  R.I.P.     \\',
      '    |               |',
      '    |  {name}       |',
      '    |               |',
      '    |  {cause}      |',
      '    |               |',
      '    |  {date}       |',
      '    |               |',
      '    |  Depth: {depth}ft |',
      '    |_______________|',
      '    |               |',
      '   /|               |\\',
      '  / |_______________| \\',
      ' /                     \\'
    ],
    epitaphs: [
      'Gone to glory, if glory will have him.',
      'The mountain took what was owed.',
      'The cave keeps its own.',
      'Rest now. The digging is done.',
      'Deeper than any man should go.',
      'The darkness was patient. He was not.',
      'He dug too deep and found the bottom.',
      'Mourned by few. Owed by many.',
      'Another name the limestone learned.',
      'The Ozarks giveth and the Ozarks taketh away.',
      'He came for guano. The guano came for him.',
      'Last words: "Hold the rope."'
    ]
  };

  // ─── Bald Knobber Encounter Dialogue ─────────────────────────────
  var BALD_KNOBBER_DIALOGUE = {
    intro: [
      'Four riders block the trail. Flour-sack masks with',
      'cane-stalk horns. Hickory switches. Revolvers that',
      'have seen recent use.',
      '',
      'The leader spits tobacco juice and studies your load.',
      '"Well now," he says, in the tone of a man who has',
      'done this before. "That is an awful lot of bat shit',
      'for one crew to be hauling through our territory.',
      'I believe there is a toll for that."'
    ],
    options: [
      {
        id: 'pay_toll',
        text: 'Pay their toll (lose 20% of your guano)',
        response: [
          '"Smart man," the leader says, weighing your',
          'offering in his hand. "You can pass. But we ride',
          'these roads regular, and our memory is long."',
          '',
          'The Bald Knobbers began as vigilantes fighting',
          'lawlessness in Taney County. Captain Nat Kinney',
          'organized over a thousand men. By 1884, some',
          'factions had devolved into the very thing they',
          'claimed to oppose. The horned masks were meant',
          'to terrify. They succeeded.'
        ],
        outcome: { guanoLoss: 0.20, healthLoss: 0, timeLoss: 0, reputationChange: -5 }
      },
      {
        id: 'negotiate',
        text: 'Try to negotiate a smaller toll',
        response: [
          'You hold the leader\'s gaze. You have been',
          'underground for days. You are not afraid of',
          'men who hide behind flour sacks.',
          '',
          '"Ten percent," he says finally. "And you carry',
          'a message to Lynch. Tell him the Knobbers want',
          'a word about those water rights."',
          '',
          'You nod. You will deliver the message.',
          'You will not mention how your hands shook.'
        ],
        outcome: { guanoLoss: 0.10, healthLoss: 0, timeLoss: 1, reputationChange: 0 }
      },
      {
        id: 'fight',
        text: 'Refuse and prepare to fight',
        response: [
          'You draw your knife. Your crew grabs pickaxes.',
          'Men who swing steel underground all day do not',
          'flinch from men on horseback.',
          '',
          'The fight is brief and ugly. Two Knobbers flee.',
          'The other two learn what a pickaxe can do to',
          'a man who is not limestone.',
          '',
          'You have made enemies with long memories and',
          'a talent for midnight visits. Sleep light.'
        ],
        outcome: { guanoLoss: 0, healthLoss: 15, timeLoss: 0, reputationChange: 10 }
      },
      {
        id: 'sneak',
        text: 'Try to sneak past using a back trail',
        response: [
          'You know these hills. An old deer trail winds',
          'around the ridge through brush so thick a horse',
          'cannot follow. It adds half a day and the',
          'footing is treacherous.',
          '',
          'You emerge on the road beyond the Knobbers,',
          'scratched and exhausted but whole.',
          '',
          'You keep your guano. You keep your hide. You',
          'lose time you cannot afford to lose.'
        ],
        outcome: { guanoLoss: 0, healthLoss: 5, timeLoss: 2, reputationChange: 0 }
      }
    ],
    historical_note: 'The Bald Knobbers of Taney County, Missouri, were a vigilante group formed in 1883 by Captain Nat Kinney. Originally organized to combat lawlessness in the Ozarks after the Civil War, the group grew to over 1,000 members before splintering into factions. Some became little better than the criminals they opposed, engaging in arson, whippings, and murder. The group was finally broken up after the public hanging of two Knobbers in Ozark, Missouri, in 1889.'
  };

  // ─── Bat Swarm Decision Text ─────────────────────────────────────
  var BAT_SWARM_DECISIONS = {
    intro: [
      'The ceiling erupts. Forty thousand gray bats launch',
      'themselves into the passage in a shrieking, spiraling',
      'tornado of leather wings and needle teeth. The air',
      'is more bat than air.',
      '',
      'What do you do?'
    ],
    options: [
      {
        id: 'hold_ground',
        text: 'Hold your ground and cover your head',
        response: 'You crouch and cover your face with your arms. The swarm batters you for three minutes that feel like thirty. When it passes you are scratched and shaking and alive.',
        healthCost: 5,
        timeCost: 0,
        lanternRisk: 0.1
      },
      {
        id: 'retreat',
        text: 'Retreat to the previous chamber',
        response: 'You back out fast. The swarm pours past like a river of bad dreams. You are safe but you have lost time. They will settle eventually. Bats always do.',
        healthCost: 0,
        timeCost: 2,
        lanternRisk: 0.05
      },
      {
        id: 'push_through',
        text: 'Push through the swarm',
        response: 'You lower your head and charge. Wings slam your face. Claws rake your neck. Your lantern nearly dies. You come out the other side looking like you lost a fight with a threshing machine. But you are through.',
        healthCost: 12,
        timeCost: 0,
        lanternRisk: 0.30
      },
      {
        id: 'use_fire',
        text: 'Wave your lantern to drive them away',
        response: 'The fire scatters some and enrages the rest. The swarm doubles back and you are in the center of it. When it finally disperses your oil reserve is noticeably lighter.',
        healthCost: 8,
        timeCost: 1,
        lanternRisk: 0.15,
        oilCost: 1
      }
    ]
  };

  // ─── Store / Shopkeeper Dialogue ─────────────────────────────────
  var SHOPKEEPER_DIALOGUE = {
    greeting: [
      '"Marmaros Outfitters. Herschel Barnes, proprietor.',
      'I stock everything a man needs to go underground',
      'and most of what he needs to come back up. I don\'t',
      'extend credit and I don\'t accept excuses."'
    ],
    browse: [
      '"Look around. Take your time. But the cave is open',
      'right now and it don\'t care what you forgot. Better',
      'to spend a dollar today than wish you had tomorrow',
      'from inside a limestone coffin."'
    ],
    low_funds: [
      '"Light purse. That\'s a hard way to start. Get oil',
      'first. Then food. Then rope. Everything else is a',
      'luxury, and luxuries don\'t survive the first day',
      'underground."'
    ],
    farewell: [
      '"Watch yourself down there. I mean that. I\'ve sold',
      'provisions to men who didn\'t come back to buy more.',
      'Don\'t be one of those men."'
    ],
    buy_response: [
      '"Good choice. That\'ll earn its keep below."',
      '"Smart purchase. The cave respects preparation."',
      '"I\'ll have that loaded. Take care of it and it\'ll take care of you."',
      '"Solid. You\'ll be glad you bought that when the dark starts pressing in."'
    ],
    haggle_response: [
      '"My prices are fair and final. There ain\'t another store in Marmaros."',
      '"You\'re welcome to shop at the competition. There ain\'t any."',
      '"I got two daughters to feed and a mule that eats like a horse. Price stands."'
    ],
    item_descriptions: {
      lantern_oil: '"Whale oil. Your lantern is your life down there. When the oil goes, you go with it."',
      candles: '"Tallow candles. Backup light. But more important: a candle that shrinks means the air has gone bad. When it dims, you leave. Don\'t think. Leave."',
      rope: '"Hemp rope. Fifty-foot coils. You\'ll want at least two unless you plan to fly."',
      timber: '"Shoring timber. Heavy as a guilty conscience but it\'s the difference between a mine and a mass grave."',
      food: '"Salt pork, hardtack, dried beans, coffee. Enough to keep a man swinging a pick for a week. It ain\'t fancy. Neither is starvation."',
      water: '"Clean water from Roark Creek. The spring below helps, but the spring is at the spring and you ain\'t always at the spring."',
      blasting_powder: '"Black powder. You treat this like it\'s what it is, which is the difference between you and a hole in the ground."',
      pickaxes: '"Good steel heads. The limestone eats them alive so bring spares."',
      shovels: '"For scooping bat dung. The most glamorous job in Stone County."',
      guano_sacks: '"Waxed burlap. Fifty pounds each. Bring twice as many as you think you need."',
      medicine: '"Laudanum, quinine, bandages, and a bone saw. I hope you don\'t need the saw. I hope that a lot."',
      respirator: '"Cloth mask for the ammonia. It\'s the difference between coughing and dying of coughing."'
    }
  };

  // ─── Season Descriptions ─────────────────────────────────────────
  var SEASON_TEXT = {
    spring: {
      title: 'Spring',
      description: [
        'Dogwood blossoms on the ridges. Creeks running high',
        'with snowmelt. The Ozarks waking up angry.',
        '',
        'The bats are returning from winter roosts. Fresh',
        'guano awaits below. But the underground rivers are',
        'swollen and the Lost River does not suffer fools.',
        'Flash flooding will kill you faster than anything',
        'else in this cave.'
      ],
      warning: 'Flooding risk is HIGH this season.'
    },
    summer: {
      title: 'Summer',
      description: [
        'Summer settles over the Ozarks like a wool blanket',
        'soaked in sweat. Men flee underground where the cave',
        'holds a steady fifty-eight degrees.',
        '',
        'The bat colonies are at peak population. Eighty',
        'thousand wings. The guano is thick. So is the',
        'ammonia. So is the risk of bat fever. Work crews',
        'rotate or they die. It is that simple.'
      ],
      warning: 'Bat activity is HIGH. Bad air risk is elevated.'
    },
    fall: {
      title: 'Fall',
      description: [
        'The oaks and hickories blaze red and gold across',
        'the ridges like the hills are on fire. The air is',
        'sharp and dry and carries the smell of wood smoke.',
        '',
        'The bats are leaving for their winter hibernation.',
        'The ammonia thins. The flooding risk drops. This is',
        'peak season. The cave is as safe as it ever gets,',
        'which is not very safe at all.'
      ],
      warning: 'Conditions are FAVORABLE. This is peak mining season.'
    },
    winter: {
      title: 'Winter',
      description: [
        'Ice glazes the sinkhole entrance. Snow buries the',
        'road to Branson. The Ozarks become a place that',
        'does not want you here.',
        '',
        'Deep inside, the cave holds steady. The bats have',
        'gone. The silence is absolute. Mining is possible',
        'but getting guano to market is another matter.',
        'The road does not forgive.'
      ],
      warning: 'Transport difficulties. Hypothermia risk near the entrance.'
    }
  };

  // ─── Profession Descriptions ─────────────────────────────────────
  var PROFESSION_TEXT = {
    investor: {
      title: 'Investor',
      description: [
        'A man of means from Springfield with clean hands',
        'and a ledger full of numbers. You have capital,',
        'ambition, and no idea what waits below.',
        '',
        'Most money ($1,600). Least experience. Score x1.',
        'The cave does not care about your bank account.'
      ],
      starting_text: 'You arrive at Marmaros in a rented carriage. The locals stare. You stare back. This will be an education.'
    },
    miner: {
      title: 'Miner',
      description: [
        'Twenty years in the Ozark lead and zinc mines.',
        'You can read rock the way a preacher reads scripture.',
        'You know what a bad timber sounds like. You know',
        'what bad air smells like.',
        '',
        'Moderate funds ($800). Solid experience. Score x2.',
        'The cave is just another hole in the ground.',
        'A deeper one.'
      ],
      starting_text: 'You arrive at Marmaros with steady hands and a miner\'s eye. You have done this before. Not here, but the dark is the same everywhere.'
    },
    farmer: {
      title: 'Farmer Turned Miner',
      description: [
        'The drought took your corn. The bank took your',
        'plow. You heard bat dung sells for seven hundred',
        'dollars a ton and you did not ask questions.',
        '',
        'Little money ($400). No mining experience. Score x3.',
        'Fortune favors the desperate, or so you tell',
        'yourself on the road to Marmaros.'
      ],
      starting_text: 'You arrive at Marmaros with callused hands, an empty wallet, and the kind of determination that comes from having nothing to go back to.'
    }
  };

  // ─── Final Decision Text (3 Endings) ─────────────────────────────
  var FINAL_DECISIONS = {
    intro: [
      'Your mining season draws to a close. You have hauled',
      '{guano_amount} pounds of guano to the surface and your',
      'crew is {crew_status}.',
      '',
      'The cave waits below. The road waits above.',
      'You face a final choice.'
    ],
    options: [
      {
        id: 'sell_and_leave',
        title: 'Sell Your Guano and Leave',
        description: [
          'Take your earnings. Tip your hat to Marmaros.',
          'Ride the stagecoach back to a world with daylight',
          'and horizons. The money is modest but certain.',
          '',
          'You survived the Devil\'s Den. That is not nothing.',
          'Some men in that cemetery above the cave would',
          'have taken this deal.'
        ],
        scoreMultiplier: 1.0
      },
      {
        id: 'one_more_run',
        title: 'One More Run Into the Deep',
        description: [
          'The Waterfall Room still holds the richest deposits.',
          'Five hundred feet down. One more trip could double',
          'your haul. Your crew is tired, your supplies thin,',
          'your rope frayed.',
          '',
          'The cave has been patient with you. Patient does',
          'not mean kind. But the guano is there, and a man',
          'who has come this far does not stop at the edge.',
          '',
          'High risk. High reward. The cave\'s oldest bargain.'
        ],
        scoreMultiplier: 1.5
      },
      {
        id: 'invest_in_cave',
        title: 'Invest in the Cave\'s Future',
        description: [
          'You have seen what this cave could become. Not a',
          'mine. A wonder. Better ladders. Walkways. Lighting.',
          'Charge the tourists a dollar a head and let them',
          'see what you have seen.',
          '',
          'In 1889, William Lynch will begin giving tours.',
          'In 1950, the Herschends will build Silver Dollar',
          'City around this very hole in the ground. You are',
          'fifty years ahead of your time.',
          '',
          'The cave is the treasure. The guano was just the',
          'introduction.'
        ],
        scoreMultiplier: 2.0
      }
    ]
  };

  // ─── Traveler News / Historical Flavor Text ──────────────────────
  var TRAVELER_NEWS = [
    'A drummer from St. Louis says guano fertilizer prices have jumped. Farmers out East can\'t get enough of it.',
    'Word from Springfield: cholera in the water supply. Best stay in the hills.',
    'A circuit preacher passed through. He says the railroad will reach Branson within five years. Nobody believes him.',
    'Travelers say Nat Kinney and his Bald Knobbers hung a man near Forsyth last week. No trial. Just rope.',
    'A mule skinner reports the Branson road is washed out. Guano shipments delayed.',
    'News from Jefferson City: the legislature is debating mining safety laws. The miners laugh bitterly.',
    'A patent medicine man claims his tonic cures bat fever. He does not look healthy himself.',
    'An old Osage man passed through Marmaros. He left tobacco at the cave entrance and said nothing to anyone.',
    'A geologist from the state university measured the Cathedral Room. Says it could hold the Statue of Liberty.',
    'A bear was spotted near the sinkhole entrance. The donkeys are restless and so is your crew.',
    'A Kansas City newspaper says bat guano is being tested for explosives. The military is interested.',
    'Silver discovered near Joplin. Half the miners in Stone County have gone to stake claims. Your competition just got thinner.',
    'A photographer from New York wants to take pictures inside the cave. He has never been underground. This should be interesting.',
    'The temperance league has closed three saloons in Forsyth. The miners\' morale has taken a corresponding hit.',
    'Two miners from the Granby lead operation arrived today. They say working conditions here are worse. That takes some doing.',
    'A letter from home reports crops are good this year. The news tastes like clean water.',
    'The stagecoach driver swears he saw lights moving inside the cave at midnight. Nobody was underground. Nobody will admit to it.',
    'A traveling fortune-teller read the cards for your foreman. She went pale and asked for her money back.',
    'Word is that William Henry Lynch himself is coming to inspect the operation. The crew cleans up. The cave does not.',
    'An old-timer in the tavern says the Spaniards left more than ladders in this cave. He won\'t say what. He won\'t stop drinking, either.'
  ];

  // ─── Easter Egg Text ─────────────────────────────────────────────
  var EASTER_EGGS = {
    osage_v_marks: {
      trigger: 'cathedral_entrance',
      chance: 0.15,
      text: [
        'Near the cave mouth, half-hidden by mineral deposits,',
        'you find V-shaped marks carved deep into the limestone.',
        'They are old. Older than the mining company. Older than',
        'Lynch. Older than the Republic.',
        '',
        'Osage trail markers. The sideways V meant warning --',
        'a place of power, a threshold between worlds. The',
        'Osage did not enter the deepest chambers. They said',
        'the cave was a door, and some doors should not be',
        'opened.',
        '',
        'You run your finger along the carved stone. The edges',
        'have been softened by centuries of mineral seepage,',
        'but the intent is sharp as the day they were cut.',
        '',
        'You have discovered the Osage V-marks. (+50 discovery points)'
      ],
      reward: { discoveryPoints: 50 }
    },
    spanish_gold: {
      trigger: 'gulf_of_doom',
      chance: 0.10,
      text: [
        'Wedged in a crevice at the rim of the Gulf of Doom,',
        'your lantern catches a dull gleam. A tarnished silver',
        'coin. A Spanish real, dated 1743.',
        '',
        'On the reverse: a cross. On the obverse: a word you',
        'cannot read, worn smooth by two hundred years of cave',
        'air. The conquistadors came here looking for gold and',
        'the Fountain of Youth. They found bat dung and darkness.',
        '',
        'But they left their ladders in the Mammoth Room and',
        'their coin at the Gulf of Doom. What else did they',
        'leave? And what were they really looking for?',
        '',
        'You have discovered the Spanish coin. (+75 discovery points)'
      ],
      reward: { discoveryPoints: 75 }
    },
    harold_bell_wright: {
      trigger: 'spring_room',
      chance: 0.12,
      text: [
        'Carved into the orange calcite near the spring, in',
        'careful letters: "H.B. WRIGHT - 1903."',
        '',
        'Harold Bell Wright. A preacher who came to the Ozarks',
        'for his health and stayed for the stories. He explored',
        'this cave and walked these hills and wrote a novel',
        'called "The Shepherd of the Hills" that made the',
        'Ozarks famous.',
        '',
        'Beneath his name, in smaller letters, he carved:',
        '"THE WATER REMEMBERS." You do not know what he meant.',
        'The spring continues its patient work behind you.',
        '',
        'You have discovered Harold Bell Wright\'s signature. (+60 discovery points)'
      ],
      reward: { discoveryPoints: 60 }
    },
    charlie_sullivan: {
      trigger: 'waterfall_room',
      chance: 0.08,
      text: [
        'Behind the falls, in a rock niche shielded from the',
        'spray, you find a rusted tin box. Inside: a leather',
        'journal, water-damaged but partly legible.',
        '',
        '"Charlie Sullivan" is written on the cover. A miner',
        'who worked the Waterfall Room alone in the winter of',
        '1878. His entries describe the isolation. The constant',
        'roar of water. A growing conviction that the cave was',
        'not empty.',
        '',
        '"Something moves behind the falls," he wrote on',
        'January 14th. "Not bats. Not water. Something that',
        'watches." The entries grow shorter after that.',
        '',
        'The last page reads: "I have seen it. God forgive',
        'me, I have seen it in the water. It has the face',
        'of a man who has been underground too long."',
        '',
        'Charlie Sullivan was never heard from again.',
        '',
        'You have discovered Charlie Sullivan\'s journal. (+100 discovery points)'
      ],
      reward: { discoveryPoints: 100 }
    },
    civil_war_cache: {
      trigger: 'the_dungeon',
      chance: 0.10,
      text: [
        'Behind a loose stone in The Dungeon -- a stone that',
        'has been pried out and replaced before, you can see',
        'the tool marks -- you find a cache.',
        '',
        'Confederate cartridge boxes. A canteen stamped C.S.A.',
        'And a letter, folded tight, from a soldier named',
        'Thomas Harwell to his wife Sarah in Forsyth.',
        '',
        '"The cave is safe," he wrote, September 1863. "The',
        'Yankees will not find us here. I am coming home when',
        'this is over. Keep the lantern lit."',
        '',
        'He never sent the letter. The cave kept it for him.',
        'Twenty-one years and counting.',
        '',
        'You have discovered a Civil War cache. (+65 discovery points)'
      ],
      reward: { discoveryPoints: 65 }
    },
    blind_cave_fish: {
      trigger: 'lake_genevieve',
      chance: 0.20,
      text: [
        'Your lantern finds them in the clear water of Lake',
        'Genevieve. Small. Pale as cave worms. Completely',
        'eyeless. Drifting through the dark water like ghosts',
        'of fish that used to live in the light.',
        '',
        'Ozark cavefish. Amblyopsis rosae. They have lived in',
        'this darkness for so many generations that evolution',
        'took back their eyes and their color. They navigate',
        'by sensing vibrations in the water.',
        '',
        'Science won\'t formally describe them until 1898.',
        'For now they are just pale shapes moving in a place',
        'where nothing should be alive, doing fine without',
        'the sun, thank you very much.',
        '',
        'You have discovered the blind cavefish. (+55 discovery points)'
      ],
      reward: { discoveryPoints: 55 }
    }
  };

  // ─── Status Screen Text ──────────────────────────────────────────
  var STATUS_TEXT = {
    health: {
      excellent: 'Your crew is fit and working hard.',
      good: 'Your crew is holding up. Some aches and bruises.',
      fair: 'Several men are coughing. The cave is wearing on them.',
      poor: 'Your crew is in rough shape. Injuries and illness taking hold.',
      critical: 'The crew can barely stand. Without rest or medicine, you will start burying men.',
      dying: 'Your crew is dying. This is not a metaphor.'
    },
    morale: {
      high: 'Morale is high. The crew works like men who believe in something.',
      good: 'Morale is steady. No complaints that matter.',
      fair: 'Morale is slipping. The grumbling has started.',
      low: 'Morale is bad. Men work in silence. That is worse than complaining.',
      critical: 'Morale has collapsed. Some men are talking about walking out. Others are past talking.'
    },
    supplies: {
      well_stocked: 'Supplies are plentiful. You are prepared.',
      adequate: 'Adequate supplies for now. Keep an eye on them.',
      low: 'Supplies running low. The cave eats through provisions faster than you think.',
      critical: 'Critically low. You need to resupply or start making hard choices.',
      empty: 'You are out of essential supplies. The cave is about to teach you something.'
    },
    pace: {
      careful: 'Moving careful. Checking every handhold twice.',
      steady: 'Steady pace. Good work without unnecessary risk.',
      aggressive: 'Pushing hard. Speed over safety. The crew knows it.',
      reckless: 'Reckless. The crew is scared and they should be.'
    }
  };

  // ─── Tutorial / Help Text ────────────────────────────────────────
  var HELP_TEXT = {
    welcome: [
      'THE MARVEL CAVE MINING COMPANY',
      '==============================',
      '',
      'The year is 1884. You are a guano miner in Stone',
      'County, Missouri, in the Ozark Mountains.',
      '',
      'Marvel Cave -- the Devil\'s Den -- drops five hundred',
      'feet into the earth. It is full of bat guano worth',
      '$700 a ton as fertilizer and gunpowder. Your job is',
      'to go down, dig it up, and come back alive.',
      '',
      'The cave has opinions about this plan. Cave-ins.',
      'Flooding. Bad air. Bat swarms. The Gulf of Doom.',
      'The Bald Knobbers on the roads above. A fungus',
      'in the dust that will eat your lungs.',
      '',
      'Manage your crew, your supplies, and your nerve.',
      'The cave does not forgive and it does not forget.'
    ],
    controls: [
      'CONTROLS',
      '--------',
      'Use the number keys or click to select options.',
      'Press ENTER or SPACE to advance text.',
      '',
      'At each chamber, you can:',
      '  1. Mine guano (if deposits exist)',
      '  2. Rest (at certain locations)',
      '  3. Check supplies and crew status',
      '  4. Descend deeper into the cave',
      '  5. Ascend toward the surface',
      '  6. Explore optional side passages'
    ],
    tips: [
      'MINING TIPS',
      '-----------',
      '- Oil is life. When the lantern dies, you die.',
      '- Watch your candle. A dim flame means bad air.',
      '- The Spring Room is the only safe rest underground.',
      '- Timber prevents cave-ins. Skipping it is gambling.',
      '- Respirators in the Cloud Room. Your lungs will thank you.',
      '- The Gulf of Doom pays best and kills fastest.',
      '- Water sounds change before floods. Listen.',
      '- Fall is peak season. Spring will drown you.',
      '- A good crew is worth more than good equipment.',
      '- The cave has secrets. Pay attention to what does',
      '  not belong.'
    ]
  };

  // ─── Title Screen Text ───────────────────────────────────────────
  var TITLE_TEXT = {
    title: 'THE MARVEL CAVE MINING COMPANY',
    subtitle: 'A Descent into the Ozarks',
    year: '~ Stone County, Missouri, 1884 ~',
    prompt: 'Press any key to begin',
    credits: [
      'Inspired by The Oregon Trail',
      'Based on the real history of Marvel Cave',
      'Stone County, Missouri'
    ]
  };

  // ─── Mining Result Text ──────────────────────────────────────────
  var MINING_TEXT = {
    success: [
      'Sack after sack. The guano comes up dry and rich. A good day in the dark.',
      'The deposits are thick here. Your crew works in rhythm -- shovel, sack, haul, repeat.',
      'Foul air. Foul work. Full sacks. The arithmetic of guano mining.',
      'A rich vein. The shovels bite deep and the burlap fills heavy. This is what seven hundred dollars a ton looks like.'
    ],
    poor: [
      'Thin deposits. More rock than guano. The cave is stingy today.',
      'Scattered guano mixed with limestone rubble. Your crew works twice as hard for half the yield.',
      'Slim pickings. The good deposits have been stripped by men who came before you.',
      'Hard work and not much to show for it. The cave gives what it gives.'
    ],
    exhausted: [
      'Mined out. Previous crews have scraped this chamber to bare stone.',
      'Nothing left. The guano is gone and only dust remains.',
      'Exhausted deposits. Time to go deeper if you want to fill those sacks.'
    ],
    interrupted: [
      'The cave interrupts. It does not ask permission.',
      'Work stops. Something else demands your attention.',
      'Mining halted. The cave has other plans today.'
    ]
  };

  // ─── Miscellaneous / UI Text ─────────────────────────────────────
  var UI_TEXT = {
    confirm_descend: 'Descend deeper into the cave?',
    confirm_ascend: 'Begin the climb back toward daylight?',
    confirm_mine: 'Set up mining operations here?',
    confirm_rest: 'Rest here and tend to the crew?',
    confirm_quit: 'Abandon the operation and climb for the surface?',
    no_oil: 'Out of oil. Turn back now or die in the dark. Those are your options.',
    no_food: 'Out of food. Your crew grows weak. Hunger is patient but thorough.',
    no_rope: 'Out of rope. You cannot safely descend. The cave charges admission.',
    crew_dead: 'Your last crew member is dead. You are alone in five hundred feet of darkness.',
    game_over: 'Your mining operation has come to an end.',
    press_continue: 'Press any key to continue...',
    loading: 'Loading...',
    saving: 'Recording your progress...'
  };

  // ─── Scoring Text ────────────────────────────────────────────────
  var SCORING_TEXT = {
    categories: {
      guano_hauled: 'Guano Hauled to Surface',
      chambers_explored: 'Chambers Explored',
      discoveries: 'Historical Discoveries',
      crew_survived: 'Crew Members Survived',
      health_remaining: 'Health Remaining',
      profession_bonus: 'Profession Multiplier',
      ending_bonus: 'Ending Choice Bonus'
    },
    ranks: [
      { minScore: 0, title: 'Tenderfoot', description: 'You saw the sinkhole and reconsidered your life choices.' },
      { minScore: 200, title: 'Greenhorn', description: 'You went underground and came back up. That counts.' },
      { minScore: 500, title: 'Working Miner', description: 'You earned your keep and your scars.' },
      { minScore: 1000, title: 'Experienced Miner', description: 'You know the dark. The dark knows you.' },
      { minScore: 2000, title: 'Master Miner', description: 'The cave respects you. That is the highest compliment it gives.' },
      { minScore: 3500, title: 'Cave Legend', description: 'Red Sullivan will tell your story. He will embellish it. You will deserve it.' },
      { minScore: 5000, title: 'King of the Mountain', description: 'Five hundred feet of darkness and you conquered every inch. Blondie Putnam would tip his hat.' }
    ]
  };

  // ─── Helper Functions ────────────────────────────────────────────
  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getEventMessage(eventType) {
    var messages = EVENT_MESSAGES[eventType];
    if (!messages || messages.length === 0) return '';
    return getRandomItem(messages);
  }

  function getDeathMessage(causeId) {
    return DEATH_MESSAGES[causeId] || DEATH_MESSAGES.cave_in;
  }

  function getLandmarkText(chamberId) {
    var lines = LANDMARK_TEXT[chamberId];
    if (!lines) return ['You have entered an unexplored chamber.'];
    return lines;
  }

  function getRandomEpitaph() {
    return getRandomItem(GRAVESTONE.epitaphs);
  }

  function getRandomNews() {
    return getRandomItem(TRAVELER_NEWS);
  }

  function getShopkeeperLine(category) {
    var lines = SHOPKEEPER_DIALOGUE[category];
    if (!lines) return '';
    if (typeof lines === 'string') return lines;
    if (Array.isArray(lines)) return lines.join('\n');
    return '';
  }

  function getStatusText(category, level) {
    var cat = STATUS_TEXT[category];
    if (!cat) return '';
    return cat[level] || '';
  }

  function getMiningText(result) {
    var messages = MINING_TEXT[result];
    if (!messages) return '';
    return getRandomItem(messages);
  }

  function getEasterEgg(chamberId) {
    for (var key in EASTER_EGGS) {
      var egg = EASTER_EGGS[key];
      if (egg.trigger === chamberId && Math.random() < egg.chance) {
        return egg;
      }
    }
    return null;
  }

  function formatGravestone(name, cause, date, depth) {
    return GRAVESTONE.template.map(function (line) {
      return line
        .replace('{name}', name)
        .replace('{cause}', cause)
        .replace('{date}', date)
        .replace('{depth}', depth);
    });
  }

  // ─── Public API ──────────────────────────────────────────────────
  window.Content = {
    LANDMARK_TEXT: LANDMARK_TEXT,
    EVENT_MESSAGES: EVENT_MESSAGES,
    DEATH_MESSAGES: DEATH_MESSAGES,
    GRAVESTONE: GRAVESTONE,
    BALD_KNOBBER_DIALOGUE: BALD_KNOBBER_DIALOGUE,
    BAT_SWARM_DECISIONS: BAT_SWARM_DECISIONS,
    SHOPKEEPER_DIALOGUE: SHOPKEEPER_DIALOGUE,
    SEASON_TEXT: SEASON_TEXT,
    PROFESSION_TEXT: PROFESSION_TEXT,
    FINAL_DECISIONS: FINAL_DECISIONS,
    TRAVELER_NEWS: TRAVELER_NEWS,
    EASTER_EGGS: EASTER_EGGS,
    STATUS_TEXT: STATUS_TEXT,
    HELP_TEXT: HELP_TEXT,
    TITLE_TEXT: TITLE_TEXT,
    MINING_TEXT: MINING_TEXT,
    UI_TEXT: UI_TEXT,
    SCORING_TEXT: SCORING_TEXT,

    getRandomItem: getRandomItem,
    getEventMessage: getEventMessage,
    getDeathMessage: getDeathMessage,
    getLandmarkText: getLandmarkText,
    getRandomEpitaph: getRandomEpitaph,
    getRandomNews: getRandomNews,
    getShopkeeperLine: getShopkeeperLine,
    getStatusText: getStatusText,
    getMiningText: getMiningText,
    getEasterEgg: getEasterEgg,
    formatGravestone: formatGravestone
  };
})();
