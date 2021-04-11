_plugins_conteiner.push({
   name: 'Show Playlist Duration',
   id: 'playlist-duration',
   depends_on_pages: 'watch, playlist',
   restart_on_transition: true,
   opt_section: 'sidebar',
   // desc: '',
   _runtime: (user_settings, current_page) => {

      const
         CACHE_PREFIX = 'playlist-duration-time:',
         SELECTOR_ID = 'playlist-duration-time',
         playlistId = YDOM.getURLParams().get('list');

      if (!playlistId) return;

      // playlist page
      if (current_page === 'playlist') {
         YDOM.HTMLElement.wait('#stats')
            .then(el => {
               // console.debug('playlist: channel page');
               insertPlaylistDuration({
                  'html_container': el,
                  'playlist_items_selector': '#primary .ytd-thumbnail-overlay-time-status-renderer',
               });

            });
      }

      // watch page
      if (current_page === 'watch') {
         YDOM.HTMLElement.wait('#secondary #playlist #publisher-container')
            .then(el => {
               // console.debug('playlist: watch page');
               insertPlaylistDuration({
                  'html_container': el,
                  'playlist_items_selector': '#playlist-items #unplayableText[hidden]',
                  'playlist_container': document.querySelector('#secondary #playlist'),
               });

            });
      }

      function insertPlaylistDuration({ playlist_items_selector, html_container, playlist_container }) {
         // console.debug('insertPlaylistDuration', ...arguments);
         // get from cache
         const storage = sessionStorage.getItem(CACHE_PREFIX + playlistId);
         if (storage) {
            // console.debug(`get from cache [${CACHE_PREFIX + playlistId}]`, storage);
            return insertToHTML({ 'set_text': storage, 'html_container': html_container });
         }

         let forcePlaylistRun = false;
         let playlistItemsInterval = setInterval(() => {
            const
               playlistCount = document.querySelectorAll(playlist_items_selector).length,
               timeStampList = (playlist_container || document)
                  .querySelectorAll(".ytd-thumbnail-overlay-time-status-renderer:not(:empty)"),
               playlistDuration = 'Duration: ' + getTotalTime(timeStampList);

            if ((!playlistCount || playlistCount != timeStampList.length) && !forcePlaylistRun) {
               // console.debug('loading playlist:', timeStampList.length + '/' + playlistCount);
               timeStampList.length && setTimeout(() => forcePlaylistRun = true, 1000 * 3); // force run after 3sec
               return;
            }
            clearInterval(playlistItemsInterval);

            insertToHTML({ 'set_text': playlistDuration, 'html_container': html_container });
            // save in sessionStorage
            if (playlistDuration) {
               sessionStorage.setItem(CACHE_PREFIX + playlistId, playlistDuration);
            }

         }, 500); // 500ms

         function getTotalTime(nodes) {
            // console.debug('getTotalTime', ...arguments);
            const strToSec = s => s.split(':').reduce((acc, time) => parseInt(time) + 60 * acc);
            const timestamp = [...nodes]
               .map(e => strToSec(e.textContent))
               .reduce((a, cv) => a + cv, 0);

            return YDOM.secToStr(timestamp);
         }

         function insertToHTML({ set_text, html_container }) {
            // console.debug('insertToHTML', ...arguments);
            const boxHTML = document.getElementById(SELECTOR_ID) || (function () {
               html_container.insertAdjacentHTML("beforeend",
                  ` •<span id="${SELECTOR_ID}" class="style-scope yt-formatted-string publisher ytd-playlist-panel-renderer" style="margin: 0px 4px;">${set_text}</span>`);
               return document.getElementById(SELECTOR_ID);
            })();
            boxHTML.textContent = set_text;
         }
      }

   },

});
