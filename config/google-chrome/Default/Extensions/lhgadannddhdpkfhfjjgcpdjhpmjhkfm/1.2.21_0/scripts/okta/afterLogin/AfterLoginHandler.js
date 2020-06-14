import UserInfo from "../common/UserInfo";
import AmazonLoginThroughOkta from "./amazonLogin/AmazonLoginThroughOkta";
import MonosnapSettingsMapper from "./monosnap/MonosnapSettingsMapper";

export default class AfterLoginHandler {
    constructor({tokenContainer, oktaHelper, appData, transmitter}) {
        this.tokenContainer = tokenContainer;
        this.oktaHelper = oktaHelper;
        this.appData = appData;
        this.transmitter = transmitter;
    }

    execute() {
        const rawAccessToken = this.tokenContainer.getToken("access_token").raw;
        const baseUrl = this.oktaHelper.getOktaUrlFrom();
        const amazon_s3_id = this.oktaHelper.getAmazonS3IDFrom();

        const userInfo = new UserInfo(baseUrl, rawAccessToken);

        const amazonLoginThroughOkta = new AmazonLoginThroughOkta({
            userInfo,
            amazon_s3_id,
            transmitter: this.transmitter
        });

        const monosnapSettingsMapper = new MonosnapSettingsMapper({
            appData: this.appData,
            userInfo
        });

        const promises = [];

        promises.push(amazonLoginThroughOkta.authInAmazon());
        promises.push(monosnapSettingsMapper.setMonosnapSettings());

        return Promise.all(promises);
    }
}
