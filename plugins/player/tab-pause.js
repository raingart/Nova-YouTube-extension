_plugins_conteiner.push({
   id: 'pause-background-tab',
   title: 'Pauses playing videos in other tabs',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Supports frames and open browser windows',
   _runtime: user_settings => {

      const
         storeName = 'playngInstanceIDTab',
         instanceID = Math.random(); // Generate a random script instance ID

      YDOM.waitElement('.html5-video-player') // replace "#movie_player" for embed page
         .then(player => {
            const removeStorage = () => localStorage.removeItem(storeName);
            // -1: unstarted
            // 0: ended
            // 1: playing
            // 2: paused
            // 3: buffering
            // 5: video cued
            const onPlayer = state => (1 === state) ? localStorage.setItem(storeName, instanceID) : removeStorage();

            player.addEventListener("onStateChange", onPlayer.bind(this));

            // remove storage if this tab closed
            window.addEventListener("beforeunload", event => removeStorage());

            window.addEventListener('storage', event => {
               if (
                  // checking the right item
                  event.key === storeName && event.storageArea === localStorage
                  // has storage
                  && localStorage[storeName] && localStorage[storeName] !== instanceID
                  // this player is playing
                  && player.getPlayerState() === 1
               ) {
                  console.debug('pause player', localStorage[storeName]);
                  player.pauseVideo();
               }
            });

         });

   },
});
