_plugins.push({
   name: 'Stop Video Preload',
   id: 'stop-preload',
   section: 'player',
   depends_page: 'watch',
   // sandbox: false,
   desc: 'Disables Preload',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('.html5-video-player', function (playerId) {

         let is_change_quality;

         playerId.addEventListener("onStateChange", onPlayerStateChange.bind(this));

         function onPlayerStateChange(state) {
            // console.log('onStateChange', state);

            if (user_settings['stop-preload-ignore-playlist'] && window.location.href.indexOf('list=') !== -1) return;

            // if ((1 === state || 3 === state) && !is_change_quality) {
            // Error: Your browser does not currently recognize any of the video formats 
            if ((1 === state) && !is_change_quality) {
               is_change_quality = true;
               // 1- unstarted
               // 0- ended
               // 1- playing
               // 2- paused
               // 3- buffering
               // 5- video cued
               playerId.stopVideo();
               // console.log('stopVideo');

            } else if (-1 === state || 0 === state) {
               is_change_quality = false;
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
