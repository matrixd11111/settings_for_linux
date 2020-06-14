var generic_ini;

(function() {
    if (typeof generic_ini === 'undefined') {
        generic_ini = true;

        var webpage_capture;
        var area_capture;
        var hotkeys_manager;

        chrome.runtime.sendMessage(
            {message: 'get_platform'},
            function(response) {
               // console.log(response);
                if (response) {

                if (response.platform!=undefined) {
                    var platform = response.platform;

                    webpage_capture;
                    area_capture = new MSWebpageAreaCapture(platform);

                    hotkeys_manager = new MSHotkeysTracker({
                        platform: platform,
                        onmatch: function (hotkey_name) {
                            switch (hotkey_name) {
                                case 'capture_visible_area':
                                    console.log('[Webpage] Hotkey: Capture visible area');
                                    chrome.runtime.sendMessage({
                                        message: 'take_screenshot',
                                        type: 'window'
                                    });
                                    break;

                                case 'capture_page_area':
                                    console.log('[Webpage] Hotkey: Start area capture');
                                    chrome.runtime.sendMessage({
                                        message: 'take_screenshot',
                                        type: 'area'
                                    });
                                    break;

                                case 'capture_whole_page':
                                    console.log('[Webpage] Hotkey: Start whole page capture');
                                    chrome.runtime.sendMessage({
                                        message: 'take_screenshot',
                                        type: 'webpage'
                                    });
                                    break;
                            }
                        }
                    });

                    chrome.runtime.onMessage.addListener(
                        function (request, sender, callback) {
                            switch (request.message) {
                                case 'is_page_capturable':
                                    try {
                                        callback({message: (check_is_page_only_embed_element()) ? 'uncapturable' : 'capturable'});
                                    } catch (e) {
                                        callback({message: 'loading'});
                                    }
                                    break;

                                case 'start_area_capture':
                                    if (!area_capture.active) {
                                        get_capture_settings('area', function (settings) {
                                            area_capture.magnifier.show = (settings.show_magnifier === true);
                                            area_capture.ui.initialize();
                                        });
                                    }
                                    break;

                                // Whole webpage
                                case 'do_webpage_capture':
                                    switch (request.action) {
                                        case 'get_data':
                                            $('body').addClass('ms_no_scrollbar');
                                            webpage_capture = {
                                                iteration: 0,
                                                fixed_elements: {
                                                    initially: [],
                                                    on_scroll: [],
                                                    checked_for_sticky_elements: false
                                                }
                                            };

                                            webpage_capture.fixed_elements.initially = get_elements_with_fixed_position();
                                            webpage_capture.fixed_elements.initially.forEach(function (element) {
                                                element.style.visibility = 'hidden';
                                                // element.dataset.initial_opacity = element.style.opacity || 1;
                                                // element.style.opacity = '0';
                                            });

                                            webpage_capture.iteration = 0;

                                            callback({
                                                page: {
                                                    width: $(document).width(),
                                                    height: $(document).height()
                                                },
                                                window: {
                                                    width: window.innerWidth,
                                                    height: window.innerHeight
                                                },
                                                // TODO: Actually DPI doesn't update itself while dragging tab between different screens
                                                dpi_factor: window.devicePixelRatio,
                                                initial_offset: {
                                                    top: window.pageYOffset,
                                                    left: window.pageXOffset
                                                },
                                                tab: {
                                                    url: window.location.href,
                                                    title: document.title
                                                }
                                            });
                                            break;

                                        case 'scroll_page':
                                            if (request.offset) {
                                                if (!request.just_scroll) {
                                                    if (request.offset.top) {
                                                        // if (webpage_capture.iteration < 3) {
                                                        // if (!webpage_capture.fixed_elements.on_scroll.length) {
                                                        if (!webpage_capture.fixed_elements.checked_for_sticky_elements) {
                                                            var fixed_elements = webpage_capture.fixed_elements.on_scroll.concat(get_elements_with_fixed_position());
                                                            webpage_capture.fixed_elements.on_scroll.forEach(function (element) {
                                                                element.style.visibility = 'hidden';
                                                            });
                                                            webpage_capture.fixed_elements.on_scroll = webpage_capture.fixed_elements.on_scroll.concat(fixed_elements);
                                                            // webpage_capture.fixed_elements.checked_for_sticky_elements = true;
                                                        }
                                                        // }
                                                        // }
                                                    }
                                                    ++webpage_capture.iteration;
                                                }
                                                // console.log(`(${webpage_capture.iteration})`, request.offset.top, request.offset.left);
                                                window.scrollTo(request.offset.left, request.offset.top);
                                                callback({
                                                    current_offset: {
                                                        top: window.pageYOffset,
                                                        left: window.pageXOffset
                                                    }
                                                });
                                            }
                                            break;

                                        case 'finish':
                                            $('body').removeClass('ms_no_scrollbar');
                                            webpage_capture.fixed_elements.initially.forEach(function (element) {
                                                element.style.visibility = 'visible';
                                                // element.style.opacity = element.dataset.initial_opacity;
                                            });
                                            webpage_capture.fixed_elements.on_scroll.forEach(function (element) {
                                                element.style.visibility = 'visible';
                                            });
                                            // console.log('Iterations', webpage_capture.iteration);
                                            callback({
                                                shots_done: webpage_capture.iteration
                                            });
                                            break;
                                    }
                                    break;

                                // Handle local files
                                case 'open_local_file':
                                    var form = document.createElement('form');
                                    const file_input = document.createElement('input');
                                    form.appendChild(file_input);
                                    file_input.type = 'file';
                                    // file_input.multiple = true;
                                    file_input.click();

                                    file_input.onchange = function (e) {
                                        console.log('[Local file] Open');
                                        Array.prototype.forEach.call(this.files, function (file) {
                                            console.log('[Local file] Process...', file);
                                            chrome.runtime.sendMessage({
                                                message: 'open_local_file',
                                                action: 'check_size',
                                                size: file.size
                                            }, function (response) {
                                                if (response.ok) {
                                                    get_file_data(file, 'binary_string').then(function (data) {
                                                        chrome.runtime.sendMessage({
                                                            message: 'open_local_file',
                                                            action: 'process',
                                                            file: {
                                                                data: data,
                                                                type: file.type,
                                                                name: file.name
                                                            }
                                                        });

                                                        form.reset();
                                                    });
                                                }
                                            });
                                        });
                                    };
                                    break;

                                case 'get_image_title':
                                    if (typeof request.url === 'string' && request.url) {
                                        for (let image of document.images) {
                                            if (image.src === request.url) {
                                                return callback(image.alt || image.title || document.title);
                                            }
                                        }
                                    }
                                    callback(document.title);
                                    break;
                            }
                        }
                    );
                }
            }
            }
        );

    }

    // Capture
    function get_capture_settings(type='area', callback) {
        chrome.runtime.sendMessage(
            {
                message: 'get_capture_settings',
                type: type
            },
            function(response) {
                if (response.settings) {
                    if (typeof callback === 'function') { callback(response.settings); }
                }
            }
        );
    }

    // Others
    function check_is_page_only_embed_element() {
        const body_children = document.body.children;
        let is_only_embed = false;
        for (let node of body_children) {
            if (['object', 'embed', 'video', 'script', 'link'].indexOf(node.tagName.toLowerCase()) !== -1) {
                is_only_embed = true;
            } else if (node.style.display !== 'none') {
                is_only_embed = false;
                break;
            }
        }
        return is_only_embed;
    }

    function get_nodes_satisfying_criteria(validator) {
        const iterator = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT, null);
        validator = (typeof validator === 'function') ? validator : ((node) => true);

        const list = [];
        let current_node;
        while (current_node = iterator.nextNode()) {
            if (validator(current_node)) {
                list.push(current_node);
            }
        }
        return list;
    }

    function get_elements_with_fixed_position() {
        return get_nodes_satisfying_criteria(function(node) {
            const style = window.getComputedStyle(node);
            return (style.getPropertyValue('position') === 'fixed');
        });
    }

    function get_file_data(file, output_type) {
        return new Promise(function(resolve, reject) {
            const file_reader = new FileReader();
            if (output_type === 'data_uri') {
                file_reader.readAsDataURL(file);
            } else {
                file_reader.readAsBinaryString(file);
            }

            file_reader.onload = (e) => resolve(e.target.result);
            file_reader.onerror = (e) => reject(e);
        });
    }
})();