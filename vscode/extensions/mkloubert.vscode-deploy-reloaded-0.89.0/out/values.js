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
const deploy_code = require("./code");
const deploy_helpers = require("./helpers");
const deploy_log = require("./log");
const Enumerable = require("node-enumerable");
const FS = require("fs");
const i18 = require("./i18");
const OS = require("os");
const Path = require("path");
const SanitizeFilename = require('sanitize-filename');
const NOT_CACHED_YET = Symbol('NOT_CACHED_YET');
/**
 * A basic value.
 */
class ValueBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {TItem} item The underlying item.
     * @param {string} [name] The additional name of the value.
     */
    constructor(item, name) {
        this.item = item;
        this._NAME = normalizeValueName(name);
    }
    /** @inheritdoc */
    get name() {
        return this._NAME;
    }
    /**
     * Gets the list of "other" values.
     */
    get others() {
        let provider = this.othersProvider;
        if (!provider) {
            provider = () => [];
        }
        return deploy_helpers.asArray(provider());
    }
}
exports.ValueBase = ValueBase;
/**
 * A code based value.
 */
class CodeValue extends ValueBase {
    /** @inheritdoc */
    get value() {
        const CTX = {
            code: this.item.code,
            context: {
                v: this,
            },
            values: this.others,
        };
        return deploy_code.exec(CTX);
    }
}
exports.CodeValue = CodeValue;
/**
 * A value of an environment variable.
 */
class EnvVarValue extends ValueBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {string} name The name of the environment variable.
     * @param {EnvVarValueItem} item The underlying item.
     */
    constructor(name, item) {
        super(item || {}, name);
    }
    /** @inheritdoc */
    get name() {
        if (!deploy_helpers.isEmptyString(this.item.alias)) {
            return deploy_helpers.toStringSafe(this.item.alias);
        }
        return super.name;
    }
    /** @inheritdoc */
    get value() {
        const ENV = process.env;
        if (ENV) {
            return process.env[super.name];
        }
    }
}
exports.EnvVarValue = EnvVarValue;
/**
 * A value based on a local file.
 */
class FileValue extends ValueBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {FileValueItem} item The underlying item.
     * @param {string} [name] The additional name of the value.
     * @param {DirectoryScopeProvider} [scopes] A optional function that provides one or more directories for mapping relative paths.
     */
    constructor(item, name, _SCOPE_PROVIDER) {
        super(item, name);
        this._SCOPE_PROVIDER = _SCOPE_PROVIDER;
        if (!this._SCOPE_PROVIDER) {
            this._SCOPE_PROVIDER = () => [];
        }
    }
    /**
     * Gets the full path of the underlying or (false) if it does not exist.
     */
    get file() {
        let filePath = deploy_helpers.toStringSafe(this.item.file);
        if (deploy_helpers.isEmptyString(filePath)) {
            let fn = deploy_helpers.toStringSafe(this.name).trim();
            if ('' === fn) {
                fn = 'value';
            }
            fn = SanitizeFilename(fn);
            filePath = `./${fn}`;
        }
        if (Path.isAbsolute(filePath)) {
            if (FS.existsSync(filePath)) {
                if (FS.lstatSync(filePath).isFile()) {
                    return Path.resolve(filePath); // exists         
                }
            }
        }
        else {
            // try to find existing full path
            for (const S of this.scopes) {
                const FULL_PATH = Path.join(S, filePath);
                if (FS.existsSync(FULL_PATH)) {
                    if (FS.lstatSync(FULL_PATH).isFile()) {
                        return Path.resolve(FULL_PATH); // found              
                    }
                }
            }
        }
        return false;
    }
    /**
     * Gets the list of directory scopes.
     */
    get scopes() {
        let listOfScopes = deploy_helpers.asArray(this._SCOPE_PROVIDER());
        listOfScopes = Enumerable.from(listOfScopes).select(s => {
            return deploy_helpers.toStringSafe(s);
        }).where(s => {
            return !deploy_helpers.isEmptyString(s);
        }).select(s => {
            if (!Path.isAbsolute(s)) {
                s = Path.join(process.cwd(), s);
            }
            return s;
        }).toArray();
        if (listOfScopes.length < 1) {
            listOfScopes.push(deploy_helpers.getExtensionDirInHome());
            listOfScopes.push(process.cwd());
        }
        return listOfScopes.map(s => {
            return Path.resolve(s);
        });
    }
    /** @inheritdoc */
    get value() {
        const FILE = this.file;
        if (false === FILE) {
            throw new Error(i18.t('fileNotFound', this.item.file));
        }
        let val = fromBuffer(FS.readFileSync(FILE), this.item.format, this.item.encoding, this.others);
        return val;
    }
}
exports.FileValue = FileValue;
/**
 * A value based on a function.
 */
