if (typeof Number.prototype.clamp !== 'function') {
    Number.prototype.clamp = function(min, max) {
        const value = this.valueOf();
        return (value < min) ?
            min :
            (value > max) ?
                max :
                value;
    }
}

if (typeof String.prototype.add_leading_symbols !== 'function') {
    String.prototype.add_leading_symbols = function(symbol='0', required_length=2) {
        var string = this.valueOf();
        while (string.length < required_length) {
            string = symbol + string;
        }
        return string;
    };
}

function MSWebpageAreaCapture(platform) {
    const self = this;

    self.initialized = false;
    self.active = false;
    self.selection_in_progress = false;
    self.delayed_capture = false;
    self.area = {};
    self.tooltip = {
        position: {
            default: 1
        },
        margin: 15
    };
    self.magnifier = {
        show: true,
        updating: false,
        position: {
            default: 3
        },
        margin: 15,
        canvas: {},
        sample_diameter: 15,
        dpi_factor: 1
    };
    self.delay = 4;

    self.keys = {
        state: {},

        update: function(e) {
            self.keys.state = {
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey,
                command: (self.platform === 'mac') && e.metaKey,
                windows: (self.platform === 'win') && e.metaKey,
                meta: e.metaKey
            };
        }
    };

    self.ui = {
        templates: {
            magnifier: `
                    <div id="ms_capture_overlay">
                        <div id="ms_capture_crosshair">
                            <div class="crosshair_line vertical"></div>
                            <div class="crosshair_line horizontal"></div>
                            <div id="ms_magnifier_tooltip">
                                ${chrome.i18n.getMessage((platform === 'mac') ? 'hint_area_capture_mac' : 'hint_area_capture_others')}
                            </div>
                            <div id="ms_magnifier_wrapper">
                                <canvas id="ms_magnifier"></canvas>
                                <div id="ms_pixel_info">
                                    <div id="ms_pixel_coordinates">
                                        <span class="ms_coordinate x"></span>
                                        &nbsp;x&nbsp;
                                        <span class="ms_coordinate y"></span>
                                    </div>
                                    <div id="ms_pixel_color">
                                        <span class="ms_color"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
            selected_area: `
                    <div id="ms_capture_area">
                        <div id="ms_countdown"></div>
                    </div>
                `
        },
        $elements: {},

        initialize: function() {
            self.active = true;
            $('body').addClass('.ms_unselectable');

            if (!self.initialized) {
                self.initialized = true;

                $('body').append(self.ui.templates.selected_area);
                self.ui.$elements.area = $('#ms_capture_area');
                self.ui.$elements.countdown = $('#ms_countdown');

                $('body').append(self.ui.templates.magnifier);
                self.ui.$elements.overlay = {
                    wrapper: $('#ms_capture_overlay'),
                    crosshair: $('#ms_capture_crosshair'),
                    tooltip: $('#ms_magnifier_tooltip'),
                    magnifier: {
                        wrapper: $('#ms_magnifier_wrapper'),
                        canvas: $('#ms_magnifier'),
                        pixel: {
                            wrapper: $('#ms_pixel_info'),
                            coordinates: {
                                x: $('#ms_pixel_coordinates').find('.x'),
                                y: $('#ms_pixel_coordinates').find('.y')
                            },
                            color: $('#ms_pixel_color').find('.ms_color')
                        }
                    }
                };

                const canvas = document.createElement('canvas');
                self.magnifier.canvas = {
                    element: canvas,
                    context: canvas.getContext('2d')
                };
                self.ui.magnifier.initialize();

                self.ui.tooltip.initialize();

                self.ui.assign_event_handlers();
            }
            self.ui.$elements.countdown.hide();

            if (self.magnifier.show) {
                _utils.capture_screen();
            } else {
                self.ui.$elements.overlay.wrapper.show();
                self.ui.$elements.overlay.crosshair.show();
                self.ui.$elements.overlay.tooltip.show();
                self.ui.$elements.overlay.magnifier.wrapper.hide();
            }
        },

        callbacks: {
            key_press: function(e) {
                switch (e.which) {
                    case 27: // Esc
                        console.log('[Area capture] Key: Esc (cancel screenshot)');
                        self.finish();
                        break;

                    case 67: // C
                        if (self.magnifier.show && !self.magnifier.updating) {
                            console.log('[Area capture] Hotkey: Ctrl/Cmd-C (copy pixel color)');
                            if ((platform === 'mac') && e.metaKey || (platform !== 'mac') && e.ctrlKey) {
                                chrome.runtime.sendMessage(
                                    {
                                        message: 'copy_color_to_clipboard',
                                        text: self.magnifier.color
                                    },
                                    function() {
                                        if (self.active) {
                                            self.finish();
                                        }
                                    }
                                );
                            }
                        }
                        break;
                }
            },

            overlay_context_menu: function(e) {
                e.stopPropagation();
                e.preventDefault();
            },

            page_mouse_down: function(e) {
                e.stopPropagation();

                if (!e.button) {
                    self.start();

                    var start_point = {
                        point: {
                            x: e.pageX,
                            y: e.pageY
                        },
                        scroll: {
                            top: window.scrollY,
                            left: window.scrollX
                        }
                    };
                    self.area = {
                        start: Object.assign({}, start_point),
                        finish: Object.assign({}, start_point)
                    };

                    self.ui.set_area_position_and_sizes();
                }
            },

            page_mouse_move: function(e) {
                e.stopPropagation();

                if (!self.delayed_capture) {
                    if (self.selection_in_progress) {
                        let height = (document.body.scrollHeight>document.body.clientHeight)?document.body.scrollHeight:document.body.clientHeight;
                        let y = (height>0)?e.pageY.clamp(0, height):e.pageY;
                        self.area.finish = {

                            point: {
                                x: e.pageX.clamp(0, document.body.clientWidth),
                                y: y
                            },
                            scroll: {
                                top: window.scrollY,
                                left: window.scrollX
                            }
                        };

                        self.ui.set_area_position_and_sizes(self.keys.state.shift || false);
                    }

                    self.ui.update_overlay(e);
                }
            },

            page_mouse_up: function(e) {
                e.stopPropagation();

                if (!e.button) {
                    // console.log(self.area_processed, self.keys.state.alt);
                    if (_utils.calculate_area_diameter(self.area_processed.width, self.area_processed.height) < 14) {
                        self.finish();
                        setTimeout(function() {
                            chrome.runtime.sendMessage({
                                message: 'take_screenshot',
                                type: 'window'
                            });
                        }, 1000);
                    } else {
                        var delayed_mode = ((platform === 'mac') && e.metaKey || (platform !== 'mac') && e.ctrlKey);
                        if (delayed_mode) {
                            ga_send_event('Capture', 'Page area', 'Delayed');
                            self.delayed_capture = true;
                            self.ui.$elements.overlay.magnifier.wrapper.hide();
                            self.ui.$elements.overlay.tooltip.hide();
                            self.ui.$elements.countdown.text(self.delay).show();
                            var _rest = self.delay - 1;
                            var _timer = setInterval(function() {
                                if (_rest > 0) {
                                    self.ui.$elements.countdown.text(_rest);
                                    _rest--;
                                } else {
                                    clearInterval(_timer);
                                    self.submit();
                                }
                            }, 1000);
                        } else {
                            ga_send_event('Capture', 'Page area', 'Submit');
                            self.submit();
                        }
                    }

                }
            },

            page_scroll: function(e) {
                if (self.magnifier.show && !self.magnifier.updating) {
                    _utils.capture_screen();
                }
            }
        },

        assign_event_handlers: function() {
            self.handlers_initialized = true;

            // Preventing text selection and image dragging
            document.ondragstart = function(e) {
                if (self.active) {
                    e.preventDefault();
                }
            };

            document.onselectstart = function(e) {
                if (self.active) {
                    e.preventDefault();
                }
            };

            // Tracking hotkeys and special keys state
            $(document).on('keydown', function(e) {
                self.keys.update(e);
                call_if_capture_is_activated(self.ui.callbacks.key_press, e);
            });

            $(document).on('keyup', function(e) {
                self.keys.update(e);
                // call_if_capture_is_activated(self.ui.callbacks.key_release, e);
            });

            $(document).on('contextmenu', '#ms_capture_overlay', function(e) {
                call_if_capture_is_activated(self.ui.callbacks.overlay_context_menu, e);
            });

            $(document).on('mousedown', function(e) {
                call_if_capture_is_activated(self.ui.callbacks.page_mouse_down, e);
            });

            $(document).on('mousemove', function(e) {
                call_if_capture_is_activated(self.ui.callbacks.page_mouse_move, e);
            });

            $(document).on('mouseup', function(e) {
                call_if_capture_is_activated(self.ui.callbacks.page_mouse_up, e);
            });

            $(document).on('scroll', function(e) {
                call_if_capture_is_activated(self.ui.callbacks.page_scroll, e);
            });

            function call_if_capture_is_activated(handler, data) {
                if (self.active) {
                    handler(data);
                }
            }
        },

        set_area_position_and_sizes: function(square) {
            const border_width = 4000;

            const width = Math.abs(self.area.finish.point.x - self.area.start.point.x),
                height = Math.abs(self.area.finish.point.y - self.area.start.point.y);
            self.area_processed = {
                x: Math.min(self.area.start.point.x, self.area.finish.point.x),
                y: Math.min(self.area.start.point.y, self.area.finish.point.y),
                width: (square) ? Math.min(width, height) : width,
                height: (square) ? Math.min(width, height) : height
            };

            self.ui.$elements.area.css({
                top: self.area_processed.y - border_width,
                left: self.area_processed.x - border_width
            });
            self.ui.$elements.area.width(self.area_processed.width).height(self.area_processed.height);
        },

        // Position designation
        // 1 - top left, 2 - top right, 3 - bottom right, 4 - bottom left
        tooltip: {
            initialize: function() {
                self.tooltip.sizes = {
                    width: self.ui.$elements.overlay.tooltip.outerWidth(),
                    height: self.ui.$elements.overlay.tooltip.outerHeight()
                };

                self.tooltip.position.quadrants = [
                    {top:-(self.tooltip.margin + self.tooltip.sizes.height), left:-(self.tooltip.margin + self.tooltip.sizes.width)},
                    {top:-(self.tooltip.margin + self.tooltip.sizes.height), left:self.tooltip.margin},
                    {top:self.tooltip.margin, left:self.tooltip.margin},
                    {top:self.tooltip.margin, left:-(self.tooltip.margin + self.tooltip.sizes.width)}
                ];
            },

            update_position: function(cursor) {
                const boundaries = {
                    top: {
                        min: self.tooltip.margin + self.tooltip.sizes.height + 2,
                        max: window.innerHeight - (self.tooltip.margin + self.tooltip.sizes.height + 2)
                    },
                    left: {
                        min: self.tooltip.margin + self.tooltip.sizes.width + 2,
                        max: window.innerWidth - (self.tooltip.margin + self.tooltip.sizes.width + 2)
                    }
                };

                self.tooltip.position.current = (boundaries.top.min > cursor.y) ?
                    ((boundaries.left.min > cursor.x) ? 3 : 4) :
                    ((boundaries.left.min > cursor.x) ? 2 : self.tooltip.position.default);
                self.ui.$elements.overlay.tooltip.css(self.tooltip.position.quadrants[self.tooltip.position.current - 1]);
            }
        },

        magnifier: {
            initialize: function() {
                self.magnifier.sizes = {
                    width: self.ui.$elements.overlay.magnifier.wrapper.outerWidth(),
                    height: self.ui.$elements.overlay.magnifier.wrapper.outerHeight()
                };

                self.magnifier.position.quadrants = [
                    {top:-(self.magnifier.margin + self.magnifier.sizes.height), left:-(self.magnifier.margin + self.magnifier.sizes.width)},
                    {top:-(self.magnifier.margin + self.magnifier.sizes.height), left:self.magnifier.margin},
                    {top:self.magnifier.margin, left:self.magnifier.margin},
                    {top:self.magnifier.margin, left:-(self.magnifier.margin + self.magnifier.sizes.width)}
                ];
            },

            update_position: function(cursor) {
                const boundaries = {
                    top: {
                        min: self.magnifier.margin + self.magnifier.sizes.height + 2,
                        max: window.innerHeight - (self.magnifier.margin + self.magnifier.sizes.height + 2)
                    },
                    left: {
                        min: self.magnifier.margin + self.magnifier.sizes.width + 2,
                        max: window.innerWidth - (self.magnifier.margin + self.magnifier.sizes.width + 2)
                    }
                };

                self.magnifier.position.current = (boundaries.top.max < cursor.y) ?
                    ((boundaries.left.max < cursor.x) ? 1 : 2) :
                    ((boundaries.left.max < cursor.x) ? 4 : self.magnifier.position.default);
                self.ui.$elements.overlay.magnifier.wrapper.css(self.magnifier.position.quadrants[self.magnifier.position.current - 1]);
            },

            render: function(cursor) {
                if (!self.magnifier.updating) {
                    self.ui.$elements.overlay.wrapper.show();
                    self.ui.$elements.overlay.magnifier.wrapper.show();

                    // Drawing zoomed page fragment
                    // Page sample parameters
                    const f_diameter = self.magnifier.sample_diameter;
                    const f_radius = Math.floor(f_diameter/2),
                        pixel_size = 8;

                    // Real cursor coordinates
                    const pixel_real_x = Math.floor(cursor.x * self.magnifier.dpi_factor),
                        pixel_real_y = Math.floor(cursor.y * self.magnifier.dpi_factor);
                    // console.log(pixel_real_x, pixel_real_y);

                    const canvas = self.ui.$elements.overlay.magnifier.canvas[0];
                    canvas.width = canvas.height = 120;
                    const ctx = canvas.getContext('2d');

                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Rendering (per-pixel) page sample
                    const color_data = self.magnifier.canvas.context.getImageData(pixel_real_x - f_radius, pixel_real_y - f_radius, f_diameter, f_diameter).data;
                    let row = column = 0;
                    for (let i = 0; i < color_data.length; i += 4) {
                        ctx.fillStyle = _utils.convert_rgb_to_hex(color_data.slice(i, i+4));
                        ctx.fillRect(pixel_size*column, pixel_size*row, pixel_size, pixel_size);
                        if (column < f_diameter - 1) {
                            ++column;
                        } else {
                            ++row;
                            column = 0;
                        }
                    }

                    // Dark crosshair lines
                    ctx.save();
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.lineWidth = pixel_size;
                    ctx.beginPath();
                    ctx.moveTo(0, (f_diameter/2)*pixel_size); ctx.lineTo(f_radius*pixel_size, (f_diameter/2)*pixel_size);
                    ctx.moveTo((f_radius + 1)*pixel_size, (f_diameter/2)*pixel_size); ctx.lineTo(canvas.width, (f_diameter/2)*pixel_size);
                    ctx.moveTo((f_diameter/2)*pixel_size, 0); ctx.lineTo((f_diameter/2)*pixel_size, f_radius*pixel_size);
                    ctx.moveTo((f_diameter/2)*pixel_size, (f_radius + 1)*pixel_size); ctx.lineTo((f_diameter/2)*pixel_size, canvas.height);
                    ctx.stroke();
                    ctx.restore();

                    // Light crosshair outlines
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, f_radius*pixel_size - 1); ctx.lineTo(canvas.width, f_radius*pixel_size - 1);
                    ctx.moveTo(0, (f_radius + 1)*pixel_size + 1); ctx.lineTo(canvas.width, (f_radius + 1)*pixel_size + 1);
                    ctx.moveTo(f_radius*pixel_size - 1, 0); ctx.lineTo(f_radius*pixel_size - 1, canvas.height);
                    ctx.moveTo((f_radius + 1)*pixel_size + 1, 0); ctx.lineTo((f_radius + 1)*pixel_size + 1, canvas.height);
                    ctx.stroke();
                    ctx.restore();

                    if (self.selection_in_progress) {
                        self.ui.$elements.overlay.magnifier.pixel.coordinates.x.text(self.area_processed.width);
                        self.ui.$elements.overlay.magnifier.pixel.coordinates.y.text(self.area_processed.height);
                        self.ui.$elements.overlay.magnifier.pixel.color.hide();
                    } else {
                        const color = self.magnifier.canvas.context.getImageData(pixel_real_x, pixel_real_y, 1, 1).data;
                        if (color) {
                            self.magnifier.color = _utils.convert_rgb_to_hex(color.slice(0, 4));
                            self.ui.$elements.overlay.magnifier.pixel.color.show().text(self.magnifier.color);
                        }

                        self.ui.$elements.overlay.magnifier.pixel.coordinates.x.text(cursor.x);
                        self.ui.$elements.overlay.magnifier.pixel.coordinates.y.text(cursor.y);
                    }
                } else {
                    self.ui.$elements.overlay.wrapper.hide();
                }
            }
        },

        update_overlay: function(e) {
            const square = (self.keys.state.shift === true);
            // const crosshair_coordinates = {
            //     x: (self.selection_in_progress) ? (self.area.finish.point.x - window.scrollX) : e.clientX,
            //     y: (self.selection_in_progress) ? (self.area.finish.point.y - window.scrollY) : e.clientY
            // };
            const crosshair_coordinates = {
                x: (self.selection_in_progress) ?
                    (
                        (square) ?
                            (self.area.start.point.x + ((self.area.finish.point.x - self.area.start.point.x > 0) ? 1 : -1)*self.area_processed.width - window.scrollX) :
                            (self.area.finish.point.x - window.scrollX)
                    ) :
                    e.clientX,
                y: (self.selection_in_progress) ?
                    (
                        (square) ?
                            (self.area.start.point.y + ((self.area.finish.point.y - self.area.start.point.y > 0) ? 1 : -1)*self.area_processed.height - window.scrollY) :
                            (self.area.finish.point.y - window.scrollY)
                    ) :
                    e.clientY,
            };
            self.ui.$elements.overlay.crosshair.css({
                top: crosshair_coordinates.y,
                left: crosshair_coordinates.x
            });

            self.ui.tooltip.update_position(crosshair_coordinates);

            // TODO: Wrong coordinates while an area selection
            if (self.magnifier.show) {
                self.ui.magnifier.update_position(crosshair_coordinates);
                if (self.tooltip.position.current === self.magnifier.position.current || self.selection_in_progress) {
                    self.ui.$elements.overlay.tooltip.hide();
                } else {
                    self.ui.$elements.overlay.tooltip.show();
                }

                if (!self.magnifier.updating) {
                    self.ui.$elements.overlay.wrapper.show();
                    self.ui.magnifier.render(crosshair_coordinates);
                } else {
                    self.ui.$elements.overlay.wrapper.hide();
                }
            }
        }
    };

    const _utils = {
        convert_rgb_to_hex: function(rgb_array) {
            return '#' + Array.from(rgb_array)
                .slice(0, 3)
                .map(
                    channel => channel.toString(16).add_leading_symbols('0', 2).toUpperCase()
                )
                .join('');
        },

        calculate_area_diameter: function(width, height) {
            return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        },

        capture_screen: function() {
            self.ui.$elements.overlay.wrapper.hide();
            self.magnifier.updating = true;

            chrome.runtime.sendMessage(
                {message: 'capture_and_return'},
                function(response) {
                    if (self.active) {
                        const source_image = new Image();
                        source_image.src = response.data_uri;
                        source_image.onload = function() {
                            self.ui.$elements.overlay.wrapper.show();
                            self.magnifier.updating = false;
                            self.magnifier.dpi_factor = this.naturalWidth/window.innerWidth;
                            self.magnifier.canvas.element.width = this.naturalWidth;
                            self.magnifier.canvas.element.height = this.naturalHeight;
                            self.magnifier.canvas.context.drawImage(this, 0, 0, this.naturalWidth, this.naturalHeight);
                        }
                    }
                }
            );
        }
    };

    self.start = function() {
        ga_send_event('Capture', 'Page area', 'Initialize');
        self.selection_in_progress = true;
        self.ui.$elements.area.show();
    };

    self.finish = function() {
        self.active = false;
        self.selection_in_progress = false;
        self.delayed_capture = false;
        $('body').removeClass('.ms_unselectable');
        self.ui.$elements.area.hide();
        self.ui.$elements.overlay.wrapper.hide();
    };

    self.submit = function() {
        self.finish();

        setTimeout(
            function() {
                const scroll_top = window.scrollY,
                    scroll_left = window.scrollX;
                // TODO: Hm-m...
                // var scroll_top = Math.min(self.area.start.scroll.top, self.area.finish.scroll.top),
                //     scroll_left = Math.min(self.area.start.scroll.left, self.area.finish.scroll.left);
                // console.log(scroll_top, scroll_left);
                chrome.runtime.sendMessage({
                    message: 'capture_and_crop',
                    area: {
                        x: self.area_processed.x - scroll_left,
                        y: self.area_processed.y - scroll_top,
                        width: self.area_processed.width,
                        height: self.area_processed.height
                    },
                    window: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                });
            },
            100
        );
    };
}