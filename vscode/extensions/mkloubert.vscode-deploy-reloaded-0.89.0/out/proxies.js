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
const deploy_workspaces = require("./workspaces");
const Enumerable = require("node-enumerable");
const i18 = require("./i18");
const Net = require("net");
const vscode = require("vscode");
/**
 * The default port for a TCP proxy.
 */
exports.DEFAULT_TCP_PORT = 30904;
/**
 * Name of an event that is raised, when a connection with a remote has been rejected.
 */
exports.EVENT_REJECTED = 'rejected';
/**
 * Name of an event that is raised, when a proxy has been started.
 */
exports.EVENT_STARTED = 'started';
/**
 * Name of an event that is raised, when a proxy is going to be started.
 */
exports.EVENT_STARTING = 'starting';
/**
 * Name of an event that is raised, when a proxy has been stopped.
 */
exports.EVENT_STOPPED = 'stopped';
/**
 * Name of an event that is raised, when a proxy is going to be stopped.
 */
exports.EVENT_STOPPING = 'stopping';
/**
 * Name of an event that is raised, when a tunnel has been closed.
 */
exports.EVENT_TUNNEL_CLOSED = 'tunnel.closed';
/**
 * Name of an event that is raised, when a tunnel is going to be closed.
 */
exports.EVENT_TUNNEL_CLOSING = 'tunnel.closing';
/**
 * Name of an event that is raised, when a socket of a target has been closed.
 */
exports.EVENT_TUNNEL_TARGET_CLOSED = 'tunnel.target.closed';
/**
 * Name of an event that is raised, when a socket of a target is going to be closed.
 */
exports.EVENT_TUNNEL_TARGET_CLOSING = 'tunnel.target.closing';
/**
 * Name of an event that is raised, when a target socket has raised an error.
 */
exports.EVENT_TUNNEL_TARGET_ERROR = 'tunnel.target.error';
/**
 * Name of an event that is raised, when a target socket has ben opened.
 */
exports.EVENT_TUNNEL_TARGET_OPENED = 'tunnel.target.opened';
/**
 * Name of an event that is raised, when a target socket is going to be opened.
 */
exports.EVENT_TUNNEL_TARGET_OPENING = 'tunnel.target.opening';
let nextTcpProxyId = Number.MIN_SAFE_INTEGER;
const TCP_PROXIES = {};
/**
 * A TCP propxy.
 */
