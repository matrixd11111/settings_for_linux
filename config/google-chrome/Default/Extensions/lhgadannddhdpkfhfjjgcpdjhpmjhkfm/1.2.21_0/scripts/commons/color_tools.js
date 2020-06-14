function MSColorTools() {}

MSColorTools.convert = {
    hex_to_rgb: function(hex_string) {
        if (hex_string[0] === '#') { hex_string = hex_string.slice(1);}
        const color = {};
        ['r', 'g', 'b'].forEach(
            (channel, i) => color[channel] = parseInt(hex_string.slice(2*i, 2*i+2), 16)
        );
        return color;
    },

    rgb_to_hex: function(color_object) {
        return '#' + ['r', 'g', 'b'].map(
            channel => color_object[channel].toString(16).add_leading_symbols('0', 2)
        ).join('');
    },

    rgb_to_hsl: function(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const min = Math.min(r, g, b),
            max = Math.max(r, g, b);

        // Calculating L component
        let l = 0.5*(min + max);

        // Calculating S component
        let s;
        if (l === 0 || min === max) {
            s = 0;
        } else if (l > 0 && l <= 0.5) {
            s = (max - min)/(2*l);
        } else if (l > 0.5 && l < 1) {
            s = (max - min)/(2 - 2*l);
        } else if (l === 1) {
            s = 1;
        }

        // Calculating H component
        let h = 0;
        if (max === min) {
            return {h: 0, s: 0, l: 100*max};
        } else if (max === r) {
            h = (g < b) ? (60*(g - b)/(max - min) + 360) : 60*(g - b)/(max - min);
        } else if (max === g) {
            h = 60*(b - r)/(max - min) + 120;
        } else if (max === b) {
            h = 60*(r - g)/(max - min) + 240;
        }

        return {
            h: h,
            s: 100*s,
            l: 100*l
        };
    }
};

MSColorTools.generate_css = {
    hsl: (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`,

    rgba: (r, g, b, a=1) => `rgba(${[r, g, b, a].join(', ')})`
};