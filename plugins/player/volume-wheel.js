_plugins.push({
   name: 'Volume with MouseWheel',
   id: 'volume-wheel',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'Use mouse wheel to change volume',
   // version: '0.1',
   _runtime: function (user_settings) {

      const _this = this;

      // PolymerYoutube.waitFor('.html5-video-player', function (playerId) {
      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         document.getElementsByClassName("html5-video-container")[0]
            .addEventListener("wheel", onWheel); //mousewheel

         function onWheel(event) {
            // console.log(event.target);
            event.preventDefault();

            if (user_settings['volume_hotkey'] &&
               (event[user_settings['volume_hotkey']] ||
                  (user_settings['volume_hotkey'] === 'none' && !event.ctrlKey && !event.altKey && !event.shiftKey)
               )) {

               if (!playerId.hasOwnProperty('getVolume')) return console.warn('getVolume error');

               let step = user_settings['volume_step'] || _this.export_opt['volume_step'] || 10;
               const delta = Math.sign(event.wheelDelta) * step;
               let level = videoVolume(delta);

               displayBar(level, this);
            }
         }

         function videoVolume(delta) {
            // if (!playerId) var playerId = document.getElementById('movie_player');
            playerId.isMuted() && playerId.unMute();

            let limiter = d => (d > 100 ? 100 : d < 0 ? 0 : d);
            let level = limiter(parseInt(playerId.getVolume()) + delta);
            playerId.setVolume(level); // 0 - 100
            // console.log('.getVolume()', playerId.getVolume());
            saveVolume(level);
            return level;

            // function getVolume() {
            //    var playerId = document.getElementById("movie_player");
            //    var volume = null;
            //    if (playerId) {
            //       if (playerId.hasOwnProperty('getVolume')) volume = parseInt(playerId.getVolume());
            //    }
            //    return volume;
            // }

            function saveVolume(level) {
               // console.log('sessionStorage["yt-player-volume"] %s', JSON.stringify(sessionStorage["yt-player-volume"]));
               let now = (new Date).getTime();
               let muted = level ? "false" : "true";
               // localStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
               //    '}","expiration":' + (now + 2592E6) + ',"creation":' + c + "}";
               sessionStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                  '}","creation":' + now + "}";
            }
         }

         function displayBar(level, display_container) {
            if (!user_settings['show_volume_indicator']) return;

            let divBarId = "rate-player-info";
            let divBar = document.getElementById(divBarId);

            let showBar = pt => {
               if (typeof fateBar !== "undefined") clearTimeout(fateBar);

               if (user_settings['show_volume_indicator'] === 'bar' ||
                  user_settings['show_volume_indicator'] === 'full') {
                  let color = user_settings['show_volume_indicator_color'];
                  divBar.style.background = 'linear-gradient(to right, ' +
                     color + 'd0 ' + pt +
                     '%, rgba(0,0,0,0.3) ' + pt + '%)';
               }
               if (user_settings['show_volume_indicator'] === 'text' ||
                  user_settings['show_volume_indicator'] === 'full') {
                  divBar.textContent = pt;
               }

               // divBar.style.cssText ='';
               divBar.style.transition = 'none';
               divBar.style.opacity = 1;
               // divBar.style.visibility = 'visibility';

               fateBar = setTimeout(() => {
                  divBar.style.transition = 'opacity 200ms ease-in';
                  divBar.style.opacity = 0;
                  // divBar.style.visibility = 'hidden';
               }, 1000); //200ms + 1000ms = 1.2s
            };

            if (divBar) {
               showBar(level);

            } else if (display_container) {
               display_container.insertAdjacentHTML("afterend", '<div id="' + divBarId + '"></div>');
               divBar = document.getElementById(divBarId);

               Object.assign(divBar.style, {
                  'background-color': 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  opacity: 0,
                  // transition: 'opacity 200ms ease-in',
                  'font-size': '1.5em',
                  'line-height': '2em',
                  left: 0,
                  // padding: '.4em 0',
                  // padding: '0.1em 0',
                  position: 'absolute',
                  'text-align': 'center',
                  top: 'auto',
                  width: '100%',
                  'min-height': '0.2em',
                  'z-index': '35',
               });
               showBar(level);
            }
         }
      });

   },
   export_opt: (function (data) {
      return {
         'volume_step': {
            _elementType: 'input',
            label: 'step',
            type: 'number',
            placeholder: '1-33',
            step: 1,
            min: 1,
            max: 33,
            value: 10,
            title: 'switch option to show you volume percentage on screen',
         },
         'volume_hotkey': {
            _elementType: 'select',
            label: 'hotkey',
            options: [
               /* beautify preserve:start */
               { label: 'Alt+wheel', value: 'altKey' },
               { label: 'Shift+wheel', value: 'shiftKey' },
               { label: 'Ctrl+wheel', value: 'ctrlKey' },
               { label: 'Wheel', value: 'none', selected: true },
               /* beautify preserve:end */
            ]
         },
         'show_volume_indicator': {
            _elementType: 'select',
            label: 'indicator',
            options: [
               /* beautify preserve:start */
               { label: 'bar', value: 'bar' },
               { label: 'text', value: 'text' },
               { label: 'bar+text', value: 'full', selected: true },
               { label: 'off', value: '' },
               /* beautify preserve:end */
            ]
         },
         'show_volume_indicator_color': {
            _elementType: 'input',
            label: 'indicator color',
            type: 'color',
            value: '#ff0000', // red
         },
      };
   }()),
});
