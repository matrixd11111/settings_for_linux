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
const deploy_helpers = require("./helpers");
const deploy_files = require("./files");
const deploy_values = require("./values");
/**
 * A basic async file client.
 */
class AsyncFileListBase extends deploy_helpers.DisposableBase {
    constructor() {
        super(...arguments);
        this._CONNECTION_VALUES = {};
        /** @inheritdoc */
        this.values = [];
    }
    /**
     * Normalizes a name for a value.
     *
     * @param {any} name The input value.
     *
     * @return {string} The output value.
     */
    normalizeValueName(name) {
        return deploy_helpers.normalizeString(name);
    }
    /** @inheritdoc */
    async removeFolder(path) {
        path = deploy_helpers.toStringSafe(path);
        if ('' === normalizePath(path)) {
            return false; // NOT the roor folder!
        }
        try {
            const FILES_AND_FOLDERS = deploy_helpers.asArray(await this.listDirectory(path));
            const OTHERS = FILES_AND_FOLDERS.filter(ff => {
                switch (ff.type) {
                    case deploy_files.FileSystemType.Directory:
                    case deploy_files.FileSystemType.File:
                        return true;
                }
                return false;
            });
            if (OTHERS.length > 0) {
                return false;
            }
            const TO_PATH = (wnp) => {
                return '/' + deploy_helpers.normalizePath(deploy_helpers.normalizePath(wnp.path) +
                    '/' +
                    deploy_helpers.normalizePath(wnp.name));
            };
            const FOLDERS = FILES_AND_FOLDERS.filter(ff => {
                return ff.type == deploy_files.FileSystemType.Directory;
            }).map(ff => TO_PATH(ff));
            const FILES = FILES_AND_FOLDERS.filter(ff => {
                return ff.type == deploy_files.FileSystemType.File;
            }).map(ff => TO_PATH(ff));
            // first delete the sub folders
            for (const F of FOLDERS) {
                if (!(await this.removeFolder(F))) {
                    return false;
                }
            }
            // then the files
            for (const F of FILES) {
                await this.deleteFile(F);
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Sets a connection value.
     *
     * @param {string} name The name of the value.
     * @param {any} val The value to set.
     *
     * @return this
     *
     * @chainable
     */
    setValue(name, val) {
        name = this.normalizeValueName(name);
        let existingValue = deploy_helpers.from(this.values).singleOrDefault(v => v.name === name);
        if (_.isSymbol(existingValue)) {
            existingValue = new deploy_values.FunctionValue(() => {
                return this._CONNECTION_VALUES[name];
            }, name);
            this.values
                .push(existingValue);
        }
        this._CONNECTION_VALUES[name] = val;
        return this;
    }
}
exports.AsyncFileListBase = AsyncFileListBase;
function normalizePath(p) {
    p = deploy_helpers.normalizePath(p);
    if ('.' === p) {
        p = '';
    }
    return p;
}
//# sourceMappingURL=clients.js.map