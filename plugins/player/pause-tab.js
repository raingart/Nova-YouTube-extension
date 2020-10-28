_plugins.push({
   name: 'Pauses playing videos in other tabs',
   id: 'pause-background-tab',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Supports frames and open browser windows',
   _runtime: user_settings => {

      const
         storeName = 'playngInstanceIDTab',
         instanceID = Math.random(); // Generate a random script instance ID

      YDOM.waitHTMLElement({
         selector: '.html5-video-player', // replace "#movie_player" for embed page
         callback: videoPlayer => {
            const removeStorage = () => localStorage.removeItem(storeName);

            // -1: unstarted
            // 0: ended
            // 1: playing
            // 2: paused
            // 3: buffering
            // 5: video cued
            const onPlayer = state => (1 === state) ? localStorage.setItem(storeName, instanceID) : removeStorage();

            videoPlayer.addEventListener("onStateChange", onPlayer.bind(this));

            // remove storage if this tab closed
            window.addEventListener("beforeunload", event => removeStorage());

            window.addEventListener('storage', event => {
               if (
                  // checking the right item
                  event.key === storeName && event.storageArea === localStorage
                  // has storage
                  && localStorage[storeName] && localStorage[storeName] !== instanceID
                  // this player is playing
                  && videoPlayer.getPlayerState() === 1
               ) {
                  console.debug('pause player', localStorage[storeName]);
                  videoPlayer.pauseVideo();
               }
            });

         },
      });

   },
});
