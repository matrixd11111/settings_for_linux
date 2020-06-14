// Downloads management
function ChromeDownloadsAPI() {}

ChromeDownloadsAPI.download = function(options) {
    return new Promise(function(resolve, reject) {
        try {
            chrome.downloads.download(options, resolve);
        } catch(e) {
            reject(e);
        }
    });
};

ChromeDownloadsAPI.open_default_directory = chrome.downloads.showDefaultFolder;

ChromeDownloadsAPI.open_completed = (download_id) => chrome.downloads.open(download_id);


// Hotkeys
function ChromeCommandsAPI() {}

ChromeCommandsAPI.get_all = function() {
    return new Promise(function(resolve, reject) {
        try {
            chrome.commands.getAll(resolve);
        } catch (e) {
            reject(e);
        }
    });
};