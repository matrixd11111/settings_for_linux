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
const deploy_clients = require("../clients");
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_log = require("../log");
const Dropbox = require('dropbox');
const Moment = require("moment");
/**
 * A Dropbox file client.
 */
class DropBoxClient extends deploy_clients.AsyncFileListBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {DropboxOptions} options The options for the client.
     */
    constructor(options) {
        super();
        this.options = options;
        let accessToken = deploy_helpers.toStringSafe(options.accessToken).trim();
        if ('' === accessToken) {
            accessToken = undefined;
        }
        this.connection = new Dropbox({
            accessToken: accessToken
        });
    }
    /** @inheritdoc */
    async deleteFile(path) {
        path = toDropBoxPath(path);
        try {
            await this.connection.filesDeleteV2({
                path: path,
            });
            return true;
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'clients.dropbox.DropBoxClient.deleteFile(1)');
            return false;
        }
    }
    /** @inheritdoc */
    async downloadFile(path) {
        path = toDropBoxPath(path);
        const META_DATA = await this.connection.filesDownload({
            path: path,
        });
        return new Buffer(META_DATA.fileBinary, 'binary');
    }
    /** @inheritdoc */
    async listDirectory(path) {
        const ME = this;
        path = toDropBoxPath(path);
        const RESULT = [];
        const LIST = await this.connection.filesListFolder({
            include_media_info: true,
            include_mounted_folders: true,
            path: path,
            recursive: false,
        });
        if (LIST && LIST.entries) {
            for (const ENTRY of LIST.entries) {
                switch (deploy_helpers.normalizeString(ENTRY['.tag'])) {
                    case 'file':
                        {
                            const FI = {
                                download: async () => {
                                    return await ME.downloadFile(deploy_helpers.normalizePath(deploy_helpers.normalizePath(path) + '/' + ENTRY.name));
                                },
                                //TODO: exportPath: false,
                                name: ENTRY.name,
                                path: deploy_helpers.normalizePath(path),
                                size: ENTRY.size,
                                time: Moment(ENTRY.server_modified),
                                type: deploy_files.FileSystemType.File,
                            };
                            RESULT.push(FI);
                        }
                        break;
                    case 'folder':
                        {
                            const DI = {
                                //TODO: exportPath: false,
                                name: ENTRY.name,
                                path: deploy_helpers.normalizePath(path),
                                type: deploy_files.FileSystemType.Directory,
                            };
                            RESULT.push(DI);
                        }
                        break;
                    default:
                        {
                            const FSI = {
                                //TODO: exportPath: false,
                                name: ENTRY.name,
                                path: deploy_helpers.normalizePath(path),
                            };
                            RESULT.push(FSI);
                        }
                        break;
                }
            }
        }
        return RESULT;
    }
    /** @inheritdoc */
    async removeFolder(path) {
        path = toDropBoxPath(path);
        if ('/' === path) {
            return false; // NOT the root folder!
        }
        try {
            await this.connection.filesDeleteV2({
                path: path,
            });
            return true;
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'clients.dropbox.DropBoxClient.removeFolder(1)');
            return false;
        }
    }
    /** @inheritdoc */
    get type() {
        return 'dropbox';
    }
    /** @inheritdoc */
    async uploadFile(path, data) {
        path = toDropBoxPath(path);
        await this.connection.filesUpload({
            autorename: false,
            contents: data,
            mode: 'overwrite',
            mute: false,
            path: path,
        });
    }
}
exports.DropBoxClient = DropBoxClient;
/**
 * Creates a new client.
 *
 * @param {DropboxOptions} opts The options for the new client.
 *
 * @return {DropBoxClient} The new client.
 */
function createClient(opts) {
    if (!opts) {
        return opts;
    }
    return new DropBoxClient(opts);
}
exports.createClient = createClient;
/**
 * Converts to a Dropbox path.
 *
 * @param {string} p The path to convert.
 *
 * @return {string} The converted path.
 */
function toDropBoxPath(p) {
    p = deploy_helpers.normalizePath(p);
    if ('.' === p) {
        p = '';
    }
    if ('' !== p) {
        p = '/' + p;
    }
    return p;
}
exports.toDropBoxPath = toDropBoxPath;
//# sourceMappingURL=dropbox.js.map