'use strict';

const YDOM = {
   // DEBUG: true,

   waitElementStore: [],

   // waitHTMLElement_busy: false,

   waitHTMLElement({ selector = required(), callback = required(), not_removable }) {
      this.log('waitHTMLElement:', ...arguments);
      // http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/

      // Store the selector and callback to be monitored
      this.waitElementStore.push({
         selector: selector,
         removable: !not_removable,
         fn: callback
      });

      // Is it worth replacing "Observer" with "setInterval" for optimization?

      // instantiating setInterval
      // let interval_check = setInterval(() => hasInStore(), 1000 * 1); // 1sec

      // // instantiating observer
      // if (this.waitElementStore.length) {
      //    hasInStore();

      // } else { // stop
      //    this.log('interval_check stop');
      //    clearInterval(interval_check);
      // }


      // instantiating observer
      if (!this.observerEnable && this.waitElementStore.length) {
         this.observerEnable = true;
         createObserver();

         // stop
      // } else if (this.hasOwnProperty(observerEnable) && !this.waitElementStore.length) {
      } else if (this.observerEnable && !this.waitElementStore.length) {
         console.debug('observerEnable.takeRecords', this.observerEnable.takeRecords());

         this.log('Observer stop');
         this.observerEnable = false;
         this.ObserverContaiter.disconnect();

         // check
      } else {
         hasInStore();
      }

      function createObserver() {
         YDOM.log('Observer create');

         YDOM.ObserverContaiter = new MutationObserver(mutations => {
            // mutations.forEach(mutation => {
            //    for (const node of mutation.addedNodes) {
            //       if (node instanceof HTMLElement) hasInStore(node);
            //    }
            // });
            const { addedNodes } = mutations[0];
            const matches = [...addedNodes]
               .filter(node => node instanceof HTMLElement)
            // .filter(element => element.matches('selector'))
            // .filter(element => {
            //    for (const elem of node.querySelectorAll(listener.selector)) {
            //       //
            //    }
            // });
            //
            // .filter(element => {
            //    for (const i in YDOM.waitElementStore) {
            //       const listener = YDOM.waitElementStore[i];
            //       // return document.body.matches(listener.selector);
            //       return element.matches(listener.selector);
            //    }
            // });

            if (matches.length) {
               // console.debug('matches node:', matches);
               hasInStore();
            }
         })
            .observe(document.body || document.documentElement, {
               // attributes: true, // add/remove/change attributes
               // attributeOldValue: true, // will show oldValue of attribute | on add/remove/change attributes | default: null
               // characterData: true, // data changes will be observed | on add/remove/change characterData
               // characterDataOldValue: true, // will show OldValue of characterData | on add/remove/change characterData | default: null
               childList: true, // target childs will be observed | on add/remove
               subtree: true, // target childs will be observed | on attributes/characterData changes if they observed on target
               // attributeFilter: ['style'] // filter for attributes | array of attributes that should be observed, in this case only style
            });
      }

      // Check if the element is currently in the DOM
      function hasInStore() {
         if (YDOM.waitHTMLElement_busy) return;
         YDOM.waitHTMLElement_busy = true;

         YDOM.log('waitElementStore left: %s', YDOM.waitElementStore.length, YDOM.waitElementStore);
         // Check the DOM for elements matching a stored selector
         for (const i in YDOM.waitElementStore) {
            const listener = YDOM.waitElementStore[i];

            // Query for elements matching the specified selector
            YDOM.log('waitHTMLElement search:', listener.selector);

            [...document.querySelectorAll(listener.selector)]
               .forEach(element => {
                  YDOM.log('element ready:', listener.selector);
                  // delete element from [listeners]
                  if (listener.removable) {
                     YDOM.waitElementStore.splice(i, 1);
                     YDOM.log('element erase frome waitElementStore:', listener.selector);
                  }

                  if (listener.fn && typeof (listener.fn) === 'function') {
                     // console.count(`${listener.selector}`);
                     // console.time(`${listener.selector}`);
                     listener.fn(element);
                     // console.timeEnd(`${listener.selector}`);
                  }
               });
         };
         YDOM.waitHTMLElement_busy = false;
      }
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

      set(name = required(), value) {
         let date = new Date();
         date.setTime(date.getTime() + (90 * 86400000)); // 90 days

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
         const YOUTUBE_API_KEYS = JSON.parse(localStorage.getItem('YOUTUBE_API_KEYS')) || await YDOM.request.keys();
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
