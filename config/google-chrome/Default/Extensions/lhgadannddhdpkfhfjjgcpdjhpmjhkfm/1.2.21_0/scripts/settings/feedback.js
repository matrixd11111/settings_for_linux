function MSSettingsFeedbackSection() {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    function _initialize() {
        _dependencies.transmitter.subscribe({
            'account_updated': function(request, callback) {
                if (request.service === 'monosnap') {
                    _ui.render();
                }
            }
        });

        _ui.assign_event_handlers();
    }

    const _account = bg.ms_accounts.list.monosnap;

    const _ui = {
        $elements: {
            email_input: $('#feedback_email_input'),
            message_input: $('#feedback_message_input'),
            attach_account_info_checkbox: $('#feedback_attach_account_info'),
            send_button: $('#feedback_send')
        },

        assign_event_handlers: function() {
            _ui.$elements.email_input.on('input', self.check_data);
            _ui.$elements.message_input.on('input', self.check_data);

            _ui.$elements.attach_account_info_checkbox.on('change', function() {
                // global_settings.set({feedback_attach_account_info: this.checked});
                if (this.checked && _account.is_logged) {
                    _ui.$elements.email_input.val(_account.data.user.email);
                }
            });

            _ui.$elements.send_button.on('click', function() {

                if (!this.disabled) {
                    this.disabled=true;
                    self.send(
                        _ui.$elements.email_input.val(),
                        _ui.$elements.message_input.val(),
                        _ui.$elements.attach_account_info_checkbox.prop('checked')
                    ).then((data)=>{
                        this.disabled=false;
                        _ui.$elements.message_input.val('');
                        ga_send_event('Settings', 'Send feedback');
                    }).catch((err)=>{
                        ga_send_event('Settings', 'Sending error feedback')
                    });
                }
            });
        },

        render: function() {
            const is_logged = _account.is_logged;

            _ui.$elements.email_input.val((is_logged) ? _account.data.user.email : '');
            _ui.$elements.message_input.val('');
            _ui.$elements.attach_account_info_checkbox
                .prop('disabled', !is_logged)
                .prop('checked', is_logged);
            _ui.$elements.send_button.prop('disabled', true);
        }
    };

    self.check_data = function() {
        const email = _ui.$elements.email_input.val(),
            message = _ui.$elements.message_input.val();
        _ui.$elements.send_button.prop('disabled', !(email && check_is_email(email) && message));
    };

    self.send = (email, message, attach_token) => _dependencies.transmitter.broadcast(
        'send_feedback',
        {
            email: email,
            text: message,
            attach_token: attach_token
        }
    );

    self.init = _ui.render;

    _initialize();
}