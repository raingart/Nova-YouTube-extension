// for test
// https://www.youtube.com/watch?v=XKa6TpPM70E

window.nova_plugins.push({
   id: 'ad-skip-button',
   title: 'Ad Video Skip',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto click on [Skip Ad] button',
   _runtime: user_settings => {

      NOVA.css.push( // hides the appearance when playing on the next video
         `#movie_player.ad-showing video {
            visibility: hidden !important;
         }`);

      NOVA.waitElement('#movie_player.ad-showing video')
         .then(video => {
            adSkip();

            video.addEventListener('loadeddata', adSkip.bind(video));
            // video.addEventListener('durationupdate', adSkip.bind(video)); // stream
         });

      function adSkip() {
         if (!document.querySelector('#movie_player.ad-showing')) return;

         this.currentTime = this.duration; // set end ad video

         NOVA.waitElement('div.ytp-ad-text.ytp-ad-skip-button-text, button.ytp-ad-skip-button')
            .then(btn => btn.click()); // click skip-ad
      }
   },
});
