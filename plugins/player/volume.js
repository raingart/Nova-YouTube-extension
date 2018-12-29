_plugins.push({
   name: 'Volume with mousewheel',
   id: 'volume-wheel',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use mouse wheel to change volume',
   _runtime: user_settings => {

      const _this = this; // get default step

      YDOM.waitFor('.html5-video-player', playerId => {
         // player area
         document.getElementsByClassName("html5-video-container")[0]
            .addEventListener("wheel", onWheel_setVolume); //mousewheel

         function onWheel_setVolume(event) {
            event.preventDefault();

            if (user_settings.volume_hotkey && (
                  event[user_settings.volume_hotkey] ||
                  (
                     user_settings.volume_hotkey === 'none' &&
                     !event.ctrlKey && !event.altKey && !event.shiftKey)
               )) {

               if (!playerId.hasOwnProperty('getVolume')) {
                  return console.error('getVolume error');
               }

               let step = user_settings.volume_step || _this.export_opt['volume_step'] || 5;
               let delta = Math.sign(event.wheelDelta) * step;
               let level = _setVideoVolume(delta);

               if (user_settings.show_volume_indicator) {
                  showIndicator(playerId.getVolume(), this);
               }
            }
         }

         function _setVideoVolume(delta) {
            // if (!playerId) let playerId = document.getElementById('movie_player');
            const volume = playerId.getVolume();

            let limiter = d => (d > 100 ? 100 : d < 0 ? 0 : d);
            let volumeToSet = limiter(parseInt(volume) + delta);

            // set volume
            if (volumeToSet !== volume) {
               playerId.isMuted() && playerId.unMute();
               playerId.setVolume(volumeToSet); // 0 - 100

               // check is correct
               if (volumeToSet === playerId.getVolume()) {
                  _saveVolume(volumeToSet); // saving state in sessions
               } else {
                  return console.error('setVolume error. Different: %s!=%s', volumeToSet, playerId.getVolume());
               }
            }

            return volumeToSet === playerId.getVolume() ? volumeToSet : false;


            function _saveVolume(level) {
               // console.log('sessionStorage["yt-player-volume"] %s', JSON.stringify(sessionStorage["yt-player-volume"]));
               let now = (new Date).getTime();
               let muted = level ? "false" : "true";

               try {
                  // localStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                  //    '}","expiration":' + (now + 2592E6) + ',"creation":' + c + "}";
                  sessionStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                     '}","creation":' + now + "}";
               } catch (err) {
                  console.warn('SaveVolume is impossible (Maybe on "Block third-party cookies)\n', err);
               }

            }
         }

         function showIndicator(level, display_container) {
            let divBarId = "volume-player-info";
            let divBar = document.getElementById(divBarId);

            let updateIndicator = pt => {
               if (typeof fate_volumeBar !== "undefined") clearTimeout(fate_volumeBar);

               if (user_settings.show_volume_indicator === 'bar' ||
                  user_settings.show_volume_indicator === 'full') {
                  let color = user_settings.show_volume_indicator_color;
                  divBar.style.background = 'linear-gradient(to right, ' +
                     color + 'd0 ' + pt +
                     '%, rgba(0,0,0,0.3) ' + pt + '%)';
                  divBar.textContent = '';
               }
               if (user_settings.show_volume_indicator === 'text' ||
                  user_settings.show_volume_indicator === 'full') {
                  divBar.textContent = pt;
               }

               divBar.style.transition = 'none';
               divBar.style.opacity = 1;
               // divBar.style.visibility = 'visibility';

               fate_volumeBar = setTimeout(() => {
                  divBar.style.transition = 'opacity 200ms ease-in';
                  divBar.style.opacity = 0;
                  // divBar.style.visibility = 'hidden';
               }, 800); //200ms + 800ms = 1s
            };

            if (divBar) {
               updateIndicator(level);

            } else if (display_container) {
               display_container.insertAdjacentHTML("afterend", '<div id="' + divBarId + '"></div>');
               divBar = document.getElementById(divBarId);

               Object.assign(divBar.style, {
                  'background-color': 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  opacity: 0,
                  'font-size': '1.5em',
                  'line-height': '2em',
                  left: 0,
                  position: 'absolute',
                  'text-align': 'center',
                  top: 'auto',
                  width: '100%',
                  'min-height': '0.2em',
                  'z-index': '35',
               });

               updateIndicator(level);
            }
         }
      });

   },
   export_opt: (function () {
      return {
         'volume_step': {
            _elementType: 'input',
            label: 'Step',
            type: 'number',
            placeholder: '%',
            step: 1,
            min: 1,
            max: 33,
            value: 5,
         },
         'volume_hotkey': {
            _elementType: 'select',
            label: 'Hotkey',
            options: [
               /* beautify preserve:start */
               { label: 'alt+wheel', value: 'altKey' },
               { label: 'shift+wheel', value: 'shiftKey' },
               { label: 'ctrl+wheel', value: 'ctrlKey' },
               { label: 'wheel', value: 'none', selected: true },
               /* beautify preserve:end */
            ]
         },
         'show_volume_indicator': {
            _elementType: 'select',
            label: 'Type visualization',
            options: [
               /* beautify preserve:start */
               { label: 'bar', value: 'bar' },
               { label: 'text', value: 'text', selected: true },
               { label: 'bar+text', value: 'full' },
               { label: 'off', value: '' },
               /* beautify preserve:end */
            ]
         },
         'show_volume_indicator_color': {
            _elementType: 'input',
            label: 'Color of visualization',
            type: 'color',
            value: '#ff0000', // red
            'data-dependent': '{"show_volume_indicator":["bar","full"]}',
         },
      };
   }()),
});
