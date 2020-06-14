function MSViewsManager() {
    const self = this;

    const _dependencies = {
        tabs: new MSTabsManager(),
        windows: MSWindowsManager,
        ms_platform :  new MSPlatform(),
    };

    const _urls = {
        editor: 'editor.html',
        rec_controls: 'recording_controls.html',
        countdown: 'countdown.html',
        screencast_player: 'screencast_player.html',
        latest_uploads: 'latest_uploads.html'
    };
    const _default = 'editor';

    self.check_if_exists = function(page) {
        return _urls.hasOwnProperty(page) ? page : _default;
    };

    self.get_page_url = (page) => ChromeRuntimeAPI.get_extension_file_url(_urls[self.check_if_exists(page)]);

    self.send_message = function(page, command, data={}) {
        const message = Object.assign({
            message: command,
            page: page
        }, data);
        return _dependencies.tabs.send_message(null, message);
    };

    self.open = function(page, single_instance=true) {
        const url = self.get_page_url(page);
        return (single_instance) ?
            self.close(page).then(() => _dependencies.tabs.open(url)) :
            _dependencies.tabs.open(url);
    };

    self.open2 = function(url, create_separate_window=false, window_sizes) {
        return new Promise(function (resolve, reject) {
            if (typeof url === 'string') {
                if (create_separate_window) {
                    _dependencies.windows.open({
                        url: url,
                        centered: true,
                        width: (window_sizes && window_sizes.width) || 1024,
                        height: (window_sizes && window_sizes.height) || 630,
                        callback: function(w) {
                            _dependencies.windows.focus(w.id, 1);
                            resolve({
                                id: w.tabs[0].id,
                                url: url,
                                window_id: w.id
                            });
                        }
                    });
                } else {
                    _dependencies.tabs.open(url).then(function(t) {
                        resolve({
                            id: t.id,
                            url: url,
                            window_id: t.windowId
                        });
                    });
                }
            } else {
                reject('[Session] Cant open the editor without session_id');
            }
        });
    };

    self.screenshot = {
        capture_countdown: {
            show: (delay=1, callback) => _dependencies.windows.open({
                url: `${self.get_page_url('countdown')}#${delay}`,
                top: 10,
                left: 10,
                width: 100,
                height: 100,
                callback: (new_window) => setTimeout(
                    () => _dependencies.windows.close(new_window.id).then(callback),
                    1000*delay
                )
            }),

            hide: () => self.close('countdown')
        },

        editor: {
            size: {
                width: 1024,
                height: 650
            },

            open: function (session_id, create_separate_window=false) {
                const url = `${self.get_page_url('editor')}?session_id=${session_id}`;
                return self.open2(url, create_separate_window, self.screenshot.editor.size);
            },

            close: function(session_id) {

            }
        }
    };

    self.screencast = {
        recording_controls: {
            showUI:false,
            size: {
                width: 240,
                height: 175  //175
                // height: 122
            },

            show: function() {
                self.screencast.recording_controls.showUI = true;
                _dependencies.ms_platform.then(function (a,b) {
                    if(a.os_full=="macOS"){
                        self.screencast.recording_controls.size.height = 175
                    }else{
                        self.screencast.recording_controls.size.height = 200
                    }
                    _dependencies.windows.open({
                        url: self.get_page_url('rec_controls'),
                        top: (window.screen.availHeight - self.screencast.recording_controls.size.height) - 30,
                        left: 30,
                        width: self.screencast.recording_controls.size.width,
                        height: self.screencast.recording_controls.size.height,
                        on_top: true,
                        callback: (w) => _dependencies.windows.focus(w.id, 1)
                    });

                })

            },

            hide: () => {
                self.screencast.recording_controls.showUI = false;
                self.close('rec_controls');
            }
        },

        player: {
            showUI:false,
            size: {
                width: 860,
                height: 430
            },

            open: function (session_id, create_separate_window=false) {
                self.screencast.player.showUI = true;
                const url = `${self.get_page_url('screencast_player')}?session_id=${session_id}`;
                return self.open2(url, create_separate_window, self.screencast.player.size);
            },

            hide: () => {
                self.screencast.player.showUI = false;
                self.close('screencast_player')
            }
        }
    };

    self.open_preferences = ChromeRuntimeAPI.open_preferences;
    self.open_extensions_shortcuts = () => _dependencies.tabs.open('chrome://extensions/shortcuts');

    self.redirect = (page, target_url) => self.send_message(page, 'tabs_change_url', {url: target_url});
    self.reload = (page) => self.send_message(page, 'tabs_reload');
    self.close = (page) => self.send_message(page, 'tabs_close');
}