window.nova_plugins.push({
   id: 'video-description-expand',
   title: 'Expand description',
   'title:zh': '展开说明',
   'title:ja': '説明を展開',
   'title:ko': '설명 펼치기',
   'title:es': 'Ampliar descripción',
   'title:pt': 'Expandir descrição',
   'title:fr': 'Développer la description',
   'title:tr': 'Açıklamayı genişlet',
   'title:de': 'Beschreibung erweitern',
   run_on_pages: 'watch, -mobile',
   restart_on_transition: true,
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('#meta [collapsed] #more')
         .then(btn => {
            if (user_settings.description_expand_mode == 'onhover') {
               btn.addEventListener("mouseenter", ({ target }) => target.click(), { capture: true, once: true });
            }
            // else if (user_settings.description_expand_mode == 'always') {
            else {
               btn.click();
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
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:tr': 'Mod',
         'label:de': 'Modus',
         // title: '',
         options: [
            { label: 'always', value: 'always', selected: true, 'label:zh': '每次', 'label:ja': 'いつも', 'label:ko': '언제나', 'label:es': 'siempre', 'label:pt': 'sempre', 'label:fr': 'toujours', 'label:tr': 'her zaman', 'label:de': 'stets' },
            { label: 'on hover', value: 'onhover', 'label:zh': '悬停时', 'label:ja': 'ホバー時に', 'label:ko': '호버에', 'label:es': 'en vuelo estacionario', 'label:pt': 'pairando', 'label:fr': 'En vol stationnaire', 'label:tr': 'üzerinde gezinme', 'label:de': 'auf schweben' },
         ],
      },
   }
});
