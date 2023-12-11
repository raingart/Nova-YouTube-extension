window.nova_plugins.push({
   id: 'return-dislike',
   title: 'Show dislike count',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'watch, -mobile',
   // restart_on_location_change: true,
   section: 'details',
   // opt_api_key_warn: true,
   desc: 'via by returnyoutubedislike.com',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   // 'data-conflict': 'details-buttons',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/436115-return-youtube-dislike
      // alt2 - https://greasyfork.org/en/scripts/480949-show-youtube-like-dislike-ratios-in-video-descriptions

      // fix conflict with [details-buttons] plugin
      if (user_settings.details_button_no_labels
         || user_settings.details_buttons_hide?.includes('like_dislike')
      ) {
         return;
      }

      const
         CACHE_PREFIX = 'nova-dislikes-count:',
         SELECTOR_ID = 'nova-dislikes-count';

      NOVA.runOnPageInitOrTransition(() => {
         if (NOVA.currentPage == 'watch') {
            NOVA.waitSelector('#actions dislike-button-view-model button', { destroy_if_url_changes: true })
               .then(el => setDislikeCount(el));
         }
      });

      // NOVA.waitSelector('video')
      //    .then(video => {
      //       video.addEventListener('loadeddata', () => {
      //          NOVA.waitSelector('ytd-watch-metadata #actions segmented-like-dislike-button-view-model button', { destroy_if_url_changes: true })
      //             .then(el => setDislikeCount(el));
      //       });
      //    });

      async function setDislikeCount(container = required()) {
         // console.debug('setDislikeCount:', ...arguments);
         const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
         if (!videoId) return console.error('return-dislike videoId: empty', videoId);

         container.style.width = 'auto'; // fix width

         // has in cache
         if (storage = sessionStorage.getItem(CACHE_PREFIX + videoId)) {
            insertToHTML({ 'data': JSON.parse(storage), 'container': container });
         }
         else if (data = await getDislikeCount()) {
            insertToHTML({ 'data': data, 'container': container });
         }

         async function getDislikeCount() {
            const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
            // https://www.returnyoutubedislike.com/docs/fetching
            const fetchAPI = () => fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`,
               {
                  method: 'GET', // *GET, POST, PUT, DELETE, etc.
                  // mode: 'no-cors', // no-cors, *cors, same-origin
                  headers: { 'Content-Type': 'application/json' } // 'Content-Type': 'application/x-www-form-urlencoded',
               }
            )
               .then(response => response.json())
               // {
               //    "id": "XXX",
               //    "dateCreated": "2023-06-26T06:33:35.635172Z",
               //    "likes": 98,
               //    "dislikes": 0,
               //    "rating": 5,
               //    "viewCount": 679,
               //    "deleted": false
               // }
               .then(json => json.dislikes && ({ 'likes': json.likes, 'dislikes': json.dislikes }))
               .catch(error => {
                  // mute console warn
                  // console.warn(`returnyoutubedislikeapi: failed fetching skipSegments for ${ videoId }, reason: ${ error } `)
               });

            if (result = await fetchAPI()) {
               // console.debug('result getDislikeCount', result);
               sessionStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify(result));
               return result;
            }
         }

         function insertToHTML({ data = required(), container = required() }) {
            // console.debug('insertToHTML', ...arguments);
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

            const percent = ~~(100 * data.likes / (data.likes + data.dislikes));
            const text = `${data.dislikes} (${percent}%)`;

            (document.getElementById(SELECTOR_ID) || (function () {
               container.insertAdjacentHTML('beforeend',
                  `<span id="${SELECTOR_ID}" style="text-overflow:ellipsis; overflow:visible; white-space:nowrap; padding-left:3px;">${text}</span>`);
               return document.getElementById(SELECTOR_ID);
            })())
               .textContent = text;

            container.title = text;
         }

      }

   },
});
