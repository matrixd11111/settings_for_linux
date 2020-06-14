function TakeMS_API() {}

TakeMS_API.base_url = 'https://take.ms';
/*  Commented out due to not usable anywhere in project
TakeMS_API.check_link_existance = function(url) {
    const self = this;
    return new Promise(function(resolve, reject) {
        if (typeof url === 'string' && check_is_link(url)) {
            $.ajax({
                url: `${self.base_url}/check_url`,
                data: JSON.stringify({url: url}),
                success: (data) => (data.result) ? resolve() : reject()
            });
        } else {
            reject(`Invalid URL format: ${url}`);
        }
    });
};*/

TakeMS_API.generate_short_link = function(url) {
    const self = this;
    return new Promise(function(resolve, reject) {
        if (typeof url === 'string' && check_is_link(url)) {
            $.ajax({
                url: `${self.base_url}/create`,
                data: JSON.stringify({url: url}),
                success: function(data) {
                    if (data.result) {
                        resolve(data.short_url);
                    } else {
                        MSNotificationsManager.show({message: chrome.i18n.getMessage('notification_short_link_generate_fail')});
                        reject(data);
                    }
                },
                error:(xhr)=>{
                    let json = xhr.responseJSON;
                    if(json){
                        window._api.error.process(json.error);

                    }
                    //ms_core.ajax_error_handler.check_ajax_error(xhr,url)
                }
            });
        } else {
            reject(`Invalid URL format: ${url}`);
        }
    });
};