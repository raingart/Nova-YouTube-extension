window.nova_plugins.push({
   id: 'video-autopause',
   title: 'Video autopause',
   run_on_pages: 'watch, embed',
   restart_on_transition: true,
   section: 'player',
   desc: 'Disables autoplay',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            video.addEventListener('playing', setVideoPause.bind(video), { capture: true, once: true });
         });

      function setVideoPause() {
         if (user_settings.video_autopause_ignore_playlist && location.href.includes('list=')) return;
         this.pause();

         const forcePaused = setInterval(() => this.paused || this.pause(), 200); // 100ms
         setTimeout(() => clearInterval(forcePaused), 1000); // 1s
      }

   },
   options: {
      video_autopause_ignore_playlist: {
         _tagName: 'input',
         label: 'ignore playlist',
         type: 'checkbox',
      },
   },
});
