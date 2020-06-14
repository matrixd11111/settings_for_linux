// Basic types expansion
// Well, this is a bad practice (but very convenient!)
/*if (typeof Type.prototype.method !== 'function') {
     Type.prototype.method = function() {
        return 'magic';
     }
 }*/

// TODO: MDN states these values as defaults. Should be checked
const _default_custom_property_mixin = {
    configurable: false,
    enumerable : false
};

// Data types
// Array
if (typeof Array.prototype.has !== 'function') {
    Array.prototype.has = function(value) {
        return (this.indexOf(value) !== -1);
    };
}

if (typeof Array.prototype.min !== 'function') {
    Array.prototype.min = function() {
        return Math.min.apply(null, this);
    };
}

if (typeof Array.prototype.max !== 'function') {
    Array.prototype.max = function() {
        return Math.max.apply(null, this);
    };
}

if (typeof Array.prototype.last !== 'function') {
    Array.prototype.last = function() {
        return (this.length) ? this[this.length - 1] : null;
    };
}

if (typeof Array.prototype._copy !== 'function') {
    Array.prototype._copy = function() {
        return Array.from(this);
    };
}

// TypedArray
// (!) It's assumed that both arrays are of the same type
function concat_typed_arrays(array) {
    const original = this.valueOf();

    let output = original;
    if (array.length > 0) {
        output = new original.constructor(original.length + array.length);
        output.set(original);
        output.set(array, original.length);
    }
    return output;
}

if (typeof Uint8Array.prototype.concat !== 'function') {
    Uint8Array.prototype.concat = concat_typed_arrays;
}

if (typeof Uint8Array.prototype.from_string !== 'function') {
    Uint8Array.prototype.from_string = function(string) {
        return Uint8Array.from(string.split(''), char => char.charCodeAt(0));
    };
}

// Object
if (typeof Object.prototype.copy !== 'function') {
    Object.defineProperty(Object.prototype, 'copy', {
        value: function(reference_object) {
            var F = function() {};
            F.prototype = reference_object;
            return new F();
        }
    });
}

if (typeof Object.prototype._map !== 'function') {
    Object.defineProperty(Object.prototype, '_map', {
        value: function(handler) {
            const object = Object.assign({}, this);
            if (typeof handler === 'function') {
                Object.keys(object).forEach(key => object[key] = handler(object[key], key));
            }
            return object;
        }
    });
}

if (typeof Object.prototype._extract !== 'function') {
    Object.defineProperty(Object.prototype, '_extract', {
        value: function(keys_to_extract=/.*/, dummy=undefined) {
            const self = this;
            const subobject = {};
            if (Array.isArray(keys_to_extract)) {
                keys_to_extract.forEach(function(key) {
                    if (self.hasOwnProperty(key)) {
                        subobject[key] = self[key];
                    }
                });
            } else if (is_instance(keys_to_extract, 'RegExp')) {
                Object.keys(self).forEach(
                    key => keys_to_extract.test(key) && (subobject[key] = self[key])
                );
            }
            return subobject;
        }
    });
}

if (typeof Number.prototype.clamp !== 'function') {
    Number.prototype.clamp = function(min, max) {
        const value = this.valueOf();
        if (min <= value && value <= max) {
            return value
        } else {
            return (value < min) ? min : max;
        }
    };
}

if (typeof String.prototype.convert !== 'function') {
    String.prototype.convert = function(target_type) {
        const input = this.valueOf();
        if (typeof target_type === 'string') {
            try {
                switch (target_type) {
                    case 'boolean': return (input === 'true');     break;
                    case 'integer': return parseInt(input);        break;
                    case 'float':   return parseFloat(input);      break;
                    case 'number':  return Number(input);          break;
                    case 'array':
                    case 'object':  return JSON.parse(input);      break;
                }
            } catch (e) {
                console.log(e);
            }
        }
        return input;
    };
}

if (typeof String.prototype.multiply !== 'function') {
    String.prototype.multiply = function(times) {
        let output = '';
        for (let i = 0; i < times; ++i) {
            output += this.valueOf();
        }
        return output;
    };
}

if (typeof String.prototype.capitalize !== 'function') {
    String.prototype.capitalize = function() {
        const string = this.valueOf();
        return (string.length) ? (string[0].toUpperCase() + string.slice(1)) : string;
    };
}

