function MSDefaultAppState() {}

MSDefaultAppState.list = {
    // Internal
    image_size_limit: {
        value: 30 * 1024 * 1024,
        type: 'integer'
    },
    file_size_limit: {
        value: 30 * 1024 * 1024,
        type: 'integer'
    },

    // General settings
    image_type: {
        value: 'png',
        type: 'string'
    },
    image_quality: {
        value: 0.9,
        type: 'float'
    },
    video_type: {
        value: 'webm',
        type: 'string'
    },
    record_microphone: {
        value: true,
        type: 'boolean'
    },
    gif_quality: {
        value: 10,
        type: 'integer'
    },
    gif_frame_rate: {
        value: 15,
        type: 'integer'
    },
    post_capture_action: {
        value: 'edit',
        type: 'string'
    },
    open_editor_in_a_separate_window: {
        value: true,
        type: 'boolean'
    },
    apply_default_action_to_local_files: {
        value: false,
        type: 'boolean'
    },
    default_save_path: {
        value: '',
        type: 'string'
    },
    default_upload_service: {
        value: 'monosnap',
        type: 'string'
    },
    post_upload_action: {
        value: 'copy_direct_link',
        type: 'string'
    },
    open_ms_after_upload: {
        value: false,
        type: 'boolean'
    },
    enable_short_links: {
        value: false,
        type: 'boolean'
    },
    generate_random_file_names: {
        value: false,
        type: 'boolean'
    },
    apply_template_to_file_name: {
        value: true,
        type: 'boolean'
    },
    apply_template_to_local: {
        value: true,
        type: 'boolean'
    },
    file_name_template: {
        value: '%C %Y-%m-%d %H-%M-%S',
        type: 'string'
    },
    close_editor_after_upload: {
        value: true,
        type: 'boolean'
    },
    show_magnifier_on_area_capture: {
        value: true,
        type: 'boolean'
    },
    pre_capture_delay: {
        value: 4,
        type: 'integer'
    },
    minimize_chrome_on_desktop_capture: {
        value: false,
        type: 'boolean'
    },
    feedback_attach_account_info: {
        value: true,
        type: 'boolean'
    },
    webpage_hotkeys: {
        value: [
            {
                name: 'capture_visible_area',
                keys: ['shift', 'alt', '4']
            },
            {
                name: 'capture_page_area',
                keys: ['shift', 'alt', '5']
            },
            {
                name: 'capture_whole_page',
                keys: ['shift', 'alt', '6']
            }
        ],
        type: 'array'
    },
    webpage_enable_hotkeys: {
        value: true,
        type: 'boolean'
    },

    // Accounts
    accounts: {
        value: [],
        type: 'array'
    },

    // Editor
    editor_tool_color: {
        value: '#FF0000',
        type: 'string'
    },
    editor_tool_size: {
        value: 10,
        type: 'integer'
    },
    editor_tool: {
        value: 'brush',
        type: 'string'
    },

    // Recent uploads
    recent_uploads: {
        value: [],
        type: 'array'
    },
    enable_audio_screencast:{
        value: false,
        type: 'boolean'
    }
};

MSDefaultAppState.get = function(parameter) {
    return this.list.hasOwnProperty(parameter) ? this.list[parameter].value : undefined;
};

MSDefaultAppState.get_all = function() {
    return this.list._map((item) => item.value);
};

MSDefaultAppState.get_type = function(parameter) {
    return this.list.hasOwnProperty(parameter) ? this.list[parameter].type : undefined;
};