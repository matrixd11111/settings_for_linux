function MSContextMenuManager() {
    const self = this;
    const _native_api = ChromeContextMenuAPI;

    const _dependencies = {
        transmitter: new MSTransmitter(),
        tabs: new MSTabsManager()
    };

    function _initialize() {
        _dependencies.transmitter.local.subscribe({
            'account_updated': function(request) {
                // console.log(request);
                if (['logout', 'folders_loaded', 'buckets_loaded'].has(request.event)) {
                    self.render();
                }
            }
        });

        ChromeEventsAPI.click_on_context_menu_item(function(info, target_tab) {
            switch (info.menuItemId) {
                case self.open_in_editor_id:
                    const image_url = info.srcUrl;

                    _dependencies.transmitter.broadcast('get_image_title', {url: image_url}, target_tab.id)
                        .then(function(title) {
                            ga_send_event('Context menu', 'Open in editor');
                            get_image_data_from_url(image_url).then(
                                (image_blob) => ms_core.screenshot.do_post_capture_action({
                                    data: image_blob,
                                    title: title || target_tab.title,
                                    tab: _dependencies.tabs.extract_info(target_tab),
                                    context: 'context_menu'
                                }, 'edit')
                            );
                        });
                    break;

                default:
                    //
                    break;
            }
        });

        self.render();
    }

    self.global_root_id = 'ms_context_menu_root';
    self.open_in_editor_id = 'ms_edit_image';
    self.busy = false;

    self.render_dropdown = function(tree) {
        return new Promise(function (resolve, reject) {
            _native_api.create(tree.id, tree.text, tree.parent_id, tree.context)
                .then(function() {
                    if (Array.isArray(tree.items) && tree.items.length) {
                        Promise.all(
                            tree.items.map(
                                (item) => self.render_dropdown(
                                    Object.assign(item, {parent_id: tree.id, context: tree.context})
                                )
                            )
                        ).then(resolve, reject);
                    } else {
                        resolve();
                    }
                })
                .catch(reject)
        });
    };

    self.render = function() {
        console.log(`[Context menu] Rendering... (Status:${self.busy ? 'busy' : 'idle'})`);
        if (!self.busy) {
            self.busy = true;

            const structure = {
                id: self.global_root_id,
                text: chrome.i18n.getMessage('context_menu_main'),
                context: ['image'],
                items: [
                    {
                        id: self.open_in_editor_id,
                        text: chrome.i18n.getMessage('context_menu_open_in_editor')
                    }
                ].concat(
                    ms_accounts ? ms_accounts.list.monosnap.context_menu.items.get() : [],
                    ms_accounts ? ms_accounts.list.amazon_s3.context_menu.items.get() : []
                )
            };
            const reset = () => self.busy = false;
            _native_api.remove().then(
                () => self.render_dropdown(structure).then(reset, reset)
            );
        } else {
            setTimeout(self.render, 500);
        }
    };

    _initialize();
}