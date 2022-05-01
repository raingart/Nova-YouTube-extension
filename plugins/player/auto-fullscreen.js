window.nova_plugins.push({
   id: 'player-fullscreen-mode',
   title: 'Player full-screen mode',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('#movie_player:not(.ad-showing) video')
         .then(video => {
            // video.addEventListener('canplay', setFullscreen.bind(video));
            video.addEventListener('play', setFullscreen.bind(video));

            // exit fullscreen
            if (user_settings.player_fullscreen_mode_exit) {
               movie_player.addEventListener('onStateChange', state => {
                  if (document.fullscreen && movie_player.isFullscreen() && (NOVA.getPlayerState(state) == 'ENDED')) {
                     // movie_player.toggleFullscreen();
                     document.exitFullscreen();
                  }
               });
            }
         });

      function setFullscreen() {
         if (!movie_player.isFullscreen()) {
            movie_player.toggleFullscreen();
         }
      }

   },
   options: {
      player_fullscreen_mode_exit: {
         _tagName: 'input',
         // label: 'Exit Fullscreen on Video End',
         label: 'Exit if video ends',
         'label:zh': '如果视频结束则退出',
         'label:ja': 'ビデオが終了したら終了します',
         'label:ko': '비디오가 끝나면 종료',
         'label:es': 'Salir si el video termina',
         'label:pt': 'Sair se o vídeo terminar',
         'label:fr': 'Quitter si la vidéo se termine',
         // 'label:tr': 'Video biterse çık',
         'label:de': 'Beenden, wenn das Video endet',
         type: 'checkbox',
      },
   },
});
