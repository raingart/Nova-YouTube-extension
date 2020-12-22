_plugins_conteiner.push({
   name: 'Video playback speed with mousewheel',
   id: 'video-speed-wheel',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   desc: 'Use mouse wheel to change speed of video',
   _runtime: user_settings => {

      const SELECTOR_ID = 'rate-player-info';

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(videoPlayer => {
            videoPlayer.addEventListener('onPlaybackRateChange', rate => {
               // console.debug('onPlaybackRateChange', rate);
               HUD.set(rate);
            });
            // html5 way
            // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
            // videoPlayer.querySelector('video')
            //    .addEventListener('ratechange', function (event) {
            //       console.debug('ratechange', this.playbackRate);
            //       HUD.set(this.playbackRate)
            //    });

            // mousewheel in player area
            document.querySelector('.html5-video-container')
               .addEventListener("wheel", event => {
                  if (!videoPlayer.hasOwnProperty('getPlaybackRate')) return console.error('Error getPlaybackRate ');
                  event.preventDefault();

                  if (user_settings.player_rate_hotkey
                     && (
                        event[user_settings.player_rate_hotkey]
                        || (user_settings.player_rate_hotkey == 'none'
                           && !event.ctrlKey && !event.altKey && !event.shiftKey)
                     )
                  ) {
                     // console.debug('hotkey caught');
                     if (!user_settings.player_rate_html5) {
                        const delta = Math.sign(event.wheelDelta);
                        const rateToSet = setPlaybackRate.set(delta);
                        // console.debug('rateToSet', rateToSet);
                        if (rateToSet === false) return console.error('Error rateToSet');
                        HUD.set(rateToSet);
                     }
                  }
               });

            // hide default indicator
            if (!user_settings['volume-indicator'] // indicator is common
               // default indicator does not work for html5
               && (user_settings.player_disable_bezel || user_settings.player_rate_html5)) {
               YDOM.HTMLElement.addStyle('.ytp-bezel-text-wrapper { display:none !important }');
            }

            const setPlaybackRate = {
               set(x) {
                  return user_settings.player_rate_html5 ? this.html5(+x) : this.default(+x);
               },

               default: playback_rate => {
                  playback_rate = +playback_rate;
                  // console.debug('playback_rate', playback_rate);
                  const playbackRate = videoPlayer.getPlaybackRate();
                  const inRange = delta => {
                     const rangeRate = videoPlayer.getAvailablePlaybackRates();
                     const rangeIdx = rangeRate.indexOf(playbackRate);
                     return rangeRate[rangeIdx + delta];
                  };
                  const rateToSet = playback_rate > 1 ? playback_rate : inRange(playback_rate);

                  // set rate
                  // console.debug('rateToSet',rateToSet);
                  if (rateToSet && rateToSet != playbackRate) {
                     // console.debug('set rate',rateToSet);
                     videoPlayer.setPlaybackRate(rateToSet);

                     // check is correct
                     if (rateToSet !== videoPlayer.getPlaybackRate()) {
                        console.error('setPlaybackRate different: %s!=%s', rateToSet, videoPlayer.getPlaybackRate());
                     }
                  }
                  return rateToSet === videoPlayer.getPlaybackRate() ? rateToSet : false;
               },

               html5: playback_rate => {
                  playback_rate = +playback_rate;
                  const videoElm = videoPlayer.querySelector('video');
                  const playbackRate = videoElm.playbackRate;
                  const inRange = delta => {
                     const setRateStep = playbackRate + (delta * (+user_settings.player_rate_step || 0.25));
                     return (0.5 <= setRateStep && setRateStep <= 3.0) && setRateStep;
                  };
                  const rateToSet = playback_rate > 1 ? playback_rate : inRange(playback_rate);

                  // set rate
                  if (rateToSet && rateToSet != playbackRate) {
                     // document.getElementsByTagName('video')[0].defaultPlaybackRate = rateToSet;
                     videoElm.playbackRate = rateToSet;

                     // check is correct
                     if (rateToSet !== videoElm.playbackRate) {
                        console.error('setPlaybackRate different: %s!=%s', rateToSet, videoElm.playbackRate);
                     }
                  }
                  return rateToSet === videoElm.playbackRate ? rateToSet : false;
               }
            };

            // init default_playback_rate
            if (+user_settings.default_playback_rate != 1 && YDOM.getURLParams().get('ismusic') === null) {
               setPlaybackRate.set(user_settings.default_playback_rate);
            }

         });

      const HUD = {
         create() {
            const div = document.createElement("div");
            div.id = SELECTOR_ID;
            Object.assign(div.style, {
               'background-color': 'rgba(0,0,0,0.3)',
               color: '#fff',
               opacity: 0,
               'font-size': '1.6em',
               left: 0,
               padding: '.4em 0',
               position: 'absolute',
               'text-align': 'center',
               top: 'auto',
               width: '100%',
               'z-index': '19',
            });
            document.getElementById('movie_player').appendChild(div);
            return div;
         },

         set(text) {
            if (!user_settings.player_disable_bezel) return;
            if (typeof fateRateHUD !== 'undefined') clearTimeout(fateRateHUD);

            const hud = document.getElementById(SELECTOR_ID) || this.create();
            hud.textContent = text + 'x';
            hud.style.transition = 'none';
            hud.style.opacity = 1;
            // hud.style.visibility = 'visibility';

            fateRateHUD = setTimeout(() => {
               hud.style.transition = 'opacity 200ms ease-in';
               hud.style.opacity = 0;
               // hud.style.visibility = 'hidden';
            }, 800); //200ms + 800ms = 1s
         }
      };

   },
   opt_export: {
      'default_playback_rate': {
         _tagName: 'input',
         label: 'Speed at startup',
         // label: 'Default speedup playback rate',
         type: 'number',
         title: '1 - default',
         placeholder: '1-2',
         step: 0.25,
         min: 1,
         max: 2,
         value: 1,
      },
      'player_rate_hotkey': {
         _tagName: 'select',
         label: 'Hotkey',
         options: [
            { label: 'alt+wheel', value: 'altKey', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'wheel', value: 'none' },
            { label: 'off', value: false },
         ]
      },
      'player_rate_html5': {
         _tagName: 'input',
         label: 'HTML5 speed range',
         type: 'checkbox',
         title: 'Bypassing the player. Expand the range to x3',
      },
      'player_rate_step': {
         _tagName: 'input',
         label: 'Step',
         type: 'number',
         placeholder: '0.1-1',
         step: 0.05,
         min: 0.1,
         max: 1,
         value: 0.25,
         'data-dependent': '{"player_rate_html5":"true"}',
      },
      'player_disable_bezel': {
         _tagName: 'input',
         label: 'Replace default indicator',
         type: 'checkbox',
         title: 'It is common for the volume',
      },
   },
});
