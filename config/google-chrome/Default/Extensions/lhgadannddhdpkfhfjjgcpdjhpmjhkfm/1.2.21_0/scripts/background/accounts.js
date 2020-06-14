function MSAccountsManager() {
    const self = this;

    const _dependencies = {
        aes: new AESCryptoProvider(),
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager,
        tabs: new MSTabsManager()
    };

    self.list = {};
    self.supports_upload_to = ['monosnap', 'amazon_s3'];

    self.accountSettingApplyHandler = function (request, callback) {
        let account = self.get.with_id(request.account_id);
        // console.log(account, request.values);
        if (account) {
            switch (account.service) {
                case 'amazon_s3':
                    if (request.values instanceof Object) {
                        account.settings.apply(request.values, request.override_defaults).then(callback, callback);
                    }
                    break;

                default:
                // Pass
            }
        }
    };

    async function _initialize() {
        _assign_event_handlers();

        const accounts = ms_app_data.get('accounts');
        if (Array.isArray(accounts)) {
            const monosnap = accounts.find((a) => a.service === 'monosnap');
            const s3 = accounts.find((a) => a.service === 'amazon_s3');
            self.list = {
                monosnap: new MSAccount('monosnap', (monosnap) ? monosnap : {}),
                amazon_s3: new MSAccount('amazon_s3', (s3) ? s3 : {})
            };
        }
    }

    function _assign_event_handlers() {
        ChromeEventsAPI.storage_updated({
            'accounts': function (new_value, old_value) {
                if (!Array.isArray(new_value) || !new_value.length) {
                    console.log('[Accounts] Logout!');
                    self.list.monosnap.logout();
                    self.list.amazon_s3.logout();
                }
            }
        });

        _dependencies.transmitter.subscribe({
            'import_accounts': function (request, callback) {
                if (request.data && request.password) {
                    self.import_from_file(request.data, request.password)
                        .then(function (accounts) {
                            _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_accounts_import_success')});
                            callback({});
                        })
                        .catch(function () {
                            _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_accounts_import_fail')});
                        });
                }
            },

            'export_accounts': function (request, callback) {
                if (typeof request.password === 'string' && request.password) {
                    self.export_to_file(request.password, request.accounts).then(function () {
                        _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_accounts_export_success')});
                        callback({});
                    });
                }
            },

            'account_login': function (request, callback) {
                if (request.service && request.credentials) {
                    switch (request.service) {
                        case 'monosnap':
                            self.list.monosnap.login(request.credentials.email, request.credentials.password).then(
                                () => callback({}),
                                (e) => console.log(e)
                            );
                            break;

                        case 'amazon_s3':
                            self.list.amazon_s3.import(request.credentials, ((request.initiated_by_user != undefined) ? request.initiated_by_user : true)).then(
                                () => callback({}),
                                (e) => console.log(e)
                            );
                            break;
                    }
                } else {
                    console.log('')
                }
            },

            'account_settings_apply': self.accountSettingApplyHandler,

            'account_logout': function (request, callback) {
                let account = self.get.with_id(request.account_id);
                if (account) {
                    account.logout();
                    self.save().then(() => callback({}));
                }
            },
        });
        _dependencies.transmitter.local.subscribe({
            'save_accounts': function (data) {
                let callback;
                if(data && typeof data.callback === "function"){
                    callback = data.callback;
                }
                self.save().then(() => {
                    if(callback) {
                        callback();
                    }
                });
            },
            "account_settings_apply": function (data) {
                self.accountSettingApplyHandler(data, data.callback);
            },
            "account_settings_apply_okta": function (data) {
                self.accountSettingApplyHandler(data, data.callback);
                self.list.amazon_s3.import(data.values, false);
            },
            'account_logout_all': (request, callback) => {
                const accountKeys = Object.keys(self.list);

                accountKeys.forEach((accountKey) => {
                    const account = self.list[accountKey];
                    if (account && typeof account.logout === "function") {
                        account.logout();
                    }
                });

                self.save();
            }
        });
    }

    self.get = {
        with_id: function (id) {
            for (let service in self.list) {
                if (self.list.hasOwnProperty(service)) {
                    const account = self.list[service];
                    if (account.id === id) {
                        return account;
                    }
                }
            }
        },

        logged: function (services_only = true) {
            const services = Object.keys(self.list).filter(
                service => (self.list[service].is_logged === true)
            );
            return (services_only) ? services : services.map((name) => self.list[name]);
        }
    };

    self.import = function (accounts, initiated_by_user = false) {
        accounts
            .filter(a => is_instance(a, 'Object') && self.supports_upload_to.has(a.service))
            .forEach(function (data) {
                const account = self.list[data.service];
                account.reset();
                self.save().then(() => account.import(data, initiated_by_user));
            });
    };

    self.export = function (ids) {
        const accounts = [];
        (Array.isArray(ids) && ids.length) ?
            ids.forEach(function (id) {
                const a = self.get.with_id(id);
                if (a) {
                    accounts.push(a.export());
                }
            }) :
            Object.keys(self.list).forEach(function (service) {
                const a = self.list[service];
                if (a.is_logged) {
                    accounts.push(a.export());
                }
            });
        return accounts;
    };

    self.import_from_file = function (data, password) {
        console.log('[Accounts] Import from file');
        return new Promise(async function (resolve, reject) {
            try {
                const raw_data = await _dependencies.aes.decrypt(data, password);
                const accounts = JSON.parse(raw_data);
                console.log(accounts);
                if (Array.isArray(accounts)) {
                    self.import(accounts, true);
                    resolve(accounts);
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    self.export_to_file = function (password, accounts_ids) {
        console.log('[Accounts] Export to file');
        return new Promise(async function (resolve, reject) {
            try {
                const accounts = self.export(accounts_ids);
                const data = await _dependencies.aes.encrypt(JSON.stringify(accounts), password);
                ms_core.file.local.save(new Blob([data]), 'accounts.monosnap');
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    };

    self.save = function () {
        console.log('[Accounts] Updating storage');

        const setObj = {accounts: self.export()};
        let setRes = ms_app_data.set(setObj);
        const monosnap = self.list.monosnap;
        if (monosnap.is_logged && monosnap.user.refresh) {
            monosnap.user.refresh();
        }


        return setRes;
    };

    _initialize();
}

function MSAccount(service, data) {
    const self = this;
    self.id = generate_random_string(10);

    switch (service) {
        case 'monosnap':
            return new MonosnapAccount(data);
        case 'amazon_s3':
            return new S3Account(data);
    }
}
