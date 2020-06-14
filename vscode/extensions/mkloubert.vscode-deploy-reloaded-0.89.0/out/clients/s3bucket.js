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
const AWS = require("aws-sdk");
const deploy_clients = require("../clients");
const deploy_files = require("../files");
const deploy_helpers = require("../helpers");
const deploy_values = require("../values");
const Enumerable = require("node-enumerable");
const i18 = require("../i18");
const MimeTypes = require("mime-types");
const OS = require("os");
const Path = require("path");
const Moment = require("moment");
/**
 * The default ACL for a file.
 */
exports.DEFAULT_ACL = 'public-read';
const KNOWN_CREDENTIAL_CLASSES = {
    'cognito': AWS.CognitoIdentityCredentials,
    'ec2': AWS.ECSCredentials,
    'ec2meta': AWS.EC2MetadataCredentials,
    'environment': AWS.EnvironmentCredentials,
    'file': AWS.FileSystemCredentials,
    'saml': AWS.SAMLCredentials,
    'shared': AWS.SharedIniFileCredentials,
    'temp': AWS.TemporaryCredentials,
    'web': AWS.WebIdentityCredentials,
};
/**
 * A S3 bucket file client.
 */
class S3BucketClient extends deploy_clients.AsyncFileListBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {S3BucketOptions} options The options.
     */
    constructor(options) {
        super();
        this.options = options;
    }
    async createInstance() {
        const AWS_DIR = Path.resolve(Path.join(OS.homedir(), '.aws'));
        let directoryScopeProvider = this.options.directoryScopeProvider;
        if (!directoryScopeProvider) {
            directoryScopeProvider = () => [];
        }
        const DIRECTORY_SCOPES = Enumerable.from(deploy_helpers.asArray(await Promise.resolve(directoryScopeProvider()))).select(s => {
            return deploy_helpers.toStringSafe(s);
        }).where(s => {
            return !deploy_helpers.isEmptyString(s);
        }).select(s => {
            if (!Path.isAbsolute(s)) {
                s = Path.join(AWS_DIR, s);
            }
            return Path.resolve(s);
        }).toArray();
        if (DIRECTORY_SCOPES.length < 1) {
            DIRECTORY_SCOPES.push(AWS_DIR); // .aws by default
        }
        let valueProvider = this.options.valueProvider;
        if (!valueProvider) {
            valueProvider = () => [];
        }
        const VALUES = deploy_helpers.asArray(await Promise.resolve(valueProvider()));
        const REPLACE_WITH_VALUES = (val) => {
            return deploy_values.replaceWithValues(VALUES, val);
        };
        const FIND_FULL_FILE_PATH = async (p) => {
            p = deploy_helpers.toStringSafe(p);
            if (Path.isAbsolute(p)) {
                // exist if file exists
                if (await deploy_helpers.exists(p)) {
                    if ((await deploy_helpers.lstat(p)).isFile()) {
                        return Path.resolve(p); // file exists
                    }
                }
            }
            else {
                // detect existing, full path
                for (const DS of DIRECTORY_SCOPES) {
                    let fullPath = REPLACE_WITH_VALUES(p);
                    fullPath = Path.join(DS, fullPath);
                    fullPath = Path.resolve(fullPath);
                    if (await deploy_helpers.exists(fullPath)) {
                        if ((await deploy_helpers.lstat(fullPath)).isFile()) {
                            return fullPath; // file found
                        }
                    }
                }
            }
            throw new Error(i18.t('fileNotFound', p));
        };
        let bucket = deploy_helpers.toStringSafe(this.options.bucket).trim();
        if ('' === bucket) {
            bucket = 'vscode-deploy-reloaded';
        }
        let credentialClass = AWS.SharedIniFileCredentials;
        let credentialConfig;
        let credentialType;
        if (this.options.credentials) {
            credentialType = deploy_helpers.normalizeString(this.options.credentials.type);
            if ('' !== credentialType) {
                credentialClass = KNOWN_CREDENTIAL_CLASSES[credentialType];
            }
            credentialConfig = this.options.credentials.config;
            switch (credentialType) {
                case 'environment':
                    // EnvironmentCredentials
                    if (!deploy_helpers.isNullOrUndefined(credentialConfig)) {
                        credentialConfig = REPLACE_WITH_VALUES(credentialConfig).trim();
                    }
                    break;
                case 'file':
                    // FileSystemCredentials
                    if (!deploy_helpers.isNullOrUndefined(credentialConfig)) {
                        credentialConfig = deploy_helpers.toStringSafe(credentialConfig);
                        if (!deploy_helpers.isEmptyString(credentialConfig)) {
                            credentialConfig = await FIND_FULL_FILE_PATH(credentialConfig);
                        }
                    }
                    break;
                case 'shared':
                    // SharedIniFileCredentials
                    {
                        const GET_PROFILE_SAFE = (profile) => {
                            profile = deploy_helpers.toStringSafe(REPLACE_WITH_VALUES(profile)).trim();
                            if ('' === profile) {
                                profile = undefined;
                            }
                            return profile;
                        };
                        let sharedCfg = deploy_helpers.cloneObject(credentialConfig);
                        if (deploy_helpers.isObject(sharedCfg)) {
                            sharedCfg.filename = deploy_helpers.toStringSafe(sharedCfg.filename);
                        }
                        else {
                            sharedCfg = {
                                profile: deploy_helpers.toStringSafe(sharedCfg),
                            };
                        }
                        if (deploy_helpers.isEmptyString(sharedCfg.filename)) {
                            sharedCfg.filename = undefined;
                        }
                        else {
                            sharedCfg.filename = await FIND_FULL_FILE_PATH(sharedCfg.filename);
                        }
                        sharedCfg.profile = GET_PROFILE_SAFE(sharedCfg.profile);
                        credentialConfig = sharedCfg;
                    }
                    break;
            }
        }
        if (!credentialClass) {
            throw new Error(i18.t('s3bucket.credentialTypeNotSupported', credentialType));
        }
        if (this.options.customOpts) {
            AWS.config.update(this.options.customOpts);
        }
        return new AWS.S3({
            credentials: new credentialClass(credentialConfig),
            params: {
                Bucket: bucket,
                ACL: this.getDefaultAcl(),
            },
        });
    }
    /** @inheritdoc */
    deleteFile(path) {
        const ME = this;
        path = toS3Path(path);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const S3 = await ME.createInstance();
                const PARAMS = {
                    Key: path,
                };
                S3.deleteObject(PARAMS, (err) => {
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
        path = toS3Path(path);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const S3 = await ME.createInstance();
                const PARAMS = {
                    Key: path,
                };
                S3.getObject(PARAMS, (err, data) => {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        deploy_helpers.asBuffer(data.Body).then((data) => {
                            COMPLETED(null, data);
                        }).catch((err) => {
                            COMPLETED(err);
                        });
                    }
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    getDefaultAcl() {
        return getAclSafe(this.options.acl);
    }
    /** @inheritdoc */
    async listDirectory(path) {
        const ME = this;
        path = toS3Path(path);
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            const ALL_OBJS = [];
            const ITEMS = [];
            const ALL_LOADED = () => {
                const DIRS_ALREADY_ADDED = {};
                for (const O of ALL_OBJS) {
                    const KEY = deploy_helpers.toStringSafe(O.Key);
                    const KEY_WITHOUT_PATH = deploy_helpers.normalizePath(KEY.substr(path.length));
                    if (KEY_WITHOUT_PATH.indexOf('/') > -1) {
                        // directory
                        const DIR = KEY_WITHOUT_PATH.split('/')[0];
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
                                return await ME.downloadFile(path + '/' + KEY_WITHOUT_PATH);
                            },
                            //TODO: exportPath: false,
                            name: KEY_WITHOUT_PATH,
                            path: path,
                            size: O.Size,
                            type: deploy_files.FileSystemType.File,
                        };
                        if (!deploy_helpers.isNullOrUndefined(O.LastModified)) {
                            FI.time = Moment(O.LastModified);
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
                const RESULT_OBJS = result.Contents;
                if (!RESULT_OBJS) {
                    return;
                }
                for (const O of RESULT_OBJS) {
                    if (O) {
                        ALL_OBJS.push(O);
                    }
                }
            };
            try {
                const S3 = await ME.createInstance();
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
                        const PARAMS = {
                            Bucket: undefined,
                            ContinuationToken: currentContinuationToken,
                            Prefix: path,
                        };
                        S3.listObjectsV2(PARAMS, (err, result) => {
                            try {
                                if (err) {
                                    COMPLETED(err);
                                }
                                else {
                                    currentContinuationToken = result.NextContinuationToken;
                                    HANDLE_RESULT(result);
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
    get type() {
        return 's3bucket';
    }
    /** @inheritdoc */
    uploadFile(path, data) {
        const ME = this;
        path = toS3Path(path);
        if (!data) {
            data = Buffer.alloc(0);
        }
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const S3 = await ME.createInstance();
                let contentType = MimeTypes.lookup(Path.basename(path));
                if (false === contentType) {
                    contentType = 'application/octet-stream';
                }
                let acl;
                const FILE_ACL = ME.options.fileAcl;
                if (FILE_ACL) {
                    acl = FILE_ACL(path, ME.getDefaultAcl());
                }
                acl = deploy_helpers.normalizeString(acl);
                if ('' === acl) {
                    acl = undefined;
                }
                const PARAMS = {
                    ACL: acl,
                    Bucket: undefined,
                    ContentType: contentType,
                    Key: path,
                    Body: data,
                };
                S3.putObject(PARAMS, (err) => {
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
}
exports.S3BucketClient = S3BucketClient;
/**
 * Creates a new client.
 *
 * @param {S3BucketOptions} opts The options.
 *
 * @return {S3BucketClient} The new client.
 */
function createClient(opts) {
    if (!opts) {
        opts = {};
    }
    return new S3BucketClient(opts);
}
exports.createClient = createClient;
/**
 * Returns the name of an ACL safe.
 *
 * @param {string} acl The input value.
 *
 * @return {string} The normalized, safe value.
 */
function getAclSafe(acl) {
    acl = deploy_helpers.normalizeString(acl);
    if ('' === acl) {
        acl = exports.DEFAULT_ACL;
    }
    return acl;
}
exports.getAclSafe = getAclSafe;
/**
 * Converts to a S3 path.
 *
 * @param {string} path The path to convert.
 *
 * @return {string} The converted path.
 */
function toS3Path(path) {
    return deploy_helpers.normalizePath(path);
}
exports.toS3Path = toS3Path;
//# sourceMappingURL=s3bucket.js.map