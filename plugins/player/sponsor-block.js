// for  test
// https://www.youtube.com/watch?v=q45jxjne3BU - many ad
// https://www.youtube.com/watch?v=3eJZcpoSpKY
// https://www.youtube.com/watch?v=pf9WOuzeWhw
// https://www.youtube.com/watch?v=KboTw3NBuuk - ad in multi chaprtes

window.nova_plugins.push({
   id: 'sponsor-block',
   title: 'SponsorBlock',
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
   run_on_pages: 'watch, embed',
   // restart_on_location_change: true,
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // there is a small conflict with the [player-resume-playback] plugin. It has higher priority

      // alt1 - https://github.com/afreakk/greasemonkeyscripts/blob/master/youtube_sponsorblock.js
      // alt2 - https://codeberg.org/mthsk/userscripts/src/branch/master/simple-sponsor-skipper
      // alt3 - https://github.com/mchangrh/sb.js/blob/main/docs/sb.user.js
      // alt4 - https://chromewebstore.google.com/detail/mnjggcdmjocbbbhaepdhchncahnbgone

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            const categoryNameLabel = {
               sponsor: 'Sponsor',
               selfpromo: 'Self Promotion',
               interaction: 'Reminder Subscribe',
               intro: 'Intro',
               outro: 'Credits (Outro)',
               // poi_highlight   'Highlight',
               preview: 'Preview/Recap',
               music_offtopic: 'Non-Music Section',
               exclusive_access: 'Full Video Label Only',
            };

            let segmentsList = [];
            let muteState;
            let videoId; // share for console

            // reset chapterList
            // video.addEventListener('loadeddata', async () => segmentsList = await getSkipSegments(videoId) || []);
            video.addEventListener('loadeddata', init.bind(video));

            async function init() {
               videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
               segmentsList = await getSkipSegments(videoId) || [];
               // console.debug('segmentsList', segmentsList);

               // render marks for [player-float-progress-bar] plugin
               if (user_settings['player-float-progress-bar'] && segmentsList.length) {
                  const SELECTOR = 'nova-player-float-progress-bar-chapters';
                  const deflectionSec = 5;
                  let chaptersEls;
                  // wait chapters
                  await NOVA.waitUntil(() =>
                     (chaptersEls = document.body.querySelectorAll(`#${SELECTOR} > span[time]`)) && chaptersEls.length
                     , 1000); // 1sec
                  // await NOVA.waitSelector(`#${SELECTOR} > span[time]`, { destroy_after_page_leaving: true }); // err

                  chaptersEls.forEach((chapterEl, idx) => {
                     if (idx === chaptersEls.length - 1) return; // if last chapter

                     const
                        chapterStart = Math.trunc(NOVA.formatTimeOut.hmsToSec(chapterEl.getAttribute('time'))),
                        chapterNextStart = Math.trunc(NOVA.formatTimeOut.hmsToSec(chaptersEls[idx + 1].getAttribute('time')));

                     for (const [i, value] of segmentsList.entries()) {
                        const [segmentStart, segmentEnd, category] = value;

                        // console.debug('chapter', segmentStart, segmentEnd);
                        // console.debug('chapterStart', chapterStart);
                        // console.debug('chapterNextStart', chapterNextStart);

                        // if ((Math.trunc(segmentStart) <= chapterNextStart) && (Math.trunc(segmentEnd) >= chapterStart)) {
                        if (((Math.trunc(segmentStart) + deflectionSec) <= chapterNextStart)
                           && ((Math.trunc(segmentEnd) - deflectionSec) >= chapterStart)
                        ) {
                           chapterEl.title = [chapterEl.title, categoryNameLabel[category]].join(', ');
                           let color;
                           switch (category) {
                              case 'sponsor': color = '255, 231, 0'; break;
                              case 'interaction': color = '255, 127, 80'; break;
                              case 'selfpromo': color = '255, 99, 71'; break;
                              case 'intro': color = '255, 165, 0'; break;
                              case 'outro': color = '255, 165, 0'; break;
                           }
                           chapterEl.style.background = `rgb(${color},.4`;
                        }
                     }
                  });
               }
            }
            // apply a skip method
            video.addEventListener('timeupdate', function () {
               // if (!isNaN(video.duration))

               let segmentStart, segmentEnd, category;

               // for (const [i, value] of segmentsList.entries()) {
               //    console.debug('>>', value, i);
               //    const [segmentStart, segmentEnd] = value;
               for (let i = 0; i < segmentsList.length; i++) {
                  // console.debug('>>', segmentsList, i);
                  [segmentStart, segmentEnd, category] = segmentsList[i];
                  segmentStart = Math.trunc(segmentStart);
                  segmentEnd = Math.ceil(segmentEnd);

                  const inSegment = (this.currentTime > segmentStart && this.currentTime < segmentEnd);

                  switch (user_settings.sponsor_block_action) {
                     // case 'full': break;
                     // case 'poi': break;
                     case 'mute':
                        // set Mute
                        // movie_player.isMuted() == this.muted
                        if (inSegment && !muteState && !this.muted) {
                           muteState = true;
                           movie_player.mute(true);

                           return novaNotification('muted');
                        }
                        // unMute
                        else if (!inSegment && muteState && this.muted) {
                           muteState = false;
                           movie_player.unMute();
                           segmentsList.splice(i, 1); // for optimization use segment once

                           return novaNotification('unMuted');
                        }
                        break;

                     // default:
                     case 'skip':
                        if (inSegment) {
                           this.currentTime = segmentEnd;
                           segmentsList.splice(i, 1); // for optimization use segment once

                           // return novaNotification('skipped');
                           return novaNotification();
                        }
                        break;
                  }
               }

               function novaNotification(prefix = '') {
                  if (!user_settings.sponsor_block_notification) return;

                  const msg = `${prefix} ${NOVA.formatTimeOut.HMS.digit(segmentEnd - segmentStart)} [${categoryNameLabel[category]}] • ${NOVA.formatTimeOut.HMS.digit(segmentStart)} - ${NOVA.formatTimeOut.HMS.digit(segmentEnd)}`;
                  console.info(videoId, msg); // user log
                  NOVA.showOSD(msg); // trigger default indicator
               }

            });
         });


      async function getSkipSegments(videoId = required()) {
         const CACHE_PREFIX = 'nova-videos-sponsor-block:';

         if (
            navigator.cookieEnabled // fix - Failed to read the 'sessionStorage' property from 'Window': Access is denied for this document.
            && (storage = sessionStorage.getItem(CACHE_PREFIX + videoId))
         ) {
            // console.debug('get from cache:', storage);
            return JSON.parse(storage);
         }
         else {
            const
               actionTypes = (Array.isArray(user_settings.sponsor_block_action)
                  ? user_settings.sponsor_block_action : [user_settings.sponsor_block_action])
                  || ['skip', 'mute'], // ['skip', 'mute', 'full', 'poi'],
               // https://wiki.sponsor.ajay.app/w/Guidelines
               categories = user_settings.sponsor_block_category || [
                  'sponsor',
                  'interaction',
                  'selfpromo',
                  'intro',
                  'outro',
                  // 'preview',
                  // 'music_offtopic',
                  // 'exclusive_access',

                  // I do not know what is this:
                  // 'poi_highlight',
                  // 'filler',
                  // 'chapter',
               ],
               // https://wiki.sponsor.ajay.app/w/API_Docs
               params = {
                  'videoID': videoId,
                  'actionTypes': JSON.stringify(actionTypes),
                  'categories': JSON.stringify(categories),
               },
               query = Object.keys(params)
                  .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                  .join('&');

            // [{
            //    "category": "sponsor",
            //    "actionType": "skip",
            //    "segment": [
            //       293.74,
            //       398.035
            //    ],
            //    "UUID": "8b14bb76323da6901da331a05df14ee9575e762f41365eee378b7ea249f664f07",
            //    "videoDuration": 1299.161,
            //    "locked": 0,
            //    "votes": 1,
            //    "description": ""
            // }]
            const fetchAPI = () => fetch((user_settings.sponsor_block_url || 'https://sponsor.ajay.app')
               + `/api/skipSegments?${query}`,
               {
                  method: 'GET', // *GET, POST, PUT, DELETE, etc.
                  // mode: 'no-cors', // no-cors, *cors, same-origin
                  headers: { 'Content-Type': 'application/json' }, // 'Content-Type': 'application/x-www-form-urlencoded',
               }
            )
               // .then(response => response.text())
               // .then(text => {
               //    if (text == 'Not Found') {
               //       const error = new Error('promise chain cancelled');
               //       error.name = 'CancelPromiseChainError';
               //       throw error;
               //    }
               // })
               .then(response => response.json()) // text "Not Found"
               .then(json => json
                  // .filter(i => i.actionType === 'skip')
                  // .map(a => a.segment)
                  .map(a => [...a.segment, a.category])
               )
               .catch(error => {
                  // mute console warn
                  // console.warn(`Sponsorblock: failed fetching skipSegments for ${videoId}, reason: ${error}`);
               });

            if (result = await fetchAPI()) {
               // console.debug('result sponsor', result
               //    // , (user_settings.sponsor_block_url || 'https://sponsor.ajay.app') + `/api/skipSegments?${query}`
               // );
               if (navigator.cookieEnabled) {
                  sessionStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify(result));
               }
               return result;
            }
         }
      }

      // alt
      // test https://www.youtube.com/watch?v=9Yhc6mmdJC4
      // async function getSkipSegments(videoId = required()) {
      //    const fetchAPI = () => fetch(`https://model.sponsor-skipper.com/getSponsorChaptersFor?videoID=${videoId}`,
      //       {
      //          method: 'GET', // *GET, POST, PUT, DELETE, etc.
      //          mode: 'no-cors', // no-cors, *cors, same-origin
      //          headers: { 'Content-Type': 'application/json' }, // 'Content-Type': 'application/x-www-form-urlencoded',
      //       }
      //    )
      //       .then(response => response.json())
      //       // {
      //       //    "sponsored_chapters":[
      //       //       {"end_time_sec":146.4,"start_time_sec":104.56}
      //       //    ],"videoID":""
      //       // }
      //       .then(json => json?.sponsored_chapters.map(o => ({
      //          'segmentStart': o.start_time_sec,
      //          'segmentEnd': o.end_time_sec,
      //       }))
      //       )
      //       .catch(error => {
      //          // mute console warn
      //          console.warn(`sponsor-skipper: failed fetching skipSegments for ${videoId}, reason: ${error}`);
      //       });

      //    if (result = await fetchAPI()) {
      //       // console.debug('result sponsor', result
      //       //    // , (user_settings.sponsor_block_url || 'https://sponsor.ajay.app') + `/api/skipSegments?${query}`
      //       // );
      //       if (navigator.cookieEnabled) {
      //          sessionStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify(result));
      //       }
      //       return result;
      //    }
      // }

   },
   options: {
      sponsor_block_category: {
         _tagName: 'select',
         label: 'Category',
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
         title: '[Ctrl+Click] to select several',
         'title:zh': '[Ctrl+Click] 选择多个',
         'title:ja': '「Ctrl+Click」して、いくつかを選択します',
         // 'title:ko': '[Ctrl+Click] 여러 선택',
         // 'title:vi': '',
         // 'title:id': '[Ctrl+Klik] untuk memilih beberapa',
         // 'title:es': '[Ctrl+Click] para seleccionar varias',
         'title:pt': '[Ctrl+Click] para selecionar vários',
         'title:fr': '[Ctrl+Click] pour sélectionner plusieurs',
         // 'title:it': '[Ctrl+Clic] per selezionarne diversi',
         // 'title:tr': 'Birkaç tane seçmek için [Ctrl+Tıkla]',
         'title:de': '[Ctrl+Click] um mehrere auszuwählen',
         'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
         'title:ua': '[Ctrl+Click] щоб обрати декілька',
         multiple: null, // don't use - selected: true
         required: true, // don't use - selected: true
         size: 7, // = options.length
         options: [
            {
               label: 'Ads/Sponsor', value: 'sponsor',
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
            },
            {
               label: 'Unpaid/Self Promotion', value: 'selfpromo',
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
            },
            {
               label: 'Reminder Subscribe', value: 'interaction',
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
            },
            {
               label: 'Intro', value: 'intro',
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
            },
            {
               label: 'Endcards/Credits (Outro)', value: 'outro',
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
            },
            // {
            //    label: 'Highlight', value: 'poi_highlight',
            //    // 'label:zh': '',
            //    // 'label:ja': '',
            //    // 'label:ko': '',
            //    // 'label:vi': '',
            //    // 'label:id': '',
            //    // 'label:es': '',
            //    // 'label:pt': '',
            //    // 'label:fr': '',
            //    // 'label:it': '',
            //    // 'label:tr': '',
            //    // 'label:de': '',
            //    // 'label:pl': '',
            //    // 'label:ua': '',
            // },
            {
               label: 'Preview/Recap', value: 'preview',
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
            },
            {
               label: 'Music: Non-Music Section', value: 'music_offtopic',
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
            },
            {
               label: 'Full Video Label Only', value: 'exclusive_access',
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
            },
            // {
            //    label: 'filler', value: 'filler',
            //    // 'label:zh': '',
            //    // 'label:ja': '',
            //    // 'label:ko': '',
            //    // 'label:vi': '',
            //    // 'label:id': '',
            //    // 'label:es': '',
            //    // 'label:pt': '',
            //    // 'label:fr': '',
            //    // 'label:it': '',
            //    // 'label:tr': '',
            //    // 'label:de': '',
            //    // 'label:pl': '',
            //    // 'label:ua': '',
            // },
         ],
      },
      sponsor_block_action: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         // 'label:ko': '방법',
         // 'label:vi': '',
         // 'label:id': 'Mode',
         // 'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         // title: '',
         'label:ua': 'Режим',
         options: [
            {
               label: 'skip', value: 'skip', selected: true,
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
            },
            {
               label: 'mute', value: 'mute',
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
            },
            // {
            //    label: 'full', value: 'full',
            //    // 'label:zh': '',
            //    // 'label:ja': '',
            //    // 'label:ko': '',
            //    // 'label:vi': '',
            //    // 'label:id': '',
            //    // 'label:es': '',
            //    // 'label:pt': '',
            //    // 'label:fr': '',
            //    // 'label:it': '',
            //    // 'label:tr': '',
            //    // 'label:de': '',
            //    // 'label:pl': '',
            //    // 'label:ua': '',
            // },
            // {
            //    label: 'poi', value: 'poi',
            //    // 'label:zh': '',
            //    // 'label:ja': '',
            //    // 'label:ko': '',
            //    // 'label:vi': '',
            //    // 'label:id': '',
            //    // 'label:es': '',
            //    // 'label:pt': '',
            //    // 'label:fr': '',
            //    // 'label:it': '',
            //    // 'label:tr': '',
            //    // 'label:de': '',
            //    // 'label:pl': '',
            //    // 'label:ua': '',
            // },
         ],
      },
      sponsor_block_url: {
         _tagName: 'input',
         label: 'URL',
         type: 'url',
         pattern: "https://.*",
         // title: '',
         placeholder: 'https://domain.com',
         value: 'https://sponsor.ajay.app',
         required: true,
      },
      sponsor_block_notification: {
         _tagName: 'input',
         label: 'Showing OSD notification',
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
   }
});
