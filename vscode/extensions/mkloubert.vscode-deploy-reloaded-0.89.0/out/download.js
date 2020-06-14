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
const deploy_clients_dropbox = require("./clients/dropbox");
const deploy_clients_ftp = require("./clients/ftp");
const deploy_clients_sftp = require("./clients/sftp");
const deploy_clients_slack = require("./clients/slack");
const deploy_helpers = require("./helpers");
const deploy_http = require("./http");
const i18 = require("./i18");
const Path = require("path");
const URL = require("url");
/**
 * List of download source types.
 */
var DownloadSourceType;
(function (DownloadSourceType) {
    /**
     * Local file.
     */
    DownloadSourceType[DownloadSourceType["Local"] = 0] = "Local";
    /**
     * DropBox
     */
    DownloadSourceType[DownloadSourceType["DropBox"] = 1] = "DropBox";
    /**
     * FTP
     */
    DownloadSourceType[DownloadSourceType["FTP"] = 2] = "FTP";
    /**
     * HTTP
     */
    DownloadSourceType[DownloadSourceType["HTTP"] = 3] = "HTTP";
    /**
     * SFTP
     */
    DownloadSourceType[DownloadSourceType["SFTP"] = 4] = "SFTP";
    /**
     * Slack channel
     */
    DownloadSourceType[DownloadSourceType["Slack"] = 5] = "Slack";
})(DownloadSourceType = exports.DownloadSourceType || (exports.DownloadSourceType = {}));
function createDownloadConfig(url, mappings) {
    if (!mappings) {
        mappings = {};
    }
    const CONFIG = {};
    const PARAMS = deploy_helpers.uriParamsToObject(url);
    for (const P in PARAMS) {
        for (let prop in mappings) {
            if (P !== deploy_helpers.normalizeString(prop)) {
                continue;
            }
            let val = PARAMS[P];
            const TARGET_TYPE = mappings[prop];
            if (!deploy_helpers.isNullOrUndefined(TARGET_TYPE)) {
                switch (TARGET_TYPE) {
                    case 'bool':
                        if (deploy_helpers.isEmptyString(val)) {
                            val = undefined;
                        }
                        else {
                            switch (deploy_helpers.normalizeString(val)) {
                                case '1':
                                case 'true':
                                case 'y':
                                case 'yes':
                                    val = true;
                                    break;
                                default:
                                    val = false;
                                    break;
                            }
                        }
                        break;
                    case 'int':
                        if (deploy_helpers.isEmptyString(val)) {
                            val = undefined;
                        }
                        else {
                            val = parseInt(val.trim());
                        }
                        break;
                    case 'string_array':
                        if (deploy_helpers.isEmptyString(val)) {
                            val = undefined;
                        }
                        else {
                            val = val.split(',');
                        }
                        break;
                }
            }
            CONFIG[prop] = val;
        }
    }
    return CONFIG;
}
/**
 * Downloads something from a source.
 *
 * @param {string|URL.Url} url The URL.
 * @param {string|string[]} [scopes] One or more custom scope directories.
 * @param {DownloadOutValue} [outVal] Additional result data.
 *
 * @return {Promise<Buffer>} The promise with the downloaded data.
 */
