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
const deploy_compilers = require("../compilers");
const deploy_helpers = require("../helpers");
const LESS = require("less");
const Path = require("path");
/**
 * Compiles CSS files by LESS.
 *
 * @param {CompileOptions} compileOpts The options for the compilation.
 *
 * @return {Promise<CompileResult>} The promise with the result.
 */
async function compile(compileOpts) {
    const WORKSPACE = compileOpts.workspace;
    const RESULT = {
        messages: [],
    };
    const OPTS = compileOpts.options || {};
    const FILES_TO_COMPILE = await deploy_compilers.collectFiles(compileOpts, '**/*.less');
    let enc = deploy_helpers.normalizeString(WORKSPACE.replaceWithValues(compileOpts.encoding));
    if ('' === enc) {
        enc = 'utf8';
    }
    let outExt = deploy_helpers.toStringSafe(WORKSPACE.replaceWithValues(compileOpts.extension)).trim();
    if ('' === outExt) {
        outExt = 'css';
    }
    for (const FTC of FILES_TO_COMPILE) {
        let msg;
        try {
            const LESS_CODE = (await deploy_helpers.readFile(FTC)).toString(enc);
            const OUTPUT_FILE_PATH = deploy_compilers.getFullOutputPathForSourceFile(FTC, compileOpts);
            const OUT_DIR = Path.dirname(OUTPUT_FILE_PATH);
            await deploy_helpers.createDirectoryIfNeeded(OUT_DIR);
            const EXT = Path.extname(OUTPUT_FILE_PATH);
            const FILENAME = Path.basename(OUTPUT_FILE_PATH, EXT);
            const OUTPUT_FILE = Path.join(OUT_DIR, FILENAME + '.' + outExt);
            const LESS_OUTPUT = await LESS.render(LESS_CODE, OPTS);
            await deploy_helpers.writeFile(OUTPUT_FILE, new Buffer(LESS_OUTPUT.css, enc));
        }
        catch (e) {
            msg = {
                category: deploy_compilers.CompileResultMessageCategory.Error,
                compiler: deploy_compilers.Compiler.Less,
                file: FTC,
                message: deploy_helpers.toStringSafe(e),
            };
        }
        if (msg) {
            RESULT.messages.push(msg);
        }
    }
    return RESULT;
}
exports.compile = compile;
//# sourceMappingURL=less.js.map