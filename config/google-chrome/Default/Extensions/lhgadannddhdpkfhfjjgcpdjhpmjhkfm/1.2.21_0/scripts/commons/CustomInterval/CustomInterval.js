export default class CustomInterval {
    constructor({callback, interval}) {
        this.callback = callback;
        this.interval = interval;
    }

    setInterval(interval) {
        this.interval = interval;
    }

    startTick() {
        this.nextTick();
    }

    stopTick() {
        clearTimeout(this.timeoutInstance);
    }

    nextTick() {
        this.timeoutInstance = setTimeout(() => {
            if(typeof this.callback === "function") {
                this.callback();
            }

            this.nextTick();
        }, this.interval);
    }
}
