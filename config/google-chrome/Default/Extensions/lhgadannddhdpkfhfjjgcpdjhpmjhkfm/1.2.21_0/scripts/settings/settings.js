const page_type = 'settings';

let bg, global_settings;
let ms_settings;
$(document).ready(function() {
    ChromeRuntimeAPI.get_background_context().then(function(context) {
        bg = context;
        global_settings = bg.ms_app_data;
        let viewObj = {ctx:undefined,service:undefined};
        let obj = {
            active:true,
            currentWindow:true
        }
        chrome.tabs.query(obj, (tabs)=>{

            if(tabs[0]){
                let splited = tabs[0].url.split("?");

                if(splited.length>1){
                    let url = new URLSearchParams(splited[1]);


                    let view = url.get('view');
                    let context = url.get('context');
                    if(view&&context){
                        viewObj = {ctx:context,service:view}
                    }
                    let auto_connect = url.get('auto_connect');
                    if(auto_connect=='true'){
                        viewObj.auto_connect=true
                    }
                }


            }

            if(!viewObj.ctx && !viewObj.service  && context.ms_core.temp.options_page){
                viewObj.ctx = context.ms_core.temp.options_page.context
                viewObj.service = context.ms_core.temp.options_page.view
                delete context.ms_core.temp.options_page;
            }

            ms_settings = new MSSettingsView(viewObj);

        })


    });
});

function MSSettingsView(viewObj) {
    const self = this;

    const _dependencies = {
        transmitter: new MSTransmitter()
    };

    function _initialize(viewObj) {

        _dependencies.transmitter.subscribe({
            'open_account_settings': (request, callback) => _sections.select('accounts', request.service),

            'open_feedback_form': (request, callback) => _sections.select('feedback'),
            'account_login_error':(request, callback) => {
                let s3error = document.querySelector('.account_section .error');
                if(s3error){
                    if(request.error==null){
                        s3error.style.display = 'none';
                    }else{
                        s3error.style.display = 'block';
                        s3error.firstElementChild.innerText = request.error.head;
                        s3error.lastElementChild.innerText = request.error.desc;
                    }

                }
            },
            'change_view':(request,callback)=>{
                console.log('debug change view', request)
                if(request.ctx&&request.service){
                    _sections.select(request.ctx,request.service);
                }

                callback({})
            }
        });

        _ui.initialize();
        _sections.select(viewObj.ctx,viewObj.service);
        if(viewObj.auto_connect!=undefined&&viewObj.auto_connect==true){
            $('#aws_s3_connect').click();
        }
    }

    const _ui = {
        initialize: function() {
            _ui.assign_event_handlers();
            localize();
        },

        assign_event_handlers: function() {
            $(document).on('click', '.settings_navigation_button', function() {
                _sections.select(this.dataset.context);
            });
        }
    };

    const _sections = {
        list: {
            general: new MSSettingsGeneralSection(),
            accounts: new MSSettingsAccountsSection(),
            feedback: new MSSettingsFeedbackSection()
        },
        current: 'general',

        select: function(context='general', options) {
            $('.settings_navigation_button').removeClass('active');
            $(`.settings_navigation_button[data-context=${context}]`).addClass('active');
            $('.settings_section').hide();
            $(`.settings_section[data-context=${context}]`).show().scrollTop(0);
            _sections.current = context;

            switch (context) {
                case 'general':     _sections.list.general.init();              break;
                case 'accounts':    _sections.list.accounts.select(options);    break;
                case 'feedback':    _sections.list.feedback.init();             break;
            }
        },

        reload: () => _sections.select(_sections.current)
    };

    self.reset = () => _dependencies.transmitter.broadcast('reset_app_settings').then(_sections.reload);

    self.reload = window.location.reload;

    _initialize(viewObj);
}