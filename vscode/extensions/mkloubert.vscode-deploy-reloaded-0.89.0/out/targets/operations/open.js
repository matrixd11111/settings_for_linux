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
/** @inheritdoc */
async function execute(context) {
    const TARGET_TO_OPEN = deploy_helpers.toStringSafe(context.operation.target);
    if (deploy_helpers.isEmptyString(TARGET_TO_OPEN)) {
        return;
    }
    const WORKSPACE = context.target.__workspace;
    const WAIT = deploy_helpers.toBooleanSafe(context.operation.wait, true);
    await deploy_helpers.open(TARGET_TO_OPEN, {
        cwd: WORKSPACE.rootPath,
        wait: WAIT,
    });
}
exports.execute = execute;
//# sourceMappingURL=open.js.map