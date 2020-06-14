// TODO: Push debug info to the app data storage
function MSLogger() {
    const self = this;

    self.initialize = function() {
        self.log = [];
        self.load();
    };

    self.add = function(record, type='activity') {
        var message;
        if (type === 'error') {
            message = `${record.message} (${record.name} ${record.code ? (', ' + record.code) : ''})`;
        } else {
            message = record.message;
        }

        self.log.push({
            timestamp: Date.now(),
            version: `${app_version}(Google Chrome ${chrome_version})`,
            message: message
        });
        self.save();
    };

    self.get = function(type, head) {
        var log = (typeof type === 'string' && type) ?
            self.log.filter(record => (record.type === type)) :
            self.log;
        return log.slice(
            (typeof head === 'number' && head > 0) ? -head : 0
        );
    };

    self.load = function() {
        // import records
    };

    self.save = function() {
        // save records to local storage
    };

    self.initialize();
}

function MSError(message, name, stack) {
    const self = this;

    self.initialize = function() {
        self.message = message;
        self.name = name || 'Common error';
        self.stack = (new Error()).stack;
    };

    self.initialize();
}
MSError.prototype = Object.create(Error.prototype);
MSError.prototype.constructor = MSError;

// HTTP requests related errors
function MSHTTPError() {
    const self = this;
}
MSHTTPError.prototype = Object.create(MSError.prototype);
MSHTTPError.prototype.constructor = MSHTTPError;

// Monosnap/Amazon S3 related errors
function MSServiceError() {
    const self = this;
}
MSServiceError.prototype = Object.create(MSError.prototype);
MSServiceError.prototype.constructor = MSServiceError;