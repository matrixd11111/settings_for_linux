function S3Account(data = {}) {
    const self = this;
    const _api = new S3_API(self.id);

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager,
        tabs: new MSTabsManager()
    };

    // TODO: Generate truly unique ID at the accounts manager level
    self.id = generate_random_string(10);
    self.service = 'amazon_s3';
    self.label = 'AWS S3';
    self.data = {};

    self.is_logged = false;

    function _initialize(account) {
        self.context_menu.assign_event_handlers();

        self.reset();
        self.import(account, false);
    }

    const _default_state = {
        pure: {
            access_key_id: '',
            secret_access_key: '',
            signature_version: 'v4',
            use_ssl: true,
            region: 'us-east-1',
            bucket: '',
            path: '',
            base_url: ''
        },
        values: {},

        modify: function (diff = {}) {
            if (diff instanceof Object) {
                Object.assign(_default_state.values, diff);
            }
        }
    };

    self.get_defaults = () => _default_state.values;

    const _ui = {
        update: {
            wrapper: function (event = {}) {
                Object.assign(event, {service: self.service});
                _dependencies.transmitter.broadcast('account_updated', event);
                _dependencies.transmitter.local.broadcast('account_updated', event);
            },

            login: () => _ui.update.wrapper({event: 'login'}),

            buckets_loaded: function (list) {
                _ui.update.wrapper({
                    event: 'buckets_loaded',
                    folders: list
                });
            },

            logout: () => _ui.update.wrapper({event: 'logout'})
        }
    };

    self.context_menu = {
        root_id: 'ms_upload_to_s3_submenu',

        items: {
            id_prefix: 's3_bucket_',

            get: function () {
                const buckets = self.bucket.list;
                return (buckets.length) ?
                    [{
                        id: self.context_menu.root_id,
                        text: chrome.i18n.getMessage('context_menu_upload_to_s3'),
                        items: buckets.map(
                            (b) => ({
                                id: `${self.context_menu.items.id_prefix}${b.Name}`,
                                text: b.Name
                            })
                        )
                    }] :
                    [];
            }
        },

        assign_event_handlers: function () {
            ChromeEventsAPI.click_on_context_menu_item(function (info, target_tab) {
                const bucket_regex = new RegExp(`^${self.context_menu.items.id_prefix}(\\w+)$`);
                const bucket_name = bucket_regex.exec(info.menuItemId);
                // console.log(info.menuItemId, bucket_regex, bucket_name);

                if (bucket_name !== null) {
                    const image_url = info.srcUrl;

                    _dependencies.transmitter.broadcast('get_image_title', {url: image_url}, target_tab.id)
                        .then(function (title) {
                            ga_send_event('Context menu', 'Upload to Amazon S3');
                            get_image_data_from_url(image_url)
                                .then(function (image_blob) {
                                    const session = ms_core.sessions.create({
                                        type: 'screenshot',
                                        data: image_blob,
                                        title: title || target_tab.title,
                                        tab: _dependencies.tabs.extract_info(target_tab),
                                        context: 'context_menu',
                                        temporary: true
                                    });
                                    session.upload({
                                        service: 'amazon_s3',
                                        destination: bucket_name[1]
                                    });
                                });
                        });
                }
            });
        }
    };

    self.settings = {
        filter: function (parameters) {
            const allowed_fields = [
                'access_key_id', 'secret_access_key', // 'signature_version',
                'use_ssl', 'region', 'bucket', 'path', 'base_url'
            ];
            return parameters._extract(allowed_fields);
        },

        apply: function (parameters, override_defaults = true) {
            return new Promise(function (resolve, reject) {
                const data = self.settings.filter(parameters);

                if (self.is_logged) {
                    _api.config.apply(parameters);
                    Object.assign(self.data, parameters);
                    console.log(self.data);
                    if (override_defaults) {
                        _default_state.modify(parameters);
                        console.log(_default_state.values);
                    }

                    self.save().then(() => {

                        const current_bucket = parameters.bucket || self.data.bucket;
                        if (typeof current_bucket === 'string' && current_bucket) {
                            _api.bucket.get_location(current_bucket).then(function (location) {
                                console.log('[Amazon S3] Region select', location, current_bucket);

                                var current_region = parameters.region || self.data.region;
                                var correct_region = S3_API.regions.get_by_location_constraint(location);
                                console.log(`[S3 Region] Current=${current_region}; correct=${correct_region ? correct_region.name : 'undefined'} (location is ${location})`);
                                if (correct_region && (correct_region.name !== current_region)) {
                                    _dependencies.notifications.show({
                                        title: 'Amazon S3',
                                        message: chrome.i18n.getMessage('notification_s3_wrong_region') + correct_region.name,
                                        hide_delay: 6
                                    });
                                }
                            });
                        }
                        resolve();
                    });
                } else {
                    if (override_defaults) {
                        _default_state.modify(parameters);
                        console.log(_default_state.values);
                    }
                    resolve();
                }
            });
        }
    };

    self.bucket = {
        list: [],

        get_list: function () {
            return new Promise(function (resolve, reject) {
                _api.bucket.get_list()
                    .then(function (data) {
                        self.bucket.list = (Array.isArray(data.buckets)) ? data.buckets : [];
                        _ui.update.buckets_loaded(self.bucket.list);
                        resolve(self.bucket.list);
                    })
                    .catch(reject);
            });
        }
    };

    self.file = {
        upload: _api.file.upload,

        get_link: _api.file.get_link,

        process_title: _api.file.process_title,

        download: function (bucket, key) {
            return new Promise(function (resolve, reject) {
                _api.file.get(bucket, key)
                    .then(function (data) {
                        const file = new Blob([data.body], {type: data.mime_type});
                        resolve(file);
                    })
                    .catch(reject);
            });
        }
    };

    self.save = () => {
        return new Promise((resolve) => {
            _dependencies.transmitter.local.broadcast('save_accounts', {
                callback: resolve
            });
        });

    };

    self.reset = function () {
        self.is_logged = false;

        _default_state.values = Object.assign({}, _default_state.pure);
        self.data = Object.assign({}, _default_state.values);
        self.bucket.list = [];
    };

    self.import = function (account = {}, initiated_by_user = true) {
        return new Promise(function (resolve, reject) {
            // console.log(account);
            if (typeof account.access_key_id === 'string' && typeof account.secret_access_key === 'string') {
                // Forcing usage of SSL and Signature Version 4
                Object.assign(account, {
                    signature_version: _default_state.pure.signature_version,
                    use_ssl: _default_state.pure.use_ssl
                });

                _api.credentials.test(account)
                    .then(function () {
                        self.is_logged = true;

                        // TODO: Check parameters for absence
                        self.data = Object.assign(
                            {},
                            _default_state.values,
                            self.settings.filter(account)
                        );
                        _api.config.apply(self.data);
                        _ui.update.login();

                        self.bucket.get_list();

                        if (initiated_by_user) {
                            ga_send_event('Auth', 'S3 Login', 'Success');
                            self.save();

                            _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_s3_connection_success')});
                        }


                        _dependencies.transmitter.broadcast(
                            'account_login_error',
                            {
                                service: 'amazon_s3',
                                error: null
                            }
                        );
                        resolve(self.data);
                    })
                    .catch(function (e) {
                        self.data = self.settings.filter(account);
                        let message = chrome.i18n.getMessage('notification_s3_wrong_credentials');
                        let title = 'Amazon S3';
                        if (e['message'] != undefined) {
                            let msg = e['message'];
                            //console.log({e})
                            let errs = [
                                {
                                    our:
                                        {
                                            msg: "Please check your AWS S3 credentials.",
                                            title: "Wrong Access Key ID or Secret Access Key"
                                        },
                                    aws: "The request signature we calculated does not match the signature you provided"
                                },
                                {
                                    our:
                                        {
                                            msg: "Please check your AWS S3 credentials.",
                                            title: "Wrong Access Key ID or Secret Access Key"
                                        },
                                    aws: "The AWS Access Key Id you provided does not exist in our records."
                                },

                                {
                                    aws: "The specified bucket is not valid",
                                    our:
                                        {
                                            msg: "Please try to select another one.",
                                            title: "The specified bucket is not valid"
                                        },
                                },
                                {
                                    aws: "The authorization header is malformed; the region",
                                    our:
                                        {
                                            msg: "Please try to select another one.",
                                            title: "Wrong or missing bucket region"
                                        },
                                },
                                {
                                    aws: "Network Failure",
                                    our:
                                        {
                                            msg: "Please check your internet connection and try again.",
                                            title: "No internet connection"
                                        },
                                },
                            ]
                            for (let i = 0; i < errs.length; i++) {
                                if (errs[i].aws == msg) {
                                    message = errs[i].our.msg;
                                    title = errs[i].our.title;
                                    break;
                                }
                            }
                            _dependencies.transmitter.broadcast(
                                'account_login_error',
                                {
                                    service: 'amazon_s3',
                                    error: {
                                        head: title,
                                        desc: message
                                    }
                                }
                            );

                        }

                        if (initiated_by_user) {
                            ga_send_event('Auth', 'S3 Login', 'Fail');
                            self.save();

                            _dependencies.notifications.show({
                                title: title,
                                message: message
                            });
                        }
                        resolve({});
                    });
            } else {
                console.log('[Account] Amazon S3: Nothing to import.');
                resolve({});
            }
        });
    };

    self.export = () => ({
        service: self.service,
        access_key_id: self.data.hasOwnProperty('access_key_id') ? self.data.access_key_id : _default_state.values.access_key_id,
        secret_access_key: self.data.hasOwnProperty('secret_access_key') ? self.data.secret_access_key : _default_state.values.secret_access_key,
        signature_version: _default_state.values.signature_version, // 'v2' or 'v4'
        use_ssl: self.data.hasOwnProperty('use_ssl') ? self.data.use_ssl : _default_state.values.use_ssl,
        region: self.data.hasOwnProperty('region') ? self.data.region : _default_state.values.region,
        bucket: self.data.hasOwnProperty('bucket') ? self.data.bucket : _default_state.values.bucket,
        path: self.data.hasOwnProperty('path') ? self.data.path : _default_state.values.path,
        base_url: self.data.hasOwnProperty('base_url') ? self.data.base_url : _default_state.values.base_url
    });

    self.logout = function () {
        ga_send_event('Auth', 'S3 Logout');

        self.reset();
        _ui.update.logout();
    };

    _initialize(data);
}
