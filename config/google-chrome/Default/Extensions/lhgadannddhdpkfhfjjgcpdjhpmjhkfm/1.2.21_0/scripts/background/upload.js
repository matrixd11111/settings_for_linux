function MSUploadQueue() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager,
        tabs: new MSTabsManager(),
        pages: new MSViewsManager()
    };

    self.queue = [];
    self.active_pull = {};
    self.threads_limit = 4;

    function _initialize() {
        _assign_event_handlers();
    }

    function _assign_event_handlers() {
        // Notifications
        ChromeEventsAPI.click_on_notification(function(notification_id) {
            console.log(`Notification: ${notification_id}`);

            if (/^file_uploaded_/.test(notification_id)) {
                const item_id = notification_id.replace('file_uploaded_', '');

                const uploaded_file = ms_core.recent_uploads.get_by_id(item_id);
                if (uploaded_file) {
                    _dependencies.tabs.open(
                        (uploaded_file.service === 'monosnap') ?
                            Monosnap_API.links.generate(uploaded_file.file_id) :
                            uploaded_file.direct_link
                    );
                }
            }
        });

        ChromeEventsAPI.click_on_notification(function(notification_id) {
            console.log(`Notification: ${notification_id}`);
            if (/^file_link_copied_/.test(notification_id)) {
                const entry_id = notification_id.replace('file_link_copied_', '');
                const link = ms_storage.get_entry(entry_id);
                if (link) {
                    _dependencies.tabs.open(link);
                }
            }
        });

        // Uploading process
        _dependencies.transmitter.local.subscribe({
            'upload_added': function() {
                console.log('[Upload] Create session');
                self.update_state();
            },

            'upload_finished': function(data) {
                console.log('[Upload] Complete', data.upload_id);
                if (data.upload_id) {
                    self.delete(data.upload_id);
                    self.update_state();
                }
            }
        });
    }

    const _ui = {
        render_uploads_counter: function() {
            const active_uploads_count = self.queue.length;
            chrome.browserAction.setBadgeText({
                text: (active_uploads_count) ? String(active_uploads_count) : ''
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: [255, 0, 0, (active_uploads_count) ? 255 : 0]
            });
        }
    };

    self.add = function(options={}) {
        const service = (ms_accounts.supports_upload_to.has(options.service)) ? options.service : ms_app_data.get('default_upload_service');

        if (ms_accounts.list[service].is_logged) {
            ga_send_event('File export', `Upload to ${service}`);

            const id = create_unique_id(self.queue.map(upload => upload.id), 10);
            const session = new MSUploadSession({
                id: id,
                service: service,
                destination: options.destination,
                data: options.data,
                title: options.title,
                preview: options.preview,
                width:options.width,
                height:options.height,
                callback: options.callback
            });
            self.queue.push(session);

            _dependencies.transmitter.local.broadcast('upload_added');
        } else {
            console.log('[!] User is not logged');
            _dependencies.pages.open_preferences(function() {
                setTimeout(
                    () => _dependencies.transmitter.broadcast('open_account_settings', {service: service}),
                    1000
                );
                _dependencies.notifications.show({
                    message: chrome.i18n.getMessage('notification_login_to_upload'),
                    hide_delay: 4
                });
            });
        }
    };

    self.get = (session_id) => self.queue.find(upload => (upload.id === session_id));

    self.put_last_to_pull = function() {
        const session = self.queue.shift();
        if (session) {
            self.active_pull[session.id] = session;
            session.start();
        }
        return session;
    };

    self.delete = function(upload_id) {
        console.log('[Upload] Delete session', upload_id);
        self.queue = self.queue.filter(session => (session.id !== upload_id));
        delete(self.active_pull[upload_id]);
    };

    self.update_state = function() {
        if (self.queue.length && (Object.keys(self.active_pull).length < self.threads_limit)) {
            console.log('[Upload] Push upload to active pull');
            self.put_last_to_pull();
        }
        _ui.render_uploads_counter();
    };

    _initialize();
}

