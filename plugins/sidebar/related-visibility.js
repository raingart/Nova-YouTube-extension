window.nova_plugins.push({
   id: 'related-visibility',
   title: 'Hide related section',
   'title:zh': '隐藏相关部分',
   'title:ja': '関連セクションを非表示',
   'title:ko': '관련 섹션 숨기기',
   'title:id': 'Sembunyikan bagian terkait',
   'title:es': 'Ocultar sección relacionada',
   'title:pt': 'Ocultar seção relacionada',
   'title:fr': 'Masquer la section associée',
   'title:it': 'Nascondi la sezione correlata',
   'title:tr': 'İlgili bölümü gizle',
   'title:de': 'Zugehörigen Abschnitt ausblenden',
   'title:pl': 'Ukryj powiązane',
   run_on_pages: 'watch, -mobile',
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      NOVA.preventVisibilityElement({
         selector: '#secondary #related',
         title: 'related',
         remove: user_settings.related_visibility_mode == 'disable' ? true : false,
      });

   },
   options: {
      related_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Mode',
         'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         options: [
            { label: 'collapse', value: 'hide', selected: true, 'label:pl': 'zwiń' },
            { label: 'remove', value: 'disable', 'label:pl': 'usuń' },
         ],
      },
   }
});
