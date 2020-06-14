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
const Path = require("path");
const deploy_compilers_coffeescript = require("./compilers/coffeescript");
const deploy_compilers_htmlminifier = require("./compilers/htmlminifier");
const deploy_compilers_less = require("./compilers/less");
const deploy_compilers_pug = require("./compilers/pug");
const deploy_compilers_uglifyjs = require("./compilers/uglifyjs");
const deploy_helpers = require("./helpers");
const Enumerable = require("node-enumerable");
const i18 = require("./i18");
/**
 * List of known compilers.
 */
var Compiler;
(function (Compiler) {
    /**
     * Less
     */
    Compiler[Compiler["Less"] = 0] = "Less";
    /**
     * UglifyJS
     */
    Compiler[Compiler["UglifyJS"] = 1] = "UglifyJS";
    /**
     * Pug
     */
    Compiler[Compiler["Pug"] = 2] = "Pug";
    /**
     * Html Minifier
     */
    Compiler[Compiler["HtmlMinifier"] = 3] = "HtmlMinifier";
    /**
     * CoffeeScript
     */
    Compiler[Compiler["CoffeeScript"] = 4] = "CoffeeScript";
})(Compiler = exports.Compiler || (exports.Compiler = {}));
/**
 * List of message categories.
 */
var CompileResultMessageCategory;
(function (CompileResultMessageCategory) {
    /**
     * Error
     */
    CompileResultMessageCategory[CompileResultMessageCategory["Error"] = 0] = "Error";
    /**
     * Warning
     */
    CompileResultMessageCategory[CompileResultMessageCategory["Warning"] = 1] = "Warning";
    /**
     * Info
     */
    CompileResultMessageCategory[CompileResultMessageCategory["Info"] = 2] = "Info";
})(CompileResultMessageCategory = exports.CompileResultMessageCategory || (exports.CompileResultMessageCategory = {}));
function cleanupPatternList(patterns, defaultPatterns) {
    let cleanedUpList;
    if (deploy_helpers.isNullOrUndefined(patterns)) {
        cleanedUpList = deploy_helpers.asArray(defaultPatterns);
    }
    else {
        cleanedUpList = deploy_helpers.asArray(patterns);
    }
    return Enumerable.from(cleanedUpList).select(p => {
        return deploy_helpers.toStringSafe(p);
    }).where(p => {
        return !deploy_helpers.isEmptyString(p);
    }).distinct()
        .toArray();
}
/**
 * Collects files for compilation.
 *
 * @param {CompileOptions} opts The underlying compile options.
 * @param {string|string[]} [defaultFiles] One or more default pattern for files to INCLUDE.
 * @param {string|string[]} defaultExcludes One or more default pattern for files to EXCLUDE.
 *
 * @return {Promise<string[]>} The array with the files.
 */
async function collectFiles(opts, defaultFiles, defaultExcludes) {
    opts = opts || {};
    const WORKSPACE = opts.workspace;
    return await WORKSPACE.findFilesByFilter({
        files: cleanupPatternList(opts.files, defaultFiles),
        exclude: cleanupPatternList(opts.exclude, defaultExcludes),
    });
}
exports.collectFiles = collectFiles;
/**
 * Compiles files.
 *
 * @param {Compiler} compiler The compiler to use.
 * @param {CompileOptions} opts Custom options for the compilation.
 *
 * @return {Promise<CompileResult>} The promise with the result.
 *
 * @throws {Error} Compiler not supported.
 */
async function compile(compiler, opts) {
    switch (compiler) {
        case Compiler.CoffeeScript:
            return await deploy_compilers_coffeescript.compile(opts);
        case Compiler.HtmlMinifier:
            return await deploy_compilers_htmlminifier.compile(opts);
        case Compiler.Less:
            return await deploy_compilers_less.compile(opts);
        case Compiler.Pug:
            return await deploy_compilers_pug.compile(opts);
        case Compiler.UglifyJS:
            return await deploy_compilers_uglifyjs.compile(opts);
    }
    throw new Error(i18.t('compilers.notSupported', compiler));
}
exports.compile = compile;
/**
 * Returns the base directory from compiler options.
 *
 * @param {CompileOptions} opts The options.
 *
 * @return {string} The full path of the base directory.
 */
function getBaseDirectory(opts) {
    if (!opts) {
        opts = {};
    }
    const WORKSPACE = opts.workspace;
    let baseDirectory = WORKSPACE.replaceWithValues(opts.baseDirectory);
    if (deploy_helpers.isEmptyString(baseDirectory)) {
        baseDirectory = WORKSPACE.rootPath;
    }
    if (!Path.isAbsolute(baseDirectory)) {
        baseDirectory = Path.join(WORKSPACE.rootPath, baseDirectory);
    }
    return Path.resolve(baseDirectory);
}
exports.getBaseDirectory = getBaseDirectory;
/**
 * Returns the full output path for a file.
 *
 * @param {string} file The input file path.
 * @param {CompileOptions} opts The options.
 *
 * @return {string} The output file path.
 */
function getFullOutputPathForSourceFile(file, opts) {
    file = deploy_helpers.toStringSafe(file);
    if (!opts) {
        opts = {};
    }
    const BASE_DIR = getBaseDirectory(opts);
    if (!Path.isAbsolute(file)) {
        file = Path.join(BASE_DIR, file);
    }
    let outputDir = getOutputDirectory(opts);
    if (false === outputDir) {
        outputDir = Path.dirname(file);
    }
    outputDir = Path.resolve(outputDir);
    if (file.startsWith(BASE_DIR)) {
        // re-map
        file = Path.join(outputDir, file.substr(BASE_DIR.length));
    }
    return Path.resolve(file);
}
exports.getFullOutputPathForSourceFile = getFullOutputPathForSourceFile;
/**
 * Returns the output directory from compiler options.
 *
 * @param {CompileOptions} opts The options.
 *
 * @return {string|false} The full path of the output directory or (false) if no output directory has been defined.
 */
function getOutputDirectory(opts) {
    if (!opts) {
        opts = {};
    }
    const WORKSPACE = opts.workspace;
    const BASE_DIR = getBaseDirectory(opts);
    let customOutDir = WORKSPACE.replaceWithValues(opts.outDirectory);
    if (!deploy_helpers.isEmptyString(customOutDir)) {
        if (!Path.isAbsolute(customOutDir)) {
            customOutDir = Path.join(BASE_DIR, customOutDir);
        }
        return Path.resolve(customOutDir);
    }
    return false;
}
exports.getOutputDirectory = getOutputDirectory;
//# sourceMappingURL=compilers.js.map