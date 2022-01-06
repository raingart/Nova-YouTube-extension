// for test
// https://www.youtube.com/watch?v=6-B9sgIPm3I

window.nova_plugins.push({
   id: 'player-resume-playback',
   title: 'Resume playback time state',
   'title:zh': '恢复播放时间状态',
   'title:ja': '再生時間の状態を再開します',
   'title:es': 'Reanudar el estado de tiempo de reproducción',
   'title:pt': 'Retomar o estado do tempo de reprodução',
   'title:de': 'Wiedergabezeitstatus fortsetzen',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'On page reload - resume playback',
   'desc:zh': '在页面重新加载 - 恢复播放',
   'desc:ja': 'ページがリロードされると、再生が復元されます',
   'desc:es': 'En la recarga de la página - reanudar la reproducción',
   'desc:pt': 'Recarregar na página - retomar a reprodução',
   'desc:de': 'Auf Seite neu laden - Wiedergabe fortsetzen',
   _runtime: user_settings => {
      // TODO adSkip alt. - add comparison by duration. Need streen test
      const
         CACHE_PREFIX = 'resume-playback-time',
         getCacheName = () => CACHE_PREFIX + ':'
            + (document.getElementById('movie_player')?.getVideoData().video_id || NOVA.queryURL.get('v'));

      let cacheName = getCacheName(); // for optimization

      NOVA.waitElement('video')
         .then(video => {
            resumePlaybackTime(video);

            video.addEventListener('loadeddata', resumePlaybackTime.bind(video));

            video.addEventListener('timeupdate', savePlaybackTime.bind(video));
         });

      function savePlaybackTime() {
         // ad skip
         if (this.currentTime > 5 && this.duration > 30 && !document.body.querySelector('#movie_player.ad-showing')) {
            // console.debug('save progress time', this.currentTime);
            sessionStorage.setItem(cacheName, Math.floor(this.currentTime));
            // new URL(location.href).searchParams.set('t', Math.floor(this.currentTime)); // url way
         }
      }
      function resumePlaybackTime() {
         if (NOVA.queryURL.get('t')) return;
         cacheName = getCacheName(); // for optimization

         if ((time = +sessionStorage.getItem(cacheName))
            && (time < (this.duration - 1)) // fix playlist
         ) {
            // console.debug('resumePlaybackTime', `${time}/${this.duration}`);
            this.currentTime = time;
         }
      }

   }
});
