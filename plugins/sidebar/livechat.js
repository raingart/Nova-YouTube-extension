// for test
// https://www.youtube.com/watch?v=dq5a1GW6iVA

window.nova_plugins.push({
   id: 'livechat-visibility',
   title: 'Hide live chat',
   'title:zh': '隐藏实时聊天',
   'title:ja': 'ライブチャットを非表示',
   'title:ko': '실시간 채팅 숨기기',
   'title:id': 'Sembunyikan obrolan langsung',
   'title:es': 'Ocultar chat en vivo',
   'title:pt': 'Ocultar livechat',
   'title:fr': 'Masquer le chat en direct',
   'title:it': 'Nascondi chat dal vivo',
   'title:tr': 'Canlı sohbeti gizle',
   'title:de': 'Livechat ausblenden',
   'title:pl': 'Ukryj czat na żywo',
   'title:ua': 'Приховати чат',
   run_on_pages: 'watch, -mobile',
   // restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      if (user_settings.livechat_visibility_mode == 'disable') {
         const fn1 = () => NOVA.waitElement('#chat')
            .then(chat => {
               chat.remove();
               fn1(); // restart
            });

         fn1(); // init

      } else {
         const fn2 = () => NOVA.waitElement('#chat:not([collapsed]) #show-hide-button button')
            .then(btn => {
               btn.click();
               fn2(); // restart
            });

         fn2(); // init
      }

   },
   options: {
      livechat_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Mode',
         'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         options: [
            {
               label: 'collapse', value: 'hide', selected: true,
               'label:pl': 'zwiń',
               'label:ua': 'приховати',
            },
            {
               label: 'remove', value: 'disable',
               'label:pl': 'usuń',
               'label:ua': 'вимкнути',
            },
         ],
      },
   }
});
