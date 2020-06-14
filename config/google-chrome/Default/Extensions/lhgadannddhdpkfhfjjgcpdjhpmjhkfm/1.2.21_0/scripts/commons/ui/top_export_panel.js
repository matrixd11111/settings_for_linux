function MSFileExportPanel() {
    const self = this;

    self.ui = {
        $elements: {},

        initialize: function () {
            self.ui.$elements.file_title_input = $('#file_title_input');
            self.ui.$elements.file_type_dropdown = $('#file_type_dropdown');
            self.ui.$elements.file_type_dropdown_trigger = self.ui.$elements.file_type_dropdown.find('.dropdown-toggle');
            self.ui.$elements.file_save_button = $('#file_save_button');
            self.ui.$elements.upload_burger_button = new MSUploadBurger();
            self.ui.$elements.copy_to_clipboard_button = $('#copy_to_clipboard_button');

            self.ui.$elements.file_title_input.val(session.get_title());
            self.ui.$elements.file_type_dropdown_trigger.text(
                '.' + bg.ms_core.file.type_specific_info.extension.get(session.get_type())
            );

            self.ui.assign_event_handlers();
        },

        assign_event_handlers: function () {
            self.ui.$elements.file_title_input.on('keyup', function () {
                session.title = this.value;
            });

            $(document).on('click', '.ms_file_format', function () {
                var type = this.dataset.type;
                session.output_type = type;

                self.ui.$elements.file_type_dropdown_trigger.text(
                    '.' + bg.ms_core.file.type_specific_info.extension.get(session.get_type())
                );

                $(document).trigger('output_type_changed', {type: session.get_type()});
            });

            self.ui.$elements.file_save_button.on('click', function () {
                console.log('[Export] Save file on disk');
                if (typeof ms_editor !== 'undefined') {
                    ms_editor.export().then((data) => session.save());
                } else {
                    session.save();
                }
            });

            self.ui.$elements.copy_to_clipboard_button.on('click', async () => {
                console.log('[Export] Save file to clipboard');

                document.dispatchEvent(new ClipboardEvent("copy"));
            });
        }
    };

    self.ui.initialize();
}

function MSUploadBurger() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    self.is_shown = false;

    function _initialize() {
        _dependencies.transmitter.subscribe({
            'account_updated': function (request, callback) {
                console.log(`[Editor] Burger menu: update (${request.service})`);
                if (request.service === 'monosnap') {
                    switch (request.event) {
                        case 'login':
                            // self.services.monosnap.folder.get();
                            break;

                        case 'logout':
                            self.ui.$elements.monosnap_folders_list.addClass('ms_hidden');
                            break;

                        case 'folders_loaded':
                            if (Array.isArray(request.folders)) {
                                self.services.monosnap.folder.render(request.folders);
                            }
                            break;
                    }
                }
            }
        });

        self.ui.initialize();
        if (bg.ms_accounts.list.monosnap.is_logged) {
            self.services.monosnap.folder.get();
        }
    }

    self.ui = {
        $elements: {},

        initialize: function () {
            self.ui.$elements.upload_to_default_account = $('#file_upload_button');
            self.ui.$elements.monosnap_folders_list = $('#ms_user_folders_list').addClass('ms_hidden');

            self.ui.assign_event_handlers();
        },

        assign_event_handlers: function () {
            self.ui.$elements.upload_to_default_account.on('click', function () {
                if (typeof ms_editor !== 'undefined') {
                    ms_editor.export().then((data) => self.upload());
                } else {
                    self.upload();
                }
            });

            $(document).on('click', '.upload_to', function (e) {
                e.stopPropagation();

                const service = this.dataset.service,
                    destination = this.dataset.destination;
                if (typeof ms_editor !== 'undefined') {
                    ms_editor.export().then((data) => self.upload(service, destination));
                } else {
                    self.upload(service, destination);
                }
            });
        },

        render_destinations_list: function ($container, class_name, service, targets_list, id_key, name_key, select_after) {
            if ($container) {
                if (Array.isArray(targets_list) && targets_list.length) {
                    $container.removeClass('ms_hidden');
                    $container.find('.service_loader').hide();

                    targets_list.forEach(function (f) {
                        var id = encode_html(f[id_key]),
                            name = encode_html(f[name_key]);
                        $container.append(`<li class="${class_name}" data-service="${service}" data-destination="${id}"><a tabindex="-1" href="#">${name}</a></li>`);
                    });

                    select_after = (typeof select_after === 'string') ? select_after : targets_list[0][id_key];
                    $(`.${class_name}[data-id=${select_after}]`).trigger('click');
                } else {
                    $container.addClass('ms_hidden');
                }
            }
        }
    };

    self.services = {
        monosnap: {
            account: bg.ms_accounts.list.monosnap,

            folder: {
                get: function () {
                    self.services.monosnap.account.folder.get_list()
                        .then(self.services.monosnap.folder.render)
                        .catch(function (data) {
                            self.ui.$elements.monosnap_folders_list.addClass('ms_hidden');
                        });
                },

                render: function (folders) {
                    self.ui.$elements.monosnap_folders_list.removeClass('ms_hidden');
                    self.ui.$elements.monosnap_folders_list.find('.upload_to').remove();
                    self.ui.$elements.monosnap_folders_list.find('.service_loader').show();
                    self.ui.render_destinations_list(self.ui.$elements.monosnap_folders_list, 'upload_to', 'monosnap', folders, 'id', 'title');
                }
            }
        }
    };

    self.upload = function (service, destination) {
        session.upload({
            service: service,
            destination: destination,
            callback: function (data) {
                console.log(data);
            }
        });
    };

    _initialize();
}

class MSClipboard {
    static writeImageBlobToClipboard(blob) {
        return navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob
            })
        ]);
    }
}
