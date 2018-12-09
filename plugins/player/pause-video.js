_plugins.push({
   name: 'Auto pause video',
   id: 'stop-autoplay',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'Pause video autoplay',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#movie_player', function (playerId) {

         if (user_settings['stop-autoplay-ignore-playlist'] && window.location.href.indexOf('list=') !== -1) return;

         // playerId.addEventListener("onStateChange", _onStateChange.bind(this));
         let wait_pause = setInterval(() => {
            _onStateChange(playerId.getPlayerState());
         }, 50);

         function _onStateChange(state) {
            // console.log('state', state);
            // 1- unstarted
            // 0- ended
            // 1- playing
            // 2- paused
            // 3- buffering
            // 5- video cued
            if (state === 1) {
               // console.log('pauseVideo');
               clearInterval(wait_pause);
               playerId.pauseVideo();
            }
         }

      });

   },
   export_opt: (function (data) {
      return {
         'stop-autoplay-ignore-playlist': {
            _elementType: 'input',
            label: 'ignore playlist',
            type: 'checkbox',
         },
      };
   }()),
});
