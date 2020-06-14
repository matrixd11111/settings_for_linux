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
const _ = require("lodash");
const deploy_helpers = require("../../helpers");
const vscode = require("vscode");
const KEY_DEV_TOOLS_PAGE = 'lastDevToolsPage';
/** @inheritdoc */
async function execute(context) {
    const OPERATION = context.operation;
    const TARGET = context.target;
    const WORKSPACE = TARGET.__workspace;
    const ALWAYS_ASK_FOR_PAGE = deploy_helpers.toBooleanSafe(OPERATION.alwaysAskForPage);
    const PAGES = deploy_helpers.toStringSafe(OPERATION.pages);
    let sendCallback;
    if (deploy_helpers.toBooleanSafe(OPERATION.debug, true)) {
        sendCallback = async (msg) => {
            if (_.isNil(msg)) {
                return;
            }
            const LOG_TAG = 'targets.operations.devtools.execute(sendCallback)';
            let msgJson;
            try {
                msgJson = JSON.stringify(msg, null, 2);
            }
            catch (_a) { }
            if (!deploy_helpers.isEmptyString(msgJson)) {
                WORKSPACE.output.appendLine('');
                WORKSPACE.output.appendLine(msgJson);
                if (!_.isNil(msg.error)) {
                    WORKSPACE.logger
                        .err(msgJson, LOG_TAG);
                }
                else {
                    WORKSPACE.logger
                        .info(msgJson, LOG_TAG);
                }
            }
        };
    }
    let params = deploy_helpers.cloneObject(OPERATION.parameters);
    let method = deploy_helpers.toStringSafe(OPERATION.method).trim();
    if ('' === method) {
        method = 'Page.reload';
        if (_.isNil(params)) {
            params = {
                ignoreCache: true,
            };
        }
    }
    let pageFilter = false;
    if ('' !== PAGES.trim()) {
        pageFilter = new RegExp(PAGES, 'i');
    }
    const CLIENT = deploy_helpers.createDevToolsClient({
        host: OPERATION.host,
        port: OPERATION.port,
    });
    try {
        const PAGES = await CLIENT.getPages();
        const LAST_SELECTED_PAGE = WORKSPACE.vars[KEY_DEV_TOOLS_PAGE];
        const QUICK_PICKS = deploy_helpers.from(PAGES.map((p, i) => {
            let title = deploy_helpers.toStringSafe(p.title).trim();
            if ('' === title) {
                title = WORKSPACE.t('targets.operations.devTools.pages.defaultTitle', i + 1);
            }
            let description = deploy_helpers.toStringSafe(p.description).trim();
            return {
                action: async () => {
                    if (!(await p.connect())) {
                        throw new Error(WORKSPACE.t('targets.operations.devTools.errors.couldNotConnectTo', p.socketUri));
                    }
                    try {
                        await p.send(method, params, sendCallback);
                        WORKSPACE.vars[KEY_DEV_TOOLS_PAGE] = p.id;
                    }
                    finally {
                        try {
                            p.close();
                        }
                        catch (_a) { }
                    }
                },
                description: description,
                detail: p.socketUri,
                label: title,
                state: p,
            };
        })).where(x => {
            if (false !== pageFilter) {
                return pageFilter.test(deploy_helpers.toStringSafe(x.state.title));
            }
            return true;
        }).orderBy(x => {
            return LAST_SELECTED_PAGE === x.state.id ? 0 : 1;
        }).thenBy(x => {
            return deploy_helpers.normalizeString(x.label);
        }).toArray();
        if (QUICK_PICKS.length < 1) {
            return;
        }
        let selectedItem = deploy_helpers.from(QUICK_PICKS)
            .firstOrDefault(x => x.state.id === LAST_SELECTED_PAGE, false);
        if (ALWAYS_ASK_FOR_PAGE || (false === selectedItem)) {
            delete WORKSPACE.vars[KEY_DEV_TOOLS_PAGE];
            if (1 === QUICK_PICKS.length) {
                selectedItem = QUICK_PICKS[0];
            }
            else {
                selectedItem = await vscode.window.showQuickPick(QUICK_PICKS, {
                    canPickMany: false,
                    placeHolder: WORKSPACE.t('targets.operations.devTools.pages.selectPage'),
                });
            }
        }
        if (selectedItem) {
            await selectedItem.action();
        }
    }
    finally {
        deploy_helpers.tryDispose(CLIENT);
    }
}
exports.execute = execute;
//# sourceMappingURL=devtools.js.map