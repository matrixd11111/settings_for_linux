function MSScreencastRecorder() {
    const self = this;

    const _dependencies = {
        streams: MediaStreamHandler,
        transmitter: new MSTransmitter(),
        pages: new MSViewsManager(),
        notifications: MSNotificationsManager,
        tabs: new MSTabsManager(),
        windows: MSWindowsManager
    };

    self.busy = false;
    self.finished = false;
    self.aborted = false;
    self.recorder = null;
    self.mime_type = 'video/webm';
    self.audio_stream = null;
    self.data = null;
    self.volume = 0;
    self.audio = false;   //default audio value
    self.choosing = false;

    function _initialize() {
        _dependencies.transmitter.subscribe({
            'record_desktop': function(request, callback) {
                switch (request.action) {
                    case 'start':
                        self.start(() => callback({}));
                        break;

                    case 'pause':
                        self.pause(() => callback({}));
                        break;

                    case 'finish':
                        self.finish(() => callback({}));
                        break;

                    case 'abort':
                        self.abort();
                        break;

                    case 'enable_audio':
                        if (self.recorder) {
                            _dependencies.streams.get_audio(self.audio).then(
                                function (audio_stream) {console.log(audio_stream)
                                    if (is_instance(audio_stream, 'MediaStream')) {
                                        self.audio_stream = audio_stream;

                                        const record_stream = self.recorder.stream;
                                        audio_stream.getAudioTracks().forEach(track => record_stream.addTrack(track));
                                    }
                                },
                                (error) => console.log('[Screencast] Can not access audio stream', error)
                            );
                        }
                        break;

                    case 'disable_audio':
                        if (self.recorder) {
                            // TODO: Should I detach tracks from global stream or just release audio stream
                            // _dependencies.streams.release(self.audio_stream);
                            const stream = self.recorder.stream;
                            stream.getAudioTracks().forEach(track => stream.removeTrack(track));
                        }
                        break;

                    default:
                        if (self.busy) {
                            _dependencies.notifications.show({
                                message: chrome.i18n.getMessage('notification_screencast_record_already_initialized'),
                                hide_delay: 4
                            });
                            callback({});
                        } else {
                            self.initialize({
                                record_audio: request.record_audio,
                                callback: () => callback({})
                            });
                        }
                        break;
                }
            },
            'update_audio_input': function(request, callback){

                if(request.audio!=undefined){
                    self.audio = (request.audio!=false)?request.audio.deviceId:request.audio
                }


                callback({})
            }
        });
    }

    self.timer = {
        duration: 0,
        step: 50,

        start: function() {
            let timer = setInterval(
                function() {
                    if (self.recorder && self.recorder.state === 'recording') {
                        self.timer.duration += self.timer.step;
                        _dependencies.transmitter.broadcast(
                            'update_timer',
                            {duration: Math.floor(self.timer.duration/1000)}
                        );
                    } else {
                        clearInterval(timer);
                    }
                },
                self.timer.step
            );
        }
    };

    self.initialize = function(options={}) {
        self.reset();
        _dependencies.pages.screencast.recording_controls.show();
        self.busy = true;


        if (typeof options.callback === 'function') { options.callback(); }
    };

    self.track_stream_state = function(stream) {
        const stream_tracks = self.recorder.stream.getTracks();
        stream_tracks.forEach(function(track) {
            track.onended = function() {
                const active_tracks = stream_tracks.filter(t => (t.readyState === 'live'));
                if (!self.recorder.stream.active || !active_tracks.length) {
                    console.log(`Your MediaStream is inactive now... Oops! (record finished: ${self.finished})`);
                    if (self.recorder.state === 'inactive') {
                        if (!self.finished && !self.aborted) {
                            self.reset();
                        }
                    } else {
                        self.finish();
                    }
                }
            };
        });
    };

    self.toggle = function(callback) {
        if (self.recorder) {
            if (!self.finished) {
                switch (self.recorder.state) {
                    case 'inactive':    self.start(callback);    break;
                    case 'paused':      self.pause(callback);    break;
                    case 'recording':   self.finish(callback);   break;
                }
            }
        }
    };

    self.start = function(callback) {

        if(self.choosing==false){
            _dependencies.streams.create(function(stream_id) {
                if (stream_id) {
                    _dependencies.streams.get_custom_video(stream_id).then(
                        function(stream) {
                            if (stream) {
                                // TODO: Waiting when Chrome will support video/mp4 (for now using 'video/webm;codecs=h264,opus')
                                self.recorder = new MediaRecorder(stream, {mimeType: self.mime_type});
                                // Tracking stream state, e.g., if user revoked access to the stream
                                self.track_stream_state(stream);
                                if (self.recorder) {
                                    console.log('[Screencast] Record: start');
                                    //stream.getAudioTracks().forEach(track => {self.recorder.stream.addTrack(track); console.log(track) });


                                    if(self.audio){
                                        _dependencies.streams.get_audio(self.audio).then(
                                            function (audio_stream) {
                                                if (is_instance(audio_stream, 'MediaStream')) {
                                                    self.audio_stream = audio_stream;

                                                    const record_stream = self.recorder.stream;
                                                    audio_stream.getAudioTracks().forEach(track => record_stream.addTrack(track));
                                                    self.recorder.start(500);

                                                }
                                            },
                                            (error) => console.log('[Screencast] Can not access audio stream', error)
                                        );
                                    }else{
                                        self.recorder.start(500);
                                    }
                                    _dependencies.transmitter.broadcast(
                                        'change_audio_control_view',
                                        {show:false}
                                    );


                                    self.recorder.onstart = function(e) {
                                        self.timer.start();

                                        let memory_state_timer = setInterval(function() {
                                            if (self.recorder.state !== 'inactive') {
                                                ms_hardware.memory.update();
                                                _dependencies.transmitter.broadcast(
                                                    'update_memory_status',
                                                    {
                                                        memory: {
                                                            used: self.volume,
                                                            available: ms_hardware.memory.available
                                                        }
                                                    }
                                                );
                                            } else {
                                                clearInterval(memory_state_timer);
                                            }
                                        }, 1000);
                                    };

                                    self.recorder.ondataavailable = function(e) {
                                        if (e.data.size) {
                                            self.data.push(e.data);
                                            self.volume += e.data.size;
                                        }
                                    };

                                    self.recorder.onresume = function(e) {
                                        self.timer.start();
                                    };

                                    if (typeof callback === 'function') { callback(); }
                                }
                            }

                            // if (typeof options.callback === 'function') { options.callback(); }
                        },
                        function (err) {
                            console.log(err)
                        }
                        //false// (options.record_audio === true)
                    );
                }else{
                    self.choosing=false
                    self.reset();
                    _dependencies.pages.screencast.recording_controls.show();
                }
            },self);
        }


    };

    self.pause = function(callback) {
        if (self.recorder && (self.recorder.state !== 'inactive')) {
            if (self.recorder.state === 'recording') {
                self.recorder.pause();
            } else if (self.recorder.state === 'paused') {
                self.recorder.resume();
            }

            if (typeof callback === 'function') { callback(); }
        }
    };

    self.finish = function(callback) {
        if (self.recorder) {
            console.log('[Screencast] Record: finish');
            if (self.recorder.state !== 'inactive' && self.data.length) {
                self.recorder.stop();
                self.finished = true;

                self.recorder.onstop = function () {
                    self.busy = false;
                    self.choosing = false
                    _dependencies.pages.screencast.recording_controls.hide();
                    _dependencies.transmitter.broadcast(
                        'change_audio_control_view',
                        {show:true}
                    );
                    self.do_post_record_action({
                        data: new Blob(self.data, {type: self.recorder.mimeType}),
                        mime_type: self.recorder.mimeType,
                        duration: self.timer.duration/1000
                    });

                    delete(self.data);
                };
            }
            _dependencies.streams.release(self.recorder.stream);

            if (typeof callback === 'function') { callback(); }
        }
    };

    self.do_post_record_action = function(file={}, action='edit') {
        file.type = 'screencast';
        file.temporary = (action !== 'edit');

        var session = ms_core.sessions.create(file);
        switch (action) {
            case 'edit':
                session.edit();
                break;

            case 'upload':
                session.upload();
                session.close();
                break;
        }
    };

    self.abort = function() {
        console.log('[Screencast] Aborted');
        self.aborted = true;
        self.reset();
    };

    self.reset = function() {
        if(_dependencies.pages.screencast.recording_controls.showUI){
            _dependencies.pages.screencast.recording_controls.hide();
        }

        if(_dependencies.pages.screencast.player.showUI){
            _dependencies.pages.screencast.player.hide();
        }

        // Release stream
        if (self.recorder && self.recorder.stream) {
            _dependencies.streams.release(self.recorder.stream);
        }
        delete(self.recorder);
        _dependencies.streams.release(self.audio_stream);

        self.busy = false;
        self.finished = false;
        self.aborted = false;
        self.data = [];
        self.volume = 0;
        self.timer.duration = 0;
    };

    _initialize();
}