// for test
// the adjustment area depends on the video size. Problems are visible at non-standard aspect ratio
// https://www.youtube.com/watch?v=U9mUwZ47z3E - ultra-wide
// https://www.youtube.com/watch?v=4Zivt4wbvoM - narrow

window.nova_plugins.push({
   id: 'volume-wheel',
   title: 'Volume',
   'title:zh': '体积',
   'title:ja': '音量',
   'title:es': 'Volumen',
   // 'title:pt': 'Volume',
   'title:de': 'Volumen',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: 'Use mouse wheel to change volume of video',
   desc: 'with mousewheel',
   'desc:zh': '带鼠标滚轮',
   'desc:ja': 'マウスホイール付き',
   'desc:es': 'con rueda de ratón',
   'desc:pt': 'com roda do mouse',
   'desc:de': 'mit mausrad',
   _runtime: user_settings => {

      NOVA.waitElement('#movie_player')
         .then(player => {
            // trigger default indicator
            player.querySelector('video')
               .addEventListener('volumechange', function () {
                  // console.debug('volumechange', player.getVolume(), this.volume);
                  NOVA.bezelTrigger(player.getVolume() + '%');
               });

            if (user_settings.volume_hotkey) {
               // mousewheel in player area
               document.body.querySelector('.html5-video-container')
                  .addEventListener('wheel', evt => {
                     evt.preventDefault();

                     if (evt[user_settings.volume_hotkey] || (user_settings.volume_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
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
               // Strategy 1
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
                        console.warn(`${err.name}: save "volume" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                     }
                  }
               },
               // Strategy 2
               // html5(level = 50) {
               //    // I'm too lazy to implement it
               // }
            };

            // init volume_level_default
            if (+ user_settings.volume_level_default) {
               playerVolume.set(+user_settings.volume_level_default);
            }

         });

   },
   options: {
      volume_level_default: {
         _tagName: 'input',
         // label: 'Level at startup',
         label: 'Default volume',
         'label:zh': '默认音量',
         'label:ja': 'デフォルトのボリューム',
         'label:es': 'Volumen predeterminado',
         'label:pt': 'Volume padrão',
         'label:de': 'Standardlautstärke',
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
         'label:zh': '步',
         // 'label:ja': 'ステップ',
         'label:es': 'Paso',
         'label:pt': 'Degrau',
         'label:de': 'Schritt',
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
         'label:zh': '热键',
         // 'label:ja': 'ホットキー',
         'label:es': 'Tecla de acceso rápido',
         'label:pt': 'Tecla de atalho',
         'label:de': 'Schnelltaste',
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
