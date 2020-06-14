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
const deploy_log = require("./log");
const i18 = require("./i18");
const Moment = require("moment");
const vscode = require("vscode");
const KEY_READ_NOTIFICATIONS = 'vscdrReadNotifications';
async function displayNotification(opts) {
    if (_.isNil(opts)) {
        opts = {};
    }
    const NOTE = opts.note;
    if (_.isNil(NOTE)) {
        return;
    }
    const CONTENT = deploy_helpers.toStringSafe(NOTE.content).trim();
    if ('' === CONTENT) {
        return;
    }
    const MESSAGE_ITEMS = [];
    if (!_.isNil(NOTE.link)) {
        const LINK = deploy_helpers.toStringSafe(NOTE.link.href).trim();
        if ('' !== LINK) {
            let linkText = deploy_helpers.toStringSafe(NOTE.link.text).trim();
            if ('' === linkText) {
                linkText = 'Open link ...';
            }
            MESSAGE_ITEMS.push({
                action: async () => {
                    deploy_helpers.open(LINK);
                    if (opts.onLinkClick) {
                        await Promise.resolve(opts.onLinkClick());
                    }
                },
                title: linkText,
            });
        }
    }
    MESSAGE_ITEMS.push({
        action: async () => {
            if (opts.onOKClick) {
                await Promise.resolve(opts.onOKClick());
            }
        },
        isCloseAffordance: true,
        title: "OK",
    });
    MESSAGE_ITEMS.push({
        action: async () => {
            if (opts.onRemindMeLaterClick) {
                await Promise.resolve(opts.onRemindMeLaterClick());
            }
        },
        title: 'Remind me later',
    });
    let popupFunc;
    const TYPE = deploy_helpers.normalizeString(NOTE.type);
    switch (TYPE) {
        case 'e':
        case 'emerg':
        case 'emergency':
            popupFunc = vscode.window.showErrorMessage;
            break;
        case 'important':
        case 'w':
        case 'warn':
        case 'warning':
            popupFunc = vscode.window.showWarningMessage;
            break;
        default:
            popupFunc = vscode.window.showInformationMessage;
            break;
    }
    const SELECTED_ITEM = await popupFunc.apply(null, [CONTENT].concat(MESSAGE_ITEMS));
    if (SELECTED_ITEM) {
        if (SELECTED_ITEM.action) {
            await Promise.resolve(SELECTED_ITEM.action(SELECTED_ITEM));
        }
    }
}
async function loadNotifications(packageFile) {
    return deploy_helpers.filterExtensionNotifications(deploy_helpers.from(await deploy_helpers.getExtensionNotifications('https://mkloubert.github.io/notifications/vscode-deploy-reloaded.json')).orderBy(x => {
        try {
            const NOTE_TIME = deploy_helpers.toStringSafe(x.time).trim();
            if ('' !== NOTE_TIME) {
                const TIME = Moment.utc(NOTE_TIME);
                if (TIME.isValid()) {
                    return TIME.unix();
                }
            }
        }
        catch (_a) { }
        return Number.MIN_SAFE_INTEGER;
    }).toArray(), {
        version: packageFile ? packageFile.version
            : undefined,
    });
}
/**
 * Shows the notifications for that extension.
 *
 * @param {vscode.ExtensionContext} context The extension context.
 * @param {deploy_helpers.PackageFile} [packageFile] The underlying package file.
 * @param {deploy_helpers.ExtensionNotification|deploy_helpers.ExtensionNotification[]} [notifications] Custom list of notifications.
 */
