export default class UnknownOpenIDError extends Error {
    constructor(errorCode, errorDescription) {
        super(`Unknown OpenID error. Error code: { ${errorCode} } Description: ${errorDescription}`);

        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
    }
}
