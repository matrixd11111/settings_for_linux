function S3_API(parameters={}) {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager
    };
    let _client = new AWS.S3(parameters);

    self.config = {
        fields: {
            conformity_table: {
                access_key_id: 'accessKeyId',
                secret_access_key: 'secretAccessKey',
                signature_version: 'signatureVersion',
                use_ssl: 'sslEnabled',
                region: 'region'
            },

            get_internal_name: function(parameter) {
                return self.config.fields.conformity_table[parameter];
            }
        },

        get_value: function(parameter) {
            var internal_name = self.config.fields.get_internal_name(parameter);
            return (typeof internal_name === 'string' && _client.config.hasOwnProperty(internal_name)) ? _client.config[internal_name] : undefined;
        },

        convert: (parameters) => (parameters instanceof Object && Object.keys(parameters).length) ?
            Object.assign.apply(
                null,
                Object.keys(parameters).map(function(name) {
                    var internal_name = self.config.fields.get_internal_name(name);
                    return (typeof internal_name === 'string') ? {[internal_name]: parameters[name]} : {};
                })
            ) :
            {},

        apply: function(parameters={}) {
            // console.log(parameters, self.config.convert(parameters));
            _client.config.update(self.config.convert(parameters));
            // console.log(_client.config);
        },

        reset: function() {
            _client.config = new AWS.Config();
        }
    };

    self.credentials = {
        test: function(config) {
            return new Promise(function(resolve, reject) {
                if (typeof config.access_key_id === 'string' && typeof config.secret_access_key === 'string') {
                    const s3 = new AWS.S3(self.config.convert(config));
                    s3.listBuckets(
                        {},
                        (error, data) => (error) ? reject(error) : resolve(data.Buckets)
                    );
                } else {
                    reject('[Amazon S3] Credentials not specified');
                }
            });
        },

        delete: () => _client.config.update({credentials: null})
    };

    self.bucket = {
        get_list: function() {
            return new Promise(function(resolve, reject) {
                _client.listBuckets({}, function(error, data) {
                    if (error) {
                        self.error.process(error);
                        reject(error);
                    } else {
                        resolve({
                            buckets: data.Buckets,
                            owner: data.Owner
                        });
                    }
                });
                // reject('[Account] AWS S3: Client is not initialized');
            });
        },

        get_location: function(bucket_name) {
            return new Promise(function(resolve, reject) {
                if (typeof bucket_name === 'string') {
                    _client.getBucketLocation(
                        {Bucket: bucket_name},
                        function(error, data) {
                            if (error) {
                                self.error.process(error);
                                reject(error);
                            } else {
                                resolve(data.LocationConstraint);
                            }
                        }
                    );
                } else {
                    reject('[Account] AWS S3: Bucket is missing');
                }
            });
        }
    };

    self.file = {
        ACLs: {
            list: [
                'private',
                'public-read',
                'public-read-write',
                'authenticated-read',
                'aws-exec-read',
                'bucket-owner-read',
                'bucket-owner-full-control'
            ],
            default: 'public-read'
        },

        get_link: (parameters={}) => encodeURI(
            (parameters.base_url) ?
                `${parameters.base_url}/${parameters.object_key}` :
                `https://${S3_API.regions.get_base_url(parameters.region)}/${parameters.bucket}/${parameters.object_key}`
        ),

        process_title: function(original_title) {
            var safe_chars = '!-_.*\'()';               // Potentially safe ones
            var special_chars = '&$:;?*@';              // Need special handling
            var forbidden_chars = '"|^><{}[]~#%`\\';    // Better to avoid
            return original_title
                .replace(/(\/\s+)/g, ' ')
                .replace(RegExp.from_charset('!\'' + special_chars + forbidden_chars), '');
        },

        get: function(bucket, key) {
            return new Promise(function(resolve, reject) {
                _client.getObject({
                    Bucket: bucket,
                    Key: key
                }, function(error, data) {
                    if (error) {
                        self.error.process(error);
                        reject(error);
                    } else {
                        resolve({
                            body: data.Body,
                            mime_type: data.ContentType,
                            volume: data.ContentLength
                        });
                    }
                });
            });
        },

        upload: function(data_blob, bucket, key, acl, on_progress) {
            return new Promise(function(resolve, reject) {
                const request = _client.upload({
                    Body: data_blob,
                    ContentType: data_blob.type,
                    Bucket: bucket,
                    Key: key,
                    ACL: (self.file.ACLs.list.has(acl)) ? acl : self.file.ACLs.default
                }, function(error, data) {
                    if (error) {
                        self.error.process(error);
                        reject(error);
                    } else {
                        resolve({
                            result: true,
                            location: data.Location,
                            ETag: data.ETag,
                            key: data.Key
                        });
                    }
                });
                request.on(
                    'httpUploadProgress',
                    (progress, response) => on_progress(Math.floor(100 * progress.loaded/progress.total))
                );
            });
        }
    };

    self.error = {
        last: null,

        process: function(error) {
            console.log(error);
            ms_log.add(error);
            self.error.last = error;

            switch (error.name) {
                case 'InvalidAccessKeyId':
                case 'SignatureDoesNotMatch':
                    _dependencies.notifications.show({
                        title: 'Amazon S3',
                        message: chrome.i18n.getMessage('notification_s3_wrong_credentials'),
                        hide_delay: 4
                    });
                    // _dependencies.transmitter.broadcast('account_logout', {account_id: self.id});
                    break;

                case 'AuthorizationHeaderMalformed':
                    _dependencies.notifications.show({
                        title: 'Amazon S3',
                        message: 'Wrong authorization headers'
                    });

                case 'AccessDenied':
                    _dependencies.notifications.show({
                        title: 'Amazon S3',
                        message: chrome.i18n.getMessage('notification_access_denied'),
                        hide_delay: 4
                    });
                    break;

                case 'NetworkingError':
                    _dependencies.notifications.show({
                        title: 'Amazon S3',
                        message: chrome.i18n.getMessage('notification_network_failure'),
                        hide_delay: 4
                    });
                    break;

                default:
                    _dependencies.notifications.show({
                        title: 'Amazon S3',
                        message: chrome.i18n.getMessage('notification_unknown_error'),
                        hide_delay: 4
                    });
            }
        }
    };
}

