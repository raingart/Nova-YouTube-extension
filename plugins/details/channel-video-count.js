_plugins.push({
   name: 'Show channel videos count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch',
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      const CACHED_PREFIX = 'channel-video-count_';

      YDOM.waitHTMLElement('#upload-info #channel-name a[href]', linkElement => {
         const CHANNEL_ID = linkElement.getAttribute("href").split('/').pop();

         if (!CHANNEL_ID || !/UC([a-z0-9-_]{22})/i.test(CHANNEL_ID)) {
            console.error('CHANNEL_ID is invalid', CHANNEL_ID);
            return;
         }
         // cached
         const STORAGE = sessionStorage.getItem(CACHED_PREFIX + CHANNEL_ID);

         if (STORAGE) {
            insertToHTML(STORAGE);

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
                     insertToHTML(VIDEO_COUNT);
                  });
               });
         }

      });

      function insertToHTML(text) {
         const DIV_ID = 'video_count';
         if (document.getElementById(DIV_ID)) {
            document.getElementById(DIV_ID).textContent = text;

         } else {
            // #owner-container
            document.querySelector('#upload-info #channel-name')
               .insertAdjacentHTML("beforeend", '<span class="date style-scope ytd-video-secondary-info-renderer">' +
               `&nbsp- <span id="${DIV_ID}">${text}</span> videos</span>`);
         }
      }
   }
});
