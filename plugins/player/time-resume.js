window.nova_plugins.push({
   id: 'player-resume-playback',
   title: 'Resume playback time state',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'On page reload - resume playback',
   _runtime: user_settings => {
      // YouTube History does the same

      const CACHE_PREFIX = 'resume-playback-time';
      const getCacheName = () => CACHE_PREFIX + ':' + (document.getElementById('movie_player')?.getVideoData().video_id || NOVA.queryURL.get('v'));
      let cacheName = getCacheName();

      NOVA.waitElement('#movie_player:not(.ad-showing) video') // dont save ad
         .then(video => {
            // restore
            video.addEventListener('loadeddata', resumePlaybackTime.bind(video));
            // save
            video.addEventListener('timeupdate', () => sessionStorage.setItem(cacheName, video.currentTime));
         });

      function resumePlaybackTime() {
         cacheName = getCacheName(); // for optimization

         if (!NOVA.queryURL.get('t') && (time = +JSON.parse(sessionStorage.getItem(cacheName)))
            // fix the situation where it is impossible to replay item in the playlist
            && ((time + 1) < this.duration || (isNaN(this.duration) && time))
         ) {
            // console.debug('last playback state', time, '/', this.duration);
            this.currentTime = time;
         }
      }

   }
});
