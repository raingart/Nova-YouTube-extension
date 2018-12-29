_plugins.push({
   name: 'Hide livechat',
   id: 'collapse-livechat',
   section: 'sidebar',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitFor('ytd-live-chat-frame #show-hide-button paper-button', bth => bth.click());

   }
});
