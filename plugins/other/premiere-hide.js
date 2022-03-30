window.nova_plugins.push({
   id: 'premiere-hide',
   title: 'Hide Premieres',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
   run_on_pages: 'home, results, feed, channel',
   restart_on_transition: true,
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      const interval = setInterval(hideHTML, 150);
      // clear
      document.addEventListener('yt-navigate-start', () => clearInterval(interval)); // on feed transition
      setTimeout(() => clearInterval(interval), 1000 * 5); // after 5s. Fallback if nothing is found

      function hideHTML() {
         document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"], #overlays [aria-label="PREMIERE"]') // #metadata-line:has_text("Premieres")
            .forEach(el => el.closest('ytd-grid-video-renderer')?.remove());
            // // for test
            // .forEach(el => {
            //    if (thumb = el.closest('ytd-grid-video-renderer')) {
            //       thumb.style.display = 'none';

            //       console.debug('has Premieres:', thumb);
            //       thumb.style.border = "2px solid red"; // mark for test
            //    }
            // });
      }

   },
});
