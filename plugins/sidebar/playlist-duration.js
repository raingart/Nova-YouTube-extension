// for test:
// https://www.youtube.com/playlist?list=WL
// https://www.youtube.com/watch?v=G134f9wUGcU&list=PLVaR5VNkhu5533wzRj0W0gfXExZ0srdjY - short and has [Private video]
// https://www.youtube.com/watch?v=Y07--9_sLpA&list=OLAK5uy_nMilHFKO3dZsuNgVWmEKDZirwXRXMl9yM - hidden playlist conteiner
// https://www.youtube.com/playlist?list=PLJP5_qSxMbkLzx-XiaW0U8FcpYGgwlh5s -simple
// https://www.youtube.com/watch?v=L1bBMndgmM0&list=PLNGZuc13nIrqOrynIHoy3VdQ5FDXypMSO&index=5 - has 36:00
// https://www.youtube.com/watch?v=v0PqdzLdFSk&list=OLAK5uy_m-Dv_8xLBZNZeysu7yXsw7psMf48nJ7tw - 1 unavailable video is hidden
// https://www.youtube.com/watch?v=RhxF9Qg5mOU&list=RDEMd-ObnI9A_YffTMufAPhAHQ&index=9 - infinite playlist

window.nova_plugins.push({
   id: 'playlist-duration',
   title: 'Show playlist duration',
   'title:zh': '显示播放列表持续时间',
   'title:ja': 'プレイリストの期間を表示',
   'title:ko': '재생목록 재생시간 표시',
   'title:id': 'Tampilkan durasi daftar putar',
   'title:es': 'Mostrar duración de la lista de reproducción',
   'title:pt': 'Mostrar duração da lista de reprodução',
   'title:fr': 'Afficher la durée de la liste de lecture',
   'title:it': 'Mostra la durata della playlist',
   'title:tr': 'Oynatma listesi süresini göster',
   'title:de': 'Wiedergabelistendauer anzeigen',
   'title:pl': 'Pokaż czas trwania playlisty',
   run_on_pages: 'watch, playlist, -mobile',
   restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/408966-display-remaining-youtube-playlist-time
      // alt2 - https://greasyfork.org/en/scripts/407457-youtube-playlist-duration-calculator

      const
         SELECTOR_ID = 'nova-playlist-duration',
         // CACHE_PREFIX = SELECTOR_ID + ':',
         // STORE_NAME = CACHE_PREFIX + playlistId,
         playlistId = NOVA.queryURL.get('list');

      if (!playlistId) return;

      switch (NOVA.currentPage) {
         case 'playlist':
            NOVA.waitElement('#stats yt-formatted-string:first-child')
               .then(el => {
                  if (duration = getPlaylistDuration()) {
                     insertToHTML({ 'container': el, 'text': duration });

                  } else {
                     // getPlaylistDurationFromThumbs()
                     getPlaylistDurationFromThumbnails({
                        'items_selector': '#primary .ytd-thumbnail-overlay-time-status-renderer:not(:empty)',
                     })
                        .then(duration => insertToHTML({ 'container': el, 'text': duration }));
                  }

                  function getPlaylistDuration() {
                     // if (storage = sessionStorage.getItem(STORE_NAME)) {
                     //    // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                     //    return storage;
                     // }

                     const vids_list = (document.body.querySelector('ytd-app')?.data?.response || window.ytInitialData)
                        .contents.twoColumnBrowseResultsRenderer
                        ?.tabs[0].tabRenderer?.content?.sectionListRenderer
                        ?.contents[0].itemSectionRenderer
                        ?.contents[0].playlistVideoListRenderer?.contents;

                     const duration = vids_list?.reduce((acc, vid) => acc + (isNaN(vid.playlistVideoRenderer?.lengthSeconds) ? 0 : parseInt(vid.playlistVideoRenderer.lengthSeconds)), 0);

                     if (duration) return outFormat(duration);
                  }
               });
            break;

         case 'watch':
            NOVA.waitElement('#secondary .index-message-wrapper')
               .then(el => {
                  const waitPlaylist = setInterval(() => {
                     const playlistLength = movie_player.getPlaylist()?.length;

                     let vids_list = document.body.querySelector('ytd-watch, ytd-watch-flexy')
                        ?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents
                        // let vids_list = window.ytInitialData.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents // not updated after page transition!
                        .filter(i => i.playlistPanelVideoRenderer?.hasOwnProperty('videoId')); // filter hidden

                     console.assert(vids_list?.length === playlistLength, 'playlist loading:', vids_list?.length + '/' + playlistLength);

                     if (vids_list?.length && playlistLength && vids_list?.length === playlistLength) {
                        clearInterval(waitPlaylist);

                        if (duration = getPlaylistDuration(vids_list)) {
                           insertToHTML({ 'container': el, 'text': duration });

                        } else if (!user_settings.playlist_duration_progress_type) { // this method ignores progress
                           getPlaylistDurationFromThumbnails({
                              'container': document.body.querySelector('#secondary #playlist'),
                              'items_selector': '#playlist-items #unplayableText[hidden]',
                           })
                              // getPlaylistDurationFromThumbs({
                              //    'container': document.body.querySelector('#secondary #playlist'),
                              // })
                              .then(duration => insertToHTML({ 'container': el, 'text': duration }));
                        }
                     }
                  }, 1000); // 1 sec

                  function getPlaylistDuration(vids_list = []) {
                     // console.log('getPlaylistDuration', ...arguments);

                     // if (!user_settings.playlist_duration_progress_type && (storage = sessionStorage.getItem(STORE_NAME))) {
                     //    // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                     //    return storage;
                     // }

                     // let vids_list = document.body.querySelector('ytd-watch, ytd-watch-flexy')
                     // ?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents || [];

                     // alt if current "playingIdx" always one step behind
                     // const
                     //    videoId = movie_player.getVideoData().video_id || NOVA.queryURL.get('v'),
                     //    playingIdx2 = vids_list?.findIndex(c => c.playlistPanelVideoRenderer.videoId == videoId);
                     // console.assert(playingIdx == playingIdx2, 'playingIdx diff:', playingIdx + '/' + playingIdx2);
                     // if (playingIdx !== playingIdx2) alert(1)

                     if (window.nova_playlistReversed) vids_list = [...vids_list].reverse();

                     const playingIdx = vids_list?.findIndex(c => c.playlistPanelVideoRenderer.selected);
                     // not available for reverse
                     // const playingIdx = movie_player.getPlaylistIndex() || vids_list?.findIndex(c => c.playlistPanelVideoRenderer.selected);

                     let total;

                     switch (user_settings.playlist_duration_progress_type) {
                        case 'done':
                           total = getDurationFromList(vids_list);
                           vids_list.splice(playingIdx);
                           // console.debug('done vids_list.length:', vids_list.length);
                           break;

                        case 'left':
                           total = getDurationFromList(vids_list);
                           vids_list.splice(0, playingIdx);
                           // console.debug('left vids_list.length:', vids_list.length);
                           break;

                        // case 'total': // skiping
                     }

                     if ((duration = getDurationFromList(vids_list)) // disallow set zero
                        || (duration === 0 && user_settings.playlist_duration_progress_type) // allow set zero if use playlist_duration_progress_type
                     ) {
                        return outFormat(duration, total);
                     }

                     function getDurationFromList(arr) {
                        return [...arr]
                           .filter(e => e.playlistPanelVideoRenderer?.thumbnailOverlays?.length) // filter [Private video]
                           .flatMap(e => (time = e.playlistPanelVideoRenderer.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer?.text.simpleText)
                              ? NOVA.timeFormatTo.hmsToSec(time) : [])
                           .reduce((acc, time) => acc + time, 0);
                     }
                  }
               });
            break;
      }

      function getPlaylistDurationFromThumbnails({ items_selector = required(), container }) {
         console.log('thumbnails_method', ...arguments);
         if (container && !(container instanceof HTMLElement)) {
            return console.error('container not HTMLElement:', container);
         }

         return new Promise(resolve => {
            let forcePlaylistRun = false;
            const waitThumbnails = setInterval(() => {
               const
                  playlistLength = document.body.querySelector('ytd-player')?.player_?.getPlaylist()?.length || document.body.querySelectorAll(items_selector)?.length,
                  timeStampList = (container || document.body)
                     .querySelectorAll('.ytd-thumbnail-overlay-time-status-renderer:not(:empty)'),
                  duration = getTotalTime(timeStampList);

               console.assert(timeStampList.length === playlistLength, 'playlist loading:', timeStampList.length + '/' + playlistLength);

               if (+duration && timeStampList.length
                  && (timeStampList.length === playlistLength || forcePlaylistRun)
               ) {
                  clearInterval(waitThumbnails);
                  resolve(outFormat(duration));

               } else if (!forcePlaylistRun) { // set force calc duration
                  setTimeout(() => forcePlaylistRun = true, 1000 * 3); // 3sec
               }

            }, 500); // 500ms
         });

         function getTotalTime(nodes) {
            // console.debug('getTotalTime', ...arguments);
            const arr = [...nodes]
               .map(e => NOVA.timeFormatTo.hmsToSec(e.textContent))
               .filter(Number); // filter PREMIERE

            return arr.length && arr.reduce((acc, time) => acc + +time, 0);
         }
         // function getTotalTime(nodes) {
         //    // console.debug('getTotalTime', ...arguments);
         //    return [...nodes]
         //       // .map(e => NOVA.timeFormatTo.hmsToSec(e.textContent))
         //       // .filter(t => !isNaN(+t)) // filter PREMIERE
         //       .flatMap(e => NOVA.timeFormatTo.hmsToSec(e.textContent) || [])
         //       .reduce((acc, time) => acc + time, 0);
         // }
      }

      function outFormat(duration = 0, total) {
         // console.log('outFormat', ...arguments);
         let outArr = [];
         // time
         outArr.push(NOVA.timeFormatTo.HMS.digit(
            (NOVA.currentPage == 'watch' && NOVA.videoElement?.playbackRate)
               ? duration / NOVA.videoElement.playbackRate : duration
         ));
         // pt
         if (user_settings.playlist_duration_percentage && total) {
            outArr.push(`(${~~(duration * 100 / total) + '%'})`);
         }
         // progress type (done, left, total)
         if (user_settings.playlist_duration_progress_type) {
            outArr.push(user_settings.playlist_duration_progress_type);
         }
         return ' - ' + outArr.join(' ');
      }

      function insertToHTML({ text = '', container = required() }) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         (document.getElementById(SELECTOR_ID) || (function () {
            const el = document.createElement('span');
            el.id = SELECTOR_ID;
            // el.className = 'style-scope ytd-playlist-sidebar-primary-info-renderer';
            // el.style.display = 'inline-block';
            // el.style.margin = '0 .5em';
            return container.appendChild(el);
         })())
            .textContent = ' ' + text;

         // sessionStorage.setItem(STORE_NAME, text); // save in sessionStorage
      }

   },
   options: {
      playlist_duration_progress_type: {
         _tagName: 'select',
         label: 'Time display mode',
         'label:zh': '时间显示方式',
         'label:ja': '時間表示モード',
         'label:ko': '시간 표시 모드',
         'label:id': 'Mode tampilan waktu',
         'label:es': 'Modo de visualización de la hora',
         'label:pt': 'Modo de exibição de tempo',
         'label:fr': "Mode d'affichage de l'heure",
         'label:it': "Modalità di visualizzazione dell'ora",
         'label:tr': 'Zaman görüntüleme modu',
         'label:de': 'Zeitanzeigemodus',
         'label:pl': 'Tryb wyświetlania czasu',
         options: [
            { label: 'done', value: 'done', 'label:zh': '结束', 'label:ja': '終わり', 'label:ko': '보았다', /*'label:id': '',*/ 'label:es': 'hecho', 'label:pt': 'feito', 'label:fr': 'regardé', /*'label:it': '',*/ 'label:tr': 'tamamlamak', 'label:de': 'fertig', 'label:pl': 'zakończone' },
            { label: 'left', value: 'left', 'label:zh': '剩下', 'label:ja': '残り', 'label:ko': '왼쪽', /*'label:id': '',*/ 'label:es': 'izquierda', 'label:pt': 'deixou', 'label:fr': 'À gauche', /*'label:it': '',*/'label:tr': 'sola', 'label:de': 'links', 'label:pl': 'pozostało' },
            { label: 'total', value: false, selected: true, 'label:zh': '全部的', 'label:ja': '全て', 'label:ko': '총', /*'label:id': '', 'label:es': '','label:pt': '',*/  'label:fr': 'le total', /*'label:it': '',*/ 'label:tr': 'toplam', 'label:de': 'gesamt', 'label:pl': 'w sumie' },
         ],
      },
      playlist_duration_percentage: {
         _tagName: 'input',
         label: 'Add percentage',
         'label:zh': '显示百分比',
         'label:ja': 'パーセンテージを表示',
         'label:ko': '백분율 추가',
         'label:id': 'Tambahkan persentase',
         'label:es': 'Agregar porcentaje',
         'label:pt': 'Adicionar porcentagem',
         'label:fr': 'Ajouter un pourcentage',
         'label:it': 'Aggiungi percentuale',
         'label:tr': 'Yüzde ekle',
         'label:de': 'Prozent hinzufügen',
         'label:pl': 'Pokaż procenty',
         type: 'checkbox',
      },
   }
});
