export default class MapMonosnapOktaConfigToOAuthConfig {
    constructor(baseConfig) {
        this.baseConfig = baseConfig;
    }

    getAuthClientConfig() {
        const result = {};
        const {okta_url, app_id} = this.baseConfig;

        result.authorization = this.getAuthUrl(okta_url);
        result.client_id = app_id;
        result.redirect_uri = this.formRedirectUrl();
        result.scopes = {
            request: ['openid', 'email', 'profile', 'address', 'phone']
        };

        return result;
    }

    getAuthUrl(baseUrl) {
        return `${baseUrl}oauth2/v1/authorize`
    }

    formRedirectUrl() {
        return `chrome-extension://${chrome.runtime.id}/okta.html`;
    }
}
