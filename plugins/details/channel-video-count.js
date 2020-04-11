_plugins.push({
   name: 'Show channel videos count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch, channel',
   api_key_dependent: true,
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      const CACHED_PREFIX = 'channel-video-count_';
      const regexChannelId = input => /UC([a-z0-9-_]{22})$/i.test(input);

      // watch page
      YDOM.waitHTMLElement('#upload-info #channel-name a[href]', linkElement => {
         // console.log('watch page');
         const channel_id = linkElement.getAttribute("href").split('/').pop();
         insertStatistic(document.querySelector('#upload-info #owner-sub-count'), channel_id);
      });
      // YDOM.waitHTMLElement('#upload-info #channel-name', htmlElement => {
      //    // console.log('watch page');
      //    const linkElement = htmlElement.querySelector('a[href]');
      //    if (linkElement) {
      //       const channel_id = linkElement.href.split('/').pop();
      //       insertStatistic(htmlElement, channel_id);
      //    }
      // });

      // channel page
      YDOM.waitHTMLElement('#channel-header #subscriber-count', htmlElement => {
         // console.log('channel page');
         const channel_id = search_channel_id();
         insertStatistic(htmlElement, channel_id);

         // page onload
         function search_channel_id() {
            const page = location.pathname.split('/');
            return page[1] == 'channel'
               ? page[2]
               : document.querySelector('link[rel="canonical"][href]')?.href.split('/').pop();
            // let arr = [];
            //  // link
            // arr.push(document.querySelector('link[rel="canonical"]')?.href);
            // // meta
            // [...document.querySelectorAll("meta[content]")].forEach(el =>
            //    regexChannelId(el.content) && arr.push(el.content));

            // for (let i of arr) {
            //    if (regexChannelId(i)) return i.split('/').pop();
            // }
         }

      });

      function insertStatistic(el_container, channel_id) {
         // console.log('channel_id', JSON.stringify(channel_id));
         if (!regexChannelId(channel_id)) {
            console.error('channel_id is invalid', channel_id);
            insertToHTML(''); // erase html
            return;
         }
         // cached
         const storage = sessionStorage.getItem(CACHED_PREFIX + channel_id);

         if (storage) {
            insertToHTML(storage);

         } else {
            YDOM.request.API('channels', {
               'id': channel_id,
               'part': 'statistics',
            }, user_settings['custom-api-key'])
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
            const box = el_container.querySelector('#' + DIV_ID);
            if (box) {
               box.textContent = text;

            } else {
               el_container.insertAdjacentHTML("beforeend",
               '<span class="date style-scope ytd-video-secondary-info-renderer">'
               + `&nbsp• <span id="${DIV_ID}">${text}</span> videos</span>`);
            }
         }

      }

   }
});
