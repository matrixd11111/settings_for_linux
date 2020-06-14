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
const deploy_gui = require("../gui");
const deploy_helpers = require("../helpers");
const deploy_log = require("../log");
const deploy_workspaces = require("../workspaces");
const i18 = require("../i18");
const Path = require("path");
const vscode = require("vscode");
const KEY_YARN_TOOLS_USAGE = 'vscdrLastExecutedYarnToolActions';
const KEY_LAST_RUN_YARN_ADD_MODULE = 'vscdrRunYarnAddLastModule';
/**
 * Resets the NPM tool usage statistics.
 *
 * @param {vscode.ExtensionContext} context The extension context.
 */
function resetYarnToolsUsage(context) {
    context.globalState.update(KEY_YARN_TOOLS_USAGE, undefined).then(() => {
    }, (err) => {
        deploy_log.CONSOLE
            .trace(err, 'tools.yarn.resetYarnToolsUsage()');
    });
}
exports.resetYarnToolsUsage = resetYarnToolsUsage;
async function runYarnAdd(ws) {
    const EXTENSION = ws.context.extension;
    const YARN_MODULE = deploy_helpers.normalizeString(await vscode.window.showInputBox({
        placeHolder: ws.t('tools.yarn.moduleExample'),
        prompt: ws.t('tools.yarn.runAdd.enterModuleName'),
        value: deploy_helpers.normalizeString(EXTENSION.globalState.get(KEY_LAST_RUN_YARN_ADD_MODULE))
    }));
    if ('' === YARN_MODULE) {
        return;
    }
    EXTENSION.globalState.update(KEY_LAST_RUN_YARN_ADD_MODULE, YARN_MODULE).then(() => {
    }, (err) => {
        deploy_log.CONSOLE
            .trace(err, 'tools.yarn.runYarnAdd(1)');
    });
    const CMD = `yarn add ${YARN_MODULE}`;
    ws.output.appendLine('');
    ws.output.append(ws.t('tools.yarn.executing', CMD) + ' ');
    try {
        await ws.exec(CMD);
        ws.output.appendLine(`[${ws.t('ok')}]`);
    }
    catch (e) {
        ws.output.appendLine(`[${ws.t('error', e)}]`);
    }
}
async function runYarnRemove(ws) {
    const PACKAGE_JSON = Path.resolve(Path.join(ws.rootPath, 'package.json'));
    if (!(await deploy_helpers.exists(PACKAGE_JSON))) {
        ws.showWarningMessage(ws.t('tools.yarn.runRemove.packageFileNotFound', ws.rootPath));
        return;
    }
    let file;
    try {
        file = JSON.parse((await deploy_helpers.readFile(PACKAGE_JSON)).toString('utf8'));
    }
    catch (e) {
        ws.showErrorMessage(ws.t('tools.yarn.runRemove.errors.loadingPackageFileFailed', PACKAGE_JSON, e));
        return;
    }
    if (!file) {
        file = {};
    }
    const MODULES = [];
    if (file.dependencies) {
        for (const M in file.dependencies) {
            const MODULE_NAME = deploy_helpers.toStringSafe(M).trim();
            if ('' === MODULE_NAME) {
                continue;
            }
            MODULES.push({
                name: MODULE_NAME,
                version: deploy_helpers.toStringSafe(file.dependencies[M]).trim(),
            });
        }
    }
    const QUICK_PICKS = MODULES.sort((x, y) => {
        return deploy_helpers.compareValuesBy(x, y, m => deploy_helpers.normalizeString(m.name));
    }).map(m => {
        return {
            action: () => {
                return m.name;
            },
            label: m.name,
            description: m.version,
            detail: PACKAGE_JSON,
        };
    });
    if (QUICK_PICKS.length < 1) {
        ws.showWarningMessage(ws.t('tools.yarn.runRemove.packageFileContainsNoModules', PACKAGE_JSON));
        return;
    }
    const SELECTED_ITEM = await vscode.window.showQuickPick(QUICK_PICKS);
    if (!SELECTED_ITEM) {
        return;
    }
    const YARN_MODULE = SELECTED_ITEM.action();
    const CMD = `yarn remove ${YARN_MODULE}`;
    ws.output.appendLine('');
    ws.output.append(ws.t('tools.yarn.executing', CMD) + ' ');
    try {
        await ws.exec(CMD);
        ws.output.appendLine(`[${ws.t('ok')}]`);
    }
    catch (e) {
        ws.output.appendLine(`[${ws.t('error', e)}]`);
    }
}
async function showYarnTools(context) {
    const SELECTED_WORKSPACE = await deploy_workspaces.showWorkspaceQuickPick(context, deploy_workspaces.getActiveWorkspaces(), {
        placeHolder: i18.t('workspaces.selectWorkspace')
    });
    if (!SELECTED_WORKSPACE) {
        return;
    }
    const QUICK_PICKS = [
        {
            action: async () => {
                await runYarnAdd(SELECTED_WORKSPACE);
            },
            description: SELECTED_WORKSPACE.t('tools.yarn.runAdd.description'),
            detail: SELECTED_WORKSPACE.rootPath,
            label: SELECTED_WORKSPACE.t('tools.yarn.runAdd.label'),
            state: 0,
        },
        {
            action: async () => {
                await runYarnRemove(SELECTED_WORKSPACE);
            },
            description: SELECTED_WORKSPACE.t('tools.yarn.runRemove.description'),
            detail: SELECTED_WORKSPACE.rootPath,
            label: SELECTED_WORKSPACE.t('tools.yarn.runRemove.label'),
            state: 1,
        },
    ];
    const SELECTED_ITEM = await vscode.window.showQuickPick(deploy_gui.sortQuickPicksByUsage(QUICK_PICKS, SELECTED_WORKSPACE.context.extension.globalState, KEY_YARN_TOOLS_USAGE));
    if (SELECTED_ITEM) {
        await SELECTED_ITEM.action();
    }
}
exports.showYarnTools = showYarnTools;
//# sourceMappingURL=yarn.js.map