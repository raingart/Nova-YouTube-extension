// for test:
// https://www.youtube.com/channel/UCVi6ofFy7QyJJrZ9l0-fwbQ
// https://www.youtube.com/channel/UCBX37mqPuU2Hqmcd2kfEIvQ
// https://www.youtube.com/channel/UCM8XzXipyTsylZ_WsGKmdKQ
// https://www.youtube.com/channel/UCGmvywjUliYi6MSwg_FuW_g

window.nova_plugins.push({
   id: 'channel-videos-count',
   title: 'Show channel videos count',
   'title:zh': '显示频道上的视频数量',
   'title:ja': 'チャンネルの動画数を表示する',
   'title:ko': '채널 동영상 수 표시',
   'title:id': 'Tampilkan jumlah video saluran',
   'title:es': 'Mostrar recuento de videos del canal',
   'title:pt': 'Mostrar contagem de vídeos do canal',
   'title:fr': 'Afficher le nombre de vidéos de la chaîne',
   'title:it': 'Mostra il conteggio dei video del canale',
   // 'title:tr': 'Kanal video sayısını göster',
   'title:de': 'Anzahl der Kanalvideos anzeigen',
   'title:pl': 'Pokaż liczbę filmów na kanale',
   'title:ua': 'Показати кількість відео на каналі',
   // run_on_pages: 'watch, channel, -mobile',
   run_on_pages: 'watch, -mobile',
   restart_on_location_change: true,
   section: 'details',
   opt_api_key_warn: true,
   desc: 'Display uploaded videos on channel',
   'desc:zh': '在频道上显示上传的视频',
   'desc:ja': 'アップロードした動画をチャンネルに表示',
   'desc:ko': '채널에 업로드된 동영상 표시',
   'desc:id': 'Tampilkan video yang diunggah di saluran',
   'desc:es': 'Mostrar videos subidos en el canal',
   'desc:pt': 'Exibir vídeos enviados no canal',
   'desc:fr': 'Afficher les vidéos mises en ligne sur la chaîne',
   'desc:it': 'Visualizza i video caricati sul canale',
   // 'desc:tr': 'Yüklenen videoları kanalda göster',
   'desc:de': 'Hochgeladene Videos auf dem Kanal anzeigen',
   'desc:pl': 'Wyświetla przesłane filmy na kanale',
   'desc:ua': 'Показує завантажені відео на каналі',
   _runtime: user_settings => {

      const
         CACHE_PREFIX = 'nova-channel-videos-count:',
         SELECTOR_ID = 'nova-video-count';

      switch (NOVA.currentPage) {
         case 'watch':
            // NOVA.waitSelector('#upload-info #channel-name a[href], ytm-slim-owner-renderer a[href]')
            //    .then(link => {
            //       // console.debug('watch page');
            //       NOVA.waitSelector('#upload-info #owner-sub-count, ytm-slim-owner-renderer .subhead') // possible positional problems
            //          // NOVA.waitSelector('#owner-sub-count:not([hidden]):not(:empty)') // does not display when the number of subscribers is hidden
            //          .then(el => {
            //             if (el.hasAttribute('hidden')) el.removeAttribute('hidden'); // remove hidden attribute

            //             setVideoCount({
            //                'container': el,
            //                'channel_id': new URL(link.href).pathname.split('/')[2],
            //             });
            //          });
            //    });

            NOVA.waitSelector('#upload-info #owner-sub-count, ytm-slim-owner-renderer .subhead')
               .then(el => setVideoCount(el));
            break;

         // case 'channel':
         //    NOVA.waitSelector('#channel-header #subscriber-count, .c4-tabbed-header-subscriber-count') // possible positional problems
         //       // NOVA.waitSelector('#channel-header #subscriber-count:not(:empty)') // does not display when the number of subscribers is hidden
         //       .then(el => setVideoCount(el));
         //    break;
      }

      function setVideoCount(container = required()) {
         // console.debug('setVideoCount:', ...arguments);
         const channelId = NOVA.getChannelId();
         if (!channelId) return console.error('setVideoCount channelId: empty', channelId);

         // has in cache
         if (storage = sessionStorage.getItem(CACHE_PREFIX + channelId)) {
            insertToHTML({ 'text': storage, 'container': container });
         }
         else {
            NOVA.request.API({
               request: 'channels',
               params: { 'id': channelId, 'part': 'statistics' },
               api_key: user_settings['user-api-key'],
            })
               .then(res => {
                  if (res?.error) return alert(`Error [${res.code}]: ${res.reason}\n` + res.error);

                  res?.items?.forEach(item => {
                     if (videoCount = NOVA.prettyRoundInt(item.statistics.videoCount)) {
                        insertToHTML({ 'text': videoCount, 'container': container });
                        // save cache in tabs
                        sessionStorage.setItem(CACHE_PREFIX + channelId, videoCount);

                     } else console.warn('API is change', item);
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

            container.title = `${text} videos`;
         }

      }

   },
});
