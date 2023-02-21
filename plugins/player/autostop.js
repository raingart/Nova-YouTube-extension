// for  test
// https://www.youtube.com/embed/668nUCeBHyY?autoplay=1 - skip stoped embed

window.nova_plugins.push({
   id: 'video-stop-preload',
   title: 'Stop video preload',
   'title:zh': '停止视频预加载',
   'title:ja': 'ビデオのプリロードを停止します',
   'title:ko': '비디오 미리 로드 중지',
   'title:id': 'Hentikan pramuat video',
   'title:es': 'Detener la precarga de video',
   'title:pt': 'Parar o pré-carregamento de vídeo',
   'title:fr': 'Arrêter le préchargement de la vidéo',
   'title:it': 'Interrompi il precaricamento del video',
   // 'title:tr': 'Video önyüklemesini durdur',
   'title:de': 'Beenden Sie das Vorladen des Videos',
   'title:pl': 'Zatrzymaj ładowanie wideo',
   'title:ua': 'Зупинити передзавантаження відео',
   run_on_pages: 'watch, embed',
   // restart_on_location_change: true,
   section: 'player',
   desc: 'Prevent the player from buffering video before playing',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/448590-youtube-autoplay-disable

      // if (user_settings['video-autopause']) return; // conflict with plugin. This plugin has a higher priority. that's why it's disabled/commented

      if (user_settings.stop_preload_embed && NOVA.currentPage != 'embed') return;
      // fix bug in google drive
      if (location.hostname == 'youtube.googleapis.com') return;

      NOVA.waitElement('#movie_player')
         .then(async movie_player => {
            let disableStop;

            // reset disableStop
            document.addEventListener('yt-navigate-start', () => disableStop = false);

            movie_player.addEventListener('onStateChange', onPlayerStateChange.bind(this));

            await NOVA.waitUntil(() => movie_player.hasOwnProperty('stopVideo')); // fix specific error for firefox
            movie_player.stopVideo(); // init before update onStateChange

            function onPlayerStateChange(state) {
               // console.debug('onStateChange', NOVA.getPlayerState(state), document.visibilityState);
               if (user_settings.stop_preload_ignore_playlist && location.search.includes('list=')) return;
               // if (user_settings.stop_preload_ignore_playlist && (NOVA.queryURL.has('list')/* || !movie_player?.getPlaylistId()*/)) return;
               // // stop inactive tab
               // if (user_settings.stop_preload_ignore_active_tab && document.visibilityState == 'visible') {
               //    // console.debug('cancel stop in active tab');
               //    return;
               // }

               if (user_settings.stop_preload_ignore_live && movie_player.getVideoData().isLive) return;

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
         'label:id': 'Abaikan daftar putar',
         'label:es': 'Ignorar lista de reproducción',
         'label:pt': 'Ignorar lista de reprodução',
         'label:fr': 'Ignorer la liste de lecture',
         'label:it': 'Ignora playlist',
         // 'label:tr': 'Oynatma listesini yoksay',
         'label:de': 'Wiedergabeliste ignorieren',
         'label:pl': 'Zignoruj listę odtwarzania',
         'label:ua': 'Ігнорувати список відтворення',
         type: 'checkbox',
         'data-dependent': { 'stop_preload_embed': false },
      },
      stop_preload_ignore_live: {
         _tagName: 'input',
         label: 'Ignore live',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         'label:ua': 'Ігнорувати живі трансляції',
         type: 'checkbox',
         'data-dependent': { 'stop_preload_embed': false },
      },
      // stop_preload_embed: {
      //    _tagName: 'input',
      //    label: 'Only for embedded videos',
      //    'label:zh': '仅适用于嵌入式视频',
      //    'label:ja': '埋め込みビデオのみ',
      //    'label:ko': '삽입된 동영상에만 해당',
      //    'label:id': 'Hanya untuk video tersemat',
      //    'label:es': 'Solo para videos incrustados',
      //    'label:pt': 'Apenas para vídeos incorporados',
      //    'label:fr': 'Uniquement pour les vidéos intégrées',
      //    'label:it': 'Solo per i video incorporati',
      //    'label:tr': 'Yalnızca gömülü videolar için',
      //    'label:de': 'Nur für eingebettete Videos',
      //    'label:pl': 'Tylko dla osadzonych filmów',
      //    'label:ua': 'Тільки для вбудованих відео',
      //    type: 'checkbox',
      // },
      stop_preload_embed: {
         _tagName: 'select',
         label: 'Apply to video type',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         'label:ua': 'Застосувати до відео',
         options: [
            {
               label: 'all', value: false, selected: true,
               'label:ua': 'всіх',
            },
            {
               label: 'embed', value: 'on',
               'label:ua': 'вбудованих',
            },
         ],
      },
      // stop_preload_ignore_active_tab: {
      //    _tagName: 'input',
      //    label: 'Only in inactive tab', // inactive - background
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
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
      //    title: 'Ignore active tab',
      //    // 'title:zh': '',
      //    // 'title:ja': '',
      //    // 'title:ko': '',
      //    // 'label:id': '',
      //    // 'title:es': '',
      //    // 'title:pt': '',
      //    // 'title:fr': '',
      //    // 'title:it': '',
      //    // 'title:tr': '',
      //    // 'title:de': '',
      //    // 'title:pl': '',
      //    // 'label:ua': '',
      // },
   }
});
