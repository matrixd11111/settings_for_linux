import $ from "jquery";

export default class UserInfo {
    constructor(baseUrl, rawAccessToken) {
        this.baseUrl = baseUrl;
        this.rawAccessToken = rawAccessToken;
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            if(this.userInfo) {
                resolve(this.userInfo);
            }
            $.ajax({
                url: this.baseUrl + "oauth2/v1/userinfo",
                headers: {
                    Authorization: 'Bearer ' + this.rawAccessToken
                },
                success: (res) => {
                    this.userInfo = res;
                    resolve(res);
                },
                error: (err) => {
                    reject(err);
                }
            })
        });
    }
}
