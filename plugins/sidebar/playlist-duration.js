_plugins_conteiner.push({
   name: 'Show Playlist Duration',
   id: 'playlist-duration',
   depends_on_pages: 'watch, playlist',
   run_on_transition: true,
   opt_section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      const SELECTOR_ID = 'playlist-duration-time';

      // playlist page
      YDOM.HTMLElement.wait('#stats')
         .then(el => {
            genPlaylistDuration({
               'playlist_items_selector': '#primary .ytd-thumbnail-overlay-time-status-renderer:not(:empty)',
               'html_container': el,
            });

         });

      // watch page
      YDOM.HTMLElement.wait('#secondary #playlist')
         .then(el => {
            genPlaylistDuration({
               'playlist_items_selector': '#playlist-items',
               'html_container': el.querySelector('#publisher-container .index-message-wrapper'),
               'timeStampList_container': el,
            });

         });

      function genPlaylistDuration({ playlist_items_selector, html_container, timeStampList_container }) {
         // console.debug('genPlaylistDuration', ...arguments);
         let playlistItemsInterval = setInterval(() => {
            const playlistCount = document.querySelectorAll(playlist_items_selector).length;
            const timeStampList = (timeStampList_container || document)
               .querySelectorAll(".ytd-thumbnail-overlay-time-status-renderer:not(:empty)");

            if (!playlistCount || playlistCount != timeStampList.length) {
               // console.debug('loading playlist:', timeStampList.length + '/' + playlistCount);
               return;
            }
            clearInterval(playlistItemsInterval);

            insertToHTML({
               'set_text': 'Duration: ' + getTimeStamp(timeStampList),
               'html_container': html_container,
            });

            function insertToHTML({ set_text, html_container }) {
               // console.debug('insertToHTML', ...arguments);
               const boxHTML = document.getElementById(SELECTOR_ID) || (function () {
                  html_container.insertAdjacentHTML("beforeend",
                     ` •<span id="${SELECTOR_ID}" class="style-scope yt-formatted-string" style="margin: 0px 4px;">${text}</span>`);
                  return document.getElementById(SELECTOR_ID);
               })();
               boxHTML.textContent = set_text;
            }

         }, 500); // 500ms
      }

      function getTimeStamp(nodes) {
         // console.debug('getTimeStamp', ...arguments);
         const timestamp = [...nodes]
            .map(e => e.textContent?.toString().trim()
               .split(':')
               // .reverse()
               .reduce((e, t, n) => e + Number(t) * 60 ** n, 0))
            .reduce((e, t) => e + t, 0);

         const hours = Math.floor(timestamp / 60 / 60);
         const minutes = Math.floor(timestamp / 60) - (hours * 60);
         const seconds = timestamp % 60;

         return [hours, minutes, seconds] // order
            .map(i => i.toString().padStart(2, '0')) // "1" => "01"
            .join(':'); // format "01:00:00"
      }

   },

});
