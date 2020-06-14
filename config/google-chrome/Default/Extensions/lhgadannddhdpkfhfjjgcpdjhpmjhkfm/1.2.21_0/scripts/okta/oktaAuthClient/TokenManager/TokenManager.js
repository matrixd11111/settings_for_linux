import generateLogger from "../../../commons/tools/generateLogger";
import CustomInterval from "../../../commons/CustomInterval/CustomInterval";
import AppDataWrapper from "../../../commons/AppData/AppDataWrapper";
import {REFRESH_INTERVAL_CONFIG_NAME} from "./constants";

const INTERVAL_TIME = 600000;

const logtag = "[TokenManager] ";
const tokenManagerLogger = generateLogger(logtag);

export default class TokenManager {
    constructor() {
        this.tokensClientsToUpdate = [];
        this.appDataWrapper = new AppDataWrapper();

        this.customInterval = new CustomInterval({
            callback: this.tick.bind(this),
            interval: this.getRefreshInterval()
        });
    }

    static getInstance() {
        if (!window.tokenManager) {
            window.tokenManager = new TokenManager();
        }

        return window.tokenManager;
    }

    addTokenClient(tokenClientName, tokenClient, successRefreshHandler, errorHandler) {
        tokenManagerLogger.debug("Add token", tokenClientName, tokenClient);
        this.tokensClientsToUpdate.push({tokenClient, tokenClientName, successRefreshHandler, errorHandler});

        this.restartRefreshingByInterval();
    }

    removeTokenClient(tokenClientNameToRemove) {
        tokenManagerLogger.debug(`Try to delete token client with name: ${tokenClientNameToRemove}`);
        const lengthBeforeRemoving = this.tokensClientsToUpdate.length;

        this.tokensClientsToUpdate = this.tokensClientsToUpdate.filter(({tokenClientName}) => tokenClientName !== tokenClientNameToRemove);

        const lengthAfterRemoving = this.tokensClientsToUpdate.length;

        const differenceOfLength = lengthBeforeRemoving - lengthAfterRemoving;
        const deleteStatus = ((lengthBeforeRemoving - lengthAfterRemoving) === 1);

        if (deleteStatus) {
            this.restartRefreshingByInterval();
        }
        tokenManagerLogger.debug(`Delete token ${tokenClientNameToRemove} with result: ${deleteStatus} and differenceOfLength: ${differenceOfLength}`);

        return deleteStatus;
    }

    tick() {
        const promises = this.tokensClientsToUpdate.map(({tokenClient, errorHandler, successRefreshHandler}) => {
            return this.refreshTokenWith({tokenClient, errorHandler, successRefreshHandler});
        });

        return Promise.all(promises).then(() => {

            const newRefreshInterval = this.getRefreshInterval();
            tokenManagerLogger.debug(`Start another tick with interval: ${newRefreshInterval}`);
            this.customInterval.setInterval(newRefreshInterval);
        });
    }

    getRefreshInterval() {
        const intervalFromSettings = this.appDataWrapper.getFromBuffer(REFRESH_INTERVAL_CONFIG_NAME);

        if (intervalFromSettings) {
            return intervalFromSettings * 1000;
        }

        return INTERVAL_TIME;
    }

    restartRefreshingByInterval() {
        tokenManagerLogger.debug("Restart refreshing by interval");
        this.stopRefreshByInterval();
        this.startRefreshByInterval();
    }

    startRefreshByInterval() {
        tokenManagerLogger.info(`Start refresh tokens by interval with interval: ${this.getRefreshInterval()}`);
        this.customInterval.startTick();
    }

    refreshTokenWith({tokenClient, errorHandler, successRefreshHandler}) {
        if (tokenClient.checkTokensInStore()) {
            return tokenClient.refreshToken().then((token) => {
                tokenManagerLogger.debug("Successfully getFromBuffer new token", token);
                if (typeof successRefreshHandler === "function") {
                    return successRefreshHandler(token);
                }
                return undefined;
            }).catch((error) => {
                if (typeof errorHandler === "function") {
                    errorHandler(error);
                }
            });
        }

        return Promise.resolve();
    }

    stopRefreshByInterval() {
        this.customInterval.stopTick();
    }
}