class TcpProxy extends deploy_helpers.DisposableBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {TcpProxyOptions} [opts] Custom, additional options.
     */
    constructor(opts) {
        super();
        this.opts = opts;
        this._destinations = [];
        this._filters = [];
        this._NAME_AND_DESC_RESOLVERS = {};
        this.id = nextTcpProxyId++;
        this.options = opts;
        if (!this.options) {
            this.options = {};
        }
    }
    /**
     * Adds a destination.
     *
     * @param {string} addr The address / hostname of the destination.
     * @param {number} port The TCP port of the destination.
     *
     * @return {TcpProxyTargetContext} The context of the added destination.
     */
    addDestination(addr, port) {
        const ME = this;
        const NEW_ITEM = {
            addr: addr,
            port: port,
        };
        ME._destinations.push(NEW_ITEM);
        let isDisposed = false;
        return {
            dispose: () => {
                if (ME.isInFinalizeState || isDisposed) {
                    return;
                }
                ME._destinations = ME._destinations.filter(t => {
                    return t !== NEW_ITEM;
                });
                isDisposed = true;
            },
            proxy: ME,
        };
    }
    /**
     * Adds a filter.
     *
     * @param {TcpProxyRemoteFilter} filter The filter.
     *
     * @return {TcpProxyRemoteFilterContext} The filter context.
     */
    addFilter(filter) {
        const ME = this;
        ME._filters
            .push(filter);
        return {
            dispose: () => {
                ME._filters = ME._filters.filter(f => {
                    return f !== filter;
                });
            },
            proxy: ME,
        };
    }
    /**
     * Returns the name and description of that proxy for a workspace.
     *
     * @param {deploy_workspaces.Workspace} workspace The workspace.
     *
     * @return {TcpProxyNameAndDescription} The name and description.
     */
    getNameAndDescriptionFor(workspace) {
        let nameAndDesc;
        const KEY = getNameAndDescriptionKey(workspace);
        const RESOLVER = this._NAME_AND_DESC_RESOLVERS[KEY];
        if (RESOLVER) {
            nameAndDesc = RESOLVER();
        }
        nameAndDesc = nameAndDesc || {};
        return {
            name: deploy_helpers.isEmptyString(nameAndDesc.name) ? getTcpProxyName(this) : nameAndDesc.name,
            description: nameAndDesc.description,
        };
    }
    async cleanupServer() {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                const OLD_SERVER = ME._server;
                if (OLD_SERVER) {
                    OLD_SERVER.close(() => {
                        ME._server = null;
                        COMPLETED(null, true);
                    });
                }
                else {
                    COMPLETED(null, false);
                }
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    isRemoteAllowed(addr, port) {
        const FILTERS = this._filters.map(f => f);
        if (FILTERS.length > 0) {
            return Enumerable.from(FILTERS)
                .any(f => f(addr, port));
        }
        return true;
    }
    /**
     * Returns if the proxy is currently running or not.
     */
    get isRunning() {
        return !_.isNil(this._server);
    }
    /** @inheritdoc */
    onDispose() {
        const ME = this;
        ME.cleanupServer().then(() => {
            ME._destinations = null;
        }, (err) => {
            deploy_log.CONSOLE
                .trace(err, 'proxies.TcpProxy.onDispose(1)');
        });
    }
    /**
     * Gets the port the proxy listens on.
     */
    get port() {
        let p = parseInt(deploy_helpers.toStringSafe(this.options.port).trim());
        if (isNaN(p)) {
            p = exports.DEFAULT_TCP_PORT;
        }
        return p;
    }
    /**
     * Set the name and description resolver for a workspace.
     *
     * @param {deploy_workspaces.Workspace} workspace The workspace.
     * @param {TcpProxyNameAndDescriptionResolver} resolver The resolver.
     *
     * @return {TcpProxyNameAndDescriptionContext} The resolver context.
     */
    setNameAndDescriptionResolver(workspace, resolver) {
        const ME = this;
        const KEY = getNameAndDescriptionKey(workspace);
        ME._NAME_AND_DESC_RESOLVERS[KEY] = resolver;
        return {
            dispose: () => {
                delete this._NAME_AND_DESC_RESOLVERS[KEY];
            },
            proxy: ME,
            workspace: workspace,
        };
    }
    /**
     * Starts the proxy.
     *
     * @return {Promise<boolean>} The promise that indicates if operation was successful or not.
     */
    async start() {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            if (ME._server) {
                COMPLETED(null, false);
                return;
            }
            try {
                ME.emit(exports.EVENT_STARTING);
                const PORT = ME.port;
                const NEW_SERVER = Net.createServer(function (ls) {
                    ME.startTunnel(ls, PORT).then(() => {
                        ME.emit('tunnel.opened', ls, PORT);
                    }, (err) => {
                        ME.emit('tunnel.error', err, ls, PORT);
                    });
                });
                NEW_SERVER.once('close', function () {
                    ME._server = null;
                });
                NEW_SERVER.once('error', function (err) {
                    COMPLETED(err);
                });
                NEW_SERVER.listen(PORT, function (err) {
                    if (!err) {
                        ME._server = NEW_SERVER;
                        ME.emit(exports.EVENT_STARTED);
                    }
                    COMPLETED(err);
                });
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    startTunnel(localSocket, port) {
        const ME = this;
        return new Promise((resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            let allTargetSockets = [];
            let tunnelAlreadyClosed = false;
            let closeTargetSocket;
            let closeTunnel;
            let closeTunnelIfNeeded;
            let closeAllTargetSockets;
            closeTargetSocket = (err, targetSocket) => {
                if (!targetSocket) {
                    return;
                }
                ME.emit(exports.EVENT_TUNNEL_TARGET_CLOSING, err, targetSocket, allTargetSockets, localSocket);
                try {
                    targetSocket.removeAllListeners();
                }
                catch (e) { }
                try {
                    targetSocket.destroy();
                }
                catch (e) { }
                allTargetSockets = allTargetSockets.filter(ts => {
                    return ts !== targetSocket;
                });
                ME.emit(exports.EVENT_TUNNEL_TARGET_CLOSED, err, targetSocket, allTargetSockets, localSocket);
                closeTunnelIfNeeded(err);
            };
            closeTunnel = (err) => {
                if (tunnelAlreadyClosed) {
                    return;
                }
                tunnelAlreadyClosed = true;
                ME.emit(exports.EVENT_TUNNEL_CLOSING, err, localSocket, port, allTargetSockets);
                try {
                    localSocket.removeAllListeners();
                }
                catch (e) { }
                try {
                    localSocket.destroy();
                }
                catch (e) { }
                closeAllTargetSockets(err);
                ME.emit(exports.EVENT_TUNNEL_CLOSED, err, localSocket, port);
            };
            closeTunnelIfNeeded = (err) => {
                if (allTargetSockets.length < 1 || ME.isInFinalizeState) {
                    closeTunnel(err);
                }
            };
            closeAllTargetSockets = (err) => {
                try {
                    Enumerable.shiftFrom(allTargetSockets).forAll(ts => {
                        closeTargetSocket(err, ts);
                    });
                }
                catch (e) { }
            };
            localSocket.once('error', function (err) {
                closeTunnel(err);
            });
            localSocket.once('close', function () {
                closeAllTargetSockets(null);
            });
            if (!ME.isRemoteAllowed(localSocket.remoteAddress, localSocket.remotePort)) {
                closeTunnel(null);
                ME.emit(exports.EVENT_REJECTED, localSocket, port);
                return;
            }
            try {
                const TARGETS = ME._destinations.map(t => t);
                if (TARGETS.length > 0) {
                    deploy_helpers.asArray(ME._destinations).forEach(d => {
                        let ts;
                        try {
                            let targetAddr = deploy_helpers.normalizeString(d.addr);
                            if ('' === targetAddr) {
                                targetAddr = deploy_contracts.DEFAULT_HOST;
                            }
                            let targetPort = parseInt(deploy_helpers.toStringSafe(d.port).trim());
                            if (isNaN(targetPort)) {
                                targetPort = port;
                            }
                            ts = new Net.Socket();
                            const EMIT_SOCKET_ERROR = (err) => {
                                ME.emit(exports.EVENT_TUNNEL_TARGET_ERROR, err, targetAddr, targetPort, localSocket, port, ts);
                                closeTargetSocket(err, ts);
                            };
                            ts.once('error', function (err) {
                                EMIT_SOCKET_ERROR(err);
                            });
                            ts.once('close', function () {
                                closeTargetSocket(null, ts);
                            });
                            ME.emit(exports.EVENT_TUNNEL_TARGET_OPENING, ts, localSocket, targetAddr, targetPort, port);
                            ts.connect(targetPort, targetAddr, function () {
                                try {
                                    // duplex pipe
                                    localSocket.pipe(ts)
                                        .pipe(localSocket);
                                    allTargetSockets.push(ts);
                                    ME.emit(exports.EVENT_TUNNEL_TARGET_OPENED, ts, localSocket, targetAddr, targetPort, port);
                                }
                                catch (e) {
                                    EMIT_SOCKET_ERROR(e);
                                }
                            });
                        }
                        catch (e) {
                            closeTargetSocket(e, ts);
                        }
                    });
                }
                else {
                    closeTunnel(null);
                }
                COMPLETED(null);
            }
            catch (e) {
                closeTunnel(e);
                COMPLETED(e);
            }
        });
    }
    /**
     * Stops the proxy.
     *
     * @return {Promise<boolean>} The promise that indicates if operation was successful or not.
     */
    async stop() {
        const ME = this;
        return new Promise(async (resolve, reject) => {
            const COMPLETED = deploy_helpers.createCompletedAction(resolve, reject);
            try {
                ME.emit(exports.EVENT_STOPPING);
                COMPLETED(null, await ME.cleanupServer());
                ME.emit(exports.EVENT_STOPPED);
            }
            catch (e) {
                COMPLETED(e);
            }
        });
    }
    /**
     * Toggles the "running state" of that proxy.
     *
     * @return {Promise<boolean>} The promise that indicates if operation was successful or not.
     */
    async toggle() {
        if (this.isRunning) {
            return await this.stop();
        }
        return await this.start();
    }
}
exports.TcpProxy = TcpProxy;
function getNameAndDescriptionKey(workspace) {
    return deploy_helpers.toStringSafe(workspace.id);
}
/**
 * Returns a global TCP proxy by port.
 *
 * @param {number} port The port.
 *
 * @return {TcpProxy} The proxy.
 */
function getTcpProxy(port) {
    if (port < 0 || port > 65535) {
        throw new Error(`Invalid port '${port}'!`);
    }
    let proxy = TCP_PROXIES[port];
    if (_.isNil(proxy)) {
        TCP_PROXIES[port] = proxy = new TcpProxy({
            port: port,
        });
        proxy.on('error', function (err) {
            // prevent unhandled exceptions
        });
    }
    return proxy;
}
exports.getTcpProxy = getTcpProxy;
/**
 * Returns the (display) name of a TCP proxy.
 *
 * @param {TcpProxy} proxy The proxy.
 *
 * @return {string} The name.
 */
function getTcpProxyName(proxy) {
    if (_.isNil(proxy)) {
        return proxy;
    }
    return `Proxy @ ${proxy.port}`;
}
exports.getTcpProxyName = getTcpProxyName;
/**
 * Registers a TCP proxy for logging.
 *
 * @param {TcpProxy} proxy The proxy.
 * @param {Function} loggerProvider The function that provides the base logger.
 *
 * @return {TcpProxyLoggingContext} The logging context.
 */
function registerLoggingForTcpProxy(proxy, loggerProvider) {
    if (!proxy) {
        return proxy;
    }
    const LOGGER = new deploy_log.ActionLogger();
    LOGGER.addAction((ctx) => {
        let baseLogger;
        if (loggerProvider) {
            baseLogger = loggerProvider();
        }
        if (baseLogger) {
            baseLogger.log(ctx.type, ctx.message, `[tcp.proxy(${deploy_helpers.toStringSafe(proxy.id)})]::[${deploy_helpers.toStringSafe(ctx.tag)}]`);
        }
    });
    const EXEC_SAFE = (action, ...params) => {
        try {
            return action.apply(null, params);
        }
        catch (e) { }
    };
    const LISTENERS_TO_REMOVE = [];
    const ADD_EVENT_LISTENER = (ev, listener) => {
        if (listener) {
            LISTENERS_TO_REMOVE.push({
                ev: ev,
                listener: listener,
            });
            proxy.on(ev, listener);
        }
        return listener;
    };
    const CTX = {
        dispose: () => {
            Enumerable.popFrom(LISTENERS_TO_REMOVE).forAll(l => {
                proxy.removeListener(l.ev, l.listener);
            });
        },
        proxy: proxy,
    };
    try {
        ADD_EVENT_LISTENER('error', function (err) {
            EXEC_SAFE(() => {
                LOGGER.trace(`Proxy error: '${deploy_helpers.toStringSafe(err)}'`, 'general');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_REJECTED, function (localSocket, port) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Connection '${deploy_helpers.toStringSafe(localSocket.localAddress)}:${deploy_helpers.toStringSafe(localSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(localSocket.remoteAddress)}:${deploy_helpers.toStringSafe(localSocket.remotePort)}' rejected'`, 'remote');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_TUNNEL_CLOSED, function (err, localSocket, port) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Tunnel '${deploy_helpers.toStringSafe(localSocket.localAddress)}:${deploy_helpers.toStringSafe(localSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(localSocket.remoteAddress)}:${deploy_helpers.toStringSafe(localSocket.remotePort)}' closed: '${deploy_helpers.toStringSafe(err)}'`, 'tunnel');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_TUNNEL_CLOSING, function (err, localSocket, port, allTargetSockets) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Tunnel '${deploy_helpers.toStringSafe(localSocket.localAddress)}:${deploy_helpers.toStringSafe(localSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(localSocket.remoteAddress)}:${deploy_helpers.toStringSafe(localSocket.remotePort)}' is closing: '${deploy_helpers.toStringSafe(err)}'`, 'tunnel');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_TUNNEL_TARGET_CLOSED, function (err, targetSocket, allTargetSockets, localSocket) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Tunnel target '${deploy_helpers.toStringSafe(targetSocket.localAddress)}:${deploy_helpers.toStringSafe(targetSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(targetSocket.remoteAddress)}:${deploy_helpers.toStringSafe(targetSocket.remotePort)}' closed: '${deploy_helpers.toStringSafe(err)}'`, 'tunnel.target');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_TUNNEL_TARGET_CLOSING, function (err, targetSocket, allTargetSockets, localSocket) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Tunnel target '${deploy_helpers.toStringSafe(targetSocket.localAddress)}:${deploy_helpers.toStringSafe(targetSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(targetSocket.remoteAddress)}:${deploy_helpers.toStringSafe(targetSocket.remotePort)}' is closing: '${deploy_helpers.toStringSafe(err)}'`, 'tunnel.target');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_TUNNEL_TARGET_ERROR, function (err, targetAddr, targetPort, localSocket, port, ts) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Tunnel target '${deploy_helpers.toStringSafe(localSocket.localAddress)}:${deploy_helpers.toStringSafe(localSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(targetAddr)}:${deploy_helpers.toStringSafe(targetPort)}' error: '${deploy_helpers.toStringSafe(err)}'`, 'tunnel.target');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_TUNNEL_TARGET_OPENED, function (ts, localSocket, targetAddr, targetPort, port) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Tunnel target '${deploy_helpers.toStringSafe(localSocket.localAddress)}:${deploy_helpers.toStringSafe(localSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(targetAddr)}:${deploy_helpers.toStringSafe(targetPort)}' opened`, 'tunnel.target');
            });
        });
        ADD_EVENT_LISTENER(exports.EVENT_TUNNEL_TARGET_OPENING, function (ts, localSocket, targetAddr, targetPort, port) {
            EXEC_SAFE(() => {
                LOGGER.debug(`Tunnel target '${deploy_helpers.toStringSafe(localSocket.localAddress)}:${deploy_helpers.toStringSafe(localSocket.localPort)}' <==> '${deploy_helpers.toStringSafe(targetAddr)}:${deploy_helpers.toStringSafe(targetPort)}' is opening ...`, 'tunnel.target');
            });
        });
    }
    catch (e) {
        deploy_helpers.tryDispose(CTX);
        throw e;
    }
    return CTX;
}
exports.registerLoggingForTcpProxy = registerLoggingForTcpProxy;
/**
 * Shows quick pick for TCP proxies.
 */
async function showTcpProxyQuickPick() {
    const ALL_WORKSPACES = deploy_workspaces.getAllWorkspaces();
    if (ALL_WORKSPACES.length < 1) {
        deploy_helpers.showWarningMessage(i18.t('workspaces.noneFound'));
        return;
    }
    const PROXIES = Enumerable.from(ALL_WORKSPACES).orderBy(ws => {
        return ws.isActive ? 0 : 1;
    }).thenBy(ws => {
        return deploy_helpers.normalizeString(ws.id);
    }).selectMany(ws => {
        return ws.getTcpProxies().map(p => {
            return {
                proxy: p,
                workspace: ws,
            };
        });
    }).toArray();
    const PROXY_QUICK_PICKS = PROXIES.map(x => {
        const NAME_AND_DESC = x.proxy.getNameAndDescriptionFor(x.workspace);
        return {
            action: async () => {
                await showQuickPickForTcpProxy(x.proxy, x.workspace);
            },
            label: deploy_helpers.toStringSafe(NAME_AND_DESC.name),
            description: deploy_helpers.toStringSafe(NAME_AND_DESC.description),
            detail: x.workspace.rootPath,
        };
    });
    if (PROXY_QUICK_PICKS.length < 1) {
        deploy_helpers.showWarningMessage(i18.t('proxies.noneFound'));
        return;
    }
    const SELECTED_PROXY_QUICK_PICK = await vscode.window.showQuickPick(PROXY_QUICK_PICKS, {
        placeHolder: i18.t('proxies.selectProxy'),
    });
    if (SELECTED_PROXY_QUICK_PICK) {
        await Promise.resolve(SELECTED_PROXY_QUICK_PICK.action());
    }
}
exports.showTcpProxyQuickPick = showTcpProxyQuickPick;
async function showQuickPickForTcpProxy(proxy, workspace) {
    const NAME_AND_DESC = proxy.getNameAndDescriptionFor(workspace);
    const QUICK_PICKS = [];
    if (proxy.isRunning) {
        QUICK_PICKS.push({
            action: async () => {
                await proxy.stop();
            },
            label: '$(triangle-right)  ' + workspace.t('proxies.stopProxy'),
            description: "",
            detail: deploy_helpers.toStringSafe(NAME_AND_DESC.name),
        });
    }
    else {
        QUICK_PICKS.push({
            action: async () => {
                await proxy.start();
            },
            label: '$(primitive-square)  ' + workspace.t('proxies.startProxy'),
            description: "",
            detail: deploy_helpers.toStringSafe(NAME_AND_DESC.name),
        });
    }
    const SELECTED_QUICK_PICK = await vscode.window.showQuickPick(QUICK_PICKS);
    if (SELECTED_QUICK_PICK) {
        await Promise.resolve(SELECTED_QUICK_PICK.action());
    }
}
/**
 * Disposes all global proxies.
 */
exports.PROXY_DISPOSER = {
    /** @inheritdoc */
    dispose: () => {
        for (const PORT of Object.keys(TCP_PROXIES)) {
            if (deploy_helpers.tryDispose(TCP_PROXIES[PORT])) {
                delete TCP_PROXIES[PORT];
            }
        }
    }
};
//# sourceMappingURL=proxies.js.map