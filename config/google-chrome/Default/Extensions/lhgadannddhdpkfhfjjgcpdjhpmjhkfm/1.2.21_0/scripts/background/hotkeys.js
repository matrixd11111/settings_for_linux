function MSHotkeysManager() {
    const self = this;
    const _native_api = ChromeCommandsAPI;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager
    };

    const _handlers = {
        'capture_visible_area': () => ms_core.screenshot.take('window'),
        'capture_page_area': () => ms_core.screenshot.take('area'),
        'capture_whole_page': () => ms_core.screenshot.take('webpage'),
        'capture_fullscreen': () => ms_core.screenshot.take('desktop'),
        'open_local_file': () => ms_core.file.local.open(),
        'record_desktop': () => ms_core.screencast.initialize(),
        'record_start_stop': () => ms_core.screencast.toggle()
    };

    function _initialize() {
        self.local.load();

        _dependencies.transmitter.subscribe({
            'get_active_hotkeys': (request, callback) => self.get(request.globals_only).then((hotkeys) => callback({hotkeys: hotkeys})),

            'get_local_hotkeys': (request, callback) => callback({hotkeys: self.local.get(true)}),

            'match_local_hotkey': (request, callback) => callback({
                matched: (self.local.enabled) ? self.local.match(request.pressed_keys) : false
            }),

            'update_local_hotkeys': (request, callback) => self.local.update(request.name, request.keys)
        });

        ChromeEventsAPI.command_triggered(_handlers);

        ChromeEventsAPI.storage_updated({
            'webpage_hotkeys': function(new_value, old_value) {
                self.local.load();
                _dependencies.transmitter.broadcast('hotkeys_updated');
            },

            'webpage_enable_hotkeys': function(new_value, old_value) {
                self.local.enabled = new_value;
            }
        });
    }

    self.global = {
        list: [],
        internals: ['_execute_browser_action'],

        get: function() {
            return new Promise(function(resolve, reject) {
                ChromeCommandsAPI.get_all().then(
                    function(commands) {
                        self.global.list = commands
                            .filter(c => !self.global.internals.has(c.name))
                            .map(
                                (c) => ({
                                    name: c.name,
                                    keys: c.shortcut
                                        .toLowerCase()
                                        .replace(/[ ]+/g, '')
                                        .split('+')
                                })
                            );
                        resolve(self.global.list);
                    },
                    reject
                );
            })
        }
    };

    self.local = {
        list: [],
        enabled: ms_app_data.get('webpage_enable_hotkeys'),

        get: function(raw=true) {
            return (raw) ? self.local.list : self.process(self.local.list);
        },

        update: function(name, keys) {
            // console.log(name, keys);
            if (Array.isArray(keys) && (keys.length === 3)) {
                const all = self.local.list;

                if (!self.local.check_if_collision_exist(keys)) {
                    const hotkey = all.find((h) => (h.name === name));
                    if (hotkey) {
                        hotkey.keys = keys;
                    } else {
                        all.push({
                            name: name,
                            keys: keys
                        });
                    }
                    self.local.save(() => _dependencies.transmitter.broadcast('hotkeys_updated'));
                } else {
                    _dependencies.notifications.show({
                        message: chrome.i18n.getMessage('notification_hotkey_assign_conflict'),
                        hide_delay: 4
                    });
                }
            }
        },

        match: function(state) {
            const hotkeys = self.local.get();
            for (h of hotkeys) {
                if (new Set(state).include(h.keys)) {
                    return h.name;
                }
            }
        },

        check_if_collision_exist: (keys) => self.local.list.some(
            (shortcut) => shortcut.keys.join(',').toLowerCase() === keys.join(',').toLowerCase()
        ),

        load: function() {
            try {
                self.local.list = ms_app_data.get('webpage_hotkeys');
                console.log('[Hotkeys] Locals: loading', self.local.list);
            } catch(e) {}
        },

        save: () => function() {
            console.log('[Hotkeys] Locals: update');
            ms_app_data.set({webpage_hotkeys: self.local.get()})
        }
    };

    self.modifiers = {
        designations: {
            mac: {
                'ctrl': '\u2303', // ⌃
                'alt': '\u2325', // ⌥
                'shift': '\u21E7', // ⇧
                'command': '\u2318', // ⌘
                'space': '\u2423', // ␣
                'tab': '\u21E5', // ⇥
                'return': '\u23CE', // ⏎
                'escape': '\u238B' // ⎋
            }
        },

        replace_with_symbols: function(keys) {
            if (Array.isArray(keys)) {
                if (ms_platform.os === 'mac') {
                    return keys
                        .map(key => key.toLowerCase())
                        .map(key => (self.modifiers.designations.mac.hasOwnProperty(key)) ? self.modifiers.designations.mac[key] : key)
                        .join('');
                } else {
                    return keys.join('+');
                }
            }

            return keys;
        }
    };

    self.get = function(globals_only=false, raw=false) {
        return new Promise(function(resolve, reject) {
            self.global.get().then(
                function(commands) {
                    const hotkeys = (!globals_only && self.local.enabled) ? commands.concat(self.local.get()) : commands;
                    resolve((raw === true) ? hotkeys : self.process(hotkeys));
                },
                reject
            );
        });
    };

    self.process = function(hotkeys) {
        return hotkeys.map(function(h) {
            return Object.assign({}, h, {
                shortcut: self.modifiers.replace_with_symbols(
                    h.keys
                        .map(key => key.toLowerCase())
                        .sort((a, b) => b.length - a.length)
                )
            });
        });
    };

    _initialize();
}