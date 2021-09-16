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
            // mark active
            video.addEventListener('playing', () => localStorage.setItem(storeName, instanceID));
            // remove mark
            ['pause', 'suspend', 'ended'].forEach(evt => {
               video.addEventListener(evt, removeStorage);
            });
            // remove storage if tab closed
            window.addEventListener('beforeunload', removeStorage);

            window.addEventListener('storage', store => {
               if (store.key === storeName && store.storageArea === localStorage // checking the right item
                  // has storage
                  && localStorage[storeName] && localStorage[storeName] !== instanceID
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
      //             && player.getPlayerState() === 1 // 1 = PLAYING
      //          ) {
      //             console.debug('pause player', localStorage[storeName]);
      //             player.pauseVideo();
      //          }
      //       });

      //    });

   },
});
