const page_type = 'editor';

let bg, global_settings;
let session_id, session;
let ms_editor;

$(document).ready(function () {
    ChromeRuntimeAPI.get_background_context().then(function (context) {
        bg = context;
        global_settings = bg.ms_app_data;

        var query = location.parse_query();
        session_id = query.session_id;
        session = bg.ms_core.sessions.get(session_id);

        if (typeof session === 'object') {
            ms_editor = new MSScreenshotEditorView();
            const ms_export = new MSFileExportPanel();
        } else {
            alert('Something gone wrong...');
            window.close();
        }
    });
});

function MSScreenshotEditorView() {
    const self = this;

    self._dependencies = {
        notifications: MSNotificationsManager
    };

    function _initialize() {
        self.ui.initialize();
        self.state.reset();
        self.state.check();
    }

    self.settings = {
        min_primitive_diameter: 3,
        r: 10,
        blur_scale: 1 / 8,
        editor_scale: [0.1, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0],
        tool_size: {
            min: 4,
            max: 14,
            step: 2
        },
        scrollbar: {
            width: 10,
            height: 10
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

            update: function (event) {
                self.state.keys.list = {
                    ctrl: event.ctrlKey,
                    alt: event.altKey,
                    shift: event.shiftKey,
                    cmd: (bg.ms_platform.os === 'mac' || event.metaKey),
                    win: (bg.ms_platform.os === 'win' || event.metaKey)
                };
            }
        },

        check: function () {
            if (session.data.original) {
                console.log('[Editor] Loading session...');
                self.scene.fit_image_to_window(session.data.original);
            } else {
                console.log('[!] No image data to load');
            }
        },

        reset: function () {
            console.log('[Editor] State: reset');
            self.state.history.stack = session.edit_history;
            self.state.scale = 1;
            // Tool parameters
            self.palette.pick_color(global_settings.get('editor_tool_color') || self.palette.default_colors[0]);
            self.state.tool_size = parseInt(global_settings.get('editor_tool_size'));
            self.ui.$elements.tool_size_slider.set_value(self.state.tool_size);
            self.state.add_shadow = true;
            self.state.add_outline = true;
            self.state.keep_proportion = true;
            self.ui.$elements.tool_shadow_checkbox.prop('checked', self.state.add_shadow);
            const current_tool = global_settings.get('editor_tool');
            self.tools.select(
                (!['crop', 'resize'].has(current_tool)) ? current_tool : MSDefaultAppState.get('editor_tool')
            );
        },

        history: {
            reset: function () {
                delete (self.state.history.head);
                self.state.history.stack = session.edit_history = [];
            },

            get_current_head: function () {
                return (typeof self.state.history.head === 'number') ?
                    self.state.history.head :
                    ((self.state.history.stack.length) ? (self.state.history.stack.length - 1) : 0);
            },

            get: function () {
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

            push: function (primitive) {
                if (typeof self.state.history.head === 'number') {
                    self.state.history.stack = self.state.history.stack.slice(0, self.state.history.head + 1);
                    delete (self.state.history.head);
                }
                self.state.history.stack.push(primitive);
                session.edit_history = self.state.history.stack;
            },

            undo: function () {
                ga_send_event('Editor', 'Undo', 'Tool');

                self.tools.text_and_bubble.detect_and_submit();
                self.state.history.head = self.state.history.get_current_head();
                if (self.state.history.head > -1) {
                    --self.state.history.head;
                    self.scene.render();
                }
                console.log(`[History] Undo (Cursor:${self.state.history.head})`);
            },

            redo: function () {
                ga_send_event('Editor', 'Redo', 'Tool');

                self.tools.text_and_bubble.detect_and_submit();
                self.state.history.head = self.state.history.get_current_head();
                if (self.state.history.head < (self.state.history.stack.length - 1)) {
                    ++self.state.history.head;
                    self.scene.render();
                }
                console.log(`[History] Redo (Cursor:${self.state.history.head})`);
            },

            wipe: function () {
                ga_send_event('Editor', 'Wipe', 'Tool');
                console.log('[History] Wipe edit history');

                self.tools.text_and_bubble.detect_and_submit();
                self.state.history.reset();
                self.scene.fit_image_to_window(session.data.original);
            }
        }
    };

    self.ui = {
        $elements: {},
        templates: {
            palette: ejs.get_template('/editor/palette.ejs')
        },

        initialize: function () {
            console.log('[Editor UI] Initialization...');
            self.palette.render();

            self.ui.$elements.bottom_panel = $('#bottom_panel');
            self.ui.$elements.top_panel = $('#top_panel');

            self.ui.$elements.canvas_wrapper = $('#editor_canvas_wrapper');
            self.ui.$elements.canvas_wrapper.css({
                'marginTop': self.ui.$elements.top_panel.outerHeight(),
                'marginBottom': self.ui.$elements.bottom_panel.outerHeight()
            });

            self.ui.$elements.image_edit_area = $('#image_edit_area');

            self.ui.$elements.image_resize_preview = document.getElementById('image_resize_preview');
            self.ui.$elements.canvas1 = document.getElementById('canvas1');
            self.ui.$elements.canvas2 = document.getElementById('canvas2');

            self.ui.$elements.text_input = document.getElementById('text_tool_input');

            self.ui.$elements.tool_shadow_checkbox = $('#tool_shadow_checkbox');
            self.ui.$elements.tool_outline_checkbox = $('#tool_outline_checkbox');
            self.ui.$elements.tool_keep_propotion_checkbox = $('#image_keep_proportion');
            self.ui.$elements.editor_actual_scale = $('#edit_zoom_scale span');

            self.ui.$elements.tool_size_slider = new MSToolSizeSlider({
                selectors: {
                    wrapper: '#tool_size_selector',
                    slider: '.slider_handle'
                },
                range: self.settings.tool_size,
                value: parseInt(global_settings.get('editor_tool_size')),
                on_change: function (value) {
                    self.state.tool_size = value;
                    if (session.is_last()) {
                        global_settings.set({editor_tool_size: value});
                    }
                }
            });

            $('#loading').show();
            $(self.ui.$elements.canvas1).hide();
            $(self.ui.$elements.canvas2).hide();
            localize();
            self.ui.assign_event_handlers();
        },

        assign_event_handlers: function () {
            console.log('[Editor UI] Assigning event handlers');

            // Hotkeys
            $(document).on('keydown', function (e) {
                self.state.keys.update(e);

                switch (e.which) {
                    case 27: // Esc
                        console.log('[Editor] Key: Esc');
                        if (self.state.tool === 'counter') {
                            self.tools.counter.cancel();
                        } else if (['resize', 'crop'].has(self.state.tool)) {
                            self.tools.select_previous();
                        } else if (['text', 'bubble'].has(self.state.tool)) {
                            self.tools.text.interrupt_input();
                        }
                        break;

                    case 13: // Enter
                        console.log('[Editor] Key: Enter');
                        if (self.state.tool === 'counter') {
                            self.tools.counter.submit();
                        } else if (self.state.tool === 'crop') {
                            self.tools.crop.submit();
                        } else if (self.state.tool === 'resize') {
                            self.tools.resize.submit();
                        } else {
                            if (self.state.keys.list.shift) {
                                self.tools.text_and_bubble.detect_and_submit();
                            }
                        }
                        break;

                    case 89: // Key Y
                        if ((self.state.keys.list.ctrl || self.state.keys.list.cmd) && self.state.keys.list.shift) {
                            console.log('[Editor] Hotkey: Ctrl/Cmd + Shift + Y (Wipe)');
                            self.state.history.wipe();
                        }
                        break;

                    case 90: // Key Z
                        if (self.state.keys.list.ctrl || self.state.keys.list.cmd) {
                            if (self.state.keys.list.shift) {
                                console.log('[Editor] Hotkey: Ctrl/Cmd + Shift + Z (Redo)');
                                self.state.history.redo();
                            } else {
                                console.log('[Editor] Hotkey: Ctrl/Cmd + Z (Undo)');
                                self.state.history.undo();
                            }
                        }
                        break;

                    case 187: // + sign
                        if (self.state.keys.list.ctrl) {
                            self.scene.zoom({direction: 'in'});
                        }
                        break;

                    case 189: // - sign
                        if (self.state.keys.list.ctrl) {
                            self.scene.zoom({direction: 'out'});
                        }
                        break;
                }

                self.tools.check_alternative_drawing_mode();
            });

            document.addEventListener('copy', async (e) => {
                e.preventDefault();

                try {
                    if (typeof ms_editor === 'undefined') {
                        throw new Error("No editor");
                    }
                    const data = await ms_editor.exportPNG();
                    await MSClipboard.writeImageBlobToClipboard(data);
                    self
                        ._dependencies
                        .notifications
                        .show({message: chrome.i18n.getMessage('notification_image_copy_to_clipboard_success')});
                } catch (e) {
                    self
                        ._dependencies
                        .notifications
                        .show({message: chrome.i18n.getMessage('notification_file_save_fail')});
                    throw e;
                }
            });

            $(document).on('keyup', function (e) {
                self.state.keys.update(e);
                self.tools.check_alternative_drawing_mode();
            });

            // General UI
            $(window).resize(function () {
                // console.log(window.innerWidth, window.innerHeight);
            });

            $(document).on('contextmenu', () => false);

            // Tools UI
            $(document).on('click', '#toggle_palette_button', self.palette.toggle);

            $(document).on('click', '.default_color', function () {
                self.palette.pick_color(this.dataset.color);
                self.palette.hide();
            });

            $(document).on('click', '.custom_color', function () {
                $('#tool_color_picker').ColorPickerSetColor(self.state.current_color);
                self.palette.colorpicker.toggle();
            });

            $('#tool_color_picker').ColorPicker({
                flat: true,
                onChange: function (hsb, hex, rgb) {
                    ga_send_event('Editor', 'Color submit', 'Colorpicker');
                    self.palette.pick_color(`#${hex}`);
                },
                onSubmit: function () {
                    self.palette.hide();
                }
            });

            self.ui.$elements.tool_shadow_checkbox.on('change', function () {
                self.state.add_shadow = this.checked;
            });

            self.ui.$elements.tool_outline_checkbox.on('change', function () {
                self.state.add_outline = this.checked;
            });

            $(document).on('click', '.set_default_tool_size', function () {
                self.ui.$elements.tool_size_slider.set_value(parseInt(this.dataset.size));
            });

            self.ui.$elements.tool_keep_propotion_checkbox.on('change', function () {
                self.state.keep_proportion = this.checked;
            });

            $(document).on('click', '.tool', function () {
                self.palette.hide();
                if (this.dataset.action) {
                    self.tools.select(this.dataset.action);
                }
            });

            $(self.ui.$elements.canvas2).on('mousedown', function (e) {
                // console.log(`[Events] canvas2 ${e.type}`);
                console.log(`[Tool] ${self.state.tool.capitalize()}: ${(self.state.draw) ? 'Finish' : 'Start'} drawing`);
                const canvas_offset = $(this).offset();
                const start_point = new Point(e.pageX - canvas_offset.left, e.pageY - canvas_offset.top);
                const rgb_color = MSColorTools.convert.hex_to_rgb(self.state.current_color);

                self.palette.hide();
                if (!e.button) {
                    switch (self.state.tool) {
                        case 'arrow':
                            ga_send_event('Editor', 'Arrow', 'Tool');

                            self.state.draw = true;
                            self.state.current_primitive = new Arrow(self.state.tool_size, rgb_color, [start_point, start_point], self.settings.r, self.settings.dr, self.state.add_shadow, self.state.keys.list.ctrl);
                            break;

                        case 'rectangle':
                            ga_send_event('Editor', 'Rectangle', 'Tool');

                            self.state.draw = true;
                            console.log(`Highlight: ${self.state.keys.list.alt}`);
                            self.state.current_primitive = new Rectangle(self.state.tool_size, rgb_color, [start_point, start_point], self.state.keys.list.ctrl, self.state.keys.list.shift, self.state.keys.list.alt, self.state.add_shadow);
                            break;

                        case 'line':
                            ga_send_event('Editor', 'Line', 'Tool');

                            self.state.draw = true;
                            self.state.current_primitive = new Line(self.state.tool_size, rgb_color, [start_point, start_point], self.state.add_shadow);
                            break;

                        case 'ellipse':
                            ga_send_event('Editor', 'Ellipse', 'Tool');

                            self.state.draw = true;
                            self.state.current_primitive = new Ellipse(self.state.tool_size, rgb_color, [start_point, start_point], self.state.keys.list.ctrl, self.state.keys.list.shift, self.state.add_shadow);
                            break;

                        case 'brush':
                            ga_send_event('Editor', 'Brush', 'Tool');

                            self.state.draw = true;
                            self.state.current_primitive = new Brush(self.state.tool_size, rgb_color, [start_point], self.state.keys.list.ctrl, self.state.add_shadow);
                            break;

                        case 'text':
                            if (!self.state.draw) {
                                ga_send_event('Editor', 'Text', 'Tool');

                                self.state.draw = true;
                                self.state.current_primitive = new Text(self.state.tool_size, rgb_color, start_point, 'normal', self.state.add_outline, self.state.add_shadow);
                                self.tools.text.cancel();
                                self.tools.text.start_timer();
                            } else {
                                self.tools.text.submit();
                            }
                            break;

                        case 'bubble':
                            if (!self.state.draw) {
                                ga_send_event('Editor', 'Bubble', 'Tool');

                                self.state.draw = true;
                                self.scene.clear_canvas(this);
                                self.state.current_primitive = new Bubble(self.state.tool_size, rgb_color, [start_point, start_point], self.settings.r, self.settings.dr, self.state.keys.list.ctrl, self.state.add_outline, self.state.add_shadow);
                            } else {
                                if (!self.state.current_primitive.arrow_in_progress) {
                                    self.tools.bubble.submit();
                                }
                            }
                            break;

                        case 'counter':
                            if (!self.state.draw) {
                                ga_send_event('Editor', 'Counter', 'Tool');

                                self.state.draw = true;
                                self.scene.clear_canvas(this);
                                self.state.current_primitive = new Counter(self.state.tool_size, rgb_color, [start_point], self.state.add_shadow);
                            } else {
                                self.state.current_primitive.points.push(start_point);
                            }
                            break;

                        case 'blur':
                            ga_send_event('Editor', 'Blur', 'Tool');

                            self.state.draw = true;
                            self.scene.clear_canvas(this);
                            self.state.current_primitive = new Blur([start_point, start_point]);
                            break;
                    }

                    self.tools.check_alternative_drawing_mode();
                    if (!['text', 'crop'].has(self.state.tool)) {
                        self.state.current_primitive.bounding_box = self.tools.get_bounding_box(self.state.current_primitive);
                    }
                } else {
                    self.state.draw = false;
                }
            });

            $(self.ui.$elements.canvas2).on('mousemove', function (e) {
                // console.log(`[Events] canvas2 ${e.type}`);
                const canvas_offset = $(this).offset();
                const current_point = new Point(e.pageX - canvas_offset.left, e.pageY - canvas_offset.top);

                if (self.state.draw) {
                    if (
                        ['arrow', 'rectangle', 'line', 'ellipse', 'brush', 'blur'].has(self.state.tool) ||
                        (self.state.tool === 'bubble') && self.state.current_primitive.arrow_in_progress
                    ) {
                        self.scene.clear_canvas(this);

                        switch (self.state.tool) {
                            case 'arrow':
                            case 'rectangle':
                            case 'line':
                            case 'ellipse':
                                self.state.current_primitive.points[1] = current_point;
                                break;

                            case 'brush':
                                self.state.current_primitive.points.push(current_point);
                                break;

                            case 'bubble':
                                if (self.state.current_primitive.arrow_in_progress) {
                                    self.state.current_primitive.points[1] = current_point;
                                }
                                break;

                            case 'blur':
                                self.state.current_primitive.points[1] = current_point;
                                var bounding_box = self.tools.get_bounding_box(self.state.current_primitive);
                                self.state.current_primitive.width = bounding_box.width;
                                self.state.current_primitive.height = bounding_box.height;
                                self.state.current_primitive.position = new Point(bounding_box.x, bounding_box.y);

                                const buffer_canvas = document.createElement('canvas');
                                var blur_width = buffer_canvas.width = bounding_box.width / self.state.scale,
                                    blur_height = buffer_canvas.height = bounding_box.height / self.state.scale;

                                const ctx = buffer_canvas.getContext('2d');
                                ctx.imageSmoothingEnabled = false;
                                // Can be "low", "medium", or "high"
                                // ctx.imageSmoothingQuality = 'low';
                                ctx.drawImage(self.tools.blur.source_canvas, bounding_box.x / self.state.scale, bounding_box.y / self.state.scale, blur_width, blur_height, 0, 0, blur_width, blur_height);

                                // TODO: There's an error while drawing blur too fast
                                delete (self.state.current_primitive.image);
                                const image = new Image();
                                image.src = get_image_src(buffer_canvas.toDataURL());
                                image.onload = function () {
                                    self.scene.clear_canvas(this);
                                    self.state.current_primitive.image = this;
                                    self.state.current_primitive.draw(self.ui.$elements.canvas2);
                                };
                                break;
                        }

                        self.state.current_primitive.draw(this);
                    }
                } else {
                    self.scene.clear_canvas(this);
                }

                // Drawing circle cursor
                if (['rectangle', 'line', 'ellipse', 'brush'].has(self.state.tool)) {
                    var radius = Math.floor(0.5 * self.state.tool_size);
                    draw_ellipse(self.ui.$elements.canvas2, current_point, radius, radius, {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 0.3
                    }, 1, false, false);
                    draw_ellipse(self.ui.$elements.canvas2, current_point, radius + 1, radius + 1, {
                        r: 0,
                        g: 0,
                        b: 0
                    }, 1, false, false);
                }
            });

            $(self.ui.$elements.canvas2).on('mouseup', stop_drawing);
            $(self.ui.$elements.canvas2).on('mouseout', stop_drawing);

            function stop_drawing(e) {
                // console.log(`[Events] canvas2 ${e.type}`);

                if (self.state.draw) {
                    if (!e.button) {
                        if (['arrow', 'rectangle', 'line', 'ellipse', 'brush', 'bubble'].has(self.state.tool)) {
                            self.state.current_primitive.bounding_box = self.tools.get_bounding_box(self.state.current_primitive);
                        }

                        switch (self.state.tool) {
                            case 'arrow':
                            case 'rectangle':
                            case 'line':
                            case 'ellipse':
                                self.state.draw = false;
                                if (self.state.current_primitive.bounding_box.diameter > self.settings.min_primitive_diameter) {
                                    self.tools.finish_primitive_creation();
                                } else {
                                    delete (self.state.current_primitive);
                                }
                                break;

                            case 'brush':
                                self.state.draw = false;
                                if (self.state.current_primitive.bounding_box.diameter > self.settings.min_primitive_diameter) {
                                    self.state.current_primitive.points = smooth_polyline_with_bezier_curves(
                                        optimize_polyline(self.state.current_primitive.points, 8, 0.8, 0.02),
                                        30
                                    );
                                    self.tools.finish_primitive_creation();
                                } else {
                                    delete (self.state.current_primitive);
                                }
                                break;

                            case 'bubble':
                                if (self.state.current_primitive.arrow_in_progress) {
                                    console.log('[Tool] Bubble: Entering text');
                                    self.state.current_primitive.arrow_in_progress = false;
                                    self.state.current_primitive.compute_text_position();
                                    self.tools.text.cancel();
                                    self.tools.text.start_timer();
                                } else {
                                    if (e.type === 'mouseup') {
                                        console.log('[Tool] Bubble: Finish drawing');
                                        self.tools.bubble.submit();
                                    }
                                }
                                break;

                            case 'blur':
                                self.state.draw = false;
                                self.tools.finish_primitive_creation();
                                break;

                            default:
                                //
                                break;
                        }
                    }
                } else {
                    self.scene.clear_canvas(this);
                }
            }

            // Crop UI
            $(document).on('click', '.imgareaselect-outer', self.tools.select_previous);
            $(document).on('click', '#crop_submit_button', self.tools.crop.submit);
            $(document).on('click', '#crop_cancel_button', self.tools.select_previous);

            // Resize UI
            $(document).on('input', '#image_width_input', function () {
                self.tools.resize.set_new_image_size(this.value, 'width', self.state.keep_proportion);
            });
            $(document).on('input', '#image_height_input', function () {
                self.tools.resize.set_new_image_size(this.value, 'height', self.state.keep_proportion);
            });
            $(document).on('click', '#resize_submit_button', self.tools.resize.submit);

            // Scaling UI
            $(document).on('click', '#edit_zoom_in', function () {
                self.scene.zoom({direction: 'in'});
            });
            $(document).on('click', '#edit_zoom_out', function () {
                self.scene.zoom({direction: 'out'});
            });

            // Edit history UI
            $(document).on('click', '#edit_history_undo', self.state.history.undo);
            $(document).on('click', '#edit_history_redo', self.state.history.redo);
            $(document).on('click', '#edit_history_wipe', self.state.history.wipe);
        }
    };

    self.palette = {
        default_colors: [
            '#e70404', '#044fe7', '#ff7300', '#000000', '#ffffff', '#e704c5', '#53e704', '#ffea00', '#8a8a8a'
        ],
        is_shown: false,

        render: function () {
            console.log('[Editor UI] Palette: render');
            $('#tool_settings_popup').html(
                self.ui.templates.palette.render({colors: self.palette.default_colors})
            );
        },

        // TODO: Replace with <input type="color">
        colorpicker: {
            is_shown: false,

            hide: function () {
                self.palette.colorpicker.is_shown = false;
                $('#tool_color_picker').hide();
            },

            toggle: function () {
                (self.palette.colorpicker.is_shown) ? $('#tool_color_picker').hide() : $('#tool_color_picker').show();
                self.palette.colorpicker.is_shown = !self.palette.colorpicker.is_shown;
            }
        },

        show: function () {
            self.palette.is_shown = true;
            $('#tool_settings_popup').show();
        },

        hide: function () {
            self.palette.colorpicker.hide();
            self.palette.is_shown = false;
            $('#tool_settings_popup').hide();
        },

        toggle: function () {
            (self.palette.is_shown) ? self.palette.hide() : self.palette.show();
        },

        pick_color: function (color) {
            console.log('[Palette] Set tool color', color);
            self.state.current_color = color;
            if (session.is_last()) {
                global_settings.set({editor_tool_color: color});
            }
            $('#toggle_palette_button').find('.color_preview').css('backgroundColor', color);
        }
    };

    self.tools = {
        types: ['brush', 'rectangle', 'line', 'ellipse', 'arrow', 'text', 'bubble', 'blur', 'crop', 'resize'],

        select: function (type) {
            console.log(`[Tool] Select: ${type}`);
            if (self.tools.types.has(type) && self.state.tool !== type) {
                if (self.state.tool === 'blur') {
                    self.scene.clear_canvas(self.tools.blur.source_canvas);
                } else if (self.state.tool === 'crop') {
                    self.tools.crop.cancel();
                } else if (self.state.tool === 'resize') {
                    self.tools.resize.cancel();
                } else {
                    self.tools.text_and_bubble.detect_and_submit();
                }

                self.state.tool_previous = (!['crop', 'resize'].has(self.state.tool)) ? self.state.tool : null;
                self.state.tool = type;
                if (session.is_last() && !['crop', 'resize'].has(type)) {
                    global_settings.set({editor_tool: type});
                }
                self.state.draw = false;

                $('.tool').removeClass('active');
                $(`.tool[data-action=${type}]`).addClass('active');

                self.ui.$elements.canvas2.style.cursor = 'default';
                switch (type) {
                    case 'rectangle':
                    case 'line':
                    case 'ellipse':
                    case 'brush':
                        self.ui.$elements.canvas2.style.cursor = 'none';
                        break;

                    case 'text':
                        self.ui.$elements.canvas2.style.cursor = 'text';
                        break;

                    case 'blur':
                        self.tools.blur.prepare_source_data();
                        break;

                    case 'crop':
                        self.ui.$elements.canvas2.style.cursor = 'crosshair';
                        self.tools.crop.initialize();
                        break;

                    case 'resize':
                        self.tools.resize.start();
                        break;

                    default:
                        //
                        break;
                }
            }
        },

        select_previous: function () {
            self.tools.select(self.state.tool_previous || MSDefaultAppState.get('editor_tool'));
        },

        get_nearest_size: function (value) {
            return get_nearest_value(value, self.settings.tool_size.min, self.settings.tool_size.max, self.settings.tool_size.step);
        },

        check_alternative_drawing_mode: function () {
            if (self.state.draw) {
                switch (self.state.current_primitive.type) {
                    case 'arrow':
                        self.state.current_primitive.reversed = self.state.keys.list.ctrl;
                        break;

                    case 'bubble':
                        if (self.state.current_primitive.arrow_in_progress) {
                            self.state.current_primitive.reversed = self.state.keys.list.ctrl;
                        }
                        break;

                    case 'rectangle':
                        self.state.current_primitive.filled = self.state.keys.list.ctrl;
                        self.state.current_primitive.highlighted = self.state.keys.list.alt;
                        self.state.current_primitive.square = self.state.keys.list.shift;
                        break;

                    case 'ellipse':
                        self.state.current_primitive.filled = self.state.keys.list.ctrl;
                        self.state.current_primitive.square = self.state.keys.list.shift;
                        break;

                    case 'brush':
                        self.state.current_primitive.transparent = self.state.keys.list.ctrl;
                        break;
                }
                self.scene.clear_canvas(self.ui.$elements.canvas2);
                self.state.current_primitive.draw(self.ui.$elements.canvas2);
            }
        },

        get_bounding_box: function (primitive) {
            if (['arrow', 'rectangle', 'line', 'ellipse', 'brush', 'bubble', 'blur', 'crop'].has(primitive.type)) {
                let max_y;
                var min_x = self.ui.$elements.canvas1.width,
                    min_y = self.ui.$elements.canvas1.height,
                    max_x = max_y = 0;
                primitive.points.forEach(function (p, i) {
                    min_x = Math.min(min_x, p.x);
                    min_y = Math.min(min_y, p.y);
                    max_x = Math.max(max_x, p.x);
                    max_y = Math.max(max_y, p.y);
                });

                return {
                    x: min_x,
                    y: min_y,
                    width: (max_x - min_x),
                    height: (max_y - min_y),
                    diameter: Math.sqrt(Math.pow(max_x - min_x, 2) + Math.pow(max_y - min_y, 2))
                }
            }
        },

        scale_primitive: function (primitive, current_scale, target_scale, clamp_tool_size) {
            if (typeof primitive === 'object' && primitive) {
                current_scale = (typeof current_scale === 'number' && current_scale > 0) ? current_scale : self.state.scale;
                target_scale = (typeof target_scale === 'number' && target_scale > 0) ? target_scale : 1;

                var scale = target_scale / current_scale;
                switch (primitive.type) {
                    case 'arrow':
                    case 'rectangle':
                    case 'line':
                    case 'ellipse':
                    case 'brush':
                    case 'bubble':
                    case 'counter':
                        primitive.points = primitive.points.map(p => p.scale(scale));
                        if (primitive.type === 'bubble' && primitive.text_position && primitive.text_position.scale) {
                            primitive.text_position = primitive.text_position.scale(scale);
                        }
                        primitive.width = (clamp_tool_size === true) ? self.tools.get_nearest_size(primitive.width * scale) : primitive.width * scale;
                        break;

                    case 'text':
                        primitive.position = primitive.position.scale(scale);
                        primitive.font_scale = (clamp_tool_size === true) ? self.tools.get_nearest_size(primitive.width * scale) : primitive.width * scale;
                        break;

                    case 'blur':
                        primitive.position = primitive.position.scale(scale);
                        primitive.width *= scale;
                        primitive.height *= scale;
                        break;
                }
            }
            return primitive;
        },

        text: {
            start_timer: function () {
                self.state.text_timer = setInterval(
                    function () {
                        if (self.state.text_timer) {
                            if (self.state.draw && ['text', 'bubble'].has(self.state.current_primitive.type)) {
                                self.scene.clear_canvas(self.ui.$elements.canvas2);
                                self.ui.$elements.text_input.focus();
                                self.state.current_primitive.changed = (self.state.current_primitive.text === self.ui.$elements.text_input.value);
                                self.state.current_primitive.text = self.ui.$elements.text_input.value;
                                self.state.current_primitive.selection = {
                                    start: self.ui.$elements.text_input.selectionStart,
                                    end: self.ui.$elements.text_input.selectionEnd
                                };
                                self.state.current_primitive.color = MSColorTools.convert.hex_to_rgb(self.state.current_color);
                                self.state.current_primitive.width = self.state.tool_size;
                                self.state.current_primitive.draw(self.ui.$elements.canvas2);
                            }
                        }
                    },
                    100
                );
            },

            stop_timer: function () {
                clearInterval(self.state.text_timer);
                delete (self.state.text_timer);
            },

            submit: function () {
                self.state.draw = false;
                self.state.current_primitive.text = self.ui.$elements.text_input.value;

                self.tools.text.cancel();
                if (self.state.current_primitive.text) {
                    self.tools.finish_primitive_creation();
                }
                delete (self.state.current_primitive);
            },

            cancel: function () {
                if (self.state.text_timer) {
                    self.tools.text.stop_timer();
                }
                self.ui.$elements.text_input.value = '';
            },

            interrupt_input: function () {
                if (self.state.draw) {
                    self.state.draw = false;
                    self.tools.text.cancel();
                    delete (self.state.current_primitive);
                    self.scene.clear_canvas(self.ui.$elements.canvas2);
                }
            }
        },

        bubble: {
            submit: function () {
                self.state.draw = false;
                self.state.current_primitive.text = self.ui.$elements.text_input.value;

                self.tools.text.cancel();
                self.tools.finish_primitive_creation();
            }
        },

        text_and_bubble: {
            detect_and_submit: function () {
                if (self.state.current_primitive) {
                    if (self.state.current_primitive.type === 'text') {
                        self.tools.text.submit();
                    } else if (self.state.current_primitive.type === 'bubble' && !self.state.current_primitive.arrow_in_progress) {
                        self.tools.bubble.submit();
                    }
                }
            }
        },

        counter: {
            submit: function () {
                self.finish_primitive_creation();
            },

            cancel: function () {
                delete (self.state.current_primitive);
                self.scene.clear_canvas(self.ui.$elements.canvas2);
            }
        },

        blur: {
            source_canvas: document.createElement('canvas'),

            prepare_source_data: function () {
                console.log('[Scene] Blur: Source canvas preparing...');
                self.scene.export_image_data().then(
                    function (output) {
                        self.scene.scale_image(output.data, self.settings.blur_scale, self.settings.blur_scale)
                            .then(function (result) {
                                const image_data = result.data,
                                    original_size = result.original_image.size;
                                const ctx_b = self.tools.blur.source_canvas.getContext('2d');
                                self.tools.blur.source_canvas.width = original_size.width;
                                self.tools.blur.source_canvas.height = original_size.height;

                                const image = new Image();
                                image.src = get_image_src(image_data);
                                image.onload = function () {
                                    console.log('[Scene] Blur: Source canvas is ready');
                                    ctx_b.drawImage(this, 0, 0, original_size.width, original_size.height);
                                }
                            });
                    }
                );
            }
        },

        crop: {
            image_crop_area: undefined,
            selection: {},

            initialize: function () {
                ga_send_event('Editor', 'Crop', 'Tool');
                console.log('[Editor] Crop: Selection initialize');

                self.state.current_primitive = new Crop();
                $('#crop_area_toolbar').removeClass('ms_hidden');

                if (!self.tools.crop.image_crop_area) {
                    self.tools.crop.image_crop_area = $(self.ui.$elements.canvas2).imgAreaSelect({
                        instance: true,
                        handles: true,
                        fadeSpeed: 100,
                        keys: true,
                        onSelectEnd: function (img, selection) {
                            self.tools.crop.update(selection);
                        }
                    });
                } else {
                    self.tools.crop.image_crop_area.setOptions({enable: true});
                }
                self.tools.crop.image_crop_area.setOptions({show: true});
                self.tools.crop.select_all();
            },

            select_all: function () {
                self.tools.crop.image_crop_area.setSelection(0, 0, self.ui.$elements.canvas1.width, self.ui.$elements.canvas1.height);
                self.tools.crop.image_crop_area.update();
                self.tools.crop.update();
                console.log(self.tools.crop.selection);
            },

            update: function (selection) {
                selection = selection || self.tools.crop.image_crop_area.getSelection();
                self.tools.crop.selection = {
                    x: Math.round(selection.x1 / self.state.scale),
                    y: Math.round(selection.y1 / self.state.scale),
                    width: Math.round(selection.width / self.state.scale),
                    height: Math.round(selection.height / self.state.scale)
                };
            },

            submit: function () {
                self.tools.crop.update();
                self.scene.export_image_data({crop_area: self.tools.crop.selection})
                    .then(function (output) {
                        self.state.current_primitive.src = get_image_src(output.data);
                        self.tools.finish_primitive_creation();
                        self.tools.select_previous();
                    });
            },

            cancel: function () {
                delete (self.state.current_primitive);
                if (self.tools.crop.image_crop_area) {
                    self.tools.crop.image_crop_area.cancelSelection();
                    self.tools.crop.image_crop_area.setOptions({disable: true});
                }
                $('#crop_area_toolbar').addClass('ms_hidden');
            }
        },

        resize: {
            original_size: {
                width: null,
                height: null
            },

            start: function () {
                self.scene.export_image_data()
                    .then(function (output) {
                        self.rendered_scene = output.data;
                        self.ui.$elements.image_resize_preview.src = get_image_src(output.data);
                        self.ui.$elements.image_resize_preview.onload = function () {
                            $(this).show();
                            $(self.ui.$elements.canvas1).hide();
                            $(self.ui.$elements.canvas2).hide();

                            self.state.current_primitive = new Resize(this.naturalWidth, this.naturalHeight);
                            self.tools.resize.original_size = {
                                width: this.naturalWidth,
                                height: this.naturalHeight
                            };

                            $('#edit_area_overlay').removeClass('ms_hidden');
                            $('#image_width_input').val(self.tools.resize.original_size.width);
                            $('#image_height_input').val(self.tools.resize.original_size.height);
                            $('#image_keep_proportion').prop('checked', self.state.keep_proportion);
                            self.tools.resize.render_preview();
                        };
                    });
            },

            set_new_image_size: function (input_data, side, keep_proportion) {
                var value = input_data.replace(/[\D]+/g, '');
                var inputs = {
                    width: $('#image_width_input'),
                    height: $('#image_height_input')
                };
                side = side || 'width';
                let other_side = (side === 'width') ? 'height' : 'width';

                if (value) {
                    value = parseInt(value).clamp(1, 50000);
                    // console.log(value, value/self.tools.resize.original_size[side]);
                    self.state.current_primitive[side] = value;
                    if (keep_proportion) {
                        self.state.current_primitive[other_side] = Math.ceil(self.tools.resize.original_size[other_side] * value / self.tools.resize.original_size[side]);
                        inputs[other_side].val(self.state.current_primitive[other_side]);
                    }
                }
                inputs[side].val(self.state.current_primitive[side]);

                self.tools.resize.render_preview();
            },

            render_preview: function () {
                var width = self.ui.$elements.image_resize_preview.width = self.state.current_primitive.width * self.state.scale,
                    height = self.ui.$elements.image_resize_preview.height = self.state.current_primitive.height * self.state.scale;
                self.ui.$elements.image_edit_area.width(width).height(height);
            },

            submit: function () {
                self.scene.scale_image(
                    self.rendered_scene,
                    self.state.current_primitive.width / self.tools.resize.original_size.width,
                    self.state.current_primitive.height / self.tools.resize.original_size.height)
                    .then(function (output) {
                        const image_data = output.data;
                        self.state.current_primitive.src = get_image_src(image_data);
                        self.tools.finish_primitive_creation();
                        self.tools.select_previous();
                    });
            },

            cancel: function () {
                delete (self.state.current_primitive);
                $(self.ui.$elements.image_resize_preview).hide();
                $('#edit_area_overlay').addClass('ms_hidden');
                $(self.ui.$elements.canvas1).show();
                $(self.ui.$elements.canvas2).show();
            }
        },

        finish_primitive_creation: function () {
            self.state.current_primitive.scale = self.state.scale;
            if (['text', 'bubble'].has(self.state.current_primitive.type)) {
                self.state.current_primitive.saved = true;
            }
            self.state.history.push(self.state.current_primitive);
            if (['crop', 'resize'].has(self.state.current_primitive.type)) {
                self.scene.fit_image_to_window(self.state.current_primitive.src);
            } else {
                self.state.current_primitive.draw(self.ui.$elements.canvas1);
                self.scene.clear_canvas(self.ui.$elements.canvas2);
            }
            delete (self.state.current_primitive);
        }
    };

    self.scene = {
        zoom: function (options = {}) {
            // TODO: Instead of applying zoom immediately but push the task to the tasks queue
            // in order to prevent multiple parallel processes after multiple clicks on +/- button
            var new_scale = (options && (typeof options.scale === 'number') && options.scale > 0) ?
                options.scale :
                get_the_nearest_in_a_sequence(self.state.scale, self.settings.editor_scale, (options && options.direction === 'in') ? 'next' : 'prev');
            if (options.force_refresh || self.state.scale !== new_scale) {
                self.state.scale = new_scale;
                self.ui.$elements.editor_actual_scale.text(Math.floor(100 * self.state.scale) + '%');
                self.scene.render().then(options.callback);
            }
        },

        fit_image_to_window: function (image_data, callback) {
            const image = new Image();
            image.src = get_image_src(image_data);
            image.onload = function () {
                var wrapper_width = window.innerWidth,
                    wrapper_height = window.innerHeight - (self.ui.$elements.top_panel.outerHeight() + self.ui.$elements.bottom_panel.outerHeight());
                self.scene.zoom({
                    scale: fit_image_to_rect_and_get_scale(this.naturalWidth, this.naturalHeight, wrapper_width, wrapper_height),
                    force_refresh: true,
                    callback: callback
                });
                self.ui.$elements.canvas_wrapper.width(window.innerWidth).height(wrapper_height);
            };
        },

        clear_canvas: function (canvas) {
            if (canvas) {
                let c;
                canvas.width = c = canvas.width;
            }
        },

        center_canvas: function () {
            var $edit_area = $('#editor_canvas_wrapper');
            var scroll_top = 0.5 * ($edit_area.height() - $(window).height()),
                scroll_left = 0.5 * ($edit_area.width() - $(window).width());
            $edit_area.scrollTop((scroll_top > 0) ? scroll_top : 0);
            $edit_area.scrollLeft((scroll_left > 0) ? scroll_left : 0);
        },

        scale_image: function (image_data, scale_x, scale_y) {
            return new Promise(function (resolve, reject) {
                if (image_data) {
                    scale_x = (typeof scale_x === 'number' && scale_x > 0) ? scale_x : 1;
                    scale_y = (typeof scale_y === 'number' && scale_y > 0) ? scale_y : 1;

                    const image = new Image();
                    image.src = get_image_src(image_data);
                    image.onload = function () {
                        const size = {
                            width: this.naturalWidth,
                            height: this.naturalHeight
                        };

                        if (scale_x !== 1 || scale_y !== 1) {
                            get_image_data(
                                this, {
                                    scale_x: scale_x,
                                    scale_y: scale_y
                                }
                            ).then(
                                (data) => resolve({
                                    data: data,
                                    original_image: {
                                        size: size
                                    }
                                })
                            );
                        } else {
                            resolve({
                                data: image_data,
                                original_image: {
                                    size: size
                                }
                            });
                        }
                    };
                } else {
                    reject();
                }
            });
        },

        export_image_data: function (options = {}) {
            return new Promise(function (resolve, reject) {
                console.log('[Scene] Export image data');

                var output_format = options.type || global_settings.get('image_type');
                var mime_type = bg.ms_core.file.type_specific_info.mime_type.get(output_format);
                var quality = (typeof options.quality === 'number') ? options.quality.clamp(0.5, 1) : global_settings.get('image_quality');
                var scale = (typeof options.scale === 'number') ? options.scale.clamp(0.1, 3) : 1;

                const history = self.state.history.get()._copy();

                var initial_source = session.data.original,
                    start_index = 0;
                for (let i = history.length - 1; i >= 0; --i) {
                    let p = history[i];
                    if (['crop', 'resize'].has(p.type)) {
                        initial_source = p.src;
                        start_index = i + 1;
                        break;
                    }
                }

                if (initial_source) {
                    const output = new Image();
                    output.src = get_image_src(initial_source);
                    output.onload = function () {
                        const buffer_canvas = document.createElement('canvas');
                        buffer_canvas.width = this.naturalWidth * scale;
                        buffer_canvas.height = this.naturalHeight * scale;

                        let b_ctx = buffer_canvas.getContext('2d');
                        b_ctx.drawImage(this, 0, 0, buffer_canvas.width, buffer_canvas.height);

                        history.slice(start_index).forEach(function (primitive) {
                            let p = Object.copy(primitive);
                            p = self.tools.scale_primitive(p, p.scale, scale, (scale <= 1));
                            p.draw(buffer_canvas);
                        });

                        let cropped_canvas;
                        if (typeof options.crop_area === 'object') {
                            cropped_canvas = document.createElement('canvas');
                            cropped_canvas.width = options.crop_area.width;
                            cropped_canvas.height = options.crop_area.height;

                            const c_ctx = cropped_canvas.getContext('2d');
                            c_ctx.drawImage(
                                buffer_canvas,
                                options.crop_area.x, options.crop_area.y, options.crop_area.width, options.crop_area.height,
                                0, 0, options.crop_area.width, options.crop_area.height
                            );
                        }
                        const output_canvas = (cropped_canvas || buffer_canvas);
                        output_canvas.toBlob(
                            (blob) => resolve({
                                data: blob,
                                canvas: output_canvas
                            }),
                            mime_type,
                            quality
                        );
                    };
                    output.onerror = reject;
                } else {
                    console.log('[!] No image data to load');
                    reject();
                }
            });
        },

        render: function (options = {}) {
            return new Promise(function (resolve, reject) {
                console.log('[Scene] Rendering scene');
                self.state.busy = true;

                const scale = (typeof options.scale === 'number' && options.scale > 0) ? options.scale : self.state.scale;
                self.scene.export_image_data({scale: scale})
                    .then(function (output) {
                        console.log('[Editor] Image loaded');
                        $('#loading').hide();
                        $(self.ui.$elements.canvas1).show();
                        $(self.ui.$elements.canvas2).show();

                        self.tools.text.cancel();

                        const rendered_canvas = output.canvas;
                        self.ui.$elements.image_edit_area.width(rendered_canvas.width).height(rendered_canvas.height);
                        self.ui.$elements.canvas1.width = self.ui.$elements.canvas2.width = rendered_canvas.width;
                        self.ui.$elements.canvas1.height = self.ui.$elements.canvas2.height = rendered_canvas.height;
                        const ctx = self.ui.$elements.canvas1.getContext('2d');
                        ctx.drawImage(rendered_canvas, 0, 0);
                        self.scene.center_canvas();
                        self.state.busy = false;

                        if (self.state.tool === 'crop') {
                            self.tools.crop.select_all();
                        }
                        self.scene.center_canvas();
                        resolve();
                    })
                    .catch(reject);
            });
        }
    };

    self.export = function () {
        return new Promise(function (resolve, reject) {
            self.tools.text_and_bubble.detect_and_submit();
            self.scene.export_image_data({type: session.output_type})
                .then(function (output) {
                    console.log(output);
                    session.data.final = output.data;
                    resolve(output.data);
                })
                .catch(reject);
        });
    };

    self.exportPNG = function () {
        return self.scene.export_image_data({type: "png"}).then((output) => output.data);
    };

    _initialize();
}

class MSClipboard {
    static writeImageBlobToClipboard(blob) {
        return navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob
            })
        ]);
    }
}
