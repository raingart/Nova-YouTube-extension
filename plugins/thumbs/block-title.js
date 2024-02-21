window.nova_plugins.push({
   id: 'thumbs-title-filter',
   title: 'Block thumbnails by title',
   'title:zh': '按标题阻止缩略图',
   'title:ja': 'タイトルでサムネイルをブロックする',
   // 'title:ko': '제목으로 축소판 차단',
   // 'title:vi': '',
   // 'title:id': 'Blokir gambar mini berdasarkan judul',
   // 'title:es': 'Bloquear miniaturas por título',
   'title:pt': 'Bloquear miniaturas por título',
   'title:fr': 'Bloquer les vignettes par titre',
   // 'title:it': 'Blocca le miniature per titolo',
   // 'title:tr': 'Küçük resimleri başlığa göre engelle',
   'title:de': 'Thumbnails nach Titel blockieren',
   'title:pl': 'Blokuj miniatury według tytułu',
   'title:ua': 'Блокуйте мініатюри за назвою',
   run_on_pages: '*, -embed, -mobile, -live_chat',
   section: 'thumbs',
   // desc: '',
   _runtime: user_settings => {

      // textarea to array
      const BLOCK_KEYWORDS = NOVA.strToArray(user_settings.thumbs_filter_title_blocklist?.toLowerCase());

      const thumbsSelectors = [
         'ytd-rich-item-renderer', // home, channel, feed
         'ytd-video-renderer', // results
         // 'ytd-grid-video-renderer', // feed (old)
         'ytd-compact-video-renderer', // sidepanel in watch
         'ytm-compact-video-renderer', // mobile , results (ytm-rich-item-renderer)
         'ytm-item-section-renderer' // mobile /subscriptions page
      ]
         .join(',');

      if (NOVA.isMobile) {
         // Strategy 1. Slowdown but work in mobile and desktop
         NOVA.watchElements({
            selectors: ['#video-title:not(:empty)'],
            attr_mark: 'nova-thumb-title-filtered',
            callback: video_title => {
               BLOCK_KEYWORDS.forEach(keyword => {
                  if (video_title.textContent.trim().toLowerCase().includes(keyword)
                     && (thumb = channel_name.closest(thumbsSelectors))
                  ) {
                     // thumb.remove();
                     // thumb.style.border = '2px solid orange'; // mark for test
                     // console.log('filter removed', keyword, thumb);
                  }
               });
            }
         });
      }
      else {
         // Strategy 2 (optimized but doesn't work in mobile)
         // page update event
         document.addEventListener('yt-action', evt => {
            // console.log(evt.detail?.actionName);
            switch (evt.detail?.actionName) {
               case 'yt-append-continuation-items-action': // home, results, feed, channel, watch
               case 'ytd-update-grid-state-action': // feed, channel
               case 'yt-rich-grid-layout-refreshed': // feed
               // case 'ytd-rich-item-index-update-action': // home, channel
               case 'yt-store-grafted-ve-action': // results, watch
                  // case 'ytd-update-elements-per-row-action': // feed

                  // universal
                  // case 'ytd-update-active-endpoint-action':
                  // case 'yt-window-scrolled':
                  // case 'yt-service-request': // results, watch

                  // console.log(evt.detail?.actionName); // flltered
                  hideThumb();
                  break;

               // default:
               //    break;
            }
         });

         function hideThumb() {
            document.body.querySelectorAll('#video-title')
               .forEach(titleEl => {
                  BLOCK_KEYWORDS.forEach(keyword => {
                     if (titleEl.textContent.toLowerCase().includes(keyword)
                        && (thumb = titleEl.closest(thumbsSelectors))
                     ) {
                        thumb.remove();
                        // thumb.style.display = 'none';

                        // console.log('filter removed', keyword, thumb);
                        // thumb.style.border = '2px solid orange'; // mark for test
                     }
                  });
               });
         }
      }

   },
   options: {
      thumbs_filter_title_blocklist: {
         _tagName: 'textarea',
         label: 'Words list',
         'label:zh': '单词列表',
         'label:ja': '単語リスト',
         // 'label:ko': '단어 목록',
         // 'label:vi': '',
         // 'label:id': 'Daftar kata',
         // 'label:es': 'lista de palabras',
         'label:pt': 'Lista de palavras',
         'label:fr': 'Liste de mots',
         // 'label:it': 'Elenco di parole',
         // 'label:tr': 'Kelime listesi',
         'label:de': 'Wortliste',
         'label:pl': 'Lista słów',
         'label:ua': 'Список слів',
         title: 'separator: "," or ";" or "new line"',
         'title:zh': '分隔器： "," 或 ";" 或 "新队"',
         'title:ja': 'セパレータ： "," または ";" または "改行"',
         // 'title:ko': '구분 기호: "," 또는 ";" 또는 "새 줄"',
         // 'title:vi': '',
         // 'title:id': 'pemisah: "," atau ";" atau "baris baru"',
         // 'title:es': 'separador: "," o ";" o "new line"',
         'title:pt': 'separador: "," ou ";" ou "new line"',
         'title:fr': 'séparateur : "," ou ";" ou "nouvelle ligne"',
         // 'title:it': 'separatore: "," o ";" o "nuova linea"',
         // 'title:tr': 'ayırıcı: "," veya ";" veya "new line"',
         'title:de': 'separator: "," oder ";" oder "new line"',
         'title:pl': 'separator: "," lub ";" lub "now linia"',
         'title:ua': 'розділювач: "," або ";" або "новий рядок"',
         placeholder: 'text1\ntext2',
         required: true,
      },
   }
});
