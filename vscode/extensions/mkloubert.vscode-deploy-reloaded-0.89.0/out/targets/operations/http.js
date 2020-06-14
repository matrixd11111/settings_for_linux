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
const deploy_helpers = require("../../helpers");
const deploy_http = require("../../http");
const i18 = require("../../i18");
const Url = require("url");
/** @inheritdoc */
async function execute(context) {
    const OPERATION = context.operation;
    const TARGET = context.target;
    const WORKSPACE = TARGET.__workspace;
    let u = deploy_helpers.toStringSafe(OPERATION.url);
    if (deploy_helpers.isEmptyString(u)) {
        u = 'http://localhost/';
    }
    const URL = Url.parse(u);
    const PROTOCOL = deploy_helpers.normalizeString(URL.protocol);
    switch (PROTOCOL) {
        case 'http:':
        case 'https:':
            break;
        default:
            throw new Error(i18.t('http.errors.protocolNotSupported', PROTOCOL));
    }
    const HEADERS = context.operation.headers || {};
    for (const P in HEADERS) {
        let name = deploy_helpers.normalizeString(P);
        let value = HEADERS[P];
        let usePlaceholders;
        if (deploy_helpers.isBool(OPERATION.noPlaceholdersForTheseHeaders)) {
            usePlaceholders = !OPERATION.noPlaceholdersForTheseHeaders;
        }
        else {
            usePlaceholders = deploy_helpers.asArray(OPERATION.noPlaceholdersForTheseHeaders)
                .map(n => deploy_helpers.normalizeString(n))
                .indexOf(name) < 0;
        }
        if (usePlaceholders) {
            value = WORKSPACE.replaceWithValues(value);
        }
        HEADERS[P] = value;
    }
    const USERNAME = deploy_helpers.toStringSafe(OPERATION.username);
    const PASSWORD = deploy_helpers.toStringSafe(OPERATION.password);
    if ('' !== USERNAME.trim() || '' !== PASSWORD) {
        // Basic Auth
        HEADERS['Authorization'] = 'Basic ' +
            (new Buffer(`${USERNAME}:${PASSWORD}`, 'ascii')).toString('base64');
    }
    let method = deploy_helpers.toStringSafe(OPERATION.method).toUpperCase().trim();
    if ('' === method) {
        method = 'GET';
    }
    let body;
    let getBodyToSend = () => {
        let strBody = deploy_helpers.toStringSafe(body);
        if (deploy_helpers.toBooleanSafe(OPERATION.isBodyBase64)) {
            if (!deploy_helpers.isEmptyString(strBody)) {
                return new Buffer(strBody.trim(), 'base64');
            }
        }
        else {
            return new Buffer(strBody, 'ascii');
        }
    };
    if (deploy_helpers.toBooleanSafe(OPERATION.isBodyScript)) {
        let bodyScript = deploy_helpers.toStringSafe(WORKSPACE.replaceWithValues(OPERATION.body));
        if (deploy_helpers.isEmptyString(bodyScript)) {
            bodyScript = './getBody.js';
        }
        let bodyScriptFullPath = await WORKSPACE.getExistingSettingPath(bodyScript);
        if (false === bodyScriptFullPath) {
            throw new Error(i18.t('targets.operations.http.bodyScriptNotFound', bodyScript));
        }
        const BODY_MODULE = deploy_helpers.loadModule(bodyScriptFullPath);
        if (BODY_MODULE) {
            const GET_BODY = BODY_MODULE.getBody;
            if (GET_BODY) {
                getBodyToSend = async () => {
                    const ARGS = {
                        _: require('lodash'),
                        context: context,
                        events: WORKSPACE.workspaceSessionState['target_operations']['http']['events'],
                        extension: WORKSPACE.context.extension,
                        folder: WORKSPACE.folder,
                        globalEvents: deploy_helpers.EVENTS,
                        globals: WORKSPACE.globals,
                        globalState: WORKSPACE.workspaceSessionState['target_operations']['http']['global'],
                        homeDir: deploy_helpers.getExtensionDirInHome(),
                        logger: WORKSPACE.createLogger(),
                        options: deploy_helpers.cloneObject(OPERATION.options),
                        output: WORKSPACE.output,
                        replaceWithValues: (val) => {
                            return WORKSPACE.replaceWithValues(val);
                        },
                        require: (id) => {
                            return deploy_helpers.requireFromExtension(id);
                        },
                        sessionState: deploy_helpers.SESSION,
                        settingFolder: WORKSPACE.settingFolder,
                        state: undefined,
                        url: URL,
                        workspaceRoot: WORKSPACE.rootPath,
                    };
                    // ARGS.state
                    Object.defineProperty(ARGS, 'state', {
                        enumerable: true,
                        get: () => {
                            return WORKSPACE.workspaceSessionState['target_operations']['http']['body_scripts'][bodyScriptFullPath];
                        },
                        set: (newValue) => {
                            WORKSPACE.workspaceSessionState['target_operations']['http']['body_scripts'][bodyScriptFullPath] = newValue;
                        }
                    });
                    return await Promise.resolve(GET_BODY.apply(BODY_MODULE, [ARGS]));
                };
            }
            else {
                throw new Error(i18.t('targets.operations.http.noBodyScriptFunction', bodyScriptFullPath));
            }
        }
        else {
            throw new Error(i18.t('targets.operations.http.noBodyScriptModule', bodyScriptFullPath));
        }
    }
    else {
        body = OPERATION.body;
    }
    const BODY_TO_SEND = await deploy_helpers.asBuffer(await Promise.resolve(getBodyToSend()));
    await deploy_http.request(URL, {
        headers: HEADERS,
        method: method,
        raiseOnClientError: true,
        raiseOnServerError: true,
        raiseOnUnsupportedResponse: true,
        setup: BODY_TO_SEND,
    });
}
exports.execute = execute;
//# sourceMappingURL=http.js.map