window.nova_plugins.push({
   id: 'page-logo',
   // title: 'YouTube logo',
   title: 'YouTube logo link',
   'title:zh': 'YouTube 徽标',
   'title:ja': 'YouTubeロゴ',
   // 'title:ko': '유튜브 로고',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   'title:ua': 'YouTube лого',
   run_on_pages: '*, -embed, -mobile, -live_chat',
   section: 'header',
   // desc: '',
   // 'plugins-conflict': 'subscriptions-home',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/445197-youtube-premium-logo
      // alt2 - https://greasyfork.org/en/scripts/447775-youtube-premium-logo
      // alt3 - https://greasyfork.org/en/scripts/405614-youtube-polymer-engine-fixes

      NOVA.waitSelector('#masthead a#logo', { destroy_after_page_leaving: true })
         .then(async a => {
            if (link = new URL(user_settings.page_logo_url_mode)?.href) {
               a.href = link;

               await NOVA.waitUntil(() => a.data?.commandMetadata?.webCommandMetadata?.url, 1500); // 1.5sec

               a.data.commandMetadata.webCommandMetadata.url = link;
            }
         });

   },
   options: {
      page_logo_url_mode: {
         _tagName: 'input',
         label: 'URL',
         type: 'url',
         pattern: "https://.*",
         // title: '',
         placeholder: 'https://youtube.com/...',
         value: 'https://youtube.com/feed/subscriptions',
      },
   }
});
