function ChromeNotificationsAPI() {}

ChromeNotificationsAPI.get_all = function() {
    return new Promise(function(resolve, reject) {
        try {
            chrome.notifications.getAll(resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeNotificationsAPI.show = function(notification_id, parameters) {
    return new Promise(function(resolve, reject) {
        try {
            // console.log(notification_id, parameters);
            chrome.notifications.create(notification_id, parameters, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeNotificationsAPI.update = function(notification_id, parameters) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.notifications.update(notification_id, parameters, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

ChromeNotificationsAPI.remove = function(notification_id) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.notifications.clear(notification_id, resolve);
        } catch (e) {
            reject(e);
        }
    });
};

// Wrapper
function MSNotificationsManager() {}

MSNotificationsManager.show = function(options={}) {
    return new Promise(function(resolve, reject) {
        const id = (typeof options.id === 'string') ? options.id : null;
        const parameters = Object.assign(
            {
                type: options.type || 'basic',
                iconUrl: (typeof options.icon === 'string') ? options.icon : chrome.extension.getURL('images/logo_128.png'),
                title: options.title || 'Monosnap',
                message: options.message || chrome.i18n.getMessage('notification_unknown_error')
            },
            (typeof options.progress === 'number') ? {progress: options.progress} : {},
            (typeof options.image === 'string') ? {imageUrl: options.image} : {}
        );
        // console.log(parameters);
        ChromeNotificationsAPI.show(id, parameters).then(
            function(notification_id) {
                if (typeof options.hide_delay === 'number' && options.hide_delay > 0) {
                    MSNotificationsManager.hide(notification_id, options.hide_delay);
                }
                resolve(notification_id);
            },
            reject
        );
    })
};

MSNotificationsManager.update = ChromeNotificationsAPI.update;

MSNotificationsManager.set_progress = (notification_id, progress) => ChromeNotificationsAPI.update(notification_id, {progress: progress});

MSNotificationsManager.hide = function(notification_id, delay) {
    delay = (typeof delay === 'number') ? delay : 2.5;

    setTimeout(
        () => ChromeNotificationsAPI.remove(notification_id),
        delay * 1000
    );
};

MSNotificationsManager.close = ChromeNotificationsAPI.remove;