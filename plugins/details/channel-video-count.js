_plugins.push({
   name: 'Show channel videos count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch',
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      const CACHED_PREFIX = 'channel-video-count_';

      YDOM.waitFor('#channel-name a[href]', el => {
         const CHANNEL_ID = el.getAttribute("href").split('/').pop();

         if (!CHANNEL_ID.match(/UC([a-z0-9-_]{22})/i)) {
            console.error('CHANNEL_ID is not valid', CHANNEL_ID);
            return;
         }
         // cached
         const STORAGE = sessionStorage.getItem(CACHED_PREFIX + CHANNEL_ID);

         if (STORAGE) {
            insertToHTML(el, STORAGE);

         } else {
            YDOM.request.API('channels', {
               'id': CHANNEL_ID,
               'part': 'statistics',
            }, user_settings['custom-api-key'])
               .then(res => {
                  res.items.forEach(item => {
                     const VIDEO_COUNT = item.statistics.videoCount;
                     // save cache in tabs
                     sessionStorage.setItem(CACHED_PREFIX + CHANNEL_ID, VIDEO_COUNT);
                     // out
                     insertToHTML(el, VIDEO_COUNT);
                  });
               });
         }

      });

      function insertToHTML(el, data) {
         const DIV_ID = 'video_count';
         if (document.getElementById(DIV_ID)) {
            document.getElementById(DIV_ID).textContent = data;

         } else {
            // #owner-container
            el.parentElement.parentElement.insertAdjacentHTML("beforeend",
               '<span class="date style-scope ytd-video-secondary-info-renderer">' +
               ` - <span id="${DIV_ID}">${data}</span> videos</span>`);
         }
      }
   }
});
