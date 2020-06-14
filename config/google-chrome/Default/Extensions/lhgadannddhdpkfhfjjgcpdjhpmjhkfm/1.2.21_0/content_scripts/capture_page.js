
let grab = new Grabber()

chrome.runtime.onMessage.addListener(function (data, sender, callback) {

    switch (data.msg){
        case 'finish':
             grab.backElems()
             callback()
        case "pageParams":
            try{


           callback( grab.getPageParams() )
            }catch (e) {
                callback( {error:e} )
            }
        break;
        case "scrollTo":
            grab.scrollTo(data.x,data.y,callback)


    }
});

function max(nums) {
    return Math.max.apply(Math, nums.filter(function(x) { return x; }));
}

function Grabber(){
    var self = this


    this.pageParams;
    this.scrollEL = window
    this.scrollBar ={};

    this.scrollTo = function(x,y,callback){
        this.backElems()
        this.scrollEL.scrollTo({
            top: y,
            behavior: "instant"
        });
        self.procElems(y,callback)


    }
    this.getFixedElems = function(){
        let res = []

        var elems = document.body.getElementsByTagName("*");
        var len = elems.length

        for (var i=0;i<len;i++) {
            let position = window.getComputedStyle(elems[i],null).getPropertyValue('position')
            if (position=='fixed'||position=='sticky'||position=='-webkit-sticky') {
                let positions = {
                    top: window.getComputedStyle(elems[i],null).getPropertyValue('top'),
                    bottom: window.getComputedStyle(elems[i],null).getPropertyValue('bottom'),
                    left: window.getComputedStyle(elems[i],null).getPropertyValue('left'),
                    right: window.getComputedStyle(elems[i],null).getPropertyValue('right')
                }
                let opacity = window.getComputedStyle(elems[i],null).getPropertyValue('opacity')
                res.push({el:elems[i],pos:positions,opacity:opacity})
            }

        }
        return res

    }
    this.backElems = function () {
        if(self.scrollEL==window){
            self.scrollEL.document.body.style.overflowY = self.scrollBar.y
            self.scrollEL.document.body.style.overflowX = self.scrollBar.x
        }else{
            self.scrollEL.style.overflowY = self.scrollBar.y
            self.scrollEL.style.overflowX = self.scrollBar.x
        }
        let fixed = self.getFixedElems()
        if (fixed.length==0){return;}
        for (var i=0;i<fixed.length;i++) {
            if (fixed[i].opacity == "0"){
                fixed[i].el.style.opacity = ""
            }
        }

    }
    this.procElems = function (y,cb) {
        let fixed = self.getFixedElems()
        if (fixed.length==0){return;}

        if(self.scrollEL==window){
            self.scrollEL.document.body.style.overflowY = 'hidden'
            self.scrollEL.document.body.style.overflowX = 'hidden'
        }else{
            self.scrollEL.style.overflowY = 'hidden'
            self.scrollEL.style.overflowX = 'hidden'
        }


        if(y<self.pageParams.windowHeight){
            //first iter

            for (var i=0;i<fixed.length;i++) {
                if (fixed[i].pos.bottom == "0px"){
                    fixed[i].el.style.opacity = "0"
                }
            }
        }
        if(y>=self.pageParams.windowHeight&&y<(self.pageParams.fullHeight-self.pageParams.windowHeight)){
            for (var i=0;i<fixed.length;i++) {
                    fixed[i].el.style.opacity = "0"
            }
        }

        if(y==self.pageParams.fullHeight-self.pageParams.windowHeight){
            let halfSc = self.pageParams.windowHeight/2
            for (var i=0;i<fixed.length;i++) {
                if (parseInt(fixed[i].pos.top) >= 0 && parseInt(fixed[i].pos.top) <=  halfSc ){
                    fixed[i].el.style.opacity = "0"
                }
            }
        }

        cb()


    }
    this.getPageParams = function(){
        var body = document.body

        var widths = [
                document.documentElement.clientWidth,
                body ? body.scrollWidth : 0,
                document.documentElement.scrollWidth,
                body ? body.offsetWidth : 0,
                document.documentElement.offsetWidth
            ],
            heights = [
                document.documentElement.clientHeight,
                body ? body.scrollHeight : 0,
                document.documentElement.scrollHeight,
                body ? body.offsetHeight : 0,
                document.documentElement.offsetHeight

            ];

        if(window.getComputedStyle(body,null).getPropertyValue('overflow')=='hidden'
            || window.getComputedStyle(body,null).getPropertyValue('overflow-y')=='hidden'){
            var elems = document.body.getElementsByTagName("*");
            var len = elems.length

            for (var i=0;i<len;i++) {
                let overflowY = window.getComputedStyle(elems[i],null).getPropertyValue('overflow-y')
                if (overflowY=='scroll') {
                    if (heights.indexOf(elems[i].scrollHeight)==-1){
                        heights.push(elems[i].scrollHeight)
                        if(max(heights)==elems[i].scrollHeight){
                            this.scrollEL = elems[i]
                            console.log(elems[i])
                        }
                    }
                }
            }
        }

            var fullWidth = max(widths),
            fullHeight = max(heights),
            windowWidth = window.innerWidth,
            windowHeight = window.innerHeight

        let data = {
            fullWidth : fullWidth   ,
            fullHeight : (fullHeight>32767)?32767:fullHeight,
            windowWidth : windowWidth,
            windowHeight : windowHeight,
            dpiFactor: window.devicePixelRatio,
        }
        if(self.scrollEL==window){
            self.scrollBar.y = window.getComputedStyle(self.scrollEL.document.body,null).getPropertyValue('overflow-y')
            self.scrollBar.x = window.getComputedStyle(self.scrollEL.document.body,null).getPropertyValue('overflow-x')
        }else{
            self.scrollBar.y = window.getComputedStyle(self.scrollEL,null).getPropertyValue('overflow-y')
            self.scrollBar.x = window.getComputedStyle(self.scrollEL,null).getPropertyValue('overflow-x')
        }
        this.pageParams = data
        return data
    }



}