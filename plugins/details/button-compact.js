window.nova_plugins.push({
   id: 'button-no-labels',
   title: 'Buttons without labels',
   // title: 'Compact button labels',
   // 'label:zh': '',
   // 'label:ja': '',
   // 'label:ko': '',
   // 'label:id': '',
   // 'label:es': '',
   // 'label:pt': '',
   // 'label:fr': '',
   // 'label:it': '',
   // 'label:tr': '',
   // 'label:de': '',
   // 'label:pl': '',
   // 'label:ua': '',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      NOVA.css.push(
         `#top-row #actions button ${user_settings.buttons_hide ? '' : '[class*="--button-text-content"]'} {
            display: none;
         }`);

   },
   options: {
      buttons_hide: {
         _tagName: 'input',
         label: 'Hide buttons',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         type: 'checkbox',
      },
   }
});
