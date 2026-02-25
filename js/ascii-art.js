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
        },

        stalactite_drip: {
            frames: [
                [
                    '  \\/\\/\\/\\/\\/\\/\\/',
                    '   | | |  | | |',
                    '   V V V  V V V',
                    '         .',
                    '          '
                ].join('\n'),
                [
                    '  \\/\\/\\/\\/\\/\\/\\/',
                    '   | | |  | | |',
                    '   V V V  V V V',
                    '          ',
                    '         .'
                ].join('\n'),
                [
                    '  \\/\\/\\/\\/\\/\\/\\/',
                    '   | | |  | | |',
                    '   V V V  V V V',
                    '          ',
                    '        ~o~'
                ].join('\n'),
                [
                    '  \\/\\/\\/\\/\\/\\/\\/',
                    '   | | |  | | |',
                    '   V V V  V V V',
                    '          ',
                    '       ~~~ ~~~'
                ].join('\n'),
                [
                    '  \\/\\/\\/\\/\\/\\/\\/',
                    '   | | |  | | |',
                    '   V V V  V V V',
                    '          ',
                    '          '
                ].join('\n')
            ],
            interval: 600
        },

        torch_flicker: {
            frames: [
                [
                    '    )',
                    '   }*{',
                    '   |=|',
                    '   |=|',
                    '   |_|'
                ].join('\n'),
                [
                    '   (  ',
                    '   {*}',
                    '   |=|',
                    '   |=|',
                    '   |_|'
                ].join('\n'),
                [
                    '    }',
                    '   (*)',
                    '   |=|',
                    '   |=|',
                    '   |_|'
                ].join('\n'),
                [
                    '  ( )',
                    '   {*}',
                    '   |=|',
                    '   |=|',
                    '   |_|'
                ].join('\n')
            ],
            interval: 200
        },

        cave_wind: {
            frames: [
                [
                    '  ~ ~ ~ ~ ~ ~ ~',
                    '   ~ ~ ~ ~ ~ ~',
                    '  ~ ~ ~ ~ ~ ~ ~',
                    '   ~ ~ ~ ~ ~ ~'
                ].join('\n'),
                [
                    '   ~ ~ ~ ~ ~ ~',
                    '  ~ ~ ~ ~ ~ ~ ~',
                    '   ~ ~ ~ ~ ~ ~',
                    '  ~ ~ ~ ~ ~ ~ ~'
                ].join('\n'),
                [
                    '  ~ ~ ~ ~ ~ ~ ~',
                    '    ~ ~ ~ ~ ~ ~',
                    '  ~ ~ ~ ~ ~ ~ ~',
                    '    ~ ~ ~ ~ ~ ~'
                ].join('\n'),
                [
                    '    ~ ~ ~ ~ ~ ~',
                    '  ~ ~ ~ ~ ~ ~ ~',
                    '    ~ ~ ~ ~ ~ ~',
                    '  ~ ~ ~ ~ ~ ~ ~'
                ].join('\n')
            ],
            interval: 400
        }
    };

    // =========================================================
    //  AMBIENT TEXT POOLS
    // =========================================================

    var ambientGeneral = [
        'Water drips in the distance, counting seconds the cave has no use for...',
        'A bat flutters past your lantern, close enough to feel the wind off its wings...',
        'The air smells of sulfur and wet limestone and the slow patience of geological time...',
        'Your footsteps echo off the chamber walls and come back changed, as if the cave is learning your gait...',
        'Something scurries in the darkness ahead. Something that lives here. You do not...',
        'Your lantern casts dancing shadows that move in ways the flame does not explain...',
        'A cool breeze drifts from somewhere deeper. The cave is breathing. It breathes out when the barometric pressure drops...',
        'Minerals glitter in the lamplight like a fortune that cannot be spent...',
        'A distant low rumble. The mountain settling. Or something else. The cave does not clarify...',
        'The walls are slick with mineral seepage. The limestone weeps. It has been weeping for ten thousand years...',
        'Silence presses in like a physical thing with weight and intention...',
        'Your breath makes small clouds in the fifty-eight-degree air. The only warm thing down here is you...',
        'The smell of ancient stone. Three hundred million years of Mississippian limestone. You are a footnote in its history...',
        'A pebble falls somewhere in the dark. Gravity is the cave\'s only law and it enforces it without mercy...',
        'The weight of the earth above is palpable. Hundreds of feet of Ozark ridge balanced on the stone around you...',
        'The candle flame leans toward a draft you cannot feel. The cave has currents you do not understand...',
        'Old pick marks on the wall. Someone was here before you. They did not leave their name...',
        'A mineral deposit on the wall catches the light and for one moment looks exactly like a handprint...'
    ];

    var ambientByChamberId = {
        marmaros: [
            'Wagons creak along the dirt road. Marmaros: twenty-eight souls and a hole in the ground worth fighting over...',
            'A dog barks from behind the general store. It has learned to bark at miners. There are so many miners...',
            'Jebediah Colt\'s hammer rings out across town. Steel on steel. The sound of a man who trusts metal more than men...',
            'Locals eye you from the tavern porch. Stone County folk do not trust outsiders. The Bald Knobbers taught them that...',
            'Woodsmoke and the faint ammonia stink that clings to everything within a mile of the sinkhole...',
            'A rooster crows from a nearby farm. The sound is jarringly normal. You had forgotten what normal sounds like...',
            'Fiddle music drifts from the Lantern Tavern. Someone is playing "Barbara Allen." The miners hum along without knowing they are doing it...',
            'The sinkhole exhales cold air into the warm Ozark afternoon. The locals say the cave breathes. They are not wrong...'
        ],
        cathedral_entrance: [
            'Sunlight filters down from the cave mouth ninety-four feet above. It will be the last sunlight you see for a while...',
            'The temperature drops thirty degrees in ten steps. The cave sets its own terms...',
            'Swallows nest in the crevices near the entrance. They know when to leave. You should learn from them...',
            'The cave exhales cold stale air like a sleeping animal. The Osage said it was the Devil breathing...',
            'Daylight behind you. Darkness ahead. The boundary is sharper than a knife...',
            'V-shaped marks cut deep into the limestone near the entrance. Osage warnings. Centuries old. Still legible. Still relevant...',
            'Old rope burns scar the entrance rocks. How many crews have lowered themselves into this? How many climbed back out?...',
            'A notched pine log leans against the wall -- a fragment of the Spanish ladders from 1541. Three hundred years old and still standing...'
        ],
        cathedral_floor: [
            'The ceiling vanishes two hundred feet above into a darkness your lantern cannot reach. You could stand the Statue of Liberty in here...',
            'Bats swirl in vast spirals overhead, a living tornado of forty thousand wings. The sound is not of this world...',
            'Your voice echoes back a dozen times, each repetition fainter and stranger, as if the cave is learning to speak...',
            'The Liberty Bell stalagmite towers fifty-five feet, hollow, with a crack that mirrors the real one. Coincidence. Probably...',
            'The Underground Mountain -- 124 feet of debris that fell through the sinkhole over millennia. Bones mixed with guano mixed with time...',
            'Strange markings scratched into the wall at knee height. Not pick marks. Something deliberate. Something old...',
            'Tool cuts in the limestone that predate the mining company by centuries. The Spaniards were here. Or someone was...',
            'In 1963, a man will fly a hot air balloon in this room. That fact would make no sense to you. It barely makes sense now...'
        ],
        sentinel_chamber: [
            'The Sentinel stands thirty feet tall, a calcite column where stalactite met stalagmite and fused. It looks like something keeping watch...',
            'The passage narrows around The Sentinel. Guides tell tourists it holds up the ceiling. The tourists believe them. So does your crew...',
            'Tobacco offerings sit at the base of The Sentinel. Osage, some say. Miners, say others. No one claims to have left them...',
            'The Sentinel has stood here for millennia. Drip by drip. Patient as the mountain that made it. It will outlast you and everything you know...',
            'Behind The Sentinel, a crevice most men walk past. The Spring Room is through there. Orange walls. Hidden waterfalls. The Spaniards thought it was the Fountain of Youth...',
            'Your crew tips their hats as they pass The Sentinel. A habit no one remembers starting. No one wants to be the first to stop...'
        ],
        crystal_alcove: [
            'Crystals catch your lantern light and scatter it into a hundred tiny fires. Beautiful. Worthless. Priceless...',
            'The formations here are delicate as lace and older than civilization. One careless elbow and ten thousand years of work is gone...',
            'A faint chiming as air moves over crystal edges. Music the cave makes for no audience...',
            'Dog-tooth spar crystals line the walls. Calcium carbonate. The same stuff in your bones, arranged by water and patience...',
            'Your light reveals colors in the crystal -- amber, rose, pale violet -- that have never been seen. You are the first eyes...',
            'Someone has scratched a cross into the wall near the crystals. Spanish. The cross is small and precise and very, very old...'
        ],
        upper_passage: [
            'Old rope burns scar the walls. Decades of crews hauling guano sacks through this passage, one at a time, fifty pounds each...',
            'Others have passed this way. Their boot prints are fossilized in the clay floor like a record of the desperate and the brave...',
            'The passage twists like something alive. Scalloped walls carved by pressurized water a million years before you were born...',
            'You trace your hand along the rough wall and feel the teeth marks of a thousand pickaxes. The limestone always wins. But slowly...',
            'A miner\'s graffiti: "T. MILLER 1883" scratched at shoulder height. You wonder if T. Miller made it home...',
            'The air moves here in unpredictable drafts. The cave breathes through passages you cannot see...'
        ],
        echo_hall: [
            'Every sound returns threefold and distorted. The cave speaks your words back in a voice that is not yours...',
            'The chamber swallows your voice and returns it changed. Syllables rearranged. Meaning shifted...',
            'You clap your hands and hear it echo for seven full seconds. The silence after is louder than the clap...',
            'The acoustics are disorienting. Sound comes from everywhere and nowhere. Your crew instinctively moves closer together...',
            'An old miner\'s trick: shout a number into the echo hall. Count the echoes. That\'s how many days you have left. Nobody does this twice...',
            'Something in the echo does not match. A sound returns that you did not make. Probably your imagination. Probably...'
        ],
        bat_colony: [
            'Thousands of gray bats hang overhead like dark fruit. Each one will eat its weight in insects tonight...',
            'The stench of guano is a physical force. Ammonia so thick you can taste it. Your eyes stream. Your lungs rebel...',
            'A few bats take flight as you approach, launching themselves with a sound like wet leather snapping...',
            'Centuries of guano on the floor. Nitrogen-rich. Worth seven hundred dollars a ton. Also full of a fungus that eats lungs...',
            'Wings rustle overhead like dry leaves in wind. Forty thousand bats. They were here before the Osage. They will be here after you...',
            'The bats are federally endangered gray bats -- Myotis grisescens. Science will protect them someday. Today they are just in the way...',
            'At dusk the colony pours from the sinkhole in a spiraling vortex that takes twenty minutes to pass. Twenty-four million insects die nightly...'
        ],
        the_narrows: [
            'The walls close in. Four feet seven inches of headroom. Seven feet of passage. The Ozarks pressing on your spine...',
            'You turn sideways and empty your lungs. The stone scrapes your chest and back simultaneously. Inch by inch...',
            'A three-hundred-pound man got wedged here once. They greased him with lard and hauled him out with rope. He never went underground again...',
            'Panic rises like water. The passage does not care about your fear. It was this narrow before you came and it will be this narrow after...',
            'Your ribs compress. Your lantern scrapes the ceiling. The sound of stone on glass is the sound of your life being negotiated...',
            'Beyond this point, the cave does not let go easily. Check your nerve. Check your rope. Check your reasons for being here...'
        ],
        gulf_of_doom: [
            'Drop a stone. Listen. Keep listening. The silence where the impact should be is worse than any sound...',
            'The void breathes. A cold updraft from a depth your lantern cannot reach. Three miners fell here. They were not found...',
            'Vertigo seizes you at the edge. Your body knows things your mind has not yet calculated...',
            'The richest guano deposits in the cave crust the ledges around this rim. The cave puts its treasure at the edge of the abyss...',
            'One wrong step. One wet boot. One moment of inattention. The Gulf of Doom does not offer second chances...',
            'Early explorers called this pit bottomless. The scientific explanation: clay-and-guano slurry absorbs all sound. The practical explanation: it does not matter. You are still dead...',
            'A tarnished glint in a crevice near the rim. Probably mineral deposits. Probably not a Spanish coin from 1743. Probably...'
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
            'You have reached the heart of Marvel Cave...',
            'A rusted tin tucked in a niche looks like it has been here for years...',
            'Someone once camped here; the marks are too neat to be natural...'
        ],
        the_dungeon: [
            'Iron-stained walls glisten like dried blood in your lantern glow...',
            'The passage narrows and every sound feels close and heavy...',
            'A loose stone in the wall looks like it has been pried out before...'
        ],
        spring_room: [
            'Hidden water trickles behind calcite curtains, loud as rainfall...',
            'You find old initials carved beside the spring, half-faded with time...',
            'The orange walls shimmer as if someone polished them by hand...'
        ],
        lake_genevieve: [
            'Your lantern reveals pale ripples beneath the glassy surface...',
            'Tiny shapes move in the dark water where no sunlight has ever reached...',
            'The still lake suddenly stirs with nearly invisible life...'
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
