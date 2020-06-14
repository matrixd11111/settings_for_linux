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
const deploy_helpers = require("./helpers");
const Path = require("path");
/**
 * The type of a file system item.
 */
var FileSystemType;
(function (FileSystemType) {
    /**
     * Directory / folder
     */
    FileSystemType[FileSystemType["Directory"] = 1] = "Directory";
    /**
     * File
     */
    FileSystemType[FileSystemType["File"] = 2] = "File";
})(FileSystemType = exports.FileSystemType || (exports.FileSystemType = {}));
/**
 * Creates a default directory info object from a path.
 *
 * @param {string} dir The path of the directory.
 * @param {CreateDefaultDirectoryInfoOptions} [opts] Additional options.
 *
 * @return {DirectoryInfo} The created object.
 */
function createDefaultDirectoryInfo(dir, opts) {
    dir = deploy_helpers.normalizePath(dir);
    if (!opts) {
        opts = {};
    }
    let name;
    let path;
    let exportPath = deploy_helpers.toStringSafe(opts.exportPath);
    if (!deploy_helpers.isEmptyString(dir)) {
        path = Path.dirname(dir);
        if ('.' === path) {
            path = '';
        }
        name = Path.basename(dir);
    }
    if (deploy_helpers.isEmptyString(name)) {
        name = '';
    }
    if (deploy_helpers.isEmptyString(path)) {
        path = '';
    }
    if (deploy_helpers.isEmptyString(exportPath)) {
        exportPath = '/';
    }
    return {
        exportPath: exportPath,
        name: name,
        path: path,
        type: FileSystemType.Directory,
    };
}
exports.createDefaultDirectoryInfo = createDefaultDirectoryInfo;
//# sourceMappingURL=files.js.map