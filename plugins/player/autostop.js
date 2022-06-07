window.nova_plugins.push({
   id: 'video-stop-preload',
   title: 'Stop video preload',
   'title:zh': '停止视频预加载',
   'title:ja': 'ビデオのプリロードを停止します',
   'title:ko': '비디오 미리 로드 중지',
   'title:es': 'Detener la precarga de video',
   'title:pt': 'Parar o pré-carregamento de vídeo',
   'title:fr': 'Arrêter le préchargement de la vidéo',
   // 'title:tr': 'Video önyüklemesini durdur',
   'title:de': 'Beenden Sie das Vorladen des Videos',
   run_on_pages: 'watch, embed',
   // restart_on_transition: true,
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('#movie_player')
         .then(movie_player => {
            let disableStop;

            movie_player.stopVideo(); // init before update onStateChange
            // reset disableStop
            document.addEventListener('yt-navigate-start', () => disableStop = false);

            movie_player.addEventListener('onStateChange', onPlayerStateChange.bind(this));

            function onPlayerStateChange(state) {
               // console.debug('onStateChange', NOVA.getPlayerState(state), document.visibilityState);
               if (user_settings.stop_preload_ignore_playlist && location.search.includes('list=')) return;
               // // stop inactive tab
               // if (user_settings.stop_preload_ignore_active_tab && document.visibilityState == 'visible') {
               //    // console.debug('cancel stop in active tab');
               //    return;
               // }

               // -1: unstarted
               // 0: ended
               // 1: playing
               // 2: paused
               // 3: buffering
               // 5: cued
               // if (['BUFFERING', 'PAUSED', 'PLAYING'].includes(NOVA.getPlayerState(state))) {
               if (!disableStop && state > 0 && state < 5) {
                  movie_player.stopVideo();
               }
            }

            document.addEventListener('click', disableHoldStop);
            document.addEventListener('keyup', ({ code }) => (code == 'Space') && disableHoldStop());

            function disableHoldStop() {
               if (!disableStop && movie_player.contains(document.activeElement)) {
                  disableStop = true;
                  movie_player.playVideo(); // dirty fix. onStateChange starts before click/keyup
               }
            }
         });

   },
   options: {
      stop_preload_ignore_playlist: {
         _tagName: 'input',
         label: 'Ignore playlist',
         'label:zh': '忽略播放列表',
         'label:ja': 'プレイリストを無視する',
         'label:ko': '재생목록 무시',
         'label:es': 'Ignorar lista de reproducción',
         'label:pt': 'Ignorar lista de reprodução',
         'label:fr': 'Ignorer la liste de lecture',
         // 'label:tr': 'Oynatma listesini yoksay',
         'label:de': 'Wiedergabeliste ignorieren',
         type: 'checkbox',
      },
      // stop_preload_ignore_active_tab: {
      //    _tagName: 'input',
      //    label: 'Only in inactive tab', // inactive - background
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    type: 'checkbox',
      //    title: 'Ignore active tab',
      //    // 'title:zh': '',
      //    // 'title:ja': '',
      //    // 'title:ko': '',
      //    // 'title:es': '',
      //    // 'title:pt': '',
      //    // 'title:fr': '',
      //    // 'title:tr': '',
      //    // 'title:de': '',
      // },
   }
});
