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
const deploy_http = require("../http");
const Enumerable = require("node-enumerable");
const FS = require("fs");
const Moment = require("moment");
const Path = require("path");
const Slack = require('@slack/client');
/**
 * A Slack client.
 */
class SlackClient extends deploy_clients.AsyncFileListBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {SlackOptions} options The options.
     */
    constructor(options) {
        super();
        this.options = options;
    }
    createFileInfo(obj, path) {
        if (!obj) {
            return obj;
        }
        const ME = this;
        const FI = {
            download: async function () {
                const RESPONSE = await deploy_http.request(this.url_private_download, {
                    headers: {
                        'Authorization': `Bearer ${deploy_helpers.toStringSafe(ME.options.token).trim()}`,
                    }
                });
                if (200 != RESPONSE.statusCode) {
                    throw new Error(`Unexpected response ${RESPONSE.statusCode}: '${RESPONSE.statusMessage}'`);
                }
                return await deploy_http.readBody(RESPONSE);
            },
            //TODO: exportPath: false,
            internal_name: obj.id,
            name: obj.name,
            path: path,
            type: deploy_files.FileSystemType.File,
            url_private_download: obj.url_private_download,
        };
        if (!isNaN(obj.timestamp)) {
            FI.time = Moment.utc(obj.timestamp * 1000);
        }
        return FI;
    }
    createInstance() {
        return new Slack.WebClient(deploy_helpers.toStringSafe(this.options.token).trim());
    }
    /** @inheritdoc */
    deleteFile(path) {
        const ME = this;
        path = toSlackPath(path);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                try {
                    const ALL_MATCHING_FILES = await ME.findFiles(path);
                    const FILE_TO_DELETE = ALL_MATCHING_FILES[0];
                    let url = 'https://slack.com/api/files.delete';
                    url += '?token=' + encodeURIComponent(deploy_helpers.toStringSafe(ME.options.token).trim());
                    url += '&file=' + encodeURIComponent(FILE_TO_DELETE.internal_name);
                    const RESPONSE = await deploy_http.request(url);
                    if (200 == RESPONSE.statusCode) {
                        COMPLETED(null, true);
                    }
                    else {
                        COMPLETED(null, false);
                    }
                }
                catch (e) {
                    COMPLETED(null, false);
                }
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    /** @inheritdoc */
    downloadFile(path) {
        const ME = this;
        path = toSlackPath(path);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const ALL_MATCHING_FILES = await ME.findFiles(path);
                const FILE_TO_DOWNLOAD = ALL_MATCHING_FILES[0];
                COMPLETED(null, await Promise.resolve(FILE_TO_DOWNLOAD.download()));
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    async findFiles(path) {
        path = toSlackPath(path);
        const PATH_PARTS = path.split('/');
        const CHANNEL = PATH_PARTS[0];
        const FILE_ID = Enumerable.from(PATH_PARTS).skip(1)
            .joinToString('/');
        const ALL_MATCHING_FILES = [];
        const GROUPED_FILES = await this.listDirectoryInner(CHANNEL);
        for (const KEY in GROUPED_FILES) {
            const FILES = GROUPED_FILES[KEY];
            for (const GF of FILES) {
                let add = false;
                if (deploy_helpers.normalizeString(GF.id) === deploy_helpers.normalizeString(FILE_ID)) {
                    add = true;
                }
                else if (deploy_helpers.normalizeString(GF.name) === deploy_helpers.normalizeString(FILE_ID)) {
                    add = true;
                }
                if (add) {
                    ALL_MATCHING_FILES.push(this.createFileInfo(GF, CHANNEL));
                }
            }
        }
        return Enumerable.from(ALL_MATCHING_FILES).orderByDescending(f => {
            if (f.time) {
                return f.time.unix();
            }
            return null;
        }).toArray();
    }
    getChannelItems() {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const CLIENT = ME.createInstance();
                CLIENT.channels.list(function (err, info) {
                    if (err) {
                        COMPLETED(err);
                        return;
                    }
                    try {
                        const ITEMS = [];
                        if (info) {
                            if (info.channels) {
                                for (const CHANNEL of info.channels) {
                                    if (!CHANNEL) {
                                        continue;
                                    }
                                    const DI = {
                                        //TODO: exportPath: false,
                                        icon: 'book',
                                        internal_name: CHANNEL.id,
                                        name: CHANNEL.name,
                                        path: '',
                                        type: deploy_files.FileSystemType.Directory,
                                    };
                                    if (!isNaN(CHANNEL.created)) {
                                        DI.time = Moment.utc(CHANNEL.created * 1000);
                                    }
                                    ITEMS.push(DI);
                                }
                            }
                        }
                        COMPLETED(null, ITEMS);
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
    /** @inheritdoc */
    async listDirectory(path) {
        const ME = this;
        path = toSlackPath(path);
        let items;
        if (deploy_helpers.isEmptyString(path)) {
            items = await ME.getChannelItems();
        }
        else {
            items = [];
            const GROUPED_FILES = await ME.listDirectoryInner(path);
            for (const KEY in GROUPED_FILES) {
                const FILES = GROUPED_FILES[KEY];
                Enumerable.from(FILES).select(f => {
                    return ME.createFileInfo(f, path);
                }).pushTo(items);
            }
        }
        return items;
    }
    listDirectoryInner(path) {
        const ME = this;
        path = toSlackPath(path);
        const CHANNEL = path.split('/')[0].toUpperCase().trim();
        let file = Enumerable.from(path.split('/')).skip(1)
            .select(x => deploy_helpers.normalizeString(x))
            .joinToString('/');
        if (deploy_helpers.isEmptyString(file)) {
            file = false;
        }
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const CLIENT = ME.createInstance();
                const ALL_FILES = [];
                const DONE = () => {
                    try {
                        const GROUPED_FILES = {};
                        for (const FILE of ALL_FILES) {
                            const KEY = deploy_helpers.normalizeString(FILE.name);
                            if (!GROUPED_FILES[KEY]) {
                                GROUPED_FILES[KEY] = [];
                            }
                            GROUPED_FILES[KEY].push(FILE);
                        }
                        COMPLETED(null, GROUPED_FILES);
                    }
                    catch (e) {
                        COMPLETED(e);
                    }
                };
                let currentPage = 0;
                let nextSegment;
                nextSegment = () => {
                    try {
                        ++currentPage;
                        CLIENT.files.list({
                            channel: CHANNEL,
                            page: currentPage,
                        }, function (err, info) {
                            if (err) {
                                COMPLETED(err);
                                return;
                            }
                            try {
                                if (info.files) {
                                    for (const FILE of info.files) {
                                        if (FILE) {
                                            ALL_FILES.push(FILE);
                                        }
                                    }
                                }
                                let isDone = true;
                                if (info.paging) {
                                    isDone = currentPage >= info.paging.pages;
                                }
                                if (isDone) {
                                    DONE();
                                }
                                else {
                                    nextSegment();
                                }
                            }
                            catch (e) {
                                COMPLETED(e);
                            }
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
    async removeFolder(path) {
        throw new Error('Not supported!');
    }
    /** @inheritdoc */
    get type() {
        return 'slack';
    }
    /** @inheritdoc */
    uploadFile(path, data) {
        const ME = this;
        path = toSlackPath(path);
        if (!data) {
            data = Buffer.alloc(0);
        }
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                await deploy_helpers.invokeForTempFile(async (tempFile) => {
                    return new Promise((res, rej) => {
                        const COMP = deploy_helpers.createCompletedAction(res, rej);
                        try {
                            const CLIENT = ME.createInstance();
                            const CHANNEL = path.split('/')[0];
                            const FILENAME = Path.basename(path);
                            const UPLOAD_OPTS = {
                                file: FS.createReadStream(tempFile),
                                filetype: 'auto',
                                channels: CHANNEL,
                                title: FILENAME,
                            };
                            CLIENT.files.upload(FILENAME, UPLOAD_OPTS, function (err) {
                                COMP(err);
                            });
                        }
                        catch (e) {
                            COMP(e);
                        }
                    });
                }, {
                    data: data
                });
                COMPLETED(null);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
}
exports.SlackClient = SlackClient;
/**
 * Creates a new client.
 *
 * @param {SlackOptions} opts The options.
 *
 * @return {SlackClient} The new client.
 */
function createClient(opts) {
    if (!opts) {
        opts = {};
    }
    return new SlackClient(opts);
}
exports.createClient = createClient;
/**
 * Converts to a Slack path.
 *
 * @param {string} path The path to convert.
 *
 * @return {string} The converted path.
 */
function toSlackPath(path) {
    return deploy_helpers.normalizePath(path);
}
exports.toSlackPath = toSlackPath;
//# sourceMappingURL=slack.js.map