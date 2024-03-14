window.nova_plugins.push({
   id: 'livechat-toggle-mode',
   title: '"Livechat" mode instead of "Top chat"',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'live_chat, -mobile',
   restart_on_location_change: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // document.querySelector('#chat-messages #view-selector #trigger').click() // expand dropdown
      // NOVA.waitSelector('#chat-messages #menu a:last-child[aria-selected="false"]')
      NOVA.waitSelector('#chat-messages #menu a[aria-selected="false"]')
         .then(async btn => {
            // await NOVA.delay(500);dropdown
            await btn.click();
         });

   },
});
