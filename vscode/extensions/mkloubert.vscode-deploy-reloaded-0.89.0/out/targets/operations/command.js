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
const vscode = require("vscode");
/** @inheritdoc */
async function execute(context) {
    const OPERATION = context.operation;
    const TARGET = context.target;
    const WORKSPACE = TARGET.__workspace;
    const COMMAND = deploy_helpers.toStringSafe(WORKSPACE.replaceWithValues(OPERATION.command));
    let args;
    if (deploy_helpers.isNullOrUndefined(OPERATION.arguments)) {
        args = [];
    }
    else {
        args = deploy_helpers.asArray(OPERATION.arguments, false);
    }
    await vscode.commands.executeCommand
        .apply(null, [COMMAND].concat(args));
}
exports.execute = execute;
//# sourceMappingURL=command.js.map