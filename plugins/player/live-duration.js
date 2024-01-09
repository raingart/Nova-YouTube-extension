// for test
// https://www.youtube.com/watch?v=jfKfPfyJRdk

window.nova_plugins.push({
   id: 'player-live-duration',
   title: 'Show duration on live video',
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
   'title:ua': 'Показувати тривалість трансляції',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/453367-youtube-live-clock
      // alt2 - https://greasyfork.org/en/scripts/470937-youtube-live-datetime-tooltip
      // alt3 - https://chrome.google.com/webstore/detail/cnllmiliafeacdmlngaofjpjaljoolpc

      // new Date(document.querySelector('meta[itemprop="startDate"][content]')?.content);
      // new Date(document.querySelector('meta[itemprop="endDate"][content]')?.content);

      // Strategy 1. UnHide default
      NOVA.waitSelector('#movie_player video')
         .then(video => {
            video.addEventListener('canplay', function () {
               if (movie_player.getVideoData().isLive
                  && (el = document.body.querySelector('#movie_player .ytp-chrome-controls .ytp-live .ytp-time-current'))
               ) {
                  el.style = 'display: block !important; margin-right: 5px;';
               }

               // // meta[itemprop="isLiveBroadcast"][content="True"]
               // if (document.body.querySelector('ytd-watch-flexy')?.playerData.videoDetails.isLiveContent) {
               // if (movie_player.getVideoData().isLive) {
               //    NOVA.waitSelector('#movie_player .ytp-chrome-controls .ytp-live .ytp-time-current', { destroy_after_page_leaving: true })
               //       .then(el => {
               //          el.style = 'display: block !important; margin-right: 5px;';
               //       });
               // }
            });

            // fix container
            NOVA.css.push(
               `#movie_player .ytp-chrome-controls .ytp-time-display.ytp-live {
                  display: flex !important;
               }`);
         });

      // Strategy 2. if ".ytp-time-current" don't update
      // const SELECTOR_ID = 'nova-player-live-duration';

      // NOVA.waitSelector('#movie_player .ytp-chrome-controls .ytp-live')
      //    .then(container => {
      //       NOVA.waitSelector('#movie_player video')
      //          .then(video => {
      //             // video.addEventListener('loadeddata', resetBar);

      //             video.addEventListener('timeupdate', function () {
      //                if (document.visibilityState == 'hidden' || !movie_player.getVideoData().isLive && movie_player.classList.contains('ytp-autohide')) return;

      //                insertToHTML({
      //                   // movie_player.getCurrentTime() == '#ytd-player .ytp-chrome-bottom  .ytp-time-current'
      //                   'text': NOVA.formatTimeOut.HMS.abbr(movie_player.getCurrentTime()),
      //                   'container': container,
      //                });
      //             });
      //          });
      //    });

      // function insertToHTML({ text = '', container = required() }) {
      //    // console.debug('insertToHTML', ...arguments);
      //    if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

      //    (document.getElementById(SELECTOR_ID) || (function () {
      //       container.insertAdjacentHTML('afterend',
      //          `<span id="${SELECTOR_ID}" class="" style="">${text}</span>`);
      //       return document.getElementById(SELECTOR_ID);
      //    })())
      //       .textContent = text;
      // }

   },
});
