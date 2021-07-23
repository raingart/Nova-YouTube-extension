window.nova_plugins.push({
   id: 'ad-skip-button',
   title: 'Ad Video Skip',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto click on [Skip Ad] button',
   _runtime: user_settings => {

      YDOM.css.push( // makes sense when playing a new video in a session tab
         `#movie_player.ad-showing video {
            visibility: hidden !important;
         }

         #movie_player:not(.ad-showing) video {
            visibility: visible;
         }`);

      YDOM.waitElement('#movie_player.ad-showing video')
         .then(video => {
            forcePlay();

            video.addEventListener('loadeddata', forcePlay);
            // video.addEventListener('timeupdate', forcePlay); // excessive number of calls
            // video.addEventListener('durationchange', forcePlay); // possible problems on streams

            function forcePlay() {
               if (document.querySelector('#movie_player.ad-showing') && !isNaN(video.duration)
                  // 0: UNSENT
                  // 1:	OPENED
                  // 2:	HEADERS_RECEIVED
                  // 3:	LOADING
                  // 4:	DONE
                  && video.readyState === 4) {
                  video.currentTime = video.duration; // end ad video

                  // YDOM.waitElement('button.ytp-ad-skip-button')
                  YDOM.waitElement('div.ytp-ad-text.ytp-ad-skip-button-text')
                     .then(btn => btn.click()); // click skip-ad
               }
            }
         });
   },
});
