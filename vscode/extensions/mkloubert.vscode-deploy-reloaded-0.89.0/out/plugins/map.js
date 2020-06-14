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
class MapPlugin extends deploy_plugins.IterablePluginBase {
    async prepareTarget(mapTarget, target) {
        const ME = this;
        const WORKSPACE = mapTarget.__workspace;
        const CLONED_TARGETS = [];
        const MAPPINGS = [];
        await deploy_helpers.forEachAsync(deploy_helpers.asArray(mapTarget.from), async (item) => {
            let itemsToAdd;
            if (!deploy_helpers.isObject(item)) {
                const DOWNLOAD_SOURCE = ME.replaceWithValues(mapTarget, item);
                itemsToAdd = deploy_helpers.asArray(JSON.parse((await deploy_download.download(DOWNLOAD_SOURCE, WORKSPACE.getSettingScopes())).toString('utf8')));
            }
            else {
                itemsToAdd = [item];
            }
            MAPPINGS.push
                .apply(MAPPINGS, itemsToAdd);
        });
        for (const M of MAPPINGS) {
            let ct = deploy_helpers.cloneObjectFlat(target);
            ct = MergeDeep(ct, M);
            CLONED_TARGETS.push(ct);
        }
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
    return new MapPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=map.js.map