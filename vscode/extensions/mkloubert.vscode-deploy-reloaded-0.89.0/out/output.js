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
/**
 * A wrapper for an output channel.
 */
class OutputChannelWrapper extends deploy_helpers.DisposableBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {vscode.OutputChannel} baseChannel The base channel.
     * @param {boolean} [ownsChannel] Also dispose base channel or not.
     */
    constructor(baseChannel, ownsChannel) {
        super();
        this.baseChannel = baseChannel;
        this._WRITERS = [];
        this._OWNS_CHANNEL = deploy_helpers.toBooleanSafe(ownsChannel);
    }
    /**
     * Adds a writer.
     *
     * @param {ChannelWriter} writer The writer to add.
     *
     * @chainable
     */
    addWriter(writer) {
        if (writer) {
            this._WRITERS.push(writer);
        }
        return this;
    }
    /** @inheritdoc */
    append(value) {
        value = deploy_helpers.toStringSafe(value);
        this.invokeForBaseChannel(this.baseChannel.append, [value]);
        this.sendToWriters(value, false);
    }
    /** @inheritdoc */
    appendLine(value) {
        value = deploy_helpers.toStringSafe(value);
        this.invokeForBaseChannel(this.baseChannel.appendLine, [value]);
        this.sendToWriters(value, true);
    }
    /** @inheritdoc */
    clear() {
        this.invokeForBaseChannel(this.baseChannel.clear, arguments);
    }
    /** @inheritdoc */
    hide() {
        this.invokeForBaseChannel(this.baseChannel.hide, arguments);
    }
    invokeForBaseChannel(method, args) {
        if (method) {
            return method.apply(this.baseChannel, args || []);
        }
    }
    /** @inheritdoc */
    get name() {
        return this.baseChannel.name;
    }
    /** @inheritdoc */
    onDispose() {
        while (this._WRITERS.length > 0) {
            this._WRITERS.pop();
        }
        if (this._OWNS_CHANNEL) {
            this.invokeForBaseChannel(this.baseChannel.dispose, []);
        }
    }
    sendToWriters(text, addNewLine) {
        if ('' === text) {
            return;
        }
        for (const WRITER of this._WRITERS) {
            try {
                WRITER({
                    addNewLine: addNewLine,
                    baseChannel: this.baseChannel,
                    text: text,
                });
            }
            catch (e) {
                deploy_log.CONSOLE
                    .trace(e, 'output.OutputChannelWrapper.sendToWriters(1)');
            }
        }
    }
    /** @inheritdoc */
    show() {
        this.invokeForBaseChannel(this.baseChannel.show, arguments);
    }
}
exports.OutputChannelWrapper = OutputChannelWrapper;
//# sourceMappingURL=output.js.map