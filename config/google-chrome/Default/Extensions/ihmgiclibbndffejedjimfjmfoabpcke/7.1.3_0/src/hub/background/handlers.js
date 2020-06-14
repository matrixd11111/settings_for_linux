/* Kumquat Hub Background Handlers
 * 
 **/

(function (undefined) {

    const PRICE_FETCH_INTERVAL = 345600000; // 4 days
    const PROMOT_FETCH_INTERVAL = 1209600000; // 14 days
    const COUNTRY_FETCH_INTERVAL = 86400000; // 1 day

    pl.extend(ke.app.handlers, {
        _processEventHandlers: {
            app: {
                opt: {},
                translate: {},
                audio: {},
                option: {},
                commands: {},
                sync: {},
                phrasebook: {}
            }
        },

        onCommandReceived: function (data, sender, sendResponse) {
            if (data.action) {
                var parts = ke.parseProcessCall(data.action);

                var eh = ke.app.handlers._processEventHandlers;

                if (eh[parts.lib] && eh[parts.lib][parts.cmd]) {
                    ke.app.handlers._processEventHandlers[parts.lib][parts.cmd][parts.exact](data, function (response) {
                        pl.extend(response, {
                            old_data: data
                        });

                        /* Prevent the following type of errors to be logged in the console:
                         *
                         * When a user requests something in a tab and closes it before the
                         * request is managed to be handled and its response sent back.
                         *
                         * Thus, the response is sent to the closed tab in this case.
                         */
                        try {
                            sendResponse(response);
                        } catch (e) {
                        }
                    });
                }

                return true;
            }
        },

        detectCountry: function () {
            if (Date.now() - ke.ext.util.storageUtil.getIntValue('last_country_fetch') >= COUNTRY_FETCH_INTERVAL) {
                ke.ext.util.storageUtil.setIntValue('last_country_fetch', Date.now());

                if (navigator.onLine) {
                    $.ajax({
                        url: 'https://api' + ke.ext.util.storageUtil.getVal('misc_server') + '.matetranslate.com/geo/json',
                        type: 'GET',
                        success: function (data) {
                            if (!data.country_code) {
                                return;
                            }

                            var cc = data.country_code.toLowerCase();

                            ke.ext.util.storageUtil.setVal('user_country', cc);
                            ke.ext.util.storageUtil.setOptionAsBoolean('mon_is_cis', ke.app.handlers.isCIS(cc));
                        },
                        error: function (e) {
                            //console.log('geo:', e);
                        }
                    });
                } else {
                    window.addEventListener('online', function () {
                        ke.app.handlers.detectCountry();
                    });
                }
            }
        },

        getPromotionalTable: function (callback) {
            if (Date.now() - ke.ext.util.storageUtil.getIntValue('last_promot_fetch') >= PROMOT_FETCH_INTERVAL) {
                ke.ext.util.storageUtil.setIntValue('last_promot_fetch', Date.now());

                if (navigator.onLine) {
                    $.ajax({
                        url: 'https://api' + ke.ext.util.storageUtil.getVal('misc_server') + '.matetranslate.com/v2/get_promotional_table',
                        type: 'GET',
                        crossDomain: true,
                        dataType: 'json',
                        success: function (data) {
                            ke.ext.util.storageUtil.setVal('promo_table', JSON.stringify(data));
                        },
                        error: function () {
                        }
                    });
                } else {
                    window.addEventListener('online', function () {
                        ke.app.handlers.getPromotionalTable();
                    });
                }
            }
        },

        getProPrice: function (callback) {
            if (Date.now() - ke.ext.util.storageUtil.getIntValue('last_price_fetch') >= PRICE_FETCH_INTERVAL) {
                ke.ext.util.storageUtil.setIntValue('last_price_fetch', Date.now());

                if (navigator.onLine) {
                    $.ajax({
                        url: 'https://checkout.paddle.com/api/1.0/prices',
                        type: 'GET',
                        crossDomain: true,
                        data: {
                            product_id: 519679,
                            quantity: 1
                        },
                        dataType: 'json',
                        success: function (data) {
                            ke.ext.util.storageUtil.setVal('pro_inapp_price',
                                ke.ext.string.safeResponse.cleanDomString(decodeURIComponent('' + data.price.gross)));
                            callback();
                        },
                        error: function () {
                            callback();
                        }
                    });
                } else {
                    window.addEventListener('online', function () {
                        ke.app.handlers.getProPrice(callback);
                    });
                }
            } else {
                callback();
            }
        },

        getTTSLink: function () {
            if (navigator.onLine) {
                $.ajax({
                    url: 'https://api' + ke.ext.util.storageUtil.getVal('misc_server') + '.matetranslate.com/v2/get_tts_link_tpl',
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    success: function (data) {
                        ke.app.tts_link = decodeURIComponent(data.link);
                    },
                    error: function () {
                    }
                });
            } else {
                window.addEventListener('online', function () {
                    ke.app.handlers.getTTSLink();
                });
            }
        },

        isCIS: function (cc) {
            if (ke.DEBUG) {
                //return true;
            }

            return cc in {'by': 0, 'kz': 0, 'ru': 0, 'ua': 0} // iso 3166 codes
                || ke.getCurrentLocale() in {'ru': 0, 'uk': 0};
        },

        generateDropdownHtml: function (callback) {
            ke.particles.lang_selectors.view.getDropdownHtml(ke.particles.lang_selectors.view.TYPES.FROM, 1, null, function (from_gen) {
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'from.num', from_gen.num);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'from.code', from_gen.code);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'from.select', from_gen.select);
            }, true);

            ke.particles.lang_selectors.view.getDropdownHtml(ke.particles.lang_selectors.view.TYPES.TO, 2, null, function (to_gen) {
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'to.num', to_gen.num);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'to.code', to_gen.code);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'to.select', to_gen.select);
            }, true);
        },

        opened_internal_pages: {},

        internal_redir_blocked: false,

        checkInternalPagesRedirect: function (tabId, data) {
            if (ke.app.handlers.internal_redir_blocked) {
                return;
            }

            var ext_id = ke.staticExtId;
            var ff_ext_id = ke.extId;
            var ext_uri = (ke.redirectableExtId + '.com/').toLowerCase();

            var ff_ext_uri;
            if (ke.IS_FIREFOX) {
                ff_ext_uri = (ke.staticExtId.split('@')[0] + '.com/').toLowerCase();
            }

            if (data.url && (data.url.indexOf(ext_id + '/oauth2redirect.html') > -1)
                || data.url.indexOf(ff_ext_id + '/oauth2redirect.html') > -1) {
                var login_data = JSON.parse(ke.ext.string.getParamFromQueryString('login_data', data.url));

                if (tabId) {
                    chrome.tabs.remove(tabId);
                }

                // direct search by url is not used here because of safari
                // it can't look up a tab by url
                chrome.tabs.query({}, function (tabs) {
                    tabs.forEach(function (tab) {
                        if (!tab.url) {
                            return;
                        }

                        if (tab.url.indexOf('/pages/public/login.html') > -1) {
                            chrome.tabs.sendMessage(tab.id, {
                                action: ke.processCall('app', 'login', 'finish'),
                                data: login_data
                            });
                        }
                    });
                });
            } else if (data.url
                && (data.url.indexOf(ext_uri) > -1
                    || (ff_ext_uri && data.url.indexOf(ff_ext_uri) > -1))) {

                // Redirect
                // {{extension_id}}.com/{{path}}
                // to
                // chrome-extension://{{path}}
                // Required for sign-in & email marketing

                // TESTS:
                // ------
                // Firefox OK
                // Chrome OK
                // Opera OK
                // Edge
                // Safari

                ke.app.handlers.internal_redir_blocked = true;

                chrome.tabs.remove(tabId);

                var redir_uri = ke.pathToExt + data.url
                    .replace(ext_uri, '')
                    .replace(ff_ext_uri, '')
                    .replace('http://', '')
                    .replace('https://', '');

                chrome.tabs.create({
                    url: chrome.extension.getURL(redir_uri)
                }, function () {
                    ke.app.handlers.internal_redir_blocked = false;
                });
            }
        },

        checkInternalPagesRedirectSafari: function (updated_tab_id, changeinfo, tab) {
            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(function (tab) {
                    if (!tab.url) {
                        return;
                    }

                    ke.app.handlers.checkInternalPagesRedirect(tab.id, tab);
                });
            });

            var url = tab.url;

            if (url !== undefined
                && changeinfo.status == "complete"
                && url.indexOf('https://www.netflix.com/watch') > -1) {

                if (typeof ga != "undefined") ga('send', 'event', 'videos', 'netflix');
                //console.log('Netflix:', tab);
            }

            if (url !== undefined
                && changeinfo.status == "complete"
                && tab.url.indexOf('https://www.youtube.com/watch') > -1) {

                if (typeof ga != "undefined") ga('send', 'event', 'videos', 'youtube');
                //console.log('Youtube:', tab);
            }

            if (url !== undefined
                && changeinfo.status == "complete"
                && tab.url.indexOf('https://www.amazon') > -1
                && tab.url.indexOf('video') > -1) {

                if (typeof ga != "undefined") ga('send', 'event', 'videos', 'amazon');
                //console.log('Amazon:', tab);
            }

            if (url !== undefined
                && changeinfo.status == "complete"
                && url.indexOf('https://www.icloud.com/#') > -1) {

                if (typeof ga != "undefined") ga('send', 'event', 'icloud', '');
                //console.log('iCloud:', tab);
            }
        },

        checkToken: function (success_callback, all_callback) {
            var token = ke.ext.util.storageUtil.getVal('account_token');
            if (!token) {
                ke.ext.util.storageUtil.setVal('reji_ads', true);
                all_callback();
                return;
            }

            ke.getDeviceData(function (device_data) {
                $.ajax({
                    url: 'https://sync.matetranslate.com/check_token',
                    type: 'GET',
                    dataType: 'json',
                    data: $.extend({
                        token: token,
                        gdpr_consent: ke.ext.util.storageUtil.isTrueOption('gdpr_consent')
                    }, device_data),
                    success: function (r) {
                        if (r && !r.error && r.valid && !r.expired) {
                            success_callback();

                            if (r.user_info) {
                                ke.ext.util.storageUtil.setVal('chr_pro_flag', r.user_info.has_pro);
                            }
                        } else if (!r.valid || r.expired) {
                            ke.ext.util.storageUtil.setVal('account_email', '');
                            ke.ext.util.storageUtil.setVal('account_token', '');
                            ke.ext.util.storageUtil.setVal('account_name', '');
                        }

                        if (!r.error) {
                            ke.ext.util.storageUtil.setVal('reji_ads', r.show_reji_ad);
                        }

                        all_callback();
                    },
                    error: function () {
                        all_callback();
                    }
                });
            });
        },

        runSync: function () {
            ke.app.handlers.checkToken(function () {
                if (!ke.canSync) {
                    return;
                }

                //console.time('histsync');
                ke.particles.sync.model.syncHistory(function (r) {
                    //console.timeEnd('histsync');
                });

                //console.time('pbsync');
                ke.particles.sync.model.syncPhrasebook(function (r) {
                    //console.timeEnd('pbsync');
                });
            }, function () {
                if (ke.IS_CHROME) {
                    ke.app.handlers.fetchOldIAPStatus();
                }
            });
        },

        pickFastestMateServer: function (callback) {
            var p = new Ping();
            var responses = 0;
            var first_response;
            var pick = function (ms) {
                ++responses;

                if (responses === 2) {
                    if (ms > first_response) {
                        ke.ext.util.storageUtil.setVal('misc_server', '2');
                    } else {
                        ke.ext.util.storageUtil.setVal('misc_server', '');
                    }

                    callback();
                } else {
                    first_response = ms;
                }
            };

            p.ping('https://api.matetranslate.com', function (err, ms) {
                pick(ms);
            });

            p.ping('https://api2.matetranslate.com', function (err, ms) {
                pick(ms);
            });
        },

        // Chrome only
        fetchOldIAPStatus: function () {
            ke.import('lib.buy', function () {
                google.payments.inapp.getPurchases({
                    'parameters': {'env': 'prod'},
                    'success': function (r) {
                        if (r.response.details.length > 0
                            && (r.response.details[0].sku === ke.getAppConst("CHR_PRO_SKU")
                                || r.response.details[0].sku === ke.getAppConst("CHR_PRO_OLD_SKU"))) {
                            ke.ext.util.storageUtil.setVal('chr_pro_flag', true);
                        }
                    },
                    'failure': function (r) {
                    }
                });
            });
        },

        loadGoogleWidget: function (info, tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: ke.processCall('app', 'trans', 'fullPage'),
                from: ke.ext.util.langUtil.getFromLang(),
                to: ke.ext.util.langUtil.getToLang()
            });

            if (typeof ga != "undefined") ga('send', 'event', 'translation', 'fullpage');

            //
            // count translations by type

            if (Date.now() - ke.ext.util.storageUtil.getIntValue('last_trans_count_upd') >= ke.TIME.ONE_DAY) {
                ke.app.handlers.sendTranslationsCount();
            }

            ke.ext.util.storageUtil.setJsonField('translations_count', 'fullpage',
                +ke.ext.util.storageUtil.getJsonField('translations_count', 'fullpage') + 1);
            ke.ext.util.storageUtil.setJsonField('all_trans_count', 'fullpage',
                +ke.ext.util.storageUtil.getJsonField('all_trans_count', 'fullpage') + 1);

            ke.app.handlers._processEventHandlers.app.opt.updateUninstallUri();
        },

        sendInstallEvent: function () {
            if (!ke.ext.util.storageUtil.isTrueOption('install_event')) {
                ke.ext.util.storageUtil.setVal('install_event', true);

                chrome.tabs.query({}, function (tabs) {
                    if (typeof ga != "undefined") ga('send', 'event', 'background', 'install', 'tabs-' + tabs.length);

                    $.ajax({
                        url: 'https://sync.matetranslate.com/add_dev',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            d_id: ke.ext.util.storageUtil.getVal('user_id'),
                            d: ke.PLATFORM_CODE,
                            l: ke.getLocale('@@ui_locale'),
                            v: ke.ext.util.storageUtil.getVal('ext_ver'),
                            tl: tabs.length
                        },
                        success: function (r) {
                            if (r.success && typeof ga != "undefined") {
                                ga('send', 'event', 'background', 'install', 'sent');
                            }
                        },
                        error: function (e) {
                            if (typeof ga != "undefined") {
                                ga('send', 'event', 'background', 'install', 'failed');
                            }
                        }
                    });
                });
            }
        },

        sendTranslationsCount: function () {
            if (Date.now() - ke.ext.util.storageUtil.getIntValue('last_trans_count_upd') >= ke.TIME.ONE_DAY) {
                var full_date = new Date();
                var date = new Date(full_date.getYear(), full_date.getMonth(), full_date.getDate(), 0, 0, 0, 0);
                var vals = ke.ext.util.storageUtil.getDecodedVal('translations_count');

                $.ajax({
                    url: 'https://sync.matetranslate.com/save_analytics',
                    type: 'GET',
                    dataType: 'JSON',
                    data: $.extend(vals, {
                        date: date.getTime(),
                        user_id: ke.ext.util.storageUtil.getVal('user_id')
                    }),
                    success: function (r) {
                        if (r.success && typeof ga != "undefined") {
                            ga('send', 'event', 'background', 'trans-count', 'sent');
                        }
                    },
                    error: function (e) {
                        if (typeof ga != "undefined") {
                            ga('send', 'event', 'background', 'trans-count', 'failed');
                        }
                    }
                });

                ke.ext.util.storageUtil.encodeAndSet('translations_count', ke.ext.const.storage.DEFAULT_VALUES.TRANSLATIONS_COUNT);
                ke.ext.util.storageUtil.setVal('last_trans_count_upd', Date.now());
            }
        }
    });

})();