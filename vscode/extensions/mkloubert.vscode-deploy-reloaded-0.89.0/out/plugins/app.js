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
const ChildProcess = require("child_process");
const deploy_contracts = require("../contracts");
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_log = require("../log");
const deploy_plugins = require("../plugins");
const deploy_targets = require("../targets");
const deploy_values = require("../values");
const Enumerable = require("node-enumerable");
const Events = require("events");
const Moment = require("moment");
const Path = require("path");
const vscode = require("vscode");
class AppPlugin extends deploy_plugins.PluginBase {
    constructor() {
        super(...arguments);
        this._ARGS_SCRIPT_EVENTS = new Events.EventEmitter();
        this._ARGS_SCRIPT_STATES = {};
        this._GLOBAL_STATE = {};
        this._INPUT_SCRIPT_EVENTS = new Events.EventEmitter();
        this._INPUT_SCRIPT_STATES = {};
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
    async deleteFiles(context) {
        const ME = this;
        const FIRST_FILE = Enumerable.from(context.files).firstOrDefault();
        const OTHER_FILES = Enumerable.from(context.files).skip(1).toArray();
        if (!deploy_helpers.isSymbol(FIRST_FILE)) {
            await FIRST_FILE.onBeforeDelete(ME.getFileDestination(context.target, FIRST_FILE));
        }
        let err;
        try {
            await this.runApp(context.target, context.files, deploy_contracts.DeployOperation.Delete, () => context.isCancelling);
        }
        catch (e) {
            err = e;
        }
        finally {
            if (!deploy_helpers.isSymbol(FIRST_FILE)) {
                await FIRST_FILE.onDeleteCompleted(err);
            }
        }
        for (const F of OTHER_FILES) {
            if (context.isCancelling) {
                break;
            }
            await F.onBeforeDelete(deploy_helpers.toDisplayablePath(F.path));
            await F.onDeleteCompleted(err);
        }
    }
    async downloadFiles(context) {
        const ME = this;
        const FIRST_FILE = Enumerable.from(context.files).firstOrDefault();
        const OTHER_FILES = Enumerable.from(context.files).skip(1).toArray();
        if (!deploy_helpers.isSymbol(FIRST_FILE)) {
            await FIRST_FILE.onBeforeDownload(ME.getFileDestination(context.target, FIRST_FILE));
        }
        let err;
        try {
            await this.runApp(context.target, context.files, deploy_contracts.DeployOperation.Pull, () => context.isCancelling);
        }
        catch (e) {
            err = e;
        }
        finally {
            if (!deploy_helpers.isSymbol(FIRST_FILE)) {
                await FIRST_FILE.onDownloadCompleted(err);
            }
        }
        for (const F of OTHER_FILES) {
            if (context.isCancelling) {
                break;
            }
            await F.onBeforeDownload(deploy_helpers.toDisplayablePath(F.path));
            await F.onDownloadCompleted(err);
        }
    }
    getCwd(target) {
        const WORKSPACE = target.__workspace;
        let cwd = this.replaceWithValues(target, target.cwd);
        if (deploy_helpers.isEmptyString(cwd)) {
            return WORKSPACE.rootPath;
        }
        if (!Path.isAbsolute(cwd)) {
            cwd = Path.join(WORKSPACE.rootPath, cwd);
        }
        return Path.resolve(cwd);
    }
    getFilesOrFolders(target, filesOrFolders) {
        filesOrFolders = deploy_helpers.asArray(filesOrFolders);
        const CWD = this.getCwd(target);
        const USE_RELATIVE_PATHS = deploy_helpers.toBooleanSafe(target.useRelativePaths);
        let pathSeparator = this.replaceWithValues(target, target.pathSeparator);
        if (deploy_helpers.isEmptyString(pathSeparator)) {
            pathSeparator = Path.sep;
        }
        return filesOrFolders.map(f => {
            return Path.resolve(Path.join(CWD, deploy_helpers.normalizePath(f.path + '/' + f.name)));
        }).map(f => {
            if (USE_RELATIVE_PATHS) {
                if (f.startsWith(CWD)) {
                    f = f.substr(CWD.length);
                }
            }
            return f;
        }).map(f => {
            f = deploy_helpers.replaceAllStrings(f, '/', Path.sep);
            f = deploy_helpers.replaceAllStrings(f, Path.sep, '/');
            f = deploy_helpers.replaceAllStrings(f, '/', pathSeparator);
            return f;
        }).filter(f => !deploy_helpers.isEmptyString(f));
    }
    getFileDestination(target, file) {
        return deploy_helpers.toStringSafe(target.app);
    }
    getFolderDestination(target, folder) {
        return this.getFileDestination(target, folder);
    }
    getOutDirectory(target) {
        const WORKSPACE = target.__workspace;
        const CWD = this.getCwd(target);
        let outDir = this.replaceWithValues(target, target.outDirectory);
        if (deploy_helpers.isEmptyString(outDir)) {
            return CWD;
        }
        if (!Path.isAbsolute(outDir)) {
            outDir = Path.join(WORKSPACE.rootPath, outDir);
        }
        return Path.resolve(outDir);
    }
    async listDirectory(context) {
        const ME = this;
        const OUT_DIR = ME.getOutDirectory(context.target);
        let targetDir = Path.join(OUT_DIR, context.dir);
        targetDir = Path.resolve(targetDir);
        if (!context.workspace.isPathOf(targetDir)) {
            throw new Error(ME.t(context.target, 'plugins.app.invalidDirectory', context.dir));
        }
        let relativePath = targetDir.substr(OUT_DIR.length);
        relativePath = deploy_helpers.replaceAllStrings(relativePath, Path.sep, '/');
        while (relativePath.startsWith('/')) {
            relativePath = relativePath.substr(1);
        }
        while (relativePath.endsWith('/')) {
            relativePath = relativePath.substr(0, relativePath.length - 1);
        }
        if (deploy_helpers.isEmptyString(relativePath)) {
            relativePath = '';
        }
        const RESULT = {
            dirs: [],
            files: [],
            info: deploy_files.createDefaultDirectoryInfo(context.dir, {
                exportPath: targetDir,
            }),
            others: [],
            target: context.target,
        };
        if (context.isCancelling) {
            return;
        }
        const FILES_AND_FOLDERS = await deploy_helpers.readDir(targetDir);
        for (const F of FILES_AND_FOLDERS) {
            let fullPath = Path.join(targetDir, F);
            const STATS = await deploy_helpers.lstat(fullPath);
            let time;
            if (STATS.mtime) {
                time = Moment(STATS.mtime);
                if (time.isValid() && !time.isUTC()) {
                    time = time.utc();
                }
            }
            const SIZE = STATS.size;
            if (STATS.isDirectory()) {
                const DI = {
                    exportPath: Path.resolve(Path.join(OUT_DIR, F)),
                    name: F,
                    path: relativePath,
                    size: SIZE,
                    time: time,
                    type: deploy_files.FileSystemType.Directory,
                };
                RESULT.dirs.push(DI);
            }
            else if (STATS.isFile()) {
                const FI = {
                    download: async () => {
                        return deploy_helpers.readFile(fullPath);
                    },
                    exportPath: Path.resolve(Path.join(OUT_DIR, F)),
                    name: F,
                    path: relativePath,
                    size: SIZE,
                    time: time,
                    type: deploy_files.FileSystemType.File,
                };
                RESULT.files.push(FI);
            }
            else {
                const FSI = {
                    exportPath: Path.resolve(Path.join(OUT_DIR, F)),
                    name: F,
                    path: relativePath,
                    size: SIZE,
                    time: time,
                };
                RESULT.others.push(FSI);
            }
        }
        return RESULT;
    }
    onDispose() {
        this._ARGS_SCRIPT_EVENTS.removeAllListeners();
        this._INPUT_SCRIPT_EVENTS.removeAllListeners();
    }
    async removeFolders(context) {
        const FIRST_FOLDER = Enumerable.from(context.folders).firstOrDefault();
        const OTHER_FOLDERS = Enumerable.from(context.folders).skip(1).toArray();
        if (!deploy_helpers.isSymbol(FIRST_FOLDER)) {
            await FIRST_FOLDER.onBeforeRemove(this.getFolderDestination(context.target, FIRST_FOLDER));
        }
        let err;
        try {
            await this.runApp(context.target, context.folders, deploy_contracts.DeployOperation.RemoveFolders, () => context.isCancelling);
        }
        catch (e) {
            err = e;
        }
        finally {
            if (!deploy_helpers.isSymbol(FIRST_FOLDER)) {
                await FIRST_FOLDER.onRemoveCompleted(err);
            }
        }
        for (const F of OTHER_FOLDERS) {
            if (context.isCancelling) {
                break;
            }
            await F.onBeforeRemove(deploy_helpers.toDisplayablePath(F.path));
            await F.onRemoveCompleted(err);
        }
    }
    runApp(target, filesOrFoldersWithPath, operation, isCancelling) {
        const ME = this;
        const TARGET_NAME = deploy_targets.getTargetName(target);
        const WORKSPACE = target.__workspace;
        const FILES_OR_FOLDERS = ME.getFilesOrFolders(target, filesOrFoldersWithPath);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const CWD = ME.getCwd(target);
                const OUT_DIRECTORY = ME.getOutDirectory(target);
                const SUBMIT_FILELIST = deploy_helpers.toBooleanSafe(target.submitFileList, true);
                const USE_PLACEHOLDERS = deploy_helpers.toBooleanSafe(target.usePlaceholders);
                const APP = ME.replaceWithValues(target, target.app);
                let operationFlagDetector = () => undefined;
                switch (operation) {
                    case deploy_contracts.DeployOperation.Delete:
                        operationFlagDetector = (t) => t.deleteFlag;
                        break;
                    case deploy_contracts.DeployOperation.Deploy:
                        operationFlagDetector = (t) => t.deployFlag;
                        break;
                    case deploy_contracts.DeployOperation.Pull:
                        operationFlagDetector = (t) => t.pullFlag;
                        break;
                    case deploy_contracts.DeployOperation.RemoveFolders:
                        operationFlagDetector = (t) => t.removeFoldersFlag;
                        break;
                }
                let operationFlag = deploy_helpers.toStringSafe(operationFlagDetector(target));
                if (deploy_helpers.isEmptyString(operationFlag)) {
                    operationFlag = false;
                }
                let fileSeparator = deploy_helpers.toStringSafe(ME.replaceWithValues(target, target.fileSeparator));
                if ('' === fileSeparator) {
                    fileSeparator = ',';
                }
                const ADDITIONAL_VALUES = [
                    new deploy_values.FunctionValue(() => {
                        return CWD;
                    }, 'cwd'),
                    new deploy_values.FunctionValue(() => {
                        return FILES_OR_FOLDERS.join(fileSeparator);
                    }, deploy_contracts.DeployOperation.RemoveFolders !== operation ? 'filesToDeploy' : 'foldersToHandle'),
                    new deploy_values.FunctionValue(() => {
                        return false === operationFlag ? '' : operationFlag;
                    }, 'operationFlag'),
                    new deploy_values.FunctionValue(() => {
                        return OUT_DIRECTORY;
                    }, 'outDirectory'),
                    new deploy_values.FunctionValue(() => {
                        return target.name;
                    }, 'target'),
                ];
                const REPLACE_WITH_VALUES = (val) => {
                    return ME.replaceWithValues(target, val, ADDITIONAL_VALUES);
                };
                let args;
                if (deploy_helpers.isNullOrUndefined(target.arguments)) {
                    args = [];
                }
                else {
                    if (Array.isArray(target.arguments)) {
                        args = target.arguments;
                    }
                    else {
                        // via script
                        let argsScriptFilePath = REPLACE_WITH_VALUES(target.arguments);
                        let argsScriptFile = argsScriptFilePath;
                        if (!Path.isAbsolute(argsScriptFile)) {
                            argsScriptFile = await ME.getExistingSettingPath(target, argsScriptFile);
                        }
                        if (false === argsScriptFile) {
                            throw new Error(ME.t(target, 'fileNotFound', argsScriptFilePath));
                        }
                        argsScriptFile = Path.resolve(argsScriptFile);
                        const SCRIPT_MODULE = deploy_helpers.loadModule(argsScriptFile);
                        if (SCRIPT_MODULE) {
                            const GET_ARGUMENTS = SCRIPT_MODULE.getArguments;
                            if (GET_ARGUMENTS) {
                                const ARGS = {
                                    _: require('lodash'),
                                    cwd: CWD,
                                    events: ME._ARGS_SCRIPT_EVENTS,
                                    extension: WORKSPACE.context.extension,
                                    files: deploy_contracts.DeployOperation.RemoveFolders !== operation ? FILES_OR_FOLDERS.map(f => f)
                                        : undefined,
                                    folder: WORKSPACE.folder,
                                    folders: deploy_contracts.DeployOperation.RemoveFolders === operation ? FILES_OR_FOLDERS.map(f => f)
                                        : undefined,
                                    globalEvents: deploy_helpers.EVENTS,
                                    globals: WORKSPACE.globals,
                                    globalState: ME._GLOBAL_STATE,
                                    homeDir: deploy_helpers.getExtensionDirInHome(),
                                    logger: WORKSPACE.createLogger(),
                                    operation: operation,
                                    options: deploy_helpers.cloneObject(target.argumentScriptOptions),
                                    outDirectory: OUT_DIRECTORY,
                                    replaceWithValues: (val) => {
                                        return REPLACE_WITH_VALUES(val);
                                    },
                                    require: (id) => {
                                        return deploy_helpers.requireFromExtension(id);
                                    },
                                    sessionState: deploy_helpers.SESSION,
                                    settingFolder: undefined,
                                    state: undefined,
                                    target: target,
                                    output: undefined,
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
                                        return ME._ARGS_SCRIPT_STATES[argsScriptFile];
                                    },
                                    set: (newValue) => {
                                        ME._ARGS_SCRIPT_STATES[argsScriptFile] = newValue;
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
                                args = await Promise.resolve(deploy_helpers.applyFuncFor(GET_ARGUMENTS, SCRIPT_MODULE)(ARGS));
                            }
                        }
                    }
                }
                if (deploy_helpers.isNullOrUndefined(target.arguments)) {
                    args = [];
                }
                else {
                    args = deploy_helpers.asArray(args, false);
                }
                if (false !== operationFlag) {
                    if (deploy_helpers.toBooleanSafe(target.appendOperationFlag)) {
                        args.push(operationFlag);
                    }
                    else {
                        args = [operationFlag].concat(args);
                    }
                }
                if (SUBMIT_FILELIST) {
                    let fileOrFolderArgs;
                    if (deploy_helpers.toBooleanSafe(target.asOneArgument)) {
                        fileOrFolderArgs = [
                            FILES_OR_FOLDERS.join(fileSeparator)
                        ];
                    }
                    else {
                        fileOrFolderArgs = FILES_OR_FOLDERS;
                    }
                    if (deploy_helpers.toBooleanSafe(target.prependFileList)) {
                        args = fileOrFolderArgs.concat(args);
                    }
                    else {
                        args = args.concat(fileOrFolderArgs);
                    }
                }
                args = args.map(a => {
                    if (USE_PLACEHOLDERS) {
                        a = REPLACE_WITH_VALUES(a);
                    }
                    return deploy_helpers.toStringSafe(a);
                });
                if (isCancelling()) {
                    return;
                }
                const GET_ENCODING = () => {
                    let enc = deploy_helpers.normalizeString(REPLACE_WITH_VALUES(target.inputEncoding));
                    if ('' === enc) {
                        enc = false;
                    }
                    return enc;
                };
                let stdInput = false;
                if (!deploy_helpers.isNullOrUndefined(target.input)) {
                    if (deploy_helpers.toBooleanSafe(target.inputIsScript)) {
                        // via script
                        let inputScriptFilePath = REPLACE_WITH_VALUES(target.input);
                        let inputScriptFile = inputScriptFilePath;
                        if (!Path.isAbsolute(inputScriptFile)) {
                            inputScriptFile = await ME.getExistingSettingPath(target, inputScriptFile);
                        }
                        if (false === inputScriptFile) {
                            throw new Error(ME.t(target, 'fileNotFound', inputScriptFilePath));
                        }
                        inputScriptFile = Path.resolve(inputScriptFile);
                        const SCRIPT_MODULE = deploy_helpers.loadModule(inputScriptFile);
                        if (SCRIPT_MODULE) {
                            let inputValue;
                            const GET_INPUT = SCRIPT_MODULE.getInput;
                            if (GET_INPUT) {
                                const ARGS = {
                                    _: require('lodash'),
                                    arguments: args,
                                    cwd: CWD,
                                    events: ME._INPUT_SCRIPT_EVENTS,
                                    extension: WORKSPACE.context.extension,
                                    files: deploy_contracts.DeployOperation.RemoveFolders !== operation ? FILES_OR_FOLDERS.map(f => f)
                                        : undefined,
                                    folder: WORKSPACE.folder,
                                    folders: deploy_contracts.DeployOperation.RemoveFolders === operation ? FILES_OR_FOLDERS.map(f => f)
                                        : undefined,
                                    globalEvents: deploy_helpers.EVENTS,
                                    globals: WORKSPACE.globals,
                                    globalState: ME._GLOBAL_STATE,
                                    homeDir: deploy_helpers.getExtensionDirInHome(),
                                    logger: WORKSPACE.createLogger(),
                                    operation: operation,
                                    options: deploy_helpers.cloneObject(target.inputScriptOptions),
                                    outDirectory: OUT_DIRECTORY,
                                    output: undefined,
                                    replaceWithValues: (val) => {
                                        return REPLACE_WITH_VALUES(val);
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
                                        return ME._INPUT_SCRIPT_STATES[inputScriptFile];
                                    },
                                    set: (newValue) => {
                                        ME._INPUT_SCRIPT_STATES[inputScriptFile] = newValue;
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
                                const GET_INPUT_RESULT = await Promise.resolve(deploy_helpers.applyFuncFor(GET_INPUT, SCRIPT_MODULE)(ARGS));
                                if (!deploy_helpers.isNullOrUndefined(GET_INPUT_RESULT)) {
                                    if (deploy_helpers.isString(GET_INPUT_RESULT)) {
                                        inputValue = GET_INPUT_RESULT;
                                    }
                                    else {
                                        const ENC = GET_ENCODING();
                                        const BUFF = await deploy_helpers.asBuffer(GET_INPUT_RESULT);
                                        if (BUFF) {
                                            if (false !== ENC) {
                                                inputValue = BUFF.toString(ENC);
                                            }
                                            else {
                                                inputValue = BUFF.toString();
                                            }
                                        }
                                    }
                                }
                            }
                            stdInput = deploy_helpers.toStringSafe(inputValue);
                        }
                    }
                    else {
                        // from value
                        stdInput = REPLACE_WITH_VALUES(target.input);
                    }
                }
                if ('' === stdInput) {
                    stdInput = false;
                }
                if (deploy_helpers.toBooleanSafe(target.runInTerminal)) {
                    const SHELL_PATH = Path.resolve(Path.join(CWD, APP));
                    const TERMIMAL = vscode.window.createTerminal({
                        cwd: CWD,
                        env: process.env,
                        name: deploy_targets.getTargetName(target),
                        shellArgs: args,
                        shellPath: SHELL_PATH,
                    });
                    TERMIMAL.show(false);
                    if (false !== stdInput) {
                        // send to stdin
                        TERMIMAL.sendText(stdInput);
                    }
                }
                else {
                    const ENC = GET_ENCODING();
                    const EXEC_OPTS = {
                        cwd: CWD,
                        env: process.env,
                    };
                    if (false !== ENC) {
                        EXEC_OPTS.encoding = ENC;
                    }
                    if (false !== stdInput) {
                        EXEC_OPTS.input = stdInput;
                    }
                    let output = ChildProcess.execFileSync(APP, args, EXEC_OPTS);
                    if (!output) {
                        output = Buffer.alloc(0);
                    }
                    if (deploy_helpers.toBooleanSafe(target.dumpOutput, true)) {
                        let outputStr;
                        if (false === ENC) {
                            outputStr = output.toString();
                        }
                        else {
                            outputStr = output.toString(ENC);
                        }
                        deploy_log.CONSOLE.debug(outputStr, `plugins.app(${TARGET_NAME})`);
                    }
                }
                COMPLETED(null);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    async uploadFiles(context) {
        const ME = this;
        const FIRST_FILE = Enumerable.from(context.files).firstOrDefault();
        const OTHER_FILES = Enumerable.from(context.files).skip(1).toArray();
        if (!deploy_helpers.isSymbol(FIRST_FILE)) {
            await FIRST_FILE.onBeforeUpload(ME.getFileDestination(context.target, FIRST_FILE));
        }
        let err;
        try {
            await this.runApp(context.target, context.files, deploy_contracts.DeployOperation.Deploy, () => context.isCancelling);
        }
        catch (e) {
            err = e;
        }
        finally {
            if (!deploy_helpers.isSymbol(FIRST_FILE)) {
                await FIRST_FILE.onUploadCompleted(err);
            }
        }
        for (const F of OTHER_FILES) {
            if (context.isCancelling) {
                break;
            }
            await F.onBeforeUpload(deploy_helpers.toDisplayablePath(F.path));
            await F.onUploadCompleted(err);
        }
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
    return new AppPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=app.js.map