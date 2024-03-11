// for test:
// https://www.youtube.com/channel/UCV89PIJRsTLAOMQUdFmo--g/videos

window.nova_plugins.push({
   id: 'thumbs-title-lang',
   title: "Show title's original language",
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'home, results, feed, channel, watch',
   // run_on_pages: 'results, channel, -mobile',
   section: 'thumbs',
   opt_api_key_warn: true,
   // desc: '',
   'plugins-conflict': 'thumbnails-title-normalize',
   _runtime: user_settings => {

      // if (!user_settings['user-api-key']) return;

      const
         CACHE_NAME = 'thumbs-title',
         SELECTOR_THUMBS_PATCHED_ATTR = 'nova-thumbs-title-lang',
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home, channel, feed
            'ytd-video-renderer', // results
            // 'ytd-grid-video-renderer', // feed (old)
            'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
            'ytm-item-section-renderer' // mobile /subscriptions page
         ]
            .map(i => `${i}:has(a#thumbnail[${SELECTOR_THUMBS_PATCHED_ATTR}][href*="%id%"]) #video-title`)
            .join(',');

      // if (user_settings.thumbs_title_lang_hover) {
      NOVA.css.push(
         `*:hover > #video-title[${SELECTOR_THUMBS_PATCHED_ATTR}],
         *:not(:hover) > #video-title[${SELECTOR_THUMBS_PATCHED_ATTR}] + #video-title {
            display: none !important;
         }`);
      // }
      // else {
      //    NOVA.css.push(
      //       `#video-title[${SELECTOR_THUMBS_PATCHED_ATTR}] + #video-title {
      //          display: none !important;
      //       }`);
      // }

      let
         idsToProcess = [],
         newCacheItem = {},
         timeout;

      // page update event
      // document.addEventListener('yt-action', evt => {
      //    // console.debug(evt.detail?.actionName);
      //    switch (evt.detail?.actionName) {
      //       case 'yt-append-continuation-items-action': // home, results, feed, channel, watch
      //       case 'ytd-update-grid-state-action': // feed, channel
      //       case 'yt-rich-grid-layout-refreshed': // feed
      //       // case 'ytd-rich-item-index-update-action': // home, channel
      //       case 'yt-store-grafted-ve-action': // results, watch
      //          // case 'ytd-update-elements-per-row-action': // feed

      //          // universal
      //          // case 'ytd-update-active-endpoint-action':
      //          // case 'yt-window-scrolled':
      //          // case 'yt-service-request': // results, watch

      //          // console.debug(evt.detail?.actionName); // flltered
      //          switch (NOVA.currentPage) {
      //             case 'home':
      //             case 'results':
      //             case 'feed':
      //             // case 'channel':
      //             case 'watch':
      //                break;

      //             // default:
      //             //    thumbRemove.live();
      //             //    break;
      //          }
      //          break;

      //       // default:
      //       //    break;
      //    }
      // });
      NOVA.watchElements({
         // selectors: '#video-title',
         selectors: 'a#thumbnail[href].ytd-thumbnail',
         attr_mark: SELECTOR_THUMBS_PATCHED_ATTR,
         callback: thumbnail => {
            if (id = NOVA.queryURL.get('v', thumbnail.href)) {
               idsToProcess.push(id);
               run_process();
            }
         },
      });

      function run_process(sec = 1) {
         clearTimeout(timeout);
         timeout = setTimeout(() => {
            refreshCache(newCacheItem);
            patchThumbs(idsToProcess); // comment for test
            // requestTitle(idsToProcess); // uncomment for test (ignore cache)
         }, 1000 * sec); // 1 sec
      }

      // filter by cache
      function patchThumbs(ids = []) {
         if (!ids.length) return;
         // console.debug('find thumbnail', ...arguments);
         idsToProcess = []; // clear
         const cacheData = JSON.parse(sessionStorage.getItem(CACHE_NAME));

         const newIds = ids
            .filter(id => {
               if (cacheData?.hasOwnProperty(id)) {
                  if (cacheItem = cacheData[id]) {
                     // console.debug('cached', id);
                     patchTitle({ 'id': id, 'text': cacheItem.text });
                     return false;
                  }
               }
               // else console.debug('new', document.querySelector(`a#thumbnail[href*="${id}"]`));
               return true;
            });
         // console.debug('newIds', newIds);
         requestTitle(newIds);
      }

      function refreshCache(new_cache = {}) {
         // console.debug('refreshCache', ...arguments);
         newCacheItem = {}; // clear
         const cacheData = JSON.parse(sessionStorage.getItem(CACHE_NAME)) || {};
         sessionStorage.setItem(CACHE_NAME, JSON.stringify(Object.assign(new_cache, cacheData))); // save
      }

      function requestTitle(ids = []) {
         // console.debug('requestTitle', ids.length, ...arguments);

         const YOUTUBE_API_MAX_IDS_PER_CALL = 50; // API max = 50

         chunkArray(ids, YOUTUBE_API_MAX_IDS_PER_CALL)
            .forEach(id_part => {
               // console.debug('id_part', id_part);
               NOVA.request.API({
                  request: 'videos',
                  params: { 'id': id_part.join(','), 'part': 'snippet' },
                  api_key: user_settings['user-api-key'],
               })
                  .then(res => {
                     res?.items?.forEach(item => {
                        // console.debug('item', item);

                        // item.snippet.defaultLanguage
                        // item.snippet.localized.defaultAudioLanguage
                        // item.snippet.localized.title =?? item.snippet.title
                        patchTitle({ 'id': item.id, 'text': item.snippet.title });

                        // push to cache
                        newCacheItem[item.id] = { 'text': item.snippet.title };
                     });

                     run_process(3);
                  });
            });

         function chunkArray(array = [], size = 0) {
            let chunked = [];
            while (array.length) chunked.push(array.splice(0, +size));
            return chunked;
         }
      }

      function patchTitle({ id = required(), text = required() }) {
         // console.debug('patchTitle', ...arguments);
         document.querySelectorAll(thumbsSelectors.replaceAll('%id%', id)) // "replaceAll" is faster than ("map+join") by ~45%
            .forEach(videoTitleEl => {
               // console.debug('videoTitleEl', videoTitleEl, videoTitleEl.textContent == text, `"${videoTitleEl.textContent}`, `"${text}"`);
               if (videoTitleEl.textContent?.trim() == text) return;

               // Strategy 1
               const newTitleEl = videoTitleEl.cloneNode(true);
               videoTitleEl.before(newTitleEl);
               newTitleEl.setAttribute(SELECTOR_THUMBS_PATCHED_ATTR, true); // for css hide
               newTitleEl.textContent = text;

               // Strategy 2
               // videoTitleEl.innerText += '\n' + text;

               // a.insertAdjacentHTML('beforeend',
               //    `<div></div>`);
            });
      }

   },
   // options: {
   //    thumbs_title_lang_hover: {
   //       _tagName: 'input',
   //       label: 'Show default title on hover',
   //       // 'label:zh': '',
   //       // 'label:ja': '',
   //       // 'label:ko': '',
   //       // 'label:vi': '',
   //       // 'label:id': '',
   //       // 'label:es': '',
   //       // 'label:pt': '',
   //       // 'label:fr': '',
   //       // 'label:it': '',
   //       // 'label:tr': '',
   //       // 'label:de': '',
   //       // 'label:pl': '',
   //       // 'label:ua': '',
   //       type: 'checkbox',
   //       // title: '',
   //    },
   // }
});
