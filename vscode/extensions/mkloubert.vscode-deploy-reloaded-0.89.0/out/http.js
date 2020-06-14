"use strict";
/**
 * This file is part of the vscode-deploy-reloaded distribution.
 * Copyright (c) Marcel Joachim Kloubert.
 *
 * vscode-deploy-reloaded is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * vscode-deploy-reloaded is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_contracts = require("./contracts");
const deploy_helpers = require("./helpers");
const HTTP = require("http");
const HTTPs = require("https");
const i18 = require("./i18");
const MergeDeep = require('merge-deep');
const URL = require("url");
/**
 * Reads the content of a HTTP request body.
 *
 * @param {HTTP.IncomingMessage} msg The HTTP message with the body.
 *
 * @returns {Promise<Buffer>} The promise with the content.
 */
async function readBody(msg) {
    return await deploy_helpers.readAll(msg);
}
exports.readBody = readBody;
/**
 * Starts a HTTP request.
 *
 * @param {string|URL.Url} url The URL.
 * @param {RequestOptions} opts Additional options for the request.
 *
 * @return {Promise<HTTP.IncomingMessage>} The promise with the response.
 */
async function request(url, opts) {
    return await requestInner(url, deploy_helpers.cloneObject(opts) || {}, 0);
}
exports.request = request;
function requestInner(url, opts, redirections) {
    let maxRedirections = parseInt(deploy_helpers.toStringSafe(opts.maximumRedirections).trim());
    if (isNaN(maxRedirections)) {
        maxRedirections = 4;
    }
    maxRedirections = Math.max(0, maxRedirections);
    return new Promise(async (resolve, reject) => {
        const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
        if (redirections > maxRedirections) {
            COMPLETED(new Error(i18.t('http.errors.maxRedirections', redirections)));
            return;
        }
        try {
            // keep sure to have an URL.Url object
            if (!deploy_helpers.isObject(url)) {
                url = deploy_helpers.toStringSafe(url);
                if (deploy_helpers.isEmptyString(url)) {
                    url = `http://${deploy_contracts.DEFAULT_HOST}/`;
                }
                url = URL.parse(url);
            }
            const PROTOCOL = deploy_helpers.normalizeString(url.protocol);
            const DEFAULT_OPTS = {
                headers: {},
                hostname: url.hostname,
                method: 'GET',
                path: url.path,
                protocol: PROTOCOL,
            };
            if (!deploy_helpers.isEmptyString(url.auth)) {
                const AUTH = new Buffer(url.auth, 'ascii');
                DEFAULT_OPTS.headers['Authorization'] = `Basic ${AUTH.toString('base64')}`;
            }
            let factory;
            let port = parseInt(deploy_helpers.toStringSafe(url.port).trim());
            if (PROTOCOL === 'https:') {
                factory = HTTPs.request;
                if (isNaN(port)) {
                    port = 443;
                }
            }
            else if (PROTOCOL === 'http:') {
                factory = HTTP.request;
                if (isNaN(port)) {
                    port = 80;
                }
            }
            DEFAULT_OPTS.port = port;
            if (deploy_helpers.isEmptyString(DEFAULT_OPTS.hostname)) {
                DEFAULT_OPTS.hostname = deploy_contracts.DEFAULT_HOST;
            }
            const FINAL_REQUEST_OPTS = MergeDeep(DEFAULT_OPTS, opts);
            if (factory) {
                const REQUEST = factory(FINAL_REQUEST_OPTS, (resp) => {
                    try {
                        switch (resp.statusCode) {
                            case 300:
                            case 301:
                            case 302:
                            case 303:
                            case 305:
                            case 307:
                            case 308:
                                // redirect?
                                if (deploy_helpers.toBooleanSafe(FINAL_REQUEST_OPTS.noRedirect)) {
                                    COMPLETED(null, resp); // no
                                }
                                else {
                                    let newLocation;
                                    if (resp.headers) {
                                        if (!deploy_helpers.isEmptyString(resp.headers['location'])) {
                                            newLocation = deploy_helpers.toStringSafe(resp.headers['location']);
                                        }
                                    }
                                    if (deploy_helpers.isEmptyString(newLocation)) {
                                        COMPLETED(new Error(i18.t('http.errors.noRedirectLocation')));
                                    }
                                    else {
                                        let nextOpts;
                                        if (303 === resp.statusCode) {
                                            // force GET
                                            nextOpts = {
                                                method: 'GET',
                                            };
                                        }
                                        requestInner(URL.parse(newLocation), MergeDeep(FINAL_REQUEST_OPTS, nextOpts || {}), redirections + 1).then((resp2) => {
                                            COMPLETED(null, resp2);
                                        }).catch((err) => {
                                            COMPLETED(err);
                                        });
                                    }
                                }
                                break;
                            default:
                                {
                                    let errorKey = false;
                                    if (deploy_helpers.toBooleanSafe(FINAL_REQUEST_OPTS.raiseOnClientError)) {
                                        if (resp.statusCode >= 400 && resp.statusCode < 500) {
                                            errorKey = 'http.errors.client';
                                        }
                                    }
                                    if (deploy_helpers.toBooleanSafe(FINAL_REQUEST_OPTS.raiseOnServerError)) {
                                        if (resp.statusCode >= 500 && resp.statusCode < 600) {
                                            errorKey = 'http.errors.server';
                                        }
                                    }
                                    if (deploy_helpers.toBooleanSafe(FINAL_REQUEST_OPTS.raiseOnUnsupportedResponse, true)) {
                                        if (resp.statusCode < 200 || resp.statusCode >= 600) {
                                            errorKey = 'http.errors.unknown';
                                        }
                                    }
                                    let error;
                                    if (false !== errorKey) {
                                        error = new Error(i18.t(errorKey, resp.statusCode, resp.statusMessage));
                                    }
                                    COMPLETED(error, resp);
                                }
                                break;
                        }
                    }
                    catch (e) {
                        COMPLETED(e);
                    }
                });
                REQUEST.once('error', (err) => {
                    if (err) {
                        COMPLETED(err);
                    }
                });
                let setupAction;
                let requestSetup = opts.setup;
                if (!deploy_helpers.isNullOrUndefined(requestSetup)) {
                    if (deploy_helpers.isFunc(requestSetup)) {
                        // setup request object
                        setupAction = async () => {
                            await Promise.resolve(requestSetup(REQUEST, FINAL_REQUEST_OPTS));
                        };
                    }
                    else {
                        // write data for response
                        setupAction = async () => {
                            REQUEST.write(await deploy_helpers.asBuffer(requestSetup));
                        };
                    }
                }
                if (setupAction) {
                    await setupAction();
                }
                REQUEST.end();
            }
            else {
                COMPLETED(new Error(i18.t('http.errors.protocolNotSupported', PROTOCOL)));
            }
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
//# sourceMappingURL=http.js.map