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
const deploy_plugins = require("../plugins");
class SwitchPlugin extends deploy_plugins.IterablePluginBase {
    async getTargets(switchTarget, operation, throwIfNonFound = false) {
        const WORKSPACE = switchTarget.__workspace;
        const TARGETS = WORKSPACE.getTargetsOfSwitch(switchTarget);
        if (false === TARGETS) {
            return false;
        }
        return TARGETS;
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
    return new SwitchPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=switch.js.map