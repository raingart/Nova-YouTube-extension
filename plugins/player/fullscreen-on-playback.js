window.nova_plugins.push({
   id: 'player-fullscreen-mode',
   // title: 'Auto fullscreen player,
   title: 'Auto fullscreen on playback',
   'title:zh': '播放时自动全屏',
   'title:ja': '再生時に全画面表示',
   'title:ko': '재생 시 자동 전체 화면',
   'title:id': 'Layar penuh otomatis saat diputar',
   'title:es': 'Pantalla completa automática en reproducción',
   'title:pt': 'Tela cheia automática na reprodução',
   'title:fr': 'Plein écran automatique lors de la lecture',
   'title:it': 'Schermo intero automatico durante la riproduzione',
   // 'title:tr': 'Oynatmada otomatik tam ekran',
   'title:de': 'Automatischer Vollbildmodus bei Wiedergabe',
   'title:pl': 'Pełny ekran podczas odtwarzania',
   'title:ua': 'Автоматичне ввімкнення повного екрану при відтворенні',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // embed but not iframe
      if (NOVA.currentPage == 'embed' && (window.self === window.top)) return; // !window.frameElement

      if (user_settings.player_fullscreen_mode_embed && NOVA.currentPage != 'embed') return;

      // NOVA.waitElement('#movie_player video')
      NOVA.waitElement('video')
         .then(video => {
            // init
            video.addEventListener('play', setFullscreen.bind(video), { capture: true, once: true });
            // on page change (new video)
            video.addEventListener('loaddata', setFullscreen.bind(video));

            video.addEventListener('ended', exitFullscreen);

            // exit fullscreen
            if (user_settings.player_fullscreen_mode_onpause) {
               // Strategy 1
               video.addEventListener('pause', () => {
                  // fix overlapped ".paused-mode" after you scroll the time in the player with the mouse
                  if (!document.querySelector('.ytp-progress-bar')?.contains(document.activeElement)) {
                     exitFullscreen();
                  }
               });
               video.addEventListener('play', setFullscreen.bind(video));
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

         if (!document.fullscreenElement) {
            // Strategy 1
            movie_player.requestFullscreen()
               .catch(error => console.error('Fullscreen not allowed', error)); // fix. silent error
            // Strategy 2
            // if (location.host == 'm.youtube.com') {
            //    document.body.querySelector('button.fullscreen-icon')?.click();
            // }
            // else movie_player.toggleFullscreen();
         }
      }

      function exitFullscreen() {
         // WTF - TypeError: Failed to execute 'exitFullscreen' on 'Document': Illegal invocation
         document.fullscreenElement && document?.exitFullscreen();
      }

   },
   options: {
      player_fullscreen_mode_embed: {
         _tagName: 'select',
         label: 'Apply to video type',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         'label:ua': 'Застосувати до відео',
         options: [
            {
               label: 'all', value: false, selected: true,
               'label:ua': 'всіх',
            },
            {
               label: 'embed', value: 'on',
               'label:ua': 'вбудованих',
            },
         ],
         title: 'Unavailable if emded fullscreen is not allow',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
      },
      player_fullscreen_mode_onpause: {
         _tagName: 'input',
         // label: 'Exit full screen mode if video is paused',
         label: 'Exit on video pause',
         'label:zh': '如果视频暂停，则退出全屏模式',
         'label:ja': 'ビデオが一時停止している場合は、全画面表示モードを終了します',
         'label:ko': '비디오가 일시 중지되면 전체 화면 모드 종료',
         'label:id': 'Keluar dari mode layar penuh jika video dijeda',
         'label:es': 'Salga del modo de pantalla completa si el video está en pausa',
         'label:pt': 'Saia do modo de tela cheia se o vídeo estiver pausado',
         'label:fr': 'Quitter le mode plein écran si la vidéo est en pause',
         'label:it': 'Uscire dalla modalità a schermo intero se il video è in pausa',
         // 'label:tr': 'Video duraklatılırsa tam ekran modundan çıkın',
         'label:de': 'Beenden Sie den Vollbildmodus, wenn das Video angehalten ist',
         'label:pl': 'Wyjdź z trybu pełnoekranowego, jeśli wideo jest wstrzymane',
         'label:ua': 'Вихід з повного екрану зупиняє відео',
         type: 'checkbox',
      },
   }
});
