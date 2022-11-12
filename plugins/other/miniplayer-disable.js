window.nova_plugins.push({
   id: 'miniplayer-disable',
   title: 'Disable miniplayer',
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
   // 'title:pl': '',
   'title:ua': 'Вимкнути мінівідтворювач',
   run_on_pages: 'watch',
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      // hide player button
      NOVA.css.push(
         `.ytp-right-controls .ytp-miniplayer-button {
            display: none !important;
         }`);

      document.addEventListener('yt-action', evt => {
         if (NOVA.currentPage != 'watch' && evt.detail?.actionName.includes('miniplayer')) {
            // console.log(evt.detail?.actionName);
            // 'yt-cache-miniplayer-page-action'
            // 'yt-miniplayer-endpoint-changed'
            // 'yt-miniplayer-play-state-changed'
            // 'yt-miniplayer-active'
            document.body.querySelector('#movie_player button.ytp-miniplayer-close-button')?.click();
         }
      });

      // remove from page
      // NOVA.waitElement('.ytp-chrome-bottom button[class^="ytp-miniplayer"]')
      //    .then(() => {
      //       document.querySelectorAll('[class^="ytp-miniplayer"]')
      //          .forEach(el => el.remove());
      //    });

      // disable hotkey
      // document.addEventListener('keydown', ({ keyCode }) => (keyCode === 13)
      // document.addEventListener('keydown', ({ key }) => {
      // document.addEventListener('keydown', evt => {
      //    if (['input', 'textarea'].includes(target.localName) || target.isContentEditable) return;
      //    // if (NOVA.currentPage == 'watch' && evt.code === 'KeyI') {
      //    if (NOVA.currentPage == 'watch' && evt.key === 'i') {
      //       alert(1);
      //       evt.preventDefault(); // Doesn't work. Replace to preventDefault patch
      //       evt.stopImmediatePropagation(); // Doesn't work. Replace to preventDefault patch
      //       evt.stopPropagation(); // Doesn't work. Replace to preventDefault patch
      //    }
      // });

   },
});
