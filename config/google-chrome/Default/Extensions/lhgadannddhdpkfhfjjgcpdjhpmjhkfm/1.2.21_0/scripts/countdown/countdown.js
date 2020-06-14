var bg;
const page_type = 'countdown';

window.onload = function() {
    ChromeRuntimeAPI.get_background_context().then(function(bg) {
        const hash = location.hash.slice(1);
        let delay = parseInt(
            (!hash.length) ? bg.ms_app_data.get('pre_capture_delay') : hash
        );

        const counter = document.getElementById('counter');
        counter.innerText = delay;
        setInterval(
            function() {
                if (delay) {
                    delay -= 1;
                    counter.innerText = delay;
                }
            },
            1000
        );
    });
};