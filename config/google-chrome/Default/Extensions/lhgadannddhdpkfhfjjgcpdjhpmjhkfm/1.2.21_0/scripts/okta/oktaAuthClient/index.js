import OAuthClient from "./OAuthClient";
import TokenManager from "./TokenManager/TokenManager";
import OpenIDErrorHandler from "./OpenIDErrorHandler";
import OktaHelper from "./helpers/OktaHelper";
import AfterLoginHandler from "../afterLogin/AfterLoginHandler";


const OKTA_CLIENT_NAME = "OKTA_CLIENT";

const addToTokenManager = ({oAuthClient, transmitter, oktaHelper, appData}) => {
    const tokenManager = TokenManager.getInstance();
    if (oAuthClient) {
        tokenManager.addTokenClient(OKTA_CLIENT_NAME, oAuthClient, (tokenContainer) => {
            const afterLoginHandler = new AfterLoginHandler({
                tokenContainer,
                oktaHelper,
                appData,
                transmitter
            });
            return afterLoginHandler.execute();
        },(error) => {
            const openIDErrorHandler = new OpenIDErrorHandler(error, transmitter);

            openIDErrorHandler.process();
        });
    }

    return tokenManager;
};

window.subscribeOktaActions = (transmitter, accounts, appData) => {
    transmitter.subscribe({
        "oktaRequestToken": (req, responseCallback) => {
            const oktaHelper = new OktaHelper({accounts});
            const oAuthClient = oktaHelper.createOautClient();
            if (oAuthClient) {
                oAuthClient.getTokenWithPopupWithWipeTokens().then((tokenContainer) => {
                    addToTokenManager({oAuthClient, transmitter, oktaHelper, appData});
                    MSNotificationsManager.show({
                        title: chrome.i18n.getMessage("okta_token__title"),
                        message: chrome.i18n.getMessage("okta_login_successfully__message")
                    });


                    const afterLoginHandler = new AfterLoginHandler({
                        tokenContainer,
                        oktaHelper,
                        appData,
                        transmitter
                    });
                    afterLoginHandler.execute().then(() => {
                        if (responseCallback) {
                            responseCallback();
                        }
                    });
                }).catch((error) => {
                    MSNotificationsManager.show({
                        title: chrome.i18n.getMessage("okta_token__title"),
                        message: chrome.i18n.getMessage("okta_login_failed__message")
                    });
                    console.error(error);

                    const openIDErrorHandler = new OpenIDErrorHandler(error);

                    openIDErrorHandler.process();
                });
            }
        },
        "oktaGetTokenFromStore": (request, responseCallback) => {
            const oktaHelper = new OktaHelper({accounts});
            const oktaAuthClientIns = oktaHelper.createOautClient();
            if (oktaAuthClientIns) {
                const tokenContainer = oktaAuthClientIns.getTokenFromStore();
                if (responseCallback) {
                    responseCallback(tokenContainer.serialize());
                }
            }
        }
    });
};

window.startToRefreshTokens = (transmitter, accounts, appData) => {
    const oktaHelper = new OktaHelper({accounts});
    const oAuthClient = oktaHelper.createOautClient();

    const tokenManager = addToTokenManager({oAuthClient, transmitter, oktaHelper, appData});

    tokenManager.tick().then(() => {
        tokenManager.restartRefreshingByInterval();
    });
};

window.stopToRefreshTokens = (accounts) => {
    const oktaHelper = new OktaHelper({accounts});
    const tokenManager = TokenManager.getInstance();

    tokenManager.removeTokenClient(OKTA_CLIENT_NAME);

    const oAuthClient = oktaHelper.createOautClient();
    oAuthClient.wipeTokens();
};


window.OktaAuthClient = OAuthClient;
