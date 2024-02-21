// for test:
// https://www.youtube.com/watch?v=hYHb7rltxrE

window.nova_plugins.push({
   id: 'video-title-hashtag',
   title: 'Title hashtag',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'watch',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      let cssObj = {};

      switch (user_settings.title_hashtag_visibility_mode) {
         case 'uncolorize':
            cssObj['color'] = 'var(--yt-endpoint-color, var(--yt-spec-text-primary))';
            break;

         // case 'hide':
         default:
            cssObj['display'] = 'none';
            break;
      }

      if (Object.keys(cssObj).length) {
         NOVA.css.push(cssObj, 'h1 a[href*="/hashtag/"]', 'important');
      }

   },
   options: {
      title_hashtag_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         // 'label:ko': '방법',
         // 'label:vi': '',
         // 'label:id': 'Mode',
         // 'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:it': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         options: [
            {
               label: 'hide', /*value: 'hide',*/ selected: true,
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
            {
               label: 'uncolorize', value: 'uncolorize',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
         ],
      },
   }
});
