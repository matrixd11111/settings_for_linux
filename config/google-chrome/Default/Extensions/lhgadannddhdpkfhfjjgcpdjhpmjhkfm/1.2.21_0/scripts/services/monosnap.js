function Monosnap_API(account_id) {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        notifications: MSNotificationsManager,
        pages:new MSViewsManager()
    };
    self.id = account_id;

    self.requests = {
        queue: [],

        get: (uri, parameters) => new Promise(
            function(resolve, reject) {
                $.ajax({
                    method: 'GET',
                    url: `${Monosnap_API.links.api}${uri}`,
                    data: parameters,
                    success: function(response, status, jqxhr) {
                        if (response.result) {
                            resolve(response);
                        } else {
                            self.error.process(response.error);
                            reject(response);
                        }
                    },
                    error: function(jqxhr, status, error) {
                        // TODO: Log request attempt error
                        let json = jqxhr.responseJSON;
                        if(json){
                            self.error.process(json.error);
                        }

                      //  ms_core.ajax_error_handler.check_ajax_error(jqxhr,uri)
                        reject(error);
                    }
                });
            }
        ),

        post: (uri, parameters) => new Promise(
            function(resolve, reject) {
                $.ajax({
                    method: 'POST',
                    url: `${Monosnap_API.links.api}${uri}`,
                    data: JSON.stringify(parameters),
                    success: function(response, status, jqxhr) {
                        if (response.result) {
                            resolve(response);
                        } else {
                            self.error.process(response.error);
                            reject(response);
                        }
                    },
                    error: function(jqxhr, status, error) {
                        console.log('[DEBUG] login failed', jqxhr,status,'|',error,'|');
                        // TODO: Log request attempt error
                        // ms_core.ajax_error_handler.check_ajax_error(jqxhr,uri)
                        if(uri!='/user'){
                            let json = jqxhr.responseJSON;
                            if(json){
                                self.error.process(json.error);
                            }
                        }

                        reject(error);
                    }
                });
            }
        )
    };

    self.auth = {
        login: function(email, password) {
            return self.requests.post('/login', {
                mail: email,
                pass: password,
                device_info: self.user.device
            });
        },

        fb: {
            oauth_endpoint: 'https://www.facebook.com/dialog/oauth',
            redirect_uri: 'https://www.monosnap.com/blank.html',
            scopes: ['user_photos', 'email'],

            oauth_step1: () => new Promise(
                (resolve, reject) => self.requests.post('/facebook_login/generate_state', '')
                    .then(function(data) {
                        const redirect_url = location.construct_query(
                            self.auth.fb.oauth_endpoint,
                            {
                                client_id: 246202635479786,
                                redirect_uri: self.auth.fb.redirect_uri,
                                scope: self.auth.fb.scopes.join(','),
                                state: data.state
                            }
                        );
                        resolve(redirect_url);
                    })
                    .catch(reject)
            ),

            oauth_step2: (state, code) => self.requests.post(
                '/facebook_login',
                {
                    redirect_uri: self.auth.fb.redirect_uri,
                    state: state,
                    code: code,
                    device_info: self.user.device
                }
            )
        }
    };

    self.user = {
        device: {
            device_id: window.uuidv1(),
            type: 'Extension',
            model: app_version,
            name: 'Chrome',
            version: chrome_version
        },

        get_info: (access_token) => self.requests.post('/user', {access_token: access_token})
    };

    self.folder = {
        get_list: function(access_token) {
            return self.requests.post('/folder/list', {
                access_token: access_token
            });
        }
    };

    self.file = {
        get_info: function(file_id, token) {
            return new Promise(function(resolve, reject) {
                if (typeof file_id !== 'string' || !file_id) reject();

                self.requests.post(
                    '/file',
                    Object.assign(
                        {file_id: file_id},
                        (token) ? {access_token: token} : {}
                    )
                ).then(resolve, reject);
            });
        },

        download: function(file_id) {
            // Get blob using XHR2
        },

        upload: function(token, image_blob, image_preview_blob, title, folder_id, progress,image_blob_width,image_blob_height) {
            return new Promise(function(resolve, reject) {
                const form_data = new FormData();
                let request_body = Object.assign(
                    {
                        access_token: token,
                        title: title
                    },
                    (typeof folder_id === 'string') ? {folder_id: folder_id} : {}
                );
                if(image_blob_width&&image_blob_height){
                    request_body = Object.assign(request_body,{
                        width:image_blob_width,
                        height:image_blob_height
                    })
                }

                form_data.append('query', JSON.stringify(request_body));
                form_data.append('attachment', image_blob, title);

                if (typeof image_preview_blob === 'object') {
                    form_data.append('preview', image_preview_blob, title);
                }

                const xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    if (this.status === 200) {
                        const data = JSON.parse(this.responseText);
                        if (data.result) {
                            resolve(data);
                        } else {
                            self.error.process(data.error);
                            reject(data);
                        }
                    } else {
                        console.log(`[Monosnap] File upload failed (code: ${this.status})`);
                        let json = JSON.parse(this.responseText);
                        if(json){
                            self.error.process(json.error);
                        }
                      // ms_core.ajax_error_handler.check_ajax_error(this,'file/create')
                        reject(this);
                    }
                };
                xhr.onerror = reject;

                xhr.upload.onprogress = function(e) {
                    var complete_on = (e.lengthComputable) ? Math.floor(100 * e.loaded/e.total) : 0;
                    // console.log(`${complete_on}% > ${title}`);
                    if (typeof progress === 'function') { progress(complete_on); }
                };

                const api_url = `${Monosnap_API.links.api}/file/create`;
                xhr.open('POST', api_url, true);
                xhr.send(form_data);
            });
        }
    };

    self.feedback = {
        send: function(email, message, logged_services=[], access_token=null) {
            return new Promise(function (resolve, reject) {
                if (email && message) {
                    $.ajax({
                        url: `${Monosnap_API.links.website}/functions/feedback/app.php`,
                        contentType: 'application/x-www-form-urlencoded',
                        data: {
                            query: JSON.stringify(
                                Object.assign(
                                    {
                                        email: email,
                                        message: message,
                                        device: {
                                            os: `${ms_platform.os_full} (${ms_platform.architecture})`,
                                            app_version: app_version
                                        },
                                        activity: 'ACTIVITY_LOG_COMING_SOON',
                                        error: 'ERROR_LOG_COMING_SOON',
                                        settings: 'SETTINGS_IN_COMING_SOON',
                                        authorized_in: logged_services
                                    },
                                    (access_token) ? {access_token: access_token} : {}
                                )
                            )
                        },
                        success: function(data) {
                            if (data.result) {
                                resolve();
                            } else {
                                reject(data);
                            }
                        },
                        error: (xhr)=>{
                            let json = xhr.responseJSON;
                            if(json){
                                self.error.process(json.error);
                            }
                           // ms_core.ajax_error_handler.check_ajax_error(xhr)
                        }
                    });
                } else {
                    reject();
                }
            });
        }
    };

    self.error = {
        last: null,

        process: function(error_code, context) {
            switch (error_code) {
                case 10: // Empty field
                case 101: // Query corrupted

                    break;

                case 100: // Wrong email/password
                    _dependencies.notifications.show({
                        message: chrome.i18n.getMessage('notification_monosnap_login_invalid_credentials'),
                        hide_delay: 4
                    });
                    break;

                case 103: // Wrong token
                    _dependencies.notifications.show({
                        message: chrome.i18n.getMessage('notification_monosnap_wrong_token'),
                        hide_delay: 4
                    });

                    ms_accounts.list.monosnap.logout();

                    _dependencies.pages.open_preferences(function() {
                        setTimeout(
                            () => _dependencies.transmitter.broadcast('open_account_settings', {service: 'monosnap'}),
                            1000
                        );
                    });
                    break;

                case 406: // Wrong id

                    break;

                case 414: // Access denied
                    _dependencies.notifications.show({
                        message: chrome.i18n.getMessage('notification_access_denied'),
                        hide_delay: 4
                    });
                    break;

                default:
                    _dependencies.notifications.show({
                        message: chrome.i18n.getMessage('notification_unknown_error'),
                        hide_delay: 4
                    });
                    break;
            }
        }
    };
}

Monosnap_API.links = {
    api: 'https://api.monosnap.com',
    website: 'https://monosnap.com',

    generate: function(file_id, type) {
        const links = {
            site_page: `${this.website}/file/${file_id}`,
            direct: `${this.website}/direct/${file_id}`,
            image_direct: `${this.website}/image/${file_id}`,
            download: `${this.api}/file/download?id=${file_id}&type=attachment`
        };
        return links[(links.hasOwnProperty(type)) ? type : 'site_page'];
    }
};