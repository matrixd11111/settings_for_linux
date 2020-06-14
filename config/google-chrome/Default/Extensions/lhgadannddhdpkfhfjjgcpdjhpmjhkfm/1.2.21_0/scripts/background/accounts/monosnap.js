function MonosnapAccount(data = {}) {
    const self = this;
    window._api = new Monosnap_API(self.id);

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager,
        tabs: new MSTabsManager()
    };

    self.id = generate_random_string(10);
    self.service = 'monosnap';
    self.label = 'Monosnap';
    self.data = {};
    self.okta = {};
    self.is_logged = false;

    async function _initialize(account) {
        self.context_menu.assign_event_handlers();

        _dependencies.transmitter.subscribe({
            // Sign in with Facebook
            'login_with_fb': function (request, callback) {
                switch (request.phase) {
                    case 'start':
                        ga_send_event('Auth', 'Login with Facebook', 'Start');
                        _api.auth.fb.oauth_step1()
                            .then(function (redirect_uri) {
                                _dependencies.tabs.open(redirect_uri).then(() => callback({}));
                            });
                        break;

                    case 'finish':
                        const parameters = location.parse_query(request.url);
                        if (parameters.hasOwnProperty('state') && parameters.hasOwnProperty('code')) {
                            _api.auth.fb.oauth_step2(parameters.state, parameters.code)
                                .then(function (data) {
                                    ga_send_event('Auth', 'Login with Facebook', 'Success');
                                    self.save_state(data.access_token, data.user, 'facebook', true, data);
                                    if (typeof callback === 'function') {
                                        callback(data);
                                    }
                                });
                        } else {
                            console.log('Login with fb failed. No code received');
                        }
                        break;
                }
            },

            'send_feedback': function (request, callback) {
                self.feedback.send(request.email, request.text, request.attach_token).then(() => callback({}))
            }
        });

        self.reset();
        try {
            await self.import(account, false);
        } catch (e) {
            console.error(e);
        }
        _dependencies.transmitter.local.broadcast("monosnap_account_finish_initialized");
    }

    const _ui = {
        update: {
            wrapper: function (event = {}) {
                Object.assign(event, {service: self.service});
                _dependencies.transmitter.broadcast('account_updated', event);
                _dependencies.transmitter.local.broadcast('account_updated', event);
            },

            login: () => _ui.update.wrapper({event: 'login'}),

            folders_loaded: function (list) {
                _ui.update.wrapper({
                    event: 'folders_loaded',
                    folders: list
                });
            },

            user_info: (data) => _ui.update.wrapper({
                event: 'profile_refreshed',
                user: data
            }),

            logout: () => _ui.update.wrapper({event: 'logout'})
        }
    };

    self.context_menu = {
        root_id: 'ms_upload_to_monosnap_submenu',

        items: {
            id_prefix: 'ms_folder_',

            get: function () {
                const folders = self.folder.list;
                return (folders.length) ?
                    [{
                        id: self.context_menu.root_id,
                        text: chrome.i18n.getMessage('context_menu_upload_to_monosnap'),
                        items: folders.map(
                            (f) => ({
                                id: `${self.context_menu.items.id_prefix}${f.id}`,
                                text: f.title
                            })
                        )
                    }] :
                    [];
            }
        },

        assign_event_handlers: function () {
            // TODO: Also take into consideration the destination account (besides folder_id)
            ChromeEventsAPI.click_on_context_menu_item(function (info, target_tab) {
                const folder_regex = new RegExp(`^${self.context_menu.items.id_prefix}(\\w+)$`);
                const folder_id = folder_regex.exec(info.menuItemId);

                if (folder_id !== null) {
                    const image_url = info.srcUrl;

                    _dependencies.transmitter.broadcast('get_image_title', {url: image_url}, target_tab.id)
                        .then(function (title) {
                            ga_send_event('Context menu', 'Upload to Monosnap');
                            get_image_data_from_url(image_url)
                                .then(function (image_blob) {
                                    const session = ms_core.sessions.create({
                                        type: 'screenshot',
                                        data: image_blob,
                                        title: (title || target_tab.title),
                                        tab: _dependencies.tabs.extract_info(target_tab),
                                        context: 'context_menu',
                                        temporary: true
                                    });
                                    session.upload({
                                        service: 'monosnap',
                                        destination: folder_id[1]
                                    });
                                });
                        });
                }
            });
        }
    };

    self.file = {
        upload: (image_blob, preview_blob, title, folder_id, progress, width, height) => _api.file.upload(
            self.data.access_token, image_blob, preview_blob, title, folder_id, progress, width, height
        )
    };

    self.folder = {
        list: [],
        busy: false,
        last_request: Date.now(),
        cool_down_interval: 60,

        get_list: function () {
            return new Promise(function (resolve, reject) {
                self.folder.list = [];

                _api.folder.get_list(self.data.access_token)
                    .then(function (data) {
                        self.folder.list = self.folder.process_data(data.folders);
                        self.folder.last_request = Date.now();
                        _ui.update.folders_loaded(self.folder.list);
                        resolve(self.folder.list);
                    })
                    .catch(reject);
            });
        },

        process_data: (folders) => folders.map(
            f => Object.assign(f, {
                title: f.hasOwnProperty('title') ? f.title : 'Unsorted',
                is_default: (f.id === self.data.user.default_folder_id)
            })
        )
    };

    self.user = {
        process: (user) => ({
            id: user.id,
            name: user.name,
            email: user.email || user.mail,
            photo_url: (user.hasOwnProperty('photo_url')) ? user.photo_url : '/images/defaults/default_avatar.png',
            default_folder_id: user.default_folder_id
        }),

        refresh: () => _api.user.get_info(self.data.access_token).then(function (data) {
            self.data.user = self.user.process(data.user);
            _ui.update.user_info(self.data.user);
            if (data.plan && data.plan.settings && data.plan.settings.storages && data.plan.settings.storages.storage_okta) {
                self.okta = data.plan.settings.storages.storage_okta
            } else {
                self.okta = {}
            }
        })
    };

    self.feedback = {
        send: function (email, message, attach_token = false) {
            return new Promise(function (resolve, reject) {
                _api.feedback.send(
                    email,
                    message,
                    ms_accounts.get.logged(true),
                    attach_token && self.data.access_token
                ).then(function (data) {
                    _dependencies.notifications.show({
                        title: chrome.i18n.getMessage('notification_feedback_send_success_header'),
                        message: chrome.i18n.getMessage('notification_feedback_send_success_message'),
                        hide_delay: 4
                    });
                    resolve(data);
                }).catch(function (data) {
                    _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_feedback_send_fail')});
                    reject();
                });
            });
        }
    };

    self.save = () => _dependencies.transmitter.local.broadcast('save_accounts');

    self.reset = function () {
        self.is_logged = false;

        self.data = {};
        self.folder.list = [];
    };

    self.import = function (account, initiated_by_user = true) {
        if (typeof account.access_token === 'string') {
            const access_token = account.access_token;
            return _api.user.get_info(access_token).then(function (data) {
                self.save_state(access_token, data.user, 'monosnap', initiated_by_user, data);
            }).catch((e) => {
                console.log('[Account] Monosnap: Nothing to import');
            });
        } else {
            console.log('[Account] Monosnap: Nothing to import');
            return Promise.reject('[Account] Monosnap: Nothing to import');
        }
    };

    self.export = () => Object.assign({service: self.service}, self.data._extract(['access_token']));

    self.login = function (email, password) {
        return new Promise(function (resolve, reject) {
            ga_send_event('Auth', 'Login', 'Success');

            _api.auth.login(email, password)
                .then(function (data) {
                    self.save_state(data.access_token, data.user, 'monosnap', true, data);
                    resolve();
                })
                .catch(reject);
        });
    };

    self.save_state = function (access_token, user, login_service = 'monosnap', initiated_by_user = true, fullData) {
        self.is_logged = true;
        self.data = {
            access_token: access_token,
            login_service: login_service,
            user: self.user.process(user)
        };
        _ui.update.login();
        if (fullData && fullData.plan && fullData.plan.settings && fullData.plan.settings.storages && fullData.plan.settings.storages.storage_okta) {
            console.log('this place', fullData.plan.settings.storages.storage_okta);
            self.okta = fullData.plan.settings.storages.storage_okta
        } else {
            self.okta = {}
        }

        self.folder.get_list();

        if (initiated_by_user) {
            _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_monosnap_login_success') + self.data.user.name});
            self.save();
        }

        _dependencies.transmitter.local.broadcast("monosnap_login_successfully");
    };

    self.logout = function () {
        ga_send_event('Auth', 'Logout');

        self.reset();
        _ui.update.logout();

        _dependencies.transmitter.local.broadcast("monosnap_logout_successfully");
    };

    _initialize(data);
}
