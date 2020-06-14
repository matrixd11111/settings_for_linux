function Arrow(width, color, points, r, dr, shadow, reversed) {
	const self = this;
	this.type = 'arrow';

	this.shadow = (typeof shadow === 'boolean') ? shadow : true;
	this.reversed = (typeof reversed === 'boolean') ? reversed : false;
	this.width = width || 3;
	this.color = MSColorTools.convert.rgb_to_hsl(color.r, color.g, color.b);
	this.points = points || [];
	this.r = r || 10;
	this.dr = dr || 5;
	this.gradient = compute_arrow_gradient_colors(this.color, this.r, this.dr);

	this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;
        draw_arrow(canvas, this.gradient, this.width, this.points[0], this.points[1], this.reversed, this.shadow);
	};
}

function compute_arrow_gradient_colors(color, r, dr) {
    const original_l = color.l;
    let new_l;
	const upper_limit = 100 - r + dr,
        lower_limit = r + dr;

    if (lower_limit <= original_l && original_l <= upper_limit) {
        new_l = original_l - dr;
    } else {
        if (original_l < lower_limit) {
            if (original_l >= dr) {
                new_l = original_l - dr;
                r = original_l - dr;
            } else {
                new_l = 0;
                r = 0;
            }
        } else if (original_l > upper_limit) {
            new_l = original_l - dr;
            r = 100 - original_l + dr;
        }
    }

    return {
    	lighter: {h:color.h, s:color.s, l:new_l+r},
    	darker: {h:color.h, s:color.s, l:new_l-r}
	};
}

function draw_arrow(canvas, color, width, p1, p2, reversed, shadow) {
	var l = p1.get_distance_to(p2);
	var h = Math.floor(0.6 * width);
	var minimal_length = 12*h;
	var scale = (l < minimal_length) ? l/minimal_length : 1;
    h *= scale;
	var diameter = 1.2*h;

	var pi = Math.PI;
	var arrow_angle = - pi/2 - Math.atan2(p1.x - p2.x, p1.y - p2.y);

	var sin = Math.sin(pi/6),
		cos = Math.cos(pi/6),
		tan = Math.tan(pi/6);

    const begin = new Point(0, 0),
        end = new Point(l, 0);
	const k1  = new Point(begin.x, begin.y + 1);
	const k2  = new Point(end.x - 2.25*h/tan, end.y + 1.25*h);
	const k3  = new Point(k2.x - 4*h*cos/3, k2.y + 4*h*sin/3);
	const k4  = new Point(k3.x + 0.5*diameter*sin, k3.y + 0.5*diameter*cos);
	const k5  = new Point(k3.x + diameter*sin, k3.y + diameter*cos);
	const k6 	= new Point(end.x, end.y);
	const k11 = new Point(begin.x, begin.y - 1);
	const k10 = new Point(end.x - 2.25*h/tan, end.y - 1.25*h);
	const k9 	= new Point(k10.x - 4*h*cos/3, k10.y - 4*h*sin/3);
	const k8  = new Point(k9.x + 0.5*diameter*sin, k9.y - 0.5*diameter*cos);
	const k7  = new Point(k9.x + diameter*sin, k9.y - diameter*cos);

	const ctx = canvas.getContext('2d');
	ctx.save();
	    if (reversed) {
            ctx.translate(p2.x, p2.y);
            ctx.rotate(arrow_angle + Math.PI);
        } else {
            ctx.translate(p1.x, p1.y);
            ctx.rotate(arrow_angle);
        }

		ctx.beginPath();
			ctx.moveTo(k1.x, k1.y);
			ctx.lineTo(k2.x, k2.y);
			ctx.lineTo(k3.x, k3.y);
			ctx.arc(k4.x, k4.y, 0.5*diameter, 4*pi/3, pi/3, true);
			ctx.lineTo(k5.x, k5.y);
			ctx.lineTo(k6.x, k6.y);
			ctx.lineTo(k7.x, k7.y);
			ctx.arc(k8.x, k8.y, 0.5*diameter, 5*pi/3, 2*pi/3, true);
			ctx.lineTo(k9.x, k9.y);
			ctx.lineTo(k10.x, k10.y);
			ctx.lineTo(k11.x, k11.y);
		ctx.closePath();

		if (shadow) {
			add_shadow(ctx, 0, 1, 2, 'rgba(0, 0, 0, 0.5)');
		}

    	const lighter_shade = new Point(end.x, end.y - 2.0*width),
        	darker_shade = new Point(end.x, end.y + 2.0*width);
		const arrowGradient = (arrow_angle < -pi/2) ?
			ctx.createLinearGradient(darker_shade.x, darker_shade.y, lighter_shade.x, lighter_shade.y) :
			ctx.createLinearGradient(lighter_shade.x, lighter_shade.y, darker_shade.x, darker_shade.y);
		arrowGradient.addColorStop(0, MSColorTools.generate_css.hsl(color.lighter.h, color.lighter.s, color.lighter.l));
		arrowGradient.addColorStop(1, MSColorTools.generate_css.hsl(color.darker.h, color.darker.s, color.darker.l));
		ctx.fillStyle = arrowGradient;
		ctx.fill();
	ctx.restore();
}

