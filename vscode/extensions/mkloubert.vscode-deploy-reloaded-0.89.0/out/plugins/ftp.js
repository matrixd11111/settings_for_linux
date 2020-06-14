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
const deploy_clients_ftp = require("../clients/ftp");
const deploy_contracts = require("../contracts");
const deploy_helpers = require("../helpers");
const deploy_plugins = require("../plugins");
const Events = require("events");
const vscode = require("vscode");
const CACHE_PASSWORD = 'password';
const CACHE_USER = 'user';
class FTPPlugin extends deploy_plugins.AsyncFileClientPluginBase {
    constructor() {
        super(...arguments);
        this._EVENTS = new Events.EventEmitter();
        this._GLOBAL_STATE = {};
        this._SCRIPT_STATES = {};
    }
    async createContext(target) {
        const CACHE = this.getCache(target);
        const WORKSPACE = target.__workspace;
        const DIR = this.replaceWithValues(target, target.dir);
        let cachePassword = false;
        let cacheUsername = false;
        const ASK_FOR_USER = deploy_helpers.toBooleanSafe(target.askForUser);
        const ALWAYS_ASK_FOR_USER = deploy_helpers.toBooleanSafe(target.alwaysAskForUser);
        let user = target.user;
        if (ASK_FOR_USER && _.isNil(user)) {
            let askForUser = ALWAYS_ASK_FOR_USER;
            if (!askForUser) {
                askForUser = !CACHE.has(CACHE_USER);
            }
            if (askForUser) {
                user = await vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    prompt: this.t(target, 'credentials.enterUsername')
                });
                if (_.isNil(user)) {
                    return;
                }
            }
            else {
                user = CACHE.get(CACHE_USER);
            }
            cacheUsername = !ALWAYS_ASK_FOR_USER;
        }
        const ASK_FOR_PASSWORD = deploy_helpers.toBooleanSafe(target.askForPassword);
        const ALWAYS_ASK_FOR_PASSWORD = deploy_helpers.toBooleanSafe(target.alwaysAskForPassword);
        let pwd = target.password;
        if (ASK_FOR_PASSWORD && _.isNil(pwd)) {
            let askForPassword = ALWAYS_ASK_FOR_PASSWORD;
            if (!askForPassword) {
                askForPassword = !CACHE.has(CACHE_PASSWORD);
            }
            if (askForPassword) {
                pwd = await vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    password: true,
                    prompt: this.t(target, 'credentials.enterPassword')
                });
                if (_.isNil(pwd)) {
                    return;
                }
            }
            else {
                pwd = CACHE.get(CACHE_PASSWORD);
            }
            cachePassword = !ALWAYS_ASK_FOR_PASSWORD;
        }
        let beforeUpload;
        let uploadCompleted;
        {
            const SCRIPT_STATE_KEY = deploy_helpers.toStringSafe(target.__id);
            const BEFORE_UPLOAD_SCRIPT = WORKSPACE.replaceWithValues(target.beforeUpload);
            if (!deploy_helpers.isEmptyString(BEFORE_UPLOAD_SCRIPT)) {
                const BEFORE_UPLOAD_SCRIPT_PATH = await WORKSPACE.getExistingSettingPath(BEFORE_UPLOAD_SCRIPT);
                if (false === BEFORE_UPLOAD_SCRIPT_PATH) {
                    throw new Error(WORKSPACE.t('fileNotFound', BEFORE_UPLOAD_SCRIPT));
                }
                const BEFORE_UPLOAD_MODULE = deploy_helpers.loadModule(BEFORE_UPLOAD_SCRIPT_PATH);
                if (BEFORE_UPLOAD_MODULE) {
                    beforeUpload = async (args) => {
                        const ARGS = {
                            _: require('lodash'),
                            context: args,
                            deployEvent: deploy_contracts.DeployEvent.BeforeDeployFile,
                            deployOperation: deploy_contracts.DeployOperation.Deploy,
                            events: this._EVENTS,
                            extension: target.__workspace.context.extension,
                            folder: target.__workspace.folder,
                            globalEvents: deploy_helpers.EVENTS,
                            globals: target.__workspace.globals,
                            globalState: this._GLOBAL_STATE,
                            homeDir: deploy_helpers.getExtensionDirInHome(),
                            logger: target.__workspace.createLogger(),
                            options: deploy_helpers.cloneObject(target.beforeUploadOptions),
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
                            target: target,
                            workspace: undefined,
                            workspaceRoot: undefined,
                        };
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
                                return this._SCRIPT_STATES[SCRIPT_STATE_KEY];
                            },
                            set: (newValue) => {
                                this._SCRIPT_STATES[SCRIPT_STATE_KEY] = newValue;
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
                        if (BEFORE_UPLOAD_MODULE.execute) {
                            await Promise.resolve(BEFORE_UPLOAD_MODULE.execute(ARGS));
                        }
                    };
                }
            }
            const UPLOADED_SCRIPT = WORKSPACE.replaceWithValues(target.uploaded);
            if (!deploy_helpers.isEmptyString(UPLOADED_SCRIPT)) {
                const UPLOADED_SCRIPT_PATH = await WORKSPACE.getExistingSettingPath(UPLOADED_SCRIPT);
                if (false === UPLOADED_SCRIPT_PATH) {
                    throw new Error(WORKSPACE.t('fileNotFound', UPLOADED_SCRIPT));
                }
                const UPLOADED_MODULE = deploy_helpers.loadModule(UPLOADED_SCRIPT_PATH);
                if (UPLOADED_MODULE) {
                    uploadCompleted = async (args) => {
                        const ARGS = {
                            _: require('lodash'),
                            context: args,
                            deployEvent: deploy_contracts.DeployEvent.FileDeployed,
                            deployOperation: deploy_contracts.DeployOperation.Deploy,
                            events: this._EVENTS,
                            extension: target.__workspace.context.extension,
                            folder: target.__workspace.folder,
                            globalEvents: deploy_helpers.EVENTS,
                            globals: target.__workspace.globals,
                            globalState: this._GLOBAL_STATE,
                            homeDir: deploy_helpers.getExtensionDirInHome(),
                            logger: target.__workspace.createLogger(),
                            options: deploy_helpers.cloneObject(target.uploadedOptions),
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
                            target: target,
                            workspace: undefined,
                            workspaceRoot: undefined,
                        };
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
                                return this._SCRIPT_STATES[SCRIPT_STATE_KEY];
                            },
                            set: (newValue) => {
                                this._SCRIPT_STATES[SCRIPT_STATE_KEY] = newValue;
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
                        if (UPLOADED_MODULE.execute) {
                            await Promise.resolve(UPLOADED_MODULE.execute(ARGS));
                        }
                    };
                }
            }
        }
        try {
            const CTX = {
                client: await deploy_clients_ftp.openConnection({
                    beforeUpload: beforeUpload,
                    commands: target.commands,
                    engine: this.replaceWithValues(target, target.engine),
                    host: this.replaceWithValues(target, target.host),
                    password: pwd,
                    port: parseInt(deploy_helpers.toStringSafe(this.replaceWithValues(target, target.port)).trim()),
                    supportsDeepDirectoryCreation: target.supportsDeepDirectoryCreation,
                    uploadCompleted: uploadCompleted,
                    user: user,
                    secure: target.secure,
                    rejectUnauthorized: deploy_helpers.toBooleanSafe(target.rejectUnauthorized),
                    valueProvider: () => WORKSPACE.getValues(),
                }),
                getDir: (subDir) => {
                    return deploy_helpers.normalizePath(deploy_helpers.normalizePath(DIR) +
                        '/' +
                        deploy_helpers.normalizePath(subDir));
                },
                target: target
            };
            if (cacheUsername) {
                CACHE.set(CACHE_USER, user);
            }
            else {
                CACHE.unset(CACHE_USER);
            }
            if (cachePassword) {
                CACHE.set(CACHE_PASSWORD, pwd);
            }
            else {
                CACHE.unset(CACHE_PASSWORD);
            }
            return CTX;
        }
        catch (e) {
            CACHE.unset(CACHE_USER)
                .unset(CACHE_PASSWORD);
            throw e;
        }
    }
    onDispose() {
        super.onDispose();
        this._EVENTS.removeAllListeners();
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
    return new FTPPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=ftp.js.map