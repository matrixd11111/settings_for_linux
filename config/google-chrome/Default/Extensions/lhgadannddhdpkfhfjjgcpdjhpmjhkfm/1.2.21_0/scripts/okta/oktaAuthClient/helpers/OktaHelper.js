import MapMonosnapOktaConfigToOAuthConfig from "./MapMonosnapOktaConfigToOAuthConfig";
import OAuthClient from "../OAuthClient";

export default class OktaHelper {
    constructor({accounts}) {
        this.accounts = accounts;
    }

    getOktaUrlFrom() {
        const okta = this.getOktaFrom();
        if (okta) {
            return okta.okta_url;
        }

        return null;
    }

    getOktaParamsMapper() {
        const okta = this.getOktaFrom();
        if (okta) {
            return new MapMonosnapOktaConfigToOAuthConfig(okta);
        }

        return null;
    }

    getOktaFrom() {
        const {monosnap} = this.accounts.list;
        if (monosnap) {
            const {okta} = monosnap;
            if (okta && okta.okta_url && okta.app_id) {
                return okta;
            }
        }

        return null;
    }

    getAmazonS3IDFrom() {
        return this.accounts.list.amazon_s3.id;
    }

    createOautClient() {
        const mapper = this.getOktaParamsMapper();
        if (mapper) {
            const oktaAuthClientIns = new OAuthClient();
            const conf = mapper.getAuthClientConfig();
            oktaAuthClientIns.initIfNeed(conf, console.log);

            return oktaAuthClientIns;
        }

        return null;
    }
}

const createOautClient = (accounts) => {
    const mapper = getOktaParamsMapper(accounts);
    if (mapper) {
        const oktaAuthClientIns = new OAuthClient();
        const conf = mapper.getAuthClientConfig();
        oktaAuthClientIns.initIfNeed(conf, console.log);

        return oktaAuthClientIns;
    }

    return null;
};
