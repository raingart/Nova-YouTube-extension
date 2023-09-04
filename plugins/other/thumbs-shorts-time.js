// for test
// https://www.youtube.com/shorts/5ndfxasp2r0

window.nova_plugins.push({
   id: 'thumbs-shorts-duration',
   title: 'Add time for shorts thumbnail',
   // Add Time Overlay to Short Film Thumbnails
   'label:zh': '对于短裤添加缩略图叠加时间',
   'label:ja': '短い場合は、サムネイルのオーバーレイ時間を追加します',
   'label:ko': 'Shorts의 경우 미리보기 이미지 오버레이 시간 추가',
   'label:id': 'Untuk celana pendek tambahkan waktu overlay thumbnail',
   'label:es': 'Para cortos, agregue tiempo de superposición de miniaturas',
   'label:pt': 'Para shorts, adicione o tempo de sobreposição da miniatura',
   'label:fr': 'Pour les courts métrages, ajoutez le temps de superposition des vignettes',
   'label:it': 'Per i cortometraggi aggiungi il tempo di sovrapposizione delle miniature',
   // 'label:tr': '',
   'label:de': 'Fügen Sie für Kurzfilme eine Überlagerungszeit für Miniaturansichten hinzu',
   'label:pl': 'W przypadku filmów krótkometrażowych dodaj czas nakładki miniatury',
   'label:ua': 'Для шортів додайте час накладання мініатюр',
   run_on_pages: 'feed, -mobile',
   // run_on_pages: 'feed, channel, -mobile',
   // restart_on_location_change: true,
   section: 'other',
   // desc: '',
   'data-conflict': 'shorts_disable',
   _runtime: user_settings => {

      if (user_settings['shorts_disable']) return; // conflict with [thumbs-hide] plugin (shorts_disable) option. Attention! After shorts redirect

      // Strategy 1
      document.addEventListener('yt-action', evt => {
         if (!['feed', 'channel'].includes(NOVA.currentPage)) return;

         // console.log(evt.detail?.actionName);
         if ([
            'yt-append-continuation-items-action', // home, results, feed, channel, watch
            'ytd-update-grid-state-action', // feed, channel
            // 'yt-service-request', // results, watch
            // 'ytd-rich-item-index-update-action', // home, channel
         ]
            .includes(evt.detail?.actionName)
         ) {
            addTimeToOverlay();
         }
      });

      const
         ATTR_MARK = 'nova-thumb-shorts-time',
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home, channel, feed
            // 'ytd-video-renderer', // results
            // 'ytd-grid-video-renderer', // feed (old)
            // 'ytd-compact-video-renderer', // sidepanel in watch
            // 'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
            // 'ytm-item-section-renderer' // mobile /subscriptions page
         ]
            .join(',');

      function addTimeToOverlay() {
         document.body.querySelectorAll(`a[href*="/shorts/"]:not([${ATTR_MARK}])`)
            .forEach(link => {
               link.setAttribute(ATTR_MARK, true);

               if (thumb = link.closest(thumbsSelectors)) {

                  // console.debug('has #shorts:', thumb);
                  // thumb.style.border = '2px solid orange'; // mark for test

                  NOVA.waitSelector('ytd-thumbnail-overlay-time-status-renderer', { container: link, destroy_if_url_changes: true })
                     .then(overlay => {
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
      //    selectors: ['a[href*="shorts/"] ytd-thumbnail-overlay-time-status-renderer'],
      //    attr_mark: ATTR_MARK,
      //    callback: overlay => {
      //       if ((thumb = link.closest(thumbsSelectors)?.data)
      //          && (time = getThumbTime(thumb))
      //       ) {
      //          // console.debug('time', time);
      //          overlay.setAttribute('overlay-style', 'DEFAULT');
      //          // if (timeLabelEl = overlay.querySelector('#text')) {
      //          if (timeLabelEl = overlay.$['text']) {
      //             timeLabelEl.textContent = time;
      //          }
      //       }
      //    },
      // });

      function getThumbTime(videoData = required()) {
         // alt - https://github.com/YukisCoffee/yt-anti-shorts/blob/main/anti-shorts.user.js#L189 (extractLengthFromA11y fn)

         // has time
         if ((location.pathname + location.search) == '/playlist?list=WL') return;

         // document.body.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer")
         //    .forEach(videoRenderer => {
         // const videoData = videoRenderer.data;

         if ((title = videoData.title?.accessibility.accessibilityData?.label)
            && (publishedTimeText = videoData.publishedTimeText?.simpleText)
            && (viewCountText = videoData.viewCountText?.simpleText)
         ) {
            const
               from = title.search(publishedTimeText) + publishedTimeText.length,
               to = title.search(viewCountText),
               time = parseInt(title.substring(from, to).replace(/\D/g, ''));

            return NOVA.timeFormatTo.HMS.digit(time === 1 ? 60 : time)
         }
         else {
            console.error('getThumbTime empty:',
               '\ntitle:', title,
               '\npublishedTimeText:', publishedTimeText,
               '\nviewCountText:', viewCountText);
         }
      }

   },
});
