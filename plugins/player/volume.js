_plugins.push({
   name: 'Volume with mousewheel',
   id: 'volume-wheel',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use mouse wheel to change volume',
   _runtime: user_settings => {
      // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events

      const _this = this; // link to export_opt.volume_step

      YDOM.waitFor('.html5-video-player', playerId => {
         const playerArea = document.querySelector('.html5-video-container');
         let yt_player_volume;
         // session vol level
         try { yt_player_volume = sessionStorage["yt-player-volume"] } catch (err) { }
         // init default_volume_level
         if (!yt_player_volume && user_settings.default_volume_level && user_settings.default_volume_level != 0) {
            setVolumeLevel(user_settings.default_volume_level);
         }

         // hide default indicator
         if (user_settings.show_volume_indicator && document.querySelector('.ytp-bezel-text-wrapper')) {
            document.querySelector('.ytp-bezel-text-wrapper').style.display = 'none';
         }

         // press keyboard
         playerId.querySelector('video')
            .addEventListener("volumechange", event => showIndicator(playerArea, playerId.getVolume()));
         // .addEventListener("volumechange", function (event) {
         //    let volume = parseInt(this.volume * 100);
         //    console.log('volumechange', volume, playerId.getVolume());
         //    showIndicator(playerArea, volume); // Error: volume this.volume is incorrect
         // });

         // mousewheel in player area
         playerArea.addEventListener("wheel", volume_onWheel);

         function volume_onWheel(event) {
            event.preventDefault();

            if (user_settings.volume_hotkey && (
               event[user_settings.volume_hotkey] ||
               (
                  user_settings.volume_hotkey === 'none' &&
                  !event.ctrlKey && !event.altKey && !event.shiftKey)
            )) {

               if (!playerId.hasOwnProperty('getVolume')) {
                  console.error('getVolume error');
                  return;
               }

               const step = user_settings.volume_step || _this.export_opt['volume_step'];
               const delta = Math.sign(event.wheelDelta) * step;
               const getVolume = playerId.getVolume();
               // const level = setVolumeLevel(getVolume + delta, getVolume);
               setVolumeLevel(getVolume + delta, getVolume);

               showIndicator(this, playerId.getVolume());
            }
         }

         function setVolumeLevel(volume, volumeStatus) {
            // console.log('volume', volume, volumeStatus);
            // if (!playerId) let playerId = document.getElementById('movie_player');
            const limiter = d => (d > 100 ? 100 : d < 0 ? 0 : d);
            const volumeToSet = limiter(parseInt(volume));
            const volumeStorage = level => {
               // console.log('sessionStorage["yt-player-volume"] %s', JSON.stringify(sessionStorage["yt-player-volume"]));
               const now = (new Date).getTime();
               const muted = level ? "false" : "true";

               try {
                  // localStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                  //    '}","expiration":' + (now + 2592E6) + ',"creation":' + c + "}";
                  sessionStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                     '}","creation":' + now + "}";
               } catch (err) {
                  console.info('%s: SaveVolume is impossible (Maybe on "Block third-party cookies")', err.name, err.message);
               }
            }

            // set volume
            if (volumeToSet !== volumeStatus) {
               playerId.isMuted() && playerId.unMute();
               playerId.setVolume(volumeToSet); // 0 - 100

               // check is correct
               if (volumeToSet === playerId.getVolume()) {
                  volumeStorage(volumeToSet); // saving state in sessions
                  // console.log('volume saved');
               } else console.error('setVolume error. Different: %s!=%s', volumeToSet, playerId.getVolume());
            }
            // return volumeToSet === playerId.getVolume() ? volumeToSet : false;
         }

         function showIndicator(display_container, level) {
            if (!user_settings.show_volume_indicator) return;

            const divId = "volume-player-info";
            let div = document.getElementById(divId);

            let updateIndicator = pt => {
               if (typeof fate_volumeBar !== "undefined") clearTimeout(fate_volumeBar);

               if (user_settings.show_volume_indicator === 'bar' ||
                  user_settings.show_volume_indicator === 'full') {
                  let color = user_settings.show_volume_indicator_color;
                  div.style.background = 'linear-gradient(to right, ' +
                     color + 'd0 ' + pt +
                     '%, rgba(0,0,0,0.3) ' + pt + '%)';
                  div.textContent = '';
               }
               if (user_settings.show_volume_indicator === 'text' ||
                  user_settings.show_volume_indicator === 'full') {
                  div.textContent = pt;
               }

               div.style.transition = 'none';
               div.style.opacity = 1;
               // div.style.visibility = 'visibility';

               fate_volumeBar = setTimeout(() => {
                  div.style.transition = 'opacity 200ms ease-in';
                  div.style.opacity = 0;
                  // div.style.visibility = 'hidden';
               }, 800); //200ms + 800ms = 1s
            };

            if (!div && display_container instanceof HTMLElement) {
               display_container.insertAdjacentHTML("afterend", `<div id="${divId}"></div>`);
               div = document.getElementById(divId);

               Object.assign(div.style, {
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
            }
            updateIndicator(level);
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
               { label: 'wheel', value: 'none', selected: true },
               { label: 'shift+wheel', value: 'shiftKey' },
               { label: 'ctrl+wheel', value: 'ctrlKey' },
               { label: 'alt+wheel', value: 'altKey' },
            ]
         },
         'show_volume_indicator': {
            _elementType: 'select',
            label: 'Type visualization',
            options: [
               { label: 'text', value: 'text', selected: true },
               { label: 'bar', value: 'bar' },
               { label: 'text+bar', value: 'full' },
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
