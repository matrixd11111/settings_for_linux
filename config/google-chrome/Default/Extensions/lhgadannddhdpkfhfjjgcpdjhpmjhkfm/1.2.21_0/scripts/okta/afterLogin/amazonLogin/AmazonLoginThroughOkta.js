import $ from "jquery";

import {s3all} from "./AmazonCreds";

export default class AmazonLoginThroughOkta {
    constructor(amazonLoginConfig) {
        if (!amazonLoginConfig) {
            throw new Error("Did not pass login config");
        }

        this.userInfo = amazonLoginConfig.userInfo;
        this.amazon_s3_id = amazonLoginConfig.amazon_s3_id;
        this.transmitter = amazonLoginConfig.transmitter;
    }

    authInAmazon() {
        return this.userInfo.getUserInfo().then((userInfo) => {
            return this.processUserInfo(userInfo);
        }).catch((e) => {
            console.error(e);
        });
    }

    processUserInfo(res) {
        let cred = {};

        if ("s3_access_key_id" in res) {
            cred.access_key_id = res['s3_access_key_id'];
        }
        if ("s3_secret_key" in res) {
            cred.secret_access_key = res['s3_secret_key'];
        }
        if ("s3_base_url" in res) {
            cred.base_url = res['s3_base_url'];
        }
        if ("s3_bucket" in res) {
            cred.bucket = res['s3_bucket'];
        }
        if ("s3_path" in res) {
            cred.path = res['s3_path'];
        } else {
            cred.path = '/';
        }
        if ("s3_region" in res) {
            cred.region = (res['s3_region'] === '') ? 'us-east-1' : res['s3_region'];
        }
        let regResult = false;
        for (let i = 0; i < s3all.length; i++) {
            if (s3all[i].name === cred.region) {
                regResult = true;
                break;
            }
        }
        if (!regResult) {
            cred.region = 'us-east-1';
        }
        cred.signature_version = "v4";
        cred.use_ssl = true;

        this.transmitter.local.broadcast(
            'account_settings_apply_okta',
            {
                account_id: this.amazon_s3_id,
                values: cred,
                override_defaults: true,
                callback: () => {
                    this.transmitter.broadcast("amazon_settings_applied");
                }
            }
        )
    }
}
