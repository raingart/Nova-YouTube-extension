_plugins.push({
   name: 'Show channel videos count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch, channel',
   api_key_dependent: true,
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      // watch page
      YDOM.waitHTMLElement({
         selector: '#upload-info #channel-name a[href]',
         callback: linkElement => {
            // console.log('watch page');
            insertStatistic({
               'html_container': document.querySelector('#upload-info #owner-sub-count'),
               'channel_id': linkElement.getAttribute("href").split('/').pop(),
            });
         },
      });

      // channel page
      YDOM.waitHTMLElement({
         selector: '#channel-header #subscriber-count',
         callback: htmlElement => {
            // console.log('channel page');
            insertStatistic({
               'html_container': htmlElement,
               'channel_id': searchChannelId(),
            });

            function searchChannelId() {
               const page = location.pathname.split('/');
               return page[1] === 'channel' ? page[2] :
                  document.querySelector('link[rel="canonical"][href]')?.href.split('/').pop();
            }
         },
      });

      function insertStatistic({ html_container, channel_id }) {
         // console.log('insertStatistic:', ...arguments);
         const CACHED_PREFIX = 'channel-video-count_';

         if (!/UC([a-z0-9-_]{22})$/i.test(channel_id)) {
            console.error('channel_id is invalid', channel_id);
            // insertToHTML(''); // erase html
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
                  '<span class="date style-scope ytd-video-secondary-info-renderer"> • '
                  + `<span id="${DIV_ID}">${text}</span> videos &nbsp</span> &nbsp`);
            }
         }

      }

   }
});
