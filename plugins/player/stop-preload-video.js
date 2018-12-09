_plugins.push({
   name: 'Stop Video Preload',
   id: 'stop-preload',
   section: 'player',
   depends_page: 'watch',
   // sandbox: false,
   desc: 'Disables Preload',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#movie_player', function (playerId) {

         if (user_settings['stop-preload-ignore-playlist'] && window.location.href.indexOf('list=') !== -1) return;

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
            if (state === 1 
               // || state === 3
               // Error: Your browser does not currently recognize any of the video formats 
               ) {
               // console.log('stopVideo');
               clearInterval(wait_pause);
               playerId.stopVideo();
            }
         }

      });

   },
   export_opt: (function (data) {
      return {
         'stop-preload-ignore-playlist': {
            _elementType: 'input',
            label: 'ignore playlist',
            type: 'checkbox',
         },
      };
   }()),
});
