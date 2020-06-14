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
const Moment = require("moment");
const Path = require("path");
const SFTP = require('ssh2-sftp-client');
/**
 * The default value for a host address.
 */
exports.DEFAULT_HOST = '127.0.0.1';
/**
 * A basic SFTP client.
 */
class SFTPClient extends deploy_clients.AsyncFileListBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {SFTP} client The underlying client.
     */
    constructor(options) {
        super();
        this.options = options;
        this._checkedRemoteDirs = {};
        this.client = new SFTP();
        if (deploy_helpers.toBooleanSafe(options.tryKeyboard)) {
            let pwd = deploy_helpers.toStringSafe(options.password);
            this.client['client'].on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
                try {
                    finish([pwd]);
                }
                catch (e) {
                    deploy_log.CONSOLE
                        .trace(e, 'clients.sftp.SFTPClient(keyboard-interactive)');
                }
            });
        }
    }
    async createDirectoryIfNeeded(dir) {
        dir = toSFTPPath(dir);
        if ('/' !== dir) {
            if (true !== this._checkedRemoteDirs[dir]) {
                try {
                    // check if exist
                    await this.client.list(dir);
                }
                catch (_a) {
                    // no, try to create
                    await this.client.mkdir(dir, true);
                }
                // mark as checked
                this._checkedRemoteDirs[dir] = true;
                return true;
            }
        }
        return false;
    }
    async createParentDirectoryIfNeeded(dir) {
        dir = toSFTPPath(dir);
        const PARENT_DIR = toSFTPPath(deploy_helpers.from(dir.split('/'))
            .skipLast()
            .joinToString('/'));
        if (PARENT_DIR === dir) {
            return false;
        }
        return this.createDirectoryIfNeeded(PARENT_DIR);
    }
    /** @inheritdoc */
    async deleteFile(path) {
        path = toSFTPPath(path);
        const VALUES = [].concat(this.getValuesForFile(path));
        try {
            await this.executeCommandsBy((o) => o.commands.beforeDelete, VALUES);
            await this.client.delete(path);
            await this.executeCommandsBy((o) => o.commands.deleted, VALUES);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /** @inheritdoc */
    async downloadFile(path) {
        const ME = this;
        path = toSFTPPath(path);
        const VALUES = [].concat(this.getValuesForFile(path));
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                await this.executeCommandsBy((o) => o.commands.beforeDownload, VALUES);
                const DOWNLOADED_DATA = await deploy_helpers.asBuffer(await ME.client.get(path, null, null));
                await this.executeCommandsBy((o) => o.commands.downloaded, VALUES);
                COMPLETED(null, DOWNLOADED_DATA);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    /**
     * Executes commands by using a provider.
     *
     * @param {Function} provider The provider.
     * @param {deploy_values.Value|deploy_values.Value[]} [additionalValues] One or more additional values.
     *
     * @return {Promise<Buffer[]>} The promise with the execution results.
     */
    executeCommandsBy(provider, additionalValues) {
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            if (!this.options.commands) {
                COMPLETED(null, []);
                return;
            }
            try {
                const COMMANDS = deploy_helpers.asArray(provider(this.options));
                let connectionValues;
                if (this.options.valueProvider) {
                    connectionValues = deploy_helpers.asArray(this.options.valueProvider());
                }
                else {
                    connectionValues = [];
                }
                let enc = deploy_helpers.normalizeString(this.options.commands.encoding);
                if ('' === enc) {
                    enc = undefined;
                }
                const EXECUTE_COMMAND = (entry) => {
                    return new Promise((res, rej) => {
                        const ADDITIONAL_COMMAND_VALUES = [].concat(deploy_helpers.asArray(additionalValues));
                        const ALL_COMMAND_VALUES = connectionValues.concat(ADDITIONAL_COMMAND_VALUES)
                            .concat(this.values);
                        let output;
                        const COMP = (err) => {
                            if (err) {
                                rej(err);
                            }
                            else {
                                try {
                                    const WRITE_TO = deploy_helpers.normalizeString(entry.writeOutputTo);
                                    if ('' !== WRITE_TO) {
                                        let outputToWrite = _.isNil(output) ? output
                                            : output.toString(enc);
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
                                    res(output);
                                }
                                catch (e) {
                                    rej(e);
                                }
                            }
                        };
                        try {
                            const COMMAND_TO_EXECUTE = deploy_values.replaceWithValues(ALL_COMMAND_VALUES, entry.command);
                            if (deploy_helpers.isEmptyString(COMMAND_TO_EXECUTE)) {
                                COMP(null);
                                return;
                            }
                            output = Buffer.alloc(0);
                            this.client['client'].exec(COMMAND_TO_EXECUTE, (err, stream) => {
                                if (err) {
                                    COMP(err);
                                    return;
                                }
                                let dataListener;
                                let endListener;
                                let errorListener;
                                const CLOSE_STREAM = (err) => {
                                    deploy_helpers.tryRemoveListener(stream, 'end', endListener);
                                    deploy_helpers.tryRemoveListener(stream, 'error', errorListener);
                                    deploy_helpers.tryRemoveListener(stream, 'data', dataListener);
                                    if (err) {
                                        COMP(err);
                                    }
                                    else {
                                        COMP(null);
                                    }
                                };
                                errorListener = (streamErr) => {
                                    CLOSE_STREAM(streamErr);
                                };
                                endListener = () => {
                                    CLOSE_STREAM(null);
                                };
                                dataListener = (chunk) => {
                                    if (!chunk) {
                                        return;
                                    }
                                    try {
                                        if (!Buffer.isBuffer(chunk)) {
                                            chunk = new Buffer(deploy_helpers.toStringSafe(chunk), enc);
                                        }
                                        output = Buffer.concat([output, chunk]);
                                    }
                                    catch (e) {
                                        CLOSE_STREAM(e);
                                    }
                                };
                                try {
                                    stream.once('error', errorListener);
                                    stream.once('end', endListener);
                                    stream.on('data', dataListener);
                                }
                                catch (e) {
                                    CLOSE_STREAM(err);
                                }
                            });
                        }
                        catch (e) {
                            COMP(e);
                        }
                    });
                };
                const OUTPUTS = [];
                for (const C of COMMANDS) {
                    let entry;
                    if (deploy_helpers.isObject(C)) {
                        entry = C;
                    }
                    else {
                        entry = {
                            command: deploy_helpers.toStringSafe(C),
                        };
                    }
                    OUTPUTS.push(await EXECUTE_COMMAND(entry));
                }
                COMPLETED(null, OUTPUTS);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
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
    /** @inheritdoc */
    async listDirectory(path) {
        const ME = this;
        path = toSFTPPath(path);
        const RESULT = [];
        const LIST = await ME.client.list(path);
        for (const FI of LIST) {
            if ('d' === FI.type) {
                RESULT.push({
                    //TODO: exportPath: false,
                    name: FI.name,
                    path: deploy_helpers.normalizePath(path),
                    size: FI.size,
                    time: Moment(FI.modifyTime),
                    type: deploy_files.FileSystemType.Directory,
                });
            }
            else if ('-' === FI.type) {
                const SFTP_FILE = {
                    download: async () => {
                        const CLIENT = await openConnection(ME.options);
                        try {
                            return await CLIENT.downloadFile(deploy_helpers.normalizePath(path) +
                                '/' +
                                deploy_helpers.normalizePath(FI.name));
                        }
                        finally {
                            deploy_helpers.tryDispose(CLIENT);
                        }
                    },
                    //TODO: exportPath: false,
                    name: FI.name,
                    path: deploy_helpers.normalizePath(path),
                    size: FI.size,
                    time: Moment(FI.modifyTime),
                    type: deploy_files.FileSystemType.File,
                };
                RESULT.push(SFTP_FILE);
            }
            else {
                RESULT.push({
                    //TODO: exportPath: false,
                    name: FI.name,
                    path: deploy_helpers.normalizePath(path),
                    size: FI.size,
                    time: Moment(FI.modifyTime),
                });
            }
        }
        return RESULT;
    }
    /** @inheritdoc */
    onDispose() {
        this.client.end().then(() => {
        }).catch((err) => {
            deploy_log.CONSOLE
                .trace(err, 'clients.sftp.SFTPClient.onDispose(1)');
        });
    }
    /** @inheritdoc */
    async removeFolder(path) {
        path = toSFTPPath(path);
        if ('/' === path) {
            return false; // NOT the root folder!
        }
        try {
            await this.client.rmdir(path, true);
            return true;
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'clients.sftp.SFTPClient.removeFolder(1)');
            return false;
        }
    }
    /** @inheritdoc */
    get type() {
        return 'sftp';
    }
    /** @inheritdoc */
    uploadFile(path, data) {
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const REMOTE_DIR = toSFTPPath(Path.dirname(path));
                path = toSFTPPath(path);
                let fileModes = false;
                if (!deploy_helpers.isNullOrUndefined(this.options.modes)) {
                    let modes = this.options.modes;
                    if (!deploy_helpers.isObject(modes)) {
                        modes = {
                            '**/*': modes
                        };
                    }
                    fileModes = modes;
                }
                // create directories if needed
                if (!deploy_helpers.toBooleanSafe(this.options.supportsDeepDirectoryCreation)) {
                    await this.createParentDirectoryIfNeeded(REMOTE_DIR);
                }
                await this.createDirectoryIfNeeded(REMOTE_DIR);
                let modeToSet = false;
                if (false !== fileModes) {
                    let matchedPattern = false;
                    for (const P in fileModes) {
                        let pattern = P;
                        if (!pattern.trim().startsWith('/')) {
                            pattern = '/' + pattern;
                        }
                        const MATCH_OPTS = {
                            dot: true,
                            nocase: true,
                        };
                        if (deploy_helpers.doesMatch(path, pattern, MATCH_OPTS)) {
                            matchedPattern = P;
                            modeToSet = parseInt(deploy_helpers.toStringSafe(fileModes[P]).trim(), 8);
                            break;
                        }
                    }
                    if (false === matchedPattern) {
                        deploy_log.CONSOLE
                            .notice(`'${path}' does NOT match with a mode pattern`, 'clients.sftp.uploadFile(3)');
                    }
                    else {
                        deploy_log.CONSOLE
                            .notice(`'${path}' matches with mode pattern '${matchedPattern}'`, 'clients.sftp.uploadFile(3)');
                    }
                }
                const VALUES = [].concat(this.getValuesForFile(path));
                let uploadError;
                let hasBeenUploaded = false;
                try {
                    await this.executeCommandsBy((o) => o.commands.beforeUpload, VALUES);
                    let doUpload = true;
                    const BEFORE_UPLOAD_ARGS = {
                        connection: this.client,
                        data: data,
                        file: path,
                        mode: modeToSet,
                    };
                    const BEFORE_UPLOAD = this.options.beforeUpload;
                    if (BEFORE_UPLOAD) {
                        const BEFORE_UPLOAD_RESULT = deploy_helpers.toBooleanSafe(await Promise.resolve(BEFORE_UPLOAD(BEFORE_UPLOAD_ARGS)), true);
                        doUpload = false !== BEFORE_UPLOAD_RESULT;
                    }
                    if (doUpload) {
                        data = await deploy_helpers.asBuffer(BEFORE_UPLOAD_ARGS.data);
                        if (!data) {
                            data = Buffer.alloc(0);
                        }
                        await this.client.put(data, path);
                        hasBeenUploaded = true;
                        await this.executeCommandsBy((o) => o.commands.uploaded, VALUES);
                    }
                }
                catch (e) {
                    uploadError = e;
                }
                finally {
                    let errorHandled = false;
                    const UPLOAD_COMPLETED_ARGS = {
                        connection: this.client,
                        data: data,
                        error: uploadError,
                        file: path,
                        hasBeenUploaded: hasBeenUploaded,
                        mode: modeToSet,
                    };
                    const UPLOAD_COMPLETED = this.options.uploadCompleted;
                    if (UPLOAD_COMPLETED) {
                        const UPLOAD_COMPLETED_RESULT = deploy_helpers.toBooleanSafe(await Promise.resolve(UPLOAD_COMPLETED(UPLOAD_COMPLETED_ARGS)));
                        errorHandled = false !== UPLOAD_COMPLETED_RESULT;
                    }
                    if (uploadError && !errorHandled) {
                        throw uploadError;
                    }
                }
                if (hasBeenUploaded) {
                    if (false !== modeToSet) {
                        deploy_log.CONSOLE
                            .info(`Setting mode for '${path}' to ${modeToSet.toString(8)} ...`, 'clients.sftp.uploadFile(1)');
                        this.client['sftp'].chmod(path, modeToSet, (err) => {
                            if (err) {
                                deploy_log.CONSOLE
                                    .trace(err, 'clients.sftp.uploadFile(2)');
                            }
                            COMPLETED(err);
                        });
                    }
                    else {
                        COMPLETED(null);
                    }
                }
                else {
                    COMPLETED(null);
                }
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
}
exports.SFTPClient = SFTPClient;
/**
 * Creates a new client.
 *
 * @param {SFTPConnectionOptions} opts The options.
 *
 * @return {SFTPClient} The new client.
 */
function createClient(opts) {
    if (!opts) {
        opts = {};
    }
    return new SFTPClient(opts);
}
exports.createClient = createClient;
/**
 * Opens a connection.
 *
 * @param {SFTPConnectionOptions} opts The options.
 *
 * @return {Promise<SFTPClient>} The promise with new client.
 */
async function openConnection(opts) {
    const CLIENT = createClient(opts);
    let host = deploy_helpers.normalizeString(opts.host);
    if ('' === host) {
        host = deploy_contracts.DEFAULT_HOST;
    }
    let port = parseInt(deploy_helpers.toStringSafe(opts.port).trim());
    if (isNaN(port)) {
        port = 22;
    }
    let agent = deploy_helpers.toStringSafe(opts.agent);
    if (deploy_helpers.isEmptyString(agent)) {
        agent = undefined;
    }
    let hashAlgo = deploy_helpers.normalizeString(opts.hashAlgorithm);
    if ('' === hashAlgo) {
        hashAlgo = 'md5';
    }
    // supported hashes
    let hashes = deploy_helpers.asArray(opts.hashes)
        .map(x => deploy_helpers.normalizeString(x))
        .filter(x => '' !== x);
    // username and password
    let user = deploy_helpers.toStringSafe(opts.user);
    if ('' === user) {
        user = undefined;
    }
    let pwd = deploy_helpers.toStringSafe(opts.password);
    if ('' === pwd) {
        pwd = undefined;
    }
    let privateKeyFile = deploy_helpers.toStringSafe(opts.privateKey);
    if (deploy_helpers.isEmptyString(privateKeyFile)) {
        privateKeyFile = false;
    }
    let privateKeyPassphrase = deploy_helpers.toStringSafe(opts.privateKeyPassphrase);
    if ('' === privateKeyPassphrase) {
        privateKeyPassphrase = undefined;
    }
    let readyTimeout = parseInt(deploy_helpers.toStringSafe(opts.readyTimeout).trim());
    if (isNaN(readyTimeout)) {
        readyTimeout = 20000;
    }
    let privateKey;
    if (false !== privateKeyFile) {
        privateKey = await deploy_helpers.readFile(privateKeyFile);
    }
    const DEBUG = deploy_helpers.toBooleanSafe(opts.debug);
    await CLIENT.client.connect({
        agent: agent,
        agentForward: deploy_helpers.toBooleanSafe(opts.agentForward),
        hostHash: hashAlgo,
        hostVerifier: (keyHash) => {
            if (hashes.length < 1) {
                return true;
            }
            keyHash = deploy_helpers.normalizeString(keyHash);
            return hashes.indexOf(keyHash) > -1;
        },
        host: host,
        passphrase: privateKeyPassphrase,
        password: pwd,
        port: port,
        privateKey: privateKey,
        readyTimeout: readyTimeout,
        tryKeyboard: deploy_helpers.toBooleanSafe(opts.tryKeyboard),
        username: user,
        debug: (info) => {
            if (!DEBUG) {
                return;
            }
            deploy_log.CONSOLE
                .debug(info, `clients.sftp`);
        }
    });
    await CLIENT.executeCommandsBy((o) => o.commands.connected);
    return CLIENT;
}
exports.openConnection = openConnection;
/**
 * Converts to a SFTP path.
 *
 * @param {string} p The path to convert.
 *
 * @return {string} The converted path.
 */
function toSFTPPath(p) {
    p = deploy_helpers.normalizePath(p);
    if ('.' === p) {
        p = '';
    }
    return '/' + p;
}
exports.toSFTPPath = toSFTPPath;
//# sourceMappingURL=sftp.js.map