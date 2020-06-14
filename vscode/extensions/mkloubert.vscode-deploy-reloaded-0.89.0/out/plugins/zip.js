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
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_plugins = require("../plugins");
const deploy_targets = require("../targets");
const Moment = require("moment");
const Path = require("path");
const Zip = require('node-zip');
class ZipPlugin extends deploy_plugins.PluginBase {
    get canDelete() {
        return true;
    }
    get canDownload() {
        return true;
    }
    get canList() {
        return true;
    }
    async deleteFiles(context) {
        const ME = this;
        const WORKSPACE = context.target.__workspace;
        const LATEST_ZIP = await ME.getLatestZipFile(context.target);
        const ZIP_FILE = Zip(await deploy_helpers.readFile(LATEST_ZIP), {
            base64: false,
        });
        for (const F of context.files) {
            if (context.isCancelling) {
                break;
            }
            try {
                await F.onBeforeDelete(LATEST_ZIP);
                let found = false;
                let file = deploy_helpers.normalizePath(F.path + '/' + F.name);
                if (ZIP_FILE.files) {
                    for (const ZF in ZIP_FILE.files) {
                        if (deploy_helpers.normalizePath(ZF) === file) {
                            delete ZIP_FILE.files[ZF];
                            found = true;
                        }
                    }
                }
                if (!found) {
                    throw new Error(WORKSPACE.t('plugins.zip.errors.fileNotFound', file));
                }
                await F.onDeleteCompleted(null, false);
            }
            catch (e) {
                await F.onDeleteCompleted(e);
            }
        }
        const ZIPPED_DATA = new Buffer(ZIP_FILE.generate({
            base64: false,
            comment: deploy_contracts.ZIP_COMMENT,
            compression: 'DEFLATE',
        }), 'binary');
        await deploy_helpers.writeFile(LATEST_ZIP, ZIPPED_DATA);
        if (deploy_helpers.toBooleanSafe(context.target.open, true)) {
            await deploy_helpers.open(LATEST_ZIP, {
                wait: false,
            });
        }
    }
    async downloadFiles(context) {
        const ME = this;
        const WORKSPACE = context.target.__workspace;
        const LATEST_ZIP = await ME.getLatestZipFile(context.target);
        const ZIP_FILE = Zip(await deploy_helpers.readFile(LATEST_ZIP), {
            base64: false,
        });
        const FIND_ENTRY = (file) => {
            file = deploy_helpers.normalizePath(file);
            let entry = Symbol('ZIP_ENTRY_NOT_FOUND');
            if (ZIP_FILE.files) {
                for (const ZF in ZIP_FILE.files) {
                    if (deploy_helpers.normalizePath(ZF) === file) {
                        entry = ZIP_FILE.files[ZF];
                        break;
                    }
                }
            }
            if (deploy_helpers.isSymbol(entry)) {
                throw new Error(WORKSPACE.t('plugins.zip.errors.fileNotFound', file));
            }
            return entry;
        };
        for (const F of context.files) {
            if (context.isCancelling) {
                break;
            }
            try {
                await F.onBeforeDownload(LATEST_ZIP);
                await F.onDownloadCompleted(null, FIND_ENTRY(F.path + '/' + F.name).asNodeBuffer());
            }
            catch (e) {
                await F.onDownloadCompleted(e);
            }
        }
    }
    async getTargetDirectory(target, createIfNotExist) {
        const WORKSPACE = target.__workspace;
        let targetDir = this.replaceWithValues(target, target.dir);
        if (deploy_helpers.isEmptyString(targetDir)) {
            targetDir = './out';
        }
        if (!Path.isAbsolute(targetDir)) {
            targetDir = Path.join(target.__workspace.rootPath, targetDir);
        }
        targetDir = Path.resolve(targetDir);
        if (createIfNotExist) {
            if (!(await deploy_helpers.exists(targetDir))) {
                await deploy_helpers.mkdirs(targetDir);
            }
            if (!(await deploy_helpers.lstat(targetDir)).isDirectory()) {
                throw new Error(WORKSPACE.t('isNo.directory', targetDir));
            }
        }
        return targetDir;
    }
    async getLatestZipFile(target) {
        const ME = this;
        const WORKSPACE = target.__workspace;
        let zipFile = Symbol('ZIPFILE_NOT_FOUND');
        const ALL_ZIP_FILES = (await ME.getZipFiles(target)).sort((x, y) => {
            return deploy_helpers.compareValuesBy(x, y, f => deploy_helpers.normalizeString(f));
        });
        for (const ZF of ALL_ZIP_FILES) {
            let update = true;
            const MTIME = Moment((await deploy_helpers.lstat(ZF)).mtime);
            if (!deploy_helpers.isSymbol(zipFile)) {
                update = MTIME.isSameOrAfter(zipFile.time);
            }
            if (update) {
                zipFile = {
                    name: ZF,
                    time: MTIME
                };
            }
        }
        if (deploy_helpers.isSymbol(zipFile)) {
            throw new Error(WORKSPACE.t('plugins.zip.errors.noFilesFound', zipFile));
        }
        return zipFile.name;
    }
    getZipFileNameWithDetails(target) {
        let name;
        let isCustom = false;
        name = target.__workspace.replaceWithValues(target.fileName);
        if (deploy_helpers.isEmptyString(name)) {
            name = deploy_targets.getZipFileName(target);
        }
        else {
            isCustom = true;
        }
        return {
            isCustom: isCustom,
            name: name,
        };
    }
    async getZipFiles(target) {
        let result;
        const ZIP_TARGET_DIR = await this.getTargetDirectory(target, false);
        const ZIP_FILENAME = this.getZipFileNameWithDetails(target);
        const SEARCH_PATTERN = ZIP_FILENAME.isCustom ? '/*.zip' : '/vscode-ws*_*.zip';
        if (await deploy_helpers.exists(ZIP_TARGET_DIR)) {
            if ((await deploy_helpers.lstat(ZIP_TARGET_DIR)).isDirectory()) {
                result = (await deploy_helpers.glob(SEARCH_PATTERN, {
                    cwd: ZIP_TARGET_DIR,
                    dot: false,
                    nocase: true,
                    nodir: true,
                    nosort: false,
                    root: ZIP_TARGET_DIR,
                })).filter(zf => {
                    try {
                        const FILE_NAME = Path.basename(zf);
                        return !!deploy_targets.REGEX_ZIP_FILENAME.exec(FILE_NAME);
                    }
                    catch (e) {
                        return false;
                    }
                });
            }
        }
        return result;
    }
    async listDirectory(context) {
        const ME = this;
        const WORKSPACE = context.workspace;
        if (context.isCancelling) {
            return;
        }
        const DIR = deploy_helpers.normalizePath(context.dir);
        const TARGET_DIR = await ME.getTargetDirectory(context.target, false);
        const RESULT = {
            dirs: [],
            files: [],
            others: [],
            info: deploy_files.createDefaultDirectoryInfo(context.dir, {
                exportPath: TARGET_DIR,
            }),
            target: context.target,
        };
        if (deploy_helpers.isEmptyString(DIR)) {
            const ZIP_FILES = await ME.getZipFiles(context.target);
            for (const ZF of ZIP_FILES) {
                const FILE_NAME = Path.basename(ZF);
                const MATCH = deploy_targets.REGEX_ZIP_FILENAME
                    .exec(FILE_NAME);
                const CREATION_TIME = Moment.utc(`${MATCH[4]} ${MATCH[6]}`, 'YYYYMMDD HHmmss');
                const DI = {
                    exportPath: ZF,
                    internal_name: FILE_NAME,
                    name: deploy_helpers.asLocalTime(CREATION_TIME)
                        .format(ME.t(context.target, 'time.dateTimeWithSeconds')),
                    path: '',
                    time: CREATION_TIME,
                    type: deploy_files.FileSystemType.Directory,
                };
                // other by creation time (DESC)
                DI.compareTo = (other) => {
                    return deploy_helpers.compareValuesBy(other, DI, x => {
                        return x.time.unix();
                    });
                };
                RESULT.dirs.push(DI);
            }
        }
        else {
            const ZIP_FILE_PATH = Path.resolve(Path.join(TARGET_DIR, DIR));
            if (!ZIP_FILE_PATH.startsWith(TARGET_DIR)) {
                throw new Error(WORKSPACE.t('plugins.zip.invalidDirectory', DIR));
            }
            const ZIP_FILE = Zip(await deploy_helpers.readFile(ZIP_FILE_PATH), {
                base64: false,
            });
            const ZIP_FILE_NAME = Path.basename(ZIP_FILE_PATH);
            if (ZIP_FILE.files) {
                const SETUP_AND_ADD_FILE_INFO = (zipEntry, f) => {
                    const DATA = zipEntry.asNodeBuffer();
                    // fi.time
                    if (!deploy_helpers.isEmptyString(zipEntry.date)) {
                        f['time'] = Moment.utc(zipEntry.date);
                    }
                    if (DATA) {
                        f['download'] = async () => {
                            return DATA;
                        };
                        // f.size
                        Object.defineProperty(f, 'size', {
                            enumerable: true,
                            get: () => {
                                return DATA.length;
                            },
                        });
                    }
                    RESULT.files.push(f);
                };
                for (const FILENAME in ZIP_FILE.files) {
                    const ZIP_ENTRY = ZIP_FILE.files[FILENAME];
                    if (!ZIP_ENTRY) {
                        continue;
                    }
                    if (deploy_helpers.toBooleanSafe(ZIP_ENTRY.dir)) {
                        continue;
                    }
                    const FI = {
                        exportPath: ZIP_FILE_PATH + '::' + FILENAME,
                        name: FILENAME,
                        path: ZIP_FILE_NAME,
                        type: deploy_files.FileSystemType.File,
                    };
                    SETUP_AND_ADD_FILE_INFO(ZIP_ENTRY, FI);
                }
            }
        }
        return RESULT;
    }
    async removeFolders(context) {
        const TARGET = context.target;
        const ZIP_FILENAME = this.getZipFileNameWithDetails(TARGET);
        const ZIP_FILE_PATH = Path.join(await this.getTargetDirectory(TARGET, true), ZIP_FILENAME.name);
        const TO_PATH = (ff) => {
            return deploy_helpers.normalizePath(deploy_helpers.normalizePath(ff.path) +
                '/' +
                deploy_helpers.normalizePath(ff.name));
        };
        for (const F of context.folders) {
            if (context.isCancelling) {
                return;
            }
            try {
                await F.onBeforeRemove(ZIP_FILE_PATH);
                const TARGET_DIR = TO_PATH(F);
                const LIST_CTX = {
                    cancellationToken: undefined,
                    dir: TARGET_DIR,
                    isCancelling: undefined,
                    target: TARGET,
                    workspace: undefined,
                };
                // LIST_CTX.cancellationToken
                Object.defineProperty(LIST_CTX, 'cancellationToken', {
                    enumerable: true,
                    get: function () {
                        return context.cancellationToken;
                    }
                });
                // LIST_CTX.isCancelling
                Object.defineProperty(LIST_CTX, 'isCancelling', {
                    enumerable: true,
                    get: function () {
                        return context.isCancelling;
                    }
                });
                // LIST_CTX.workspace
                Object.defineProperty(LIST_CTX, 'workspace', {
                    enumerable: true,
                    get: function () {
                        return this.target.__workspace;
                    }
                });
                if (LIST_CTX.isCancelling) {
                    return;
                }
                const LIST = await this.listDirectory(LIST_CTX);
                const DELETE_CTX = {
                    cancellationToken: undefined,
                    isCancelling: undefined,
                    files: LIST.files.map(f => {
                        return new deploy_plugins.SimpleFileToDelete(TARGET.__workspace, undefined, f);
                    }),
                    target: TARGET,
                };
                // DELETE_CTX.cancellationToken
                Object.defineProperty(DELETE_CTX, 'cancellationToken', {
                    enumerable: true,
                    get: function () {
                        return context.cancellationToken;
                    }
                });
                // DELETE_CTX.isCancelling
                Object.defineProperty(DELETE_CTX, 'isCancelling', {
                    enumerable: true,
                    get: function () {
                        return context.isCancelling;
                    }
                });
                if (DELETE_CTX.isCancelling) {
                    return;
                }
                await this.deleteFiles(DELETE_CTX);
                await F.onRemoveCompleted();
            }
            catch (e) {
                await F.onRemoveCompleted(e);
            }
        }
    }
    async uploadFiles(context) {
        const WORKSPACE = context.target.__workspace;
        const ZIP_FILENAME = this.getZipFileNameWithDetails(context.target);
        const ZIP_FILE_PATH = Path.join(await this.getTargetDirectory(context.target, true), ZIP_FILENAME.name);
        let ZIPFile = new Zip();
        for (const F of context.files) {
            if (context.isCancelling) {
                return;
            }
            try {
                await F.onBeforeUpload(ZIP_FILE_PATH);
                ZIPFile.file(deploy_helpers.normalizePath(F.path + '/' + F.name), await F.read());
                await F.onUploadCompleted();
            }
            catch (e) {
                await F.onUploadCompleted(e);
            }
        }
        const ZIPPED_DATA = new Buffer(ZIPFile.generate({
            base64: false,
            comment: deploy_contracts.ZIP_COMMENT,
            compression: 'DEFLATE',
        }), 'binary');
        if (await deploy_helpers.exists(ZIP_FILE_PATH)) {
            if (ZIP_FILENAME.isCustom) {
                await deploy_helpers.unlink(ZIP_FILE_PATH);
            }
            else {
                throw new Error(WORKSPACE.t('plugins.zip.errors.fileAlreadyExists', ZIP_FILE_PATH));
            }
        }
        await deploy_helpers.writeFile(ZIP_FILE_PATH, ZIPPED_DATA);
        if (deploy_helpers.toBooleanSafe(context.target.open, true)) {
            await deploy_helpers.open(ZIP_FILE_PATH, {
                wait: false,
            });
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
    return new ZipPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=zip.js.map