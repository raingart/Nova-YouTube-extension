_plugins_conteiner.push({
   id: 'channel-videos-count',
   title: 'Show channel videos count',
   run_on_pages: 'watch, channel',
   restart_on_transition: true,
   section: 'details',
   opt_api_key_warn: true,
   desc: 'Display uploaded videos on channel',
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
               .then(el => setVideoCount({
                  'container': el,
                  'channel_id': window.ytplayer?.config?.args?.ucid || link.href.split('/').pop()
               }));
         });

      // channel page
      YDOM.waitElement('#channel-header #subscriber-count:not(:empty)')
         .then(el => {
            // console.debug('channel page');
            setVideoCount({ 'container': el, 'channel_id': getChannelId() });

            function getChannelId() {
               return [
                  getChannelFromUrl,
                  document.querySelector('meta[itemprop="channelId"][content]'),
                  document.querySelector('link[itemprop="url"][href]'),
                  // (window.ytInitialData?.contents?.twoColumnBrowseResultsRenderer?.tabs?.lenght
                  //    && window.ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer?.endpoint.browseEndpoint.browseId),
               ]
                  .map(i => i?.href || i?.content)
                  .find(i => isChannelId(i?.split('/').pop()))
                  // search in ytInitialData
                  || JSON.stringify(window.ytInitialData).match(/(UC([a-z0-9-_]{22}))/i)[1]
                  // last option
                  || YDOM.request.API({
                     request: 'channels',
                     params: { 'forUsername': getChannelFromUrl, 'part': 'snippet' },
                     api_key: user_settings['custom-api-key']
                  })
                     .then(res => {
                        res?.items?.lenght && setVideoCount({ 'container': el, 'channel_id': res.items[0].id });
                     });
            }
         });

      function setVideoCount({ container = required(), channel_id = required() }) {
         // console.debug('setVideoCount:', ...arguments);
         if (!isChannelId(channel_id)) return console.error('channel_id empty:', channel_id);

         // cached
         if (storage = sessionStorage.getItem(CACHE_PREFIX + channel_id)) {
            insertToHTML({ 'text': storage, 'container': container });

         } else {
            YDOM.request.API({
               request: 'channels',
               params: { 'id': channel_id, 'part': 'statistics' },
               api_key: user_settings['custom-api-key']
            })
               .then(res => {
                  res?.items?.forEach(item => {
                     const videoCount = item.statistics.videoCount;
                     insertToHTML({ 'text': videoCount, 'container': container });
                     // save cache in tabs
                     sessionStorage.setItem(CACHE_PREFIX + channel_id, videoCount);
                  });
               });
         }

         function insertToHTML({ text = '', container = required() }) {
            // console.debug('insertToHTML', ...arguments);
            if (!(container instanceof HTMLElement)) {
               return console.error('container not HTMLElement:', container);
            }
            (document.getElementById(SELECTOR_ID) || (function () {
               container.insertAdjacentHTML('beforeend',
                  '<span class="date style-scope ytd-video-secondary-info-renderer" style="margin-right: 5px;">'
                  + ` • <span id="${SELECTOR_ID}">${text}</span> videos</span>`);
               return document.getElementById(SELECTOR_ID);
            })())
               .textContent = text;
         }

      }

   }
});
