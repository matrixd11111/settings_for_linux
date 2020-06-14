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
const Crypto = require("crypto");
const deploy_contracts = require("./contracts");
const deploy_helpers = require("./helpers");
const deploy_gui = require("./gui");
const deploy_log = require("./log");
const deploy_packages = require("./packages");
const deploy_targets_operations_cleanup = require("./targets/operations/cleanup");
const deploy_targets_operations_command = require("./targets/operations/command");
const deploy_targets_operations_devtools = require("./targets/operations/devtools");
const deploy_targets_operations_exec = require("./targets/operations/exec");
const deploy_targets_operations_http = require("./targets/operations/http");
const deploy_targets_operations_open = require("./targets/operations/open");
const deploy_targets_operations_script = require("./targets/operations/script");
const deploy_targets_operations_slack = require("./targets/operations/slack");
const deploy_targets_operations_sql = require("./targets/operations/sql");
const deploy_targets_operations_wait = require("./targets/operations/wait");
const deploy_workspaces = require("./workspaces");
const Enumerable = require("node-enumerable");
const i18 = require("./i18");
const Moment = require("moment");
const Path = require("path");
const SanitizeFilename = require('sanitize-filename');
const vscode = require("vscode");
/**
 * Target operation event types.
 */
var TargetOperationEvent;
(function (TargetOperationEvent) {
    /**
     * Before deploy
     */
    TargetOperationEvent[TargetOperationEvent["BeforeDeploy"] = 0] = "BeforeDeploy";
    /**
     * After deployed
     */
    TargetOperationEvent[TargetOperationEvent["AfterDeployed"] = 1] = "AfterDeployed";
    /**
     * Before pull
     */
    TargetOperationEvent[TargetOperationEvent["BeforePull"] = 2] = "BeforePull";
    /**
     * After pulled
     */
    TargetOperationEvent[TargetOperationEvent["AfterPulled"] = 3] = "AfterPulled";
    /**
     * Before delete
     */
    TargetOperationEvent[TargetOperationEvent["BeforeDelete"] = 4] = "BeforeDelete";
    /**
     * After deleted
     */
    TargetOperationEvent[TargetOperationEvent["AfterDeleted"] = 5] = "AfterDeleted";
    /**
     * Prepare
     */
    TargetOperationEvent[TargetOperationEvent["Prepare"] = 6] = "Prepare";
})(TargetOperationEvent = exports.TargetOperationEvent || (exports.TargetOperationEvent = {}));
/**
 * The default type or a target operation.
 */
exports.DEFAULT_OPERATION_TYPE = 'open';
const KEY_TARGET_USAGE = 'vscdrLastExecutedTargetActions';
/**
 * The regular expression for testing a ZIP filename for a target.
 */
exports.REGEX_ZIP_FILENAME = /^(vscode\-ws)(.*)(_)([0-9]{8})(\-)([0-9]{6})(\.zip)$/i;
/**
 * Creates a unique session value for a target.
 *
 * @param {Target} target The target.
 *
 * @return {symbol} The session value.
 */
function createTargetSessionValue(target) {
    if (!target) {
        return target;
    }
    return Symbol(`${Moment.utc().unix()}::` +
        `${getTargetIdHash(target)}::` +
        `${deploy_helpers.uuid()}`);
}
exports.createTargetSessionValue = createTargetSessionValue;
/**
 * Executes 'prepare' operations for a target.
 *
 * @param {ExecutePrepareTargetOperationOptions} opts The options.
 *
 * @return {Promise<boolean>} The promise with the value, that indicates if whole operation has been cancelled (false) or not (true).
 */
