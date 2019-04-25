_plugins.push({
   name: 'Rating Preview for Youtube',
   id: 'global-rating-bars',
   section: 'other',
   depends_page: 'all',
   desc: 'Rating bar over video thumbnail',
   _runtime: user_settings => {

      const YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST = 50; // API maximum is 50
      const ratioBarSelectorIdName = 'ratioRateLine';
      let collectVideoIds = [];

      // init bars style
      YDOM.injectStyle('#' + ratioBarSelectorIdName + ' {' +
         'position: absolute;' +
         'bottom: 0;' +
         'width: 100%;' +
         'height: 0.' + (+user_settings.ratio_bar_height || 5) + 'em;' +
         '}');

      YDOM.waitFor('#thumbnail:not(.genThumbnail)', thumbnail => {
         // console.log('start gen: rateBar');
         thumbnail.classList.add('genThumbnail'); // lock

         collectVideoIds.push(
            YDOM.getUrlVars(thumbnail.href)['v'] // take GET id
         );

      }, 'hard-waitFor-listener');

      // chack update new thumbnail
      let interval_check_thumbnail = setInterval(() => {
         if (collectVideoIds.length) {
            // console.log('find new thumbnail');

            // start optimized block
            const _collectVideoIds = collectVideoIds; // link new arr
            collectVideoIds = []; // clear the array to prevent repeated requests "setInterval"
            // end optimized block

            // cached and process "generateRatioBar" 
            saveInCache(_collectVideoIds, generateRatioBar);
         }
      }, 3000);

      function saveInCache(arrList, callback) {
         // console.log('saveInCache', arrList);

         for (const id in arrList) {
            const key = arrList[id];

            let now = new Date();
            // now = 1556128098981; //to test to have expired
            const savePrefix = 'vid-';
            let storeSessionKey = {}; // fix: Uncaught TypeError: is not iterable
            storeSessionKey = JSON.parse(sessionStorage.getItem(savePrefix + key));
            // console.log('>', storeSessionKey);

            // take from sessionStorage
            if (storeSessionKey &&
               storeSessionKey.hasOwnProperty('expires') &&
               storeSessionKey.hasOwnProperty('pt') &&
               +storeSessionKey.expires > now.getTime()) {
               // console.log('get from store', key);
               if (callback && typeof (callback) === 'function') callback([storeSessionKey]);

            } else { // create amd save new
               fetchVideosData(arrList, videosStatistics => {
                  // console.log('videosStatistics:', JSON.stringify(videosStatistics));
                  if (callback && typeof (callback) === 'function') callback(videosStatistics);

                  // saving to sessionStorage afler all
                  for (const stats of videosStatistics) {
                     sessionStorage.setItem(savePrefix + key, JSON.stringify({
                        'id': key, //videosStatistics.id
                        'expires': +now.setHours(now.getHours() + 1), // add 1 hour,
                        'pt': +stats.pt,
                     })); // expires
                  }
               });
            }
         }
      }

      function generateRatioBar(thumbnailObj) {
         // console.log('generateRatioBar', thumbnailObj);

         const colorLiker = user_settings.ratio_like_color || '#3ea6ff';
         const colorDislike = user_settings.ratio_dislike_color || '#ddd';

         for (const thumb of thumbnailObj) {
            const pt = thumb.pt;

            Array.from(document.querySelectorAll("a#thumbnail[href]"))
               .forEach(a => {
                  if (a.href.indexOf(thumb.id) !== -1) { // gref has id
                     // console.log('ok', thumb.id, a.href);
                     a.insertAdjacentHTML("beforeend", '<div id="' + ratioBarSelectorIdName + '" style="background:linear-gradient(to right, ' + colorLiker + ' ' + pt + '%, ' +
                        colorDislike + ' ' + pt + '%)"></div>');
                  }
               });

         }
      }

      function fetchVideosData(videoIdsArray, callback) {
         // console.log('fetchVideosData', videoIdsArray);

         if (videoIdsArray.length > YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST) {
            function chunkArray(arr, size) {
               let results = [];
               while (arr.length) {
                  results.push(arr.splice(0, size));
               }
               return results;
            };

            console.log('more max YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST', videoIdsArray.length);
            const requestCount = Math.ceil(+YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST / videoIdsArray.length);
            const videoChunkArray = chunkArray(videoIdsArray, requestCount);
            let limitsIds = arr => arr.splice(0, YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST).join(',');

            for (const part in videoChunkArray) {
               createRequest(limitsIds(videoChunkArray[part]));
            }

         } else {
            createRequest(videoIdsArray);
         }

         function createRequest(videoIds) {
            const url = 'videos?id=' + videoIds + '&part=statistics&key=' + user_settings.api_key;
            RequestFetch(url, {}, 'json', res => {
               // console.log('res', JSON.stringify(res));
               const videosStatistics = res.items.map(item => {
                  const views = parseInt(item.statistics.viewCount);
                  const likes = parseInt(item.statistics.likeCount);
                  const dislikes = parseInt(item.statistics.dislikeCount);
                  const total = likes + dislikes;
                  const pt = Math.floor(likes / total * 100);

                  if (views > 5 && likes > 2) return {
                     'id': item.id,
                     'pt': pt,
                     // 'views': views,
                  };
               });
               // console.log('need create bars', JSON.stringify(videosStatistics));

               if (callback && typeof (callback) === 'function') return callback(videosStatistics);
            });
         }
      }

   },
   export_opt: (function () {
      return {
         'ratio_bar_height': {
            _elementType: 'input',
            label: 'Bar height',
            type: 'number',
            placeholder: '1-9',
            step: 1,
            min: 1,
            max: 9,
            value: 3,
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
      };
   }()),
});
