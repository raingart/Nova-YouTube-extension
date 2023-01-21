// for test
// https://www.youtube.com/shorts/5ndfxasp2r0

window.nova_plugins.push({
   id: 'shorts-redirect',
   title: 'Redirect Shorts to regular (watch) URLs',
   'title:zh': '将 Shorts 重定向到常规（watch）URL',
   'title:ja': 'ショートパンツを通常の（watch）URLにリダイレクトする',
   'title:ko': 'Shorts를 일반(watch) URL로 리디렉션',
   'title:id': 'Redirect Shorts ke URL reguler (watch)',
   'title:es': 'Redirigir Shorts a URL normales (watch)',
   'title:pt': 'Redirecionar Shorts para URLs regulares (watch)',
   'title:fr': 'Rediriger les shorts vers des URL normales (watch)',
   'title:it': 'Reindirizza i cortometraggi a URL normali (watch).',
   // 'title:tr': "Shorts'ları normal (watch) URL'lerine yönlendirin",
   'title:de': 'Leiten Sie Shorts zu regulären (watch) URLs um',
   'title:pl': 'Przełączaj Shorts na zwykłe adresy URL',
   'title:ua': 'Перенаправляйте прев`ю на звичайні URL-адреси (для перегляду)',
   run_on_pages: 'results, feed, channel, shorts',
   // restart_on_location_change: true,
   section: 'other',
   desc: 'Redirect Shorts video to normal player',
   'desc:zh': '将 Shorts 视频重定向到普通播放器',
   'desc:ja': 'ショートパンツのビデオを通常のプレーヤーにリダイレクトする',
   'desc:ko': 'Shorts 비디오를 일반 플레이어로 리디렉션',
   'desc:id': 'Redirect video Shorts ke pemutar normal',
   'desc:es': 'Redirigir el video de Shorts al reproductor normal',
   'desc:pt': 'Redirecionar o vídeo do Shorts para o player normal',
   'desc:fr': 'Rediriger la vidéo Short vers un lecteur normal',
   'desc:it': 'Reindirizza il video dei cortometraggi al lettore normale',
   // 'desc:tr': 'Shorts videosunu normal oynatıcıya yönlendir',
   'desc:de': 'Shorts-Video auf normalen Player umleiten',
   'desc:pl': 'Przełącza krótkie filmy do normalnego odtwarzacza',
   'desc:ua': 'Перенаправляйте прев`ю відео у звичайний відтворювач',
   _runtime: user_settings => {

      NOVA.runOnPageInitOrTransition(redirectPageToNormal);

      function redirectPageToNormal() {
         if ('shorts' == NOVA.currentPage) {
            // alt1 - https://github.com/YukisCoffee/yt-anti-shorts/blob/main/anti-shorts.user.js
            // alt2 - https://greasyfork.org/en/scripts/444710-byts-better-youtube-shorts-greasyfork-edition
            // alt3 - https://openuserjs.org/scripts/Kraust/Youtube_Shorts_Redirect
            return location.href = location.href.replace('shorts/', 'watch?v=');
            // location.replace(location.href.replace('/shorts/', '/watch?v='));
         }
      }

      // add time to overlay
      if (user_settings.shorts_thumbnails_time
         && !user_settings['shorts_disable'] // conflict with plugin. Attention! After shorts redirect
      ) {

         // Strategy 1
         document.addEventListener('yt-action', evt => {
            // console.log(evt.detail?.actionName);
            if ([
               'yt-append-continuation-items-action', // home, results, feed, channel, watch
               'ytd-update-grid-state-action', // feed, channel
               'yt-service-request', // results, watch
               'ytd-rich-item-index-update-action', // home, channel
            ]
               .includes(evt.detail?.actionName)
            ) {
               if (NOVA.currentPage == 'channel' && !['shorts'].includes(NOVA.channelTab)) return;

               patchThumbShort();
            }
         });
      }

      const
         // ATTR_MARK = 'nova-thumb-shorts-pathed',
         linkQueryPatch = '&list=RDSH',
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home, channel
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed
            // 'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
            'ytm-item-section-renderer' // mobile /subscriptions page
         ]
            .join(',');

      function patchThumbShort() {
         document.body.querySelectorAll(`a[href*="/shorts/"]:not([href$="${linkQueryPatch}"])`)
            .forEach(link => {
               link.href += linkQueryPatch; // fix href redirect to watch
               // link.href = link.href.replace('shorts/', 'watch?v=');

               if (thumb = link.closest(thumbsSelectors)) {
                  // console.debug('has #shorts:', thumb);
                  // thumb.style.border = '2px solid orange'; // mark for test

                  NOVA.waitElement('ytd-thumbnail-overlay-time-status-renderer', link)
                     .then(async overlay => {
                        if ((thumb = link.closest(thumbsSelectors)?.data)
                           && (time = getThumbTime(thumb))
                        ) {
                           // console.debug('time', time);
                           overlay.setAttribute('overlay-style', 'DEFAULT');
                           // if (timeLabelEl = overlay.querySelector('#text')) {
                           if (timeLabelEl = overlay.$['text']) {
                              timeLabelEl.textContent = time;
                           }
                        }
                     });
               }
            });
      }

      // Strategy 2

      // clear before restart_on_location_change
      // document.addEventListener('yt-navigate-start', () =>
      //    NOVA.clear_watchElements(ATTR_MARK), { capture: true, once: true });

      // fix clear thumb on page update (change sort etc.)
      // document.addEventListener('yt-page-data-updated', () =>
      // document.addEventListener('yt-navigate-finish', () =>
      // document.body.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK))
      // , { capture: true, once: true });

      // NOVA.watchElements({
      //    selectors: ['a[href*="shorts/"]'],
      //    attr_mark: ATTR_MARK,
      //    callback: link => {
      //       link.href += '&list=RDSH'; // fix href redirect to watch
      //       // link.href = link.href.replace('shorts/', 'watch?v=');

      //       // console.debug('has #shorts:', link);
      //       // link.style.border = '2px solid green'; // mark for test

      //       // add time to overlay
      //       if (user_settings.shorts_thumbnails_time) {
      //          NOVA.waitElement('ytd-thumbnail-overlay-time-status-renderer', link)
      //             .then(async overlay => {
      //                if ((thumb = link.closest(thumbsSelectors))
      //                   && (time = getThumbTime(thumb.data))
      //                ) {
      //                   // console.debug('time', time);
      //                   console.debug('', overlay);
      //                   overlay.setAttribute('overlay-style', 'DEFAULT');
      //                   if (timeLabelEl = overlay.querySelector('#text')) {
      //                      timeLabelEl.textContent = time;
      //                   }
      //                }
      //             });
      //       }
      //    },
      // });

      function getThumbTime(videoData = required()) {
         // alt - https://github.com/YukisCoffee/yt-anti-shorts/blob/main/anti-shorts.user.js#L189 (extractLengthFromA11y fn)
         // document.body.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer")
         //    .forEach(videoRenderer => {
         // const videoData = videoRenderer.data;

         if ((title = videoData.title.accessibility.accessibilityData?.label)
            && (publishedTimeText = videoData.publishedTimeText?.simpleText)
            && (viewCountText = videoData.viewCountText?.simpleText)
         ) {
            const
               from = title.search(publishedTimeText) + publishedTimeText.length,
               to = title.search(videoData.viewCountText?.simpleText);

            let
               [minutes, seconds] = title.substring(from, to).trim()
                  .split(/\D/, 2).filter(Number)?.map(s => (+s === 1 ? 60 : +s) - 1); // fix minutes and offest

            // fix mixed up in places
            if (!seconds) {
               seconds = minutes;
               minutes = null;
            }
            if (String(seconds).length === 1) {// fix "0:3" > "0:30"
               seconds += '0';
            }
            // console.debug('>', [minutes, seconds]);
            return [minutes || 0, seconds].join(':');
         }
         else {
            console.error('getThumbTime empty:',
               '\ntitle:', title,
               '\npublishedTimeText:', publishedTimeText,
               '\nviewCountText:', viewCountText);
         }
      }

   },
   options: {
      shorts_thumbnails_time: {
         _tagName: 'input',
         label: 'Add time on thumbnails overlay',
         'label:zh': '在缩略图叠加上添加时间',
         'label:ja': 'サムネイルオーバーレイに時間を追加',
         'label:ko': '썸네일 오버레이에 시간 추가',
         'label:id': 'Tambahkan waktu pada hamparan gambar mini',
         'label:es': 'Agregar tiempo en la superposición de miniaturas',
         'label:pt': 'Adicionar tempo na sobreposição de miniaturas',
         'label:fr': 'Ajouter du temps sur la superposition des vignettes',
         'label:it': 'Aggiungi tempo sulla sovrapposizione delle miniature',
         // 'label:tr': 'Küçük resim yer paylaşımına zaman ekleyin',
         'label:de': 'Fügen Sie Zeit für die Überlagerung von Miniaturansichten hinzu',
         'label:pl': 'Dodaj czas na nakładce miniatur',
         'label:ua': 'Додайте час на накладення мініатюр',
         type: 'checkbox',
         // title: '',
      },
   }
});
