function MSHotkeysTracker(parameters) {
    const self = this;

    self.state = {};
    self.codes = {};

    self.handlers = {};

    function _initialize(options={}) {
        // console.log(options);
        self.platform = options.platform || 'win';
        if (typeof options.onmatch === 'function') {
            self.handlers.onmatch = options.onmatch;
        }

        self.generate_codes_table();
        self.assign_event_handlers();
    }

    self.assign_event_handlers = function() {
        // Keyboard events
        $(document).on('keydown', function(e) {
            self.check_keys_state(e);
            self.match();
        });

        $(document).on('keyup', function(e) {
            self.check_keys_state(e);
        });
    };

    // TODO: Only alphanumeric keys are supported yet (+modifiers)
    self.generate_codes_table = function() {
        let symbols = {
            letters: {
                set: 'abcdefghijklmnopqrstuvwxyz',
                start_index: 65
            },
            numbers: {
                set: '0123456789',
                start_index: 48
            }
        };
        for (var type in symbols) {
            let base_code = symbols[type].start_index;
            let keys = symbols[type].set;
            keys.split('')
                .forEach(function(key, index) {
                    self.codes[base_code + index] = key;
                    self.state[key] = false;
                });
        }
    };

    self.match = function() {
        chrome.runtime.sendMessage(
            {
                message: 'match_local_hotkey',
                pressed_keys: self.get_pressed_keys()
            },
            function(response) {
                if (response.matched) {
                    console.log(`[Event] Hotkey matched: ${response.matched}`);
                    if (typeof self.handlers.onmatch === 'function') {
                        self.handlers.onmatch(response.matched);
                    }
                }
            }
        );
    };

    self.get_pressed_keys = function() {
        return Object.keys(self.state).filter(key => self.state[key]);
    };

    self.check_keys_state = function(e) {
        self.state.ctrl = e.ctrlKey;
        self.state.alt = e.altKey;
        self.state.shift = e.shiftKey;
        self.state.windows = (self.platform === 'win') && e.metaKey;
        self.state.cmd = (self.platform === 'mac') && e.metaKey;
        self.state.option = (self.platform === 'mac') && e.altKey;
        self.state.search = (self.platform === 'cros') && e.metaKey;

        var key_code = "";
        if(e.which&&e.which.toString){
            key_code = e.which.toString()
        }

        if (self.codes.hasOwnProperty(key_code)) {
            // console.log(`Key: ${self.codes[key_code]}`);
            self.state[self.codes[key_code]] = (e.type === 'keydown');
        }
    };

    _initialize(parameters);
}