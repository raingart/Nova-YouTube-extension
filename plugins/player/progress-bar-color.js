window.nova_plugins.push({
   id: 'player-progress-bar-color',
   title: 'Custom player progress bar color',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',

   _runtime: user_settings => {

      // alt - https://chrome.google.com/webstore/detail/nbkomboflhdlliegkaiepilnfmophgfg
      NOVA.css.push(
         `.ytp-swatch-background-color {
            background-color: ${user_settings.player_progress_bar_color || '#f00'} !important;
         }`);

   },
   options: {
      player_progress_bar_color: {
         _tagName: 'input',
         type: 'color',
         // value: '#ff0000', // red
         value: '#0089ff', // blue
         label: 'Color',
         'label:zh': '颜色',
         'label:ja': '色',
         'label:ko': '색깔',
         'label:id': 'Warna',
         // 'label:es': 'Color',
         'label:pt': 'Cor',
         'label:fr': 'Couleur',
         'label:it': 'Colore',
         // 'label:tr': 'Renk',
         'label:de': 'Farbe',
         'label:pl': 'Kolor',
         'label:ua': 'Колір',
         // title: 'default - #ff0000',
      },
      // move to here??
      // time_jump_title_offset: {
      //    _tagName: 'input',
      //    label: 'Show time offset on progress bar',
      //    type: 'checkbox',
      //    // title: 'When you hover offset current playback time',
      //    title: 'Time offset from current playback time',
      // },
   }
});
