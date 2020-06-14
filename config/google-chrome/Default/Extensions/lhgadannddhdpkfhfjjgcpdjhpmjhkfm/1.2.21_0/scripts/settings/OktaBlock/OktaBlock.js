import $ from "jquery";
import TokenContainer from "../../okta/oktaAuthClient/TokenContainer";

export default class OktaBlock {
    constructor(transmitter) {
        this.transmitter = transmitter;
    }

    init() {
        this.oktaBlock = $('#okta_block');

        this.oktaUserNameLabel = this.oktaBlock.find("#okta_user_name_label");
        this.oktaUserName = this.oktaUserNameLabel.find("#okta_user_name");
        this.oktaUserNameLabel.hide();

        this.oktaLoginButton = this.oktaBlock.find(".btn-def.ok");

        this.assignHandlers();

        this.renderUserNameLabel();
    }

    assignHandlers() {
        this.oktaLoginButton.on("click", (e) => {
            this.transmitter.broadcast("oktaRequestToken").then(() => {
                this.renderUserNameLabel();

                this.transmitter.local.broadcast("move_to_amazon_setting_page");
            });
        });
    }

    renderUserNameLabel() {
        this.transmitter.broadcast("oktaGetTokenFromStore").then((serializedTokenContainer) => {
            if (serializedTokenContainer) {
                const tokenContainer = new TokenContainer();
                tokenContainer.deserialize(serializedTokenContainer);

                const token = tokenContainer.getToken("id_token");
                if(token) {
                    const email = token.payload.email;

                    this.oktaUserName.html(email);
                    this.oktaUserNameLabel.show();
                } else {
                    this.oktaUserNameLabel.hide();
                }
            }
        });
    }

    hide() {
        this.oktaBlock.hide();
    }

    show() {
        this.oktaBlock.show();

        this.renderUserNameLabel();
    }
}
