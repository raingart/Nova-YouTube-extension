window.nova_plugins.push({
   id: 'sponsor-block',
   title: 'SponsorBlock',
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
   run_on_pages: 'watch, embed',
   // restart_on_location_change: true,
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // there is a small conflict with the [player-resume-playback] plugin. It has higher priority

      // alt1 - https://github.com/afreakk/greasemonkeyscripts/blob/master/youtube_sponsorblock.js
      // alt2 - https://codeberg.org/mthsk/userscripts/src/branch/master/simple-sponsor-skipper
      // alt3 - https://github.com/mchangrh/sb.js/blob/main/docs/sb.user.js

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            let segmentsList = [];
            let muteState;

            // reset chapterList
            // video.addEventListener('loadeddata', async () => segmentsList = await getSkipSegments(videoId) || []);
            video.addEventListener('loadeddata', init.bind(video));

            async function init() {
               const videoId = movie_player.getVideoData().video_id || NOVA.queryURL.get('v');

               segmentsList = await getSkipSegments(videoId) || [];

               if (user_settings['player-float-progress-bar'] && segmentsList.length) {
                  const SELECTOR = 'nova-player-float-progress-bar-chapters';
                  let el;
                  await NOVA.waitUntil(() =>
                     (el = document.body.querySelectorAll(`#${SELECTOR} > span[time]`)) && el.length
                     , 1000);
                  el.forEach(chapterEl => {
                     const sec = NOVA.timeFormatTo.hmsToSec(chapterEl.getAttribute('time'));
                     for (const [i, value] of segmentsList.entries()) {
                        const [start, end, category] = value;
                        if (sec >= (~~start - 5) && sec <= (Math.ceil(end) + 5)) { // +5sec observational error
                           chapterEl.style.title = category;
                           let color;
                           switch (category) {
                              case 'sponsor': color = 'rgb(255,231,0,.3)'; break;
                              case 'interaction': color = 'rgb(255,127,80,.3)'; break;
                              case 'selfpromo': color = 'rgb(255,99,71,.3)'; break;
                              case 'intro': color = 'rgb(255,165,0,.3)'; break;
                              case 'outro': color = 'rgb(255,165,0,.3)'; break;
                           }
                           chapterEl.style.background = color;
                        }
                     }
                  });
               }
            }

            video.addEventListener('timeupdate', function () {
               // if (!isNaN(video.duration))

               let start, end, category;

               // for (const [i, value] of segmentsList.entries()) {
               //    console.debug('>>', value, i);
               //    const [start, end] = value;
               for (let i = 0; i < segmentsList.length; i++) {
                  // console.debug('>>', segmentsList, i);
                  [start, end, category] = segmentsList[i];
                  start = ~~start;
                  end = Math.ceil(end);

                  const inSegment = (this.currentTime > start && this.currentTime < end);

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
                           this.currentTime = end;
                           segmentsList.splice(i, 1); // for optimization use segment once

                           return novaNotification('skipped');
                        }
                        break;
                  }
               }

               function novaNotification(prefix = '') {
                  const msg = `${prefix} [${category}] • ${NOVA.timeFormatTo.HMS.digit(start)} - ${NOVA.timeFormatTo.HMS.digit(end)}`;
                  console.info(msg);
                  NOVA.bezelTrigger(msg); // trigger default indicator
               }

            });
         });


      async function getSkipSegments(videoId = required()) {
         const CACHE_PREFIX = 'nova-videos-sponsor-block:';

         if (storage = sessionStorage.getItem(CACHE_PREFIX + videoId)) {
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
                  headers: { 'Content-Type': 'application/json' } // 'Content-Type': 'application/x-www-form-urlencoded',
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
                  // console.warn(`Sponsorblock: failed fetching skipSegments for ${ videoId }, reason: ${ error } `)
               });

            if (result = await fetchAPI()) {
               // console.debug('result sponsor', result
               //    // , (user_settings.sponsor_block_url || 'https://sponsor.ajay.app') + `/api/skipSegments?${query}`
               // );
               sessionStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify(result));
               return result;
            }
         }
      }

   },
   options: {
      sponsor_block_category: {
         _tagName: 'select',
         label: 'Category',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
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
         'title:ko': '[Ctrl+Click] 여러 선택',
         'title:id': '[Ctrl+Klik] untuk memilih beberapa',
         'title:es': '[Ctrl+Click] para seleccionar varias',
         'title:pt': '[Ctrl+Click] para selecionar vários',
         'title:fr': '[Ctrl+Click] pour sélectionner plusieurs',
         'title:it': '[Ctrl+Clic] per selezionarne diversi',
         // 'title:tr': 'Birkaç tane seçmek için [Ctrl+Tıkla]',
         'title:de': '[Ctrl+Click] um mehrere auszuwählen',
         'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
         'title:ua': '[Ctrl+Click] щоб обрати декілька',
         multiple: null, // don't use - selected: true
         required: true, // don't use - selected: true
         size: 7, // = options.length
         options: [
            {
               label: 'Sponsor', value: 'sponsor',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
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
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Modalità',
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
         placeholder: 'https://youtube.com/...',
         value: 'https://sponsor.ajay.app',
         required: true,
      },
   }
});
