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
const deploy_contracts = require("../contracts");
const deploy_helpers = require("../helpers");
const deploy_sql = require("../sql");
const MySQL = require("mysql");
/**
 * A MySQL connection.
 */
class MySQLConnection extends deploy_helpers.DisposableBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {MySQL.Connection} connection The underlying connection instance.
     */
    constructor(connection) {
        super();
        this.connection = connection;
        /** @inheritdoc */
        this.type = deploy_sql.SqlConnectionType.MySql;
    }
    /** @inheritdoc */
    close() {
        const ME = this;
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            const OLD_CONNECTION = ME.connection;
            if (!OLD_CONNECTION) {
                COMPLETED(null, false);
                return;
            }
            try {
                OLD_CONNECTION.end((err) => {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        ME.connection = null;
                        COMPLETED(null, true);
                    }
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    /** @inheritdoc */
    onDispose() {
        this.close();
    }
    /** @inheritdoc */
    query(sql, ...args) {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.query(deploy_helpers.toStringSafe(sql), deploy_helpers.asArray(args), (err, rows) => {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        COMPLETED(null, [
                            {
                                connection: ME,
                                rows: rows,
                            }
                        ]);
                    }
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
}
exports.MySQLConnection = MySQLConnection;
/**
 * Opens a MySQL connection.
 *
 * @param {MySQLOptions} [opts] The options.
 *
 * @return {Promise<MySQLConnection>} The promise with the new connection.
 */
async function openMySQLConnection(opts) {
    if (!opts) {
        opts = {};
    }
    return new Promise(async (resolve, reject) => {
        const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
        try {
            let host = deploy_helpers.normalizeString(opts.host);
            if ('' === host) {
                host = deploy_contracts.DEFAULT_HOST;
            }
            let port = parseInt(deploy_helpers.toStringSafe(opts.port).trim());
            if (isNaN(port)) {
                port = 3306;
            }
            let user = deploy_helpers.toStringSafe(opts.user).trim();
            if ('' === user) {
                user = 'root';
            }
            let pwd = deploy_helpers.toStringSafe(opts.password);
            if ('' === pwd) {
                pwd = undefined;
            }
            let db = deploy_helpers.toStringSafe(opts.database).trim();
            if ('' === db) {
                db = undefined;
            }
            let charset = deploy_helpers.normalizeString(opts.charset);
            if ('' === charset) {
                charset = undefined;
            }
            let ssl;
            if (!deploy_helpers.isNullOrUndefined(opts.rejectUnauthorized)) {
                ssl = {
                    rejectUnauthorized: deploy_helpers.toBooleanSafe(opts.rejectUnauthorized, true),
                };
            }
            const CONN_OPTS = {
                charset: charset,
                database: db,
                host: host,
                port: port,
                user: user,
                password: pwd,
                ssl: ssl,
            };
            const CONN = MySQL.createConnection(CONN_OPTS);
            CONN.connect(function (err) {
                if (err) {
                    COMPLETED(err);
                }
                else {
                    COMPLETED(null, new MySQLConnection(CONN));
                }
            });
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.openMySQLConnection = openMySQLConnection;
//# sourceMappingURL=mysql.js.map