function MSSessionsManager() {
    const self = this;
    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    self.list = [];

    function _initialize() {
        _assign_event_handlers();
    }

    function _assign_event_handlers() {
        // Sessions
        _dependencies.transmitter.local.subscribe({
            'session_closed': function(data) {
                if (data.session_id) {
                    self.close(data.session_id);
                }
            }
        });

        // User's interaction with tabs
        ChromeEventsAPI.tab_removed(function(tab_id, remove_info) {
            var session = self.get_by_tab_id(tab_id);
            if (session) {
                console.log(`[i] Tab was removed (id:${tab_id}, session: ${session.id})`, remove_info);
                self.close(session.id);
            }
        });

        // TODO: Tab url change should be also tracked
        // ChromeEventsAPI.tab_updated(function(tab_id, change_info, tab) {
        //     var session = self.get_by_tab_id(tab_id);
        //     if (session) {
        //         console.log(`[i] Tab was updated (id:${tab_id}, session: ${session.id})`, change_info);
        //         if (change_info.hasOwnProperty('url') && (session.tab.url !== change_info.url)) {
        //             self.close(session.id);
        //         }
        //     }
        // });
    }

    self.last = {
        id: null,

        check: (session_id) => (session_id && (self.last.id === session_id)),

        get: () => self.list.filter(session => (session.type === 'screenshot')).last()
    };

    self.create = function(data={}) {
        try{
            data.type = data.type || 'screenshot';
            data.temporary = (data.temporary === true);

            data.ext = '';

            if (!!data.local_file) {
                let join;
                let split = data.title.split('.');
                if (split.length > 1) {
                    data.ext = '.' + split[split.length-1];
                    split.pop();
                    if (split.length >= 2) {
                        join = split.join('.');
                    } else {
                        join = split.join('');
                    }

                } else {
                    join = data.title;
                }
                data.title = join;
            }
            while(self.get(data.id = generate_random_string(10))) {}
            data.title = data.title || data.base_title;
            if (data.title === undefined) {
                if (data.tab !== undefined && data.tab.title) {
                    data.title = data.tab.title;
                } else {
                    data.title = data.type.capitalize();
                }
            }
            let apply_template = ms_app_data.get('apply_template_to_file_name');
            let apply_to_loc = ms_app_data.get('apply_template_to_local');
            let random_name = ms_app_data.get('generate_random_file_names');

            if ((data.local_file && apply_to_loc) || !data.local_file) {
                if (random_name) {
                    data.title = generate_random_string();
                } else if (apply_template) {
                    data.title = ms_core.file.title.apply_template(ms_app_data.get('file_name_template'), data.title);
                }
            }
            var session;
            switch (data.type) {
                case 'screenshot':
                    session = new MSScreenshotEditor(data);
                    break;
                case 'screencast':
                    session = new MSScreencastPlayer(data);
                    break;
                default:
                    session = new MSFile(data);
            }

            if (!data.temporary) {
                self.list.push(session);
                self.refresh();
            }

            return session;
        } catch (e) {
            console.log('[ERROR] Session not created',e)
        }
    };

    self.get = function(session_id) {
        return self.list.find(session => (session.id === session_id));
    };

    self.get_by_tab_id = function(tab_id) {
        return self.list.find(session => session.tab && (session.tab.id === tab_id));
    };

    self.refresh = function() {
        const last_session = self.last.get();
        self.last.id = (last_session) ? last_session.id : null;
    };

    self.close = function(session_id) {
        self.list = self.list.filter(session => (session.id !== session_id));
        self.refresh();
    };

    _initialize();
}


function MSSession(parameters={}) {
    const self = this;

    self._dependencies = {
        transmitter: new MSTransmitter(),
        pages: new MSViewsManager(),
        tabs: new MSTabsManager(),
        notifications: MSNotificationsManager
    }
}

MSSession.prototype.get_title = function(with_extension) {
    const self = this;
    var title = self.title || self.base_title; // || self.captured_tab.title; // || ms_core.file.title.generate(self.base_title || self.captured_tab.title);
    var extension = ms_core.file.type_specific_info.extension.get(self.get_type());

    let ret = title;
    if (with_extension && !self.temporary) {
        ret += '.' + extension;
    }
    return ret;
};

MSSession.prototype.is_last = function() {
    return ms_core.sessions.last.check(this.id);
};

MSSession.prototype.edit = function() {
    const self = this;
    console.log(`[Session] Opening content editor (${self.id})`);
};

MSSession.prototype.save = function(file_name) {
    ga_send_event('File export', 'Save on disk');
    try {
        let filename = (file_name || this.get_title(true));
        ms_core.file.local.save(
            this.get_data(),
            filename
        );
        this._dependencies.notifications.show({message: chrome.i18n.getMessage('notification_file_save_success')});
    } catch(e) {
        this._dependencies.notifications.show({message: chrome.i18n.getMessage('notification_file_save_fail')});
    }
};