async function executePrepareTargetOperations(opts) {
    const TARGET = opts.target;
    const WORKSPACE = TARGET.__workspace;
    const PREPARE_OPERATIONS = deploy_helpers.asArray(TARGET.prepare).map(p => {
        return getTargetOperationSafe(p);
    }).filter(p => {
        const ONLY_WHEN = deploy_helpers.asArray(p.onlyWhen).map(ow => {
            return deploy_helpers.normalizeString(ow);
        }).filter(ow => '' !== ow);
        if (ONLY_WHEN.length < 1) {
            return opts.deployOperation === deploy_contracts.DeployOperation.Deploy;
        }
        switch (opts.deployOperation) {
            case deploy_contracts.DeployOperation.Delete:
                return ONLY_WHEN.indexOf('delete') > -1;
            case deploy_contracts.DeployOperation.Deploy:
                return ONLY_WHEN.indexOf('deploy') > -1;
            case deploy_contracts.DeployOperation.Pull:
                return ONLY_WHEN.indexOf('pull') > -1;
        }
        return false;
    });
    let operationIndex = -1;
    const GET_OPERATION_NAME = (operation) => {
        let operationName = deploy_helpers.toStringSafe(operation.name).trim();
        if ('' === operationName) {
            operationName = deploy_helpers.normalizeString(operation.type);
            if ('' === operationName) {
                operationName = exports.DEFAULT_OPERATION_TYPE;
            }
            operationName += ' #' + (operationIndex + 1);
        }
        return operationName;
    };
    let watch;
    const START_WATCH = () => watch = deploy_helpers.startWatch();
    const STOP_WATCH = () => {
        if (watch) {
            WORKSPACE.output.appendLine(` [${watch.stop()} ms]`);
        }
        watch = null;
    };
    return await executeTargetOperations({
        cancellationToken: opts.cancellationToken,
        files: opts.files,
        onBeforeExecute: async (operation) => {
            ++operationIndex;
            WORKSPACE.output.append(`⚡ ` + WORKSPACE.t('targets.operations.runningPrepare', GET_OPERATION_NAME(operation)));
            if (opts.cancellationToken.isCancellationRequested) {
                WORKSPACE.output.appendLine(`✖️`);
            }
            else {
                START_WATCH();
            }
        },
        onExecutionCompleted: async (operation, err, doesContinue) => {
            if (err) {
                WORKSPACE.output.append(`🔥: '${deploy_helpers.toStringSafe(err)}'`);
            }
            else {
                WORKSPACE.output.append(`✅`);
                if (deploy_helpers.toBooleanSafe(operation.reloadFileList, true)) {
                    await Promise.resolve(opts.onReloadFileList(operation));
                }
            }
            STOP_WATCH();
        },
        operation: TargetOperationEvent.Prepare,
        prepareDeployOperation: opts.deployOperation,
        prepareOperations: PREPARE_OPERATIONS,
        target: TARGET,
    });
}
exports.executePrepareTargetOperations = executePrepareTargetOperations;
/**
 * Executes operations for a target.
 *
 * @param {ExecuteTargetOperationOptions} opts The options.
 *
 * @return {Promise<boolean>} The promise with the value, that indicates if whole operation has been cancelled (false) or not (true).
 */
