window.nova_plugins.push({
   id: 'subscriptions-home',
   title: 'Redirect from home page to subscriptions page',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'home', // NOVA.currentPage == 'home'
   restart_on_location_change: true,
   section: 'header',
   // desc: '',
   'data-conflict': 'page-logo',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/475942-youtube-recommendations-be-gone-cleaner-youtube

      location.pathname = '/feed/subscriptions';

   },
});