if (typeof String.prototype.truncate !== 'function') {
    String.prototype.truncate = function(length, ending) {
        const string = this.valueOf();
        length = (typeof length === 'number') ? length : 60;
        ending = (typeof ending === 'string') ? ending : '...';
        return (string.length > length) ? (string.substring(0, length) + ending) : string;
    };
}

if (typeof String.prototype.format !== 'function') {
    String.prototype.format = function(replacements) {
        if (!Array.isArray(replacements)) {
            throw new Error('Array must be provided');
        }

        var string = this.valueOf();
        return string.replace(/\$(\d+)/g, function(match) {
            var key = parseInt(match.slice(1));
            return (replacements.hasOwnProperty(key)) ? replacements[key] : match;
        });
    };
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

if (typeof String.prototype.multiply !== 'function') {
    String.prototype.multiply = function(times) {
        var output = '';
        for (var i = 0; i < times; ++i) {
            output += this.valueOf();
        }
        return output;
    };
}

if (typeof RegExp.from_charset !== 'function') {
    RegExp.from_charset = function(characters) {
        return new RegExp(
            '[' + characters.split('').map(c => `\\${c}`).join('') + ']+',
            'g'
        );
    };
}

// TODO: Maybe support only another Sets as an operand, seems like it makes sense
if (typeof Set.prototype.subtract !== 'function') {
    Set.prototype.subtract = function(another_set) {
        another_set = (another_set instanceof Set) ? another_set : new Set(Array.isArray(another_set) ? another_set : [another_set]);
        return new Set([...this].filter((item) => !another_set.has(item)));
    };
}

if (typeof Set.prototype.include !== 'function') {
    Set.prototype.include = function(another_set) {
        const set = this;
        another_set = (Array.isArray(another_set)) ? another_set : (another_set instanceof Set) ? [...another_set] : [another_set];
        return another_set.every(element => set.has(element));
    };
}

// DOM elements
if (typeof HTMLSelectElement.prototype.select !== 'function') {
    Object.defineProperty(HTMLSelectElement.prototype, 'select', {
        value: function(option_value, only=true) {
            for (let i = 0; i < this.options.length; ++i) {
                var option = this.options[i];
                if (option.value === option_value) {
                    this.selectedIndex = i;
                    return option;
                }
            }
        }
    });
}

if (typeof Date.prototype.format !== 'function') {
    Date.prototype.format = function(format='%Y.%m.%D') {
        return format.replace(/%\w/g, function(match) {
            switch (match) {
                case '%Y': return this.getFullYear().toString();									break;
                case '%y': return this.getFullYear().toString().slice(-2);							break;
                case '%m': return (this.getMonth() + 1).toString().add_leading_symbols('0', 2);	    break;
                case '%D': return this.getDate().toString().add_leading_symbols('0', 2);			break;
                case '%d': return this.getDate().toString();                           			    break;
                case '%h': return this.getHours().toString().add_leading_symbols('0', 2);			break;
                case '%M': return this.getMinutes().toString().add_leading_symbols('0', 2);		    break;
                case '%s': return this.getSeconds().toString().add_leading_symbols('0', 2);		    break;
                case '%S': return this.getMilliseconds().toString().add_leading_symbols('0', 3);	break;
            }
        });
    };
}

// localStorage & sessionStorage
if (typeof Storage.prototype.get !== 'function') {
    Storage.prototype.get = function(key, convert_to, default_value) {
        const value = this.getItem(key);
        return (value !== null) ? value.convert(convert_to) : default_value;
    };
}

if (typeof Storage.prototype.remove !== 'function') {
    Storage.prototype.remove = function(keys) {
        const storage = this;
        if (Array.isArray(keys)) {
            keys.forEach((key) => storage.removeItem(key));
        } else if (typeof keys === 'string') {
            storage.removeItem(keys);
        }
    };
}

// window.location
if (typeof Location.prototype.parse_query !== 'function') {
    Location.prototype.parse_query = function(url) {
        var output = {};
        var query = (
            (typeof url === 'string') ? url : this.search
        ).split('#')[0].split('?').last();
        let s = query.split('&');
        //s.forEach(p => ([k, v] = p.split('=')) && (output[k] = decodeURIComponent(v)));
        s.forEach(p => {
            let arr = p.split('=');
            output[arr[0]] = decodeURIComponent(arr[1])
        });
        return output;
    };
}

if (typeof Location.prototype.construct_query !== 'function') {
    Location.prototype.construct_query = function(base_url, parameters={}) {
        return [
            base_url,
            Object.keys(parameters).map(
                name => [name, parameters[name]].join('=')
            ).join('&')
        ].join('?');
    };
}

/*
return new Promise(function(resolve, reject) {
    try {
        chrome.(
            ,
            resolve
        );
    } catch (e) {
        reject(e);
    }
});
*/

// jQuery
$.ajaxSetup({
    type: 'POST',
    dataType: 'JSON',
    contentType: 'application/json',
    async: true
});

function is_triggered_by_user(event) {
    return event.originalEvent && event.originalEvent.isTrusted;
}

function is_element_in_focus(element) {
    return (typeof element === 'object') && (element === document.activeElement);
}

// Localization
function get_locale() {
    return /ru(-\W+)?/i.test(chrome.i18n.getUILanguage()) ? 'ru' : 'en';
}

function localize() {
    $('[data-i18n]').each(function(index, element) {
        if (element.dataset.i18n) {
            if (/[\:]/.test(element.dataset.i18n)) {
                element.dataset.i18n
                    .split(',')
                    .forEach(function(key_value) {
                        var [attribute, i18n_key] = key_value.split(':');
                        if (attribute === 'tooltip' || attribute === 'tooltip_bottom') {
                            $(element).tooltip({
                                placement: (attribute === 'tooltip_bottom') ? 'bottom' : 'top',
                                html: true,
                                title: chrome.i18n.getMessage(i18n_key)
                            });
                        } else if (attribute === 'text') {
                            $(element).html(attribute, chrome.i18n.getMessage(i18n_key));
                        } else {
                            $(element).attr(attribute, chrome.i18n.getMessage(i18n_key));
                        }
                    });
            } else {
                $(element).html(chrome.i18n.getMessage(element.dataset.i18n));
            }
        }
    });
}

// Alerts
function alert_show(text, type) {
    if (text === 'undefined') return;
    type = (typeof type === 'string') ? type : 'default';

    var $alert = $('.alert');
    if ($alert.length) {
        _clear_classes();
        _set_header();
        _set_text();
        _set_class(type);
        _show();
    }

    function _set_text() {
        $alert.find('.alert-text').text(text);
    }

    function _set_header() {
        $alert.find('.alert-header').text(chrome.i18n.getMessage(`alert_${type}_header`));
    }

    function _set_class(type) {
        var classes = {
            success: 'alert-success',
            info: 'alert-info',
            error: 'alert-error'
        };
        if (classes.hasOwnProperty(type)) {
            $alert.addClass(classes[type]);
        }
    }

    function _clear_classes() {
        $alert.removeClass('alert-success alert-info alert-error');
    }

    function _show() {
        $alert.fadeIn(200);
        setTimeout(
            function() {
                $alert.fadeOut(200);
            },
            2000
        );
    }
}

// Media (images, videos, etc.)
function align_image_in_container(source_url, image_element, wrapper_element) {
    const image = new Image();
    image.src = source_url;
    image.onload = function() {
        image_element.attr('src', source_url);
        image_element.addClass((this.naturalWidth > this.naturalHeight) ? 'wide' : 'tall');
    }
}

function fit_image_and_get_scale(image_width, image_height, area_size) {
    const max_side = Math.max(image_width, image_height);
    return (max_side > area_size) ? (area_size/max_side) : 1;
}

function fit_image_to_rect_and_get_scale(image_width, image_height, rect_width, rect_height) {
    return Math.min(1, rect_width/image_width, rect_height/image_height);
}

function fit_image_to_rectangle(image_data, final_width, final_height, callback) {
    const image = new Image();
    image.src = get_image_src(image_data);
    image.onload = function() {
        get_image_data(
            this,
            {scale: fit_image_to_rect_and_get_scale(this.naturalWidth, this.naturalHeight, final_width, final_height)}
        ).then((blob)=>{callback(blob,this.naturalWidth, this.naturalHeight)});
    }
}

// TODO: Add output quality parameters
function get_image_data_from_url(image_data, export_as='blob') {
    return new Promise(function(resolve, reject) {
        const image = new Image();
        image.src = get_image_src(image_data);
        image.onload = (e) => get_image_data(image, {export_as: export_as}).then(resolve);
        image.onerror = reject;
    });
}

function get_image_data(media_object, options={}) {
    options = Object.assign({
        export_as: 'blob',
        scale: 1,
        type: 'png',
        quality: 0.5
    }, options);

    return new Promise(function(resolve, reject) {
        try {
            const media_type = get_media_type(media_object);
            if (['video', 'image'].has(media_type)) {
                const src_width = (media_type === 'video') ? media_object.videoWidth : media_object.naturalWidth,
                    src_height = (media_type === 'video') ? media_object.videoHeight : media_object.naturalHeight;

                const canvas = document.createElement('canvas');
                canvas.width = (options.scale_x || options.scale) * src_width;
                canvas.height = (options.scale_y || options.scale) * src_height;
                const context = canvas.getContext('2d');
                context.drawImage(media_object, 0, 0, canvas.width, canvas.height);
                if (options.export_as === 'blob') {
                    canvas.toBlob(blob => resolve(blob), canvas.width, canvas.height);
                } else {
                    resolve(canvas.toDataURL(options.type, options.quality), canvas.width, canvas.height);
                }
            } else {
                throw new Error('Wrong input type');
                reject();
            }
        } catch (e) {
            reject(e);
        }
    });
}

function cut_frame(video_source, offset=0) {
    return new Promise(function(resolve, reject) {
        try {
            const video = document.createElement('video');
            video.src = get_media_src(video_source);
            video.onloadedmetadata = function() {
                if (is_instance(video_source, 'MediaStream')) {
                    // We can't navigate media stream the usual way and should wait for specified amount of time instead
                    setTimeout(function() {
                        get_image_data(video).then(resolve);
                        // delete(video);
                    }, 1000*offset);
                } else {
                    this.currentTime = offset;
                    video.onseeked = function(e) {
                        get_image_data(video).then(resolve);
                        // delete(video);
                    };
                }
            };
        } catch(e) {
            reject(e);
        }
    });
};

function get_media_type(object) {
    const types = {
        'IMG': 'image',
        'AUDIO': 'audio',
        'VIDEO': 'video'
    };
    return (object && object.nodeName && types[object.nodeName]) || null;
}

function get_image_src(data) {
    return (is_instance(data, ['Blob'])) ? URL.createObjectURL(data) : data;
}

function get_media_src(data) {
    return (is_instance(data, ['Blob', 'MediaStream'])) ? URL.createObjectURL(data) : data;
}

// function get_image_src(image_data) {
//     return (typeof image_data === 'string') ? image_data : URL.createObjectURL(image_data);
// }
//
// function get_media_src(data) {
//     return (typeof data === 'string') ? data : URL.createObjectURL(data);
// }

// Files
function get_file_data(file, output_type) {
    return new Promise(function(resolve, reject) {
        const file_reader = new FileReader();
        switch (output_type) {
            case 'data_uri':    file_reader.readAsDataURL(file);        break;
            case 'text':        file_reader.readAsText(file);           break;
            case 'buffer':      file_reader.readAsArrayBuffer(file);    break;
            default:            file_reader.readAsBinaryString(file);
        }

        file_reader.onload = (e) => resolve(e.target.result);
        file_reader.onerror = (e) => reject(e);
    });
}

function binary_string_to_blob(bytes, mime_type) {
    return new Blob(
        [Uint8Array.from(bytes, (c) => c.charCodeAt(0))],
        {type: (mime_type || 'application/octet-stream')}
    );
}

// HTML DOM
$(document).ready(function() {
    $(document).on('change', '.ms_range_clamped', function(e) {
        if (['number', 'range'].has(this.type)) {
            this.value = Number(this.value).clamp(this.min || 0, this.max);
        }
    });
});

function encode_html(code) {
    return $('<p/>').text(code).html();
}

function decode_html(code) {
    return $('<p/>').html(code).text();
}

function select_option_with_value(select_id, value) {
    const select = document.getElementById(select_id);
    select.value = value;
}

function select_get_value(select_id) {
    const select = document.getElementById(select_id);
    return select.value;
}

// Numbers
function clamp(value, min, max) {
    if (min <= value && value <= max) {
        return value
    } else {
        return (value < min) ? min : max;
    }
}

function get_nearest_value(value, min, max, step) {
    step = (typeof step === 'number' && step > 0) ? step : 1;
    if (typeof value === 'number' && value > 0) {
        value = step * Math.round(value.clamp(min, max)/step);
    }
    return value;
}

function get_the_nearest_in_a_sequence(value, sequence, direction) {
    if (typeof value === 'number' && Array.isArray(sequence)) {
        if (sequence.length === 1) {
            return sequence[0];
        } else {
            sequence.sort();
            var min = sequence[0],
                max = sequence.slice(-1)[0];
            if (value < min) {
                return min;
            } else if (value > max) {
                return max
            } else {
                for (var i = 0; i < sequence.length - 1; ++i) {
                    if (direction) {
                        if (direction === 'next') {
                            if (sequence[i] <= value && value < sequence[i+1]) {
                                return sequence[i+1];
                            }
                        } else {
                            if (sequence[i] < value && value <= sequence[i+1]) {
                                return sequence[i];
                            }
                        }
                    } else {
                        if (sequence[i] <= value && value <= sequence[i+1]) {
                            return value > 0.5*(sequence[i+1] + sequence[i]) ? sequence[i+1] : sequence[i];
                        }
                    }
                }
            }
        }
    }
    return value;
}

function round_float_number(input, precision) {
    return (typeof input !== 'number') ?
        input.toFixed((typeof precision === 'number') ? precision : 2) :
        input;
}

// Strings
function fill_with_zeroes(source, length) {
    length = (typeof length === 'number') ? length : 2;
    if (['string', 'number'].has(typeof source)) {
        source = source.toString();
        while (source.length < length) {
            source = '0' + source;
        }
    }
    return source;
}

function create_unique_id(existing_ones=[], length=10) {
    let id;
    while (existing_ones.has(id = generate_random_string(length))) { console.log(id); }
    return id;
}

function generate_random_string(length, symbols) {
    length = length || 25;
    symbols = symbols || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0, output = ''; i < length; ++i) {
        output += symbols[Math.floor(symbols.length * Math.random())];
    }
    return output;
}

