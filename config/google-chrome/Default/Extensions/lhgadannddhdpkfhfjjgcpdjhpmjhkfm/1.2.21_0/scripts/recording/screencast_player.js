const page_type = 'screencast_player';

let bg;
let session_id, session;
let ms_screencast_player;

$(document).ready(function() {
    ChromeRuntimeAPI.get_background_context().then(function(context) {
        bg = context;

        var query = location.parse_query();
        session_id = query.session_id;
        session = bg.ms_core.sessions.get(session_id);
        console.log(session);

        if (typeof session === 'object') {
            ms_screencast_player = new MSScreencastPlayerView();
            const ms_export = new MSFileExportPanel();
        } else {
            alert('Something gone wrong...');
            window.close();
        }
    });
});


function MSScreencastPlayerView() {
    const self = this;
    self.ready = false;
    self.duration = 0;

    self.settings = {
        min_primitive_diameter: 3,
        min_video_size: 100,
        editor_scale: [0.1, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0]
    };

    function _initialize () {
        self.state.reset();

        if (session.data) {
            console.log('[Video viewer] Loading session...');
            self.ui.initialize();
            self.video.initialize();
            $(window).trigger('resize');
        } else {
            console.log('[!] No media data to load');
        }
    };

    self.state = {
        draw: false,
        busy: false,

        keys: {
            list: {
                ctrl: false,
                alt: false,
                shift: false,
                cmd: false,
                win: false
            },

            update: function(event) {
                self.state.keys.list = {
                    ctrl: event.ctrlKey,
                    alt: event.altKey,
                    shift: event.shiftKey,
                    cmd: (bg.ms_platform.os === 'mac' || event.metaKey),
                    win: (bg.ms_platform.os === 'win' || event.metaKey)
                };
            }
        },

        reset: function() {
            console.log('[Video viewer] State: reset');
            self.state.history.stack = session.edit_history;
            self.state.scale = 1;
            // Tool parameters
            self.state.keep_proportion = true;
        },

        history: {
            reset: function() {
                delete(self.state.history.head);
                self.state.history.stack = session.edit_history = [];
            },

            handle_update: function() {
                self.video.update();
            },

            get_current_head: function() {
                return (typeof self.state.history.head === 'number') ?
                    self.state.history.head :
                    ((self.state.history.stack.length) ? (self.state.history.stack.length - 1) : 0);
            },

            get: function() {
                var history = self.state.history.stack,
                    render_up_to = self.state.history.head;
                if (typeof render_up_to === 'number') {
                    if (render_up_to >= 0 && render_up_to <= (history.length - 1)) {
                        history = history.slice(0, self.state.history.head + 1);
                    } else if (render_up_to === -1) {
                        history = [];
                    }
                }

                return history;
            },

            push: function(primitive) {
                if (typeof self.state.history.head === 'number') {
                    self.state.history.stack = self.state.history.stack.slice(0, self.state.history.head + 1);
                    delete(self.state.history.head);
                }
                self.state.history.stack.push(primitive);
                session.edit_history = self.state.history.stack;
                self.state.history.handle_update();
            },

            undo: function() {
                ga_send_event('Video viewer', 'Undo', 'Tool');

                self.state.history.head = self.state.history.get_current_head();
                if (self.state.history.head >= 0) {
                    --self.state.history.head;
                    self.state.history.handle_update();
                }
                console.log(`[History] Undo (Cursor:${self.state.history.head})`);
            },

            redo: function() {
                ga_send_event('Video viewer', 'Redo', 'Tool');

                self.state.history.head = self.state.history.get_current_head();
                if (self.state.history.head < (self.state.history.stack.length - 1)) {
                    ++self.state.history.head;
                    self.state.history.handle_update();
                }
                console.log(`[History] Redo (Cursor:${self.state.history.head})`);
            },

            wipe: function() {
                ga_send_event('Video viewer', 'Wipe', 'Tool');
                console.log('[History] Wipe edit history');

                self.state.history.reset();
                self.state.history.handle_update();
                // _scene.fit_image_to_window(session.data.original);
            }
        }
    };

    self.ui = {
        $elements: {},

        initialize: function() {
            localize();

            self.ui.$elements.top_panel = $('#top_panel');
            self.ui.$elements.editor_actual_scale = $('#edit_zoom_scale span');
            self.ui.$elements.file_title_input = $('#file_title_input');

            self.ui.$elements.bottom_panel = $('#bottom_panel');
            self.ui.$elements.play_button = $('#play_pause_button');
            self.ui.$elements.current_position = $('.current_position');
            self.ui.$elements.total_duration = $('.total_duration');

            self.ui.$elements.media_wrapper = $('#media_wrapper');
            self.ui.$elements.media_player = document.querySelector('#media_player');
            $(self.ui.$elements.media_player).hide();

            self.ui.$elements.video_dimensions = $('#video_dimensions');
            self.ui.$elements.crop_overlay = document.querySelector('#crop_selection_overlay');
            self.ui.$elements.crop_selection_hint = $('#crop_selection_hint');

            self.ui.$elements.resize_overlay = $('#edit_area_overlay');
            self.ui.$elements.resize_width_input = $('#image_width_input');
            self.ui.$elements.resize_height_input = $('#image_height_input');
            self.ui.$elements.tool_keep_propotion_checkbox = $('#image_keep_proportion');

            self.video.canvas = self.ui.$elements.media_player;
            self.video.context = self.video.canvas.getContext('2d');

            self.ui.assign_event_handlers();
        },

        assign_event_handlers: function() {
            $(document).on('output_type_changed', function(e, data) {
                console.log(`[Event] Export format selected: ${data.type}`);
                if (self.ready) {
                    const current_position = self.video.element.currentTime;

                    if (data.type === 'gif') {
                        $('#gif_tools_panel').css('visibility', 'visible');
                        self.ui.$elements.playback_slider.select_mode('edit');
                    } else {
                        self.tools.unselect();
                        self.state.history.wipe();
                        self.ui.$elements.playback_slider.select_mode();
                        self.ui.$elements.playback_slider.set_current_position(current_position);
                        $('#gif_tools_panel').css('visibility', 'hidden');
                    }
                }
            });

            // Hotkeys
            $(document).on('keydown', function(e) {
                self.state.keys.update(e);

                switch (e.which) {
                    case 32: // Space
                        if (!is_element_in_focus(self.ui.$elements.file_title_input[0])) {
                            e.preventDefault();
                            self.video.toggle_playback();
                        }
                        break;

                    case 27: // Esc
                        console.log('[Video viewer] Key: Esc');
                        if (['resize', 'crop'].has(self.state.tool)) {
                            self.tools.unselect();
                        }
                        break;

                    case 13: // Enter
                        console.log('[Video viewer] Key: Enter');
                        if (self.state.tool === 'crop') {
                            self.tools.crop.submit();
                        } else if (self.state.tool === 'resize') {
                            self.tools.resize.submit();
                        }
                        break;

                    case 89: // Key Y
                        if ((self.state.keys.list.ctrl || self.state.keys.list.cmd) && self.state.keys.list.shift) {
                            console.log('[Video viewer] Hotkey: Ctrl/Cmd + Shift + Y (Wipe)');
                            self.state.history.wipe();
                        }
                        break;

                    case 90: // Key Z
                        if (self.state.keys.list.ctrl || self.state.keys.list.cmd) {
                            if (self.state.keys.list.shift) {
                                console.log('[Video viewer] Hotkey: Ctrl/Cmd + Shift + Z (Redo)');
                                self.state.history.redo();
                            } else {
                                console.log('[Video viewer] Hotkey: Ctrl/Cmd + Z (Undo)');
                                self.state.history.undo();
                            }
                        }
                        break;

                    case 187: // + sign
                        if (self.state.keys.list.ctrl) {
                            _scene.zoom({direction: 'in'});
                        }
                        break;

                    case 189: // - sign
                        if (self.state.keys.list.ctrl) {
                            _scene.zoom({direction: 'out'});
                        }
                        break;
                }
            });

            $(document).on('keyup', function(e) {
                self.state.keys.update(e)
            });

            document.body.oncontextmenu = function() {
                return false;
            };

            window.onresize = self.ui.resize_page;

            self.ui.$elements.play_button.on('click', self.video.toggle_playback);

            // GIF edit
            $(document).on('click', '.tool', function() {
                self.tools.select(this.dataset.action);
            });

            // Crop UI
            $(self.ui.$elements.crop_overlay).on('mousedown', function(e) {
                console.log(`[Tool] ${self.state.tool.capitalize()}: ${(self.state.draw) ? 'Finish' : 'Start'} drawing`);
                const canvas_offset = $(this).offset();
                const start_point = new Point(e.pageX - canvas_offset.left, e.pageY - canvas_offset.top);

                var primitive = self.state.current_primitive;
                if (!e.button) {
                    self.state.draw = true;

                    switch (primitive.context) {
                        case 'move':
                            primitive.move_from = start_point;
                            primitive.boundaries = new Point($(this).width() - primitive.width, $(this).height() - primitive.height);
                            break;

                        case 'draw':
                            self.ui.$elements.crop_selection_hint.hide();
                            primitive.points = [start_point, start_point];
                            break;
                    }
                }
            });

            $(document).on('mousemove', function(e) {
                const canvas = self.ui.$elements.crop_overlay;
                const canvas_position = $(canvas).position();
                const canvas_offset = $(canvas).offset();
                const current_point = new Point(
                    (e.pageX - canvas_offset.left).clamp(0, $(canvas).width()),
                    (e.pageY - canvas_offset.top).clamp(0, $(canvas).height())
                );

                const primitive = self.state.current_primitive;
                if (primitive) {
                    switch (primitive.type) {
                        case 'crop':
                            if (self.state.draw) {
                                _scene.clear_canvas(canvas);

                                switch (primitive.context) {
                                    case 'draw':
                                        primitive.points[1] = new Point(current_point.x, current_point.y);
                                        break;

                                    case 'move':
                                        var area_offset = new Point(current_point.x - primitive.move_from.x, current_point.y - primitive.move_from.y);
                                        var top_left_corner = new Point(
                                            (primitive.x + area_offset.x).clamp(0, primitive.boundaries.x),
                                            (primitive.y + area_offset.y).clamp(0, primitive.boundaries.y)
                                        );
                                        primitive.points = [
                                            top_left_corner,
                                            new Point(top_left_corner.x + primitive.width, top_left_corner.y + primitive.height)
                                        ];
                                        primitive.move_from = current_point;
                                        break;

                                    case 'resize':
                                        var opposite_corners = {
                                            nw:'se', ne:'sw', sw:'ne', se:'nw'
                                        };

                                        primitive.points = [
                                            new Point(current_point.x, current_point.y),
                                            new Point(
                                                primitive.handles[opposite_corners[primitive.active_handle]].x,
                                                primitive.handles[opposite_corners[primitive.active_handle]].y
                                            )
                                        ];
                                        break;
                                }
                                primitive.draw(canvas);
                            } else {
                                console.log(current_point.x, current_point.y);
                                if (self.ui.$elements.crop_selection_hint.is(':visible')) {
                                    self.ui.$elements.crop_selection_hint.css({
                                        'top': 10 + current_point.y,
                                        'left': 10 + canvas_position.left + current_point.x
                                    });
                                }
                                // console.log(current_point, self.ui.$elements.crop_selection_hint.width());

                                // cursor is outside of selection
                                primitive.context = 'draw';
                                canvas.style.cursor = 'crosshair';

                                if ( // cursor is inside of selection
                                    primitive.x <= current_point.x && current_point.x <= (primitive.x + primitive.width) &&
                                    primitive.y <= current_point.y && current_point.y <= (primitive.y + primitive.height)
                                ) {
                                    primitive.context = 'move';
                                    canvas.style.cursor = 'move';
                                }

                                // cursor is above one of the handles
                                for (let direction in primitive.handles) {
                                    const handle = primitive.handles[direction];
                                    if (Math.pow(handle.x - current_point.x, 2) + Math.pow(handle.y - current_point.y, 2) <= Math.pow(5, 2)) {
                                        canvas.style.cursor = `${direction}-resize`;
                                        primitive.context = 'resize';
                                        primitive.active_handle = direction;
                                        break;
                                    }
                                }
                            }
                            break;
                    }
                }
            });

            $(document).on('mouseup', function(e) {
                var primitive = self.state.current_primitive;

                if (!e.button) {
                    if (self.state.draw) {
                        self.state.draw = false;

                        if (primitive) {
                            switch (primitive.type) {
                                case 'crop':
                                    switch (primitive.context) {
                                        case 'draw':
                                            if (self.state.keys.alt) {
                                                self.tools.crop.submit();
                                            }
                                            break;

                                        case 'move':
                                            delete(primitive.move_from);
                                            delete(primitive.boundaries);
                                            break;
                                    }
                                break;
                            }
                        }
                    }
                }
            });

            // TODO: Hide hint on mouseout & show again on mouseenter if area isn't selected
            $(self.ui.$elements.crop_overlay).on('mouseenter', function(e) {
                if (!self.state.draw) {
                    // self.ui.$elements.crop_selection_hint.show();
                }
            });

            $(self.ui.$elements.crop_overlay).on('mouseout', function(e) {
                // self.ui.$elements.crop_selection_hint.hide();
            });

            $(document).on('click', '#crop_submit_button', self.tools.crop.submit);
            $(document).on('click', '#crop_cancel_button', self.tools.unselect);

            // Resize UI
            $(document).on('input', '#image_width_input', function() {
                self.tools.resize.set_new_image_size(this.value, 'width', self.state.keep_proportion);
            });
            $(document).on('input', '#image_height_input', function() {
                self.tools.resize.set_new_image_size(this.value, 'height', self.state.keep_proportion);
            });
            self.ui.$elements.tool_keep_propotion_checkbox.on('change', function() {
                self.state.keep_proportion = this.checked;
            });
            $(document).on('click', '#resize_submit_button', self.tools.resize.submit);

            // Scaling UI
            $(document).on('click', '#edit_zoom_in', function() {
                _scene.zoom({direction: 'in'});
            });
            $(document).on('click', '#edit_zoom_out', function() {
                _scene.zoom({direction: 'out'});
            });

            // Edit history UI
            $(document).on('click', '#edit_history_undo', self.state.history.undo);
            $(document).on('click', '#edit_history_redo', self.state.history.redo);
            $(document).on('click', '#edit_history_wipe', self.state.history.wipe);
        },

        fit_video_to_window: function(width, height) {
            // w_ - is for player wrapper, v_ - is for loaded video
            var top_panel_height = self.ui.$elements.top_panel.outerHeight(),
                bottom_panel_height = self.ui.$elements.bottom_panel.outerHeight();
            var w_width = $(window).width(),
                w_height = $(window).height() - (top_panel_height + bottom_panel_height);

            self.ui.$elements.media_wrapper.css({
                'margin-top': top_panel_height,
                'margin-bottom': bottom_panel_height,
                'width': w_width,
                'height': w_height
            });
            $(self.ui.$elements.media_player).css({
                'max-width': w_width,
                'max-height': w_height
            });

            self.state.scale = $(self.ui.$elements.media_player).height()/self.video.height;
        },

        resize_page: function() {
            self.ui.fit_video_to_window();

            if (self.state.tool === 'crop') {
                self.tools.crop.resize_underlay();
            }
        }
    };

    self.tools = {
        keep_proportions: true,
        types: ['crop', 'resize'],

        select: function(type) {
            console.log(`[Tool] Select: ${type}`);
            if (type && self.tools.types.has(type) && (self.state.tool !== type)) {
                self.tools.unselect();

                self.state.tool = type;
                self.state.draw = false;

                $(`.tool[data-action=${type}]`).addClass('active');

                switch (type) {
                    case 'crop':
                        self.ui.$elements.crop_overlay.style.cursor = 'crosshair';
                        self.tools.crop.initialize();
                        break;

                    case 'resize':
                        self.tools.resize.start();
                        break;
                }
            }
        },

        unselect: function() {
            if (self.state.tool === 'crop') {
                self.tools.crop.cancel();
            } else if (self.state.tool === 'resize') {
                self.tools.resize.cancel();
            }

            self.state.tool = null;
            $('.tool').removeClass('active');

            self.ui.$elements.crop_overlay.style.cursor = 'default';
        },

        crop: {
            image_crop_area: undefined,
            min_size: {
                width: 100,
                height: 100
            },
            active: false,
            selection: {},

            initialize: function() {
                ga_send_event('Video viewer', 'Crop', 'Tool');
                console.log('[Video viewer] Crop: Selection initialize');

                if (!self.state.current_primitive) {
                    self.state.current_primitive = new Crop([new Point(-10, -10), new Point(-10, -10)]);
                }

                self.tools.crop.resize_underlay();
                $(self.ui.$elements.crop_overlay).show();
                self.ui.$elements.crop_selection_hint.show();
            },

            resize_underlay: function() {
                var $media_player = $(self.ui.$elements.media_player);
                var position = $media_player.position();

                $(self.ui.$elements.crop_overlay).css({
                    top: position.top,
                    left: position.left
                });
                self.ui.$elements.crop_overlay.width = $media_player.width();
                self.ui.$elements.crop_overlay.height = $media_player.height();
            },

            select_all: function() {
                const canvas = self.ui.$elements.crop_overlay;
                self.tools.crop.update(0, 0, $(canvas).width(), $(canvas).height());
            },

            update: function(x, y, width, height) {
                self.state.current_primitive.points = [
                    new Point(x, y),
                    new Point(x + width, y + height)
                ];
                // console.log(x, y, width, height);
                self.state.current_primitive.draw();
            },

            submit: function() {
                var scale = $(self.ui.$elements.media_player).width()/self.ui.$elements.media_player.width;
                // console.log(selection, scale);

                var primitive = self.state.current_primitive;
                primitive.update(scale);

                self.tools.finish_primitive_creation();
                self.tools.unselect();
            },

            cancel: function() {
                delete(self.state.current_primitive);
                $(self.ui.$elements.crop_overlay).hide();
                self.ui.$elements.crop_selection_hint.hide();
            }
        },

        resize: {
            start: function() {
                self.state.current_primitive = new Resize(self.video.width, self.video.height);

                self.ui.$elements.resize_overlay.removeClass('ms_hidden');

                self.ui.$elements.resize_width_input.attr({
                    min: self.settings.min_video_size,
                    max: self.video.width * self.settings.editor_scale.last()
                });
                self.ui.$elements.resize_width_input.val(self.video.width);

                self.ui.$elements.resize_height_input.attr({
                    min: self.settings.min_video_size,
                    max: self.video.height * self.settings.editor_scale.last()
                });
                self.ui.$elements.resize_height_input.val(self.video.height);

                $('#image_keep_proportion').prop('checked', self.state.keep_proportion);
                self.tools.resize.render_preview();
            },

            set_new_image_size: function(input_data, side, keep_proportion) {
                var value = input_data.replace(/[\D]+/g, '');
                if (value) {
                    value = parseInt(value).clamp(1, 10000);

                    var inputs = {
                        width: self.ui.$elements.resize_width_input,
                        height: self.ui.$elements.resize_height_input
                    };
                    side = side || 'width';
                    let other_side = (side === 'width') ? 'height' : 'width';

                    // console.log(value, value/self.video[side]);
                    var primitive = self.state.current_primitive;
                    primitive[side] = Math.floor(value);
                    if (keep_proportion) {
                        primitive[other_side] = Math.floor(self.video[other_side] * value/self.video[side]);
                        inputs[other_side].val(primitive[other_side]);
                    }
                }
                inputs[side].val(primitive[side]);

                self.tools.resize.render_preview();
            },

            render_preview: function() {
                // Nothing at this time. Come back later, stranger!
            },

            submit: function() {
                var primitive = self.state.current_primitive;
                primitive.scale_x = primitive.width / self.video.width;
                primitive.scale_y = primitive.height / self.video.height;
                self.video.width = primitive.width;
                self.video.height = primitive.height;
                self.tools.finish_primitive_creation();
                self.tools.unselect();
            },

            cancel: function() {
                delete(self.state.current_primitive);
                self.ui.$elements.resize_overlay.addClass('ms_hidden');
                self.ui.fit_video_to_window();
            }
        },

        finish_primitive_creation: function() {
            self.state.current_primitive.scale = self.state.scale;
            self.state.history.push(self.state.current_primitive);
            if (['crop', 'resize'].has(self.state.current_primitive.type)) {
                // Fit video to window
            }
            delete(self.state.current_primitive);
        }
    };

    const _scene = {
        clear_canvas: function(canvas) {
            if (canvas) {
                let c;
                canvas.width = c = canvas.width;
            }
        },

        center_canvas: function() {
            var $edit_area = $('#editor_canvas_wrapper');
            var scroll_top = 0.5 * ($edit_area.height() - $(window).height()),
                scroll_left = 0.5 * ($edit_area.width() - $(window).width());
            $edit_area.scrollTop((scroll_top > 0) ? scroll_top : 0);
            $edit_area.scrollLeft((scroll_left > 0) ? scroll_left : 0);
        }
    };

    self.video = {
        element: document.createElement('video'),
        duration_read: false,
        canvas: null,
        context: null,

        transformation: null,
        width: 0,
        height: 0,
        finished: false,

        initialize: function() {
            self.video.element.src = get_media_src(session.data);

            self.video.element.onerror = function(e) {
                console.log(e);
            };

            // Video loading and navigation
            self.video.element.onseeking = function () {
                console.log(`[Event] Seeking to ${this.currentTime}`);
            };

            self.video.element.onseeked = function() {
                console.log(`[Event] Seeked to ${convert_seconds_to_time_string(this.currentTime)}:${convert_seconds_to_time_string(self.duration)}`);
                if (!self.video.duration_read) {
                    console.log(`2. Now we know that duration is ${this.currentTime}`);
                    self.video.duration_read = true;
                    self.duration = session.duration = this.currentTime;
                    this.currentTime = 0;
                } else {
                    // Already is in oncanplaythrough event listener
                    // self.video.update_navigation();
                }
            };

            self.video.element.onloadeddata = function() {
                console.log(`[Event] Data loaded (ready:${self.ready})`);
            };

            self.video.element.oncanplaythrough = function() {
                console.log(`[Event] Can play through\n Duration calculated: ${self.video.duration_read}\n Player is ready: ${self.ready}`);
                if (!self.ready) {
                    if (!self.video.duration_read) {
                        console.log('1. Lets rewind video to the end (to get its real duration in the case of webm)');
                        self.video.element.currentTime = 100000;
                    } else {
                        console.log('3. Screencast is loaded');
                        self.ready = true;

                        self.ui.$elements.playback_slider = new MSMediaPlaybackSlider({
                            duration: self.duration,
                            selectors: {wrapper: '#playback_progress_bar'},
                            on_boundary_change: function(begin, end) {
                                session.begin = begin;
                                session.end = end;
                            },
                            on_navigate: function(playback_position) {
                                self.video.element.currentTime = playback_position;
                            }
                        });

                        $(self.ui.$elements.media_player).show();
                        $(document).trigger('output_type_changed', {type: session.get_type()});

                        self.video.update();
                        self.video.element.load();
                    }
                } else {
                    self.video.render_current_frame();
                    self.video.update_navigation();
                    self.ui.fit_video_to_window();
                }
            };

            self.video.element.onplay = function() {
                self.ui.$elements.play_button.addClass('active');
                self.video.render();
            };

            self.video.element.onpause = function() {
                self.ui.$elements.play_button.removeClass('active');
            };
        },

        update: function() {
            console.log('[Event] Video updated');
            self.video.transformation = session.gif.merge_operations(
                {
                    width: self.video.element.videoWidth,
                    height: self.video.element.videoHeight
                },
                self.state.history.get()
            );

            self.video.canvas.width = self.video.width = self.video.transformation.crop.width * self.video.transformation.post_scale.x;
            self.video.canvas.height = self.video.height = self.video.transformation.crop.height * self.video.transformation.post_scale.y;
            self.ui.$elements.video_dimensions.html(
                `${self.video.width}&nbsp;<span style="font-size:14px;">&Cross;</span>&nbsp;${self.video.height}`
            );
            self.video.render_current_frame();
        },

        render: function() {
            if (self.video.element.paused || self.video.element.ended) { return false; }
            if (self.video.element.currentTime >= session.end) {
                self.video.element.pause();
                self.video.element.currentTime = session.begin;
                return false;
            }

            self.video.render_current_frame();
            self.video.update_navigation();
            setTimeout(self.video.render, 20);
        },

        render_current_frame: function() {
            var frame = session.gif.process_frame(self.video.element, self.video.transformation);
            self.video.context.drawImage(frame, 0, 0);
        },

        update_navigation: function() {
            self.ui.$elements.playback_slider.set_current_position(self.video.element.currentTime);
            self.ui.$elements.current_position.text(convert_seconds_to_time_string(self.video.element.currentTime));
            self.ui.$elements.total_duration.text(convert_seconds_to_time_string(self.duration));
        },

        toggle_playback: function() {
            if (self.ready) {
                console.log(`Video paused: ${self.video.element.paused}`);
                if (self.video.element.paused) {
                    console.log('[Event] Starts playing a video');
                    self.video.element.play()
                        .then(() => console.log('Promise resolved'))
                        .catch((e) => console.log('[!] Pause interrupted video playback', e));
                } else {
                    console.log('[Event] Paused a video');
                    self.video.element.pause();
                }
            }
        }
    };

    _initialize();
}

