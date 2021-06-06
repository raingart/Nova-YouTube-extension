_plugins_conteiner.push({
   name: 'Clear links from redirects',
   id: 'redirect-disable',
   depends_on_pages: 'watch, channel',
   opt_section: 'other',
   desc: 'Clear external links from redirect',
   _runtime: user_settings => {

      YDOM.HTMLElement.watch({
         selector: 'a[href*="/redirect?"]',
         attr_mark: 'redirect-cleared',
         callback: link => {
            const q = YDOM.getURLParams(link.href).get('q');
            if (q) link.href = decodeURIComponent(q);
         },
      });

   }
});
