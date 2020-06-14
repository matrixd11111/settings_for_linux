import Serializable from "../../commons/Serializable/Serializable";

export default class TokenContainer extends Serializable {
    constructor() {
        super();

        this.arrayOfTokens = [];
    }

    serialize() {
        return this.arrayOfTokens;
    }

    deserialize(arrayOfTokens) {
        if (!Array.isArray(arrayOfTokens)) {
            throw new Error("Not an array");
        }

        this.arrayOfTokens = arrayOfTokens
    }

    addToken(name, token) {
        this.arrayOfTokens.push({
            name, token
        });
    }

    getToken(name) {
        const tokenEntry = this.arrayOfTokens.find((tokenEntry) => tokenEntry.name === name);
        if (tokenEntry) {
            return tokenEntry.token;
        }
        return null;
    }

    getTokenCount() {
        return this.arrayOfTokens.length;
    }

    setExpiresIn(expires_in) {
        this.expires_in = expires_in;
    }

    getExpiresIn() {
        return this.expires_in;
    }

    setReceived(received) {
        this.received = received;
    }

    getReceived() {
        return this.received;
    }

    setExpires(expires) {
        this.expires = expires;
    }

    getExpires() {
        return this.expires;
    }
}
