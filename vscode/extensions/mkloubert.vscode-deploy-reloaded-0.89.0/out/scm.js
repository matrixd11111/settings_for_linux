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
const Enumerable = require("node-enumerable");
const i18 = require("./i18");
const vscode = require("vscode");
/**
 * List of file change types.
 */
var FileChangeType;
(function (FileChangeType) {
    /**
     * Added
     */
    FileChangeType[FileChangeType["Added"] = 1] = "Added";
    /**
     * Changed / modified
     */
    FileChangeType[FileChangeType["Modified"] = 2] = "Modified";
    /**
     * Removed / deleted
     */
    FileChangeType[FileChangeType["Deleted"] = 3] = "Deleted";
})(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
/**
 * Shows a quick for selecting a commit of a SCM client.
 *
 * @param {SourceControlClient} client The client.
 *
 * @return {Promise<Commit|false>} The promise with the selected commit (if selected)
 *                                 or (false) if failed.
 */
async function showSCMCommitQuickPick(client) {
    if (!client) {
        return client;
    }
    try {
        const BRANCHES = deploy_helpers.asArray(await Promise.resolve(client.branches()));
        const BRANCH_QUICK_PICKS = BRANCHES.map(b => {
            let description;
            let detail;
            if (b.lastCommit) {
                description = b.lastCommit.id;
                detail = b.lastCommit.subject;
            }
            return {
                action: () => {
                    return b;
                },
                label: '$(git-branch)  ' + deploy_helpers.toStringSafe(b.id).trim(),
                description: deploy_helpers.toStringSafe(description).trim(),
                detail: deploy_helpers.toStringSafe(detail).trim(),
            };
        });
        if (BRANCH_QUICK_PICKS.length < 1) {
            deploy_helpers.showWarningMessage(i18.t('scm.branches.noneFound'));
            return false;
        }
        let selectedBranchItem;
        if (1 === BRANCH_QUICK_PICKS.length) {
            selectedBranchItem = BRANCH_QUICK_PICKS[0];
        }
        else {
            selectedBranchItem = await vscode.window.showQuickPick(BRANCH_QUICK_PICKS, {
                placeHolder: i18.t('scm.branches.selectBranch')
            });
        }
        if (!selectedBranchItem) {
            return;
        }
        const SELECTED_BRANCH = selectedBranchItem.action();
        let selectCommit;
        selectCommit = async (page) => {
            const COMMITS = await SELECTED_BRANCH.commits(page);
            const IS_FIRST_PAGE = isNaN(page);
            const IS_LAST_PAGE = Enumerable.from(COMMITS)
                .any(c => 0 == c.index);
            const COMMIT_QUICK_PICKS = COMMITS.map(c => {
                let description;
                if (c.date && c.date.isValid()) {
                    description = deploy_helpers.asLocalTime(c.date).format(i18.t('time.dateTimeWithSeconds'));
                }
                return {
                    action: () => {
                        return c;
                    },
                    label: '$(git-commit)  ' + deploy_helpers.toStringSafe(c.subject).trim(),
                    description: deploy_helpers.toStringSafe(description),
                    detail: deploy_helpers.toStringSafe(c.id).trim(),
                };
            });
            if (!IS_FIRST_PAGE) {
                const PREV_PAGE = page - 1;
                COMMIT_QUICK_PICKS.unshift({
                    action: async () => {
                        return await selectCommit(PREV_PAGE);
                    },
                    label: '$(triangle-left)  ' + i18.t('pagination.previousPage', PREV_PAGE),
                    description: '',
                });
            }
            if (!IS_LAST_PAGE) {
                const NEXT_PAGE = isNaN(page) ? 2 : (page + 1);
                COMMIT_QUICK_PICKS.push({
                    action: async () => {
                        return await selectCommit(NEXT_PAGE);
                    },
                    label: '$(triangle-right)  ' + i18.t('pagination.nextPage', NEXT_PAGE),
                    description: '',
                });
            }
            if (COMMIT_QUICK_PICKS.length < 1) {
                deploy_helpers.showWarningMessage(i18.t('scm.commits.noneFound'));
                return false;
            }
            let selectedCommitItem;
            if (1 === COMMIT_QUICK_PICKS.length) {
                selectedCommitItem = COMMIT_QUICK_PICKS[0];
            }
            else {
                selectedCommitItem = await vscode.window.showQuickPick(COMMIT_QUICK_PICKS, {
                    placeHolder: i18.t('scm.commits.selectCommit')
                });
            }
            if (!selectedCommitItem) {
                return;
            }
            return await Promise.resolve(selectedCommitItem.action());
        };
        return await selectCommit();
    }
    catch (e) {
        deploy_helpers.showErrorMessage(i18.t('scm.commits.errors.selectingCommitFailed', e));
    }
}
exports.showSCMCommitQuickPick = showSCMCommitQuickPick;
/**
 * Selects a range of commits.
 *
 * @param {SourceControlClient} client The client.
 *
 * @return {Promise<SCMCommitRange|false>} The promise with the range or (false) if failed.
 */
async function showSCMCommitRangeQuickPick(client) {
    if (!client) {
        return client;
    }
    try {
        const BRANCHES = deploy_helpers.asArray(await Promise.resolve(client.branches()));
        const BRANCH_QUICK_PICKS = BRANCHES.map(b => {
            let description;
            let detail;
            if (b.lastCommit) {
                description = b.lastCommit.id;
                detail = b.lastCommit.subject;
            }
            return {
                action: () => {
                    return b;
                },
                label: '$(git-branch)  ' + deploy_helpers.toStringSafe(b.id).trim(),
                description: deploy_helpers.toStringSafe(description).trim(),
                detail: deploy_helpers.toStringSafe(detail).trim(),
            };
        });
        if (BRANCH_QUICK_PICKS.length < 1) {
            deploy_helpers.showWarningMessage(i18.t('scm.branches.noneFound'));
            return false;
        }
        let selectedBranchItem;
        if (1 === BRANCH_QUICK_PICKS.length) {
            selectedBranchItem = BRANCH_QUICK_PICKS[0];
        }
        else {
            selectedBranchItem = await vscode.window.showQuickPick(BRANCH_QUICK_PICKS, {
                placeHolder: i18.t('scm.branches.selectBranch')
            });
        }
        if (!selectedBranchItem) {
            return;
        }
        const SELECTED_BRANCH = selectedBranchItem.action();
        const SELECT_COMMIT = async (lang, skip = 0, page = 1) => {
            if (skip < 0) {
                skip = 0;
            }
            if (page < 1) {
                page = 1;
            }
            const COMMITS = await SELECTED_BRANCH.commits(page, skip);
            const IS_FIRST_PAGE = page < 2;
            const IS_LAST_PAGE = Enumerable.from(COMMITS)
                .any(c => 0 == c.index);
            const COMMIT_QUICK_PICKS = COMMITS.map(c => {
                let description;
                if (c.date && c.date.isValid()) {
                    description = deploy_helpers.asLocalTime(c.date).format(i18.t('time.dateTimeWithSeconds'));
                }
                return {
                    action: () => {
                        return c;
                    },
                    label: '$(git-commit)  ' + deploy_helpers.toStringSafe(c.subject).trim(),
                    description: deploy_helpers.toStringSafe(description),
                    detail: deploy_helpers.toStringSafe(c.id).trim(),
                };
            });
            if (!IS_FIRST_PAGE) {
                const PREV_PAGE = page - 1;
                COMMIT_QUICK_PICKS.unshift({
                    action: async () => {
                        return await SELECT_COMMIT(lang, skip, PREV_PAGE);
                    },
                    label: '$(triangle-left)  ' + i18.t('pagination.previousPage', PREV_PAGE),
                    description: '',
                });
            }
            if (!IS_LAST_PAGE) {
                const NEXT_PAGE = page + 1;
                COMMIT_QUICK_PICKS.push({
                    action: async () => {
                        return await SELECT_COMMIT(lang, skip, NEXT_PAGE);
                    },
                    label: '$(triangle-right)  ' + i18.t('pagination.nextPage', NEXT_PAGE),
                    description: '',
                });
            }
            if (COMMIT_QUICK_PICKS.length < 1) {
                deploy_helpers.showWarningMessage(i18.t('scm.commits.noneFound'));
                return false;
            }
            let selectedCommitItem;
            if (1 === COMMIT_QUICK_PICKS.length) {
                selectedCommitItem = COMMIT_QUICK_PICKS[0];
            }
            else {
                selectedCommitItem = await vscode.window.showQuickPick(COMMIT_QUICK_PICKS, {
                    placeHolder: i18.t('scm.commits.' + lang)
                });
            }
            if (!selectedCommitItem) {
                return;
            }
            return await Promise.resolve(selectedCommitItem.action());
        };
        const ALL_COMMITS = await SELECTED_BRANCH.commitCount();
        const FIRST_COMMIT = await SELECT_COMMIT('selectFirstCommit');
        if (FIRST_COMMIT) {
            const LAST_COMMIT = await SELECT_COMMIT('selectLastCommit', ALL_COMMITS - FIRST_COMMIT.index - 1);
            if (LAST_COMMIT) {
                return {
                    from: FIRST_COMMIT,
                    to: LAST_COMMIT,
                };
            }
        }
    }
    catch (e) {
        deploy_helpers.showErrorMessage(i18.t('scm.commits.errors.selectingCommitRangeFailed', e));
    }
}
exports.showSCMCommitRangeQuickPick = showSCMCommitRangeQuickPick;
//# sourceMappingURL=scm.js.map