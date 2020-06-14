export default class AppDataWrapper {
    constructor(appData = window.ms_app_data) {
        this.appDataNative = appData;
    }

    set(parametrs) {
        return this.appDataNative.set(parametrs);
    }

    getFromBuffer(paramName) {
        return this.appDataNative.get(paramName, false);

    }
}