async function download(url, scopes, outVal) {
    if (!outVal) {
        outVal = {};
    }
    if (!deploy_helpers.isObject(url)) {
        let urlString = deploy_helpers.toStringSafe(url);
        if (deploy_helpers.isEmptyString(urlString)) {
            urlString = 'http://localhost';
        }
        url = URL.parse(urlString);
    }
    outVal.url = url;
    outVal.fullPath = url.href;
    scopes = deploy_helpers.asArray(scopes).map(s => {
        return deploy_helpers.toStringSafe(s);
    }).filter(s => {
        return !deploy_helpers.isEmptyString(s);
    }).map(s => {
        if (!Path.isAbsolute(s)) {
            s = Path.join(process.cwd(), s);
        }
        return Path.resolve(s);
    });
    if (scopes.length < 1) {
        scopes.push(process.cwd());
    }
    let downloader;
    const PROTOCOL = deploy_helpers.normalizeString(url.protocol);
    switch (PROTOCOL) {
        case 'dropbox:':
            downloader = download_dropbox;
            outVal.source = DownloadSourceType.DropBox;
            break;
        case 'ftp:':
            downloader = download_ftp;
            outVal.source = DownloadSourceType.FTP;
            break;
        case 'http:':
        case 'https:':
            downloader = download_http;
            outVal.source = DownloadSourceType.HTTP;
            break;
        case 'sftp:':
            downloader = download_sftp;
            outVal.source = DownloadSourceType.SFTP;
            break;
        case 'slack:':
            downloader = download_slack;
            outVal.source = DownloadSourceType.Slack;
            break;
        default:
            // handle as local file
            downloader = async () => {
                const LOCAL_URL = url;
                let file = LOCAL_URL.href;
                if (!Path.isAbsolute(file)) {
                    file = false;
                    for (const S of scopes) {
                        const PATH_TO_CHECK = Path.join(S, LOCAL_URL.href);
                        if (await deploy_helpers.exists(PATH_TO_CHECK)) {
                            if ((await deploy_helpers.lstat(PATH_TO_CHECK)).isFile()) {
                                file = PATH_TO_CHECK;
                                break;
                            }
                        }
                    }
                }
                if (false === file) {
                    throw new Error(`Local file '${LOCAL_URL.href}' not found!`);
                }
                file = Path.resolve(file);
                outVal.fullPath = file;
                return await deploy_helpers.readFile(file);
            };
            outVal.source = DownloadSourceType.Local;
            break;
    }
    return await Promise.resolve(downloader(url));
}
exports.download = download;
async function download_dropbox(url) {
    const CFG = createDownloadConfig(url, {
        accessToken: null,
    });
    const CLIENT = deploy_clients_dropbox.createClient(CFG);
    try {
        return await CLIENT.downloadFile(url.pathname);
    }
    finally {
        deploy_helpers.tryDispose(CLIENT);
    }
}
async function download_ftp(url) {
    const AUTH = getUserNameAndPassword(url);
    const SERVER = getHostAndPort(url);
    const CFG = createDownloadConfig(url, {
        engine: null,
    });
    CFG.host = SERVER.host;
    CFG.port = SERVER.port;
    CFG.password = AUTH.password;
    CFG.user = AUTH.user;
    const CLIENT = await deploy_clients_ftp.openConnection(CFG);
    try {
        return await CLIENT.downloadFile(url.pathname);
    }
    finally {
        deploy_helpers.tryDispose(CLIENT);
    }
}
async function download_http(url) {
    const RESPONSE = await deploy_http.request(url);
    if (RESPONSE.statusCode >= 200 && RESPONSE.statusCode < 299) {
        return await deploy_http.readBody(RESPONSE);
    }
    let errorKey = 'http.errors.unknown';
    if (RESPONSE.statusCode >= 400 && RESPONSE.statusCode < 499) {
        errorKey = 'http.errors.client';
    }
    else if (RESPONSE.statusCode >= 500 && RESPONSE.statusCode < 599) {
        errorKey = 'http.errors.server';
    }
    throw new Error(i18.t(errorKey, RESPONSE.statusCode, RESPONSE.statusMessage));
}
async function download_sftp(url) {
    const AUTH = getUserNameAndPassword(url);
    const SERVER = getHostAndPort(url);
    const CFG = createDownloadConfig(url, {
        agent: null,
        agentForward: 'bool',
        debug: 'bool',
        hashAlgorithm: null,
        hashes: 'string_array',
        privateKey: null,
        privateKeyPassphrase: null,
        readyTimeout: 'int',
        tryKeyboard: 'bool',
    });
    CFG.host = SERVER.host;
    CFG.port = SERVER.port;
    CFG.password = AUTH.password;
    CFG.user = AUTH.user;
    const CLIENT = await deploy_clients_sftp.openConnection(CFG);
    try {
        return await CLIENT.downloadFile(url.pathname);
    }
    finally {
        deploy_helpers.tryDispose(CLIENT);
    }
}
async function download_slack(url) {
    const CHANNEL = deploy_helpers.toStringSafe(url.hostname).toUpperCase().trim();
    const CFG = createDownloadConfig(url, {
        token: null,
    });
    const CLIENT = deploy_clients_slack.createClient(CFG);
    try {
        return await CLIENT.downloadFile(CHANNEL + url.pathname);
    }
    finally {
        deploy_helpers.tryDispose(CLIENT);
    }
}
function getHostAndPort(url) {
    let host = deploy_helpers.toStringSafe(url.hostname);
    let port = parseInt(deploy_helpers.toStringSafe(url.port).trim());
    if (deploy_helpers.isEmptyString(host)) {
        host = undefined;
    }
    if (isNaN(port)) {
        port = undefined;
    }
    return {
        host: host,
        port: port,
    };
}
function getUserNameAndPassword(url) {
    let user;
    let password;
    const AUTH = deploy_helpers.toStringSafe(url.auth);
    if (!deploy_helpers.isEmptyString(AUTH)) {
        const SEP = AUTH.indexOf(':');
        if (SEP > -1) {
            user = AUTH.substr(0, SEP);
            password = AUTH.substr(SEP + 1);
        }
        else {
            user = AUTH;
        }
    }
    if (deploy_helpers.isEmptyString(user)) {
        user = undefined;
    }
    password = deploy_helpers.toStringSafe(password);
    if ('' === password) {
        password = undefined;
    }
    return {
        password: password,
        user: user,
    };
}
//# sourceMappingURL=download.js.map