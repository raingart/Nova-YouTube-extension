window.nova_plugins.push({
   id: 'player-fullscreen-mode',
   title: 'Auto full-screen on playback',
   'title:zh': '播放时自动全屏',
   'title:ja': '再生時に全画面表示',
   'title:ko': '재생 시 자동 전체 화면',
   'title:es': 'Pantalla completa automática en reproducción',
   'title:pt': 'Tela cheia automática na reprodução',
   'title:fr': 'Plein écran automatique lors de la lecture',
   // 'title:tr': '',
   'title:de': 'Automatischer Vollbildmodus bei Wiedergabe',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // NOVA.waitElement('#movie_player:not(.ad-showing) video')
      NOVA.waitElement('video')
         .then(video => {
            // video.addEventListener('canplay', setFullscreen.bind(video));
            video.addEventListener('play', setFullscreen.bind(video));

            // exit fullscreen
            if (user_settings.player_fullscreen_mode_exit) {
               // Strategy 1
               video.addEventListener('ended', exitFullscreen);
               video.addEventListener('pause', exitFullscreen);
               // Strategy 2
               // movie_player.addEventListener('onStateChange', state => {
               //    if (document.fullscreen && movie_player.isFullscreen() && (NOVA.getPlayerState(state) == 'ENDED')) {
               //       movie_player.toggleFullscreen();
               //    }
               // });
            }
         });

      function setFullscreen() {
         if (movie_player.classList.contains('ad-showing')) return;

         if (!movie_player.isFullscreen()) {
            if (location.host == 'm.youtube.com') {
               document.body.querySelector('button.fullscreen-icon')?.click();

            } else {
               movie_player.toggleFullscreen();
            }
         }
      }

      function exitFullscreen() {
         document.fullscreenElement && document.exitFullscreen()
      }

   },
   options: {
      player_fullscreen_mode_exit: {
         _tagName: 'input',
         // label: 'Exit Fullscreen on Video End',
         label: 'Exit fullscreen on pause/ends',
         'label:zh': '暂停时退出全屏',
         'label:ja': '一時停止時に全画面表示を終了',
         'label:ko': '일시중지 시 전체화면 종료',
         'label:es': 'Salir de pantalla completa en pausa',
         'label:pt': 'Sair da tela cheia na pausa',
         'label:fr': 'Quitter le plein écran en pause',
         'label:de': 'Beenden Sie den Vollbildmodus bei Pause',
         type: 'checkbox',
      },
   }
});
