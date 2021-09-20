// for test:
// https://www.youtube.com/playlist?list=WL
// https://www.youtube.com/watch?v=G134f9wUGcU&list=PLVaR5VNkhu5533wzRj0W0gfXExZ0srdjY - short and has [Private video]
// https://www.youtube.com/watch?v=oxqQw1o5Tuk&list=RDlaemnkfj1lo - hidden playlist conteiner

window.nova_plugins.push({
   id: 'playlist-duration',
   title: 'Show Playlist Duration',
   run_on_pages: 'watch, playlist',
   restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'playlist-duration-time',
         CACHE_PREFIX = SELECTOR_ID + ':',
         playlistId = NOVA.queryURL.get('list'),
         STORE_NAME = CACHE_PREFIX + playlistId,
         timeToSec = str => str?.split(':').reduce((acc, time) => (60 * acc) + parseInt(time));

      if (!playlistId) return;

      switch (NOVA.currentPageName()) {
         case 'playlist':
            NOVA.waitElement('#stats yt-formatted-string:first-child')
               .then(el => {
                  if (duration = getPlaylistDuration()) {
                     insertToHTML({ 'container': el, 'text': duration });

                  } else {
                     getPlaylistDurationFromThumbnails({
                        'items_selector': '#primary .ytd-thumbnail-overlay-time-status-renderer:not(:empty)',
                     })
                        .then(duration => duration && insertToHTML({ 'container': el, 'text': duration }));
                  }

                  function getPlaylistDuration() {
                     if (storage = sessionStorage.getItem(STORE_NAME)) {
                        // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                        return storage;
                     }
                     const vids = window.ytInitialData?.contents?.twoColumnBrowseResultsRenderer
                        ?.tabs.length && window.ytInitialData.contents.twoColumnBrowseResultsRenderer
                           .tabs[0].tabRenderer?.content.sectionListRenderer
                           .contents[0].itemSectionRenderer
                           .contents[0].playlistVideoListRenderer?.contents;
                     const duration = vids?.reduce((acc, vid) => acc + (isNaN(vid.playlistVideoRenderer?.lengthSeconds) ? 0 : parseInt(vid.playlistVideoRenderer.lengthSeconds)), 0);

                     return +duration && NOVA.timeFormatTo.HMS_digit(duration);
                  }
               });
            break;

         case 'watch':
            if (!document.getElementById(SELECTOR_ID)) {
               // fix hidden playlist conteiner
               NOVA.css.push(
                  `#secondary #playlist:hover #publisher-container [hidden] { display: inline !important; }`);
            }

            NOVA.waitElement('#secondary #playlist #publisher-container yt-formatted-string:last-child')
               .then(el => {
                  NOVA.waitElement('#playlist-items #text:not(:empty)')
                     .then(vids => {
                        if (duration = getPlaylistDuration()) {
                           insertToHTML({ 'container': el, 'text': duration });

                        } else {
                           getPlaylistDurationFromThumbnails({
                              'container': document.querySelector('#secondary #playlist'),
                              'items_selector': '#playlist-items #unplayableText[hidden]',
                           })
                              .then(duration => duration && insertToHTML({ 'container': el, 'text': duration }));
                        }

                     });

                  function getPlaylistDuration() {
                     if (storage = sessionStorage.getItem(STORE_NAME)) {
                        // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
                        return storage;
                     }
                     const vids = document.querySelector('ytd-watch, ytd-watch-flexy')
                        ?.data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents || [];
                     // console.debug('[...vids]', vids);

                     const duration = [...vids]
                        .filter(e => e.playlistPanelVideoRenderer?.thumbnailOverlays?.length) // filter [Private video]
                        .map(e => timeToSec(e.playlistPanelVideoRenderer.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer?.text.simpleText))
                        .reduce((acc, time) => acc + time, 0);

                     return +duration && NOVA.timeFormatTo.HMS_digit(duration);
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
                  playlistCount = document.querySelectorAll(items_selector)?.length,
                  timeStampList = (container || document)
                     .querySelectorAll('.ytd-thumbnail-overlay-time-status-renderer:not(:empty)'),
                  duration = getTotalTime(timeStampList);

               if ((!playlistCount || playlistCount != timeStampList.length) && !forcePlaylistRun) {
                  console.log('loading playlist:', timeStampList.length + '/' + playlistCount);
                  return timeStampList.length && setTimeout(() => forcePlaylistRun = true, 1000 * 3); // force run after 3sec
               }
               clearInterval(waitThumbnails);
               console.log('thumbnails_method return:', duration);
               resolve(duration);

            }, 500); // 500ms
         });

         function getTotalTime(nodes) {
            // console.debug('getTotalTime', ...arguments);
            const duration = [...nodes]
               .map(e => timeToSec(e.textContent))
               .reduce((acc, time) => acc + time, 0);

            return +duration && NOVA.timeFormatTo.HMS_digit(duration);
         }
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
            if (NOVA.currentPageName() == 'watch') el.style.margin = '0 .5em';
            container.after(el);
            return document.getElementById(SELECTOR_ID);
         })())
            .textContent = text;

         sessionStorage.setItem(STORE_NAME, text); // save in sessionStorage
      }

   },

});