function MSUploadSession(parameters={}) {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager,
        tabs: new MSTabsManager()
    };

    function _initialize(parameters) {
        self.id = parameters.id;
        self.success = false;
        self.progress = 0;

        self.service = parameters.service;
        self.destination = parameters.destination;
        self.data = parameters.data;
        self.title = parameters.title || 'File';

        if (parameters.preview) {
            self.preview = parameters.preview;
        }
        if (parameters.width&&parameters.height) {
            self.width = parameters.width;
            self.height = parameters.height;

        }

        self.callback = parameters.callback;
    }

    self.start = function() {
        let progressShow = () =>{

            _dependencies.notifications.show({
                type: 'progress',
                icon: self.preview,
                message: `Loading ${self.title.truncate(30)}`,
                progress: self.progress
            }).then(function(id) {
                self.notification_id = id;
            });

        }

        let account;
        switch (self.service) {
            case 'monosnap':
                account = ms_accounts.list.monosnap;
                progressShow();
                account.file.upload(
                    self.data,
                    self.preview,
                    self.title,
                    self.destination,
                    (progress) => self.update(progress),
                    self.width,
                    self.height
                ).then(function(data) {
                    self.success = true;
                    self.finish({file_id: data.file_id});

                    if (typeof self.callback === 'function') { self.callback(data); }
                }).catch(function(data) {
                    self.success = false;
                    self.finish();
                });
                break;

            case 'amazon_s3':
                account = ms_accounts.list.amazon_s3;
                var path = trim_string(account.data.path, '\/'),
                    bucket = self.destination || account.data.bucket;

                if (bucket) {
                    const title = account.file.process_title(self.title);
                    var object_key = (!path.length) ? title : [path, title].join('/');
                    progressShow();
                    account.file.upload(
                        self.data,
                        bucket,
                        object_key,
                        null,
                        (progress, response) => self.update(progress)
                    ).then(function(data) {
                        console.log('[Amazon S3] Upload: success');
                        self.success = true;
                        self.finish({
                            base_url: account.data.base_url,
                            region: account.data.region,
                            bucket: bucket,
                            object_key: object_key
                        });

                        if (typeof self.callback === 'function') { self.callback(data); }
                    }).catch(function(error) {
                        console.log('[Amazon S3] Upload: fail');
                        self.success = false;
                        self.finish();
                    });
                } else {
                    _dependencies.notifications.show({
                        title: "Amazon S3",
                        message: chrome.i18n.getMessage('notification_s3_bucket_not_specified')
                    });

                    chrome.tabs.create(
                        {
                            url: 'chrome://extensions/?context=accounts&view=amazon_s3&options=' + chrome.runtime.id,
                            active:true,
                            selected:true
                        },
                        (cretab)=>{
                            ms_core.temp = {
                                options_page :{
                                    context:'accounts',
                                    view:   'amazon_s3'
                                }
                            }
                        }
                    );
                    console.log('[!] Bucket not specified');
                }
                break;
        }
    };

    self.update = function(progress) {
        if (typeof progress === 'number') {
            // console.log(`[Upload] Progress: ${progress} (${self.title})`);
            self.progress = progress;
            if (self.notification_id) {
                _dependencies.notifications.update(self.notification_id, {progress: Math.round(progress)});
            }
        }
    };

    self.do_post_upload_action = function(file) {
        file.service = self.service;
        file.title = self.title;
        if (self.preview) {
            get_image_data_from_url(self.preview, 'data_url').then(function(image_data) {
                file.preview = image_data;
                ms_core.recent_uploads.add(file);
            });
        } else {
            ms_core.recent_uploads.add(file);
        }
        if(ms_app_data.get('open_ms_after_upload')){
            ga_send_event('Post upload', 'Open file on Monosnap website');
            _dependencies.notifications.show({
                icon: self.preview,
                message: chrome.i18n.getMessage('notification_file_upload_success')
            });

            _dependencies.tabs.open(   ((self.service === 'monosnap')?Monosnap_API.links.generate(file.file_id):ms_accounts.list.amazon_s3.file.get_link(file))   );
        }
        switch (ms_app_data.get('post_upload_action')) {
            case 'copy_direct_link':
                ga_send_event('Post upload', 'Copy file direct link');
                ms_core.file.link.copy(
                    (self.service === 'monosnap') ?
                        Monosnap_API.links.generate(file.file_id, 'direct') :
                        ms_accounts.list.amazon_s3.file.get_link(file)
                );
                break;

            case 'copy_file_page_link':
                ga_send_event('Post upload', 'Copy file website link');
                ms_core.file.link.copy(
                    (self.service === 'monosnap') ?
                        Monosnap_API.links.generate(file.file_id) :
                        ms_accounts.list.amazon_s3.file.get_link(file)
                );
                break;

            default:
                // TODO: Open file page in the browser on click
                _dependencies.notifications.show({
                    id: 'file_uploaded',
                    icon: self.preview,
                    message: chrome.i18n.getMessage('notification_file_upload_success')
                });
        }
    };

    self.finish = function(data) {
        if (self.notification_id) {
            _dependencies.notifications.close(self.notification_id);
        }

        if (self.success) {
            self.do_post_upload_action(data);
        } else {
            // TODO: Add "Try again" feature for failed uploads (show 'Wanna try again?' dialog then restart a session if accepted)
            _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_file_upload_fail')});
        }

        _dependencies.transmitter.local.broadcast('upload_finished', {upload_id: self.id});
    };

    self.handle_error = function() {
        self.status = 'finished';
        self.failed = true;
    };

    _initialize(parameters);
}

function MSRecentUploads() {
    const self = this;

    const _records_to_store = 10;
    let _list = [];

    function _initialize() {
        self.load();
    }

    self.load = function() {
        _list = ms_app_data.get('recent_uploads');
    };

    self.save = function() {
        ms_app_data.set({recent_uploads: _list});
    };

    // TODO: Sync storage with user's google account
    self.add = function(item) {
        if (is_instance(item, ['Object'])) {
            item.id = create_unique_id(_list.map(f => f.id), 10);
            item.timestamp = Date.now();
            _list = [item].concat(_list.slice(0, _records_to_store - 1));
            self.save();
            return item.id;
        }
    };

    self.get = () => _list;

    self.get_by_id = (id) => _list.find(file => (file.id === id));

    _initialize();
}