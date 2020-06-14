function MSClipboardManager(options={}) {
    const self = this;

    function _initialize() {
        const text_input = document.createElement('input');
        text_input.type = 'text';
        text_input.style = 'position:absolute; top:-1000px; visibility:hidden';
        // document.body.appendChild(text_input);
        self.buffer_input = document.getElementById('ms_clipboard_buffer');
        // self.buffer_input = text_input;
    }

    self.write = function(text, callback) {
        return new Promise(function(resolve, reject) {
            try {
                if (typeof text === 'string' && text.length) {
                    self.buffer_input.value = text;
                    self.buffer_input.select();
                    document.execCommand('copy');
                    resolve();
                } else {
                    reject('[Clipboard] No data to copy')
                }
            } catch(e) {
                reject(e);
            }
        });
    };

    self.read = function() {
        self.buffer_input.value = '';
        self.buffer_input.focus();
        document.execCommand('paste');
    };

    _initialize();
}