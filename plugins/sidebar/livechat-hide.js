_plugins.push({
   name: 'Hide livechat',
   id: 'collapse-livechat',
   section: 'sidebar',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      if (user_settings.livechat === 'disable') {
         YDOM.waitFor('#chat', chat => chat.parentNode.removeChild(chat));

      } else {
         YDOM.waitFor('#chat:not([collapsed]) #show-hide-button paper-button', bth => bth.click());
         // test livechat already collapsed
         // https://www.youtube.com/watch?v=uyKzS_FDHTI

         // not working next
         // YDOM.waitFor('#chat:not([collapsed]) #show-hide-button paper-button:not([aria-pressed])', bth => {
         //    console.log('bth', bth);
         // });
      }

   },
   export_opt: (function () {
      return {
         'livechat': {
            _elementType: 'select',
            label: 'Type hide',
            options: [
               /* beautify preserve:start */
               { label: 'disable', value: 'disable' },
               { label: 'collapse', value: 'collapse', selected: true },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
