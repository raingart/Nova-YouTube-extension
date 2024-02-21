window.nova_plugins.push({
   id: 'player-resume-playback',
   title: 'Remember playback time',
   // title: 'Resume playback time position',
   'title:zh': '恢复播放时间状态',
   'title:ja': '再生時間の位置を再開します',
   // 'title:ko': '재생 시간 위치 재개',
   // 'title:vi': '',
   // 'title:id': 'Lanjutkan posisi waktu pemutaran',
   // 'title:es': 'Reanudar posición de tiempo de reproducción',
   'title:pt': 'Retomar a posição do tempo de reprodução',
   'title:fr': 'Reprendre la position de temps de lecture',
   // 'title:it': 'Riprende la posizione del tempo di riproduzione',
   // 'title:tr': 'Oynatma süresi konumunu devam ettir',
   'title:de': 'Wiedergabezeitposition fortsetzen',
   'title:pl': 'Powrót do pozycji czasowej odtwarzania',
   'title:ua': 'Запам`ятати час відтворення',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'On page reload - resume playback',
   'desc:zh': '在页面重新加载 - 恢复播放',
   'desc:ja': 'ページがリロードされると、再生が復元されます',
   // 'desc:ko': '페이지 새로고침 시 - 재생 재개',
   // 'desc:vi': '',
   // 'desc:id': 'Muat ulang halaman - lanjutkan pemutaran',
   // 'desc:es': 'En la recarga de la página - reanudar la reproducción',
   'desc:pt': 'Recarregar na página - retomar a reprodução',
   'desc:fr': 'Lors du rechargement de la page - reprendre la lecture',
   // 'desc:it': 'Ricarica alla pagina: riprende la riproduzione',
   // 'desc:tr': 'Sayfayı yeniden yükle - oynatmaya devam et',
   'desc:de': 'Auf Seite neu laden - Wiedergabe fortsetzen',
   'desc:pl': 'Przy ponownym załadowaniu strony - wznawiaj odtwarzanie',
   'desc:ua': 'Після завантаження - продовжити відтворення',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/455475-youtube-resumer
      // alt2 - https://greasyfork.org/en/scripts/433474-youtube-resumer
      // alt3 - https://greasyfork.org/en/scripts/453567-youtube-auto-player
      // alt4 - https://greasyfork.org/en/scripts/39153-youtube-auto-resume
      // alt5 - https://greasyfork.org/en/scripts/478990-youtube-resume
      // alt6 - https://greasyfork.org/en/scripts/481388-youtube-video-resumer

      // fix - Failed to read the 'sessionStorage' property from 'Window': Access is denied for this document.
      if (!navigator.cookieEnabled && NOVA.currentPage == 'embed') return;

      // TODO adSkip alt. - add comparison by duration. Need stream test
      const
         CACHE_PREFIX = 'nova-resume-playback-time',
         getCacheName = () => CACHE_PREFIX + ':' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);

      let cacheName;

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            cacheName = getCacheName(); // for optimization

            resumePlayback.apply(video);

            video.addEventListener('loadeddata', resumePlayback.bind(video));

            video.addEventListener('timeupdate', savePlayback.bind(video));

            video.addEventListener('ended', () => sessionStorage.removeItem(cacheName));

            // embed don't support "t=" parameter
            if (user_settings.player_resume_playback_url_mark && NOVA.currentPage != 'embed') {
               // ignore if initialized with a "t=" parameter
               if (NOVA.queryURL.has('t')) {
                  // for next video
                  document.addEventListener('yt-navigate-finish', connectSaveStateInURL.bind(video)
                     , { capture: true, once: true });
               }
               else {
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

      async function resumePlayback() {
         if (NOVA.queryURL.has('t')
            // || NOVA.queryURL.has('time_continue') // ex - https://www.youtube.com/watch?time_continue=68&v=yWUMMg3dmFY

            // Due to the inability to implement the correct work of player_resume_playback_skip_music, the [save-channel-state] plugin was used
            // Strategy 1
            // custom volume from [save-channel-state] plugin
            || (user_settings['save-channel-state'] && await NOVA.storage_obj_manager.getParam('ignore-playback')) // check param name in [save-channel-state] plugin
            // Strategy 2
            // || (user_settings.player_resume_playback_skip_music && NOVA.isMusic())
         ) {
            return;
         }
         // console.debug('resumePlayback isMusic:', NOVA.isMusic()); // always return null before 'loadeddata';

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
         let delaySaveOnPauseURL; // fix glitch update url when rewinding video
         // save
         this.addEventListener('pause', () => {
            // fix video ended
            if (this.currentTime < (this.duration - 1) && this.currentTime > 5 && this.duration > 10) {
               delaySaveOnPauseURL = setTimeout(() => {
                  NOVA.updateUrl(NOVA.queryURL.set({ 't': ~~this.currentTime + 's' }));
               }, 100); // 100ms
            }
         });
         // clear
         this.addEventListener('play', () => {
            if (typeof delaySaveOnPauseURL === 'number') clearTimeout(delaySaveOnPauseURL); // reset timeout

            if (NOVA.queryURL.has('t')) NOVA.updateUrl(NOVA.queryURL.remove('t'));
         });
      }

   },
   options: {
      player_resume_playback_url_mark: {
         _tagName: 'input',
         label: 'Mark time in URL when paused',
         'label:zh': '暂停时在 URL 中节省时间',
         'label:ja': '一時停止したときにURLで時間を節約する',
         // 'label:ko': '일시 중지 시 URL에 시간 표시',
         // 'label:vi': '',
         // 'label:id': 'Tandai waktu di URL saat dijeda',
         // 'label:es': 'Marcar tiempo en URL cuando está en pausa',
         'label:pt': 'Marcar tempo no URL quando pausado',
         'label:fr': "Marquer l'heure dans l'URL en pause",
         // 'label:it': "Segna il tempo nell'URL quando è in pausa",
         // 'label:tr': "Duraklatıldığında zamanı URL'de işaretleyin",
         'label:de': 'Zeit in URL markieren, wenn pausiert',
         'label:pl': 'Zaznacz czas w adresie URL po wstrzymaniu',
         'label:ua': 'Маркувати час в URL-посиланні під час паузи',
         type: 'checkbox',
         // title: 'update ?t=',
         title: 'Makes sense when saving bookmarks',
         'title:zh': '保存书签时有意义',
         'title:ja': 'ブックマークを保存するときに意味があります',
         // 'title:ko': '북마크를 저장할 때 의미가 있습니다.',
         // 'title:vi': '',
         // 'title:id': 'Masuk akal saat menyimpan bookmark',
         // 'title:es': 'Tiene sentido al guardar marcadores',
         'title:pt': 'Faz sentido ao salvar favoritos',
         'title:fr': "Cela a du sens lors de l'enregistrement de signets",
         // 'title:it': 'Ha senso quando si salvano i segnalibri',
         // 'title:tr': '',
         'title:de': 'Sinnvoll beim Speichern von Lesezeichen',
         'title:pl': 'Ma sens podczas zapisywania zakładek',
         'title:ua': 'Має сенс при збереженні закладок',
      },
      // player_resume_playback_skip_music: {
      //    _tagName: 'input',
      //    label: 'Ignore music genre',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
      //    // 'label:vi': '',
      //    // 'label:id': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:it': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    // 'label:pl': '',
      //    // 'label:ua': '',
      //    type: 'checkbox',
      //    // title: '',
      // },
   }
});
