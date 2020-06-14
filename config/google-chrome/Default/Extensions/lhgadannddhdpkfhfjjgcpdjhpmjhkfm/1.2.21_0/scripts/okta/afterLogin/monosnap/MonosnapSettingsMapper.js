import {REFRESH_INTERVAL_CONFIG_NAME} from "../../oktaAuthClient/TokenManager/constants";

export default class MonosnapSettingsMapper {
    constructor({appData, userInfo}) {
        this.appData = appData;
        this.userInfo = userInfo;
    }

    setMonosnapSettings() {
        return this.userInfo.getUserInfo().then((userInfo) => this.processUserInfo(userInfo));
    }

    processUserInfo(userInfo) {
        if(userInfo) {
            const file_name_template = userInfo.monosnap_filename_template_var;
            const refreshTokenInterval = userInfo.monosnap_okta_token_refresh_time;

            const uploadingServiceFromService = userInfo.default_uploading_service;
            const uploadingServiceInternal = this.mapDefaultUploadingService(uploadingServiceFromService);
            return this.appData.set({
                file_name_template,
                [REFRESH_INTERVAL_CONFIG_NAME]: refreshTokenInterval,
                default_upload_service: uploadingServiceInternal
            });
        }
        return Promise.reject(new Error("[MonosnapSettingsMapper] UserInfo is empty"));
    }

    mapDefaultUploadingService(uploadingServiceFromServer) {
        switch (uploadingServiceFromServer) {
            case "aws_s3":
                return "amazon_s3";
            default:
                return uploadingServiceFromServer;
        }
    }
}
