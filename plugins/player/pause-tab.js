_plugins.push({
   name: 'Pauses playing videos in other tabs',
   id: 'pause-background-tab',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      const storeName = 'playngInstanceIDTab';
      // Generate a random script instance ID
      const instanceID = YDOM.getURLParams().get('v') + '-' + Math.round(Math.random() * 10);

      YDOM.waitHTMLElement('.html5-video-player', videoPlayer => {
         const removeStorage = () => localStorage.removeItem(storeName);

         // 1- unstarted
         // 0- ended
         // 1- playing
         // 2- paused
         // 3- buffering
         // 5- video cued
         const onPlayer = state => (1 === state) ? localStorage.setItem(storeName, instanceID) : removeStorage();

         videoPlayer.addEventListener("onStateChange", onPlayer.bind(this));

         window.addEventListener('storage', event => {
            if (event.key === storeName && event.storageArea === localStorage // checking the right item
               && localStorage[storeName] && localStorage[storeName] !== instanceID // has storage
               && videoPlayer.getPlayerState() === 1) { // this player is playing
               console.log('pause player', localStorage[storeName]);
               videoPlayer.pauseVideo();
            }
         });

         // remove storage if this tab closed
         window.addEventListener("beforeunload", event => removeStorage());

      });

   },
});
