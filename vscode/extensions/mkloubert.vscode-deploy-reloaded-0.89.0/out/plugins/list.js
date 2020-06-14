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
const deploy_download = require("../download");
const deploy_helpers = require("../helpers");
const deploy_plugins = require("../plugins");
const MergeDeep = require('merge-deep');
const vscode = require("vscode");
class ListPlugin extends deploy_plugins.IterablePluginBase {
    async prepareTargetsMany(listTarget, targets) {
        const ME = this;
        const WORKSPACE = listTarget.__workspace;
        const CLONED_TARGETS = [];
        let entries;
        if (!deploy_helpers.isObject(entries) && !Array.isArray(entries)) {
            // download from source
            const DOWNLOAD_SOURCE = ME.replaceWithValues(listTarget, entries);
            entries =
                JSON.parse((await deploy_download.download(DOWNLOAD_SOURCE, WORKSPACE.getSettingScopes())).toString('utf8'));
        }
        const QUICK_PICKS = deploy_helpers.asArray(entries).map((e, i) => {
            let name = deploy_helpers.toStringSafe(ME.replaceWithValues(listTarget, e.name)).trim();
            if ('' === name) {
                name = listTarget.__workspace
                    .t('plugins.list.defaultEntryName', i + 1);
            }
            const DESCRIPTION = deploy_helpers.toStringSafe(ME.replaceWithValues(listTarget, e.description)).trim();
            return {
                action: async () => {
                    let settingsToApply = e.settings;
                    if (!deploy_helpers.isObject(settingsToApply)) {
                        // download from source
                        const DOWNLOAD_SOURCE = ME.replaceWithValues(listTarget, settingsToApply);
                        settingsToApply =
                            JSON.parse((await deploy_download.download(DOWNLOAD_SOURCE, WORKSPACE.getSettingScopes())).toString('utf8'));
                    }
                    for (const T of deploy_helpers.asArray(targets)) {
                        let ct = deploy_helpers.cloneObjectFlat(T);
                        if (settingsToApply) {
                            ct = MergeDeep(ct, settingsToApply);
                        }
                        CLONED_TARGETS.push(ct);
                    }
                },
                description: DESCRIPTION,
                label: name,
            };
        });
        const SELECTED_ITEM = await vscode.window.showQuickPick(QUICK_PICKS, {
            placeHolder: listTarget.__workspace
                .t('plugins.list.selectEntry'),
        });
        if (!SELECTED_ITEM) {
            return false;
        }
        await Promise.resolve(SELECTED_ITEM.action());
        return CLONED_TARGETS;
    }
}
/**
 * Creates a new instance of that plugin.
 *
 * @param {deploy_plugins.PluginContext} context The context for the plugin.
 *
 * @return {deploy_plugins.Plugin} The new plugin.
 */
function createPlugins(context) {
    return new ListPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=list.js.map