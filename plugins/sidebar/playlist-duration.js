// for test:
// https://www.youtube.com/playlist?list=WL
// https://www.youtube.com/watch?v=G134f9wUGcU&list=PLVaR5VNkhu5533wzRj0W0gfXExZ0srdjY - short and has [Private video]
// https://www.youtube.com/watch?v=oxqQw1o5Tuk&list=RDlaemnkfj1lo - hidden playlist conteiner

window.nova_plugins.push({
   id: 'playlist-duration',
   title: 'Show playlist duration',
   'title:zh': '显示播放列表持续时间',
   'title:ja': 'プレイリストの期間を表示',
   'title:es': 'Mostrar duração da lista de reprodução',
   'title:pt': 'Mostrar duração da lista de reprodução',
   'title:de': 'Playlist-Dauer anzeigen',
   run_on_pages: 'watch, playlist',
   restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'playlist-duration-time',
         CACHE_PREFIX = SELECTOR_ID + ':',
         playlistId = NOVA.queryURL.get('list'),
         STORE_NAME = CACHE_PREFIX + playlistId;

      if (!playlistId) return;

      switch (NOVA.currentPageName()) {
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
                     if (storage = sessionStorage.getItem(STORE_NAME)) {
                        // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                        return storage;
                     }

                     const vids_list = (document.body.querySelector('ytd-app')?.data?.response || window.ytInitialData)
                        .contents.twoColumnBrowseResultsRenderer
                        .tabs[0].tabRenderer?.content?.sectionListRenderer
                        ?.contents[0].itemSectionRenderer
                        .contents[0].playlistVideoListRenderer?.contents;

                     const duration = vids_list?.reduce((acc, vid) => acc + (isNaN(vid.playlistVideoRenderer?.lengthSeconds) ? 0 : parseInt(vid.playlistVideoRenderer.lengthSeconds)), 0);

                     if (duration) return outFormat(duration);
                  }
               });
            break;

         case 'watch':
            NOVA.waitElement('#secondary .index-message-wrapper')
               .then(el => {
                  const waitPlaylist = setInterval(() => {
                     let playlistLength;
                     if ((ytdPl = document.body.querySelector('ytd-player')?.player_) && ytdPl.hasOwnProperty('getPlaylist')) {
                        playlistLength = ytdPl.getPlaylist()?.length;
                     }
                     let vids_list = document.body.querySelector('ytd-watch, ytd-watch-flexy')
                        ?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents
                        // let vids_list = window.ytInitialData.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents // not updated on page transition!
                        .filter(i => i.playlistPanelVideoRenderer?.hasOwnProperty('videoId')); // filter hidden

                     console.assert(vids_list?.length === playlistLength, 'playlist loading:', vids_list?.length + '/' + playlistLength);

                     if (vids_list?.length && playlistLength && vids_list?.length === playlistLength) {
                        clearInterval(waitPlaylist);

                        if (duration = getPlaylistDuration(vids_list)) {
                           insertToHTML({ 'container': el, 'text': duration });

                        } else if (!user_settings.playlist_duration_progress) { // this method ignores progress
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

                     // if (!user_settings.playlist_duration_progress && (storage = sessionStorage.getItem(STORE_NAME))) {
                     //    // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                     //    return storage;
                     // }

                     // let vids_list = document.body.querySelector('ytd-watch, ytd-watch-flexy')
                     // ?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents || [];

                     // alt if current "playingIdx" always one step behind
                     // const
                     //    videoId = document.getElementById('movie_player')?.getVideoData().video_id || NOVA.queryURL.get('v'),
                     //    playingIdx2 = vids_list?.findIndex(c => c.playlistPanelVideoRenderer.videoId == videoId);
                     // console.assert(playingIdx == playingIdx2, 'playingIdx diff:', playingIdx + '/' + playingIdx2);
                     // if (playingIdx !== playingIdx2) alert(1)

                     const playingIdx = vids_list?.findIndex(c => c.playlistPanelVideoRenderer.selected);
                     let total;


                     switch (user_settings.playlist_duration_progress) {
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
                     }

                     if ((duration = getDurationFromList(vids_list)) // disallow set zero
                        || (duration === 0 && user_settings.playlist_duration_progress) // allow set zero if use playlist_duration_progress
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
            return [...nodes]
               .map(e => NOVA.timeFormatTo.hmsToSec(e.textContent))
               .filter(t => !isNaN(+t)) // filter PREMIERE
               .reduce((acc, time) => acc + time, 0);
         }
      }

      function outFormat(duration = 0, total) {
         // console.log('outFormat', ...arguments);
         let out = NOVA.timeFormatTo.HMS_digit(duration);
         out = `(${out})`;

         if (total) out += ` [${Math.floor(duration * 100 / total)}%${user_settings.playlist_duration_progress ? ' ' + user_settings.playlist_duration_progress : ''}]`;

         return out;
      }

      function insertToHTML({ text = '', container = required() }) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) {
            return console.error('container not HTMLElement:', container);
         }
         (document.getElementById(SELECTOR_ID) || (function () {
            const el = document.createElement('yt-formatted-string');
            el.className = 'style-scope ytd-playlist-sidebar-primary-info-renderer';
            el.id = SELECTOR_ID;
            el.style.display = 'inline-block';
            el.style.margin = '0 .5em';
            return container.appendChild(el);
         })())
            .textContent = text;

         // sessionStorage.setItem(STORE_NAME, text); // save in sessionStorage
      }

   },
   options: {
      playlist_duration_progress: {
         _tagName: 'select',
         label: 'Time display mode',
         'label:zh': '时间显示方式',
         'label:ja': '時間表示モード',
         'label:es': 'Modo de visualización de la hora',
         'label:pt': 'Modo de exibição de tempo',
         'label:de': 'Zeitanzeigemodus',
         options: [
            { label: 'done', value: 'watched', 'label:zh': '结束', 'label:ja': '終わり', 'label:es': 'hecho', 'label:pt': 'feito', 'label:de': 'fertig' },
            { label: 'left', value: 'left', 'label:zh': '剩下', 'label:ja': '残り', 'label:es': 'izquierda', 'label:pt': 'deixou', 'label:de': 'links' },
            { label: 'total', value: false, selected: true, 'label:zh': '全部的', 'label:ja': '全て'/*, 'label:es': '', 'label:pt': '', 'label:de': ''*/ },
         ],
      },
      playlist_duration_percentage: {
         _tagName: 'input',
         label: 'Add percentage',
         'label:zh': '显示百分比',
         'label:ja': 'パーセンテージを表示',
         'label:es': 'Agregar porcentaje',
         'label:pt': 'Adicionar porcentagem',
         'label:de': 'Prozent hinzufügen',
         type: 'checkbox',
      },
   },
});
