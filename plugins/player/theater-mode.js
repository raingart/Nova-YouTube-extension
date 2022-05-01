window.nova_plugins.push({
   id: 'theater-mode',
   title: 'Player full-with mode',
   'title:zh': '播放器全模式',
   'title:ja': 'プレーヤーフル-モード付き',
   'title:ko': '플레이어 풀-위드 모드',
   'title:es': 'Reproductor completo con modo',
   'title:pt': 'Modo de jogador completo',
   'title:fr': 'Mode lecteur complet avec',
   // 'title:tr': 'Oyuncu tam mod',
   'title:de': 'Player full-with-modus',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'Auto enable player full-width mode',
   // 'desc:zh': '自动为播放器启用全宽模式',
   // 'desc:ja': 'プレーヤーの全幅モードを自動有効にする',
   // 'desc:ko': '플레이어 전체 너비 모드 자동 활성화',
   // 'desc:pt': 'Habilitar automaticamente o modo de largura total do player',
   // 'desc:fr': 'Activer automatiquement le mode pleine largeur du lecteur',
   // 'desc:tr': 'Oyuncu tam genişlik modunu otomatik etkinleştir',
   // 'desc:de': 'Player-Modus mit voller Breite automatisch aktivieren',
   // 'desc:es': 'Activar automáticamente el modo de ancho completo del reproductor',
   _runtime: user_settings => {

      // NOVA.waitElement('ytd-watch-flexy:not([theater])') // wrong way. Reassigns manual exit from the mode
      NOVA.waitElement('ytd-watch-flexy')
         .then(el => el.theaterModeChanged_(true));

      NOVA.waitElement('#masthead-container, #movie_player')
         .then(() => {
            const
               PLAYER_CONTEINER_SELECTOR = 'ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container', // fix for "player-pin-scroll" plugin
               PLAYER_SELECTOR = `${PLAYER_CONTEINER_SELECTOR} #movie_player:not(.player-float)`, // fix for "player-pin-scroll" plugin
               zIindex = Math.max(
                  NOVA.css.getValue({ selector: '#masthead-container', property: 'z-index' }),
                  NOVA.css.getValue({ selector: '#movie_player', property: 'z-index' }),
                  2020);

            if (user_settings.player_full_viewport_mode) {
               NOVA.css.push(
                  `${PLAYER_SELECTOR}${user_settings.player_full_viewport_mode_exit
                     ? `.playing-mode, ${PLAYER_SELECTOR}.paused-mode` : ''} {
                     width: 100vw;
                     height: 100vh;
                     position: fixed;
                     bottom: 0 !important;
                     z-index: ${zIindex};
                     background-color: black;
                  }`);

               // fix restore controlbar position
               NOVA.waitElement('video')
                  .then(video => video.addEventListener('pause', () => window.dispatchEvent(new Event('resize'))));
            }

            // cinema_mode
            // alt - https://greasyfork.org/en/scripts/419359-youtube-simple-cinema-mode
            if (user_settings.cinema_mode) {
               NOVA.css.push(
                  PLAYER_CONTEINER_SELECTOR + ` { z-index: ${zIindex}; }

                  ${PLAYER_SELECTOR}:before {
                     content: '';
                     position: fixed;
                     top: 0;
                     left: 0;
                     width: 100%;
                     height: 100%;
                     background: rgba(0, 0, 0, ${+user_settings.cinema_mode_opacity});
                     opacity: 0;
                     transition: opacity .4s ease-in-out;
                     pointer-events: none;
                  }

                  /*#movie_player.paused-mode:before,*/
                  ${PLAYER_SELECTOR}.playing-mode:before {
                     opacity: 1;
                  }

                  /* fix */
                  .ytp-ad-player-overlay,
                  #playlist:hover,
                  #masthead-container:hover,
                  iframe, /*search result box*/
                  #guide,
                  [class*="popup"],
                  [role="navigation"],
                  [role="dialog"] {
                     z-index: ${zIindex + 1};
                  }
                  #playlist:hover {
                     position: relative;
                  }`);
            }
         });

   },
   options: {
      player_full_viewport_mode: {
         _tagName: 'input',
         label: 'Full-viewport mode',
         'label:zh': '全屏模式',
         'label:ja': 'フルスクリーンモード',
         'label:ko': '전체 화면으로보기',
         'label:es': 'Modo de pantalla completa',
         'label:pt': 'Modo tela cheia',
         'label:fr': 'Mode plein écran',
         // 'label:tr': 'Tam ekran modu',
         'label:de': 'Vollbildmodus',
         type: 'checkbox',
         // title: '',
      },
      player_full_viewport_mode_exit: {
         _tagName: 'input',
         // label: 'Exit Fullscreen on Video End',
         label: 'Exit if video ends/pause',
         'label:zh': '如果视频结束/暂停则退出',
         'label:ja': 'ビデオが終了/一時停止した場合に終了',
         'label:ko': '비디오가 끝나면 종료/일시중지',
         'label:es': 'Salir si el video termina/pausa',
         'label:pt': 'Sair se o vídeo terminar/pausar',
         'label:fr': 'Quitter si la vidéo se termine/pause',
         // 'label:tr': 'Video biterse/duraklatılırsa çıkın',
         'label:de': 'Beenden, wenn das Video endet/pausiert',
         type: 'checkbox',
         'data-dependent': '{"player_full_viewport_mode":"true"}',
      },
      cinema_mode: {
         _tagName: 'input',
         label: 'Cinema mode',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         title: 'The page goes dark while the video is playing',
         'title:zh': '播放视频时页面会变暗',
         'title:ja': 'ビデオの再生中、ページは暗くなります',
         'title:ko': '비디오가 재생되는 동안 페이지가 어두워집니다.',
         'title:es': 'Mientras se reproduce el video, la página se oscurecerá',
         'title:pt': 'Enquanto o vídeo estiver sendo reproduzido, a página ficará escura',
         'title:fr': "Pendant la lecture de la vidéo, la page s'assombrit",
         // 'title:tr': 'Video oynatılırken sayfa kararacak',
         'title:de': 'Während das Video abgespielt wird, wird die Seite dunkel',
      },
      cinema_mode_opacity: {
         _tagName: 'input',
         label: 'Opacity',
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         'label:ko': '불투명',
         'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         // 'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         type: 'number',
         title: '0-1',
         placeholder: '0-1',
         step: .05,
         min: 0,
         max: 1,
         value: .85,
         'data-dependent': '{"cinema_mode":"true"}',
      },
   }
});
