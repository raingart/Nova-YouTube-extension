_plugins_conteiner.push({
   id: 'video-autopause',
   title: 'Video autopause',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Disables autoplay',
   _runtime: user_settings => {

      let is_change_quality;

      YDOM.waitElement('#movie_player')
         .then(player => {
            player.addEventListener('onStateChange', onPlayerStateChange.bind(player));
         });

      function onPlayerStateChange(state) {
         // console.debug('onStateChange', ...arguments);

         if (user_settings.video_autopause_ignore_playlist && location.href.includes('list=')) return;

         // -1: unstarted
         // 0: ended
         // 1: playing
         // 2: paused
         // 3: buffering
         // 5: cued
         if (1 === state && !is_change_quality) {
            is_change_quality = true;
            this.pauseVideo();
            // console.debug('pauseVideo', state);

         } else if (state <= 0) is_change_quality = false;
      }

   },
   options: {
      video_autopause_ignore_playlist: {
         _tagName: 'input',
         label: 'ignore playlist',
         type: 'checkbox',
      },
   },
});
