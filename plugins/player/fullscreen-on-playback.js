window.nova_plugins.push({
   id: 'player-fullscreen-mode',
   // title: 'Auto full screen player,
   title: 'Auto full screen on playback',
   'title:zh': '播放时自动全屏',
   'title:ja': '再生時に全画面表示',
   'title:ko': '재생 시 자동 전체 화면',
   'title:id': 'Layar penuh otomatis saat diputar',
   'title:es': 'Pantalla completa automática en reproducción',
   'title:pt': 'Tela cheia automática na reprodução',
   'title:fr': 'Plein écran automatique lors de la lecture',
   'title:it': 'Schermo intero automatico durante la riproduzione',
   'title:tr': 'Oynatmada otomatik tam ekran',
   'title:de': 'Automatischer Vollbildmodus bei Wiedergabe',
   'title:pl': 'Pełny ekran podczas odtwarzania',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            // init
            video.addEventListener('play', setFullscreen.bind(video), { capture: true, once: true });
            // on page reload
            video.addEventListener('loaddata', setFullscreen.bind(video));
            video.addEventListener('ended', exitFullscreen);

            // exit fullscreen
            if (user_settings.player_fullscreen_mode_onpause) {
               // Strategy 1
               video.addEventListener('play', setFullscreen.bind(video));
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
      player_fullscreen_mode_onpause: {
         _tagName: 'input',
         label: 'Exit full screen mode if video is paused',
         'label:zh': '如果视频暂停，则退出全屏模式',
         'label:ja': 'ビデオが一時停止している場合は、全画面表示モードを終了します',
         'label:ko': '비디오가 일시 중지되면 전체 화면 모드 종료',
         'label:id': 'Keluar dari mode layar penuh jika video dijeda',
         'label:es': 'Salga del modo de pantalla completa si el video está en pausa',
         'label:pt': 'Saia do modo de tela cheia se o vídeo estiver pausado',
         'label:fr': 'Quitter le mode plein écran si la vidéo est en pause',
         'label:it': 'Uscire dalla modalità a schermo intero se il video è in pausa',
         'label:tr': 'Video duraklatılırsa tam ekran modundan çıkın',
         'label:de': 'Beenden Sie den Vollbildmodus, wenn das Video angehalten ist',
         'label:pl': 'Wyjdź z trybu pełnoekranowego, jeśli wideo jest wstrzymane',
         type: 'checkbox',
      },
   }
});
