window.nova_plugins.push({
   id: 'livechat-visibility',
   title: 'Hide livechat',
   'title:zh': '隐藏实时聊天',
   'title:ja': 'ライブチャットを非表示',
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
         'label:zh': '如何',
         'label:ja': '仕方',
         options: [
            { label: 'collapse', value: 'collapse', selected: true, 'label:zh': '坍塌', 'label:ja': '崩壊' },
            { label: 'remove', value: 'disable', 'label:zh': '消除', 'label:ja': '除く' },
         ],
      },
   },
});