function Rectangle(width, color, points, filled, square, highlighted, shadow) {
	const self = this;
	this.type = 'rectangle';

	this.width = width || 3;
	this.color = color;
	this.points = points || [];
	this.shadow = (typeof shadow === 'boolean') ? shadow : true;
	this.filled = (typeof filled === 'boolean') ? filled : false;
	this.square = (typeof square === 'boolean') ? square : false;
	this.highlighted = (typeof highlighted === 'boolean') ? highlighted : false;

	this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;
        var start_point = this.points[0];
        var width = this.points[1].x - this.points[0].x,
			height = this.points[1].y - this.points[0].y;

        if (this.square) {
            var w_sign = (width < 0) ? -1 : 1,
                h_sign = (height < 0) ? -1 : 1;
            var min_side = Math.min(Math.abs(width), Math.abs(height));
            width = w_sign * min_side;
            height = h_sign * min_side;
        }
        draw_rectangle(canvas, start_point.x, start_point.y, width, height, this.color, this.width, this.filled, this.highlighted, this.shadow);
	};
}

function draw_rectangle(canvas, x, y, width, height, color, stroke_width, filled, highlighted, shadow) {
	const ctx = canvas.getContext('2d');
	ctx.save();
		ctx.beginPath();
		ctx.rect(x, y, width, height);

		var color_string = MSColorTools.generate_css.rgba(color.r, color.g, color.b, color.a);
		if (highlighted) {
            const mask_canvas = document.createElement('canvas');
            mask_canvas.width = canvas.width;
            mask_canvas.height = canvas.height;

            const m_ctx = mask_canvas.getContext('2d');
            m_ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            m_ctx.fillRect(0, 0, mask_canvas.width, mask_canvas.height);
            m_ctx.clearRect(x, y, width, height);
            ctx.drawImage(mask_canvas, 0, 0);
		} else {
            ctx.save();
            if (shadow) {
                add_shadow(ctx, 0, 1, 3, 'rgba(0, 0, 0, 0.35)');
            }
            ctx.strokeStyle = color_string;
            ctx.lineJoin = 'round';
            ctx.lineWidth = stroke_width;
            ctx.stroke();
            ctx.restore();
            if (typeof filled === 'boolean' && filled) {
                ctx.fillStyle = color_string;
                ctx.fill();
            }
		}
	ctx.restore();
}

function Line(width, color, points, shadow) {
	const self = this;
	this.type = 'line';

	this.width = width || 3;
	this.color = color;
	this.points = points || [];
	this.shadow = (typeof shadow === 'boolean') ? shadow : true;

	this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;
        draw_line(canvas, this.points[0], this.points[1], this.color, this.width, this.shadow);
	};
}

function draw_line(canvas, p1, p2, color, width, shadow) {
	const ctx = canvas.getContext('2d');
	ctx.save();
		if (shadow) {
			add_shadow(ctx, 0, 1, 3, 'rgba(0, 0, 0, 0.35)');
		}
    	var color_string = MSColorTools.generate_css.rgba(color.r, color.g, color.b, color.a);
		ctx.strokeStyle = color_string;
		ctx.lineWidth = width;
		ctx.lineCap = 'round';

		ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
		ctx.stroke();
	ctx.restore();
}

