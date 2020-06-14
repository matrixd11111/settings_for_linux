function MSToolSizeSlider(parameters={}) {
    const self = this;

    const _min = (parameters.range && parameters.range.min) || 4;
    const _max = (parameters.range && parameters.range.max) || 14;
    const _step = (parameters.range && parameters.range.step) || 2;
    var _value = parameters.value || _min;

    const _callbacks = {
        on_change: parameters.on_change
    };

    var _dragging = false;

    function initialize() {
        ui.initialize();
        set_value(parameters.value || 10);
    }

    const ui = {
        $elements: {},

        initialize: function() {
            ui.$elements.wrapper = $(parameters.selectors && parameters.selectors.wrapper || '#tool_size_selector');
            ui.$elements.handle = ui.$elements.wrapper.find(parameters.selectors && parameters.selectors.handle || '.slider_handle');

            ui.assign_event_handlers();
        },

        assign_event_handlers: function() {
            ui.$elements.wrapper
                .on('click', convert_mouse_position_to_value)
                .on('mousedown', function() {
                    _dragging = true;
                });

            $(document)
                .on('mousemove', function(e) {
                    if (_dragging) { convert_mouse_position_to_value(e); }
                })
                .on('mouseup', function() {
                    _dragging = false;
                });

            function convert_mouse_position_to_value(e) {
                const slider_width = ui.$elements.wrapper.width();
                const mouse_x_relative = e.pageX - ui.$elements.wrapper.offset().left;
                set_value(_min + Math.floor(mouse_x_relative.clamp(0, slider_width)/slider_width * (_max - _min)));
            }
        },

        render: function() {
            const slider_width = ui.$elements.wrapper.width();
            ui.$elements.handle.css('left', Math.floor((_value - _min)/(_max - _min) * slider_width) + 'px');
        }
    };

    function set_value(value) {
        if (typeof value === 'number') {
            _value = get_nearest_value(value, _min, _max, _step);
            ui.render();
            if (typeof _callbacks.on_change === 'function') { _callbacks.on_change(_value); }
        }
    };

    initialize();

    return Object.freeze({
        set_value: set_value
    });
}

function MSMediaPlaybackSlider(parameters={}) {
    const self = this;

    const _duration = parameters.duration || 1;
    var _value = parameters.value || 0;
    const _step = parameters.step || 0.1;

    const _callbacks = {
        on_navigate: parameters.on_navigate,
        on_boundary_change: parameters.on_boundary_change
    }

    function initialize() {
        ui.initialize(parameters);
        select_mode();
    }

    const ui = {
        $elements: {},
        default_selectors: {
            wrapper: '#playback_progress_bar',
            progress: '.current_progress',
            interval_background: '.progress_background',
            progress_handle: '.slider_handle',
            trim_handles: '.trim_handle'
        },

        initialize: function(parameters) {
            ui.selectors = Object.assign(ui.default_selectors, parameters.selectors);
            ui.$elements.wrapper = $(ui.selectors.wrapper);
            ui.$elements.progress = ui.$elements.wrapper.find(ui.selectors.progress);
            ui.$elements.interval_background = ui.$elements.wrapper.find(ui.selectors.interval_background);
            ui.$elements.progress_handle = ui.$elements.wrapper.find(ui.selectors.progress_handle);

            var trim_handle_selector = ui.selectors.trim_handles;
            ui.$elements.trim_handles = {
                both: ui.$elements.wrapper.find(trim_handle_selector),
                begin: ui.$elements.wrapper.find(`${trim_handle_selector}[data-position=begin]`),
                end: ui.$elements.wrapper.find(`${trim_handle_selector}[data-position=end]`)
            };

            ui.assign_event_handlers();
        },

        assign_event_handlers: function() {
            ui.$elements.wrapper
                .on('click', set_new_playback_position)
                .on('mousedown', function() {
                    self.dragging = true;
                });

            ui.$elements.trim_handles.both
                .on('mousedown', function(e) {
                    e.stopPropagation();
                    _export_interval.dragging = true;
                    _export_interval.active_handle = this.dataset.position;
                });

            $(document)
                .on('mousemove', function(e) {
                    if (self.dragging) {
                        set_new_playback_position(e);
                    }

                    if (_export_interval.dragging) {
                        _export_interval.set_boundary(convert_mouse_position_to_value(e), _export_interval.active_handle);
                    }
                })
                .on('mouseup', function() {
                    self.dragging = false;
                    _export_interval.dragging = false;
                });

            function set_new_playback_position(e) {
                _playback.navigate_to(convert_mouse_position_to_value(e).clamp(_export_interval.begin, _export_interval.end), true);
            }

            function convert_mouse_position_to_value(e) {
                var $slider = ui.$elements.wrapper;
                var mouse_x_relative = e.pageX - $slider.offset().left;
                var value = mouse_x_relative/$slider.width() * _duration;
                return get_nearest_value(value, 0, _duration, _step);
            }
        },

        render_playback_position: function() {
            var progress_relative = (_value - _export_interval.begin)/_export_interval.duration;
            ui.$elements.progress.css('width', Math.ceil(100*(_value - _export_interval.begin)/_duration) + '%');
            ui.$elements.progress_handle.css({
                'left': Math.ceil(100*_value/_duration) + '%',
                'marginLeft': -16*progress_relative + 'px'
            });
        },

        render_playback_interval: function() {
            ui.$elements.interval_background.css({
                'left': 100*(_export_interval.begin/_duration) + '%',
                'width': Math.round(100*(_export_interval.duration/_duration)) + '%'
            });
            ui.$elements.progress.css('left', 100*(_export_interval.begin/_duration) + '%');
            ui.$elements.trim_handles.begin.css('left', 100*(_export_interval.begin/_duration) + '%');
            ui.$elements.trim_handles.end.css('left', 100*(_export_interval.end/_duration) + '%');
        },

        render: function() {
            ui.render_playback_position();
        }
    };

    function select_mode(mode) {
        _export_interval.reset();

        if (mode === 'edit') {
            ui.$elements.trim_handles.both.show();
        } else {
            ui.$elements.trim_handles.both.hide();
        }
    };

    const _export_interval = {
        begin: 0,
        end: 0,
        duration: 0,
        dragging: false,

        set_boundary: function(time, position) {
            var min_interval = 0.5;
            _export_interval[position] = (position === 'begin') ?
                time.clamp(0, _export_interval.end - min_interval) :
                time.clamp(_export_interval.begin + min_interval, _duration);
            _export_interval.duration = Math.abs(_export_interval.end - _export_interval.begin);

            ui.render_playback_interval();

            if (typeof _callbacks.on_boundary_change === 'function') {
                _callbacks.on_boundary_change(_export_interval.begin, _export_interval.end);
            }
            _playback.navigate_to((position === 'begin') ? _export_interval.begin : _export_interval.end);
        },

        reset: function() {
            _export_interval.set_boundary(_duration, 'end');
            _export_interval.set_boundary(0, 'begin');
        }
    };

    const _playback = {
        set_current_position: function(new_value) {
            _value = new_value.clamp(_export_interval.begin, _export_interval.end);
            ui.render_playback_position();
        },

        navigate_to: function(value) {
            _playback.set_current_position(value);
            // console.log(value, _value);
            if (typeof _callbacks.on_navigate === 'function') {
                _callbacks.on_navigate(_value);
            }
        }
    };

    initialize();

    return Object.freeze({
        select_mode: select_mode,
        set_current_position: _playback.set_current_position
    });
}