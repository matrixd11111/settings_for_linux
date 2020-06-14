function MSSettingsAccountsSection() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager
    };

    function _initialize() {
        _ui.initialize();

        _dependencies.transmitter.subscribe({
            'account_updated': function (request, callback) {
                console.log(`[Accounts] Refresh UI (${request.service})`);
                _ui.update_state();
                if (request.service === _selected) {
                    switch (request.service) {
                        case 'monosnap':
                            _list.monosnap.refresh(false);
                            break;
                        case 'amazon_s3':
                            _list.amazon_s3.refresh();
                            break;
                    }
                }
            }
        });

        _dependencies.transmitter.local.subscribe({
            'move_to_amazon_setting_page': () => {
                _ui.select("amazon_s3");
            }
        });
    }

    const _accounts = bg.ms_accounts.list;
    let _selected = null;

    const _list = {
        monosnap: new MonosnapAccountSettings({
            login_form: '#ms_login_form',
            user_mail_input: '#ms_user_mail_input',
            user_password_input: '#ms_user_password_input',
            login_button: '#ms_login_submit_button',
            login_with_fb_button: '#ms_login_with_fb_button',
            profile_wrapper: '#ms_profile',
            user_name: '#ms_profile_name',
            user_email: '#ms_profile_email',
            logout_button: '#ms_logout_button',
        }),
        amazon_s3: new S3_AccountSettings()
    };

    const _ui = {
        $elements: {},

        initialize: function () {
            _ui.$elements.overlay = $('.accounts_overlay');
            _ui.$elements.import = {
                trigger: $('#settings_accounts_import'),
                form: $('#accounts_import_form'),
                data_file_input: $('#settings_accounts_import_input'),
                password_input: $('#settings_import_password_input'),
                submit_button: $('#settings_import_submit'),
                cancel_button: $('#settings_import_cancel')
            };
            _ui.$elements.export = {
                trigger: $('#settings_accounts_export'),
                form: $('#accounts_export_form'),
                password_input: $('#settings_export_password_input'),
                accounts_list: $('#accounts_to_export_list'),
                submit_button: $('#settings_export_submit'),
                cancel_button: $('#settings_export_cancel')
            };

            // Navigation
            $(document).on('click', '.account_select_button', function () {
                _ui.select(this.dataset.service);
            });

            // Import data
            // TODO: Allow user to select what accounts should be imported
            _ui.$elements.import.trigger.on('click', function (e) {
                _ui.$elements.import.data_file_input.trigger('click');
            });

            _ui.$elements.import.data_file_input.on('change', function (e) {
                if (this.files.length > 0) {
                    _import.ui.show();
                } else {
                    alert('Please, select file with accounts data');
                }
            });

            _ui.$elements.import.password_input.on('input', function (e) {
                _ui.$elements.import.submit_button.prop('disabled', (this.value === ''));
            });

            _ui.$elements.import.form.on('submit', function (e) {
                console.log('[Accounts] Import settings');
                e.preventDefault();

                const password = _ui.$elements.import.password_input.val();
                if (_ui.$elements.import.data_file_input.prop('files').length && password) {
                    _import.submit(_ui.$elements.import.data_file_input.prop('files')[0], password);
                }
            });

            _ui.$elements.import.cancel_button.on('click', _import.ui.hide);

            // Export data
            _ui.$elements.export.trigger.on('click', function () {
                const logged_in_services = Object.keys(_accounts).filter((service) => _accounts[service].is_logged === true);
                if (logged_in_services.length) {
                    _export.ui.show();
                } else {
                    _dependencies.notifications.show({
                        message: chrome.i18n.getMessage('notification_accounts_export_logged_absent'),
                        hide_delay: 4
                    })
                }
            });

            _ui.$elements.export.password_input.on('input', _export.verify_input);

            $(document).on('change', '.account_to_export', function (e) {
                const account_id = this.dataset.account_id;
                if (this.checked) {
                    _export.selected.push(account_id);
                } else {
                    _export.selected = _export.selected.filter((id) => (id !== account_id));
                }
                _export.verify_input();
            });

            _ui.$elements.export.form.on('submit', function (e) {
                console.log('[Accounts] Export settings');
                e.preventDefault();

                const password = _ui.$elements.export.password_input.val();
                if (password) {
                    _export.submit(password);
                }
            });

            _ui.$elements.export.cancel_button.on('click', _export.ui.hide);
        },

        // TODO: Add support for multiple accounts (of the same type)
        select: function (service = 'monosnap') {
            $('.account_select_button').removeClass('active');
            $(`.account_select_button[data-service=${service}]`).addClass('active');
            $('.account_section').hide();
            $(`.account_section[data-service=${service}]`).show();

            _selected = service;
            switch (service) {
                case 'monosnap':
                    _list.monosnap.refresh();
                    break;
                case 'amazon_s3':
                    _list.amazon_s3.refresh();
                    break;
            }
        },

        update_state: function () {
            $('.account_select_button').each(function (index, element) {
                const service = element.dataset.service;
                (_accounts[service].is_logged) ? $(element).addClass('logged') : $(element).removeClass('logged')
            });
        }
    };

    self.select = _ui.select;

    const _import = {
        ui: {
            show: function () {
                _ui.$elements.overlay.show();
                _ui.$elements.export.form.hide();
                _ui.$elements.import.form.show();
                _ui.$elements.import.password_input.val('').focus();
                _ui.$elements.import.submit_button.prop('disabled', true);
            },

            hide: function () {
                _ui.$elements.import.form.trigger('reset');
                _ui.$elements.overlay.hide();
            }
        },

        submit: function (file, password) {
            get_file_data(file, 'text').then(
                (encrypted_accounts) => _dependencies.transmitter.broadcast(
                    'import_accounts',
                    {
                        data: encrypted_accounts,
                        password: password
                    }
                ).then(_import.ui.hide)
            );
        }
    };

    const _export = {
        selected: [],

        ui: {
            show: function () {
                _export.selected = [];
                _ui.$elements.overlay.show();
                _ui.$elements.import.form.hide();
                _ui.$elements.export.form.show();
                _ui.$elements.export.password_input.val('').focus();
                _export.ui.render_available();
                _ui.$elements.export.submit_button.prop('disabled', true);
            },

            render_available: function () {
                _ui.$elements.export.accounts_list.empty();
                Object.keys(_accounts).forEach(function (service) {
                    const account = _accounts[service];
                    if (account.is_logged) {
                        _export.selected.push(account.id);
                        _ui.$elements.export.accounts_list.append(`
                            <span>
                                <input type="checkbox" checked="checked" data-account_id="${account.id}" class="account_to_export">
                                <label>${account.label}</label>
                            </span>
                        `);
                    }
                });
            },

            hide: function () {
                _ui.$elements.export.form.trigger('reset');
                _ui.$elements.overlay.hide();
            }
        },

        verify_input: function () {
            const its_alright = _ui.$elements.export.password_input.val() && _export.selected.length;
            _ui.$elements.export.submit_button.prop('disabled', !its_alright);
        },

        submit: function (password) {
            _dependencies.transmitter.broadcast(
                'export_accounts',
                {
                    password: password,
                    accounts: _export.selected
                }
            ).then(_export.ui.hide);
        }
    };

    _initialize();
}

