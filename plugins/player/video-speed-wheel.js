_plugins.push({
   name: 'Video Speed with MouseWheel',
   id: 'video-speed-Wheel',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'Use mouse wheel to change speed video',
   // version: '0.1',
   _runtime: function (user_settings) {

      // PolymerYoutube.waitFor('.html5-video-player', function (playerId) {
      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         document.getElementsByClassName("html5-video-container")[0]
            .addEventListener("wheel", onWheel); //mousewheel

         function onWheel(event) {
            // console.log(event.target);
            event.preventDefault();
            //Speed | Alt+WheelUp/Down
            // if (event.ctrlKey)
            // if (event.altKey) 
            // if (event.shiftKey && event.which == 13) { //shift + enter
            if (user_settings['player_rate_hotkey'] &&
               (event[user_settings['player_rate_hotkey']] ||
                  (user_settings['player_rate_hotkey'] === 'none' && !event.ctrlKey && !event.altKey && !event.shiftKey)
               )) {

               if (!playerId.hasOwnProperty('getPlaybackRate')) return console.warn('getPlaybackRate error');
               // const step = 0.25;
               // const delta = Math.sign(event.wheelDelta) * step;
               const availableRate = playerId.getAvailablePlaybackRates();
               const delta = Math.sign(event.wheelDelta);
               let new_rate = availableRate.indexOf(playerId.getPlaybackRate()) + delta;

               if (availableRate[new_rate]) {
                  // console.log("user_settings['show_rate_indicator']", user_settings['show_rate_indicator']);
                  playerId.setPlaybackRate(availableRate[new_rate]);
               }
               //************
               // console.log('availableRate.indexOf(playerId.getPlaybackRate())', availableRate.indexOf(playerId.getPlaybackRate()));
               // console.log('delta', delta);
               // console.log('availableRate', JSON.stringify(availableRate));
               // // console.log('rate set id', availableRate[new_rate]);
               // console.log('rate', playerId.getPlaybackRate());
               //************

               if (user_settings['show_rate_indicator']) displayBar('x' + playerId.getPlaybackRate(), this);
            }
         }

         function displayBar(level, display_container) {
            let divBarId = "rate-player-info";
            let divBar = document.getElementById(divBarId);

            let showBar = text => {
               if (typeof fateBar !== "undefined") clearTimeout(fateBar);
               divBar.textContent = text;

               divBar.style.transition = 'none';
               divBar.style.opacity = 1;
               // divBar.style.visibility = 'visibility';

               fateBar = setTimeout(() => {
                  divBar.style.transition = 'opacity 200ms ease-in';
                  divBar.style.opacity = 0;
                  // divBar.style.visibility = 'hidden';
               }, 800); //200ms + 800ms = 1s
            };

            if (divBar) {
               showBar(level);

            } else if (display_container) {
               display_container.insertAdjacentHTML("afterend", '<div id="' + divBarId + '">' + level + '</div>');
               divBar = document.getElementById(divBarId);

               Object.assign(divBar.style, {
                  'background-color': 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  opacity: 0,
                  // transition: 'opacity 200ms ease-in',
                  'font-size': '1.6em',
                  left: 0,
                  padding: '.4em 0',
                  position: 'absolute',
                  'text-align': 'center',
                  top: 'auto',
                  width: '100%',
                  'z-index': '35',
               });
               showBar(level);
            }
         }
      });

   },
   export_opt: (function (data) {
      return {
         'player_rate_hotkey': {
            _elementType: 'select',
            label: 'Rate hotkey',
            options: [
               /* beautify preserve:start */
               { label: 'Alt+wheel', value: 'altKey', selected: true  },
               { label: 'Shift+wheel', value: 'shiftKey' },
               { label: 'Ctrl+wheel', value: 'ctrlKey'},
               { label: 'Wheel', value: 'none' }
               /* beautify preserve:end */
            ]
         },
         'show_rate_indicator': {
            _elementType: 'input',
            label: 'show indicator',
            type: 'checkbox',
         },
      };
   }()),
});
