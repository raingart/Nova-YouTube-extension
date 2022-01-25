window.nova_plugins.push({
   id: 'redirect-disable',
   title: 'Clear links from redirects',
   'title:zh': '清除重定向中的链接',
   'title:ja': 'リダイレクトからリンクをクリアする',
   'title:es': 'Borrar enlaces de redireccionamientos',
   'title:pt': 'Limpar links de redirecionamentos',
   'title:de': 'Links aus Weiterleitungen löschen',
   run_on_pages: 'watch, channel',
   section: 'details',
   desc: 'Direct external links',
   'desc:zh': '直接链接到外部站点',
   'desc:ja': '外部サイトへの直接リンク',
   'desc:es': 'Enlaces externos directos',
   'desc:pt': 'Links externos diretos',
   'desc:de': 'Direkte externe Links',
   _runtime: user_settings => {

      NOVA.watchElement({
         selector: 'a[href*="/redirect?"]',
         attr_mark: 'redirect-cleared',
         callback: link => {
            if (q = NOVA.queryURL.get('q', link.href)) {
               link.href = decodeURIComponent(q);
            }
         },
      });

   }
});