function MonosnapAccountSettings(selectors) {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    const _account = bg.ms_accounts.list.monosnap;

    function _initialize(selectors) {
        _ui.initialize(selectors);
    }

    const _ui = {
        $elements: {},

        initialize: function (selectors) {
            if (typeof selectors === 'object') {
                Object.keys(selectors).forEach((key) => _ui.$elements[key] = $(selectors[key]));

                _ui.$elements["okta"] = new OktaBlock(_dependencies.transmitter);
                _ui.$elements["okta"].init();

                _ui.assign_event_handlers();
                _ui.initialize_context();
            }
        },

        assign_event_handlers: function () {
            _ui.$elements.user_mail_input.on('keyup', _check_submit_button_state);
            _ui.$elements.user_password_input.on('keyup', _check_submit_button_state);

            function _check_submit_button_state() {
                const email = _ui.$elements.user_mail_input.val(),
                    password = _ui.$elements.user_password_input.val();
                _ui.$elements.login_button.prop('disabled', !(email && password));
            }

            _ui.$elements.login_button.on('click', function (e) {
                const email = _ui.$elements.user_mail_input.val(),
                    password = _ui.$elements.user_password_input.val();
                _auth.login(email, password).then((response) => console.log(response))
            });

            _ui.$elements.login_with_fb_button.on('click', _auth.fb.start);

            _ui.$elements.logout_button.on('click', _auth.logout);
        },

        initialize_context: function () {
            console.log(`[Accounts] Monosnap: rendering UI (logged in:${_account.is_logged})`);

            if (_account.is_logged) {
                _ui.$elements.logout_button.show();
                _ui.$elements.login_form.hide();
                _ui.$elements.profile_wrapper.show();
                if (Object.keys(_account.okta).length > 0) {
                    _ui.$elements.okta.show()
                } else {
                    _ui.$elements.okta.hide()
                }

                _ui.render_profile(_account.data.user);
            } else {
                _ui.$elements.logout_button.hide();
                _ui.$elements.login_form.show();
                _ui.$elements.profile_wrapper.hide();
                _ui.$elements.okta.hide();
                _ui.prepare_login_form();
            }
        },

        prepare_login_form: function () {
            _ui.$elements.user_mail_input.val('');
            _ui.$elements.user_password_input.val('');
            _ui.$elements.login_button.prop('disabled', true);
        },


        render_profile: function (user) {

            if (_ui.$elements.user_email) {
                _ui.$elements.user_email.text(user.email.truncate(30));
            }
            _ui.$elements.user_name.text(user.name.truncate(20));
        }
    };

    const _auth = {
        fb: {
            start: () => _dependencies.transmitter.broadcast('login_with_fb', {phase: 'start'})
        },

        login: (email, password) => _dependencies.transmitter.broadcast(
            'account_login',
            {
                service: 'monosnap',
                credentials: {
                    email: email,
                    password: password
                }
            }
        ),

        logout: () => _dependencies.transmitter.broadcast('account_logout', {account_id: _account.id})
    };

    self.refresh = function (retrieve_info = true) {
        if (retrieve_info) {
            if (_account.is_logged) {
                _account.user.refresh();
            }
        } else {
            _ui.initialize_context();
        }
    };

    _initialize(selectors);
}

