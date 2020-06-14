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
const deploy_contracts = require("./contracts");
const deploy_files = require("./files");
const deploy_helpers = require("./helpers");
const deploy_targets = require("./targets");
const deploy_transformers = require("./transformers");
const deploy_values = require("./values");
const i18 = require("./i18");
/**
 * Wraps another 'FileToDelete' object.
 */
class FileToDeleteWrapper {
    /**
     * Initializes a new instance of that class.
     *
     * @param {FileToDelete} baseFile The file to wrap.
     */
    constructor(baseFile) {
        this.baseFile = baseFile;
        this.onBeforeDelete = this.baseFile.onBeforeDelete;
        this.onDeleteCompleted = this.baseFile.onDeleteCompleted;
    }
    /** @inheritdoc */
    get file() {
        return this.baseFile.file;
    }
    /** @inheritdoc */
    get name() {
        return this.baseFile.name;
    }
    /** @inheritdoc */
    get path() {
        return this.baseFile.path;
    }
    /** @inheritdoc */
    get workspace() {
        return this.baseFile.workspace;
    }
}
exports.FileToDeleteWrapper = FileToDeleteWrapper;
/**
 * Wraps another 'FileToDownload' object.
 */
class FileToDownloadWrapper {
    /**
     * Initializes a new instance of that class.
     *
     * @param {FileToDownload} baseFile The file to wrap.
     */
    constructor(baseFile) {
        this.baseFile = baseFile;
        this.onBeforeDownload = this.baseFile.onBeforeDownload;
        this.onDownloadCompleted = this.baseFile.onDownloadCompleted;
    }
    /** @inheritdoc */
    get file() {
        return this.baseFile.file;
    }
    /** @inheritdoc */
    get name() {
        return this.baseFile.name;
    }
    /** @inheritdoc */
    get path() {
        return this.baseFile.path;
    }
    /** @inheritdoc */
    get workspace() {
        return this.baseFile.workspace;
    }
}
exports.FileToDownloadWrapper = FileToDownloadWrapper;
/**
 * Wraps another 'FileToUpload' object.
 */
class FileToUploadWrapper {
    /**
     * Initializes a new instance of that class.
     *
     * @param {FileToUpload} baseFile The file to wrap.
     */
    constructor(baseFile) {
        this.baseFile = baseFile;
        this.onBeforeUpload = this.baseFile.onBeforeUpload;
        this.onUploadCompleted = this.baseFile.onUploadCompleted;
    }
    /** @inheritdoc */
    get file() {
        return this.baseFile.file;
    }
    /** @inheritdoc */
    get name() {
        return this.baseFile.name;
    }
    /** @inheritdoc */
    get path() {
        return this.baseFile.path;
    }
    /** @inheritdoc */
    async read() {
        return await this.baseFile.read();
    }
    /** @inheritdoc */
    get workspace() {
        return this.baseFile.workspace;
    }
}
exports.FileToUploadWrapper = FileToUploadWrapper;
/**
 * A local file to upload.
 */
class FileToUploadBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {deploy_workspaces.Workspace} workspace The underlying workspace.
     * @param {string} file The path to the local file.
     * @param {deploy_contracts.WithNameAndPath} _NAME_AND_PATH Name and relative path information.
     */
    constructor(workspace, file, _NAME_AND_PATH) {
        this.workspace = workspace;
        this.file = file;
        this._NAME_AND_PATH = _NAME_AND_PATH;
        /** @inheritdoc */
        this.onBeforeUpload = async () => {
        };
        /** @inheritdoc */
        this.onUploadCompleted = async () => {
        };
        /** @inheritdoc */
        this.read = async function () {
            const ME = this;
            let data = await ME.onRead();
            if (ME.transformer) {
                let stateKeyProvider = ME.transformerStateKeyProvider;
                if (!stateKeyProvider) {
                    stateKeyProvider = () => {
                        return deploy_helpers.normalizePath(ME._NAME_AND_PATH.path + '/' + ME._NAME_AND_PATH.name);
                    };
                }
                const STATE_KEY = await Promise.resolve(stateKeyProvider());
                const CONTEXT = {
                    _: require('lodash'),
                    context: ME.transformerSubContext,
                    events: ME.workspace.workspaceSessionState['upload']['events'],
                    extension: ME.workspace.context.extension,
                    folder: ME.workspace.folder,
                    globalEvents: deploy_helpers.EVENTS,
                    globals: ME.workspace.globals,
                    globalState: ME.workspace.workspaceSessionState['upload']['states']['global'],
                    homeDir: deploy_helpers.getExtensionDirInHome(),
                    logger: ME.workspace.createLogger(),
                    mode: deploy_transformers.DataTransformerMode.Transform,
                    options: ME.transformerOptions,
                    output: ME.workspace.output,
                    replaceWithValues: (val) => {
                        return ME.workspace
                            .replaceWithValues(val);
                    },
                    require: (id) => {
                        return deploy_helpers.requireFromExtension(id);
                    },
                    sessionState: deploy_helpers.SESSION,
                    settingFolder: ME.workspace.settingFolder,
                    state: undefined,
                    workspaceRoot: ME.workspace.rootPath,
                };
                // CONTEXT.state
                Object.defineProperty(CONTEXT, 'state', {
                    enumerable: true,
                    get: () => {
                        return ME.workspace.workspaceSessionState['upload']['states']['data_transformers'][STATE_KEY];
                    },
                    set: (newValue) => {
                        ME.workspace.workspaceSessionState['upload']['states']['data_transformers'][STATE_KEY] = newValue;
                    }
                });
                data = await Promise.resolve(ME.transformer(data, CONTEXT));
            }
            return data;
        };
    }
    /** @inheritdoc */
    get name() {
        return this._NAME_AND_PATH.name;
    }
    /** @inheritdoc */
    get path() {
        return this._NAME_AND_PATH.path;
    }
}
exports.FileToUploadBase = FileToUploadBase;
/**
 * A local file to upload.
 */
class LocalFileToUpload extends FileToUploadBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {deploy_workspaces.Workspace} workspace the underlying workspace.
     * @param {string} file The path to the local file.
     * @param {deploy_contracts.WithNameAndPath} nameAndPath Name and relative path information.
     */
    constructor(workspace, file, nameAndPath) {
        super(workspace, file, nameAndPath);
    }
    /** @inheritdoc */
    async onRead() {
        return await deploy_helpers.readFile(this.file);
    }
}
exports.LocalFileToUpload = LocalFileToUpload;
/**
 * A basic plugin.
 */
