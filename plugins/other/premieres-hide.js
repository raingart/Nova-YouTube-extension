window.nova_plugins.push({
   id: 'premieres-disable',
   title: 'Hide Premieres',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   'title:pl': 'Ukrywaj premiery',
   run_on_pages: 'feed, channel',
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      // Strategy 1
      // init
      // hideThumb(); // does work
      // page scroll update. init
      document.addEventListener('yt-action', evt => {
         if (['ytd-update-grid-state-action', 'yt-append-continuation-items-action'].includes(evt.detail?.actionName)) {
            hideThumb();
         }
      });

      function hideThumb() {
         const thumbsSelector = 'ytd-grid-video-renderer:not([hidden])';

         document.body.querySelectorAll(
            `${thumbsSelector} #overlays [overlay-style="UPCOMING"],
            ${thumbsSelector} #overlays [aria-label="PREMIERE"]`
         )
            .forEach(el => el.closest(thumbsSelector)?.remove());
         // for test
         // .forEach(el => {
         //    if (thumb = el.closest(thumbsSelector)) {
         //       thumb.remove();
         //       // thumb.style.display = 'none';

         //       console.debug('Premieres:', thumb);
         //       thumb.style.border = '2px solid red'; // mark for test
         //    }
         // });
      }

      // Strategy 2
      // const thumbsSelector = 'ytd-grid-video-renderer:not([hidden])';

      // NOVA.watchElements({
      //    selectors: [
      //       `${thumbsSelector} ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]`,
      //       `${thumbsSelector} #overlays [aria-label="PREMIERE"]`
      //    ],
      //    attr_mark: 'thumb-filtered',
      //    callback: thumb => {
      //       thumb.closest(thumbsSelector)?.remove();
      //       console.debug('Premieres:', thumb);
      //       thumb.style.border = '2px solid red'; // mark for test
      //    }
      // });

   },
});
