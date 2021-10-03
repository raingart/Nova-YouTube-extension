window.nova_plugins.push({
   id: 'pause-background-tab',
   title: 'Pauses playing videos in other tabs',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Supports iframes and other windows',
   _runtime: user_settings => {

      // redirection for localStorage common storage space
      if (location.hostname.includes('youtube-nocookie.com')) location.hostname = 'youtube.com';

      const
         storeName = 'playngInstanceIDTab',
         instanceID = Math.random(), // Generate a random script instance ID
         removeStorage = () => localStorage.removeItem(storeName);

      NOVA.waitElement('video')
         .then(video => {
            // on playing set mark
            video.addEventListener('playing', () => localStorage.setItem(storeName, instanceID));

            // remove mark - video not play
            ['pause', 'suspend', 'ended'].forEach(evt => video.addEventListener(evt, removeStorage));
            // remove mark - on tab closed
            window.addEventListener('beforeunload', removeStorage);

            // auto play on tab focus
            if (user_settings.pause_background_tab_onfocus) {
               const player = document.getElementById('movie_player');
               document.addEventListener("visibilitychange", () => {
                  //   if other tabs are not playing
                  if (document.visibilityState === 'visible'
                     && !localStorage.hasOwnProperty(storeName)
                     // && video.paused  // dont see ENDED
                     && ['UNSTARTED', 'PAUSED'].includes(NOVA.PLAYERSTATE[player.getPlayerState()])
                  ) {
                     // console.debug('play video in focus');
                     video.play();
                  }
               });
            }
            // if tab unfocus apply pause
            window.addEventListener('storage', store => {
               if (document.visibilityState === 'hidden' // tab unfocus
                  && store.key === storeName && store.storageArea === localStorage // checking now store
                  && localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID // has storage
               ) {
                  // console.debug('video pause', localStorage[storeName]);
                  video.pause();
               }
            });

         });

      // replaced with generic HTML5 method
      // const onPlayerStateChange = state => ('PLAYING' == NOVA.PLAYERSTATE[state]) ? localStorage.setItem(storeName, instanceID) : removeStorage();
      // NOVA.waitElement('#movie_player')
      //    .then(player => {
      //       player.addEventListener('onStateChange', onPlayerStateChange.bind(player));

      //       // remove storage if this tab closed
      //       window.addEventListener('beforeunload', removeStorage);

      //       window.addEventListener('storage', store => {
      //          if (
      //             // checking the right item
      //             store.key === storeName && store.storageArea === localStorage
      //             // has storage
      //             && localStorage[storeName] && localStorage[storeName] !== instanceID
      //             // this player is playing
      //             && NOVA.PLAYERSTATE[player.getPlayerState()] === 'PLAYING'
      //          ) {
      //             console.debug('pause player', localStorage[storeName]);
      //             player.pauseVideo();
      //          }
      //       });

      //    });

   },
   options: {
      pause_background_tab_onfocus: {
         _tagName: 'input',
         label: 'Autoplay on focus tab',
         type: 'checkbox',
         // title: '',
      },
   },
});
