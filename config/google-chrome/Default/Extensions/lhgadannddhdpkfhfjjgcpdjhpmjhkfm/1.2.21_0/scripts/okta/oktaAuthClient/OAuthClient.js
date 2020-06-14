import {JSO, OAuthResponseError} from 'jso'
import PopupChromeExtensionLoader from "../loader/PopupChromeExtensionLoader/PopupChromeExtensionLoader";
import IframeLoader from "../loader/IframeLoader/IframeLoader";
import generateLogger from "../../commons/tools/generateLogger";
import TokenContainer from "./TokenContainer";
import TimeoutError from "../loader/errors/TimeoutError";
import UnknownError from "../loader/errors/UnknownError";
import UnknownOpenIDError from "../loader/errors/UnknownOpenIDError";
import AccessDeniedError from "../loader/errors/AccessDeniedError";
import LoginRequiredError from "../loader/errors/LoginRequiredError";

const oktaLogtag = "[OAuthClient] ";

const oktaLog = generateLogger(oktaLogtag);

export default class OAuthClient {
    static decodeJWT(raw) {
        const decodeUriRaw = decodeURI(raw);

        return decodeUriRaw
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .split(".")
            .map((item, index) => {
                let result = null;
                const decodedString = atob(item);
                try {
                    result = JSON.parse(decodedString);
                } catch (e) {
                    if (index !== 2) {
                        console.error(`Can't JSON parse string: ${decodedString}`);
                    }
                }
                return result;
            }).reduce((token, item, index) => {
                if (index === 0) {
                    token.header = item;
                }
                if (index === 1) {
                    token.payload = item;
                }
                if (!token.raw) {
                    token.raw = raw;
                }

                return token;
            }, {});
    }

    init(config, managerErrorHandler) {
        oktaLog.info("Start Init");
        const baseConfig = {};
        const mergedConfig = Object.assign({}, baseConfig, config);

        this.nativeOAuthClient = new JSO(mergedConfig);
        this.nativeOAuthClient.setLoader(PopupChromeExtensionLoader);

        if (managerErrorHandler && typeof managerErrorHandler === "function") {
            // this.addManagerEventHandler("error", managerErrorHandler);
        }
        oktaLog.info("Init success");
    }

    initIfNeed(config, managerErrorHandler) {
        if (!this.nativeOAuthClient) {
            this.init(config, managerErrorHandler);
        }
    }

    getTokenWithPopup() {
        this.nativeOAuthClient.setLoader(PopupChromeExtensionLoader);
        return this.getToken();
    }

    getTokenWithoutPrompt() {
        this.nativeOAuthClient.setLoader(IframeLoader);
        return this.getToken({
            request: {
                prompt: "none"
            }
        });
    }

    getToken(opts) {
        return this.checkNativeClient(() =>
            this.nativeOAuthClient.getToken(opts)
                .then(this.processRawTokens)
                .catch(this.processError)
        );
    }

    processRawTokens(tokens) {
        const tokenContainer = new TokenContainer();

        if (tokens) {
            const {id_token, access_token, expires_in, received, expires} = tokens;

            tokenContainer.setExpiresIn(expires_in);
            tokenContainer.setReceived(received);
            tokenContainer.setExpires(expires);

            if (id_token) {
                tokenContainer.addToken("id_token", OAuthClient.decodeJWT(id_token));
            }
            if (access_token) {
                tokenContainer.addToken("access_token", OAuthClient.decodeJWT(access_token));
            }
            oktaLog.info("Success in loading tokens!");
        }
        return tokenContainer;
    }

    processError(error) {
        if(typeof error === "object") {
            if (error instanceof TimeoutError) {
                throw error;
            }
            if (error instanceof OAuthResponseError) {
                const errorCode = error.error;
                const errorDescription = error.error_description;
                switch (errorCode) {
                    case "access_denied":
                        throw new AccessDeniedError();
                    case "login_required":
                        throw new LoginRequiredError();
                    default:
                        throw new UnknownOpenIDError(errorCode, errorDescription);
                }
            }
        }

        if(error) {
            throw new UnknownError(`Error message: ${error.message}`);
        }
        throw new UnknownError("Empty error object");
    }

    checkNativeClient(callback) {
        if (this.nativeOAuthClient) {
            return callback();
        } else {
            throw new Error("Native client is not instantiated");
        }
    }

    getTokenWithPopupWithWipeTokens() {
        this.wipeTokens();

        return this.getTokenWithPopup();
    }

    refreshToken() {
        return this.checkNativeClient(() => {
            this.wipeTokens();

            return this.getTokenWithoutPrompt()
                .catch((error) => {
                    // fallback to popup method if error
                    if (error instanceof TimeoutError) {
                        console.warn("Failed silently get tokens, try with popup. Error: ", error);
                        return this.getTokenWithPopup();
                    }

                    throw error;
                });
        });
    }

    wipeTokens() {
        this.nativeOAuthClient.wipeTokens();
    }

    checkTokensInStore() {
        const tokenContainer = this.getTokenFromStore();
        return tokenContainer.getTokenCount() !== 0;
    }

    getTokenFromStore() {
        return this.checkNativeClient(() => {
            const providerID = this.nativeOAuthClient.getProviderID();

            const rawTokens = this.nativeOAuthClient.store.getTokens(providerID)[0];
            return this.processRawTokens(rawTokens);

        });
    }
}
