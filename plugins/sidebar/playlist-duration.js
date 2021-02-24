_plugins_conteiner.push({
   name: 'Show Playlist Duration',
   id: 'playlist-duration',
   depends_on_pages: 'watch, playlist',
   run_on_transition: true,
   opt_section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      const
         CACHE_PREFIX = 'playlist-duration-time:',
         SELECTOR_ID = 'playlist-duration-time';

      // playlist page
      YDOM.HTMLElement.wait('#stats')
         .then(el => {
            // console.debug('channel page');
            insertPlaylistDuration({
               'html_container': el,
               'playlist_items_selector': '#primary .ytd-thumbnail-overlay-time-status-renderer:not(:empty)',
            });

         });

      // watch page
      YDOM.HTMLElement.wait('#secondary #playlist #publisher-container .index-message-wrapper')
         .then(el => {
            // console.debug('watch page');
            insertPlaylistDuration({
               'html_container': el,
               'playlist_items_selector': '#playlist-items',
               'playlistItems_container': document.querySelector('#secondary #playlist'),
            });

         });

      function insertPlaylistDuration({ playlist_items_selector, html_container, playlistItems_container }) {
         // console.debug('insertPlaylistDuration', ...arguments);
         // get from cache
         const channelId = YDOM.getURLParams().get('list');
         const storage = sessionStorage.getItem(CACHE_PREFIX + channelId);
         if (storage) {
            console.debug(`get from cache [${CACHE_PREFIX}]`, storage);
            return insertToHTML({ 'set_text': storage, 'html_container': html_container });
         }

         let forcePlaylistRun = false;
         let playlistItemsInterval = setInterval(() => {
            const playlistCount = document.querySelectorAll(playlist_items_selector).length;
            const timeStampList = (playlistItems_container || document)
               .querySelectorAll(".ytd-thumbnail-overlay-time-status-renderer:not(:empty)");

            if ((!playlistCount || playlistCount != timeStampList.length) && !forcePlaylistRun) {
               console.debug('loading playlist:', timeStampList.length + '/' + playlistCount);
               // if setTimeout - force run
               timeStampList.length && setTimeout(() => forcePlaylistRun = true, 1000 * 3); // 3sec
               return;
            }
            clearInterval(playlistItemsInterval);

            const playlistDuration = 'Duration: ' + getTotalTime(timeStampList);

            insertToHTML({ 'set_text': playlistDuration, 'html_container': html_container });

            // save in sessionStorage
            sessionStorage.setItem(CACHE_PREFIX + channelId, playlistDuration);

         }, 500); // 500ms

         function getTotalTime(nodes) {
            // console.debug('getTotalTime', ...arguments);
            const timestamp = [...nodes]
               .map(e => e.textContent?.toString().trim()
                  .split(':')
                  .reduce((a, cv, i) => a + Number(cv) * 60 ** i, 0))
               .reduce((a, cv) => a + cv, 0);

            const hours = Math.floor(timestamp / 60 / 60);
            const minutes = Math.floor(timestamp / 60) - (hours * 60);
            const seconds = timestamp % 60;

            return [hours, minutes, seconds] // order
               .map(i => i.toString().padStart(2, '0')) // "1" => "01"
               .join(':'); // format "01:00:00"
         }

         function insertToHTML({ set_text, html_container }) {
            // console.debug('insertToHTML', ...arguments);
            const boxHTML = document.getElementById(SELECTOR_ID) || (function () {
               html_container.insertAdjacentHTML("beforeend",
                  ` •<span id="${SELECTOR_ID}" class="style-scope yt-formatted-string" style="margin: 0px 4px;">${set_text}</span>`);
               return document.getElementById(SELECTOR_ID);
            })();
            boxHTML.textContent = set_text;
         }
      }

   },

});
