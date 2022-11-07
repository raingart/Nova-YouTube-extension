window.nova_plugins.push({
   id: 'related-visibility',
   title: 'Collapse related section',
   'title:zh': '收起相关栏目',
   'title:ja': '関連セクションを折りたたむ',
   'title:ko': '관련 섹션 축소',
   'title:id': 'Ciutkan bagian terkait',
   'title:es': 'Ocultar sección relacionada',
   'title:pt': 'Recolher seção relacionada',
   'title:fr': 'Réduire la section associée',
   'title:it': 'Comprimi la sezione relativa',
   'title:tr': 'İlgili bölümü daralt',
   'title:de': 'Zugehörigen Abschnitt minimieren',
   'title:pl': 'Zwiń powiązaną sekcję',
   'title:ua': 'Згорнути розділ "пов`язано"',
   run_on_pages: 'watch, -mobile',
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      NOVA.collapseElement({
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
         'label:ua': 'Режим',
         options: [
            { label: 'collapse', value: 'hide', selected: true, 'label:pl': 'zwiń', 'label:ua': 'Приховати' },
            { label: 'remove', value: 'disable', 'label:pl': 'usuń', 'label:ua': 'Вимкнути' },
         ],
      },
   }
});
