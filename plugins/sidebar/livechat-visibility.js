// for test
// https://www.youtube.com/@TheGoodLiferadio/streams

window.nova_plugins.push({
   id: 'livechat-visibility',
   title: 'Collapse live chat',
   'title:zh': '隐藏实时聊天',
   'title:ja': 'ライブチャットを非表示',
   // 'title:ko': '실시간 채팅 숨기기',
   // 'title:vi': '',
   // 'title:id': 'Sembunyikan obrolan langsung',
   // 'title:es': 'Ocultar chat en vivo',
   'title:pt': 'Ocultar livechat',
   'title:fr': 'Masquer le chat en direct',
   // 'title:it': 'Nascondi chat dal vivo',
   // 'title:tr': 'Canlı sohbeti gizle',
   'title:de': 'Livechat ausblenden',
   'title:pl': 'Ukryj czat na żywo',
   'title:ua': 'Приховати чат',
   run_on_pages: 'watch, -mobile',
   // run_on_pages: 'watch, live_chat, -mobile',
   restart_on_location_change: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://chrome.google.com/webstore/detail/fcchghcgfeadhdmkmpkedplecikkajnp

      // if (window['nova-lock-live-chat']) return;

      // window['nova-lock-live-chat'] = true; // set lock

      if (user_settings.livechat_visibility_mode == 'disable') {
         // live_chat - iframe#chatframe #chat-messages #close-button button
         NOVA.waitSelector('#chat', { destroy_after_page_leaving: true })
            .then(chat => {
               chat.remove();
               // window['nova-lock-live-chat'] = false; // unlock
            });
      }
      else {
         NOVA.waitSelector('#chat:not([collapsed]) #show-hide-button button', { destroy_after_page_leaving: true })
            .then(btn => {
               btn.click();
               // window['nova-lock-live-chat'] = false; // unlock
            });
      }

   },
   options: {
      livechat_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         // 'label:ko': '방법',
         // 'label:vi': '',
         // 'label:id': 'Mode',
         // 'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:it': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         options: [
            {
               label: 'collapse', value: 'hide', selected: true,
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               'label:pl': 'zwiń',
               'label:ua': 'приховати',
            },
            {
               label: 'remove', value: 'disable',
               'label:zh': '消除',
               'label:ja': '削除',
               // 'label:ko': '제거하다',
               // 'label:vi': '',
               // 'label:id': 'menghapus',
               // 'label:es': 'eliminar',
               'label:pt': 'remover',
               'label:fr': 'retirer',
               // 'label:it': 'rimuovere',
               // 'label:tr': '',
               'label:de': 'entfernen',
               'label:pl': 'usunąć',
               'label:ua': 'видалити',
            },
         ],
      },
   }
});
