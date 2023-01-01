window.nova_plugins.push({
   id: 'rss-link',
   title: 'Add RSS Feed link',
   'title:zh': '添加 RSS 提要链接',
   'title:ja': 'RSSフィードリンクを追加',
   'title:ko': 'RSS 피드 링크 추가',
   'title:id': 'Tambahkan tautan Umpan RSS',
   'title:es': 'Agregar enlace de fuente RSS',
   'title:pt': 'Adicionar link de feed RSS',
   'title:fr': 'Ajouter un lien de flux RSS',
   'title:it': 'Aggiungi collegamento al feed RSS',
   // 'title:tr': 'RSS Beslemesi bağlantısı ekle',
   'title:de': 'RSS-Feed-Link hinzufügen',
   'title:pl': 'Dodaj kanał RSS',
   'title:ua': 'Додати RSS-посилання',
   run_on_pages: 'channel, playlist, -mobile',
   restart_on_transition: true,
   section: 'channel',
   // opt_api_key_warn: true,
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/1760-youtube-rss-feed
      // alt2 - hhttps://greasyfork.org/en/scripts/412949-youtube-rss-feed
      // alt3 - hhttps://greasyfork.org/en/scripts/32384-youtube-rss
      // alt4 - hhttps://greasyfork.org/en/scripts/36357-youtube-copy-channel-rss-feed-url-to-clipboard

      const
         SELECTOR_ID = 'nova-rss-link',
         rssLinkPrefix = '/feeds/videos.xml',
         playlistURL = rssLinkPrefix + '?playlist_id=' + NOVA.queryURL.get('list'),
         genChannelURL = channelId => rssLinkPrefix + '?channel_id=' + channelId;


      switch (NOVA.currentPage) {
         case 'channel':
            // NOVA.waitElement('#channel-header #channel-name')
            NOVA.waitElement('#links-holder #primary-links')
               .then(async container => {
                  // Doesn't work.
                  // https://www.youtube.com/feeds/videos.xml?user=<username>

                  // if ((channelName_ = document.body.querySelector('#channel-handle')?.textContent)
                  //    && channelName_.startsWith('@')
                  // ) {
                  //    channelName = channelName_.substring(1);
                  // }

                  if (url = document.querySelector('link[type="application/rss+xml"][href]')?.href
                     || genChannelURL(await NOVA.getChannelId(user_settings['user-api-key']))
                  ) {
                     insertToHTML({ 'url': url, 'container': container });
                  }
               });
            break;

         case 'playlist':
            NOVA.waitElement('#owner-container')
               .then(container => {
                  insertToHTML({ 'url': playlistURL, 'container': container });
               });
            break;
      }

      function insertToHTML({ url = required(), container = required() }) {
         console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         (document.getElementById(SELECTOR_ID) || (function () {
            const link = document.createElement('a');
            link.id = SELECTOR_ID;
            link.target = '_blank';
            // btn.className = `ytp-button ${SELECTOR_CLASS}`;
            link.innerHTML =
               // `<svg viewBox="-28.364 -29.444 42.324 42.822" height="100%" width="100%">
               `<svg viewBox="-40 -40 55 55" height="100%" width="100%" style="width: auto;">
                  <g fill="currentColor">
                     <path fill="#F60" d="M-17.392 7.875c0 3.025-2.46 5.485-5.486 5.485s-5.486-2.46-5.486-5.485c0-3.026 2.46-5.486 5.486-5.486s5.486 2.461 5.486 5.486zm31.351 5.486C14.042.744 8.208-11.757-1.567-19.736c-7.447-6.217-17.089-9.741-26.797-9.708v9.792C-16.877-19.785-5.556-13.535.344-3.66a32.782 32.782 0 0 1 4.788 17.004h8.827v.017zm-14.96 0C-.952 5.249-4.808-2.73-11.108-7.817c-4.821-3.956-11.021-6.184-17.255-6.15v8.245c6.782-.083 13.432 3.807 16.673 9.774a19.296 19.296 0 0 1 2.411 9.326h8.278v-.017z"/>
                  </g>
               </svg>`;
            Object.assign(link.style, {
               height: '20px',
               display: 'inline-block',
               padding: '5px',
            });
            container.prepend(link);
            return link;
         })())
            .href = url;

         // addMetaLink(channel_id);

         // async function addMetaLink(channelId) {
         //    channelId = channelId || await NOVA.getChannelId(user_settings['user-api-key']);
         //    document.head.insertAdjacentHTML('beforeend',
         //       `<link rel="alternate" type="application/rss+xml" title="RSS" href="${genChannelURL(channelId)}">`);
         // }
      }

   },
});
