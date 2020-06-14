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
const deploy_scm = require("./scm");
const Enumerable = require("node-enumerable");
const MergeDeep = require('merge-deep');
const Moment = require("moment");
const Path = require("path");
const COMMITS_PER_PAGE = 25;
const IS_WINDOWS = process.platform === 'win32';
/**
 * A git client.
 */
class GitClient {
    /**
     * Initializes a new instance of that class.
     *
     * @param {GitExecutable} executable The data of the executable.
     * @param {string} [cwd] The optional working directory.
     */
    constructor(executable, cwd) {
        this.executable = executable;
        this.cwd = deploy_helpers.toStringSafe(cwd);
        if (deploy_helpers.isEmptyString(this.cwd)) {
            this.cwd = undefined;
        }
    }
    /** @inheritdoc */
    async branches() {
        const ME = this;
        const BRANCHES = [];
        const RESULT = deploy_helpers.toStringSafe(await this.exec(['branch', '-v'])).trim();
        // split lines
        const LINES = RESULT.split("\n");
        LINES.forEach(l => {
            const SEP = l.indexOf(' ', 2);
            const NAME = l.substr(2, SEP - 2).trim();
            BRANCHES.push({
                client: ME,
                commitCount: async function (skip) {
                    skip = parseInt(deploy_helpers.toStringSafe(skip).trim());
                    if (isNaN(skip)) {
                        skip = 0;
                    }
                    if (skip < 1) {
                        skip = 0;
                    }
                    return parseInt(deploy_helpers.toStringSafe(await ME.exec(["rev-list", "--count", "--skip=" + skip, "HEAD"])));
                },
                commits: async function (page, skip) {
                    page = parseInt(deploy_helpers.toStringSafe(page).trim());
                    if (isNaN(page)) {
                        page = 0;
                    }
                    if (page < 1) {
                        page = 1;
                    }
                    skip = parseInt(deploy_helpers.toStringSafe(skip).trim());
                    if (isNaN(skip)) {
                        skip = 0;
                    }
                    if (skip < 1) {
                        skip = 0;
                    }
                    const ITEMS_TO_SKIP = (page - 1) * COMMITS_PER_PAGE + skip;
                    const BRANCH = this;
                    const LOADED_COMMITS = [];
                    const TOTAL_COUNT = await this.commitCount();
                    const COMMITS_RESULT = await ME.exec([
                        'log',
                        '--pretty=%H %aI %s',
                        '--skip=' + ITEMS_TO_SKIP,
                        '-' + COMMITS_PER_PAGE
                    ]);
                    const LINES = COMMITS_RESULT.split("\n").map(l => {
                        return l.trim();
                    }).filter(l => '' !== l);
                    LINES.forEach((l, i) => {
                        const HASH = l.substr(0, 39);
                        const DATE = l.substr(41, 25);
                        const SUBJECT = l.substr(67).trim();
                        LOADED_COMMITS.push({
                            branch: BRANCH,
                            changes: async function () {
                                const COMMIT = this;
                                const LOADED_CHANGES = [];
                                const CHANGES_RESULT = await ME.exec([
                                    'log',
                                    COMMIT.id,
                                    '--pretty=',
                                    '--name-status',
                                    '-1'
                                ]);
                                const LINES = CHANGES_RESULT.split("\n").map(l => {
                                    return l.trim();
                                }).filter(l => '' !== l);
                                LINES.forEach(l => {
                                    let changeType;
                                    let pushNewItems = () => {
                                        LOADED_CHANGES.push({
                                            commit: COMMIT,
                                            file: l.substr(2).trim(),
                                            type: changeType,
                                        });
                                    };
                                    switch (deploy_helpers.normalizeString(l.substr(0, 1))) {
                                        case 'a':
                                            changeType = deploy_scm.FileChangeType.Added;
                                            break;
                                        case 'd':
                                            changeType = deploy_scm.FileChangeType.Deleted;
                                            break;
                                        case 'm':
                                            changeType = deploy_scm.FileChangeType.Modified;
                                            break;
                                        default:
                                            pushNewItems = null; //TODO: implement later
                                            break;
                                    }
                                    if (pushNewItems) {
                                        pushNewItems();
                                    }
                                });
                                return LOADED_CHANGES;
                            },
                            date: deploy_helpers.asUTC(Moment(DATE)),
                            id: HASH,
                            index: TOTAL_COUNT - ITEMS_TO_SKIP - i - 1,
                            subject: SUBJECT,
                        });
                    });
                    return LOADED_COMMITS;
                },
                id: NAME,
            });
        });
        const MAX_BRANCH_LEN = Enumerable.from(BRANCHES)
            .select(b => b.id.length)
            .max();
        if (!deploy_helpers.isSymbol(MAX_BRANCH_LEN)) {
            const START_AT = MAX_BRANCH_LEN + 3;
            BRANCHES.forEach((b, i) => {
                const L = LINES[i];
                b.lastCommit = {
                    id: L.substr(START_AT, 7),
                    subject: L.substr(START_AT + 7).trim(),
                };
            });
        }
        return BRANCHES;
    }
    /** @inheritdoc */
    async changes() {
        const CHANGED_FILES = [];
        const LINES = (await this.exec([
            'status', '-s'
        ])).split("\n").filter(l => {
            return !deploy_helpers.isEmptyString(l);
        });
        for (const L of LINES) {
            const GIT_TYPE = L.substr(0, 3).toLowerCase().trim();
            const GIT_FILE = L.substr(3);
            let changeType;
            let pushNewItems = () => {
                CHANGED_FILES.push({
                    file: GIT_FILE,
                    type: changeType,
                });
            };
            switch (GIT_TYPE) {
                case 'a':
                    changeType = deploy_scm.FileChangeType.Added;
                    break;
                case 'd':
                    changeType = deploy_scm.FileChangeType.Deleted;
                    break;
                case 'm':
                    changeType = deploy_scm.FileChangeType.Modified;
                    break;
                case 'r':
                    pushNewItems = () => {
                        const SEP = GIT_FILE.indexOf(' -> ');
                        if (SEP > -1) {
                            CHANGED_FILES.push({
                                file: GIT_FILE.substr(0, SEP),
                                type: deploy_scm.FileChangeType.Deleted,
                            });
                            CHANGED_FILES.push({
                                file: GIT_FILE.substr(SEP + 4),
                                type: deploy_scm.FileChangeType.Added,
                            });
                        }
                    };
                    break;
                default:
                    pushNewItems = null; //TODO: implement later
                    break;
            }
            if (pushNewItems) {
                pushNewItems();
            }
        }
        return CHANGED_FILES;
    }
    /**
     * Executes the Git client and returns the stdout.
     *
     * @param {any[]} args Arguments for the execution.
     * @param {ChildProcess.ExecFileOptions} [opts] Custom options.
     *
     * @return {Promise<string>} The promise with the standard output.
     */
    async exec(args, opts) {
        return (await this.execFile(args, opts)).stdOut;
    }
    /**
     * Executes the Git client.
     *
     * @param {any[]} args Arguments for the execution.
     * @param {ChildProcess.ExecFileOptions} [opts] Custom options.
     *
     * @return {Promise<deploy_helpers.ExecResult>} The promise with the result.
     */
    async execFile(args, opts) {
        const DEFAULT_OPTS = {
            cwd: this.cwd,
        };
        return await deploy_helpers.execFile(this.executable.path, args, MergeDeep(DEFAULT_OPTS, opts));
    }
    /**
     * Detects the version of the underlying Git client.
     *
     * @return {Promise<string>} The promise with the version.
     */
    async version() {
        return parseVersion(deploy_helpers.toStringSafe(await this.exec(['--version']))).trim();
    }
}
exports.GitClient = GitClient;
async function findExecutable(exe, args) {
    // POSIX can just execute scripts directly, no need for silly goosery
    if (!IS_WINDOWS) {
        return {
            cmd: await runDownPath(exe),
            args: args
        };
    }
    if (!(await deploy_helpers.exists(exe))) {
        // NB: When you write something like `surf-client ... -- surf-build` on Windows,
        // a shell would normally convert that to surf-build.cmd, but since it's passed
        // in as an argument, it doesn't happen
        const POSSIBLE_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1'];
        for (const EXT of POSSIBLE_EXTENSIONS) {
            const FULL_PATH = await runDownPath(`${exe}${EXT}`);
            if (await deploy_helpers.exists(FULL_PATH)) {
                return await findExecutable(FULL_PATH, args);
            }
        }
    }
    if (exe.match(/\.ps1$/i)) { // PowerShell
        const CMD = Path.join(process.env.SYSTEMROOT, 'System32', 'WindowsPowerShell', 'v1.0', 'PowerShell.exe');
        const PS_ARGS = ['-ExecutionPolicy', 'Unrestricted', '-NoLogo', '-NonInteractive', '-File', exe];
        return {
            cmd: CMD,
            args: PS_ARGS.concat(args),
        };
    }
    if (exe.match(/\.(bat|cmd)$/i)) { // Windows batch?
        const CMD = Path.join(process.env.SYSTEMROOT, 'System32', 'cmd.exe');
        const CMD_ARGS = ['/C', exe, ...args];
        return {
            cmd: CMD,
            args: CMD_ARGS,
        };
    }
    if (exe.match(/\.(js)$/i)) { // NodeJS?
        const CMD = process.execPath;
        const NODE_ARGS = [exe];
        return {
            cmd: CMD,
            args: NODE_ARGS.concat(args)
        };
    }
    return {
        cmd: exe,
        args: args
    };
}
async function findGitDarwin() {
    let path = await runCommand('which', ['git']);
    path = path.replace(/^\s+|\s+$/g, '');
    if (path !== '/usr/bin/git') {
        return findSpecificGit(path);
    }
    try {
        await runCommand('xcode-select', ['-p']);
        return findSpecificGit(path);
    }
    catch (ex) {
        if (2 === ex.code) {
            throw new Error('Unable to find git');
        }
        return findSpecificGit(path);
    }
}
async function findGitPath(path) {
    path = deploy_helpers.toStringSafe(path);
    if (deploy_helpers.isEmptyString(path)) {
        path = 'git'; // default
    }
    try {
        return await findSpecificGit(path);
    }
    catch (e) {
    }
    // fallback: platform specific
    try {
        switch (process.platform) {
            case 'darwin':
                return await findGitDarwin();
            case 'win32':
                return await findGitWin32();
        }
    }
    catch (e) {
    }
    return false;
}
async function findSpecificGit(path) {
    const VERSION = await runCommand(path, ['--version']);
    // If needed, let's update our path to avoid the search on every command
    if (deploy_helpers.isEmptyString(path) || path === 'git') {
        path = (await findExecutable(path, ['--version'])).cmd;
    }
    return {
        path,
        version: parseVersion(VERSION.trim()),
    };
}
function findGitWin32() {
    return findSystemGitWin32(process.env['ProgramW6432'])
        .then(null, () => findSystemGitWin32(process.env['ProgramFiles(x86)']))
        .then(null, () => findSystemGitWin32(process.env['ProgramFiles']))
        .then(null, () => findSpecificGit('git'));
}
async function findSystemGitWin32(basePath) {
    if (deploy_helpers.isEmptyString(basePath)) {
        throw new Error('Unable to find git');
    }
    return await findSpecificGit(Path.join(basePath, 'Git', 'cmd', 'git.exe'));
}
function parseVersion(raw) {
    return raw.replace(/^git version /, '');
}
/**
 * Normalizes a git hash.
 *
 * @param {string} hash The input value.
 * @param {TDefault} [defaultValue] The custom default value.
 *
 * @return {string|TDefault} The normalized hash or the default value.
 */
