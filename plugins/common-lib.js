const NOVA = {
   // DEBUG: true,

   // find once.
   // more optimized compared to MutationObserver
   // waitElement(selector = required()) {
   //    this.log('waitElement:', selector);
   //    if (typeof selector !== 'string') return console.error('wait > selector:', typeof selector);

   //    return new Promise((resolve, reject) => {
   //       // try {
   //       let nodeInterval
   //       const checkIfExists = () => {
   //          if (el = document.body.querySelector(selector)) {
   //             if (typeof nodeInterval === 'number') clearInterval(nodeInterval);
   //             resolve(el);

   //          } else return;
   //       }
   //       checkIfExists();
   //       nodeInterval = setInterval(checkIfExists, 50); // ms
   //       // } catch (err) { // does not output the reason/line to the stack
   //       //    reject(new Error('Error waitElement', err));
   //       // }
   //    });
   // },

   // untilDOM
   waitElement(selector = required(), container) {
      if (typeof selector !== 'string') return console.error('wait > selector:', typeof selector);
      if (container && !(container instanceof HTMLElement)) return console.error('wait > container not HTMLElement:', container);
      // console.debug('waitElement:', selector);

      // https://stackoverflow.com/a/68262400
      // best https://codepad.co/snippet/wait-for-an-element-to-exist-via-mutation-observer
      // alt:
      // https://git.io/waitForKeyElements.js
      // https://github.com/fuzetsu/userscripts/tree/master/wait-for-elements
      // https://github.com/CoeJoder/waitForKeyElements.js/blob/master/waitForKeyElements.js
      // https://gist.githubusercontent.com/sidneys/ee7a6b80315148ad1fb6847e72a22313/raw/

      // There is a more correct method - transitionend.
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/transitionend_event
      // But this requires a change in the logic of the current implementation. It will also complicate the restoration of the expansion if in the future, if YouTube replaces logic.

      return new Promise(resolve => {
         if (element = (container || document?.body || document).querySelector(selector)) {
            // console.debug('[1]', selector);
            return resolve(element);
         }

         new MutationObserver((mutations, observer) => {
            for (let mutation of mutations) {
               for (const node of mutation.addedNodes) {
                  if (![1, 3, 8].includes(node.nodeType)) continue; // speedup hack

                  if (node.matches && node.matches(selector)) { // this node
                     // console.debug('[2]', mutation.type, node.nodeType, selector);
                     observer.disconnect();
                     return resolve(node);

                  } else if ( // inside node
                     (parentEl = node.parentElement || node)
                     && (parentEl instanceof HTMLElement)
                     && (element = parentEl.querySelector(selector))
                  ) {
                     // console.debug('[3]', mutation.type, node.nodeType, selector);
                     observer.disconnect();
                     return resolve(element);
                  }
               }
            }
            // after loop
            if (document?.readyState != 'loading' // fix slowdown page
               && (element = (container || document?.body || document).querySelector(selector))
            ) { // in global
               // console.debug('[4]', selector);
               observer.disconnect();
               return resolve(element);
            }
         })
            .observe(container || document?.body || document.documentElement, {
               childList: true, // observe direct children
               subtree: true, // and lower descendants too
            });
      });
   },

   /** wait for every DOM change until a condition becomes true */
   // await NOVA.waitUntil(?, 500) // 500ms
   async waitUntil(condition = required(), timeout = 100) {
      if (typeof condition !== 'function') return console.error('waitUntil > condition is not fn:', typeof condition);

      return new Promise((resolve) => {
         if (result = condition()) {
            // console.debug('waitUntil[1]', result, condition, timeout);
            resolve(result);

         } else {
            const interval = setInterval(() => {
               if (result = condition()) {
                  // console.debug('waitUntil[2]', result, condition, timeout);
                  clearInterval(interval);
                  resolve(result);
               }
               // console.debug('waitUntil[3]', result, condition, timeout);
            }, timeout);
         }
      });
   },

   watchElements_list: {}, // can to stop watch setInterval
   // complete doesn't work
   // clear_watchElements(name = required()) {
   //    return this.watchElements_list.hasOwnProperty(name)
   //       && clearInterval(this.watchElements_list[name])
   //       && delete this.watchElements_list[name];
   // },

   watchElements({ selectors = required(), attr_mark, callback = required() }) {
      // console.debug('watch', selector);
      if (!Array.isArray(selectors) && typeof selectors !== 'string') return console.error('watch > selector:', typeof selectors);
      if (typeof callback !== 'function') return console.error('watch > callback:', typeof callback);

      // async wait el. Removes the delay for init
      this.waitElement(typeof selectors === 'string' ? selectors : selectors.join(','))
         .then(video => {
            // selectors - str to array
            !Array.isArray(selectors) && (selectors = selectors.split(',').map(s => s.trim()));

            process(); // launch without waiting
            // if (attr_mark) {
            this.watchElements_list[attr_mark] = setInterval(() =>
               document.visibilityState == 'visible' && process(), 1000 * 1.5); // 1.5 sec
            // }

            function process() {
               // console.debug('watch.process', { selector, callback });
               selectors
                  .forEach(selectorItem => {
                     if (attr_mark) selectorItem += `:not([${attr_mark}])`;
                     // if ((slEnd = ':not([hidden])') && !selectorItem.endsWith(slEnd)) {
                     //    selectorItem += slEnd;
                     // }
                     // console.debug('selectorItem', selectorItem);

                     document.body.querySelectorAll(selectorItem)
                        .forEach(el => {
                           // if (el.offsetWidth > 0 || el.offsetHeight > 0) { // el.is(":visible")
                           // console.debug('watch.process.viewed', selectorItem);
                           if (attr_mark) el.setAttribute(attr_mark, true);
                           callback(el);
                           // }
                        });
                  });
            }
         });

   },

   css: {
      push(css = required(), selector, important) {
         // console.debug('css\n', ...arguments);
         if (typeof css === 'object') {
            if (!selector) return console.error('injectStyle > empty json-selector:', ...arguments);

            // if (important) {
            injectCss(selector + json2css(css));
            // } else {
            //    Object.assign(document.body.querySelector(selector).style, css);
            // }

            function json2css(obj) {
               let css = '';
               Object.entries(obj)
                  .forEach(([key, value]) => {
                     css += key + ':' + value + (important ? ' !important' : '') + ';';
                  });
               return `{ ${css} }`;
            }

         } else if (css && typeof css === 'string') {
            if (document.head) {
               injectCss(css);

            } else {
               window.addEventListener('load', () => injectCss(css), { capture: true, once: true });
            }

         } else {
            console.error('addStyle > css:', typeof css);
         }

         function injectCss(source = required()) {
            let sheet;

            if (source.endsWith('.css')) {
               sheet = document.createElement('link');
               sheet.rel = 'sheet';
               sheet.href = source;

            } else {
               const sheetId = 'NOVA-style';
               sheet = document.getElementById(sheetId) || (function () {
                  const style = document.createElement('style');
                  style.type = 'text/css';
                  style.id = sheetId;
                  return document.head.appendChild(style);
               })();
            }

            sheet.textContent += '/**/\n' + source
               .replace(/\n+\s{2,}/g, ' ') // singleline format
               // multiline format
               // .replace(/\n+\s{2,}/g, '\n\t')
               // .replace(/\t\}/mg, '}')
               + '\n';
            // sheet.insertRule(css, sheet.cssRules.length);
            // (document.head || document.documentElement).append(sheet);
            // document.adoptedStyleSheets.push(newSheet); // v99+

            // sheet.onload = () => NOVA.log('style loaded:', sheet.src || sheet || sheet.textContent.substr(0, 100));
         }
      },

      // https://developer.mozilla.org/ru/docs/Web/API/CSSStyleDeclaration
      // HTMLElement.prototype.getIntValue = () {}
      // const { position, right, bottom, zIndex, boxShadow } = window.getComputedStyle(container); // multiple
      getValue(selector = required(), prop_name = required()) {
         return (el = document.body.querySelector(selector))
            ? getComputedStyle(el).getPropertyValue(prop_name) : null; // for some callback functions (Match.max) udefuned return is not valid
      },
   },

   // cookie: {
   //    get(name = required()) {
   //       return Object.fromEntries(
   //          document.cookie
   //             .split(/; */)
   //             .map(c => {
   //                const [key, ...v] = c.split('=');
   //                return [key, decodeURIComponent(v.join('='))];
   //             })
   //       )[name];
   //    },

   //    set(name = required(), value, days = 90) { // 90 days
   //       if (this.get(name) == value) return;

   //       let date = new Date();
   //       date.setTime(date.getTime() + 3600000 * 24 * days); // m*h*d

   //       document.cookie = Object.entries({
   //          [encodeURIComponent(name)]: value,
   //          // domain: '.' + location.hostname.split('.').slice(-2).join('.'), // .youtube.com
   //          domain: location.hostname,
   //          expires: date.toUTCString(),
   //          path: '/',
   //       })
   //          .map(([key, value]) => `${key}=${value}`).join('; '); // if no "value" = undefined

   //       console.assert(this.get(name) == value, 'cookie set err:', ...arguments, document.cookie);
   //    },

   //    getParamLikeObj(name = required()) {
   //       return Object.fromEntries(
   //          this.get(name)
   //             ?.split(/&/)
   //             .map(c => {
   //                const [key, ...v] = c.split('=');
   //                return [key, decodeURIComponent(v.join('='))];
   //             }) || []
   //       );
   //    },

   //    updateParam({ key = required(), param = required(), value = required() }) {
   //       let paramsObj = this.getParamLikeObj(key) || {};

   //       if (paramsObj[param] != value) {
   //          paramsObj[param] = value;
   //          this.set(key, NOVA.queryURL.set(paramsObj).split('?').pop());
   //          location.reload();
   //       }
   //    },
   // },

   /* NOVA.collapseElement({
         selector: '#secondary #related',
         title: 'related',// auto uppercase
         remove: true,
         remove: user_settings.NAME_visibility_mode == 'remove' ? true : false,
   }); */
   collapseElement({ selector = required(), title = required(), remove }) {
      // console.debug('collapseElement', ...arguments);
      const selector_id = `${title.match(/[a-z]+/gi).join('')}-prevent-load-btn`;

      this.waitElement(selector.toString())
         .then(el => {
            if (remove) el.remove();
            else {
               if (document.getElementById(selector_id)) return;
               // el.style.visibility = 'hidden'; // left scroll space
               el.style.display = 'none';
               // create button
               const btn = document.createElement('a');
               btn.textContent = `Load ${title}`;
               btn.id = selector_id;
               btn.className = 'more-button style-scope ytd-video-secondary-info-renderer';
               // btn.className = 'ytd-vertical-list-renderer';
               Object.assign(btn.style, {
                  cursor: 'pointer',
                  'text-align': 'center',
                  'text-transform': 'uppercase',
                  display: 'block',
                  color: 'var(--yt-spec-text-secondary)',
               });
               btn.addEventListener('click', () => {
                  btn.remove();
                  // el.style.visibility = 'visible'; // left scroll space
                  el.style.display = 'unset';
                  window.dispatchEvent(new Event('scroll')); // need to "comments-visibility" (https://stackoverflow.com/a/68202306)
               });
               el.before(btn);
            }
         });
   },

   calculateAspectRatioFit({
      srcWidth = 0, srcHeight = 0,
      maxWidth = window.innerWidth,
      maxHeight = window.innerHeight
   }) {
      // console.debug('aspectRatioFit:', ...arguments);
      const aspectRatio = Math.min(+maxWidth / +srcWidth, +maxHeight / +srcHeight);
      return {
         width: +srcWidth * aspectRatio,
         height: +srcHeight * aspectRatio,
      };
   },

   bezelTrigger(text) {
      // console.debug('bezelTrigger', ...arguments);
      if (!text) return;
      if (typeof this.fateBezel === 'number') clearTimeout(this.fateBezel); // reset hide
      const bezelEl = document.body.querySelector('.ytp-bezel-text');
      if (!bezelEl) return console.warn(`bezelTrigger ${text}=>${bezelEl}`);

      const
         bezelConteiner = bezelEl.parentElement.parentElement,
         CLASS_VALUE_TOGGLE = 'ytp-text-root';

      if (!this.bezel_css_inited) {
         this.bezel_css_inited = true;
         this.css.push(
            `.${CLASS_VALUE_TOGGLE} { display: block !important; }
            .${CLASS_VALUE_TOGGLE} .ytp-bezel-text-wrapper {
               pointer-events: none;
               z-index: 40 !important;
            }
            .${CLASS_VALUE_TOGGLE} .ytp-bezel-text { display: inline-block !important; }
            .${CLASS_VALUE_TOGGLE} .ytp-bezel { display: none !important; }`);
      }

      bezelEl.textContent = text;
      bezelConteiner.classList.add(CLASS_VALUE_TOGGLE);

      this.fateBezel = setTimeout(() => {
         bezelConteiner.classList.remove(CLASS_VALUE_TOGGLE);
         bezelEl.textContent = ''; // fix not showing bug when frequent calls
      }, 600); // 600ms
   },

   getChapterList(video_duration = required()) {
      let timestampsCollect = [];
      let prevSec = -1;

      // description and first(pinned) comment
      document.body.querySelectorAll('#primary-inner #description, #comments ytd-comment-thread-renderer:first-child #content')
         .forEach(el => {
            (el.textContent || window.ytplayer?.config?.args.raw_player_response.videoDetails.shortDescription)
               // || document.body.querySelector('ytd-player')?.player_.getCurrentVideoConfig()?.args.raw_player_response.videoDetails.shortDescription
               ?.split('\n')
               .forEach(line => {
                  if (line.length > 5 && line.length < 200 && (timestamp = /((\d?\d:){1,2}\d{2})/g.exec(line))) {
                     timestamp = timestamp[0];
                     const sec = this.timeFormatTo.hmsToSec(timestamp);
                     if (sec > prevSec && sec < +video_duration) {
                        // const prev = arr[i-1] || -1; // needs to be called "hmsToSecondsOnly" again. What's not optimized
                        prevSec = sec;
                        timestampsCollect.push({
                           'sec': sec,
                           'time': timestamp,
                           'title': line
                              .replace(timestamp, '')
                              .trim().replace(/^[:\-–—|]|(\[\])?|[:\-–—.;|]$/g, '') // clear of quotes and list characters
                              //.trim().replace(/^([:\-–—|]|(\d+[\.)]))|(\[\])?|[:\-–—.;|]$/g, '') // clear numeric list prefix
                              // ^[\"(]|[\")]$ && .trim().replace(/^[\"(].*[\")]$/g, '') // quote stripping example - "text"
                              .trim()
                        });
                     }
                  }
               });
         });

      if (timestampsCollect.length) {
         // console.debug('timestampsCollect', timestampsCollect);
         return timestampsCollect;
      }
   },

   // there are problems with the video https://www.youtube.com/watch?v=SgQ_Jk49FRQ. Too lazy to continue testing because it is unclear which method is more optimal.
   // getChapterList(video_duration = required()) {
   //    const selectorLinkTimestamp = 'a[href*="&t="]';
   //    let timestampList = [];
   //    let prevSec = -1;

   //    document.body.querySelectorAll(`#primary-inner #description ${selectorLinkTimestamp}, #contents ytd-comment-thread-renderer:first-child #content ${selectorLinkTimestamp}`)
   //       .forEach((link, i, arr) => {
   //          // const prev = arr[i-1] || -1; // needs to be called "hmsToSecondsOnly" again. What's not optimized
   //          const sec = parseInt(this.queryURL.get('t', link.href));
   //          if (sec > prevSec && sec < +video_duration) {
   //             prevSec = sec;
   //             // will be skip - time: '0:00'
   //             timestampList.push({
   //                // num: ++i,
   //                sec: sec,
   //                time: link.textContent,
   //                title: link.parentElement.textContent
   //                   .split('\n')
   //                   .find(line => line.includes(link.textContent))
   //                   .replaceAll(link.textContent, '')
   //                   .trim()
   //                   .replace(/(^[:\-–—]|[:\-–—.;]$)/g, '')
   //                   .trim()
   //             });
   //          }
   //       });
   //    console.debug('timestampList', timestampList);

   //    if (timestampList?.length > 1) { // clear from "lying timestamp"
   //       return timestampList.filter(i => i.title.length < 80);
   //    }
   // },

   // findTimestamps(text) {
   //    const result = []
   //    const timestampPattern = /((\d?\d:){1,2}\d{2})/g
   //    let match
   //    while ((match = timestampPattern.exec(text))) {
   //       result.push({
   //          from: match.index,
   //          to: timestampPattern.lastIndex
   //       })
   //    }
   //    return result
   // },

   // dateFormatter
   timeFormatTo: {
      hmsToSec(str) { // format out "h:mm:ss" > "sec"
         // str = ':00:00am'; // for test
         if ((arr = str?.split(':')) && arr.length) {
            return arr.reduce((acc, time) => (60 * acc) + +time);
         }
      },

      HMS: {
         // 65.77 % slower
         // digit(ts = required()) { // format out "h:mm:ss"
         //    const
         //       ts = Math.abs(+ts),
         //       days = Math.floor(ts / 86400);

         //    let t = new Date(ts).toISOString();
         //    if (ts < 3600000) t = t.substr(14, 5); // add hours
         //    else t = t.substr(11, 8); // only minutes

         //    return (days ? `${days}d ` : '') + t;
         // },
         digit(time_sec = required()) { // format out "h:mm:ss"
            const
               ts = Math.abs(+time_sec),
               d = ~~(ts / 86400),
               h = ~~((ts % 86400) / 3600),
               m = ~~((ts % 3600) / 60),
               // min = ~~(Math.log(sec) / Math.log(60)), // after sec
               s = Math.floor(ts % 60);

            return (d ? `${d}d ` : '')
               + (h ? (d ? h.toString().padStart(2, '0') : h) + ':' : '')
               + (h ? m.toString().padStart(2, '0') : m) + ':'
               + s.toString().padStart(2, '0');

            // 84% slower
            // return (days && !isNaN(days) ? `${days}d ` : '')
            //    + [hours, minutes, seconds]
            //       .filter(i => +i && !isNaN(i))
            //       .map((item, idx) => idx ? item.toString().padStart(2, '0') : item) // "1:2:3" => "1:02:03"
            //       .join(':'); // format "h:m:s"
         },

         abbr(time_sec = required()) { // format out "999h00m00s"
            const
               ts = Math.abs(+time_sec),
               d = ~~(ts / 86400),
               h = ~~((ts % 86400) / 3600),
               m = ~~((ts % 3600) / 60),
               // min = ~~(Math.log(sec) / Math.log(60)), // after sec
               s = Math.floor(ts % 60);

            return (d ? `${d}d ` : '')
               + (h ? (d ? h.toString().padStart(2, '0') : h) + 'h' : '')
               + (m ? (h ? m.toString().padStart(2, '0') : m) + 'm' : '')
               + (s ? (m ? s.toString().padStart(2, '0') : s) + 's' : '');
            // 78.48% slower
            // return (days ? `${days}d ` : '')
            //    + [seconds, minutes, hours]
            //       .filter(i => +i && !isNaN(i))
            //       .map((item, idx, arr) => (arr.length - 1 !== idx ? item.toString().padStart(2, '0') : item) + ['s', 'm', 'h'][idx])
            //       .reverse()
            //       .join(''); // format "999h00m00s"
         },
      },
   },

   queryURL: {
      // const videoId = new URLSearchParams(window.location.search).get('v');
      // get: (query, url) => new URLSearchParams((url ? new URL(url) : location.href || document.URL).search).get(query),
      // has: (query = required(), url_string) => new URLSearchParams((url_string ? new URL(url_string) : location.href)).has(query), // Doesn't work

      has: (query = required(), url_string) => new URL(url_string || location).searchParams.has(query.toString()),

      get: (query = required(), url_string) => new URL(url_string || location).searchParams.get(query.toString()),

      set(query_obj = {}, url_string) {
         // console.log('queryURL.set:', ...arguments);
         if (!Object.keys(query_obj).length) return console.error('query_obj:', query_obj)
         const url = new URL(url_string || location);
         Object.entries(query_obj).forEach(([key, value]) => url.searchParams.set(key, value));
         return url.toString();
      },

      remove(query = required(), url_string) {
         const url = new URL(url_string || location);
         url.searchParams.delete(query.toString());
         return url.toString();
      },
   },

   request: {

      API_STORE_NAME: 'YOUTUBE_API_KEYS',

      async API({ request, params, api_key }) {
         // NOVA.log('request.API:', ...arguments); // err
         // console.debug('API:', ...arguments);
         // get API key
         const YOUTUBE_API_KEYS = localStorage.hasOwnProperty(this.API_STORE_NAME) ? JSON.parse(localStorage.getItem(this.API_STORE_NAME)) : await this.keys();

         if (!api_key && (!Array.isArray(YOUTUBE_API_KEYS) || !YOUTUBE_API_KEYS?.length)) {
            localStorage.hasOwnProperty(this.API_STORE_NAME) && localStorage.removeItem(this.API_STORE_NAME);
            // alert('I cannot access the API key.'
            //    + '\nThe plugins that depend on it have been terminated.'
            //    + "\n - Check your network's access to Github"
            //    + '\n - Generate a new private key'
            //    + '\n - Deactivate plugins that need it'
            // );
            // throw new Error('YOUTUBE_API_KEYS is empty:', YOUTUBE_API_KEYS);
            return console.error('YOUTUBE_API_KEYS empty:', YOUTUBE_API_KEYS);
         }

         const referRandKey = arr => api_key || 'AIzaSy' + arr[Math.floor(Math.random() * arr.length)];
         // combine GET
         const query = (request == 'videos' ? 'videos' : 'channels') + '?'
            + Object.keys(params)
               .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
               .join('&');

         const URL = `https://www.googleapis.com/youtube/v3/${query}&key=` + referRandKey(YOUTUBE_API_KEYS);
         // console.debug('URL', URL);
         // request
         return await fetch(URL)
            .then(response => response.json())
            .then(json => {
               if (!json?.error && Object.keys(json).length) return json;
               console.warn('used key:', NOVA.queryURL.get('key', URL));
               throw new Error(JSON.stringify(json?.error));
            })
            .catch(error => {
               localStorage.removeItem(this.API_STORE_NAME);
               console.error(`Request API failed:${URL}\n${error}`);
               // alert('Problems with the YouTube API:'
               //    + '\n' + error?.message
               //    + '\n\nIf this error is repeated:'
               //    + '\n - Disconnect the plugins that need it'
               //    + '\n - Update your YouTube API KEY');
            });
      },

      async keys() {
         NOVA.log('request.API: fetch to youtube_api_keys.json');
         // see https://gist.github.com/raingart/ff6711fafbc46e5646d4d251a79d1118/
         return await fetch('https://gist.githubusercontent.com/raingart/ff6711fafbc46e5646d4d251a79d1118/raw/youtube_api_keys.json')
            .then(res => res.text())
            .then(keys => { // save
               NOVA.log(`get and save keys in localStorage`, keys);
               localStorage.setItem(this.API_STORE_NAME, keys);
               return JSON.parse(keys);
            })
            .catch(error => { // clear
               localStorage.removeItem(this.API_STORE_NAME);
               throw error;
               // throw new Error(error);
            })
            .catch(reason => console.error('Error get keys:', reason)); // warn
      },
   },

   getPlayerState(state) {
      // movie_player.getPlayerState() === 2 // 2: PAUSED
      // NOVA.getPlayerState() == 'PLAYING'
      // movie_player.addEventListener('onStateChange', state => 'PLAYING' == NOVA.getPlayerState(state));
      return {
         '-1': 'UNSTARTED',
         0: 'ENDED',
         1: 'PLAYING',
         2: 'PAUSED',
         3: 'BUFFERING',
         5: 'CUED'
      }[state || movie_player.getPlayerState()];
   },

   // captureActiveVideoElement
   videoElement: (() => {
      // init
      document.addEventListener('canplay', ({ target }) => {
         target.matches('#movie_player video') && (NOVA.videoElement = target);
      }, { capture: true, once: true });
      // update
      document.addEventListener('play', ({ target }) => NOVA.videoElement = target, true);
   })(),

   async getChannelId(api_key) {
      const isChannelId = id => id && /UC([a-z0-9-_]{22})$/i.test(id);
      // local search
      let result = [
         document.querySelector('meta[itemprop="channelId"][content]')?.content,
         // channel page
         (document.body.querySelector('ytd-app')?.__data?.data.response
            || document.body.querySelector('ytd-app')?.data?.response
            || window.ytInitialData
         )
            ?.metadata?.channelMetadataRenderer?.externalId,
         document.querySelector('link[itemprop="url"][href]')?.href.split('/')[4],
         location.pathname.split('/')[2],
         // playlist page
         document.body.querySelector('#video-owner a[href]')?.href.split('/')[4],
         document.body.querySelector('a.ytp-ce-channel-title[href]')?.href.split('/')[4],
         // watch page
         // document.querySelector('#owner #channel-name a[href]')?.href.split('/')[4],
         // ALL BELOW - not updated after page transition!
         // || window.ytplayer?.config?.args.ucid
         // || window.ytplayer?.config?.args.raw_player_response.videoDetails.channelId
         // || document.body.querySelector('ytd-player')?.player_.getCurrentVideoConfig()?.args.raw_player_response.videoDetails.channelId
      ]
         .find(i => isChannelId(i))
      // console.debug('channelId (local):', result);

      if (!result) { // request
         let channelName;
         switch (this.currentPage) {
            case 'channel':
               channelLink = location.pathname.split('/');
               if (['c', 'user'].includes(channelLink[1])) {
                  channelName = channelLink[2];
               }
               break;
            case 'watch':
               channelLink = await this.waitElement('#owner #channel-name a[href]');
               channelArr = channelLink?.href.split('/');
               if (channelArr.length && ['c', 'user'].includes(channelArr[3])) {
                  channelName = channelArr[4];
               }
               break;
         }
         // console.debug('channelName:', channelName);
         if (!channelName) return
         // https://www.googleapis.com/youtube/v3/channels?key={YOUR_API_KEY}&forUsername={USER_NAME}&part=id
         const res = await this.request.API({
            request: 'channels',
            params: { 'forUsername': channelName, 'part': 'id' },
            api_key: api_key,
         });
         // console.debug('res', res);
         if (res?.items?.length && isChannelId(res.items[0]?.id)) result = res.items[0].id;
         // console.debug('channelId (request):', result);
      }
      return result;
   },

   log() {
      if (this.DEBUG && arguments.length) {
         console.groupCollapsed(...arguments);
         console.trace();
         console.groupEnd();
      }
   }
}
