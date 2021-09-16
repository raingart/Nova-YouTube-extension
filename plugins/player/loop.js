window.nova_plugins.push({
   id: 'player-loop',
   title: 'Loop playback',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Loop video playback',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            video.addEventListener('loadeddata', ({ target }) => target.loop = true);
         });
   },
});