function normalizeGitHash(hash, defaultValue = null) {
    hash = deploy_helpers.normalizeString(hash);
    if (hash.length > 7) {
        hash = hash.substr(0, 7).trim();
    }
    if (hash.length < 1) {
        return defaultValue;
    }
    return hash;
}
exports.normalizeGitHash = normalizeGitHash;
async function runCommand(command, args) {
    return (await deploy_helpers.execFile(command, args)).stdOut;
}
async function runDownPath(exe) {
    // NB: Windows won't search PATH looking for executables in spawn like
    // Posix does
    // Files with any directory path don't get this applied
    if (exe.match(/[\\\/]/)) {
        return exe;
    }
    const TARGET = Path.join('.', exe);
    try {
        if (await deploy_helpers.stat(TARGET)) {
            return TARGET;
        }
    }
    catch (e) { }
    const HAYSTACK = process.env.PATH.split(IS_WINDOWS ? ';' : ':');
    for (const P of HAYSTACK) {
        const NEEDLE = Path.join(P, exe);
        try {
            if (await deploy_helpers.stat(NEEDLE)) {
                return NEEDLE;
            }
        }
        catch (e) { }
    }
    return exe;
}
/**
 * Tries to find the path of the Git executable.
 *
 * @param {string} [path] The optional specific path where to search first.
 *
 * @return {GitExecutable|false} The promise with the executable or (false) if not found.
 */
async function tryFindGitPath(path) {
    let git = await findGitPath(path);
    if (false !== git) {
        git = {
            path: Path.resolve(git.path),
            version: git.version,
        };
    }
    return git;
}
exports.tryFindGitPath = tryFindGitPath;
//# sourceMappingURL=git.js.map