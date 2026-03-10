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

    var townHeroArt = [
        '       .-------------------------------------------------------.',
        '      /                 M A R M A R O S                       /|',
        '     /-------------------------------------------------------/ |',
        '    |   _[]_      ________      _[]_        ________        |  |',
        '    |  [____]    | BANK  |     [____]      | DEPOT |        |  |',
        '    |  |    |    |______|     |    |       |______|        |  |',
        '    |  |____|   _|_[]___|_    |____|     ___|_[]___        |  |',
        '    |           |  MAIN ST |               |                |  |',
        '    |===========|==========|===============|================|  |',
        '    |   wagons      porches      pick men       cave wind   |  |',
        '    |_______________________________________________________| /',
        '    |  Evening over the sinkhole. Lamps on. Business open.  |/',
        '    `-------------------------------------------------------\''
    ].join('\n');

    var shopArt = {

        general_store: [
            '    .----------------------------------------.',
            '   /        MARMAROS OUTFITTERS             /|',
            '  /----------------------------------------/ |',
            ' |  ____   ____   ____   ____   ____      |  |',
            ' | |____| |____| |____| |____| |____|     |  |',
            ' | |rope| |oil | |food| |soap| |salt|     |  |',
            ' |----------------------------------------|  |',
            ' |==|==================================|==|  |',
            ' |  |          General Store           |  |  |',
            ' |==|==================================|==|  |',
            ' |  seed sacks   lamp glass   coffee       | /',
            ' |_________________________________________|/',
            ' | []                                  []  |',
            ' |______________ OPEN AT SUNUP ____________|'
        ].join('\n'),

        blacksmith: [
            '    .----------------------------------------.',
            '   /          OZARK BLACKSMITH              /|',
            '  /----------------------------------------/ |',
            ' |              /\\                         |  |',
            ' |         ____/  \\____     * CLANG *      |  |',
            ' |        |   FORGE    |                   |  |',
            ' |        |_~~fire~~___|      hammer       |  |',
            ' |            {~~}            anvil        |  |',
            ' |----------------------------------------|  |',
            ' | picks    braces    pitons    repairs    | /',
            ' |_________________________________________|/',
            ' | []                                  []  |',
            ' |______________ SPARKS AT ALL HOURS ______|'
        ].join('\n'),

        sweets: [
            '    .----------------------------------------.',
            '   /        JUNE WARD SWEET SHOP            /|',
            '  /----------------------------------------/ |',
            ' |   rock candy   taffy hooks   lemon drops|  |',
            ' |    [##]          \\    /          [oo]   |  |',
            ' |                    \\__/                 |  |',
            ' |----------------------------------------|  |',
            ' | coffee   cinnamon rolls   paper sacks   | /',
            ' |_________________________________________|/',
            ' | []                                  []  |',
            ' |__________ SUGAR AND GOOD SENSE _________|'
        ].join('\n'),

        tavern: [
            '    .----------------------------------------.',
            '   /         THE LANTERN TAVERN             /|',
            '  /----------------------------------------/ |',
            ' |   {_}                         Est. 1878 |  |',
            ' |   |*|    fiddles   cards   hot stew     |  |',
            ' |   |_|                                   |  |',
            ' |----------------------------------------|  |',
            ' | |b||b||b||b||b||b||b||b||b||b|         |  |',
            ' | whiskey   rye   coffee   one bed left  | /',
            ' |_________________________________________|/',
            ' | []                                  []  |',
            ' |____________ MUSIC AFTER DARK _________ _|'
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
        '        .-----------------------------------------------.',
        '       /            MARVEL CAVE MINING CO.             /|',
        '      /-----------------------------------------------/ |',
        '     |            ___            ___                  |  |',
        '     |          _/   \\__      __/   \\_               |  |',
        '     |         /  /\\    \\____/    /\\  \\              |  |',
        '     |        /__/  \\    M A R V E L  /              |  |',
        '     |        \\  \\  /      C A V E   /               |  |',
        '     |         \\__\\/________________/                |  |',
        '     |             \\    DEN BELOW  /                 |  |',
        '     |              \\_____________/                  |  |',
        '     |-----------------------------------------------|  |',
        '     |      twenty days under stone for your cut     | /',
        '     |_______________________________________________|/'
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
        ].join('\n'),

        ledger: [
            '      ______________________',
            '     /  COMPANY LEDGER     /|',
            '    /---------------------/ |',
            '   |  CONTRACT CLOSED     | |',
            '   |  yard cleared        | |',
            '   |  books settled       | |',
            '   |  line hauled clear   | |',
            '   |----------------------| |',
            '   |  MARMAROS, 1884      | /',
            '   |______________________|/'
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
    //  GAMEPLAY MICRO ART (new)
    // =========================================================

    var gameplayArt = {
        mining: ['  /\  ', ' /  \_', '/_/\__\\', '  ||  '].join('\n'),
        descend: ['  ||', '  ||', ' /  \\', '/_/\\_\\'].join('\n'),
        ascend: ['  /\\', ' /  \\', '/_/\\_\\', '  ||'].join('\n'),
        day: [' \\ | / ', ' - O - ', ' / | \\ '].join('\n'),
        night: ['  .--. ', ' ( __ )', '  `--\' '].join('\n'),
        discovery: [' _____  _____ ', '|  _  \\|_   _|', '| | | |  | |  ', '|_| |_|  |_|  '].join('\n'),
        milestone25: ['[==      ]', ' 25% DONE '].join('\n'),
        milestone50: ['[=====   ]', ' HALF WAY '].join('\n'),
        milestone75: ['[======= ]', ' ALMOST!  '].join('\n'),
        status_surface: [' _/\\_ ', '/_.._\\', '  ||  '].join('\n'),
        status_mining: [' /\\ ', '/__\\', ' || '].join('\n'),
        status_rest: [' zZ ', '(..)', '/__\\'].join('\n')
    };

    var eventArt = {
        bat_swarm: [' /\ /\ ', '( o.o )', ' > ^ < '].join('\n'),
        rockfall: ['  ___ ', ' /###\\', '/#####\\'].join('\n'),
        flooding: ['~~~~~~', ' ~~~~ ', '~~~~~~'].join('\n'),
        bad_air: [' . . . ', '( x x )', ' \___/ '].join('\n'),
        cave_in: ['\\\\|////', ' --*-- ', '////|\\\\'].join('\n'),
        equipment_break: [' |-| ', ' /X\\ ', ' |_| '].join('\n'),
        snakebite: [' /^\/^\\', '>_  _<', '  \\/  '].join('\n'),
        rope_break: [' |||| ', ' ||// ', '  /   '].join('\n')
    };

    // =========================================================
    //  AMBIENT TEXT POOLS
    // =========================================================

    var ambientGeneral = [];

    var ambientByChamberId = {
        marmaros: [
            'Wagon wheels complain on the ridge road and everybody in town hears it.',
            'Forge sparks jump somewhere past the hotel porch.',
            'Woodsmoke, mule sweat, and the faint sting of guano money hang together in the air.',
            'Somebody on a porch stops talking when your boots hit the boards.',
            'The sinkhole breathes cold against a warm Ozark afternoon.'
        ],
        cathedral_entrance: [
            'Daylight hangs behind you like something already spent.',
            'The air turns cave-cold in the space of a few careful steps.',
            'Rope burns score the entrance stone where other crews paid their way down.',
            'The mouth takes light and gives back stale breath.',
            'A swallow cuts across the opening and leaves you to the dark.'
        ],
        the_sentinel: [
            'The Sentinel stands tall enough to make hats come off without anyone saying why.',
            'A pinch of old tobacco dust sits near the base of the stone.',
            'The side crevice by the Sentinel looks too small until you need it badly.',
            'The room changes its tone here and the crew feels it.',
            'Even your lamp seems to hold steadier beside the column.'
        ],
        cathedral_floor: [
            'Bat-noise rolls under the roof and never quite lands.',
            'The room is too big for your lantern and knows it.',
            'Loose guano gives under every step like wet grain.',
            'The main haul route looks obvious until you remember how many men still got lost here.',
            'The hidden fork near the Sentinel waits for tired crews.'
        ],
        serpentine_passage: [
            'The passage twists hard enough to make every load feel heavier.',
            'Old pick marks show where other crews tried to argue with the walls.',
            'A sack catches here if you give it half a chance.',
            'Your shoulder finds stone at nearly every turn.',
            'The route feels more like work than the mining does.'
        ],
        egyptian_room: [
            'Smooth stone throws your light back in a flatter, colder way.',
            'Old room names cling here longer than reason does.',
            'It is the kind of chamber that makes tired men stare upward too long.',
            'The cave looks dressed up here and you do not trust it.',
            'Boot noise comes back cleaner than it should.'
        ],
        gulf_of_doom: [
            'Cold air rises from the drop and cuts through the guano stink.',
            'The ledge looks wide until you stand on it.',
            'Pebbles leave the rim fast and never bother reporting back.',
            'The best dirt sits where a bad step becomes history.',
            'Everybody checks footing twice here and still does not feel wise.'
        ],
        fat_mans_misery: [
            'Stone presses your ribs from both sides at once.',
            'Breathing wrong in here feels like using up space you do not own.',
            'Your lamp scrapes rock close enough to make glass sound dangerous.',
            'Nobody hurries through this squeeze no matter what they claim later.',
            'The passage wants patience and takes skin.'
        ],
        the_dungeon: [
            'Rust stains run down the wall like something still fresh in bad light.',
            'The low roof makes every shoulder feel too broad.',
            'Air sits heavy here before it turns cruel.',
            'Loose stone remembers being moved once already.',
            'The room punishes carelessness faster than most.'
        ],
        spring_room: [
            'Water talks softly behind calcite curtains.',
            'Orange stone catches light like banked coals.',
            'The chamber smells cleaner than the rest of the cave and everybody notices.',
            'Old initials fade in the damp along the wall by the pool.',
            'Men arrive here sore and leave quieter.'
        ],
        blondies_throne: [
            'Flowstone rises in folds too grand for workaday men.',
            'The room invites whispering and nobody argues with it.',
            'Guano lies thick around the base of the stone seat.',
            'Every lantern shadow in here looks ceremonial by accident.',
            'The chamber feels less mined than visited.'
        ],
        cloud_room: [
            'Low vapor carries the worst of the room straight into your throat.',
            'Your lamp cuts only a short yellow wound through the haze.',
            'The guano is rich enough to keep you here too long.',
            'Every breath tastes like the room is keeping score.',
            'Mist beads on lashes and makes the whole chamber feel closer.'
        ],
        mammoth_room: [
            'The bats own the ceiling in numbers your mind quits counting.',
            'Wing-rustle turns the dark overhead into weather.',
            'The room sounds alive even when nobody speaks.',
            'Droppings fall often enough to make you stop looking up.',
            'Every man in the crew wants through this one quickly.'
        ],
        lost_river: [
            'Black water runs beside the route with more speed than light.',
            'The river changes pitch before it changes anything else.',
            'Broken reflections jump in the current and vanish.',
            'Wet stone keeps no promises under a boot heel.',
            'The water sounds close enough to touch and farther than courage likes.'
        ],
        lake_genevieve: [
            'Still water holds your lamp in one clean line.',
            'The lake is quiet enough to make your heartbeat feel rude.',
            'Something pale stirs below the surface and is gone again.',
            'The far edge of the chamber hides in its own reflection.',
            'No one talks loudly beside this water.'
        ],
        lake_miriam: [
            'The second lake feels deeper before you even see all of it.',
            'Silence settles harder here than in the first chamber.',
            'Your light floats on the surface and never reaches whatever keeps the bottom.',
            'Even careful footsteps sound too sharp around this water.',
            'The room makes men wonder who first stood here and why they stayed.'
        ],
        waterfall_room: [
            'The roar starts before the room appears.',
            'Cold spray reaches you before the fall does.',
            'Mist hangs in the air and slicks every tool handle.',
            'The chamber is loud enough to swallow second thoughts.',
            'This deep, even rich dirt feels earned at gunpoint.'
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

        getTownArt: function() {
            return townHeroArt;
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

        getGameplayArt: function(id) {
            return (id && gameplayArt[id]) ? gameplayArt[id] : '';
        },

        getEventArt: function(id) {
            return (id && eventArt[id]) ? eventArt[id] : '';
        },

        /**
         * Returns a chamber-specific atmospheric line.
         * @param {string} chamberId
         * @returns {string}
         */
        getAmbientText: function(chamberId) {
            if (chamberId && ambientByChamberId.hasOwnProperty(chamberId)) {
                return randomFrom(ambientByChamberId[chamberId]);
            }
            return randomFrom(ambientGeneral);
        }
    };

})();
