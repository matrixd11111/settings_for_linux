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
const Moment = require("moment");
const Path = require("path");
class TestPlugin extends deploy_plugins.PluginBase {
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
        for (const F of context.files) {
            if (context.isCancelling) {
                break;
            }
            try {
                await F.onBeforeDelete(deploy_helpers.toDisplayablePath(F.path));
                await deploy_helpers.readFile(F.file);
                await F.onDeleteCompleted(null, false);
            }
            catch (e) {
                await F.onDeleteCompleted(e);
            }
        }
    }
    async downloadFiles(context) {
        for (const F of context.files) {
            if (context.isCancelling) {
                break;
            }
            try {
                await F.onBeforeDownload(deploy_helpers.toDisplayablePath(F.path));
                await deploy_helpers.readFile(F.file);
                await F.onDownloadCompleted(null);
            }
            catch (e) {
                await F.onDownloadCompleted(e);
            }
        }
    }
    async listDirectory(context) {
        const ME = this;
        const WORKSPACE_DIR = context.workspace.rootPath;
        let targetDir = Path.join(WORKSPACE_DIR, context.dir);
        targetDir = Path.resolve(targetDir);
        if (!context.workspace.isPathOf(targetDir)) {
            throw new Error(ME.t(context.target, 'plugins.test.invalidDirectory', context.dir));
        }
        let relativePath = targetDir.substr(WORKSPACE_DIR.length);
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
    async removeFolders(context) {
        const TARGET = context.target;
        const WORKSPACE_DIR = TARGET.__workspace.rootPath;
        for (const F of context.folders) {
            try {
                await F.onBeforeRemove(deploy_helpers.toDisplayablePath(F.path));
                const TARGET_DIR = Path.resolve(Path.join(WORKSPACE_DIR, F.path));
                const TARGET_FOLDER = Path.resolve(Path.join(TARGET_DIR, F.name));
                if (!this.isPathOf(TARGET, TARGET_FOLDER) || (WORKSPACE_DIR === TARGET_FOLDER)) {
                    throw new Error(this.t(TARGET, 'plugins.test.invalidDirectory', TARGET_FOLDER));
                }
                if (!(await deploy_helpers.isDirectory(TARGET_FOLDER))) {
                    throw new Error(this.t(TARGET, 'isNo.directory', TARGET_FOLDER));
                }
                await F.onRemoveCompleted();
            }
            catch (e) {
                await F.onRemoveCompleted(e);
            }
        }
    }
    async uploadFiles(context) {
        for (const F of context.files) {
            if (context.isCancelling) {
                break;
            }
            try {
                await F.onBeforeUpload(deploy_helpers.toDisplayablePath(F.path));
                await F.read();
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
    return new TestPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=test.js.map