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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ChildProcess = require("child_process");
const deploy_code = require("./code");
const deploy_contracts = require("./contracts");
const deploy_log = require("./log");
const Enumerable = require("node-enumerable");
const FS = require("fs");
const FSExtra = require("fs-extra");
const MimeTypes = require("mime-types");
const OS = require("os");
const Path = require("path");
const TMP = require("tmp");
const vscode = require("vscode");
const vscode_helpers_1 = require("vscode-helpers");
__export(require("vscode-helpers"));
/**
 * Handles a value as string and checks if it does match a file filter.
 *
 * @param {any} val The value to check.
 * @param {deploy_contracts.FileFilter} filter The filter.
 *
 * @return {boolean} Does match or not.
 */
function checkIfDoesMatchByFileFilter(val, filter) {
    if (!filter) {
        filter = {
            files: '**',
        };
    }
    const OPTS = {
        dot: true,
        nocase: true,
    };
    const IS_EXCLUDED = vscode_helpers_1.doesMatch(val, filter.exclude, OPTS);
    if (!IS_EXCLUDED) {
        return vscode_helpers_1.doesMatch(val, filter.files, OPTS);
    }
    return false;
}
exports.checkIfDoesMatchByFileFilter = checkIfDoesMatchByFileFilter;
/**
 * Clones an object / value without functions deep.
 *
 * @param {T} val The value / object to clone.
 *
 * @return {T} The cloned value / object.
 */
function cloneObjectWithoutFunctions(val) {
    if (!val) {
        return val;
    }
    const CLONED_OBJ = {};
    for (let P in val) {
        let valueToSet = val[P];
        if (isFunc(valueToSet)) {
            continue;
        }
        if (Array.isArray(valueToSet)) {
            let newArray = [];
            for (const ITEM of valueToSet) {
                newArray.push(vscode_helpers_1.cloneObject(ITEM));
            }
            valueToSet = newArray;
        }
        CLONED_OBJ[P] = valueToSet;
    }
    return CLONED_OBJ;
}
exports.cloneObjectWithoutFunctions = cloneObjectWithoutFunctions;
/**
 * Creates a new status bar button.
 *
 * @param {TButton} buttonDesc The description for the button.
 * @param {Function} [setup] On optional function which setups the new button.
 *                           If you return an explicit (false), the button will be disposed.
 *
 * @return {Promise<vscode.StatusBarItem>} The promise with new new button.
 */
async function createButton(buttonDesc, setup) {
    if (!buttonDesc) {
        return;
    }
    if (!vscode_helpers_1.toBooleanSafe(buttonDesc.enabled, true)) {
        return;
    }
    let newBtn;
    try {
        let alignment = vscode_helpers_1.toBooleanSafe(buttonDesc.isRight) ? vscode.StatusBarAlignment.Right
            : vscode.StatusBarAlignment.Left;
        let color = vscode_helpers_1.normalizeString(buttonDesc.color);
        if ('' === color) {
            color = new vscode.ThemeColor('button.foreground');
        }
        if (_.isString(color)) {
            if (!color.startsWith('#')) {
                color = new vscode.ThemeColor(color);
            }
        }
        let prio = parseInt(vscode_helpers_1.toStringSafe(buttonDesc.priority).trim());
        if (isNaN(prio)) {
            prio = undefined;
        }
        let text = vscode_helpers_1.toStringSafe(buttonDesc.text);
        if (vscode_helpers_1.isEmptyString(text)) {
            text = undefined;
        }
        let tooltip = vscode_helpers_1.toStringSafe(buttonDesc.tooltip);
        if (vscode_helpers_1.isEmptyString(tooltip)) {
            tooltip = undefined;
        }
        newBtn = vscode.window.createStatusBarItem(alignment, prio);
        newBtn.color = color;
        newBtn.text = text;
        newBtn.tooltip = tooltip;
        let dispose = false;
        if (setup) {
            dispose = !vscode_helpers_1.toBooleanSafe(await Promise.resolve(setup(newBtn, buttonDesc)), true);
        }
        if (dispose) {
            if (vscode_helpers_1.tryDispose(newBtn)) {
                newBtn = null;
            }
        }
        return newBtn;
    }
    catch (e) {
        vscode_helpers_1.tryDispose(newBtn);
        throw e;
    }
}
exports.createButton = createButton;
/**
 * Executes something.
 *
 * @param {string} command The thing / command to execute.
 * @param {ChildProcess.ExecOptions} [opts] Custom options.
 *
 * @return {Promise<ExecResult>} The promise with the result.
 */
