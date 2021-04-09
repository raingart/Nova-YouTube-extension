_plugins_conteiner.push({
   name: 'Video playback speed with mousewheel',
   id: 'video-speed-wheel',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   desc: 'Use mouse wheel to change speed of video',
   _runtime: user_settings => {

      const SELECTOR_ID = 'rate-player-info';

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(player => {
            // show indicator
            // html5 way
            player.querySelector('video')
               .addEventListener('ratechange', function () {
                  // console.debug('ratechange', player.getPlaybackRate(), this.playbackRate);
                  YDOM.bezelTrigger(this.playbackRate + 'x');
               });
            // Default indicator does not work for html5 way
            // player.addEventListener('onPlaybackRateChange', rate => {
            //    console.debug('onPlaybackRateChange', rate);
            // });

            // mousewheel in player area
            if (user_settings.player_rate_hotkey) {
               document.querySelector('.html5-video-container')
                  .addEventListener("wheel", evt => {
                     evt.preventDefault();

                     if (evt[user_settings.player_rate_hotkey]
                        || (user_settings.player_rate_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
                        // console.debug('hotkey caught');
                        const rate = playerRate.adjust(+user_settings.player_rate_step * Math.sign(evt.wheelDelta));
                        // console.debug('current rate:', rate);
                     }
                  });
            }

            const playerRate = {
               set(level) {
                  player.setPlaybackRate(+level) && this.saveInSession(level);
               },

               // adjust(rate_step) {
               //    // default method requires a multiplicity of 0.25
               //    return (+rate_step % 0.25) === 0 && player.hasOwnProperty('getPlaybackRate')
               //       ? this.default(+rate_step)
               //       : this.html5(+rate_step);
               // },

               adjust(rate_step) {
                  return player.hasOwnProperty('getPlaybackRate') ? this.default(+rate_step) : this.html5(+rate_step);
               },

               default(playback_rate) {
                  // console.debug('playerRate:default', ...arguments);
                  const playbackRate = player.getPlaybackRate();
                  // const inRange = delta => {
                  //    const rangeRate = player.getAvailablePlaybackRates();
                  //    const playbackRateIdx = rangeRate.indexOf(playbackRate);
                  //    return rangeRate[playbackRateIdx + delta];
                  // };
                  // const rateToSet = inRange(Math.sign(+playback_rate));
                  const inRange = step => {
                     const setRateStep = playbackRate + step;
                     return (.1 <= setRateStep && setRateStep <= 2) && +setRateStep.toFixed(2);
                  };
                  const rateToSet = inRange(+playback_rate);
                  // set new rate
                  if (rateToSet && rateToSet != playbackRate) {
                     player.setPlaybackRate(rateToSet);

                     if (rateToSet === player.getPlaybackRate()) {
                        this.saveInSession(rateToSet);

                     } else {
                        console.error('playerRate:default different: %s!=%s', rateToSet, player.getPlaybackRate());
                     }
                  }
                  return rateToSet === player.getPlaybackRate() && rateToSet;
               },

               html5(playback_rate) {
                  // console.debug('playerRate:html5', ...arguments);
                  const videoElm = player.querySelector('video');
                  const playbackRate = videoElm.playbackRate;
                  const inRange = step => {
                     const setRateStep = playbackRate + step;
                     return (.1 <= setRateStep && setRateStep <= 3) && +setRateStep.toFixed(2);
                  };
                  const rateToSet = inRange(+playback_rate);
                  // set new rate
                  if (rateToSet && rateToSet != playbackRate) {
                     // document.getElementsByTagName('video')[0].defaultPlaybackRate = rateToSet;
                     videoElm.playbackRate = rateToSet;

                     if (rateToSet === videoElm.playbackRate) {
                        this.saveInSession(rateToSet);

                     } else {
                        console.error('playerRate:html5 different: %s!=%s', rateToSet, videoElm.playbackRate);
                     }
                  }
                  return rateToSet === videoElm.playbackRate && rateToSet;
               },

               saveInSession(level) {
                  if (!level) return console.error('saveInSession', level);
                  try {
                     sessionStorage["yt-player-playback-rate"] = JSON.stringify({
                        creation: Date.now(), data: String(level),
                     })
                     // console.debug('playbackRate saved', ...arguments);

                  } catch (err) {
                     console.info(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                  }
               },
            };

            // init default_playback_rate
            if (location.href.includes('music')) user_settings.default_playback_rate = 1;
            playerRate.set(user_settings.default_playback_rate);

         });

   },
   opt_export: {
      'default_playback_rate': {
         _tagName: 'input',
         // label: 'Speed at startup',
         label: 'Default speedup',
         type: 'number',
         title: '1 - default',
         placeholder: '1-2',
         step: 0.05,
         min: 1,
         max: 2,
         value: 1,
      },
      'player_rate_step': {
         _tagName: 'input',
         label: 'Step',
         type: 'number',
         title: '0.25 - default',
         placeholder: '0.1-1',
         step: 0.05,
         min: 0.1,
         max: 0.5,
         value: 0.25,
      },
      'player_rate_hotkey': {
         _tagName: 'select',
         label: 'Hotkey',
         options: [
            { label: 'alt+wheel', value: 'altKey', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'wheel', value: 'none' },
            { label: 'disable', value: false },
         ],
      },
   },
});
