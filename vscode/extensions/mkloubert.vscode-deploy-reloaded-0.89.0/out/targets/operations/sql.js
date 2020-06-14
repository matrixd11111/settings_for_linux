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
const deploy_log = require("../../log");
const deploy_sql = require("../../sql");
/** @inheritdoc */
async function execute(context) {
    const OPERATION = context.operation;
    const TARGET = context.target;
    const WORKSPACE = TARGET.__workspace;
    let type = false;
    const ENGINE = deploy_helpers.normalizeString(OPERATION.engine);
    switch (ENGINE) {
        case 'mysql':
            type = deploy_sql.SqlConnectionType.MySql;
            break;
        case 'sql':
            type = deploy_sql.SqlConnectionType.MSSql;
            break;
    }
    if (false === type) {
        throw new Error(WORKSPACE.t('sql.notSupported', ENGINE));
    }
    const CONN = await deploy_sql.openSqlConnection(type, OPERATION.options);
    try {
        for (const SQL of deploy_helpers.asArray(OPERATION.queries)
            .map(q => deploy_helpers.toStringSafe(q))
            .filter(q => !deploy_helpers.isEmptyString(q))) {
            await CONN.query(SQL);
        }
    }
    finally {
        try {
            await CONN.close();
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'targets.operations.sql.execute()');
        }
    }
}
exports.execute = execute;
//# sourceMappingURL=sql.js.map