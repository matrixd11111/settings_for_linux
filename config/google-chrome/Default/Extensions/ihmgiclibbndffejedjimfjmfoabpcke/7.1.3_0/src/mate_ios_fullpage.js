function fpTranslate() {

    //var BFI_APPID = 'nil';
    var BFI_DONEMSG = 'nil';
    var BFI_TOLANG = 'nil';
    var BFI_SAMELANGMSG = 'nil';
    var BFI_LOADINGLANGMSG = 'nil';
    var BFI_CANCEL = 'nil';

    /* Copyright 2010 Microsoft Corporation */
    window['_mstConfig'] = {
        //appId: 'ThItpYrZC8u7LA_4XaMM9h1vkkDbKII4khHm2jXmvMYo\x2a',
        appId:'NTBD',
        rootURL: 'https\x3a\x2f\x2fwww.microsofttranslator.com\x2f',
        baseURL: 'https\x3a\x2f\x2fwww.microsofttranslator.com\x2fajax\x2fv3\x2fwidgetV3.ashx\x3fsettings\x3dmanual',
        serviceURL: 'https\x3a\x2f\x2fapi.microsofttranslator.com\x2fv2\x2fajax.svc',
        imagePath: 'https\x3a\x2f\x2fwww.microsofttranslator.com\x2fstatic\x2f197997\x2fimg\x2f',
        debug: false,
        locale: 'en',
        country: '',
        category: '',
        ref: 'WidgetV3',
        service: 'WG3',
        maxChars: 1000000000,
        noAuto: ["facebook.", "youtube."],
        escapeNonAscii: false,
        requestGroup: '',
        preTrans: false
    };
    window._mstConfig['SignIn'] = '<a href="https://login.live.com/login.srf?wa=wsignin1.0&amp;rpsnv=12&amp;ct=1401208142&amp;rver=6.0.5276.0&amp;wp=LBI&amp;wreply=http:%2F%2Fwww.microsofttranslator.com%2Fajax%2Fv2%2Fauth.aspx%3Fpru%3Dhttp%253a%252f%252fwww.microsofttranslator.com%252fajax%252fv3%252fwidgetV3.ashx&amp;lc=1033&amp;id=268160">Sign in</a>';

    if (!this.Microsoft) this.Microsoft = {};
    if (!this.Microsoft.Translator) this.Microsoft.Translator = {};
    if (Microsoft.Translator.Reset) Microsoft.Translator.Reset();

    Microsoft.Translator = new function () {
        var gb = "WidgetFloaterPanels",
            n = 7e3,
            T = "block",
            S = "4px 4px 4px 4px",
            J = "pointer",
            X = "2147483647",
            W = "absolute",
            O = "inline-block",
            bb = "direction",
            H = "lang",
            l = ">",
            N = "font",
            t = "img",
            M = "false",
            A = "left",
            K = "right",
            p = 100,
            z = "visible",
            s = 255,
            x = "div",
            L = "inline",
            ab = "position",
            k = 400,
            I = "select",
            q = "px",
            D = "0px",
            fb = "languageMappings",
            kb = "localizedLangs",
            r = "es",
            G = "no",
            Z = "de",
            V = "fr",
            eb = "zh-cht",
            jb = "zh-chs",
            v = "ar",
            e = "ltr",
            o = "rtl",
            F = "none",
            R = "iframe",
            d = 16,
            i = true,
            C = "number",
            Q = "function",
            E = "undefined",
            P = "head",
            c = -1,
            u = "/",
            U = "_mstConfig",
            g = "en",
            h = false,
            cb = "/static/img/",
            b = "",
            j = null,
            m = this;
        m.AddTranslation = function (i, b, a, j, m, h, c, e, k, l, d, f, g) {
            return new w("AddTranslation", {
                appId: i,
                originalText: b,
                translatedText: a,
                from: j,
                to: m,
                rating: h,
                contentType: c,
                category: e,
                user: k,
                uri: l
            }, d, f, g)
        };
        m.BreakSentences = function (e, f, b, a, c, d) {
            return new w("BreakSentences", {
                appId: e,
                text: f,
                language: b
            }, a, c, d)
        };
        m.Detect = function (d, e, a, b, c) {
            return new w("Detect", {
                appId: d,
                text: e
            }, a, b, c)
        };
        m.DetectArray = function (d, e, a, b, c) {
            return new w("DetectArray", {
                appId: d,
                texts: e
            }, a, b, c)
        };
        m.GetAppIdToken = function (g, c, a, b, d, e, f) {
            return new w("GetAppIdToken", {
                appId: g,
                minRatingRead: c,
                maxRatingWrite: a,
                expireSeconds: b
            }, d, e, f)
        };
        m.GetLanguageNames = function (f, e, a, b, c, d) {
            return new w("GetLanguageNames", {
                appId: f,
                locale: e,
                languageCodes: a
            }, b, c, d)
        };
        m.GetLanguagesForSpeak = function (d, a, b, c) {
            return new w("GetLanguagesForSpeak", {
                appId: d
            }, a, b, c)
        };
        m.GetLanguagesForTranslate = function (d, a, b, c) {
            return new w("GetLanguagesForTranslate", {
                appId: d
            }, a, b, c)
        };
        m.GetTranslations = function (f, h, g, i, a, d, b, c, e) {
            return new w("GetTranslations", {
                appId: f,
                text: h,
                from: g,
                to: i,
                maxTranslations: a,
                options: d
            }, b, c, e)
        };
        m.Translate = function (f, h, g, i, a, c, b, d, e) {
            return new w("Translate", {
                appId: f,
                text: h,
                from: g,
                to: i,
                contentType: a,
                category: c
            }, b, d, e)
        };
        m.AddTranslationArray = function (f, a, g, h, d, b, c, e) {
            return new w("AddTranslationArray", {
                appId: f,
                translations: a,
                from: g,
                to: h,
                options: d
            }, b, c, e)
        };
        m.GetTranslationsArray = function (f, g, h, i, a, d, b, c, e) {
            return new w("GetTranslationsArray", {
                appId: f,
                texts: g,
                from: h,
                to: i,
                maxTranslations: a,
                options: d
            }, b, c, e)
        };
        m.Speak = function (g, h, b, f, d, a, c, e) {
            return new w("Speak", {
                appId: g,
                text: h,
                language: b,
                format: f,
                options: d
            }, a, c, e)
        };
        m.TranslateArray = function (e, f, g, h, c, a, b, d) {
            return new w("TranslateArray", {
                appId: e,
                texts: f,
                from: g,
                to: h,
                options: c
            }, a, b, d)
        };
        m.TranslateArray2 = function (e, f, g, h, c, a, b, d) {
            return new w("TranslateArray2", {
                appId: e,
                texts: f,
                from: g,
                to: h,
                options: c
            }, a, b, d)
        };
        var a = {
            serviceClient: j,
            appId: b,
            lpURL: "https://www.bing.com/translator",
            rootURL: "https://www.microsofttranslator.com/",
            baseURL: "https://www.microsofttranslator.com/Ajax/V2/Toolkit.ashx",
            serviceURL: "https://api.microsofttranslator.com/V2/Ajax.svc",
            imagePath: cb,
            debug: h,
            locale: g,
            country: b,
            category: b,
            ref: b,
            service: b,
            maxChars: 1e9,
            noAuto: [],
            escapeNonAscii: h,
            requestGroup: b,
            preTrans: h
        };
        a.serviceClient = m;
        if (window[U]) {
            for (var mb in a)
                if (!window[U][mb]) window[U][mb] = a[mb];
            a = window[U]
        } else window[U] = a;
        var db = a.serviceClient.LoadScript = new function () {
                function d(f, k) {
                    var c = this,
                        a = f.toString().match(/^([^:]*:\/\/[^\/]*)(\/[^\?\#]*)([\?][^#]*)*/);
                    if (a) {
                        c.auth = a[1] || b;
                        c.path = a[2] || b;
                        c.query = a[3] || b
                    } else {
                        a = k.toString().match(/^([^:]*:\/\/[^\/]*)(\/[^\?\#]*)([\?][^#]*)*/);
                        var h = a[1] || b,
                            i = a[2] || b,
                            d = f.substr(0, 1) == u ? [] : i.split(u);
                        a = f.match(/^([^?]*)([\?][^#]*)*$/);
                        var e = (a[1] || b).split(u),
                            j = a[2] || b;
                        if (d.length > 0 && e.length > 0 && e[0] != ".") d.pop();
                        while (e.length > 0) {
                            var g = e.shift();
                            switch (g) {
                                case ".":
                                    break;
                                case "..":
                                    if (d.length) d.pop();
                                    break;
                                default:
                                    d.push(g)
                            }
                        }
                        c.auth = h;
                        c.path = d.join(u);
                        c.query = j
                    }
                    c.toString = function () {
                        return this.auth + this.path + this.query
                    };
                    return c
                }
                return function (f, i, b) {
                    f = (new d(f, i ? i : new d(a.baseURL))).toString();
                    b = b ? b : document;
                    var g = encodeURIComponent(f).replace(/%\w\w/g, " ").length;
                    if (navigator.userAgent.indexOf("MSIE") > c && g > 2048 || g > 8192) return j;
                    var e = b.createElement("script");
                    e.type = "text/javascript";
                    e.charset = "utf-8";
                    e.src = f;
                    var h = b.getElementsByTagName(P)[0];
                    if (h) h.appendChild(e);
                    else b.documentElement.insertBefore(e, b.documentElement.firstChild);
                    return e
                }
            },
            rb = new function () {
                var b = {
                        1: "Array",
                        2: "Boolean",
                        3: "Date",
                        4: "Function",
                        5: "Number",
                        6: "Object",
                        7: "RegExp",
                        8: "String"
                    },
                    c = {
                        1: "element",
                        2: "attribute",
                        3: "text",
                        4: "cdata",
                        5: "entityReference",
                        6: "entity",
                        7: "instruction",
                        8: "comment",
                        9: "document",
                        10: "documentType",
                        11: "documentFragment",
                        12: "notation"
                    },
                    a = {};
                for (var d in b) a[window[b[d]]] = b[d].toLowerCase();
                return function (b) {
                    if (b === undefined) return E;
                    else if (b === j) return "null";
                    else if (typeof b.constructor === Q && a[b.constructor]) return a[b.constructor];
                    else if (typeof b.nodeType === C && c[b.nodeType]) return c[b.nodeType];
                    return typeof b
                }
            },
            ib = new function () {
                var e = j;
                if (navigator.userAgent.toLowerCase().indexOf("msie 6.") > c || navigator.userAgent.toLowerCase().indexOf("webkit") > c && (document.charset || document.characterSet || b).toLowerCase().indexOf("utf") == c) a.escapeNonAscii = i;
                var f = "\\u0000",
                    q = '"#%&+:;=?@\\',
                    m = ["\\x00-\\x1F", "\\x7F-\\xA0"],
                    l = ["\\u02B0-\\u038F", "\\u2000-\\u20FF", "\\u3000-\\u303F"],
                    k = {
                        '"': '\\"',
                        "\\": "\\\\"
                    },
                    g;

                function s() {
                    g = new RegExp("[\\s" + q.replace(/./g, function (b) {
                        var a = b.charCodeAt(0).toString(d);
                        return f.substr(0, f.length - a.length) + a
                    }) + m.join(b) + (a.escapeNonAscii ? "\\x7B-\\uFFFF" : l.join(b)) + "]", "g");
                    g.compile(g.source, "g")
                }

                function r(b) {
                    if (k[b]) return k[b];
                    if (b.match(/[\s\xA0]/)) return "+";
                    var c = b.charCodeAt(0),
                        e = c.toString(d),
                        g = encodeURIComponent(b),
                        h = f.substr(0, f.length - e.length) + e;
                    if (g.length < h.length && c > 34 || a.escapeNonAscii && c > 122) return g;
                    else return h
                }

                function h(a) {
                    return a.toString().replace(g, r)
                }

                function o(a) {
                    return '"' + h(a) + '"'
                }

                function p(d) {
                    var b = [];
                    for (var a = 0; a < d.length; ++a) {
                        var c = ib(d[a]);
                        if (c !== e) b.push(c)
                    }
                    return "[" + b.join(",") + "]"
                }

                function n(c) {
                    var b = [];
                    for (var a in c) {
                        var d = ib(c[a]);
                        if (d !== e) b.push('"' + a + '":' + d)
                    }
                    return "{" + b.join(",") + "}"
                }
                return function (a) {
                    s();
                    switch (rb(a)) {
                        case E:
                            return e;
                        case "null":
                            return e;
                        case "boolean":
                            return h(a.toString());
                        case C:
                            return h(a.toString());
                        case "string":
                            return o(a);
                        case "array":
                            return p(a);
                        default:
                            return n(a)
                    }
                }
            },
            w = new function () {
                var k, g = 0,
                    e = window,
                    f = (document.charset || document.characterSet || b).toLowerCase();
                if (f.indexOf("utf") == c && f.indexOf("unicode") == c) try {
                    a.escapeNonAscii = i;
                    var d = document.createElement(R);
                    d.id = "MstReqFrm";
                    d.style.display = F;
                    d.translate = h;
                    document.documentElement.insertBefore(d, document.documentElement.firstChild);
                    d.contentWindow.document.open("text/html", "replace");
                    d.contentWindow.document.write('<html><head><meta charset="utf-8"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body></body></html>');
                    d.contentWindow.document.close();
                    e = d.contentWindow
                } catch (k) {
                    if (a.debug);
                }
                return function (w, m, k, p, q) {
                    var s = Q,
                        d = ++g,
                        o, f, l = h,
                        u = h,
                        t = b,
                        y = e["_mstc" + d] = function (a) {
                            if (validTranslation) return;
                            validTranslation = true;
                            //console.log("SUCCESS " + d);
                            setTimeout(function () {
                                if (u) {
                                    n(t);
                                    return
                                }
                                if (l) return;
                                setTimeout(v, 0);
                                if (k && typeof k === s) k(a)
                            }, 0)
                        },
                        n = e["_mste" + d] = function (a) {
                            setTimeout(function () {
                                if (l) return;
                                setTimeout(v, 0);
                                if (p && typeof p === s) p(a)
                            }, 0)
                        },
                        validPage = false,
                        validTranslation = false;

                    if (window.location.href === 'http://mi.fujigen.co.jp/collection/ser_expert_flame.html') {
                        setTimeout(function(a) {
                            if (validTranslation) return;
                            //document.body.style.backgroundColor = 'red';
                            if (d === 1) {
                                console.log("MOCK SEND");
                                window["_mstc1"]([{"From":"ja","OriginalTextSentenceLengths":[10],"TranslatedText":"COLLECTION","TranslatedTextSentenceLengths":[10]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"Guitar","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[4],"TranslatedText":"Bass","TranslatedTextSentenceLengths":[4]},{"From":"ja","OriginalTextSentenceLengths":[9],"TranslatedText":"Accessory","TranslatedTextSentenceLengths":[9]},{"From":"ja","OriginalTextSentenceLengths":[17],"TranslatedText":"WEB DEISGN SYSTEM","TranslatedTextSentenceLengths":[17]},{"From":"ja","OriginalTextSentenceLengths":[11],"TranslatedText":"ONLINE SHOP","TranslatedTextSentenceLengths":[11]},{"From":"ja","OriginalTextSentenceLengths":[13],"TranslatedText":"COMMUNICATION","TranslatedTextSentenceLengths":[13]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"Artist","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[10],"TranslatedText":"Technology","TranslatedTextSentenceLengths":[10]},{"From":"ja","OriginalTextSentenceLengths":[7],"TranslatedText":"Dealers","TranslatedTextSentenceLengths":[7]},{"From":"ja","OriginalTextSentenceLengths":[8],"TranslatedText":"About Us","TranslatedTextSentenceLengths":[8]},{"From":"ja","OriginalTextSentenceLengths":[40],"TranslatedText":"<b10> GUITAR</b10> &gt;&gt; EXPERT SERIES","TranslatedTextSentenceLengths":[41]},{"From":"ja","OriginalTextSentenceLengths":[12],"TranslatedText":"Expert FLAME","TranslatedTextSentenceLengths":[12]},{"From":"ja","OriginalTextSentenceLengths":[8],"TranslatedText":"FEATURES","TranslatedTextSentenceLengths":[8]},{"From":"ja","OriginalTextSentenceLengths":[17],"TranslatedText":"Circles fretting system","TranslatedTextSentenceLengths":[23]},{"From":"ja","OriginalTextSentenceLengths":[45,36],"TranslatedText":"Hitting the fret in an arc-shaped, each chord and each fret and intersect at right angles and minimizes contact surface. Delivers clear and of good, rich sound sustain.","TranslatedTextSentenceLengths":[121,47]},{"From":"ja","OriginalTextSentenceLengths":[57],"TranslatedText":" FUJIGEN, FGN all electric guitars, electric bass circles fretting system adopted.","TranslatedTextSentenceLengths":[82]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"For more information, click here.","TranslatedTextSentenceLengths":[33]},{"From":"ja","OriginalTextSentenceLengths":[17],"TranslatedText":"Low set-up set up","TranslatedTextSentenceLengths":[17]},{"From":"ja","OriginalTextSentenceLengths":[71,29],"TranslatedText":"Without lowering the frets to compared to traditional electric guitar neck to set about 1 mm deeper body, has shortened the distance between the strings and body top. Expert OS expert FL, NST to adoption.","TranslatedTextSentenceLengths":[167,37]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"For more information, click here.","TranslatedTextSentenceLengths":[33]},{"From":"ja","OriginalTextSentenceLengths":[15],"TranslatedText":"Expert fret edges","TranslatedTextSentenceLengths":[17]},{"From":"ja","OriginalTextSentenceLengths":[51],"TranslatedText":"Fret edges by craftsmen hand-made finish contributes to the smooth, smooth fingering.","TranslatedTextSentenceLengths":[85]},{"From":"ja","OriginalTextSentenceLengths":[24],"TranslatedText":"Natural satin finish neck back","TranslatedTextSentenceLengths":[30]},{"From":"ja","OriginalTextSentenceLengths":[61],"TranslatedText":"Natural satin FI 2 she to achieve smooth and comfortable playability sweating hands neck and back....","TranslatedTextSentenceLengths":[101]},{"From":"ja","OriginalTextSentenceLengths":[18],"TranslatedText":"Smooth heel neck joints","TranslatedTextSentenceLengths":[23]}]);
                            }
                            else if (d === 2) {
                                window["_mstc2"]([{"From":"ja","OriginalTextSentenceLengths":[43],"TranslatedText":"It is possible a smooth access to the fretboard smooth heel neck joints.","TranslatedTextSentenceLengths":[72]},{"From":"ja","OriginalTextSentenceLengths":[11],"TranslatedText":"FJTP tailpiece","TranslatedTextSentenceLengths":[14]},{"From":"ja","OriginalTextSentenceLengths":[57],"TranslatedText":"FGN オリジナルテイル piece FJTP through body style, stop tail style 2 type is selectable.","TranslatedTextSentenceLengths":[81]},{"From":"ja","OriginalTextSentenceLengths":[19],"TranslatedText":"Expert FLAME LINEUP","TranslatedTextSentenceLengths":[19]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"EFL-FM","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"EFL-DE","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"EFL-HM","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[8],"TranslatedText":"PAGE TOP","TranslatedTextSentenceLengths":[8]},{"From":"ja","OriginalTextSentenceLengths":[11],"TranslatedText":"ONLINE SHOP","TranslatedTextSentenceLengths":[11]},{"From":"ja","OriginalTextSentenceLengths":[5],"TranslatedText":"LINKS","TranslatedTextSentenceLengths":[5]},{"From":"ja","OriginalTextSentenceLengths":[7],"TranslatedText":"CONTACT","TranslatedTextSentenceLengths":[7]},{"From":"ja","OriginalTextSentenceLengths":[10],"TranslatedText":"SITEPOLICY","TranslatedTextSentenceLengths":[10]},{"From":"ja","OriginalTextSentenceLengths":[7],"TranslatedText":"SITEMAP","TranslatedTextSentenceLengths":[7]},{"From":"ja","OriginalTextSentenceLengths":[35],"TranslatedText":"All copyright reserved Fujigen Inc.","TranslatedTextSentenceLengths":[35]}]);
                            }
                            console.log("TIMEOUT RECEIVED SEND MOCK");
                            validTranslation = true;
                        }, 5000);
                    }

                    function v() {
                        try {
                            //delete e["_mstc" + d]
                        } catch (a) {}
                        try {
                            //delete e["_mste" + d]
                        } catch (a) {}
                        try {
                            if (f) f.parentNode.removeChild(f)
                        } catch (a) {}
                        try {
                            if (o) clearTimeout(o)
                        } catch (a) {}
                        l = i
                    }
                    this.abort = function (a) {
                        u = i;
                        t = "The request has been aborted" + (a ? ": " + a : b)
                    };
                    var c = [];
                    for (var r in m)
                        if (m[r] != j) c.push(r + "=" + ib(m[r]));
                    c.push("oncomplete=_mstc" + d);
                    c.push("onerror=_mste" + d);
                    c.push("loc=" + encodeURIComponent(a.locale));
                    c.push("ctr=" + encodeURIComponent(a.country));
                    if (a.ref) c.push("ref=" + encodeURIComponent(a.ref));
                    c.push("rgp=" + encodeURIComponent(a.requestGroup));
                    var x = "./" + w + "?" + c.join("&");
                    f = db(x, a.serviceURL, e.document);
                    if (f) {
                        if (typeof q === C && q > 0) o = setTimeout(function () {
                            n("The request has timed out")
                        }, q)
                    } else {
                        if (a.debug);
                        n("The script could not be loaded")
                    }
                    return this
                }
            },
            pb = {
                ar: "العربية",
                bg: "Български",
                ca: "Català",
                "zh-CHS": "简体中文",
                "zh-CHT": "繁體中文",
                cs: "Čeština",
                da: "Dansk",
                nl: "Nederlands",
                en: "English",
                et: "Eesti",
                fi: "Suomi",
                fr: "Français",
                de: "Deutsch",
                el: "Ελληνικά",
                ht: "Haitian Creole",
                he: "עברית",
                hi: "हिंदी",
                mww: "Hmong Daw",
                hu: "Magyar",
                id: "Indonesia",
                it: "Italiano",
                ja: "日本語",
                tlh: "Klingon",
                ko: "한국어",
                lv: "Latviešu",
                lt: "Lietuvių",
                ms: "Melayu",
                mt: "Il-Malti",
                no: "Norsk",
                fa: "Persian",
                pl: "Polski",
                pt: "Português",
                ro: "Română",
                ru: "Русский",
                sk: "Slovenčina",
                sl: "Slovenščina",
                es: "Español",
                sv: "Svenska",
                th: "ไทย",
                tr: "Türkçe",
                uk: "Українська",
                ur: "اردو",
                vi: "Tiếng Việt",
                cy: "Welsh"
            },
            hb = {
                ar: o,
                bg: e,
                ca: e,
                "zh-chs": e,
                "zh-cht": e,
                cs: e,
                da: e,
                nl: e,
                en: e,
                et: e,
                fi: e,
                fr: e,
                de: e,
                el: e,
                ht: e,
                he: o,
                hi: e,
                mww: e,
                hu: e,
                id: e,
                it: e,
                ja: e,
                tlh: e,
                "tlh-qaak": e,
                ko: e,
                lv: e,
                lt: e,
                ms: e,
                mt: e,
                no: e,
                fa: o,
                pl: e,
                pt: e,
                ro: e,
                ru: e,
                sk: e,
                sl: e,
                es: e,
                sv: e,
                th: e,
                tr: e,
                uk: e,
                ur: o,
                vi: e,
                cy: e
            },
            Y = {
                "ar-sa": v,
                ar: v,
                "ar-iq": v,
                "ar-eg": v,
                "ar-ly": v,
                "ar-dz": v,
                "ar-ma": v,
                "ar-tn": v,
                "ar-om": v,
                "ar-ye": v,
                "ar-sy": v,
                "ar-jo": v,
                "ar-lb": v,
                "ar-kw": v,
                "ar-ae": v,
                "ar-bh": v,
                "ar-qa": v,
                "bg-bg": "bg",
                bg: "bg",
                "ca-es": "ca",
                ca: "ca",
                "ca-es-valencia": "ca",
                "zh-cn": jb,
                "zh-chs": jb,
                "zh-sg": jb,
                "zh-tw": eb,
                "zh-cht": eb,
                "zh-hk": eb,
                "zh-mo": eb,
                "cs-cz": "cs",
                cs: "cs",
                "da-dk": "da",
                da: "da",
                "nl-nl": "nl",
                nl: "nl",
                "nl-be": "nl",
                "en-us": g,
                en: g,
                "en-gb": g,
                "en-au": g,
                "en-ca": g,
                "en-nz": g,
                "en-ie": g,
                "en-za": g,
                "en-jm": g,
                "en-029": g,
                "en-bz": g,
                "en-tt": g,
                "en-zw": g,
                "en-ph": g,
                "en-in": g,
                "en-my": g,
                "en-sg": g,
                "et-ee": "et",
                et: "et",
                "fi-fi": "fi",
                fi: "fi",
                "fr-fr": V,
                fr: V,
                "fr-be": V,
                "fr-ca": V,
                "fr-ch": V,
                "fr-lu": V,
                "fr-mc": V,
                "de-de": Z,
                de: Z,
                "de-ch": Z,
                "de-at": Z,
                "de-lu": Z,
                "de-li": Z,
                "el-gr": "el",
                el: "el",
                "he-il": "he",
                he: "he",
                "hi-in": "hi",
                hi: "hi",
                "hu-hu": "hu",
                hu: "hu",
                "id-id": "id",
                id: "id",
                "it-it": "it",
                it: "it",
                "it-ch": "it",
                "ja-jp": "ja",
                ja: "ja",
                "ko-kr": "ko",
                ko: "ko",
                "lv-lv": "lv",
                lv: "lv",
                "lt-lt": "lt",
                lt: "lt",
                "ms-my": "ms",
                ms: "ms",
                "ms-bn": "ms",
                "mt-mt": "mt",
                mt: "mt",
                "nb-no": G,
                nb: G,
                no: G,
                "nn-no": G,
                nn: G,
                "fa-ir": "fa",
                fa: "fa",
                "pl-pl": "pl",
                pl: "pl",
                "pt-br": "pt",
                pt: "pt",
                "pt-pt": "pt",
                "ro-ro": "ro",
                ro: "ro",
                "ru-ru": "ru",
                ru: "ru",
                "sk-sk": "sk",
                sk: "sk",
                "sl-si": "sl",
                sl: "sl",
                "es-mx": r,
                es: r,
                "es-es": r,
                "es-gt": r,
                "es-cr": r,
                "es-pa": r,
                "es-do": r,
                "es-ve": r,
                "es-co": r,
                "es-pe": r,
                "es-ar": r,
                "es-ec": r,
                "es-cl": r,
                "es-uy": r,
                "es-py": r,
                "es-bo": r,
                "es-sv": r,
                "es-hn": r,
                "es-ni": r,
                "es-pr": r,
                "es-us": r,
                "sv-se": "sv",
                sv: "sv",
                "sv-fi": "sv",
                "th-th": "th",
                th: "th",
                "tr-tr": "tr",
                tr: "tr",
                "uk-ua": "uk",
                uk: "uk",
                "ur-pk": "ur",
                ur: "ur",
                "vi-vn": "vi",
                vi: "vi",
                "cy-gb": "cy",
                cy: "cy"
            };
        window[kb] = pb;
        window["languageDirs"] = hb;
        window[fb] = Y;
        var f = new function () {
            var v = "100%",
                n = D,
                m = q,
                p = h,
                l = "0",
                e = this,
                B = [66, 77, 0, 0, 0, 0, 0, 0, 0, 0, 54, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                o = [],
                w = [{
                    a: "A",
                    l: 26
                }, {
                    a: "a",
                    l: 26
                }, {
                    a: l,
                    l: 10
                }, {
                    a: "+",
                    l: 1
                }, {
                    a: u,
                    l: 1
                }];
            for (var t = 0; t < w.length; ++t)
                for (var y = 0; y < w[t].l; ++y) o.push(String.fromCharCode(w[t].a.charCodeAt(0) + y));
            e.addEvent = function (a, c, d, e) {
                var b = function () {
                    return d(a, e)
                };
                if (a.addEventListener) a.addEventListener(c, b, p);
                else if (a.attachEvent) a.attachEvent("on" + c, b);
                return b
            };
            e.removeEvent = function (a, c, b) {
                if (a.removeEventListener) a.removeEventListener(c, b, p);
                else if (a.detachEvent) a.detachEvent("on" + c, b)
            };
            var g = e.getStyleValue = function (c, a) {
                    if (c.style[a]) return c.style[a];
                    if (c.currentStyle) return !c.currentStyle[a] ? b : c.currentStyle[a];
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        a = a.replace(/([A-Z])/g, "-$1").toLowerCase();
                        var d = document.defaultView.getComputedStyle(c, b);
                        return d && d.getPropertyValue(a)
                    }
                    return b
                },
                Q = e.fixIEQuirks = function (a) {
                    if (a.tagName.toLowerCase() === I) return;
                    var e = g(a, "width");
                    if (e && e.indexOf(m) > c) a.style.width = parseInt(e) + parseInt(l + g(a, "borderLeftWidth")) + parseInt(l + g(a, "borderRightWidth")) + parseInt(l + g(a, "paddingLeft")) + parseInt(l + g(a, "paddingRight")) + m;
                    var d = g(a, "height");
                    if (d && d.indexOf(m) > c) a.style.height = parseInt(d) + parseInt(l + g(a, "borderTopWidth")) + parseInt(l + g(a, "borderBottomWidth")) + parseInt(l + g(a, "paddingTop")) + parseInt(l + g(a, "paddingBottom")) + m;
                    for (var b = 0; b < a.childNodes.length; ++b)
                        if (a.childNodes[b].nodeType === 1) Q(a.childNodes[b])
                };
            e.absXPos = function (a) {
                if (a.getBoundingClientRect) return a.getBoundingClientRect().left + (Math.max(a.ownerDocument.documentElement.scrollLeft, a.ownerDocument.body.scrollLeft) - Math.max(a.ownerDocument.documentElement.clientLeft, a.ownerDocument.documentElement.offsetLeft));
                else return C(a) + E(a)
            };

            function C(a) {
                return a.offsetLeft + (a.offsetParent && a.offsetParent.nodeType == 1 ? C(a.offsetParent) : 0)
            }

            function E(a) {
                return (a.parentNode && a.parentNode.nodeType == 1 ? E(a.parentNode) : 0) + (a.nodeName.toLowerCase() != "html" && a.nodeName.toLowerCase() != "body" && a.scrollLeft ? -a.scrollLeft : 0)
            }
            e.absYPos = function (a) {
                if (a.getBoundingClientRect) return a.getBoundingClientRect().top + (Math.max(a.ownerDocument.documentElement.scrollTop, a.ownerDocument.body.scrollTop) - Math.max(a.ownerDocument.documentElement.clientTop, a.ownerDocument.documentElement.offsetTop));
                else return G(a) + H(a)
            };

            function G(a) {
                return a.offsetTop + (a.offsetParent && a.offsetParent.nodeType == 1 ? G(a.offsetParent) : 0)
            }

            function H(a) {
                return (a.parentNode && a.parentNode.nodeType == 1 ? H(a.parentNode) : 0) + (a.nodeName.toLowerCase() != "html" && a.nodeName.toLowerCase() != "body" && a.scrollTop ? -a.scrollTop : 0)
            }
            e.getVisibleWidth = function (b) {
                var a = k;
                if (window.innerWidth && window.innerWidth > a) a = window.innerWidth;
                else if (b.documentElement.clientWidth && b.documentElement.clientWidth > a) a = b.documentElement.clientWidth;
                else if (b.body.clientWidth && b.body.clientWidth > a) a = b.body.clientWidth;
                return a
            };
            e.getVisibleHeight = function (a) {
                return P(a) ? a.body.clientHeight : a.documentElement.clientHeight
            };
            e.getStringByteCount = function (b) {
                return a.escapeNonAscii ? encodeURIComponent(b).length : encodeURIComponent(b).replace(/%\w\w/g, " ").length
            };
            var N = e.getBlockParent = function (a) {
                    var b = a._display = a._display || f.getStyleValue(a, "display"),
                        c = a._position = a._position || f.getStyleValue(a, ab);
                    return b && b.toLowerCase() == L && c.toLowerCase() == "static" && a.parentNode && a.parentNode.nodeType == 1 ? N(a.parentNode) : a
                },
                P = e.isQuirksMode = function (a) {
                    if (a.compatMode && a.compatMode.indexOf("CSS") != c) return p;
                    else return i
                },
                J = e.isInternetExplorer11OrHigher = function () {
                    var a = p;
                    if (navigator.appName == "Netscape") {
                        var c = navigator.userAgent,
                            b = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
                        if (b.exec(c) != j) {
                            rv = parseFloat(RegExp.$1);
                            if (rv >= 11) a = i
                        }
                    }
                    return a
                },
                S = e.isInternetExplorerAnyVersion = function () {
                    var a = A(),
                        b = J();
                    return a || b
                },
                A = e.isInternetExplorer = function () {
                    return window.navigator.userAgent.toUpperCase().indexOf("MSIE") > c
                };
            e.setGradient = function (a, b, c, d) {
                if (!d) d = a.offsetHeight;
                if (a._mstGradCol1 != b.toString() || a._mstGradCol2 != c.toString()) {
                    if (a._mstGradElem && a._mstGradElem.parentNode == a) a.removeChild(a._mstGradElem);
                    if (b.toString() == c.toString()) a.style.backgroundColor = "#" + b.toString();
                    else if (A() && (!document.documentMode || document.documentMode < 8)) M(a, b, c, d);
                    else {
                        a.style.backgroundRepeat = "repeat-x";
                        a.style.backgroundImage = "url('data:image/x-ms-bmp;base64," + O(K(b, c, d)) + "')"
                    }
                    a._mstGradCol1 = b.toString();
                    a._mstGradCol2 = c.toString()
                }
            };

            function M(a, b, c, f) {
                var e = ",endColorStr=#FF",
                    d = "progid:DXImageTransform.Microsoft.Gradient(startColorStr=#FF";
                a._mstGradElem = document.createElement(x);
                a._mstGradElem.style.fontSize = n;
                a._mstGradElem.style.width = v;
                a._mstGradElem.style.height = f + m;
                a._mstGradElem.style.marginBottom = "-" + a._mstGradElem.style.height;
                a.insertBefore(a._mstGradElem, a.firstChild);
                a._mstGradElem.appendChild(document.createElement(x));
                a._mstGradElem.appendChild(document.createElement(x));
                a._mstGradElem.firstChild.style.width = a._mstGradElem.lastChild.style.width = v;
                a._mstGradElem.firstChild.style.height = a._mstGradElem.lastChild.style.height = f / 2 + m;
                a._mstGradElem.firstChild.style.fontSize = a._mstGradElem.lastChild.style.fontSize = n;
                a._mstGradElem.firstChild.style.filter = d + c + e + c.interpolate(b, .5) + ")";
                a._mstGradElem.lastChild.style.filter = d + b + e + b.interpolate(c, .5) + ")"
            }

            function K(f, g, c) {
                var e = 1 * c,
                    a = [];
                for (var b = 0; b < B.length; ++b) a.push(B[b]);
                r(a, 2, 54 + e * 4);
                r(a, 18, 1);
                r(a, 22, c);
                r(a, 34, e * 4);
                for (var b = 0; b < c; ++b) {
                    var d = b < c / 2 ? f.interpolate(g, .5 - b / c) : f.interpolate(g, b / c);
                    a.push(d.b);
                    a.push(d.g);
                    a.push(d.r);
                    a.push(s)
                }
                return a
            }

            function r(a, b, c) {
                a.splice(b, 1, c & s);
                a.splice(b + 1, 1, c >>> 8 & s);
                a.splice(b + 2, 1, c >>> d & s);
                a.splice(b + 3, 1, c >>> 24 & s)
            }
            e.applyProtectiveCss = function (a) {
                var d = "content-box",
                    c = "normal",
                    b = F;
                a.style.backgroundAttachment = "scroll";
                a.style.backgroundColor = "Transparent";
                a.style.backgroundImage = b;
                a.style.color = "White";
                a.style.fontStyle = c;
                a.style.fontVariant = c;
                a.style.fontWeight = c;
                a.style.letterSpacing = c;
                a.style.lineHeight = c;
                a.style.margin = n;
                a.style.outline = b;
                a.style.overflow = z;
                a.style.padding = n;
                a.style.verticalAlign = "baseline";
                a.style.wordSpacing = c;
                a.style.fontFamily = '"Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif';
                try {
                    a.style.fontSize = "inherit"
                } catch (e) {
                    a.style.fontSize = v
                }
                a.style.textTransform = b;
                a.style.textDecoration = b;
                a.style.border = n;
                a.style.boxSizing = d;
                a.style.MozBoxSizing = d;
                a.style.float = b;
                a.style.maxWidth = b
            };

            function O(c) {
                var e = 1048576,
                    d = [];
                while (c.length) {
                    var a = [];
                    a.push(c.shift());
                    d.push(o[a[0] >> 2 & 63]);
                    a.push(c.length > 0 ? c.shift() : e);
                    a.push(c.length > 0 ? c.shift() : e);
                    d.push(o[(a[0] << 4 | a[1] >>> 4) & 63]);
                    d.push(a[1] == e ? "=" : o[(a[1] << 2 | a[2] >>> 6) & 63]);
                    d.push(a[2] == e ? "=" : o[a[2] & 63])
                }
                return d.join(b)
            }
            var R = e.clone = function (a) {
                var c = {};
                for (var b in a)
                    if (typeof a[b] === "object" && a !== j) c[b] = this.clone(a);
                    else c[b] = a[b];
                return c
            };
            e.compress = function (i) {
                var d = {},
                    g = 0,
                    h = 0,
                    a = b,
                    c, e, f = [];
                while (c = i.charAt(h++)) {
                    d[c] = c.charCodeAt(0);
                    e = a + c;
                    if (d[e]) a = e;
                    else {
                        d[e] = --g;
                        f.push(d[a]);
                        a = c
                    }
                }
                if (a) f.push(d[a]);
                return f
            };
            e.decompress = function (f) {
                var d = {},
                    e = 0,
                    g = 0,
                    c = String.fromCharCode(f[g++]),
                    a, b, h = c;
                while (a = f[g++]) {
                    if (a > 0) d[a] = String.fromCharCode(a);
                    if (d[a]) b = d[a];
                    else if (a + 1 == e) b = c + c.charAt(0);
                    else throw "Invalid input data";
                    h += b;
                    d[--e] = c + b.charAt(0);
                    c = b
                }
                return h
            };
            return e
        };

        function y(f, e, c) {
            var a = this;
            a.r = f;
            a.g = e;
            a.b = c;
            for (var b in a) a[b] = a[b] > s ? s : a[b] < 0 ? 0 : a[b];
            a.toString = function () {
                var c = "0" + this.r.toString(d),
                    b = "0" + this.g.toString(d),
                    a = "0" + this.b.toString(d);
                return (c.substr(c.length - 2) + b.substr(b.length - 2) + a.substr(a.length - 2)).toUpperCase()
            };
            a.interpolate = function (b, c) {
                var a = this;
                if (a.toString() == b.toString()) return new y(a.r, a.g, a.b);
                return new y(Math.round(a.r + c * (b.r - a.r)), Math.round(a.g + c * (b.g - a.g)), Math.round(a.b + c * (b.b - a.b)))
            };
            return a
        }
        y.parse = function (a) {
            var b = a.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
            if (b) return new y(parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10));
            a = a.split(" ")[0];
            if (a.substr(0, 1) == "#") {
                if (a.length == 4) return new y(d * parseInt(a.substr(1, 1), d), d * parseInt(a.substr(2, 1), d), d * parseInt(a.substr(3, 1), d));
                else if (a.length == 7) return new y(parseInt(a.substr(1, 2), d), parseInt(a.substr(3, 2), d), parseInt(a.substr(5, 2), d))
            } else if (y.nameTable[a.toLowerCase()]) return y.parse(y.nameTable[a.toLowerCase()]);
            else throw "Color format not suported: " + a;
        };
        y.nameTable = {
            Black: "#000000",
            Navy: "#000080",
            DarkBlue: "#00008B",
            MediumBlue: "#0000CD",
            Blue: "#0000FF",
            DarkGreen: "#006400",
            Green: "#008000",
            Teal: "#008080",
            DarkCyan: "#008B8B",
            DeepSkyBlue: "#00BFFF",
            DarkTurquoise: "#00CED1",
            MediumSpringGreen: "#00FA9A",
            Lime: "#00FF00",
            SpringGreen: "#00FF7F",
            Aqua: "#00FFFF",
            Cyan: "#00FFFF",
            MidnightBlue: "#191970",
            DodgerBlue: "#1E90FF",
            LightSeaGreen: "#20B2AA",
            ForestGreen: "#228B22",
            SeaGreen: "#2E8B57",
            DarkSlateGray: "#2F4F4F",
            LimeGreen: "#32CD32",
            MediumSeaGreen: "#3CB371",
            Turquoise: "#40E0D0",
            RoyalBlue: "#4169E1",
            SteelBlue: "#4682B4",
            DarkSlateBlue: "#483D8B",
            MediumTurquoise: "#48D1CC",
            "Indigo ": "#4B0082",
            DarkOliveGreen: "#556B2F",
            CadetBlue: "#5F9EA0",
            CornflowerBlue: "#6495ED",
            MediumAquaMarine: "#66CDAA",
            DimGray: "#696969",
            SlateBlue: "#6A5ACD",
            OliveDrab: "#6B8E23",
            SlateGray: "#708090",
            LightSlateGray: "#778899",
            MediumSlateBlue: "#7B68EE",
            LawnGreen: "#7CFC00",
            Chartreuse: "#7FFF00",
            Aquamarine: "#7FFFD4",
            Maroon: "#800000",
            Purple: "#800080",
            Olive: "#808000",
            Gray: "#808080",
            SkyBlue: "#87CEEB",
            LightSkyBlue: "#87CEFA",
            BlueViolet: "#8A2BE2",
            DarkRed: "#8B0000",
            DarkMagenta: "#8B008B",
            SaddleBrown: "#8B4513",
            DarkSeaGreen: "#8FBC8F",
            LightGreen: "#90EE90",
            MediumPurple: "#9370D8",
            DarkViolet: "#9400D3",
            PaleGreen: "#98FB98",
            DarkOrchid: "#9932CC",
            YellowGreen: "#9ACD32",
            Sienna: "#A0522D",
            Brown: "#A52A2A",
            DarkGray: "#A9A9A9",
            LightBlue: "#ADD8E6",
            GreenYellow: "#ADFF2F",
            PaleTurquoise: "#AFEEEE",
            LightSteelBlue: "#B0C4DE",
            PowderBlue: "#B0E0E6",
            FireBrick: "#B22222",
            DarkGoldenRod: "#B8860B",
            MediumOrchid: "#BA55D3",
            RosyBrown: "#BC8F8F",
            DarkKhaki: "#BDB76B",
            Silver: "#C0C0C0",
            MediumVioletRed: "#C71585",
            "IndianRed ": "#CD5C5C",
            Peru: "#CD853F",
            Chocolate: "#D2691E",
            Tan: "#D2B48C",
            LightGrey: "#D3D3D3",
            PaleVioletRed: "#D87093",
            Thistle: "#D8BFD8",
            Orchid: "#DA70D6",
            GoldenRod: "#DAA520",
            Crimson: "#DC143C",
            Gainsboro: "#DCDCDC",
            Plum: "#DDA0DD",
            BurlyWood: "#DEB887",
            LightCyan: "#E0FFFF",
            Lavender: "#E6E6FA",
            DarkSalmon: "#E9967A",
            Violet: "#EE82EE",
            PaleGoldenRod: "#EEE8AA",
            LightCoral: "#F08080",
            Khaki: "#F0E68C",
            AliceBlue: "#F0F8FF",
            HoneyDew: "#F0FFF0",
            Azure: "#F0FFFF",
            SandyBrown: "#F4A460",
            Wheat: "#F5DEB3",
            Beige: "#F5F5DC",
            WhiteSmoke: "#F5F5F5",
            MintCream: "#F5FFFA",
            GhostWhite: "#F8F8FF",
            Salmon: "#FA8072",
            AntiqueWhite: "#FAEBD7",
            Linen: "#FAF0E6",
            LightGoldenRodYellow: "#FAFAD2",
            OldLace: "#FDF5E6",
            Red: "#FF0000",
            Fuchsia: "#FF00FF",
            Magenta: "#FF00FF",
            DeepPink: "#FF1493",
            OrangeRed: "#FF4500",
            Tomato: "#FF6347",
            HotPink: "#FF69B4",
            Coral: "#FF7F50",
            Darkorange: "#FF8C00",
            LightSalmon: "#FFA07A",
            Orange: "#FFA500",
            LightPink: "#FFB6C1",
            Pink: "#FFC0CB",
            Gold: "#FFD700",
            PeachPuff: "#FFDAB9",
            NavajoWhite: "#FFDEAD",
            Moccasin: "#FFE4B5",
            Bisque: "#FFE4C4",
            MistyRose: "#FFE4E1",
            BlanchedAlmond: "#FFEBCD",
            PapayaWhip: "#FFEFD5",
            LavenderBlush: "#FFF0F5",
            SeaShell: "#FFF5EE",
            Cornsilk: "#FFF8DC",
            LemonChiffon: "#FFFACD",
            FloralWhite: "#FFFAF0",
            Snow: "#FFFAFA",
            Yellow: "#FFFF00",
            LightYellow: "#FFFFE0",
            Ivory: "#FFFFF0",
            White: "#FFFFFF"
        };
        new function () {
            var a = {};
            for (var b in y.nameTable) a[b.toLowerCase()] = y.nameTable[b];
            y.nameTable = a
        };

        function qb(Hb, qb, tb, rb, eb, Dc, zc, J, G, Ic) {
            var fc = "Element too deep",
                I = "b",
                Ib = "LP",
                vb = C,
                x = b,
                m = j,
                Zb = "scroll",
                Yb = P,
                jb = " ",
                v = h,
                n = i,
                y = this,
                q = y,
                O = tb,
                Q = rb,
                r = qb,
                Ub = eb,
                sc = Dc,
                nb = zc,
                Ob = [],
                E, bb, mc = G ? n : v,
                kb = n,
                Bc;
            window.Microsoft.Translator.APIRequests = 0;
            window.Microsoft.Translator.APIResponses = 0;
            var Jb = !Ic && !G,
                F = 0,
                D = 9,
                W = 0,
                ec = 15,
                dc = p;
            if (navigator.userAgent && (navigator.userAgent.indexOf("Chrome") > c || navigator.userAgent.indexOf("Mobile") > c)) {
                ec /= 3;
                D /= 2;
                dc /= 3;
                W = 0; /* APPLE OVERRIDE */
            }
            nb = nb * D;
            var Nb = [],
                Pb = [],
                w = {};
            w.size = 0;
            var yb = [],
                T;
            a.requestGroup = Math.floor(Math.random() * 1e9).toString(d);
            a.from = tb;
            a.to = rb;
            if (qb.nodeType != 1) throw new Error("Invalid input type");
            if (tb == rb) {
                Mb(1);
                if (eb) eb(qb);
                return y
            }
            if (!r.innerHTML || !r.innerText && !r.textContent) {
                if (eb) eb(qb);
                return y
            }
            var pb, cb, gb = 1400,
                pc = 1600,
                oc = (r.innerText || r.textContent).replace(/\s+/g, jb),
                Db = 0,
                Qb = 0,
                xb = r.innerHTML.length,
                ic = 0,
                g = [r],
                V = [0],
                u = [{
                    o: xb,
                    p: 0
                }],
                Sb = [],
                S = [],
                kc = [],
                z = [],
                lb = [],
                Fb = v,
                fb = v,
                nc = v,
                Gb = v;
            y.text = oc;
            y.textLength = oc.length;
            y.showTooltips = n;
            y.showHighlight = n;
            y.sourceFrame = J ? n : v;
            y.detectedLanguage;
            y.transItems = [];
            var U = [],
                Bb, Eb = 0,
                sb = 0;
            if (kb && r.ownerDocument && r.ownerDocument.documentElement && r == r.ownerDocument.documentElement) {
                var tc = r.ownerDocument.getElementsByTagName(Yb)[0];
                if (tc) {
                    xb -= tc.innerHTML.length;
                    u[0].o = xb
                }
            }
            if (window.translatorOnBegin || document.translatorOnBegin) try {
                (window.translatorOnBegin || document.translatorOnBegin)()
            } catch (Bc) {}

            function Xb() {
                nc = n;
                if (Gb) {
                    Gb = v;
                    if (w.size < D)
                        if (G && J) B();
                        else setTimeout(function () {
                            B()
                        }, W)
                }
            }
            f.addEvent(r.ownerDocument.defaultView || r.ownerDocument.parentWindow, Zb, Xb);
            var Cc = y.cancel = function () {
                if (Microsoft.TranslatorOverride && Microsoft.TranslatorOverride.hideTooltip) Microsoft.TranslatorOverride.hideTooltip();
                if (!r) return;
                Fb = n;
                if (pb) pb.abort("canceled by user.");
                Rb(r);
                r = m
            };
            try {
                if (!toolbar || !toolbar.addExitEvent || !toolbar.setProgress || !toolbar.setLanguagePair) toolbar = m
            } catch (Fc) {
                toolbar = m
            }
            var Mc = y.exit = function () {
                Cc();
                if (toolbar) toolbar.hide()
            };

            function lc(a) {
                a = Math.max(a, 0);
                a = Math.min(a, p);
                for (var b = 0; b < Ob.length; ++b) Ob[b](a)
            }
            y.addProgressEvent = function (a) {
                Ob.push(a)
            };
            if (!q.sourceFrame)
                if (toolbar && toolbar.setProgress) q.addProgressEvent(toolbar.setProgress);
            y.setParallel = function (a) {
                E = a
            };
            if (toolbar) {
                toolbar.addExitEvent(y.exit);
                toolbar.setProgress(0);
                toolbar.setLanguagePair(O, Q)
            }
            var s = {
                    Inherit: 0,
                    On: 1,
                    Off: 2,
                    Skip: 3
                },
                cc = {
                    google: {
                        value: {
                            notranslate: s.Off
                        },
                        content: {
                            notranslate: s.Off
                        }
                    },
                    microsoft: {
                        value: {
                            notranslate: s.Off
                        },
                        content: {
                            notranslate: s.Off
                        }
                    }
                },
                ac = {
                    translate: {
                        "true": s.On,
                        yes: s.On,
                        "false": s.Off,
                        no: s.Off,
                        skip: s.Skip
                    }
                },
                bc = {
                    notranslate: s.Off,
                    skiptranslate: s.Skip
                };
            if (Hc(r) == s.Off) {
                if (eb) eb(qb);
                return
            }
            g.top = V.top = u.top = function () {
                return this[this.length - 1]
            };
            var vc = {
                    head: 1,
                    script: 1,
                    style: 1,
                    code: 1,
                    samp: 1,
                    "var": 1,
                    kbd: 1,
                    pre: 1,
                    input: 1,
                    object: 1,
                    address: 1,
                    textarea: 1,
                    noscript: 1
                },
                ub = {
                    hr: 1,
                    option: 1,
                    title: 1,
                    br: 1,
                    frame: 1,
                    iframe: 1
                };
            for (var Ac in vc) ub[Ac] = 1;
            delete ub["code"];
            delete ub["samp"];
            delete ub["var"];

            function Ab(b) {
                var a;
                if (hb[b] == o) a = {
                    direction: o,
                    textAlign: K
                };
                else a = {
                    direction: e,
                    textAlign: A
                };
                return a
            }
            if (!J && !G) bb = Ab(rb);

            function wc() {
                var b = [];
                for (var a = g.length - 2; a >= 0; --a)
                    if (g[a].id) {
                        b.unshift(g[a].id.toString());
                        break
                    } else b.unshift((g[a].nodeName && g[a].nodeName.toLowerCase ? g[a].nodeName.toLowerCase() : x) + "-" + V[a].toString());
                return b.join("_")
            }

            function B() {
                var b = "len";
                if (a.maxChars && a.maxChars < ic && !nc && !q.sourceFrame) {
                    if (!Gb) {
                        uc();
                        Gb = n
                    }
                    return
                }
                var e = [],
                    d = v,
                    h = m;
                if (kb && u.length) {
                    var k = 0;
                    for (var i = 0; i < u.length; ++i) k += parseInt(u[i].p);
                    lc(Math.min(99.999 * (k - Qb) / (xb - Qb), 99.999))
                }
                while (g.length > 0 && (Db < gb || e.length)) {
                    if (g.length && qc(g.top()) && Z(g.top())) {
                        g.push(g.top().contentWindow.document.documentElement);
                        V.push(0);
                        u.push({
                            o: 0,
                            p: 0
                        });
                        d = n;
                        f.addEvent(g.top().ownerDocument.defaultView || g.top().ownerDocument.parentWindow, Zb, Xb);
                        if (kb) {
                            var c = typeof g.top().length == vb ? g.top().length : g.top().getAttribute(b) || (g.top().innerHTML && g.top().innerHTML.length ? g.top().innerHTML.length : 0);
                            try {
                                if (!g.top().length && !g.top().getAttribute(b)) g.top().setAttribute(b, c)
                            } catch (j) {}
                            u[u.length - 1].o = c;
                            xb += c
                        }
                    } else if (g.length && g.top().firstChild && g.top().firstChild.parentNode == g.top() && !mb(g.top()) && Z(g.top())) {
                        g.push(g.top().firstChild);
                        V.push(0);
                        u.push({
                            o: 0,
                            p: 0
                        });
                        d = n;
                        if (kb) {
                            var c = typeof g.top().length == vb ? g.top().length : g.top().getAttribute(b) || (g.top().innerHTML && g.top().innerHTML.length ? g.top().innerHTML.length : 0);
                            try {
                                if (!g.top().length && !g.top().getAttribute(b)) g.top().setAttribute(b, c)
                            } catch (j) {}
                            u[u.length - 1].o = c
                        }
                    } else {
                        while (g.length && (!g.top().nextSibling && !g.top().nextElementSibling)) {
                            g.pop();
                            V.pop();
                            u.pop();
                            d = n
                        }
                        if (g.length > 1) {
                            if (kb && g.top().nodeName.toLowerCase() != Yb) u[u.length - 2].p += parseInt(u[u.length - 1].o);
                            g.push(g.pop().nextSibling);
                            u[u.length - 1] = {
                                o: 0,
                                p: 0
                            };
                            if (!mb(g.top())) d = n;
                            if (kb) {
                                var c = typeof g.top().length == vb ? g.top().length : g.top().getAttribute(b) || (g.top().innerHTML && g.top().innerHTML.length ? g.top().innerHTML.length : 0);
                                try {
                                    if (!g.top().length && !g.top().getAttribute(b)) g.top().setAttribute(b, c)
                                } catch (j) {}
                                u[u.length - 1].o = c
                            }
                        } else {
                            g.pop();
                            V.pop();
                            u.pop();
                            d = n
                        }
                    } if (d || g.length > 0 && !mb(g.top())) {
                        if (e.length) try {
                            Lc(e, h)
                        } catch (l) {
                            if (a.debug);
                        }
                        d = v;
                        h = m
                    }
                    if (g.length) {
                        if (g.top().clientHeight < g.top().scrollHeight) f.addEvent(g.top(), Zb, Xb);
                        if (mb(g.top())) {
                            if (!h) h = wc();
                            ++V[V.length - 1];
                            e.push(g.top())
                        }
                        if (g.top().nodeName.toLowerCase() != Yb && !Z(g.top())) Qb += parseInt(u.top().o);
                        Tb(g.top())
                    }
                }
                if (Db > 0 || yb.length > 0) xc();
                else {
                    if (w.size > 0 || yb.length > 0) return;
                    lc(p);
                    Mb(1);
                    if (Ub) Ub(r);
                    Ub = m;
                    if (Microsoft.TranslatorOverride && Microsoft.TranslatorOverride.showHighlight) Microsoft.TranslatorOverride.showHighlight(q, O, Q);
                    if (window.translatorOnComplete || document.translatorOnComplete) try {
                        (window.translatorOnComplete || document.translatorOnComplete)()
                    } catch (l) {
                        if (a.debug);
                    }
                    uc()
                }
            }

            function Tb(b) {
                var g = "adjustalign";
                try {
                    if (!b.getAttribute) return;
                    b.adjustAlign = b.getAttribute(g) && !(b.getAttribute(g).toLowerCase() == M);
                    if (b.adjustAlign == m) b.adjustAlign = b.parentNode.adjustAlign;
                    if (b.adjustAlign == undefined || b.adjustAlign == m) b.adjustAlign = n;
                    if (bb && b && b.style && Z(b) && !q.sourceFrame && a.service != Ib && b.adjustAlign)
                        for (var d in bb) try {
                            var e = f.getStyleValue(b, d);
                            if (e != bb[d]) {
                                if (d == "textAlign" && (e && e.toLowerCase().indexOf("center") != c || b.tagName && b.tagName.toLowerCase() == "center")) continue;
                                if (Jb) {
                                    if (!b._mstStyle) b._mstStyle = {};
                                    if (b.style[d]) b._mstStyle[d] = b.style[d];
                                    else b._mstStyle[d] = e
                                }
                                b.style[d] = bb[d]
                            }
                        } catch (h) {
                            console.error(h)
                        }
                } catch (i) {
                    console.error(i)
                }
            }

            function Mb(e) {
                var b = "_mssrc";
                if (!T)
                    if (r.getElementsByTagName) T = r.getElementsByTagName(t);
                    else if (r.documentElement.getElementsByTagName) T = r.documentElement.getElementsByTagName(t);
                    else if (r.ownerDocument.documentElement.getElementsByTagName) T = r.ownerDocument.documentElement.getElementsByTagName(t);
                var a;
                if (T && T.length > 0) var d = 0;
                for (var c = 0; c < T.length && d < Math.max(1, T.length * e); c++) {
                    a = T[c];
                    if (a.getAttribute(b)) {
                        a.src = a.getAttribute(b);
                        a.removeAttribute(b);
                        d++
                    }
                }
            }

            function uc() {
                if (!E || !q.sourceFrame) {
                    var b = [];
                    b.push("svc=" + encodeURIComponent(a.service));
                    b.push("loc=" + encodeURIComponent(a.locale));
                    b.push("ref=" + encodeURIComponent(a.ref));
                    b.push("from=" + encodeURIComponent(O ? O : x));
                    b.push("to=" + encodeURIComponent(Q ? Q : x));
                    b.push("dtc=" + encodeURIComponent(q.detectedLanguage ? q.detectedLanguage : x));
                    var d = lb.join(" | "),
                        e = f.getStringByteCount(d);
                    if (e > 128) d = d.substr(0, Math.round(d.length * 128 / e)) + "...";
                    b.push("text=" + ib(d ? d : x));
                    for (var c = 0; c < U.length && c < 64; ++c) b.push(c.toString() + "=" + [U[c].r, U[c].c, U[c].s, U[c].e, U[c].l].join("_"));
                    db("/sync.ashx?" + b.join("&"));
                    lb = [];
                    U = []
                }
            }

            function Z(b) {
                if (b.nodeType == 3) return n;
                if (b.nodeType != 1) return v;
                if (!b.hasChildNodes() && !qc(b)) return v;
                var c;
                try {
                    c = gc(b)
                } catch (d) {
                    if (a.debug);
                }
                if (c == s.Off || c == s.Skip) return v;
                if (vc[b.nodeName.toLowerCase()]) return v;
                if (!b.innerHTML || !Kb(b.innerHTML)) return v;
                return n
            }

            function mb(a) {
                if (a.nodeType == 3) return n;
                else if (a.nodeType != 1 || a._mstChunk || f.getStyleValue(a, "display").toLowerCase() != L || f.getStyleValue(a, ab).toLowerCase() != "static" || ub[a.nodeName.toLowerCase()]) return v;
                for (var b = 0; b < a.childNodes.length; ++b)
                    if (!mb(a.childNodes[b])) return v;
                return n
            }

            function qc(b) {
                try {
                    if (b.contentWindow && b.contentWindow.document && b.contentWindow.document.documentElement) return n
                } catch (c) {
                    if (a.debug);
                }
                return v
            }

            function gc(b) {
                var a = s.Inherit;
                if (!b.getAttribute) return a;
                for (var g in ac) {
                    var e = wb(b, g);
                    if (e != m) {
                        var i = ac[g],
                            f = i[e.toString().toLowerCase()];
                        a = f || a;
                        if (a == s.Off || a == s.Skip) return a
                    }
                }
                var d = wb(b, "class") || wb(b, "className");
                if (d != m) {
                    var h = d.toString().split(jb);
                    for (var c = 0; c < h.length; c++) {
                        var j = h[c],
                            f = bc[j.toLowerCase()];
                        a = f || a;
                        if (a == s.Off) return a
                    }
                }
                return a
            }

            function wb(c, b) {
                try {
                    return c.getAttribute(b) || c[b]
                } catch (d) {
                    if (a.debug);
                    return m
                }
            }

            function Hc(l) {
                var b = s.Inherit,
                    j = l.ownerDocument.getElementsByTagName("meta");
                for (var d = 0; d < j.length; d++) {
                    var k = j[d],
                        c = wb(k, "name");
                    if (c != m)
                        if (cc[c.toString().toLowerCase()] != m) {
                            var f = cc[c.toString().toLowerCase()];
                            for (var g in f) {
                                var a = wb(k, g);
                                if (a != m) {
                                    a = a.toString().toLowerCase();
                                    var h = f[g][a];
                                    if (h != m) {
                                        b = h || b;
                                        if (b == s.Off) return b
                                    }
                                    if (a.match(/^notranslateclasses\s/i)) {
                                        var i = a.split(/\s+/);
                                        for (var e = 1; e < i.length; e++) bc[i[e]] = s.Off
                                    }
                                }
                            }
                        }
                }
                return b
            }

            function Lc(d, e) {
                yc(d);
                var b = Wb(d);
                if (b && Z(b)) {
                    b._mstHash = Ec(e);
                    while (q[b._mstHash])++b._mstHash;
                    q[b._mstHash] = b;
                    if (mc && !q.sourceFrame)
                        if (mc && E && E[b._mstHash]) {
                            var c = X(E[b._mstHash], I),
                                g = X(b, I);
                            if (c.split(/<b\d+/g).length != g.split(/<b\d+/g).length) {
                                if (a.debug);
                                return
                            }
                        } else {
                            if (a.debug);
                            return
                        } else var c = X(b, I); if (Kb(c)) {
                        Db += f.getStringByteCount(c);
                        Sb.push(b);
                        S.push(c)
                    }
                }
            }

            function Wb(a) {
                var b = m;
                if (a.length > 0)
                    if (a.length == 1 && a[0].nodeType == 1) b = a.pop();
                    else if (a[0].parentNode && a.length == a[0].parentNode.childNodes.length) {
                        b = a.pop().parentNode;
                        while (a.length > 0) a.pop()
                    } else {
                        b = a[0].ownerDocument.createElement(N);
                        b._mstChunk = n;
                        if (a[0].parentNode) a[0].parentNode.insertBefore(b, a[0]);
                        while (a.length > 0) b.appendChild(a.shift())
                    }
                return b
            }

            function yc(a) {
                var c = n;
                while (c) {
                    c = v;
                    if (a.length == 1 && !Z(a[0])) return;
                    if (a.length == 1 && a[0].nodeType == 1 && a[0].childNodes.length > 0) {
                        var e = a.pop();
                        for (var d = 0; d < e.childNodes.length; d++) a.push(e.childNodes[d]);
                        c = n
                    }
                    if (a.length > 0)
                        if (!Vb(a[0])) {
                            var b = a.shift();
                            if (b.nodeType == 3 && !b.nodeValue) b.parentNode.removeChild(b);
                            c = n
                        } else if (!Vb(a[a.length - 1])) {
                            var b = a.pop();
                            if (b.nodeType == 3 && !b.nodeValue) b.parentNode.removeChild(b);
                            c = n
                        }
                }
                if (a.length == 1 && !Vb(a[0])) a.pop()
            }

            function Kb(a) {
                return !!(a.match(/[a-zA-Z0-9\xC0-\uFFFF]/) || G && a.replace(/[\r\n\s]/g, x).length > 0)
            }

            function Vb(a) {
                if (!mb(a)) return n;
                var b = x;
                switch (a.nodeType) {
                    case 1:
                        b = a.innerText || a.textContent || x;
                        break;
                    case 3:
                        b = a.nodeValue || x
                }
                if (b.match(/^[\s\xA0]*$/)) return v;
                if (Kb(b)) return n;
                return v
            }

            function X(b, i, e) {
                e = e ? e : 1;
                if (e > 9) throw new Error(fc);
                var d = [],
                    f = 0,
                    m = 0;
                for (var c = 0; c < b.childNodes.length; ++c) switch (b.childNodes[c].nodeType) {
                    case 1:
                        var j = i + e.toString() + f.toString();
                        try {
                            var g = gc(b.childNodes[c])
                        } catch (k) {
                            if (a.debug);
                        }
                        if (g == s.Skip && b.childNodes[c].previousSibling && b.childNodes[c].previousSibling.nodeType == 1) b.childNodes[c].previousSibling._mstSkipNext = f;
                        else if (g == s.Skip && b.childNodes[c].nextSibling && b.childNodes[c].nextSibling.nodeType == 1) b.childNodes[c].nextSibling._mstSkipPrev = f;
                        else {
                            d.push("<");
                            d.push(j);
                            d.push(l);
                            if (g != s.Skip) d.push(X(b.childNodes[c], i, e + 1));
                            d.push("</");
                            d.push(j);
                            d.push(l)
                        }++f;
                        break;
                    case 3:
                        if (b.childNodes[c].nodeValue) {
                            var h = b.childNodes[c].nodeValue.replace(/[\s\xA0]+/g, jb);
                            if (h != b.childNodes[c].nodeValue) b.replaceChild(b.ownerDocument.createTextNode(h), b.childNodes[c]);
                            d.push(Kc(h))
                        }
                }
                return d.join(x)
            }

            function Y(a, f, i, b, c, g) {
                if (!g) g = 1;
                if (g > 9) throw new Error(fc);
                var j = [];
                for (var h = 0; h < a.childNodes.length; ++h) {
                    if (a.childNodes[h].parentNode != a) a.appendChild(a.childNodes[h--]);
                    if (a.childNodes[h].nodeType == 1) j.push(a.childNodes[h])
                }
                var e = 0,
                    d = 0;
                f.replace(new RegExp("<" + i + g + "(\\d+)>(.*)<\\/" + i + g + "\\1>", "gi"), function (l, q, o, k) {
                    while (b && b[0] <= k - e) {
                        var n = a.ownerDocument.createTextNode(Cb(f.substr(e, b[0])));
                        c[c.length - 1].push(n);
                        c.push([]);
                        a.insertBefore(n, d < a.childNodes.length ? a.childNodes[d] : m);
                        ++d;
                        e += b[0];
                        b.shift()
                    }
                    if (e < k) {
                        var n = a.ownerDocument.createTextNode(Cb(f.substr(e, k - e)));
                        if (b) {
                            c[c.length - 1].push(n);
                            b[0] -= k - e
                        }
                        a.insertBefore(n, d < a.childNodes.length ? a.childNodes[d] : m);
                        ++d;
                        e = k
                    }
                    var h = j[parseInt(q)];
                    if (h != a.childNodes[d]) a.insertBefore(h, a.childNodes[d]);
                    ++d;
                    if (typeof h._mstSkipPrev == vb) {
                        var s = j[h._mstSkipPrev];
                        a.insertBefore(s, h);
                        ++d;
                        if (b) c[c.length - 1].push(s);
                        h._mstSkipPrev = x
                    }
                    if (Z(h))
                        if (b)
                            if (b[0] < l.length) {
                                c.push([]);
                                b[0] -= 4 + q.length;
                                Y(h, o, i, b, c, g + 1);
                                b[0] -= 5 + q.length
                            } else {
                                c[c.length - 1].push(h);
                                Y(h, o, i, m, m, g + 1);
                                b[0] -= l.length
                            } else Y(h, o, i, m, m, g + 1);
                    else if (b) {
                        if (b[0] < l.length) c.push([h], []);
                        else c[c.length - 1].push(h);
                        for (var p = l.length; p > b[0]; b.shift()) p -= b[0];
                        b[0] -= p
                    }
                    if (typeof h._mstSkipNext == vb) {
                        var r = j[h._mstSkipNext];
                        a.insertBefore(r, h.nextSibling);
                        ++d;
                        if (b) c[c.length - 1].push(r);
                        h._mstSkipNext = x
                    }
                    e += l.length
                });
                while (b && b[0] <= f.length - e) {
                    var k = a.ownerDocument.createTextNode(Cb(f.substr(e, b[0])));
                    c[c.length - 1].push(k);
                    c.push([]);
                    a.insertBefore(k, d < a.childNodes.length ? a.childNodes[d] : m);
                    ++d;
                    e += b[0];
                    b.shift()
                }
                if (e < f.length) {
                    var k = a.ownerDocument.createTextNode(Cb(f.substr(e, f.length - e)));
                    a.insertBefore(k, d < a.childNodes.length ? a.childNodes[d] : m);
                    ++d;
                    if (b) {
                        c[c.length - 1].push(k);
                        b[0] -= f.length - e
                    }
                }
                while (d < a.childNodes.length) a.removeChild(a.childNodes[d]);
                if (c && c[c.length - 1].length) c.push([])
            }

            function Kc(b) {
                if (a.service == Ib && Default.Globals.PhraseAlignment) return b.replace(/[\s\xA0]/g, jb);
                else return b.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/[\s\xA0]/g, jb)
            }

            function Cb(b) {
                if (a.service == Ib && Default.Globals.PhraseAlignment) return b;
                else return b.replace(/<\w+>/g, x).replace(/<\/\w+>/g, x).replace(/&gt;/gi, l).replace(/&lt;/gi, "<").replace(/&amp;/gi, "&")
            }

            function Ec(a) {
                a = a.replace(/[\s\xA0]/g, x);
                var c = 0;
                for (var b = 0; b < a.length; ++b) c += a.charCodeAt(b) * 13 * (b + 7);
                return c
            }

            function xc() {
                var h = [],
                    c = [],
                    b = 0,
                    g = f.getStringByteCount(S[0]);
                if (yb.length > 0 && !fb) {
                    fb = n;
                    var i = yb.shift();
                    z = i.txt;
                    b = i.length;
                    kc = i.dom;
                    var e = z[0],
                        d = Math.floor(e.length * gb / b);
                    z = [e.substr(0, d), e];
                    while (f.getStringByteCount(z[0]) > gb && d > k) {
                        d = Math.floor(d / 2);
                        z = [e.substr(0, d), e]
                    }
                    cb = {
                        aTxt: [],
                        aSrcSnt: [],
                        aTgtSnt: []
                    };
                    Bb = new Date;
                    Eb = z[0].length;
                    sb = 1;
                    pb = a.serviceClient.TranslateArray(BFI_APPID, [z[0]], O, Q, a.category ? {
                        Category: a.category
                    } : m, jc, zb, nb);
                    window.Microsoft.Translator.APIRequests++;
                    return
                }
                do {
                    if (S.length == 0) break;
                    if (lb.length && lb[0].length < 32 && S[0].length > 32) lb = [];
                    lb.push(S[0].replace(/<[^>]*>/g, jb).replace(/[\s\xA0]+/g, jb));
                    Db -= g;
                    b += g;
                    ic += S[0].length;
                    h.push(Sb.shift());
                    c.push(S.shift());
                    g = S.length > 0 ? f.getStringByteCount(S[0]) : 0
                } while (Sb.length > 0 && b < gb && b + g + (c.length + 1) * f.getStringByteCount('"",') <= pc);
                if (b > pc && (!E || !q.sourceFrame)) {
                    yb.push({
                        dom: h,
                        txt: c,
                        length: b
                    });
                    B()
                } else if (b > 0 && (!E || !q.sourceFrame)) {
                    Bb = new Date;
                    Eb = b;
                    sb = c.length;
                    Nb[F] = function (a) {
                        return function (b) {
                            Jc(b, a)
                        }
                    }(F);
                    Pb[F] = function (a) {
                        return function (b) {
                            zb(b, a)
                        }
                    }(F);
                    w[F] = {
                        Dom: h,
                        Txt: c
                    };
                    w.size++;
                    if (a.service == Ib) pb = a.serviceClient.TranslateArray2(BFI_APPID, c, O, Q, a.category ? {
                        Category: a.category
                    } : m, Nb[F], Pb[F], nb);
                    else pb = a.serviceClient.TranslateArray(BFI_APPID, c, O, Q, a.category ? {
                        Category: a.category
                    } : m, Nb[F], Pb[F], nb);
                    F++;
                    window.Microsoft.Translator.APIRequests++;
                    Gc();
                    if (w.size < D)
                        if (G && J) B();
                        else setTimeout(function () {
                            B()
                        }, W)
                } else if (w.size < D)
                    if (G && J) B();
                    else setTimeout(function () {
                        B()
                    }, W)
            }

            function jc(b) {
                if (Fb) return;
                if (!fb) return;
                fb = v;
                window.Microsoft.Translator.APIResponses++;
                q.detectedLanguage = b && b[0] && b[0].From ? b[0].From.toLowerCase() : q.detectedLanguage;
                var o = b[0].TranslatedText,
                    g = b[0].OriginalTextSentenceLengths,
                    h = b[0].TranslatedTextSentenceLengths,
                    j = 0,
                    l = 0;
                if (!(o && g && h)) {
                    fb = n;
                    zb(b[0].Error);
                    return
                }
                Lb(b);
                for (var d = 0; d < (z.length > 1 ? Math.max(g.length - 2, 1) : g.length); ++d) {
                    cb.aTxt.push(o.substr(l, h[d]));
                    cb.aSrcSnt.push(g[d]);
                    cb.aTgtSnt.push(h[d]);
                    j += g[d];
                    l += h[d]
                }
                if (z.length > 1)
                    if (g.length < 1) B();
                    else {
                        var c = z[1].substr(j),
                            r = f.getStringByteCount(c),
                            e = Math.floor(c.length * gb / r);
                        z = e > gb ? [c.substr(0, e), c] : [c];
                        while (f.getStringByteCount(z[0]) > gb && e > k) {
                            e = Math.floor(e / 2);
                            z = [c.substr(0, e), c]
                        }
                        if (fb) return;
                        fb = n;
                        Bb = new Date;
                        Eb = z[0].length;
                        sb = 1;
                        pb = a.serviceClient.TranslateArray(BFI_APPID, [z[0]], O, Q, m, jc, zb, nb)
                    } else {
                    var i = kc.shift(),
                        s = tb || q.detectedLanguage;
                    if (!J && !G) {
                        bb = Ab(rb);
                        Tb(i)
                    }
                    try {
                        hc(i, X(i, I), cb.aTxt.join(x), cb.aSrcSnt, cb.aTgtSnt)
                    } catch (p) {
                        if (a.debug);
                    }
                    if (w.size < D)
                        if (G && J) B();
                        else setTimeout(function () {
                            B()
                        }, W)
                }
            }

            function Jc(c, b) {
                if (Fb) return;
                window.Microsoft.Translator.APIResponses++;
                if (w[b] && c.length != w[b].Dom.length) {
                    zb("Inconsistent Data", b);
                    return
                }
                Lb(c);
                q.detectedLanguage = c && c[0] && c[0].From ? c[0].From.toLowerCase() : q.detectedLanguage;
                var i = tb || q.detectedLanguage;
                if (!J && !G) {
                    bb = Ab(rb);
                    Tb(w[b].Dom)
                }
                var e = x;
                for (var f = w[b].Dom.shift(), g = w[b].Txt.shift(), d = c.shift(); f && d; f = w[b].Dom.shift(), (g = w[b].Txt.shift(), d = c.shift())) {
                    if (d.Alignment) {
                        if (e.length != 0) e += "|";
                        e += d.Alignment
                    }
                    try {
                        hc(f, g, d.TranslatedText, d.OriginalTextSentenceLengths, d.TranslatedTextSentenceLengths)
                    } catch (h) {
                        if (a.debug);
                    }
                }
                if (e.length != 0) qb.setAttribute("mstAlign", e);
                delete w[b];
                w.size--;
                if (w.size < D)
                    if (G && J) B();
                    else setTimeout(function () {
                        B()
                    }, W)
            }

            function Gc() {
                if (F > dc) {
                    D = 1;
                    W = 500
                } else if (D > 2 && F % ec == 0) {
                    D = D - parseInt(D / 3);
                    W += 10;
                    Mb(.1)
                }
            }

            function zb(c, b) {
                if (b) {
                    delete w[b];
                    w.size--
                }
                if (Fb) return;
                if (a.debug);
                window.Microsoft.Translator.APIResponses++;
                Lb(m);
                if (sc) sc(c);
                if (w.size < D) B()
            }

            function Lb(a) {
                var e = new Date,
                    b = e.getTime() - Bb.getTime();
                if (b > 13000) b = 13000;
                var c = 0;
                if (a)
                    for (var d = 0; d < a.length; ++d) c += a[d].OriginalTextSentenceLengths.length;
                else c = sb;
                U.push({
                    r: a ? "S" : "E",
                    c: Eb,
                    s: c,
                    e: sb,
                    l: b
                })
            }
            var hc = y.translateElement = function (b, k, j, h, i) {
                b._mstSrcHtml = b.innerHTML;
                if (b.nodeName.toLowerCase() == "option") {
                    Y(b, j, I, m, m);
                    return
                }
                var d, g = b._mstHash;
                if (q.sourceFrame) d = b.cloneNode(n);
                else {
                    d = b;
                    b = d.cloneNode(n)
                }
                var l = h ? h.slice(0) : [],
                    o = i ? i.slice(0) : [],
                    e = [
                        []
                    ],
                    f = [
                        []
                    ];
                try {
                    Y(b, k, I, l, e);
                    Y(d, j, I, o, f)
                } catch (p) {
                    if (a.debug);
                }
                if (e.length > 2 && f.length > 2) {
                    b._mstSrcHtml = b.innerHTML;
                    for (var c = 0; c < e.length && c < f.length; ++c) rc(Wb(e[c]), Wb(f[c]), g * (c + 1))
                } else rc(b, d, g); if (E && E[g] && !q.sourceFrame) E.translateElement(E[g], k, j, h, i)
            };

            function rc(b, c, d) {
                if (!(b && c)) return;
                var g = b.textContent || b.innerText || x,
                    h = c.textContent || c.innerText || x;
                if (!g.match(/[a-zA-Z0-9\xC0-\uFFFF]/) && !h.match(/[a-zA-Z0-9\xC0-\uFFFF]/)) return;
                b._mstHash = c._mstHash = d;
                if (Jb) c._mstSrcHtml = b.innerHTML;
                try {
                    b.setAttribute(H, O);
                    c.setAttribute(H, Q)
                } catch (e) {
                    if (a.debug);
                }
                b._mstNormalize = function () {
                    return X(b, I)
                };
                c._mstNormalize = function () {
                    return X(c, I)
                };
                c._mstDenormalize = function (d) {
                    var c = b.cloneNode(n);
                    c._mstNormalize = function () {
                        return X(c, I)
                    };
                    try {
                        Y(c, d, I)
                    } catch (e) {
                        if (a.debug);
                    }
                    return c
                };
                try {
                    if (q.sourceFrame) {
                        q[d] = b;
                        new ob(b, c, f.getBlockParent(b), Ab(Q), q, E)
                    } else {
                        q[d] = c;
                        new ob(c, b, f.getBlockParent(c), Ab(O || q.detectedLanguage), q, E)
                    }
                } catch (i) {}
                q.transItems.push({
                    src: b,
                    tgt: c
                })
            }

            function Rb(b) {
                if (!Jb) throw new Error("Untranslate feature was turned off, please consider modifying the parameter in the constructor!");
                if (b.nodeName.toLowerCase() == "frame" || b.nodeName.toLowerCase() == R) try {
                    Rb(b.contentWindow.document.documentElement)
                } catch (c) {
                    if (a.debug);
                } else {
                    if (b._mstStyle)
                        for (var e in b._mstStyle) try {
                            b.style[e] = b._mstStyle[e]
                        } catch (c) {
                            if (a.debug);
                        }
                    b._mstStyle = m;
                    if (b._mstSrcHtml) {
                        b.innerHTML = b._mstSrcHtml;
                        if (b._mstTooltip) b._mstTooltip.detach()
                    } else
                        for (var d = 0; d < b.childNodes.length; ++d) try {
                            Rb(b.childNodes[d])
                        } catch (c) {
                            if (a.debug);
                        }
                }
            }
            if (G && J) {
                B();
                if (toolbar) toolbar.show()
            } else {
                setTimeout(B, 0);
                if (toolbar) setTimeout(toolbar.show, 10)
            }
            return y
        }
        var nb = function () {
                function a(b, a) {
                    this.Name = b;
                    this.Code = a
                }
                return a
            }(),
            tb = function () {
                function a(b, a, c) {
                    this.SignIn = b;
                    this.SignOut = a;
                    this.Help = c
                }
                return a
            }(),
            sb = function () {
                var l = "object",
                    k = C,
                    n = "onComplete",
                    e = Q,
                    g = "string",
                    a = h,
                    d = i,
                    m = kb,
                    f = j;

                function c() {
                    var c = "UserName",
                        a = this;
                    a.languageNames = [];
                    a.langLocalized = f;
                    a.appId = window._mstConfig.appId;
                    a.unTranslateDelegate = f;
                    a.Links = new tb(window._mstConfig["SignIn"] ? window._mstConfig["SignIn"] : b, window._mstConfig["SignOut"] ? window._mstConfig["SignOut"] : b, "https://go.microsoft.com/?linkid=9722454");
                    a.UserName = window._mstConfig[c] ? window._mstConfig[c] : b;
                    a.languageCodes = [];
                    for (var d in window[m]) a.languageCodes[a.languageCodes.length] = d
                }
                c.prototype.Translate = function (g, h, c, e, b, a, f) {
                    this.TranslateElement(g, h, document.documentElement, c, e, b, a, f, false)
                };
                c.prototype.TranslateElement = function (u, m, i, r, h, q, o, l, c) {
                    var s = E,
                        b = this;
                    if (typeof i === s) i = document.documentElement;
                    if (typeof c === s) c = d;
                    b.validate(u, "from", a, g);
                    b.validate(m, "to", d, g);
                    if (!b.isElement(i) && !b.isNode(i)) throw new Error("Invalid DomElement");
                    b.validate(r, "onProgress", a, e);
                    b.validate(h, "onError", a, e);
                    b.validate(q, n, a, e);
                    b.validate(o, "onRestoreOriginal", a, e);
                    b.validate(l, "timeOut", a, k, d);
                    b.validate(c, "showFloater", a, "boolean");
                    var j = a;
                    b.lastToLanguage = m;
                    if (b.domTranslator != f && b.domTranslator.cancel) b.domTranslator.cancel();
                    if (c) B.Show(m);
                    var w = function () {
                            t(p);
                            j = d;
                            try {
                                if (c) B.TranslationComplete()
                            } catch (a) {
                                console.error(a)
                            }
                            try {
                                if (q) q()
                            } catch (a) {
                                console.error(a)
                            }
                        },
                        x = function (b) {
                            try {
                                if (c) B.TranslationError(b)
                            } catch (a) {
                                console.error(a)
                            }
                            try {
                                if (h) h(b)
                            } catch (a) {
                                console.error(a)
                            }
                        },
                        t = function (b) {
                            if (j) return;
                            if (b == p) j = d;
                            try {
                                if (c) B.TranslationProgress(b)
                            } catch (a) {
                                console.error(a)
                            }
                            try {
                                if (r) r(b)
                            } catch (a) {
                                console.error(a)
                            }
                        };
                    b.domTranslator = new qb(b.appId, i, u, m, w, h, l, a, a);
                    if (b.domTranslator.addProgressEvent) b.domTranslator.addProgressEvent(t);
                    if (o) b.unTranslateDelegate = o;
                    if (h && l) {
                        var v = b.domTranslator;
                        setTimeout(function () {
                            if (!j) {
                                h("Timout expired before translation could be finished");
                                if (v.cancel) v.cancel()
                            }
                        }, l)
                    }
                };
                c.prototype.validate = function (a, c, f, b, e) {
                    var d = " should be of type ";
                    if (f) {
                        if (!a) throw new Error(c + " is required");
                        if (typeof a != b) throw new Error(c + d + b);
                    } else if (a && typeof a != b) throw new Error(c + d + b);
                    if (b == k && e && a && a < 0) throw new Error(c + " should be a positive number");
                };
                c.prototype.isNode = function (a) {
                    return typeof Node === l ? a instanceof Node : a && typeof a === l && typeof a.nodeType === k && typeof a.nodeName === g
                };
                c.prototype.isElement = function (a) {
                    return typeof HTMLElement === l ? a instanceof HTMLElement : a && typeof a === l && a !== f && a.nodeType === 1 && typeof a.nodeName === g
                };
                c.prototype.RestoreOriginal = function () {
                    var a = this;
                    if (!a.domTranslator) throw new Error("Can not RestoreOriginal before making a translation");
                    if (a.domTranslator.cancel) a.domTranslator.cancel();
                    if (a.unTranslateDelegate) try {
                        a.unTranslateDelegate(a.lastToLanguage)
                    } catch (b) {
                        console.error(b)
                    }
                };
                c.prototype.GetLanguagesForTranslate = function (c, h, i, j) {
                    var b = this;
                    b.validate(c, "locale", d, g);
                    b.validate(h, n, d, e);
                    b.validate(i, "onError", a, e);
                    b.validate(j, "timeOut", a, k, d);
                    if (b.languageNames[c] != f) {
                        try {
                            h(b.languageNames[c])
                        } catch (l) {
                            console.error(l)
                        }
                        return
                    }


                    Microsoft.Translator.Widget.GetLanguageNamesCallBack(["Arabic","Bulgarian","Catalan","Chinese Simplified","Chinese Traditional","Czech","Danish","Dutch","English","Estonian","Finnish","French","German","Greek","Haitian Creole","Hebrew","Hindi","Hmong Daw","Hungarian","Indonesian","Italian","Japanese","Klingon","Korean","Latvian","Lithuanian","Malay","Maltese","Norwegian","Persian","Polish","Portuguese","Romanian","Russian","Slovak","Slovenian","Spanish","Swedish","Thai","Turkish","Ukrainian","Urdu","Vietnamese","Welsh"], c, h, i);
                    //Microsoft.Translator.GetLanguageNames(b.appId, c, b.languageCodes, function (a) {
                    //                                      Microsoft.Translator.Widget.GetLanguageNamesCallBack(a, c, h, i)
                    //                                      }, i, j)
                };
                c.prototype.GetLanguageNamesCallBack = function (b, e, g, d) {
                    if (!b || !b[0]) {
                        if (d) d("Invalid locale " + e);
                        return
                    }
                    var c = [];
                    for (var a = 0; a < b.length; a++) c[a] = new nb(b[a], this.languageCodes[a]);
                    this.languageNames[e] = c;
                    try {
                        g(c)
                    } catch (f) {
                        console.error(f)
                    }
                };
                c.prototype.GetLanguagesForTranslateLocalized = function () {
                    var a = this;
                    if (!a.langLocalized) {
                        a.langLocalized = [];
                        for (var b in window[m]) a.langLocalized[a.langLocalized.length] = new nb(window[m][b], b)
                    }
                    return a.langLocalized
                };
                c.prototype.GetAutoDetectedLanguage = function () {
                    if (!this.domTranslator || !this.domTranslator.detectedLanguage) throw new Error("Can not return auto detected language before making a translation with 'from' parameter set to null ");
                    return this.domTranslator.detectedLanguage
                };
                return c
            }();
        m.Widget = new sb;
        var ob = new function () {
                var c = h,
                    j = c,
                    n = 600,
                    l = 430,
                    p = "#0F0F5F",
                    m = "#F0F0A0",
                    r;
                return function (r, E, s, Q, z, u) {
                    var M = "mouseout",
                        L = "mouseover",
                        C = F,
                        B = i,
                        v = this;
                    if (r._mstTooltip) try {
                        r._mstTooltip.detach()
                    } catch (ab) {}
                    r._mstTooltip = E._mstTooltip = v;
                    if (!s) s = r;
                    var w = c,
                        D = c,
                        I = r.style.color,
                        H = r.style.backgroundColor,
                        h = r.ownerDocument,
                        R = v.hover = function (d) {
                            if (j) return;
                            if (z.showHighlight) {
                                var b = r.style.color;
                                try {
                                    b = "#" + y.parse(r.style.color).toString()
                                } catch (c) {}
                                if (b != p) I = r.style.color;
                                var a = r.style.backgroundColor;
                                try {
                                    a = "#" + y.parse(r.style.backgroundColor).toString()
                                } catch (c) {}
                                if (a != m) H = r.style.backgroundColor;
                                r.style.color = p;
                                r.style.backgroundColor = m
                            }
                            if (z.showTooltips && d) {
                                w = B;
                                setTimeout(P, n)
                            }
                            if (d && u && u[r._mstHash] && u[r._mstHash]._mstTooltip) u[r._mstHash]._mstTooltip.hover()
                        },
                        Z = v.unhover = function (a) {
                            if (j) return;
                            if (z.showHighlight) {
                                r.style.color = I;
                                r.style.backgroundColor = H
                            }
                            if (z.showTooltips && a) {
                                w = c;
                                setTimeout(N, n)
                            }
                            if (a && u && u[r._mstHash] && u[r._mstHash]._mstTooltip) u[r._mstHash]._mstTooltip.unhover()
                        };

                    function P() {
                        if (j) return;
                        if (w) fb()
                    }
                    var fb = v.show = function () {
                        var gb = bb,
                            I = g,
                            eb = "none 0px",
                            db = O,
                            ab = K,
                            F = "normal",
                            fb = "0px 0px 0px 0px",
                            y = x,
                            v = o;
                        if (D) return;
                        else D = B; if (!h._mstTooltip) {
                            var lb = a.baseURL.substr(0, 8) + a.baseURL.substr(8).replace(/\/.*$/, cb),
                                Z = c;
                            if (Y[a.locale] && hb[Y[a.locale]] && hb[Y[a.locale]] == v) Z = B;
                            h._mstTooltip = h.createElement(y);
                            h._mstTooltip.translate = c;
                            h._mstTooltip.setAttribute("translate", G);
                            h._mstTooltip.style.display = C;
                            h._mstTooltip.style.position = W;
                            h._mstTooltip.style.zIndex = X;
                            h._mstTooltip.style.margin = fb;
                            h._mstTooltip.style.border = "2px solid #D2D2D2";
                            h._mstTooltip.style.padding = fb;
                            h._mstTooltip.style.color = "#000000";
                            h._mstTooltip.style.backgroundColor = "#E6E6E6";
                            h._mstTooltip.style.fontFamily = "Arial, Helvetica, Sans-Serif";
                            h._mstTooltip.style.fontStyle = F;
                            h._mstTooltip.style.fontVariant = F;
                            h._mstTooltip.style.fontWeight = F;
                            h._mstTooltip.style.fontSize = "12px";
                            h._mstTooltip.style.lineHeight = F;
                            if (!Z) {
                                h._mstTooltip.style.direction = e;
                                h._mstTooltip.style.textAlign = A
                            } else {
                                h._mstTooltip.style.direction = v;
                                h._mstTooltip.style.textAlign = ab
                            }
                            var n = h.createElement(y);
                            if (!Z) n.style.styleFloat = n.style.cssFloat = ab;
                            else n.style.styleFloat = n.style.cssFloat = A;
                            var j = h.createElement("a");
                            j.href = a.lpURL;
                            j.target = "_blank";
                            j.style.display = db;
                            j.style.margin = "4px 4px 0px 4px";
                            j.style.border = eb;
                            j.style.cursor = J;
                            j.style.textDecoration = C;
                            var V = h.createElement(t);
                            // a.imagePath is no longer valid
                            V.src = a.imagePath + "binglogo_ctf.png";
                            V.style.border = eb;
                            // Don't add the link to Bing Translator to the popover
                            // j.appendChild(V);
                            n.appendChild(j);
                            h._mstTooltip.cl = h.createElement("a");
                            h._mstTooltip.cl.style.display = db;
                            h._mstTooltip.cl.style.cursor = J;
                            h._mstTooltip.cl.style.textDecoration = C;
                            h._mstTooltip.cl.style.verticalAlign = "top";
                            h._mstTooltip.cl.style.border = eb;
                            h._mstTooltip.cl.style.padding = S;
                            var ib = h.createElement(t);
                            // a.imagePath is no longer valid
                            // ib.src = a.imagePath + "tooltip_close.gif";
                            ib.src = "http://az577702.vo.msecnd.net/images/cancel.png"
                            h._mstTooltip.cl.appendChild(ib);
                            n.appendChild(h._mstTooltip.cl);
                            h._mstTooltip.appendChild(n);
                            var m = h.createElement(y);
                            m.style.margin = "4px 4px 8px 4px";
                            m.style.fontWeight = "bold";
                            m.style.fontFamily = "Segoe UI";
                            m.style.fontSize = "10px";
                            m.style.letterSpacing = "1px";
                            m.style.textTransform = "uppercase";
                            m.style.color = "#4D4D4D";
                            if (!z.sourceFrame) {
                                var u = "Original";
                                try {
                                    u = localizedOriginal[Y[a.locale || I] || I] || u
                                } catch (M) {}
                            } else {
                                var u = "Translation";
                                try {
                                    u = localizedTranslation[Y[a.locale || I] || I] || u
                                } catch (M) {}
                            }
                            m.appendChild(h.createTextNode(u));
                            h._mstTooltip.appendChild(m);
                            h._mstTooltip.cp = h.createElement(y);
                            h._mstTooltip.appendChild(h._mstTooltip.cp);
                            h._mstTooltip.cb = h.createElement("span");
                            h._mstTooltip.cb.style.display = db;
                            h._mstTooltip.cb.style.margin = "0px 4px 4px 4px";
                            h._mstTooltip.cb.style.fontFamily = "Arial";
                            h._mstTooltip.cb.style.fontSize = "12px";
                            h._mstTooltip.cb.style.color = "black";
                            h._mstTooltip.cp.appendChild(h._mstTooltip.cb);
                            h.body.appendChild(h._mstTooltip)
                        }
                        h._mstTooltip.cl.onclick = U;
                        h._mstTooltip.style.width = b;
                        h._mstTooltip.cb.style.whiteSpace = "nowrap";
                        h._mstTooltip.cb.innerHTML = b;
                        h._mstTooltip.cb.appendChild(h.createTextNode(E.innerText || E.textContent));
                        h._mstTooltip.style.display = T;
                        for (var jb in Q) try {
                            h._mstTooltip.cp.style[jb] = Q[jb]
                        } catch (M) {
                            if (a.debug);
                        }
                        h._mstTooltip.onmouseover = function () {
                            w = B;
                            R();
                            P()
                        };
                        h._mstTooltip.onmouseout = function () {
                            w = c;
                            setTimeout(N, k)
                        };
                        var H = Math.max(f.getVisibleWidth(h), k),
                            L = window.pageXOffset || h.documentElement.scrollLeft || h.body.scrollLeft,
                            kb = Math.max(h.documentElement.scrollWidth, h.body.scrollWidth);
                        if (Microsoft.TranslatorOverride && Microsoft.TranslatorOverride.showTooltip) try {
                            Microsoft.TranslatorOverride.showTooltip(E, r, h._mstTooltip);
                            l = 430
                        } catch (M) {}
                        var p = h._mstTooltip.cb.offsetWidth + 12;
                        if (p > s.offsetWidth) p = s.offsetWidth;
                        if (p > H - d) p = H - d;
                        if (p < l) p = l;
                        h._mstTooltip.style.width = p.toString() + q;
                        h._mstTooltip.cb.style.whiteSpace = b;
                        var i;
                        if (f.getStyleValue(r, gb) == v || f.getStyleValue(r, "text-align") == ab) i = f.absXPos(r) + r.offsetWidth - h._mstTooltip.offsetWidth;
                        else i = f.absXPos(r); if (i + h._mstTooltip.offsetWidth > f.absXPos(s) + s.offsetWidth) i = f.absXPos(s) + s.offsetWidth - h._mstTooltip.offsetWidth;
                        if (i < f.absXPos(s)) i = f.absXPos(s);
                        if (f.getStyleValue(r, gb) != v) {
                            if (i + h._mstTooltip.offsetWidth > H + L - 8) i = H + L - 8 - h._mstTooltip.offsetWidth;
                            if (i < L + 8) i = L + 8
                        }
                        h._mstTooltip.style.left = i + q;
                        h._mstTooltip.style.top = Math.max(f.absYPos(r) - (h._mstTooltip.offsetHeight + 8), 8) + q
                    };

                    function N() {
                        if (j) return;
                        if (!w) U()
                    }
                    var U = v.hide = function () {
                            V(c);
                            if (!D) return;
                            else D = c; if (z.showHighlight) {
                                r.style.color = I;
                                r.style.backgroundColor = H
                            }
                            if (h._mstTooltip) h._mstTooltip.style.display = C
                        },
                        V = v.setLock = function (a) {
                            j = a
                        },
                        gb = v.detach = function () {
                            f.removeEvent(r, L, db);
                            f.removeEvent(r, M, eb)
                        },
                        db = f.addEvent(r, L, R),
                        eb = f.addEvent(r, M, Z)
                }
            },
            ub = new function (xb) {
                var Gb = 1600,
                    Vb = "white",
                    Ab = "#E6E6E6",
                    Wb = bb,
                    wb = t,
                    kb = "span",
                    eb = x,
                    w = q,
                    s = b,
                    L = j,
                    g = F,
                    v = T,
                    vb = "hidden",
                    fb = O,
                    ec = "MSTCTransPanel",
                    E = i,
                    e = h,
                    mb = this,
                    qc = 0,
                    Ub, ub, Z, Pb, lb, y, yb, Db, Hb, Rb, P, hb, Nb, Jb, Ib, Fb, Eb, gc, Cb, gb, Mb, Kb, lc, jc, Qb, nb, sb, pb, rb, ob, Sb, dc, r, qb, cb, ic, Y, bc, B, tc, m = e,
                    Zb = E,
                    rc = 1e6,
                    Q, U = 0,
                    ac, tb;
                window._mstCmCb = function () {
                    a.appId = document.getElementById("MSTCAppIdToken").innerHTML;
                    cb = parseInt(document.getElementById("MSTCMaxRating").innerHTML);
                    ic = document.getElementById("MSTCImagePath").innerHTML;
                    Y = document.getElementById("MSTCAuthLang").innerHTML.toLowerCase();
                    bc = document.getElementById("MSTCDashboardUrl").href;
                    yb = document.getElementById("MSTCContent");
                    Db = document.getElementById("MSTCExpandLink");
                    Hb = document.getElementById("MSTCRootPanel");
                    Rb = document.getElementById("MSTCLoading");
                    P = document.getElementById("MSTCSubmitting");
                    hb = document.getElementById(ec);
                    Nb = document.getElementById("MSTCPrevNextPanel");
                    Jb = document.getElementById("MSTCPrevLink");
                    Ib = document.getElementById("MSTCNextLink");
                    Fb = document.getElementById("MSTCPrevCount");
                    Eb = document.getElementById("MSTCNextCount");
                    gc = document.getElementById("MSTCFooterPanel");
                    Cb = document.getElementById("MSTCDashboardLink");
                    Qb = document.getElementById("MSTCApprove");
                    nb = document.getElementById("MSTCApproveTooltip");
                    sb = document.getElementById("MSTCReject");
                    pb = document.getElementById("MSTCRejectTooltip");
                    rb = document.getElementById("MSTCRestore");
                    ob = document.getElementById("MSTCRestoreTooltip");
                    Sb = document.getElementById("MSTCUserID");
                    dc = document.getElementById("MSTCButtonPanel");
                    gb = document.getElementById("MSTCTransPanelError");
                    Mb = document.getElementById("MSTCTransPanelErrorMsg");
                    Kb = document.getElementById("MSTCOKImgBtn");
                    lc = document.getElementById("MSTCHelpImgBtn");
                    if (Kb) Kb.onclick = Bb;
                    if (f.isInternetExplorer() && f.isQuirksMode(document)) f.fixIEQuirks(y);
                    Jb.onclick = function () {
                        Ob(-3);
                        return e
                    };
                    Ib.onclick = function () {
                        Ob(3);
                        return e
                    };
                    if (Cb)
                        if (Zb) {
                            Cb.onclick = cc;
                            var b = document.getElementById("MSTTDashboardLink");
                            if (b) {
                                b.parentNode.style.display = fb;
                                b.onclick = cc;
                                b.href = "javascript: " + b.title
                            }
                        } else Cb.style.visibility = vb;
                    if (!window.Microsoft) window.Microsoft = {};
                    window.Microsoft.TranslatorOverride = {
                        showTooltip: hc,
                        hideTooltip: ib
                    };
                    if (cb >= 5) window.Microsoft.TranslatorOverride.showHighlight = fc
                };
                var hc = mb.showTooltip = function (a, b, c) {
                        if (!y || y.ownerDocument != c.ownerDocument) return;
                        B = a._mstTooltip;
                        ub = a.getAttribute(H);
                        Z = b.getAttribute(H);
                        Pb = a;
                        lb = b;
                        m = e;
                        Db.onclick = Yb;
                        y.style.display = v;
                        Hb.style.display = g;
                        hb.style.display = g;
                        Bb();
                        c.appendChild(y)
                    },
                    Yb = mb.showTranslations = function () {
                        Db.onclick = Xb;
                        Hb.style.display = v;
                        Rb.style.display = v;
                        hb.style.display = g;
                        Bb();
                        Nb.style.display = g;
                        a.serviceClient.GetTranslations(a.appId, Pb._mstNormalize(), ub, Z, 24, a.category ? {
                            Category: a.category
                        } : L, mc, nc, n);
                        return e
                    };

                function mc(b) {
                    Rb.style.display = g;
                    hb.innerHTML = s;
                    hb.style.display = v;
                    if (b.Translations.length > 3) Nb.style.display = v;
                    var q = cb >= 5 && cb >= Math.abs(b.Translations[0].Rating) && (!Y || Y == Z.toLowerCase()),
                        k = b.Translations.length > 0 && b.Translations[0].Rating >= 5,
                        r = !b.NoEdit && b.Translations.length == 1,
                        o = b.Reject,
                        f, l = b.Translations.length;
                    for (f = 0; f < l; f++)
                        if (b.Translations[f].Rating == 5) break;
                    if (f != l) {
                        var m = b.Translations[f].TranslatedText;
                        for (var d = 0; d < b.Translations.length; d++) {
                            if (d == f) continue;
                            if (m == b.Translations[d].TranslatedText) {
                                if (d < f) f--;
                                b.Translations.splice(d, 1);
                                d--
                            }
                        }
                    }
                    var h = c,
                        j = c;
                    for (var d = 0; d < b.Translations.length; ++d) {
                        if (h == c && b.Translations[d].Rating < 5) h = d;
                        if (h != c && b.Translations[d].Rating > -5) j = d
                    }
                    if (h >= 0 && j > h)
                        for (var d = h; d < j; ++d)
                            for (var i = d + 1; i <= j; ++i)
                                if (b.Translations[d].Count < b.Translations[i].Count) {
                                    var t = b.Translations[d];
                                    b.Translations[d] = b.Translations[i];
                                    b.Translations[i] = t
                                }
                    Q = [];
                    while (b.Translations.length > 0) {
                        var n = b.Translations.shift();
                        try {
                            Q.push(new pc(n, hb, q, k, r, o))
                        } catch (p) {
                            if (a.debug);
                            continue
                        }
                        if (k) k = e
                    }
                    if (b.Hover && Q.length && Q[0].hover) Q[0].hover();
                    U = 0;
                    Ob();
                    if (document._mstTooltip && (document._mstTooltip.style.display == g || y.style.display == g)) ib();
                    return Q.slice(0)
                }

                function oc(a, b) {
                    Mb.textContent = Mb.innerText = b;
                    gb.style.width = a.offsetWidth - 20 + w;
                    gb.style.height = a.offsetHeight + w;
                    gb.style.left = a.offsetLeft + w;
                    gb.style.top = a.offsetTop + w;
                    gb.style.display = s
                }

                function Bb() {
                    gb.style.display = g
                }

                function nc() {
                    if (a.debug);
                    Xb()
                }

                function Xb() {
                    m = e;
                    B.setLock(e);
                    Db.onclick = Yb;
                    y.style.display = v;
                    Hb.style.display = g;
                    hb.style.display = g;
                    Bb();
                    return e
                }

                function Ob(b) {
                    if (m) return e;
                    if (!b) U = 0;
                    else U += b; if (U < 0) U = 0;
                    else if (U >= Q.length) U -= 3;
                    B.setLock(E);
                    for (var a = 0; a < Q.length; ++a)
                        if (a >= U && a < U + 3) Q[a].panel.style.display = v;
                        else Q[a].panel.style.display = g;
                    var d = U,
                        c = Math.max(Q.length - (U + 3), 0);
                    Fb.innerHTML = "(" + d.toString() + ")";
                    Eb.innerHTML = "(" + c.toString() + ")";
                    if (d > 0) {
                        Jb.style.color = "#59F";
                        Fb.style.display = s
                    } else {
                        Jb.style.color = "#999";
                        Fb.style.display = g
                    } if (c > 0) {
                        Ib.style.color = "#59F";
                        Eb.style.display = s
                    } else {
                        Ib.style.color = "#999";
                        Eb.style.display = g
                    }
                    setTimeout(function () {
                        B.setLock(e)
                    }, 500)
                }

                function pc(d, Bb, tb, xb, qb, R) {
                    var gb = "MSTCCancelButton",
                        db = "MSTCSubmitButton",
                        U = "MSTCReportButton",
                        bb = "MSTCSelectButton",
                        ab = "MSTCEditButton",
                        X = "4px 1px 0px 3px",
                        W = "4px 3px 0px 1px",
                        T = "ctfbadge.gif",
                        K = this,
                        b = K.panel = document.createElement(eb);
                    b.className = ec;
                    Bb.appendChild(b);
                    d.OriginalText = Pb._mstNormalize();
                    var hb = lb._mstDenormalize(d.TranslatedText),
                        k = document.createElement(eb);
                    k.className = "MSTCTransBox";
                    if (xb) k.style.color = "#009345";
                    k.appendChild(document.createTextNode(hb.innerText || hb.textContent));
                    b.appendChild(k);
                    var r = document.createElement(eb);
                    r.className = "MSTCStatsTab";
                    b.insertBefore(r, b.firstChild);
                    var A = document.createElement(eb);
                    A.className = "MSTCVoteCount";
                    r.appendChild(A);
                    if (d.Rating > 5) {
                        var G = document.createElement(kb),
                            M = document.createElement(wb);
                        M.src = a.imagePath + T;
                        M.style.margin = "4px 5px 0px 5px";
                        G.appendChild(M);
                        A.appendChild(G);
                        if (d.Rating >= 10) G.style.backgroundColor = "#F2C341";
                        else if (d.Rating >= 8) G.style.backgroundColor = "#B2B2B2";
                        else if (d.Rating >= 6) G.style.backgroundColor = "#8C7853"
                    } else if (d.Rating == 5) {
                        var mb = document.createElement(kb),
                            x = document.createElement(wb);
                        x.src = a.imagePath + "ctfmt.gif";
                        x.style.margin = "2px 2px 0px 3px";
                        mb.appendChild(x);
                        A.appendChild(mb)
                    } else if (d.Count) {
                        var Q = document.createElement(kb),
                            F = document.createElement(N);
                        F.style.display = fb;
                        F.appendChild(document.createTextNode(d.Count));
                        Q.appendChild(F);
                        var x = document.createElement(wb);
                        x.src = a.imagePath + "ctfvotes.gif";
                        Q.appendChild(x);
                        A.appendChild(Q);
                        if (f.getStyleValue(yb, Wb) == o) {
                            F.style.margin = W;
                            x.style.margin = "7px 1px 0px 3px"
                        } else {
                            F.style.margin = X;
                            x.style.margin = "3px 3px 0px 1px"
                        }
                    } else r.parentNode.removeChild(r); if (d.Flags) {
                        var H = document.createElement(eb);
                        H.className = "MSTCFlagCount";
                        H.style.marginTop = "2px";
                        r.appendChild(H);
                        var J = document.createElement(kb);
                        J.style.width = J.style.minWidth = "1px";
                        J.style.height = "19px";
                        H.appendChild(J);
                        var O = document.createElement(kb),
                            D = document.createElement(N);
                        D.style.display = fb;
                        D.appendChild(document.createTextNode(d.Flags));
                        O.appendChild(D);
                        var I = document.createElement(wb);
                        I.src = a.imagePath + "ctfflags.gif";
                        O.appendChild(I);
                        H.appendChild(O);
                        if (f.getStyleValue(yb, Wb) == o) {
                            D.style.margin = W;
                            I.style.margin = "7px 1px 0px 2px"
                        } else {
                            D.style.margin = X;
                            I.style.margin = "7px 2px 0px 1px"
                        }
                    }
                    r.style.marginTop = (b.offsetHeight - r.offsetHeight) / 2 + w;
                    var c = dc.cloneNode(E);
                    c.style.visibility = vb;
                    b.insertBefore(c, b.firstChild);
                    if (tb) {
                        var j = new V(C(c, ab)),
                            i = new V(C(c, bb), Qb.innerText || Qb.textContent, nb.innerText || nb.textContent);
                        if (d.Rating > -5) var h = new V(C(c, U), sb.innerText || sb.textContent, pb.innerText || pb.textContent);
                        else {
                            var h = new V(C(c, U), rb.innerText || rb.textContent, ob.innerText || ob.textContent);
                            k.style.color = "#A6A6A6"
                        }
                        var t = new V(C(c, db), L, nb.innerText || nb.textContent),
                            q = new V(C(c, gb));
                        i.setIcon(T);
                        t.setIcon(T)
                    } else var j = new V(C(c, ab)),
                        i = new V(C(c, bb), L, L, d.Count),
                        h = new V(C(c, U)),
                        t = new V(C(c, db)),
                        q = new V(C(c, gb));
                    var u, l, y;
                    if (!R) {
                        i.hover();
                        j.collapse();
                        h.collapse()
                    } else {
                        i.collapse();
                        j.collapse();
                        h.hover()
                    }
                    K.hover = b.onmouseover = function () {
                        if (m) return;
                        b.className = b.className + " MSTCTransPanelHover";
                        r.style.visibility = vb;
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        c.style.visibility = z
                    };
                    K.unhover = b.onmouseout = function () {
                        if (m) return;
                        b.className = b.className.replace(/\s+/g, " ").replace(/MSTCTransPanelHover/g, s);
                        r.style.visibility = z;
                        c.style.visibility = vb
                    };
                    c.onmouseover = function () {
                        if (m) return;
                        j.expand();
                        i.expand();
                        h.expand()
                    };
                    c.onmouseout = function () {
                        if (m) return;
                        if (!R) {
                            i.hover();
                            j.collapse();
                            h.collapse()
                        } else {
                            i.collapse();
                            j.collapse();
                            h.hover()
                        }
                    };
                    j.setCallback(function () {
                        if (m) return e;
                        m = E;
                        B.setLock(E);
                        if (!l) {
                            u = document.createElement(eb);
                            u.style.padding = "14px 4px 14px 4px";
                            l = document.createElement("textarea");
                            l.className = "MSTCTransEdit";
                            l.style.width = (b.offsetWidth - 116).toString() + w;
                            l.style.height = (b.offsetHeight - 38).toString() + w;
                            l.style.padding = S;
                            l.onkeypress = function (a) {
                                a = a || window.event;
                                if (a.keyCode == 13) {
                                    t.doCallback();
                                    return e
                                } else if (a.keyCode == 27) {
                                    q.doCallback();
                                    return e
                                }
                            };
                            u.appendChild(l);
                            b.appendChild(u)
                        }
                        k.style.display = g;
                        u.style.display = v;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.show();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        l.value = kc(d.TranslatedText);
                        l.focus();
                        l.select();
                        return e
                    });
                    j.setHover(function () {
                        i.unhover();
                        h.unhover()
                    });
                    i.setCallback(function () {
                        if (m) return e;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.hide();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        b.style.backgroundColor = Ab;
                        k.style.display = g;
                        b.appendChild(P);
                        P.style.display = v;
                        m = E;
                        B.setLock(E);
                        y = setTimeout(function () {
                            m = e;
                            ib();
                            b.removeChild(P);
                            b.style.backgroundColor = s;
                            k.style.display = v;
                            b.onmouseout();
                            j.show();
                            i.show();
                            h.show();
                            t.hide();
                            q.hide();
                            var c = cb;
                            if (Y && Y != Z.toLowerCase()) c = 2;
                            var o = Tb(),
                                f = jb(d.OriginalText),
                                g = jb(d.TranslatedText);
                            a.serviceClient.AddTranslation(a.appId, f, g, ub, Z, c, L, a.category ? a.category : L, zb(), o, function () {}, function () {}, n);
                            if (d.Callback) d.Callback(c);
                            try {
                                lb.innerHTML = lb._mstDenormalize(d.TranslatedText).innerHTML
                            } catch (l) {}
                        }, 1e3);
                        return e
                    });
                    i.setHover(function () {
                        j.unhover();
                        h.unhover()
                    });
                    h.setCallback(function () {
                        if (m) return e;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.hide();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        b.style.backgroundColor = Ab;
                        k.style.display = g;
                        b.appendChild(P);
                        P.style.display = v;
                        m = E;
                        B.setLock(E);
                        y = setTimeout(function () {
                            m = e;
                            B.setLock(e);
                            b.removeChild(P);
                            k.style.display = v;
                            P.style.display = g;
                            r.style.display = g;
                            q.hide();
                            var l = zb();
                            if (cb >= 5 && (!Y || Y == Z.toLowerCase())) l = "authuser";
                            var f = cb;
                            if (Y && Y != Z.toLowerCase()) f = 2;
                            else if (d.Rating < -5) f = 0;
                            var t = Tb(),
                                o = jb(d.OriginalText),
                                p = jb(d.TranslatedText);
                            a.serviceClient.AddTranslation(a.appId, o, p, ub, Z, -f, L, a.category ? a.category : L, l, t, function () {}, function () {}, n);
                            if (d.Callback) d.Callback(f);
                            if (f > 5 || f == 0) {
                                d.Rating = -f;
                                j.show();
                                i.show();
                                h.show();
                                c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                                if (f == 0) {
                                    h.setLabel(sb.innerText || sb.textContent, pb.innerText || pb.textContent);
                                    k.style.color = s
                                } else {
                                    h.setLabel(rb.innerText || rb.textContent, ob.innerText || ob.textContent);
                                    k.style.color = "#A6A6A6"
                                }
                                b.style.backgroundColor = s
                            }
                        }, 1e3);
                        return e
                    });
                    h.setHover(function () {
                        j.unhover();
                        i.unhover()
                    });
                    t.setCallback(function () {
                        if (!l.value) return;
                        if (!l.value.replace(/\s/g, s)) return;
                        k.style.display = v;
                        u.style.display = g;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.hide();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        b.style.backgroundColor = Ab;
                        k.style.display = g;
                        b.appendChild(P);
                        P.style.display = v;
                        m = E;
                        B.setLock(E);
                        y = setTimeout(function () {
                            var c = cb;
                            if (Y && Y != Z.toLowerCase()) c = 2;
                            var p = Tb(),
                                f = jb(d.OriginalText),
                                o = jb(l.value);
                            a.serviceClient.AddTranslation(a.appId, f, o, ub, Z, c, L, a.category ? a.category : L, zb(), p, function () {
                                m = e;
                                ib();
                                b.removeChild(P);
                                b.style.backgroundColor = s;
                                k.style.display = v;
                                b.onmouseout();
                                j.show();
                                i.show();
                                h.show();
                                t.hide();
                                q.hide();
                                if (d.Callback) d.Callback(c);
                                try {
                                    lb.innerHTML = lb._mstDenormalize(jb(l.value)).innerHTML
                                } catch (a) {
                                    alert("The translation could not be displayed.  Please try again later.")
                                }
                            }, function (a) {
                                q.hide();
                                if (a.indexOf("InvalidRequest_MismatchedTags") >= 0) {
                                    oc(b, "The translation could not be added. Please check that the tags are preserved and try again.");
                                    b.style.backgroundColor = s;
                                    k.style.display = s;
                                    P.style.display = g;
                                    m = e;
                                    j.doCallback()
                                } else {
                                    alert("The translation could not be added.  Please try again later.");
                                    ib()
                                }
                            }, n)
                        }, 1e3);
                        return e
                    });
                    q.setCallback(function () {
                        if (y) {
                            clearTimeout(y);
                            y = L
                        }
                        b.style.backgroundColor = s;
                        k.style.display = v;
                        if (u) u.style.display = g;
                        P.style.display = g;
                        j.show();
                        i.show();
                        h.show();
                        t.hide();
                        q.hide();
                        try {
                            b.removeChild(P)
                        } catch (a) {}
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        setTimeout(function () {
                            m = e;
                            B.setLock(e);
                            if (qb) ib()
                        }, p);
                        return e
                    });
                    if (!R) {
                        b.title = i.tooltip;
                        b.onclick = function () {
                            i.doCallback();
                            return e
                        }
                    } else {
                        b.title = h.tooltip;
                        b.onclick = function () {
                            h.doCallback();
                            return e
                        }
                    } if (qb) {
                        b.onmouseover();
                        j.doCallback()
                    }
                    return K
                }

                function V(z, y, w, l) {
                    var d = this,
                        a = z,
                        n = C(a, "MSTCButtonIcon"),
                        j = C(a, "MSTCVoteCountSelect"),
                        i = C(a, "MSTCButtonImg"),
                        b = C(a, "MSTCButtonLabel"),
                        x = f.getStyleValue(b, "color"),
                        p = f.getStyleValue(b, "backgroundColor"),
                        k = i.src.match(/^(.*)(\.[^\.]*)$/)[1],
                        t = f.getStyleValue(yb, Wb) == o ? "borderRightColor" : "borderLeftColor",
                        q, u, r, h = e;
                    if (y) {
                        b.innerHTML = s;
                        b.appendChild(document.createTextNode(y))
                    }
                    if (w) a.title = w;
                    if (l)
                        if (l.toString().length <= 2) j.appendChild(document.createTextNode(l));
                        else {
                            j.title = l;
                            j.appendChild(document.createTextNode(l.toString().substr(0, 1) + "x"))
                        }
                    d.tooltip = a.title;
                    b.style[t] = Vb;
                    var m = document.createElement(kb);
                    m.style.display = fb;
                    m.style.width = "1px";
                    m.style.height = "19px";
                    m.style.backgroundColor = p;
                    a.insertBefore(m, a.firstChild);
                    d.setIcon = function (a) {
                        k = i.src.match(/^(.*\/)([^\/]*)$/)[1] + a.match(/^(.*)(\.[^\.]*)$/)[1];
                        i.src = k + ".gif"
                    };
                    d.setCallback = function (b) {
                        q = a.onclick = b
                    };
                    d.doCallback = function () {
                        if (q && !h) {
                            h = E;
                            q();
                            h = e
                        }
                    };
                    d.hover = a.onmouseover = function () {
                        n.style.color = b.style.color = p;
                        n.style.backgroundColor = b.style.backgroundColor = x;
                        b.style[t] = s;
                        i.src = k + "_h.gif";
                        if (k.indexOf(I) > c) {
                            i.style.marginLeft = "-3px";
                            i.style.marginTop = "2px"
                        }
                        if (j) j.style.display = fb;
                        if (u && !h) {
                            h = E;
                            u();
                            h = e
                        }
                    };
                    d.unhover = a.onmouseout = function () {
                        n.style.color = b.style.color = x;
                        n.style.backgroundColor = b.style.backgroundColor = p;
                        b.style[t] = Vb;
                        i.src = k + ".gif";
                        if (k.indexOf(I) > c) {
                            i.style.marginLeft = D;
                            i.style.marginTop = D
                        }
                        if (j) j.style.display = g;
                        if (r && !h) {
                            h = E;
                            r();
                            h = e
                        }
                    };
                    d.setHover = function (a) {
                        u = a
                    };
                    d.setUnhover = function (a) {
                        r = a
                    };
                    d.show = function () {
                        a.style.display = v
                    };
                    d.hide = function () {
                        a.style.display = g
                    };
                    d.expand = function () {
                        b.style.display = s
                    };
                    d.collapse = function () {
                        b.style.display = g
                    };
                    d.setLabel = function (d, c) {
                        if (d) {
                            b.innerHTML = s;
                            b.appendChild(document.createTextNode(d))
                        }
                        if (c) a.title = c;
                        this.tooltip = a.title
                    }
                }
                var ib = mb.hideTooltip = function () {
                    m = e;
                    y.style.display = g;
                    if (B) B.hide();
                    if (r && r.parentNode == document.body) try {
                        document.body.removeChild(r)
                    } catch (a) {}
                };

                function C(b, g, e) {
                    if (!e) e = 0;
                    if (e > 40) return L;
                    var d;
                    for (var a = 0; a < b.childNodes.length; ++a) {
                        var f = b.childNodes[a];
                        if (f.className && f.className.indexOf(g) > c) d = b.childNodes[a];
                        else if (b.childNodes[a].nodeType == 1 && b.childNodes[a].childNodes) d = C(b.childNodes[a], g, e + 1);
                        if (d) break
                    }
                    return d
                }
                var cc = mb.showDashboard = function () {
                    var i = W;
                    ib();
                    if (B) B.setLock(E);
                    r = document.createElement(eb);
                    r.style.position = i;
                    r.style.zIndex = X;
                    r.style.width = "97%";
                    r.style.margin = "44px 8px";
                    r.style.borderRight = r.style.borderBottom = "solid 0px black";
                    r.style.backgroundColor = Vb;
                    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || k;
                    if (h < k) h = k;
                    h -= 60;
                    var g = document.createElement(R);
                    g.style.width = "100%";
                    g.style.height = h.toString() + w;
                    g.src = 'javascript:document.write("Loading...")';
                    r.appendChild(g);
                    var b = document.createElement("a");
                    try {
                        f.applyProtectiveCss(b)
                    } catch (j) {
                        if (a.debug);
                    }
                    b.style.display = fb;
                    b.style.position = i;
                    b.style.styleFloat = K;
                    b.style.top = "4px";
                    b.style.cursor = J;
                    b.title = "Close dashboard";
                    var d = document.createElement(kb);
                    d.style.display = fb;
                    d.style.width = "28px";
                    d.style.height = "28px";
                    d.style.marginRight = "16px";
                    b.appendChild(d);
                    var c = document.createElement(wb);
                    try {
                        f.applyProtectiveCss(c)
                    } catch (j) {
                        if (a.debug);
                    }
                    c.src = a.imagePath + "ctfdashboardclose.gif";
                    c.style.display = fb;
                    c.style.marginTop = "8px";
                    c.style.marginLeft = "8px";
                    c.style.border = D;
                    d.appendChild(c);
                    b.onclick = function () {
                        if (B) B.setLock(e);
                        document.body.removeChild(r)
                    };
                    r.appendChild(b);
                    r.style.height = h.toString() + w;
                    r.style.overflow = vb;
                    r.style.textAlign = A;
                    window.scrollTo(0, 0);
                    document.body.insertBefore(r, document.body.firstChild);
                    setTimeout(function () {
                        b.style.right = "4px";
                        if (!f.isInternetExplorer()) b.style.left = (r.offsetWidth - b.offsetWidth).toString() + w;
                        var c = encodeURIComponent(location.href);
                        if (c.lenght > Gb) c = c.substr(0, Gb);
                        var d = bc + "?siteData=" + qb + "&url=" + c + "&from=" + encodeURIComponent(a.from) + "&to=" + encodeURIComponent(a.to) + "&category=" + encodeURIComponent(a.category) + "&usr=" + encodeURIComponent(zb());
                        g.src = d
                    }, 0);
                    return e
                };

                function kc(a) {
                    return a.replace(/<([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "<tag" + a + l
                    }).replace(/<\/([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "</tag" + a + l
                    })
                }

                function jb(a) {
                    return a.replace(/<([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "<b" + a + l
                    }).replace(/<\/([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "</b" + a + l
                    })
                }

                function Tb() {
                    var c = document.location.href;
                    if (document.location.href.indexOf(a.rootURL) == 0) {
                        var b = document.location.href.match(/url=([^&]+)/);
                        if (b) c = decodeURIComponent(b[1])
                    }
                    return c
                }
                var ab = 0;

                function fc(a, b, c) {
                    if (!a.transItems || !a.transItems.length) return;
                    ab = 0;
                    Lb(a, b, c)
                }

                function Lb(b, g, h) {
                    if (ab >= b.transItems.length) return;
                    var c = [],
                        e = 0;
                    for (var d = ab; d < b.transItems.length && e < Gb && d - ab < 10; ++d) {
                        var i = b.transItems[d].src._mstNormalize();
                        e += f.getStringByteCount(i);
                        c.push(i)
                    }
                    if (e >= Gb) c.pop();
                    a.serviceClient.GetTranslationsArray(a.appId, c, g, h, 3, a.category ? {
                        Category: a.category
                    } : L, function (d) {
                        for (var a = 0; a < d.length; ++a)
                            if (d[a].Translations.length > 1)
                                if (d[a].Translations[0].Rating > 5) b.transItems[ab + a].tgt.style.backgroundColor = Ab;
                                else if (d[a].Translations[1].Count < 0) b.transItems[ab + a].tgt.style.backgroundColor = "#E5917F";
                                else b.transItems[ab + a].tgt.style.backgroundColor = "#B9E4FC";
                        ab += c.length;
                        Lb(b, g, h)
                    }, function () {
                        ab += c.length > 1 ? c.length : 1;
                        Lb(b, g, h)
                    }, n)
                }
                var sc = mb.forceLoad = function () {
                    if (tb) tb()
                };

                function zb() {
                    var a = Sb.innerText || Sb.textContent;
                    if (!a) {
                        var b = document.cookie.match(/mstcid=([^;]+)/i);
                        if (b) a = b[1];
                        else {
                            a = Math.floor(Math.random() * 1e9).toString(d);
                            document.cookie = "mstcid=" + a + "; expires=Sun, 01-Jan-2040 01:01:01 GMT; path=" + ((location.host.indexOf("bing") > c && location.pathname.indexOf("/translator")) > c ? location.pathname : u)
                        }
                    }
                    return a
                }
                new function () {
                    var b, c;
                    b = xb.match(/siteData=([^&]*)/);
                    if (b) qb = b[1];
                    Ub = a.locale;
                    b = xb.match(/loc=([^&]+)/);
                    if (b) Ub = b[1];
                    b = xb.match(/ctfLanguages=([^&]*)/);
                    if (b) c = b[1];
                    b = xb.match(/showDashboard=([^&]*)/);
                    if (b && (b[1].toLowerCase() == M || b[1].toLowerCase() == G)) Zb = e;
                    if (c) {
                        ac = {};
                        var h = c.split(",");
                        for (var d = 0; d < h.length; ++d) ac[h[d].toLowerCase()] = 1
                    }
                    if (qb) tb = function () {
                        var b = "MicrosoftTranslatorCommunity";
                        if (!tb) return;
                        tb = L;
                        y = document.getElementById(b);
                        if (y) y.parentNode.removeChild(y);
                        y = document.createElement(eb);
                        y.id = b;
                        y.style.display = g;
                        document.body.insertBefore(y, document.body.firstChild);
                        var c = s;
                        if (f.isInternetExplorer() && f.isQuirksMode(document)) c = "&inrt=1";
                        jc = db("/ajax/v3/community.aspx?fmt=js&loc=" + Ub + c + "&siteData=" + qb, a.rootURL)
                    };
                    if (a.tokRef) {
                        window._mstRefTok = function (b) {
                            a.appId = b
                        };
                        setInterval(function () {
                            if (_eTokenScript) _eTokenScript.parentNode.removeChild(_eTokenScript);
                            _eTokenScript = db("/ajax/v3/community.aspx?reftok=1&siteData=" + qb, a.rootURL)
                        }, a.tokRef * 1e3)
                    }
                };
                a.serviceClient.Community = mb
            }(a.baseURL),
            B;
        (function (l) {
            var eb = "dragging",
                cb = "__mstto=",
                u = "value",
                B = "{0}",
                Y = "style",
                f = "LanguageMenu",
                t = T,
                bb = "title",
                o = F,
                Z = U,
                ab = "href",
                m = i,
                d = h,
                x = j,
                v = {},
                N, e, s = x,
                w = x,
                D = d,
                H, k, J, V, S, R, r, W, X, nb = d,
                lb = m,
                C = d,
                G = m,
                kb = d,
                mb = d,
                Q;

            function vb(u, i, e) {
                var g = "_bwmid",
                    p = "Microsoft.Translator.OnMouseOverFloater()",
                    n = "onmouseover",
                    a = "SignOutSpan",
                    f = "SignInSpan",
                    l = E;
                if (typeof i === l) i = "true";
                if (typeof e === l) e = b;
                H = Util.GetElement("WidgetFloater");
                k = Util.GetElement(gb);
                J = Util.GetElement("WidgetFloaterCollapsed");
                V = Util.GetElement("FloaterSharePanel");
                S = Util.GetElement("FloaterEmbed");
                R = Util.GetElement("FloaterProgressBar");
                Q = e == b;
                s = e;
                //var h = document.createElement("link");
                //h.setAttribute(ab, window[Z].floaterStylePath);
                //h.setAttribute("rel", "stylesheet");
                var q = document.getElementsByTagName(P)[0];
                //q.insertBefore(h, q.firstChild);
                Util.GetElement("HelpLink").setAttribute(ab, Microsoft.Translator.Widget.Links.Help);
                if (Util.GetElement("CTFAuthPanel")) {
                    Util.GetElement(f).style.display = o;
                    Util.GetElement(a).style.display = o;
                    if (Microsoft.Translator.Widget.Links.SignIn) {
                        Util.GetElement(f).innerHTML = Microsoft.Translator.Widget.Links.SignIn;
                        Util.GetElement(f).style.display = L
                    } else if (Microsoft.Translator.Widget.Links.SignOut) {
                        Util.GetElement(a).style.display = O;
                        Util.GetElement("UsernameLink").innerHTML = Microsoft.Translator.Widget.UserName;
                        Util.GetElement(a).innerHTML += "<span> | </span>" + Microsoft.Translator.Widget.Links.SignOut;
                        var c = Util.GetElement(a).children[Util.GetElement(a).children.length - 1];
                        if (c.innerText) c.setAttribute(bb, c.innerText);
                        else c.setAttribute(bb, c.textContent)
                    }
                }
                k.onmousedown = ub;
                H.setAttribute(n, p);
                H.setAttribute("onmouseout", "Microsoft.Translator.OnMouseOutFloater()");
                J.setAttribute(n, p);
                N = u;
                Microsoft.Translator.Widget.GetLanguagesForTranslate(u, ib, hb);
                var r = k.getElementsByTagName("input");
                for (var j = 0; j < r.length; j++) {
                    var t = r[j];
                    if (t.getAttribute("type").toLowerCase() == "text") t.setAttribute("onclick", "this.select()")
                }
                if (i.toLowerCase() == M) lb = d;
                kb = m;
                if (window[g]) window[g] += ",translator";
                else window[g] = "translator";
                //db("widget/metrics.js", (document.location.protocol == "https:" ? "https://ssl" : "http://www") + ".bing.com/")
            }
            l.Initialize = vb;

            function jb() {
                k.style.display = t
            }

            function A(g) {
                if (!kb) {
                    setTimeout(function () {
                        A(g)
                    }, 50);
                    return
                }
                var d;
                if (!mb)
                    if (d = document.getElementById("WidgetLauncher")) {
                        var c = d.getBoundingClientRect();
                        if (window["Util"].IsElementInViewport(d))
                            if (c.left == 0 && c.top == 0) setTimeout(function () {
                                c = d.getBoundingClientRect();
                                I(c.left, c.top)
                            }, 200);
                            else I(c.left, c.top);
                        else I(50, 50)
                    } else if (!d) I(50, 50);
                mb = m;
                y();
                jb();
                H.style.display = t;
                e = window[fb][g.toLowerCase()];
                if (!e) e = g;
                var h = setInterval(function () {
                    if (window[f]) {
                        window[f].onChanged = tb;
                        try {
                            try {
                                window[f].setValue(e)
                            } catch (a) {
                                console.error(a)
                            }
                            r = Util.GetElement("OriginalLanguageSpan");
                            if (s == b) r.parentNode[Y].display = o;
                            else {
                                r.parentNode[Y].display = t;
                                if (Q) r.innerHTML = window[Z].autoDetected.replace(B, v[s]);
                                else r.innerHTML = v[s]
                            }
                        } catch (a) {
                            console.warn(a)
                        }
                        clearInterval(h)
                    }
                }, 1);
                G = m;
                if (w) clearTimeout(w);
                if (!C) {
                    D = m;
                    K()
                }
                if (!nb && lb) {
                    a.serviceClient.Community.forceLoad();
                    nb = m
                }
            }
            l.Show = A;

            function ob() {
                k.style.display = o
            }

            function y() {
                H.style.display = o;
                V.style.display = o;
                J.style.display = o;
                S.style.display = o;
                G = d;
                clearTimeout(w)
            }

            function I(a, b) {
                k.style.top = b + q;
                k.style.left = a + q
            }

            function Bb() {
                pb();
                D = m;
                K()
            }
            l.TranslationComplete = Bb;

            function Cb(g) {
                if (g >= 0 && g < p) {
                    D = d;
                    clearTimeout(w);
                    qb();
                    rb(g)
                }
                var e = x;
                try {
                    e = Microsoft.Translator.Widget.GetAutoDetectedLanguage()
                } catch (l) {}
                if (e && window[f] && window[f].getValue) {
                    s = e;
                    r.parentNode[Y].display = t;
                    if (Q) r.innerHTML = window[Z].autoDetected.replace(B, v[s]);
                    else r.innerHTML = v[s];
                    var k = v[e],
                        h = v[window[f].getValue()],
                        i = location.href.substr(0, location.href.length - (location.hash || b).length),
                        j = document.location.search.length == 0 ? "?" : "&",
                        a = Util.GetElement("EmailSubject").getAttribute(u);
                    a = a.replace(B, h);
                    a = a.replace("{1}", k);
                    var c = Util.GetElement("EmailBody").getAttribute(u);
                    c = c.replace(B, encodeURIComponent(i + j + cb + window[f].getValue()));
                    c = c.replace("{1}", encodeURIComponent(i));
                    Util.GetElement("EmailLink").setAttribute(ab, "mailto:?charset=utf-8&subject=" + a + "&body=" + c);
                    Util.GetElement("ShareHelpLink").setAttribute(bb, Util.GetElement("ShareHelpText").getAttribute(u).replace(B, h));
                    window["Util"].SetCookie("mstto", window[f].getValue(), d)
                }
            }
            l.TranslationProgress = Cb;

            function Hb(a) {
                console.log(a)
            }
            l.TranslationError = Hb;

            function yb() {
                Microsoft.Translator.Widget.RestoreOriginal();
                ob()
            }
            l.OnClose = yb;

            function Gb() {
                y();
                A(e)
            }
            l.OnShareBackClick = Gb;

            function Fb() {
                y();
                A(e)
            }
            l.OnEmbedBackClick = Fb;

            function Db() {
                clearTimeout(w);
                C = m;
                A(e)
            }
            l.OnMouseOverFloater = Db;

            function Eb() {
                C = d;
                if (G) K()
            }
            l.OnMouseOutFloater = Eb;

            function K() {
                if (D && !C && G) w = setTimeout(function () {
                    Ab()
                }, n)
            }

            function sb() {
                var d = "ShareTextbox";
                y();
                jb();
                var a = location.href.substr(0, location.href.length - (location.hash || b).length);
                if (location.search.length == 0) Util.GetElement(d).setAttribute(u, a + "?__mstto=" + e);
                else if (location.search.indexOf("__mstto") != c) {
                    if (a.match(/__mstto=(.+)([&]+)/i)) Util.GetElement(d).setAttribute(u, a.replace(/__mstto=(.+)([&&]+)/i, cb + e + "&"));
                    else if (a.match(/__mstto=(.+)/i)) Util.GetElement(d).setAttribute(u, a.replace(/__mstto=(.+)/i, cb + e))
                } else Util.GetElement(d).setAttribute(u, a + "&amp;__mstto=" + e);
                V.style.display = t
            }
            l.ShowSharePanel = sb;

            function xb() {
                y();
                S.style.display = t
            }
            l.ShowEmbed = xb;

            function Ab() {
                if (D && !C && G) {
                    y();
                    J.style.display = t
                }
            }

            function ib(b) {
                for (var a = 0; a < b.length; a++) v[b[a].Code] = b[a].Name
            }

            function hb() {
                if (N != g) {
                    N = g;
                    Microsoft.Translator.Widget.GetLanguagesForTranslate(g, ib, hb)
                }
            }

            function rb(a) {
                Util.GetElement("ProgressFill").style.width = a + "%"
            }

            function pb() {
                R.style.visibility = "hidden"
            }

            function qb() {
                R.style.visibility = z
            }

            function tb() {
                if (e.toLowerCase() != window[f].getValue().toLowerCase()) {
                    clearTimeout(w);
                    Microsoft.Translator.Widget.Translate(s, window[f].getValue());
                    e = window[f].getValue();
                    window[f].elemHeader.focus()
                }
            }

            function ub(a) {
                a = a || event;
                W = a.clientX;
                X = a.clientY;
                document.onmousemove = zb;
                document.onmouseup = wb;
                document.body.focus();
                document.onselectstart = function () {
                    return d
                };
                k.ondragstart = function () {
                    return d
                };
                Util.addClass(k, eb);
                return d
            }

            function zb(a) {
                a = a || event;
                var b = Util.getPosition(k),
                    c = a.clientX - W,
                    e = a.clientY - X;
                I(parseInt(b.left) + c, parseInt(b.top) + e);
                W = a.clientX;
                X = a.clientY;
                return d
            }

            function wb(a) {
                a = a || event;
                document.onmousemove = x;
                document.onselectstart = x;
                k.ondragstart = x;
                Util.removeClass(k, eb);
                return d
            }
        })(B || (B = {}));
        m.FloaterInitialize = function (b, a, c) {
            B.Initialize(b, a, c)
        };
        m.FloaterShowSharePanel = function () {
            B.ShowSharePanel()
        };
        m.FloaterShowEmbed = function () {
            B.ShowEmbed()
        };
        m.FloaterOnClose = function () {
            B.OnClose();
            return h
        };
        m.FloaterOnShareBackClick = function () {
            B.OnShareBackClick()
        };
        m.FloaterOnEmbedBackClick = function () {
            B.OnEmbedBackClick()
        };
        m.OnMouseOverFloater = function () {
            B.OnMouseOverFloater();
            return h
        };
        m.OnMouseOutFloater = function () {
            B.OnMouseOutFloater();
            return h
        };
        var lb = document.getElementById(gb);
        if (lb != j) lb.parentNode.removeChild(lb)
    };

    function CUtil() {
        var d = "character",
            b = null,
            c = -1,
            a = this,
            e = navigator.userAgent.toLowerCase();
        a.MSIE = e.indexOf("msie") != c && e.indexOf("opera") == c;
        a.MSIE6 = a.MSIE && e.indexOf("msie 6.") != c;
        a.MSIE7 = a.MSIE && e.indexOf("msie 7.") != c;
        a.FIREFOX = e.indexOf("firefox") != c;
        a.SAFARI = e.indexOf("applewebkit") != c;
        a.GetPath = function () {
            var a = "/";
            if (location.pathname) {
                a = location.pathname.match(/\/\w*/i);
                if (a) a = a[0]
            }
            return a
        };
        a.AddFavorites = function () {
            var a = document.title,
                b = window.location.href;
            if (this.FIREFOX) window.sidebar.addPanel(a, b, "");
            else window.external.AddFavorite(b, a)
        };
        a.SetCookie = function (c, b, d, a) {
            if (!a) a = "/";
            document.cookie = c + "=" + b + (d ? "; expires=Sun, 01-Jan-2040 01:01:01 GMT" : "") + "; path=" + a
        };
        a.DeleteCookie = function (b, a) {
            if (!a) a = "/";
            document.cookie = b + "=;Thu, 01 Jan 1970 00:00:01 GMT; path=" + a
        };
        a.GetCookie = function (d) {
            var c = "document.cookie.match(/",
                a = eval(c + d + "s*=([^;]*)(;|$)/);");
            if (a != b) return a[1];
            else {
                a = eval(c + d + "s*([^;]*)(;|$)/);");
                if (a != b) return a[1];
                else return b
            }
        };
        a.AddEvent = function (a, b, c) {
            if (a.addEventListener) a.addEventListener(b, c, false);
            else if (a.attachEvent) a.attachEvent("on" + b, c)
        };
        a.AbsXPos = function (a) {
            return a.offsetLeft + (a.offsetParent != b ? this.AbsXPos(a.offsetParent) : 0)
        };
        a.AbsYPos = function (a) {
            return a.offsetTop + (a.offsetParent != b ? this.AbsYPos(a.offsetParent) : 0)
        };
        a.SetDDLByVal = function (c, b) {
            for (var a = 0; a < b.options.length; a++)
                if (b.options[a].value == c) {
                    b.options[a].selected = true;
                    return
                }
        };
        a.GetElement = function (a) {
            if (arguments.length <= 0) return b;
            if (document.getElementById) return document.getElementById(a);
            else if (document.all) return document.all(a);
            else if (document.layers) return window.document.layers[a];
            else return b
        };
        a.GetStyleObject = function (a) {
            if (document.getElementById && document.getElementById(a)) return document.getElementById(a).style;
            else if (document.all && document.all(a)) return document.all(a).style;
            else if (document.layers && document.layers[a]) return document.layers[a];
            else return false
        };
        a.GetStyleValue = function (e, c) {
            var a = document.getElementById(e) || document.body,
                d;
            if (a.currentStyle) d = a.currentStyle[c] || a.currentStyle.getAttribute(c.replace("-"));
            else if (window.getComputedStyle) d = document.defaultView.getComputedStyle(a, b).getPropertyValue(c);
            return d
        };
        a.GetScrollBounds = function (a) {
            if (a == b) return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            var e, f, d, c;
            if (a.documentElement != b && a.documentElement.scrollTop != b && a.documentElement.scrollTop >= a.body.scrollTop) {
                e = a.documentElement.scrollLeft;
                f = a.documentElement.scrollTop;
                d = a.documentElement.scrollWidth;
                c = a.documentElement.scrollHeight
            } else {
                e = a.body.scrollLeft;
                f = a.body.scrollTop;
                d = a.body.scrollWidth;
                c = a.body.scrollHeight
            }
            return {
                x: e,
                y: f,
                width: d,
                height: c
            }
        };
        a.getLanguageDirStyle = function (b) {
            var a;
            if (Microsoft.Translator.languageDirs[b] == "rtl") a = {
                direction: "rtl",
                textAlign: "right"
            };
            else a = {
                direction: "ltr",
                textAlign: "left"
            };
            return a
        };
        a.setScrollValue = function (a, b, e, f, c) {
            var d = a.ownerDocument.defaultView ? a.ownerDocument.defaultView : a.ownerDocument.parentWindow;
            if (d.scrollBy) d.scrollBy(e, f);
            else {
                a["scroll" + c] = b;
                a.ownerDocument.body["scroll" + c] = b
            }
        };
        a.GetUrlParameter = function (e, a) {
            a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var d = "[\\?&]" + a + "=([^&#]*)",
                f = new RegExp(d, "i"),
                c = f.exec(e);
            if (c == b) return b;
            else return c[1]
        };

        a.GetDocumentUrl = function (d) {
            var e = "/bv.aspx",
                b = "a=",
                a = "";
            if (d.location.hash.length > 1) a = d.location.hash.substring(1);
            else if (d.location.search.indexOf(b) > 0) a = decodeURIComponent(d.location.search.substring(d.location.search.indexOf(b) + 2));
            while (a && a.toLowerCase().indexOf(e) >= 0 && a.toLowerCase().indexOf(b) >= 0) a = decodeURIComponent(a.substring(a.toLowerCase().indexOf(b) + 2));
            if (a.length > 0) {
                a = a.replace(/^\s*/, "").replace(/\s*$/, "");
                if (a.indexOf("?") == c) a = a.replace("&", "?")
            }
            if (a && a.indexOf("://") == c) a = "http://" + a;
            if (a && a.toLowerCase().indexOf(e) >= 0) a = "";
            return a
        };
        a.SendPostRequest = function (f, c, e) {
            var a = document.createElement("form");
            a.action = f;
            a.method = "post";
            a.target = e;
            for (var d in c)
                if (c.hasOwnProperty(d)) {
                    var b = document.createElement("input");
                    b.name = d;
                    b.value = c[d];
                    b.type = "hidden";
                    a.appendChild(b)
                }
            document.body.appendChild(a);
            a.submit();
            document.body.removeChild(a)
        };
        a.Log = function (b, a) {
            Microsoft.Translator.LoadScript("/sync.ashx?svc=" + b + "&" + a.join("&"))
        };
        a.GetCaretPosition = function (a) {
            var f = 0;
            if (a.selectionStart || a.selectionStart == "0") f = a.selectionStart;
            else if (document.selection) {
                var h = document.selection.createRange(),
                    i = 0,
                    j = 0;
                if (h && h.parentElement() == a) {
                    var e = a.value.length,
                        k = a.value.replace(/\r\n/g, "\n"),
                        b = a.createTextRange();
                    b.moveToBookmark(h.getBookmark());
                    var g = a.createTextRange();
                    g.collapse(false);
                    if (b.compareEndPoints("StartToEnd", g) > c) i = j = e;
                    else {
                        i = -b.moveStart(d, -e);
                        if (b.compareEndPoints("EndToEnd", g) > c) j = e;
                        else j = -b.moveEnd(d, -e)
                    }
                }
                f = i
            }
            return f
        };
        a.SetSelectionRange = function (a, c, e) {
            if (a.setSelectionRange) {
                a.focus();
                a.setSelectionRange(c, e)
            } else if (a.createTextRange) {
                var b = a.createTextRange();
                b.collapse(true);
                b.moveEnd(d, e);
                b.moveStart(d, c);
                b.select()
            }
        };
        a.SetCaretToPosition = function (b, a) {
            this.SetSelectionRange(b, a, a)
        };
        a.addClass = function (d, c) {
            var b = d.className.split(" ");
            for (var a = 0; a < b.length; a++)
                if (c == b[a]) return;
            d.className += " " + c
        };
        a.removeClass = function (c, d) {
            var b = c.className.split(" ");
            c.className = "";
            for (var a = 0; a < b.length; a++)
                if (d != b[a]) {
                    c.className += b[a];
                    if (a == b.length - 1) c.className += " "
                }
        };
        a.getPosition = function (a) {
            var b = 0,
                c = 0;
            while (a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop)) {
                b += a.offsetLeft - a.scrollLeft;
                c += a.offsetTop - a.scrollTop;
                a = a.offsetParent
            }
            return {
                top: c,
                left: b
            }
        };
        a.IsElementInViewport = function (b) {
            var a = b.getBoundingClientRect();
            return a.top >= 0 && a.left >= 0 && a.bottom <= (window.innerHeight || document.documentElement.clientHeight) && a.right <= (window.innerWidth || document.documentElement.clientWidth)
        };
        return a
    }
    var Util = new CUtil;
    var MtPopUpList = function () {
        var a = this;
        a.onChanged = null;
        a.shiftKeyDown = false;
        a.MRUL = [];
        a.MAX_MRUL = 2
    };
    MtPopUpList.prototype = {
        keysBuffer: "",
        Init: function (d, c, i, g, h) {
            var a = this;
            a.Items = [];
            a.Keys = [];
            a.KeyMap = " " + c.join(" ") + " ";
            a.keysBuffer = "";
            var f = 0;
            for (var b = 0; b < c.length; b++) {
                a.Items[c[b]] = i[b];
                if (c[b] != "-") {
                    a.Keys[f] = c[b];
                    f++
                }
            }
            a.onChanged = g;
            document.onclick = a.HideCurrentPopup;
            a.elemHeader = Util.GetElement("__" + d + "_header");
            a.elemSvID = Util.GetElement(d + "_svid");
            a.elemTextId = Util.GetElement(d + "_textid");
            a.elemPopup = document.getElementById(h);
            a.cropText();
            if (a.elemPopup != null) {
                a.elemPopup.onkeydown = (new a.doKeyDown(a, a.HideCurrentPopup)).execute;
                a.elemPopup.onkeyup = (new a.doKeyUp(a)).execute;
                a.elemPopup.onkeypress = (new a.doKeyPress(a)).execute
            }
            a.name = d;
            a.mrul_cookie = d + "_lpmru";
            var e = Util.GetCookie(a.mrul_cookie);
            if (e != null && e != "undefined") a.MRUL = e.split(",");
            else a.MRUL = []
        },
        getLinks: function () {
            return this.elemPopup.getElementsByTagName("a")
        },
        getActiveLink: function () {
            var a = this.getLinks(),
                c = this.elemSvID.value;
            if (c != null)
                for (var b = 0; b < a.length; b++)
                    if (a[b].href.indexOf("#" + c) != -1) return a[b];
            return a[0]
        },
        getByLetter: function (i, h, e) {
            var d = this,
                g = String.fromCharCode(h).toUpperCase(),
                f = d.getActiveLink(),
                a = [],
                b;
            for (b = 0; b < e.length; b++) a[b] = e[b];
            a.sort(function (c, d) {
                var a = c.innerText || c.textContent,
                    b = d.innerText || d.textContent;
                if (a < b) return -1;
                if (a > b) return 1;
                return 0
            });
            var c = 0;
            for (; c < a.length; c++)
                if (f == a[c]) {
                    c++;
                    break
                }
            for (; c < a.length; c++)
                if (d.getFirstChar(a[c]) == g) return d.getHref(a[c]);
            for (b = 0; b < a.length; b++)
                if (d.getFirstChar(a[b]) == g && f != a[b]) return d.getHref(a[b]);
            return null
        },
        getFirstChar: function (b) {
            var a = b.innerText || b.textContent;
            if (a != undefined && a != null && a.length > 0) return a.substr(0, 1).toUpperCase();
            else return ""
        },
        getNextKey: function (e, d) {
            var b = this,
                a = 0;
            for (var c = 0; c < b.Keys.length; c++)
                if (b.Keys[c] == e) {
                    a = c;
                    break
                }
            a = a + d;
            if (a > b.Keys.length) a = 0;
            else if (a < 0) a = b.Keys.length - 1;
            return b.Keys[a]
        },
        getNextSibling: function (g, f) {
            var e = this.getActiveLink(),
                c = e.parentNode;
            while (c.tagName.toLowerCase() != "tr" && c.parentNode != null) c = c.parentNode;
            var b = c.getElementsByTagName("a"),
                a = 0;
            for (var d = 0; d < b.length; d++)
                if (e.href == b[d].href) {
                    a = d;
                    break
                }
            a = a + f;
            if (a < 0) a = 0;
            else if (a >= b.length) a = b.length - 1;
            return this.getHref(b[a])
        },
        doKeyUp: function (a) {
            this.execute = function (b) {
                if (!b) b = window.event;
                if (b.keyCode == 16) {
                    a.shiftKeyDown = false;
                    if (b.preventDefault) b.preventDefault();
                    else b.returnValue = false;
                    b.cancelBubble = true;
                    return true
                } else return false
            }
        },
        doKeyPress: function (a) {
            this.execute = function (b) {
                if (!b) b = window.event;
                a.keysBuffer += String.fromCharCode(b.charCode || b.keyCode).toLowerCase();
                clearTimeout(a.keyTimeOut);
                a.keyTimeOut = setTimeout(function () {
                    a.keysBuffer = ""
                }, 1e3)
            }
        },
        doKeyDown: function (a, b) {
            this.execute = function (e) {
                var c = false,
                    d = null;
                if (!e) e = window.event;
                var g = a.getLinks(),
                    f = a.elemSvID.value,
                    j = c;
                switch (e.keyCode) {
                    case 16:
                        a.shiftKeyDown = true;
                        return c;
                    case 9:
                        if (a.shiftKeyDown) d = a.getNextKey(f, -1);
                        else d = a.getNextKey(f, 1);
                        break;
                    case 40:
                        d = a.getNextKey(f, 1);
                        break;
                    case 38:
                        d = a.getNextKey(f, -1);
                        break;
                    case 39:
                        d = a.getNextSibling(f, 1);
                        break;
                    case 37:
                        d = a.getNextSibling(f, -1);
                        break;
                    case 13:
                    case 27:
                        b();
                        return c;
                    default:
                        j = true
                }
                if (!j) {
                    var i = g[0];
                    for (var h = 0; h < g.length; h++)
                        if (g[h].href.indexOf("#" + d) != -1) {
                            i = g[h];
                            break
                        }
                    try {
                        i.focus();
                        i.onclick()
                    } catch (k) {}
                    return c
                } else {
                    window.evt = e;
                    setTimeout(function () {
                        if (!e) e = window.evt;
                        var c = a.getLinks(),
                            d;
                        for (var b = 0; b < c.length; b++) {
                            var f = c[b].outerText || c[b].text;
                            if (f.toLowerCase().indexOf(a.keysBuffer) == 0 && f != (a.getActiveLink().outerText || a.getActiveLink().text)) {
                                d = c[b];
                                break
                            }
                        }
                        try {
                            if (d) {
                                d.focus();
                                d.onclick()
                            }
                        } catch (g) {}
                    }, 30)
                }
                return true
            }
        },
        Hide: function () {
            this.HideCurrentPopup()
        },
        Show: function (c, b) {
            var d = true,
                a = this;
            if (b) {
                if (b.keyCode == 27) {
                    a.Hide(c, b);
                    return d
                }
                if (b.keyCode && b.keyCode != 40) return false;
                if (window.curDisplayedPopup == c) {
                    a.HideCurrentPopup();
                    return d
                }
                a.HideCurrentPopup();
                b.cancelBubble = d;
                if (a.ChangeObjectDisplay(c, "block")) {
                    window.curDisplayedDDHeader = a.elemHeader;
                    window.curDisplayedPopup = c;
                    a.getActiveLink().focus();
                    Util.addClass(a.elemHeader, "DDSActive");
                    return d
                }
            }
            return false
        },
        cropText: function () {
            var c = "overflow",
                a = this,
                f = "...",
                b = a.elemHeader.innerHTML;
            a.elemHeader.title = b;
            a.elemHeader.innerHTML += "____";
            a.elemHeader.style[c] = "hidden";
            var g = a.elemHeader.clientWidth,
                h = a.elemHeader.scrollWidth,
                d = g * 1 / h * 1;
            if (d < 1) {
                var e = Math.ceil(d * b.length);
                if (e < b.length) b = String(b).substring(0, e - f.length) + f
            }
            a.elemHeader.style[c] = "visible";
            a.elemHeader.innerHTML = b
        },
        getHref: function (a) {
            return a.href.substr(a.href.indexOf("#") + 1)
        },
        setValue: function (b, f) {
            var a = this;
            if (b) {
                var c = (new RegExp(" (" + b + ") ", "i")).exec(a.KeyMap);
                if (c && c[1]) b = c[1]
            }
            if (a.Items[b] == null) throw new Error("Value is not in the current list.");
            a.elemSvID.value = b;
            a.elemHeader.value = a.Items[b];
            if (f != "true") a.addMRUL(b);
            var e = document.getElementById(a.name);
            if (e.tagName == "SELECT")
                for (var d = 0; d < e.options.length; d++) {
                    var g = e.options[d];
                    if (g.value == b) {
                        g.selected = "selected";
                        break
                    }
                }
            a.setText(a.Items[b], f)
        },
        getValue: function () {
            return this.elemSvID.value
        },
        setText: function (c, d) {
            var a = this,
                b = document.getElementById(a.name);
            if (b.tagName.toLowerCase() == "select")
                if (b.value == "") b.options[0].text = c;
                else if (b.options[0].value == "") b.options[0].text = a.Items[""];
            a.elemTextId.value = c;
            a.elemHeader.innerHTML = c;
            a.cropText();
            if (d != "true") a.onChanged(c, a.Items[c])
        },
        getText: function () {
            return this.elemTextId.value
        },
        onclick: function (a) {
            this.setValue(a);
            return false
        },
        ondragstart: function (a) {
            if (!a) a = window.event;
            if (a.preventDefault) a.preventDefault()
        },
        OnSelectedValueChanged: function () {
            return this.onChanged
        },
        HideCurrentPopup: function () {
            if (window.curDisplayedPopup) {
                Util.GetElement(window.curDisplayedPopup).style.display = "none";
                Util.removeClass(window.curDisplayedDDHeader, "DDSActive");
                window.curDisplayedPopup = false;
                window.curDisplayedDDHeader = null
            }
            this.shiftKeyDown = false
        },
        ChangeObjectDisplay: function (c, b) {
            var a = Util.GetStyleObject(c);
            if (a && a.display) {
                a.display = b;
                return true
            } else return false
        },
        addMRUL: function (d) {
            var a = this;
            if (!d) return;
            if (a.MRUL[0] == d) return;
            var c = 0,
                b;
            for (b = 1; b < a.MRUL.length; b++)
                if (a.MRUL[b] == d) {
                    c = b;
                    break
                }
            if (c == 0) a.MRUL.unshift(d);
            else {
                var e = c > 0 ? a.MRUL[c] : d;
                for (b = c; b > 0; b--) a.MRUL[b] = a.MRUL[b - 1];
                a.MRUL[0] = e
            }
            while (a.MRUL.length > a.MAX_MRUL) a.MRUL.pop();
            Util.SetCookie(a.mrul_cookie, a.MRUL, true, Util.GetPath())
        }
    };
    window['_mstConfig'].floaterStylePath = 'https://www.microsofttranslator.com/static/197997/css/WidgetV3_fail.css'; //'http://www.microsofttranslator.com/static/197997/css/WidgetV3.css';
    window['_mstConfig'].translateWithBing = 'TRANSLATE with {0}';
    window['_mstConfig'].withBing = 'with {0}';
    window['_mstConfig'].autoDetected = '{0} (Auto-Detected)';

    function loadAllScripts(fn) {
        /*var intervalID = setInterval(function () {
         if (document.readyState != 'complete') return;
         clearInterval(intervalID);
         fn();
         }, 10);*/
        fn();
    }

    function onloadCallback() {
        var head = document.getElementsByTagName('head')[0];
        try {
            var body = document.getElementsByTagName('body')[0];
            var numChildren = body.children.length;
            var numScripts = body.getElementsByTagName('script').length;

            function appendHTMLToBody(html) {
                var temp = document.createElement('div');
                temp.innerHTML = html;
                for (var i = 0; i < temp.children.length; i++) {
                    body.appendChild(temp.children[i]);
                }
            }
            appendHTMLToBody(decodeURIComponent('%3ctitle%3e%20%3c%2ftitle%3e'));


            appendHTMLToBody(decodeURIComponent('%20%3cdiv%20id%3d%22WidgetFloaterPanels%22%20translate%3d%22no%22%20style%3d%22display%3a%20none%3btext-align%3a%20left%3bdirection%3a%20ltr%22%20class%3d%22LTRStyle%22%20%3e%20%3cdiv%20id%3d%22WidgetFloater%22%20style%3d%22display%3a%20none%22%20%3e%20%3cdiv%20id%3d%22WidgetLogoPanel%22%3e%20%3cspan%20id%3d%22WidgetTranslateWithSpan%22%3e%3cspan%3eTRANSLATE%20with%20%3c%2fspan%3e%3cimg%20id%3d%22FloaterLogo%22%20%2f%3e%3c%2fspan%3e%20%3cspan%20id%3d%22WidgetCloseButton%22%20title%3d%22Exit%20Translation%22%20onclick%3d%22Microsoft.Translator.FloaterOnClose()%22%3ex%3c%2fspan%3e%3c%2fdiv%3e%20%3cdiv%20id%3d%22LanguageMenuPanel%22%3e%20%3cdiv%20class%3d%22DDStyle_outer%22%3e%3cinput%20name%3d%22LanguageMenu_svid%22%20type%3d%22text%22%20id%3d%22LanguageMenu_svid%22%20style%3d%22display%3anone%3b%22%20autocomplete%3d%22on%22%20value%3d%22en%22%20%2f%3e%20%3cinput%20name%3d%22LanguageMenu_textid%22%20type%3d%22text%22%20id%3d%22LanguageMenu_textid%22%20style%3d%22display%3anone%3b%22%20autocomplete%3d%22on%22%20%2f%3e%20%3cspan%20onselectstart%3d%22return%20false%22%20tabindex%3d%220%22%20class%3d%22DDStyle%22%20id%3d%22__LanguageMenu_header%22%20onclick%3d%22return%20LanguageMenu%20%26amp%3b%26amp%3b%20!LanguageMenu.Show(%26%2339%3b__LanguageMenu_popup%26%2339%3b%2c%20event)%3b%22%20onkeydown%3d%22return%20LanguageMenu%20%26amp%3b%26amp%3b%20!LanguageMenu.Show(%26%2339%3b__LanguageMenu_popup%26%2339%3b%2c%20event)%3b%22%3eEnglish%3c%2fspan%3e%20%3cdiv%20style%3d%22position%3arelative%3btext-align%3aleft%3bleft%3a0%3b%22%3e%3cdiv%20style%3d%22position%3aabsolute%3bwidth%3a%3bleft%3a0px%3b%22%3e%3cdiv%20class%3d%22DDStyle%22%20style%3d%22display%3anone%3b%22%20id%3d%22__LanguageMenu_popup%22%3e%20%3ctable%20id%3d%22LanguageMenu%22%20border%3d%220%22%3e%20%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bar%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ar%22%3eArabic%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bhe%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23he%22%3eHebrew%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bpl%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23pl%22%3ePolish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bbg%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23bg%22%3eBulgarian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bhi%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23hi%22%3eHindi%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bpt%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23pt%22%3ePortuguese%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bca%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ca%22%3eCatalan%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bmww%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23mww%22%3eHmong%20Daw%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bro%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ro%22%3eRomanian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bzh-CHS%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23zh-CHS%22%3eChinese%20Simplified%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bhu%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23hu%22%3eHungarian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bru%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ru%22%3eRussian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bzh-CHT%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23zh-CHT%22%3eChinese%20Traditional%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bid%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23id%22%3eIndonesian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bsk%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23sk%22%3eSlovak%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bcs%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23cs%22%3eCzech%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bit%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23it%22%3eItalian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bsl%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23sl%22%3eSlovenian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bda%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23da%22%3eDanish%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bja%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ja%22%3eJapanese%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bes%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23es%22%3eSpanish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bnl%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23nl%22%3eDutch%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3btlh%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23tlh%22%3eKlingon%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bsv%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23sv%22%3eSwedish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3ben%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23en%22%3eEnglish%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bko%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ko%22%3eKorean%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bth%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23th%22%3eThai%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bet%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23et%22%3eEstonian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3blv%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23lv%22%3eLatvian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3btr%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23tr%22%3eTurkish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bfi%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23fi%22%3eFinnish%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3blt%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23lt%22%3eLithuanian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3buk%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23uk%22%3eUkrainian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bfr%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23fr%22%3eFrench%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bms%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ms%22%3eMalay%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bur%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ur%22%3eUrdu%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bde%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23de%22%3eGerman%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bmt%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23mt%22%3eMaltese%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bvi%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23vi%22%3eVietnamese%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bel%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23el%22%3eGreek%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bno%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23no%22%3eNorwegian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bcy%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23cy%22%3eWelsh%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bht%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ht%22%3eHaitian%20Creole%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bfa%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23fa%22%3ePersian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3c%2ftd%3e%20%3c%2ftr%3e%20%3c%2ftable%3e%20%3cimg%20alt%3d%22%22%20style%3d%22height%3a7px%3bwidth%3a17px%3bborder-width%3a0px%3bleft%3a20px%3b%22%20%2f%3e%20%3c%2fdiv%3e%3c%2fdiv%3e%3c%2fdiv%3e%3c%2fdiv%3e%20%3cscript%20type%3d%22text%2fjavascript%22%3e%20var%20LanguageMenu%3b%20var%20LanguageMenu_keys%3d%5b%22ar%22%2c%22bg%22%2c%22ca%22%2c%22zh-CHS%22%2c%22zh-CHT%22%2c%22cs%22%2c%22da%22%2c%22nl%22%2c%22en%22%2c%22et%22%2c%22fi%22%2c%22fr%22%2c%22de%22%2c%22el%22%2c%22ht%22%2c%22he%22%2c%22hi%22%2c%22mww%22%2c%22hu%22%2c%22id%22%2c%22it%22%2c%22ja%22%2c%22tlh%22%2c%22ko%22%2c%22lv%22%2c%22lt%22%2c%22ms%22%2c%22mt%22%2c%22no%22%2c%22fa%22%2c%22pl%22%2c%22pt%22%2c%22ro%22%2c%22ru%22%2c%22sk%22%2c%22sl%22%2c%22es%22%2c%22sv%22%2c%22th%22%2c%22tr%22%2c%22uk%22%2c%22ur%22%2c%22vi%22%2c%22cy%22%5d%3b%20var%20LanguageMenu_values%3d%5b%22Arabic%22%2c%22Bulgarian%22%2c%22Catalan%22%2c%22Chinese%20Simplified%22%2c%22Chinese%20Traditional%22%2c%22Czech%22%2c%22Danish%22%2c%22Dutch%22%2c%22English%22%2c%22Estonian%22%2c%22Finnish%22%2c%22French%22%2c%22German%22%2c%22Greek%22%2c%22Haitian%20Creole%22%2c%22Hebrew%22%2c%22Hindi%22%2c%22Hmong%20Daw%22%2c%22Hungarian%22%2c%22Indonesian%22%2c%22Italian%22%2c%22Japanese%22%2c%22Klingon%22%2c%22Korean%22%2c%22Latvian%22%2c%22Lithuanian%22%2c%22Malay%22%2c%22Maltese%22%2c%22Norwegian%22%2c%22Persian%22%2c%22Polish%22%2c%22Portuguese%22%2c%22Romanian%22%2c%22Russian%22%2c%22Slovak%22%2c%22Slovenian%22%2c%22Spanish%22%2c%22Swedish%22%2c%22Thai%22%2c%22Turkish%22%2c%22Ukrainian%22%2c%22Urdu%22%2c%22Vietnamese%22%2c%22Welsh%22%5d%3b%20var%20LanguageMenu_callback%3dfunction()%7b%20%7d%3b%20var%20LanguageMenu_popupid%3d%27__LanguageMenu_popup%27%3b%20%3c%2fscript%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22CTFLinksPanel%22%3e%20%3cspan%20id%3d%22ExternalLinksPanel%22%3e%3ca%20id%3d%22HelpLink%22%20title%3d%22Help%22%20target%3d%22_blank%22%3e%20%3cimg%20id%3d%22HelpImg%22%20%2f%3e%3c%2fa%3e%20%3ca%20id%3d%22EmbedLink%22%20href%3d%22javascript%3aMicrosoft.Translator.FloaterShowEmbed()%22%20title%3d%22Get%20this%20widget%20for%20your%20own%20site%22%3e%20%3cimg%20id%3d%22EmbedImg%22%20%2f%3e%3c%2fa%3e%20%3ca%20id%3d%22ShareLink%22%20title%3d%22Share%20translated%20page%20with%20friends%22%20href%3d%22javascript%3aMicrosoft.Translator.FloaterShowSharePanel()%22%3e%20%3cimg%20id%3d%22ShareImg%22%20%2f%3e%3c%2fa%3e%20%3c%2fspan%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22FloaterProgressBar%22%3e%20%3cspan%20id%3d%22ProgressFill%22%20%3e%3c%2fspan%3e%20%3c%2fdiv%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22WidgetFloaterCollapsed%22%20style%3d%22display%3a%20none%22%3e%20%3cspan%3eTRANSLATE%20with%20%3c%2fspan%3e%3cimg%20id%3d%22CollapsedLogoImg%22%20%2f%3e%3c%2fdiv%3e%20%3cdiv%20id%3d%22FloaterSharePanel%22%20style%3d%22display%3a%20none%22%20%3e%20%3cdiv%20id%3d%22ShareTextDiv%22%3e%20%3cspan%20id%3d%22ShareTextSpan%22%3e%20COPY%20THE%20URL%20BELOW%20%3c%2fspan%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22ShareTextboxDiv%22%3e%20%3cinput%20name%3d%22ShareTextbox%22%20type%3d%22text%22%20id%3d%22ShareTextbox%22%20readonly%3d%22readonly%22%20%2f%3e%20%3c!--a%20id%3d%22TwitterLink%22%20title%3d%22Share%20on%20Twitter%22%3e%20%3cimg%20id%3d%22TwitterImg%22%20%2f%3e%3c%2fa%3e%20%3ca--%20id%3d%22FacebookLink%22%20title%3d%22Share%20on%20Facebook%22%3e%20%3cimg%20id%3d%22FacebookImg%22%20%2f%3e%3c%2fa--%3e%20%3ca%20id%3d%22EmailLink%22%20title%3d%22Email%20this%20translation%22%3e%20%3cimg%20id%3d%22EmailImg%22%20%2f%3e%3c%2fa%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22ShareFooter%22%3e%20%3cspan%20id%3d%22ShareHelpSpan%22%3e%3ca%20id%3d%22ShareHelpLink%22%3e%20%3cimg%20id%3d%22ShareHelpImg%22%20%2f%3e%3c%2fa%3e%3c%2fspan%3e%20%3cspan%20id%3d%22ShareBackSpan%22%3e%3ca%20id%3d%22ShareBack%22%20href%3d%22javascript%3aMicrosoft.Translator.FloaterOnShareBackClick()%22%20title%3d%22Back%20To%20Translation%22%3e%20Back%3c%2fa%3e%3c%2fspan%3e%20%3c%2fdiv%3e%20%3cinput%20name%3d%22EmailSubject%22%20type%3d%22hidden%22%20id%3d%22EmailSubject%22%20value%3d%22Check%20out%20this%20page%20in%20%7b0%7d%20translated%20from%20%7b1%7d%22%20%2f%3e%20%3cinput%20name%3d%22EmailBody%22%20type%3d%22hidden%22%20id%3d%22EmailBody%22%20value%3d%22Translated%3a%20%7b0%7d%250d%250aOriginal%3a%20%7b1%7d%250d%250a%250d%250aAutomatic%20translation%20powered%20by%20Microsoft%c2%ae%20Translator%250d%250ahttp%3a%2f%2fwww.bing.com%2ftranslator%3fref%3dMSTWidget%22%20%2f%3e%20%3cinput%20type%3d%22hidden%22%20id%3d%22ShareHelpText%22%20value%3d%22This%20link%20allows%20visitors%20to%20launch%20this%20page%20and%20automatically%20translate%20it%20to%20%7b0%7d.%22%2f%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22FloaterEmbed%22%20style%3d%22display%3a%20none%22%3e%20%3cdiv%20id%3d%22EmbedTextDiv%22%3e%20%3cspan%20id%3d%22EmbedTextSpan%22%3eEMBED%20THE%20SNIPPET%20BELOW%20IN%20YOUR%20SITE%3c%2fspan%3e%20%3ca%20id%3d%22EmbedHelpLink%22%20title%3d%22Copy%20this%20code%20and%20place%20it%20into%20your%20HTML.%22%3e%20%3cimg%20id%3d%22EmbedHelpImg%22%2f%3e%3c%2fa%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22EmbedTextboxDiv%22%3e%20%3cinput%20name%3d%22EmbedSnippetTextBox%22%20type%3d%22text%22%20id%3d%22EmbedSnippetTextBox%22%20readonly%3d%22readonly%22%20value%3d%22%26lt%3bdiv%20id%3d%26%2339%3bMicrosoftTranslatorWidget%26%2339%3b%20class%3d%26%2339%3bDark%26%2339%3b%20style%3d%26%2339%3bcolor%3awhite%3bbackground-color%3a%23555555%26%2339%3b%3e%26lt%3b%2fdiv%3e%26lt%3bscript%20type%3d%26%2339%3btext%2fjavascript%26%2339%3b%3esetTimeout(function()%7bvar%20s%3ddocument.createElement(%26%2339%3bscript%26%2339%3b)%3bs.type%3d%26%2339%3btext%2fjavascript%26%2339%3b%3bs.charset%3d%26%2339%3bUTF-8%26%2339%3b%3bs.src%3d((location%20%26amp%3b%26amp%3b%20location.href%20%26amp%3b%26amp%3b%20location.href.indexOf(%26%2339%3bhttps%26%2339%3b)%20%3d%3d%200)%3f%26%2339%3bhttps%3a%2f%2fssl.microsofttranslator.com%26%2339%3b%3a%26%2339%3bhttp%3a%2f%2fwww.microsofttranslator.com%26%2339%3b)%2b%26%2339%3b%2fajax%2fv3%2fWidgetV3.ashx%3fsiteData%3dueOIGRSKkd965FeEGM5JtQ**%26amp%3bctf%3dtrue%26amp%3bui%3dtrue%26amp%3bsettings%3dmanual%26amp%3bfrom%3den%26%2339%3b%3bvar%20p%3ddocument.getElementsByTagName(%26%2339%3bhead%26%2339%3b)%5b0%5d%7c%7cdocument.documentElement%3bp.insertBefore(s%2cp.firstChild)%3b%20%7d%2c0)%3b%26lt%3b%2fscript%3e%22%20%2f%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22EmbedNoticeDiv%22%3e%3cspan%20id%3d%22EmbedNoticeSpan%22%3eEnable%20collaborative%20features%20and%20customize%20widget%3a%20%3ca%20href%3d%22http%3a%2f%2fwww.bing.com%2fwidget%2ftranslator%22%20target%3d%22_blank%22%3eBing%20Webmaster%20Portal%3c%2fa%3e%3c%2fspan%3e%3c%2fdiv%3e%20%3cdiv%20id%3d%22EmbedFooterDiv%22%3e%3cspan%20id%3d%22EmbedBackSpan%22%3e%3ca%20href%3d%22javascript%3aMicrosoft.Translator.FloaterOnEmbedBackClick()%22%20title%3d%22Back%20To%20Translation%22%3eBack%3c%2fa%3e%3c%2fspan%3e%3c%2fdiv%3e%20%3c%2fdiv%3e%20%3cscript%20type%3d%22text%2fjavascript%22%3e%20var%20intervalId%20%3d%20setInterval(function%20()%20%7b%20if%20(MtPopUpList)%20%7b%20LanguageMenu%20%3d%20new%20MtPopUpList()%3b%20var%20langMenu%20%3d%20document.getElementById(LanguageMenu_popupid)%3b%20var%20origLangDiv%20%3d%20document.createElement(%22div%22)%3b%20origLangDiv.id%20%3d%20%22OriginalLanguageDiv%22%3b%20origLangDiv.innerHTML%20%3d%20%22%3cspan%20id%3d%27OriginalTextSpan%27%3eORIGINAL%3a%20%3c%2fspan%3e%3cspan%20id%3d%27OriginalLanguageSpan%27%3e%3c%2fspan%3e%22%3b%20langMenu.appendChild(origLangDiv)%3b%20LanguageMenu.Init(%27LanguageMenu%27%2c%20LanguageMenu_keys%2c%20LanguageMenu_values%2c%20LanguageMenu_callback%2c%20LanguageMenu_popupid)%3b%20window%5b%22LanguageMenu%22%5d%20%3d%20LanguageMenu%3b%20clearInterval(intervalId)%3b%20%7d%20%7d%2c%201)%3b%20%3c%2fscript%3e%20%3c%2fdiv%3e%20'));
            var code = '';
            var scripts = body.getElementsByTagName('script');
            for (var i = numScripts; i < scripts.length; i++) {
                if (scripts[i].innerHTML.length != 0) {
                    code += scripts[i].innerHTML;
                }
            }
            eval(code);
        } catch (e) {
            console.error(e);
        }
        Microsoft.Translator.FloaterInitialize('en', 'true', '');
    }

    loadAllScripts(onloadCallback);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //The codes above are local copy of translate scripts;

    function onTranslateProgress(value)
    {
        var msg = BFI_LOADINGMSG + ' ' + Math.round(value) + '%';
        showMessageBox(msg, "OnProgress");
    }

    function onTranslateError(error)
    {
        //Kept only for debugging;
        //alert('Translate Error: ' + error);
    }

    function onTranslateComplete()
    {
        var msg = BFI_DONEMSG;

        if( Microsoft.Translator.Widget.GetAutoDetectedLanguage().toUpperCase() === BFI_TOLANG.toUpperCase() )
        {
            msg = BFI_SAMELANGMSG;
        }

        showMessageBox(msg);
    }

    function showMessageBox(msg, msgType)
    {
        var msgBox = document.getElementById('_msgBox');
        var firstRun = (msgBox === null);

        if(firstRun) {
            msgBox = document.createElement('div');
            msgBox.id = '_msgBox';
            msgBox.className = 'TnITTtw-fullpage-bar';
        }

        //var divClose = '<div id="divClose" style="float:right;margin:0px;padding:0px" ><a style="padding:0px;margin:0px" onclick="document.getElementById(\'_msgBox\').style.display=\'none\';"></div>';
        //var divCancel = '<div id="divCancel" style="float:right;margin:0px 10px 0px 0px;padding:0px;line-height:41px;" ><a style="padding:0px;margin:0px;color:#0760be" onclick="document.getElementById(\'_msgBox\').style.display=\'none\';window.location.reload();">' + BFI_CANCEL + '</a></div>';

        var divClose = '<div class="TnITTtw-close-bar" onclick="document.getElementById(\'BFI_DATA\').value = \'init_mate\';"></div>';
        var divCancel = '';

        msgBox.innerHTML = '<div class="TnITTtw-label">'+ msg +'</div>' + (msgType === "OnProgress"? divCancel : divClose);

        if(firstRun)
        {
            document.body.insertBefore(msgBox, document.body.childNodes[0]);
        }
    }

    /**
     * Load an external resource to the DOM to evaluate more scripts.
     */
    function loadScript(scriptName, onload) {
        // RDB

        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', scriptName);

        if (onload) {
            script.addEventListener('load', onload, false);
        }

        document.body.appendChild(script);
    }

    // above is the translator widget wrapper;
    function onTranslateTimer()
    {
        var transferDOM = document.getElementById('BFI_DATA');

        if(!transferDOM || !transferDOM.value || transferDOM.value === '') {
            //setTimeout(onTranslateTimer, 100);
        } else if (transferDOM.value === 'restore_original') {
            Microsoft.Translator.Widget.RestoreOriginal();
            transferDOM.value = '';
        } else if (transferDOM.value.indexOf(',') > -1) {
            var msg = transferDOM.value.split(',');

            BFI_TOLANG = msg[0];
            BFI_DONEMSG = msg[1];
            BFI_SAMELANGMSG = msg[2];
            BFI_LOADINGMSG = msg[3];
            BFI_CANCEL = msg[4];
            BFI_APPID = msg[5];

            // message transfer done.
            // clear data dom;
            //document.body.removeChild(transferDOM);

            // reset value instead of removing from DOM
            transferDOM.value = '';

            // start loading;
            onTranslateProgress(0);

            // the loaded script is filling latest BFI_APPID;

            // 1 indicates app id is successfully loaded;
            onTranslateProgress(1);

            Microsoft.Translator.Widget.Translate(null, BFI_TOLANG, onTranslateProgress, onTranslateError, onTranslateComplete, null, 3600000);
        }

        setTimeout(onTranslateTimer, 100);
    }

    // start to monitor transfer data;
    setTimeout(onTranslateTimer, 100);
}


function injectScript(fn) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + fn + ')();'));
    document.body.appendChild(script);
}

/**
 * Bing adds branding to the page when the translator has begun. This will
 * use Mutation Observers to listen on the newly added DOM and
 * remove it from display.
 */
function brandingRemoval() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || windows.MozMutationObserver;
    var observer = new MutationObserver(function onMutationObserver(mutations) {
        mutations.forEach(function(mutationNode) {
            if (mutationNode.addedNodes) {
                for (var n = 0; n < mutationNode.addedNodes.length; n++) {
                    var node = mutationNode.addedNodes[n];
                    if (node.id === 'WidgetFloaterPanels') {
                        node.style.display = 'none';
                        node.style.visibility = 'hidden';
                    }
                }
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: false });
}


var transferDom;
/**
 * Create shared DOM to transfer between two worlds
 */
function embedTransferDom()
{
    transferDom = document.createElement('textarea');
    transferDom.id = 'BFI_DATA';
    transferDom.style.width='1px';
    transferDom.style.height='1px';
    transferDom.style.display='none';
    document.body.appendChild(transferDom);
}

/**
 * Fires an event to the Browser context for cross context messaging.
 */
function dispatch(msg) {
    transtateDom = document.getElementById('BFI_DATA');
    transferDom.value = msg;
}

// Initialize the extension communications shared DOM states.
embedTransferDom();
brandingRemoval();
injectScript(fpTranslate);

function checkCommunication() {
    var data = document.getElementById('BFI_DATA');

    if (!data || !data.value) {
        // do nothing
    } else if (data.value === 'init_mate') {
        data.value = 'restore_original';

        $('.TnITTtw-fullpage-bar').animate({
            bottom: -100
        }, 150, function() {
            $(this).remove();

            init();
        });
    }

    setTimeout(checkCommunication, 100);
}

setTimeout(checkCommunication, 100);