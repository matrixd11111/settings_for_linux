function ChromeEventsAPI() {}

// Runtime
// E.g. event will be fired after update
ChromeEventsAPI.extension_installed = function(handlers) {
    if (handlers instanceof Object && Object.keys(handlers).length) {
        chrome.runtime.onInstalled.addListener(function(details) {
            const event_reason = details.reason;
            const handler = handlers[reason];
            if (typeof handler === 'function') {
                switch(event_reason) {
                    case 'install':
                        handler();
                        break;

                    case 'update':
                        handler(details.previousVersion);
                        break;

                    case 'chrome_update':
                        handler();
                        break;
                }
            }
        });
    }
};

ChromeEventsAPI.extension_launched = function(handler) {
    if (typeof handler === 'function') {
        chrome.runtime.onStartup.addListener(handler);
    }
};

ChromeEventsAPI.extension_update_available = function(handler) {
    if (typeof handler === 'function') {
        chrome.runtime.onUpdateAvailable.addListener(handler);
    }
};

ChromeEventsAPI.extension_suspended = function(handler) {
    if (typeof handler === 'function') {
        chrome.runtime.onSuspend.addListener(handler);
    }
};

// Context menu
ChromeEventsAPI.click_on_context_menu_item = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: target, tab
        chrome.contextMenus.onClicked.addListener(handler);
    }
};

// Notifications
ChromeEventsAPI.click_on_notification = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: notification_id
        chrome.notifications.onClicked.addListener(handler);
    }
};

// Tabs
ChromeEventsAPI.tab_created = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: tab
        chrome.tabs.onCreated.addListener(handler);
    }
};

ChromeEventsAPI.tab_updated = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: tab_id, updated_fields, tab
        chrome.tabs.onUpdated.addListener(handler);
    }
};

ChromeEventsAPI.tab_activated = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: {tabId, windowId}
        chrome.tabs.onActivated.addListener(handler);
    }
};

ChromeEventsAPI.tab_highlighted = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: {windowId, tabIds}
        chrome.tabs.onHighlighted.addListener(handler);
    }
};

ChromeEventsAPI.tab_removed = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: tab_id, {windowId, isWindowClosing}
        chrome.tabs.onRemoved.addListener(handler);
    }
};

// Hotkeys
ChromeEventsAPI.command_triggered = function(handlers) {
    if (handlers instanceof Object && Object.keys(handlers).length) {
        chrome.commands.onCommand.addListener(function(command) {
            console.log(`[Chrome] Command triggered: ${command}`);
            ga_send_event('Hotkeys', command);

            const handler = handlers[command];
            if (typeof handler === 'function') {
                handler();
            }
        });
    }
};

// Storage
ChromeEventsAPI.storage_updated = function(handlers) {
    if (handlers instanceof Object && Object.keys(handlers).length) {
        // console.log(handlers);
        chrome.storage.onChanged.addListener(function(updates, area) {
            for (let key in updates) {
                if (handlers.hasOwnProperty(key) && typeof handlers[key] === 'function') {
                    const update = updates[key];
                    handlers[key](update.newValue, update.oldValue);
                }
            }
        });
    }
};

// Downloads
ChromeEventsAPI.download_created = function(handler) {
    if (typeof handler === 'function') {
        chrome.downloads.onCreated.addListener(handler);
    }
};

ChromeEventsAPI.download_updated = function(handler) {
    if (typeof handler === 'function') {
        // Handler args: {id, url, danger(bool), mime, state, paused, totalBytes, fileSize}
        chrome.downloads.onChanged.addListener(handler);
    }
};

// ChromeOS specific
ChromeEventsAPI.chromeos_file_manager_interaction = function(handlers) {
    if (handlers instanceof Object && Object.keys(handlers).length) {
        chrome.fileBrowserHandler.onExecute.addListener(function(id, details) {
            const file_entries = details.entries;

            const handler = handlers[id];
            if (typeof handler === 'function') {
                handler(file_entries);
            }
        });
    }
};