function MSScreenshotCapture() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        pages: new MSViewsManager(),
        tabs: new MSTabsManager(),
        windows: MSWindowsManager
    };

    function _initialize() {
        _dependencies.transmitter.subscribe({
            'take_screenshot': (request, callback) => self.take(request.type),

            'get_capture_settings': function(request, callback) {
                let settings = {};
                switch (request.type) {
                    case 'area':
                        settings = {
                            show_magnifier: ms_app_data.get('show_magnifier_on_area_capture')
                        };
                        break;

                    default:
                    //
                }
                callback({settings: settings});
            },

            'capture_and_return': (request, callback) => self.capture_visible_area().then(
                (data_url) => callback({data_uri: data_url})
            ),

            'capture_and_crop': function(request, callback) {
                self.reset();
                _dependencies.tabs.active.get().then(
                    (tab) => self.capture_visible_area().then(function (data_url) {
                        const callback = (image_blob) => self.do_post_capture_action({
                            data: image_blob,
                            title: tab.title,
                            tab: _dependencies.tabs.extract_info(tab)
                        });

                        if (request.area && request.window) {
                            const image = new Image();
                            image.src = get_image_src(data_url);
                            image.onload = function () {
                                var dpi_factor = this.naturalWidth / request.window.width;
                                var _x = request.area.x * dpi_factor,
                                    _y = request.area.y * dpi_factor;

                                const canvas = document.createElement('canvas');
                                const _width = canvas.width = request.area.width * dpi_factor;
                                const _height = canvas.height = request.area.height * dpi_factor;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(this, _x, _y, _width, _height, 0, 0, _width, _height);
                                get_image_data_from_url(canvas.toDataURL()).then(callback);
                            }
                        } else {
                            get_image_data_from_url(data_url).then(callback);
                        }
                    })
                );
            }
        });
    }

    self.canvas = document.createElement('canvas');

    self.take = function(type) {
        self.reset();
        switch (type) {
            case 'window':
                ga_send_event('Capture', 'Window visible area');
                console.log('[Screenshot] Capture visible area');
                _dependencies.tabs.active.get().then(
                    (tab) => self.capture_visible_area().then(
                        (data_url) => get_image_data_from_url(data_url).then(
                            function(image_blob) {
                                self.do_post_capture_action({
                                    data: image_blob,
                                    tab: _dependencies.tabs.extract_info(tab),
                                    title: self.tab.title
                                });
                            }
                        )
                    )
                );
                break;

            case 'area':
                ga_send_event('Capture', 'Page area', 'Initialize');
                console.log('[Screenshot] Initialize area capture');
                _dependencies.tabs.active.send_message({message: 'start_area_capture'});
                break;

            case 'webpage':
                ga_send_event('Capture', 'Whole webpage');
                console.log('[Screenshot] Whole webpage capture');
                self.webpage.init();
                break;

            case 'desktop':
                ga_send_event('Capture', 'Screen/application');
                console.log('[Screenshot] Capture a screen / an application');
                self.capture_desktop.initialize(function(blob) {
                    self.do_post_capture_action({
                        data: blob,
                        title: 'Desktop'
                    });
                });
                break;
        }
    };

    self.webpage = {
        page: null,
        tab: null,
        canvas: null,
        grab:function(){
            var self = this
            this.captureTimeout = 500
            this.params = {}
            this.parts = []
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            this.capture = function(cb){
                chrome.tabs.captureVisibleTab(null, {format: 'png'}, cb);
            }

            this.setCanvasSize = function (h,w) {
                canvas.height = h
                canvas.width = w
            }
            this.cnvToDataUrl = function (){
                return canvas.toDataURL()
            }

            this.drawCnv = function(screen,dpi,x,y,cb){

                const image = new Image();
                image.onload = function(){
                    ctx.drawImage(this,x,y,this.naturalWidth/dpi, this.naturalHeight/dpi)
                    cb()
                }
                image.src = screen

            }

            this.scrollCapture = function(tab,iter, last,i,h,cb){
                if(i <= iter){
                    chrome.tabs.sendMessage(tab, {msg:"scrollTo",x:0,y:i*h} , function () {
                        setTimeout(function(){
                            self.capture(function(img){
                                self.parts.push({img: img,y:i*h})
                                self.scrollCapture(tab,iter,last,i+1,h,cb)
                            })
                        },self.captureTimeout)

                    } );
                }else{
                    cb()
                }

            }

            this.drawParts = function(cb,i){
                if (i==undefined){
                    var i=0
                }
                if (self.parts.length>0 ){

                    if(self.parts[i]!=undefined){

                        self.drawCnv(self.parts[i].img,self.params.dpiFactor,0,self.parts[i].y,function(){
                            self.drawParts(cb,i+1)
                        })
                    }else{

                        cb()
                    }

                }
            }

            this.exportUri = function(){
                return self.cnvToDataUrl()
            }
        },
        init:function(){

            const grab = new self.webpage.grab()

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                let tab = tabs[0]
                chrome.tabs.executeScript(tab.id, {file: 'content_scripts/capture_page.js'}, function() {
                    chrome.tabs.sendMessage(tab.id, {msg:"pageParams"}, function(data){
                        if(data.error){
                            console.log(data.error,data.error.message)
                            return
                        }

                        grab.params = data
                        grab.setCanvasSize(data.fullHeight,data.fullWidth)
                       chrome.tabs.sendMessage(tab.id, {msg:"scrollTo",x:0,y:999999999999999999} );

                        let iter = parseInt(data.fullHeight / data.windowHeight)
                        let last = ((data.fullHeight % data.windowHeight)>0) ? true : false;

                        grab.scrollCapture(tab.id,iter,last,0,data.windowHeight,function(){
                            chrome.tabs.sendMessage(tab.id, {msg:"scrollTo",x:0,y:data.fullHeight-data.windowHeight} , function () {
                                setTimeout(function(){
                                    grab.capture(function(img){

                                         chrome.tabs.sendMessage(tab.id, {msg:"finish"} ,function () {
                                             console.log("done")

                                         } );

                                        grab.parts.push({img: img,y:data.fullHeight-data.windowHeight})
                                        grab.drawParts(function () {
                                            let uri = grab.exportUri()

                                            self.do_post_capture_action({
                                                data: uri,
                                                title: self.tab.title,
                                                tab: _dependencies.tabs.extract_info(self.tab)
                                            });

                                            var views = chrome.extension.getViews({
                                                type: "popup"
                                            });

                                            for (var i = 0; i < views.length; i++) {
                                                views[i].close();
                                                views[i].$('#loader').hide();
                                            }

                                        })
                                    })
                                },grab.captureTimeout)



                            })
                        })

                    })
                })
            })
        },
        initialize: function() {
            self.webpage.get_page_parameters().then(function(data) {
                console.log('Page data', data);
                self.page_data = data;
                self.tab = _dependencies.tabs.extract_info(data.tab);
                const canvas = document.createElement('canvas');
                canvas.width = data.page.width * data.dpi_factor;
                canvas.height = data.page.height * data.dpi_factor;
                self.canvas = {
                    element: canvas,
                    context: canvas.getContext('2d')
                };

                const steps = {
                    horizontal: Math.ceil(data.page.width/data.window.width),
                    vertical: Math.ceil(data.page.height/data.window.height)
                };
                console.log('Resolution (in windows): ', steps);

                const iterations = [];
                for (let v = 0, offset_y = 0; v < steps.vertical; ++v) {
                    for (let h = 0, offset_x = 0; h < steps.horizontal; ++h) {
                        iterations.push({
                            top: offset_y,
                            left:offset_x
                        });
                        offset_x += data.window.width;
                    }
                    offset_y += data.window.height;
                }
                console.log(iterations.length);
                // iterations.reverse();

                self.scroll_and_capture(
                    iterations,
                    function(tab) {
                        _dependencies.tabs.active.send_message({
                            message: 'do_webpage_capture',
                            action: 'finish'
                        }).then(function(response) {
                            _dependencies.tabs.active.send_message({
                                message: 'do_webpage_capture',
                                action: 'scroll_page',
                                just_scroll: true,
                                offset: self.page_data.initial_offset
                            });

                            self.do_post_capture_action({
                                data: self.canvas.element.toDataURL(),
                                title: self.tab.title,
                                tab: _dependencies.tabs.extract_info(self.tab)
                            });
                            delete(self.webpage.canvas.element);
                        });
                    }
                );
            });
        },

        get_page_parameters: () => _dependencies.tabs.active.send_message({
            message: 'do_webpage_capture',
            action: 'get_data'
        }),

        get_portion: function() {

        },

        finish: function() {

        }
    };

    self.capture_desktop = {
        busy: false,
        finished: false,
        aborted: false,
        stream: null,
        max: function (nums) {
            if (Array.isArray(nums)==false){
                let arr = []
                for (let i in nums){
                    arr.push(nums[i])
                }
                nums = arr
            }
                return Math.max.apply(Math, nums.filter(function(x) { return x; }));
        },
        min: function (nums) {
            if (Array.isArray(nums)==false){
                let arr = []
                for (let i in nums){
                    arr.push(nums[i])
                }
                nums = arr
            }
            return Math.min.apply(Math, nums.filter(function(x) { return x; }));
        },
        chromePatch: function(stream_id){
            return MediaStreamHandler.link({
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: stream_id
                    }
                }
            });
        },
        initialize: function(callback) {

            const delay = parseInt(ms_app_data.get('pre_capture_delay'));

            self.reset();
            MediaStreamHandler.create(function(stream_id) {
                if (stream_id) {
                    (((ms_platform.os_full)=="ChromeOS")?(self.capture_desktop.chromePatch(stream_id)):(MediaStreamHandler.get_video(stream_id))).then(
                        function(stream) {
                            self.capture_desktop.busy = true;
                            self.capture_desktop.track_stream_state(stream);

                            if (ms_app_data.get('minimize_chrome_on_desktop_capture')) {
                                _dependencies.windows.minimize_all(function() {
                                    self.capture_desktop.show_countdown_window(delay).then(function() {
                                        if (!self.capture_desktop.aborted) {
                                            self.capture_desktop.extract_frame_imageCapture(stream).then(function(image_blob){
                                                _dependencies.windows.normalize_all();
                                                if (typeof callback === 'function') { callback(image_blob); }
                                            })

                                        }
                                    });
                                });
                            } else {
                                if (!self.capture_desktop.aborted) {
                                    self.capture_desktop.show_countdown_window(delay).then(
                                        () => self.capture_desktop.extract_frame_imageCapture(stream).then(callback)
                                    );
                                }
                            }
                        }
                    );
                }
            });
        },
        VerSearch:function(data,h,w){
            let wMid = parseInt(w/2)
            let hMid = parseInt(h/2)

            let pos = {
                top:"",
                topMid:"",
                mid:"",
                midBot:"",
                bottom:""
            }

            for (let i=0; i<hMid; i++ ){
                let top = data.getPixel(0,i)
                let topMid = data.getPixel(parseInt(wMid/2),i)
                let mid = data.getPixel(wMid,i)
                let midBot = data.getPixel(parseInt(wMid + (wMid/2)),i)
                let bottom = data.getPixel(i,w-1)

                if(top.R!=0&&top.G!=0&&top.B!=0 && pos.top==""){
                    pos.top = i
                }

                if(topMid.R!=0&&topMid.G!=0&&topMid.B!=0 && pos.topMid==""){
                    pos.topMid = i
                }

                if(mid.R!=0&&mid.G!=0&&mid.B!=0 && pos.mid==""){
                    pos.mid = i
                }

                if(midBot.R!=0&&midBot.G!=0&&midBot.B!=0 && pos.midBot==""){
                    pos.midBot = i
                }

                if(bottom.R!=0&&bottom.G!=0&&bottom.B!=0 && pos.bottom==""){
                    pos.bottom = i
                }

                if (pos.top!=""&&pos.topMid!=""&&pos.mid!=""&&pos.midBot!=""&&pos.bottom!=""){
                    break;
                }

            }

            return pos

        },
        horSearch:function(data,h,w){
            let wMid = parseInt(w/2)
            let hMid = parseInt(h/2)

            let pos = {
                top:"",
                topMid:"",
                mid:"",
                midBot:"",
                bottom:""
            };
            for (let i=0; i<wMid; i++ ){
                let top = data.getPixel(i,0)
                let topMid = data.getPixel(i,parseInt(hMid/2))
                let mid = data.getPixel(i,hMid)
                let midBot = data.getPixel(i,parseInt(hMid + (hMid/2)))
                let bottom = data.getPixel(i,h-1)

                if(top.R!=0&&top.G!=0&&top.B!=0 && pos.top==""){
                    pos.top = i
                }

                if(topMid.R!=0&&topMid.G!=0&&topMid.B!=0 && pos.topMid==""){
                    pos.topMid = i
                }

                if(mid.R!=0&&mid.G!=0&&mid.B!=0 && pos.mid==""){
                    pos.mid = i
                }

                if(midBot.R!=0&&midBot.G!=0&&midBot.B!=0 && pos.midBot==""){
                    pos.midBot = i
                }

                if(bottom.R!=0&&bottom.G!=0&&bottom.B!=0 && pos.bottom==""){
                    pos.bottom = i
                }



                if (pos.top!=""&&pos.topMid!=""&&pos.mid!=""&&pos.midBot!=""&&pos.bottom!=""){
                    break;
                }
            }


            return pos
        },
        cutterBlack: function(canvas){
            let ctx = canvas.getContext('2d')
            var imgData   = ctx.getImageData(0, 0, canvas.height, canvas.width);
            imgData.getPixel=function(x,y){
                var i=(x+y*this.width)*4;
                return {R:this.data[i],
                    G:this.data[i+1],
                    B:this.data[i+2],
                    A:this.data[i+3]

                }
            }
            let posH = self.capture_desktop.horSearch(imgData,canvas.height, canvas.width)
            let posY = self.capture_desktop.VerSearch(imgData,canvas.height, canvas.width)
            let max_posH =  self.capture_desktop.max(posH)
            let min_posH =  self.capture_desktop.min(posH)
            let max_posY =  self.capture_desktop.max(posY)
            let min_posY =  self.capture_desktop.min(posY)

            if (min_posH-1==0){

              canvas =  self.capture_desktop.HorCut(max_posY,canvas)
            }else if(min_posY-1==0){

              canvas =  self.capture_desktop.VerCut(max_posH,canvas)
            }



            return canvas
        },
        HorCut: function(pos,canvas){
           let canv = document.createElement('canvas')
            canv.height = (canvas.height - pos * 2)
            canv.width = canvas.width 
            let ctx = canv.getContext('2d');
            ctx.drawImage(canvas,0, (pos*(-1)));
            console.log(canv.width,canvas.width,pos)
            return canv 
        },
        VerCut: function(pos,canvas){

            let canv = document.createElement('canvas')
            canv.height = canvas.height
            canv.width = (canvas.width - pos * 2)
            let ctx = canv.getContext('2d');
            ctx.drawImage(canvas,(pos*(-1)+1), 0);
            console.log(canv.width,canvas.width,pos)
            return canv
        },
        track_stream_state: function(stream) {
            self.capture_desktop.stream = stream;

            const stream_tracks = stream.getTracks();
            stream_tracks.forEach(function(track) {
                track.onended = function() {
                    const active_tracks = stream_tracks.filter(t => (t.readyState === 'live'));
                    if (!stream.active || !active_tracks.length) {
                        console.log(`Your MediaStream is inactive now... Oops! (screenshot captured: ${self.capture_desktop.finished})`);
                        if (!self.capture_desktop.finished) {
                            self.capture_desktop.aborted = true;
                            _dependencies.pages.screenshot.capture_countdown.hide();
                        }
                    }
                };
            });
        },

        show_countdown_window: function(delay=0) {
            return new Promise(function(resolve, reject) {
                try {
                    if (delay > 0) {
                        // TODO: Show counter always on top
                        _dependencies.pages.screenshot.capture_countdown.show(delay, resolve);
                    } else {
                        resolve();
                    }
                } catch(e) {
                    reject(e);
                }
            });
        },
        extract_frame_imageCapture:function(stream){
            return new Promise( (resolve,reject)=>{
                try{
                    let track = stream.getVideoTracks()[0]

                    let imageCapture = new ImageCapture(track);
                    setTimeout(function () {

                        imageCapture.grabFrame().then(function(imageBitmap) {
                            self.capture_desktop.finished = true;
                            self.capture_desktop.busy = false;
                            MediaStreamHandler.release(stream);
                            self.canvas = document.createElement('canvas');

                            self.canvas.width = imageBitmap.width;
                            self.canvas.height = imageBitmap.height;
                            self.canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
                            if((ms_platform.os_full)=="ChromeOS"){  //change to ChromeOS
                                self.canvas = self.capture_desktop.cutterBlack(self.canvas)
                            }

                            self.canvas.toBlob(blob => resolve(blob),  self.canvas.width,  self.canvas.height);

                        }).catch(function(e) {
                            reject(e);
                        });
                    },1000)

                } catch(e){
                    reject(e);
                }
            } )
        },
        extract_frame: function(stream) {
            return new Promise(function(resolve, reject) {
                try {
                    cut_frame(stream, 1).then(function(frame_blob) {
                        self.capture_desktop.finished = true;
                        self.capture_desktop.busy = false;
                        MediaStreamHandler.release(stream);
                        resolve(frame_blob);
                    });
                } catch(e) {
                    reject(e);
                }
            });
        },

        reset: function() {
            self.capture_desktop.busy = false;
            self.capture_desktop.finished = false;
            self.capture_desktop.aborted = false;
            self.capture_desktop.stream = null;
        }
    };

    self.capture_visible_area = _dependencies.tabs.active.capture;

    self.scroll_and_capture = function(offsets, callback) {
        if (Array.isArray(offsets)) {
            if (offsets.length) {
                const offset = offsets.shift();
                // console.log(JSON.stringify(offset));
                _dependencies.tabs.active.send_message({
                    message: 'do_webpage_capture',
                    action: 'scroll_page',
                    offset: offset
                }).then(function(response) {
                    self.capture_visible_area().then(function(data_url) {
                        const image = new Image();
                        image.src = get_image_src(data_url);
                        image.onload = function() {
                            const draw_offset = {
                                top: response.current_offset.top * self.page_data.dpi_factor,
                                left: response.current_offset.left * self.page_data.dpi_factor
                            };
                            // console.log(draw_offset);
                            self.canvas.context.drawImage(this, draw_offset.left, draw_offset.top, this.naturalWidth, this.naturalHeight);
                            self.scroll_and_capture(offsets, callback);
                        }
                    });
                });
            } else {
                if (typeof callback === 'function') { callback(); }
            }
        }
    };

    self.do_post_capture_action = function(file={}, action) {
        action = action || ms_app_data.get('post_capture_action');

        file.type = 'screenshot';
        file.temporary = (action !== 'edit');
        const session = ms_core.sessions.create(file);
        switch (action) {
            case 'edit':
                ga_send_event('Post capture', 'Open in editor');
                session.edit();
                break;

            case 'save':
                ga_send_event('Post capture', 'Save on disk');
                session.save();
                session.close();
                break;

            case 'upload':
                ga_send_event('Post capture', 'Upload to default service');
                session.upload();
                session.close();
                break;

            default:
            //
        }
    };

    self.reset = function() {
        self.tab = {};
        delete(self.canvas);
        delete(self.page_data);
    };

    _initialize();
}