function Ellipse(width, color, points, filled, square, shadow) {
	const self = this;
	this.type = 'ellipse';

	this.width = width || 3;
	this.color = color;
	this.points = points || [];
	this.shadow = (typeof shadow === 'boolean') ? shadow : true;
    this.filled = (typeof filled === 'boolean') ? filled : false;
    this.square = (typeof square === 'boolean') ? square : false;

	this.draw = function(canvas) {
		canvas = canvas || ms_editor.ui.$elements.canvas1;
		var center = {
			x: 0.5*(this.points[1].x + this.points[0].x),
			y: 0.5*(this.points[1].y + this.points[0].y)
		};
        var radius_x, radius_y;
		if (this.square) {
            radius_x = radius_y = 0.5 * get_line_length(this.points[0], this.points[1]);
        } else {
		    radius_x = 0.5 * Math.abs(this.points[1].x - this.points[0].x);
            radius_y = 0.5 * Math.abs(this.points[1].y - this.points[0].y);
        }
        draw_ellipse(canvas, center, radius_x, radius_y, this.color, this.width, this.filled, this.shadow);
	};
}

function draw_ellipse(canvas, center, radius_x, radius_y, color, stroke_width, filled, shadow) {
	const ctx = canvas.getContext('2d');
	ctx.save();
		ctx.save();
			ctx.translate(center.x, center.y);
			ctx.scale(1, radius_y/radius_x);
			ctx.beginPath();
				ctx.arc(0, 0, radius_x, 0, 2*Math.PI, false);
			ctx.closePath();
		ctx.restore();

		var color_string = MSColorTools.generate_css.rgba(color.r, color.g, color.b, color.a);
		ctx.save();
			if (shadow) {
				add_shadow(ctx, 0, 1, 3, 'rgba(0, 0, 0, 0.35)');
			}
			ctx.strokeStyle = color_string;
			ctx.lineWidth = stroke_width;
			ctx.stroke();
		ctx.restore();
		if (typeof filled === 'boolean' && filled) {
			ctx.fillStyle = color_string;
			ctx.fill();
		}
	ctx.restore();
}

function Brush(width, color, points, transparent, shadow) {
	const self = this;
	this.type = 'brush';

	this.width = width || 3;
	this.color = color;
	this.points = points || [];
	this.shadow = (typeof shadow === 'boolean') ? shadow : true;
	this.transparent = (typeof transparent === 'boolean') ? transparent : false;

	this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;
        draw_polyline(canvas, this.points, this.color, this.width, this.transparent, this.shadow);
	};
}

function draw_polyline(canvas, points, color, stroke_width, transparent, shadow) {
	const ctx = canvas.getContext('2d');
	ctx.save();
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		points.slice(1).forEach(point => ctx.lineTo(point.x, point.y));

		if (shadow) {
			add_shadow(ctx, 0, 1, 3, 'rgba(0, 0, 0, 0.35)');
		}
		const alpha = transparent ? 0.4 : 1;
		ctx.strokeStyle = MSColorTools.generate_css.rgba(color.r, color.g, color.b, alpha);
		ctx.lineWidth = stroke_width;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.stroke();
	ctx.restore();
}

