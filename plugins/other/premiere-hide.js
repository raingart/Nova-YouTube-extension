window.nova_plugins.push({
   id: 'premiere-disable',
   title: 'Hide Premieres',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
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
         const conteinerSelector = 'ytd-grid-video-renderer:not([hidden])';

         document.body.querySelectorAll(
            `${conteinerSelector} ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"],
            ${conteinerSelector} #overlays [aria-label="PREMIERE"]`
            // #metadata-line:has_text("Premieres")
         )
            .forEach(el => el.closest(conteinerSelector)?.remove());
         // for test
         // .forEach(el => {
         //    if (thumb = el.closest(conteinerSelector)) {
         //       thumb.remove();
         //       // thumb.style.display = 'none';

         //       console.debug('has Premieres:', thumb);
         //       thumb.style.border = '2px solid red'; // mark for test
         //    }
         // });
      }

      // Strategy 2
      // const conteinerSelector = 'ytd-grid-video-renderer:not([hidden])';

      // NOVA.watchElements({
      //    selectors: [
      //       `${conteinerSelector} ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]`,
      //       `${conteinerSelector} #overlays [aria-label="PREMIERE"]`
      //       // #metadata-line:has_text("Premieres")
      //    ],
      //    attr_mark: 'thumb-filtered',
      //    callback: thumb => {
      //       thumb.closest(conteinerSelector)?.remove();
      //       console.debug('has Premieres:', thumb);
      //       thumb.style.border = '2px solid red'; // mark for test

      //       // thumb.textContent.toLowerCase().includes('Premieres')
      //    }
      // });

   },
});
