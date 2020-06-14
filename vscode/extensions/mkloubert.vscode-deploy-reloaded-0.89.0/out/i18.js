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
const deploy_log = require("./log");
const i18next = require("i18next");
const Path = require("path");
const vscode = require("vscode");
let globalTranslator;
/**
 * Creates a new the language repository.
 *
 * @param {string} [lang] The custom language ID to use.
 *
 * @returns {Promise<TranslationFunction>} The promise with the translation function.
 */
async function create(lang) {
    lang = deploy_helpers.toStringSafe(lang);
    if (deploy_helpers.isEmptyString(lang)) {
        lang = vscode.env.language;
    }
    lang = normalizeLangName(lang);
    if ('' === lang) {
        lang = 'en';
    }
    const LANG_DIR = Path.join(__dirname, 'lang');
    const RESOURCES = {};
    let isDirectory = false;
    return await deploy_helpers.buildWorkflow().next(async () => {
        try {
            if (await deploy_helpers.exists(LANG_DIR)) {
                isDirectory = (await deploy_helpers.lstat(LANG_DIR)).isDirectory();
            }
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'i18.init(1)');
        }
    }).next(async () => {
        if (!isDirectory) {
            return;
        }
        try {
            const FILES = await deploy_helpers.glob('*.js', {
                cwd: LANG_DIR,
                nocase: false,
                root: LANG_DIR,
            });
            for (const F of FILES) {
                try {
                    const FILENAME = Path.basename(F);
                    const LANG_NAME = normalizeLangName(FILENAME.substr(0, FILENAME.length - 3));
                    if ('' === LANG_NAME) {
                        continue; // no language name available
                    }
                    if (!(await deploy_helpers.lstat(F)).isFile()) {
                        continue; // no file
                    }
                    // deleted cached data
                    // and load current translation
                    // from file
                    RESOURCES[LANG_NAME] = {
                        translation: require(F).translation,
                    };
                }
                catch (e) {
                    deploy_log.CONSOLE
                        .trace(e, 'i18.init(3)');
                }
            }
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'i18.init(2)');
        }
    }).next((ctx) => {
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                i18next.createInstance({
                    lng: lang,
                    resources: RESOURCES,
                    fallbackLng: 'en',
                }, (err, tr) => {
                    if (err) {
                        COMPLETED(err);
                    }
                    else {
                        COMPLETED(null, tr);
                    }
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }).start();
}
exports.create = create;
/**
 * Initializes the global translations.
 *
 * @return {Promise<boolean>} The promise that indicates if operation was succcessful or not.
 */
async function init() {
    try {
        globalTranslator = await create();
        return true;
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'i18.init()');
        return false;
    }
}
exports.init = init;
/**
 * Initializes the language repository for a workspace.
 *
 * @returns {Promise<TranslationFunction>} The promise with the translation function.
 */
async function initForWorkspace() {
    const ME = this;
    return await create(ME.config.language);
}
exports.initForWorkspace = initForWorkspace;
function normalizeLangName(lang) {
    lang = deploy_helpers.normalizeString(lang);
    lang = deploy_helpers.replaceAllStrings(lang, '-', '_');
    return lang;
}
/**
 * Returns a translated string by key.
 *
 * @param {string} key The key.
 * @param {any} [args] The optional arguments.
 *
 * @return {string} The "translated" string.
 */
function t(key, ...args) {
    return translateWith.apply(null, [globalTranslator, null, key].concat(args));
}
exports.t = t;
/**
 * Returns a translated string by key and a specific function.
 *
 * @param {i18next.TranslationFunction} func The function to use.
 * @param {Function} fallback The fallback function.
 * @param {string} key The key.
 * @param {any} [args] The optional arguments.
 *
 * @return {string} The "translated" string.
 */
function translateWith(func, fallback, key, ...args) {
    if (!fallback) {
        fallback = () => key;
    }
    try {
        if (func) {
            let formatStr = func(deploy_helpers.toStringSafe(key));
            formatStr = deploy_helpers.toStringSafe(formatStr);
            return deploy_helpers.formatArray(formatStr, args);
        }
        return fallback();
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'i18.translateWith()');
        return key;
    }
}
exports.translateWith = translateWith;
//# sourceMappingURL=i18.js.map