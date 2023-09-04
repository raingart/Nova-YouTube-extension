window.nova_plugins.push({
   id: 'description-expand',
   title: 'Expand description',
   'title:zh': '展开说明',
   'title:ja': '説明を展開',
   'title:ko': '설명 펼치기',
   'title:id': 'Perluas deskripsi',
   'title:es': 'Ampliar descripción',
   'title:pt': 'Expandir descrição',
   'title:fr': 'Développer la description',
   'title:it': 'Espandi la descrizione',
   // 'title:tr': 'Açıklamayı genişlet',
   'title:de': 'Beschreibung erweitern',
   'title:pl': 'Rozwiń opis',
   'title:ua': 'Розширити опис',
   run_on_pages: 'watch, -mobile',
   // restart_on_location_change: true,
   section: 'details',
   // desc: '',
   'data-conflict': 'description-popup, comments-sidebar-position-exchange',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/452405-youtube-scrollable-right-side-description

      if (user_settings['description-popup']) return; // conflict with [description-popup] plugin
      if (user_settings['comments-sidebar-position-exchange']) return; // conflict with [comments-sidebar-position-exchange] plugin

      NOVA.waitSelector(`[description-collapsed] #description ${user_settings.description_expand_mode == 'onhover' ? '' : '#expand'}`)
         .then(btn => {
            switch (user_settings.description_expand_mode) {
               case 'onhover':
                  btn.addEventListener('mouseenter', btn.click);
                  break;

               case 'always':
                  NOVA.runOnPageInitOrTransition(() => (NOVA.currentPage == 'watch') && btn.click());
                  break;
            }
         });

   },
   options: {
      description_expand_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         // title: '',
         'label:ua': 'Режим',
         options: [
            {
               label: 'always', value: 'always', selected: true,
               'label:zh': '每次',
               'label:ja': 'いつも',
               'label:ko': '언제나',
               'label:id': 'selalu',
               'label:es': 'siempre',
               'label:pt': 'sempre',
               'label:fr': 'toujours',
               'label:it': 'sempre',
               // 'label:tr': 'her zaman',
               'label:de': 'stets',
               'label:pl': 'zawsze',
               'label:ua': 'завжди',
            },
            {
               label: 'on hover', value: 'onhover',
               'label:zh': '悬停时',
               'label:ja': 'ホバー時に',
               'label:ko': '호버에',
               'label:id': 'saat melayang',
               'label:es': 'en vuelo estacionario',
               'label:pt': 'pairando',
               'label:fr': 'en vol stationnaire',
               'label:it': 'quando in bilico',
               // 'label:tr': 'üzerinde gezinme',
               'label:de': 'auf schweben',
               'label:pl': 'po najechaniu',
               'label:ua': 'при наведенні',
            },
         ],
      },
   }
});