class PluginBase extends deploy_helpers.DisposableBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {PluginContext} context The underlying context.
     */
    constructor(context) {
        super();
        this.context = context;
    }
    /** @inheritdoc */
    get canDelete() {
        return false;
    }
    /** @inheritdoc */
    get canDownload() {
        return false;
    }
    /** @inheritdoc */
    get canList() {
        return false;
    }
    /** @inheritdoc */
    get canRemoveFolders() {
        return false;
    }
    /** @inheritdoc */
    get canUpload() {
        return true;
    }
    /** @inheritdoc */
    async deleteFiles(context) {
        throw new Error(`'deleteFiles()' is NOT implemented!`);
    }
    /** @inheritdoc */
    async downloadFiles(context) {
        throw new Error(`'downloadFiles()' is NOT implemented!`);
    }
    /**
     * Returns the cache for a target.
     *
     * @param {deploy_targets.Target} target The target.
     *
     * @return {deploy_helpers.CacheProvider} The cache.
     */
    getCache(target) {
        let cache;
        if (target) {
            cache = target.__cache;
        }
        if (!cache) {
            cache = new deploy_helpers.MemoryCache(); // fallback
        }
        return cache;
    }
    /**
     * Returns an existing path for a target, based on the settings folder.
     *
     * @param {deploy_targets.Target} target The underlying target.
     * @param {string} path The path.
     *
     * @return {Promise<string|boolean>} The promise with the existing, full normalized path or (false) if path does not exist.
     */
    async getExistingSettingPath(target, path) {
        const WORKSPACE = this.getWorkspaceOfTarget(target);
        if (WORKSPACE) {
            return await WORKSPACE.getExistingSettingPath(path);
        }
        return false;
    }
    /**
     * Returns the workspace of a target.
     *
     * @param {deploy_targets.Target} target The target.
     * @param {TDefault} defaultValue The default value if workspace is not available.
     *
     * @return {deploy_workspaces.Workspace|TDefault} The workspace or the default value.
     */
    getWorkspaceOfTarget(target, defaultValue) {
        if (target) {
            return target.__workspace;
        }
        return defaultValue;
    }
    /** @inheritdoc */
    async initialize() {
    }
    /**
     * Checks if a path is part of the workspace of a target.
     *
     * @param {deploy_targets.Target} target The underlying target.
     * @param {string} path The path to check.
     *
     * @return {boolean} Is part of workspace or not.
     */
    isPathOf(target, path) {
        const WORKSPACE = this.getWorkspaceOfTarget(target);
        if (WORKSPACE) {
            return WORKSPACE.isPathOf(path);
        }
        return false;
    }
    /** @inheritdoc */
    async listDirectory(context) {
        throw new Error(`'listDirectory()' is NOT implemented!`);
    }
    /** @inheritdoc */
    async removeFolders(context) {
        throw new Error(`'removeFolders()' is NOT implemented!`);
    }
    /**
     * Handles a value as string and replaces placeholders.
     *
     * @param {deploy_targets.Target} target The underlying target.
     * @param {any} val The value to parse.
     * @param {deploy_values.Value|deploy_values.Value[]} [additionalValues] Additional values.
     *
     * @return {string} The parsed value.
     */
    replaceWithValues(target, val, additionalValues) {
        additionalValues = deploy_helpers.asArray(additionalValues);
        const WORKSPACE = this.getWorkspaceOfTarget(target);
        if (WORKSPACE) {
            return WORKSPACE.replaceWithValues(val, additionalValues);
        }
        else {
            return deploy_values.replaceWithValues(additionalValues, val);
        }
    }
    /**
     * Returns a translated string by key and a target.
     *
     * @param {deploy_targets.Target} target The underlying target.
     * @param {string} key The key.
     * @param {any} [args] The optional arguments.
     *
     * @return {string} The "translated" string.
     */
    t(target, key, ...args) {
        const WORKSPACE = this.getWorkspaceOfTarget(target);
        if (WORKSPACE) {
            return WORKSPACE.t
                .apply(WORKSPACE, [key].concat(args));
        }
        else {
            return i18.t
                .apply(null, [key].concat(args));
        }
    }
    /** @inheritdoc */
    async uploadFiles(context) {
        throw new Error(`'uploadFiles()' is NOT implemented!`);
    }
}
exports.PluginBase = PluginBase;
/**
 * A plugin based on an async file client.
 */
