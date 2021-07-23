// for test
// the adjustment area depends on the video size. Problems are visible at non-standard proportions
// https://www.youtube.com/watch?v=U9mUwZ47z3E - ultra-wide
// https://www.youtube.com/watch?v=4Zivt4wbvoM - narrow

window.nova_plugins.push({
   id: 'volume-wheel',
   title: 'Volume control',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: 'Use mouse wheel to change volume of video',
   desc: 'with mousewheel',
   _runtime: user_settings => {

      YDOM.waitElement('#movie_player')
         .then(player => {
            // trigger default indicator
            player.querySelector('video')
               .addEventListener('volumechange', function () {
                  // console.debug('volumechange', player.getVolume(), this.volume);
                  YDOM.bezelTrigger(player.getVolume() + '%');
               });

            if (user_settings.volume_hotkey) {
               // mousewheel in player area
               document.querySelector('.html5-video-container')
                  .addEventListener('wheel', evt => {
                     evt.preventDefault();

                     if (evt[user_settings.volume_hotkey]
                        || (user_settings.volume_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
                        // console.debug('hotkey caught');
                        if (step = +user_settings.volume_step * Math.sign(evt.wheelDelta)) {
                           playerVolume.adjust(step);
                        }
                     }
                  });
            }

            const playerVolume = {
               adjust(delta) {
                  return this.set(player.getVolume() + parseInt(delta));
               },

               set(level = 50) {
                  if (!player.hasOwnProperty('getVolume')) return console.error('Error getVolume');
                  const newLevel = Math.max(0, Math.min(100, parseInt(level)));

                  // set new volume level
                  if (newLevel !== player.getVolume()) {
                     player.isMuted() && player.unMute();
                     player.setVolume(newLevel); // 0 - 100

                     if (newLevel === player.getVolume()) {
                        saveInSession(newLevel);

                     } else {
                        console.error('setVolumeLevel error! Different: %s!=%s', newLevel, player.getVolume());
                     }
                  }

                  return newLevel === player.getVolume() && newLevel;

                  function saveInSession(level = required()) {
                     const storageData = {
                        creation: Date.now(),
                        data: { 'volume': +level, 'muted': (level ? 'false' : 'true') },
                     };

                     try {
                        localStorage['yt-player-volume'] = JSON.stringify(
                           Object.assign({ expiration: Date.now() + 2592e6 }, storageData)
                        );
                        sessionStorage['yt-player-volume'] = JSON.stringify(storageData);
                        // console.debug('volume saved', ...arguments);

                     } catch (err) {
                        console.info(`${err.name}: save "volume" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                     }
                  }
               },
            };

            // init volume_level_default
            if (+user_settings.volume_level_default) {
               playerVolume.set(+user_settings.volume_level_default);
            }

         });

   },
   options: {
      volume_level_default: {
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
      volume_step: {
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
      volume_hotkey: {
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
