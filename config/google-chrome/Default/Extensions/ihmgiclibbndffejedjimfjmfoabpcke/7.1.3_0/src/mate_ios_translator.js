/*
 * Mate's Safari Extension v1.1.0
 * Created: 03/19
 * Last updated: 28/03/19
 * Twopeople Software (c)
 *
 * Required CSS files:
 *  "res/styles/pages/common/main.css"
 *  "res/styles/ui_components/tooltip/simple.css"
 *  "res/styles/ui_components/tooltip/help.css"
 *  "res/styles/ui_components/tooltip/helpSelected.css"
 *
 * Required JS files:
 *  "src/lib/jquery.js"
 *  "src/ui_components/scrollbar/scrollbar.js"
 */

//
// Constants
//
const TOOLTIP_PREFIX = "TnITTtw-";
const MAX_TEXT_LEN = 20000;

// For production Action Extension should be false
// For WebkitView or Chrome testing - true
const CHROME_DEBUG = false;

// Should be true only for WebkitView testing
const SAFARI_DEBUG = false;

const SYMBOL_LANGS = ['zh-TW', 'zh-CN'];

var TTS_LANGS = {}; // supported

if (SAFARI_DEBUG) {
    (function () {
        console.log = function (message) {
            webkit.messageHandlers.iosListener.postMessage(message);
        };
    })();

    window.onerror = function (e, source, lineno, colno, error) {
        console.log('Error: ' + e + ' / ' + source + ':' + lineno + ':' + colno + ' / ' + error);
    };
}

function updateSTTLangs() {
    TTS_LANGS = {};

    var available_voices = window.speechSynthesis.getVoices();

    available_voices.forEach((voice) => {
        var short_lang = voice.lang.split('-').shift();

        if (LANGS.indexOf(voice.lang) > -1 || LANGS.indexOf(short_lang) > -1) {
            TTS_LANGS[voice.lang] = voice;
            TTS_LANGS[short_lang] = voice;
        }
    });
}

var LOCALES = {};
var FROM = 'en';
var TO = 'es';
var LANGS = [];
var RECENTS = [];
var USER_COUNTRY = 'US';
var MATE_SERVER = '';
var DICT_SPEED = '0.5';
var AMPLITUDE_USERID = 0;

var opened_tooltips = 0;

const BAR_CODE = '<div class="mate-ios-bar">' +
    '   <div class="mate-bar-collapsed">' +
    '       <div class="mate-bar-langs"><%=ext_from_to%></div>' +
    '       <div class="mate-translate-button">Translate</div>' +
    '       <div class="mate-bar-buttons">' +
    '           <div class="mate-button-shutdown"></div>' +
    '           <div class="mate-button-fullpage"></div>' +
    '           <div class="mate-button-settings"></div>' +
    '       </div>' +
    '   </div>' +
    '   <div class="mate-bar-settings">' +
    '       <div class="mate-settings-title"><%=ext_settings%></div>' +
    '       <div class="mate-settings-collapse"></div>' +
    '       <div class="mate-settings-buttons">' +
    '           <div class="mate-settings-fullpage"><%=ext_fullpage%></div>' +
    '           <div class="mate-settings-shutdown"><%=ext_disable%></div>' +
    '       </div>' +
    '       <div class="mate-settings-langs">' +
    '           <div class="mate-language-button mate-from-lang" data-lang="<%=from_code%>"><%=from%></div>' +
    '           <div class="mate-swap-button"></div>' +
    '           <div class="mate-language-button mate-to-lang" data-lang="<%=to_code%>"><%=to%></div>' +
    '       </div>' +
    '   </div>' +
    '   <div class="mate-bar-langpicker">' +
    '       <div class="mate-langpicker-back"></div>' +
    '       <div class="mate-langpicker-title"><%=lang_pick%></div>' +
    '       <div class="mate-langpicker-list"></div>' +
    '   </div>' +
    '</div>';

//
// Flags defined at start
//

var dark_mode = false;
//var double_click_enabled = true;
//var selection_enabled = true;
var show_translit = true;
var show_ipa = true;
var scale = 0.75; // possible options: 1.0 - big (default), 0.85 - medium, 0.75 - small

// add 0.05 to scale for every 375 px of screen width after the first 375
// iphone 8+ has 375, so it shouldn't be scaled up any more than the default value on it
// however, on ipad (which is 1366 fullscreen), it will has a 0.95x scale instead of 0.75x
scale += Math.max(0, Math.floor($(window).width() / 375) - 1) * 0.05;

console.log('Scale:', scale, '(default=0.75)');

//
// Dynamically changed flags
//

var tooltip_id = 0;
var is_translating = false;
var last_call_args = {
    selectionBB: null,
    from: "",
    to: "",
    text: ""
};

//
// On DOM loaded
//

const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
const aspect = window.screen.width / window.screen.height;
const IS_IPHONE_X = iPhone && aspect.toFixed(3) === "0.462";

var upd_interval = null;

function init() {
    console.log("init");

    if ($('.mate-ios-bar').length > 0) {
        console.log("already initialized.");
        return;
    }

    updateSTTLangs();

    pickFastestMateServer();

    if ($('style[class="mate-ios-style"]').length === 0) {
        $('body').append('<style class="mate-ios-style">' + CSS + '</style>');
    }

    $('body').append(compileString(BAR_CODE, $.extend(LOCALES, {
        from_code: FROM,
        to_code: TO,
        from: getLocale(FROM),
        to: getLocale(TO)
    })));

    $(window).on('touchend', () => {
        var selection = _getSelection();

        console.log('touchend', selection.toString());

        if (selection && selection.toString()) {
            var params = getSelectionParameters(selection);

            last_call_args.text = selection.toString();
            last_call_args.selectionBB = params;
        }
    });

    if (CHROME_DEBUG) {
        $(window).dblclick(handleTranslation);
    }

    setTimeout(function () {
        $('.mate-button-settings').on('click', openBarSettings);
        $('.mate-button-fullpage, .mate-settings-fullpage').on('click', translateFullpage);
        $('.mate-button-shutdown, .mate-settings-shutdown').on('click', shutExtensionDown);
        $('.mate-settings-collapse').on('click', closeExtensionSettings);
        $('.mate-swap-button').on('click', swapLangs);
        $('.mate-langpicker-back').on('click', closeLangPicker);
        $('.mate-language-button').on('click', openLangPicker);
        $('.mate-translate-button').on('click', () => {
            handleTranslation("tap-and-translate-safari");
        });

        if (IS_IPHONE_X) {
            new OnActionBar({
                onInit: (data) => {}, // fires when instatiated
                onVisible: (data) => {}, // when the UI expands (visible)
                onCollapse: (data) => {}, // when the UI minimizes
                setAttribute: true // set classes on root element
            });
        }
    }, 200);

    // bind tooltip closing
    //$(window).on('click', closeTooltip);
    $('body').on('click', closeTooltip);

    // check if there's selected text
    upd_interval = setInterval(checkOnSelectedText, 100);
}

class OnActionBar {
    constructor(options) {
        if (OnActionBar.isIOS()) {
            Object.assign(this, options);
            this.data = {
                initialHeight: 0,
                collapsedHeight: 0,
                isCollapsed: false
            };

            this._init();
            this._listen();

            return this;
        } else {
            return false;
        }
    }

    _init() {
        const root = document.documentElement;

        this._prevState = this.isCollapsed;
        this.data.device = OnActionBar.isIOS()[0];

        if (!root.classList.contains(this.data.device)) {
            root.classList.add(this.data.device.toLowerCase());
        }

        if (this.data.initialHeight === 0) {
            this.data.initialHeight = window.innerHeight;
            this.previousHeight = this.data.initialHeight;
        }

        this.onInit(this.data);
    }

    _listen() {
        window.addEventListener('scroll', () => {
            if (this.previousHeight === window.innerHeight) {
                if (window.innerHeight > this.data.initialHeight) {
                    if (this.data.collapsedHeight === 0 || this.data.collapsedHeight < window.innerHeight) {
                        this.data.collapsedHeight = window.innerHeight;
                    }

                    this._setState(true, this.onCollapse);
                } else {
                    this._setState(false, this.onVisible);
                }
            } else {
                this.previousHeight = window.innerHeight;
            }
        });
    }

    _setState(isCollapsed, callback) {
        this.data.isCollapsed = isCollapsed;

        if (this._prevState !== this.data.isCollapsed) {
            this._prevState = this.data.isCollapsed;

            if (this.setAttribute) {
                const root = document.documentElement;
                root.classList.remove('is-actionbar');
                if (this.data.isCollapsed) root.classList.add('is-actionbar');
            }

            callback(this.data);
        }
    }

    static isIOS(device) {
        const devices = device || 'iPad|iPhone';
        const regex = new RegExp(`(${devices})`);
        return navigator.userAgent.match(regex);
    }
}



//export default OnActionBar;

function sendAmplitudeEvent(event) {
    if (!AMPLITUDE_USERID || typeof event !== 'string') {
        return;
    }

    $.ajax({
        url: 'https://api.amplitude.com/2/httpapi',
        type: 'POST',
        data: JSON.stringify({
            "api_key": "a7a14afc5686eb7995c8d2672a3dd354",
            "events": [{
                "user_id": AMPLITUDE_USERID,
                "event_type": event,
                "time": Date.now()
            }]
        }),
        success: function (d) {
            console.log('Amplitude event succeeded.');
            console.log(d);
        },
        error: function (e) {
            console.log('Amplitude request failed.');
            console.log(e);
        }
    });
}

