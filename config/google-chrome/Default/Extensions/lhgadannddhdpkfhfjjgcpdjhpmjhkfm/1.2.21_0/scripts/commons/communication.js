function MSTransmitter(handlers) {
    const self = this;
    const _debug = false;
    let _active = false;

    const _listeners = {};

    self.subscribe = function(handlers) {
        if (handlers instanceof Object) {
            if (!_active) {
                chrome.runtime.onMessage.addListener(
                    function(request, sender, callback) {
                        // TODO: Replace 'message' with something more specific (to prevent collisions)…
                        const command = request.message;
                        const handler = _listeners[command];
                        if (typeof handler === 'function') {
                            handler(request, callback);
                        }
                        return true;
                    }
                );
                _active = true;
            }

            Object.assign(_listeners, handlers);
        }
    };

    self.local = {
        subscribe: function(handlers) {
            if (handlers instanceof Object) {
                for (let context in handlers) {
                    const handler = handlers[context];
                    if (typeof handler === 'function') {
                        document.addEventListener(context, function(e) {
                            if (_debug) {
                                console.log(`[Transmitter] Received message: ${context}`, e.detail);
                            }
                            handler(e.detail);
                        });
                    }
                }
            }
        },

        broadcast: function(context, data) {
            data = (data instanceof Object) ? data : {};

            if (typeof context === 'string') {
                if (_debug) {
                    console.log(`[Transmitter] Sent local message: ${context}`, data);
                }
                document.dispatchEvent(
                    new CustomEvent(context, {detail: data})
                );
            } else {
                console.log('[Transmitter] Context not specified');
            }
        }
    };

    self.unsubscribe = (commands) => Array.isArray(commands) && commands.forEach((command) => delete(_listeners[command]));

    self.broadcast = function(context, data={}, tab_id, push_to_locals=false) {
        return new Promise(function(resolve, reject) {
            try {
                if (_debug) {
                    console.log(`[Transmitter] Sent globals message: ${context}`, data, tab_id);
                }

                const message = Object.assign({message: context}, data);
                (typeof tab_id === 'number') ?
                    chrome.tabs.sendMessage(tab_id, message, resolve) :
                    chrome.runtime.sendMessage(message, resolve);

                if (push_to_locals === true) {
                    self.local.broadcast(context, data);
                }
            } catch (e) {
                reject(e);
            }
        });
    };

    self.subscribe(handlers);
}