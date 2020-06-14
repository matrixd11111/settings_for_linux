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
const deploy_sql_mssql = require("./sql/mssql");
const deploy_sql_mysql = require("./sql/mysql");
const i18 = require("./i18");
/**
 * List of known SQL connection types.
 */
var SqlConnectionType;
(function (SqlConnectionType) {
    /**
     * MySQL
     */
    SqlConnectionType[SqlConnectionType["MySql"] = 0] = "MySql";
    /**
     * Microsoft SQL
     */
    SqlConnectionType[SqlConnectionType["MSSql"] = 1] = "MSSql";
})(SqlConnectionType = exports.SqlConnectionType || (exports.SqlConnectionType = {}));
/**
 * Opens a SQL connection.
 *
 * @param {SqlConnectionType} type The type / engine.
 * @param {SqlConnectionOptions} [opts] The options.
 *
 * @returns {Promise<SqlConnection>} The promise with the new, open connection.
 */
async function openSqlConnection(type, opts) {
    let factory;
    switch (type) {
        case SqlConnectionType.MSSql:
            // Microsoft SQL
            factory = deploy_sql_mssql.openMSSQLConnection;
            break;
        case SqlConnectionType.MySql:
            // MySQL
            factory = deploy_sql_mysql.openMySQLConnection;
            break;
    }
    if (!factory) {
        throw new Error(i18.t('sql.notSupported', type));
    }
    return await Promise.resolve(factory(opts));
}
exports.openSqlConnection = openSqlConnection;
//# sourceMappingURL=sql.js.map