async function executeTargetOperations(opts) {
    const TARGET = opts.target;
    const WORKSPACE = TARGET.__workspace;
    const EVENT = opts.operation;
    let operationsFromTarget;
    let deployOperation;
    switch (EVENT) {
        case TargetOperationEvent.AfterDeleted:
            operationsFromTarget = TARGET.deleted;
            deployOperation = deploy_contracts.DeployOperation.Delete;
            break;
        case TargetOperationEvent.AfterDeployed:
            operationsFromTarget = TARGET.deployed;
            deployOperation = deploy_contracts.DeployOperation.Deploy;
            break;
        case TargetOperationEvent.AfterPulled:
            operationsFromTarget = TARGET.pulled;
            deployOperation = deploy_contracts.DeployOperation.Pull;
            break;
        case TargetOperationEvent.BeforeDelete:
            operationsFromTarget = TARGET.beforeDelete;
            deployOperation = deploy_contracts.DeployOperation.Delete;
            break;
        case TargetOperationEvent.BeforeDeploy:
            operationsFromTarget = TARGET.beforeDeploy;
            deployOperation = deploy_contracts.DeployOperation.Deploy;
            break;
        case TargetOperationEvent.BeforePull:
            operationsFromTarget = TARGET.beforePull;
            deployOperation = deploy_contracts.DeployOperation.Pull;
            break;
        case TargetOperationEvent.Prepare:
            operationsFromTarget = opts.prepareOperations;
            deployOperation = opts.prepareDeployOperation;
            break;
    }
    let prevOperation;
    for (const OPERATION_VAL of deploy_helpers.asArray(operationsFromTarget)) {
        if (WORKSPACE.isInFinalizeState) {
            return false;
        }
        if (opts.cancellationToken.isCancellationRequested) {
            return false;
        }
        let operationToExecute = getTargetOperationSafe(OPERATION_VAL);
        operationToExecute = Enumerable.from(WORKSPACE.filterConditionalItems(operationToExecute, true)).singleOrDefault(() => true, null);
        if (!deploy_helpers.isObject(operationToExecute)) {
            continue;
        }
        const IGNORE_IF_FAIL = deploy_helpers.toBooleanSafe(operationToExecute.ignoreIfFail);
        let executor;
        let executorArgs;
        const TYPE = deploy_helpers.normalizeString(operationToExecute.type);
        switch (TYPE) {
            case '':
            case 'open':
                executor = deploy_targets_operations_open.execute;
                break;
            case 'browser':
            case 'chrome':
                executor = deploy_targets_operations_devtools.execute;
                break;
            case 'cleanup':
                executor = deploy_targets_operations_cleanup.execute;
                break;
            case 'command':
                executor = deploy_targets_operations_command.execute;
                break;
            case 'exec':
            case 'execute':
                executor = deploy_targets_operations_exec.execute;
                break;
            case 'http':
                executor = deploy_targets_operations_http.execute;
                break;
            case 'script':
                executor = deploy_targets_operations_script.execute;
                break;
            case 'slack':
                executor = deploy_targets_operations_slack.execute;
                break;
            case 'sql':
                executor = deploy_targets_operations_sql.execute;
                break;
            case 'wait':
                executor = deploy_targets_operations_wait.execute;
                break;
        }
        if (!executor) {
            throw new Error(WORKSPACE.t('targets.operations.typeNotSupported', TYPE));
        }
        try {
            const CTX = {
                args: executorArgs || [],
                deployOperation: deployOperation,
                event: EVENT,
                files: deploy_helpers.asArray(opts.files),
                operation: operationToExecute,
                previousOperation: prevOperation,
                target: TARGET,
                type: TYPE,
            };
            prevOperation = CTX;
            await Promise.resolve(opts.onBeforeExecute(operationToExecute));
            const ABORT = !deploy_helpers.toBooleanSafe(await Promise.resolve(executor.apply(null, [CTX])), true);
            await Promise.resolve(opts.onExecutionCompleted(operationToExecute, null, ABORT));
            if (ABORT) {
                return false;
            }
        }
        catch (e) {
            await Promise.resolve(opts.onExecutionCompleted(operationToExecute, e, IGNORE_IF_FAIL));
            if (IGNORE_IF_FAIL) {
                deploy_log.CONSOLE
                    .trace(e, 'targets.executeTargetOperations()');
            }
            else {
                throw e;
            }
        }
    }
    return true;
}
exports.executeTargetOperations = executeTargetOperations;
/**
 * Returns the name and path for a file deployment.
 *
 * @param {string} file The file.
 * @param {Target} target The target.
 * @param {string[]} dirs One or more scope directories.
 *
 * @return {deploy_contracts.WithNameAndPath|false} The object or (false) if not possible.
 */
function getNameAndPathForFileDeployment(target, file, dirs) {
    if (!target) {
        return false;
    }
    const WORKSPACE = target.__workspace;
    if (WORKSPACE.isFileIgnored(file)) {
        return false;
    }
    let relPath = WORKSPACE.toRelativePath(file);
    if (false === relPath) {
        return false;
    }
    const TO_MINIMATCH = (str) => {
        str = deploy_helpers.toStringSafe(str);
        if (!str.startsWith('/')) {
            str = '/' + str;
        }
        return str;
    };
    let name = Path.basename(relPath);
    let path = Path.dirname(relPath);
    let pathSuffix = '';
    const MAPPINGS = target.mappings;
    if (MAPPINGS) {
        for (const P in MAPPINGS) {
            let settings = MAPPINGS[P];
            if (deploy_helpers.isNullOrUndefined(settings)) {
                continue;
            }
            if (!deploy_helpers.isObject(settings)) {
                settings = {
                    to: deploy_helpers.toStringSafe(settings),
                };
            }
            const PATTERN = TO_MINIMATCH(P);
            const PATH_TO_CHECK = TO_MINIMATCH(relPath);
            const MATCH_OPTS = {
                dot: true,
                nocase: true,
            };
            if (deploy_helpers.doesMatch(PATH_TO_CHECK, PATTERN, MATCH_OPTS)) {
                const DIR_NAME = Path.dirname(relPath);
                const MATCHING_DIRS = dirs.map(d => {
                    return WORKSPACE.toRelativePath(d);
                }).filter(d => false !== d).filter((d) => {
                    return d === DIR_NAME ||
                        DIR_NAME.startsWith(d + '/');
                }).sort((x, y) => {
                    return deploy_helpers.compareValuesBy(x, y, (d) => d.length);
                });
                if (MATCHING_DIRS.length > 0) {
                    pathSuffix = DIR_NAME.substr(MATCHING_DIRS[0].length);
                }
                path = deploy_helpers.normalizePath(settings.to);
                break;
            }
        }
    }
    if ('.' === path) {
        path = '';
    }
    return {
        name: name,
        path: deploy_helpers.normalizePath('/' +
            deploy_helpers.normalizePath(path) +
            '/' +
            deploy_helpers.normalizePath(pathSuffix)),
    };
}
exports.getNameAndPathForFileDeployment = getNameAndPathForFileDeployment;
/**
 * Returns the scope directories for target folder mappings.
 *
 * @param {Target} target The target.
 *
 * @return {Promise<string[]>} The promise with the directories.
 */
