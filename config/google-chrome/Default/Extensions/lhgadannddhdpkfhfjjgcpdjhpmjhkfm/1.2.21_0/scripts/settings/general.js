let _account;

function MSSettingsGeneralSection() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    function _initialize() {
        _ui.initialize();
        _account = bg.ms_accounts.list.monosnap;
    }

    const _ui = {
        $elements: {},
        templates: {
            hotkeys_section: ejs.get_template('/settings/hotkeys_section.ejs')
        },

        initialize: function () {
            _ui.$elements.reset = {
                overlay: $('.settings_reset_overlay'),
                trigger: $('#settings_reset_to_defaults'),
                submit_button: $('#settings_reset_submit'),
                dismiss_button: $('#settings_reset_dismiss')
            };
            if (!global_settings.get('generate_random_file_names') && !global_settings.get('apply_template_to_file_name')) {


                $('#apply_to_local').prop('disabled', true);
                $('.label_apply_to_local').toggleClass('disabled', true);
            } else if (global_settings.get('apply_template_to_local')) {
                $('#apply_to_local').prop('disabled', false);

                $('#apply_to_local').prop('checked', true);
                $('.label_apply_to_local').toggleClass('disabled', false);
            }

            _ui.render_hotkeys_section();
            _ui.assign_event_handlers();
        },

        assign_event_handlers: function () {
            // General settings
            $(document).on('change', '#post_capture_action_selector', function () {
                global_settings.set({post_capture_action: this.value});
                $('#apply_default_action_to_local_files').prop('disabled', (this.value === 'save'));
            });

            $(document).on('click', '#file_save_browse_button', function () {
                $('#file_save_path_selector').click();
            });

            $(document).on('change', '#open_editor_in_window_checkbox', function () {
                global_settings.set({open_editor_in_a_separate_window: this.checked});
            });

            $(document).on('change', '#apply_default_action_to_local_files', function () {
                global_settings.set({apply_default_action_to_local_files: this.checked});
            });

            $(document).on('change', '#image_type_selector', function () {
                global_settings.set({image_type: this.value});

                $('#image_quality_input').prop('disabled', (this.value === 'png'));
            });

            // Screencasts
            $(document).on('change', '#image_quality_input', function () {
                global_settings.set({image_quality: (this.value / 100).clamp(0.5, 1.0)});
            });

            $(document).on('change', '#video_type_selector', function () {
                global_settings.set({video_type: this.value});
            });

            $(document).on('change', '#gif_quality_input', function () {
                global_settings.set({gif_quality: parseInt(this.value)});
            });

            $(document).on('change', '#gif_frame_rate_input', function () {
                global_settings.set({gif_frame_rate: parseInt(this.value)});
            });

            $(document).on('change', '#record_microphone', function () {
                global_settings.set({record_microphone: this.checked});
            });

            // TODO: Move to accounts section (check account itself as a default)
            $(document).on('change', '#upload_default_service', function () {
                global_settings.set({default_upload_service: this.value});
            });

            // Upload
            $(document).on('change', '#post_upload_action_selector', function () {
                global_settings.set({post_upload_action: this.value});
            });
            $(document).on('change', '#open_ms_after_upload', function () {
                global_settings.set({open_ms_after_upload: this.checked});
            });
            $(document).on('change', '#file_enable_short_links', function () {
                global_settings.set({enable_short_links: this.checked});
            });

            $(document).on('change', '#post_upload_close_editor', function () {
                global_settings.set({close_editor_after_upload: this.checked});
            });

            // Hotkeys
            $(document).on('click', '.open_global_hotkeys_page', function () {
                _dependencies.transmitter.broadcast('open_extensions_shortcuts');
            });

            // TODO: Re-render hotkeys if conflict detected
            $(document).on('change', '.hotkey_part', function () {
                const shortcut_name = this.dataset.command;
                const keys = [];
                $(`select[data-command=${shortcut_name}]`).each(
                    (index, element) => keys.push(element.value)
                );
                _dependencies.transmitter.broadcast(
                    'update_local_hotkeys',
                    {
                        name: shortcut_name,
                        keys: keys
                    }
                );
            });

            $(document).on('change', '#webpage_enable_hotkeys_checkbox', function () {
                global_settings.set({webpage_enable_hotkeys: this.checked});
            });

            // Others
            $(document).on('change', '#file_use_random_generated_name', function () {
                global_settings.set({generate_random_file_names: this.checked});
                $('#file_name_template_input').prop('disabled', this.checked);
                $('#apply_file_name_template_checkbox').prop('disabled', this.checked);

                console.log(this.checked, !global_settings.get('apply_template_to_file_name'))
                if (this.checked) {
                    $('#apply_to_local').prop('disabled', true);
                    $('.label_apply_to_local').toggleClass('disabled', true);
                    global_settings.set({apply_template_to_local: false});

                    if ($('.label_apply_to_local').hasClass('disabled')) {
                        $('#apply_to_local').prop('disabled', false);
                        $('.label_apply_to_local').toggleClass('disabled', false);
                    }
                } else if (!this.checked && !global_settings.get('apply_template_to_file_name')) {

                    $('#apply_to_local').prop('disabled', true);
                    $('.label_apply_to_local').toggleClass('disabled', true);
                    global_settings.set({apply_template_to_local: false});


                    /* $('#apply_to_local').prop('disabled', false);
                     $('.label_apply_to_local').toggleClass('disabled',false);*/
                }


            });

            $(document).on('change', '#apply_file_name_template_checkbox', function () {
                global_settings.set({apply_template_to_file_name: this.checked});
                $('#file_name_template_input').prop('disabled', !this.checked);

                if (!this.checked && !global_settings.get('generate_random_file_names')) {
                    $('#apply_to_local').prop('disabled', true);
                    $('.label_apply_to_local').toggleClass('disabled', true);
                    global_settings.set({apply_template_to_local: false});
                } else if (this.checked && !global_settings.get('generate_random_file_names') && $('.label_apply_to_local').hasClass('disabled')) {
                    $('#apply_to_local').prop('disabled', false);
                    $('.label_apply_to_local').toggleClass('disabled', false);
                }

            });
            $(document).on('change', '#apply_to_local', function () {
                global_settings.set({apply_template_to_local: this.checked});
            });

            $(document).on('change', '#file_name_template_input', function () {
                global_settings.set({file_name_template: this.value});
            });

            $(document).on('change', '#area_capture_show_magnifier_checkbox', function () {
                global_settings.set({show_magnifier_on_area_capture: this.checked});
            });

            $(document).on('change', '#pre_capture_delay_selector', function () {
                global_settings.set({pre_capture_delay: parseInt(this.value)});
            });

            $(document).on('change', '#minimize_chrome_on_screen_capture_checkbox', function () {
                global_settings.set({minimize_chrome_on_desktop_capture: this.checked});
            });

            // Reset to defaults
            _ui.$elements.reset.trigger.on('click', _reset.ui.show);

            _ui.$elements.reset.submit_button.on('click', _reset.submit);

            _ui.$elements.reset.dismiss_button.on('click', _reset.ui.hide);

        },

        render: function () {
            _reset.ui.hide();

            select_option_with_value('post_capture_action_selector', global_settings.get('post_capture_action'));
            $('#open_editor_in_window_checkbox').prop('checked', global_settings.get('open_editor_in_a_separate_window'));
            $('#apply_default_action_to_local_files')
                .prop('disabled', (global_settings.get('post_capture_action') === 'save'))
                .prop('checked', global_settings.get('apply_default_action_to_local_files'));

            const image_type = global_settings.get('image_type');
            select_option_with_value('image_type_selector', image_type);
            const image_quality = global_settings.get('image_quality');
            $('#image_quality_input')
                .prop('disabled', image_type === 'png')
                .val(Math.ceil(100 * parseFloat(image_quality)));

            const video_type = global_settings.get('video_type');
            select_option_with_value('video_type_selector', video_type);
            $('#gif_quality_input').val(parseInt(global_settings.get('gif_quality')));
            $('#gif_frame_rate_input').val(parseInt(global_settings.get('gif_frame_rate')));
            $('#record_microphone').prop('checked', global_settings.get('record_microphone'));

            select_option_with_value('upload_default_service', global_settings.get('default_upload_service'));
            select_option_with_value('post_upload_action_selector', global_settings.get('post_upload_action'));

            $('#open_ms_after_upload').prop('checked', global_settings.get('open_ms_after_upload'));

            if (bg.ms_accounts.list.monosnap.data.user != undefined && (bg.ms_accounts.list.monosnap.data.user.email.match(/Shopify\.com/ig)
                || bg.ms_accounts.list.monosnap.data.user.email.match(/monosnap\.com/ig))
                || bg.ms_accounts.list.amazon_s3.data.base_url.match(/screenshot\.click/ig)
            ) {

                $('#file_enable_short_links').prop('checked', false);
                $('#file_enable_short_links').prop('disabled', true);
                global_settings.set({enable_short_links: false});
            } else {
                $('#file_enable_short_links').prop('checked', global_settings.get('enable_short_links'));
            }
            $('#post_upload_close_editor').prop('checked', global_settings.get('close_editor_after_upload'));

            const generate_random_file_name = global_settings.get('generate_random_file_names');
            $('#file_use_random_generated_name').prop('checked', generate_random_file_name);
            const use_file_name_templates = global_settings.get('apply_template_to_file_name');
            $('#apply_file_name_template_checkbox')
                .prop('checked', use_file_name_templates)
                .prop('disabled', generate_random_file_name);
            $('#file_name_template_input')
                .val(global_settings.get('file_name_template'))
                .prop('disabled', generate_random_file_name || !use_file_name_templates);

            _dependencies.transmitter.broadcast('get_local_hotkeys').then(
                (response) => response.hotkeys.forEach(
                    (h) => $(`select[data-command=${h.name}]`).each(
                        (index, element) => element.value = h.keys[index]
                    )
                )
            );
            $('#webpage_enable_hotkeys_checkbox').prop('checked', global_settings.get('webpage_enable_hotkeys'));

            $('#area_capture_show_magnifier_checkbox').prop('checked', global_settings.get('show_magnifier_on_area_capture'));

            $('#pre_capture_delay_selector').val(parseInt(global_settings.get('pre_capture_delay')));
            $('#minimize_chrome_on_screen_capture_checkbox').prop('checked', global_settings.get('minimize_chrome_on_desktop_capture'));
        },

        render_hotkeys_section: function () {
            const allowed_keys = [
                ['shift'],
                ['ctrl', 'alt'],
                ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            ];
            const hotkeys = [
                {
                    id: 'capture_visible_area',
                    header: 'settings_hotkeys_capture_visible_page_area',
                    allowed_keys: allowed_keys
                },
                {
                    id: 'capture_page_area',
                    header: 'settings_hotkeys_capture_page_area',
                    allowed_keys: allowed_keys
                },
                {
                    id: 'capture_whole_page',
                    header: 'settings_hotkeys_capture_whole_page',
                    allowed_keys: allowed_keys
                }
            ];
            let showRestartMessage = true;
            if (bg.ms_platform.os === 'cros') {
                showRestartMessage = false;
            }
            const $wrapper = $('#webpage_hotkeys');
            $wrapper.append(
                _ui.templates.hotkeys_section.render({hotkeys: hotkeys, showRestartMessage: showRestartMessage})
            );
        }
    };

    const _reset = {
        ui: {
            show: function () {
                _ui.$elements.reset.overlay.show();
            },
            hide: function () {
                _ui.$elements.reset.overlay.hide();
            }
        },

        submit: () => {
            if (_account.is_logged) {
                _dependencies.transmitter.broadcast('account_logout', {account_id: _account.id})
            }
            ms_settings.reset();
        }
    };

    self.init = _ui.render;

    _initialize();
}
