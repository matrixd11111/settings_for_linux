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
const deploy_res_html = require("./resources/html");
const Marked = require("marked");
const MergeDeep = require('merge-deep');
const vscode = require("vscode");
/**
 * The URI protocol for opening a HTML document.
 */
exports.HTML_URI_PROTOCOL = 'vscode-deploy-reloaded-html';
/**
 * The ID of the global command to open an HTML document.
 */
exports.OPEN_HTML_DOC_COMMAND = 'extension.deploy.reloaded.openHtmlDoc';
const HTML_DOCS2 = [];
let nextHtmlDocId = Number.MIN_SAFE_INTEGER;
/**
 * Opens a HTML document in a new tab.
 *
 * @param {string} html The HTML document (source code).
 * @param {string} [title] The custom title for the tab.
 * @param {any} [id] The custom ID for the document in the storage.
 *
 * @returns {Promise<any>} The promise with the result.
 */
async function openHtmlDocument(html, title, id) {
    let body;
    let enc = 'utf8';
    if (!deploy_helpers.isNullOrUndefined(html)) {
        body = new Buffer(deploy_helpers.toStringSafe(html), enc);
    }
    if (deploy_helpers.isNullOrUndefined(id)) {
        id = 'vscdr::431E0365-4388-4C61-9F6C-06275215E4B8::' + (nextHtmlDocId++);
    }
    const NEW_DOC = {
        body: body,
        encoding: enc,
        id: id,
        mime: 'text/html',
    };
    if (!deploy_helpers.isEmptyString(title)) {
        NEW_DOC.title = deploy_helpers.toStringSafe(title).trim();
    }
    //Find existing column
    const column = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
    //Create webview panel
    const panel = vscode.window.createWebviewPanel("VscdrGeneralHtmlWebView", NEW_DOC.title, column || vscode.ViewColumn.One, {
        enableScripts: false,
    });
    //Load content into webview
    panel.webview.html = NEW_DOC.body.toString();
    return true;
}
exports.openHtmlDocument = openHtmlDocument;
/**
 * Opens a Markdown document in a new tab.
 *
 * @param {string} md The Markdown document (source code).
 * @param {MarkdownDocumentOptions} [opts] Custom options.
 *
 * @returns {Promise<any>} The promise with the result.
 */
async function openMarkdownDocument(md, opts) {
    if (!opts) {
        opts = {};
    }
    const DEFAULT_OPTS = {
        breaks: true,
        gfm: true,
        langPrefix: '',
        tables: true,
    };
    const CSS = deploy_helpers.toStringSafe(opts.css);
    const DOCUMENT_ID = opts.documentId;
    const DOCUMENT_TITLE = opts.documentTitle;
    let html = await deploy_res_html.getStringContent("header.html");
    if (!deploy_helpers.isEmptyString(CSS)) {
        html += `
<style text="text/css">

${CSS}

</style>
`;
    }
    html += Marked(deploy_helpers.toStringSafe(md), MergeDeep(DEFAULT_OPTS, opts));
    html += await deploy_res_html.getStringContent("footer.html");
    return await openHtmlDocument(html, DOCUMENT_TITLE, DOCUMENT_ID);
}
exports.openMarkdownDocument = openMarkdownDocument;
//# sourceMappingURL=html.js.map