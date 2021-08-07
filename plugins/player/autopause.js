window.nova_plugins.push({
   id: 'video-autopause',
   title: 'Video autopause',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Disables autoplay',
   _runtime: user_settings => {

      let is_change_quality;

      NOVA.waitElement('#movie_player')
         .then(player => {
            player.addEventListener('onStateChange', onPlayerStateChange.bind(player));
         });

      function onPlayerStateChange(state) {
         // console.debug('playerState', NOVA.PLAYERSTATE[state]);
         if (user_settings.video_autopause_ignore_playlist && location.href.includes('list=')) return;

         // if (1 === state && !is_change_quality) {
         if ('PLAYING' == NOVA.PLAYERSTATE[state] && !is_change_quality) {
            is_change_quality = true;
            this.pauseVideo();
            // console.debug('pauseVideo', NOVA.PLAYERSTATE[state]);

            // } else if ('UNSTARTED' == NOVA.PLAYERSTATE[state] || 'ENDED' == NOVA.PLAYERSTATE[state]) {
         } else if (state <= 0) {
            is_change_quality = false;
         }
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
