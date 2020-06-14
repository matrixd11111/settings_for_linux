function MSTempStorage() {
    const self = this;
    const _ttl = 60;
    const _data = {};

    self.get_entry = function(id) {
        if (_data.hasOwnProperty(id)) {
            return _data[id].data;
        }
    };

    // TODO: Periodically scan for old entries and remove them (using Alarm API)
    // Or write lazy implementation: delete (on demand) while attempting to retrieve a value from storage
    // if the current time is greater then entry's creation time + some ttl
    self.add_entry = function(data) {
        let new_id = create_unique_id(Object.keys(_data), 10);
        _data[new_id] = {
            data: data,
            timestamp: Date.now()
        };
        return new_id;
    };

    self.delete_entry = function(id) {
        delete(_data[id]);
    };
}