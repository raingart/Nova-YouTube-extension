_plugins.push({
   name: 'Stop AutoPlay',
   id: 'stop-video-autoplay',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'Pauses videos',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         // // playerId.addEventListener("onStateChange", onStateChange.bind(this));

         // function _onStateChange(state) {
         //    // 1 – unstarted
         //    // 0 – ended
         //    // 1 – playing
         //    // 2 – paused
         //    // 3 – buffering
         //    // 5 – video cued
         //    console.log('state', state);
         //    if (state === 1 || state === 3) {
         //       playerId.pauseVideo();
         //    }
         // }
         
         let wait_buffering = setInterval(() => {
            // 1 – unstarted
            // 0 – ended
            // 1 – playing
            // 2 – paused
            // 3 – buffering
            // 5 – video cued
            // console.log('getPlayerState', playerId.getPlayerState());
            if (playerId.getPlayerState() !== 3) {
               // console.log('getPlayerState ok');
               clearInterval(wait_buffering);
               playerId.pauseVideo();
            }
         }, 50);
      })

   },
});