async function getScopeDirectoriesForTargetFolderMappings(target) {
    if (!target) {
        return;
    }
    const WORKSPACE = target.__workspace;
    const CFG = WORKSPACE.config;
    let useFastGlob = target.useFastGlob;
    if (CFG) {
        useFastGlob = deploy_helpers.toBooleanSafe(useFastGlob, deploy_helpers.toBooleanSafe(CFG.useFastGlob));
    }
    useFastGlob = deploy_helpers.toBooleanSafe(useFastGlob);
    let patterns = [];
    const MAPPINGS = target.mappings;
    if (deploy_helpers.isObject(MAPPINGS)) {
        for (const P in MAPPINGS) {
            if (!deploy_helpers.isEmptyString(P)) {
                patterns.push(P);
            }
        }
    }
    patterns = Enumerable.from(patterns)
        .distinct()
        .toArray();
    let dirs = [];
    if (patterns.length > 0) {
        let filesAndFolder = [];
        let itemAdder;
        if (useFastGlob) {
            filesAndFolder = (await WORKSPACE.findFilesByFilterFast({
                files: patterns,
            }, {
                absolute: true,
                dot: true,
                nocase: true,
                onlyDirectories: true,
                onlyFiles: false,
            })).map((x) => {
                return Path.resolve(x);
            });
            itemAdder = async () => {
                dirs = filesAndFolder;
            };
        }
        else {
            filesAndFolder = await WORKSPACE.findFilesByFilter({
                files: patterns,
            }, {
                absolute: true,
                dot: true,
                nocase: true,
                nodir: false,
                nosort: true,
                nounique: false,
            });
            itemAdder = async () => {
                for (const FF of filesAndFolder) {
                    let dirToAdd;
                    if (await deploy_helpers.isDirectory(FF, false)) {
                        dirToAdd = FF;
                    }
                    else {
                        dirToAdd = Path.dirname(FF);
                    }
                    dirToAdd = Path.resolve(dirToAdd);
                    if (dirs.indexOf(dirToAdd) < 0) {
                        dirs.push(dirToAdd);
                    }
                }
            };
        }
        await itemAdder();
    }
    return dirs;
}
exports.getScopeDirectoriesForTargetFolderMappings = getScopeDirectoriesForTargetFolderMappings;
/**
 * Returns the hash of a target's ID.
 *
 * @param {Target} target The target.
 *
 * @return {string} The hash of its ID.
 */
function getTargetIdHash(target) {
    if (!target) {
        return target;
    }
    return Crypto.createHash('sha256')
        .update(new Buffer(deploy_helpers.toStringSafe(target.__id), 'utf8'))
        .digest('hex');
}
exports.getTargetIdHash = getTargetIdHash;
/**
 * Returns the name for a target.
 *
 * @param {Target} target The target.
 *
 * @return {string} The name.
 */
