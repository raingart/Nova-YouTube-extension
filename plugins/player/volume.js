_plugins_conteiner.push({
   name: 'Mouse wheel volume control',
   id: 'volume-wheel',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   desc: 'Use mouse wheel to change volume of video',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(videoPlayer => {
            // init default_volume_level
            setVolumeLevel(user_settings.default_volume_level);

            // mousewheel in player area
            document.querySelector('.html5-video-container')
               .addEventListener("wheel", event => {
                  if (!videoPlayer.hasOwnProperty('getVolume')) return console.error('Error getVolume');
                  event.preventDefault();

                  if (user_settings.volume_hotkey && (
                     event[user_settings.volume_hotkey] ||
                     (
                        user_settings.volume_hotkey == 'none' &&
                        !event.ctrlKey && !event.altKey && !event.shiftKey)
                  )) {
                     // console.debug('hotkey caught');
                     const
                        step = parseInt(user_settings.volume_step),
                        delta = Math.sign(event.wheelDelta) * step,
                        currentVolume = videoPlayer.getVolume();

                     if (setVolumeLevel(currentVolume + delta) === false) {
                        return console.error('Error setVolumeLevel');
                     }
                  }
               });

            function setVolumeLevel(volume) {
               const volumeToSet = Math.max(0, Math.min(100, +volume));

               // check is new volume level
               if (volumeToSet !== videoPlayer.getVolume()) {
                  videoPlayer.isMuted() && videoPlayer.unMute();
                  videoPlayer.setVolume(volumeToSet); // 0 - 100

                  // check is correct
                  if (volumeToSet === videoPlayer.getVolume()) {
                     saveInSession(volumeToSet);

                  } else console.error('setVolume error. Different: %s!=%s', volumeToSet, videoPlayer.getVolume());
               }

               return volumeToSet === videoPlayer.getVolume() ? volumeToSet : false;
            }
         });

      // saving state in sessions
      function saveInSession(level) {
         if (!level) return;
         const timeNow = (new Date).getTime();
         const muted = level ? "false" : "true";

         try {
            sessionStorage['yt-player-volume'] = JSON.stringify({ "data": { "volume": level, "muted": muted }, "expiration": timeNow, "creation": timeNow });
         } catch (err) {
            console.info(`${err.name}: save "volume" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
         }
         // console.debug('volume saved');
      }

   },
   opt_export: {
      'default_volume_level': {
         _tagName: 'input',
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
         _tagName: 'input',
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
         _tagName: 'select',
         label: 'Hotkey',
         options: [
            { label: 'wheel', value: 'none', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'alt+wheel', value: 'altKey' },
         ]
      },
   },
});
