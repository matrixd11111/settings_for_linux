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
const Crypto = require("crypto");
const deploy_helpers = require("./helpers");
/**
 * The transformer mode.
 */
var DataTransformerMode;
(function (DataTransformerMode) {
    /**
     * Restore transformed data.
     */
    DataTransformerMode[DataTransformerMode["Restore"] = 0] = "Restore";
    /**
     * Transform UNtransformed data.
     */
    DataTransformerMode[DataTransformerMode["Transform"] = 1] = "Transform";
})(DataTransformerMode = exports.DataTransformerMode || (exports.DataTransformerMode = {}));
/**
 * Creates a "safe" data transformer.
 *
 * @param {DataTransformer} transformer The transformer to wrap.
 * @param {any} [thisArg] The custom object / value that should be applied to 'transformer'.
 *
 * @return {DataTransformer} The wrapper.
 */
function toDataTransformerSafe(transformer, thisArg) {
    if (!transformer) {
        transformer = (data) => data;
    }
    return async function () {
        let data = await Promise.resolve(transformer.apply(thisArg, arguments));
        data = await deploy_helpers.asBuffer(data, 'binary');
        if (!Buffer.isBuffer(data)) {
            data = Buffer.alloc(0);
        }
        return data;
    };
}
exports.toDataTransformerSafe = toDataTransformerSafe;
/**
 * Creates wrapper for a data transformer for encrypting data by password.
 *
 * @param {DataTransformer} baseTransformer The transformer to wrap.
 * @param {deploy_contracts.Encryptable} opts The options.
 *
 * @return {DataTransformer} The wrapper.
 */
function toPasswordTransformer(baseTransformer, opts) {
    if (!opts) {
        opts = {};
    }
    let pwd = deploy_helpers.toStringSafe(opts.encryptWith);
    let algo = deploy_helpers.normalizeString(opts.encryptBy);
    if ('' === algo) {
        algo = 'aes-256-ctr';
    }
    return async function (input, context) {
        if (!input) {
            return input;
        }
        let result = input;
        const INVOKE_TRANSFORMER_FOR = async (buff) => {
            if (baseTransformer) {
                buff = await Promise.resolve(baseTransformer(buff, context));
            }
            return buff;
        };
        let invokeTransformer = true;
        if (result) {
            if ('' !== pwd) {
                invokeTransformer = false;
                switch (context.mode) {
                    case DataTransformerMode.Restore:
                        {
                            const DECIPHER = Crypto.createDecipher(algo, pwd);
                            // 1. UNcrypt
                            result = Buffer.concat([
                                DECIPHER.update(result),
                                DECIPHER.final()
                            ]);
                            // 2. UNtransform
                            result = await INVOKE_TRANSFORMER_FOR(result);
                        }
                        break;
                    case DataTransformerMode.Transform:
                        {
                            const CIPHER = Crypto.createCipher(algo, pwd);
                            // 1. transform
                            result = await INVOKE_TRANSFORMER_FOR(result);
                            // 2. crypt
                            result = Buffer.concat([
                                CIPHER.update(result),
                                CIPHER.final()
                            ]);
                        }
                        break;
                }
            }
        }
        if (invokeTransformer) {
            result = await INVOKE_TRANSFORMER_FOR(result);
        }
        return result;
    };
}
exports.toPasswordTransformer = toPasswordTransformer;
//# sourceMappingURL=transformers.js.map