function Text(width, color, position, placement, stroke, shadow, font_family, font_units) {
    const self = this;
    this.type = 'text';

    this.color = color;
    this.position = position || new Point(10, 20);
    this.placement = placement || 'normal';
    this.alignment = 'left';
    this.stroke = (typeof stroke === 'boolean') ? stroke : true;
    this.shadow = (typeof shadow === 'boolean') ? shadow : true;

    this.font_family = font_family || 'Arial';
    this.font_scale = width || 3;
    this.font_size_units = font_units || 'pt';

    this.text = '';
    this.font_size = 4 * this.font_scale;
    this.line_spacing = 1.6 * this.font_size;
    this.caret_animation = {
    	step: 0,
		duration: 5,
		limit: 8
    };
    this.selection_color = '#9AE4FE';
    this.selection = {
    	start: 0,
		end: 0
	};
	this.show_bounding_box = true;
    this.bounding_box_dash_offset = 0;

    this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;

        this.current_position = get_current_text_position(this.position, this.placement, this.text, this.font_size, this.line_spacing);

        if (!this.saved) {
			draw_text_selection(canvas, this.selection, this.current_position, this.alignment, this.text, this.selection_color, this.font_family, this.font_size, this.font_size_units, this.line_spacing, this.stroke);
		}
        draw_text(canvas, this.current_position, this.alignment, this.text, this.font_family, this.font_size, this.font_size_units, this.line_spacing, this.color, this.stroke, this.shadow);
        if (!this.saved) {
            if (0 < this.caret_animation.step && this.caret_animation.step < this.caret_animation.duration) {
                this.caret = get_caret_position_from_text_cursor(this.selection.end, this.text);
                draw_text_caret(canvas, this.current_position, this.alignment, this.text, this.caret, this.font_family, this.font_size, this.font_size_units, this.line_spacing);
            }
            this.caret_animation.step = (this.caret_animation.step < this.caret_animation.limit - 1) ? this.caret_animation.step + 1: 0;

            // Rendering bounding box
			const ctx = canvas.getContext('2d');
			ctx.save();
				set_text_style_and_position(ctx, this.alignment, this.font_family, this.font_size, this.font_size_units, this.color);
            	// TODO: Calculate bounding box on demand (when text is changed)
				this.bounding_box = get_text_bounding_box(ctx, this.text, this.current_position.x, this.current_position.y, this.alignment, this.line_spacing, this.stroke);
				// console.log(ctx.textBaseline, ctx.textAlign, this.bounding_box);
				if (this.show_bounding_box) {
					draw_bounding_box(ctx, this.bounding_box.x, this.bounding_box.y, this.bounding_box.width, this.bounding_box.height, this.bounding_box_dash_offset);
                    this.bounding_box_dash_offset = (this.bounding_box_dash_offset < 11) ? this.bounding_box_dash_offset + 1 : 0;
				}
			ctx.restore();
        }
    };
}

function Bubble(width, color, points, r, dr, reversed, stroke, shadow, font_family, font_units) {
    const self = this;
    this.type = 'bubble';

    this.width = width || 3;
    this.color = MSColorTools.convert.rgb_to_hsl(color.r, color.g, color.b);
    this.points = points || [];
    this.reversed = (typeof reversed === 'boolean') ? reversed : true;
    this.stroke = (typeof stroke === 'boolean') ? stroke : true;
    this.shadow = (typeof shadow === 'boolean') ? shadow : true;

    // Text properties
    this.font_family = font_family || 'Arial';
    this.font_scale = width || 3;
    this.font_size_units = font_units || 'pt';

    this.text = '';
    this.font_size = 4 * this.font_scale;
    this.line_spacing = 1.6 * this.font_size;
    this.font_color = Object.assign({}, color);
    this.caret_animation = {
        step: 0,
        duration: 5,
        limit: 8
    };
    this.selection_color = '#9AE4FE';
    this.selection = {
        start: 0,
        end: 0
    };
    this.show_bounding_box = true;
    this.bounding_box_dash_offset = 0;

    // Arrow properties
	this.arrow_in_progress = true;
    this.r = r || 10;
    this.dr = dr || 5;
    this.gradient = compute_arrow_gradient_colors(this.color, this.r, this.dr);

    this.compute_text_position = function() {
        var pi = Math.PI;
        var arrow_angle = Math.atan2(this.points[0].y - this.points[1].y, this.points[0].x - this.points[1].x);
        if (this.reversed) {
            arrow_angle -= pi;
        }
        let dy;
        var dx = dy = 0;
        if (arrow_angle > 3*pi/4 || arrow_angle < -3*pi/4) {
            this.placement = 'right';
            this.alignment = 'right';
            dx = -10;
            dy = 0.25*this.line_spacing;
        } else if (arrow_angle > pi/4 && arrow_angle < 3*pi/4) {
            this.placement = 'top';
            this.alignment = 'center';
            dy = 10;
        } else if (arrow_angle > -pi/4 && arrow_angle < pi/4) {
            this.placement = 'left';
            this.alignment = 'left';
            dx = 10;
            dy = 0.25*this.line_spacing;
        } else {
            this.placement = 'bottom';
            this.alignment = 'center';
            dy = 3;
        }

        var start_point = this.points[(this.reversed) ? 1 : 0];
        this.text_position = new Point(start_point.x + dx, start_point.y + dy);
	};

    this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;

        // Rendering
        // 1. Text
		if (!this.arrow_in_progress) {
			// console.log(this.selection);
            this.text_current_position = get_current_text_position(this.text_position, this.placement, this.text, this.font_size, this.line_spacing);
            if (!this.saved) {
            	draw_text_selection(canvas, this.selection, this.text_current_position, this.alignment, this.text, this.selection_color, this.font_family, this.font_size, this.font_size_units, this.line_spacing, this.stroke);
            }
            draw_text(canvas, this.text_current_position, this.alignment, this.text, this.font_family, this.font_size, this.font_size_units, this.line_spacing, this.font_color, this.stroke, this.shadow);
            if (!this.saved) {
                if (0 < this.caret_animation.step && this.caret_animation.step < this.caret_animation.duration) {
                    this.caret = get_caret_position_from_text_cursor(this.selection.end, this.text);
                    draw_text_caret(canvas, this.text_current_position, this.alignment, this.text, this.caret, this.font_family, this.font_size, this.font_size_units, this.line_spacing);
                }
                this.caret_animation.step = (this.caret_animation.step < this.caret_animation.limit - 1) ? this.caret_animation.step + 1: 0;

                // Rendering bounding box
				const ctx = canvas.getContext('2d');
                ctx.save();
					set_text_style_and_position(ctx, this.alignment, this.font_family, this.font_size, this.font_size_units, this.color);
					this.text_bounding_box = get_text_bounding_box(ctx, this.text, this.text_current_position.x, this.text_current_position.y, this.alignment, this.line_spacing, this.stroke);
					// console.log(ctx.textBaseline, ctx.textAlign, this.bounding_box);
					if (this.show_bounding_box) {
						draw_bounding_box(ctx, this.text_bounding_box.x, this.text_bounding_box.y, this.text_bounding_box.width, this.text_bounding_box.height, this.bounding_box_dash_offset);
                        this.bounding_box_dash_offset = (this.bounding_box_dash_offset < 11) ? this.bounding_box_dash_offset + 1 : 0;
					}
                ctx.restore();
            }
		}

        // 2. Arrow
        draw_arrow(canvas, this.gradient, this.width, this.points[0], this.points[1], this.reversed, this.shadow);
    };
}