function S3_AccountSettings() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager
    };

    const _account = bg.ms_accounts.list.amazon_s3;

    function _initialize() {
        _settings.values = _account.data._extract(['access_key_id', 'access_secret_key', 'region', 'use_ssl']);
        _ui.initialize();
    }

    const _settings = {
        values: {},

        apply: (values, override_defaults = false) => _dependencies.transmitter.broadcast(
            'account_settings_apply',
            {
                account_id: _account.id,
                values: (values instanceof Object) ? values : _settings.values,
                override_defaults: override_defaults
            }
        ),

        test: function (account_settings) {
            // console.log(account_settings);
            _dependencies.transmitter.broadcast(
                'account_login',
                {
                    service: 'amazon_s3',
                    credentials: account_settings || _settings.values
                }
            );
        }
    };

    window._ui = {
        $elements: {},
        templates: {
            aws_region_item: ejs.get_template('/settings/aws_region_menu_item.ejs'),
            aws_bucket_item: ejs.get_template('/settings/aws_bucket_menu_item.ejs')
        },

        initialize: function () {
            _ui.$elements = {
                access_key_input: $('#aws_access_key_input'),
                secret_key_input: $('#aws_secret_key_input'),
                signature_version_select: $('#aws_signature_version_selector'),
                region_select: $('#aws_region_selector'),
                use_ssl_checkbox: $('#aws_ssl_enable_checkbox'),
                bucket_select: $('#aws_s3_bucket_selector'),
                base_url_input: $('#aws_s3_base_url_input'),
                path_input: $('#aws_s3_path_input')
            };

            _ui.assign_event_handlers();
        },

        assign_event_handlers: function () {
            _ui.$elements.access_key_input.on('input', function () {
                _settings.values.access_key_id = this.value;
                _settings.apply({access_key_id: this.value}, true);
            });

            _ui.$elements.secret_key_input.on('input', function () {
                _settings.values.secret_access_key = this.value;
                _settings.apply({secret_access_key: this.value}, true);
            });

            _ui.$elements.region_select.on('change', function (e) {
                if (is_triggered_by_user(e)) {
                    const region = this.value;
                    _settings.values.region = region;
                    _settings.apply({region: this.value}, true);

                    _ui.render_ssl_enable_checkbox(true);

                    const base_url = S3_API.regions.get_base_url(region);
                    _ui.$elements.base_url_input.prop('placeholder', base_url);
                    // _settings.apply({base_url: base_url}, true);
                }
            });

            _ui.$elements.use_ssl_checkbox.on('change', function (e) {
                if (is_triggered_by_user(e)) {
                    _settings.values.use_ssl = this.checked;
                    _settings.apply({use_ssl: this.checked}, true);
                }
            });

            $(document).on('click', '#aws_s3_connect', function () {
                const settings = {
                    access_key_id: _ui.$elements.access_key_input.val(),
                    secret_access_key: _ui.$elements.secret_key_input.val(),
                    region: _ui.$elements.region_select.prop('value'),
                    use_ssl: _ui.$elements.use_ssl_checkbox.prop('checked')
                };
                if (settings.access_key_id && settings.secret_access_key) {
                    _settings.test(settings);
                }
            });

            // TODO: Automatically check bucket's location (if received region differs from a specified one — it must be updated)
            _ui.$elements.bucket_select.on('change', function (e) {
                if (is_triggered_by_user(e)) {
                    if (_account.is_logged) {
                        _settings.apply({bucket: this.value});
                    }
                }
            });

            _ui.$elements.path_input.on('change', function (e) {
                if (is_triggered_by_user(e)) {
                    _settings.apply({path: this.value}, true);
                }
            });

            _ui.$elements.base_url_input.on('change', function (e) {
                if (is_triggered_by_user(e)) {
                    _settings.apply({base_url: this.value}, true);
                }
            });
        },

        render: function () {
            const data = (_account.is_logged) ? _account.data : _account.get_defaults();

            _ui.render_buckets_selector((_account.is_logged) ? _account.bucket.list : [], data.bucket);

            _ui.$elements.access_key_input.val(data.access_key_id);
            _ui.$elements.secret_key_input.val(data.secret_access_key);
            _ui.$elements.signature_version_select.val(data.signature_version);

            const regions = S3_API.regions.filter_by_signature_version(data.signature_version);
            _ui.render_regions_selector(regions, data.region);

            _ui.render_ssl_enable_checkbox(data.use_ssl);

            _ui.$elements.path_input.val(data.path);
            _ui.$elements.base_url_input
                .prop('placeholder', S3_API.regions.get_base_url(data.region))
                .val(data.base_url);
        },

        render_regions_selector: function (regions, select_after) {
            const $container = _ui.$elements.region_select.empty();
            if (regions.length) {
                regions.forEach(function (r) {
                    $container.append(_ui.templates.aws_region_item.render({region: r}));
                });

                $container
                    .val((typeof select_after === 'string') ? select_after : regions[0].name)
                    .trigger('change');
            }
        },

        render_ssl_enable_checkbox: function (state) {
            _ui.$elements.use_ssl_checkbox
                .prop({'checked': state})
                .trigger('change');
        },

        render_buckets_selector: function (buckets, select_after) {
            const $container = _ui.$elements.bucket_select.empty();

            if (buckets.length) {
                buckets.forEach(
                    b => $container.append(
                        _ui.templates.aws_bucket_item.render({bucket: b})
                    )
                );
                $container.val(select_after);
                $container.trigger('change');
            }
        }
    };

    self.refresh = _ui.render;

    _initialize();
}
