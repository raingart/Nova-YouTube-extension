// for test
// https://www.youtube.com/watch?v=eCmOkxcMgD8&list=PLuZADpUBCdIU4hiA5rpdDH6nsbaH7iqo8
// https://www.youtube.com/channel/UCwXNBp8jcBZcm4YRMwngJBQ/playlists

window.nova_plugins.push({
   id: 'default-miniplayer-disable',
   title: 'Disable miniplayer',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   'title:ua': 'Вимкнути мінівідтворювач',
   // run_on_pages: 'watch, -mobile',
   run_on_pages: 'results, feed, channel, watch, -mobile',
   section: 'other',
   desc: 'shown on changeable page when playing playlist',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:vi': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   'desc:ua': 'Відображається на іншій сторінці під час відтворення плейлиста',
   _runtime: user_settings => {

      // hide player button in bottom panel
      NOVA.css.push(
         `.ytp-right-controls .ytp-miniplayer-button {
            display: none !important;
         }`);

      // yt.config_.EXPERIMENT_FLAGS['kevlar_miniplayer']

      document.addEventListener('yt-action', evt => {
         // if (!location.search.includes('list=')) return;

         // if (NOVA.currentPage != 'watch' && evt.detail?.actionName.includes('miniplayer')) {
         if (evt.detail?.actionName.includes('miniplayer')) {
            // console.log(evt.detail?.actionName);
            // 'yt-cache-miniplayer-page-action'
            // 'yt-miniplayer-endpoint-changed'
            // 'yt-miniplayer-play-state-changed'
            // 'yt-miniplayer-active'

            // document.body.querySelector('ytd-miniplayer[active] #movie_player video')
            document.body.querySelector('ytd-miniplayer[active]')
               ?.remove();

            // document.body.querySelector('ytd-miniplayer[active] #movie_player button.ytp-miniplayer-close-button')
            //    ?.click();

            // document.body.querySelector('tp-yt-paper-dialog #confirm-button')
            //    ?.click();

            // force way
            // const btn = document.body.querySelector('#movie_player .ytp-miniplayer-ui button.ytp-miniplayer-close-button');
            // const waitMiniplayer = setInterval(() => {
            //    if (document.body.querySelector('ytd-miniplayer video')) btn.click();
            //    else clearInterval(waitMiniplayer);
            // }, 500); // 500ms
         }
      });

      // remove from page
      // NOVA.waitSelector('ytd-miniplayer[active]')
      //    .then(() => {
      //       document.body.querySelectorAll('[class^="ytp-miniplayer"]')
      //          .forEach(el => el.remove());
      //    });

      // disable hotkey
      // document.addEventListener('keydown', ({ keyCode }) => (keyCode === 73)
      // document.addEventListener('keydown', ({ key }) => {
      document.addEventListener('keydown', evt => {
         if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;
         if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;

         if (NOVA.currentPage == 'watch' && evt.code === 'KeyI') {
            // if (NOVA.currentPage == 'watch' && (evt.key === 'i' || evt.keyCode === 73)) {
            evt.preventDefault();
            // evt.stopImmediatePropagation();
            // evt.stopPropagation();
         }
      }, { capture: true }); // before all events

   },
});
