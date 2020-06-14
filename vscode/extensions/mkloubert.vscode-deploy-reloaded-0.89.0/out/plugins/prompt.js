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
class PromptPlugin extends deploy_plugins.IterablePluginBase {
    async prepareTargetsMany(promptTarget, targets) {
        const ME = this;
        const WORKSPACE = promptTarget.__workspace;
        const CLONED_TARGETS = [];
        let prompts = promptTarget.prompts;
        if (!deploy_helpers.isObject(prompts) && !Array.isArray(prompts)) {
            // download from source
            const DOWNLOAD_SOURCE = ME.replaceWithValues(promptTarget, prompts);
            prompts =
                JSON.parse((await deploy_download.download(DOWNLOAD_SOURCE, WORKSPACE.getSettingScopes())).toString('utf8'));
        }
        const PROPERTIES_AND_VALUES = {};
        for (const P of deploy_helpers.asArray(prompts)) {
            const VALUE_TYPE = deploy_helpers.normalizeString(ME.replaceWithValues(promptTarget, P.type));
            let validator;
            switch (VALUE_TYPE) {
                case 'bool':
                case 'boolean':
                    validator = (str) => {
                        switch (deploy_helpers.normalizeString(str)) {
                            case '':
                            case '1':
                            case 'true':
                            case 'yes':
                            case 'y':
                            case '0':
                            case 'false':
                            case 'no':
                            case 'n':
                                // valid
                                break;
                            default:
                                return ME.t(promptTarget, 'plugins.prompt.validation.noBool');
                        }
                    };
                    break;
                case 'int':
                case 'integer':
                    validator = (str) => {
                        if (!deploy_helpers.isEmptyString(str)) {
                            if (isNaN(parseInt(deploy_helpers.toStringSafe(str).trim()))) {
                                return ME.t(promptTarget, 'plugins.prompt.validation.noInt');
                            }
                        }
                    };
                    break;
                case 'float':
                case 'number':
                    validator = (str) => {
                        if (!deploy_helpers.isEmptyString(str)) {
                            if (isNaN(parseFloat(deploy_helpers.toStringSafe(str).trim()))) {
                                return ME.t(promptTarget, 'plugins.prompt.validation.noFloat');
                            }
                        }
                    };
                    break;
                case 'json':
                case 'obj':
                case 'object':
                    validator = (str) => {
                        try {
                            JSON.parse(str.trim());
                        }
                        catch (e) {
                            return ME.t(promptTarget, 'plugins.prompt.validation.noJSON');
                        }
                    };
                    break;
            }
            let valueToSet = await vscode.window.showInputBox({
                ignoreFocusOut: deploy_helpers.toBooleanSafe(P.ignoreFocusOut, true),
                password: deploy_helpers.toBooleanSafe(P.isPassword),
                placeHolder: deploy_helpers.toStringSafe(ME.replaceWithValues(promptTarget, P.placeHolder)).trim(),
                prompt: deploy_helpers.toStringSafe(ME.replaceWithValues(promptTarget, P.text)).trim(),
                validateInput: async (str) => {
                    if (validator) {
                        return await Promise.resolve(validator(str));
                    }
                    return null;
                }
            });
            if (deploy_helpers.isNullOrUndefined(valueToSet)) {
                return false; // cancelled
            }
            let converter;
            switch (VALUE_TYPE) {
                case 'bool':
                case 'boolean':
                    converter = (i) => {
                        if (deploy_helpers.isEmptyString(i)) {
                            return null;
                        }
                        switch (deploy_helpers.normalizeString(i)) {
                            case '1':
                            case 'true':
                            case 'yes':
                            case 'y':
                                return true;
                        }
                        return false;
                    };
                    break;
                case 'file':
                    converter = async (i) => {
                        if (deploy_helpers.isEmptyString(i)) {
                            return null;
                        }
                        return JSON.parse((await deploy_download.download(i, WORKSPACE.getSettingScopes())).toString('utf8')
                            .trim());
                    };
                    break;
                case 'float':
                case 'number':
                    converter = (i) => {
                        if (deploy_helpers.isEmptyString(i)) {
                            return null;
                        }
                        return parseFloat(deploy_helpers.toStringSafe(i).trim());
                    };
                    break;
                case 'int':
                case 'integer':
                    converter = (i) => {
                        if (deploy_helpers.isEmptyString(i)) {
                            return null;
                        }
                        return parseInt(deploy_helpers.toStringSafe(i).trim());
                    };
                    break;
                case 'json':
                case 'obj':
                case 'object':
                    converter = (i) => {
                        return JSON.parse(deploy_helpers.toStringSafe(i).trim());
                    };
                    break;
                case '':
                case 'string':
                case 'str':
                    break;
            }
            if (converter) {
                valueToSet = await Promise.resolve(converter(valueToSet));
            }
            deploy_helpers.asArray(P.properties).map(p => {
                return deploy_helpers.toStringSafe(p).trim();
            }).filter(p => '' !== p).forEach(p => {
                PROPERTIES_AND_VALUES[p] = valueToSet;
            });
        }
        // create targets with prompt settings
        for (const T of deploy_helpers.asArray(targets)) {
            let ct = deploy_helpers.cloneObjectFlat(T);
            ct = MergeDeep(ct, PROPERTIES_AND_VALUES);
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
    return new PromptPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=prompt.js.map