window.nova_plugins.push({
   id: 'related-visibility',
   title: 'Hide related section',
   'title:zh': '隐藏相关部分',
   'title:ja': '関連セクションを非表示',
   'title:es': 'Ocultar sección relacionada',
   'title:pt': 'Ocultar seção relacionada',
   'title:de': 'Zugehörigen Abschnitt ausblenden',
   run_on_pages: 'watch, -mobile',
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      NOVA.preventVisibilityElement({
         selector: '#secondary #related, ytm-item-section-renderer[section-identifier="related-items"]',
         id_name: 'related',
         remove: user_settings.related_visibility_mode == 'remove' ? true : false,
      });

   },
   options: {
      related_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         'label:de': 'Modus',
         options: [
            { label: 'hide', value: 'hide', selected: true },
            { label: 'remove', value: 'remove' },
         ],
      },
   }
});
