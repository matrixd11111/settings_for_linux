
var ms_popup;
let ms_app_data
$(document).ready(function() {
    ChromeRuntimeAPI.get_background_context().then(function(context) {
        ms_popup = new MSPopupView(context);
    });
});

function MSPopupView(bg) {
	const self = this;
	self.is_special_page = false;
    self.is_script_loaded = false;

	const _dependencies = {
        transmitter: new MSTransmitter(),
        tabs: new MSTabsManager(),
        notifications: MSNotificationsManager,
    };
    async function ms_app_data_init() {

    }
   async function _initialize() {
        _ui.initialize();
        _dependencies.transmitter.subscribe({
            'hotkeys_updated': (request, callback) => _ui.render_shortcuts()
        });

        self.check_is_page_special(function(result) {
            self.is_special_page = result;
            if (result) {
                _ui.show_special_page_options();
            } else {
                self.check_is_content_script_loaded();
            }
        })
    }

	const _ui = {
		initialize: function() {
			localize();

			_ui.show_options();
			_ui.assign_event_handlers();
			_ui.checkDefaultActions();
		},
        checkDefaultActions : ()=>{
         let applyLocal = bg.ms_app_data.get('apply_default_action_to_local_files');
         let postCaptureAction =  bg.ms_app_data.get('post_capture_action');

         let cssClass = '';
         if(applyLocal==true && postCaptureAction==='upload'){
             cssClass = 'open';
         }else{
             cssClass = 'upload';

         }

            $('.'+cssClass).addClass('ms_hidden');

        },
		assign_event_handlers: function() {
			$(document).on('click', '.screenshot_trigger', function(e) {
			    if (this.dataset.type) {
				    self.take_screenshot(this.dataset.type);
                }
			});

			$(document).on('click', '#record_desktop', function(e) {
                ga_send_event('Popup', 'Record desktop screencast');
                _dependencies.transmitter.broadcast('record_desktop').then(() => window.close());
            });

			$(document).on('click', '#open_local_file', function(e) {
                ga_send_event('Popup', 'Open local file');

                let input = document.createElement('input');
                input.type = 'file';
                input.onchange = ()=> {
                    let file = input.files[0];

                    var file_is_too_big = (file.size >  MSDefaultAppState.get('file_size_limit') );
                    if (file_is_too_big) {
                        _dependencies.notifications.show({
                            title: `${chrome.i18n.getMessage('alert_error_header')}`,
                            message: chrome.i18n.getMessage('notification_file_open_too_big')
                        });
                    }else{
                        get_file_data(file, 'binary_string').then(function (data) {
                            _dependencies.transmitter.broadcast('open_local_file', {
                                message: 'open_local_file',
                                action: 'process',
                                file: {
                                    data: data,
                                    type: file.type,
                                    name: file.name
                                }
                            }).then((response) => {
                                window.close();
                            });

                        })
                    }

                }
                input.click();
            });

			$(document).on('click', '#show_latest_uploads', function(e) {
                ga_send_event('Popup', 'Latest uploads');
			    _dependencies.transmitter.broadcast('show_latest_uploads').then(() => window.close());
            });

			$(document).on('click', '#show_options', function (e) {
                ga_send_event('Popup', 'Open preferences');
                _dependencies.transmitter.broadcast('open_preferences').then(() => window.close());
			});
		},

		show_special_page_options: function() {
            $('#special_page_notice').html(chrome.i18n.getMessage('popup_special_page_tip')).show();
            $('.screenshot_trigger').addClass('ms_hidden');
            $('.screenshot_trigger[data-type=window]').removeClass('ms_hidden');
            $('.screenshot_trigger[data-type=desktop]').removeClass('ms_hidden');
            $('.utils_trigger').removeClass('ms_hidden');
            $('.screenshot_trigger[data-command=capture_visible_area]').addClass('ms_hidden');
            _ui.render_shortcuts();
        },

		show_options: function() {
		    $('.menu_separator').removeClass('ms_hidden');
			$('.utils_trigger').removeClass('ms_hidden');
		},

        render_shortcuts: function() {
            $('.shortcut_label').remove();

            _dependencies.transmitter.broadcast('get_active_hotkeys', {globals_only: self.is_special_page})
                .then(function(response) {
                    // console.log(response);
                    response.hotkeys.forEach(function(s) {
                        const $wrapper = $(`[data-command=${s.name}]`);
                        if ($wrapper.length) {
                            console.log(s.shortcut);
                            $wrapper.append(`<span class="shortcut_label">${s.shortcut}</span>`);
                        }
                    });
                });
        }
	};

	self.take_screenshot = function(type) {
        ga_send_event('Popup', 'Take a screenhost', type);
        _dependencies.transmitter.broadcast('take_screenshot', {type: type});
	    if (type === 'webpage') {
            $('#loader').show();
        } else {
            window.close();
        }
	};

	self.check_is_page_special = function(callback) {
        _dependencies.tabs.active.get().then(function(tab) {
            const result = /^chrome:\/\//.test(tab.url);
            if (typeof callback === 'function') { callback(result); }
        });
    };

	self.check_is_content_script_loaded = function() {
        _dependencies.tabs.active.get().then(function(tab) {
            _dependencies.transmitter.broadcast('is_page_capturable', {}, tab.id)
                .then(function(response) {
                    self.is_script_loaded = true;

                    if (response.message === 'capturable') {
                        $('.screenshot_trigger').removeClass('ms_hidden');
                        _ui.render_shortcuts();
                    } else {
                        self.is_special_page = true;
                        _ui.show_special_page_options();
                    }
                });
        });
	};

	_initialize();
}