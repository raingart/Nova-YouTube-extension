window.nova_plugins.push({
   id: 'redirect-disable',
   title: 'Clear links from redirects',
   run_on_pages: 'watch, channel',
   section: 'details',
   desc: 'Direct external links',
   _runtime: user_settings => {

      YDOM.watchElement({
         selector: 'a[href*="/redirect?"]',
         attr_mark: 'redirect-cleared',
         callback: link => {
            if (q = YDOM.queryURL.get('q', link.href)) link.href = decodeURIComponent(q);
         },
      });

   }
});
