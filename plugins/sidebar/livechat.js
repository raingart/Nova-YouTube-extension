window.nova_plugins.push({
   id: 'livechat-visibility',
   title: 'Hide livechat',
   run_on_pages: 'watch',
   restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      if (user_settings.livechat_visibility_mode == 'disable') {
         NOVA.waitElement('#chat')
            .then(chat => chat.remove());

      } else {
         NOVA.waitElement('#chat:not([collapsed]) #show-hide-button #button')
            .then(btn => btn.click());
      }

   },
   options: {
      livechat_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         options: [
            { label: 'collapse', value: 'collapse', selected: true },
            { label: 'remove', value: 'disable' },
         ],
      },
   },
});
