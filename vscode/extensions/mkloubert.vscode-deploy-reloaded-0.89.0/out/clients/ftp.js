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
const _ = require("lodash");
const deploy_clients = require("../clients");
const deploy_code = require("../code");
const deploy_contracts = require("../contracts");
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_log = require("../log");
const deploy_values = require("../values");
const FTP = require('@icetee/ftp');
const FTP_Legacy = require('ftp');
const i18 = require("../i18");
const jsFTP = require('jsftp');
const Moment = require("moment");
const ParseListening = require("parse-listing");
const Path = require("path");
/**
 * The default value for a host address.
 */
exports.DEFAULT_HOST = '127.0.0.1';
/**
 * A basic FTP client.
 */
class FTPClientBase extends deploy_clients.AsyncFileListBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {FTPConnectionOptions} opts The options.
     */
    constructor(opts) {
        super();
        this._existingRemoteDirs = {};
        this.options = deploy_helpers.cloneObject(opts) || {};
    }
    /**
     * Gets the internal connection object /value.
     */
    get connection() {
        return this._connection;
    }
    /**
     * Creates a directory if it does not exist.
     *
     * @param {string} dir The directory.
     *
     * @return {Promise<boolean>} The promise that indicates if directory has been created or not.
     */
    async createDirectoryIfNeeded(dir) {
        dir = toFTPPath(dir);
        if ('/' === dir) {
            return false;
        }
        // check if remote directory exists ...
        if (true === this._existingRemoteDirs[dir]) {
            return false; // seems to exist
        }
        try {
            await this.cwd(dir);
        }
        catch (_a) {
            // no, try to create
            await this.mkdir(dir);
        }
        // mark as checked
        this._existingRemoteDirs[dir] = true;
        return true;
    }
    /**
     * Creates a parent directory if it does not exist.
     *
     * @param {string} dir The child of the directory to check.
     *
     * @return {Promise<boolean>} The promise that indicates if parent directory has been created or not.
     */
    async createParentDirectoryIfNeeded(dir) {
        dir = toFTPPath(dir);
        const PARENT_DIR = toFTPPath(deploy_helpers.from(dir.split('/'))
            .skipLast()
            .joinToString('/'));
        if (PARENT_DIR === dir) {
            return false;
        }
        return this.createDirectoryIfNeeded(PARENT_DIR);
    }
    /** @inheritdoc */
    async deleteFile(path) {
        const VALUES = [].concat(this.getValuesForFile(path));
        try {
            await this.executeCommandsBy((opts) => opts.commands.beforeDelete, VALUES);
            await this.unlink(path);
            await this.executeCommandsBy((opts) => opts.commands.deleted, VALUES);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /** @inheritdoc */
    async downloadFile(path) {
        const VALUES = [].concat(this.getValuesForFile(path));
        let data;
        await this.executeCommandsBy((opts) => opts.commands.beforeDownload, VALUES);
        data = await this.get(path);
        await this.executeCommandsBy((opts) => opts.commands.downloaded, VALUES);
        return data;
    }
    /**
     * Executes commands by using a provider.
     *
     * @param {Function} provider The provider.
     * @param {deploy_values.Value|deploy_values.Value[]} [additionalValues] One or more additional values.
     *
     * @return {Promise<Buffer[]>} The promise with the execution results.
     */
    async executeCommandsBy(provider, additionalValues) {
        if (!this.options.commands) {
            return [];
        }
        let commandValues;
        if (this.options.valueProvider) {
            commandValues = deploy_helpers.asArray(this.options.valueProvider());
        }
        else {
            commandValues = [];
        }
        let enc = deploy_helpers.normalizeString(this.options.commands.encoding);
        if ('' === enc) {
            enc = undefined;
        }
        const RESULTS = [];
        const COMMANDS = deploy_helpers.asArray(provider(this.options));
        for (const C of COMMANDS) {
            let entry;
            if (deploy_helpers.isObject(C)) {
                entry = C;
            }
            else {
                entry = {
                    command: deploy_helpers.toStringSafe(C)
                };
            }
            const ADDITIONAL_COMMAND_VALUES = [].concat(deploy_helpers.asArray(additionalValues));
            const ALL_COMMAND_VALUES = commandValues.concat(ADDITIONAL_COMMAND_VALUES)
                .concat(this.values);
            const COMMAND_TO_EXECUTE = deploy_values.replaceWithValues(ALL_COMMAND_VALUES, entry.command);
            let res;
            if (!deploy_helpers.isEmptyString(COMMAND_TO_EXECUTE)) {
                res = await this.execute(COMMAND_TO_EXECUTE);
            }
            RESULTS.push(res);
            const WRITE_TO = deploy_helpers.normalizeString(entry.writeOutputTo);
            if ('' !== WRITE_TO) {
                let outputToWrite = _.isNil(res) ? res
                    : res.toString(enc);
                const EXECUTE_BEFORE_WRITE = deploy_helpers.toStringSafe(entry.executeBeforeWriteOutputTo);
                if (!deploy_helpers.isEmptyString(EXECUTE_BEFORE_WRITE)) {
                    const EXECUTE_BEFORE_WRITE_VALUES = [
                        new deploy_values.StaticValue({
                            value: outputToWrite,
                        }, WRITE_TO),
                    ];
                    outputToWrite = deploy_code.exec({
                        code: EXECUTE_BEFORE_WRITE,
                        context: {
                            command: entry,
                            output: res,
                        },
                        values: ALL_COMMAND_VALUES.concat(EXECUTE_BEFORE_WRITE_VALUES),
                    });
                }
                this.setValue(WRITE_TO, deploy_helpers.toStringSafe(outputToWrite));
            }
        }
        return RESULTS;
    }
    /**
     * Returns a list of values for a file.
     *
     * @param {string} file The path of the remote file.
     *
     * @return {deploy_values.Value[]} The values.
     */
    getValuesForFile(file) {
        return [
            new deploy_values.StaticValue({
                value: Path.dirname(file),
            }, 'remote_dir'),
            new deploy_values.StaticValue({
                value: file,
            }, 'remote_file'),
            new deploy_values.StaticValue({
                value: Path.basename(file),
            }, 'remote_name'),
        ];
    }
    /**
     * Gets if the client is currently connected or not.
     */
    get isConnected() {
        return !deploy_helpers.isNullOrUndefined(this.connection);
    }
    /** @inheritdoc */
    async listDirectory(path) {
        return await this.list(path);
    }
    /**
     * Invokes the event for an 'before upload' operation.
     *
     * @param {string} path The path of the remote file.
     * @param {Buffer} data The data to upload.
     *
     * @param {Promise<Buffer|false>} The promise with the data to upload or (false)
     *                                if the file should NOT be uploaded.
     */
    async onBeforeUpload(path, data) {
        let doUpload = true;
        const BEFORE_UPLOAD_ARGS = {
            connection: this.connection,
            data: data,
            file: path,
        };
        const BEFORE_UPLOAD = this.options.beforeUpload;
        if (BEFORE_UPLOAD) {
            const BEFORE_UPLOAD_RESULT = deploy_helpers.toBooleanSafe(await Promise.resolve(BEFORE_UPLOAD(BEFORE_UPLOAD_ARGS)), true);
            doUpload = false !== BEFORE_UPLOAD_RESULT;
        }
        return doUpload ? BEFORE_UPLOAD_ARGS.data
            : false;
    }
    /** @inheritdoc */
    onDispose() {
        this.end().then(() => {
        }).catch((err) => {
            deploy_log.CONSOLE
                .trace(err, 'clients.ftp.FTPClientBase.onDispose(1)');
        });
    }
    /**
     * Invokes the event for an 'upload completed' operation.
     *
     * @param {any} err The error (if occurred).
     * @param {string} path The path of the remote file.
     * @param {Buffer} data The uploaded data.
     * @param {boolean} hasBeenUploaded Indicates if file has been uploaded or not.
     */
    async onUploadCompleted(err, path, data, hasBeenUploaded) {
        let errorHandled = false;
        const UPLOAD_COMPLETED_ARGS = {
            connection: this.connection,
            data: data,
            error: err,
            file: path,
            hasBeenUploaded: hasBeenUploaded,
        };
        const UPLOAD_COMPLETED = this.options.uploadCompleted;
        if (UPLOAD_COMPLETED) {
            const UPLOAD_COMPLETED_RESULT = deploy_helpers.toBooleanSafe(await Promise.resolve(UPLOAD_COMPLETED(UPLOAD_COMPLETED_ARGS)));
            errorHandled = false !== UPLOAD_COMPLETED_RESULT;
        }
        if (err && !errorHandled) {
            throw err;
        }
    }
    /** @inheritdoc */
    async removeFolder(path) {
        path = toFTPPath(path);
        if ('/' === path) {
            return false; // NOT the root folder!
        }
        try {
            await this.rmdir(path);
            return true;
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'clients.ftp.FTPClientBase.removeFolder(1)');
            return false;
        }
    }
    /** @inheritdoc */
    get type() {
        return 'ftp';
    }
    /** @inheritdoc */
    async uploadFile(path, data) {
        const VALUES = [].concat(this.getValuesForFile(path));
        await this.executeCommandsBy(opts => opts.commands.beforeUpload, VALUES);
        const BEFORE_UPLOAD_RESULT = await this.onBeforeUpload(path, data);
        let hasBeenUploaded = false;
        let uploadError;
        try {
            if (false === BEFORE_UPLOAD_RESULT) {
                return;
            }
            data = await deploy_helpers.asBuffer(BEFORE_UPLOAD_RESULT);
            if (!data) {
                data = Buffer.alloc(0);
            }
            await this.put(path, data);
            hasBeenUploaded = true;
            await this.executeCommandsBy(opts => opts.commands.uploaded, VALUES);
        }
        catch (e) {
            uploadError = e;
        }
        finally {
            await this.onUploadCompleted(uploadError, path, data, hasBeenUploaded);
        }
    }
}
exports.FTPClientBase = FTPClientBase;
class FtpClient extends FTPClientBase {
    connect() {
        const ME = this;
        let host = deploy_helpers.normalizeString(this.options.host).trim();
        if ('' === host) {
            host = '127.0.0.1';
        }
        const PORT = parseInt(deploy_helpers.toStringSafe(this.options.port).trim());
        let user = deploy_helpers.toStringSafe(this.options.user, 'anonymous');
        let pwd = deploy_helpers.toStringSafe(this.options.password);
        if ('' === pwd) {
            pwd = undefined;
        }
        const ENGINE = deploy_helpers.normalizeString(this.options.engine);
        return new Promise((resolve, reject) => {
            let conn;
            let completedInvoked = false;
            const COMPLETED = (err, connected) => {
                if (completedInvoked) {
                    return;
                }
                completedInvoked = true;
                if (err) {
                    reject(err);
                }
                else {
                    ME._connection = conn;
                    resolve(connected);
                }
            };
            if (ME.isConnected) {
                COMPLETED(null, false);
                return;
            }
            try {
                conn = ('ftp-legacy' === ENGINE) ? new FTP_Legacy()
                    : new FTP();
                conn.once('error', function (err) {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        COMPLETED(null, true);
                    }
                });
                conn.once('ready', function () {
                    COMPLETED(null, true);
                });
                let secure = this.options.secure;
                let secureOptions;
                if (!_.isNil(secure)) {
                    secureOptions = {
                        rejectUnauthorized: deploy_helpers.toBooleanSafe(this.options.rejectUnauthorized),
                    };
                    if (_.isBoolean(secure)) {
                        if (!secure) {
                            secureOptions = undefined;
                        }
                    }
                    else {
                        secure = deploy_helpers.normalizeString(secure);
                        if ('' === secure) {
                            secure = true;
                        }
                    }
                }
                let ftpPort = PORT;
                if (isNaN(ftpPort)) {
                    ftpPort = 21;
                    if (!_.isNil(secure)) {
                        if (false !== secure) {
                            ftpPort = 990;
                        }
                    }
                }
                conn.connect({
                    host: host, port: ftpPort,
                    user: user, password: pwd,
                    secure: secure,
                    secureOptions: secureOptions,
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    get connection() {
        return this._connection;
    }
    cwd(dir) {
        const ME = this;
        dir = toFTPPath(dir);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.cwd(dir, (err) => {
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
    end() {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const OLD_CONNECTION = ME.connection;
                if (OLD_CONNECTION) {
                    OLD_CONNECTION.end();
                    ME._connection = null;
                    COMPLETED(null, true);
                }
                else {
                    COMPLETED(null, false);
                }
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    execute(cmd) {
        cmd = deploy_helpers.toStringSafe(cmd);
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const SEND_FUNC = ME.connection['_send'];
                const ARGS = [
                    cmd,
                    (err, respTxt, respCode) => {
                        if (err) {
                            COMPLETED(err);
                        }
                        else {
                            COMPLETED(null, new Buffer(`${respCode} ${deploy_helpers.toStringSafe(respTxt)}`, 'ascii'));
                        }
                    }
                ];
                SEND_FUNC.apply(ME.connection, ARGS);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    get(file) {
        const ME = this;
        file = toFTPPath(file);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.get(file, (err, stream) => {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        deploy_helpers.readStream(stream).then((data) => {
                            COMPLETED(null, data);
                        }).catch((err) => {
                            COMPLETED(err);
                        });
                    }
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    list(dir) {
        const ME = this;
        dir = toFTPPath(dir);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.list(dir, (err, list) => {
                    if (err) {
                        COMPLETED(err);
                        return;
                    }
                    const RESULT = [];
                    if (list) {
                        for (let i = 0; i < list.length; i++) {
                            const ITEM = list[i];
                            if (!ITEM) {
                                continue;
                            }
                            let newFSIItem;
                            let time;
                            if (ITEM.date) {
                                time = Moment(ITEM.date);
                            }
                            switch (deploy_helpers.normalizeString(ITEM.type)) {
                                case '-':
                                    // file
                                    {
                                        let size;
                                        if (!deploy_helpers.isEmptyString(ITEM.size)) {
                                            size = parseInt(ITEM.size.trim());
                                        }
                                        const FI = {
                                            download: async () => {
                                                const CLIENT = new JsFTPClient(ME.options);
                                                if (!(await CLIENT.connect())) {
                                                    throw new Error(i18.t('ftp.couldNotConnectWithJSFTP'));
                                                }
                                                try {
                                                    return await CLIENT.get(toFTPPath(deploy_helpers.normalizePath(dir) +
                                                        '/' +
                                                        deploy_helpers.normalizePath(ITEM.name)));
                                                }
                                                finally {
                                                    try {
                                                        await CLIENT.end();
                                                    }
                                                    catch (e) {
                                                        deploy_log.CONSOLE
                                                            .trace(e, 'clients.ftp.FTPClient.listDirectory().FI.download()');
                                                    }
                                                }
                                            },
                                            //TODO: exportPath: false,
                                            name: ITEM.name,
                                            path: dir,
                                            size: size,
                                            time: time,
                                            type: deploy_files.FileSystemType.File,
                                        };
                                        newFSIItem = FI;
                                    }
                                    break;
                                case 'd':
                                    // folder
                                    {
                                        const DI = {
                                            //TODO: exportPath: false,
                                            name: ITEM.name,
                                            path: dir,
                                            time: time,
                                            type: deploy_files.FileSystemType.Directory,
                                        };
                                        newFSIItem = DI;
                                    }
                                    break;
                                default:
                                    // unknown
                                    {
                                        const FSI = {
                                            //TODO: exportPath: false,
                                            time: time,
                                            name: ITEM.name,
                                            path: dir,
                                        };
                                        newFSIItem = FSI;
                                    }
                                    break;
                            }
                            RESULT.push(newFSIItem);
                        }
                    }
                    COMPLETED(null, RESULT);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    mkdir(dir) {
        const ME = this;
        dir = toFTPPath(dir);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                if (!deploy_helpers.toBooleanSafe(ME.options.supportsDeepDirectoryCreation)) {
                    await ME.createParentDirectoryIfNeeded(dir);
                }
                ME.connection.mkdir(dir, true, (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    put(file, data) {
        const ME = this;
        file = toFTPPath(file);
        if (!data) {
            data = Buffer.alloc(0);
        }
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                await ME.createDirectoryIfNeeded(Path.dirname(file));
                ME.connection.put(data, file, (err) => {
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
    rmdir(path) {
        const ME = this;
        path = toFTPPath(path);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.rmdir(path, true, (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    unlink(path) {
        const ME = this;
        path = toFTPPath(path);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.delete(path, (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
}
class JsFTPClient extends FTPClientBase {
    connect() {
        const ME = this;
        let host = deploy_helpers.normalizeString(ME.options.host);
        if ('' === host) {
            host = deploy_contracts.DEFAULT_HOST;
        }
        let port = parseInt(deploy_helpers.toStringSafe(ME.options.port).trim());
        if (isNaN(port)) {
            port = 21;
        }
        let user = deploy_helpers.toStringSafe(this.options.user, 'anonymous');
        let pwd = deploy_helpers.toStringSafe(ME.options.password);
        if ('' === pwd) {
            pwd = undefined;
        }
        return new Promise((resolve, reject) => {
            let conn;
            let completedInvoked = false;
            const COMPLETED = (err, connected) => {
                if (completedInvoked) {
                    return;
                }
                completedInvoked = true;
                if (err) {
                    reject(err);
                }
                else {
                    ME._connection = conn;
                    resolve(connected);
                }
            };
            try {
                if (ME.isConnected) {
                    COMPLETED(null, false);
                    return;
                }
                conn = new jsFTP({
                    host: host,
                    port: port,
                    user: user,
                    pass: pwd,
                });
                COMPLETED(null, true);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    cwd(dir) {
        const ME = this;
        dir = toFTPPath(dir);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.raw("CWD", [dir], (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    end() {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const OLD_CONNECTION = ME._connection;
                if (OLD_CONNECTION) {
                    OLD_CONNECTION.destroy();
                    ME._connection = null;
                    COMPLETED(null, true);
                }
                else {
                    COMPLETED(null, false);
                }
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    execute(cmd) {
        cmd = deploy_helpers.toStringSafe(cmd);
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const PARTS = cmd.split(' ')
                    .filter(x => '' !== x.trim());
                let c;
                if (PARTS.length > 0) {
                    c = PARTS[0].trim();
                }
                const ARGS = PARTS.filter((a, i) => i > 0);
                ME.connection.raw(c, ARGS, (err, result) => {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        COMPLETED(null, _.isNil(result.text) ? result.text : new Buffer(result.text, 'ascii'));
                    }
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    get(file) {
        const ME = this;
        file = toFTPPath(file);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.get(file, (err, socket) => {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        try {
                            let result = Buffer.alloc(0);
                            socket.on("data", function (data) {
                                try {
                                    if (data) {
                                        result = Buffer.concat([result, data]);
                                    }
                                }
                                catch (e) {
                                    COMPLETED(e);
                                }
                            });
                            socket.once("close", function (hadErr) {
                                if (hadErr) {
                                    COMPLETED(hadErr);
                                }
                                else {
                                    COMPLETED(null, result);
                                }
                            });
                            socket.resume();
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
    list(dir) {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.list(dir, (err, result) => {
                    if (err) {
                        if (451 == err.code) {
                            COMPLETED(null, []);
                            return;
                        }
                        COMPLETED(err);
                        return;
                    }
                    try {
                        ParseListening.parseEntries(result, (err, list) => {
                            if (err) {
                                COMPLETED(err);
                                return;
                            }
                            const RESULT = [];
                            if (list) {
                                for (let i = 0; i < list.length; i++) {
                                    const ITEM = list[i];
                                    if (!ITEM) {
                                        continue;
                                    }
                                    let newFSIItem;
                                    let time;
                                    if (!deploy_helpers.isNullOrUndefined(ITEM.time)) {
                                        time = Moment(ITEM.time);
                                    }
                                    switch (ITEM.type) {
                                        case 0:
                                            // file
                                            {
                                                let size;
                                                if (!deploy_helpers.isEmptyString(ITEM.size)) {
                                                    size = parseInt(ITEM.size.trim());
                                                }
                                                const FI = {
                                                    download: async () => {
                                                        const CLIENT = new JsFTPClient(ME.options);
                                                        if (!(await CLIENT.connect())) {
                                                            throw new Error(i18.t('ftp.couldNotConnectWithJSFTP'));
                                                        }
                                                        try {
                                                            return await CLIENT.get(toFTPPath(deploy_helpers.normalizePath(dir) +
                                                                '/' +
                                                                deploy_helpers.normalizePath(ITEM.name)));
                                                        }
                                                        finally {
                                                            try {
                                                                await CLIENT.end();
                                                            }
                                                            catch (e) {
                                                                deploy_log.CONSOLE
                                                                    .trace(e, 'clients.ftp.JsFTPClient.list().FI.download()');
                                                            }
                                                        }
                                                    },
                                                    //TODO: exportPath: false,
                                                    name: ITEM.name,
                                                    path: dir,
                                                    size: size,
                                                    time: time,
                                                    type: deploy_files.FileSystemType.File,
                                                };
                                                newFSIItem = FI;
                                            }
                                            break;
                                        case 1:
                                            // folder
                                            {
                                                const DI = {
                                                    //TODO: exportPath: false,
                                                    name: ITEM.name,
                                                    path: dir,
                                                    time: time,
                                                    type: deploy_files.FileSystemType.Directory,
                                                };
                                                newFSIItem = DI;
                                            }
                                            break;
                                        default:
                                            // unknown
                                            {
                                                const FSI = {
                                                    //TODO: exportPath: false,
                                                    name: ITEM.name,
                                                    path: dir,
                                                    time: time,
                                                };
                                                newFSIItem = FSI;
                                            }
                                            break;
                                    }
                                    RESULT.push(newFSIItem);
                                }
                            }
                            COMPLETED(null, RESULT);
                        });
                    }
                    catch (e) {
                        COMPLETED(e);
                    }
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    mkdir(dir) {
        const ME = this;
        dir = toFTPPath(dir);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                if (!deploy_helpers.toBooleanSafe(ME.options.supportsDeepDirectoryCreation)) {
                    await ME.createParentDirectoryIfNeeded(dir);
                }
                ME.connection.raw('mkd', [dir], (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    put(file, data) {
        const ME = this;
        file = toFTPPath(file);
        if (!data) {
            data = Buffer.alloc(0);
        }
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                await ME.createDirectoryIfNeeded(Path.dirname(file));
                ME.connection.put(data, file, (err) => {
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
    rmdir(path) {
        const ME = this;
        path = toFTPPath(path);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const FILES_AND_FOLDERS = await ME.list(path);
                const TO_PATH = (wnp) => {
                    return deploy_helpers.normalizePath(deploy_helpers.normalizePath(wnp.path) +
                        '/' +
                        deploy_helpers.normalizePath(wnp.name));
                };
                // first delete sub folders
                for (const F of FILES_AND_FOLDERS.filter(ff => deploy_files.FileSystemType.Directory === ff.type)) {
                    await ME.removeFolder(TO_PATH(F));
                }
                // then the files
                for (const F of FILES_AND_FOLDERS.filter(ff => deploy_files.FileSystemType.File === ff.type)) {
                    await ME.deleteFile(TO_PATH(F));
                }
                ME.connection.raw('rmd', path, (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    unlink(path) {
        const ME = this;
        path = toFTPPath(path);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.connection.raw('dele', path, (err) => {
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
}
/**
 * Creates a new client.
 *
 * @param {FTPConnectionOptions} opts The options.
 *
 * @return {FTPClientBase} The new client.
 */
function createClient(opts) {
    if (!opts) {
        opts = opts;
    }
    switch (deploy_helpers.normalizeString(opts.engine)) {
        case 'ftp':
        case 'ftp-legacy':
            return new FtpClient(opts);
    }
    return new JsFTPClient(opts);
}
exports.createClient = createClient;
/**
 * Opens a connection.
 *
 * @param {FTPConnectionOptions} opts The options.
 *
 * @return {Promise<FTPClientBase>} The promise with new client.
 */
async function openConnection(opts) {
    const CLIENT = createClient(opts);
    if (!(await CLIENT.connect())) {
        throw new Error(i18.t('ftp.couldNotConnect'));
    }
    await CLIENT.executeCommandsBy(opts => opts.commands.connected);
    return CLIENT;
}
exports.openConnection = openConnection;
/**
 * Converts to a FTP path.
 *
 * @param {string} p The path to convert.
 *
 * @return {string} The converted path.
 */
function toFTPPath(p) {
    p = deploy_helpers.normalizePath(p);
    if ('.' === p) {
        p = '';
    }
    return '/' + p;
}
exports.toFTPPath = toFTPPath;
//# sourceMappingURL=ftp.js.map