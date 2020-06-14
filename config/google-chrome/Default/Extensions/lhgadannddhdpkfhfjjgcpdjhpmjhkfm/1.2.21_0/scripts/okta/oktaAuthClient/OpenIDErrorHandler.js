import AccessDeniedError from "../loader/errors/AccessDeniedError";
import generateLogger from "../../commons/tools/generateLogger";

const logtag = "[OpenIDErrorHandler] ";

const classLogger = generateLogger(logtag);

export default class OpenIDErrorHandler {
    constructor(error, transmitter) {
        this.error = error;

        this.transmitter = transmitter;
    }

    process() {
        classLogger.info("Catch error", this.error);
        // TODO uncomment if guess a way to check access denied error
        // if(this.error instanceof AccessDeniedError) {
            this.transmitter.local.broadcast("account_logout_all");
        // }
    }
}
