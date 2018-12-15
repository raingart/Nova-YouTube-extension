_plugins.push({
   name: 'Hide LiveChat',
   id: 'collapse-livechat',
   section: 'sidebar',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitFor('.ytd-live-chat-frame #show-hide-button paper-button',
         hide_chat_replay => hide_chat_replay.click());

   }
});
