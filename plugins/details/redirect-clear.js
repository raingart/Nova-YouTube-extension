window.nova_plugins.push({
   id: 'redirect-disable',
   title: 'Clear links from redirect',
   'title:zh': '清除重定向中的链接',
   'title:ja': 'リダイレクトからリンクをクリアする',
   'title:ko': '리디렉션에서 링크 지우기',
   'title:es': 'Borrar enlaces de redireccionamientos',
   'title:pt': 'Limpar links de redirecionamentos',
   'title:fr': 'Effacer les liens des redirections',
   'title:tr': 'Yönlendirmeden bağlantıları temizle',
   'title:de': 'Links aus Weiterleitungen löschen',
   'title:pl': 'Wyczyść linki z przekierowań',
   run_on_pages: 'watch, channel',
   section: 'details',
   desc: 'Direct external links',
   'desc:zh': '直接链接到外部站点',
   'desc:ja': '外部サイトへの直接リンク',
   'desc:ko': '직접 외부 링크',
   'desc:es': 'Enlaces externos directos',
   'desc:pt': 'Links externos diretos',
   'desc:fr': 'Liens externes directs',
   'desc:tr': 'Doğrudan harici bağlantılar',
   'desc:de': 'Direkte externe Links',
   'desc:pl': 'Bezpośrednie łącza zewnętrzne',
   _runtime: user_settings => {

      // document.addEventListener('mouseover', ({ target }) => { // increased load but the hint will be the right link
      document.addEventListener('click', ({ target }) => {
         if (!target.matches('a[href*="/redirect?"]')) return;

         if (q = NOVA.queryURL.get('q', target.href)) {
            // console.debug('redirect clear:', decodeURIComponent(q), target);
            target.href = decodeURIComponent(q);
         }
      }, { capture: true });

   },
});
