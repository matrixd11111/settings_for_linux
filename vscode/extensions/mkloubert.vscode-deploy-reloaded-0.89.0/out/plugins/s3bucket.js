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
const deploy_clients_s3bucket = require("../clients/s3bucket");
const deploy_helpers = require("../helpers");
const deploy_plugins = require("../plugins");
const OS = require("os");
const Path = require("path");
class S3BucketPlugin extends deploy_plugins.AsyncFileClientPluginBase {
    createContext(target) {
        const ME = this;
        const DIR = ME.replaceWithValues(target, target.dir);
        const FILTERS = {};
        if (deploy_helpers.isObject(target.acl)) {
            for (const ACL in target.acl) {
                const ITEM = target.acl[ACL];
                let ff;
                if (deploy_helpers.isObject(ITEM)) {
                    ff = ITEM;
                }
                else {
                    ff = {
                        files: deploy_helpers.asArray(ITEM),
                    };
                }
                FILTERS[deploy_clients_s3bucket.getAclSafe(ACL)] = ff;
            }
        }
        else {
            FILTERS[deploy_clients_s3bucket.getAclSafe(target.acl)] = {
                files: '**'
            };
        }
        const SCOPES = [];
        SCOPES.push
            .apply(SCOPES, target.__workspace.getSettingScopes());
        SCOPES.push(Path.resolve(Path.join(OS.homedir(), '.aws')));
        return {
            client: deploy_clients_s3bucket.createClient({
                acl: ME.replaceWithValues(target, target.acl),
                bucket: ME.replaceWithValues(target, target.bucket),
                credentials: target.credentials,
                customOpts: target.customOpts,
                directoryScopeProvider: () => {
                    return SCOPES;
                },
                fileAcl: (file, defAcl) => {
                    for (const ACL in FILTERS) {
                        if (deploy_helpers.checkIfDoesMatchByFileFilter('/' + file, deploy_helpers.toMinimatchFileFilter(FILTERS[ACL]))) {
                            return ME.replaceWithValues(target, ACL);
                        }
                    }
                    return defAcl;
                },
                valueProvider: () => {
                    return target.__workspace.getValues();
                }
            }),
            getDir: (subDir) => {
                return deploy_helpers.normalizePath(deploy_helpers.normalizePath(DIR).trim() +
                    '/' +
                    deploy_helpers.normalizePath(subDir).trim());
            },
            target: target
        };
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
    return new S3BucketPlugin(context);
}
exports.createPlugins = createPlugins;
//# sourceMappingURL=s3bucket.js.map