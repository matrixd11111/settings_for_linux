(function (undefined) {
    var max_synonyms = 3;

    var TRANSLITERATION_VARIANT = '\
        <div class="<%=prefix%>variants-by-pos">\
            <div class="<%=prefix%>variant-row <%=prefix%>translit-row">\
                <div class="<%=prefix%>v-item <%=prefix%>translit-item <%=prefix%>no-border-bottom">\
                    <div class="<%=prefix%>v-pos <%=prefix%>translit-pos"><%=l_transliteration%></div>\
                    <div class="<%=prefix%>main-of-item <%=prefix%>translit-main"><%=transliteration%></div>\
                </div>\
            </div>\
        </div>\
        ';


    var IPA_VARIANT = '\
        <div class="<%=prefix%>variants-by-pos">\
            <div class="<%=prefix%>variant-row <%=prefix%>ipa-row">\
                <div class="<%=prefix%>v-item <%=prefix%>ipa-item <%=prefix%>no-border-bottom">\
                    <div class="<%=prefix%>v-pos <%=prefix%>ipa-pos"><%=l_ipa%></div>\
                    <div class="<%=prefix%>main-of-item <%=prefix%>ipa-main"><%=ipa%></div>\
                </div>\
            </div>\
        </div>\
        ';

    var SINGLE_HTML = '\
        <div class="<%=prefix%>original-wrap <%=prefix%>padded-single-translation">\
            <div class="<%=prefix%>mv-text-part"><%=original%></div>\
            <div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-original" data-from="<%=from%>"></div>\
        </div>\
        <div class="<%=prefix%>padded-single-translation <%=prefix%>trans-wrap">\
            <div class="<%=prefix%>tpart"><%=translation%></div>\
            <div class="<%=prefix%>more-butt0n" data-to="<%=to%>"></div>\
            <div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-translation" data-to="<%=to%>"></div>\
        </div>';

    pl.extend(ke.ui_views.multi_variant, {
        TRANSLIT_TYPE: 1,
        IPA_TYPE: 2,
        SYNONYMS_TYPE: 3,

        _singleWrap: function (translations, type, prefix, locales) {
            prefix = prefix || '';

            if (type === ke.ui_views.multi_variant.TRANSLIT_TYPE) {
                return ke.ext.util.storageUtil.isTrueOption('show_translit') && translations[4] ? ke.ext.tpl.compile(TRANSLITERATION_VARIANT, {
                    prefix: prefix,
                    l_transliteration: locales.transliteration,
                    transliteration: translations[4]
                }) : '';
            } else if (type === ke.ui_views.multi_variant.IPA_TYPE) {
                return ke.ext.util.storageUtil.isTrueOption('show_ipa') && translations[2] ? ke.ext.tpl.compile(IPA_VARIANT, {
                    prefix: prefix,
                    l_ipa: locales.ipa,
                    ipa: translations[2]
                }) : '';
            } else if (type === ke.ui_views.multi_variant.SYNONYMS_TYPE) {
                return ke.ext.tpl.compile(SINGLE_HTML, {
                    prefix: prefix,
                    l_open: locales.open,
                    l_original: locales.original,
                    l_reversed: locales.reversed,
                    l_unpin: locales.unpin,
                    l_transliteration: locales.transliteration,
                    original: translations[1],
                    translation: translations[3],
                    transliteration: translations[4]
                });
            }

            return '';
        },

        _complexSingleWrap: function (translations, ov, prefix, locales) {
            return this._singleWrap(translations, ke.ui_views.multi_variant.SYNONYMS_TYPE, prefix, locales)
                + this._singleWrap(translations, ke.ui_views.multi_variant.TRANSLIT_TYPE, prefix, locales)
                + this._singleWrap(translations, ke.ui_views.multi_variant.IPA_TYPE, prefix, locales);
        },

        _multiWrap: function (translations, onlyVariants, prefix, locales) {
            var df_local, df_local_items;
            var df = document.createDocumentFragment();

            if (!pl.type(prefix, 'str')) {
                prefix = '';
            }

            if (ke.ext.util.storageUtil.isTrueOption('show_translit') && translations[4]) {
                $(df)
                    .append($('<div>', {class: prefix + 'variant-row ' + prefix + 'translit-row'})
                        .append($('<div>', {class: prefix + 'v-item ' + prefix + 'translit-item'})
                            .append($('<div>', {class: prefix + 'v-pos ' + prefix + 'translit-pos'})
                                .html(locales.transliteration))
                            .append($('<div>', {class: prefix + 'main-of-item ' + prefix + 'translit-main'})
                                .html(translations[4]))));
            }

            if (ke.ext.util.storageUtil.isTrueOption('show_ipa') && translations[2]) {
                $(df)
                    .append($('<div>', {class: prefix + 'variant-row ' + prefix + 'ipa-row'})
                        .append($('<div>', {class: prefix + 'v-item ' + prefix + 'ipa-item'})
                            .append($('<div>', {class: prefix + 'v-pos ' + prefix + 'ipa-pos'})
                                .html(locales.ipa))
                            .append($('<div>', {class: prefix + 'main-of-item ' + prefix + 'ipa-main'})
                                .html(translations[2]))));
            }

            for (var i = 0; i < translations[7].length; ++i) {
                if (pl.empty(translations[7][i])) {
                    continue;
                }

                var len = translations[7][i].length;
                df_local = document.createDocumentFragment();

                pl.each(translations[7][i], function (k, v) {
                    df_local_items = document.createDocumentFragment();

                    // Hotfix
                    if (v[2] && pl.type(v[1], 'str') && pl.type(v[2], 'arr')) {
                        var t = v[1];
                        v[1] = v[2];
                        v[2] = t;
                    }

                    pl.each(v[1] || [], function (k2, v2) {
                        if (k2 >= max_synonyms) return;
                        if (v2) {
                            $(df_local_items)
                                .append($('<div>', {class: prefix + 'synonym'}).html(v2))
                                .append(k2 < v[1].length - 1 && k2 < max_synonyms - 1 ? ', ' : '');
                        }
                    });

                    var gender = '';

                    if (v[2]) {
                        gender = $('<div>', {class: prefix + 'gender'}).html(', ' + v[2]);
                    }

                    $(df_local)
                        .append($('<div>', {class: prefix + 'v-item'})
                            .append($('<div>', {
                                class: prefix + 'small-copy-button',
                                'data-langto': '<%=to%>'
                            }))
                            .append($('<div>', {
                                class: prefix + 'listen-v-item',
                                'data-langto': '<%=to%>'
                            }))
                            .append($('<div>', {class: prefix + 'v-texts'})
                                .append($('<div>', {class: prefix + 'main-of-item'}).html(v[0]))
                                .append(gender))
                            .append($('<div>', {class: prefix + 'synonyms'}).append(df_local_items)));
                });

                var key = ke.ext.googleApi.getPartOfSpeechByIndex(i);
                var empty_pos = pl.empty(key);

                pl(df).append(
                    pl('<div>')
                        .addClass(prefix + 'variant-row')
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'v-pos')
                            .html(!empty_pos ? ke.getLocale('CommonUi_LangPart_' + ke.capitalize(key)) : '')
                            .addClass(empty_pos ? prefix + 'empty-pos' : '')
                            .get()
                    )
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'v-closest-wrap')
                            .append(df_local)
                            .get()
                    )
                        .get()
                );
            }

            // Do not include different wrappers and a main variant to the final HTML code
            if (onlyVariants === true) {
                return pl('<div>').append(df).html();
            }

            var show_original = ke.ext.util.storageUtil.isTrueOption('show_original');
            var bunch = pl('<div>').addClass(prefix + 'variant-bunch-wrap').append(
                pl('<div>')
                    .addClass(prefix + 'vbw-inside-layout')
                    .append(
                    pl('<div>')
                        .addClass(prefix + 'original-wrap')
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'original')
                            .html('<div class="' + prefix + 'mv-text-part">' + translations[1] + '</div><div class="' + prefix + 'add-pb-butt0n"></div><div class="' + prefix + 'copy-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-original" data-from="<%=from%>">' +
                            '</div>')
                            .get()
                    )
                        .get()
                )
                    .append(
                    pl('<div>')
                        .addClass(prefix + 'main-variant-wrap')
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'main-variant')
                            .html('<div class="' + prefix + 'mv-text-part">' + translations[3] + '</div><div class="' + prefix + 'more-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-translation" data-to="<%=to%>">' +
                            '</div>')
                            .get()
                    )
                        .get()
                )
                    .append(
                    pl('<div>')
                        .addClass(prefix + 'variants-by-pos')
                        .append(df)
                        .get()
                )
                    .get()
            );

            return pl('<div>').append(bunch.get()).html();
        },

        wrap: function (multi, items, ov, prefix, locales, complexSingle) {
            locales = pl.extend(locales || {}, {
                original: ke.getLocale('Kernel_Original'),
                translation: ke.getLocale('Kernel_Translation'),
                ipa: ke.getLocale('Kernel_IPA'),
                reversed: ke.getLocale('Kernel_Reverse'),
                unpin: ke.getLocale('Kernel_Unpin'),
                highlight: ke.getLocale('Kernel_Highlight'),
                transliteration: ke.getLocale('CommonUi_LangPart_Transliteration')
            });
            return ke.ui_views.multi_variant['_' + (multi ? 'multi' : (!complexSingle ? 'single' : 'complexSingle')) + 'Wrap'](items, ov, prefix, locales);
        }
    });
})();