function get_current_text_position(top_left_corner, placement, text, font_size, line_spacing) {
    var lines_count = text.split('\n').length;

    var vert_offsets = {
        'normal': 0.5*font_size,
        'left': -0.5*font_size*lines_count,
        'right': -0.5*font_size*lines_count,
        'bottom': -line_spacing*lines_count
    };
    var dy = vert_offsets.hasOwnProperty(placement) ? vert_offsets[placement] : 0;

    return {
        x: top_left_corner.x,
        y: top_left_corner.y + dy
    };
}

function get_text_bounding_box(ctx, text, x, y, alignment, line_spacing, stroke) {
    var stroke_width = 10;

    var text_lines = text.split('\n');
    var longest_line = '';
    text_lines.forEach(function(line) {
        if (line.length > longest_line.length) { longest_line = line; }
    });

    var offset_x = {
        'right': ctx.measureText(longest_line).width,
        'center': 0.5*ctx.measureText(longest_line).width
    };
    var dx = offset_x.hasOwnProperty(alignment) ? offset_x[alignment] : 0;
    if (stroke) {
        dx += 0.5*stroke_width;
    }

    var text_width = ctx.measureText(longest_line).width;
    if (text_width > 0) {
        text_width += stroke_width;
    }
    var text_height = line_spacing*text_lines.length + stroke_width;

    return {
        x: x - dx,
        y: y - 0.5*line_spacing,
        width: text_width,
        height: text_height
    }
}

function set_text_style_and_position(ctx, alignment, font_family, font_size, font_size_units, color) {
    ctx.font = `${font_size}${font_size_units} ${font_family}`;
    if (color) {
        ctx.fillStyle = color;
    }
    ctx.textAlign = alignment;
    ctx.textBaseline = 'middle';
}

function get_caret_position_from_text_cursor(cursor_position, text) {
    var before_cursor_text = text.substr(0, cursor_position);
    return {
        line: before_cursor_text.split('\n').length,
        column: before_cursor_text.replace(/^(.*?)\n/g, '').length
    };
}

