const manifest = ChromeRuntimeAPI.get_extension_manifest();
const app_version = manifest.version;
const chrome_version = /Chrome\/((?:\d+\.?)+)/.exec(navigator.userAgent)[1];

var ms_storage;
var ms_platform,
    ms_hardware;
var ms_app_data,
    ms_log;
var ms_core;
var ms_accounts;
var ms_oktaInit;

$(document).ready(function () {
    _init();
});

async function _init() {
    ms_storage = new MSTempStorage();

    ms_platform = await new MSPlatform();
    ms_hardware = new MSHardware();

    ms_app_data = await new MSAppData();
    ms_log = new MSLogger();
    ms_core = new MSCore();
    ms_accounts = new MSAccountsManager();
    if (ms_app_data.get('post_upload_action') == "open_file_page") {
        ms_app_data.set({post_upload_action: "copy_direct_link"});
        ms_app_data.set({open_ms_after_upload: true});
    }
}

function MSCore() {
    const self = this;

    const _dependencies = {
        clipboard: new MSClipboardManager(),
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager,
        pages: new MSViewsManager(),
        tabs: new MSTabsManager()
    };

    function _initialize() {
        ChromeEventsAPI.extension_launched(function () {
            _dependencies.pages.close('all');
        });

        ChromeEventsAPI.extension_suspended(function () {
            _dependencies.pages.close('all');
        });

        _dependencies.transmitter.subscribe({
            // Generic
            'get_platform': (request, callback) => callback({platform: ms_platform.os}),

            // Open files from clipboard
            'open_image_from_clipboard': function (request, callback) {
                console.log('Reading clipboard...');
                _dependencies.transmitter.local.broadcast('paste');
            },

            // Local file open
            'open_local_file': function (request, callback) {
                switch (request.action) {
                    case 'check_size':
                        var file_is_too_big = (request.size > ms_app_data.get('file_size_limit'));
                        if (file_is_too_big) {
                            _dependencies.notifications.show({
                                title: `${chrome.i18n.getMessage('alert_error_header')}`,
                                message: chrome.i18n.getMessage('notification_file_open_too_big')
                            });
                        }

                        callback({ok: !file_is_too_big});
                        break;

                    case 'process':
                        let bytes = new Uint8Array(request.file.data.length);
                        for (let i = 0; i < bytes.length; i++) {
                            bytes[i] = request.file.data.charCodeAt(i);
                        }
                        let blob = new Blob([bytes], {type: request.file.type});

                        self.file.local.process(
                            blob,
                            request.file.name
                        );
                        break;

                    default:
                        self.file.local.open();
                        break;
                }
                callback({});
            },

            // Misc
            'copy_color_to_clipboard': function (request, callback) {
                _dependencies.clipboard.write(request.text).then(
                    () => _dependencies.notifications.show({
                        title: request.text,
                        message: chrome.i18n.getMessage('notification_color_copy_to_clipboard_success')
                    })
                );
                callback({});
            },

            'show_latest_uploads': function (request, callback) {
                _dependencies.pages.open('latest_uploads');
                callback({});
            },

            'get_latest_uploads': (request, callback) => callback({uploads: self.recent_uploads.get()}),

            'copy_link_to_clipboard': (request, callback) => self.file.link.copy(request.url, request.short),

            'open_preferences': (request, callback) => _dependencies.pages.open_preferences(() => callback({})),

            'open_extensions_shortcuts': (request, callback) => _dependencies.pages.open_extensions_shortcuts().then(() => callback({})),

            'reset_app_settings': function (request, callback) {
                console.log('[App state] Reset');
                ms_app_data.reset().then(() => callback({}))
            }
        });

        function createMSInitOkta() {
            return new MSInitOkta(ms_accounts, ms_app_data);
        }

        _dependencies.transmitter.local.subscribe({
            'monosnap_account_finish_initialized': () => {
                ms_oktaInit = createMSInitOkta();
                ms_oktaInit.init();

                ms_oktaInit.subscribeOAuthActions();
                ms_oktaInit.startToRefreshTokens();
            },
            'monosnap_login_successfully': () => {
                ms_oktaInit = createMSInitOkta();

                ms_oktaInit.startToRefreshTokens();
            },
            'monosnap_logout_successfully': () => {
                ms_oktaInit = createMSInitOkta();

                ms_oktaInit.stopToRefreshTokens();
            }
        });

        self.tabs.inject_scripts_to_opened_ones();

        if (ms_platform.os === 'cros') {
            self.file_browser = new ChromeOSFileBrowserManager();
        }

        self.screenshot.reset();
        self.screencast.reset();
    }

    self.hotkeys = new MSHotkeysManager();

    self.context_menu = new MSContextMenuManager();

    self.tabs = {
        inject_scripts_to_opened_ones: function () {
            _dependencies.tabs.get_all().then(function (tabs) {
                tabs.forEach(function (t) {
                    if (!/^chrome\:\/\//.test(t.url)) {
                        _dependencies.tabs.inject_script(t.id, [
                            '/libs/jquery/jquery-1.12.4.min.js',
                            '/libs/ga.js',
                            '/scripts/commons/hotkeys.js',
                            '/content_scripts/area_capture.js',
                            '/content_scripts/generic.js'
                        ]);
                        _dependencies.tabs.insert_css(t.id, ['/content_scripts/generic.css']);
                    }
                });
            });
        }
    };

    self.screenshot = new MSScreenshotCapture();

    self.screencast = new MSScreencastRecorder();

    self.file = {
        title: {
            apply_template: function (template, base_title) {
                let title = base_title || 'File';
                if (template) {
                    title = template.replace(/\%[a-zA-Z]/g, function (match) {
                        var d = new Date();
                        return {
                            'Y': d.getFullYear(),
                            'y': fill_with_zeroes(d.getFullYear() % 100),
                            'm': fill_with_zeroes(d.getMonth() + 1),
                            'd': fill_with_zeroes(d.getDate()),
                            'H': fill_with_zeroes(d.getHours()),
                            'M': fill_with_zeroes(d.getMinutes()),
                            'S': fill_with_zeroes(d.getSeconds()),
                            'U': Math.round(Date.now() / 1000),
                            'C': base_title,
                            'R': Math.floor(100000 * Math.random())
                        }[match.slice(1)];
                    });
                }
                return title;
            },

            generate: function (base_title) {
                return (ms_app_data.get('generate_random_file_names')) ?
                    generate_random_string() :
                    (
                        ms_app_data.get('apply_template_to_file_name') ?
                            self.file.title.apply_template(ms_app_data.get('file_name_template'), base_title) :
                            base_title
                    );
            }
        },

        type_specific_info: {
            mime_type: {
                all: {
                    'png': 'image/png',
                    'jpeg': 'image/jpeg',
                    'webp': 'image/webp'
                },

                get: function (type) {
                    return self.file.type_specific_info.mime_type.all.hasOwnProperty(type) ?
                        self.file.type_specific_info.mime_type.all[type] :
                        type;
                }
            },

            extension: {
                all: {
                    'jpeg': 'jpg'
                },

                get: function (type) {
                    return self.file.type_specific_info.extension.all.hasOwnProperty(type) ?
                        self.file.type_specific_info.extension.all[type] :
                        type;
                }
            }
        },

        link: {
            copy: function (link, copy_short) {
                function copy_link_to_clipboard(url) {
                    _dependencies.clipboard.write(url).then(function () {
                        const entry_id = ms_storage.add_entry(url);
                        console.log(`file_link_copied_${entry_id}`);
                        _dependencies.notifications.show({
                            id: `file_link_copied_${entry_id}`,
                            message: chrome.i18n.getMessage('notification_file_link_copy_success')
                        });
                    });
                }

                copy_short = (typeof copy_short === 'boolean') ? copy_short : ms_app_data.get('enable_short_links');

                if (ms_accounts.list.monosnap.data.user != undefined && (ms_accounts.list.monosnap.data.user.email.match(/Shopify\.com/ig)
                    || ms_accounts.list.monosnap.data.user.email.match(/monosnap\.com/ig))
                    || ms_accounts.list.amazon_s3.data.base_url.match(/screenshot\.click/ig)
                ) {
                    copy_short = false
                }

                if (copy_short) {
                    TakeMS_API.generate_short_link(link)
                        .then((short_url) => copy_link_to_clipboard(short_url))
                        .catch(() => copy_link_to_clipboard(link));
                } else {
                    copy_link_to_clipboard(link);
                }
            }
        },

        local: {
            open: function () {
                //  _dependencies.tabs.active.send_message({message: 'open_local_file'});
            },

            // TODO: Add specific filenames processing for each OS
            save: function (data, file_name) {
                ChromeDownloadsAPI.download({
                    url: get_media_src(data),
                    filename: file_name,
                    // saveAs: true,
                    conflictAction: 'uniquify'
                })
            },

            process: function (file, title) {
                if (file) {
                    const use_defaults = ms_app_data.get('apply_default_action_to_local_files');
                    const selected_action = ms_app_data.get('post_capture_action');
                    const apply_to_local = ms_app_data.get('apply_template_to_local');
                    // ms_app_data.set()

                    const action_to_apply = (use_defaults && (selected_action !== 'save')) ? selected_action : 'edit';

                    const info = {
                        data: file,
                        title: file.name || title,
                        mime_type: file.type,
                        local_file: true
                    };

                    if (is_file_image(file.type)) {
                        self.screenshot.do_post_capture_action(info, action_to_apply);
                    } else if (is_file_video(file.type)) {
                        self.screencast.do_post_record_action(info, action_to_apply);
                    } else {
                        info.type = 'file';
                        info.temporary = true;
                        var session = self.sessions.create(info);
                        session.upload();
                    }
                }
            }
        }
    };

    self.sessions = new MSSessionsManager();

    self.uploads = new MSUploadQueue();
    self.recent_uploads = new MSRecentUploads();
    self.temp = {};

    _initialize();
}

class MSInitOkta {
    constructor(msAccounts, appData) {
        this._dependencies = {
            transmitter: new MSTransmitter(),
        };

        this.msAccounts = msAccounts;
        this.appData = appData;
    }

    init() {
        window.LOG_LEVEL = "INFO";
    }

    subscribeOAuthActions() {
        window.subscribeOktaActions(this._dependencies.transmitter, this.msAccounts, this.appData);
    }

    startToRefreshTokens() {
        window.startToRefreshTokens(this._dependencies.transmitter, this.msAccounts, this.appData);
    }

    stopToRefreshTokens() {
        window.stopToRefreshTokens(this.msAccounts);
    }
}
