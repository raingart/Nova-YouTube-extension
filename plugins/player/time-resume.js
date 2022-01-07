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

      // TODO adSkip alt. - add comparison by duration. Need stream test
      const
         CACHE_PREFIX = 'resume-playback-time',
         getCacheName = () => CACHE_PREFIX + ':' + (document.getElementById('movie_player')?.getVideoData().video_id || NOVA.queryURL.get('v'));

      let cacheName = getCacheName(); // for optimization

      NOVA.waitElement('video')
         .then(video => {
            resumePlaybackTime(video);

            video.addEventListener('loadeddata', resumePlaybackTime.bind(video));

            video.addEventListener('timeupdate', savePlaybackTime.bind(video));

            if (user_settings.player_resume_playback_on_pause_update_url) {
               // ignore if initialized with a "t=" parameter
               if (NOVA.queryURL.get('t')) {
                  document.addEventListener('yt-navigate-start', connectSaveStateInURL.bind(video), { capture: true, once: true });

               } else {
                  connectSaveStateInURL.apply(video);
               }
            }
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
            && (time < (this.duration - 1)) // fix for playlist
         ) {
            // console.debug('resumePlaybackTime', `${time}/${this.duration}`);
            this.currentTime = time;
         }
      }

      function connectSaveStateInURL() {
         const updateURL = (new_url = required()) => window.history.replaceState(null, null, new_url);
         let delaySaveOnPauseURL; // fix glitch update url when rewinding video
         // save
         this.addEventListener('pause', () => {
            if (this.currentTime < this.duration) { // fix video ended
               delaySaveOnPauseURL = setTimeout(() => {
                  updateURL(NOVA.queryURL.set({ 't': parseInt(this.currentTime) + 's' }));
               }, 100); // 100ms
            }
         })
         // clear
         this.addEventListener('play', () => {
            if (typeof delaySaveOnPauseURL === 'number') clearTimeout(delaySaveOnPauseURL);
            if (NOVA.queryURL.get('t')) {
               updateURL(NOVA.queryURL.set({ 't': '' }).replace(/\&t=$/, ''));
            }
         });

         // alt. strategy
         // NOVA.waitElement('#movie_player')
         //    .then(player => {
         //       player.addEventListener('onStateChange', state => {
         //          console.debug('state', NOVA.PLAYERSTATE[state]);
         //       });
         //    });
      }

   },
   options: {
      player_resume_playback_on_pause_update_url: {
         _tagName: 'input',
         label: 'Mark time in url when paused',
         'label:zh': '暂停时在 url 中节省时间',
         'label:ja': '一時停止したときにURLで時間を節約する',
         'label:es': 'Marcar tiempo en url cuando está en pausa',
         'label:pt': 'Marcar tempo no URL quando pausado',
         'label:de': 'Zeit in URL markieren, wenn pausiert',
         type: 'checkbox',
         title: 'update ?t=',
      },
   }
});
