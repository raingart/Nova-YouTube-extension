window.nova_plugins.push({
   id: 'player-resume-playback',
   title: 'Remember playback time',
   // title: 'Resume playback time position',
   'title:zh': '恢复播放时间状态',
   'title:ja': '再生時間の位置を再開します',
   'title:ko': '재생 시간 위치 재개',
   'title:id': 'Lanjutkan posisi waktu pemutaran',
   'title:es': 'Reanudar posición de tiempo de reproducción',
   'title:pt': 'Retomar a posição do tempo de reprodução',
   'title:fr': 'Reprendre la position de temps de lecture',
   'title:it': 'Riprende la posizione del tempo di riproduzione',
   'title:tr': 'Oynatma süresi konumunu devam ettir',
   'title:de': 'Wiedergabezeitposition fortsetzen',
   'title:pl': 'Powrót do pozycji czasowej odtwarzania',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'On page reload - resume playback',
   'desc:zh': '在页面重新加载 - 恢复播放',
   'desc:ja': 'ページがリロードされると、再生が復元されます',
   'desc:ko': '페이지 새로고침 시 - 재생 재개',
   'desc:id': 'Muat ulang halaman - lanjutkan pemutaran',
   'desc:es': 'En la recarga de la página - reanudar la reproducción',
   'desc:pt': 'Recarregar na página - retomar a reprodução',
   'desc:fr': 'Lors du rechargement de la page - reprendre la lecture',
   'desc:it': 'Ricarica alla pagina: riprende la riproduzione',
   'desc:tr': 'Sayfayı yeniden yükle - oynatmaya devam et',
   'desc:de': 'Auf Seite neu laden - Wiedergabe fortsetzen',
   'desc:pl': 'Przy ponownym załadowaniu strony - wznawiaj odtwarzanie',
   _runtime: user_settings => {
      // fix - Failed to read the 'sessionStorage' property from 'Window': Access is denied for this document.
      if (!navigator.cookieEnabled && NOVA.currentPage == 'embed') return;

      // TODO adSkip alt. - add comparison by duration. Need stream test
      const
         CACHE_PREFIX = 'resume-playback-time',
         getCacheName = () => CACHE_PREFIX + ':' + (document.getElementById('movie_player')?.getVideoData().video_id || NOVA.queryURL.get('v'));

      let cacheName = getCacheName(); // for optimization

      NOVA.waitElement('video')
         .then(video => {
            resumePlayback(video);

            video.addEventListener('loadeddata', resumePlayback.bind(video));

            video.addEventListener('timeupdate', savePlayback.bind(video));

            // embed dont support "t=" parameter
            if (user_settings.player_resume_playback_url_mark && NOVA.currentPage != 'embed') {
               // ignore if initialized with a "t=" parameter
               if (NOVA.queryURL.has('t')) {
                  document.addEventListener('yt-navigate-start',
                     connectSaveStateInURL.bind(video), { capture: true, once: true });

               } else {
                  connectSaveStateInURL.apply(video);
               }
            }
         });

      function savePlayback() {
         // ad skip
         if (this.currentTime > 5 && this.duration > 30 && !movie_player.classList.contains('ad-showing')) {
            // console.debug('save progress time', this.currentTime);
            sessionStorage.setItem(cacheName, ~~this.currentTime);
            // new URL(location.href).searchParams.set('t', ~~this.currentTime); // url way
         }
      }

      function resumePlayback() {
         if (NOVA.queryURL.has('t')) return;
         cacheName = getCacheName(); // for optimization

         if ((time = +sessionStorage.getItem(cacheName))
            && (time < (this.duration - 1)) // fix for playlist
         ) {
            // console.debug('resumePlayback', `${time}/${this.duration}`);
            this.currentTime = time;
         }
      }

      // function resumePlayback() {
      //    if (!isNaN(this.duration) && this.currentTime < this.duration) {
      //       window.location.hash = "t=" + this.currentTime;
      //    }
      // }

      function connectSaveStateInURL() {
         const changeUrl = (new_url = required()) => window.history.replaceState(null, null, new_url);
         let delaySaveOnPauseURL; // fix glitch update url when rewinding video
         // save
         this.addEventListener('pause', () => {
            if (this.currentTime < (this.duration - 1) && this.currentTime > 5 && this.duration > 10) { // fix video ended
               delaySaveOnPauseURL = setTimeout(() => {
                  changeUrl(NOVA.queryURL.set({ 't': ~~this.currentTime + 's' }));
               }, 100); // 100ms
            }
         })
         // clear
         this.addEventListener('play', () => {
            if (typeof delaySaveOnPauseURL === 'number') clearTimeout(delaySaveOnPauseURL);

            if (NOVA.queryURL.has('t')) changeUrl(NOVA.queryURL.remove('t'));
         });
      }

   },
   options: {
      player_resume_playback_url_mark: {
         _tagName: 'input',
         label: 'Mark time in URL when paused',
         'label:zh': '暂停时在 URL 中节省时间',
         'label:ja': '一時停止したときにURLで時間を節約する',
         'label:ko': '일시 중지 시 URL에 시간 표시',
         'label:id': 'Tandai waktu di URL saat dijeda',
         'label:es': 'Marcar tiempo en URL cuando está en pausa',
         'label:pt': 'Marcar tempo no URL quando pausado',
         'label:fr': "Marquer l'heure dans l'URL en pause",
         'label:it': "Segna il tempo nell'URL quando è in pausa",
         'label:tr': "Duraklatıldığında zamanı URL'de işaretleyin",
         'label:de': 'Zeit in URL markieren, wenn pausiert',
         'label:pl': 'Zaznacz czas w adresie URL po wstrzymaniu',
         type: 'checkbox',
         title: 'update ?t=',
      },
   }
});
