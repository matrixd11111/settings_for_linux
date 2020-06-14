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
const CopyPaste = require("copy-paste");
const deploy_contracts = require("./contracts");
const deploy_files = require("./files");
const deploy_helpers = require("./helpers");
const deploy_log = require("./log");
const deploy_plugins = require("./plugins");
const deploy_targets = require("./targets");
const deploy_transformers = require("./transformers");
const Enumerable = require("node-enumerable");
const FileSize = require("filesize");
const IsStream = require("is-stream");
const Path = require("path");
const vscode = require("vscode");
let nextPullCancelBtnCommandId = Number.MIN_SAFE_INTEGER;
async function createPullDataTransformer(target) {
    const WORKSPACE = target.__workspace;
    const TARGET_NAME = deploy_targets.getTargetName(target);
    const TRANSFORMER = await WORKSPACE.loadDataTransformer(target);
    if (false === TRANSFORMER) {
        throw new Error(WORKSPACE.t('targets.errors.couldNotLoadDataTransformer', TARGET_NAME));
    }
    return deploy_transformers.toDataTransformerSafe(deploy_transformers.toPasswordTransformer(TRANSFORMER, target));
}
function createPullDataTransformerContext(file, target) {
    const STATE_KEY = deploy_helpers.toStringSafe(target.__id);
    const WORKSPACE = target.__workspace;
    const TRANSFORMER_OPTIONS = deploy_helpers.cloneObject(target.transformerOptions);
    const CTX = {
        _: require('lodash'),
        context: {
            deployOperation: deploy_contracts.DeployOperation.Pull,
            remoteFile: deploy_helpers.normalizePath(deploy_helpers.normalizePath(file.path) +
                '/' +
                deploy_helpers.normalizePath(file.name)),
            target: target,
        },
        events: WORKSPACE.workspaceSessionState['pull']['events'],
        extension: WORKSPACE.context.extension,
        folder: WORKSPACE.folder,
        globalEvents: deploy_helpers.EVENTS,
        globals: WORKSPACE.globals,
        globalState: WORKSPACE.workspaceSessionState['pull']['states']['global'],
        homeDir: deploy_helpers.getExtensionDirInHome(),
        logger: WORKSPACE.createLogger(),
        mode: deploy_transformers.DataTransformerMode.Restore,
        options: TRANSFORMER_OPTIONS,
        output: WORKSPACE.output,
        replaceWithValues: (val) => {
            return WORKSPACE.replaceWithValues(val);
        },
        require: (id) => {
            return deploy_helpers.requireFromExtension(id);
        },
        sessionState: deploy_helpers.SESSION,
        settingFolder: WORKSPACE.settingFolder,
        state: undefined,
        workspaceRoot: WORKSPACE.rootPath,
    };
    // CTX.state
    Object.defineProperty(CTX, 'state', {
        enumerable: true,
        get: () => {
            return WORKSPACE.workspaceSessionState['pull']['states']['data_transformers'][STATE_KEY];
        },
        set: (newValue) => {
            WORKSPACE.workspaceSessionState['pull']['states']['data_transformers'][STATE_KEY] = newValue;
        }
    });
    return CTX;
}
function createSelectFileAction(file, target, transformer) {
    if (!file) {
        return;
    }
    return async () => {
        if (file.download) {
            const EXT = Path.extname(file.name);
            await deploy_helpers.invokeForTempFile(async (tempFile) => {
                let downloadedData = await Promise.resolve(file.download());
                // keep sure to have a buffer here
                downloadedData = await deploy_helpers.asBuffer(downloadedData);
                if (downloadedData) {
                    if (transformer) {
                        const CTX = createPullDataTransformerContext(file, target);
                        downloadedData = await Promise.resolve(transformer(downloadedData, CTX));
                    }
                }
                await deploy_helpers.writeFile(tempFile, downloadedData);
                const EDITOR = await vscode.workspace.openTextDocument(tempFile);
                await vscode.window.showTextDocument(EDITOR);
            }, {
                keep: true,
                postfix: EXT,
                prefix: Path.basename(file.name, EXT) + '-',
            });
        }
    };
}
/**
 * List a directory of a target.
 *
 * @param {deploy_targets.Target} target The target.
 * @param {string} [dir] The path to the sub directory.
 */
