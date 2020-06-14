function MSUserDevice() {
    const self = this;

    async function _initialize() {
        self.platform = await new MSPlatform();
        self.hardware = new MSHardware();
    }

    return _initialize();
}

function MSPlatform() {
    const self = this;

    const _os_abbreviations = {
        mac: 'macOS',
        win: 'Windows',
        cros: 'ChromeOS',
        android: 'Android',
        linux: 'Linux',
        openbsd: 'OpenBSD'
    };

    return new Promise(function(resolve, reject) {
        try {
            ChromeRuntimeAPI.get_platform_info(
                (platform) => resolve({
                    architecture: platform.arch,
                    os: platform.os,
                    os_full: _os_abbreviations[platform.os] || platform.os
                })
            );
        } catch(e) {
            reject(e);
        }
    });
}

function MSHardware() {
    const self = this;

    function _initialize() {
        self.memory.update();
        self.media_devices.get();
    };

    self.memory = {
        total: 0,
        available: 0,

        update: function() {
            ChromeSystemMemoryAPI.get_info(function(memory) {
                self.memory.total = memory.capacity;
                self.memory.available = memory.availableCapacity;
            });
        }
    };

    self.media_devices = {
        all: [],

        get: function(callback, filter) {
            navigator.mediaDevices.enumerateDevices().then(function(devices) {
                self.media_devices.all = devices;
                if (typeof callback === 'function') { callback(devices); }
            });
        },

        get_microphones: function(callback) {
            self.media_devices.get(function(devices) {
                if (typeof callback === 'function') {
                    callback(
                        devices.filter(device => (device.kind === 'audioinput' && device.deviceId !== 'default'))
                    );
                }
            });
        },

        get_cameras: function(callback) {
            self.media_devices.get(function(devices) {
                if (typeof callback === 'function') {
                    callback(
                        devices.filter(device => (device.kind === 'videoinput' && device.deviceId !== 'default'))
                    );
                }
            });
        }
    };

    _initialize();
}