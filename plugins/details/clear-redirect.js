_plugins_conteiner.push({
   name: 'Clear links from redirects',
   id: 'disable-redirect-page',
   depends_on_pages: 'watch, channel',
   opt_section: 'details',
   desc: 'Clear external links from redirects',
   _runtime: user_settings => {

      YDOM.HTMLElement.watch({
         selector: 'a[href*="/redirect?"]',
         attr_mark: 'redirect-clear',
         callback: link => {
            const q = YDOM.getURLParams(link.href).get('q');
            if (q) link.href = decodeURIComponent(q);
         },
      });

   }
});
