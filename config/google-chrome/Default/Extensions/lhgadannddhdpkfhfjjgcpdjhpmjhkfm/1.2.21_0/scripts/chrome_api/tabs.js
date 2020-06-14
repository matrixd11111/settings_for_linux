function ChromeTabsAPI() {}

ChromeTabsAPI.send_message = function(tab_id, message) {
    return new Promise(function(resolve, reject) {
        try {
            (typeof tab_id === 'number') ?
                chrome.tabs.sendMessage(tab_id, message, resolve) :
                chrome.runtime.sendMessage(message, resolve)
        } catch (e) {
            reject(e);
        }
    });
};

ChromeTabsAPI.insert_css = function(tab_id, path) {
    if (typeof tab_id === 'number') {
        chrome.tabs.insertCSS(tab_id, {file: path});
    }
};

ChromeTabsAPI.inject_script = function(tab_id, path) {
    if (typeof tab_id === 'number') {
        chrome.tabs.executeScript(tab_id, {file: path});
    }
};

ChromeTabsAPI.zoom = function(tab_id, scale) {
    return new Promise(function(resolve, reject) {
        try {
            (typeof scale === 'number' && scale >= 0) ?
                chrome.tabs.setZoom(tab_id, scale, resolve) :
                chrome.tabs.getZoom(tab_id, resolve)
        } catch (e) {
            reject(e);
        }
    });
};

ChromeTabsAPI.capture_visible_area = function(window_id) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.captureVisibleTab(window_id, {format: 'png'}, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeTabsAPI.query = function(filter) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.query(filter, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeTabsAPI.get = function(tab_id) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.get(tab_id, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeTabsAPI.get_all = (window_id) => ChromeTabsAPI.query(
    (typeof window_id === 'number') ? {windowId: windowId} : {}
);

ChromeTabsAPI.get_active = function() {
    return new Promise(function(resolve, reject) {
        try {
            ChromeTabsAPI.query({
                currentWindow: true,
                active: true
            }).then(
                (tabs) => resolve(tabs[0]),
                reject
            );
        } catch (e) {
            reject(e);
        }
    });
};

ChromeTabsAPI.open = function(url) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.create({url: url}, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeTabsAPI.close = function(tab_id) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.remove(tab_id, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

// Wrapper
function MSTabsManager() {
    const self = this;
    const _native_api = ChromeTabsAPI;

    const _dependencies = {
        notifications: MSNotificationsManager
    };

    function _initialize() {
        _assign_message_handlers();
    }

    function _assign_message_handlers() {
        ChromeEventsAPI.tab_activated(function(tab) {
            self.active.id = tab.id;
        });
    }

    self.extract_info = (tab) => ({
        url: tab.url,
        title: tab.title
    });

    self.active = {
        id: null,

        send_message: function(message) {
            return new Promise(function(resolve, reject) {
                try {
                    self.active.get().then(
                        (tab) => _native_api.send_message(tab.id, message).then(resolve),
                        reject
                    );
                } catch (e) {
                    reject(e);
                }
            });
        },

        get: _native_api.get_active,

        capture: _native_api.capture_visible_area,

        save: () => _native_api.get_active().then((tab) => self.download(tab.id))
    };

    self.insert_css = (tab_id, paths) => paths.forEach(path => _native_api.insert_css(tab_id, path));

    self.inject_script = (tab_id, paths) => paths.forEach(path => _native_api.inject_script(tab_id, path));

    self.send_message = _native_api.send_message;

    self.get = _native_api.get;

    self.get_all = _native_api.get_all;

    self.open = _native_api.open;

    self.download = function(tab_id, callback) {
        return new Promise(function (resolve, reject) {
            _native_api.get(tab_id).then(
                (tab) => chrome.pageCapture.saveAsMHTML({tabId: tab.id}, function(page_blob) {
                    try {
                        ms_core.file.local.save(page_blob, `${tab.title}.mht`);
                        _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_file_save_success')});
                        resolve();
                    } catch(e) {
                        _dependencies.notifications.show({message: chrome.i18n.getMessage('notification_file_save_fail')});
                        reject(e);
                    }
                }),
                reject
            )
        });
    };

    self.close = _native_api.close;

    _initialize();
}