function draw_text_selection(canvas, selection, text_top_left_corner, text_alignment, text, selection_color, font_family, font_size, font_size_units, line_spacing, stroke) {
    if (selection.start !== selection.end) {
        var start_caret = get_caret_position_from_text_cursor(selection.start, text),
            end_caret = get_caret_position_from_text_cursor(selection.end, text);
        // console.log(selection, start_caret, end_caret);

        var text_lines = text.split('\n');
        var stroke_width = 10;
        var line_height = font_size + 2*stroke_width;
        var dy = 0.5*stroke_width;

        const ctx = canvas.getContext('2d');
        ctx.save();
			ctx.fillStyle = selection_color;
			set_text_style_and_position(ctx, text_alignment, font_family, font_size, font_size_units);

			var line_vert_offset;
			if (start_caret.line === end_caret.line) {
				line_vert_offset = get_line_vertical_offset(start_caret.line - 1);
				render_selection(text_lines[start_caret.line - 1], start_caret.column, end_caret.column, text_top_left_corner.x, text_top_left_corner.y + line_vert_offset + dy, text_alignment);
			} else {
				// First line
				line_vert_offset = get_line_vertical_offset(start_caret.line - 1);
				render_selection(text_lines[start_caret.line - 1], start_caret.column, null, text_top_left_corner.x, text_top_left_corner.y + line_vert_offset + dy, text_alignment);
				// In between lines
				for (var i = start_caret.line; i < end_caret.line - 1; ++i) {
					line_vert_offset = get_line_vertical_offset(i);
					render_selection(text_lines[i], 0, null, text_top_left_corner.x, text_top_left_corner.y + line_vert_offset + dy, text_alignment);
				}
				// Last line
				line_vert_offset = get_line_vertical_offset(end_caret.line - 1);
				render_selection(text_lines[end_caret.line - 1], 0, end_caret.column, text_top_left_corner.x, text_top_left_corner.y + line_vert_offset + dy, text_alignment);
			}
			ctx.stroke();
        ctx.restore();

        function get_line_vertical_offset(line_number) {
            return line_spacing * line_number;
        }

        function render_selection(line, start, end, x, y, text_alignment) {
            var line_to_render = (typeof end === 'number') ? line.substring(start, end) : line.substring(start);
            // console.log(line_to_render, start, end);
            var line_width = ctx.measureText(line_to_render).width;
            var pre_offset = ctx.measureText(line.substring(0, start)).width;
            var dx = 0;
            switch (text_alignment) {
                case 'center':
                    dx = -0.5*ctx.measureText(line).width;
                    break;
                case 'right':
                    pre_offset = ctx.measureText(line.substr(end)).width;
                    dx = -2*pre_offset - line_width;
                    break;
            }
            ctx.fillRect(x + dx + pre_offset, y - 0.5*line_height, line_width, line_height);
        }
    }
}

function draw_text(canvas, text_top_left_corner, text_alignment, text, font_family, font_size, font_size_units, line_spacing, color, stroke, shadow) {
    const ctx = canvas.getContext('2d');
    ctx.save();
		var font_color = MSColorTools.generate_css.rgba(color.r, color.g, color.b, color.a);
		set_text_style_and_position(ctx, text_alignment, font_family, font_size, font_size_units, font_color);

		var shadow_color = 'rgba(0, 0, 0, 0.4)';
		var stroke_shadow_offset = {
			x: 0,
			y: 2
		};
		if (stroke) {
			ctx.lineWidth = 8;
			ctx.lineJoin = 'round';
			ctx.strokeStyle = 'white';
		} else {
			if (shadow) {
				add_shadow(ctx, 0, 1, 2, shadow_color);
			}
		}

		text.split('\n').forEach(function(line, number) {
			var vert_line_offset = line_spacing*number;
			if (stroke) {
				if (shadow) {
					ctx.save();
					ctx.strokeStyle = shadow_color;
					ctx.strokeText(line, text_top_left_corner.x + stroke_shadow_offset.x, text_top_left_corner.y + vert_line_offset + stroke_shadow_offset.y);
					ctx.restore();
				}
				ctx.strokeText(line, text_top_left_corner.x, text_top_left_corner.y + vert_line_offset);
			}
			ctx.fillText(line, text_top_left_corner.x, text_top_left_corner.y + vert_line_offset);
		});
		// console.log(text, [text_position.x, text_position.y], 'Font: ' + ctx.font + ' (' + ctx.fillStyle + ', baseline:' + ctx.textBaseline + ', alignment:' + ctx.textAlign + ')');
    ctx.restore();
}

