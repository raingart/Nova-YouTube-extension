_plugins_conteiner.push({
   id: 'playlist-duration',
   title: 'Show Playlist Duration',
   run_on_pages: 'watch, playlist',
   restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: (user_settings, current_page) => {

      const
         CACHE_PREFIX = 'playlist-duration-time:',
         playlistId = YDOM.getQueryURL('list'),
         STORE_NAME = CACHE_PREFIX + playlistId,
         SELECTOR_ID = 'playlist-duration-time';

      if (!playlistId) return;

      // playlist page
      if (current_page === 'playlist') {
         YDOM.waitElement('#stats yt-formatted-string:first-child')
            .then(el => {
               insertToHTML({ 'text_content': getPlaylistDuration(), 'html_container': el })
            });

         function getPlaylistDuration() {
            const storage = sessionStorage.getItem(STORE_NAME);
            if (storage) {
               // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
               return storage;
            }
            const vids = window.ytInitialData?.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
            const timestamp = vids.reduce((a, cv) => a + (!isNaN(cv.playlistVideoRenderer.lengthSeconds) ? parseInt(cv.playlistVideoRenderer.lengthSeconds) : 0), 0);
            const duration = YDOM.secToStr(timestamp);
            // save in sessionStorage
            if (duration) sessionStorage.setItem(STORE_NAME, duration);
            return duration;
         }

         function insertToHTML({ text_content, html_container }) {
            // console.debug('insertToHTML', ...arguments);
            (document.getElementById(SELECTOR_ID) || (function () {
               const newEl = document.createElement("yt-formatted-string");
               newEl.className = "style-scope ytd-playlist-sidebar-primary-info-renderer";
               newEl.style.display = "inline-block";
               newEl.id = SELECTOR_ID;
               html_container.after(newEl);
               return document.getElementById(SELECTOR_ID);
            })())
               .textContent = text_content;
         }
      }

      // watch page
      if (current_page === 'watch') {
         YDOM.waitElement('#secondary #playlist #publisher-container yt-formatted-string:last-child')
            .then(el => {
               getPlaylistDuration(el);
            });

         function getPlaylistDuration(html_container) {
            // console.debug('getPlaylistDuration', ...arguments);
            const storage = sessionStorage.getItem(STORE_NAME);
            if (storage) {
               // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
               return storage;
            }

            let forcePlaylistRun = false;
            let playlistItemsInterval = setInterval(() => {
               const
                  playlistCount = document.querySelectorAll('#playlist-items #unplayableText[hidden]').length,
                  timeStampList = document.querySelector('#secondary #playlist').querySelectorAll(".ytd-thumbnail-overlay-time-status-renderer:not(:empty)"),
                  duration = getTotalTime(timeStampList);

               if ((!playlistCount || playlistCount != timeStampList.length) && !forcePlaylistRun) {
                  // console.debug('loading playlist:', timeStampList.length + '/' + playlistCount);
                  if (timeStampList.length) {
                     setTimeout(() => forcePlaylistRun = true, 1000 * 3); // force run after 3sec
                  }
                  return;
               }
               clearInterval(playlistItemsInterval);

               insertToHTML({ 'text_content': duration, 'html_container': html_container });
               // save in sessionStorage
               if (duration) sessionStorage.setItem(STORE_NAME, duration);

            }, 500); // 500ms

            function getTotalTime(nodes) {
               // console.debug('getTotalTime', ...arguments);
               const strToSec = s => s.split(':').reduce((acc, time) => parseInt(time) + 60 * acc);
               const timestamp = [...nodes]
                  .map(e => strToSec(e.textContent))
                  .reduce((a, cv) => a + cv, 0);

               return YDOM.secToStr(timestamp);
            }

            function insertToHTML({ text_content, html_container }) {
               // console.debug('insertToHTML', ...arguments);
               (document.getElementById(SELECTOR_ID) || (function () {
                  YDOM.css.push(`#${SELECTOR_ID} { margin: 0 .5em; }`);
                  const newEl = document.createElement("yt-formatted-string");
                  newEl.className = "style-scope ytd-playlist-sidebar-primary-info-renderer";
                  newEl.style.display = "inline-block";
                  newEl.id = SELECTOR_ID;
                  html_container.after(newEl);
                  return document.getElementById(SELECTOR_ID);
               })())
                  .textContent = text_content;
            }
         }
      }

   },

});
