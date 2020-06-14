function ChromeRuntimeAPI() {}

ChromeRuntimeAPI.extension_id = chrome.runtime.id;

ChromeRuntimeAPI.get_extension_manifest = chrome.runtime.getManifest;

ChromeRuntimeAPI.get_extension_file_url = chrome.runtime.getURL;

ChromeRuntimeAPI.get_extension_file_content = function(path) {
    return new Promise(
        (resolve, reject) => chrome.runtime.getPackageDirectoryEntry(
            (root) => root.getFile(
                path,
                {},
                (entry) => entry.file(
                    (file) => get_file_data(file, 'text').then(
                        (e) => resolve(e.target.result)
                    ),
                    reject
                ),
                reject
            )
        )
    );
};

ChromeRuntimeAPI.get_platform_info = chrome.runtime.getPlatformInfo;

ChromeRuntimeAPI.get_background_context = function() {
    return new Promise(function(resolve, reject) {
        try {
            chrome.runtime.getBackgroundPage(resolve);
        } catch(e) {
            reject(e);
        }
    });
};

ChromeRuntimeAPI.open_preferences = chrome.runtime.openOptionsPage;

ChromeRuntimeAPI.extension_reload = chrome.runtime.reload;
