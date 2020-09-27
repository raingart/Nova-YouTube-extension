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
      YDOM.waitHTMLElement({
         selector: '#upload-info #channel-name a[href]',
         callback: linkElement => {
            // console.debug('watch page');

            YDOM.waitHTMLElement({
               selector: '#upload-info #owner-sub-count:not(:empty)',
               callback: htmlElement => {
                  insertStatistic({
                     'html_container': htmlElement,
                     'channel_id': linkElement.href.split('/').pop(),
                  });
               },
            });

         },
      });

      // channel page
      YDOM.waitHTMLElement({
         selector: '#channel-header #subscriber-count:not(:empty)',
         callback: htmlElement => {
            // console.debug('channel page');
            insertStatistic({
               'html_container': htmlElement,
               'channel_id': searchChannelId(),
            });

            function searchChannelId() {
               const page = location.pathname.split('/');
               return page[1] === 'channel' ? page[2] : [
                  document.querySelector('meta[itemprop="channelId"][content]'),
                  document.querySelector('link[itemprop="url"][href]'),
                  ...document.querySelectorAll('meta[content]'),
                  ...document.querySelectorAll('link[href]')
               ]
                  .map(e => e?.href || e?.content)
                  .find(e => isChannelId(e?.split('/').pop()));
            }
         },
      });

      function insertStatistic({ html_container, channel_id }) {
         // console.debug('insertStatistic:', ...arguments);
         const CACHED_PREFIX = 'channel-video-count_';

         if (!channel_id || !isChannelId(channel_id)) {
            console.error('channel_id is invalid', channel_id);
            insertToHTML(''); // erase html
            return;
         }
         // cached
         const storage = sessionStorage.getItem(CACHED_PREFIX + channel_id);

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
                     sessionStorage.setItem(CACHED_PREFIX + channel_id, videoCount);
                     insertToHTML(videoCount);
                  });
               });
         }

         function insertToHTML(text) {
            const DIV_ID = 'video_count';
            const box = html_container.querySelector('#' + DIV_ID);
            if (box) { // update
               box.textContent = text;

            } else { // create
               html_container.insertAdjacentHTML("beforeend",
                  '<span class="date style-scope ytd-video-secondary-info-renderer" style="margin-right: 5px;">'
                  + ` • <span id="${DIV_ID}">${text}</span> videos</span>`);
            }
         }

      }

   }
});
