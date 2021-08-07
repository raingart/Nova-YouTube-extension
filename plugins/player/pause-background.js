window.nova_plugins.push({
   id: 'pause-background-tab',
   title: 'Pauses playing videos in other tabs',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Supports iframes and other windows',
   _runtime: user_settings => {

      const
         storeName = 'playngInstanceIDTab',
         instanceID = Math.random(), // Generate a random script instance ID
         removeStorage = () => localStorage.removeItem(storeName),
         onPlayerStateChange = state => (1 === state) ? localStorage.setItem(storeName, instanceID) : removeStorage(); // 1: playing

      NOVA.waitElement('#movie_player')
         .then(player => {
            // redirection for localStorage common storage space
            if (location.hostname.includes('youtube-nocookie.com')) location.hostname = 'youtube.com';

            player.addEventListener('onStateChange', onPlayerStateChange.bind(player));

            // remove storage if this tab closed
            window.addEventListener('beforeunload', removeStorage);

            window.addEventListener('storage', store => {
               if (
                  // checking the right item
                  store.key === storeName && store.storageArea === localStorage
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
