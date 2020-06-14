window.onload = function() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, callback) {
            // console.log(request);
            if (request.page === page_type || request.page === 'all') {
                switch (request.message) {
                    case 'tabs_change_url':
                        window.location.href = request.url;
                        break;

                    case 'tabs_reload':
                        window.location.reload();
                        break;

                    case 'tabs_close':
                        window.close();
                        break;
                }
            }
        }
    );
};