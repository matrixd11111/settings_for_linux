function ChromeOSFileBrowserManager() {
    const self = this;

    function apply_template ( base_title ) {
       let template =  ms_app_data.get('file_name_template');

        let title = base_title || 'File';
        if (template) {
            title = template.replace(/\%[a-zA-Z]/g, function(match) {
                var d = new Date();
                return {
                    'Y': d.getFullYear(),
                    'y': fill_with_zeroes(d.getFullYear() % 100),
                    'm': fill_with_zeroes(d.getMonth() + 1),
                    'd': fill_with_zeroes(d.getDate()),
                    'H': fill_with_zeroes(d.getHours()),
                    'M': fill_with_zeroes(d.getMinutes()),
                    'S': fill_with_zeroes(d.getSeconds()),
                    'U': Math.round(Date.now()/1000),
                    'C': base_title,
                    'R': Math.floor(100000*Math.random())
                }[match.slice(1)];
            });
        }
        return title;
    }

    function _initialize() {
        _assign_event_handlers()
    }

    function _assign_event_handlers() {
        ChromeEventsAPI.chromeos_file_manager_interaction({
            'open_in_monosnap': function(file_entries) {
                ga_send_event('Chrome OS', 'Open in Monosnap');

                file_entries.forEach(
                    entry => entry.file((file) => {
                        const use_defaults = ms_app_data.get('apply_default_action_to_local_files');
                        const selected_action = ms_app_data.get('post_capture_action');

                        const action_to_apply = (use_defaults && (selected_action !== 'save')) ? selected_action : 'edit';

                        let fileReader = new FileReader();
                        fileReader.onload = (e)=>{
                            let result = e.target.result;
                            let bytes = new Uint8Array(result.length);
                            for (let i=0; i<bytes.length; i++) {
                                bytes[i] = result.charCodeAt(i);
                            }
                           let blob = new Blob([bytes], {type: file.type});

                            let info = {
                                data: blob,
                                title: file.name,
                                mime_type: file.type,
                                local_file: true
                            };

                            if (is_file_image(file.type)) {
                                ms_core.screenshot.do_post_capture_action(info, action_to_apply);
                            } else if (is_file_video(file.type)) {
                                ms_core.screencast.do_post_record_action(info, action_to_apply);
                            } else {
                                info.type = 'file';
                                info.temporary = true;
                                var session = ms_core.sessions.create(info);
                                session.upload();
                            }
                        };

                        fileReader.readAsBinaryString(file)
                    })
                );
            },

            'upload_file': function(file_entries) {
                ga_send_event('Chrome OS', 'Upload file');

                file_entries.forEach(
                    entry => entry.file(function(file) {
                        let fileReader = new FileReader();
                        fileReader.onload = (e)=>{
                            let result = e.target.result;
                            let bytes = new Uint8Array(result.length);
                            for (let i=0; i<bytes.length; i++) {
                                bytes[i] = result.charCodeAt(i);
                            }
                            let blob = new Blob([bytes], {type: file.type});

                            const info = {
                                data: blob,
                                title: file.name,
                                mime_type: file.type,
                                temporary: true,
                                local_file: true
                            };

                            info.type = 'file';
                            const session = ms_core.sessions.create(info);
                            session.upload();
                        };
                        fileReader.onerror = (e)=>{
                            console.log('[ERROR] can`t read the file', e);
                        };
                        fileReader.readAsBinaryString(file);
                    })
                );
            }
        });
    }

    _initialize();
}