async function exec(command, opts) {
    command = vscode_helpers_1.toStringSafe(command);
    if (!opts) {
        opts = {};
    }
    if (isNullOrUndefined(opts.env)) {
        opts.env = process.env;
    }
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            const RESULT = {
                stdErr: undefined,
                stdOut: undefined,
                process: undefined,
            };
            RESULT['process'] = ChildProcess.exec(command, opts, (err, stdout, stderr) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    RESULT['stdErr'] = stderr;
                    RESULT['stdOut'] = stdout;
                    COMPLETED(null, RESULT);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.exec = exec;
/**
 * Executes a file.
 *
 * @param {string} command The thing / command to execute.
 * @param {any[]} [args] One or more argument for the execution.
 * @param {ChildProcess.ExecFileOptions} [opts] Custom options.
 *
 * @return {Promise<ExecResult>} The promise with the result.
 */
async function execFile(command, args, opts) {
    command = vscode_helpers_1.toStringSafe(command);
    if (isNullOrUndefined(args)) {
        args = [];
    }
    else {
        args = vscode_helpers_1.asArray(args, false).map(a => {
            return vscode_helpers_1.toStringSafe(a);
        });
    }
    if (!opts) {
        opts = {};
    }
    if (isNullOrUndefined(opts.env)) {
        opts.env = process.env;
    }
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            const RESULT = {
                stdErr: undefined,
                stdOut: undefined,
                process: undefined,
            };
            RESULT['process'] = ChildProcess.execFile(command, args, opts, (err, stdout, stderr) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    RESULT['stdErr'] = stderr;
                    RESULT['stdOut'] = stdout;
                    COMPLETED(null, RESULT);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.execFile = execFile;
/**
 * Filters items with 'if' code.
 *
 * @param {TItem | TItem[]} items The items to filter.
 * @param {boolean} [throwOnError] Throw on error or not.
 * @param {any} [errorResult] The custom result when an error occurred.
 *
 * @return {TItem[]} The filtered items.
 */
function filterConditionalItems(items, throwOnError = false, errorResult = false) {
    items = vscode_helpers_1.asArray(items);
    throwOnError = vscode_helpers_1.toBooleanSafe(throwOnError);
    return items.filter(i => {
        return Enumerable.from(vscode_helpers_1.asArray(i.if)).all(c => {
            let res;
            try {
                const IF_CODE = vscode_helpers_1.toStringSafe(c);
                if (!vscode_helpers_1.isEmptyString(IF_CODE)) {
                    res = deploy_code.exec({
                        code: IF_CODE,
                        context: {
                            i: i,
                        },
                        values: [],
                    });
                }
            }
            catch (e) {
                deploy_log.CONSOLE
                    .trace(e, 'helpers.filterConditionalItems()');
                if (throwOnError) {
                    throw e;
                }
                return errorResult;
            }
            return vscode_helpers_1.toBooleanSafe(res, true);
        });
    });
}
exports.filterConditionalItems = filterConditionalItems;
/**
 * Filters platform specific objects.
 *
 * @param {TItem|TItem[]} items The items to filter.
 * @param {Function} [platformDetector] The custom platform detector.
 *
 * @return {TItem[]} The filtered items.
 */
function filterPlatformItems(items, platformDetector) {
    if (!platformDetector) {
        platformDetector = () => process.platform;
    }
    const CURRENT_PLATFORM = vscode_helpers_1.normalizeString(platformDetector());
    return vscode_helpers_1.asArray(items).filter(i => {
        const PLATFORMS = vscode_helpers_1.asArray(i.platforms).map(p => {
            return vscode_helpers_1.normalizeString(p);
        }).filter(p => '' !== p);
        if (PLATFORMS.length < 1) {
            return true;
        }
        return PLATFORMS.indexOf(CURRENT_PLATFORM) > -1;
    });
}
exports.filterPlatformItems = filterPlatformItems;
/**
 * Returns the (possible path) of the extension's sub folder inside the home directory.
 *
 * @return {string} The path of the extension's sub folder inside the home directory.
 */
function getExtensionDirInHome() {
    return Path.resolve(Path.join(OS.homedir(), deploy_contracts.HOMEDIR_SUBFOLDER));
}
exports.getExtensionDirInHome = getExtensionDirInHome;
/**
 * Returns the (possible path) of the extension's log sub folder inside the home directory.
 *
 * @return {string} The path of the extension's log sub folder inside the home directory.
 */
function getExtensionLogDirInHome() {
    return Path.resolve(Path.join(getExtensionDirInHome(), '.logs'));
}
exports.getExtensionLogDirInHome = getExtensionLogDirInHome;
/**
 * Returns the value from a "parameter" object.
 *
 * @param {Object} params The object.
 * @param {string} name The name of the parameter.
 * @param {TDefault} [defValue] The default value.
 *
 * @return {string|TDefault} The value of the parameter (if found).
 *                           Otherwise the value of 'defValue'.
 */
function getUriParam(params, name, defValue) {
    name = vscode_helpers_1.normalizeString(name);
    if (params) {
        for (const P in params) {
            if (vscode_helpers_1.normalizeString(P) === name) {
                return vscode_helpers_1.toStringSafe(params[P]);
            }
        }
    }
    return defValue;
}
exports.getUriParam = getUriParam;
/**
 * Invokes an action for a temporary file.
 *
 * @param {Function} action The action to invoke.
 * @param {InvokeForTempFileOptions} [opts] Custom options.
 *
 * @return {TResult} The result of the action.
 */
function invokeForTempFile(action, opts) {
    if (!opts) {
        opts = {};
    }
    return new Promise((resolve, reject) => {
        let tempFile;
        const COMPLETED = (err, result) => {
            try {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            }
            finally {
                // remove temp file?
                if (!vscode_helpers_1.toBooleanSafe(opts.keep)) {
                    try {
                        if (!vscode_helpers_1.isEmptyString(tempFile)) {
                            if (FS.existsSync(tempFile)) {
                                FS.unlinkSync(tempFile);
                            }
                        }
                    }
                    catch (e) {
                        deploy_log.CONSOLE
                            .trace(e, 'helpers.invokeForTempFile');
                    }
                }
            }
        };
        try {
            TMP.tmpName({
                keep: true,
                prefix: opts.prefix,
                postfix: opts.postfix,
            }, (err, tf) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    try {
                        tempFile = Path.resolve(tf);
                        vscode_helpers_1.buildWorkflow().next(async () => {
                            if (!isNullOrUndefined(opts.data)) {
                                await writeFile(tempFile, opts.data);
                            }
                        }).next(async () => {
                            return await Promise.resolve(action(tf));
                        }).start().then((result) => {
                            COMPLETED(null, result);
                        }, (err) => {
                            COMPLETED(err);
                        });
                    }
                    catch (e) {
                        COMPLETED(e);
                    }
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.invokeForTempFile = invokeForTempFile;
/**
 * Checks if a value is a boolean or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is boolean or not.
 */
function isBool(val) {
    return _.isBoolean(val);
}
exports.isBool = isBool;
/**
 * Checks if a value is a function or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is function or not.
 */
function isFunc(val) {
    return _.isFunction(val);
}
exports.isFunc = isFunc;
/**
 * Checks if a value represents a hex string.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Represents a hex string or not.
 */
function isHex(val) {
    return (/^([a-f|0-9]+)$/i).test(vscode_helpers_1.normalizeString(val));
}
exports.isHex = isHex;
/**
 * Checks if a value is (null) or (undefined).
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is (null)/(undefined) or not.
 */
function isNullOrUndefined(val) {
    return _.isNil(val);
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Checks if a value is an object or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is object or not.
 */
function isObject(val) {
    return !isNullOrUndefined(val) &&
        !Array.isArray(val) &&
        'object' === typeof val;
}
exports.isObject = isObject;
/**
 * Checks if a value is a string or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is string or not.
 */
function isString(val) {
    return !isNullOrUndefined(val) &&
        'string' === typeof val;
}
exports.isString = isString;
/**
 * Checks if a value is a symbol or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is symbol or not.
 */
function isSymbol(val) {
    return _.isSymbol(val);
}
exports.isSymbol = isSymbol;
/**
 * Promise version of 'FS.lstat()' function.
 *
 * @param {string|Buffer} path The path.
 *
 * @return {Promise<FS.Stats>} The promise with the stats.
 */
function lstat(path) {
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FS.lstat(path, (err, stats) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    COMPLETED(null, stats);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.lstat = lstat;
/**
 * Merges objects by their names. Last items win.
 *
 * @param {TObj | TObj[]} objs The object(s) to merge.
 * @param {Function} [nameResolver] The custom name resolver.
 * @param {Function} [nameNormalizer] The custom name normalizer.
 *
 * @return {TObj[]} The merged objects.
 */
function mergeByName(objs, nameResolver, nameNormalizer) {
    if (isNullOrUndefined(objs)) {
        return objs;
    }
    objs = vscode_helpers_1.asArray(objs);
    if (!nameResolver) {
        nameResolver = (o) => o.name;
    }
    if (!nameNormalizer) {
        nameNormalizer = (n) => vscode_helpers_1.normalizeString(n);
    }
    const TEMP = {};
    objs.forEach(o => {
        const NAME = vscode_helpers_1.toStringSafe(nameNormalizer(nameResolver(o)));
        TEMP[NAME] = o;
    });
    const RESULT = [];
    for (const N in TEMP) {
        RESULT.push(TEMP[N]);
    }
    return RESULT;
}
exports.mergeByName = mergeByName;
/**
 * Promise version of 'FSExtra.mkdirs()' function.
 *
 * @param {string} dir The directory to create.
 */
function mkdirs(dir) {
    dir = vscode_helpers_1.toStringSafe(dir);
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FSExtra.mkdirs(dir, (err) => {
                COMPLETED(err);
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.mkdirs = mkdirs;
/**
 * Normalizes a path.
 *
 * @param {string} path The path to normalize.
 *
 * @return {string} The normalized path.
 */
function normalizePath(path) {
    path = vscode_helpers_1.toStringSafe(path);
    path = replaceAllStrings(path, Path.sep, '/');
    if (vscode_helpers_1.isEmptyString(path)) {
        path = '';
    }
    while (path.startsWith('/')) {
        path = path.substr(1);
    }
    while (path.endsWith('/')) {
        path = path.substr(0, path.length - 1);
    }
    return path;
}
exports.normalizePath = normalizePath;
/**
 * Opens a target.
 *
 * @param {string} target The target to open.
 * @param {OpenOptions} [opts] The custom options to set.
 *
 * @param {Promise<ChildProcess.ChildProcess>} The promise with the child process.
 */
function open(target, opts) {
    if (!opts) {
        opts = {};
    }
    target = vscode_helpers_1.toStringSafe(target);
    const WAIT = vscode_helpers_1.toBooleanSafe(opts.wait, true);
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            let app = opts.app;
            let cmd;
            let appArgs = [];
            let args = [];
            let cpOpts = {
                cwd: opts.cwd,
                env: opts.env,
            };
            if (Array.isArray(app)) {
                appArgs = app.slice(1);
                app = opts.app[0];
            }
            if (process.platform === 'darwin') {
                // Apple
                cmd = 'open';
                if (WAIT) {
                    args.push('-W');
                }
                if (app) {
                    args.push('-a', app);
                }
            }
            else if (process.platform === 'win32') {
                // Microsoft
                cmd = 'cmd';
                args.push('/c', 'start', '""');
                target = target.replace(/&/g, '^&');
                if (WAIT) {
                    args.push('/wait');
                }
                if (app) {
                    args.push(app);
                }
                if (appArgs.length > 0) {
                    args = args.concat(appArgs);
                }
            }
            else {
                // Unix / Linux
                if (app) {
                    cmd = app;
                }
                else {
                    cmd = Path.join(__dirname, 'xdg-open');
                }
                if (appArgs.length > 0) {
                    args = args.concat(appArgs);
                }
                if (!WAIT) {
                    // xdg-open will block the process unless
                    // stdio is ignored even if it's unref'd
                    cpOpts.stdio = 'ignore';
                }
            }
            args.push(target);
            if (process.platform === 'darwin' && appArgs.length > 0) {
                args.push('--args');
                args = args.concat(appArgs);
            }
            let cp = ChildProcess.spawn(cmd, args, cpOpts);
            if (WAIT) {
                cp.once('error', (err) => {
                    COMPLETED(err);
                });
                cp.once('close', function (code) {
                    if (code > 0) {
                        COMPLETED(new Error('Exited with code ' + code));
                        return;
                    }
                    COMPLETED(null, cp);
                });
            }
            else {
                cp.unref();
                COMPLETED(null, cp);
            }
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.open = open;
/**
 * Opens and shows a text document.
 *
 * @param {string|object} [filenameOrOptions] Optional filename or options.
 *
 * @return {Promise<vscode.TextEditor>} The promise with the new text editor.
 */
async function openAndShowTextDocument(filenameOrOptions) {
    return await vscode.window.showTextDocument(await vscode.workspace.openTextDocument
        .apply(null, arguments));
}
exports.openAndShowTextDocument = openAndShowTextDocument;
/**
 * Promise version of 'FS.readdir()' function.
 *
 * @param {string|Buffer} path The path.
 *
 * @return {Promise<string[]>} The promise with the file and folder names.
 */
function readDir(path) {
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FS.readdir(path, (err, result) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    COMPLETED(null, result);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.readDir = readDir;
/**
 * Promise version of 'FS.readFile()' function.
 *
 * @param {string} filename The file to read.
 *
 * @return {Promise<FS.Stats>} The promise with the stats.
 */
function readFile(filename) {
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FS.readFile(filename, (err, data) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    COMPLETED(null, data);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.readFile = readFile;
/**
 * Reads the content of a stream.
 *
 * @param {NodeJS.ReadableStream} stream The stream.
 *
 * @returns {Promise<Buffer>} The promise with the content.
 */
function readStream(stream) {
    return new Promise(async (resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        if (!stream) {
            COMPLETED(null);
            return;
        }
        stream.once('error', (err) => {
            COMPLETED(err);
        });
        try {
            const DATA = await invokeForTempFile((tmpFile) => {
                return new Promise((res, rej) => {
                    const COMP = vscode_helpers_1.createCompletedAction(res, rej);
                    try {
                        const PIPE = stream.pipe(FS.createWriteStream(tmpFile));
                        PIPE.once('error', (err) => {
                            COMP(err);
                        });
                        stream.once('end', () => {
                            readFile(tmpFile).then((d) => {
                                COMP(null, d);
                            }).catch((err) => {
                                COMP(err);
                            });
                        });
                    }
                    catch (e) {
                        COMP(e);
                    }
                });
            });
            COMPLETED(null, DATA);
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.readStream = readStream;
/**
 * Promise version of 'FS.realpath()' function.
 *
 * @param {string|Buffer} path The path.
 *
 * @return {Promise<string>} The resolved path.
 */
function realpath(path) {
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FS.realpath(path, (err, resolvedPath) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    COMPLETED(null, resolvedPath);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.realpath = realpath;
/**
 * Replaces all occurrences of a string.
 *
 * @param {string} str The input string.
 * @param {string} searchValue The value to search for.
 * @param {string} replaceValue The value to replace 'searchValue' with.
 *
 * @return {string} The output string.
 */
function replaceAllStrings(str, searchValue, replaceValue) {
    str = vscode_helpers_1.toStringSafe(str);
    searchValue = vscode_helpers_1.toStringSafe(searchValue);
    replaceValue = vscode_helpers_1.toStringSafe(replaceValue);
    return str.split(searchValue)
        .join(replaceValue);
}
exports.replaceAllStrings = replaceAllStrings;
/**
 * Imports a module from extension context.
 *
 * @param {any} id The ID of the module.
 *
 * @return {TModule} The imported module.
 */
function requireFromExtension(id) {
    return require(vscode_helpers_1.toStringSafe(id));
}
exports.requireFromExtension = requireFromExtension;
/**
 * Promise (and safe) version of 'vscode.window.showErrorMessage()' function.
 *
 * @param {string} msg The message to display.
 * @param {TItem[]} [items] The optional items.
 *
 * @return {Promise<TItem>} The promise with the selected item.
 */
async function showErrorMessage(msg, ...items) {
    try {
        msg = vscode_helpers_1.toStringSafe(msg);
        return await vscode.window.showErrorMessage
            .apply(null, [`${msg}`.trim()].concat(items));
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'helpers.showErrorMessage()');
    }
}
exports.showErrorMessage = showErrorMessage;
/**
 * Promise (and safe) version of 'vscode.window.showInformationMessage()' function.
 *
 * @param {string} msg The message to display.
 * @param {TItem[]} [items] The optional items.
 *
 * @return {Promise<TItem>} The promise with the selected item.
 */
async function showInformationMessage(msg, ...items) {
    try {
        msg = vscode_helpers_1.toStringSafe(msg);
        return await vscode.window.showInformationMessage
            .apply(null, [`${msg}`.trim()].concat(items));
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'helpers.showInformationMessage()');
    }
}
exports.showInformationMessage = showInformationMessage;
/**
 * Promise (and safe) version of 'vscode.window.showWarningMessage()' function.
 *
 * @param {string} msg The message to display.
 * @param {TItem[]} [items] The optional items.
 *
 * @return {Promise<TItem>} The promise with the selected item.
 */
async function showWarningMessage(msg, ...items) {
    try {
        msg = vscode_helpers_1.toStringSafe(msg);
        return await vscode.window.showWarningMessage
            .apply(null, [`${msg}`.trim()].concat(items));
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'helpers.showWarningMessage()');
    }
}
exports.showWarningMessage = showWarningMessage;
/**
 * Sorts items by its label.
 *
 * @param {T|T[]} items The item(s).
 * @param {Function} [valueResolver] The value resolver whats result is used for comparison.
 *
 * @return {T[]} The sorted items.
 */
function sortByLabel(items, valueResolver) {
    if (!valueResolver) {
        valueResolver = (i) => i.label;
    }
    return vscode_helpers_1.asArray(items).sort((x, y) => {
        return vscode_helpers_1.compareValuesBy(x, y, i => vscode_helpers_1.normalizeString(valueResolver(i)));
    });
}
exports.sortByLabel = sortByLabel;
/**
 * Promise version of 'FS.stat()' function.
 *
 * @param {string|Buffer} path The path.
 *
 * @return {Promise<FS.Stats>} The promise with the stats.
 */
function stat(path) {
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FS.stat(path, (err, stats) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    COMPLETED(null, stats);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.stat = stat;
/**
 * Converts a path to a "displayable" one.
 *
 * @param {string} path The input value.
 *
 * @return {string} The output value.
 */
function toDisplayablePath(path) {
    path = vscode_helpers_1.toStringSafe(path);
    path = replaceAllStrings(path, Path.sep, '/');
    if (!path.trim().startsWith('/')) {
        path = '/' + path;
    }
    return path;
}
exports.toDisplayablePath = toDisplayablePath;
/**
 * Converts a file filter to a 'minimatch' compatible one.
 *
 * @param {TFilter} filter The filter to convert.
 *
 * @return {TFilter} The converted filter.
 */
function toMinimatchFileFilter(filter) {
    filter = vscode_helpers_1.cloneObjectFlat(filter);
    if (filter) {
        const NORMALIZE_PATTERNS = (patterns) => {
            return vscode_helpers_1.asArray(patterns).map(p => {
                return vscode_helpers_1.toStringSafe(p);
            }).filter(p => {
                return !vscode_helpers_1.isEmptyString(p);
            }).map(p => {
                if (!p.trim().startsWith('/')) {
                    p = '/' + p;
                }
                return p;
            });
        };
        filter['files'] = NORMALIZE_PATTERNS(filter.files);
        if (filter.files.length < 1) {
            filter['files'] = '/**/*';
        }
        filter['exclude'] = NORMALIZE_PATTERNS(filter.exclude);
        if (filter.exclude.length < 1) {
            delete filter['exclude'];
        }
    }
    return filter;
}
exports.toMinimatchFileFilter = toMinimatchFileFilter;
/**
 * Tries to find a language ID by filename.
 *
 * @param {string} file The (name of the) file.
 *
 * @return {Promise<string>} The promise with the language ID (if found).
 */
async function tryFindLanguageIdByFilename(file) {
    file = vscode_helpers_1.toStringSafe(file);
    let langId;
    if (!vscode_helpers_1.isEmptyString(file)) {
        try {
            const EXT = Path.extname(file).substr(1);
            switch (EXT) {
                case 'cs':
                    return 'csharp';
                case 'coffee':
                    return 'coffeescript';
                case 'ts':
                    return 'typescript';
            }
            const ALL_LANGUAGES = await vscode.languages.getLanguages();
            for (let i = 0; i < ALL_LANGUAGES.length; i++) {
                try {
                    const LANG = ALL_LANGUAGES[i];
                    const CONTENT_TYPE = MimeTypes.lookup(LANG);
                    if (false !== CONTENT_TYPE) {
                        const MIME_EXT = MimeTypes.extension(CONTENT_TYPE);
                        if (EXT === MIME_EXT) {
                            langId = LANG;
                        }
                    }
                }
                catch (e) {
                    deploy_log.CONSOLE
                        .trace(e, 'helpers.tryFindLanguageIdByFilename(2)');
                }
            }
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'helpers.tryFindLanguageIdByFilename(1)');
        }
    }
    return langId;
}
exports.tryFindLanguageIdByFilename = tryFindLanguageIdByFilename;
/**
 * Promise version of 'FS.unlink()' function.
 *
 * @param {string|Buffer} path The path.
 */
function unlink(path) {
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FS.unlink(path, (err) => {
                COMPLETED(err);
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.unlink = unlink;
/**
 * Extracts the query parameters of an URI to an object.
 *
 * @param {URL.Url|vscode.Uri} uri The URI.
 *
 * @return {deploy_contracts.KeyValuePairs<string>} The parameters of the URI as object.
 */
function uriParamsToObject(uri) {
    if (!uri) {
        return uri;
    }
    let params;
    if (!vscode_helpers_1.isEmptyString(uri.query)) {
        // s. https://css-tricks.com/snippets/jquery/get-query-params-object/
        params = uri.query.replace(/(^\?)/, '')
            .split("&")
            .map(function (n) {
            return n = n.split("="), this[vscode_helpers_1.normalizeString(n[0])] =
                vscode_helpers_1.toStringSafe(decodeURIComponent(n[1])), this;
        }
            .bind({}))[0];
    }
    return params || {};
}
exports.uriParamsToObject = uriParamsToObject;
/**
 * Promise version of 'FS.unlink()' function.
 *
 * @param {string} filename The file to write to.
 * @param {any} data The data to write.
 */
function writeFile(filename, data) {
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers_1.createCompletedAction(resolve, reject);
        try {
            FS.writeFile(filename, data, (err) => {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    COMPLETED(null);
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.writeFile = writeFile;
//# sourceMappingURL=helpers.js.map