function pickFastestMateServer() {
    var p = new Ping();

    var times = {};
    var c = 0;

    var pick = function () {
        if (times['us'] > times['eu']) {
            MATE_SERVER = '2'; // use the EU server
        } else {
            MATE_SERVER = ''; // use the US server
        }
    };

    var saveTime = function (ms, server) {
        times[server] = ms;
        ++c;

        if (c === 2) {
            pick();
        }
    };

    p.ping('https://api.matetranslate.com', function (err, ms) {
        saveTime(ms, 'us');
    });

    p.ping('https://api2.matetranslate.com', function (err, ms) {
        saveTime(ms, 'eu');
    });
}

function checkOnSelectedText() {
    if (getSelectedText().trim() !== '') {
        $('.mate-bar-langs').fadeOut(150, () => {
            $('.mate-translate-button').fadeIn(150);
        });
    } else {
        $('.mate-translate-button').fadeOut(150, () => {
            $('.mate-bar-langs').fadeIn(150);
        });
    }
}

function openBarSettings() {
    $('.mate-bar-collapsed').slideUp(150, () => {
        $('.mate-bar-settings').slideDown(150);
    });

    sendAmplitudeEvent('actext_expand_settings');
}

const BING_LANGS = {
    "bs": "bs-Latn",
    "sr": "sr-Cyrl",
    "zh-TW": "zh-CHT",
    "zh-CN": "zh-CHS"
};

function getBingCompatibleLang(lang) {
    return BING_LANGS[lang] || lang;
}

function translateFullpage() {
    dispatch(getBingCompatibleLang(TO) + ',' + getLocale('translated_to') + ' ' + getLocale(TO) + ',' + 'Already in ' + getLocale(TO) + ',' + getLocale("Translating...") + ',' + 'cancel' + ',' + '000000000A9F426B41914349A3EC94D7073FF941');

    shutExtensionDown(true);

    sendAmplitudeEvent('actext_translate_fullpage');
}

function shutExtensionDown(skip_style_removal) {
    $('.mate-ios-bar').animate({bottom: -parseInt($('.mate-ios-bar').css('height'))}, 150, function () {
        $(this).remove();
    });

    // remove all tooltips & spinners
    $('.' + TOOLTIP_PREFIX + 'tooltip-main-wrap').remove();
    $('.' + TOOLTIP_PREFIX + 'translate-loading').remove();

    if (!skip_style_removal) {
        console.log('remove extension including styles');

        $('.mate-ios-style').remove();

        sendAmplitudeEvent('actext_shutdown');
    }
}

function closeExtensionSettings() {
    $('.mate-bar-settings').slideUp(150, () => {
        $('.mate-bar-collapsed').slideDown(150);
    });

    sendAmplitudeEvent('actext_collapse_settings');
}

function updateLangs() {
    $('.mate-bar-langs').html(compileString(getLocale("ext_from_to"), {
        from: getLocale(FROM),
        to: getLocale(TO)
    }));

    $('.mate-from-lang').html(getLocale(FROM)).attr('data-lang', FROM);
    $('.mate-to-lang').html(getLocale(TO)).attr('data-lang', TO);
}

function swapLangs() {
    var t = FROM;
    FROM = TO;
    TO = t;

    updateLangs();

    sendAmplitudeEvent('actext_swap_langs');
}

function openLangPicker() {
    var SEL_TYPE_FROM = true;

    if ($(this).hasClass('mate-to-lang')) {
        SEL_TYPE_FROM = false;
    }

    $('.mate-bar-settings').slideUp(150, () => {
        $('.mate-bar-langpicker').slideDown(150);
    });

    var $list = $('.mate-langpicker-list');

    $list.html(''); // empty after the last use

    $list.append('<div class="mate-langpicker-group">' + getLocale("recent_languages") + '</div>');

    function render(langs) {
        langs.forEach((lang) => {
            var sel_class = '';

            if (!SEL_TYPE_FROM && lang === 'auto') {
                return;
            }

            if ((SEL_TYPE_FROM && lang === FROM) || (!SEL_TYPE_FROM && lang === TO)) {
                sel_class = 'mate-selected';
            }

            $list.append('<div class="mate-langpicker-item ' + sel_class + '" data-lang="' + lang + '">' + getLocale(lang) + '</div>');
        });
    }

    render(RECENTS);

    $list.append('<div class="mate-langpicker-group">' + getLocale("all_languages") + '</div>');

    render(LANGS);

    $('.mate-langpicker-item').on('click', (event) => {
        chooseLang(SEL_TYPE_FROM, $(event.target).data('lang'));
    });

    sendAmplitudeEvent('actext_open_picker');
}

function chooseLang(is_from, lang) {
    if (is_from) {
        FROM = lang;
    } else {
        TO = lang;
    }

    updateLangs();
    closeLangPicker();
}

function closeLangPicker() {
    $('.mate-bar-langpicker').slideUp(150, () => {
        $('.mate-bar-settings').slideDown(150);
    });

    sendAmplitudeEvent('actext_close_picker');
}

function getLocale(key) {
    var localized = LOCALES[key];

    if (localized) {
        return localized;
    } else {
        console.log("The key \"" + key + "\" is not localized!");
        return key;
    }
}

function sortLangs(langs) {
    return langs.sort((a, b) => {
        if (a === 'auto' && b !== 'auto') return -1;
        if (a === 'auto' && b === 'auto') return 0;
        if (a !== 'auto' && b === 'auto') return 1;

        return getLocale(a).localeCompare(getLocale(b));
    });
}

if (!CHROME_DEBUG) {
    var Action = function () {
    };

    Action.prototype = {
        run: function (arguments) {
            arguments.completionFunction({ok: true});
        },

        finalize: function (arguments) {
            // get data from arguments

            console.log(arguments);

            // locales, from/to languages

            LOCALES = arguments.locales;
            RECENTS = arguments.recently_used;
            LANGS = sortLangs(arguments.all_languages);
            FROM = arguments.from;
            TO = arguments.to;
            USER_COUNTRY = arguments.user_country;
            DICT_SPEED = arguments.dict_speed;
            AMPLITUDE_USERID = arguments.amplitude_userid;

            init();
        }
    };

    var ExtensionPreprocessingJS = new Action
} else {
    FROM = 'en';
    TO = 'de';

    RECENTS = sortLangs(["en", "de", "ru", "es"]);
    LANGS = sortLangs(["am", "co", "fy", "gd", "haw", "ku", "ky", "lb", "ps", "sd", "sm", "sn", "xh", "no", "uz", "fa", "mg", "de", "ig", "ko", "lt", "pl", "tl", "ro", "bn", "auto", "be", "zh-CN", "id", "la", "eu", "mn", "st", "sk", "ta", "da", "gu", "lo", "gl", "uk", "el", "ml", "vi", "si", "pt", "mt", "it", "so", "ceb", "hr", "bg", "lv", "tg", "te", "ht", "ha", "pa", "su", "ur", "ca", "cs", "ne", "sr", "sq", "my", "af", "et", "hu", "cy", "ms", "ru", "mr", "ga", "bs", "hmn", "hy", "sw", "is", "sv", "fi", "eo", "ka", "jw", "mk", "zh-TW", "en", "mi", "sl", "ny", "es", "th", "km", "yo", "zu", "ja", "tr", "nl", "kn", "yi", "az", "he", "ar", "hi", "kk", "fr", "en-us"]);
    AMPLITUDE_USERID = 12345;

    LOCALES = {
        "ar": "Arabic",
        "en": "English",
        "de": "German",
        "ru": "Russian",
        "es": "Spanish",
        "fr": "French",

        "lang_pick": "Select a language",
        "recent_languages": "Recently used",
        "all_languages": "All languages",

        "ext_from_to": "<%=from%> to <%=to%>",
        "ext_settings": "Mate Extension Settings",
        "ext_disable": "Disable extension",
        "ext_fullpage": "Translate<br>full page",
        "translated_to": "Translated to",
        "show_original": "Show original",
        "Translate": "Translate",
        "No Internet Connection": "No Internet Connection",
        "Save": "Save",
        "Continue": "Continue",
        "noun": "noun",
        "verb": "verb",
        "adverb": "adverb",
        "adjective": "adjective",
        "interjection": "interjection"
    };

    $(init);
}

function translate(text, id, type) {
    text = $('<div/>').html(text).text(); // escape html tags

    googleApi.getTextTranslation(FROM, TO, text, function (output) {
        if (output.error) {
            displayTranslation({
                offline: true
            });

            sendAmplitudeEvent('actext_translate_error_offline');
        } else {
            googleApi.getInternalJSONFormat(output, text, TO, (output_it_format) => {
                if (!output_it_format[3]) {
                    displayTranslation({
                        no_results: true
                    });

                    sendAmplitudeEvent('actext_translate_error_noresults');
                } else {
                    displayTranslation({
                        id: id,
                        from: FROM,
                        to: TO,
                        translation: output_it_format
                    });
                }
            });
        }
    });

    sendAmplitudeEvent('actext_translate');
}

