_plugins_conteiner.push({
   name: 'Hide livechat',
   id: 'collapse-livechat',
   depends_on_pages: 'watch',
   run_on_transition: true,
   opt_section: 'sidebar',
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
         _tagName: 'select',
         label: 'Type hide',
         options: [
            { label: 'remove', value: 'disable', selected: true },
            { label: 'collapse', value: 'collapse' },
         ]
      },
   },
});
