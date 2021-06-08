_plugins_conteiner.push({
   id: 'redirect-disable',
   title: 'Clear links from redirects',
   run_on_pages: 'watch, channel',
   section: 'details',
   desc: 'Clear external links from redirect',
   _runtime: user_settings => {

      YDOM.watchElement({
         selector: 'a[href*="/redirect?"]',
         attr_mark: 'redirect-cleared',
         callback: link => {
            const q = YDOM.getQueryURL('q', link.href);
            if (q) link.href = decodeURIComponent(q);
         },
      });

   }
});
