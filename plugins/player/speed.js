_plugins.push({
   name: 'Video playback speed with mousewheel',
   id: 'video-speed-Wheel',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use mouse wheel to change speed of video',
   _runtime: user_settings => {

      YDOM.waitFor('.html5-video-player', playerId => {
         const playerArea = document.querySelector('.html5-video-container');
         const videoElm = playerId.querySelector('video');

         const setPlaybackRate = {
            Default: delta => {
               // if (!playerId) let playerId = document.getElementById('movie_player');
               const playbackRate = playerId.getPlaybackRate();
               const inRange = d => {
                  const availableRate = playerId.getAvailablePlaybackRates();
                  const rangeId = availableRate.indexOf(playbackRate);
                  return availableRate[rangeId + d];
               };
               const rateToSet = inRange(delta);

               // set rate
               if (rateToSet && rateToSet !== playbackRate) {
                  playerId.setPlaybackRate(rateToSet);
                  // console.log('try set rate',rateToSet);

                  // check is correct
                  if (rateToSet !== playerId.getPlaybackRate()) {
                     console.error('setPlaybackRate different: %s!=%s', rateToSet, playerId.getPlaybackRate());
                  }
               }
               // return rateToSet === playerId.getPlaybackRate();
               return playerId.getPlaybackRate();
            },

            HTML5: delta => {
               const playbackRate = playerId.querySelector('video').playbackRate;
               const inRange = d => {
                  const setRateStep = playbackRate + (d * (user_settings.player_rate_step || 0.25));
                  return (0.25 <= setRateStep && setRateStep <= 5.0) && setRateStep;
               };
               const rateToSet = inRange(delta);

               // set rate
               if (rateToSet && rateToSet !== playbackRate) {
                  // set rate
                  // document.getElementsByTagName('video')[0].defaultPlaybackRate = rateToSet;
                  playerId.querySelector('video').playbackRate = rateToSet;

                  // check is correct
                  if (rateToSet !== playerId.querySelector('video').playbackRate) {
                     console.error('setPlaybackRate different: %s!=%s', rateToSet, playerId.querySelector('video').playbackRate);
                  }
               }
               // return rateToSet === playerId.querySelector('video').playbackRate;
               return playerId.querySelector('video').playbackRate;
            }
         };

          //mousewheel
         playerArea.addEventListener("wheel", setPlaybackRate_wheel);

         // Assign a ratechange event to the <video> element, and execute a function if the playing speed of the video is changed
         videoElm.addEventListener('ratechange', event => showIndicator(videoElm.playbackRate + 'x', playerArea));


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

               if (!playerId.hasOwnProperty('getPlaybackRate')) {
                  console.error('getPlaybackRate error');
                  return
               }

               const delta = Math.sign(event.wheelDelta);

               const rateIsSet = user_settings.player_rate_html5 ?
                  setPlaybackRate.HTML5(delta) : setPlaybackRate.Default(delta);

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

      });

   },
   export_opt: (function () {
      return {
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
      };
   }()),
});