function trim_string(input, symbols_to_trim, trim_as_a_whole=false) {
    if (typeof input === 'string' && typeof symbols_to_trim === 'string') {
        var special_chars = /[\[\]\\\/\^\$\.\|\?\*\+\(\)\{\}]/g;
        symbols_to_trim = symbols_to_trim.replace(special_chars, c => `\\${c}`);
        return input.replace(
            new RegExp(
                (trim_as_a_whole) ?
                    `(^[${symbols_to_trim}]+|[${symbols_to_trim}]+$)` :
                    `(^(${symbols_to_trim})+|(${symbols_to_trim})+$)`,
                'gi'
            ),
            ''
        );
    }
}

// Date
function convert_seconds_to_time_string(value) {
    value = Math.floor(value);
    return [fill_with_zeroes(Math.floor(value / 60)), fill_with_zeroes(value % 60)].join(':');
}

function convert_timestamp_to_string(timestamp, with_time) {
    var d = new Date(timestamp);
    return (with_time) ? d.toDateString() : d.toLocaleString();
}

// Validation
function is_instance(data, types) {
    const check = (object, type) => (object !== null) && (object !== undefined) && (object.constructor.name === type);
    return (Array.isArray(types)) ?
        types.some(type => check(data, type)):
        (typeof types === 'string') && check(data, types);
}

