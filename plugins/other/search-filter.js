window.nova_plugins.push({
   id: 'search-filter',
   title: 'Blocked channels',
   'title:zh': '屏蔽频道列表',
   'title:ja': 'ブロックされたチャネルのリスト',
   'title:ko': '차단된 채널 목록',
   'title:es': 'Lista de canales bloqueados',
   'title:pt': 'Lista de canais bloqueados',
   'title:fr': 'Liste des chaînes bloquées',
   'title:tr': 'Engellenen kanalların listesi',
   'title:de': 'Liste der gesperrten Kanäle',
   run_on_pages: 'results',
   section: 'other',
   desc: 'Hide channels on the search page',
   'desc:zh': '在搜索页面上隐藏频道',
   'desc:ja': '検索ページでチャンネルを非表示にする',
   'desc:ko': '검색 페이지에서 채널 숨기기',
   'desc:es': 'Ocultar canales en la página de búsqueda',
   'desc:pt': 'Ocultar canais na página de pesquisa',
   // 'desc:fr': 'Masquer les chaînes sur la page de recherche',
   'desc:tr': 'Arama sayfasında kanalları gizle',
   'desc:de': 'Kanäle auf der Suchseite ausblenden',
   _runtime: user_settings => {

      const keywords = user_settings.search_filter_channel_blocklist
         ?.split(/[\n,;]/)
         .map(e => e.toString().trim().toLowerCase())
         .filter(e => e.length);

      NOVA.watchElements({
         selectors: [
            'ytd-video-renderer',
            'ytd-playlist-renderer',
            'ytm-compact-video-renderer'
         ],
         attr_mark: 'thumb-search-filtered',
         callback: thumb => {
            keywords.forEach(keyword => {
               if (thumb.querySelector('ytd-channel-name:not(:empty), .compact-media-item-byline:not(:empty)')
                  ?.textContent.toLowerCase().includes(keyword)
               ) {
                  thumb.remove();
                  // thumb.style.border = '2px solid red'; // mark for test
                  // console.log('filter removed', keyword, thumb);
               }
            });
         }
      });

   },
   options: {
      search_filter_channel_blocklist: {
         _tagName: 'textarea',
         label: 'List',
         'label:zh': '频道列表',
         'label:ja': 'チャンネルリスト',
         'label:ko': '채널 목록',
         'label:es': 'Lista',
         'label:pt': 'Lista',
         'label:fr': 'Liste',
         'label:tr': 'Listesi',
         'label:de': 'Liste',
         'title:pl': 'Zablokowane kanały',
         title: 'separator: "," or ";" or "new line"',
         'title:zh': '分隔器： "," 或 ";" 或 "新队"',
         'title:ja': 'セパレータ： "," または ";" または "改行"',
         'title:ko': '구분 기호: "," 또는 ";" 또는 "새 줄"',
         'title:es': 'separador: "," o ";" o "new line"',
         'title:pt': 'separador: "," ou ";" ou "new line"',
         'title:fr': 'séparateur : "," ou ";" ou "nouvelle ligne"',
         'title:tr': 'ayırıcı: "," veya ";" veya "new line"',
         'title:de': 'separator: "," oder ";" oder "new line"',
         'desc:pl': 'Ukryj kanały na stronie wyszukiwania',
         placeholder: 'channel1, channel2',
         required: true,
      },
   }
});