function draw_bounding_box(ctx, x, y, width, height, dash_offset) {
    if (width && height) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.strokeRect(x, y, width, height);
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = (typeof dash_offset === 'number') ? dash_offset : 0;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.strokeRect(x, y, width, height);
    }
}

function draw_text_caret(canvas, text_top_left_corner, text_alignment, text, caret, font_family, font_size, font_size_units, line_spacing) {
    var text_lines = text.split('\n');

    const ctx = canvas.getContext('2d');
    ctx.save();
		set_text_style_and_position(ctx, text_alignment, font_family, font_size, font_size_units);

		var last_line = text_lines[caret.line - 1];
		var line_width = ctx.measureText(last_line).width;
		var vert_line_offset = line_spacing * (caret.line - 1);
		// console.log(last_line, pre_caret_offset, caret);

		var text_stroke_width = 5;
		var line_height = font_size + 8;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
		ctx.lineWidth = 1;
		ctx.lineCap = 'round';
		add_shadow(ctx, 0, 0, 1, 'rgba(255, 255, 255, 0.6)');

		var dx = 0;
		var pre_caret_offset = ctx.measureText(last_line.substr(0, caret.column)).width;
		switch (text_alignment) {
			case 'center':
				dx = -0.5*line_width;
				break;
			case 'right':
				pre_caret_offset = ctx.measureText(last_line.substr(caret.column)).width;
				dx = -2*(pre_caret_offset);
				break;
		}
		ctx.beginPath();
			ctx.moveTo(text_top_left_corner.x + pre_caret_offset + dx, text_top_left_corner.y + vert_line_offset - 0.5*line_height);
			ctx.lineTo(text_top_left_corner.x + pre_caret_offset + dx, text_top_left_corner.y + vert_line_offset + 0.5*line_height);
		ctx.closePath();
		ctx.stroke();
    ctx.restore();
}

function add_shadow(context, x, y, blur_radius, color) {
    context.shadowOffsetX = x;
    context.shadowOffsetY = y;
    context.shadowColor = color;
    context.shadowBlur = blur_radius;
}

function Counter(width, color, points, shadow) {
    const self = this;
    this.type = 'counter';

    this.width = width || 3;
    this.color = color;
    this.points = points || [];
    this.shadow = (typeof shadow === 'boolean') ? shadow : true;

    this.font_family = font_family || 'Arial';
    this.font_size_units = font_units || 'pt';
    this.font_size = 4 * this.width;

    this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;
        draw_accents(canvas, this.points, this.color, this.width, this.font_family, this.font_size_units, this.shadow);
    };
}

function draw_accents(canvas, points, color, size, font_family, font_size_units, shadow) {
    const color_string = MSColorTools.generate_css.rgba(color.r, color.g, color.b);
    const font_size = 4 * size;
    const font_color = ((255 - color.r) < 20 && (255 - color.g) < 20 && (255 - color.b) < 20) ? {r:0, g:0, b:0} : {r:255, g:255, b:255};
    const circle_radius = 1.4 * 0.5 * font_size;

    const ctx = canvas.getContext('2d');
    ctx.save();
        points.forEach(function(point, index) {
            draw_ellipse(canvas, point, circle_radius, circle_radius, color, size, true, shadow);
            draw_text(canvas, point, 'center', index+1, font_family, font_size, font_size_units, 1, font_color, false, false);
        });
    ctx.restore();
}

function Blur(points, position) {
    const self = this;
    this.type = 'blur';

    this.points = points || [];
    this.position = position || new Point(10, 20);
    this.width = 0;
    this.height = 0;

    this.draw = function(canvas) {
        canvas = canvas || ms_editor.ui.$elements.canvas1;

        if (this.image) {
        	const context = canvas.getContext('2d');
			context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
		}
    };
}

function Crop() {
    const self = this;
    this.type = 'crop';

    this.src = '';

    this.draw = function(image) {
    	image = image || ms_editor.ui.$elements.image1;
        image.src = URL.createObjectURL(this.src);
    };
}

function Resize(width, height) {
    const self = this;
    this.type = 'resize';

    this.src = '';
    this.width = width || 0;
    this.height = height || 0;

    this.draw = function(image) {
        image = image || ms_editor.ui.$elements.image1;
        image.src = URL.createObjectURL(this.src);
    };
}