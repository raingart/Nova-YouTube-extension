_plugins.push({
   name: 'Hide livechat',
   id: 'collapse-livechat',
   section: 'sidebar',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      if (user_settings.livechat == 'disable') {
         YDOM.HTMLElement.wait('#chat')
            .then(chat => chat.remove());

      } else {
         YDOM.HTMLElement.wait('#chat:not([collapsed]) #show-hide-button paper-button')
            .then(btn => btn.click());
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
