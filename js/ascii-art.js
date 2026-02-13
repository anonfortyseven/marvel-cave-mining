/**
 * ASCII Art for The Marvel Cave Mining Company
 * A retro terminal-style cave mining game set in 1884 Missouri
 *
 * All art kept to ~40 chars wide, ~15 lines tall max
 * for responsive display in the game area.
 */
(function() {
    'use strict';

    // =========================================================
    //  CHAMBER ART
    // =========================================================

    var chamberArt = {

        marmaros: [
            '         ~  ~  ~  ~  ~',
            '    |\\  ___ _____  /| ___',
            '    | |/ _ \\     \\/ |/ _ \\',
            '    |_|_|_|_|BANK|__|_|_|_|',
            '    [ ]|o| [ ] MARMAROS [ ]|o|',
            '    |__|_|_|___|____|___|_|_|',
            '    |  |D| |   |SALE|   |D| |',
            '    |__|_|_|___|____|___|_|_|',
            '  __|________________________|__',
            ' /  WELCOME TO MARMAROS, MO.    \\',
            ' |   Stone County * Est. 1856   |',
            '=================================',
            ' ~~road~~ /%\\ ~~road~~ /%\\ ~~road',
            '         /___\\       /___\\'
        ].join('\n'),

        cathedral_entrance: [
            '   ___|||_______|||___',
            '  /   |||       |||   \\',
            ' /    |||  THE  |||    \\',
            '/     ||| MARVEL|||     \\',
            '|     ||| CAVE  |||     |',
            '|     |||       |||     |',
            '|    /   \\     /   \\    |',
            '|   / ~~~ \\   / ~~~ \\   |',
            '|  / ~~~~~ \\ / ~~~~~ \\  |',
            '| /  ~light~ \\ ~pours~ \\ |',
            '|/ ~~~~~~~~~ in ~~~~~~~~\\|',
            '|         _/   \\_        |',
            '|        /       \\       |',
            '|_______/ 50 ft.  \\_______|',
            '   DOWN INTO DARKNESS...'
        ].join('\n'),

        cathedral_floor: [
            '     .  ^  .    * .  ^  . *',
            '    . \\/ . *  .  . \\/ .  .',
            '   ~~~~~~~~~~~~v~~~~~~~~~~~',
            '  |   THE CATHEDRAL ROOM   |',
            '  |  .  200 ft. ceiling  . |',
            '  | .    /\\      /\\    .   |',
            '  |     /  \\    /  \\    .  |',
            '  |    / /\\ \\  / /\\ \\     |',
            '  |   /    \\ \\/    \\ \\    |',
            '  |  |stalag||stalag||    |',
            '  |  |mite  || mite ||    |',
            '  |  |      ||      ||    |',
            '  |__|______|\\______/|____|',
            '  ~v~ bats above ~v~ ~v~',
            '     v   v    v    v   v'
        ].join('\n'),

        sentinel_chamber: [
            '    _______________',
            '   |    |     |    |',
            '   |    |     |    |',
            '   |   _|     |_   |',
            '   |  | |     | |  |',
            '   |  | | THE | |  |',
            '   |  | |SENT-| |  |',
            '   |  | |INEL | |  |',
            '   |  | | /|\\ | |  |',
            '   |  | |/ | \\| |  |',
            '   |  | /  |  \\ |  |',
            '   |  |/ TALL  \\|  |',
            '   |  / STALAG- \\  |',
            '   | /   MITE    \\ |',
            '   |/_____|_______\\|'
        ].join('\n'),

        crystal_alcove: [
            '    .  * .  * . *  . *',
            '   _____________________',
            '  / * CRYSTAL ALCOVE  * \\',
            ' / *  .  *  .  *  .  * \\',
            '|  /\\ * /\\  * /\\ * /\\  |',
            '| /\\/\\ /\\/\\  /\\/\\ /\\/\\ |',
            '| |\\/| |\\/| |\\/| |\\/|  |',
            '| |/\\| |/\\| |/\\| |/\\|  |',
            '| *  CRYSTALS GLEAM  *  |',
            '| *  IN YOUR LIGHT  *   |',
            '|  \\/ * \\/  * \\/ * \\/   |',
            ' \\ *  .  *  .  *  .  * /',
            '  \\_____________________/',
            '   *  . * . *  . * . *',
            '     CAREFUL IN HERE...'
        ].join('\n'),

        upper_passage: [
            '   ___________________________',
            '  |   UPPER PASSAGE           |',
            '  |  |||rope|||     |||rope||| |',
            '  |     marks  \\___/   marks   |',
            '  |   ___       ___       ___  |',
            '   \\ /   \\     /   \\     /   \\/',
            '    |     \\___/     \\___/     |',
            '    |   The passage winds     |',
            '    |     ever deeper...       |',
            '   / \\___       ___       ___/\\',
            '  |      \\     /   \\     /     |',
            '  |       \\___/     \\___/      |',
            '  |  |||rope|||     |||rope||| |',
            '  |___________________________|',
            '     >>> GOING DEEPER >>>'
        ].join('\n'),

        echo_hall: [
            '  _________________________________',
            ' /                                 \\',
            '/   E C H O   H A L L  -250ft-     \\',
            '|                                   |',
            '|  "HELLO"      hello     hello     |',
            '|         hello      hello          |',
            '|     hello     hello    hello       |',
            '|                                   |',
            '|    The chamber is wide and open   |',
            '|    Every sound returns to you     |',
            '|    multiplied and distorted       |',
            '|                                   |',
            '\\          ...hello...hello...      /',
            ' \\             ...hello...         /',
            '  \\_________________________________/'
        ].join('\n'),

        bat_colony: [
            '  v v  vv v  vv  v vv  v vv v',
            '   vvv  vvv  vvv  vvv  vvv',
            '  vv vvv vv vvv vv vvv vv vvv',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
            '  | THE BAT COLONY  -280ft-  |',
            '  |   ^^^^^^^^^^^^^^^^^^^    |',
            '  |  THOUSANDS OF BATS ROOST |',
            '  |  ON THE CEILING ABOVE    |',
            '  |                          |',
            '  |  ~~~~~~~~guano~~~~~~~~~  |',
            '  |  ~~~~~~~~thick~~~~~~~~~  |',
            '  |  ~~~~~~on~the~floor~~~~  |',
            '  |__________________________|',
            '   Watch your step... and',
            '   your head.    -280ft-'
        ].join('\n'),

        the_narrows: [
            '     |       |',
            '     |       |',
            '     |  THE  |',
            '     | NARR- |',
            '     |  OWS  |',
            '      |     |',
            '      |     |',
            '       |   |',
            '       |   |',
            '        | |',
            '        | |  <-- squeeze',
            '        | |',
            '       |   |',
            '      |     |',
            '     |       |'
        ].join('\n'),

        gulf_of_doom: [
            ' _______________________________',
            '|  THE GULF OF DOOM   -400ft-  |',
            '|  ___________________________  |',
            '| |                           | |',
            '| |   MASSIVE CHASM           | |',
            '| |     OPENS BEFORE YOU      | |',
            '| |                           | |',
            '| |       \\         /         | |',
            '| |        \\       /          | |',
            '| |         \\     /           | |',
            '| |          \\   /            | |',
            '| |           \\ /             | |',
            '| |   DARKNESS BELOW          | |',
            '| |___________________________| |',
            '|_____DO NOT FALL IN____________|'
        ].join('\n'),

        lost_river: [
            '  ==============================',
            '  | THE LOST RIVER    -350ft-  |',
            '  |                            |',
            '  |  ~~~~~~~~~~~~~~~~~~~~~~~~  |',
            '  |  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  |',
            '  |  ~~~~~~~~~~~~~~~~~~~~~~~~  |',
            '  |  ~~ underground river ~~~  |',
            '  |  ~~~~~~~~~~~~~~~~~~~~~~~~  |',
            '  |  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  |',
            '  |  ~~~~~~~~~~~~~~~~~~~~~~~~  |',
            '  |                            |',
            '  |  The current is strong     |',
            '  |  and the water is cold.    |',
            '  |____________________________|',
            '  ====== CROSS CAREFULLY ======='
        ].join('\n'),

        spanish_passage: [
            '  _______________________________',
            ' | SPANISH PASSAGE     -380ft-  |',
            ' |                              |',
            ' |    +---------+               |',
            ' |    | AQUI    |  Old Spanish  |',
            ' |    | ESTUVO  |  markers on   |',
            ' |    | 1541    |  the walls    |',
            ' |    | ~CRUZ~  |               |',
            ' |    +---------+               |',
            ' |                              |',
            ' |  Scratched symbols and       |',
            ' |  the sign of the cross       |',
            ' |  mark this ancient passage   |',
            ' |______________________________|',
            '    Who came here before you?'
        ].join('\n'),

        deep_descent: [
            '  ___||___||___||___',
            ' |  DEEP DESCENT   |',
            ' |     -450ft-     |',
            ' |_________________|',
            '      |       |',
            '       |     |',
            '        |   |',
            '         | |',
            '          |',
            '          |',
            '         /|\\',
            '        / | \\   STEEP',
            '       /  |  \\  DROP',
            '      /   |   \\ OFF',
            '     /____|____\\'
        ].join('\n'),

        blondies_throne: [
            '       _____/\\_____',
            '      /     ||     \\',
            '     / BLONDIES     \\',
            '    /   THRONE       \\',
            '   /     -480ft-      \\',
            '  |    /\\      /\\      |',
            '  |   /  \\    /  \\     |',
            '  |  / /\\ \\  /  \\ \\   |',
            '  | | |  | || |  | |  |',
            '  | | |  | || |  | |  |',
            '  | | MASSIVE  STONE | |',
            '  | | FORMATIONS SIT | |',
            '  | |  LIKE THRONES  | |',
            '  |_|________________|_|',
            '   A grand chamber indeed'
        ].join('\n'),

        cloud_room: [
            '  .:*~*:. THE .:*~*:.',
            '  :~ CLOUD ROOM ~:',
            '  .:*~ -530ft- ~*:.',
            '  ~~~~~~~~~~~~ ~~~~~~~~',
            '  ~~~~ fog ~~~~ mist ~~~',
            '  ~~ rolls ~~ across ~~~',
            '  ~~~~ the ~~~~ floor ~~~',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~',
            '  |  You can barely see  |',
            '  |  your own hands in   |',
            '  |  the thick vapor     |',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~',
            '  ~~~~ fog ~~~~ mist ~~~',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~',
            '  Visibility: VERY LOW'
        ].join('\n'),

        lake_chamber: [
            '  ================================',
            '  |  LAKE CHAMBER      -600ft-   |',
            '  |                              |',
            '  |     ____________________     |',
            '  |    /                    \\    |',
            '  |   / ~~~~~~~~~~~~~~~~~~~~ \\   |',
            '  |  | ~~~~~~~~~~~~~~~~~~~~~~ |  |',
            '  |  | ~~ still, dark water ~ |  |',
            '  |  | ~~ reflects your ~~~~~ |  |',
            '  |  | ~~~~ lantern light ~~~ |  |',
            '  |  | ~~~~~~~~~~~~~~~~~~~~~~ |  |',
            '  |   \\ ~~~~~~~~~~~~~~~~~~~~ /   |',
            '  |    \\____________________/    |',
            '  |   How deep does it go?       |',
            '  |================================'
        ].join('\n'),

        waterfall_room: [
            '        __|   |__',
            '       |  |   |  |',
            '       |  |H2O|  |',
            '       |  |   |  |',
            '  _____|  |___|  |_____',
            ' |  THE WATERFALL ROOM |',
            ' |      -700ft-        |',
            ' |  ||||||||||||||||   |',
            ' |  ||||WATERFALL||    |',
            ' |  ||||||||||||||||   |',
            ' |  ||| ~ ~ ~ ~ |||   |',
            ' |  ~~~~~~~~~~~~~~~~~  |',
            ' |  ~~~ pool below ~~  |',
            ' |  ~~~~~~~~~~~~~~~~~  |',
            ' |___DEEPEST POINT_____|'
        ].join('\n')
    };

    // =========================================================
    //  TOWN SHOP ART
    // =========================================================

    var shopArt = {

        general_store: [
            '  ___________________________',
            ' |  MARMAROS OUTFITTERS     |',
            ' |  "We Outfit the Brave"   |',
            ' |__________________________|',
            ' | [|] [|] [|] [|] [|] [|] |',
            ' | rope lantrn pick  axe    |',
            ' |__________________________|',
            ' | [=] [=] [=] [=] [=] [=] |',
            ' | cans beans flour salt    |',
            ' |__________________________|',
            ' |                          |',
            ' | OPEN  Mon-Sat  7am-6pm   |',
            ' |__________________________|',
            ' |[]          [DOOR]     [] |',
            ' |__________________________|'
        ].join('\n'),

        blacksmith: [
            '  ___________________________',
            ' |   OZARK BLACKSMITH       |',
            ' |__________________________|',
            ' |         /\\               |',
            ' |    ____/  \\____          |',
            ' |   |   FORGE   |  *CLANG* |',
            ' |   |_~~fire~~__|          |',
            ' |       {~~}               |',
            ' |   _____|_____            |',
            ' |  /   ANVIL   \\    /|     |',
            ' |  |___________|   /_|     |',
            ' |                 HAMMER   |',
            ' |  Tools * Picks * Repairs |',
            ' |__________________________|',
            ' |[]      [DOOR]         [] |'
        ].join('\n'),

        candy_shop: [
            '  ___________________________',
            ' | PENNYS SWEET SHOP        |',
            ' |  "A Treat for the Brave" |',
            ' |__________________________|',
            ' |  {O}  {O}  {O}  {O}     |',
            ' | taffy drop mint chew     |',
            ' |__________________________|',
            ' |  (O)  (O)  (O)  (O)     |',
            ' | stick rock penny hard    |',
            ' | candy candy candy candy  |',
            ' |__________________________|',
            ' |     1 cent - 5 cents     |',
            ' |__________________________|',
            ' |[]      [DOOR]         [] |',
            ' |__________________________|'
        ].join('\n'),

        knife_works: [
            '  ___________________________',
            ' | STONE COUNTY KNIFE WORKS |',
            ' |  "Sharp as the Ozarks"   |',
            ' |__________________________|',
            ' |                          |',
            ' |  /=====>  /=====>        |',
            ' |  BOWIE     HUNTING       |',
            ' |                          |',
            ' |  /===>    /=>            |',
            ' |  SKINNING  POCKET        |',
            ' |                          |',
            ' |  Hand-forged blades      |',
            ' |  since 1872              |',
            ' |__________________________|',
            ' |[]      [DOOR]         [] |'
        ].join('\n'),

        woodcraft: [
            '  ___________________________',
            ' |  RIDGETOP WOODCRAFT      |',
            ' |  "Carved by Ozark Hands" |',
            ' |__________________________|',
            ' |  ___   ___   ___         |',
            ' | |fig| |owl| |box|        |',
            ' | |___| |___| |___|        |',
            ' |                          |',
            ' | <<<wood shavings>>>      |',
            ' |  ___   ___   ___         |',
            ' | |mug| |pip| |top|        |',
            ' | |___| |___| |___|        |',
            ' |                          |',
            ' |__________________________|',
            ' |[]      [DOOR]         [] |'
        ].join('\n'),

        tavern: [
            '  ___________________________',
            ' |  THE LANTERN TAVERN      |',
            ' |    Est. 1878             |',
            ' |__________________________|',
            ' |  {_}                     |',
            ' |  |*| <- lantern          |',
            ' |  |_|                     |',
            ' |__________________________|',
            ' | |b||b||b||b||b||b||b||b| |',
            ' | whiskey * bourbon * rye  |',
            ' | ======================== |',
            ' | |      THE BAR         | |',
            ' | |______________________| |',
            ' |__________________________|',
            ' |[]      [DOOR]         [] |'
        ].join('\n')
    };

    // =========================================================
    //  DEATH ART
    // =========================================================

    var deathArt = {

        cave_in: [
            '     CAVE IN!!!',
            '  \\ \\ \\ | / / /',
            '   \\_\\_\\|/_/_/',
            '   /  CRASH!  \\',
            '  / / /||\\\\ \\ \\',
            '   [###]||[###]',
            '   [###]  [###]',
            '     [##][##]',
            '  ____[####]____',
            ' |   CRUSHED    |',
            ' |    UNDER     |',
            ' |    STONE     |',
            ' |______________|',
            '',
            '  You were buried alive.'
        ].join('\n'),

        drowning: [
            '  ~~~~~~~~~~~~~~~~~~~~~~~~~',
            '  ~~~ ~ ~ ~ ~ ~ ~ ~ ~ ~~~~',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~~',
            '  ~~~  \\o/  ~~~~~~~~~~~~~~~',
            '  ~~~~  |   ~~~~ HELP! ~~~~',
            '  ~~~~ / \\  ~~~~~~~~~~~~~~~',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~~',
            '  ~~~ ~ ~ ~ ~ ~ ~ ~ ~ ~~~~',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~~',
            '  ~~ The underground  ~~~~~',
            '  ~~ river swallowed  ~~~~~',
            '  ~~ you whole.       ~~~~~',
            '  ~~~~~~~~~~~~~~~~~~~~~~~~~',
            '',
            '  Drowned in the deep.'
        ].join('\n'),

        fall: [
            '  __|         |__',
            ' |   EDGE!      |',
            ' |___         ___|',
            '     |  \\O   |',
            '     |   |\\  |',
            '     |   | \\ |',
            '     |       |',
            '     |    o  |',
            '     |   /|\\ |',
            '     |       |',
            '     |     . |',
            '     |       |',
            '     |       |',
            '  ___|_______|___',
            '  Fell into the void.'
        ].join('\n'),

        starvation: [
            '',
            '       _____',
            '      / x x \\',
            '      \\_---_/',
            '        |.|',
            '      --|.|--',
            '        |.|',
            '        |.|',
            '       / . \\',
            '      /  .  \\',
            '     |   .   |',
            '',
            '  No food. No water.',
            '  No hope.',
            '  Starved in the dark.'
        ].join('\n'),

        exposure: [
            '',
            '  Your lantern flickers...',
            '',
            '        {_}',
            '        |.|',
            '        |.|',
            '        |_|',
            '',
            '  ...and goes out.',
            '',
            '  D A R K N E S S',
            '',
            '  The cold takes you',
            '  before the fear does.',
            ''
        ].join('\n'),

        bald_knobbers: [
            '   THE BALD KNOBBERS',
            '',
            '    /===\\   /===\\   /===\\',
            '   | O O | | O O | | O O |',
            '   |  >  | |  >  | |  >  |',
            '   | === | | === | | === |',
            '    \\===/   \\===/   \\===/',
            '     /|\\     /|\\     /|\\',
            '    / | \\   / | \\   / | \\',
            '',
            '  Masked riders found you',
            '  on the road at night.',
            '',
            '  "This aint your land,',
            '   stranger."'
        ].join('\n')
    };

    // =========================================================
    //  TITLE ART
    // =========================================================

    var titleArt = [
        '          _/|     ||\\_',
        '        _/ ||     || \\_',
        '       /  _||_   _||_  \\',
        '      / _/ || \\_/ || \\_ \\',
        '     |_/   ||     ||   \\_|',
        '    /      ||     ||      \\',
        '   / /|    ||  M  ||    |\\ \\',
        '  / / |   _|| A  _||   | \\ \\',
        ' | |  |  / || R / ||  |  | |',
        ' | |  | |  || V|  ||  |  | |',
        ' | |  | |  || E|  ||  |  | |',
        ' | |  | |  || L|  ||  |  | |',
        '  \\ \\ | |  ||  |  || | / /',
        '   \\_\\| |__|| C||__| |/_/',
        '     \\_/ __|| A||__ \\_/',
        '      | |  || V||  | |',
        '      | |  || E||  | |',
        '      |_|__||__||__|_|',
        '     /________________\\',
        '    THE MARVEL CAVE',
        '    MINING  COMPANY',
        '      ~ 1884 ~'
    ].join('\n');

    // =========================================================
    //  SCORING ART
    // =========================================================

    var scoringArt = {

        trophy: [
            '       ___________',
            '      \\           /',
            '       \\  MARVEL /',
            '        \\  CAVE /',
            '         \\ TOP /',
            '          \\   /',
            '           \\_/',
            '            |',
            '           /|\\',
            '          /_|_\\',
            '         |_____|',
            '      MINING COMPANY',
            '     HIGH SCORE AWARD',
            '       ~ 1884 ~'
        ].join('\n'),

        tombstone: [
            '         _______',
            '        /       \\',
            '       /  R.I.P. \\',
            '      |           |',
            '      | HERE LIES |',
            '      | A  BRAVE  |',
            '      |   MINER   |',
            '      |           |',
            '      | Lost in   |',
            '      | Marvel    |',
            '      | Cave      |',
            '      |   1884    |',
            '      |           |',
            '      |___________|',
            '     //_____||_____\\\\'
        ].join('\n')
    };

    // =========================================================
    //  ANIMATION FRAMES
    // =========================================================

    var animations = {

        lantern: {
            frames: [
                [
                    '    {_}',
                    '   |* |',
                    '   |* |',
                    '   |__|',
                    '    ||'
                ].join('\n'),
                [
                    '    {_}',
                    '   | *|',
                    '   | *|',
                    '   |__|',
                    '    ||'
                ].join('\n')
            ],
            interval: 600
        },

        campfire: {
            frames: [
                [
                    '          .',
                    '        . | .',
                    '       \\  |  /',
                    '        \\ | /',
                    '    ~ ~ ~\\|/~ ~ ~',
                    '     (  {fire}  )',
                    '      \\  ~~~  /',
                    '       \\_____/',
                    '      /\\/\\/\\/\\'
                ].join('\n'),
                [
                    '        . .',
                    '       . \\|/ .',
                    '        \\ | /',
                    '      ~ ~\\|/~ ~',
                    '     (  {fire} )',
                    '      \\ ~*~~~ /',
                    '       \\_____/',
                    '      /\\/\\/\\/\\',
                    ''
                ].join('\n'),
                [
                    '       .',
                    '      .|. .',
                    '       \\| /',
                    '     ~ ~\\|/~ ~',
                    '    (  {fire}  )',
                    '     \\ ~~*~~ /',
                    '      \\_____/',
                    '     /\\/\\/\\/\\',
                    ''
                ].join('\n')
            ],
            interval: 450
        },

        water_drip: {
            frames: [
                [
                    '    ___|___',
                    '   |       |',
                    '   |   .   |',
                    '   |       |',
                    '   |       |',
                    '   |       |',
                    '   |_______|'
                ].join('\n'),
                [
                    '    ___|___',
                    '   |       |',
                    '   |       |',
                    '   |   .   |',
                    '   |       |',
                    '   |       |',
                    '   |_______|'
                ].join('\n'),
                [
                    '    ___|___',
                    '   |       |',
                    '   |       |',
                    '   |       |',
                    '   |       |',
                    '   |   o   |',
                    '   |__~~~__|'
                ].join('\n')
            ],
            interval: 700
        },

        bat_wings: {
            frames: [
                [
                    '       /\\  _  /\\',
                    '      /  \\/ \\/  \\',
                    '     /    (.)    \\',
                    '    /              \\',
                    '   /    BAT        \\'
                ].join('\n'),
                [
                    '',
                    '        __(..)__',
                    '       /  \\  /  \\',
                    '          |  |',
                    '       BAT'
                ].join('\n')
            ],
            interval: 350
        }
    };

    // =========================================================
    //  AMBIENT TEXT POOLS
    // =========================================================

    var ambientGeneral = [
        'You hear water dripping in the distance...',
        'A bat flutters past your lantern...',
        'The air smells of sulfur and damp earth...',
        'Your footsteps echo off the chamber walls...',
        'Something scurries in the darkness ahead...',
        'Your lantern casts long, dancing shadows...',
        'A cool breeze drifts from somewhere deeper...',
        'Minerals glitter in the lamplight...',
        'You hear a distant, low rumble...',
        'The walls feel slick with moisture...',
        'Silence presses in around you...',
        'Your breath makes small clouds in the cold air...',
        'The smell of ancient stone fills your nostrils...',
        'A pebble falls somewhere in the dark...',
        'The weight of the earth above is palpable...'
    ];

    var ambientByChamberId = {
        marmaros: [
            'Wagons creak along the dirt road...',
            'A dog barks from behind the general store...',
            'The blacksmith\'s hammer rings out across town...',
            'Locals eye you warily from the tavern porch...',
            'The smell of woodsmoke hangs in the air...',
            'A rooster crows from a nearby farm...',
            'You hear fiddle music drifting from the tavern...'
        ],
        cathedral_entrance: [
            'Sunlight filters down from the cave mouth above...',
            'The temperature drops sharply as you enter...',
            'Birds nest in the crevices near the entrance...',
            'The cave exhales a breath of cold, stale air...',
            'You can still see daylight behind you...'
        ],
        cathedral_floor: [
            'The ceiling vanishes into darkness 200 feet above...',
            'Bats swirl in vast spirals overhead...',
            'Your voice echoes back a dozen times...',
            'A stalagmite towers above you like a pillar...',
            'Water has carved this room over millennia...'
        ],
        sentinel_chamber: [
            'The tall stalagmite stands like a silent guard...',
            'The passage narrows around the sentinel...',
            'You squeeze past the ancient formation...',
            'The sentinel has watched this passage for eons...'
        ],
        crystal_alcove: [
            'Crystals catch your lantern light and scatter it...',
            'The formations here are delicate and beautiful...',
            'You hear a faint chiming as air moves over crystals...',
            'These crystals took thousands of years to form...',
            'Your light reveals colors you did not expect...'
        ],
        upper_passage: [
            'Old rope marks scar the walls here...',
            'Others have passed this way before you...',
            'The passage twists and turns unpredictably...',
            'You trace your hand along the rough wall...'
        ],
        echo_hall: [
            'Every sound you make returns threefold...',
            'The chamber swallows your voice and spits it back...',
            'You clap your hands and hear it echo for seconds...',
            'The acoustics here are eerie and disorienting...'
        ],
        bat_colony: [
            'Thousands of bats hang overhead like dark fruit...',
            'The stench of guano is nearly overwhelming...',
            'A few bats take flight as you approach...',
            'The floor is thick with centuries of guano...',
            'Wings rustle above like dry leaves in wind...'
        ],
        the_narrows: [
            'The walls close in on both sides...',
            'You have to turn sideways to fit through...',
            'Rock scrapes against your back and chest...',
            'Panic rises as the passage tightens...',
            'You can feel the stone pressing on your ribs...'
        ],
        gulf_of_doom: [
            'A stone falls and you never hear it land...',
            'The void before you seems to breathe...',
            'Vertigo grips you at the chasm\'s edge...',
            'The gulf is deeper than your lantern can show...',
            'One wrong step here means the end...'
        ],
        lost_river: [
            'The underground river rushes past, ice cold...',
            'The current looks deceptively strong...',
            'Where does this water go? Nobody knows...',
            'The river carved this passage over ages...',
            'Mist rises from the churning water...'
        ],
        spanish_passage: [
            'Old Spanish carvings mark these walls...',
            'Who were the Spaniards who came here in 1541?...',
            'A carved cross marks an old resting point...',
            'The markings are worn but still legible...',
            'Conquistadors once stood where you stand now...'
        ],
        deep_descent: [
            'The drop-off ahead is steep and treacherous...',
            'Loose scree shifts under your boots...',
            'You lower yourself carefully, rope in hand...',
            'The deeper you go, the colder it gets...'
        ],
        blondies_throne: [
            'Massive formations rise like frozen thrones...',
            'The chamber opens into a grand gallery...',
            'Flowstone cascades down the walls like curtains...',
            'This room feels like a cathedral of stone...',
            'You feel very small in this grand chamber...'
        ],
        cloud_room: [
            'Thick mist obscures everything beyond arm\'s reach...',
            'The vapor tastes of minerals and time...',
            'You can barely see your own hand...',
            'Something moves in the fog - or did it?...',
            'The mist swirls around your lantern light...'
        ],
        lake_chamber: [
            'The still water reflects your light perfectly...',
            'The lake is dark and impossibly still...',
            'You cannot see the bottom of this lake...',
            'Your reflection stares back from black water...',
            'A single ripple crosses the mirror surface...'
        ],
        waterfall_room: [
            'The roar of falling water fills the chamber...',
            'Spray from the waterfall soaks your clothes...',
            'The waterfall plunges from a crack high above...',
            'This is the deepest point: 700 feet below...',
            'The water pools before draining into cracks...',
            'You have reached the heart of Marvel Cave...'
        ]
    };

    // =========================================================
    //  HELPER FUNCTIONS
    // =========================================================

    /**
     * Pick a random element from an array.
     */
    function randomFrom(arr) {
        if (!arr || arr.length === 0) {
            return '';
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // =========================================================
    //  PUBLIC API
    // =========================================================

    window.AsciiArt = {

        /**
         * Returns the ASCII art string for a given chamber ID,
         * or an empty string if not found.
         * @param {string} chamberId
         * @returns {string}
         */
        getChamberArt: function(chamberId) {
            if (chamberId && chamberArt.hasOwnProperty(chamberId)) {
                return chamberArt[chamberId];
            }
            return '';
        },

        /**
         * Returns the ASCII art string for a given shop ID,
         * or an empty string if not found.
         * @param {string} shopId
         * @returns {string}
         */
        getShopArt: function(shopId) {
            if (shopId && shopArt.hasOwnProperty(shopId)) {
                return shopArt[shopId];
            }
            return '';
        },

        /**
         * Returns the ASCII art string for a given death cause,
         * or an empty string if not found.
         * @param {string} causeId - one of: cave_in, drowning, fall,
         *                           starvation, exposure, bald_knobbers
         * @returns {string}
         */
        getDeathArt: function(causeId) {
            if (causeId && deathArt.hasOwnProperty(causeId)) {
                return deathArt[causeId];
            }
            return '';
        },

        /**
         * Returns the title screen ASCII art.
         * @returns {string}
         */
        getTitleArt: function() {
            return titleArt;
        },

        /**
         * Returns scoring-related art: 'trophy' or 'tombstone'.
         * @param {string} type - 'trophy' or 'tombstone'
         * @returns {string}
         */
        getScoringArt: function(type) {
            if (type && scoringArt.hasOwnProperty(type)) {
                return scoringArt[type];
            }
            return '';
        },

        /**
         * Returns an animation object with frames and interval,
         * or null if not found.
         * @param {string} animId - one of: lantern, campfire,
         *                          water_drip, bat_wings
         * @returns {{ frames: string[], interval: number }|null}
         */
        getAnimation: function(animId) {
            if (animId && animations.hasOwnProperty(animId)) {
                return {
                    frames: animations[animId].frames.slice(),
                    interval: animations[animId].interval
                };
            }
            return null;
        },

        /**
         * Returns a random atmospheric flavor string appropriate
         * for the given chamber. Falls back to the general pool
         * if no chamber-specific text exists.
         * @param {string} chamberId
         * @returns {string}
         */
        getAmbientText: function(chamberId) {
            var pool = [];

            // Build a combined pool: chamber-specific + general
            if (chamberId && ambientByChamberId.hasOwnProperty(chamberId)) {
                pool = ambientByChamberId[chamberId].concat(ambientGeneral);
            } else {
                pool = ambientGeneral;
            }

            return randomFrom(pool);
        }
    };

})();
