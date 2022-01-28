window.nova_plugins.push({
   id: 'channel-videos-count',
   title: 'Show channel videos count',
   'title:zh': '显示频道上的视频数量',
   'title:ja': 'チャンネルの動画数を表示する',
   'title:ko': '채널 동영상 수 표시',
   'title:es': 'Mostrar recuento de videos del canal',
   'title:pt': 'Mostrar contagem de vídeos do canal',
   'title:fr': 'Afficher le nombre de vidéos de la chaîne',
   'title:de': 'Anzahl der Kanalvideos anzeigen',
   run_on_pages: 'watch, channel',
   restart_on_transition: true,
   section: 'details',
   opt_api_key_warn: true,
   desc: 'Display uploaded videos on channel',
   'desc:zh': '在频道上显示上传的视频',
   'desc:ja': 'アップロードした動画をチャンネルに表示',
   'desc:ko': '채널에 업로드된 동영상 표시',
   'desc:es': 'Mostrar videos subidos en el canal',
   'desc:pt': 'Exibir vídeos enviados no canal',
   'desc:fr': 'Afficher les vidéos mises en ligne sur la chaîne',
   'desc:de': 'Hochgeladene Videos auf dem Kanal anzeigen',
   _runtime: user_settings => {

      const
         CACHE_PREFIX = 'channel-videos-count:',
         SELECTOR_ID = 'video_count',
         isChannelId = id => id && /UC([a-z0-9-_]{22})$/i.test(id);

      switch (NOVA.currentPageName()) {
         case 'watch':
            NOVA.waitElement('#meta #upload-info #channel-name a[href], ytm-slim-owner-renderer a[href]')
               .then(link => {
                  // console.debug('watch page');
                  NOVA.waitElement('#meta #owner-sub-count, ytm-slim-owner-renderer .subhead') // possible positional problems
                     // NOVA.waitElement('#meta #owner-sub-count:not([hidden]):not(:empty)') // does not display when the number of subscribers is hidden
                     .then(el => {
                        if (el.hasAttribute('hidden')) el.removeAttribute('hidden'); // remove hidden attribute
                        setVideoCount({
                           'container': el,
                           'channel_id': new URL(link.href).pathname.split('/')[2],
                           // ALL BELOW - not updated on page transition!
                           // || window.ytplayer?.config?.args.ucid
                           // || window.ytplayer?.config?.args.raw_player_response.videoDetails.channelId
                           // || document.body.querySelector('ytd-player')?.player_.getCurrentVideoConfig()?.args.raw_player_response.videoDetails.channelId
                        });
                     });
               });
            break;

         case 'channel':
            NOVA.waitElement('#channel-header #subscriber-count, .c4-tabbed-header-subscriber-count') // possible positional problems
               // NOVA.waitElement('#channel-header #subscriber-count:not(:empty)') // does not display when the number of subscribers is hidden
               .then(el => {
                  // console.debug('channel page');
                  setVideoCount({ 'container': el, 'channel_id': getChannelId() });
               });

            function getChannelId() {
               return [
                  (document.body.querySelector('ytd-app')?.data?.response || window.ytInitialData)
                     ?.metadata?.channelMetadataRenderer?.externalId,
                  document.head.querySelector('meta[itemprop="channelId"][content]')?.content,
                  document.head.querySelector('link[itemprop="url"][href]')?.href.split('/')[4],
                  location.pathname.split('/')[2],
               ]
                  .find(i => isChannelId(i))
            }
            break;
      }

      function setVideoCount({ container = required(), channel_id }) {
         // console.debug('setVideoCount:', ...arguments);
         if (!isChannelId(channel_id)) return console.error('channel_id empty:', channel_id);

         // cached
         if (storage = sessionStorage.getItem(CACHE_PREFIX + channel_id)) {
            insertToHTML({ 'text': storage, 'container': container });

         } else {
            NOVA.request.API({
               request: 'channels',
               params: { 'id': channel_id, 'part': 'statistics' },
               api_key: user_settings['custom-api-key'],
            })
               .then(res => {
                  res?.items?.forEach(item => {
                     if (videoCount = +item.statistics.videoCount) {
                        insertToHTML({ 'text': videoCount, 'container': container });
                        // save cache in tabs
                        sessionStorage.setItem(CACHE_PREFIX + channel_id, videoCount);
                     }
                  });
               });
         }

         function insertToHTML({ text = '', container = required() }) {
            // console.debug('insertToHTML', ...arguments);
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
            (document.getElementById(SELECTOR_ID) || (function () {
               container.insertAdjacentHTML('beforeend',
                  `<span class="date style-scope ytd-video-secondary-info-renderer" style="margin-right:5px;"> • <span id="${SELECTOR_ID}">${text}</span> videos</span>`);
               return document.getElementById(SELECTOR_ID);
            })())
               .textContent = text;
         }

      }

   }
});
