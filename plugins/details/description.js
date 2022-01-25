window.nova_plugins.push({
   id: 'video-description-expand',
   title: 'Expands video description',
   'title:zh': '展开视频说明',
   'title:ja': 'ビデオの説明を展開します',
   'title:es': 'Expande la descripción del video',
   'title:pt': 'Expande a descrição do vídeo',
   'title:de': 'Erweitert die Videobeschreibung',
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
         'label:es': 'Modo',
         'label:pt': 'Modo',
         'label:de': 'Modus',
         // title: '',
         options: [
            { label: 'always', value: 'always', selected: true, 'label:zh': '每次', 'label:ja': 'いつも', 'label:es': 'siempre', 'label:pt': 'sempre', 'label:de': 'stets' },
            { label: 'on hover', value: 'onhover', 'label:zh': '悬停时', 'label:ja': 'ホバー時に', 'label:es': 'en vuelo estacionario', 'label:pt': 'pairando', 'label:de': 'auf schweben' },
         ],
      },
   }
});
