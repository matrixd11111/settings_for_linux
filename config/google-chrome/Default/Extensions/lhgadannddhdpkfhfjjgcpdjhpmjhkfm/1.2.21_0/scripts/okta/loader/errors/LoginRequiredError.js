export default class LoginRequiredError extends Error {
    constructor() {
        super("Login required");
    }
}
