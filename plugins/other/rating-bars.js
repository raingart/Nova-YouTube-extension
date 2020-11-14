_plugins.push({
   name: 'Rating preview',
   id: 'global-rating-bars',
   section: 'global',
   depends_page: 'all, -embed',
   api_key_dependency: true,
   desc: 'Rating bar over video thumbnail',
   _runtime: user_settings => {

      const
         CACHED_TIME = 8, // hours
         SELECTOR_ID = 'ratio-rate-line',
         CACHE_NAME = 'ratings',
         ATTR_MARK = 'rating-bar-added',
         colorLiker = user_settings.ratio_like_color || '#3ea6ff',
         colorDislike = user_settings.ratio_dislike_color || '#ddd';

      // init bars style
      YDOM.injectStyle(`#${SELECTOR_ID}{
         width: 100%;
         height: ${(user_settings.ratio_bar_height || 5)}px;
      }
      a#thumbnail > #${SELECTOR_ID} {
         position: absolute;
         bottom: 0;
      }`);


      let thumbnailIds = [];
      let newCache = {};

      YDOM.HTMLElement.watch({
         selector: '#thumbnail:not([' + ATTR_MARK + '])',
         callback: thumbnail => {
            // console.debug('stathumbnailar', thumbnail);
            if (thumbnail.hasAttribute(ATTR_MARK)) return;
            // console.debug('start gen: rateBar');
            thumbnail.setAttribute(ATTR_MARK, true); // lock

            const id = YDOM.getURLParams(thumbnail.href).get('v');
            id && thumbnailIds.push(id);
         },
      });

      // chack update new thumbnail
      setInterval(() => {
         thumbnailPatch(thumbnailIds);
         cacheUpdater(newCache);
      }, 1000 * 1); // 1sec

      function cacheUpdater(new_cache) {
         if (!new_cache || !Object.keys(new_cache).length) return;
         // console.debug('cacheUpdater', JSON.stringify(...arguments));
         newCache = {}; // clear
         let oldCache = JSON.parse(localStorage.getItem(CACHE_NAME)) || {}; // get
         const timeNow = new Date();
         // delete expired
         // console.groupCollapsed('ratingCacheExpires');
         Object.entries(oldCache)
            .filter(([key, value]) => {
               const cacheDate = new Date(+value?.date);
               const dateExpires = cacheDate.setHours(cacheDate.getHours() + CACHED_TIME);
               if (timeNow > dateExpires) {
                  // console.debug('dateExpires', key, value);
                  delete oldCache[key];
               }
            });
         // console.groupEnd();
         // save
         localStorage.setItem(CACHE_NAME, JSON.stringify(Object.assign(new_cache, oldCache)));
      }

      function thumbnailPatch(video_ids) {
         if (!video_ids.length) return;
         // console.debug('find thumbnail', JSON.stringify(...arguments));
         thumbnailIds = []; // clear
         let oldCache = JSON.parse(localStorage.getItem(CACHE_NAME));
         const timeNow = new Date();

         let newVidIds = video_ids.filter(id => {
            if (oldCache?.hasOwnProperty(id)) {
               const cacheItem = oldCache[id],
                  cacheDate = new Date(+cacheItem?.date),
                  dateExpires = cacheDate.setHours(cacheDate.getHours() + CACHED_TIME);
               if (timeNow < dateExpires) {
                  // console.debug('cached', id);
                  appendRatingBar({ 'id': id, 'pt': cacheItem.pt });
                  return false;
               }
               // else console.debug('expired', document.querySelector(`a#thumbnail[href*="${id}"]`));
            }
            // else console.debug('new', document.querySelector(`a#thumbnail[href*="${id}"]`));
            return true;
         });
         // console.debug('newVidIds', JSON.stringify(newVidIds));
         requestVideoData(newVidIds);
      }

      function requestVideoData(arr_id) {
         if (!arr_id.length) return;
         // console.debug('requestVideoData', JSON.stringify(...arguments));

         const YOUTUBE_API_MAX_IDS_PER_CALL = 50; // API max = 50

         chunkArray(arr_id, YOUTUBE_API_MAX_IDS_PER_CALL)
            .forEach(id_part => {
               // console.debug('id_part', JSON.stringify(id_part));
               YDOM.request.API({
                  request: 'videos',
                  params: {
                     'id': id_part.join(','),
                     'part': 'statistics',
                  },
                  api_key: user_settings['custom-api-key'],
               })
                  .then(res => {
                     let timeNow = new Date().getTime();
                     res.items.forEach(item => {
                        // console.debug('item', item);
                        const
                           views = parseInt(item.statistics.viewCount) || 0,
                           likes = parseInt(item.statistics.likeCount) || 0,
                           dislikes = parseInt(item.statistics.dislikeCount) || 0,
                           total = likes + dislikes;

                        let percent = Math.floor(likes / total * 100);

                        // filter small values
                        if (views > 5 && total > 3) {
                           appendRatingBar({ 'id': item.id, 'pt': percent });
                           // console.debug('requestVideoData > appendRatingBar', item.id);
                        } else {
                           percent = undefined; // do not display
                           timeNow = timeNow.setHours(timeNow.getHours() - CACHED_TIME + 1); // add 1 hour
                        }
                        // push to cache
                        newCache[item.id] = { 'date': timeNow, 'pt': percent };
                     });
                  });
            });

         function chunkArray(array, size) {
            let chunked = [];
            while (array.length) chunked.push(array.splice(0, size));
            return chunked;
         }
      }

      function appendRatingBar({ id, pt }) {
         if (!id || !pt) return
         // console.debug('appendRatingBar', JSON.stringify(...arguments));
         [...document.querySelectorAll(`a#thumbnail[href*="${id}"]`)]
            .forEach(a => {
               // console.debug('finded', a, pt);
               a.insertAdjacentHTML("beforeend", `<div id="${SELECTOR_ID}" class="style-scope ytd-sentiment-bar-renderer" style="background:linear-gradient(to right, ${colorLiker} ${pt}%, ${colorDislike} ${pt}%)"></div>`);
            });
      }

   },
   opt_export: {
      'ratio_bar_height': {
         _elementType: 'input',
         label: 'Bar height',
         type: 'number',
         placeholder: '1-9',
         title: 'In pixels',
         step: 1,
         min: 1,
         max: 9,
         value: 2,
      },
      'ratio_like_color': {
         _elementType: 'input',
         label: 'Like color',
         type: 'color',
         value: '#3ea6ff',
      },
      'ratio_dislike_color': {
         _elementType: 'input',
         label: 'Dislike color',
         type: 'color',
         value: '#ddDDdd',
      },
   },
});
