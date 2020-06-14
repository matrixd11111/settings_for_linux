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
const deploy_helpers = require("../../helpers");
const deploy_targets = require("../../targets");
const i18 = require("../../i18");
/** @inheritdoc */
async function execute(context) {
    const OPERATION = context.operation;
    const TARGET = context.target;
    const WORKSPACE = TARGET.__workspace;
    let scriptFile = deploy_helpers.toStringSafe(WORKSPACE.replaceWithValues(OPERATION.script));
    if (deploy_helpers.isEmptyString(scriptFile)) {
        switch (context.event) {
            case deploy_targets.TargetOperationEvent.AfterDeployed:
                scriptFile = './deployed.js';
                break;
            case deploy_targets.TargetOperationEvent.BeforeDeploy:
                scriptFile = './beforeDeploy.js';
                break;
        }
    }
    let scriptFullPath = await WORKSPACE.getExistingSettingPath(scriptFile);
    if (false === scriptFullPath) {
        throw new Error(i18.t('targets.operations.script.scriptNotFound', scriptFile));
    }
    const SCRIPT_MODULE = deploy_helpers.loadModule(scriptFullPath);
    if (SCRIPT_MODULE) {
        const EXECUTE = SCRIPT_MODULE.execute;
        if (EXECUTE) {
            const ARGS = {
                _: require('lodash'),
                context: context,
                events: WORKSPACE.workspaceSessionState['target_operations']['script']['events'],
                extension: WORKSPACE.context.extension,
                folder: WORKSPACE.folder,
                globalEvents: deploy_helpers.EVENTS,
                globals: WORKSPACE.globals,
                globalState: WORKSPACE.workspaceSessionState['target_operations']['script']['global'],
                homeDir: deploy_helpers.getExtensionDirInHome(),
                logger: WORKSPACE.createLogger(),
                options: deploy_helpers.cloneObject(OPERATION.options),
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
            // ARGS.state
            Object.defineProperty(ARGS, 'state', {
                enumerable: true,
                get: () => {
                    return WORKSPACE.workspaceSessionState['target_operations']['script']['scripts'][scriptFullPath];
                },
                set: (newValue) => {
                    WORKSPACE.workspaceSessionState['target_operations']['script']['scripts'][scriptFullPath] = newValue;
                }
            });
            await Promise.resolve(EXECUTE.apply(SCRIPT_MODULE, [ARGS]));
        }
        else {
            throw new Error(i18.t('targets.operations.script.noScriptFunction', scriptFile));
        }
    }
    else {
        throw new Error(i18.t('targets.operations.script.noScriptModule', scriptFile));
    }
}
exports.execute = execute;
//# sourceMappingURL=script.js.map