'use strict';

const YDOM = {
   // DEBUG: true,

   // search_xpath(query, outer_dom, inner_dom) {
   //    // document.evaluate(".//h2", document.body, null, XPathResult.ANY_TYPE, null);
   //    //XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7
   //    outer_dom = outer_dom || document;
   //    return outer_dom.evaluate(query, inner_dom || document, null, 7, null);
   // },

   listeners: [],

   waitHTMLElement({selector = required(), callback = required(), cleaning_resistant}) {
      // http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/

      // Store the selector and callback to be monitored
      this.listeners.push({
         selector: selector,
         clear: !cleaning_resistant,
         fn: callback
      });

      // instantiating observer
      if (!this.Observer && this.listeners.length) {
         this.Observer = true;
         createObserver();

         // stop
      } else if (YDOM.Observer && !this.listeners.length) {
         observer.disconnect();
         this.log('Observer stop');

         // check
      } else {
         checkinlisteners();
      }

      function createObserver() {
         YDOM.log('Observer create');

         new MutationObserver(mutations => {
            // mutations.forEach(mutation => {
            //    for (const node of mutation.addedNodes) {
            //       if (node instanceof HTMLElement) checkinlisteners(node);
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

            if (matches.length) {
               // console.log('matches node:', matches);
               checkinlisteners();
            }
         })
            // fix "Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'."
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
      function checkinlisteners() {
         YDOM.log('check (left: %s count): %s', YDOM.listeners.length, JSON.stringify(YDOM.listeners));
         // Check the DOM for elements matching a stored selector
         for (const i in YDOM.listeners) {
            const listener = YDOM.listeners[i];
            // console.log('element test', listener.selector, element);

            // Query for elements matching the specified selector
            [...document.querySelectorAll(listener.selector)].forEach(element => {
               listener.clear && YDOM.log('element ready:', listener.selector);

               if (listener.clear) {
                  YDOM.listeners.splice(i, 1); // delete element from listeners
                  YDOM.log('element clear:', listener.selector);
               }
               listener.fn(element);
            });
         };
      }
   },

   isInViewport(el = required()) {
      if (el instanceof HTMLElement) {
         const bounding = el.getBoundingClientRect();
         return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= window.innerHeight &&
            bounding.right <= window.innerWidth
         );
      }
   },

   dragnDrop: {
      connect(element = required(), callback) {
         if (element.hasAttribute("dragnDrop")) return;

         this.log('dragnDrop: connect', element);

         element.setAttribute('dragnDrop', true);

         let offset = [0, 0];
         let isDown = false;

         // element.addEventListener("touchstart", dragStart, false);
         // element.addEventListener("touchend", dragEnd, false);
         // element.addEventListener("touchmove", drag, false);

         // element.addEventListener("mousedown", dragStart, true);
         // element.addEventListener("mouseup", dragEnd, true);
         // document.addEventListener("mousemove", drag, false);

         // init dragnDrop
         element.onmousedown = event => {
            dragStart(event);
            // move the active element on mousemove
            document.addEventListener('mousemove', drag);
            // drop the active element, remove unneeded handlers
            element.onmouseup = dragEnd;
         };

         function dragStart(e) {
            isDown = true;
            offset = [
               element.offsetLeft - e.clientX,
               element.offsetTop - e.clientY
            ];

            Object.assign(element.style, {
               // 'z-index': 9999,
               cursor: 'move',
               outline: '1px dashed deepskyblue',
            });
         };

         function dragEnd() {
            isDown = false;

            Object.assign(element.style, {
               // 'z-index': 'unset', // removes the original meaning breaking style
               cursor: 'unset',
               outline: 'unset',
            });

            if (callback && typeof (callback) === 'function') return callback({
               top: element.style.top,
               left: element.style.left,
            });
         };

         function drag(e) {
            event.preventDefault();
            if (isDown) {
               element.style.left = (e.clientX + offset[0]) + 'px';
               element.style.top = (e.clientY + offset[1]) + 'px';
            }
         };
      },

      disconnect(el = required()) {
         if (!el.hasAttribute("dragnDrop")) return;

         this.log('dragnDrop: disconnect');

         el.onmousedown = null;
         el.onmouseup = null;
         // document.removeEventListener('mousemove', drag);

         el.removeAttribute('dragnDrop');
      },
   },

   doublePressListener(callback, keyCodeFilter) {
      let pressed;
      let lastPressed = parseInt(keyCodeFilter) || null;
      let isDoublePress;

      const handleDoublePresss = key => {
         // console.log(key.key, 'pressed two times');
         if (callback && typeof (callback) === 'function') return callback(key);
      }

      const timeOut = () => setTimeout(() => isDoublePress = false, 500);

      const keyPress = key => {
         pressed = key.keyCode;
         this.log('doublePressListener %s=>%s=%s', lastPressed, pressed, isDoublePress);

         if (isDoublePress && pressed === lastPressed) {
            isDoublePress = false;
            handleDoublePresss(key);
         } else {
            isDoublePress = true;
            timeOut();
         }

         if (!keyCodeFilter) lastPressed = pressed;
      }

      // window.onkeyup = key => keyPress(key);
      document.addEventListener("keyup", keyPress);
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
      // caching(key, expiresHours, transitFn, callback) {
      //    const now = new Date();
      //    const value = JSON.parse(localStorage.getItem(key));

      //    if (value && value.hasOwnProperty('expires') && +value.expires > now.getTime()) {
      //       if (callback && typeof (callback) === 'function') {
      //          callback(value);
      //       }

      //    } else {
      //       const callbackFn = newValueData => {
      //          if (callback && typeof (callback) === 'function') callback(newValueData);

      //          if (!Array.isArray(newValueData)) newValueData = [newValueData];

      //          // saving to localStorage afler all
      //          for (const item of newValueData) {
      //             localStorage.setItem(key, JSON.stringify({
      //                ...{
      //                   'expires': +now.setHours(now.getHours() + (+expiresHours || 1)), // add 1 hour,
      //                }, ...item
      //             }));
      //          }

      //       };
      //       transitFn(callbackFn);
      //    }
      // },

      async API({request, params, api_key}) {
         // console.log(`YOUTUBE API, url=${url}, params=${JSON.stringify(params)}, api_key=${api_key}`);
         // console.trace();
         const YOUTUBE_API_KEYS = JSON.parse(localStorage.getItem('YOUTUBE_API_KEYS') || 'null');

         if (!api_key && (!Array.isArray(YOUTUBE_API_KEYS) || !YOUTUBE_API_KEYS.length)) {
            console.log('YOUTUBE_API_KEYS:', YOUTUBE_API_KEYS);
            throw new Error('YOUTUBE_API_KEYS is empty');
         }
         // Distribute the load over multiple APIs by selecting one randomly.
         const getRandArrayItem = arr => api_key || 'AIzaSy' + arr[Math.floor(Math.random() * arr.length)];

         // combine GET
         const query = (request == 'videos' ? 'videos' : 'channels') + '?'
            + Object.keys(params)
               .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
               .join('&');

         const URL = `https://www.googleapis.com/youtube/v3/${query}&key=` + getRandArrayItem(YOUTUBE_API_KEYS);

         YDOM.log('URL:', URL);

         try {
            // fetch(URL)
            //    .then(response => response.json())
            //    .then(json => {
            //       if (Object.keys(json).length) return json;
            //       else throw new Error('empty API response:', JSON.stringify(json));
            //    })
            //    .catch(error => {
            //       throw new Error(`Request failed ${URL}:\n${error}`);
            //    });

            const response = await fetch(URL);
            const json = await response.json();
            // empty response
            if (!Object.keys(json).length) {
               throw new Error('empty API response: ' + JSON.stringify(json));

            } else if (json.error) { // API error
               let usedAPIkey = this.getURLParams(URL).get('key');
               throw new Error(`${json.error.message}\n${usedAPIkey}`);
            }

            return json;

         } catch (error) {
            let err_text = `Request failed ${URL}:\n${error}`;
            console.error(err_text);
            alert('problems with the YouTube API.\n'
               + '\n1. Disconnect the plugins that need it'
               + '\n2. Generate and add your YouTube API KEY');
            throw new Error(err_text);
         }
      },
   },

   log(...agrs) {
      this.DEBUG && agrs?.length && console.log(...agrs);
   },
}
