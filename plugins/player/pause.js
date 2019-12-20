_plugins.push({
   name: 'Video autopause',
   id: 'pause-autoplay',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Disables autoplay',
   _runtime: user_settings => {

      YDOM.waitHTMLElement('.html5-video-player', videoPlayer => {
         let is_change_quality;

         videoPlayer.addEventListener("onStateChange", onPlayerStateChange.bind(this));

         function onPlayerStateChange(state) {
            // console.log('onStateChange', state);

            if (user_settings.stop_autoplay_ignore_playlist && window.location.href.includes('list=')) return;

            // 1- unstarted
            // 0- ended
            // 1- playing
            // 2- paused
            // 3- buffering
            // 5- video cued
            if (1 === state && !is_change_quality) {
               is_change_quality = true;
               videoPlayer.pauseVideo();
               // console.log('pauseVideo');

            } else if (-1 === state || 0 === state) {
               is_change_quality = false;
            }
         }

      });

   },
   export_opt: (function () {
      return {
         'stop_autoplay_ignore_playlist': {
            _elementType: 'input',
            label: 'ignore playlist',
            type: 'checkbox',
         },
      };
   }()),
});
