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
            // show indicator
            // html5 way
            videoPlayer.querySelector('video')
               .addEventListener('ratechange', function (event) {
                  // console.debug('ratechange', videoPlayer.getPlaybackRate(), this.playbackRate);
                  YDOM.bezelTrigger(this.playbackRate + 'x');
               });
            // Default indicator does not work for html5 way
            // videoPlayer.addEventListener('onPlaybackRateChange', rate => {
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
               adjust(level) {
                  // default method requires a multiplicity of 0.25
                  return ((+level % 0.25) === 0 || +level > 1) && videoPlayer.hasOwnProperty('getPlaybackRate')
                     ? this.default(+level)
                     : this.html5(+level);
               },

               default(playback_rate) {
                  // console.debug('playerRate:default', ...arguments);
                  const playbackRate = videoPlayer.getPlaybackRate();
                  const inRange = delta => {
                     const rangeRate = videoPlayer.getAvailablePlaybackRates();
                     const playbackRateIdx = rangeRate.indexOf(playbackRate);
                     return rangeRate[playbackRateIdx + delta];
                  };
                  // if playback_rate < 1 run inRange
                  const rateToSet = !playback_rate || playback_rate > 1 ? playback_rate || 1 : inRange(playback_rate);

                  // set new rate
                  if (rateToSet && rateToSet != playbackRate) {
                     videoPlayer.setPlaybackRate(rateToSet);

                     if (rateToSet === videoPlayer.getPlaybackRate()) {
                        this.saveInSession(rateToSet);

                     } else {
                        console.error('playerRate:default different: %s!=%s', rateToSet, videoPlayer.getPlaybackRate());
                     }
                  }
                  return rateToSet === videoPlayer.getPlaybackRate() && rateToSet;
               },

               html5(playback_rate) {
                  // console.debug('playerRate:html5', ...arguments);
                  const videoElm = videoPlayer.querySelector('video');
                  const playbackRate = videoElm.playbackRate;
                  const inRange = step => {
                     const setRateStep = playbackRate + step;
                     return (.1 <= setRateStep && setRateStep <= 2.5) && +setRateStep.toFixed(2);
                  };
                  const rateToSet = inRange(playback_rate);
                  // const rateToSet = playback_rate > 1 ? playback_rate : inRange(playback_rate); // dont work

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
            if (location.href.includes('music') || +user_settings.default_playback_rate === 1) {
               user_settings.default_playback_rate = 0; // normal rate
            }
            playerRate.adjust(user_settings.default_playback_rate);

         });

   },
   opt_export: {
      'default_playback_rate': {
         _tagName: 'input',
         label: 'Speed at startup',
         // label: 'Default speedup playback rate',
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
