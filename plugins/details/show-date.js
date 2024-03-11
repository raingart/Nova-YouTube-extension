// for test
// https://www.youtube.com/watch?v=jfKfPfyJRdk - live now
// https://www.youtube.com/watch?v=c9Ft3LqNmrE - live ended
// https://www.youtube.com/watch?v=OBt8J5TVfEY - premiere ended
// https://www.youtube.com/watch?v=nCBALMNMpuI - premiere duration 2 days

window.nova_plugins.push({
   id: 'video-date-format',
   // title: 'Displaying date format',
   title: 'Date format display',
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
   run_on_pages: 'watch, -mobile',
   // restart_on_location_change: true,
   section: 'details',
   opt_api_key_warn: true,
   _runtime: user_settings => {

      // alt1 - https://chrome.google.com/webstore/detail/amdebbajoolgbbgdhdnkhmgkkdlbkdgi
      // alt2 - https://greasyfork.org/en/scripts/457850-youtube-video-info
      // alt3 - https://greasyfork.org/en/scripts/424068-youtube-exact-upload
      // alt4 - https://greasyfork.org/en/scripts/457478-show-youtube-s-video-date-behind-subscription-button
      // alt5 - https://chrome.google.com/webstore/detail/nenoecmaibjcahoahnmeinahlapheblg

      const
         CACHE_PREFIX = 'nova-video-date:',
         DATE_SELECTOR_ID = 'nova-video-published-date';

      NOVA.runOnPageLoad(async () => {
         if (NOVA.currentPage == 'watch') {
            await NOVA.waitUntil(() => typeof movie_player === 'object', 1000); // 1sec

            NOVA.waitSelector('#title h1', { destroy_after_page_leaving: true })
               .then(el => setVideoDate(el));
         }
      });

      function setVideoDate(container = required()) {
         // console.debug('setVideoDate:', ...arguments);
         const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;

         // // has in cache
         if ((storage = sessionStorage.getItem(CACHE_PREFIX + videoId))
            && storage.format == user_settings.video_date_format // if user not set new format
         ) {
            return insertToHTML({ 'text': storage.date, 'container': container });
         }
         // // from local
         // else if (videoDate = document.body.querySelector('ytd-watch-flexy')?.playerData?.microformat?.playerMicroformatRenderer.publishDate ||
         //    NOVA.seachInObjectBy.key({
         //       'obj': (document.body.querySelector('ytd-watch-flexy')?.playerData
         //          || document.body.querySelector('ytd-app')?.__data?.data?.response
         //          || document.body.querySelector('ytd-app')?.data?.response
         //          || window.ytInitialData
         //       ),
         //       'keys': 'publishDate',
         //       match_fn: null,
         //    })?.data) {
         //    videoDate = videoDate.simpleText || videoDate;
         //    insertToHTML({ 'text': videoDate, 'container': container });
         //    // save cache in tabs
         //    sessionStorage.setItem(CACHE_PREFIX + videoId, videoDate);
         // }
         // from API
         // else {
         NOVA.request.API({
            request: 'videos',
            params: {
               'id': videoId,
               'part': 'snippet,liveStreamingDetails'
                  + (user_settings.video_view_count ? ',statistics' : '')
            },
            api_key: user_settings['user-api-key'],
         })
            .then(res => {
               if (res?.error) return alert(`Error [${res.code}]: ${res.reason}\n` + res.error);

               // ex - https://developers.google.com/youtube/v3/docs/videos/list?apix_params=%7B%22part%22%3A%5B%22snippet%22%5D%2C%22id%22%3A%5B%22jfKfPfyJRdk%22%5D%7D
               res?.items?.forEach(item => {
                  // console.debug('item', item);

                  let outList = [];
                  // views
                  if (user_settings.video_view_count && item.statistics.viewCount) {
                     // "statistics": {
                     //    "viewCount": "313303291",
                     //    "likeCount": "2376859",
                     //    "favoriteCount": "0",
                     //    "commentCount": "0",
                     //  }
                     outList.push(NOVA.prettyRoundInt(item.statistics.viewCount), 'views');
                     // outList.push(new Intl.NumberFormat().format(item.statistics.viewCount), ' • ');
                     // outList.push(NOVA.prettyRoundInt(item.statistics.viewCount), ' • ');
                  }

                  // live
                  if (item.liveStreamingDetails) {
                     // "liveStreamingDetails": {
                     //    "actualStartTime": "2022-07-12T15:59:30Z",
                     //    "scheduledStartTime": "2022-07-12T16:00Z",
                     //    "concurrentViewers": "99",
                     //    "activeLiveChatId": "...",
                     //  }

                     // live now
                     if (movie_player.getVideoData().isLive || item.snippet.liveBroadcastContent == 'live') {
                        outList.push('Active Livestream',
                           NOVA.dateformat.apply(new Date(item.liveStreamingDetails.actualStartTime), [user_settings.video_date_format])
                        );
                     }
                     // ended
                     else if (item.liveStreamingDetails.actualEndTime) {
                        const
                           timeStart = new Date(item.liveStreamingDetails.actualStartTime),
                           timeEnd = new Date(item.liveStreamingDetails.actualEndTime),
                           sameDate = timeStart.getDay() === timeEnd.getDay(); // start date and end date are the same

                        outList.push(
                           // movie_player.getVideoData().isLive  // Doesn't work if the video is not running
                           document.body.querySelector('ytd-watch-flexy')?.playerData?.videoDetails?.isLiveContent
                              ? 'Streamed'
                              : 'Premiered'
                        );
                        if (!sameDate) outList.push('from');
                        outList.push(NOVA.dateformat.apply(timeStart, [user_settings.video_date_format]));

                        if (!sameDate) {
                           outList.push('until',
                              NOVA.dateformat.apply(timeEnd, [user_settings.video_date_format])
                           );
                        }
                     }
                     // Premiere announcement
                     // else if (item.liveStreamingDetails.scheduledStartTime) {
                     else if (item.snippet.liveBroadcastContent == 'upcoming') {
                        outList.push('Scheduled',
                           NOVA.dateformat.apply(new Date(item.liveStreamingDetails.scheduledStartTime), [user_settings.video_date_format])
                        );
                     }
                  }
                  // regular
                  else if (item.snippet.publishedAt) {
                     // "snippet": {
                     //    "liveBroadcastContent": "live", // "none", "upcoming"
                     //    "publishedAt": "2022-02-28T19:42:38Z",
                     //  }
                     const publishedDate = new Date(item.snippet.publishedAt);

                     if (user_settings.video_date_format == 'ago') {
                        outList.push(NOVA.formatTimeOut.ago(publishedDate), 'ago');
                     }
                     else {
                        outList.push(NOVA.dateformat.apply(publishedDate, [user_settings.video_date_format]));
                     }
                  }
                  // out
                  if (outList.length) {
                     insertToHTML({ 'text': outList.join(' '), 'container': container });
                     // save cache in tabs
                     sessionStorage.setItem(CACHE_PREFIX + videoId, {
                        'date': outList.join(' '),
                        'format': user_settings.video_date_format
                     });
                  }
                  // else {
                  //    return console.warn('API is change', item);
                  // }
               });
            });
         // }

         function insertToHTML({ text = '', container = required() }) {
            // console.debug('insertToHTML', ...arguments);
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

            (document.getElementById(DATE_SELECTOR_ID) || (() => {
               const el = document.createElement('span');
               el.id = DATE_SELECTOR_ID;
               el.className = 'style-scope yt-formatted-string bold';
               el.style.cssText = 'font-size: 1.35rem; line-height: 2rem; font-weight:400;';
               container.after(el);
               // container.insertAdjacentElement('afterend', el);
               return el;
               // 62.88 % slower
               // container.insertAdjacentHTML('afterend',
               //    `<span id="${DATE_SELECTOR_ID}" class="style-scope yt-formatted-string bold" style="font-size: 1.35rem; line-height: 2rem; font-weight:400;">${text}</span>`);
               // return document.getElementById(DATE_SELECTOR_ID);
            })())
               // .textContent = new Date(text).format(user_settings.video_date_format);
               // .textContent = NOVA.dateformat.apply(new Date(text), [user_settings.video_date_format]);
               .textContent = text;
         }

         // simple
         // Date.prototype.format = function (format = 'YYYY/MM/DD') {
         // function NOVA.dateformat(format = 'YYYY/MM/DD') {
         //    return format
         //       .replace('YYYY', this.getFullYear())
         //       .replace('MMM', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][(this.getMonth() + 1)]) // Attention! before "MM"
         //       .replace('MM', (this.getMonth() + 1).toString().padStart(2, '0'))
         //       .replace('DD', this.getDate().toString().padStart(2, '0'))
         //       .replace('D', this.getDate());
         // };
      }

   },
   options: {
      video_view_count: {
         _tagName: 'input',
         label: 'Show views count',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:vi': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         type: 'checkbox',
         // title: '',
      },
      video_date_format: {
         _tagName: 'select',
         label: 'Date pattern',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:vi': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         options: [
            { label: 'ago', value: 'ago' },
            { label: 'January 20, 1999', value: 'MMMM D, YYYY' },
            { label: '20 Jan 1999', value: 'D MMM YYYY' },
            { label: '20 Jan 1999 at 23:59', value: 'D MMM YYYY at H:mm', selected: true },
            { label: 'Mon 20/01/1999 23:59', value: 'DDD DD/MM/YYYY H:mm' },
            { label: 'Monday 20/01/1999 23:59', value: 'DDDD DD/MM/YYYY H:mm' },
            { label: '1999/01/20', value: 'YYYY/MM/DD' },
            { label: '1999/01/20 at 23:59', value: 'YYYY/MM/DD at H:mm' },
            { label: '1999-01-20', value: 'YYYY-MM-D' },
            { label: '1999-01-20 at 23:59', value: 'YYYY-MM-D at H:mm' },
            { label: '1999.1.20', value: 'YYYY.M.D' },
            { label: '1999.1.20 at 23:59', value: 'YYYY.M.D at H:mm' },
            { label: '01/20/1999', value: 'MM/DD/YYYY' },
            { label: '01/20/1999 at 23:59', value: 'MM/DD/YYYY at H:mm' },
            { label: '01-20-1999', value: 'MM-D-YYYY' },
            { label: '01-20-1999 at 23:59', value: 'MM-D-YYYY at H:mm' },
            { label: '01.20.1999', value: 'MM.D.YYYY' },
            { label: '01.20.1999 at 23:59', value: 'MM.D.YYYY at H:mm' },
         ],
      },
   }
});
