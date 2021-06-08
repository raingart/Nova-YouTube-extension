_plugins_conteiner.push({
   id: 'channel-videos-count',
   title: 'Show channel videos count',
   run_on_pages: 'watch, channel',
   restart_on_transition: true,
   section: 'details',
   opt_api_key_warn: true,
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      const
         CACHE_PREFIX = 'channel-videos-count:',
         SELECTOR_ID = 'video_count',
         getChannelFromUrl = location.pathname.split('/')[2],
         isChannelId = id => id && /UC([a-z0-9-_]{22})$/i.test(id);

      // watch page
      YDOM.waitElement('#upload-info #channel-name a[href]')
         .then(link => {
            // console.debug('watch page');
            YDOM.waitElement('#meta #owner-sub-count:not([hidden]):not(:empty)')
               .then(el => insertChannelStatistic({
                  'html_container': el,
                  'channel_id': link.href.split('/').pop()
               }));
         });

      // channel page
      YDOM.waitElement('#channel-header #subscriber-count:not(:empty)')
         .then(el => {
            // console.debug('channel page');
            insertChannelStatistic({ 'html_container': el, 'channel_id': getChannelId() });

            function getChannelId() {
               const id = [
                  getChannelFromUrl,
                  document.querySelector('meta[itemprop="channelId"][content]'),
                  document.querySelector('link[itemprop="url"][href]'),
                  ...document.querySelectorAll('meta[content]'),
                  ...document.querySelectorAll('link[href]')
               ]
                  .map(i => i?.href || i?.content)
                  .find(i => isChannelId(i?.split('/').pop()));

               // TODO. insertChannelStatistic is run two times. await YDOM.request.API dont work!
               // return id || swait YDOM.request.API({
               return id || YDOM.request.API({
                  request: 'channels',
                  params: { 'forUsername': getChannelFromUrl, 'part': 'snippet' },
                  api_key: user_settings['custom-api-key']
               })
                  .then(res => {
                     res?.items?.lenght && insertChannelStatistic({ 'html_container': el, 'channel_id': res.items[0].id });
                  });
            }
         });

      function insertChannelStatistic({ html_container, channel_id }) {
         // console.debug('insertChannelStatistic:', ...arguments);
         if (!isChannelId(channel_id)) return console.error('channel_id empty:', channel_id);

         // cached
         const storage = sessionStorage.getItem(CACHE_PREFIX + channel_id);

         if (storage) {
            insertToHTML({ 'text_content': storage, 'html_container': html_container });

         } else {
            YDOM.request.API({
               request: 'channels',
               params: { 'id': channel_id, 'part': 'statistics' },
               api_key: user_settings['custom-api-key']
            })
               .then(res => {
                  res?.items?.forEach(item => {
                     const videoCount = item.statistics.videoCount;
                     insertToHTML({ 'text_content': videoCount, 'html_container': html_container });
                     // save cache in tabs
                     sessionStorage.setItem(CACHE_PREFIX + channel_id, videoCount);
                  });
               });
         }

         function insertToHTML({ text_content, html_container }) {
            // console.debug('insertToHTML', ...arguments);
            (document.getElementById(SELECTOR_ID) || (function () {
               html_container.insertAdjacentHTML("beforeend",
                  '<span class="date style-scope ytd-video-secondary-info-renderer" style="margin-right: 5px;">'
                  + ` • <span id="${SELECTOR_ID}">${text_content}</span> videos</span>`);
               return document.getElementById(SELECTOR_ID);
            })())
               .textContent = text_content;
         }

      }

   }
});
