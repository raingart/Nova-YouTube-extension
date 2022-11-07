window.nova_plugins.push({
   id: 'page-logo',
   title: 'YouTube logo',
   'title:zh': 'YouTube 徽标',
   'title:ja': 'YouTubeロゴ',
   'title:ko': '유튜브 로고',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   'title:ua': 'YouTube лого',
   run_on_pages: 'all, -embed, -mobile',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('#masthead a#logo')
         .then(a => a.href = new URL(user_settings.page_logo_url_mode)?.href);

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