function is_file_image(input, type='mime_type') {
    return (type === 'mime_type') ?
        /^image\/(png|jpe?g|gif|bmp)/i.test(input) :
        /\.(png|jpe?g|gif|bmp)$/i.test(input);
}

function is_file_video(input, type='mime_type') {
    return (type === 'mime_type') ?
        /^video\/(mp4|webm)/i.test(input) :
        /\.(mp4|webm)$/i.test(input);
}

function check_is_link(input) {
    return /^((https?|ftp)\:\/\/)?(\w+\.)+\w+(\/?.*)?/.test(input);
}

function check_is_email(input) {
    return /(\w+[\.\-\+]?)+\@(\w+[\.\-]?)+\.\w+/.test(input);
}

// Others
function get_volume_string(volume, join_with_space) {
    if (typeof volume === 'number') {
        join_with_space = (typeof join_with_space === 'boolean') ? join_with_space : true;
        var sign = (volume < 0) ? -1 : 1;

        volume *= sign;
        var j = 0;
        while (volume > 1024) {
            volume /= 1024;
            ++j;
        }

        return [
            sign*volume.toFixed(2),
            ['b', 'Kb', 'MB', 'GB', 'TB'][j]
        ].join(join_with_space ? ' ' : '');
    }
    return volume;
}
