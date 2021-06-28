_plugins_conteiner.push({
   id: 'player-loop',
   title: 'Loop playback',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Loop video playback',
   _runtime: user_settings => {

      YDOM.waitElement('video')
         .then(video => {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
            video.addEventListener('loadeddata', function () {
               this.loop = true;
            });
         });
   },
});
