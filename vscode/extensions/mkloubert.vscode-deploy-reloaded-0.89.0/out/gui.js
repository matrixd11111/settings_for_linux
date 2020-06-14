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
const deploy_contracts = require("./contracts");
const deploy_helpers = require("./helpers");
const deploy_log = require("./log");
const Enumerable = require("node-enumerable");
/**
 * The default value for the minimum number of files, which are required,
 * before 'showPopupWhenFinished()' shows a popup.
 */
exports.DEFAULT_REQUIRED_FILES_BEFORE_SHOW_POPUP_WHEN_FINISHED = 2;
/**
 * Shows a popup when a deploy operation has been finished.
 *
 * @param {ShowPopupWhenFinishedStats} stats The statistics.
 */
async function showPopupWhenFinished(stats) {
    const ME = this;
    const CFG = ME.config;
    if (!CFG) {
        return;
    }
    const FAILED_COUNT = stats.failed.length;
    const SUCCEEDED_COUNT = stats.succeeded.length;
    const ALL_COUNT = FAILED_COUNT + SUCCEEDED_COUNT;
    if (ALL_COUNT < 0) {
        return;
    }
    const CLOSE = {
        isCloseAffordance: true,
        title: ME.t('close'),
        value: 0,
    };
    const OPEN_OUTPUT = {
        title: ME.t('output.open'),
        value: 1,
    };
    const AFTER_POPUP = async (val) => {
        if (val) {
            if (1 === val.value) {
                try {
                    ME.output.show();
                }
                catch (e) {
                    deploy_log.CONSOLE
                        .trace(e, 'gui.showPopupWhenFinished.AFTER_POPUP(1)');
                }
            }
        }
    };
    const TRY_GET_RELATIVE_PATH = (p) => {
        let relativePath = ME.toRelativePath(p);
        if (false === relativePath) {
            relativePath = p;
        }
        return relativePath;
    };
    let setting = CFG.showPopupWhenFinished;
    if (_.isNil(setting)) {
        setting = false;
    }
    if (_.isBoolean(setting)) {
        if (!setting) {
            return;
        }
        setting = exports.DEFAULT_REQUIRED_FILES_BEFORE_SHOW_POPUP_WHEN_FINISHED;
    }
    else {
        setting = parseInt(deploy_helpers.toStringSafe(setting).trim());
    }
    if (isNaN(setting)) {
        setting = exports.DEFAULT_REQUIRED_FILES_BEFORE_SHOW_POPUP_WHEN_FINISHED;
    }
    let popupShower;
    let translationKey;
    switch (stats.operation) {
        case deploy_contracts.DeployOperation.Delete:
            translationKey = 'DELETE';
            break;
        case deploy_contracts.DeployOperation.Pull:
            translationKey = 'pull';
            break;
        default:
            translationKey = 'deploy';
            break;
    }
    if (ALL_COUNT >= setting) {
        if (FAILED_COUNT > 0) {
            if (SUCCEEDED_COUNT < 1) {
                popupShower = async () => {
                    if (1 === FAILED_COUNT) {
                        await AFTER_POPUP(await ME.showErrorMessage(ME.t(`${translationKey}.popups.fileFailed`, TRY_GET_RELATIVE_PATH(stats.failed[0])), OPEN_OUTPUT, CLOSE));
                    }
                    else {
                        await AFTER_POPUP(await ME.showErrorMessage(ME.t(`${translationKey}.popups.allFailed`, ALL_COUNT), OPEN_OUTPUT, CLOSE));
                    }
                };
            }
            else {
                popupShower = async () => {
                    await AFTER_POPUP(await ME.showWarningMessage(ME.t(`${translationKey}.popups.someFailed`, FAILED_COUNT, ALL_COUNT), OPEN_OUTPUT, CLOSE));
                };
            }
        }
        else {
            if (deploy_helpers.toBooleanSafe(CFG.showPopupOnSuccess, true)) {
                popupShower = async () => {
                    if (1 === ALL_COUNT) {
                        await ME.showInformationMessage(ME.t(`${translationKey}.popups.fileSucceeded`, TRY_GET_RELATIVE_PATH(stats.succeeded[0])));
                    }
                    else {
                        await ME.showInformationMessage(ME.t(`${translationKey}.popups.succeeded`, SUCCEEDED_COUNT));
                    }
                };
            }
        }
    }
    if (popupShower) {
        await Promise.resolve(popupShower());
    }
}
exports.showPopupWhenFinished = showPopupWhenFinished;
/**
 * Sorts quick pick items by usage by using the 'state' property as ID value.
 *
 * @param {IItem|TItem[]} items The item(s) to sort.
 * @param {vscode.vscode.Memento} state The memento where to store the states and counters.
 * @param {string} key The key inside the memento.
 * @param {Function} [labelResolver] The custom function that resolves the label value  of an item.
 *
 * @return {TItem[]} The sorted items.
 */
function sortQuickPicksByUsage(items, state, key, labelResolver) {
    items = deploy_helpers.asArray(items);
    key = deploy_helpers.toStringSafe(key);
    if (!labelResolver) {
        labelResolver = (item) => {
            return deploy_helpers.toStringSafe(item.label)
                .trim();
        };
    }
    let le;
    const UPDATE_ITEM = (id) => {
        try {
            id = deploy_helpers.toStringSafe(id);
            le.lastExecuted = id;
            le.executionCount[id] = isNaN(le.executionCount[id]) ? 1
                : (le.executionCount[id] + 1);
            state.update(key, le).then(() => {
            }, (err) => {
                deploy_log.CONSOLE
                    .trace(err, 'gui.sortQuickPicksByUsage().UPDATE_LAST_EXECUTED_QP(3)');
            });
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'gui.sortQuickPicksByUsage().UPDATE_LAST_EXECUTED_QP(2)');
        }
    };
    try {
        le = state.get(key);
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'gui.sortQuickPicksByUsage(1)');
    }
    if (!deploy_helpers.isObject(le)) {
        le = {
            executionCount: {},
            lastExecuted: false,
        };
    }
    try {
        return Enumerable.from(items).select(i => {
            return deploy_helpers.cloneObjectFlat(i);
        }).pipe(i => {
            const BASE_ACTION = i.action;
            i.action = async function () {
                UPDATE_ITEM(i.state);
                if (BASE_ACTION) {
                    return await Promise.resolve(BASE_ACTION.apply(i, arguments));
                }
            };
        }).orderBy(i => {
            // first if item has been executed last
            const ID = deploy_helpers.toStringSafe(i.state);
            return le.lastExecuted === ID ? 0 : 1;
        }).thenByDescending(i => {
            const ID = deploy_helpers.toStringSafe(i.state);
            return isNaN(le.executionCount[ID]) ? 0
                : le.executionCount[ID];
        }).thenBy(i => {
            return deploy_helpers.normalizeString(labelResolver(i));
        }).toArray();
    }
    catch (e) {
        deploy_log.CONSOLE
            .trace(e, 'gui.sortQuickPicksByUsage(2)');
        return items;
    }
}
exports.sortQuickPicksByUsage = sortQuickPicksByUsage;
//# sourceMappingURL=gui.js.map