class AsyncFileClientPluginBase extends PluginBase {
    /** @inheritdoc */
    get canDelete() {
        return true;
    }
    /** @inheritdoc */
    get canDownload() {
        return true;
    }
    /** @inheritdoc */
    get canList() {
        return true;
    }
    /** @inheritdoc */
    get canRemoveFolders() {
        return true;
    }
    /** @inheritdoc */
    async deleteFiles(context) {
        const ME = this;
        await ME.invokeForConnection(context.target, async (conn) => {
            if (context.isCancelling) {
                return;
            }
            for (const FILE of context.files) {
                if (context.isCancelling) {
                    break;
                }
                try {
                    const REMOTE_DIR = '/' + FILE.path;
                    await FILE.onBeforeDelete(REMOTE_DIR);
                    await conn.client.deleteFile(conn.getDir(FILE.path) + '/' + FILE.name);
                    await FILE.onDeleteCompleted();
                }
                catch (e) {
                    await FILE.onDeleteCompleted(e);
                }
            }
        });
    }
    /** @inheritdoc */
    async downloadFiles(context) {
        const ME = this;
        await ME.invokeForConnection(context.target, async (conn) => {
            if (context.isCancelling) {
                return;
            }
            for (const FILE of context.files) {
                if (context.isCancelling) {
                    break;
                }
                try {
                    const REMOTE_DIR = '/' + FILE.path;
                    await FILE.onBeforeDownload(REMOTE_DIR);
                    const DOWNLOADED_DATA = await conn.client.downloadFile(conn.getDir(FILE.path) + '/' + FILE.name);
                    await FILE.onDownloadCompleted(null, DOWNLOADED_DATA ? createDownloadedFileFromBuffer(FILE, DOWNLOADED_DATA) : DOWNLOADED_DATA);
                }
                catch (e) {
                    await FILE.onDownloadCompleted(e);
                }
            }
        });
    }
    async invokeForConnection(target, action) {
        const CTX = await Promise.resolve(this.createContext(target));
        if (!CTX) {
            return;
        }
        try {
            return await Promise.resolve(action(CTX));
        }
        finally {
            deploy_helpers.tryDispose(CTX.client);
        }
    }
    /** @inheritdoc */
    async listDirectory(context) {
        const ME = this;
        return await ME.invokeForConnection(context.target, async (conn) => {
            if (context.isCancelling) {
                return;
            }
            const DIR = conn.getDir(context.dir);
            let exportPath;
            if (conn.getExportPath) {
                exportPath = conn.getExportPath(context.dir);
            }
            if (deploy_helpers.isEmptyString(exportPath)) {
                exportPath = DIR;
            }
            exportPath = deploy_helpers.toStringSafe(exportPath);
            if (!exportPath.trim().startsWith('/')) {
                exportPath = '/' + exportPath;
            }
            const RESULT = {
                dirs: [],
                files: [],
                info: deploy_files.createDefaultDirectoryInfo(context.dir, {
                    exportPath: exportPath,
                }),
                others: [],
                target: context.target,
            };
            const LIST = await conn.client.listDirectory(DIR);
            if (LIST) {
                for (const FSI of LIST) {
                    if (!FSI) {
                        continue;
                    }
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
            }
            return RESULT;
        });
    }
    /** @inheritdoc */
    async removeFolders(context) {
        const ME = this;
        await ME.invokeForConnection(context.target, async (conn) => {
            if (context.isCancelling) {
                return;
            }
            for (const FOLDER of context.folders) {
                if (context.isCancelling) {
                    break;
                }
                try {
                    const REMOTE_DIR = '/' + FOLDER.path;
                    await FOLDER.onBeforeRemove(REMOTE_DIR);
                    await conn.client.removeFolder(conn.getDir(FOLDER.path) + '/' + FOLDER.name);
                    await FOLDER.onRemoveCompleted();
                }
                catch (e) {
                    await FOLDER.onRemoveCompleted(e);
                }
            }
        });
    }
    /** @inheritdoc */
    async uploadFiles(context) {
        const ME = this;
        await ME.invokeForConnection(context.target, async (conn) => {
            if (context.isCancelling) {
                return;
            }
            for (const FILE of context.files) {
                if (context.isCancelling) {
                    break;
                }
                try {
                    const REMOTE_DIR = '/' + FILE.path;
                    await FILE.onBeforeUpload(REMOTE_DIR);
                    await conn.client.uploadFile(conn.getDir(FILE.path) + '/' + FILE.name, await FILE.read());
                    await FILE.onUploadCompleted();
                }
                catch (e) {
                    await FILE.onUploadCompleted(e);
                }
            }
        });
    }
}
exports.AsyncFileClientPluginBase = AsyncFileClientPluginBase;
/**
 * A simple implementation of a file to delete.
 */
class SimpleFileToDelete {
    /**
     * Initializes a new instance of that class.
     *
     * @param {deploy_workspaces.Workspace} workspace the underlying workspace.
     * @param {string} file The path to the (local) file.
     * @param {deploy_contracts.WithNameAndPath} _NAME_AND_PATH Name and relative path information.
     */
    constructor(workspace, file, _NAME_AND_PATH) {
        this.workspace = workspace;
        this.file = file;
        this._NAME_AND_PATH = _NAME_AND_PATH;
        /** @inheritdoc */
        this.onBeforeDelete = async () => {
        };
        /** @inheritdoc */
        this.onDeleteCompleted = async () => {
        };
    }
    /** @inheritdoc */
    get name() {
        return this._NAME_AND_PATH.name;
    }
    /** @inheritdoc */
    get path() {
        return this._NAME_AND_PATH.path;
    }
}
exports.SimpleFileToDelete = SimpleFileToDelete;
/**
 * A simple implementation of a file to download.
 */
class SimpleFileToDownload {
    /**
     * Initializes a new instance of that class.
     *
     * @param {deploy_workspaces.Workspace} workspace the underlying workspace.
     * @param {string} file The path to the (local) file.
     * @param {deploy_contracts.WithNameAndPath} _NAME_AND_PATH Name and relative path information.
     */
    constructor(workspace, file, _NAME_AND_PATH) {
        this.workspace = workspace;
        this.file = file;
        this._NAME_AND_PATH = _NAME_AND_PATH;
        /** @inheritdoc */
        this.onBeforeDownload = async () => {
        };
        /** @inheritdoc */
        this.onDownloadCompleted = async () => {
        };
    }
    /** @inheritdoc */
    get name() {
        return this._NAME_AND_PATH.name;
    }
    /** @inheritdoc */
    get path() {
        return this._NAME_AND_PATH.path;
    }
}
exports.SimpleFileToDownload = SimpleFileToDownload;
/**
 * A simple implementation of a folder to remove.
 */
class SimpleFolderToRemove {
    /**
     * Initializes a new instance of that class.
     *
     * @param {deploy_workspaces.Workspace} workspace the underlying workspace.
     * @param {string} directory The path to the (local) directory.
     * @param {deploy_contracts.WithNameAndPath} _NAME_AND_PATH Name and relative path information.
     */
    constructor(workspace, directory, _NAME_AND_PATH) {
        this.workspace = workspace;
        this.directory = directory;
        this._NAME_AND_PATH = _NAME_AND_PATH;
        /** @inheritdoc */
        this.onBeforeRemove = async () => {
        };
        /** @inheritdoc */
        this.onRemoveCompleted = async () => {
        };
    }
    /** @inheritdoc */
    get name() {
        return this._NAME_AND_PATH.name;
    }
    /** @inheritdoc */
    get path() {
        return this._NAME_AND_PATH.path;
    }
}
exports.SimpleFolderToRemove = SimpleFolderToRemove;
/**
 * Creates a new instance of a 'downloaded file' from a buffer.
 *
 * @param {deploy_workspaces.WorkspaceFile} file The underlying workspace file.
 * @param {Buffer} buff The buffer with the data.
 *
 * @return {DownloadedFile} The new object.
 */
function createDownloadedFileFromBuffer(file, buff) {
    const DOWNLOADED = {
        dispose: () => {
            buff = null;
        },
        name: undefined,
        path: undefined,
        read: async () => {
            return buff;
        },
    };
    // DOWNLOADED.name
    Object.defineProperty(DOWNLOADED, 'name', {
        enumerable: true,
        get: () => {
            return file.name;
        }
    });
    // DOWNLOADED.path
    Object.defineProperty(DOWNLOADED, 'path', {
        enumerable: true,
        get: () => {
            return file.path;
        }
    });
    return DOWNLOADED;
}
exports.createDownloadedFileFromBuffer = createDownloadedFileFromBuffer;
/**
 * An iterable plugin.
 */
class IterablePluginBase extends PluginBase {
    /** @inheritdoc */
    get canDelete() {
        return true;
    }
    /** @inheritdoc */
    get canDownload() {
        return true;
    }
    /** @inheritdoc */
    get canList() {
        return true;
    }
    /** @inheritdoc */
    get canRemoveFolders() {
        return true;
    }
    /** @inheritdoc */
    async deleteFiles(context) {
        const ME = this;
        await ME.invokeForEachTarget(await Promise.resolve(ME.prepareBaseTarget(context.target)), await ME.getTargets(context.target, deploy_contracts.DeployOperation.Delete), deploy_contracts.DeployOperation.Delete, () => context.isCancelling, async (target, plugin) => {
            const CTX = {
                cancellationToken: undefined,
                files: (await ME.mapFilesForTarget(context.target, target, context.files)).map(f => {
                    return deploy_targets.wrapOnBeforeFileCallbackForTarget(f, target, 'onBeforeDelete');
                }),
                isCancelling: undefined,
                target: target,
            };
            // CTX.cancellationToken
            Object.defineProperty(CTX, 'cancellationToken', {
                enumerable: true,
                get: () => {
                    return context.cancellationToken;
                }
            });
            // CTX.isCancelling
            Object.defineProperty(CTX, 'isCancelling', {
                enumerable: true,
                get: () => {
                    return context.isCancelling;
                }
            });
            await Promise.resolve(plugin.deleteFiles(CTX));
        });
    }
    /** @inheritdoc */
    async downloadFiles(context) {
        const ME = this;
        await ME.invokeForEachTarget(await Promise.resolve(ME.prepareBaseTarget(context.target)), await ME.getFirstTarget(context.target, deploy_contracts.DeployOperation.Pull), deploy_contracts.DeployOperation.Pull, () => context.isCancelling, async (target, plugin) => {
            const CTX = {
                cancellationToken: undefined,
                files: (await ME.mapFilesForTarget(context.target, target, context.files)).map(f => {
                    return deploy_targets.wrapOnBeforeFileCallbackForTarget(f, target, 'onBeforeDownload');
                }),
                isCancelling: undefined,
                target: target,
            };
            // CTX.cancellationToken
            Object.defineProperty(CTX, 'cancellationToken', {
                enumerable: true,
                get: () => {
                    return context.cancellationToken;
                }
            });
            // CTX.isCancelling
            Object.defineProperty(CTX, 'isCancelling', {
                enumerable: true,
                get: () => {
                    return context.isCancelling;
                }
            });
            await Promise.resolve(plugin.downloadFiles(CTX));
        });
    }
    async getFirstTarget(target, operation) {
        const TARGETS = await this.getTargets(target, operation, true);
        if (false === TARGETS) {
            return false;
        }
        return deploy_helpers.asArray(TARGETS)[0];
    }
    /**
     * Extracts the list of available targets based on a parent target.
     *
     * @param {TTarget} target The parent target.
     * @param {deploy_contracts.DeployOperation} operation The underlying operation.
     * @param {boolean} [throwIfNonFound] Throw error if non was found or not.
     *
     * @return {deploy_targets.Target[]|false}
     */
    async getTargets(target, operation, throwIfNonFound = false) {
        const WORKSPACE = this.getWorkspaceOfTarget(target);
        if (!WORKSPACE) {
            return false;
        }
        const TARGETS = deploy_targets.getTargetsByName(target.targets, target.__workspace.getTargets());
        if (false === TARGETS) {
            throw new Error(WORKSPACE.t('targets.atLeastOneNotFound'));
        }
        if (throwIfNonFound) {
            if (TARGETS.length < 1) {
                throw new Error(WORKSPACE.t('targets.noneFound'));
            }
        }
        deploy_targets.throwOnRecurrence(target, TARGETS);
        const PREPARED_TARGETS = await Promise.resolve(this.prepareTargetsMany(target, TARGETS, operation));
        if (false === PREPARED_TARGETS) {
            return false;
        }
        return deploy_helpers.asArray(PREPARED_TARGETS);
    }
    async invokeForEachTarget(myTarget, targets, operation, isCancelling, action) {
        const ME = this;
        if (!myTarget) {
            return;
        }
        if (false === targets) {
            return;
        }
        let pluginResolver;
        switch (operation) {
            case deploy_contracts.DeployOperation.Delete:
                pluginResolver = (t) => t.__workspace.getDeletePlugins(t);
                break;
            case deploy_contracts.DeployOperation.Deploy:
                pluginResolver = (t) => t.__workspace.getUploadPlugins(t);
                break;
            case deploy_contracts.DeployOperation.ListDirectory:
                pluginResolver = (t) => t.__workspace.getListPlugins(t);
                break;
            case deploy_contracts.DeployOperation.Pull:
                pluginResolver = (t) => t.__workspace.getDownloadPlugins(t);
                break;
        }
        for (const T of deploy_helpers.asArray(targets)) {
            if (isCancelling()) {
                return;
            }
            const PREPARED_TARGETS = await Promise.resolve(ME.prepareTarget(myTarget, T, operation));
            if (false === PREPARED_TARGETS) {
                return;
            }
            const ALL_TARGETS = deploy_helpers.asArray(PREPARED_TARGETS);
            for (const TARGET of ALL_TARGETS) {
                for (const PI of pluginResolver(TARGET)) {
                    if (isCancelling()) {
                        return;
                    }
                    await Promise.resolve(action(TARGET, PI));
                }
            }
        }
    }
    /** @inheritdoc */
    async listDirectory(context) {
        const ME = this;
        let firstResult;
        await ME.invokeForEachTarget(await Promise.resolve(ME.prepareBaseTarget(context.target)), await ME.getFirstTarget(context.target, deploy_contracts.DeployOperation.ListDirectory), deploy_contracts.DeployOperation.ListDirectory, () => context.isCancelling, async (target, plugin) => {
            const CTX = {
                cancellationToken: undefined,
                dir: context.dir,
                isCancelling: undefined,
                target: target,
                workspace: target.__workspace,
            };
            // CTX.cancellationToken
            Object.defineProperty(CTX, 'cancellationToken', {
                enumerable: true,
                get: () => {
                    return context.cancellationToken;
                }
            });
            // CTX.isCancelling
            Object.defineProperty(CTX, 'isCancelling', {
                enumerable: true,
                get: () => {
                    return context.isCancelling;
                }
            });
            firstResult = await Promise.resolve(plugin.listDirectory(CTX));
        });
        let result;
        if (firstResult) {
            result = {
                dirs: deploy_helpers.asArray(firstResult.dirs),
                files: deploy_helpers.asArray(firstResult.files),
                info: deploy_files.createDefaultDirectoryInfo(context.dir),
                others: deploy_helpers.asArray(firstResult.others),
                target: context.target,
            };
        }
        return result;
    }
    /**
     * Maps file objects for a specific target.
     *
     * @param {TTarget} baseTarget The base target, using by that plugin.
     * @param {Target} target The underlying target.
     * @param {TFile|TFile[]} files The file targets to (re)map.
     *
     * @return {Promise<TFile[]>} The promise with the new, mapped objects.
     */
    async mapFilesForTarget(baseTarget, target, files) {
        return await deploy_targets.mapFilesForTarget(target, files);
    }
    /**
     * Maps folder objects for a specific target.
     *
     * @param {TTarget} baseTarget The base target, using by that plugin.
     * @param {Target} target The underlying target.
     * @param {TFolder|TFolder[]} folders The folder targets to (re)map.
     *
     * @return {Promise<TFolder[]>} The promise with the new, mapped objects.
     */
    async mapFoldersForTarget(baseTarget, target, folders) {
        return await deploy_targets.mapFoldersForTarget(target, folders);
    }
    /**
     * Prepares a base target.
     *
     * @param {TTarget} baseTarget The base target.
     *
     * @return {PrepareBaseTargetResult<TTarget>|PromiseLike<PrepareBaseTargetResult<TTarget>>} The result of the prepared target.
     */
    prepareBaseTarget(baseTarget) {
        return baseTarget;
    }
    /**
     * Prepares a target.
     *
     * @param {TTarget} myTarget The base target.
     * @param {deploy_targets.Target} target The input target.
     * @param {deploy_contracts.DeployOperation} operation The underlying operation.
     *
     * @return {PrepareTargetsResult|PromiseLike<PrepareTargetsResult>} The target(s) to use.
     */
    prepareTarget(myTarget, target, operation) {
        return target;
    }
    /**
     * Prepares targets.
     *
     * @param {TTarget} myTarget The base target.
     * @param {deploy_targets.Target|deploy_targets.Target[]} targets The input targets.
     * @param {deploy_contracts.DeployOperation} operation The underlying operation.
     *
     * @return {PrepareTargetsResult|PromiseLike<PrepareTargetsResult>} The target(s) to use.
     */
    prepareTargetsMany(myTarget, targets, operation) {
        return deploy_helpers.asArray(targets);
    }
    /** @inheritdoc */
    async removeFolders(context) {
        const ME = this;
        await ME.invokeForEachTarget(await Promise.resolve(ME.prepareBaseTarget(context.target)), await ME.getTargets(context.target, deploy_contracts.DeployOperation.RemoveFolders), deploy_contracts.DeployOperation.RemoveFolders, () => context.isCancelling, async (target, plugin) => {
            const CTX = {
                cancellationToken: undefined,
                folders: (await ME.mapFoldersForTarget(context.target, target, context.folders)).map(f => {
                    return deploy_targets.wrapOnBeforeFolderCallbackForTarget(f, target, 'onBeforeRemove');
                }),
                isCancelling: undefined,
                target: target,
            };
            // CTX.cancellationToken
            Object.defineProperty(CTX, 'cancellationToken', {
                enumerable: true,
                get: () => {
                    return context.cancellationToken;
                }
            });
            // CTX.isCancelling
            Object.defineProperty(CTX, 'isCancelling', {
                enumerable: true,
                get: () => {
                    return context.isCancelling;
                }
            });
            await Promise.resolve(plugin.removeFolders(CTX));
        });
    }
    /** @inheritdoc */
    async uploadFiles(context) {
        const ME = this;
        await ME.invokeForEachTarget(await Promise.resolve(ME.prepareBaseTarget(context.target)), await ME.getTargets(context.target, deploy_contracts.DeployOperation.Deploy), deploy_contracts.DeployOperation.Deploy, () => context.isCancelling, async (target, plugin) => {
            const CTX = {
                cancellationToken: undefined,
                files: (await ME.mapFilesForTarget(context.target, target, context.files)).map(f => {
                    return deploy_targets.wrapOnBeforeFileCallbackForTarget(f, target, 'onBeforeUpload');
                }),
                isCancelling: undefined,
                target: target,
            };
            // CTX.cancellationToken
            Object.defineProperty(CTX, 'cancellationToken', {
                enumerable: true,
                get: () => {
                    return context.cancellationToken;
                }
            });
            // CTX.isCancelling
            Object.defineProperty(CTX, 'isCancelling', {
                enumerable: true,
                get: () => {
                    return context.isCancelling;
                }
            });
            await Promise.resolve(plugin.uploadFiles(CTX));
        });
    }
}
exports.IterablePluginBase = IterablePluginBase;
/**
 * Checks if a plugin can delete files.
 *
 * @param {Plugin} plugin The plugin.
 * @param {deploy_targets.Target} target The target.
 *
 * @return {boolean} Can delete or not.
 */
function canDelete(plugin, target) {
    return canDo(plugin, target, p => p.canDelete, p => p.deleteFiles);
}
exports.canDelete = canDelete;
function canDo(plugin, target, canFlagResolver, methodResolver) {
    if (!plugin || !target) {
        return false;
    }
    const PLUGIN_TYPE = deploy_helpers.normalizeString(plugin.__type);
    const TARGET_TYPE = deploy_targets.normalizeTargetType(target);
    const CAN_FLAG = deploy_helpers.toBooleanSafe(canFlagResolver(plugin));
    const METHOD = methodResolver(plugin);
    return (TARGET_TYPE === PLUGIN_TYPE || '' === PLUGIN_TYPE) &&
        (CAN_FLAG && !_.isNil(METHOD));
}
/**
 * Checks if a plugin can download files.
 *
 * @param {Plugin} plugin The plugin.
 * @param {deploy_targets.Target} target The target.
 *
 * @return {boolean} Can download or not.
 */
function canDownload(plugin, target) {
    return canDo(plugin, target, p => p.canDownload, p => p.downloadFiles);
}
exports.canDownload = canDownload;
/**
 * Checks if a plugin can list directories.
 *
 * @param {Plugin} plugin The plugin.
 * @param {deploy_targets.Target} target The target.
 *
 * @return {boolean} Can list or not.
 */
function canList(plugin, target) {
    return canDo(plugin, target, p => p.canList, p => p.listDirectory);
}
exports.canList = canList;
/**
 * Checks if a plugin can remove folders.
 *
 * @param {Plugin} plugin The plugin.
 * @param {deploy_targets.Target} target The target.
 *
 * @return {boolean} Can remove folders or not.
 */
function canRemoveFolders(plugin, target) {
    return canDo(plugin, target, p => p.canRemoveFolders, p => p.removeFolders);
}
exports.canRemoveFolders = canRemoveFolders;
/**
 * Checks if a plugin can upload files.
 *
 * @param {Plugin} plugin The plugin.
 * @param {deploy_targets.Target} target The target.
 *
 * @return {boolean} Can upload or not.
 */
function canUpload(plugin, target) {
    return canDo(plugin, target, p => p.canUpload, p => p.uploadFiles);
}
exports.canUpload = canUpload;
//# sourceMappingURL=plugins.js.map