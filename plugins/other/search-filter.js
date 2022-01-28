window.nova_plugins.push({
   id: 'search-filter',
   title: 'Search Filter',
   'title:zh': '搜索过滤器',
   'title:ja': '検索フィルター',
   'title:ko': '검색 필터',
   'title:es': 'Filtro de búsqueda',
   'title:pt': 'Filtro de pesquisa',
   'title:fr': 'Filtre de recherche',
   'title:de': 'Suchfilter',
   run_on_pages: 'results',
   section: 'other',
   desc: 'Hide channels on the search page',
   'desc:zh': '在搜索页面上隐藏频道',
   'desc:ja': '検索ページでチャンネルを非表示にする',
   'desc:ko': '검색 페이지에서 채널 숨기기',
   'desc:es': 'Ocultar canales en la página de búsqueda',
   'desc:pt': 'Ocultar canais na página de pesquisa',
   'desc:fr': 'Masquer les chaînes sur la page de recherche',
   'desc:de': 'Kanäle auf der Suchseite ausblenden',
   _runtime: user_settings => {

      const keywords = user_settings.search_filter_blocklist
         .split(/[\n,;]/)
         .map(e => e.toString().trim().toLowerCase())
         .filter(e => e.length);

      NOVA.watchElement({
         selector: 'ytd-video-renderer, ytm-compact-video-renderer', //ytm-compact-channel-renderer, ytd-channel-renderer
         attr_mark: 'thumb-filtered',
         callback: conteiner => {
            keywords.forEach(keyword => {
               if (conteiner.querySelector('ytd-channel-name, .compact-media-item-byline')
                  ?.textContent.toLowerCase().includes(keyword)
               ) {
                  conteiner.remove();
                  // conteiner.style.border = "2px solid red"; // mark for test
                  // console.log('filter removed', keyword, conteiner);
               }
            });
         }
      });

   },
   options: {
      search_filter_blocklist: {
         _tagName: 'textarea',
         label: 'Channels list',
         'label:zh': '频道列表',
         'label:ja': 'チャンネルリスト',
         'label:ko': '채널 목록',
         'label:es': 'Lista de canales',
         'label:pt': 'Lista de canais',
         'label:fr': 'Liste des chaînes',
         'label:de': 'Liste der Kanäle',
         title: 'separator: "," or ";" or "new line"',
         'title:zh': '分隔器： "," 或 ";" 或 "新队"',
         'title:ja': 'セパレータ： "," または ";" または "改行"',
         'title:ko': '구분 기호: "," 또는 ";" 또는 "새 줄"',
         'title:es': 'separador: "," o ";" o "new line"',
         'title:pt': 'separador: "," ou ";" ou "new line"',
         'title:fr': 'séparateur : "," ou ";" ou "nouvelle ligne"',
         'title:de': 'separator: "," oder ";" oder "new line"',
         placeholder: 'channel1, channel2',
         required: true,
      },
   }
});
