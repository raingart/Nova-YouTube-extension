_plugins.push({
   name: 'Rating Preview for Youtube',
   id: 'global-rating-bars',
   section: 'other',
   depends_page: 'all',
   desc: 'Rating bar over video thumbnail',
   _runtime: user_settings => {

      const OUT_SELECTOR_ID = 'ratioRateLine';
      const CACHED_PREFIX = 'rbar_';
      let collectVideoIds = [];

      // init bars style
      YDOM.injectStyle('#' + OUT_SELECTOR_ID + ' {' +
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
      setInterval(() => {
         if (collectVideoIds.length) {
            // console.log('find new thumbnail');
            let _collectVideoIds = collectVideoIds;
            // clear the array to prevent repeated requests "setInterval"
            collectVideoIds = [];

            const now = new Date();  //epoch time, lets deal only with integer
            const new_video_ids = _collectVideoIds.filter(video_id => {
               const item = JSON.parse(localStorage.getItem(CACHED_PREFIX + video_id));

               if (item && item.hasOwnProperty('expires')) {
                  if (+item.expires > now) {
                     // console.log('cached', video_id);
                     addRatingBars(item);

                  } else {
                     // console.log('expired', video_id);
                     // clear expired storage
                     localStorage.removeItem(item)

                     return true; // need update
                  }
               } else {
                  return true; // will be created
               }

            });
            // new_video_ids.forEach(k => localStorage.removeItem(k));
            // console.log('new', new_video_ids);
            getVideoData(new_video_ids);
         }
      }, 3000);


      function getVideoData(videoIds) {
         if (!videoIds.length || !Array.isArray(videoIds)) return;
         // console.log('getVideoData', videoIds);

         const YOUTUBE_API_MAX_IDS_PER_CALL = 50; // API maximum is 50

         chunkArray(videoIds, YOUTUBE_API_MAX_IDS_PER_CALL)
            .forEach(ids => {
               YDOM.request.API('videos', {
                  'id': ids.join(','),
                  'part': 'statistics',
               })
                  .then(res => {
                     // console.log('res:', JSON.stringify(res));
                     const now = new Date();  //epoch time, lets deal only with integer
                     res.items.map(item => {
                        // console.log('item', item);
                        const views = parseInt(item.statistics.viewCount) || 0;
                        const likes = parseInt(item.statistics.likeCount) || 0;
                        const dislikes = parseInt(item.statistics.dislikeCount) || 0;
                        const total = likes + dislikes;
                        const percent = Math.floor(likes / total * 100);

                        if (views > 5 && likes > 2) {
                           const videoStatistics = {
                              'id': item.id, // need to selector out
                              'pt': percent,
                              // 'views': views,
                              'expires': +now.setHours(now.getHours() + 1), // add 1 hour,
                           }
                           addRatingBars(videoStatistics);

                           // save cache
                           localStorage.setItem(CACHED_PREFIX + item.id, JSON.stringify(videoStatistics));
                        }
                     });
                  });
            })
      }

      const colorLiker = user_settings.ratio_like_color || '#3ea6ff';
      const colorDislike = user_settings.ratio_dislike_color || '#ddd';

      function addRatingBars(thumbnailObj) {
         // console.log('generateRatioBar', thumbnailObj);
         // fix: Uncaught TypeError: is not iterable
         if (!Array.isArray(thumbnailObj)) thumbnailObj = [thumbnailObj];

         for (const thumb of thumbnailObj) {
            const pt = thumb.pt;

            Array.from(document.querySelectorAll("a#thumbnail[href]"))
               .forEach(a => {
                  // href has id
                  if (a.href.indexOf(thumb.id) !== -1) {
                     // console.log('finded', thumb.id, a.href);
                     a.insertAdjacentHTML("beforeend", `<div id="${OUT_SELECTOR_ID}" style="background:linear-gradient(to right, ${colorLiker} ${pt}%, ${colorDislike} ${pt}%)"></div>`);
                  }
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