class FunctionValue {
    /**
     * Initializes a new instance of that class.
     *
     * @param {Function} func The function that provides the value.
     * @param {string} [name] The optional name.
     * @param {any} [thisArgs] The underlying object / value for the function.
     */
    constructor(func, name, thisArgs) {
        this.func = func;
        this._NAME = normalizeValueName(name);
        this.thisArgs = arguments.length < 3 ? this : thisArgs;
    }
    /** @inheritdoc */
    get name() {
        return this._NAME;
    }
    /** @inheritdoc */
    get value() {
        if (this.func) {
            return this.func
                .apply(this.thisArgs, []);
        }
    }
}
exports.FunctionValue = FunctionValue;
/**
 * A static value.
 */
class StaticValue extends ValueBase {
    /** @inheritdoc */
    get value() {
        return this.item.value;
    }
}
exports.StaticValue = StaticValue;
class WrappedBaseValue {
    constructor(baseValue) {
        this.baseValue = baseValue;
        this._cachedValue = NOT_CACHED_YET;
    }
    get cache() {
        return deploy_helpers.toBooleanSafe(this.item.cache, true);
    }
    get isCached() {
        return this._cachedValue !== NOT_CACHED_YET;
    }
    get item() {
        return this.baseValue.item;
    }
    get name() {
        return this.baseValue.name;
    }
    reset() {
        this._cachedValue = NOT_CACHED_YET;
        return this;
    }
    get value() {
        if (this.cache) {
            if (this.isCached) {
                return this._cachedValue;
            }
        }
        let valueToReturn = this.baseValue.value;
        if (this.cache) {
            this._cachedValue = valueToReturn;
        }
        return valueToReturn;
    }
}
/**
 * Applies values to an object.
 *
 * @param {TObj} obj The object to apply the values to.
 * @param {Function} valueProvider The function that provides the values to apply to string based propertis.
 *
 * @return {TObj} The new object.
 */
function applyValuesTo(obj, valueProvider) {
    if (!valueProvider) {
        valueProvider = () => [];
    }
    const DO_NOT_APPLY_SELF = Symbol('DO_NOT_APPLY_SELF');
    const SELF_PROP = 'applyValuesTo';
    if (obj) {
        const NEW_OBJ = {};
        for (const P in obj) {
            NEW_OBJ[P] = obj[P];
        }
        const APPLY_TO = obj[SELF_PROP];
        let selfValue = DO_NOT_APPLY_SELF;
        const MAKE_PLACEHOLDER_PROPERTY = (prop, val) => {
            delete NEW_OBJ[prop];
            Object.defineProperty(NEW_OBJ, prop, {
                enumerable: true,
                get: () => {
                    let resultValue = val;
                    if (deploy_helpers.isString(resultValue)) {
                        // handle as template
                        // with placeholders
                        resultValue = replaceWithValues(valueProvider(), resultValue);
                    }
                    return resultValue;
                },
                set: (newValue) => {
                    val = newValue;
                }
            });
        };
        if (APPLY_TO) {
            for (const P in APPLY_TO) {
                const VALUE = APPLY_TO[P];
                if (SELF_PROP === P) {
                    selfValue = VALUE;
                }
                else {
                    MAKE_PLACEHOLDER_PROPERTY(P, VALUE);
                }
            }
        }
        if (selfValue !== DO_NOT_APPLY_SELF) {
            MAKE_PLACEHOLDER_PROPERTY(SELF_PROP, selfValue);
        }
        obj = NEW_OBJ;
    }
    return obj;
}
exports.applyValuesTo = applyValuesTo;
function fromBuffer(buff, format, enc, values) {
    format = deploy_helpers.normalizeString(format);
    enc = deploy_helpers.normalizeString(enc);
    if ('' === enc) {
        enc = 'utf8';
    }
    if (!buff) {
        return buff;
    }
    switch (format) {
        case '':
        case 'str':
        case 'string':
            return buff.toString(enc);
        case 'bin':
        case 'binary':
        case 'blob':
        case 'buffer':
            return buff;
        case 'b64':
        case 'base64':
            return buff.toString('base64');
        case 'json':
            return JSON.parse(buff.toString(enc));
        case 'template':
        case 'tpl':
            return replaceWithValues(values, buff.toString(enc));
        default:
            throw new Error(i18.t('values.errors.targetFormatNotSupported', format));
    }
}
/**
 * Returns a list of predefined values.
 *
 * @return {Value[]} The list of values.
 */
