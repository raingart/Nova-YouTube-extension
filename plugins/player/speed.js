_plugins.push({
   name: 'Video playback speed with MouseWheel',
   id: 'video-speed-Wheel',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use mouse wheel to change speed of video',
   _runtime: user_settings => {

      YDOM.waitFor('.html5-video-player', playerId => {
         // player area
         document.getElementsByClassName("html5-video-container")[0]
            .addEventListener("wheel", onWheel_setVideoSpeed); //mousewheel

         function onWheel_setVideoSpeed(event) {
            // console.log('onWheel');
            event.preventDefault();

            if (user_settings['player_rate_hotkey'] && (
                  event[user_settings['player_rate_hotkey']] ||
                  (
                     user_settings['player_rate_hotkey'] === 'none' &&
                     !event.ctrlKey && !event.altKey && !event.shiftKey
                  )
               )) {
               // console.log('hotkey caught');

               if (!playerId.hasOwnProperty('getPlaybackRate')) {
                  // console.log('getPlaybackRate error');
                  return console.error('getPlaybackRate error');
               }

               let delta = Math.sign(event.wheelDelta);
               let rate = _setVideoSpeed(delta)

               // show indicator
               showIndicator('x' + playerId.getPlaybackRate(), this);
            }
         }

         function _setVideoSpeed(delta) {
            // if (!playerId) let playerId = document.getElementById('movie_player');
            const rate = playerId.getPlaybackRate();
            let limiter = d => {
               const availableRate = playerId.getAvailablePlaybackRates();
               let rateId = availableRate.indexOf(rate);
               return availableRate[rateId + d] ? availableRate[rateId + d] : false;
            };
            let rateToSet = limiter(delta);

            // set rate
            if (rateToSet && rateToSet !== rate) {
               playerId.setPlaybackRate(rateToSet);
               // console.log('try set speed',rateToSet);

               // check is correct
               if (rateToSet !== playerId.getPlaybackRate()) {
                  console.error('setPlaybackRate error. Different: %s!=%s', rateToSet, playerId.getPlaybackRate());
               }
            }

            // console.log('real speed', playerId.getPlaybackRate());
            return rateToSet === playerId.getPlaybackRate() ? rateToSet : false;
         }

         function showIndicator(level, display_container) {
            let divBarId = "rate-player-info";
            let divBar = document.getElementById(divBarId);

            let updateIndicator = text => {
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
               display_container.insertAdjacentHTML("afterend", '<div id="' + divBarId + '">' + level + '</div>');
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
            label: 'Select hotkeys',
            options: [
               /* beautify preserve:start */
               { label: 'Alt+wheel', value: 'altKey', selected: true  },
               { label: 'Shift+wheel', value: 'shiftKey' },
               { label: 'Ctrl+wheel', value: 'ctrlKey'},
               { label: 'Wheel', value: 'none' }
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
