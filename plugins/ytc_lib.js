'use strict';

const YDOM = {
   // DEBUG: true,

   HTMLElement: {

      wait(selector = required()) {
         YDOM.log('wait', JSON.stringify(...arguments));
         return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            new MutationObserver((mutations, observer) => {
               [...document.querySelectorAll(selector)]
                  .forEach(el => {
                     observer.disconnect();
                     resolve(el);
                  });
            })
               .observe(document.body || document.documentElement, {
                  childList: true,
                  subtree: true
               });
         });
      },

      watch({ selector = required(), callback = required() }) {
         YDOM.log('watch', selector);
         process(); // launch not wait

         setInterval(process, 1000 * 1.5); // 1.5 sec

         function process() {
            YDOM.log('process', { selector, callback });
            [...document.querySelectorAll(selector)]
               .forEach(el => callback(el));
         }
      },
   },

   // uncheck(toggle) {
   //    toggle.hasAttribute("checked") && toggle.click();
   // },

   injectStyle(styles = required(), selector, important) {
      if (typeof styles === 'object') { // is json
         // if (important) {
         injectCss(selector + json2css(styles));

         // } else {
         //    Object.assign(document.querySelector(selector).style, styles);
         // }

         function json2css(obj) {
            let _css = '';
            Object.entries(obj).forEach(
               // ([key, value]) => _css += key + ':' + value + ' !important;'
               ([key, value]) => {
                  _css += key + ':' + value + (important ? ' !important' : '') + ';';
               }
            );
            return `{ ${_css} }`;
         }

      } else injectCss(styles);

      function injectCss(source = required()) {
         let sheet;

         if (source.endsWith('.css')) {
            sheet = document.createElement('link');
            sheet.rel = "stylesheet";
            sheet.href = source;

         } else {
            sheet = document.createElement('style');
            sheet.type = 'text/css';
            sheet.textContent = source;
         }

         (document.head || document.documentElement).appendChild(sheet);

         sheet.onload = () => YDOM.log('style loading:', (sheet.src || sheet.textContent));
      }
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

   getURLParams: url => new URLSearchParams((url ? new URL(url) : location).search),

   request: {

      async API({ request, params, api_key }) {
         YDOM.log('API:', ...arguments);

         // get API key
         const YOUTUBE_API_KEYS = JSON.parse(localStorage.getItem('YOUTUBE_API_KEYS')) || await this.keys();
         if (!api_key && (!Array.isArray(YOUTUBE_API_KEYS) || !YOUTUBE_API_KEYS.length)) {
            console.error('YOUTUBE_API_KEYS:', YOUTUBE_API_KEYS);
            throw new Error('YOUTUBE_API_KEYS is empty');
         }

         const referRandKey = arr => api_key || 'AIzaSy' + arr[Math.floor(Math.random() * arr.length)];

         // combine GET
         const query = (request == 'videos' ? 'videos' : 'channels') + '?'
            + Object.keys(params)
               .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
               .join('&');

         const URL = `https://www.googleapis.com/youtube/v3/${query}&key=` + referRandKey(YOUTUBE_API_KEYS);

         // request
         return await fetch(URL)
            .then(response => response.json())
            .then(json => {
               if (!json.error && Object.keys(json).length) return json;
               console.warn('used key:', YDOM.getURLParams(URL).get('key'));
               throw new Error(JSON.stringify(json?.error));
            })
            .catch(error => {
               localStorage.removeItem('YOUTUBE_API_KEYS');
               console.error(`Request API failed:${URL}\n${error}`);
               alert(error?.message || 'Problems with the YouTube API.\n'
                  + '\n1. Disconnect the plugins that need it'
                  + '\n2. Or generate and add your YouTube API KEY');
            });
      },

      async keys() {
         YDOM.log('fetch to youtube_api_keys.json');
         // see https://gist.github.com/raingart/ff6711fafbc46e5646d4d251a79d1118/
         return await fetch('https://gist.githubusercontent.com/raingart/ff6711fafbc46e5646d4d251a79d1118/raw/youtube_api_keys.json')
            .then(res => res.text())
            .then(keys => { // save
               YDOM.log(`get and save keys in localStorage`, keys);
               localStorage.setItem('YOUTUBE_API_KEYS', keys);
               return JSON.parse(keys);
            })
            .catch(error => { // clear
               localStorage.removeItem('YOUTUBE_API_KEYS');
               throw error;
               // throw new Error(error);
            })
            .catch(reason => console.error('Error get keys:', reason)); // warn
      },
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   }
}