async function showExtensionNotifications(context, packageFile, notifications) {
    if (arguments.length < 3) {
        notifications = await loadNotifications(packageFile);
    }
    else {
        notifications = deploy_helpers.asArray(notifications);
    }
    await withReadNotificationsStorage(context, async (readNotifications) => {
        const GET_NOTE_ID = (note) => {
            if (!_.isNil(note)) {
                return deploy_helpers.normalizeString(note.id);
            }
        };
        // cleanups
        _.forIn(readNotifications, (value, key) => {
            const ID = deploy_helpers.normalizeString(key);
            const EXISTS = deploy_helpers.from(notifications).any(n => {
                return GET_NOTE_ID(n) === ID;
            });
            if (!EXISTS) {
                delete readNotifications[key];
            }
        });
        for (const NOTE of notifications) {
            try {
                const NOTE_ID = GET_NOTE_ID(NOTE);
                if ('' === NOTE_ID) {
                    continue;
                }
                if (true === readNotifications[NOTE_ID]) {
                    continue;
                }
                await displayNotification({
                    note: NOTE,
                    onLinkClick: () => {
                        readNotifications[NOTE_ID] = true;
                    },
                    onOKClick: () => {
                        readNotifications[NOTE_ID] = true;
                    },
                    onRemindMeLaterClick: () => {
                        delete readNotifications[NOTE_ID];
                    }
                });
            }
            catch (_a) { }
        }
    });
}
exports.showExtensionNotifications = showExtensionNotifications;
/**
 * Registers notification commands.
 *
 * @param {vscode.ExtensionContext} context The extension's context.
 * @param {deploy_helpers.PackageFile} packageFile The package file meta data.
 */
function registerNotificationCommands(context, packageFile) {
    context.subscriptions.push(
    // show notification
    vscode.commands.registerCommand('extension.deploy.reloaded.showNotifications', async () => {
        try {
            let hasCancelled = false;
            const QUICK_PICKS = await vscode.window.withProgress({
                cancellable: true,
                location: vscode.ProgressLocation.Notification,
                title: i18.t('notifications.loading'),
            }, async (progress, cancelToken) => {
                try {
                    let i = 0;
                    return (deploy_helpers.from(await loadNotifications(packageFile))).where(n => {
                        return !deploy_helpers.isEmptyString(n.content);
                    }).reverse().select((n) => {
                        let label = deploy_helpers.toStringSafe(n.title).trim();
                        if ('' === label) {
                            label = i18.t('notifications.defaultName', i + 1);
                        }
                        let detail;
                        try {
                            const NOTE_TIME = deploy_helpers.toStringSafe(n.time);
                            if ('' !== NOTE_TIME) {
                                const TIME = deploy_helpers.asLocalTime(Moment.utc(NOTE_TIME));
                                if (TIME.isValid()) {
                                    detail = TIME.format(i18.t('time.dateTime'));
                                }
                            }
                        }
                        catch (_a) { }
                        return {
                            action: async () => {
                                await displayNotification({
                                    note: n,
                                });
                            },
                            label: label,
                            detail: detail,
                        };
                    }).toArray();
                }
                finally {
                    hasCancelled = cancelToken.isCancellationRequested;
                }
            });
            if (hasCancelled) {
                return;
            }
            if (QUICK_PICKS.length < 1) {
                vscode.window.showWarningMessage(i18.t('notifications.noneFound'));
                return;
            }
            const SELECTED_ITEMS = deploy_helpers.asArray(await vscode.window.showQuickPick(QUICK_PICKS, {
                canPickMany: true,
                placeHolder: i18.t('notifications.selectNotifications'),
            }));
            for (const SI of SELECTED_ITEMS) {
                await SI.action();
            }
        }
        catch (e) {
            deploy_log.CONSOLE
                .trace(e, 'extension.deploy.reloaded.showNotification');
            deploy_helpers.showErrorMessage(i18.t('tools.errors.operationFailed'));
        }
    }));
}
exports.registerNotificationCommands = registerNotificationCommands;
async function withReadNotificationsStorage(context, action) {
    let readNotifications;
    try {
        readNotifications = context.globalState
            .get(KEY_READ_NOTIFICATIONS, null);
    }
    catch (_a) {
        readNotifications = false;
    }
    if (!readNotifications) {
        readNotifications = {};
    }
    try {
        if (action) {
            return await Promise.resolve(action(readNotifications));
        }
    }
    finally {
        await context.globalState
            .update(KEY_READ_NOTIFICATIONS, readNotifications);
    }
}
//# sourceMappingURL=notifications.js.map