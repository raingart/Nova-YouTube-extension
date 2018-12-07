_plugins.push({
   name: 'Stop Video Preload',
   id: 'stop-preload',
   section: 'player',
   depends_page: 'watch',
   // sandbox: false,
   desc: 'Disables Preload',
   // version: '0.1',
   _runtime: function (user_settings) {

      // page re-connect (fix to direct olugin)
      document.addEventListener('yt-navigate-start', function () {
         _set_stop_preload(document.getElementById('movie_player'));
      });

      // page load
      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         _set_stop_preload(playerId);
      });

      function _set_stop_preload(playerId) {
         playerId.addEventListener("onStateChange", _onStateChange.bind(this));

         function _onStateChange(state) {
            // console.log('state', state);
            // 1- unstarted
            // 0- ended
            // 1- playing
            // 2- paused
            // 3- buffering
            // 5- video cued
            if (state >= 1 && state <= 3)
               playerId.stopVideo();
         }

      }

   },
});