MSSession.prototype.upload = function( parameters={} ) {
    const self = this;

    let title = self.get_title(true) || self.title;
    const request = {
        service: parameters.service,
        destination: parameters.destination,
        data: self.get_data(),
        title: title,
        callback: function(data) {
            if (['screenshot', 'screencast'].has(self.type)) {
                if ((typeof self.tab.id === 'number') && ms_app_data.get('close_editor_after_upload')) {
                    self._dependencies.tabs.close(self.tab.id);
                }
            }

            if (typeof parameters.callback === 'function') { parameters.callback(data); }
        }
    };

    // TODO: Create preview only if media was changed
    if (['screenshot', 'screencast'].has(self.type) && ((request.service!=undefined && request.service!='amazon_s3') || (request.service==undefined && ms_app_data.get('default_upload_service')!='amazon_s3')) ) {
        self.preview.create(function(preview_blob,width,height) {
            request.preview = preview_blob;
            request.width = width;
            request.height = height;
            ms_core.uploads.add(request);
        });
    } else {
        ms_core.uploads.add(request);
    }
};

// TODO: Doesn't delete data for the last remained session (in order to "Open the editor")
MSSession.prototype.close = function() {
    this._dependencies.transmitter.local.broadcast('session_closed', {session_id: this.id});
};


function MSScreenshotEditor(parameters={}) {
    const self = this;
    MSSession.call(this, parameters);

    self.type = 'screenshot';

    self.id = parameters.id;
    self.timestamp = Date.now();
    self.data = {
        original: parameters.data
    };
    self.captured_tab = parameters.tab || {};
    self.base_title = parameters.title || (parameters.tab && parameters.tab.title) || 'Screenshot';
    self.context = parameters.context || 'capture';
    self.local_file = (parameters.local_file === true);
    self.mime_type = parameters.mime_type;
    self.edit_history = [];

    self.tab = {};

    self.get_type = function() {
        return (self.output_type || ms_app_data.get('image_type'));
    };

    self.get_data = function() {
        return self.data.final || self.data.original;
    };

    self.preview = {
        max_dimension: 200,

        create: function(callback) {
            self.preview.reset();

            fit_image_to_rectangle(
                self.get_data(),
                self.preview.max_dimension,
                self.preview.max_dimension,
                function(preview_blob,width,height) {
                    self.width = width;
                    self.height = height;
                    console.log('[Upload] Creating preview');
                    self.preview.data = preview_blob;
                    if (typeof callback === 'function') { callback(preview_blob,width,height); }
                }
            );
        },

        reset: function() {
            delete(self.preview.data);
        }
    };
}

MSScreenshotEditor.prototype = Object.create(MSSession.prototype);
MSScreenshotEditor.prototype.constructor = MSScreenshotEditor;

MSScreenshotEditor.prototype.edit = function() {
    const self = this;
    self._dependencies.pages.screenshot.editor.open(self.id, ms_app_data.get('open_editor_in_a_separate_window'))
        .then((tab) => self.tab = tab)
        .catch((e) => console.log(e));
};


function MSScreencastPlayer(parameters={}) {
    const self = this;
    MSSession.call(this, parameters);
    self.type = 'screencast';

    self.id = parameters.id;
    self.timestamp = Date.now();
    self.data = parameters.data;
    self.base_title = parameters.title || 'Screencast';
    self.local_file = (parameters.local_file === true);
    self.mime_type = parameters.mime_type;
    self.duration = parameters.duration;

    self.edit_history = [];

    self.tab = {};

    self.video = {
        element: document.createElement('video'),
        initialized: false,
        player_ready: false,

        initialize: function() {

        }
    };

    self.get_type = function() {
        return (self.output_type || ms_app_data.get('video_type'));
    };

    self.get_data = function() {
        return (self.get_type() === 'gif' && self.gif.data) ? self.gif.data : self.data;
    };

    self.gif = new GIF_Converter();

    self.preview = {
        max_dimension: 200,

        create: function(callback) {
            self.preview.reset();

            cut_frame(self.data, 0).then(
                function(image_blob, sizes) {
                    fit_image_to_rectangle(
                        image_blob,
                        self.preview.max_dimension,
                        self.preview.max_dimension,
                        function(preview_blob) {
                            self.preview.data = preview_blob;
                            if (typeof callback === 'function') { callback(preview_blob, sizes); }
                        }
                    );
                }
            );
        },

        reset: function() {
            delete(self.preview.data);
        }
    };
}
MSScreencastPlayer.prototype = Object.create(MSSession.prototype);
MSScreencastPlayer.prototype.constructor = MSScreencastPlayer;

