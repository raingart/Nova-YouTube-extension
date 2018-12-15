_plugins.push({
   name: 'Stop Video Preload',
   id: 'stop-preload',
   section: 'player',
   depends_page: 'watch, channel',
   desc: 'Disables Preload',
   _runtime: user_settings => {

      YDOM.waitFor('.html5-video-player', playerId => {
         let is_stop_video;
         
         playerId.addEventListener("onStateChange", onPlayerStateChange.bind(this));

         function onPlayerStateChange(state) {
            // console.log('onStateChange', state);

            if (user_settings['stop-preload-ignore-playlist'] && window.location.href.indexOf('list=') !== -1) return;

            let typePage = YDOM.getPageType();

            if ((typePage == 'channel' && user_settings['stop-preload-homepage-video'] == 'watch') ||
               (typePage == 'watch' && user_settings['stop-preload-homepage-video'] == 'channel')) {
               return;
            }

            // 1- unstarted
            // 0- ended
            // 1- playing
            // 2- paused
            // 3- buffering
            // 5- video cued
            if ((1 === state || 3 === state) && !is_stop_video) {
               is_stop_video = true;
               playerId.stopVideo();
               // console.log('stopVideo');

            } else if (-1 === state || 0 === state) {
               is_stop_video = false;
            }
         }

      });

   },
   export_opt: (function () {
      return {
         'stop-preload-ignore-playlist': {
            _elementType: 'input',
            label: 'Ignore Playlist',
            title: 'Preload will work in playlist',
            type: 'checkbox',
         },
         'stop-preload-homepage-video': {
            _elementType: 'select',
            label: 'Stop preload on selected page',
            options: [
               /* beautify preserve:start */
               { label: 'all', value: 'all', selected: true },
               { label: 'watch', value: 'watch' },
               { label: 'channel', value: 'channel' },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
