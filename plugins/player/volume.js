_plugins_conteiner.push({
   name: 'Mouse wheel volume control',
   id: 'volume-wheel',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   desc: 'Use mouse wheel to change volume of video',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(player => {
            // init default_volume_level
            if (+user_settings.default_volume_level) {
               setVolumeLevel(user_settings.default_volume_level);
            }

            // show indicator
            player.querySelector('video')
               .addEventListener('volumechange', function () {
                  // console.debug('volumechange', player.getVolume(), this.volume);
                  YDOM.bezelTrigger(player.getVolume() + '%');
               });

            if (user_settings.volume_hotkey) {
               // mousewheel in player area
               document.querySelector('.html5-video-container')
                  .addEventListener("wheel", evt => {
                     evt.preventDefault();

                     if (evt[user_settings.volume_hotkey]
                        || (user_settings.volume_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
                        // console.debug('hotkey caught');
                        const step = +user_settings.volume_step * Math.sign(evt.wheelDelta);
                        adjustVolumeBy(step);
                     }
                  });
            }

            function adjustVolumeBy(delta) {
               return setVolumeLevel(player.getVolume() + parseInt(delta));
            }

            function setVolumeLevel(level) {
               if (!player.hasOwnProperty('getVolume')) return console.error('Error getVolume');
               const volumeToSet = Math.max(0, Math.min(100, parseInt(level)));

               // set new volume level
               if (volumeToSet !== player.getVolume()) {
                  player.isMuted() && player.unMute();
                  player.setVolume(volumeToSet); // 0 - 100

                  if (volumeToSet === player.getVolume()) {
                     saveInSession(volumeToSet);

                  } else {
                     console.error('setVolumeLevel error! Different: %s!=%s', volumeToSet, player.getVolume());
                  }
               }

               return volumeToSet === player.getVolume() && volumeToSet;

               function saveInSession(level) {
                  if (!level) return;

                  const storageData = {
                     creation: Date.now(),
                     data: { "volume": level, "muted": (level ? "false" : "true") },
                  };

                  try {
                     localStorage["yt-player-volume"] = JSON.stringify(
                        Object.assign({ expiration: Date.now() + 2592e6 }, storageData)
                     );
                     sessionStorage["yt-player-volume"] = JSON.stringify(storageData);
                     // console.debug('volume saved', ...arguments);

                  } catch (err) {
                     console.info(`${err.name}: save "volume" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                  }
               }
            };

         });

   },
   opt_export: {
      'default_volume_level': {
         _tagName: 'input',
         // label: 'Level at startup',
         label: 'Default volume',
         type: 'number',
         title: '0 - auto',
         placeholder: '%',
         step: 5,
         min: 0,
         max: 100,
         value: 100,
      },
      'volume_step': {
         _tagName: 'input',
         label: 'Step',
         type: 'number',
         title: 'in percents',
         placeholder: '%',
         step: 5,
         min: 5,
         max: 30,
         value: 10,
      },
      'volume_hotkey': {
         _tagName: 'select',
         label: 'Hotkey',
         options: [
            { label: 'wheel', value: 'none', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'alt+wheel', value: 'altKey' },
            { label: 'disable', value: false },
         ],
      },
   },
});
