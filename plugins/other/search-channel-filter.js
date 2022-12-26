window.nova_plugins.push({
   id: 'search-filter',
   title: 'Blocked channels',
   'title:zh': '屏蔽频道列表',
   'title:ja': 'ブロックされたチャネルのリスト',
   'title:ko': '차단된 채널 목록',
   'title:id': 'Saluran yang diblokir',
   'title:es': 'Lista de canales bloqueados',
   'title:pt': 'Lista de canais bloqueados',
   'title:fr': 'Liste des chaînes bloquées',
   'title:it': 'Canali bloccati',
   // 'title:tr': 'Engellenen kanalların listesi',
   'title:de': 'Liste der gesperrten Kanäle',
   'title:pl': 'Zablokowane kanały',
   'title:ua': 'Заблоковані канали',
   run_on_pages: 'results',
   section: 'other',
   desc: 'Hide channels on the search page',
   'desc:zh': '在搜索页面上隐藏频道',
   'desc:ja': '検索ページでチャンネルを非表示にする',
   'desc:ko': '검색 페이지에서 채널 숨기기',
   'desc:id': 'Sembunyikan saluran di halaman pencarian',
   'desc:es': 'Ocultar canales en la página de búsqueda',
   'desc:pt': 'Ocultar canais na página de pesquisa',
   'desc:fr': 'Masquer les chaînes sur la page de recherche',
   'desc:it': 'Nascondi i canali nella pagina di ricerca',
   // 'desc:tr': 'Arama sayfasında kanalları gizle',
   'desc:de': 'Kanäle auf der Suchseite ausblenden',
   'desc:pl': 'Ukryj kanały na stronie wyszukiwania',
   'desc:ua': 'Приховує канали на сторінці пошуку',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/405325-youtube-search-filter

      // textarea to array
      const keywords = user_settings.search_filter_channel_blocklist
         ?.split(/[\n,;]/)
         .map(e => e.toString().trim().toLowerCase())
         .filter(e => e.length);

      const thumbsSelectors = [
         // 'ytd-rich-item-renderer', // home, channel
         'ytd-video-renderer', // results
         // 'ytd-grid-video-renderer', // feed
         // 'ytd-compact-video-renderer', // sidepanel in watch
         'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
         // 'ytm-item-section-renderer' // mobile /subscriptions page
      ]
         .join(',');

      if (NOVA.isMobile) {
         // Strategy 1 (slowdown but work in mobile and pc)
         NOVA.watchElements({
            selectors: ['.subhead > [class*="media-item-byline"]:not(:empty)'],
            // selectors: [
            //    // '#channel-name', // for pc
            //    '.subhead > [class*="media-item-byline"]' // mobile /subscriptions page
            // ]
            //    .map(i => i + ':not(:empty)'),
            attr_mark: 'thumb-channel-filtered',
            callback: channel_name => {
               keywords.forEach(keyword => {
                  if (channel_name.textContent.trim().toLowerCase().includes(keyword)
                     && (thumb = channel_name.closest(thumbsSelectors))
                  ) {
                     thumb.remove();
                     // thumb.style.display = 'none';

                     // thumb.style.border = '2px solid red'; // mark for test
                     // console.log('filter removed', keyword, thumb);
                  }
               });
            }
         });

      } else {
         // Strategy 2 (optimize but doesn't work in mobile)
         // page update event
         document.addEventListener('yt-action', evt => {
            // console.log(evt.detail?.actionName);
            if ([
               'yt-append-continuation-items-action', // home, results, feed, channel, watch
               // 'ytd-update-grid-state-action', // feed, channel
               'yt-service-request', // results, watch
               // 'ytd-rich-item-index-update-action', // home
            ]
               .includes(evt.detail?.actionName)
            ) {
               document.body.querySelectorAll(
                  '#channel-name',
                  // '.subhead > [class*="media-item-byline"]' // mobile /subscriptions page
               )
                  .forEach(channel_name => {
                     keywords.forEach(keyword => {
                        if (channel_name.textContent.trim().toLowerCase().includes(keyword)
                           && (thumb = channel_name.closest(thumbsSelectors))
                        ) {
                           thumb.remove();
                           // thumb.style.display = 'none';

                           // thumb.style.border = '2px solid red'; // mark for test
                           // console.log('filter removed', keyword, thumb);
                        }
                     });
                  });
            }
         });
      }

   },
   options: {
      search_filter_channel_blocklist: {
         _tagName: 'textarea',
         label: 'List',
         'label:zh': '频道列表',
         'label:ja': 'チャンネルリスト',
         'label:ko': '채널 목록',
         'label:id': 'Daftar',
         'label:es': 'Lista',
         'label:pt': 'Lista',
         'label:fr': 'Liste',
         'label:it': 'Elenco',
         // 'label:tr': 'Listesi',
         'label:de': 'Liste',
         'label:pl': 'Lista',
         'label:ua': 'Список',
         title: 'separator: "," or ";" or "new line"',
         'title:zh': '分隔器： "," 或 ";" 或 "新队"',
         'title:ja': 'セパレータ： "," または ";" または "改行"',
         'title:ko': '구분 기호: "," 또는 ";" 또는 "새 줄"',
         'title:id': 'pemisah: "," atau ";" atau "baris baru"',
         'title:es': 'separador: "," o ";" o "new line"',
         'title:pt': 'separador: "," ou ";" ou "new line"',
         'title:fr': 'séparateur : "," ou ";" ou "nouvelle ligne"',
         'title:it': 'separatore: "," o ";" o "nuova linea"',
         // 'title:tr': 'ayırıcı: "," veya ";" veya "new line"',
         'title:de': 'separator: "," oder ";" oder "new line"',
         'title:pl': 'separator: "," lub ";" lub "now linia"',
         'title:ua': 'розділювач: "," або ";" або "новий рядок"',
         placeholder: 'channel1, channel2',
         required: true,
      },
   }
});
