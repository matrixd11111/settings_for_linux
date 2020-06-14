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
const deploy_helpers = require("./helpers");
const deploy_targets = require("./targets");
const Enumerable = require("node-enumerable");
const i18 = require("./i18");
const vscode = require("vscode");
/**
 * Lets the user change an option of a switch.
 *
 * @param {deploy_workspaces.Workspace|deploy_workspaces.Workspace[]} workspaces The scope of workspaces.
 */
async function changeSwitch(workspaces) {
    workspaces = deploy_helpers.asArray(workspaces);
    const QUICK_PICKS = Enumerable.from(workspaces).selectMany(ws => {
        return ws.getSwitchTargets();
    }).select(st => {
        return {
            action: async () => {
                await st.__workspace
                    .changeSwitchButtonOption(st);
            },
            detail: st.__workspace.rootPath,
            label: deploy_targets.getTargetName(st),
            description: deploy_helpers.toStringSafe(st.description).trim(),
        };
    }).toArray();
    if (QUICK_PICKS.length < 1) {
        deploy_helpers.showWarningMessage(i18.t('plugins.switch.noDefined'));
        return;
    }
    let selectedItem;
    if (1 === QUICK_PICKS.length) {
        selectedItem = QUICK_PICKS[0];
    }
    else {
        selectedItem = await vscode.window.showQuickPick(QUICK_PICKS, {
            placeHolder: i18.t('plugins.switch.selectSwitch')
        });
    }
    if (selectedItem) {
        await selectedItem.action();
    }
}
exports.changeSwitch = changeSwitch;
//# sourceMappingURL=switch.js.map