(function (undefined) {

    const MAX_STR_LEN = 1000; // per one request to the server

    const IPA_LANGS = "en,af,bs,ca,cs,da,de,el,eo,es,fi,fr,hr,hu,it,kn,ku,lv,"
        + "nl,pl,pt,ro,sk,sr,sv,sw,ta,tr,zh-TW,cy,grc,hi,hy,id,is,ka,la,mk,"
        + "no,ru,sq,vi,zh-CN".split(",");

    const YANDEX_LANGS = {
        "zh-CN": "zh",
        "zh-TW": "zh",
        "jw": "jv",
        "iw": "he",
        "auto": "jv" // It does not have an "auto" language but it detects a lang if you supply a wrong one
    };

    var positions = {
        '': 0,
        noun: 1,
        verb: 2,
        adjective: 3,
        adverb: 4,
        pronoun: 5,
        preposition: 6,
        conjunction: 7,
        interjection: 8,
        abbreviation: 9,
        phrase: 10,
        suffix: 11,
        auxiliaryverb: 12
    };

    var parts_of_speech = [];

    for (var key in positions) {
        parts_of_speech.push(key);
    }

    var yf = function (a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b[c + 2];
            d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
            d = "+" == b[c + 1] ? a >>> d : a << d;
            a = "+" == b[c] ? a + d & 4294967295 : a ^ d;
        }

        return a;
    };

    var tk = function (a) {
        var d = [];

        for (var f = 0, e = 0; f < a.length; ++f) {
            var g = a.charCodeAt(f);

            if (128 > g) {
                d[e++] = g;
            } else {
                if (2048 > g) {
                    d[e++] = g >> 6 | 192;
                } else {
                    d[e++] = g >> 12 | 224;
                    d[e++] = g >> 6 & 63 | 128;
                }
                d[e++] = g & 63 | 128;
            }
        }

        var b = 0;
        var tk = 0;

        for (e = 0; e < d.length; e++) {
            tk += d[e];
            tk = yf(tk, "+-a^+6");
        }

        tk = yf(tk, "+-3^+b+-f");

        if (0 > tk) {
            tk = (tk & 2147483647) + 2147483648;
        }
        tk %= 1E6;

        return tk.toString() + "." + (tk ^ b).toString();
    };

    const BING_AUTH_URL = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    const BING_ocpApimSubscriptionKeyHeader = "Ocp-Apim-Subscription-Key";
    const BING_KEY_ONE = "0484d3977728436681fc369e7a614a43";

    const YT_KEYS = "trnsl.1.1.20181102T213252Z.15973c8fd1497069.dfef0ce2d1d66c4b3a560986cfd349cc27adceef,trnsl.1.1.20181102T213332Z.79148d90f1c6e2d5.c05d93cb4000e5eb194a8cb0302a2577e1786456,trnsl.1.1.20181102T213412Z.b7d99cd224b50875.78b25ec3b559d218c468a15718d62aa9160a6775,trnsl.1.1.20181102T213431Z.541628d09094c1a3.ff27af10a741cd223c176acde97e02d088e5f924,trnsl.1.1.20181102T213450Z.93ccf977a373c675.e773350d58a6b56434efb4e1192683e45462d7e9,trnsl.1.1.20181102T213509Z.f880b66413c0aaf3.9571c4386c6aeb148626ba31ec284691dec1ccaf,trnsl.1.1.20181102T213527Z.eb68115e91aab47f.4da25db7117bff3b15b1dc06fababa6a3c3a8535,trnsl.1.1.20181102T213549Z.ae5a65262a8dcd37.6d7ca0bc28077563a22044c73982101d802110ce,trnsl.1.1.20181102T213613Z.0bad11f72f75fcfa.5a93be6a7aa651b1ef3a36f1fe4ca9af3ac7e32b,trnsl.1.1.20181102T213633Z.a390634b03f595d9.451e188304339141a5c73bcd8b5c25bc0afa4dd9,trnsl.1.1.20181102T213652Z.d9d75034bf77120a.1737bc1c6984c39aeccf2e3581077be809b09b45,trnsl.1.1.20181102T213710Z.8b323dc6d80bba83.f83adcebeaca98ce4445a3d0d328acb59fb577a4,trnsl.1.1.20181102T213729Z.d50920bce790c915.e87f433ef69c108970909acd514734b31556ca4b,trnsl.1.1.20181102T213749Z.3e2b20c226adc8f7.fa0e8f8179d9824864262c0df8d98a222bf06e95,trnsl.1.1.20181102T213808Z.9c3b0910f60f8844.d7a5174868016700c629708e491842a4ff7dfff4,trnsl.1.1.20181102T213936Z.7c005f281fd3959e.a88a3f0411a0b373f941de434e960ec512f1892b,trnsl.1.1.20181102T214014Z.c351b40bd641f99c.114eb8303466d0add7fbca0f7a661d75def7f4c9,trnsl.1.1.20181102T214042Z.77ed3fa8560a999d.9001ccdb59651617814c0720a35dfc1c4ca32bc1,trnsl.1.1.20181102T214151Z.8c6ed1edcf6b527c.7a505097fe32ea5711ff27d44fadd1f84d64e87f,trnsl.1.1.20181102T204954Z.06a524538afb5370.d7c3461460c2e788cb6f67da941b076d65ee49f4,trnsl.1.1.20181102T205629Z.8c5a5671b2c94734.1cebf2b46d03aa6f21a3aada2c6f0dea72b2bb7c,trnsl.1.1.20181102T205740Z.53924bf8bf038b66.1497238b25def89dc7ef38dc919556eb18419aee,trnsl.1.1.20181102T205833Z.6fa2c1193d34ae03.095847fc36981d0abbc9f2d08ff4f2209ce4cbc9,trnsl.1.1.20181102T205859Z.f48f25f673c18de8.2662ca40ff4d9276e19d1a751353976374eb5027,trnsl.1.1.20181102T205922Z.8fcd584cb97e7b7b.96635d8adeb31ac33d8af5f1b84b94bca7785a1b,trnsl.1.1.20181102T205943Z.c107053b80b3da23.33f28db3a836c230ab1fb2ec519c94e6b07f9375,trnsl.1.1.20181102T210007Z.3aba0562159ceb75.5ff0ac290dbd2d01a62023b130581f594c65bd62,trnsl.1.1.20181102T210030Z.48694ecb9d7aef4e.39aa18ca356b09014ce79c7b8cda4f56e7646f58,trnsl.1.1.20181102T210101Z.8ca38ca32d1eeae2.9cf56256c908fd101a9e0bceccaf2ffd729099c4,trnsl.1.1.20181102T210122Z.14226828ff16677d.e64bf54ba3da5fa26a43d522a979e11760cb878a,trnsl.1.1.20181102T210145Z.3ff15c7295b2dec4.252e06955b1265504be710c4871b1b829166f7e9,trnsl.1.1.20181102T210207Z.9c8d671f4e895030.90514dfd6b7cc782e3ff2bcbd046835a661106d1,trnsl.1.1.20181102T210233Z.acd76b1b0033dd87.f0d1034c8b9a9ebd5abd89a0beee582b34a3ee7a,trnsl.1.1.20181102T210309Z.084714f2e6d4c8d6.2113ff52f70e8edb8d15e5dc6b5edc04882d4847,trnsl.1.1.20181102T214252Z.c7d523a692f21cf9.f061c197cf868b9bb22fa1000ed73a131a87a241,trnsl.1.1.20181102T214324Z.68589c5b7b1beaca.4887133744773fe4890cd25061e8619d5817e545,trnsl.1.1.20181102T214351Z.a5f4ec70259dfcdd.e657e0c9a59f33274144633d7cf42475077afb67,trnsl.1.1.20181102T214416Z.cc1f850655586c0f.b6d2866d529d2e001a0318180bc7e9e715f0a5b5,trnsl.1.1.20181102T214444Z.24553e66aa23b466.be6804cb85f09c6f64c5c5f3a17720cf47dc9e86,trnsl.1.1.20181102T214947Z.dfd66bd7b21dd3af.275de56c2ea7a5109ddd1fbc43406a9f485cca65,trnsl.1.1.20181102T215052Z.ec57c48f3cb24691.54a8091b9c8f364af1a9277a7aeb642356476d87,trnsl.1.1.20181102T215122Z.af8710eead58551a.97f86308053dccb2d148577e2c023c0a13489b54,trnsl.1.1.20181102T215154Z.ae797e662ffc0055.af3030fcbd863a5cc71b24afd8a3122b5a6bc2b2,trnsl.1.1.20181102T215230Z.23c8ec80d3d564ee.0285f07c82e3d91e03c274b72d889701a7de7485,trnsl.1.1.20181102T215258Z.3d6142281267b1ee.ef871a7bae00682a9225f34f40c2084aa0cd1f51,trnsl.1.1.20181102T215327Z.b0324d3620775026.f61c65f8c6c31b2f45973397e86eeb4af8ef7bc9,trnsl.1.1.20181102T215356Z.e72ddaaa2e5d3029.fc6d21d8bf367760164caf2073be332b87e558c5,trnsl.1.1.20181102T215421Z.e7bb329825ab40c2.6b4368f077ab1f36aca314f1f5d3855de9b7ffb4,trnsl.1.1.20181102T215447Z.3d4324e2958136ff.8d6085bf3873f653c02d07433ad2f336de64c23f,trnsl.1.1.20181102T215517Z.c17384773f356575.be5756d5d3ede5b0823a865aa8b2a401d5b1cf8d,trnsl.1.1.20181102T215548Z.89db0ce5c7b3bef8.c8407a45bc8655af5ab12da309f504475756371b,trnsl.1.1.20181102T215618Z.c22f22948a0fdbd1.876a5521c7737b41b6a43ca9af0b66e3f8166ab6,trnsl.1.1.20181102T215641Z.fe52de1dc3618d73.740023052cbd6a0bc98bd5bf5ff05a55770350be,trnsl.1.1.20181102T215711Z.9c77c09515106e89.72841b56546a7f19ed8f77b27b91a6dee93a59b1,trnsl.1.1.20181102T215736Z.162caa5087e102a8.6f8bbfcf5ef76652dc6c1b3249c35fc7cd944d19,trnsl.1.1.20181102T215811Z.6e967911b314d9f2.040c8dc577ac16ddea33e33225a2b334b8fd0be3,trnsl.1.1.20181102T215859Z.467b4f132813ab8a.5c04bd040c0ddbccdb9fd1be799384e6826a5635,trnsl.1.1.20181102T220047Z.ad0e4a72ac465775.9f9a21610f30534627db70c35c2c1e453cbc7c36,trnsl.1.1.20181102T220117Z.09ce6c0292c9761c.8cc1dfc8f30b6c3bf30c8e356088ef2685f37d86".split(',');

    const BING_TRANSLATION_URL = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

    window.googleApi = {
        get MAX_TEXT_LEN() {
            return 20000;
        },

        get MAX_IPA_LEN() {
            return 500;
        },

        get IPA_LANGS() {
            return IPA_LANGS;
        },

        getBingToken: function (callback) {
            var headers = {};
            headers[BING_ocpApimSubscriptionKeyHeader] = BING_KEY_ONE;

            $.ajax({
                url: BING_AUTH_URL,
                type: 'POST',
                headers: headers,
                success: function (token) {
                    callback(token);
                },
                error: function (e) {
                    callback(null);
                }
            });
        },

        googleLangsToBingLangs: function (lang) {
            lang = lang.replace("auto", "");
            lang = lang.replace("bs", "bs-Latn");
            lang = lang.replace("sr", "sr-Cyrl");
            lang = lang.replace("zh-TW", "zh-CHT");
            lang = lang.replace("zh-CN", "zh-CHS");

            return lang;
        },

        getBingTranslation: function (from, to, text, fn) {
            googleApi.getBingToken(function (token) {
                if (!token) {
                    googleApi.getYandexTranslation(from, to, text, fn);
                    return;
                }

                from = googleApi.googleLangsToBingLangs(from);
                to = googleApi.googleLangsToBingLangs(to);

                var bing_from = from === ''
                    ? ''
                    : '&from=' + from;

                $.ajax({
                    url: BING_TRANSLATION_URL + '&to=' + to + bing_from,
                    type: 'POST',
                    //dataType: 'json',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    data: JSON.stringify([{
                        'Text': text
                    }]),
                    success: function (d) {
                        if (d) {
                            var translation = d[0].translations[0].text;

                            fn({
                                dict: [],
                                sentences: [{
                                    orig: text,
                                    trans: translation
                                }],
                                ld_result: {
                                    srclangs: [d[0].detectedLanguage ? d[0].detectedLanguage.language : '']
                                }
                            });
                        } else {
                            googleApi.getYandexTranslation(from, to, text, fn);
                        }
                    },
                    error: function (e) {
                        googleApi.getYandexTranslation(from, to, text, fn);
                    }
                });
            });
        },

        getYandexTranslation: function (from, to, text, fn) {
            from = YANDEX_LANGS[from] || from;
            to = YANDEX_LANGS[to] || to;

            let key = YT_KEYS[Math.floor(Math.random() * YT_KEYS.length)];

            $.ajax({
                url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                data: {
                    key: key,
                    format: 'plain',
                    options: 1,
                    lang: from + '-' + to,
                    text: text
                },
                success: function (d) {
                    if (d.text) {
                        var translation = d.text[0];

                        fn({
                            dict: [],
                            sentences: [{
                                orig: text,
                                trans: translation
                            }],
                            ld_result: {
                                srclangs: [d.detected.lang]
                            }
                        });
                    } else {
                        fn({
                            error: true
                        });
                    }
                },
                error: function (e) {
                    fn({
                        error: true
                    });
                }
            });
        },

        getGoogleOldTranslation: function (from, to, text, fn) {
            $.ajax({
                url: 'http://clients5.google.com/translate_a/t',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                data: {
                    client: 'dict-chrome-ex',
                    q: text,
                    sl: from,
                    tl: to,
                    tbb: 1,
                    ie: 'UTF-8',
                    oe: 'UTF-8',
                    hl: 'en'
                },
                success: function (d) {
                    fn(d);
                },
                error: function (e) {
                    console.log('Error while translating with Google:', e);
                    console.log('Trying with Bing...');

                    googleApi.getBingTranslation(from, to, text, fn);
                }
            });
        },

        getTextTranslation: function (from, to, text, fn) {
            var chunks = chunkateString(text, MAX_STR_LEN);
            var translations = new Array(chunks.length);

            var translateChunk = function (i) {
                if (i >= chunks.length) {
                    var response = translations[0];
                    var has_translit = typeof response.sentences[response.sentences.length - 1].translit != "undefined";

                    for (var i = 1, len = translations.length, k = has_translit ? 1 : 0; i < len; ++i) {
                        for (var j = 0; j < translations[i].sentences.length - k; ++j) {
                            response.sentences[response.sentences.length - 1 - k].orig +=
                                " " + translations[i].sentences[j].orig;

                            var whitespace = "";
                            if (j === 0 || (j > 0 && translations[i].sentences[j - 1].trans[translations[i].sentences[j - 1].trans.length - 1] !== " ")) {
                                whitespace = " ";
                            }

                            response.sentences[response.sentences.length - 1 - k].trans +=
                                whitespace + translations[i].sentences[j].trans;
                        }

                        if (has_translit) {
                            response.sentences[response.sentences.length - 1].translit +=
                                " " + translations[i].sentences[translations[i].sentences.length - 1].translit;
                        }
                    }

                    fn(response);

                    return;
                }

                googleApi.getTranslation(from, to, chunks[i], function (response) {
                    if (response.error) {
                        fn(response);
                    } else {
                        translations[i] = response;
                        translateChunk(i + 1);
                    }
                });
            };

            translateChunk(0);
        },

        getTranslation: function (from, to, text, fn) {
            from = from || 'auto';

            //
            // Use Baidu for Chinese users in first hand
            if (USER_COUNTRY === 'cn') {
                googleApi.getYandexTranslation(from, to, text, fn);
            } else {
                //
                // Google - Google - Microsoft - Baidu otherwise
                $.ajax({
                    url: 'https://translate.googleapis.com/translate_a/single?dt=t&dt=bd&dt=qc&dt=rm&dt=ex',
                    type: 'GET',
                    dataType: 'json',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    },
                    data: {
                        client: 'gtx',
                        hl: 'en',
                        sl: from,
                        tl: to,
                        q: text,
                        dj: 1,
                        tk: tk(text)
                    },
                    success: function (d) {
                        fn(d);
                    },
                    error: function (e) {
                        console.log('Error while translating with Google:', e);
                        console.log('Trying with older GApi...');

                        googleApi.getGoogleOldTranslation(from, to, text, fn);
                    }
                });
            }
        },

        getWordsInfo: function (words, fn) {
            var timeout = null;

            var xhr = $.ajax({
                url: 'https://api' + MATE_SERVER + '.matetranslate.com/v3/get_words_info',
                type: 'POST',
                dataType: 'json',
                crossDomain: true,
                data: JSON.stringify({
                    words: words
                }),
                success: function (d) {
                    if (timeout !== null) clearTimeout(timeout);
                    console.timeEnd('get_words_info');
                    fn(d);
                },
                error: function (e) {
                    if (timeout !== null) clearTimeout(timeout);
                    console.timeEnd('get_words_info');
                    console.log(e);
                    fn({words_info: null});
                }
            });

            timeout = setTimeout(function () {
                xhr.abort();
            }, 1000);
        },

        // remove doubling commas
        // ,, => ,0,
        // [, => [0,
        // ,] => ,0]
        parseResponse: function (r) {
            return r
                .replace(/(\,\,)/g, ',"",')
                .replace(/\[\,/g, '["",')
                .replace(/\,\]/g, ',""]');
        },

        getAudioFileLink: function (lang, text) {
            return 'https://translate.google.{{domain}}/translate_tts?ie=UTF-8&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}&tk={{tk}}&client=webapp&prev=input'
                .replace('{{domain}}', 'com')
                .replace('{{text}}', encodeURIComponent(text))
                .replace('{{lang}}', lang)
                .replace('{{textparts}}', text.split(' ').length)
                .replace('{{textlen}}', text.length)
                .replace('{{tk}}', tk(text))
                .replace('{{dictation_speed}}', DICT_SPEED);
        },

        getBingAudioFileLink: function (lang, text) {
            if (lang === 'iw') {
                lang = 'he';
            }

            return "https://www.bing.com/tspeak?&format=audio%2Fmp3&language={{lang}}&IG=D5DFBE5EEA97455182D4DEA272551DCD&IID=translator.5036.43&text={{text}}"
                .replace('{{text}}', encodeURIComponent(text))
                .replace('{{lang}}', lang);
        },

        getPartOfSpeechByIndex: function (index) {
            return parts_of_speech[index];
        },

        getInternalJSONFormat: function (output, original, to, callback) {
            var res = typeof (output) == 'object' ? output : JSON.parse(this.parseResponse(output));

            if (typeof res[0] == 'boolean') {
                return res;
            }

            var translations = [
                false,  // 0 - is multi
                '',     // 1 - original
                '',     // 2 - translated ipa
                '',     // 3 - translation
                '',     // 4 - translation translit
                '',     // 5 - from lang
                '',     // 6 - to lang
                [
                    [], // no category
                    [], // nouns
                    [], // verbs
                    [], // adjectives
                    [], // adverbs
                    [], // pronouns
                    [], // prepositions
                    [], // conjunctions
                    [], // interjections
                    [], // abbreviations
                    [], // Phrases
                    [], // Suffixes
                    []  // Auxiliary Verbs
                ],
                '',     // 8 - original gender
                '',     // 9 - translated gender
                '',     // 10 - original ipa
                '',     // 11 - original translit
            ];

            translations[6] = to;

            if ($.isArray(res) && res[0].Alignment != undefined) {
                translations[0] = false;
                translations[1] = original;
                translations[2] = "";
                translations[3] = res[0].TranslatedText;
                translations[4] = "";
                translations[5] = res[0].From;
            } else if (res.dict || $.isArray(res[1])) {
                if (res.dict) {
                    translations[0] = true;
                    translations[1] = res.sentences[0].orig;
                    translations[11] = (res.sentences[1] || {}).src_translit || '';
                    translations[3] = res.sentences[0].trans;
                    translations[4] = (res.sentences[1] || {}).translit || '';
                    translations[5] = res.ld_result.srclangs[0];

                    $.each(res.dict, function (k, v) {
                        $.each(v.entry, function (k2, v2) {
                            var item = [
                                v2.word,
                                v2.reverse_translation
                            ];

                            if (typeof v2.previous_word == 'string') {
                                item.push(v2.previous_word);
                            } else {
                                item.push('');
                            }

                            translations[7][positions[v.pos.toLowerCase().replace(' ', '')] || 0].push(item);
                        });
                    });
                } else {
                    translations[0] = true;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][1];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[2];

                    $.each(res[1], function (k, v) {
                        $.each(v[2], function (k2, v2) {
                            var item = [
                                v2[0],
                                v2[1]
                            ];

                            if (typeof v2[3] == "string") {
                                item.push(v2[3]);
                            } else {
                                item.push('');
                            }

                            translations[7][positions[v[0]] || 0].push(item);
                        });
                    });
                }
            } else {
                if (typeof res.sentences == 'object') {
                    for (var i = 0, len = res.sentences.length; i < len; ++i) {
                        if (res.sentences[i].orig) {
                            translations[1] += res.sentences[i].orig;
                        }
                        if (res.sentences[i].trans) {
                            translations[3] += res.sentences[i].trans;
                        }
                    }

                    translations[2] = (res.sentences[res.sentences.length - 1] || {}).src_translit || '';
                    translations[4] = (res.sentences[res.sentences.length - 1] || {}).translit || '';

                    translations[0] = false;
                    translations[5] = res.ld_result.srclangs[0];
                } else {
                    translations[0] = false;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][0];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[1];
                }
            }

            var info_fetcher_req = [];

            info_fetcher_req.push({
                word: translations[1],
                language: translations[5]
            });

            info_fetcher_req.push({
                word: translations[3],
                language: translations[6]
            });

            if (translations[7][1].length > 0) {
                translations[7][1].forEach((item) => {
                    info_fetcher_req.push({
                        word: item[0],
                        language: translations[6]
                    });
                });
            }

            googleApi.getWordsInfo(info_fetcher_req, function (r) {
                if ($.isArray(r.words_info)) {
                    r.words_info.forEach((item) => {
                        if (item.word === translations[1]) {
                            // save stuff for the original

                            translations[10] = item.ipa || '';
                            translations[8] = (item.info && item.info.gender) || '';
                        } else if (item.word === translations[3]) {
                            // save stuff for the translation

                            translations[2] = item.ipa || '';
                            translations[9] = (item.info && item.info.gender) || '';
                        } else {
                            // save stuff for synonyms

                            if (translations[7][1].length > 0) {
                                for (var j = 0; j < translations[7][1].length; ++j) {
                                    if (translations[7][1][j][0] === item.word) {
                                        if (!translations[7][1][j][2] && item.info && item.info.gender) {
                                            translations[7][1][j][2] = item.info.gender;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                callback(translations);
            });
        },

        // According to current settings (a single word/phrase or a bunch of variants)
        parseReceivedTranslation: function (json, mainAndVariantsSeparately, prefix, locales, complexSingle) {
            if (json[0]) {
                var response = [json[0], wrapper.wrap(true, json, mainAndVariantsSeparately, prefix, locales)];
                if (mainAndVariantsSeparately) {
                    var tmp = response;
                    response = [tmp[0], json[3], tmp[1]];
                    delete tmp;
                }

                return response;
            } else {
                return [false, wrapper.wrap(false, json, mainAndVariantsSeparately, prefix, locales, complexSingle)];
            }
        }
    };

})();

function chunkateString(text, max_len) {
    var words = text.split(" ");
    var chunks = [""];

    for (var i = 0, len = words.length, j = 0; i < len; ++i) {
        var nw = chunks[j] + " " + words[i];

        if (nw.length < max_len) {
            chunks[j] = nw.trim();
        } else {
            ++j;
            chunks[j] = words[i];
        }
    }

    return chunks;
}

function hasFocusedInputs() {
    var has_focus_elements = false;

    $(document.body).find("*:focus").each(function () {
        if ($(this).is("input,textarea") || this.contentEditable == true) {
            has_focus_elements = true;
        }
    });

    return has_focus_elements;
}

function _getSelection() {
    var selection = null;

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.getSelection) {
        selection = document.getSelection();
    }

    return selection;
}

function getSelectedText() {
    var selection = _getSelection();

    return selection ?
        selection.toString().trim() :
        '';
}

// @returns null
function hideSelectionButton() {
    $('.' + TOOLTIP_PREFIX + 'translate-selection-button').fadeOut(150, function () {
        $(this).remove();
    });
}

// @returns null
function handleTranslation(type) {
    console.log("Handle a translation.");

    //
    // Carry on with translation:
    //

    if (is_translating) {
        return;
    }

    var id;
    var selection = _getSelection();
    var selected_text = selection.toString();

    if (selected_text) {
        last_call_args.selectionBB = selection.getRangeAt(0).getBoundingClientRect();
        last_call_args.text = selected_text;
        //last_call_args.from = from;
        //last_call_args.to = to;

        id = showTooltip(selection);

        toggleLoadingInTooltip(id, true);
    } else if (last_call_args.selectionBB && last_call_args.text) {
        //last_call_args.from = from;
        //last_call_args.to = to;

        id = showTooltip(last_call_args.selectionBB);
        toggleLoadingInTooltip(id, true);

        selected_text = last_call_args.text;
    } else {
        return;
    }

    is_translating = true;

    translate(selected_text.substr(0, MAX_TEXT_LEN), id, type);
}

// @returns null
function displayTranslation(data) {
    is_translating = false;

    if (data.offline) {
        toggleOfflineInTooltip(data.id, true);
        return;
    }

    //data.translation = JSON.parse(data.translation);

    toggleLoadingInTooltip(data.id, false);
    setTooltipContents(data.id, wrapper.wrap(data.translation));

    $('.' + TOOLTIP_PREFIX + 'tooltip-' + data.id)
        .find('.' + TOOLTIP_PREFIX + 'listen-original')
        .attr('data-from', data.from);

    $('.' + TOOLTIP_PREFIX + 'tooltip-' + data.id)
        .find('.' + TOOLTIP_PREFIX + 'listen-translation')
        .attr('data-to', data.to);

    var $tt = $('.' + TOOLTIP_PREFIX + 'tooltip-' + data.id);

    if ($tt.find('.' + TOOLTIP_PREFIX + 'top-arr0w').is(':visible')) {
        $tt.find('#' + TOOLTIP_PREFIX + 'tr-scrollbar').addClass(TOOLTIP_PREFIX + 'top-scroll');
    }

    //$tt.find('.' + TOOLTIP_PREFIX + 'from-flag').attr('src', safari.extension.baseURI + data.from + '@2x.png');
    //$tt.find('.' + TOOLTIP_PREFIX + 'to-flag').attr('src', safari.extension.baseURI + data.to + '@2x.png');

    if (!data.translation[0] && data.translation[3].length < 35) {
        $tt.find('.' + TOOLTIP_PREFIX + 'padded-single-translation').addClass(TOOLTIP_PREFIX + 'short-padded-single-translation');
    }

    if (SYMBOL_LANGS.indexOf(data.to) > -1) {
        $tt.find('.' + TOOLTIP_PREFIX + 'content-layout').addClass(TOOLTIP_PREFIX + 'non-bold-contents');
    } else {
        $tt.find('.' + TOOLTIP_PREFIX + 'content-layout').removeClass(TOOLTIP_PREFIX + 'non-bold-contents');
    }

    ctrlTooltipOrigVisibility(false, data.from, $tt);
    ctrlTooltipTransVisibility(false, data.to, $tt);
    ctrlSynonymVis(false, data.to, $tt);

    $tt.find('.' + TOOLTIP_PREFIX + 'listen-butt0n').on('click', playTooltip);
    $tt.find('.' + TOOLTIP_PREFIX + 'listen-v-item').on('click', playTooltipSynonym);
    $tt.find('.' + TOOLTIP_PREFIX + 'small-copy-button').on('click', copySynonym);
    $tt.find('.' + TOOLTIP_PREFIX + 'copy-translation-butt0n')
        .on('click', copyMainTranslation)
        .attr('data-tid', data.id);

    makeDraggable(data.id);

    fadeInTooltip(data.id, function () {
        ++opened_tooltips;

        // if it's a long-ass text, scroll the tooltip contents down to translation
        $tt.find('.TnITTtw-trVisibleLayout').scrollTop($tt.find('.TnITTtw-original-wrap').height());
    });

    setTimeout(hideSelectionButton, 250);
}

function fadeInTooltip(ttid, callback) {
    $('.' + TOOLTIP_PREFIX + 'tooltip-' + ttid).fadeIn(400, callback);
}

function copyMainTranslation(event) {
    var $this = $(this);

    if ($this.hasClass(TOOLTIP_PREFIX + 'copied')) {
        return;
    }

    $this.addClass(TOOLTIP_PREFIX + 'copied');
    setTimeout(function () {
        $this.removeClass(TOOLTIP_PREFIX + 'copied');
    }, 2500);

    var text = getListenValue('trans', $('.' + TOOLTIP_PREFIX + 'tooltip-' + $(event.target).data('tid')));

    copyToClipboard(text);

    sendAmplitudeEvent('actext_copy_maintrans');
}

function playTooltipSynonym(event) {
    var val = $(this).parent().find('.' + TOOLTIP_PREFIX + 'main-of-item').html();

    playUniversal(
        $(this),
        'lang:' + $(this).data('langto'),
        val,
        ['ctrlSynonymVis', 'ctrlTooltipOrigVisibility',
            'ctrlTooltipTransVisibility'
        ],
        null,
        event
    );
}

function playTooltip(e) {
    e.stopPropagation();

    if ($(this).hasClass(TOOLTIP_PREFIX + 'listen-original')) {
        playTooltipOriginal.call(this, e, $(this).data('from'));
    } else {
        playTooltipTranslation.call(this, e, $(this).data('to'));
    }
}

function playTooltipOriginal(event, lang) {
    playUniversal(
        $(this),
        'lang:' + lang,
        getListenValue('orig', event),
        ['ctrlTooltipTransVisibility', 'ctrlSynonymVis'],
        null,
        event
    );

    sendAmplitudeEvent('actext_tts_original');
}

function playTooltipTranslation(event, lang) {
    playUniversal(
        $(this),
        'lang:' + lang,
        getListenValue('trans', event),
        ['ctrlTooltipOrigVisibility', 'ctrlSynonymVis'],
        null,
        event
    );

    sendAmplitudeEvent('actext_tts_translation');
}

var listen_target_id = 0;
var listen_targets = {};

function playUniversal($button, dir, input, vis_fns, dl, ctx) {
    if (!input || $button.is('[class$="listen-disabled"]')) {
        return;
    }

    var lang = dl || (dir.substr(0, 5) === 'lang:' ? dir.substr(5) : 'en');

    if ($button.hasClass('stop-audio')) {
        stopPlayback(lang, vis_fns, +$button.data('tid'));
    } else {
        $button.addClass('stop-audio');

        vis_fns.forEach(function (vis_fn) {
            window[vis_fn](true, lang, ctx);
        });

        var target_id = ++listen_target_id;
        $button.attr('data-tid', target_id);
        listen_targets[target_id] = ctx;

        playback(vis_fns, input.trim(), lang, target_id);
    }
}

function playback(vis_fns, text, lang, target_id) {
    var callback = function () {
        onAudioPlaybackFinished({
            lang: lang,
            target_id: target_id,
            vis_fns: vis_fns
        });
    };

    if (isUtterable(lang)) {
        audio.playText(text, lang, callback);
    } else {
        callback();
    }
}

function stopPlayback() {
    audio.stop();
}

function onAudioPlaybackFinished(data) {
    if (!data) {
        return;
    }

    $(listen_targets[data.target_id].target).removeClass('stop-audio');

    data.vis_fns.forEach(function (vis_fn) {
        window[vis_fn](
            false,
            data.lang,
            listen_targets[data.target_id]
        );
    });

    delete listen_targets[data.target_id];
}

var audio = {
    isPlaying: false,

    playText: function (text, lang, on_audio_stop_callback) {
        if (!(lang in TTS_LANGS)) {
            return;
        }

        if (audio.isPlaying) {
            audio.stop();
        }

        console.log('playing text:', DICT_SPEED, text, TTS_LANGS[lang]);

        var player = new SpeechSynthesisUtterance();
        player.rate = 1;
        player.pitch = +DICT_SPEED;
        player.text = text;
        player.voice = TTS_LANGS[lang];

        // event after text has been spoken
        player.onend = () => {
            on_audio_stop_callback();
        };

        // speak
        window.speechSynthesis.speak(player);
    },

    stop: function () {
        audio.isPlaying = false;
        window.speechSynthesis.cancel();
    }
};

function makeDraggable(id) {
    var $tooltip = $('.' + TOOLTIP_PREFIX + 'tooltip-' + id);

    //
    //
    // Dragging

    var startPosXInTt = 0,
        startPosYInTt = 0;

    var tt_move = function (event) {
        $tooltip.css({
            left: event.clientX - startPosXInTt,
            top: event.clientY - startPosYInTt
        });
    };

    //$tooltip.on('touchstart', function (event) {
    //if (event.which === 1) {
    //startPosXInTt = event.clientX - parseInt($tooltip.css('left'));
    //startPosYInTt = event.clientY - parseInt($tooltip.css('top'));

    $(window).on('touchmove', tt_move);
    //}
    //});
    //$(window).on('touchend', function () {
    //$(window).off('touchmove', tt_move);
    //});

    //
    //
    // Closing

    $('.' + TOOLTIP_PREFIX + 'close-unpinned').on('click', function (event) {
        var $to_close_tooltip = $(getTooltipWrapRecursively(event.target));
        $to_close_tooltip.fadeOut(125, function () {
            $(this).remove();
        });
    });
}

function copySynonym() {
    var prefix = TOOLTIP_PREFIX;

    var $this = $(this);
    var _class = prefix + 'copied';

    if ($this.hasClass(_class)) {
        return;
    }

    var $el = $(this).parent().find('.' + prefix + 'main-of-item');

    $this.addClass(_class);
    setTimeout(function () {
        $this.removeClass(_class);
    }, 2500);

    copyToClipboard($el.html());
}

function copyToClipboard(text) {
    var $cc = $('<textarea>')
        .css({
            position: 'absolute',
            top: -1000,
            left: -1000
        })
        .appendTo('body');
    $cc.val(text).focus().select();
    document.execCommand('Copy');
    $cc.remove();
}

function getTooltipWrapRecursively(target) {
    return $(target).attr('id') == TOOLTIP_PREFIX + 'tooltip-wrap' ?
        target :
        getTooltipWrapRecursively($(target).parent().get(0));
}

function isUtterable(lang) {
    return lang in TTS_LANGS;
}

function ctrlTooltipOrigVisibility(playing, lang, e) {
    ctrlTooltipPlaybackButtonVisibility(playing, lang, e, 'original', 'from', 'orig');
}

function ctrlTooltipTransVisibility(playing, lang, e) {
    ctrlTooltipPlaybackButtonVisibility(playing, lang, e, 'translation', 'to', 'trans');
}

function ctrlTooltipPlaybackButtonVisibility(playing, lang, e, t_btn, t_dir, t_val) {
    var $context;

    if (e.target) {
        $context = $(getTooltipWrapRecursively(e.target));
    } else if (e.innerHTML) {
        $context = $(e);
    } else {
        $context = e;
    }

    var to_lang = $context.find('.' + TOOLTIP_PREFIX + 'listen-' + t_btn).data(t_dir);

    if (!isUtterable(to_lang)) {
        $context.addClass(TOOLTIP_PREFIX + 'no-' + t_val + '-tts');
    } else {
        $context.removeClass(TOOLTIP_PREFIX + 'no-' + t_val + '-tts');
    }

    var allowed = !playing && getListenValue(t_val, e);

    $context.find('.' + TOOLTIP_PREFIX + 'listen-' + t_btn)[(allowed ? 'remove' : 'add') + 'Class'](TOOLTIP_PREFIX + 'listen-disabled');
}

function ctrlSynonymVis(playing, lang, event) {
    if (!event) {
        event = $("body");
    }

    var $context = event.target ? $(event.target)
        .parent()
        .parent()
        .parent()
        .parent() : event;

    var allowed = !playing;
    var prefix = TOOLTIP_PREFIX;

    if (!isUtterable(lang)) {
        $context.addClass(prefix + 'no-tts');
    } else {
        $context.removeClass(prefix + 'no-tts');
    }

    $('.' + prefix + 'listen-v-item').each(function () {
        var $this = $(this);
        if (!$this.hasClass('stop-audio')) {
            $this[(allowed ? 'remove' : 'add') + 'Class'](prefix + 'listen-disabled');
        }
    });
}

function getListenValue(s, event) {
    var $where = !event.target ? event : $(getTooltipWrapRecursively(event.target));

    if (s === 'orig') {
        var i = $where.find('.' + TOOLTIP_PREFIX + 'original-wrap .' + TOOLTIP_PREFIX + 'mv-text-part').html();
        if (!i) {
            return $where.find('.' + TOOLTIP_PREFIX + 'original-wrap .' + TOOLTIP_PREFIX + 'tpart').html();
        } else {
            return i;
        }
    } else if (s === 'trans') {
        var i = $where.find('.' + TOOLTIP_PREFIX + 'main-variant .' + TOOLTIP_PREFIX + 'mv-text-part').html();
        if (!i) {
            return $where.find('.' + TOOLTIP_PREFIX + 'trans-wrap .' + TOOLTIP_PREFIX + 'tpart').html();
        } else {
            return i;
        }
    }

    return '';
}

function getSelectionParameters(s) {
    return s.getRangeAt ? $.extend({
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset
    }, s.getRangeAt(0).getBoundingClientRect()) : {
        left: s.x || s.left,
        top: s.y || s.top,
        width: s.width,
        height: s.height
    };
}

function parseHtml(h) {
    return h.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
}

function compileString(str, data) {
    data = data || {};
    str = parseHtml(str);

    for (var key in data) {
        str = str
            .replace(new RegExp("<%=" + key + "%>", 'g'), data[key])
            .replace(new RegExp("<%= " + key + " %>", 'g'), data[key]);
    }

    return str;
}

const TOOLTIP_CONTENTS_HTML = '\
<div class="<%=prefix%>t <%=prefix%>help-selected-wrap <%=prefix%>hsw-<%=ttid%>">\
<div class="<%=prefix%>t <%=prefix%>help-inside-layout <%=prefix%>hil-<%=ttid%>">\
<div class="<%=prefix%>unpinned-utils">\
<div class="<%=prefix%>pro-img"></div>\
<div class="<%=prefix%>close-unpinned"></div>\
</div>\
<div class="<%=prefix%>trVisibleLayout" id="<%=prefix%>trVisibleLayout-<%=ttid%>">\
<div class="<%=prefix%>trEntireLayout" id="<%=prefix%>trEntireLayout-<%=ttid%>">\
<div class="<%=prefix%>t <%=prefix%>content-layout <%=prefix%>content-layout-<%=ttid%>">\
<%=content%></div>\
</div>\
</div>\
\
</div>\
\
<div class="<%=prefix%>netflix-buttons <%=prefix%>nf-<%=ttid%>">\
<div class="<%=prefix%>netflix-button <%=prefix%>netflix-save t-<%=ttid%>"><%=netflix_save%></div>\
<div class="<%=prefix%>netflix-button <%=prefix%>netflix-continue"><%=netflix_continue%></div>\
</div>\
\
<div class="<%=prefix%>offline"><span><%=l_offline%></span></div>\
</div>\
';

const TOOLTIP_HTML = '\
<div class="<%=prefix%>tooltip-main-wrap <%=prefix%>tooltip-<%=ttid%> <%=prefix%>t" id="<%=prefix%>tooltip-wrap" data-ttid="<%=ttid%>">\
<div class="<%=prefix%>t <%=prefix%>inside-layout">\
<div class="<%=prefix%>t <%=prefix%>content">' + TOOLTIP_CONTENTS_HTML + '</div>\
</div>\
</div>\
';

function getOParamsInstance(g) {
    g.width = g.width || 0;
    g.height = g.height || 0;
    g.pl = g.pl || 0;
    g.pr = g.pr || 0;
    g.pt = g.pt || 0;
    g.pb = g.pb || 0;
    return g;
}

function closeTooltip(e) {
    if (opened_tooltips <= 0) return;

    if ((typeof e === 'boolean' && e) || (typeof e !== 'boolean' && !$(e.target).hasClass(TOOLTIP_PREFIX + 't'))) {
        //$('body').unbind();

        var tooltip = $('.' + TOOLTIP_PREFIX + 'tooltip-main-wrap');

        if (tooltip.length > 0) {
            tooltip.each(function () {
                if (!$(this).hasClass(TOOLTIP_PREFIX + 'unpinned')) {
                    $(this).remove();
                    --opened_tooltips;
                }
            });
        }
    }
}

$.fn.measure = function (fn) {
    var el = $(this).clone(false);
    el.css({
        visibility: 'hidden',
        position: 'absolute'
    });
    el.appendTo('body');
    var result = fn.apply(el);
    el.remove();
    return result;
};

function getBodyScrollLeft() {
    return document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}

function getBodyScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

const Y_OFFSET = 10;

function computeTooltipPosition(el, ix, iy, oparams, scale, callback) {
    var pos = [0, 0, 'bottom'];

    var tooltip_width = 0;
    var tooltip_height = 0;

    $(el.get()).measure(function () {
        tooltip_width = this.width();
        tooltip_height = this.height();

        var absolute_selection_left_scroll = ix + getBodyScrollLeft();
        var absolute_selection_top_scroll = iy + getBodyScrollTop();

        var selection_absolute_width = oparams.width + oparams.pl + oparams.pr;
        var selection_absolute_height = oparams.height + oparams.pt + oparams.pb;

        pos[0] = absolute_selection_left_scroll - tooltip_width / 2 + selection_absolute_width / 2;
        pos[1] = absolute_selection_top_scroll - tooltip_height - Y_OFFSET * scale;
        pos[2] = 'bottom'; // tooltip is above, arrow is on bottom

        // Horizontal alignment
        if (pos[0] - getBodyScrollLeft() < 1) {

            // stick to the left side

            pos[0] = getBodyScrollLeft() + 1 - tooltip_width * (1 - scale) / 2;
        } else if (pos[0] + tooltip_width > document.body.clientWidth) {

            // stick to the right side

            pos[0] = document.body.clientWidth - tooltip_width - 1 + tooltip_width * (1 - scale) / 2;
        }

        // A vertical one
        if (pos[1] - getBodyScrollTop() < 1) {
            pos[1] = absolute_selection_top_scroll + selection_absolute_height + Y_OFFSET * scale;

            // tooltip below the selection
            // if scale != 1
            pos[1] -= tooltip_height * (1 - scale) / 2;

            pos[2] = 'top'; // tooltip is below, arrow is on top
        } else {
            pos[1] += tooltip_height * (1 - scale) / 2;
        }

        callback(pos);
    });
}

// @returns id - tooltip ID
function showTooltip(selection) {
    var ttid = ++tooltip_id;
    var sel_params = getSelectionParameters(selection);

    closeTooltip(true);

    var $tooltip = $(compileString(TOOLTIP_HTML, {
        content: '',
        prefix: TOOLTIP_PREFIX,
        ttid: ttid,
        l_offline: getLocale('No Internet Connection'),
        netflix_save: getLocale('Save'),
        netflix_continue: getLocale('Continue')
    }));

    var maxZ = Math.max.apply(null,
        $.map($('body *'), function (e, n) {
            if ($(e).css('position') != 'static')
                return parseInt($(e).css('z-index')) || 1;
        }));

    $tooltip.css({
        "z-index": maxZ + 1,
        maxWidth: 450,
        maxHeight: 325
    });

    //$(window).on('click', closeTooltip);

    var left = 0;
    var top = 0;
    var params;

    left += sel_params.left; //- (window.scrollX - sel_params.scrollX);
    top += sel_params.top; //- (window.scrollY - sel_params.scrollY);
    params = getOParamsInstance(sel_params);

    $tooltip.css('transform', 'scaleX(' + scale + ') scaleY(' + scale + ')');

    computeTooltipPosition($tooltip, left, top, params, scale, function (tp) {
        var real_y = tp[1] - 5;

        $tooltip.css({
            left: tp[0],
            top: real_y
        }).animate({
            top: real_y
        }, 300);

        var $dest = $('body');
        var _dark_mode = dark_mode;

        if (document.location.href.indexOf('https://www.netflix.com/watch') > -1) {
            $dest = $('.nf-player-container');
            _dark_mode = true;
        } else if ($dest.length === 0) {
            $dest = $('html');
        }

        $tooltip.data('ttid', ttid);

        if (_dark_mode) {
            $tooltip.addClass(TOOLTIP_PREFIX + 'dark-mode');
        }

        $dest.append($tooltip.get());

        $('#' + TOOLTIP_PREFIX + 'tooltip-wrap *').addClass('TnITTtw-t');

        //
        // hide elements to avoid using !important in CSS
        //
        $('.TnITTtw-tooltip-main-wrap').hide();
        $('.TnITTtw-info-warn.TnITTtw-hide').hide();
        $('.TnITTtw-netflix-buttons').hide();
        $('.TnITTtw-utils').css('display', 'block');
        $('.TnITTtw-unpinned-utils').hide();

        $('.TnITTtw-loading, .TnITTtw-offline').hide();
    });

    return ttid;
}

// @returns null
function toggleLoadingInTooltip(ttid, is_loading) {
    //
    // remove previous loadings
    //
    $('.' + TOOLTIP_PREFIX + 'translate-loading').fadeOut(250, function () {
        $(this).remove();
    });

    if (is_loading) {
        var selection = _getSelection();
        var params = selection.toString() ?
            getSelectionParameters(selection) :
            last_call_args.selectionBB;

        var $dest = $('body');
        var is_netflix = false;

        if (document.location.href.indexOf('https://www.netflix.com/watch') > -1) {
            $dest = $('.nf-player-container');
            is_netflix = true;
        } else if ($dest.length === 0) {
            $dest = $('html');
        }

        var height = 70;
        var width = height;
        var x = params.left + params.width / 2 + window.pageXOffset - width / 2;
        var y;

        if (params.top + params.height + 10 + height > window.innerHeight || is_netflix) {
            y = params.top - 10 - height + window.pageYOffset; // loading is above
        } else {
            y = params.top + params.height + 10 + window.pageYOffset; // loading is below
        }

        $dest.append(
            $('<div class="' + TOOLTIP_PREFIX + 'translate-loading"></div>')
                .addClass(is_netflix || dark_mode ? TOOLTIP_PREFIX + 'dark-mode' : '')
                .html('<div class="' + TOOLTIP_PREFIX + 'mate-loading"></div>')
                .css({
                    top: y,
                    left: x
                })
        );
    }
}

function toggleOfflineInTooltip(ttid, is_offline) {
    if (is_offline) {
        $('.' + TOOLTIP_PREFIX + 'tooltip-' + ttid)
            .find('.' + TOOLTIP_PREFIX + 'offline')
            .css('display', 'flex !important');
    } else {
        $('.' + TOOLTIP_PREFIX + 'tooltip-' + ttid)
            .find('.' + TOOLTIP_PREFIX + 'offline')
            .fadeOut(250, function () {
                $(this).remove();
            });
    }
}

function setTooltipContents(id, code) {
    $('.' + TOOLTIP_PREFIX + 'content-layout-' + id).html(code);
    $('#' + TOOLTIP_PREFIX + 'tooltip-wrap *').addClass('TnITTtw-t');

    //$('.TnITTtw-original-wrap').hide();
}

const max_synonyms = 3;

var SINGLE_HTML = '\
<div class="<%=prefix%>original-wrap <%=prefix%>padded-single-translation">\
<div class="<%=prefix%>mv-text-part"><%=original%></div>\
<div class="<%=prefix%>mv-translit <%=prefix%>original-translit"><%=translit_original%></div>\
<div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-original" data-from="<%=from%>"></div>\
</div>\
<div class="<%=prefix%>padded-single-translation <%=prefix%>trans-wrap">\
<div class="<%=prefix%>tpart"><%=translation%></div>\
<div class="<%=prefix%>mv-translit <%=prefix%>translation-translit"><%=translit_translation%></div>\
<div class="<%=prefix%>copy-translation-butt0n" data-to="<%=to%>"></div>\
<div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-translation" data-to="<%=to%>"></div>\
</div>';

var positions = {
    '': 0,
    noun: 1,
    verb: 2,
    adjective: 3,
    adverb: 4,
    pronoun: 5,
    preposition: 6,
    conjunction: 7,
    interjection: 8,
    abbreviation: 9,
    phrase: 10,
    suffix: 11,
    auxiliaryverb: 12
};

var parts_of_speech = [];

for (var key in positions) {
    parts_of_speech.push(key);
}

function capitalize(s) {
    return !s ? '' : s[0].toUpperCase() + s.substr(1).toLowerCase();
}

var wrapper = {
    TRANSLIT_TYPE: 1,
    IPA_TYPE: 2,
    SYNONYMS_TYPE: 3,

    _singleWrap: function (translations, type, prefix, locales, lang) {
        prefix = prefix || '';

        return compileString(SINGLE_HTML, {
            prefix: prefix,
            l_open: locales.open,
            original: translations[8] + translations[1],
            translation: translations[9] + translations[3],
            to: lang,
            translit_original: translations[10] || translations[11],
            translit_translation: translations[2] || translations[4]
        });
    },

    _complexSingleWrap: function (translations, ov, prefix, locales, lang) {
        return this._singleWrap(translations, wrapper.SYNONYMS_TYPE, prefix, locales, lang);
    },

    _multiWrap: function (translations, onlyVariants, prefix, locales, lang) {
        var df_local, df_local_items;
        var df = document.createDocumentFragment();

        if (!prefix) {
            prefix = '';
        }

        for (var i = 0; i < translations[7].length; ++i) {
            if (!$.isArray(translations[7][i]) || translations[7][i].length === 0) {
                continue;
            }

            var len = translations[7][i].length;
            df_local = document.createDocumentFragment();

            $.each(translations[7][i], function (k, v) {
                df_local_items = document.createDocumentFragment();

                // Hotfix
                if (v[2] && typeof v[1] === 'string' && $.isArray(v[2])) {
                    var t = v[1];
                    v[1] = v[2];
                    v[2] = t;
                }

                $.each(v[1] || [], function (k2, v2) {
                    if (k2 >= max_synonyms) return;
                    if (v2) {
                        $(df_local_items)
                            .append($('<div>', {
                                class: prefix + 'synonym'
                            }).html(v2))
                            .append(k2 < v[1].length - 1 && k2 < max_synonyms - 1 ? ', ' : '');
                    }
                });

                var gender = v[2] ? v[2] + ' ' : '';

                $(df_local)
                    .append($('<div>', {
                        class: prefix + 'v-item'
                    })
                        .append($('<div>', {
                            class: prefix + 'small-copy-button',
                            'data-langto': lang
                        }))
                        .append($('<div>', {
                            class: prefix + 'listen-v-item',
                            'data-langto': lang
                        }))
                        .append($('<div>', {
                            class: prefix + 'v-texts'
                        })
                            .append($('<div>', {
                                class: prefix + 'main-of-item'
                            }).html(gender + v[0])))
                        .append($('<div>', {
                            class: prefix + 'synonyms'
                        }).append(df_local_items)));
            });

            var key = parts_of_speech[i];

            $(df).append(
                $('<div>')
                    .addClass(prefix + 'variant-row')
                    .append(
                        $('<div>')
                            .addClass(prefix + 'v-pos')
                            .html(key ? getLocale(key) : '')
                            .addClass(!key ? prefix + 'empty-pos' : '')
                            .get()
                    )
                    .append(
                        $('<div>')
                            .addClass(prefix + 'v-closest-wrap')
                            .append(df_local)
                            .get()
                    )
                    .get()
            );
        }

        // Do not include different wrappers and a main variant to the final HTML code
        if (onlyVariants === true) {
            return $('<div>').append(df).html();
        }

        var gender_original = translations[8] ? translations[8] + ' ' : '';
        var gender_translation = translations[9] ? translations[9] + ' ' : '';
        var translit_original = translations[10] || translations[11];
        var translit_translation = translations[2] || translations[4];

        var bunch = $('<div>').addClass(prefix + 'variant-bunch-wrap').append(
            $('<div>')
                .addClass(prefix + 'vbw-inside-layout')
                .append(
                    $('<div>')
                        .addClass(prefix + 'original-wrap')
                        .append(
                            $('<div>')
                                .addClass(prefix + 'original')
                                .html('<div class="' + prefix + 'mv-text-part">' + gender_original + translations[1] + '</div><div class="' + prefix + 'add-pb-butt0n"></div><div class="' + prefix + 'mv-translit ' + prefix + 'original-translit">' + translit_original + '</div><div class="' + prefix + 'copy-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-original" data-from="<%=from%>">' +
                                    '</div>')
                                .get()
                        )
                        .get()
                )
                .append(
                    $('<div>')
                        .addClass(prefix + 'main-variant-wrap')
                        .append(
                            $('<div>')
                                .addClass(prefix + 'main-variant')
                                .html('<div class="' + prefix + 'mv-text-part">' + gender_translation + translations[3] + '</div><div class="' + prefix + 'mv-translit ' + prefix + 'original-translit">' + translit_translation + '</div><div class="' + prefix + 'copy-translation-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-translation" data-to="' + lang + '">' +
                                    '</div>')
                                .get()
                        )
                        .get()
                )
                .append(
                    $('<div>')
                        .addClass(prefix + 'variants-by-pos')
                        .append(df)
                        .get()
                )
                .get()
        );

        return $('<div>').append(bunch.get()).html();
    },

    wrap: function (json) {
        return wrapper['_' + (json[0] ? 'multi' : 'complexSingle') + 'Wrap'](json, false, TOOLTIP_PREFIX, {}, json[6]);
    }
};