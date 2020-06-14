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
const deploy_clients_slack = require("../clients/slack");
const deploy_contracts = require("../contracts");
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_plugins = require("../plugins");
const deploy_targets = require("../targets");
const Enumerable = require("node-enumerable");
const Zip = require('node-zip');
class SlackPlugin extends deploy_plugins.PluginBase {
    get canList() {
        return true;
    }
    async invokeForClient(target, action) {
        const CLIENT = deploy_clients_slack.createClient({
            token: deploy_helpers.toStringSafe(this.replaceWithValues(target, target.token)).trim(),
        });
        try {
            return await Promise.resolve(action(CLIENT, target));
        }
        finally {
            deploy_helpers.tryDispose(CLIENT);
        }
    }
    async listDirectory(context) {
        const ME = this;
        return await ME.invokeForClient(context.target, async (client, t) => {
            const RESULT = {
                dirs: [],
                files: [],
                info: deploy_files.createDefaultDirectoryInfo(context.dir),
                others: [],
                target: t,
            };
            const LIST = await client.listDirectory(context.dir);
            for (const FSI of LIST) {
                if (!FSI) {
                    continue;
                }
                switch (FSI.type) {
                    case deploy_files.FileSystemType.Directory:
                        RESULT.dirs.push(FSI);
                        break;
                    case deploy_files.FileSystemType.File:
                        RESULT.files.push(FSI);
                        break;
                    default:
                        RESULT.others.push(FSI);
                        break;
                }
            }
            return RESULT;
        });
    }
    async uploadFiles(context) {
        const ME = this;
        await ME.invokeForClient(context.target, async (client, t) => {
            const CHANNELS = Enumerable.from(deploy_helpers.asArray(t.channels)).selectMany(c => {
                return deploy_helpers.toStringSafe(ME.replaceWithValues(t, c))
                    .split(',');
            }).select(c => {
                return c.toUpperCase()
                    .trim();
            }).where(c => {
                return '' !== c;
            }).toArray();
            for (const C of CHANNELS) {
                const FILES_TO_UPLOAD = context.files;
                const FOR_FILE = async (index, action) => {
                    const FILE = FILES_TO_UPLOAD[index];
                    try {
                        FILE.onBeforeUpload(CHANNELS.join(', '));
                        await Promise.resolve(action(FILE));
                        FILE.onUploadCompleted();
                    }
                    catch (e) {
                        FILE.onUploadCompleted(e);
                    }
                };
                if (1 === FILES_TO_UPLOAD.length) {
                    await FOR_FILE(0, async (f) => {
                        await client.uploadFile(C + '/' + f.name, await f.read());
                    });
                }
                else {
                    const ZIPFile = new Zip();
                    const ZIPFilename = deploy_targets.getZipFileName(context.target);
                    for (let i = 0; i < FILES_TO_UPLOAD.length; i++) {
                        await FOR_FILE(i, async (f) => {
                            ZIPFile.file(deploy_helpers.normalizePath(f.path + '/' + f.name), await f.read());
                        });
                    }
                    const ZIPPED_DATA = new Buffer(ZIPFile.generate({
                        base64: false,
                        comment: deploy_contracts.ZIP_COMMENT,
                        compression: 'DEFLATE',
                    }), 'binary');
                    await client.uploadFile(C + '/' + ZIPFilename, ZIPPED_DATA);
                }
            }
        });
    }
}
/**
 * Creates a new instance of that plugin.
 *
 * @param {deploy_plugins.PluginContext} context The context for the plugin.
 *
 * @return {deploy_plugins.Plugin} The new plugin.
 */
function createPlugins(context) {
    return new SlackPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=slack.js.map