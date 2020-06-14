const page_type = 'rec_controls';
var hardware = new MSHardware()
var bg,global_settings ;
$(document).ready(function() {
    ChromeRuntimeAPI.get_background_context().then(function(context) {
        bg = context;
        global_settings = bg.ms_app_data;
        const ms_rec_controls = new MSScreencastRecordingControlsView();
    });
});

function MSScreencastRecordingControlsView() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    function initialize() {
        _dependencies.transmitter.subscribe({
            'update_memory_status': (request, callback) => ui.update_memory_status(request.memory.used, request.memory.available),

            'update_timer': (request, callback) => ui.update_timer(request.duration),

            'refreshrecordui': function(request, callback) {
                switch (request.status) {
                    case 'start':

                        break;

                    case 'pause':

                        break;

                    case 'finish':

                        break;
                }
            },
            'change_audio_control_view':function(request, callback){
               if(request.show){
                   ui.$elements.audioInput.prop( 'disabled', false );
                   $('.audio-controls,.enabler').show()
               }else{
                   ui.$elements.audioInput.prop( 'disabled', true );
                   $('.audio-controls,.enabler').hide()
               }
            }
        });

        ui.initialize();
    }

    const ui = {
        $elements: {},

        initialize: function() {
            ui.$elements.start_button = $('#start_button');
            ui.$elements.pause_button = $('#pause_button');
            ui.$elements.progress_indicator = $('#progress_indicator');
            ui.$elements.record_duration = $('#rec_duration');
            ui.$elements.memory_used_indicator = $('#rec_size');
            ui.$elements.audioInput = $('.audio-controls select')
            ui.$elements.audioEnabler = $('.enabler input')
            ui.$elements.permHelper = $('.enabler .no_permission_icon');


            navigator.permissions.query({name:'microphone'}).then(function(result) {
                ui.micPerm = result.state
                switch (result.state) {
                    case 'prompt':
                        ui.$elements.audioEnabler.prop("checked",false)
                        ui.$elements.audioInput.prop( 'disabled', true );
                        break;
                    case 'granted':
                        ui.$elements.audioEnabler.prop("disabled",false);
                        ui.$elements.audioEnabler.prop("checked",global_settings.get('enable_audio_screencast'))
                        ui.$elements.audioInput.prop( 'disabled', !global_settings.get('enable_audio_screencast') );
                        hardware.media_devices.get_microphones(function(devices){
                            ui.devices = devices
                            ui.$elements.audioInput.html("")
                            ui.devices.forEach(function (item, i) {
                                ui.$elements.audioInput.append("<option value="+ parseInt(i)+">"+item.label+"</option>")
                            })
                        });
                        break;
                    case 'denied':
                       ui.$elements.audioInput.prop( 'disabled', true );
                        ui.$elements.audioEnabler.prop("disabled",true)
                        ui.$elements.permHelper.css("display","block")
                    break;
                }
            });



            localize();
            ui.update_timer(0);
            ui.update_memory_status();
            ui.assign_event_handlers();
        },

        assign_event_handlers: function() {
            ui.$elements.start_button.on('click', function(e) {
                // console.log(`Record: started=${record.started}, in progress=${record.in_progress}`);
                (record.started) ? record.finish() : record.start()
            });

            ui.$elements.pause_button.on('click', function(e) {
                if (record.started) {
                    record.pause();
                }
            });

            $(document).on('change', '#capture_audio_checkbox', function(e) {
                const enable_audio = this.checked;
                record.audio.toggle(enable_audio);
            });

            //patch for click prevent propagation
            $(document).on('click' , function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                return;
            })

            /*$(ui.$elements.audioInput).on('click' , function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                return;
            })*/
            $(ui.$elements.audioEnabler).on('change' , function(e) {

                e.stopPropagation();
                e.stopImmediatePropagation();

                if (ui.micPerm=='prompt'){
                    navigator.getUserMedia = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia;

                         if (navigator.getUserMedia) {
                                navigator.getUserMedia({ audio: true },function () {
                                    hardware.media_devices.get_microphones(function(devices){
                                        ui.devices = devices
                                        ui.$elements.audioInput.html("");
                                        ui.$elements.audioInput.prop( 'disabled', false );
                                        ui.devices.forEach(function (item, i) {
                                            ui.$elements.audioInput.append("<option value="+ parseInt(i)+">"+item.label+"</option>")
                                        })


                                        _dependencies.transmitter.broadcast(
                                            'update_audio_input',
                                            {
                                                audio:ui.devices[0]
                                            }
                                        );

                                    })
                                },function () {
                                    console.log("oops , error")
                                    ui.$elements.audioInput.html("")
                                    ui.$elements.audioEnabler.prop("disabled",true);
                                    ui.$elements.audioEnabler.prop("checked",true);
                                    ui.$elements.audioInput.prop( 'disabled', true );
                                    ui.$elements.permHelper.css("display","block")
                                })
                        }
                }else if(ui.micPerm=='granted'){


                    if(e.target.checked){
                        ui.$elements.audioInput.prop( 'disabled', false );
                        global_settings.set({enable_audio_screencast: true});
                        _dependencies.transmitter.broadcast(
                            'update_audio_input',
                            {
                                audio:ui.devices[0]
                            }
                        );
                    }else{
                        ui.$elements.audioInput.prop( 'disabled', true );
                        global_settings.set({enable_audio_screencast: false});
                        _dependencies.transmitter.broadcast(
                            'update_audio_input',
                            {
                                audio:false
                            }
                        );
                    }

                }

            });
            $(ui.$elements.permHelper).on('click', function(e) {

                e.stopPropagation();
                e.stopImmediatePropagation();

                chrome.windows.getAll(function(data){

                   let w = data.filter(function (item) {
                            return item.type=="normal"
                    })
                    chrome.tabs.create({windowId:w[0].id,url: "chrome://settings/content/microphone"}, function(data){
                        window.close()
                    });
                });

            });
            $(document).on('change', ui.$elements.audioInput, function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();

                let send ={
                    audio:false
                };
                if (e.target.value!="false"){
                    send = {
                        audio:ui.devices[parseInt(e.target.value)]
                    }
                }
                _dependencies.transmitter.broadcast(
                    'update_audio_input',
                    send
                );
            })
            window.onbeforeunload = function() {
                if (!record.finished) {
                    (record.started) ? record.finish() : record.abort()
                }
            };
        },

        update_timer: function(duration) {
            ui.$elements.record_duration.text(convert_seconds_to_time_string(duration));
        },

        update_memory_status: function(used=0, free=0) {
            ui.$elements.memory_used_indicator.text(get_volume_string(used, false));
        }
    };

    const record = {
        started: false,
        in_progress: false,
        finished: false,

        audio: {
            enabled: false,

            toggle: function(record_audio) {
                record_audio = (record_audio === true);
                _dependencies.transmitter.broadcast(
                    'record_desktop',
                    {action: (new_value === true) ? 'enable_audio' : 'disable_audio'}
                ).then(() => record.audio.enabled = record_audio);
            }
        },

        start: () => _dependencies.transmitter.broadcast('record_desktop', {action: 'start'})
            .then(function(response) {
                record.started = true;
                record.in_progress = true;

                ui.$elements.start_button.addClass('active');
                ui.$elements.progress_indicator.addClass('active');
            }),

        pause: () => _dependencies.transmitter.broadcast('record_desktop', {action: 'pause'})
            .then(function(response) {
                if (record.in_progress) {
                    record.in_progress = false;
                    ui.$elements.pause_button.addClass('active');
                    ui.$elements.progress_indicator.removeClass('active');
                } else {
                    record.in_progress = true;
                    ui.$elements.pause_button.removeClass('active');
                    ui.$elements.progress_indicator.addClass('active');
                }
            }),

        finish: () => _dependencies.transmitter.broadcast('record_desktop', {action: 'finish'})
            .then(function(response) {
                record.in_progress = false;
                record.finished = true;

                ui.$elements.start_button.removeClass('active');
                window.close();
            }),

        abort: () => _dependencies.transmitter.broadcast('record_desktop', {action: 'abort'})
    };

    initialize();
}