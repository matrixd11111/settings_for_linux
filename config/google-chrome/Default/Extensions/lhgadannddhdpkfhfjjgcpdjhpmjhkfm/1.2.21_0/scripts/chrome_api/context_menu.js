function ChromeContextMenuAPI() {}

ChromeContextMenuAPI.create = function(item_id, title, parent_id, context) {
    return new Promise(function (resolve, reject) {
        try {
            chrome.contextMenus.create(
                Object.assign(
                    {
                        id: item_id,
                        title: title
                    },
                    (parent_id) ? {parentId: parent_id} : {},
                    (context) ? {contexts: context} : {}
                ),
                resolve
            );
        } catch (e) {
            reject(e);
        }
    });
};

ChromeContextMenuAPI.remove = function(item_id) {
    return new Promise(function (resolve, reject) {
        try {
            (typeof item_id === 'string') ?
                chrome.contextMenus.remove(item_id, resolve) :
                chrome.contextMenus.removeAll(resolve)
        } catch(e) {
            reject(e);
        }
    });
};