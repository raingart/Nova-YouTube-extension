window.nova_plugins.push({
   id: 'live-now-hide',
   title: 'Hide LIVE NOW',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
   run_on_pages: 'results, feed',
   section: 'other',
   desc: 'Hide stream',
   _runtime: user_settings => {

      // init
      hideHTML();
      // page scroll update
      document.addEventListener('yt-action', evt => {
         if (['ytd-update-grid-state-action', 'yt-append-continuation-items-action'].includes(evt.detail?.actionName)) {
            hideHTML();
         }
      });

      function hideHTML() {
         document.body.querySelectorAll('#video-badges .badge-style-type-live-now') // #metadata-line:empty, #video-badges span:has_text("LIVE NOW")
            .forEach(el => el.closest('ytd-grid-video-renderer')?.remove());
         // for test
         // .forEach(el => {
         //    if (thumb = el.closest('ytd-grid-video-renderer')) {
         //       // thumb.style.display = 'none';
         //       console.debug('has LIVE NOW:', thumb);
         //       thumb.style.border = '2px solid red'; // mark for test
         //    }
         // });
      }

   },
});
