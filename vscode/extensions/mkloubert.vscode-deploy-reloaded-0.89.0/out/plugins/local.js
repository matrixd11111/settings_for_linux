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
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_plugins = require("../plugins");
const FSExtra = require("fs-extra");
const Moment = require("moment");
const Path = require("path");
class LocalPlugin extends deploy_plugins.PluginBase {
    get canDelete() {
        return true;
    }
    get canDownload() {
        return true;
    }
    get canList() {
        return true;
    }
    get canRemoveFolders() {
        return true;
    }
    async deleteFiles(context) {
        const ME = this;
        for (const F of context.files) {
            try {
                const SETTINGS = await ME.getTargetSettings(context, F);
                let targetDir = Path.join(SETTINGS.dir, F.path);
                targetDir = Path.resolve(targetDir);
                await F.onBeforeDelete(targetDir);
                if (context.isCancelling) {
                    break;
                }
                const TARGET_FILE = Path.join(targetDir, F.name);
                if (await deploy_helpers.exists(TARGET_FILE)) {
                    if ((await deploy_helpers.lstat(TARGET_FILE)).isFile()) {
                        await deploy_helpers.unlink(TARGET_FILE);
                    }
                    else {
                        throw new Error(ME.t(context.target, 'isNo.file', TARGET_FILE));
                    }
                }
                await F.onDeleteCompleted(null);
            }
            catch (e) {
                await F.onDeleteCompleted(e);
            }
        }
    }
    async downloadFiles(context) {
        const TARGET = context.target;
        const WORKSPACE = TARGET.__workspace;
        const SYNC_TIME = deploy_helpers.toBooleanSafe(TARGET.syncTime, true);
        for (const F of context.files) {
            try {
                const SETTINGS = await this.getTargetSettings(context, F);
                let targetDir = Path.join(SETTINGS.dir, F.path);
                targetDir = Path.resolve(targetDir);
                await F.onBeforeDownload(targetDir);
                if (context.isCancelling) {
                    break;
                }
                const TARGET_FILE = Path.join(targetDir, F.name);
                const DOWNLOADED_FILE = deploy_plugins.createDownloadedFileFromBuffer(F, await deploy_helpers.readFile(TARGET_FILE));
                await F.onDownloadCompleted(null, DOWNLOADED_FILE);
                if (SYNC_TIME) {
                    await trySyncTimes(TARGET_FILE, F.file, WORKSPACE.logger, 'plugins.local.downloadFiles(trySyncTimes)');
                }
            }
            catch (e) {
                await F.onDownloadCompleted(e);
            }
        }
    }
    async getTargetSettings(context, item) {
        const ME = this;
        const DIR = await ME.normalizeDir(context.target, item);
        if (await deploy_helpers.exists(DIR)) {
            if (!(await deploy_helpers.lstat(DIR)).isDirectory()) {
                throw new Error(ME.t(context.target, 'isNo.dir', DIR));
            }
        }
        return {
            dir: DIR,
            empty: deploy_helpers.toBooleanSafe(context.target.empty),
        };
    }
    async listDirectory(context) {
        const ME = this;
        const DIR = await ME.normalizeDir(context.target, context);
        let targetDir = Path.join(DIR, context.dir);
        targetDir = Path.resolve(targetDir);
        if (!targetDir.startsWith(DIR)) {
            throw new Error(ME.t(context.target, 'plugins.local.invalidDirectory', context.dir));
        }
        let relativePath = targetDir.substr(DIR.length);
        relativePath = deploy_helpers.replaceAllStrings(relativePath, Path.sep, '/');
        while (relativePath.startsWith('/')) {
            relativePath = relativePath.substr(1);
        }
        while (relativePath.endsWith('/')) {
            relativePath = relativePath.substr(0, relativePath.length - 1);
        }
        if (deploy_helpers.isEmptyString(relativePath)) {
            relativePath = '';
        }
        const RESULT = {
            dirs: [],
            files: [],
            info: deploy_files.createDefaultDirectoryInfo(context.dir, {
                exportPath: targetDir,
            }),
            others: [],
            target: context.target,
        };
        if (context.isCancelling) {
            return;
        }
        const FILES_AND_FOLDERS = await deploy_helpers.readDir(targetDir);
        for (const F of FILES_AND_FOLDERS) {
            let fullPath = Path.join(targetDir, F);
            const STATS = await deploy_helpers.lstat(fullPath);
            let time;
            if (STATS.mtime) {
                time = Moment(STATS.mtime);
                if (time.isValid() && !time.isUTC()) {
                    time = time.utc();
                }
            }
            const SIZE = STATS.size;
            if (STATS.isDirectory()) {
                const DI = {
                    exportPath: Path.resolve(Path.join(targetDir, F)),
                    name: F,
                    path: relativePath,
                    size: SIZE,
                    time: time,
                    type: deploy_files.FileSystemType.Directory,
                };
                RESULT.dirs.push(DI);
            }
            else if (STATS.isFile()) {
                const FI = {
                    download: async () => {
                        return deploy_helpers.readFile(fullPath);
                    },
                    exportPath: Path.resolve(Path.join(targetDir, F)),
                    name: F,
                    path: relativePath,
                    size: SIZE,
                    time: time,
                    type: deploy_files.FileSystemType.File,
                };
                RESULT.files.push(FI);
            }
            else {
                const FSI = {
                    exportPath: Path.resolve(Path.join(targetDir, F)),
                    name: F,
                    path: relativePath,
                    size: SIZE,
                    time: time,
                };
                RESULT.others.push(FSI);
            }
        }
        return RESULT;
    }
    async normalizeDir(target, wsi) {
        let dir = this.replaceWithValues(target, target.dir);
        if (deploy_helpers.isEmptyString(dir)) {
            dir = './out';
        }
        if (!Path.isAbsolute(dir)) {
            dir = Path.join(wsi.workspace.rootPath, dir);
        }
        dir = Path.resolve(dir);
        if ((await deploy_helpers.lstat(dir)).isSymbolicLink()) {
            dir = await deploy_helpers.realpath(dir);
        }
        return dir;
    }
    async removeFolders(context) {
        const TARGET = context.target;
        for (const F of context.folders) {
            try {
                await F.onBeforeRemove(deploy_helpers.toDisplayablePath(F.path));
                const SETTINGS = await this.getTargetSettings(context, F);
                const TARGET_DIR = Path.resolve(Path.join(SETTINGS.dir, F.path));
                const TARGET_FOLDER = Path.resolve(Path.join(TARGET_DIR, F.name));
                if (!this.isPathOf(TARGET, TARGET_FOLDER) || (SETTINGS.dir === TARGET_FOLDER)) {
                    throw new Error(this.t(TARGET, 'plugins.local.invalidDirectory', TARGET_FOLDER));
                }
                if (!(await deploy_helpers.isDirectory(TARGET_FOLDER))) {
                    throw new Error(this.t(TARGET, 'isNo.directory', TARGET_FOLDER));
                }
                await FSExtra.remove(TARGET_FOLDER);
                await F.onRemoveCompleted();
            }
            catch (e) {
                await F.onRemoveCompleted(e);
            }
        }
    }
    async uploadFiles(context) {
        const ME = this;
        const TARGET = context.target;
        const WORKSPACE = TARGET.__workspace;
        const SYNC_TIME = deploy_helpers.toBooleanSafe(TARGET.syncTime, true);
        const ALREADY_CHECKED = {};
        for (const F of context.files) {
            try {
                const SETTINGS = await ME.getTargetSettings(context, F);
                let targetDir = Path.join(SETTINGS.dir, F.path);
                targetDir = Path.resolve(targetDir);
                await F.onBeforeUpload(targetDir);
                if (context.isCancelling) {
                    break;
                }
                if (true !== ALREADY_CHECKED[targetDir]) {
                    if (await deploy_helpers.exists(targetDir)) {
                        if (SETTINGS.empty) {
                            await FSExtra.remove(targetDir);
                        }
                    }
                    if (!(await deploy_helpers.exists(targetDir))) {
                        await FSExtra.mkdirs(targetDir);
                    }
                    else {
                        if (!(await deploy_helpers.lstat(targetDir)).isDirectory()) {
                            throw new Error(ME.t(context.target, 'isNo.dir', targetDir));
                        }
                    }
                    ALREADY_CHECKED[targetDir] = true;
                }
                const TARGET_FILE = Path.join(targetDir, F.name);
                const DATA = await F.read();
                if (DATA) {
                    await deploy_helpers.writeFile(TARGET_FILE, DATA);
                    if (SYNC_TIME) {
                        await trySyncTimes(F.file, TARGET_FILE, WORKSPACE.logger, 'plugins.local.uploadFiles(trySyncTimes)');
                    }
                }
                await F.onUploadCompleted();
            }
            catch (e) {
                await F.onUploadCompleted(e);
            }
        }
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
    return new LocalPlugin(context);
}
exports.createPlugins = createPlugins;
async function trySyncTimes(src, dest, logger, logTag) {
    try {
        const STATS_SRC = await FSExtra.stat(src);
        if (STATS_SRC) {
            const STATS_DEST = await FSExtra.stat(dest);
            if (STATS_DEST) {
                try {
                    await FSExtra.utimes(dest, STATS_SRC.atime, STATS_SRC.mtime);
                    return true;
                }
                catch (e) {
                    logger.warn(e, logTag);
                }
            }
        }
    }
    catch (_a) { }
    return false;
}
//# sourceMappingURL=local.js.map