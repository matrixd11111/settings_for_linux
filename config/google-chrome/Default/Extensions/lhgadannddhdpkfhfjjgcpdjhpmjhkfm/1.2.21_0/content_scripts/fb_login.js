chrome.runtime.sendMessage(
    {
        message: 'login_with_fb',
        phase: 'finish',
        url: location.href
    },
    (response) => window.close()
);