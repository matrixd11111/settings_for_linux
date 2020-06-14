function Point(x, y) {
	const self = this;

	self.x = x;
	self.y = y;

    self.translate_by = function(x, y) {
        self.x += x;
        self.y += y;
        return self;
    };

	self.rotate_around_point = function(center, angle) {
		var l = self.get_distance_to(center);
        var beta = Math.atan((self.y - center.y) / (self.x - center.x));
        self.x = center.x + l * Math.cos(angle+beta);
        self.y = center.y + l * Math.sin(angle+beta);
        return self;
	};

	self.get_distance_to = function(point) {
		return Math.sqrt(Math.pow(point.x - self.x, 2) + Math.pow(point.y - self.y, 2));
	};

	self.scale = function(scale) {
		// self.x *= scale;
		// self.y *= scale;
		// return self;
		return new Point(self.x * scale, self.y * scale);
	}
}

function Vector(p1, p2) {
	const self = this;

	self.get_length = function() {
		return Math.sqrt(self.x*self.x + self.y*self.y);
	};

	self.get_scalar_product = function(vector) {
		return self.x * vector.x + self.y * vector.y;
	};

	self.get_angle_between_vectors = function(vector) {
		return self.get_scalar_product(vector) / (self.get_length() * vector.get_length());
	};

	self.get_angle_to_x_axis = function() {
		return self.get_angle_between_vectors(new Vector(new Point(0, 0), new Point(1, 0)));
	};

	self.initialize = function(p1, p2) {
		self.x = p2.x - p1.x;
		self.y = p2.y - p1.y;
	};

	self.initialize(p1, p2);
}

function get_line_middle_point(p1, p2) {
	return new Point(0.5*(p1.x + p2.x), 0.5*(p1.y + p2.y));
}

function get_line_length(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function optimize_polyline(path, qLength, coefficient, cosine_coef) {
	console.log('[Geometric tools] Polyline optimization');
	var optimized_path = [];

	// Optimization: 1st pass
    var v1, v2, cosine;
	for (var i = 1; i < path.length - 1; ++i) {
		v1 = new Vector(path[i], path[i-1]);
        v2 = new Vector(path[i], path[i+1]);
		cosine = v1.get_angle_between_vectors(v2);

		if (cosine < cosine_coef) {
			var line_length = get_line_length(path[i-1], path[i+1]);
			if (line_length < 5) {
				path.splice(i, 1);
				--i;
			}
		}
	}
	var path_size = path.length;
	console.log('Pass #1: complete');

	var queue = [];
	var length = 0;
	var l = 0,
		r = 0;
	var previous_point = path[0];
	optimized_path.push(previous_point);
	var fVal;
	for (var i = 1; i < path_size; ++i) {
		while (l < (i - qLength)) {
			fVal = queue[0];
			queue.splice(0, 1);
			length -= fVal;
			++l;
		}

		while (r < (path_size - 1) && r < (i + qLength)) {
			fVal = get_line_length(path[r], path[r+1]);
			queue.push(fVal);
			length += fVal;
			++r;
		}

		var average_distance = length/queue.length;
		var current_distance = get_line_length(previous_point, path[i]);
		if (i === (path_size - 1) || current_distance > (coefficient * average_distance)) {
			optimized_path.push(path[i]);
			previous_point = path[i];
		} else if (i < (path_size - 1)) {
			var v1 = new Vector(path[i], previous_point),
				v2 = new Vector(path[i], path[i+1]);
			var cosine = v1.get_angle_between_vectors(v2);
			if (cosine > cosine_coef) {
				optimized_path.push(path[i]);
				previous_point = path[i];
			}
		}
	}
	console.log('Pass #2: complete');
	return optimized_path;
}

function smooth_polyline_with_bezier_curves(polyline_points, SepCoef) {
	var smooth_curve = [];
	var initial_points_count = polyline_points.length;
	var step = 1/SepCoef;

	for (var i = 1; i < initial_points_count - 1; ++i) {
		var p0 = (i === 1) ? polyline_points[0] : get_line_middle_point(polyline_points[i-1], polyline_points[i]),
			p1 = polyline_points[i],
			p2 = (i === initial_points_count - 2) ? polyline_points[initial_points_count-1] : get_line_middle_point(polyline_points[i], polyline_points[i+1]);

		for (var j = 0; j < SepCoef; ++j) {
			var t = step * j;
			smooth_curve.push(new Point(
                Math.pow(1.0 - t, 2)*p0.x + 2*(1.0 - t)*t*p1.x + Math.pow(t, 2)*p2.x,
                Math.pow(1.0 - t, 2)*p0.y + 2*(1.0 - t)*t*p1.y + Math.pow(t, 2)*p2.y
			));
		}
	}
	smooth_curve.push(polyline_points[initial_points_count - 1]);
	console.log('[Geometric tools] Smooth Besier curve created');
	return smooth_curve;
}