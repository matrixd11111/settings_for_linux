const page_type = 'latest_uploads';

let bg;
$(document).ready(function() {
    ChromeRuntimeAPI.get_background_context().then(function(context) {
        bg = context;
        const ms_uploads = new MSLatestUploadsView();
    });
});

function MSLatestUploadsView() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    function _initialize() {
        _ui.initialize();
        _load_list().then(function (uploads) {
            _list = uploads;
            _ui.render();
        });
    }

    const _accounts = bg.ms_accounts.list;
    let _list = [];

    const _ui = {
        $templates: {
            list_item: ejs.get_template('/latest_uploads/list_item.ejs')
        },
        $elements: {},

        initialize: function() {
            _ui.$elements.uploads_list = $('#uploads_wrapper');
            _ui.assign_event_handlers();
        },

        assign_event_handlers: function() {
            $(document).on('click', '.item_copy_link', function() {
                const link = this.dataset.link;
                const copy_short_link = $(this).hasClass('short');
                ga_send_event('Latest uploads', copy_short_link ? 'Copy short link' : 'Copy link');
                _dependencies.transmitter.broadcast(
                    'copy_link_to_clipboard',
                    {
                        url: link,
                        short: copy_short_link
                    }
                );
            });

            $(document).on('click', '.item_download', function() {
                _file.download(this.dataset.id);
            });
        },

        render: function() {
            _ui.$elements.uploads_list.empty();

            _list.forEach(
                file => _ui.$elements.uploads_list.append(
                    _ui.$templates.list_item.render({file: file})
                )
            );
            localize();
        }
    };

    const _file = {
        download: function(id) {
            const file = _list.find(file => (file.id === id));

            if (file) {
                switch (file.service) {
                    case 'amazon_s3':
                        _accounts.amazon_s3.file.download(file.bucket, file.object_key)
                            .then((blob) => bg.ms_core.file.local.save(blob, file.title));
                        break;

                    default:
                        window.open(file.download_link);
                }
            }
        }
    };

    function _load_list() {
        return new Promise(function (resolve, reject) {
            _dependencies.transmitter.broadcast('get_latest_uploads')
                .then(function(response) {
                    const uploads = Array.isArray(response.uploads) ? response.uploads : [];
                    resolve(
                        uploads.map(function(file) {
                            const upload_date = convert_timestamp_to_string(file.timestamp);
                            switch (file.service) {
                                case 'amazon_s3':
                                    const direct_link = _accounts.amazon_s3.file.get_link({
                                        base_url: file.base_url,
                                        region: file.region,
                                        bucket: file.bucket,
                                        object_key: file.object_key
                                    });

                                    return Object.assign({}, file, {
                                        service_name: 'Amazon S3',
                                        service_icon_url: '/images/editor/upload/services/amazon_s3.png',
                                        date: upload_date,
                                        direct_link: direct_link,
                                        main_link: direct_link
                                    });
                                    break;

                                default:
                                    const file_page_link = Monosnap_API.links.generate(file.file_id);
                                    return Object.assign({}, file, {
                                        service_name: 'Monosnap',
                                        service_icon_url: '/images/editor/upload/services/monosnap.png',
                                        date: upload_date,
                                        direct_link: Monosnap_API.links.generate(file.file_id, 'direct'),
                                        download_link: Monosnap_API.links.generate(file.file_id, 'download'),
                                        website_link: file_page_link,
                                        main_link: file_page_link
                                    });
                            }
                        })
                    );
                })
        });
    }

    _initialize();
}