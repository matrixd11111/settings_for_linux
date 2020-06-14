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
const AzureStorage = require("azure-storage");
const Crypto = require("crypto");
const deploy_clients = require("../clients");
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const FS = require("fs");
const MimeTypes = require("mime-types");
const Moment = require("moment");
const Path = require("path");
/**
 * An Azure blob client.
 */
class AzureBlobClient extends deploy_clients.AsyncFileListBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {AzureBlobOptions} options The options.
     */
    constructor(options) {
        super();
        this.options = options;
    }
    /**
     * Gets the container name,
     */
    get container() {
        let normalizedContainer = deploy_helpers.normalizeString(this.options.container);
        if ('' === normalizedContainer) {
            normalizedContainer = 'vscode-deploy-reloaded';
        }
        return normalizedContainer;
    }
    createInstance() {
        if (deploy_helpers.toBooleanSafe(this.options.useDevelopmentStorage)) {
            return AzureStorage.createBlobService('UseDevelopmentStorage=true');
        }
        let host = deploy_helpers.normalizeString(this.options.host);
        if ('' === host) {
            host = undefined;
        }
        return AzureStorage.createBlobService(deploy_helpers.toStringSafe(this.options.account).trim(), deploy_helpers.toStringSafe(this.options.accessKey).trim(), host);
    }
    /** @inheritdoc */
    deleteFile(path) {
        const ME = this;
        path = toAzurePath(path);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const SERVICE = ME.createInstance();
                SERVICE.deleteBlob(ME.container, path, (err) => {
                    if (err) {
                        COMPLETED(null, false);
                    }
                    else {
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
    downloadFile(path) {
        const ME = this;
        path = toAzurePath(path);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const SERVICE = ME.createInstance();
                const DOWNLOADED_DATA = await deploy_helpers.invokeForTempFile((tmpFile) => {
                    return new Promise((res, rej) => {
                        const COMP = deploy_helpers.createCompletedAction(res, rej);
                        try {
                            const STREAM = FS.createWriteStream(tmpFile);
                            SERVICE.getBlobToStream(ME.container, path, STREAM, (err) => {
                                if (err) {
                                    COMP(err);
                                }
                                else {
                                    deploy_helpers.readFile(tmpFile).then((data) => {
                                        COMP(null, data);
                                    }).catch((e) => {
                                        COMP(e);
                                    });
                                }
                            });
                        }
                        catch (e) {
                            COMP(e);
                        }
                    });
                });
                COMPLETED(null, DOWNLOADED_DATA);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    /** @inheritdoc */
    async listDirectory(path) {
        const ME = this;
        path = toAzurePath(path);
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            const ALL_RESULTS = [];
            const ITEMS = [];
            const ALL_LOADED = () => {
                const DIRS_ALREADY_ADDED = {};
                for (const R of ALL_RESULTS) {
                    const NAME = deploy_helpers.toStringSafe(R.name);
                    const NAME_WITHOUT_PATH = deploy_helpers.normalizePath(NAME.substr(path.length));
                    if (NAME_WITHOUT_PATH.indexOf('/') > -1) {
                        // directory
                        const DIR = NAME_WITHOUT_PATH.split('/')[0];
                        let existingDir = DIRS_ALREADY_ADDED[DIR];
                        if (!existingDir) {
                            const DI = {
                                //TODO: exportPath: false,
                                name: DIR,
                                path: path,
                                type: deploy_files.FileSystemType.Directory,
                            };
                            ITEMS.push(DI);
                            existingDir = DIRS_ALREADY_ADDED[DIR] = DI;
                        }
                    }
                    else {
                        // file
                        const FI = {
                            download: async () => {
                                return await ME.downloadFile(path + '/' + NAME_WITHOUT_PATH);
                            },
                            //TODO: exportPath: false,
                            name: NAME_WITHOUT_PATH,
                            path: path,
                            size: parseInt(deploy_helpers.toStringSafe(R.contentLength).trim()),
                            type: deploy_files.FileSystemType.File,
                        };
                        if (!deploy_helpers.isEmptyString(R.lastModified)) {
                            FI.time = Moment(R.lastModified);
                        }
                        ITEMS.push(FI);
                    }
                }
                COMPLETED(null, ITEMS);
            };
            const HANDLE_RESULT = (result) => {
                if (!result) {
                    return;
                }
                const ENTRIES = result.entries;
                if (!ENTRIES) {
                    return;
                }
                for (const E of ENTRIES) {
                    if (E) {
                        ALL_RESULTS.push(E);
                    }
                }
            };
            try {
                const SERVICE = ME.createInstance();
                let currentContinuationToken = false;
                let nextSegment;
                nextSegment = () => {
                    try {
                        if (false !== currentContinuationToken) {
                            if (deploy_helpers.isEmptyString(currentContinuationToken)) {
                                ALL_LOADED();
                                return;
                            }
                        }
                        else {
                            currentContinuationToken = undefined;
                        }
                        SERVICE.listBlobsSegmented(ME.container, currentContinuationToken, (err, result) => {
                            if (err) {
                                COMPLETED(err);
                                return;
                            }
                            currentContinuationToken = result.continuationToken;
                            HANDLE_RESULT(result);
                            nextSegment();
                        });
                    }
                    catch (e) {
                        COMPLETED(e);
                    }
                };
                nextSegment();
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    /** @inheritdoc */
    get type() {
        return 'azureblob';
    }
    /** @inheritdoc */
    uploadFile(path, data) {
        const ME = this;
        path = toAzurePath(path);
        if (!data) {
            data = Buffer.alloc(0);
        }
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const SERVICE = ME.createInstance();
                let contentType = MimeTypes.lookup(Path.basename(path));
                if (false === contentType) {
                    contentType = 'application/octet-stream';
                }
                let contentMD5;
                if (deploy_helpers.toBooleanSafe(ME.options.hashContent)) {
                    contentMD5 = Crypto.createHash('md5').update(data).digest('base64');
                }
                SERVICE.createBlockBlobFromText(ME.container, path, data, {
                    contentSettings: {
                        contentMD5: contentMD5,
                        contentType: contentType,
                    }
                }, (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
}
exports.AzureBlobClient = AzureBlobClient;
/**
 * Creates a new client.
 *
 * @param {AzureBlobOptions} opts The options.
 *
 * @return {AzureBlobClient} The new client.
 */
function createClient(opts) {
    if (!opts) {
        opts = {};
    }
    return new AzureBlobClient(opts);
}
exports.createClient = createClient;
/**
 * Converts to an Azure path.
 *
 * @param {string} path The path to convert.
 *
 * @return {string} The converted path.
 */
function toAzurePath(path) {
    return deploy_helpers.normalizePath(path);
}
exports.toAzurePath = toAzurePath;
//# sourceMappingURL=azureblob.js.map