_plugins.push({
   name: 'Mouse wheel volume control',
   id: 'volume-wheel',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use mouse wheel to change volume of video',
   _runtime: user_settings => {
      // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events

      YDOM.waitHTMLElement('.html5-video-player', videoPlayer => {
         const playerArea = document.querySelector('#ytd-player');

         // init default_volume_level
         setVolumeLevel(+user_settings.default_volume_level, videoPlayer.getVolume())

         // [listener block]
         // volume keyboard shortcuts
         videoPlayer.querySelector('video')
            .addEventListener("volumechange", event => showIndicator(playerArea, videoPlayer.getVolume()));
         // .addEventListener("volumechange", function (event) {
         //    let volume = parseInt(this.volume * 100);
         //    console.log('volumechange', volume, videoPlayer.getVolume());
         //    showIndicator(playerArea, volume); // Error: volume this.volume is incorrect
         // });

         // mousewheel in player area
         playerArea.addEventListener("wheel", volume_onWheel);

         // [bezel block]
         // hide default indicator
         [...document.querySelectorAll('[class^="ytp-bezel"]')]
            // .forEach(bezel => bezel.parentNode.removeChild(bezel));
            .forEach(bezel => bezel.style.display = 'none');

         // [funcs block]
         function volume_onWheel(event) {
            event.preventDefault();

            if (user_settings.volume_hotkey && (
               event[user_settings.volume_hotkey] ||
               (
                  user_settings.volume_hotkey === 'none' &&
                  !event.ctrlKey && !event.altKey && !event.shiftKey)
            )) {

               if (!videoPlayer.hasOwnProperty('getVolume')) {
                  console.error('getVolume error');
                  return;
               }

               const step = user_settings.volume_step;
               const delta = Math.sign(event.wheelDelta) * step;
               const currentVolume = videoPlayer.getVolume();
               // const level = setVolumeLevel(getVolume + delta, getVolume);
               setVolumeLevel(currentVolume + delta, currentVolume);

               showIndicator(this, videoPlayer.getVolume());
            }
         }

         function setVolumeLevel(volume, volumeСurrent) {
            // console.log('volume', volume, volumeStatus);
            const limiter = d => (d > 100 ? 100 : d < 0 ? 0 : d);
            const volumeToSet = limiter(parseInt(volume));

            // check is new volume level
            if (volumeToSet !== volumeСurrent) {
               videoPlayer.isMuted() && videoPlayer.unMute();
               videoPlayer.setVolume(volumeToSet); // 0 - 100

               // check is correct
               if (volumeToSet === videoPlayer.getVolume()) {
                  saveInSession(volumeToSet);
                  // console.log('volume saved');
               } else console.error('setVolume error. Different: %s!=%s', volumeToSet, videoPlayer.getVolume());
            }

            // saving state in sessions
            function saveInSession(level) {
               if (!level) return;
               const now = (new Date).getTime();
               const muted = level ? "false" : "true";

               try {
                  sessionStorage['yt-player-volume'] = JSON.stringify({ "data": { "volume": level, "muted": muted }, "expiration": now, "creation": now });
               } catch (err) {
                  console.info(`${err.name}: save "volume" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
               }
            }
            // return volumeToSet === videoPlayer.getVolume() ? volumeToSet : false;
         }

         function showIndicator(display_container, level) {
            if (!user_settings.show_volume_indicator) return;

            const divId = "volume-player-info";
            let div = document.getElementById(divId);

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

            function updateIndicator(pt) {
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
            step: 5,
            min: 0,
            max: 100,
            value: 100,
         },
         'volume_step': {
            _elementType: 'input',
            label: 'Step',
            type: 'number',
            title: 'percent',
            placeholder: '%',
            step: 5,
            min: 5,
            max: 30,
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
