_plugins.push({
   name: 'Show video age',
   id: 'show-video-age',
   section: 'details',
   depends_page: 'watch',
   desc: 'How long ago video was uploaded',
   _runtime: user_settings => {

      const CACHED_PREFIX = 'video-age_';

      YDOM.waitHTMLElement('#date', el => {
         const VIDEOS_ID = YDOM.getUrlVars()['v'];

         if (!VIDEOS_ID || !/[a-z0-9-_]/i.test(VIDEOS_ID)) {
            return console.warn('videos_id is not valid', VIDEOS_ID);
         }
         // cached
         const STORAGE = sessionStorage.getItem(CACHED_PREFIX + VIDEOS_ID);

         if (STORAGE) {
            insertToHTML(el, STORAGE);

         } else {
            YDOM.request.API('videos', {
               'id': VIDEOS_ID,
               'part': 'snippet',
            }, user_settings['custom-api-key'])
               .then(res => {
                  res.items.forEach(item => {
                     const publishedAt = item.snippet.publishedAt;
                     const VIDEO_AGE = timeSince(new Date(publishedAt));
                     // save cache in tabs
                     sessionStorage.setItem(CACHED_PREFIX + VIDEOS_ID, VIDEO_AGE);
                     // out
                     insertToHTML(el, VIDEO_AGE);
                  });
               });
         }

      });

      function insertToHTML(el, data) {
         const DIV_ID = 'video_age';
         if (document.getElementById(DIV_ID)) {
            document.getElementById(DIV_ID).textContent = data;

         } else {
            el.insertAdjacentHTML("beforeend",
               `<i class="date style-scope ytd-video-secondary-info-renderer"> / <span id="${DIV_ID}">${data}</span> ago</i>`);
         }
      }
   }
});
