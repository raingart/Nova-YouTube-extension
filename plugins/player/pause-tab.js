_plugins.push({
   name: 'Pauses playing videos in other tabs',
   id: 'pause-background-tab',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      const storeName = 'playngTab';
      // Generate a random script instance ID
      const instanceID = YDOM.getURLParams().get('v') + '-' + Math.round(Math.random() * 10);

      YDOM.waitHTMLElement('.html5-video-player', videoPlayer => {
         // 1- unstarted
         // 0- ended
         // 1- playing
         // 2- paused
         // 3- buffering
         // 5- video cued
         const onPlayer = state => (1 === state) && localStorage.setItem(storeName, instanceID);

         videoPlayer.addEventListener("onStateChange", onPlayer.bind(this));

         window.addEventListener('storage', event => {
            if (event.storageArea === localStorage && event.key === storeName
               && localStorage[storeName] !== instanceID) {
               // console.log('pause player', localStorage[storeName]);
               videoPlayer.pauseVideo();
            }
         });

      });

   },
});
