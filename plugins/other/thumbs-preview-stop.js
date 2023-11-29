// for test
// https://www.youtube.com/c/miyanomamoru/featured

window.nova_plugins.push({
   id: 'thumbs-preview-stop',
   // title: 'Autostop thumbnail preview playback',
   title: 'Autostop thumbnail playback on hover',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'home, feed, -mobile',
   // restart_on_location_change: true,
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/441227-youtube-remove-preview-from-history

      NOVA.waitSelector('#inline-preview-player')
         .then(player => {
            // Strategy 1. HTML
            NOVA.waitSelector('video', { 'container': player })
               .then(video => {
                  video.addEventListener('play', () => player.stopVideo());
               });

            // Strategy 2. API
            // player.addEventListener('onStateChange', onPlayerStateChange.bind(this));

            // function onPlayerStateChange(state) {
            //    // -1: unstarted
            //    // 0: ended
            //    // 1: playing
            //    // 2: paused
            //    // 3: buffering
            //    // 5: cued
            //    // if (['BUFFERING', 'PAUSED', 'PLAYING'].includes(NOVA.getPlayerState(state))) {
            //    if (state > 0 && state < 5) {
            //       player.stopVideo();
            //    }
            // }
         });

      // Strategy 3. remove
      // NOVA.watchElements({
      //    selectors: ['#inline-preview-player'],
      //    // attr_mark: ''
      //    callback: player => player.remove(),
      // });

   },
});