function getPredefinedValues() {
    const PREDEFINED_VALUES = [];
    // ${cwd}
    PREDEFINED_VALUES.push(new FunctionValue(() => {
        return process.cwd();
    }, 'cwd'));
    // ${EOL}
    PREDEFINED_VALUES.push(new FunctionValue(() => {
        return OS.EOL;
    }, 'EOL'));
    // ${extensionDir}
    PREDEFINED_VALUES.push(new FunctionValue(() => {
        return deploy_helpers.getExtensionDirInHome();
    }, 'extensionDir'));
    // ${homeDir}
    PREDEFINED_VALUES.push(new FunctionValue(() => {
        return OS.homedir();
    }, 'homeDir'));
    // ${hostName}
    PREDEFINED_VALUES.push(new FunctionValue(() => {
        return OS.hostname();
    }, 'hostName'));
    // ${tempDir}
    PREDEFINED_VALUES.push(new FunctionValue(() => {
        return OS.tmpdir();
    }, 'tempDir'));
    // ${userName}
    PREDEFINED_VALUES.push(new FunctionValue(() => {
        return OS.userInfo().username;
    }, 'userName'));
    return PREDEFINED_VALUES;
}
exports.getPredefinedValues = getPredefinedValues;
/**
 * Returns value instances of the current list of environment variables.
 *
 * @return {Value[]} Placeholders of process's environment variables.
 */
function getEnvVars() {
    const ENV_VARS = [];
    const ENV = process.env;
    if (ENV) {
        for (const N in ENV) {
            ENV_VARS.push(new EnvVarValue(N));
        }
    }
    return ENV_VARS;
}
exports.getEnvVars = getEnvVars;
/**
 * Loads values from value item settings.
 *
 * @param {WithValueItems} items The item settings.
 * @param {Function} [conditialFilter]
 *
 * @return {Value[]} The loaded values.
 */