MSScreencastPlayer.prototype.edit = function() {
    const self = this;
    self._dependencies.pages.screencast.player.open(self.id, ms_app_data.get('open_editor_in_a_separate_window'))
        .then((tab) => self.tab = tab)
        .catch((e) => console.log(e));
};

MSScreencastPlayer.prototype.save = function(file_name) {
    const self = this;

    if (self.get_type() === 'gif') {
        self.gif.convert_video({
            source: self.data,
            begin: self.begin,
            end: self.end,
            edit_history: self.edit_history,
            callback: () => MSSession.prototype.save.call(self, file_name)
        });
    } else {
        MSSession.prototype.save.call(self, file_name);
    }
};

MSScreencastPlayer.prototype.upload = function(parameters) {
    const self = this;

    if (self.get_type() === 'gif') {
        self.gif.convert_video({
            source: self.data,
            begin: self.begin,
            end: self.end,
            edit_history: self.edit_history,
            callback: () => MSSession.prototype.upload.call(self, parameters)
        });
    } else {
        MSSession.prototype.upload.call(self, parameters);
    }
};

function GIF_Converter(video_source) {
    const self = this;

    const _dependencies = {
        notifications: MSNotificationsManager
    };

    self.busy = false;
    self.notification_id = null;
    self.transformation = null;
    self.data = null;
    self.callback = function() {};

    function _initialize() {
        self.converter = new GIF({
            workers: 6,
            workerScript: '/libs/gif.js/gif.worker.js'
        });

        self.converter.on('start', function() {
            console.log('[GIF] Assembling image');
            if (self.notification_id) {
                _dependencies.notifications.update(
                    self.notification_id,
                    {
                        message: chrome.i18n.getMessage('notification_gif_rendering'),
                        progress: 0
                    }
                );
            }
        });

        self.converter.on('progress', function(progress) {
            if (self.notification_id) {
                _dependencies.notifications.update(
                    self.notification_id,
                    {progress: Math.round(100*progress)}
                );
            }
        });

        self.converter.on('finished', function(blob) {
            self.data = blob;


            self.callback(blob);
        });

        self.converter.on('abort', _reset);
    }

    function _merge_operations(original_dimensions, stack) {
        // console.log(stack);
        const final_scale = {
            x: 1,
            y: 1
        };
        const post_scale = Object.assign({}, final_scale);
        const crop_area = {
            x: 0,
            y: 0,
            width: original_dimensions.width,
            height: original_dimensions.height
        };

        if (stack.length) {
            let crop_applied = false;
            stack.reverse();
            stack.forEach(function(operation) {
                switch (operation.type) {
                    case 'resize':
                        if (crop_applied) {
                            crop_area.x /= operation.scale_x;
                            crop_area.y /= operation.scale_y;
                            final_scale.x *= operation.scale_x;
                            final_scale.y *= operation.scale_y;
                        } else {
                            post_scale.x *= operation.scale_x;
                            post_scale.y *= operation.scale_y;
                        }
                        break;

                    case 'crop':
                        if (!crop_applied) {
                            crop_area.width = operation.width;
                            crop_area.height = operation.height;
                            crop_applied = true;
                        }
                        crop_area.x += operation.x;
                        crop_area.y += operation.y;
                        break;
                }
            });
            stack.reverse();
        }

        return {
            pre_scale: final_scale,
            post_scale: post_scale,
            crop: crop_area
        };
    }

    // TODO: For now I've hardcoded objects comparison. It's useful to implement a function for deep comparison (recursive)
    function _are_transformations_equal(t1, t2) {
        return (
            is_instance(t1, 'Object') && is_instance(t2, 'Object') &&
            (t1.pre_scale.x === t2.pre_scale.x) && (t1.pre_scale.y === t2.pre_scale.y) &&
            (t1.post_scale.x === t2.post_scale.x) && (t1.post_scale.y === t2.post_scale.y) &&
            (t1.crop.x === t2.crop.x) && (t1.crop.y === t2.crop.y) && (t1.crop.width === t2.crop.width) && (t1.crop.height === t2.crop.height)
        );
    }

    function _extract_current_frame(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0);
        return canvas;
    }

    function _process_frame(original_frame, transformation) {
        const canvas = document.createElement('canvas');
        canvas.width = transformation.crop.width * transformation.post_scale.x;
        canvas.height = transformation.crop.height * transformation.post_scale.y;
        // console.log(original_frame, canvas.width, canvas.height);

        const context = canvas.getContext('2d');
        context.drawImage(
            original_frame,
            transformation.crop.x, transformation.crop.y,
            transformation.crop.width / transformation.pre_scale.x, transformation.crop.height / transformation.pre_scale.y,
            0, 0,
            canvas.width, canvas.height
        );
        return canvas;
    }

    self.merge_operations = _merge_operations;

    self.process_frame = _process_frame;

    self.convert_video = function(parameters) {
        if (!parameters.source) {
            console.log('[!] [GIF] No video data to convert');
            return false;
        }
        Object.assign({
            edit_history: [],
            begin: 0,
            end: 0
        }, parameters);

        console.log('[GIF] Starting video conversion...');
        self.busy = true;
        // TODO: Substitute after changes check
        self.callback = (typeof parameters.callback === 'function') ? parameters.callback : function() {};

        // Load video and start conversion
        let frame_rate = parseInt(ms_app_data.get('gif_frame_rate'));
        let quality = 20 - parseInt(ms_app_data.get('gif_quality'));
        let preprocessing_timer, state_timer;

        let current_transformation;
        let something_changed = false;

        let ready = false;
        let video = document.createElement('video');
        video.src = get_media_src(parameters.source);
        video.volume = 0;

        video.oncanplaythrough = function () {
            if (!ready) {
                this.width = this.videoWidth;
                this.height = this.videoHeight;

                current_transformation = _merge_operations(
                    {
                        width: this.videoWidth,
                        height: this.videoHeight
                    },
                    (parameters.edit_history || [])
                );

                something_changed = !_are_transformations_equal(self.transformation, current_transformation) ||
                    (self.begin !== parameters.begin) || (self.end !== parameters.end) ||
                    (self.frame_rate !== frame_rate) || (self.quality !== quality);
                self.transformation = current_transformation;
                self.begin = parameters.begin;
                self.end = parameters.end;
                self.frame_rate = frame_rate;
                self.quality = quality;

                console.log(`[GIF] Parameters changed: ${something_changed}`);
                if (something_changed) {
                    ready = true;
                    this.currentTime = self.begin;
                } else {
                    if (self.busy) {
                        _dependencies.notifications.show({
                            message: chrome.i18n.getMessage('notification_gif_already_started_warning'),
                            hide_delay: 4
                        });
                    } else {
                        self.callback(self.data);
                    }
                    video = undefined
                }
            } else {
                if (something_changed) {
                    console.log('[GIF] Abort current process if something\'ve been changed');
                    self.converter.abort();
                    _reset();

                    self.busy = true;
                    // Show notification
                    _dependencies.notifications.show({
                        type: 'progress',
                        title: chrome.i18n.getMessage('notification_gif_conversion_title'),
                        message: chrome.i18n.getMessage('notification_gif_frames_processing')
                    }).then(function (id) {
                        self.notification_id = id;
                    });

                    self.converter.setOptions({
                        quality: quality,
                        width: self.transformation.crop.width * self.transformation.post_scale.x,
                        height: self.transformation.crop.height * self.transformation.post_scale.y
                    });

                    this.play();
                }
            }
        };

        video.onplay = function () {
            console.log('[GIF] Extracting frames');
            const interframe_delay = Math.round(1000/frame_rate);

            preprocessing_timer = setInterval(
                function() {
                    if (video.currentTime < self.end) {
                        self.converter.addFrame(
                            _process_frame(_extract_current_frame(video), self.transformation),
                            {delay: interframe_delay}
                        );

                        if (self.notification_id) {
                            _dependencies.notifications.update(
                                self.notification_id,
                                {progress: Math.round(100 * (video.currentTime - self.begin)/(self.end - self.begin))}
                            );
                        }
                    } else {
                        clearInterval(preprocessing_timer);
                        self.converter.render();

                        state_timer = setInterval(
                            function() {
                                if (!self.converter.running) {
                                    clearInterval(state_timer);
                                    video = undefined
                                }
                            },
                            10
                        );
                    }
                },
                interframe_delay
            );
        };
    };

    function _reset() {
        self.busy = false;
        self.data = null;
        self.converter.frames = [];
        if (self.notification_id) {
            try {
                _dependencies.notifications.close(self.notification_id);
            } catch (e) {}
            delete(self.notification_id);
        }
    }

    _initialize();
}


function MSFile(parameters={}) {
    const self = this;
    MSSession.call(this, parameters);
    self.type = 'file';

    self.id = parameters.id;
    self.timestamp = Date.now();
    self.data = parameters.data;
    self.base_title = parameters.title;
    self.mime_type = parameters.mime_type;
    self.width = parameters.width;
    self.heigh = parameters.heigh;
    self.get_title = function() {
        return self.base_title + parameters.ext;
    };

    self.get_data = function() {
        return self.data;
    };
}
MSFile.prototype = Object.create(MSSession.prototype);
MSFile.prototype.constructor = MSFile;