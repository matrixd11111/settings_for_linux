import {BasicLoader} from "jso";

import ChromeBus from "../../../commons/ChromeBus/ChromeBus";
import {POPUP_SUCCESS_ACTION} from "./Constants";
import TimeoutError from "../errors/TimeoutError";


const TIMEOUT = 120000;
export default class PopupChromeExtensionLoader extends BasicLoader {
    execute() {
        return new Promise((resolve, reject) => {
            this.popupWindow = window.open(this.url, "Single sing on");

            ChromeBus.subscribe(POPUP_SUCCESS_ACTION, (payload) => {
                if(payload) {
                    const {url} = payload;

                    resolve(url);
                    this.cleanup();
                }
            });

            this.setTimeout(TIMEOUT, reject);
        });
    }

    cleanup() {
        this.popupWindow.close();
        clearTimeout(this.timeout);
    }

    setTimeout(timeout, reject) {
        this.timeout = setTimeout(() => {
            reject(new TimeoutError(this.url, timeout));
            this.cleanup();
        }, timeout);
    }

}