async function listDirectory(target, dir) {
    const ME = this;
    target = ME.prepareTarget(target);
    if (ME.isInFinalizeState) {
        return;
    }
    let fromCache = false;
    const LAST_DIR_CACHE = ME.workspaceSessionState['list']['lastDirectories'];
    const TARGET_NAME = deploy_targets.getTargetName(target);
    const TARGET_CACHE_KEY = target.__index + '::' + deploy_targets.getTargetIdHash(target);
    const PULL_TRANSFORMER = await createPullDataTransformer(target);
    if (arguments.length < 2) {
        // try to get last directory
        // from cache
        const LAST_DIR = LAST_DIR_CACHE[TARGET_CACHE_KEY];
        if (!deploy_helpers.isEmptyString(LAST_DIR)) {
            fromCache = true;
            dir = LAST_DIR;
        }
    }
    dir = deploy_helpers.toStringSafe(dir);
    let wholeOperationHasFailed = false;
    try {
        const PLUGINS = ME.getListPlugins(target);
        if (PLUGINS.length < 1) {
            ME.showWarningMessage(ME.t('targets.noPluginsFound'));
            return;
        }
        let displayDir = dir;
        if (deploy_helpers.isEmptyString(displayDir)) {
            displayDir = '/';
        }
        let selfInfo;
        const FILES_AND_FOLDERS = await deploy_helpers.withProgress(async (progress) => {
            const CANCELLATION_SOURCE = new vscode.CancellationTokenSource();
            progress.cancellationToken.onCancellationRequested(() => {
                try {
                    CANCELLATION_SOURCE.cancel();
                }
                catch (e) {
                    ME.logger
                        .trace(e, 'list.listDirectory(3)');
                }
            });
            if (progress.cancellationToken.isCancellationRequested) {
                CANCELLATION_SOURCE.cancel();
            }
            try {
                const LOADED_FILES_AND_FILES = [];
                let index = -1;
                const TOTAL_COUNT = PLUGINS.length;
                while (PLUGINS.length > 0) {
                    if (CANCELLATION_SOURCE.token.isCancellationRequested) {
                        return false;
                    }
                    const PI = PLUGINS.shift();
                    progress.baseContext.report({
                        increment: 1.0 / TOTAL_COUNT * 100.0,
                        message: ME.t('listDirectory.loading', displayDir)
                    });
                    const CTX = {
                        cancellationToken: CANCELLATION_SOURCE.token,
                        dir: dir,
                        isCancelling: undefined,
                        target: target,
                        workspace: ME,
                    };
                    // CTX.isCancelling
                    Object.defineProperty(CTX, 'isCancelling', {
                        enumerable: true,
                        get: function () {
                            return this.cancellationToken.isCancellationRequested;
                        }
                    });
                    const ITEMS = await PI.listDirectory(CTX);
                    if (ITEMS) {
                        selfInfo = ITEMS.info;
                        const LOADED_ITEMS = deploy_helpers.asArray(ITEMS.dirs).concat(deploy_helpers.asArray(ITEMS.files)).concat(deploy_helpers.asArray(ITEMS.others));
                        LOADED_FILES_AND_FILES.push
                            .apply(LOADED_FILES_AND_FILES, LOADED_ITEMS);
                    }
                }
                return LOADED_FILES_AND_FILES;
            }
            finally {
                deploy_helpers.tryDispose(CANCELLATION_SOURCE);
            }
        }, {
            cancellable: true,
            location: vscode.ProgressLocation.Notification,
            title: `🔍 [${TARGET_NAME}]`,
        });
        if (false === FILES_AND_FOLDERS) {
            return;
        }
        const QUICK_PICK_ITEMS = [];
        const FUNC_QUICK_PICK_ITEMS = [];
        const SHOW_QUICK_PICKS = async () => {
            let placeHolder = dir.trim();
            if (!placeHolder.startsWith('/')) {
                placeHolder = '/' + placeHolder;
            }
            let quickPicksToShow = QUICK_PICK_ITEMS.map(qp => qp);
            if (FUNC_QUICK_PICK_ITEMS.length > 0) {
                // functions
                // separator
                quickPicksToShow.push({
                    action: () => {
                        SHOW_QUICK_PICKS();
                    },
                    label: '-',
                    description: '',
                });
                quickPicksToShow = quickPicksToShow.concat(FUNC_QUICK_PICK_ITEMS);
            }
            const SELECTED_ITEM = await vscode.window.showQuickPick(quickPicksToShow, {
                placeHolder: ME.t('listDirectory.currentDirectory', placeHolder, TARGET_NAME),
            });
            if (SELECTED_ITEM) {
                if (SELECTED_ITEM.action) {
                    await Promise.resolve(SELECTED_ITEM.action());
                }
            }
        }; // SHOW_QUICK_PICKS()
        const LIST_DIRECTORY = async (d) => {
            listDirectory.apply(ME, [target, d]);
        }; // LIST_DIRECTORY()
        const SELECT_TARGET_DIR_FOR_SYNC_FOLDERS = async (label) => {
            let relPathOfDir = dir;
            if (deploy_helpers.isEmptyString(relPathOfDir)) {
                relPathOfDir = './';
            }
            const LOCAL_DIR = Path.resolve(Path.join(ME.rootPath, relPathOfDir));
            return await vscode.window.showInputBox({
                placeHolder: label,
                prompt: ME.t('listDirectory.pull.enterLocalFolder'),
                value: LOCAL_DIR,
            });
        }; // SELECT_TARGET_DIR_FOR_SYNC_FOLDERS()
        const EXECUTE_SYNC_FOLDERS_ACTION = async (opts) => {
            const TARGET_DIR = await SELECT_TARGET_DIR_FOR_SYNC_FOLDERS(opts.label);
            if (deploy_helpers.isEmptyString(TARGET_DIR)) {
                return;
            }
            await deploy_helpers.withProgress(async (progress) => {
                await opts.action(target, dir, TARGET_DIR, PULL_TRANSFORMER, progress, opts.recursive);
            }, {
                cancellable: true,
                location: vscode.ProgressLocation.Notification,
                title: opts.title,
            });
        }; // EXECUTE_SYNC_FOLDERS_ACTION()
        let numberOfDirs = 0;
        let numberOfFiles = 0;
        FILES_AND_FOLDERS.sort((x, y) => {
            // first by type:
            // 
            // 1. directories
            // 2. others
            const COMP0 = deploy_helpers.compareValuesBy(x, y, (f) => {
                return deploy_files.FileSystemType.Directory == f.type ? 0 : 1;
            });
            if (0 !== COMP0) {
                return COMP0;
            }
            // custom comparer?
            if (x.type == y.type) {
                if (x.compareTo) {
                    const COMP1 = x.compareTo(y);
                    if (0 != COMP1) {
                        return COMP1;
                    }
                }
            }
            // then by name
            const COMP2 = deploy_helpers.compareValuesBy(x, y, (f) => {
                return deploy_helpers.normalizeString(f.name);
            });
            if (0 !== COMP2) {
                return COMP2;
            }
            // then by timestamp (DESC)
            return deploy_helpers.compareValuesBy(y, x, (f) => {
                const LT = deploy_helpers.asLocalTime(f.time);
                if (LT) {
                    return LT.unix();
                }
            });
        }).forEach(f => {
            let label = deploy_helpers.toStringSafe(f.name).trim();
            if ('' === label) {
                label = ME.t('listDirectory.noName');
            }
            const DETAIL_ITEMS = [];
            const GET_ICON_SAFE = (defaultIcon) => {
                let icon = deploy_helpers.toStringSafe(f.icon).trim();
                if ('' === icon) {
                    icon = defaultIcon;
                }
                return '$(' + icon + ')  ';
            };
            let action;
            if (deploy_files.FileSystemType.Directory == f.type) {
                // directory
                label = GET_ICON_SAFE('file-directory') + label;
                action = async () => {
                    let pathPart = f.internal_name;
                    if (deploy_helpers.isEmptyString(pathPart)) {
                        pathPart = f.name;
                    }
                    LIST_DIRECTORY(dir + '/' + pathPart);
                };
                ++numberOfDirs;
            }
            else if (deploy_files.FileSystemType.File == f.type) {
                // file
                label = GET_ICON_SAFE('file-binary') + label;
                action = createSelectFileAction(f, target, PULL_TRANSFORMER);
                ++numberOfFiles;
            }
            else {
                label = GET_ICON_SAFE('question') + label;
            }
            if (deploy_files.FileSystemType.Directory != f.type) {
                if (!isNaN(f.size)) {
                    DETAIL_ITEMS.push(ME.t('listDirectory.size', FileSize(f.size, { round: 2 })));
                }
            }
            const LOCAL_TIME = deploy_helpers.asLocalTime(f.time);
            if (LOCAL_TIME && LOCAL_TIME.isValid()) {
                DETAIL_ITEMS.push(ME.t('listDirectory.lastModified', LOCAL_TIME.format(ME.t('time.dateTimeWithSeconds'))));
            }
            QUICK_PICK_ITEMS.push({
                label: label,
                description: '',
                detail: DETAIL_ITEMS.join(', '),
                action: action,
            });
        });
        if (!deploy_helpers.isEmptyString(dir)) {
            let parentDir = Enumerable.from(dir.split('/')).skipLast()
                .joinToString('/');
            QUICK_PICK_ITEMS.unshift({
                label: '..',
                description: '',
                detail: ME.t('listDirectory.parentDirectory'),
                action: async () => {
                    LIST_DIRECTORY(parentDir);
                }
            });
        }
        if (QUICK_PICK_ITEMS.length < 1) {
            QUICK_PICK_ITEMS.push({
                label: ME.t('listDirectory.directoryIsEmpty'),
                description: '',
            });
        }
        // functions
        {
            if (deploy_helpers.isObject(selfInfo)) {
                let exportPath = deploy_helpers.toStringSafe(selfInfo.exportPath);
                if (deploy_helpers.isEmptyString(exportPath)) {
                    exportPath = dir;
                }
                if (!deploy_helpers.isEmptyString(exportPath)) {
                    // copy path to clipboard
                    FUNC_QUICK_PICK_ITEMS.push({
                        action: async () => {
                            try {
                                await Promise.resolve(CopyPaste.copy(exportPath));
                            }
                            catch (e) {
                                deploy_log.CONSOLE
                                    .trace(e, 'list.listDirectory(1)');
                                ME.showWarningMessage(ME.t('listDirectory.copyPathToClipboard.errors.failed', exportPath));
                            }
                        },
                        label: '$(clippy)  ' + ME.t('listDirectory.copyPathToClipboard.label'),
                        description: ME.t('listDirectory.copyPathToClipboard.description'),
                    });
                }
            }
            if (numberOfDirs > 0 || numberOfFiles > 0) {
                // pull files
                {
                    // pull files
                    FUNC_QUICK_PICK_ITEMS.push({
                        action: async function () {
                            await EXECUTE_SYNC_FOLDERS_ACTION({
                                action: pullAllFilesFromDir,
                                label: ME.t('listDirectory.pull.folder.label'),
                                recursive: false,
                                title: ME.t('listDirectory.pull.folder.title'),
                            });
                        },
                        label: '$(cloud-download)  ' + ME.t('listDirectory.pull.folder.label'),
                        description: ME.t('listDirectory.pull.folder.description'),
                    });
                    // pull files with sub folders
                    FUNC_QUICK_PICK_ITEMS.push({
                        action: async function () {
                            await EXECUTE_SYNC_FOLDERS_ACTION({
                                action: pullAllFilesFromDir,
                                label: ME.t('listDirectory.pull.folderWithSubfolders.label'),
                                recursive: true,
                                title: ME.t('listDirectory.pull.folderWithSubfolders.title'),
                            });
                        },
                        label: '$(cloud-download)  ' + ME.t('listDirectory.pull.folderWithSubfolders.label'),
                        description: ME.t('listDirectory.pull.folderWithSubfolders.description'),
                    });
                }
            }
            if (deploy_helpers.isObject(selfInfo)) {
                let exportPath = deploy_helpers.toStringSafe(selfInfo.exportPath);
                if (deploy_helpers.isEmptyString(exportPath)) {
                    exportPath = dir;
                }
                if (!deploy_helpers.isEmptyString(exportPath)) {
                    // delete folder
                    FUNC_QUICK_PICK_ITEMS.push({
                        action: async function () {
                            const SELECTED_ITEM = await vscode.window.showWarningMessage(ME.t('listDirectory.removeFolder.askBeforeRemove', exportPath), {
                                isCloseAffordance: true,
                                title: ME.t('no'),
                                value: 0,
                            }, {
                                title: ME.t('yes'),
                                value: 1,
                            });
                            if (!SELECTED_ITEM || 1 !== SELECTED_ITEM.value) {
                                return;
                            }
                            await deploy_helpers.withProgress(async (progress) => {
                                await removeFolder(target, exportPath, progress);
                            }, {
                                cancellable: true,
                                location: vscode.ProgressLocation.Notification,
                                title: `💣 ` + ME.t('listDirectory.removeFolder.removing', exportPath)
                            });
                        },
                        label: '$(trashcan)  ' + ME.t('listDirectory.removeFolder.label'),
                        description: ME.t('listDirectory.removeFolder.description'),
                    });
                }
            }
        }
        await SHOW_QUICK_PICKS();
    }
    catch (e) {
        wholeOperationHasFailed = true;
        if (fromCache) {
            // reset and retry
            delete LAST_DIR_CACHE[TARGET_CACHE_KEY];
            await listDirectory.apply(this, arguments);
        }
        else {
            ME.logger
                .trace(e, 'list.listDirectory(2)');
            ME.showErrorMessage(ME.t('listDirectory.errors.failed', deploy_helpers.toDisplayablePath(dir), TARGET_NAME));
        }
    }
    finally {
        if (!wholeOperationHasFailed) {
            // cache
            LAST_DIR_CACHE[TARGET_CACHE_KEY] = dir;
        }
    }
}
exports.listDirectory = listDirectory;
async function pullAllFilesFromDir(target, sourceDir, targetDir, transformer, progress, recursive, depth, maxDepth) {
    const TARGET_NAME = deploy_targets.getTargetName(target);
    const WORKSPACE = target.__workspace;
    sourceDir = deploy_helpers.toStringSafe(sourceDir);
    targetDir = deploy_helpers.toStringSafe(targetDir);
    if (!Path.isAbsolute(targetDir)) {
        targetDir = Path.join(WORKSPACE.rootPath, targetDir);
    }
    targetDir = Path.resolve(targetDir);
    recursive = deploy_helpers.toBooleanSafe(recursive);
    if (isNaN(maxDepth)) {
        maxDepth = 64;
    }
    if (isNaN(depth)) {
        depth = 0;
    }
    if (depth >= maxDepth) {
        throw new Error(WORKSPACE.t('listDirectory.pull.errors.maxPathDepthReached', maxDepth));
    }
    if (progress.cancellationToken.isCancellationRequested) {
        return;
    }
    WORKSPACE.output.appendLine('');
    WORKSPACE.output.appendLine(WORKSPACE.t('listDirectory.pull.pullingFrom', sourceDir, targetDir));
    try {
        if (!(await deploy_helpers.exists(targetDir))) {
            await deploy_helpers.mkdirs(targetDir);
        }
        const PLUGINS = WORKSPACE.getListPlugins(target);
        while (PLUGINS.length > 0) {
            if (progress.cancellationToken.isCancellationRequested) {
                return;
            }
            const P = PLUGINS.shift();
            const CTX = {
                cancellationToken: progress.cancellationToken,
                dir: sourceDir,
                isCancelling: undefined,
                target: target,
                workspace: WORKSPACE,
            };
            // CTX.isCancelling
            Object.defineProperty(CTX, 'isCancelling', {
                enumerable: true,
                get: () => {
                    return CTX.cancellationToken.isCancellationRequested;
                }
            });
            const FILES_AND_FOLDERS = await P.listDirectory(CTX);
            if (!FILES_AND_FOLDERS) {
                continue;
            }
            const FILES = deploy_helpers.asArray(FILES_AND_FOLDERS.files).filter(f => {
                return deploy_helpers.isFunc(f.download);
            });
            if (FILES.length > 0) {
                const POPUP_STATS = {
                    failed: [],
                    operation: deploy_contracts.DeployOperation.Pull,
                    succeeded: [],
                };
                const FILES_TO_DOWNLOAD = [];
                FILES.forEach(f => {
                    const NAME_AND_PATH = {
                        path: deploy_helpers.normalizePath(sourceDir),
                        name: deploy_helpers.normalizePath(f.name),
                    };
                    const LOCAL_FILE = Path.resolve(Path.join(targetDir, f.name));
                    const SF = new deploy_plugins.SimpleFileToDownload(WORKSPACE, LOCAL_FILE, NAME_AND_PATH);
                    const UPDATE_PROGRESS = (message) => {
                        progress.baseContext.report({
                            message: message,
                        });
                    };
                    SF.onBeforeDownload = async function (source) {
                        const NOW = deploy_helpers.now();
                        if (arguments.length < 1) {
                            source = NAME_AND_PATH.path;
                        }
                        source = `${deploy_helpers.toStringSafe(source)} (${TARGET_NAME})`;
                        const PULL_TEXT = WORKSPACE.t('listDirectory.pull.pullingFile', deploy_helpers.toDisplayablePath(deploy_helpers.normalizePath(NAME_AND_PATH.path + '/' + NAME_AND_PATH.name)));
                        WORKSPACE.output.append(`\t[${NOW.format(WORKSPACE.t('time.timeWithSeconds'))}] 🚚 ` +
                            PULL_TEXT + ' ');
                        UPDATE_PROGRESS(`🚚 ` + PULL_TEXT);
                        if (progress.cancellationToken.isCancellationRequested) {
                            WORKSPACE.output.appendLine(`✖️`);
                        }
                    };
                    SF.onDownloadCompleted = async function (err, downloadedFile) {
                        let disposeDownloadedFile = false;
                        try {
                            if (err) {
                                throw err;
                            }
                            let dataToWrite;
                            if (downloadedFile) {
                                if (Buffer.isBuffer(downloadedFile)) {
                                    dataToWrite = downloadedFile;
                                }
                                else if (IsStream(downloadedFile)) {
                                    dataToWrite = downloadedFile;
                                }
                                else if (deploy_helpers.isObject(downloadedFile)) {
                                    disposeDownloadedFile = true;
                                    dataToWrite = await Promise.resolve(downloadedFile.read());
                                }
                                else {
                                    dataToWrite = downloadedFile;
                                }
                                // keep sure we have a buffer here
                                dataToWrite = await deploy_helpers.asBuffer(dataToWrite);
                                const CONTEXT = createPullDataTransformerContext(NAME_AND_PATH, target);
                                if (transformer) {
                                    dataToWrite = await Promise.resolve(transformer(dataToWrite, CONTEXT));
                                }
                            }
                            if (dataToWrite) {
                                await deploy_helpers.writeFile(LOCAL_FILE, dataToWrite);
                            }
                            WORKSPACE.output
                                .appendLine(`✅`);
                            POPUP_STATS.succeeded.push(LOCAL_FILE);
                        }
                        catch (e) {
                            WORKSPACE.output
                                .append(`[🔥: '${deploy_helpers.toStringSafe(e)}']`);
                            POPUP_STATS.failed.push(LOCAL_FILE);
                            UPDATE_PROGRESS(WORKSPACE.t('error', e));
                        }
                        finally {
                            if (disposeDownloadedFile) {
                                deploy_helpers.tryDispose(downloadedFile);
                            }
                            WORKSPACE.output
                                .appendLine('');
                        }
                    };
                    FILES_TO_DOWNLOAD.push(SF);
                });
                const DL_CTX = {
                    cancellationToken: progress.cancellationToken,
                    files: FILES_TO_DOWNLOAD,
                    isCancelling: undefined,
                    target: target,
                };
                // DL_CTX.isCancelling
                Object.defineProperty(DL_CTX, 'isCancelling', {
                    enumerable: true,
                    get: () => {
                        return DL_CTX.cancellationToken.isCancellationRequested;
                    }
                });
                await P.downloadFiles(DL_CTX);
            }
            WORKSPACE.output.appendLine(`[${WORKSPACE.t('done')}]`);
            if (recursive) {
                // sub folders
                for (const D of deploy_helpers.asArray(FILES_AND_FOLDERS.dirs)) {
                    const NEW_SOURCE_DIR = deploy_helpers.normalizePath(deploy_helpers.normalizePath(sourceDir) +
                        '/' +
                        deploy_helpers.normalizePath(D.name));
                    const NEW_TARGET_DIR = Path.join(targetDir, deploy_helpers.toStringSafe(D.name));
                    await pullAllFilesFromDir(target, NEW_SOURCE_DIR, NEW_TARGET_DIR, transformer, progress, recursive, depth + 1);
                }
            }
        }
    }
    catch (e) {
        WORKSPACE.output.appendLine(`[🔥: '${deploy_helpers.toStringSafe(e)}']`);
    }
    finally {
        if (progress.cancellationToken.isCancellationRequested) {
            WORKSPACE.output.appendLine(`✖️`);
        }
    }
}
async function removeFolder(target, dir, progress) {
    const TARGET_NAME = deploy_targets.getTargetName(target);
    const WORKSPACE = target.__workspace;
    WORKSPACE.output.appendLine('');
    try {
        const PLUGINS = WORKSPACE.getRemoveFolderPlugins(target);
        const UPDATE_PROGRESS = (message) => {
            progress.baseContext.report({
                message: message,
            });
        };
        let watch;
        const START_WATCH = () => watch = deploy_helpers.startWatch();
        const STOP_WATCH = () => {
            if (watch) {
                WORKSPACE.output.appendLine(` [${watch.stop()} ms]`);
            }
            watch = null;
        };
        for (let i = 0; i < PLUGINS.length; i++) {
            if (progress.cancellationToken.isCancellationRequested) {
                break;
            }
            const P = PLUGINS[i];
            const FOLDER_TO_REMOVE = new deploy_plugins.SimpleFolderToRemove(WORKSPACE, undefined, {
                name: deploy_helpers.normalizePath(Path.basename(dir)),
                path: deploy_helpers.normalizePath(Path.dirname(dir)),
            });
            FOLDER_TO_REMOVE.onBeforeRemove = async (destination) => {
                const NOW = deploy_helpers.now();
                if (arguments.length < 1) {
                    destination = FOLDER_TO_REMOVE.path;
                }
                destination = `${deploy_helpers.toStringSafe(destination)} (${TARGET_NAME})`;
                const PROGRESS_MSG = `💣 ` +
                    WORKSPACE.t('listDirectory.currentFileOrFolder.removeFolder.removing', dir);
                WORKSPACE.output.append(`[${NOW.format(WORKSPACE.t('time.timeWithSeconds'))}] ` +
                    PROGRESS_MSG + ' ');
                UPDATE_PROGRESS(PROGRESS_MSG);
                if (progress.cancellationToken.isCancellationRequested) {
                    WORKSPACE.output.appendLine(`✖️`);
                }
                else {
                    START_WATCH();
                }
            };
            FOLDER_TO_REMOVE.onRemoveCompleted = async (err, deleteLocal) => {
                if (err) {
                    WORKSPACE.output.append(`🔥: '${deploy_helpers.toStringSafe(err)}'`);
                }
                else {
                    WORKSPACE.output.append(`✅`);
                }
                STOP_WATCH();
            };
            const CTX = {
                cancellationToken: progress.cancellationToken,
                folders: [FOLDER_TO_REMOVE],
                isCancelling: undefined,
                target: target,
            };
            // CTX.isCancelling
            Object.defineProperty(CTX, 'isCancelling', {
                enumerable: true,
                get: function () {
                    return this.cancellationToken.isCancellationRequested;
                }
            });
            await P.removeFolders(CTX);
        }
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'list.removeFolder(1)');
    }
}
//# sourceMappingURL=list.js.map