function Crop(points) {
    const self = this;
    this.type = 'crop';

    this.points = points || [];
    this.scale = 1;
    this.border_dash_offset = 0;

    this.update = function(scale) {
        scale = scale || this.scale;

        this.x = Math.round(Math.min(this.points[0].x, this.points[1].x)/scale);
        this.y = Math.round(Math.min(this.points[0].y, this.points[1].y)/scale);
        this.width = Math.round(Math.abs(this.points[0].x - this.points[1].x)/scale);
        this.height = Math.round(Math.abs(this.points[0].y - this.points[1].y)/scale);

        this.handles = {
            nw: {x:this.x, y:this.y},
            ne: {x:(this.x + this.width), y:this.y},
            sw: {x:this.x, y:(this.y + this.height)},
            se: {x:(this.x + this.width), y:(this.y + this.height)}
        }
    };

    this.draw = function(canvas) {
        canvas = canvas || ms_screencast_player.ui.$elements.crop_overlay;
        const context = canvas.getContext('2d');

        this.update();
        // this.border_dash_offset += (this.border_dash_offset < 11) ? 1 : 0;

        // console.log(this.x, this.y, this.width, this.height);
        context.save();
            context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            context.fillRect(0, 0, $(canvas).width(), $(canvas).height());
            context.clearRect(this.x, this.y, this.width, this.height);

            context.lineWidth = 1;
            context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            context.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
            context.setLineDash([6, 6]);
            context.lineDashOffset = this.border_dash_offset;
            context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
            context.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

            for (let direction in this.handles) {
                var handle = this.handles[direction];
                this.draw_handle(context, handle.x, handle.y);
            }
        context.restore();
    };

    this.draw_handle = function(context, x, y, r) {
        if (context) {
            r = r || 5;

            context.save();
                context.translate(x, y);
                context.beginPath();
                    context.arc(0, 0, r, 0, 2*Math.PI, false);
                context.closePath();

                this.add_shadow(context, 0, 1, 2, 'rgba(0, 0, 0, 0.3)');

                const gradient = context.createLinearGradient(0, r, 0, -r);
                gradient.addColorStop(0, '#fff');
                gradient.addColorStop(1, '#eee');
                context.fillStyle = gradient;
                context.fill();
            context.restore();
        }
    };

    this.add_shadow = function(context, x, y, blur_radius, color) {
        context.shadowOffsetX = x;
        context.shadowOffsetY = y;
        context.shadowColor = color;
        context.shadowBlur = blur_radius;
    };
}

function Resize(width, height) {
    const self = this;
    this.type = 'resize';

    this.width = width || 0;
    this.height = height || 0;
    this.scale_x = 1;
    this.scale_y = 1;
}