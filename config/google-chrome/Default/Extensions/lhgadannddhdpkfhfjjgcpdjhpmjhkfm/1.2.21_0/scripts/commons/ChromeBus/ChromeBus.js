export default class ChromeBus {
    static subscribe(registerType, handler) {
        chrome.runtime.onMessage.addListener((message) => {
            if(message) {
                const {type, payload} = message;
                if(type === registerType) {
                    if(typeof handler === "function") {
                        handler(payload, message);
                    }
                }
            }
        });
    }

    static send(type, payload) {
        chrome.runtime.sendMessage({type, payload});
    }

    static checkBusAccessibility() {
        return chrome.runtime !== undefined;
    }
}
