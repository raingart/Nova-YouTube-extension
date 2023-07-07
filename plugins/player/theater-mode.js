window.nova_plugins.push({
   id: 'theater-mode',
   title: 'Theater mode',
   // 'title:zh': '播放器全模式',
   // 'title:ja': 'プレーヤーフル-モード付き',
   // 'title:ko': '플레이어 풀-위드 모드',
   // 'title:id': '',
   // 'title:es': 'Reproductor completo con modo',
   // 'title:pt': 'Modo de jogador completo',
   // 'title:fr': 'Mode lecteur complet avec',
   // 'title:it': '',
   // 'title:tr': 'Oyuncu tam mod',
   // 'title:de': 'Player full-with-modus',
   'title:pl': 'Tryb kinowy',
   'title:ua': 'Режим кінотеарту',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/10523-youtube-always-theater-mode
      // alt2 - https://chrome.google.com/webstore/detail/dgognhgbpdoeidccnbfhohblklhbbomh

      if (user_settings.player_full_viewport_mode == 'redirect_watch_to_embed') {
         return location.assign(`https://www.youtube.com/embed/` + NOVA.queryURL.get('v'));
      }

      // if (ytd_watch.theater) {}
      // // NOVA.waitSelector('ytd-watch-flexy:not([theater])') // wrong way. Reassigns manual exit from the mode
      NOVA.waitSelector('ytd-watch-flexy')
         // .then(el => el.theaterModeChanged_(true));
         .then(el => {
            if (location.search.includes('list=')) {
               if (user_settings.theater_mode_ignore_playlist == 'all'
                  || (user_settings.theater_mode_ignore_playlist == 'music' && NOVA.isMusic())
               ) {
                  el.theaterModeChanged_(false);
                  return;
               }
            }
            el.theaterModeChanged_(true);
         });

      if (user_settings.player_full_viewport_mode == '') return; // for optimization

      // fix conflict with [player-fullscreen-mode] and [embed-popup] plugins
      if ((user_settings['player-fullscreen-mode'] || user_settings['embed-popup'])
         && !user_settings.player_fullscreen_mode_embed
         && user_settings.player_full_viewport_mode != 'cinema_mode'
      ) {
         return;
      }

      NOVA.waitSelector('#movie_player')
         .then(movie_player => {
            // movie_player.addEventListener('SIZE_CLICKED', () => console.debug('SIZE_CLICKED'));
            const
               PLAYER_CONTAINER_SELECTOR = 'ytd-watch-flexy[theater]:not([fullscreen]) #player-wide-container', // fix for "player-pin-scroll" plugin
               // PLAYER_CONTAINER_SELECTOR = 'ytd-watch-flexy[theater]:not([fullscreen]) #player-container',
               // fix for "player-pin-scroll" plugin
               PINNED_SELECTOR = '.nova-player-pin', // fix for "player-pin-scroll" plugin
               PLAYER_SCROLL_LOCK_CLASS_NAME = 'nova-lock-scroll',
               PLAYER_SELECTOR = `${PLAYER_CONTAINER_SELECTOR} #movie_player:not(${PINNED_SELECTOR}):not(.${PLAYER_SCROLL_LOCK_CLASS_NAME})`, // fix for [player-pin-scroll] plugin
               zIindex = Math.max(getComputedStyle(movie_player)['z-index'], 2020);

            addScrollDownBehavior();

            switch (user_settings.player_full_viewport_mode) {
               case 'offset':
                  // alt - https://greasyfork.org/en/scripts/436667-better-youtube-theatre-mode
                  NOVA.css.push(
                     PLAYER_CONTAINER_SELECTOR + ` {
                        min-height: calc(100vh - ${user_settings['header-compact'] ? 36
                        : NOVA.css.getValue('#masthead-container', 'height') || 56
                     // : document.body.querySelector('#masthead-container')?.offsetHeight || 56
                     }px) !important;
                     }`);
                  break;

               case 'force':
                  // alt1 - https://greasyfork.org/en/scripts/434075-youtube-fullscreen-mode
                  // alt2 - https://chrome.google.com/webstore/detail/gkkmiofalnjagdcjheckamobghglpdpm
                  // alt3 - https://greasyfork.org/en/scripts/454092-youtube-theater-fill-up-window
                  // alt4 - https://greasyfork.org/en/scripts/33243-maximizer-for-youtube
                  // alt5 - https://greasyfork.org/en/scripts/442089-pkga-youtube-theater-mode
                  setPlayerFullViewport(user_settings.player_full_viewport_mode_exit);
                  break;

               case 'smart':
                  // exclude shorts page #1
                  if (user_settings.player_full_viewport_mode_exclude_shorts && NOVA.currentPage == 'shorts') {
                     return;
                  }

                  NOVA.waitSelector('video')
                     .then(video => {
                        video.addEventListener('loadeddata', function () {
                           // exclude shorts page #2
                           if (user_settings.player_full_viewport_mode_exclude_shorts && this.videoWidth < this.videoHeight) {
                              return;
                           }
                           const miniSize = NOVA.aspectRatio.sizeToFit({
                              'srcWidth': this.videoWidth,
                              'srcHeight': this.videoHeight,
                              // 'maxWidth': window.innerWidth,
                              // 'maxHeight': window.innerHeight,
                           });
                           // out of viewport
                           if (miniSize.width < window.innerWidth) {
                              setPlayerFullViewport('player_full_viewport_mode_exit');
                           }
                        });
                     });
                  break;

               case 'cinema_mode':
                  // alt1 - https://greasyfork.org/en/scripts/419359-youtube-simple-cinema-mode
                  // alt2 - https://chrome.google.com/webstore/detail/bfbmjmiodbnnpllbbbfblcplfjjepjdn
                  NOVA.css.push(
                     PLAYER_CONTAINER_SELECTOR + ` {
                        z-index: ${zIindex};
                     }

                     ${PLAYER_SELECTOR}:before {
                        content: '';
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, ${+user_settings.cinema_mode_opacity});
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

                  addHideScrollbarCSS();
                  break;
            }

            function setPlayerFullViewport(exclude_pause) {
               const CLASS_OVER_PAUSED = 'nova-player-fullviewport';
               // Strategy 1
               NOVA.css.push(
                  `${PLAYER_SELECTOR}.playing-mode,
                  ${exclude_pause ? '' : `${PLAYER_SELECTOR}.paused-mode,`}
                  ${PLAYER_SELECTOR}.${CLASS_OVER_PAUSED} {
                     width: 100vw;
                     height: 100vh;
                     position: fixed;
                     bottom: 0 !important;
                     z-index: ${zIindex};
                     background-color: black;
                  }`);

               // show searchbar on hover. To above v105 https://developer.mozilla.org/en-US/docs/Web/CSS/:has
               NOVA.css.push(
                  `#masthead-container:has( ~ #page-manager ytd-watch-flexy[theater]) {
                     position: fixed;
                     z-index: ${zIindex + 1};
                     opacity: 0;
                  }
                  #masthead-container:has( ~ #page-manager ytd-watch-flexy[theater]):hover,
                  #masthead-container:has( ~ #page-manager ytd-watch-flexy[theater]):focus {
                     opacity: 1;
                  }`);

                  addHideScrollbarCSS();

               // Strategy 2
               // const CLASS_NAME = '';
               // video.addEventListener('play', () => {
               //    movie_player.classList.add(CLASS_NAME)
               // });
               // if (user_settings.player_full_viewport_mode_exit) {
               //    video.addEventListener('pause', () => movie_player.classList.remove(CLASS_NAME));
               // }

               // for fix
               // alt - https://greasyfork.org/en/scripts/436168-youtube-exit-fullscreen-on-video-end
               if (user_settings.player_full_viewport_mode_exit) {

                  NOVA.waitSelector('video')
                     .then(video => {
                        // fix restore video size
                        video.addEventListener('pause', () => {
                           // fix overlapped ".paused-mode" after you scroll the time in the player with the mouse
                           if (!document.body.querySelector('.ytp-progress-bar')?.contains(document.activeElement)) {
                              window.dispatchEvent(new Event('resize'));
                           }
                        });
                        // video.addEventListener('pause', () => window.dispatchEvent(new Event('resize')));
                        // video.addEventListener('playing', () => window.dispatchEvent(new Event('resize')));
                     });

                  // fix overlapped ".paused-mode" after you scroll the time in the player with the mouse
                  NOVA.waitSelector('.ytp-progress-bar')
                     .then(progress_bar => {
                        ['mousedown', 'mouseup'].forEach(evt => {
                           progress_bar.addEventListener(evt, () => {
                              //    // if (movie_player.contains(document.activeElement)) {
                              // if (document.activeElement.matches('.ytp-progress-bar')) {
                              movie_player.classList.add(CLASS_OVER_PAUSED);
                              // }
                           });
                        });
                     });
               }
            }

            // add scroll-down behavior on player control panel
            function addScrollDownBehavior() {
               if (activateScrollElement = document.body.querySelector('.ytp-chrome-controls')) {
                  // const player = document.body.querySelector(PLAYER_SELECTOR);
                  activateScrollElement.addEventListener('wheel', evt => {
                     switch (Math.sign(evt.wheelDelta)) {
                        // case 1: // up
                        //    movie_player.classList.remove(PLAYER_SCROLL_LOCK_CLASS_NAME);
                        //    break;

                        case -1: // down
                           movie_player.classList.add(PLAYER_SCROLL_LOCK_CLASS_NAME);
                           // player.classList.add(PLAYER_SCROLL_LOCK_CLASS_NAME);
                           break;
                     }
                  });
                  // up (on top page)
                  document.addEventListener('scroll', evt => {
                     if (window.scrollY === 0
                        && movie_player.classList.contains(PLAYER_SCROLL_LOCK_CLASS_NAME)
                     ) {
                        movie_player.classList.remove(PLAYER_SCROLL_LOCK_CLASS_NAME);
                     }
                  });
               }
            }

            function addHideScrollbaCSSr() {
               if (user_settings['scrollbar-hide']) return;
               NOVA.css.push(
                  `html body:has(${PLAYER_SELECTOR})::-webkit-scrollbar {
                     display: none;
                  }`);
            }
         });

   },
   options: {
      player_full_viewport_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         options: [
            {
               label: 'default', /*value: '',*/ selected: true,
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
               'label:ua': 'за замовчуванням',
            },
            {
               label: 'cinema', value: 'cinema_mode',
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
               'label:ua': 'кінотеатр',
            },
            {
               label: 'full-viewport (auto)', value: 'smart',
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
               'label:ua': 'повноекранний (авто)',
            },
            {
               label: 'full-viewport', value: 'force',
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
               'label:ua': 'повноекранний',
            },
            {
               label: 'offset', value: 'offset',
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
               // 'label:ua': '',
            },
            {
               label: 'redirect to embedded', value: 'redirect_watch_to_embed',
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
               'label:ua': 'передавати на вбудований',
            },
         ],
      },
      player_full_viewport_mode_exit: {
         _tagName: 'input',
         // label: 'Exit Fullscreen on Video End',
         // label: 'Full-viewport exit if video ends/pause',
         label: 'Exit Fullscreen on video end/pause',
         'label:zh': '视频结束/暂停时退出',
         'label:ja': 'ビデオが終了/一時停止したら終了します',
         'label:ko': '동영상이 종료/일시 중지되면 종료',
         'label:id': 'Keluar dari viewport penuh jika video berakhir/jeda',
         'label:es': 'Salir si el video termina/pausa',
         'label:pt': 'Sair se o vídeo terminar/pausar',
         'label:fr': 'Quitter si la vidéo se termine/pause',
         'label:it': 'Uscita dalla visualizzazione completa se il video termina/mette in pausa',
         // 'label:tr': 'Video biterse/duraklatılırsa çıkın',
         'label:de': 'Beenden, wenn das Video endet/pausiert',
         'label:pl': 'Wyjdź, gdy film się kończy/pauzuje',
         'label:ua': 'Вихід із повного вікна перегляду, якщо відео закінчується/призупиняється',
         type: 'checkbox',
         'data-dependent': { 'player_full_viewport_mode': ['force', 'smart'] },
      },
      player_full_viewport_mode_exclude_shorts: {
         _tagName: 'input',
         label: 'Full-viewport exclude shorts',
         'label:zh': '全视口不包括短裤',
         'label:ja': 'フルビューポートはショートパンツを除外します',
         'label:ko': '전체 뷰포트 제외 반바지',
         'label:id': 'Area pandang penuh tidak termasuk celana pendek',
         'label:es': 'Vista completa excluir pantalones cortos',
         'label:pt': 'Shorts de exclusão da janela de visualização completa',
         'label:fr': 'La fenêtre complète exclut les shorts',
         'label:it': 'La visualizzazione completa esclude i cortometraggi',
         // 'label:tr': 'Tam görünüm alanı şortları hariç tutar',
         'label:de': 'Vollbildansicht schließt Shorts aus',
         'label:pl': 'Pełny ekran wyklucza krótkie filmy',
         'label:ua': 'Повне вікно перегляду без прев`ю',
         type: 'checkbox',
         // title: '',
         'data-dependent': { 'player_full_viewport_mode': 'smart' },
      },
      cinema_mode_opacity: {
         _tagName: 'input',
         label: 'Opacity',
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         'label:ko': '불투명',
         'label:id': 'Kegelapan',
         'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         'label:it': 'Opacità',
         // 'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         'label:pl': 'Przezroczystość',
         'label:ua': 'Прозорість',
         type: 'number',
         title: '0-1',
         placeholder: '0-1',
         step: .05,
         min: 0,
         max: 1,
         value: .75,
         'data-dependent': { 'player_full_viewport_mode': 'cinema_mode' },
      },
      theater_mode_ignore_playlist: {
         _tagName: 'select',
         label: 'Ignore playlist',
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
         // 'label:ua': '',
         options: [
            {
               label: 'false', /*value: '',*/ selected: true,
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
               // 'label:ua': '',
            },
            {
               label: 'all', value: 'all',
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
               // 'label:ua': '',
            },
            {
               label: 'only music', value: 'music',
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
               // 'label:ua': '',
            },
         ],
      },
   }
});
