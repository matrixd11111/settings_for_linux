$(document).ready(() => {
    function a() {
        return "true" === localStorage.isEnabled
    }
    function b() {
        a() ? ($("#on_off_switcher").prop("checked", !0), $(".pulse1").css("animation", ""), $(".pulse1").css("box-shadow", "inset 0px 0px 15px 10px rgb(34, 29, 136)")) : ($("#on_off_switcher").prop("checked", !1), $(".pulse1").css("animation", "stop"), $(".pulse1").css("box-shadow", "none"))
    }
    function c() {
        $(".bottom_open").show()
    }
    function d() {
        $(".e_mail").show()
    }
    function e() {
        chrome.tabs.create({
            url: "https://vk.com/fastproxy"
        })
    }
    function f() {
        window.open("https://vk.com/share.php?url=https://chrome.google.com/webstore/detail/mkelkmkgljeohnaeehnnkmdpocfmkmmf/?utm_source=from_vk&title=FastProxy - \u043E\u0431\u0445\u043E\u0434 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 \u0441\u0430\u0439\u0442\u043E\u0432&description=\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043E\u0431\u0445\u043E\u0434\u0438\u0442\u044C \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430. \u0421 \u043F\u043E\u043C\u043E\u0449\u044C\u044E FastProxy \u0412\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u043A\u043E \u0432\u0441\u0435\u043C \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u0441\u0430\u0439\u0442\u0430\u043C. \u041B\u0435\u0433\u043A\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C, \u043F\u0440\u043E\u0441\u0442\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C!", "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600")
    }
    function g() {
        window.open("https://www.facebook.com/sharer.php?u=https://chrome.google.com/webstore/detail/mkelkmkgljeohnaeehnnkmdpocfmkmmf/?utm_source=from_facebook&title=FastProxy - \u043E\u0431\u0445\u043E\u0434 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 \u0441\u0430\u0439\u0442\u043E\u0432", "", "menubar=no,sharer,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600")
    }
    function h() {
        window.open("https://connect.ok.ru/offer?url=https://chrome.google.com/webstore/detail/mkelkmkgljeohnaeehnnkmdpocfmkmmf/?utm_source=from_ok&title=FastProxy - \u043E\u0431\u0445\u043E\u0434 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 \u0441\u0430\u0439\u0442\u043E\u0432&description=\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043E\u0431\u0445\u043E\u0434\u0438\u0442\u044C \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430. \u0421 \u043F\u043E\u043C\u043E\u0449\u044C\u044E FastProxy \u0412\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u043A\u043E \u0432\u0441\u0435\u043C \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u0441\u0430\u0439\u0442\u0430\u043C. \u041B\u0435\u0433\u043A\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C, \u043F\u0440\u043E\u0441\u0442\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C!", "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600")
    }
    try {
        document.addEventListener("contextmenu", a => a.preventDefault())
    } catch (a) {}(function() {
        $("#support").click(c), $("#support_vk").click(e), $("#support_email").click(d), $("#vk").click(f), $("#fb").click(g), $("#ok").click(h), $(".e_mail").hide(), $(".bottom_open").hide()
    })(),
    function() {
        localStorage.user_proxy || (localStorage.user_proxy = !1), localStorage.user_proxy_http || (localStorage.user_proxy_http = ""), localStorage.user_proxy_port || (localStorage.user_proxy_port = ""), localStorage.user_proxy_text || (localStorage.user_proxy_text = "-- \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u0432\u043E\u0438 \u043F\u0440\u043E\u043A\u0441\u0438 --"), $(".try_user_proxy").text(localStorage.user_proxy_text), $(".user_proxy").hide(), $(".try_user_proxy").click(() => {
            $(".user_proxy").show(), $("#http-host").val(localStorage.user_proxy_http), $("#http-port").val(localStorage.user_proxy_port)
        }), $("#apply").click(() => {
            $("#http-host").val() && 1 < $("#http-host").val().length && $("#http-port").val() && 1 < $("#http-port").val().length ? (localStorage.user_proxy = !0, localStorage.user_proxy_http = $("#http-host").val(), localStorage.user_proxy_port = $("#http-port").val(), localStorage.user_proxy_text = "-- \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0432\u0430\u0448\u0438 \u043F\u0440\u043E\u043A\u0441\u0438 --", $(".user_proxy").hide(), $(".try_user_proxy").text(localStorage.user_proxy_text), $(".user_message").text(""), chrome.runtime.sendMessage({
                a: "e"
            })) : $(".user_message").text("\u041D\u0435 \u0432\u0441\u0435 \u043F\u043E\u043B\u044F \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u044B")
        }), $("#reject").click(() => {
            "true" == localStorage.user_proxy ? (localStorage.user_proxy = !1, localStorage.user_proxy_http = "", localStorage.user_proxy_port = "", localStorage.user_proxy_text = "-- \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u0432\u043E\u0438 \u043F\u0440\u043E\u043A\u0441\u0438 --", $(".user_proxy").hide(), $(".try_user_proxy").text(localStorage.user_proxy_text), $(".user_message").text(""), chrome.runtime.sendMessage({
                a: "e"
            })) : ($(".user_proxy").hide(), $(".user_message").text(""))
        })
    }(), b(),
        function() {
            $("#on_off_switcher").change(() => {
                localStorage.isEnabled = $("#on_off_switcher").prop("checked"), chrome.runtime.sendMessage({
                    a: "e"
                }), b()
            })
        }()
});