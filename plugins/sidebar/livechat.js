window.nova_plugins.push({
   id: 'livechat-visibility',
   title: 'Hide live chat',
   'title:zh': '隐藏实时聊天',
   'title:ja': 'ライブチャットを非表示',
   'title:ko': '실시간 채팅 숨기기',
   'title:es': 'Ocultar chat en vivo',
   'title:pt': 'Ocultar livechat',
   'title:fr': 'Masquer le chat en direct',
   // 'title:tr': 'Canlı sohbeti gizle',
   'title:de': 'Livechat ausblenden',
   run_on_pages: 'watch, -mobile',
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
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         options: [
            { label: 'collapse', value: 'hide', selected: true },
            { label: 'remove', value: 'disable' },
         ],
      },
   }
});
