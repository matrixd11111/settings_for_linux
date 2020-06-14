function MSAppData() {
    const self = this;
    const _native_api = ChromeStorageAPI;
    const _version = 1;

    async function is_format_actual() {
        return (await _native_api.get('_version') || 0) >= _version;
    }

    var _is_ready = false;
    let _buffer = {};

    async function _initialize() {
        _assign_event_handlers();

        if (await is_format_actual()) {
            // You're good to go :)
        } else {
            console.log('Updating settings... Wait a bit :)');
            const migration_service = new MSAppDataMigrationHelper();
            var old_data = migration_service.get_converted_data(_version, true);
            await self.set(old_data).then(() => ChromeRuntimeAPI.extension_reload());
        }

        console.log('All is fine, move on!');
        _buffer = await self.get_all();
        _is_ready = true;
        return self;
    }

    function _assign_event_handlers() {
        ChromeEventsAPI.storage_updated(function(changes, area) {
            for (key in changes) {
                var diff = changes[key];
                console.log(`[${area}] Set '${key}' to`, diff.newValue);
                console.log('Was', diff.oldValue);

                if (_is_ready) {
                    self.update_app_state();
                }
            }
        });
    }

    self.get = function(parameter, from_storage=false) {
        return (typeof parameter === 'string' && parameter) ?
            (
                (from_storage === true) ?
                    _native_api.get({[parameter]: MSDefaultAppState.get(parameter)}) :
                    (_buffer.hasOwnProperty(parameter)) ?
                        _buffer[parameter] :
                        MSDefaultAppState.get(parameter)
            ) :
            undefined;
    };

    self.get_default = MSDefaultAppState.get;

    self.get_all = async function(from_storage=true) {
        return Object.assign(
            MSDefaultAppState.get_all(),
            (from_storage) ? (await _native_api.get_all()) : _buffer
        );
    };

    self.set = function(parameters) {
        return new Promise(function(resolve, reject) {
            if (typeof parameters !== 'object' || !Object.keys(parameters).length) {
                reject('[App state] Wrong values to set');
            }

            Object.assign(_buffer, parameters);
            _native_api.set(parameters).then(resolve, reject);
        });
    };

    self.unset = function(parameters) {
        parameters = (Array.isArray(parameters)) ?
            parameters :
            (typeof parameters === 'string') ? [parameters] : [];
        parameters.forEach(key => delete(_buffer[key]));
        return _native_api.remove(parameters);
    };

    self.update_app_state = function() {
        // TODO: Send message to update extension pages UI
        console.log('[i] Settings have been changed');
    };

    self.reset = function() {
        _buffer = {};
        return _native_api.clear();
    };

    return _initialize();
}

// Backward compatibility part
function MSAppDataMigrationHelper() {
    const self = this;

    const _export_accounts = MSAppDataMigrationHelper.accounts.extract_data;

    function _export_generals() {
        var existing_parameters = Object.keys(localStorage);
        return localStorage
            ._extract(
                Object.keys(MSDefaultAppState.list).filter((parameter) => existing_parameters.has(parameter))
            )
            ._map(
                (value, key) => value.convert(MSDefaultAppState.get_type(key))
            );
    }

    self.get_converted_data = function(current_version, reset_after=false) {
        const currents = Object.assign(
            {_version: current_version},
            _export_generals(),
            {accounts: _export_accounts()}
        );
        console.log(currents);
        if (reset_after) {
            localStorage.clear();
        }
        return currents;
    }
}

MSAppDataMigrationHelper.accounts = {
    defaults: {
        list: {
            // AWS S3
            aws_signature_version: {
                value: 'v4',
                type: 'string'
            },
            aws_region: {
                value: 'us-east-1',
                type: 'string'
            },
            aws_ssl_enable: {
                value: true,
                type: 'boolean'
            },
            aws_s3_path: {
                value: '',
                type: 'string'
            },
            aws_s3_base_url: {
                value: 's3.amazonaws.com',
                type: 'string'
            }
        },

        get: function(parameter) {
            return this.list.hasOwnProperty(parameter) ? this.list[parameter].value : undefined;
        },

        get_type: function(parameter) {
            return this.list.hasOwnProperty(parameter) ? this.list[parameter].type : undefined;
        }
    },

    extract_data: function() {
        const _defaults = MSAppDataMigrationHelper.accounts.defaults;
        const get_current_value = (key) => localStorage.get(key, _defaults.get_type(key), _defaults.get(key));

        const accounts = [];

        // Monosnap
        var access_token = localStorage.get('token');
        if (typeof access_token === 'string') {
            accounts.push({
                service: 'monosnap',
                access_token: access_token
            });
        }

        // Amazon S3
        const key_id = localStorage.get('aws_access_key_id'),
            secret_key = localStorage.get('aws_access_secret_key');
        if (typeof key_id === 'string' && typeof secret_key === 'string') {
            accounts.push({
                service: 'amazon_s3',
                access_key_id: key_id,
                secret_access_key: secret_key,
                signature_version: _defaults.get('aws_signature_version'),
                use_ssl: _defaults.get('aws_ssl_enable'),
                region: get_current_value('aws_region'),
                bucket: get_current_value('aws_s3_bucket'),
                path: get_current_value('aws_s3_path'),
                base_url: get_current_value('aws_s3_base_url')
            });
        }
        // console.log(accounts);
        return accounts;
    }
};