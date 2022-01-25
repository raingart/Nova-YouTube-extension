window.nova_plugins.push({
   id: 'fullscreen-mode',
   title: 'Fullscreen mode',
   'title:zh': '全屏模式',
   'title:ja': 'フルスクリーンモード',
   'title:es': 'Modo de pantalla completa',
   'title:pt': 'Modo tela cheia',
   'title:de': 'Vollbildmodus',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            const initFullscreen = setInterval(() => {
               if (document.fullscreenElement || movie_player.isFullscreen()) {
                  clearInterval(initFullscreen);
                  return;
               }
               toggleFullscreen();
            }, 1000); // Calling too often causes problems

            video.addEventListener('play', () => toggleFullscreen());
            video.addEventListener('ended', () => toggleFullscreen('exit'));

            if (user_settings.fullscreen_mode_pause_exit) {
               video.addEventListener('pause', () => toggleFullscreen('exit'));
            }
         });

      function toggleFullscreen(switch_off) {
         if (movie_player.classList.contains('ad-showing')) return;

         if ((switch_off && movie_player.isFullscreen() && document.fullscreenElement) // switch off
            || (!switch_off && !movie_player.isFullscreen() && !document.fullscreenElement) // switch on
         ) {
            if (location.host == 'm.youtube.com') {
               document.body.querySelector('button.fullscreen-icon')?.click();
            } else {
               movie_player.toggleFullscreen();
            }
         }
      }

   },
   options: {
      fullscreen_mode_pause_exit: {
         _tagName: 'input',
         label: 'Exit fullscreen on pause',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:de': '',
         type: 'checkbox',
         // title: '',
      },
   }
});