function getTargetName(target) {
    if (!target) {
        return;
    }
    const TRANSLATOR = target.__workspace;
    let name = deploy_helpers.toStringSafe(target.name).trim();
    if ('' === name) {
        name = TRANSLATOR.t('targets.defaultName', target.__index + 1);
    }
    return name;
}
exports.getTargetName = getTargetName;
function getTargetOperationSafe(val) {
    if (!deploy_helpers.isNullOrUndefined(val)) {
        if (!deploy_helpers.isObject(val)) {
            const APP_OPERATION = {
                target: deploy_helpers.toStringSafe(val),
                type: ''
            };
            val = APP_OPERATION;
        }
    }
    return val;
}
/**
 * Returns targets by their names and shows an error message if targets could not be found.
 *
 * @param {string|string[]} targetNames One or more target name.
 * @param {Target|Target[]} targets One or more existing targets.
 *
 * @return {Target[]|false} The list of matching targets or (false) if at least one target could not be found.
 */
function getTargetsByName(targetNames, targets) {
    targetNames = Enumerable.from(deploy_helpers.asArray(targetNames)).select(tn => {
        return deploy_helpers.normalizeString(tn);
    }).distinct()
        .toArray();
    targets = deploy_helpers.asArray(targets);
    const EXISTING_TARGETS = [];
    const NON_EXISTING_TARGETS = [];
    targetNames.forEach(tn => {
        const MATCHING_TARGETS = targets.filter(t => {
            const TARGET_NAME = deploy_helpers.normalizeString(getTargetName(t));
            return TARGET_NAME === tn;
        });
        if (MATCHING_TARGETS.length > 0) {
            EXISTING_TARGETS.push
                .apply(EXISTING_TARGETS, MATCHING_TARGETS);
        }
        else {
            NON_EXISTING_TARGETS.push(tn);
        }
    });
    if (NON_EXISTING_TARGETS.length > 0) {
        NON_EXISTING_TARGETS.forEach(tn => {
            deploy_helpers.showWarningMessage(i18.t('targets.doesNotExist', tn));
        });
        return false;
    }
    return EXISTING_TARGETS;
}
exports.getTargetsByName = getTargetsByName;
/**
 * Returns the ZIP filename for a target.
 *
 * @param {Target} target The target.
 * @param {Moment.Moment} [time] The custom timestamp to use.
 *
 * @return {string} The filename.
 */
function getZipFileName(target, time) {
    if (!target) {
        return target;
    }
    time = deploy_helpers.asUTC(time);
    if (!time) {
        time = Moment.utc();
    }
    let workspaceName;
    const WORKSPACE = target.__workspace;
    if (WORKSPACE) {
        workspaceName = deploy_helpers.normalizeString(target.__workspace.name);
        if (workspaceName.length > 32) {
            workspaceName = workspaceName.substr(0, 32).trim();
        }
    }
    if (deploy_helpers.isEmptyString(workspaceName)) {
        workspaceName = '';
    }
    else {
        workspaceName = `_${workspaceName}`;
    }
    return SanitizeFilename(`vscode-ws${workspaceName}_${time.format('YYYYMMDD-HHmmss')}.zip`);
}
exports.getZipFileName = getZipFileName;
/**
 * Invokes an action for the file of an active text editor
 * by selecting a target.
 *
 * @param {string} placeHolder The placeholder for the quick pick to use.
 * @param {Function} action The action to invoke.
 */
async function invokeForActiveEditorAndTarget(placeHolder, action) {
    const ACTIVE_EDITOR = vscode.window.activeTextEditor;
    if (!ACTIVE_EDITOR) {
        deploy_helpers.showWarningMessage(i18.t('editors.active.noOpen'));
        return;
    }
    const MATCHING_WORKSPACES = deploy_workspaces.getAllWorkspaces().filter(ws => {
        return ACTIVE_EDITOR.document &&
            ws.isPathOf(ACTIVE_EDITOR.document.fileName);
    });
    const TARGETS = [];
    MATCHING_WORKSPACES.forEach(ws => {
        Enumerable.from(ws.getTargets())
            .pushTo(TARGETS);
    });
    const QUICK_PICK_ITEMS = TARGETS.map((t, i) => {
        return {
            action: async () => {
                if (action) {
                    await Promise.resolve(action(ACTIVE_EDITOR.document.fileName, t));
                }
            },
            description: deploy_helpers.toStringSafe(t.description).trim(),
            detail: t.__workspace.rootPath,
            label: getTargetName(t),
        };
    });
    if (QUICK_PICK_ITEMS.length < 1) {
        deploy_helpers.showWarningMessage(i18.t('targets.noneFound'));
        return;
    }
    let selectedItem;
    if (1 === QUICK_PICK_ITEMS.length) {
        selectedItem = QUICK_PICK_ITEMS[0];
    }
    else {
        selectedItem = await vscode.window.showQuickPick(QUICK_PICK_ITEMS, {
            placeHolder: placeHolder,
        });
    }
    if (selectedItem) {
        await selectedItem.action();
    }
}
exports.invokeForActiveEditorAndTarget = invokeForActiveEditorAndTarget;
/**
 * Checks if a target is visible for a package.
 *
 * @param {Target} target The target.
 * @param {deploy_packages.Package} pkg The package.
 *
 * @return {boolean} Is visible or not.
 */
