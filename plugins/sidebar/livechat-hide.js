_plugins.push({
   name: 'Hide livechat',
   id: 'collapse-livechat',
   section: 'sidebar',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      if (user_settings.livechat === 'disable') {
         YDOM.waitHTMLElement({
            selector: '#chat',
            callback: chat => chat.parentNode.removeChild(chat)
         });

      } else {
         YDOM.waitHTMLElement({
            selector: '#chat:not([collapsed]) #show-hide-button paper-button',
            callback: bth => bth.click()
         });
         // test livechat already collapsed - https://www.youtube.com/watch?v=uyKzS_FDHTI

         // not working next
         // YDOM.waitHTMLElement({
         //    selector: '#chat:not([collapsed]) #show-hide-button paper-button:not([aria-pressed])',
         //    callback: bth => {
         //       console.debug('bth', bth);
         //    },
         // });
      }

   },
   opt_export: {
      'livechat': {
         _elementType: 'select',
         label: 'Type hide',
         options: [
            { label: 'remove', value: 'disable', selected: true },
            { label: 'collapse', value: 'collapse' },
         ]
      },
   },
});
