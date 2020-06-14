export default class TimeoutError extends Error {
    constructor(url, timeout) {
        super(`Failed to load url: { ${url} } in ${timeout}`);
    }
}
