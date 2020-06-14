export default class UnknownError extends Error {
    constructor(message) {
        super(`Unknown error: ${message}`);
    }
}
