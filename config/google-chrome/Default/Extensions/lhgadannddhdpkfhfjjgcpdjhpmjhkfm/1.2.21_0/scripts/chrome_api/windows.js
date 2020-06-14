function ChromeWindowsAPI() {}
// -= Properties =-
// 1. Type
// "normal"     A normal browser window.
// "popup"      A browser popup window.
// "devtools"   A devtools window.
//
// 2. State
// "normal"				Normal window state (i.e. not minimized, maximized, or fullscreen).
// "minimized"			Minimized window state.
// "maximized"			Maximized window state.
// "fullscreen"			Fullscreen window state.
// "docked"				Deprecated since Chrome M59. Docked windows are no longer supported. This state will be converted to "normal".
// "locked-fullscreen"	Locked fullscreen window state. This fullscreen state cannot be exited by user action. It is available only to whitelisted extensions on Chrome OS.

ChromeWindowsAPI.current_id = chrome.windows.WINDOW_ID_CURRENT;

ChromeWindowsAPI.get = function(window_id) {
    return new Promise(function (resolve, reject) {
        try {
            (typeof window_id === 'number') ?
                chrome.windows.get(window_id, resolve) :
                chrome.windows.getCurrent(resolve)
        } catch (e) {
            reject(e);
        }
    });
};

ChromeWindowsAPI.get_all = function() {
    return new Promise(function (resolve, reject) {
        try {
            chrome.windows.getAll(resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeWindowsAPI.open = function(url, type='normal', geometry={}, focused=true) {
    return new Promise(function(resolve, reject) {
        try {
            const parameters = Object.assign(
                {
                    url: url,
                    type: type,
                    focused: (focused === true)
                },
                (geometry.top) ? {top: geometry.top} : {},
                (geometry.left) ? {left: geometry.left} : {},
                (geometry.width) ? {width: geometry.width} : {},
                (geometry.height) ? {height: geometry.height} : {}
            );
            chrome.windows.create(parameters, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeWindowsAPI.update = function(window_id, parameters={}) {
    return new Promise(function (resolve, reject) {
        try {
            chrome.windows.update(window_id, parameters, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeWindowsAPI.set_state = (window_id, state='normal') => ChromeWindowsAPI.update(window_id, {state: state});
ChromeWindowsAPI.minimize = (window_id) => ChromeWindowsAPI.set_state(window_id, 'minimized');
ChromeWindowsAPI.normalize = (window_id) => ChromeWindowsAPI.set_state(window_id, 'normal');

ChromeWindowsAPI.set_focus = (window_id) => ChromeWindowsAPI.update(window_id, {focused: true});

ChromeWindowsAPI.close = function(window_id) {
    return new Promise(function (resolve, reject) {
        try {
            chrome.windows.remove(window_id, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

// Wrapper
function MSWindowsManager() {}

MSWindowsManager.batch_state_change = function(windows, state, callback) {
    if (Array.isArray(windows)) {
        const processor = (state === 'minimize') ? ChromeWindowsAPI.minimize : ChromeWindowsAPI.normalize;
        windows.forEach(w => processor(w.id));
    }
    setTimeout(callback, 500);
};

MSWindowsManager.minimize_all = function(callback) {
    // ChromeWindowsAPI.get_all().then(windows => MSWindowsManager.batch_state_change(windows, 'minimized', callback));
    ChromeWindowsAPI.get_all().then(
        windows => Promise.all(windows.map(w => ChromeWindowsAPI.minimize(w.id))).then(callback)
        // windows => windows.forEach(w => ChromeWindowsAPI.minimize(w.id)) && setTimeout(callback, 500)
    );
};

MSWindowsManager.normalize_all = function(callback) {
    // ChromeWindowsAPI.get_all().then(windows => MSWindowsManager.batch_state_change(windows, 'normal', callback));
    ChromeWindowsAPI.get_all().then(
        windows => Promise.all(windows.map(w => ChromeWindowsAPI.normalize(w.id))).then(callback)
        // windows => windows.forEach(w => ChromeWindowsAPI.normalize(w.id)) && setTimeout(callback, 500)
    );
};

MSWindowsManager.focus = function(id, delay=0, callback) {
    setTimeout(
        () => ChromeWindowsAPI.set_focus(id).then(callback),
        1000*delay
    );
};

MSWindowsManager.open = function(options={}) {
    options = Object.assign(
        {
            type: 'popup',
            top: 0, left: 0,
            width: 0, height: 0
        },
        options
    );
    const url = options.url;
    const geometry = {
        top: (options.centered) ? Math.trunc(0.5*(window.screen.height - options.height)) : options.top,
        left: (options.centered) ? Math.trunc(0.5*(window.screen.width - options.width)) : options.left,
        width: options.width,
        height: options.height
    };
    const _open = () => ChromeWindowsAPI.open(url, options.type, geometry, options.focused).then(options.callback);

    if (options.page && (options.single_instance === true)) {
        _dependencies.pages.close(options.page).then(_open);
    } else {
        _open();
    }
};

MSWindowsManager.close = (window_id) => ChromeWindowsAPI.close(window_id);