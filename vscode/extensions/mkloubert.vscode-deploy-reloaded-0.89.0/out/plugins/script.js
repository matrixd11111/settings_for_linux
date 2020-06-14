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
const deploy_contracts = require("../contracts");
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_plugins = require("../plugins");
const Events = require("events");
class ScriptPlugin extends deploy_plugins.PluginBase {
    constructor() {
        super(...arguments);
        this._EVENTS = new Events.EventEmitter();
        this._GLOBAL_STATE = {};
        this._SCRIPT_STATES = {};
    }
    get canDelete() {
        return true;
    }
    get canDownload() {
        return true;
    }
    get canList() {
        return true;
    }
    get canRemoveFolders() {
        return true;
    }
    async createScriptArgsFromContext(context, operation) {
        const ME = this;
        const SCRIPT_STATE_KEY = deploy_helpers.toStringSafe(context.target.__id);
        const ARGS = {
            _: require('lodash'),
            cancellationToken: undefined,
            dir: context['dir'],
            events: ME._EVENTS,
            extension: context.target.__workspace.context.extension,
            files: context['files'],
            folder: context.target.__workspace.folder,
            folders: context['folders'],
            globalEvents: deploy_helpers.EVENTS,
            globals: context.target.__workspace.globals,
            globalState: ME._GLOBAL_STATE,
            homeDir: deploy_helpers.getExtensionDirInHome(),
            isCancelling: undefined,
            logger: context.target.__workspace.createLogger(),
            operation: operation,
            options: deploy_helpers.cloneObject(context.target.options),
            output: undefined,
            replaceWithValues: function (val) {
                return this.workspace
                    .replaceWithValues(val);
            },
            require: (id) => {
                return deploy_helpers.requireFromExtension(id);
            },
            sessionState: deploy_helpers.SESSION,
            settingFolder: undefined,
            state: undefined,
            target: context.target,
            workspace: undefined,
            workspaceRoot: undefined,
        };
        // ARGS.cancellationToken
        Object.defineProperty(ARGS, 'cancellationToken', {
            enumerable: true,
            get: () => {
                return context.cancellationToken;
            }
        });
        // ARGS.isCancelling
        Object.defineProperty(ARGS, 'isCancelling', {
            enumerable: true,
            get: () => {
                return context.isCancelling;
            }
        });
        // ARGS.output
        Object.defineProperty(ARGS, 'output', {
            enumerable: true,
            get: function () {
                return this.workspace.output;
            }
        });
        // ARGS.settingFolder
        Object.defineProperty(ARGS, 'settingFolder', {
            enumerable: true,
            get: function () {
                return this.workspace.settingFolder;
            }
        });
        // ARGS.state
        Object.defineProperty(ARGS, 'state', {
            enumerable: true,
            get: () => {
                return ME._SCRIPT_STATES[SCRIPT_STATE_KEY];
            },
            set: (newValue) => {
                ME._SCRIPT_STATES[SCRIPT_STATE_KEY] = newValue;
            }
        });
        // ARGS.workspace
        Object.defineProperty(ARGS, 'workspace', {
            enumerable: true,
            get: function () {
                return this.target.__workspace;
            }
        });
        // ARGS.workspaceRoot
        Object.defineProperty(ARGS, 'workspaceRoot', {
            enumerable: true,
            get: function () {
                return this.workspace.rootPath;
            }
        });
        return ARGS;
    }
    async executeScript(args) {
        const ME = this;
        let script = ME.replaceWithValues(args.target, args.target.script);
        if (deploy_helpers.isEmptyString(script)) {
            script = './deploy.js';
        }
        const SCRIPT_FILE = await args.target.__workspace.getExistingSettingPath(script);
        if (false === SCRIPT_FILE) {
            throw new Error(ME.t(args.target, 'plugins.script.scriptNotFound', script));
        }
        const SCRIPT_MODULE = deploy_helpers.loadModule(SCRIPT_FILE, args.target.cache);
        if (SCRIPT_MODULE) {
            const EXECUTE = SCRIPT_MODULE.execute;
            if (EXECUTE) {
                return await Promise.resolve(deploy_helpers.applyFuncFor(EXECUTE, SCRIPT_MODULE)(args));
            }
            else {
                throw new Error(ME.t(args.target, 'plugins.script.noScriptFunction', SCRIPT_FILE));
            }
        }
        else {
            throw new Error(ME.t(args.target, 'plugins.script.noScriptModule', SCRIPT_FILE));
        }
    }
    async deleteFiles(context) {
        const ARGS = await this.createScriptArgsFromContext(context, deploy_contracts.DeployOperation.Delete);
        await this.executeScript(ARGS);
    }
    async downloadFiles(context) {
        const ARGS = await this.createScriptArgsFromContext(context, deploy_contracts.DeployOperation.Pull);
        await this.executeScript(ARGS);
    }
    async listDirectory(context) {
        const ARGS = await this.createScriptArgsFromContext(context, deploy_contracts.DeployOperation.ListDirectory);
        const EXEC_RES = deploy_helpers.asArray(await this.executeScript(ARGS));
        const RESULT = {
            dirs: [],
            files: [],
            others: [],
            info: deploy_files.createDefaultDirectoryInfo(context.dir),
            target: context.target,
        };
        for (const FSI of EXEC_RES) {
            switch (FSI.type) {
                case deploy_files.FileSystemType.Directory:
                    RESULT.dirs.push(FSI);
                    break;
                case deploy_files.FileSystemType.File:
                    RESULT.files.push(FSI);
                    break;
                default:
                    RESULT.others.push(FSI);
                    break;
            }
        }
        return RESULT;
    }
    onDispose() {
        this._EVENTS.removeAllListeners();
    }
    async removeFolders(context) {
        const ARGS = await this.createScriptArgsFromContext(context, deploy_contracts.DeployOperation.RemoveFolders);
        await this.executeScript(ARGS);
    }
    async uploadFiles(context) {
        const ARGS = await this.createScriptArgsFromContext(context, deploy_contracts.DeployOperation.Deploy);
        await this.executeScript(ARGS);
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
    return new ScriptPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=script.js.map