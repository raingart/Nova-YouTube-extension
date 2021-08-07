// for test
// the adjustment area depends on the video size. Problems are visible at non-standard proportions
// https://www.youtube.com/watch?v=U9mUwZ47z3E - ultra-wide
// https://www.youtube.com/watch?v=4Zivt4wbvoM - narrow

window.nova_plugins.push({
   id: 'rate-wheel',
   title: 'Playback speed control',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: 'Use mouse wheel to change playback speed',
   desc: 'with mousewheel',
   _runtime: user_settings => {

      NOVA.waitElement('#movie_player')
         .then(player => {
            // trigger default indicator
            // html5 way
            player.querySelector('video')
               .addEventListener('ratechange', function () {
                  // console.debug('ratechange', player.getPlaybackRate(), this.playbackRate);
               NOVA.bezelTrigger(this.playbackRate + 'x');
            });
            // Default indicator does not work for html5 way
            // player.addEventListener('onPlaybackRateChange', rate => {
            //    console.debug('onPlaybackRateChange', rate);
            // });

            // mousewheel in player area
            if (user_settings.rate_hotkey) {
               document.querySelector('.html5-video-container')
                  .addEventListener('wheel', evt => {
                     evt.preventDefault();

                     if (evt[user_settings.rate_hotkey]
                        || (user_settings.rate_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
                        // console.debug('hotkey caught');
                        const rate = playerRate.adjust(+user_settings.rate_step * Math.sign(evt.wheelDelta));
                        // console.debug('current rate:', rate);
                     }
                  });
            }

            const playerRate = {
               // DEBUG: true,

               set(level = 1) {
                  this.log('set', ...arguments);
                  player.setPlaybackRate(+level) && this.saveInSession(level);
               },

               // adjust(rate_step) {
               //    // default method requires a multiplicity of 0.25
               //    return (+rate_step % .25) === 0 && player.hasOwnProperty('getPlaybackRate')
               //       ? this.default(+rate_step)
               //       : this.html5(+rate_step);
               // },

               adjust(rate_step = required()) {
                  this.log('adjust', ...arguments);
                  return player.hasOwnProperty('getPlaybackRate') ? this.default(+rate_step) : this.html5(+rate_step);
               },

               default(playback_rate = required()) {
                  this.log('playerRate:default', ...arguments);
                  const playbackRate = player.getPlaybackRate();
                  // const inRange = delta => {
                  //    const rangeRate = player.getAvailablePlaybackRates();
                  //    const playbackRateIdx = rangeRate.indexOf(playbackRate);
                  //    return rangeRate[playbackRateIdx + delta];
                  // };
                  // const newRate = inRange(Math.sign(+playback_rate));
                  const inRange = step => {
                     const setRateStep = playbackRate + step;
                     return (.1 <= setRateStep && setRateStep <= 2) && +setRateStep.toFixed(2);
                  };
                  const newRate = inRange(+playback_rate);
                  // set new rate
                  if (newRate && newRate != playbackRate) {
                     player.setPlaybackRate(newRate);

                     if (newRate === player.getPlaybackRate()) {
                        this.saveInSession(newRate);

                     } else {
                        console.error('playerRate:default different: %s!=%s', newRate, player.getPlaybackRate());
                     }
                  }
                  this.log('playerRate:default return', newRate);
                  return newRate === player.getPlaybackRate() && newRate;
               },

               html5(playback_rate = required()) {
                  this.log('playerRate:html5', ...arguments);
                  const videoElm = player.querySelector('video');
                  const playbackRate = videoElm.playbackRate;
                  const inRange = step => {
                     const setRateStep = playbackRate + step;
                     return (.1 <= setRateStep && setRateStep <= 3) && +setRateStep.toFixed(2);
                  };
                  const newRate = inRange(+playback_rate);
                  // set new rate
                  if (newRate && newRate != playbackRate) {
                     // document.querySelector('video').defaultPlaybackRate = newRate;
                     videoElm.playbackRate = newRate;

                     if (newRate === videoElm.playbackRate) {
                        this.saveInSession(newRate);

                     } else {
                        console.error('playerRate:html5 different: %s!=%s', newRate, videoElm.playbackRate);
                     }
                  }
                  this.log('playerRate:html5 return', newRate);
                  return newRate === videoElm.playbackRate && newRate;
               },

               saveInSession(level = required()) {
                  try {
                     sessionStorage['yt-player-playback-rate'] = JSON.stringify({
                        creation: Date.now(), data: level.toString(),
                     })
                     this.log('playbackRate save in session:', ...arguments);

                  } catch (err) {
                     console.info(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                  }
               },

               log(...args) {
                  if (this.DEBUG && args?.length) {
                     console.groupCollapsed(...args);
                     console.trace();
                     console.groupEnd();
                  }
               },
            };

            setDefaultRate();
            document.addEventListener('yt-navigate-finish', setDefaultRate); // no sense, page data not updated

            function setDefaultRate() {
               const isMusic = () => [
                  location.href,
                  document.querySelector('meta[itemprop="genre"][content]')?.content, // not updated on page transition!
                  // ytplayer - not updated on page transition!
                  window.ytplayer?.config?.args.raw_player_response.microformat.playerMicroformatRenderer.category
               ]
                  .some(i => i?.toLowerCase().includes('music'));

               // init rate_default
               if (+user_settings.rate_default !== 1 && (user_settings.rate_default_apply_music || !isMusic())) {
                  // console.debug('update rate_default', user_settings.rate_default);
                  playerRate.set(user_settings.rate_default);
               }
            }
         });

   },
   options: {
      rate_default: {
         _tagName: 'input',
         label: 'Speed at startup',
         // label: 'Default rate',
         type: 'number',
         title: '1 - default',
         placeholder: '1-2',
         step: 0.05,
         min: 1,
         max: 2,
         value: 1,
      },
      rate_default_apply_music: {
         _tagName: 'input',
         label: 'Apply to music',
         type: 'checkbox',
         title: 'Music genre videos are ignored by default',
         'data-dependent': '{"rate_default":"!1"}',
      },
      rate_step: {
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
      rate_hotkey: {
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
