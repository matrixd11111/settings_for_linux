import {BasicLoader} from "jso";
import TimeoutError from "../errors/TimeoutError";
import UnknownError from "../errors/UnknownError";

const TIMEOUT = 60000;

export default class IframeLoader extends BasicLoader {
    execute() {
        return new Promise((resolve, reject) => {
            const iframe = this.createIframe(resolve, reject);
            this.addIframeToBody(iframe);

            this.setTimeout(reject, TIMEOUT);
        });
    }

    createIframe(resolve, reject) {
        this.iframe = document.createElement("iframe");

        this.iframe.src = this.url;
        this.iframe.id = `iframe Loader ${Math.random()}`;

        this.iframe.sandbox.add("allow-scripts", "allow-forms", "allow-same-origin");
        this.iframe.style.display = "none";

        this.iframe.onload = () => {
            try {
                const locationHref = this.iframe.contentWindow.location.href;

                resolve(locationHref);
                this.cleanUp();
            } catch (e) {
                this.throwError(reject, new UnknownError(`Failed to make request`));
            }
        };
        return this.iframe;
    }

    addIframeToBody(iframe) {
        document.body.appendChild(iframe);
    }

    setTimeout(reject, timeout) {
        this.timeout = setTimeout(() => {
            this.throwError(reject, new TimeoutError(this.url, timeout));
        }, timeout);
    }

    throwError(reject, error) {
        reject(error);
        this.cleanUp();
    }

    cleanUp() {
        if(this.iframe) {
            this.iframe.parentNode.removeChild(this.iframe);
        }
        clearTimeout(this.timeout);
    }
}
