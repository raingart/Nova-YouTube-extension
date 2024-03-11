// for test:
// https://www.youtube.com/watch?v=J07l-Qe9xgs - thanks button

window.nova_plugins.push({
   id: 'download-video',
   title: 'Download video',
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
   section: 'control-panel',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitSelector('#movie_player .ytp-right-controls')
         .then(container => {
            const
               // container <a>
               SELECTOR_BTN_CLASS_NAME = 'nova-video-download',
               SELECTOR_BTN = '.' + SELECTOR_BTN_CLASS_NAME,
               containerBtn = document.createElement('a'),
               // list <ul>
               SELECTOR_BTN_LIST_ID = SELECTOR_BTN_CLASS_NAME + '-list',
               SELECTOR_BTN_LIST = '#' + SELECTOR_BTN_LIST_ID,
               dropdownMenu = document.createElement('ul'),
               // btn <span>
               SELECTOR_BTN_TITLE_ID = SELECTOR_BTN_CLASS_NAME + '-title',
               dropdownSpan = document.createElement('span');

            NOVA.runOnPageLoad(() => {
               if (NOVA.currentPage == 'watch') {
                  // clear old
                  containerBtn.removeEventListener('click', generateMenu);
                  dropdownMenu.innerHTML = ''; // clear
                  // button ready
                  containerBtn.addEventListener('click', generateMenu, { capture: true, once: true });
               }
            });

            NOVA.css.push(
               SELECTOR_BTN + ` {
               overflow: visible !important;
               position: relative;
               text-align: center !important;
               vertical-align: top;
               font-weight: bold;
            }

            ${SELECTOR_BTN_LIST} {
               position: absolute;
               bottom: 2.5em !important;
               left: -2.2em;
               list-style: none;
               padding-bottom: 1.5em !important;
               z-index: ${1 + Math.max(NOVA.css.get('.ytp-progress-bar', 'z-index'), 31)};
            }

            /* for embed */
            html[data-cast-api-enabled] ${SELECTOR_BTN_LIST} {
               margin: 0;
               padding: 0;
               bottom: 3.3em;
               /* --yt-spec-brand-button-background: #c00; */
            }

            ${SELECTOR_BTN}:not(:hover) ${SELECTOR_BTN_LIST} {
               display: none;
            }

            ${SELECTOR_BTN_LIST} li {
               cursor: pointer;
               white-space: nowrap;
               line-height: 1.4;
               background-color: rgba(28, 28, 28, 0.9);
               margin: .1em 0;
               padding: .5em 2em;
               border-radius: .3em;
               color: #fff;
            }

            /* ${SELECTOR_BTN_LIST} li .menu-item-label-badge {
               position: absolute;
               right: .5em;
               font-size: .1em;
            } */

            ${SELECTOR_BTN_LIST} li:hover { background-color: #c00; }`);

            containerBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_BTN_CLASS_NAME}`;
            // btn <span>
            dropdownSpan.id = SELECTOR_BTN_TITLE_ID;
            dropdownSpan.title = 'Nova video download';
            // dropdownSpan.setAttribute('tooltip', 'Nova video download');
            // dropdownSpan.textContent = '🖫';
            dropdownSpan.innerHTML =
               `<svg viewBox="0 0 120 120" width="100%" height="100%" style="scale: .6;">
                  <g fill="currentColor">
                     <path d="M96.215 105h-72.18c-3.33 0-5.94-2.61-5.94-5.94V75.03c0-3.33 2.61-5.94 5.94-5.94 3.33 0 5.94 2.61 5.94 5.94v18h60.03v-18c0-3.33 2.61-5.94 5.94-5.94 3.33 0 5.94 2.61 5.94 5.94v24.03c.27 3.33-2.34 5.94-5.67 5.94Zm-32.4-34.47c-2.07 1.89-5.4 1.89-7.56 0l-18.72-17.19c-2.07-1.89-2.07-4.86 0-6.84 2.07-1.98 5.4-1.89 7.56 0l8.91 8.19V20.94c0-3.33 2.61-5.94 5.94-5.94 3.33 0 5.94 2.61 5.94 5.94V54.6l8.91-8.19c2.07-1.89 5.4-1.89 7.56 0 2.07 1.89 2.07 4.86 0 6.84l-18.54 17.28Z" />
                  </g>
               </svg>`;
            // `<svg viewBox="-140 -140 500 500" width="100%" height="100%" style="scale: .9;">
            //    <g fill="currentColor">
            //       <path d="M198.5,0h-17v83h-132V0h-49v231h230V32.668L198.5,0z M197.5,199h-165v-83h165V199z" />
            //       <rect width="33" x="131.5" height="66" />
            //    </g>
            // </svg>`;

            // list <ul>
            dropdownMenu.id = SELECTOR_BTN_LIST_ID;

            containerBtn.prepend(dropdownSpan);
            containerBtn.append(dropdownMenu);

            container.prepend(containerBtn);

            async function generateMenu() {
               if (menuList = document.getElementById(SELECTOR_BTN_LIST_ID)) {
                  // menuList.innerHTML = ''; // clear

                  APIs.videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
                  // icon "wait" state
                  const dropdownSpanOrig = dropdownSpan.outerHTML;
                  // containerBtn.textContent = '⏱';
                  dropdownSpan.textContent = '🕓';

                  let downloadVideoList = [];
                  switch (user_settings.download_video_mode) {
                     // default:
                     case 'cobalt':
                        downloadVideoList = APIs.Cobalt();
                        // downloadVideoList = [{ label: 'Cobalt mp4', url: await APIs.Cobalt() }];
                        break;

                     case 'loader.to':
                        downloadVideoList = APIs.loaderTo();
                        break;

                     case 'third_party_methods':
                        downloadVideoList = APIs.third_party();
                        break;

                     case 'direct':
                        downloadVideoList = await APIs.getInternalListUrls()
                        break;
                  }

                  // console.debug('downloadVideoList', downloadVideoList);

                  downloadVideoList
                     .filter(i => i?.codec)
                     .forEach((item, idx) => {
                        const menuItem = document.createElement('li');

                        if (item.quality) {
                           menuItem.textContent = `${item.codec} / ${item.quality}`;
                           // menuItem.insertAdjacentHTML('beforeend',
                           //    // `<span class="menu-item-label-badge">${++idx}</span>` + item.quality);
                           //    `<span class="menu-item-label-badge">${item.format}</span>` + item.quality);
                        }
                        else menuItem.textContent = item.codec;

                        menuItem.addEventListener('click', () => {
                           if (item.custom_fn && typeof item.custom_fn === 'function') {
                              item.custom_fn(item);
                           }
                           else if (item.link_new_tab) {
                              window.open(item.link_new_tab, '_blank');
                           }
                           else {
                              downloadFile(item.link);
                           }
                        }, { capture: true });

                        menuList.append(menuItem);
                     });

                  // downloadVideoList.forEach((item, idx) => {
                  //    const option = document.createElement('option');
                  //    option.setAttribute('value', item.link);
                  //    // option.textContent = (++idx) + '.' + item.label;
                  //    option.textContent = `${++idx}.${item.label}`;
                  //    select.append(option);
                  // });

                  // container.append(saveDownloadVideoButton);
                  // container.append(select);

                  // icon restore state
                  dropdownSpan.innerHTML = dropdownSpanOrig;
               }
            }
         });

      const APIs = {
         // videoId,

         getQualityAvailableList() {
            const qualityList = {
               highres: 4320,
               hd2880: 2880,
               hd2160: 2160,
               hd1440: 1440,
               hd1080: 1080,
               hd720: 720,
               large: 480,
               medium: 360,
               small: 240,
               tiny: 144,
               // auto, skiping
            };
            return movie_player.getAvailableQualityData().map(i => qualityList[i.quality]);
         },

         // alt1 - https://greasyfork.org/en/scripts/479944-youtube-downloader/
         // alt2 - https://greasyfork.org/en/scripts/483370-simple-youtube-downloader
         /**
          * @param  {void}
          * @return {@object array} {codec, quality, data, custom_fn}
         */
         Cobalt() {
            const qualityAvailableList = this.getQualityAvailableList();
            let vidlist = [];

            ['h264', /*'av1',*/ 'vp9']
               .forEach(codec => {
                  qualityAvailableList.forEach(quality => {
                     vidlist.push(...[
                        {
                           codec: codec.toLocaleUpperCase(),
                           quality: quality,
                           'data': { 'vCodec': codec, 'vQuality': String(quality) },
                           'custom_fn': CobaltAPI,
                        },
                        // { label: `${i} (max)`, data: { vCodec: i, codec: 'max' }, custom_fn: CobaltAPI },
                     ]);
                  });
               });
            return [
               // video
               ...vidlist,
               //  Audio
               { codec: 'mp3', data: { isAudioOnly: true, cCodec: 'mp3' }, custom_fn: CobaltAPI },
               { codec: 'ogg', data: { isAudioOnly: true, cCodec: 'ogg' }, custom_fn: CobaltAPI },
               { codec: 'wav', data: { isAudioOnly: true, cCodec: 'wav' }, custom_fn: CobaltAPI },
               { codec: 'opus', data: { isAudioOnly: true, cCodec: 'opus' }, custom_fn: CobaltAPI },
               // { label: 'best', data: { isAudioOnly: true, cCodec: 'best' }, custom_fn: CobaltAPI },
            ];

            async function CobaltAPI(item) {
               // https://github.com/wukko/cobalt/blob/current/docs/api.md
               const dlink = await fetch('https://co.wuk.sh/api/json',
                  {
                     method: 'POST', // *GET, POST, PUT, DELETE, etc.
                     // mode: 'no-cors', // no-cors, *cors, same-origin
                     headers: {
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                     },
                     body: JSON.stringify({
                        url: encodeURI('https://www.youtube.com/watch?v=' + APIs.videoId), // video url
                        // vQuality: 'max', // always max quality
                        // vCodec: h264 / av1 / vp9
                        filenamePattern: 'basic', // classic / pretty / basic / nerdy
                        // isAudioOnly: Boolean(),
                        // cCodec: best / mp3 / ogg / wav / opus
                        disableMetadata: true, // privacy
                        isNoTTWatermark: true,
                        ...item.data,
                     }),
                  })
                  .then(response => response.json())
                  // {
                  //    "status": "stream",
                  //    "url": "https://us3-co.wuk.sh/api/stream?t=XXX"
                  // }
                  .then(json => json.url)
                  .catch(error => {
                     // mute console warn
                     console.warn(`Cobalt API: failed fetching: ${error}`)
                  });

               if (!dlink) return console.debug('CobaltAPI empty dlink:', dlink);
               downloadFile(dlink);
            }
         },

         // alt - https://greasyfork.org/en/scripts/453911-youtube-download-button
         /**
          * @param  {void}
          * @return {@object array} {codec, quality, url, custom_fn}
         */
         loaderTo() {
            // const genLink = format => `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${format}&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + APIs.videoId)}`;
            const genLink = format => `https://loader.to/api/button/?url=${APIs.videoId}&f=${format}&color=0af`;

            const qualityAvailableList = this.getQualityAvailableList()?.filter(i => i > 240);
            let vidlist = [];

            ['MP4']
               .forEach(codec => {
                  qualityAvailableList.forEach(quality => {
                     vidlist.push({
                        'codec': codec.toLocaleUpperCase(),
                        'quality': quality,
                        'link': genLink(quality),
                        'custom_fn': openPopup,
                     });
                  });
               });
            return [
               // video
               ...vidlist,
               // { codec: 'MP4, quality: '360', link: genLink(360), custom_fn: openPopup },
               // { codec: 'MP4, quality: '480', link: genLink(480), custom_fn: openPopup },
               // { codec: 'MP4, quality: '720', link: genLink(720), custom_fn: openPopup },
               // { codec: 'MP4, quality: '1080', link: genLink(1080), custom_fn: openPopup },
               // { codec: MP4, quality: '1440', link: genLink(1440), custom_fn: openPopup },
               { codec: 'WEBM', quality: '4K', link: genLink('4k'), custom_fn: openPopup },
               { codec: 'WEBM', quality: '8K', link: genLink('8k'), custom_fn: openPopup },
               //  Audio
               { codec: 'MP3', link: genLink('mp3'), custom_fn: openPopup },
               { codec: 'M4A', link: genLink('m4a'), custom_fn: openPopup },
               { codec: 'WEBM', link: genLink('webm'), custom_fn: openPopup },
               { codec: 'AAC', link: genLink('aac'), custom_fn: openPopup },
               { codec: 'FLAC', link: genLink('flac'), custom_fn: openPopup },
               { codec: 'OPUS', link: genLink('opus'), custom_fn: openPopup },
               { codec: 'OGG', link: genLink('ogg'), custom_fn: openPopup },
               { codec: 'WAV', link: genLink('wav'), custom_fn: openPopup },
            ];

            function openPopup(item) {
               NOVA.openPopup({ 'url': item.url, width: 420, height: 80 });
            }

            // CORS error
            // async function openPopup (url) {
            //    console.debug('loader > callback', url);

            //    const response = await fetch(url, {
            //       // method: 'GET', // *GET, POST, PUT, DELETE, etc.
            //       // mode: 'no-cors', // no-cors, *cors, same-origin
            //       headers: {
            //          'Content-Type': 'application/json',
            //          'Accept': 'application/json',
            //       },
            //    });
            //    // document.body.style.cursor = null;

            //    console.debug('response.status', response);

            //    if (response.status === 200) {
            //       const data1 = await response.json();

            //       if (!data1.id) return console.error('data1', data1);

            //       const data = await fetch('https://p.oceansaver.in/ajax/progress.php?id=' + data1.id);

            //       if (data.success && data.download_url) {
            //          console.debug('data.download_url', data.download_url);
            //          // downloadFileOrigFn(data.download_url);
            //       }
            //       //  document.getElementById("percentageText").innerHTML = data.progress / 10 + "% done";
            //       //  document.getElementById("myBar").style.width = data.progress / 10 + "%";
            //    }
            // }
         },

         third_party() {
            return [
               // alt - https://greasyfork.org/en/scripts/422747
               {
                  quality: 'mp3,mp4',
                  codec: 'yt-download.org',
                  link_new_tab: 'https://yt-download.org/api/widgetv2?url=https://www.youtube.com/watch?v=' + APIs.videoId,
               },
               // alt1 - https://greasyfork.org/en/scripts/459232-y2mate-tools
               // alt2 - https://greasyfork.org/en/scripts/22108-bajar-mp3-youtube
               {
                  quality: 'mp3,mp4',
                  codec: 'Y2Mate.tools',
                  link_new_tab: 'https://www.y2mate.com/youtube/' + APIs.videoId,
                  // link_new_tab: 'https://www.y2mate.com/youtube-mp3/' + APIs.videoId,
               },
               // alt1 - https://greasyfork.org/en/scripts/455314-youtube-to-mp3-converter-video-downloader-tubemp3-to
               // alt2 - https://greasyfork.org/en/scripts/34613
               {
                  quality: 'mp3,mp4',
                  codec: 'TubeMP3.to',
                  link_new_tab: 'https://tubemp3.to/' + APIs.videoId,
               },
               // alt - https://greasyfork.org/en/scripts/480152-yloader-youtube-downloader-mp3-converter
               {
                  quality: 'mp3,mp4',
                  codec: 'yloader.ws',
                  link_new_tab: 'https://yloader.ws/yturlmp4/' + APIs.videoId,
                  // link_new_tab: 'https://yloader.ws/yturlmp3/' + APIs.videoId,
                  // link_new_tab: 'https://yloader.ws/ytthumbnail/' + APIs.videoId,
               },
               // alt - https://greasyfork.org/en/scripts/483289-youtube-video-downloader
               {
                  quality: 'mp3,mp4,ogg',
                  codec: 'yt5s.com', // youtube5s
                  link_new_tab: 'https://yt5s.com/watch?v=' + APIs.videoId,
               },
               // alt - https://greasyfork.org/en/scripts/469769-youtube-downloader
               {
                  quality: 'mp3,mp4,ogg',
                  codec: 'x2download.app',
                  link_new_tab: 'https://x2download.app/watch?v=' + APIs.videoId,
               },
               // alt - // https://greasyfork.org/en/scripts/475514-youtube-multi-downloader-sfrom-net-shift-d
               {
                  quality: 'mp3,mp4,ogg',
                  codec: 'savefrom.net', // youtube5s
                  link_new_tab: 'https://savefrom.net/https://www.youtube.com/watch?v=' + APIs.videoId,
                  // link_new_tab: 'https://sfrom.net/https://www.youtube.com/watch?v=' + APIs.videoId,
               },
               // alt1 - https://greasyfork.org/en/scripts/486702
               // alt2 - https://greasyfork.org/en/scripts/483950
               // alt3 - https://greasyfork.org/en/scripts/473086-youtube-downloader
               {
                  quality: 'mp3,mp4',
                  codec: 'yt1s.ltd',
                  codec: 'yt1s.com',
                  link_new_tab: 'https://yt1s.com/watch?v=' + APIs.videoId,
               },
               // alt - https://greasyfork.org/en/scripts/387200
               {
                  // quality: 'MP3,MP4,M4A,MP4,3GP,AVI,MOV,MKV',
                  quality: 'MP3,MP4,M4A,MP4,MKV',
                  codec: 'clipconverter.cc',
                  link_new_tab: 'https://www.clipconverter.cc/3/?url=https://www.youtube.com/watch?v=' + APIs.videoId,
               },
               // alt - https://greasyfork.org/en/scripts/464959-youtube-mp3-conv
               {
                  quality: 'mp3',
                  codec: 'conv2.be',
                  link_new_tab: 'https://conv2.be/watch?v=' + APIs.videoId,
                  // link_new_tab: 'https://www.rcyoutube.com/watch?v=' + APIs.videoId,
               },
               // alt1 - https://greasyfork.org/en/scripts/376246
               // alt2 - https://greasyfork.org/en/scripts/422747
               {
                  quality: 'mp3',
                  codec: 'YTMP3X.com',
                  link_new_tab: 'https://ytmp3x.com/' + APIs.videoId,
               },
            ];
         },

         // alt1 - https://greasyfork.org/en/scripts/484735-local-youtube-downloader
         // alt2 - https://greasyfork.org/en/scripts/452979-youtube-links
         // alt3 - https://greasyfork.org/en/scripts/406994
         // alt4 - https://greasyfork.org/en/scripts/483626-youtube-pro
         /**
          * @param  {void}
          * @return {@object array} {codec, quality, url}
         */
         async getInternalListUrls() {
            let decryptSigFn;
            const
               URL = NOVA.queryURL.set({ 'pbj': 1 }),
               headers = {
                  'x-youtube-client-name': 1,
                  'x-youtube-client-version': window.ytcfg.data_.INNERTUBE_CONTEXT_CLIENT_VERSION,
               };
            if (token = window.ytcfg?.data_?.ID_TOKEN) {
               headers['x-youtube-identity-token'] = token;
            };

            return await fetch(URL, { 'headers': headers })
               .then(res => res.json())
               .then(data => data?.find(i => i.playerResponse?.streamingData)?.playerResponse.streamingData)
               .then(async streamingData => {
                  console.debug('streamingData', streamingData);

                  // https://tyrrrz.me/blog/reverse-engineering-youtube
                  // console.debug(`stream:`, streamArr);
                  // [
                  //    "itag": 12
                  //    "url": "https://xx.googlevideo.com/videoplayback",
                  //    "mimeType": "video/mp4; codecs=\"avc1.64001F, mp4a.40.2\"",
                  //    "fps": 30,
                  //    "qualityLabel": "720p"
                  // ]
                  // console.debug(`adaptive:`, streamArr);
                  // [
                  //    "itag": 18
                  //    "url": "https://xx.googlevideo.com/videoplayback",
                  //    "mimeType": "video/webm; codecs=\"vp9\"",
                  //    "fps": 60,
                  //    "qualityLabel": "2160p60"
                  // ]

                  const vidListData = [...streamingData.formats, ...streamingData.adaptiveFormats];
                  decryptSigFn = vidListData.find(o => (o.cipher || o.signatureCipher)) && await getDecryptSigFn();

                  // adaptiveFormats - Adaptive (No Sound)
                  // return [...streamingData.formats]
                  return vidListData
                     .map(obj => {
                        if (dict = parseQuery(obj.cipher || obj.signatureCipher)) {
                           obj.url = `${dict.url}&${dict.sp}=${encodeURIComponent(decsig(dict.s))}`;
                        }

                        if (obj.url) {
                           let label = obj.mimeType?.match(/codecs="(.*?)"/i)[1].split('.')[0].toLocaleUpperCase();
                           if (!obj.mimeType?.includes('mp4a') && !obj.mimeType?.includes('audio')) {
                              label += ' / No Sound';
                           }

                           obj.mimeType?.includes('audio')
                              ? obj.qualityLabel = fmtBitrate(obj.bitrate)
                              : obj.qualityLabel += ' ' + fmtSize(obj.contentLength);

                           return {
                              // 'title': obj.mimeType,
                              'codec': label,
                              'quality': obj.qualityLabel,
                              'link_new_tab': obj.url,
                           };
                        }
                     })
                  // skip audio  sort
                  // .sort((a, b) => {
                  //    return a.title?.includes('audio')
                  //       ? 0
                  //       : a.codec?.localeCompare(b.codec, undefined, { numeric: true, sensitivity: 'base' })
                  // });
               })
               .catch(error => {
                  console.error('Error get vids:', error); // warn
                  throw error;
               });

            // NOVA.cookie.parseQueryToObj
            // 69.97 % slower
            // function parseQuery(str) {
            //    return str && [...new URLSearchParams(str).entries()]
            //       .reduce((acc, [k, v]) => ((acc[k] = v), acc), {});
            // }
            function parseQuery(str) {
               return str && Object.fromEntries(
                  str
                     .split(/&/)
                     .map(c => {
                        const [key, ...v] = c.split('=');
                        return [key, decodeURIComponent(v.join('='))];
                     }) || []
               );
            }
            // DecryptBySignatureCipher
            // info https://stackoverflow.com/a/76461414
            // for test: https://www.youtube.com/watch?v=tas39WI3Mi8
            async function getDecryptSigFn() {
               const
                  basejsUrl = getBasejs() || document.querySelector('script[src$="/base.js"]')?.src, // #base-js
                  basejsBlob = await fetch(basejsUrl);

               return parseDecSig(await basejsBlob.text());

               function getBasejs() {
                  if (typeof ytplayer === 'object'
                     && (endpoint = ytplayer.config?.assets?.js
                        || ytplayer.web_player_context_config?.jsUrl)
                        // NOTE: the 'yt' object is only accessible when using 'unsafeWindow'
                        // yt.config_.PLAYER_JS_URL // diff ver
                  ) {
                     return 'https://' + location.host + endpoint;
                  }
               }

               function parseDecSig(text_content) {
                  // console.debug('parseDecSig:', ...arguments);
                  const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  try {
                     if (text_content.startsWith('var script')) {
                        // inject the script via script tag
                        const obj = {};
                        eval(text_content);
                        text_content = obj.innerHTML;
                     }
                     const fnNameResult = /=([a-zA-Z0-9\$_]+?)\(decodeURIComponent/.exec(text_content);
                     const fnName = fnNameResult[1];
                     const _argNameFnBodyResult = new RegExp(escapeRegExp(fnName) + '=function\\((.+?)\\){((.+)=\\2.+?)}')
                        .exec(text_content);
                     const [_, argname, fnBody] = _argNameFnBodyResult;
                     const helperNameResult = /;([a-zA-Z0-9$_]+?)\..+?\(/.exec(fnBody);
                     const helperName = helperNameResult[1];
                     const helperResult = new RegExp('var ' + escapeRegExp(helperName) + '={[\\s\\S]+?};').exec(text_content);
                     const helper = helperResult[0];
                     // console.info(`parseDecSig result: (%s)=>{%s\n%s}`, argname, helper, fnBody);
                     return new Function([argname], helper + '\n' + fnBody);
                  } catch (error) {
                     console.error('parseDecSig', error);
                  }
               }
            }
            function decsig(_sig) {
               const sig = eval("(" + decryptSigFn + ") (\"" + _sig + "\")");
               // console.debug('sig:', sig);
               return sig;
            }
         },

      };

      function downloadFile(url = required()) {
         // console.debug('downloadFile:', ...arguments);
         const d = document.createElement('a');
         d.style.display = 'none';
         d.download = (movie_player.getVideoData().title
            .replace(/[\\/:*?"<>|]+/g, '')
            .replace(/\s+/g, ' ').trim()) + '.mp4';
         d.href = url;
         document.body.append(d);
         d.click();
         d.remove();
      }

      function fmtBitrate(size) {
         return fmtSize(size, ['kbps', 'Mbps', 'Gbps']);
      }

      function fmtSize(size, units = ['kB', 'MB', 'GB'], divisor = 1000) {
         for (let i = 0; i < units.length; ++i) {
            size /= divisor;
            if (size < 10) return Math.round(size * 100) / 100 + units[i];
            if (size < 100) return Math.round(size * 10) / 10 + units[i];
            if (size < 1000 || i == units.length - 1) return Math.round(size) + units[i];
         }
      }

   },
   options: {
      download_video_mode: {
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
         'label:ua': 'Режим',
         // title: '',
         options: [
            // https://savetube.io/
            {
               label: 'Cobalt', value: 'cobalt', selected: true,
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
               label: 'loader.to', value: 'loader.to',
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
               label: 'multi 3rd party', value: 'third_party_methods',
               // label: 'links to external', value: 'third_party',
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
               label: 'direct', value: 'direct',
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
         ],
      },
   }
});
