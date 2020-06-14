window.onload = function () {
    if(!window.checkChromeBusAccessibility()) {
        window.location.reload(); // TODO: Fix it, it's bad
    }

    window.popupChromeExtensionLoaderCallback();
};