function isVisibleForPackage(target, pkg) {
    if (!target) {
        return false;
    }
    if (!pkg) {
        return true;
    }
    const PACKAGE_NAME = deploy_helpers.normalizeString(deploy_packages.getPackageName(pkg));
    const IS_HIDDEN = deploy_helpers.asArray(deploy_helpers.asArray(target.hideIf)).map(hif => deploy_helpers.normalizeString(hif))
        .filter(hif => '' !== hif)
        .indexOf(PACKAGE_NAME) > -1;
    if (IS_HIDDEN) {
        return false;
    }
    const SHOW_IF = deploy_helpers.asArray(deploy_helpers.asArray(target.showIf)).map(sif => deploy_helpers.normalizeString(sif))
        .filter(sif => '' !== sif);
    if (SHOW_IF.length < 1) {
        return true;
    }
    return SHOW_IF.indexOf(PACKAGE_NAME) > -1;
}
exports.isVisibleForPackage = isVisibleForPackage;
/**
 * Maps file objects for a specific target.
 *
 * @param {Target} target The underlying target.
 * @param {TFile|TFile[]} files The file targets to (re)map.
 *
 * @return {Promise<TFile[]>} The promise with the new, mapped objects.
 */
async function mapFilesForTarget(target, files) {
    const WORKSPACE = target.__workspace;
    const MAPPING_SCOPE_DIRS = await getScopeDirectoriesForTargetFolderMappings(target);
    files = deploy_helpers.asArray(files);
    const MAPPED_FILES = [];
    for (const F of files) {
        const CLONED_FILE = deploy_helpers.cloneObjectFlat(F, false);
        const FULL_PATH = Path.resolve(Path.join(WORKSPACE.rootPath, deploy_helpers.normalizePath(F.path + '/' + F.name)));
        if (!WORKSPACE.isPathOf(FULL_PATH)) {
            continue;
        }
        const NEW_MAPPING = getNameAndPathForFileDeployment(target, FULL_PATH, MAPPING_SCOPE_DIRS);
        if (false === NEW_MAPPING) {
            continue;
        }
        CLONED_FILE.name = NEW_MAPPING.name;
        CLONED_FILE.path = NEW_MAPPING.path;
        MAPPED_FILES.push(CLONED_FILE);
    }
    return MAPPED_FILES;
}
exports.mapFilesForTarget = mapFilesForTarget;
/**
 * Maps folder objects for a specific target.
 *
 * @param {Target} target The underlying target.
 * @param {TFolder|TFolder[]} folders The folder targets to (re)map.
 *
 * @return {Promise<TFolder[]>} The promise with the new, mapped objects.
 */
async function mapFoldersForTarget(target, folders) {
    return mapFilesForTarget(target, folders);
}
exports.mapFoldersForTarget = mapFoldersForTarget;
/**
 * Normalizes the type of a target.
 *
 * @param {Target} target The target.
 *
 * @return {string} The normalized target type.
 */
function normalizeTargetType(target) {
    if (!target) {
        return target;
    }
    const TARGET_TYPE = deploy_helpers.normalizeString(target.type);
    return '' !== TARGET_TYPE ? TARGET_TYPE
        : 'local'; // default
}
exports.normalizeTargetType = normalizeTargetType;
/**
 * Resets the target usage statistics.
 *
 * @param {vscode.ExtensionContext} context The extension context.
 */
