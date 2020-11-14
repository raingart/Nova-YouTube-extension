_plugins.push({
   name: 'Show channel videos count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch, channel',
   api_key_dependency: true,
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      const isChannelId = id => id && /UC([a-z0-9-_]{22})$/i.test(id);

      // watch page
      YDOM.HTMLElement.wait('#upload-info #channel-name a[href]')
         .then(link => {
            // console.debug('watch page');
            YDOM.HTMLElement.wait('#upload-info #owner-sub-count:not(:empty)')
               .then(el => {
                  insertStatistic({
                     'html_container': el,
                     'channel_id': link.href.split('/').pop(),
                  });
               });
         });

      // channel page
      YDOM.HTMLElement.wait('#channel-header #subscriber-count:not(:empty)')
         .then(el => {
            // console.debug('channel page');
            insertStatistic({
               'html_container': el,
               'channel_id': searchChannelId(),
            });

            function searchChannelId() {
               const page = location.pathname.split('/');
               return page[1] == 'channel' ? page[2] : [
                  document.querySelector('meta[itemprop="channelId"][content]'),
                  document.querySelector('link[itemprop="url"][href]'),
                  ...document.querySelectorAll('meta[content]'),
                  ...document.querySelectorAll('link[href]')
               ]
                  .map(i => i?.href || i?.content)
                  .find(i => isChannelId(i?.split('/').pop()));
            }
         });

      function insertStatistic({ html_container, channel_id }) {
         // console.debug('insertStatistic:', ...arguments);
         const CACHE_PREFIX = 'channel-video-count_';

         if (!channel_id || !isChannelId(channel_id)) {
            console.error('channel_id is invalid', channel_id);
            insertToHTML(''); // erase html
            return;
         }
         // cached
         const storage = sessionStorage.getItem(CACHE_PREFIX + channel_id);

         if (storage) {
            insertToHTML(storage);

         } else {
            YDOM.request.API({
               request: 'channels',
               params: {
                  'id': channel_id,
                  'part': 'statistics',
               },
               api_key: user_settings['custom-api-key']
            })
               .then(res => {
                  res.items.forEach(item => {
                     const videoCount = item.statistics.videoCount;
                     // save cache in tabs
                     sessionStorage.setItem(CACHE_PREFIX + channel_id, videoCount);
                     insertToHTML(videoCount);
                  });
               });
         }

         function insertToHTML(text) {
            const SELECTOR_ID = 'video_count';
            const box = html_container.querySelector('#' + SELECTOR_ID);
            if (box) { // update
               box.textContent = text;

            } else { // create
               html_container.insertAdjacentHTML("beforeend",
                  '<span class="date style-scope ytd-video-secondary-info-renderer" style="margin-right: 5px;">'
                  + ` • <span id="${SELECTOR_ID}">${text}</span> videos</span>`);
            }
         }

      }

   }
});