function loadFromItems(items, opts) {
    if (!opts) {
        opts = {};
    }
    let conditialFilter = opts.conditialFilter;
    let directoryScopeProvider = opts.directoryScopeProvider;
    let prefixValuesProvider = opts.prefixValuesProvider;
    if (!prefixValuesProvider) {
        prefixValuesProvider = () => [];
    }
    const VALUES = [];
    const CREATE_OTHERS_PROVIDER = (thisValue) => {
        return () => deploy_helpers.asArray(prefixValuesProvider()).concat(VALUES).filter(v => v !== thisValue);
    };
    const APPEND_VALUE = (newValue) => {
        if (!newValue) {
            return;
        }
        newValue.othersProvider = CREATE_OTHERS_PROVIDER(newValue);
        VALUES.push(new WrappedBaseValue(newValue));
    };
    if (!conditialFilter) {
        conditialFilter = (i, o) => {
            let doesMatch;
            try {
                doesMatch = Enumerable.from(deploy_helpers.asArray(i.if)).all((c) => {
                    let res;
                    const IF_CODE = deploy_helpers.toStringSafe(c);
                    if (!deploy_helpers.isEmptyString(IF_CODE)) {
                        res = deploy_code.exec({
                            code: IF_CODE,
                            context: {
                                i: i,
                            },
                            values: [].concat(getPredefinedValues())
                                .concat(getEnvVars())
                                .concat(o),
                        });
                    }
                    return deploy_helpers.toBooleanSafe(res, true);
                });
            }
            catch (e) {
                deploy_log.CONSOLE
                    .trace('values.loadFromItems().conditialFilter()');
                doesMatch = false;
            }
            return doesMatch;
        };
    }
    if (!directoryScopeProvider) {
        directoryScopeProvider = () => [];
    }
    if (items && items.values) {
        for (const NAME in items.values) {
            const VI = items.values[NAME];
            let newValue;
            if (deploy_helpers.isObject(VI)) {
                if (deploy_helpers.filterPlatformItems(VI).length < 1) {
                    continue; // not for platform
                }
                if (!deploy_helpers.toBooleanSafe(conditialFilter(VI, VALUES), true)) {
                    continue; // condition failed
                }
                const TYPE = deploy_helpers.normalizeString(VI.type);
                switch (TYPE) {
                    case '':
                    case 'static':
                        newValue = new StaticValue(VI, NAME);
                        break;
                    case 'code':
                    case 'ecmascript':
                    case 'javascript':
                    case 'js':
                        newValue = new CodeValue(VI, NAME);
                        break;
                    case 'env':
                    case 'environment':
                        newValue = new EnvVarValue(NAME, VI);
                        break;
                    case 'file':
                        newValue = new FileValue(VI, NAME, directoryScopeProvider);
                        break;
                    default:
                        deploy_log.CONSOLE
                            .warn(i18.t('values.typeNotSupported', TYPE), 'values.loadFromItems().ValueItem');
                        break;
                }
            }
            else {
                const STATIC_VALUE_ITEM = {
                    type: 'static',
                    value: VI
                };
                newValue = new StaticValue(STATIC_VALUE_ITEM, NAME);
            }
            APPEND_VALUE(newValue);
        }
    }
    return VALUES;
}
exports.loadFromItems = loadFromItems;
function normalizeValueList(values) {
    const STORAGE = {};
    // last wins
    for (const V of deploy_helpers.asArray(values)) {
        const VALUE_NAME = deploy_helpers.normalizeString(V.name);
        STORAGE[VALUE_NAME] = V;
    }
    return STORAGE;
}
function normalizeValueName(name) {
    name = deploy_helpers.toStringSafe(name).trim();
    if ('' === name) {
        name = undefined;
    }
    return name;
}
/**
 * Handles a value as string and replaces placeholders.
 *
 * @param {Value|Value[]} values The "placeholders".
 * @param {any} val The value to parse.
 * @param {boolean} [throwOnError] Throw on error or not.
 *
 * @return {string} The parsed value.
 */
function replaceWithValues(values, val, throwOnError = false) {
    throwOnError = deploy_helpers.toBooleanSafe(throwOnError);
    if (!deploy_helpers.isNullOrUndefined(val)) {
        let str = deploy_helpers.toStringSafe(val);
        const STORAGE = normalizeValueList(values);
        for (const VALUE_NAME in STORAGE) {
            try {
                const V = STORAGE[VALUE_NAME];
                // ${VALUE_NAME}
                str = str.replace(/(\$)(\{)([^\}]*)(\})/gm, (match, varIdentifier, openBracket, varName, closedBracked) => {
                    let newValue = match;
                    if (VALUE_NAME === deploy_helpers.normalizeString(varName)) {
                        try {
                            newValue = deploy_helpers.toStringSafe(V.value);
                        }
                        catch (e) {
                            deploy_log.CONSOLE
                                .trace(e, 'values.replaceWithValues(2)');
                        }
                    }
                    return newValue;
                });
            }
            catch (e) {
                deploy_log.CONSOLE
                    .trace(e, 'values.replaceWithValues(1)');
                if (throwOnError) {
                    throw e;
                }
            }
        }
        return str;
    }
}
exports.replaceWithValues = replaceWithValues;
/**
 * Converts a list of values to a storage.
 *
 * @param {Value|Value[]} values One or more values.
 *
 * @return {ValueStorage} The new storage.
 */
function toValueStorage(values) {
    const STORAGE = {};
    const APPEND_VALUE = (v) => {
        // STORAGE[NAME] => v.name
        Object.defineProperty(STORAGE, deploy_helpers.normalizeString(v.name), {
            enumerable: true,
            configurable: true,
            get: () => {
                return v.value;
            }
        });
    };
    deploy_helpers.asArray(values).forEach(v => {
        APPEND_VALUE(v);
    });
    return STORAGE;
}
exports.toValueStorage = toValueStorage;
//# sourceMappingURL=values.js.map