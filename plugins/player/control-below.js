window.nova_plugins.push({
   id: 'player-control-below',
   title: 'Control panel below the player',
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
   'title:ua': 'Панель керування під плеєром',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'Move player controls down',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   // 'desc:ua': 'Перемістити елементи керування плеєром до низу',
   _runtime: user_settings => {

      // alt1 - https://chrome.google.com/webstore/detail/chpodcedholiggcllnmmjlnghllddgmj
      // alt2 - https://greasyfork.org/en/scripts/469704-youtube-player-controls-below-video
      // alt3 - https://greasyfork.org/en/scripts/976-youtube-right-side-description
      // alt4 - https://greasyfork.org/en/scripts/474286-always-show-the-control-bar-below-the-video

      // if (['cinema_mode', 'force'].includes(user_settings.player_full_viewport_mode)) return; // conflict with plugin [theater-mode]
      // if (user_settings['player-float-progress-bar']) return; // conflict with plugin [player-float-progress-bar]

      NOVA.waitSelector('.ytp-chrome-bottom')
         .then(async control_panel => {

            // const { height } = window.getComputedStyle(control_panel); // can't rename a variable
            if ((heightPanel = NOVA.css.getValue(control_panel, 'height'))
               && (heightProgressBar = NOVA.css.getValue('.ytp-progress-bar-container', 'height'))
            ) {
               const height = `calc(${heightPanel} + ${heightProgressBar})` || '51px';
               let SELECTOR_CONTAINER = 'ytd-watch-flexy:not([fullscreen])';

               // fix for [theater-mode] plugin
               // if (user_settings.player_full_viewport_mode) {
               //    const CLASS_OVER_PAUSED = 'nova-player-fullviewport';
               //    SELECTOR_CONTAINER += ` #movie_player:not(${CLASS_OVER_PAUSED})`;
               // }

               // fix conflict with plugin [theater-mode]
               if (['force', 'offset'].includes(user_settings.player_full_viewport_mode)) {
                  SELECTOR_CONTAINER += `:not([theater])`;
               }

               NOVA.css.push(
                  `/* fix captions */
                  ${SELECTOR_CONTAINER} .ytp-caption-window-bottom {
                     margin-bottom: 0;
                  }

                  /* convert control-gradient to background control */
                  ${SELECTOR_CONTAINER} .ytp-gradient-bottom {
                     transform: translateY(${height});
                     display: block !important;
                     opacity: 1 !important;
                     height: ${height} !important;
                     padding: 0;
                     background-color: #0f0f0f; /*--yt-spec-text-primary-inverse*/
                  }

                  /* control move below */
                  ${SELECTOR_CONTAINER} .ytp-chrome-bottom {
                     transform: translateY(${height});
                     opacity: 1 !important;
                  }

                  /* fix control (overflow-x) */
                  ${SELECTOR_CONTAINER} .html5-video-player {
                     overflow: visible;
                  }

                  /* fix channel avatar */
                  ${SELECTOR_CONTAINER} .ytp-player-content.ytp-iv-player-content {
                     bottom: ${NOVA.css.getValue('.ytp-player-content.ytp-iv-player-content', 'left') || '12px'};
                  }

                  /* fix control tooltip */
                  ${SELECTOR_CONTAINER} .ytp-tooltip,
                  ${SELECTOR_CONTAINER} .ytp-settings-menu {
                     transform: translateY(${height});
                  }

                  /* fix control collider (buttons, progress-bar), description, sidebar */
                  /*${SELECTOR_CONTAINER} #below #actions tp-yt-paper-tooltip, */
                  ${SELECTOR_CONTAINER}[theater] > #columns,
                  ${SELECTOR_CONTAINER}:not([theater]) #below {
                     margin-top: ${height} !important;
                  }

                  /* fix for rounded player (without login) */
                  #ytd-player {
                     overflow: visible !important;
                  }
                  /*#movie_player {
                     background-color: #0f0f0f;
                  }*/

                  /* fix the video moved outside the player when playback unstarted/ended */
                  /*${SELECTOR_CONTAINER} .unstarted-mode video,
                  ${SELECTOR_CONTAINER} .ended-mode video {
                     visibility: hidden;
                  }*/`);

               //  patch for [player-float-progress-bar] plugin
               if (user_settings['player-float-progress-bar']) {
                  NOVA.css.push(
                     `#movie_player.ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container {
                        display: none !important;
                     }`);
               }
               // fixControlFreeze.apply(document.body.querySelector('ytd-watch-flexy')); // for - this.hasAttribute('fullscreen')
               fixControlFreeze();
            }
         });

      // moveMousePeriodic
      // this.mouseMoveIntervalId = fixControlFreeze()
      // fixControlFreeze. copy of the function is also in plugin [player-control-autohide]
      function fixControlFreeze(ms = 2000) {
         if (user_settings.player_hide_elements?.includes('time_display')
            || (user_settings['theater-mode'] && ['force', 'offset'].includes(user_settings.player_full_viewport_mode))
         ) {
            return;
         }
         // if (typeof this.mouseMoveIntervalId === 'number') clearTimeout(this.mouseMoveIntervalId); // reset interval
         // const moveMouse = new Event('mousemove');
         // this.mouseMoveIntervalId = window.setInterval(() => {
         return window.setInterval(() => {
            if (user_settings['theater-mode']
               // && ['smart'].includes(user_settings.player_full_viewport_mode)
               && user_settings.player_full_viewport_mode == 'smart'
               && NOVA.css.getValue(movie_player, 'z-index') != '2020'
               && NOVA.css.getValue(movie_player, 'position') != 'fixed'
            ) {
               return;
            }

            if (NOVA.currentPage == 'watch'
               && document.visibilityState == 'visible'
               && movie_player.classList.contains('playing-mode')
               && !document.fullscreenElement // this.hasAttribute('fullscreen')
            ) {
               // console.debug('wakeUpControls');
               // movie_player.dispatchEvent(moveMouse);
               movie_player.wakeUpControls();
            }
         }, ms);
      }

   },
});
