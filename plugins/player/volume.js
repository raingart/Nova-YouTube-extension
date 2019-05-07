_plugins.push({
   name: 'Volume with mousewheel',
   id: 'volume-wheel',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use mouse wheel to change volume',
   _runtime: user_settings => {

      const _this = this; // get default step

      YDOM.waitFor('.html5-video-player', playerId => {

         let yt_player_volume;
         try { yt_player_volume = sessionStorage["yt-player-volume"]; } catch (err) { }
         if (!yt_player_volume && user_settings.default_volume_level && user_settings.default_volume_level != 0) {
            _setVideoVolume(user_settings.default_volume_level);
         }

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

               const step = user_settings.volume_step || _this.export_opt['volume_step'] || 5;
               const delta = Math.sign(event.wheelDelta) * step;
               const getVolume = playerId.getVolume();
               const level = _setVideoVolume(getVolume + delta, getVolume);

               if (user_settings.show_volume_indicator) {
                  showIndicator(playerId.getVolume(), this);
               }
            }
         }

         function _setVideoVolume(volume, volumeStatus) {
            // console.log('volume', volume);
            // if (!playerId) let playerId = document.getElementById('movie_player');
            const limiter = d => (d > 100 ? 100 : d < 0 ? 0 : d);
            const volumeToSet = limiter(parseInt(volume));

            // set volume
            if (volumeToSet !== volumeStatus) {
               playerId.isMuted() && playerId.unMute();
               playerId.setVolume(volumeToSet); // 0 - 100

               // check is correct
               if (volumeToSet === playerId.getVolume()) {
                  _saveVolume(volumeToSet); // saving state in sessions
                  // console.log('volume saved');
               } else {
                  console.error('setVolume error. Different: %s!=%s', volumeToSet, playerId.getVolume());
               }
            }

            // return volumeToSet === playerId.getVolume() ? volumeToSet : false;


            function _saveVolume(level) {
               // console.log('sessionStorage["yt-player-volume"] %s', JSON.stringify(sessionStorage["yt-player-volume"]));
               const now = (new Date).getTime();
               const muted = level ? "false" : "true";

               try {
                  // localStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                  //    '}","expiration":' + (now + 2592E6) + ',"creation":' + c + "}";
                  sessionStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                     '}","creation":' + now + "}";
               } catch (err) {
                  console.info('%s: SaveVolume is impossible (Maybe on "Block third-party cookies")', err.name);
               }

            }
         }

         function showIndicator(level, display_container) {
            const divBarId = "volume-player-info";
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
               display_container.insertAdjacentHTML("afterend", `<div id="${divBarId}"></div>`);
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
         'default_volume_level': {
            _elementType: 'input',
            label: 'Level at startup',
            type: 'number',
            title: '0 - auto/disable',
            placeholder: '%',
            step: 1,
            min: 0,
            max: 100,
            value: 75,
         },
         'volume_step': {
            _elementType: 'input',
            label: 'Step',
            type: 'number',
            title: 'percent',
            placeholder: '%',
            step: 1,
            min: 1,
            max: 33,
            value: 10,
         },
         'volume_hotkey': {
            _elementType: 'select',
            label: 'Hotkey',
            options: [
               { label: 'alt+wheel', value: 'altKey' },
               { label: 'shift+wheel', value: 'shiftKey' },
               { label: 'ctrl+wheel', value: 'ctrlKey' },
               { label: 'wheel', value: 'none', selected: true },
            ]
         },
         'show_volume_indicator': {
            _elementType: 'select',
            label: 'Type visualization',
            options: [
               { label: 'bar', value: 'bar' },
               { label: 'text', value: 'text', selected: true },
               { label: 'bar+text', value: 'full' },
               { label: 'off', value: '' },
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