S3_API.regions = {
    all: [
        {
            name: 'us-east-1',
            description: 'US East (N. Virginia)',
            valid_endpoints: ['s3.amazonaws.com', 's3-external-1.amazonaws.com', 's3.dualstack.us-east-1.amazonaws.com'],
            location_constraints: ['', 'us-east-1'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        },
        {
            name: 'us-east-2',
            description: 'US East (Ohio)',
            valid_endpoints: ['s3.us-east-2.amazonaws.com', 's3-us-east-2.amazonaws.com', 's3.dualstack.us-east-2.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'us-west-1',
            description: 'US West (N. California)',
            valid_endpoints: ['s3-us-west-1.amazonaws.com', 's3.dualstack.us-west-1.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        },
        {
            name: 'us-west-2',
            description: 'US West (Oregon)',
            valid_endpoints: ['s3-us-west-2.amazonaws.com', 's3.dualstack.us-west-2.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        },
        {
            name: 'ca-central-1',
            description: 'Canada (Central)',
            valid_endpoints: ['s3.ca-central-1.amazonaws.com', 's3-ca-central-1.amazonaws.com', 's3.dualstack.ca-central-1.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'ap-south-1',
            description: 'Asia Pacific (Mumbai)',
            valid_endpoints: ['s3.ap-south-1.amazonaws.com', 's3-ap-south-1.amazonaws.com', 's3.dualstack.ap-south-1.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'ap-northeast-1',
            description: 'Asia Pacific (Tokyo)',
            valid_endpoints: ['s3-ap-northeast-1.amazonaws.com', 's3.dualstack.ap-northeast-1.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        },
        {
            name: 'ap-northeast-2',
            description: 'Asia Pacific (Seoul)',
            valid_endpoints: ['s3.ap-northeast-2.amazonaws.com', 's3-ap-northeast-2.amazonaws.com', 's3.dualstack.ap-northeast-2.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'ap-northeast-3',
            description: 'Asia Pacific (Osaka-Local)',
            valid_endpoints: ['s3.ap-northeast-3.amazonaws.com', 's3-ap-northeast-3.amazonaws.com', 's3.dualstack.ap-northeast-3.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'ap-southeast-1',
            description: 'Asia Pacific (Singapore)',
            valid_endpoints: ['s3-ap-southeast-1.amazonaws.com', 's3.dualstack.ap-southeast-1.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        },
        {
            name: 'ap-southeast-2',
            description: 'Asia Pacific (Sydney)',
            valid_endpoints: ['s3-ap-southeast-2.amazonaws.com', 's3.dualstack.ap-southeast-2.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        },
        {
            name: 'cn-north-1',
            description: 'China (Beijing)',
            valid_endpoints: ['s3.cn-north-1.amazonaws.com.cn'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'cn-northwest-1',
            description: 'China (Ningxia)',
            valid_endpoints: ['s3.cn-northwest-1.amazonaws.com.cn'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'eu-central-1',
            description: 'EU (Frankfurt)',
            valid_endpoints: ['s3.eu-central-1.amazonaws.com', 's3-eu-central-1.amazonaws.com', 's3.dualstack.eu-central-1.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'eu-west-1',
            description: 'EU (Ireland)',
            valid_endpoints: ['s3-eu-west-1.amazonaws.com', 's3.dualstack.eu-west-1.amazonaws.com'],
            location_constraints: ['EU', 'eu-west-1'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        },
        {
            name: 'eu-west-2',
            description: 'EU (London)',
            valid_endpoints: ['s3.eu-west-2.amazonaws.com', 's3-eu-west-2.amazonaws.com', 's3.dualstack.eu-west-2.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'eu-west-3',
            description: 'EU (Paris)',
            valid_endpoints: ['s3.eu-west-3.amazonaws.com', 's3-eu-west-3.amazonaws.com', 's3.dualstack.eu-west-3.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v4']
        },
        {
            name: 'sa-east-1',
            description: 'South America (São Paulo)',
            valid_endpoints: ['s3-sa-east-1.amazonaws.com', 's3.dualstack.sa-east-1.amazonaws.com'],
            ssl_available: true,
            signature_versions: ['v2', 'v4']
        }
    ],
    default: 'us-east-1',

    get_by_name: function(name) {
        name = name || this.default;
        return this.all.find(region => (region.name === name));
    },

    get_by_location_constraint: function(location) {
        return this.all.find(
            region => Array.isArray(region.location_constraints) && region.location_constraints.has(location) || (region.name === location)
        );
    },

    filter_by_signature_version: function(version) {
        return this.all.filter(
            region => region.signature_versions.has(version)
        )
    },

    get_base_url: function(name) {
        const region = this.get_by_name(name);
        return (region) ? region.valid_endpoints[0] : '';
    }
};