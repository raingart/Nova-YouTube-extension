// for test:
// https://www.youtube.com/playlist?list=WL
// https://www.youtube.com/watch?v=Y07--9_sLpA&list=OLAK5uy_nMilHFKO3dZsuNgVWmEKDZirwXRXMl9yM - hidden playlist container
// https://www.youtube.com/playlist?list=PLJP5_qSxMbkLzx-XiaW0U8FcpYGgwlh5s -simple
// https://www.youtube.com/watch?v=L1bBMndgmM0&list=PLNGZuc13nIrqOrynIHoy3VdQ5FDXypMSO&index=5 - has 36:00
// https://www.youtube.com/watch?v=v0PqdzLdFSk&list=OLAK5uy_m-Dv_8xLBZNZeysu7yXsw7psMf48nJ7tw - 1 unavailable video is hidden
// https://www.youtube.com/watch?v=RhxF9Qg5mOU&list=RDEMd-ObnI9A_YffTMufAPhAHQ&index=9 - infinite playlist
// https://www.youtube.com/watch?v=30PcoavqFq0&list=PLS3XGZxi7cBXnYfJpUas1ud6XATvWATHb&index=305 - big playlist

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
   // 'title:tr': 'Oynatma listesi süresini göster',
   'title:de': 'Wiedergabelistendauer anzeigen',
   'title:pl': 'Pokaż czas trwania playlisty',
   'title:ua': 'Показувати тривалість списку відтворення',
   run_on_pages: 'watch, playlist, -mobile',
   restart_on_location_change: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/408966-display-remaining-youtube-playlist-time
      // alt2 - https://greasyfork.org/en/scripts/407457-youtube-playlist-duration-calculator
      // alt3 - https://greasyfork.org/en/scripts/439291-youtube-playlist-length
      // alt4 - https://greasyfork.org/en/scripts/427936-youtube-playlist-duration
      // alt5 - https://greasyfork.org/en/scripts/418188-youtube-playlist-total-duration
      // alt6 - https://greasyfork.org/en/scripts/11712-youtube-playlist-time
      // alt7 - https://chrome.google.com/webstore/detail/pijbakhgmhhadeakaocjfockpndcpobk
      // alt8 - https://greasyfork.org/en/scripts/465609-youtube-playlist-calculator
      // alt9 - https://greasyfork.org/en/scripts/475879-youtube-playlist-length

      const
         SELECTOR_ID = 'nova-playlist-duration',
         // SELECTOR_ID = 'nova-playlist-duration-' + NOVA.currentPage, // Strategy 11
         // CACHE_PREFIX = SELECTOR_ID + ':',
         // STORE_NAME = CACHE_PREFIX + playlistId,
         playlistId = NOVA.queryURL.get('list');

      if (!playlistId) return;

      switch (NOVA.currentPage) {
         case 'playlist':
            // NOVA.waitSelector('#stats yt-formatted-string:first-child') // old
            // NOVA.waitSelector('.metadata-stats')
            // NOVA.waitSelector('.metadata-wrapper')
            NOVA.waitSelector('#owner-text a')
               .then(el => {
                  if (duration = getPlaylistDuration()) {
                     insertToHTML({ 'container': el, 'text': duration });
                  }
                  else {
                     getPlaylistDurationFromThumbnails('#primary #thumbnail #overlays #text:not(:empty)')
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
                        ?.contents[0].playlistVideoListRenderer?.contents
                        || document.body.querySelector('ytd-watch-flexy')?.__data.playlistData?.contents
                        || document.body.querySelector('ytd-watch-flexy')?.data?.playlist?.playlist?.contents
                        ;

                     const duration = vids_list?.reduce((acc, vid) => acc + (isNaN(vid.playlistVideoRenderer?.lengthSeconds) ? 0 : parseInt(vid.playlistVideoRenderer.lengthSeconds)), 0);

                     if (duration) {
                        return outFormat(duration);
                     }
                  }
               });
            break;

         case 'watch':
            NOVA.waitSelector('#secondary .index-message-wrapper', { destroy_if_url_changes: true })
               .then(el => {
                  const waitPlaylist = setInterval(() => {
                     const
                        playlistLength = movie_player.getPlaylist()?.length, // || document.body.querySelector('ytd-player')?.player_?.getPlaylist()?.length,
                        playlistList = document.body.querySelector('yt-playlist-manager')?.currentPlaylistData_?.contents
                           .filter(e => e.playlistPanelVideoRenderer?.lengthText?.simpleText)
                           .map(e => NOVA.timeFormatTo.hmsToSec(e.playlistPanelVideoRenderer.lengthText.simpleText));

                     console.assert(playlistList?.length === playlistLength, 'playlist loading:', playlistList?.length + '/' + playlistLength);

                     if (playlistList?.length === playlistLength) {
                        clearInterval(waitPlaylist);

                        // Strategy 1 API
                        if (duration = getPlaylistDuration(playlistList)) {
                           insertToHTML({ 'container': el, 'text': duration });
                        }
                        // Strategy 2 HTML. this method ignores progress
                        // this method ignores progress
                        else if (!user_settings.playlist_duration_progress_type) {
                           getPlaylistDurationFromThumbnails('#playlist #playlist-items #unplayableText[hidden]')
                              .then(duration => insertToHTML({ 'container': el, 'text': duration }));
                        }
                     }
                  }, 2000); // 2 sec

                  // Warning! don't use "NOVA.waitUntil" below. Incorrect update of current currentIndex
                  // const playlistList = await NOVA.waitUntil(() => {
                  //    const
                  //       playlistLength = movie_player.getPlaylist()?.length, // || document.body.querySelector('ytd-player')?.player_?.getPlaylist()?.length,
                  //       playlistList = document.body.querySelector('yt-playlist-manager')?.currentPlaylistData_?.contents
                  //          .filter(e => e.playlistPanelVideoRenderer?.lengthText?.simpleText)
                  //          .map(e => NOVA.timeFormatTo.hmsToSec(e.playlistPanelVideoRenderer.lengthText.simpleText));

                  //    console.assert(playlistList?.length === playlistLength, 'playlist loading:', playlistList?.length + '/' + playlistLength);

                  //    if (playlistList?.length === playlistLength) {
                  //       return playlistList;
                  //    }
                  // }, 2000);

                  function getPlaylistDuration(total_list) {
                     const currentIndex = movie_player.getPlaylistIndex();// || playlistList?.findIndex(c => c.playlistPanelVideoRenderer.selected);

                     let elapsedList = [...total_list];
                     // if (window.nova_playlistReversed) playlistDuration = playlistDuration.reverse();

                     switch (user_settings.playlist_duration_progress_type) {
                        case 'done':
                           elapsedList.splice(currentIndex);
                           // console.debug('done vids_list.length:', vids_list.length);
                           break;

                        case 'left':
                           elapsedList.splice(0, currentIndex);
                           // console.debug('left vids_list.length:', vids_list.length);
                           break;

                        // case 'total': // skiping
                     }
                     const sumArr = arr => arr.reduce((acc, time) => acc + +time, 0);
                     return outFormat(
                        sumArr(elapsedList),
                        user_settings.playlist_duration_percentage ? sumArr(total_list) : false
                     );
                  }
               });
            break;
      }

      function getPlaylistDurationFromThumbnails(items_selector = required()) {
         // console.log('thumbnails_method', ...arguments);
         if (container && !(container instanceof HTMLElement)) {
            return console.error('container not HTMLElement:', container);
         }

         return new Promise(resolve => {
            let forcePlaylistRun = false;
            const waitThumbnails = setInterval(() => {
               const
                  timeStampList = document.body.querySelectorAll(items_selector),
                  playlistLength = movie_player.getPlaylist()?.length
                     || document.body.querySelector('ytd-player')?.player_?.getPlaylist()?.length
                     || timeStampList.length,
                  duration = getTotalTime(timeStampList);

               console.assert(timeStampList.length === playlistLength, 'playlist loading:', timeStampList.length + '/' + playlistLength);

               if (+duration && timeStampList.length
                  && (timeStampList.length === playlistLength || forcePlaylistRun)
               ) {
                  clearInterval(waitThumbnails);
                  resolve(outFormat(duration));
               }
               // set force calc duration
               else if (!forcePlaylistRun) {
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
         let outArr = [
            // time
            NOVA.timeFormatTo.HMS.digit(
               (NOVA.currentPage == 'watch' && NOVA.videoElement?.playbackRate)
                  ? (duration / NOVA.videoElement.playbackRate) : duration
            )
         ];
         // pt
         if (total) {
            outArr.push(`(${~~(duration * 100 / total) + '%'})`);
            // progress type (done, left, total)
            if (user_settings.playlist_duration_progress_type) {
               outArr.push(user_settings.playlist_duration_progress_type);
            }
         }
         return ' - ' + outArr.join(' ');
      }

      function insertToHTML({ text = '', container = required() }) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         // (document.getElementById(SELECTOR_ID) || (function () { // Strategy 11
         (container.querySelector(`#${SELECTOR_ID}`) || (function () {
            // container.insertAdjacentHTML('beforeend', `<span id="${SELECTOR_ID}">${text}</span>`);
            // return document.getElementById(SELECTOR_ID);
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
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         label: 'Time display mode',
         'title:zh': '时间显示方式',
         'title:ja': '時間表示モード',
         'title:ko': '시간 표시 모드',
         'title:id': 'Mode tampilan waktu',
         'title:es': 'Modo de visualización de la hora',
         'title:pt': 'Modo de exibição de tempo',
         'title:fr': "Mode d'affichage de l'heure",
         'title:it': "Modalità di visualizzazione dell'ora",
         // 'title:tr': 'Zaman görüntüleme modu',
         'title:de': 'Zeitanzeigemodus',
         'title:pl': 'Tryb wyświetlania czasu',
         'title:ua': 'Режим відображення часу',
         options: [
            {
               label: 'done', value: 'done',
               'label:zh': '结束',
               'label:ja': '終わり',
               'label:ko': '보았다',
               // 'label:id': '',
               'label:es': 'hecho',
               'label:pt': 'feito',
               'label:fr': 'regardé',
               // 'label:it': '',
               // 'label:tr': 'tamamlamak',
               'label:de': 'fertig',
               'label:pl': 'zakończone',
               'label:ua': 'завершено',
            },
            {
               label: 'left', value: 'left',
               'label:zh': '剩下',
               'label:ja': '残り',
               'label:ko': '왼쪽',
               // 'label:id': '',
               'label:es': 'izquierda',
               'label:pt': 'deixou',
               'label:fr': 'à gauche',
               // 'label:it': '',
               // 'label:tr': 'sola',
               'label:de': 'links',
               'label:pl': 'pozostało',
               'label:ua': 'залишилось',
            },
            {
               label: 'total', value: false, selected: true,
               'label:zh': '全部的',
               'label:ja': '全て',
               'label:ko': '총',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               'label:fr': 'le total',
               // 'label:it': '',
               // 'label:tr': 'toplam',
               'label:de': 'gesamt',
               'label:pl': 'w sumie',
               'label:ua': 'загалом',
            },
         ],
      },
      playlist_duration_percentage: {
         _tagName: 'input',
         // label: 'Add percentage',
         label: 'Add %',
         'label:zh': '显示百分比',
         'label:ja': 'パーセンテージを表示',
         'label:ko': '백분율 추가',
         'label:id': 'Tambahkan persentase',
         'label:es': 'Agregar porcentaje',
         'label:pt': 'Adicionar porcentagem',
         'label:fr': 'Ajouter un pourcentage',
         'label:it': 'Aggiungi percentuale',
         // 'label:tr': 'Yüzde ekle',
         'label:de': 'Prozent hinzufügen',
         'label:pl': 'Pokaż procenty',
         'label:ua': 'Показати %',
         type: 'checkbox',
         'data-dependent': { 'playlist_duration_progress_type': ['done', 'left'] },
      },
   }
});
