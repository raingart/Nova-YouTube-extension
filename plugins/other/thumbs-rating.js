window.nova_plugins.push({
   id: 'thumbnails-rating',
   title: 'Rating preview',
   run_on_pages: 'all, -embed',
   section: 'other',
   opt_api_key_warn: true,
   desc: 'Rating bar over videos thumbnail',
   _runtime: user_settings => {

      const
         CACHED_TIME = 8, // hours
         SELECTOR_ID = 'rating-line',
         SELECTOR = '#' + SELECTOR_ID, // for css
         CACHE_NAME = 'ratings-thumbnail',
         colorLiker = user_settings.rating_like_color || '#3ea6ff',
         colorDislike = user_settings.rating_dislike_color || '#ddd';

      // init bars style
      NOVA.css.push(
         SELECTOR + `{
            --height: ${(user_settings.rating_bar_height || 5)}px;
         }

         ${SELECTOR} {
            width: 100%;
            height: var(--height);
         }

         a#thumbnail ${SELECTOR} {
            position: absolute;
            bottom: 0;
         }`);

      let
         idsToProcess = [],
         newCacheItem = {},
         timeoutRating;

      NOVA.watchElement({
         selector: 'a#thumbnail[href].ytd-thumbnail',
         attr_mark: 'thumbnail-rated',
         callback: thumbnail => {
            if (id = NOVA.queryURL.get('v', thumbnail.href)) {
               idsToProcess.push(id);
               run_process();
            }
         },
      });

      function run_process(time = 1) {
         clearTimeout(timeoutRating);
         timeoutRating = setTimeout(() => {
            refreshCache(newCacheItem);
            patchThumbs(idsToProcess);
         }, 1000 * time); // 1 sec
      }

      function refreshCache(new_cache = {}) {
         // console.debug('refreshCache', ...arguments);
         newCacheItem = {}; // clear
         let cacheData = JSON.parse(localStorage.getItem(CACHE_NAME)) || {};
         const timeNow = new Date().getTime();
         // console.groupCollapsed('ratingCacheExpires');
         // delete expired
         Object.entries(cacheData)
            .forEach(([id, cacheItem]) => {
               const cacheDate = new Date(+cacheItem?.date);
               const timeExpires = cacheDate.setHours(cacheDate.getHours() + CACHED_TIME);
               if (!cacheItem.hasOwnProperty('pt') || timeNow > timeExpires) {
                  // console.debug('timeExpires', id, cacheItem);
                  delete cacheData[id];
               }
            });
         // console.groupEnd();
         localStorage.setItem(CACHE_NAME, JSON.stringify(Object.assign(new_cache, cacheData))); // save
      }

      function patchThumbs(ids = []) {
         if (!ids.length) return;
         // console.debug('find thumbnail', ...arguments);
         idsToProcess = []; // clear
         const cacheData = JSON.parse(localStorage.getItem(CACHE_NAME));
         const timeNow = new Date().getTime();

         const newIds = ids.filter(id => {
            if (cacheData?.hasOwnProperty(id)) {
               const
                  cacheItem = cacheData[id],
                  cacheDate = new Date(+cacheItem?.date),
                  timeExpires = cacheDate.setHours(cacheDate.getHours() + CACHED_TIME);
               // console.debug(timeNow, timeExpires);
               if (timeNow < timeExpires) {
                  // console.debug('cached', id);
                  attachBar({ 'id': id, 'pt': cacheItem.pt });
                  return false;
               }
               // else console.debug('expired', document.querySelector(`a#thumbnail[href*="${id}"]`));
            }
            // else console.debug('new', document.querySelector(`a#thumbnail[href*="${id}"]`));
            return true;
         });
         // console.debug('newIds', newIds);
         requestRating(newIds);
      }

      function requestRating(ids = []) {
         // console.debug('requestRating', ids.length, ...arguments);

         const YOUTUBE_API_MAX_IDS_PER_CALL = 50; // API max = 50

         chunkArray(ids, YOUTUBE_API_MAX_IDS_PER_CALL)
            .forEach(id_part => {
               // console.debug('id_part', id_part);
               NOVA.request.API({
                  request: 'videos',
                  params: { 'id': id_part.join(','), 'part': 'statistics' },
                  api_key: user_settings['custom-api-key'],
               })
                  .then(res => {
                     res?.items?.forEach(item => {
                        // console.debug('item', item);
                        const
                           views = +item.statistics.viewCount || 0,
                           likes = +item.statistics.likeCount || 0,
                           dislikes = +item.statistics.dislikeCount || 0,
                           total = likes + dislikes;

                        let percent = Math.floor(likes / total * 100);
                        let timeNow = new Date();

                        // show more than the min value
                        if (+percent && views > 5 && total > 3) {
                           attachBar({ 'id': item.id, 'pt': percent });
                           // console.debug('requestRating > attachBar', item.id);
                        } else {
                           percent = null; // do not display
                           timeNow = timeNow.setHours(timeNow.getHours() - (CACHED_TIME - 1)); // cache for 1 hour
                        }
                        // push to cache
                        newCacheItem[item.id] = { 'date': new Date(timeNow).getTime(), 'pt': percent };
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

      function attachBar({ id = required(), pt = required() }) {
         // console.debug('attachBar', ...arguments);
         const templateBar = document.createElement('div');
         templateBar.className = 'style-scope ytd-sentiment-bar-renderer';
         templateBar.id = SELECTOR_ID;

         document.querySelectorAll(`a#thumbnail[href*="${id}"]`)
            .forEach(a => {
               // console.debug('finded', a, pt);
               templateBar.style.background = `linear-gradient(to right, ${colorLiker} ${pt}%, ${colorDislike} ${pt}%)`;
               // a.append(templateBar.cloneNode(true)); // unsure and need to use - cloneNode
               a.append(templateBar);
               // a.insertAdjacentHTML('beforeend',
               //    `<div id="${SELECTOR_ID}" class="style-scope ytd-sentiment-bar-renderer" style="background:linear-gradient(to right, ${colorLiker} ${pt}%, ${colorDislike} ${pt}%)"></div>`);
            });
      }

   },
   options: {
      rating_bar_height: {
         _tagName: 'input',
         label: 'Bar height',
         type: 'number',
         title: 'in pixels',
         placeholder: '1-9',
         min: 1,
         max: 9,
         value: 3,
      },
      rating_like_color: {
         _tagName: 'input',
         label: 'Like color',
         type: 'color',
         value: '#3ea6ff',
      },
      rating_dislike_color: {
         _tagName: 'input',
         label: 'Dislike color',
         type: 'color',
         value: '#ddDDdd',
      },
   },
});
