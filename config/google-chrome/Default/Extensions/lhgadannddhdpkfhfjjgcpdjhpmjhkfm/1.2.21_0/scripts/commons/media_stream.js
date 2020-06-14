function MediaStreamHandler() {}

MediaStreamHandler.create = function(callback,castCtx) {
    if(castCtx){
        castCtx.choosing = true
    }
    chrome.desktopCapture.chooseDesktopMedia(['screen', 'window',"audio"], callback);
};

MediaStreamHandler.link = function(constraints={}, success, error, from_device) {
    var self = this;

    return new Promise(function(resolve, reject) {
        Object.assign({
            video: false,
            audio: false
        }, constraints);

        if (from_device === true) {
            navigator.mediaDevices.getUserMedia(constraints).then(_handle_stream, reject);
        } else {
            navigator.getUserMedia(constraints, _handle_stream, reject);
        }

        function _handle_stream(stream) {
            if (typeof resolve === 'function') {
                resolve(stream);
            } else {
                self.release(stream);
            }
        }
    });
};

MediaStreamHandler.get_audio = function(device) {
    let audio=undefined;
    if(device){
        audio = {
            deviceId:{exact: device}
        }
    }

    return this.link({audio:audio});
};

MediaStreamHandler.get_video = function(stream_id) {
    return this.link({
        video: {
            mandatory: {
                maxWidth: 4000,
                maxHeight: 4000,
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: stream_id
            }
        }
    });
};

MediaStreamHandler.get_custom_video = function(stream_id,device){
    const constraints = {
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: stream_id
            }
        }
    };

    return this.link(constraints);
};

MediaStreamHandler.release = function(stream) {
    if (is_instance(stream, 'MediaStream') && stream.active) {
        // stream is considered *active* if one of its tracks is not *ended*
        stream.getTracks().forEach(track => track.stop());
    }
};