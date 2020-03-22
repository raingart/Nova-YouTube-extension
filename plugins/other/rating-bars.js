_plugins.push({
   name: 'Rating Preview for Youtube',
   id: 'global-rating-bars',
   section: 'global',
   depends_page: 'all, -embed',
   api_key_dependent: true,
   desc: 'Rating bar over video thumbnail',
   _runtime: user_settings => {

      const SELECTOR_NAME = 'ratio-rate-line';
      const SELECTOR_RATE = '#' + SELECTOR_NAME;
      const CACHED_PREFIX = 'rate-bar_';
      let collectVideoIds = [];

      // init bars style
      YDOM.injectStyle(`${SELECTOR_RATE} {
         width: 100%;
         height: ${(+user_settings.ratio_bar_height || 5)}px;
      }
      a#thumbnail > ${SELECTOR_RATE} {
         position: absolute;
         bottom: 0;
      }`);

      const markAttrName = 'rating-bar-added';

      YDOM.waitHTMLElement('a#thumbnail:not([' + markAttrName + '])', thumbnail => {
         if (thumbnail.hasAttribute(markAttrName)) return;
         // console.log('start gen: rateBar');
         thumbnail.setAttribute(markAttrName, true); // lock

         collectVideoIds.push(YDOM.getURLParams(thumbnail.href).get('v'));

      }, 'hard waitHTMLElement listener');

      // chack update new thumbnail
      setInterval(() => {
         // console.log('collectVideoIds', collectVideoIds);

         if (collectVideoIds.length) {
            // console.log('find new thumbnail');
            let _collectVideoIds = collectVideoIds;
            // clear the array to prevent repeated requests "setInterval"
            collectVideoIds = [];

            const now = new Date();  //epoch time, lets deal only with integer
            const newVidIds = _collectVideoIds.filter(video_id => {
               const item = JSON.parse(localStorage.getItem(CACHED_PREFIX + video_id));

               if (item && item.hasOwnProperty('expires')) {
                  if (+item.expires > now) {
                     // console.log('cached', video_id);
                     appendRatingBars(item);

                  } else {
                     // clear expired storage
                     // console.log('expired', video_id);
                     localStorage.removeItem(item);

                     return true; // need update
                  }
               } else {
                  return true; // will be created
               }

            });
            // newVidIds.forEach(k => localStorage.removeItem(k));
            // console.log('new', newVidIds);
            getRatingsObj(newVidIds);
         }
      }, 1000); // 1 sec


      function getRatingsObj(videoIds) {
         if (!videoIds.length || !Array.isArray(videoIds)) return;
         // console.log('getRatingsObj', videoIds);

         const YOUTUBE_API_MAX_IDS_PER_CALL = 50; // API maximum is 50

         chunkArray(videoIds, YOUTUBE_API_MAX_IDS_PER_CALL)
            .forEach(ids => {
               YDOM.request.API('videos', {
                  'id': ids.join(','),
                  'part': 'statistics',
               }, user_settings['custom-api-key'])
                  .then(res => {
                     const now = new Date();  //epoch time, lets deal only with integer
                     res.items.forEach(item => {
                        // console.log('item', item);
                        const views = parseInt(item.statistics.viewCount) || 0;
                        const likes = parseInt(item.statistics.likeCount) || 0;
                        const dislikes = parseInt(item.statistics.dislikeCount) || 0;
                        const total = likes + dislikes;
                        const percent = Math.floor(likes / total * 100);

                        const videoStatistics = {
                           'expires': +now.setHours(now.getHours() + 1), // add 1 hour,
                           'id': item.id, // need to selector out
                           'pt': percent,

                           'views': views,
                           'total': total,
                        }
                        appendRatingBars(videoStatistics);
                        // save cache
                        localStorage.setItem(CACHED_PREFIX + item.id, JSON.stringify(videoStatistics));
                     });
                  });
            })
      }

      const colorLiker = user_settings.ratio_like_color || '#3ea6ff';
      const colorDislike = user_settings.ratio_dislike_color || '#ddd';

      function appendRatingBars(thumbnailObj) {
         // console.log('appendRatingBars start', thumbnailObj);
         // fix: Uncaught TypeError: is not iterable
         if (!Array.isArray(thumbnailObj)) thumbnailObj = [thumbnailObj];

         for (const thumb of thumbnailObj) {
            // filter small values
            if (thumb.views < 5 || thumb.total < 3) continue;

            [...document.querySelectorAll('a#thumbnail[href*="' + thumb.id + '"]')].forEach(a => {
               // console.log('finded', thumb.id, a.href, thumb.pt);
               const pt = thumb.pt;
               // a = a.parentElement.parentElement.querySelector('#metadata-line') || a;
               a.insertAdjacentHTML("beforeend", `<div id="${SELECTOR_NAME}" class="style-scope ytd-sentiment-bar-renderer" style="background:linear-gradient(to right, ${colorLiker} ${pt}%, ${colorDislike} ${pt}%)"></div>`);
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
      };
   }()),
});