function resetTargetUsage(context) {
    context.workspaceState.update(KEY_TARGET_USAGE, undefined).then(() => {
    }, (err) => {
        deploy_log.CONSOLE
            .trace(err, 'targets.resetTargetUsage()');
    });
}
exports.resetTargetUsage = resetTargetUsage;
/**
 * Shows a quick pick for a list of targets.
 *
 * @param {vscode.ExtensionContext} context The extension context.
 * @param {Target|Target[]} targets One or more targets.
 * @param {vscode.QuickPickOptions} [opts] Custom options for the quick picks.
 *
 * @return {Promise<Target|false>} The promise that contains the selected target (if selected)
 *                                 or (false) if no target is available.
 */
async function showTargetQuickPick(context, targets, opts) {
    const QUICK_PICKS = deploy_helpers.asArray(targets).filter(f => {
        return !deploy_helpers.toBooleanSafe(f.isHidden);
    }).map(t => {
        const WORKSPACE = t.__workspace;
        return {
            action: () => {
                return t;
            },
            label: '$(telescope)  ' + getTargetName(t),
            description: deploy_helpers.toStringSafe(t.description),
            detail: WORKSPACE.rootPath,
            state: getTargetIdHash(t),
        };
    });
    if (QUICK_PICKS.length < 1) {
        deploy_helpers.showWarningMessage(i18.t('targets.noneFound'));
        return false;
    }
    let selectedItem;
    if (1 === QUICK_PICKS.length) {
        selectedItem = QUICK_PICKS[0];
    }
    else {
        selectedItem = await vscode.window.showQuickPick(deploy_gui.sortQuickPicksByUsage(QUICK_PICKS, context.workspaceState, KEY_TARGET_USAGE, (i) => {
            // remove icon
            return i.label
                .substr(i.label.indexOf(' '))
                .trim();
        }), opts);
    }
    if (selectedItem) {
        return selectedItem.action();
    }
}
exports.showTargetQuickPick = showTargetQuickPick;
/**
 * Throws an error if a parent target is defined in a child list of targets.
 *
 * @param {Target} parentTarget The target to check.
 * @param {Target|Target[]} childTargets One or more children.
 *
 * @throws Found parent target in child list.
 */
function throwOnRecurrence(parentTarget, childTargets) {
    childTargets = deploy_helpers.asArray(childTargets);
    if (!parentTarget) {
        return;
    }
    const WORKSPACE = parentTarget.__workspace;
    for (const CT of childTargets) {
        if (WORKSPACE.id !== CT.__workspace.id) {
            continue;
        }
        if (parentTarget.__id === CT.__id) {
            throw new Error(WORKSPACE.t('targets.cannotDefineOtherAsSource', getTargetName(CT)));
        }
    }
}
exports.throwOnRecurrence = throwOnRecurrence;
/**
 * Wraps a 'before' callback of a file (context) object for a target.
 *
 * @param {TFile} file The file (context).
 * @param {Target} target The underlying target.
 * @param {string|symbol} property The property (key) of the callback.
 *
 * @return {TFile} The new object.
 */
function wrapOnBeforeFileCallbackForTarget(file, target, property) {
    if (!file) {
        return file;
    }
    const TARGET_NAME = getTargetName(target);
    const CALLBACK_TO_WRAP = file[property];
    file = deploy_helpers.cloneObjectFlat(file, false);
    file[property] = async (destinationOrSource) => {
        if (arguments.length < 1) {
            destinationOrSource = `${deploy_helpers.toStringSafe(file.path)}`;
        }
        destinationOrSource = `[${TARGET_NAME}] ${deploy_helpers.toStringSafe(destinationOrSource)}`;
        if (CALLBACK_TO_WRAP) {
            await deploy_helpers.applyFuncFor(CALLBACK_TO_WRAP, file)(destinationOrSource);
        }
    };
    return file;
}
exports.wrapOnBeforeFileCallbackForTarget = wrapOnBeforeFileCallbackForTarget;
/**
 * Wraps a 'before' callback of a folder (context) object for a target.
 *
 * @param {TFolder} folder The folder (context).
 * @param {Target} target The underlying target.
 * @param {string|symbol} property The property (key) of the callback.
 *
 * @return {TFile} The new object.
 */
function wrapOnBeforeFolderCallbackForTarget(folder, target, property) {
    return wrapOnBeforeFileCallbackForTarget(folder, target, property);
}
exports.wrapOnBeforeFolderCallbackForTarget = wrapOnBeforeFolderCallbackForTarget;
//# sourceMappingURL=targets.js.map