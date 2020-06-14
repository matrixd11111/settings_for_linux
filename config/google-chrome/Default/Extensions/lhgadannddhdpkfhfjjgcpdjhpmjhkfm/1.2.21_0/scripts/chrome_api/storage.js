function ChromeStorageAPI() {}
// Properties
// Area type: "sync", "local", or "managed"
//
// Quotas and limitations
// 1. chrome.storage.sync
// QUOTA_BYTES                      102,400
// QUOTA_BYTES_PER_ITEM             8,192
// MAX_ITEMS                        512
// MAX_WRITE_OPERATIONS_PER_HOUR    1,800
// MAX_WRITE_OPERATIONS_PER_MINUTE  120
//
// 2. chrome.storage.local
// QUOTA_BYTES                      5,242,880
// [!] This value will be ignored if the extension has the unlimitedStorage permission
//
// 3. chrome.storage.managed
// Items in the managed storage area are set by the domain administrator, and are read-only for the extension

ChromeStorageAPI.get = function(keys, area='local') {
    return new Promise(
        function (resolve, reject) {
            try {
                chrome.storage[area].get(
                    keys,
                    (items) => resolve((typeof keys === 'string') ? items[keys] : items)
                );
            } catch(e) {
                reject(e);
            }
        }
    );
};

ChromeStorageAPI.get_all = function(area='local') {
    return this.get(null, area);
};

ChromeStorageAPI.set = function(items, area='local') {
    return new Promise(
        function (resolve, reject) {
            try {
                chrome.storage[area].set(items, resolve);
            } catch(e) {
                reject(e);
            }
        }
    );
};

ChromeStorageAPI.remove = function(items, area='local') {
    return new Promise(
        function (resolve, reject) {
            try {
                chrome.storage[area].remove(items, resolve);
            } catch(e) {
                reject(e);
            }
        }
    );
};

ChromeStorageAPI.clear = function(area='local') {
    return new Promise(
        function (resolve, reject) {
            try {
                chrome.storage[area].clear(resolve);
            } catch(e) {
                reject(e);
            }
        }
    );
};