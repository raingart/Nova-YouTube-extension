_plugins.push({
   name: 'Video playback speed with mousewheel',
   id: 'video-speed-wheel',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use mouse wheel to change speed of video',
   _runtime: user_settings => {
      // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events

      YDOM.waitHTMLElement({
         selector: '.html5-video-player',
         callback: videoPlayer => {
            const playerArea = document.querySelector('.html5-video-container');
            const videoElm = videoPlayer.querySelector('video');

            // [listener block]
            // mousewheel
            playerArea.addEventListener("wheel", setPlaybackRate_wheel);

            // Assign a ratechange event to the <video> element, and execute a function if the playing speed of the video is changed
            videoElm.addEventListener('ratechange', event => showIndicator(videoElm.playbackRate + 'x', playerArea));

            // [bezel block]
            // hide default indicator
            [...document.querySelectorAll('[class^="ytp-bezel"]')]
               // .forEach(bezel => bezel.parentNode.removeChild(bezel))
               .forEach(bezel => bezel.style.display = 'none');

            // [funcs/libs block]
            const setPlaybackRate = {
               set: x => user_settings.player_rate_html5 ? setPlaybackRate.html5(x) : setPlaybackRate.default(x),

               default: playback_rate => {
                  const playbackRate = videoPlayer.getPlaybackRate();
                  const inRange = delta => {
                     const rangeRate = videoPlayer.getAvailablePlaybackRates();
                     const rangeIdx = rangeRate.indexOf(playbackRate);
                     return rangeRate[rangeIdx + delta];
                  };
                  const rateToSet = playback_rate > 1 ? playback_rate : inRange(playback_rate);

                  // set rate
                  if (rateToSet && rateToSet !== playbackRate) {
                     videoPlayer.setPlaybackRate(rateToSet);
                     // console.log('try set rate',rateToSet);

                     // check is correct
                     if (rateToSet !== videoPlayer.getPlaybackRate()) {
                        console.error('setPlaybackRate different: %s!=%s', rateToSet, videoPlayer.getPlaybackRate());
                     }
                  }
                  // return rateToSet === videoPlayer.getPlaybackRate();
                  return videoPlayer.getPlaybackRate();
               },

               html5: playback_rate => {
                  const playbackRate = videoPlayer.querySelector('video').playbackRate;
                  const inRange = delta => {
                     const setRateStep = playbackRate + (delta * (user_settings.player_rate_step || 0.25));
                     return (0.5 <= setRateStep && setRateStep <= 3.0) && setRateStep;
                  };
                  const rateToSet = playback_rate > 1 ? playback_rate : inRange(playback_rate);

                  // set rate
                  if (rateToSet && rateToSet !== playbackRate) {
                     // set rate
                     // document.getElementsByTagName('video')[0].defaultPlaybackRate = rateToSet;
                     videoPlayer.querySelector('video').playbackRate = rateToSet;

                     // check is correct
                     if (rateToSet !== videoPlayer.querySelector('video').playbackRate) {
                        console.error('setPlaybackRate different: %s!=%s', rateToSet, videoPlayer.querySelector('video').playbackRate);
                     }
                  }
                  // return rateToSet === videoPlayer.querySelector('video').playbackRate;
                  return videoPlayer.querySelector('video').playbackRate;
               }
            };

            // init default_playback_rate
            if (user_settings.default_playback_rate > 1) {
               setPlaybackRate.set(+user_settings.default_playback_rate);
            }

            function setPlaybackRate_wheel(event) {
               // console.log('onWheel');
               event.preventDefault();

               if (user_settings.player_rate_hotkey && (
                  event[user_settings.player_rate_hotkey] ||
                  (
                     user_settings.player_rate_hotkey === 'none' &&
                     !event.ctrlKey && !event.altKey && !event.shiftKey
                  )
               )) {
                  // console.log('hotkey caught');

                  if (!videoPlayer.hasOwnProperty('getPlaybackRate')) {
                     console.error('getPlaybackRate error');
                     return
                  }
                  const delta = Math.sign(event.wheelDelta);
                  const rateIsSet = setPlaybackRate.set(delta);

                  // show indicator
                  if (!user_settings.player_rate_html5) showIndicator(rateIsSet + 'x', this);
               }
            }

            function showIndicator(level, display_container) {
               const divBarId = "rate-player-info";
               let divBar = document.getElementById(divBarId);

               const updateIndicator = text => {
                  if (typeof fate_rateBar !== "undefined") clearTimeout(fate_rateBar);

                  divBar.textContent = text;
                  divBar.style.transition = 'none';
                  divBar.style.opacity = 1;
                  // divBar.style.visibility = 'visibility';

                  fate_rateBar = setTimeout(() => {
                     divBar.style.transition = 'opacity 200ms ease-in';
                     divBar.style.opacity = 0;
                     // divBar.style.visibility = 'hidden';
                  }, 800); //200ms + 800ms = 1s
               };

               if (divBar) { // update
                  updateIndicator(level);

               } else if (display_container) { // create
                  display_container.insertAdjacentHTML("afterend", `<div id="${divBarId}">${level}</div>`);
                  divBar = document.getElementById(divBarId);

                  Object.assign(divBar.style, {
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
                     'z-index': '35',
                  });

                  updateIndicator(level);
               }
            }
         },
      });

   },
   export_opt: {
      'default_playback_rate': {
         _elementType: 'input',
         label: 'Speed at startup',
         type: 'number',
         title: '1 - auto/disable',
         placeholder: '1-2',
         step: 0.25,
         min: 1,
         max: 2,
         value: 1,
      },
      'player_rate_hotkey': {
         _elementType: 'select',
         label: 'Hotkey',
         options: [
            { label: 'alt+wheel', value: 'altKey', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'wheel', value: 'none' }
         ]
      },
      'player_rate_html5': {
         _elementType: 'input',
         label: 'HTML5 speed range',
         title: 'Bypassing the player. Expand the range to x3',
         type: 'checkbox',
      },
      'player_rate_step': {
         _elementType: 'input',
         label: 'Step',
         type: 'number',
         placeholder: '0.1-1',
         step: 0.05,
         min: 0.1,
         max: 1,
         value: 0.25,
         'data-dependent': '{"player_rate_html5":"true"}',
      },
   },
});
