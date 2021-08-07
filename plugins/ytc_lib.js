const NOVA = {
   // DEBUG: true,

   // find once.
   // more optimized compared to MutationObserver
   waitElement(selector = required()) {
      if (typeof selector !== 'string') return console.error('wait > selector:', typeof selector);

      return new Promise((resolve, reject) => {
         // try {
         let nodeInterval
         const checkIfExists = () => {
            if (el = document.querySelector(selector)) {
               if (typeof nodeInterval === 'number') clearInterval(nodeInterval);
               resolve(el);

            } else return;
         }
         checkIfExists();
         nodeInterval = setInterval(checkIfExists, 50); // ms
         // } catch (err) { // does not output the reason/line to the stack
         //    reject(new Error('Error waitElement', err));
         // }
      })
   },

   // waitForElement(selector = required()) {
   //    // alternative https://git.io/waitForKeyElements.js
   //    // alternative https://github.com/fuzetsu/userscripts/tree/master/wait-for-elements
   //    // alternative https://github.com/CoeJoder/waitForKeyElements.js/blob/master/waitForKeyElements.js

   //    // There is a more correct method - transitionend.
   //    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/transitionend_event
   //    // But this requires a change in the logic of the current implementation. It will also complicate the restoration of the expansion if in the future, if YouTube replaces logic.
   //    NOVA.log('wait', ...arguments);

   //    if (!('MutationObserver' in window)) throw new Error('MutationObserver not available!');

   //    return new Promise(resolve => {
   //       if (el = (selector instanceof HTMLElement) ? selector : document.querySelector(selector)) {
   //          // NOVA.log('waited(1)', selector, el);
   //          return resolve(el);
   //       }
   //       if (typeof selector !== 'string') return console.error('wait > selector:', typeof selector);

   //       new MutationObserver((mutations, observer) => {
   //          mutations.forEach(mutation => {
   //             [...mutation.addedNodes]
   //                .filter(node => node.nodeType === 1)
   //                .forEach(node => {
   //                   (node?.parentElement || document).querySelectorAll(selector)
   //                      .forEach(element => {
   //                         // NOVA.log('waited', mutation.type, selector);
   //                         observer.disconnect();
   //                         return resolve(element);
   //                      });
   //                });
   //          });
   //       })
   //          .observe(document.body || document.documentElement, { childList: true, subtree: true });
   //    });
   // },

   watchElement({ selector = required(), attr_mark, callback = required() }) {
      NOVA.log('watch', selector);
      if (typeof selector !== 'string') return console.error('watch > selector:', typeof selector);

      process(); // launch without waiting

      setInterval(process, 1000 * 1.5); // 1.5 sec

      function process() {
         NOVA.log('watch.process', { selector, callback });
         document.querySelectorAll(selector + (attr_mark ? ':not([' + attr_mark + '])' : ''))
            .forEach(el => {
               if (el.offsetWidth > 0 || el.offsetHeight > 0) { // el.is(":visible")
                  NOVA.log('watch.process.viewed', selector);
                  if (attr_mark) el.setAttribute(attr_mark, true);
                  if (typeof callback !== 'function') return console.error('watch > callback:', typeof callback);
                  callback(el);
               }
            });
      }
   },

   css: {
      push(css = required(), selector, important) {
         if (typeof css === 'object') {
            if (!selector) {
               return console.error('injectStyle > empty json-selector:', ...arguments);
            }
            // if (important) {
            injectCss(selector + json2css(css));
            // } else {
            //    Object.assign(document.querySelector(selector).style, css);
            // }

            function json2css(obj) {
               let css = '';
               Object.entries(obj)
                  .forEach(([key, value]) => {
                     css += key + ':' + value + (important ? ' !important' : '') + ';';
                  });
               return `{ ${css} }`;
            }

         } else if (css && typeof css === 'string') injectCss(css);
         else console.error('addStyle > css:', typeof css);

         function injectCss(source = required()) {
            let sheet;

            if (source.endsWith('.css')) {
               sheet = document.createElement('link');
               sheet.rel = "sheet";
               sheet.href = source;

            } else {
               const sheetName = 'NOVA_style';
               sheet = document.getElementById(sheetName) || (function () {
                  const style = document.createElement('style');
                  style.type = 'text/css';
                  style.id = sheetName;
                  document.head.appendChild(style);
                  return style;
               })();
            }

            sheet.textContent += '/**/\n' + source
               .replace(/\n+\s{2,}/g, ' ') // singleline format
               // multiline format
               // .replace(/\n+\s{2,}/g, '\n\t')
               // .replace(/\t\}/mg, '}')
               + '\n';
            // sheet.insertRule(css, sheet.cssRules.length);
            // (document.head || document.documentElement).appendChild(sheet);

            sheet.onload = () => NOVA.log('style loaded:', sheet.src || sheet.textContent.substr(0, 100));
         }
      },

      // ex: NOVA.css.getValue({ selector: 'video', property: 'z-index' })
      getValue({ selector = required(), property = required() }) {
         const el = (selector instanceof HTMLElement) ? selector : document.querySelector(selector);
         return el
            ? window.getComputedStyle(el)[property] // ok
            : console.warn('getCSSValue:selector is empty', el, ...arguments); // err

      },
   },

   cookie: {
      get(name = required()) {
         Object.fromEntries(
            document.cookie
               .split(/; */)
               .map(c => {
                  const [key, ...v] = c.split('=');
                  return [key, decodeURIComponent(v.join('='))];
               })
         )[name];
      },

      set(name = required(), value, days = 90) { // 90 days
         let date = new Date();
         date.setTime(date.getTime() + 3600000 * 24 * days); // m*h*d

         document.cookie = Object.entries({
            [encodeURIComponent(name)]: encodeURIComponent(value),
            domain: '.' + location.hostname.split('.').slice(-2).join('.'), // .youtube.com
            expires: date.toUTCString(),
            path: '/', // what matters at the end
         })
            .map(([key, value]) => `${key}=${value}`).join('; '); // if no "value" = undefined

         return document.cookie;
      },
   },

   bezelTrigger(text) {
      // console.debug('bezelTrigger', ...arguments);
      if (!text) return;
      if (typeof fateBezel === 'number') clearTimeout(fateBezel);
      const bezelEl = document.querySelector('.ytp-bezel-text');
      if (!bezelEl) return console.error(`bezelTrigger ${text}=>${bezelEl}`);

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

      fateBezel = setTimeout(() => {
         bezelConteiner.classList.remove(CLASS_VALUE_TOGGLE);
         bezelEl.textContent = ''; // fix not showing bug when frequent calls
      }, 600); // 600ms
   },

   // getNextChapterIndex() {
   getChapterList(video_duration = required()) {
      // first/pinned comment
      const timestampElList = [
         // ytplayer - not updated on page transition!
         // window.ytplayer?.config?.args.raw_player_response.videoDetails.shortDescription ||
         document.getElementById('description')?.textContent
      ]
         // first/pinned comment
         .concat(document.querySelector('#contents ytd-comment-thread-renderer:first-child #content')?.textContent || []); // fix - Uncaught TypeError: (intermediate value) is not iterable

      let prevTime = -1;

      for (const el of timestampElList) {
         const timestampList = [...el?.matchAll(/(\d{1,2}:\d{2}(:\d{2})?)(.+$)?/gm)]
            ?.map((curr, i, arr) => {
               // console.debug('curr', curr);
               // const prev = arr[i-1] || -1; // needs to be called "hmsToSecondsOnly" again. What's not optimized
               const currTime = this.timeFormatTo.sec(curr[1]);
               if (currTime > prevTime && currTime < video_duration) {
                  prevTime = currTime;
                  return {
                     // num: ++i,
                     sec: currTime,
                     time: curr[1],
                     title: curr[0]?.toString().replace(curr[1], '').trim(),
                  };
               }
            })
            .filter((obj) => obj?.time);

         if (timestampList?.length > 1) return timestampList; // clear from "lying timestamp"
      }
   },

   timeFormatTo: {
      sec(str) {
         const p = str.split(':');
         let = s = 0, m = 1;

         while (p.length) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
         }
         return +s;
      },

      HMS(epoch, no_zeros) {
         const
            sec = Math.abs(+epoch).toFixed(),
            days = Math.floor(sec / 86400) || null,
            hours = Math.floor(sec % 86400 / 3600) || null,
            minutes = Math.floor(sec % 3600 / 60),
            seconds = Math.floor(sec % 60);

         return (days && !isNaN(days) ? `${days}d ` : '')
            + [hours, minutes, seconds]
               .filter(i => i !== null && !isNaN(i)) // filter - null,NaN
               .map(i => no_zeros ? i : i.toString().padStart(2, '0')) // "1:2:3" => "01:02:03"
               .join(':'); // format "h:m:s"
      },
   },

   currentPageName: () => (page = location.pathname.split('/')[1]) && ['channel', 'c', 'user'].includes(page) ? 'channel' : page || 'main',

   queryURL: {
      // get: (query, urlString) => new URLSearchParams((urlString ? new URL(urlString) : location).search).get(query),
      get: (query, urlString) => new URL(urlString || location).searchParams.get(query),

      set(query = {}, urlString) {
         // NOVA.log('queryURL.set:', ...arguments);
         const url = new URL(urlString || location);
         Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
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

   PLAYERSTATE: {
      '-1': 'UNSTARTED',
      0: 'ENDED',
      1: 'PLAYING',
      2: 'PAUSED',
      3: 'BUFFERING',
      5: 'CUED'
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   }
}
