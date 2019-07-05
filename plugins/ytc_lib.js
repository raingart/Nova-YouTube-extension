'use strict';

const YDOM = {
   // DEBUG: true,

   listeners: [],
   waitFor: (selector = required(), callback = required(), isStrong) => {
      // http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/

      // Store the selector and callback to be monitored
      YDOM.listeners.push({
         selector: selector,
         clear: !isStrong,
         fn: callback
      });
      YDOM.log('listeners %s', JSON.stringify(YDOM.listeners));

      singleton_Observer(window);

      function singleton_Observer(win) {
         let observer,
            target = document.body || document,
            doc = win.document;

         function createObserver() {
            YDOM.log('create Observer');
            let MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
            let object = new MutationObserver(function () {
               startObserver()

               // stop observing
               if (!YDOM.listeners.length) {
                  YDOM.log('stop Observer');
                  observer.disconnect();
                  observer = null;
               }
            });
            return object;
         }
         // work executing
         let startObserver = () => {
            check(doc);
         };

         return (function () {
            YDOM.log('init Observer');
            if (!observer) {
               observer = createObserver();
               const config = {
                  childList: true,
                  subtree: true,
                  // attributes: true,
                  // haracterData: false,
                  // attributeFilter: ['src']
               };
               // pass in the target node, as well as the observer options
               observer.observe(target || document.documentElement, config);
            }
            // return observer;
            return startObserver();
         }());
      }

      // Check if the element is currently in the DOM
      function check(doc) {
         YDOM.log('check (left: %s count): %s', YDOM.listeners.length, JSON.stringify(YDOM.listeners));

         // Check the DOM for elements matching a stored selector
         for (const i in YDOM.listeners) {
            const listener = YDOM.listeners[i];

            // Query for elements matching the specified selector
            Array.from(doc.querySelectorAll(listener.selector))
               .forEach(el => {
                  YDOM.log('element ready, listeners: %s', listener.selector);
                  if (listener.clear) {
                     YDOM.log('element clear, listeners :%s', listener.selector);
                     YDOM.listeners.splice(i, 1); // delete element from listeners
                     // YDOM.listeners.filter(e => e !== element)
                  }
                  listener.fn(el); // cun element callback
               });
         }
      }
   },

   isInViewport: (el = required()) => {
      const bounding = el.getBoundingClientRect();
      return (
         bounding.top >= 0 &&
         bounding.left >= 0 &&
         bounding.bottom <= window.innerHeight &&
         bounding.right <= window.innerWidth
      );
   },

   dragnDrop: {
      connect: (element = required(), callback) => {
         if (element.hasAttribute("dragnDrop")) return;

         YDOM.log('dragnDrop: connect %s', element);

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

      disconnect: (el = required()) => {
         if (!el.hasAttribute("dragnDrop")) return;

         YDOM.log('dragnDrop: disconnect');

         el.onmousedown = null;
         el.onmouseup = null;
         // document.removeEventListener('mousemove', drag);

         el.removeAttribute('dragnDrop');
      },
   },

   addDoublePressListener: (callback, keyCodeFilter) => {
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
         YDOM.log('addDoublePressListener %s=>%s=%s', lastPressed, pressed, isDoublePress);

         if (isDoublePress && pressed === lastPressed) {
            isDoublePress = false;
            handleDoublePresss(key);
         } else {
            isDoublePress = true;
            timeOut();
         }

         if (!keyCodeFilter) {
            lastPressed = pressed;
         }
      }

      // window.onkeyup = key => keyPress(key);
      document.addEventListener("keyup", keyPress);
   },

   // uncheck: toggle => {
   //    toggle.hasAttribute("checked") && toggle.click();
   // },

   // search_xpath: function (query, outer_dom, inner_dom) {
   //    // document.evaluate(".//h2", document.body, null, XPathResult.ANY_TYPE, null);
   //    //XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7
   //    outer_dom = outer_dom || document;
   //    return outer_dom.evaluate(query, inner_dom || document, null, 7, null);
   // },

   injectStyle: (styles = required(), selector, important) => {
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
            return '{' + _css + '}';
         }

      } else injectCss(styles);

      function injectCss(source = required()) {
         let sheet;

         if (source.slice(-3) === '.css') {
            sheet = document.createElement('link');
            sheet.rel = "stylesheet";
            sheet.href = source;

         } else {
            sheet = document.createElement('style');
            sheet.type = 'text/css';
            sheet.textContent = source;
         }

         (document.head || document.documentElement).appendChild(sheet);

         sheet.onload = function () {
            YDOM.log('style loading: %s', sheet.src || sheet.textContent);
         };
      }
   },

   cookie: {
      get: name => {
         let cookie = {};
         document.cookie.split(';').forEach(el => {
            // console.log('el', el);
            const param = el.split('=');
            cookie[param[0].trim()] = param.slice(1).join('=');
            // let [k, v] = el.split('=');
            // cookie[k.trim()] = v;
         })
         // console.log(JSON.stringify(cookie));
         return name ? cookie[name] : cookie;
      },

      set: (name = required(), value) => {
         let cookie = {
            [name]: value,
            path: '/'
         };
         YDOM.log('cookie set: %s', JSON.stringify(cookie));

         let date = new Date();
         date.setTime(date.getTime() + 31536000);
         cookie.expires = date.toUTCString();

         cookie.domain = '.' + window.location.hostname.split('.').slice(-2).join('.'); // .youtube.com

         let arr = []
         for (const key in cookie) {
            arr.push(`${key}=${cookie[key]}`);
         }
         document.cookie = arr.join('; ');
      },
   },

   request: {
      // caching: (key, expiresHours, transitFn, callback) => {
      //    const now = new Date();
      //    const value = JSON.parse(sessionStorage.getItem(key));

      //    if (value && value.hasOwnProperty('expires') && +value.expires > now.getTime()) {
      //       if (callback && typeof (callback) === 'function') {
      //          callback(value);
      //       }

      //    } else {
      //       const callbackFn = newValueData => {
      //          if (callback && typeof (callback) === 'function') callback(newValueData);

      //          if (!Array.isArray(newValueData)) newValueData = [newValueData];

      //          // saving to sessionStorage afler all
      //          for (const item of newValueData) {
      //             sessionStorage.setItem(key, JSON.stringify({
      //                ...{
      //                   'expires': +now.setHours(now.getHours() + (+expiresHours || 1)), // add 1 hour,
      //                }, ...item
      //             }));
      //          }

      //       };
      //       transitFn(callbackFn);
      //    }
      // },

      API: (url, params) => {
         const YOUTUBE_API_KEYS = [
            'A-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA', 'CXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA',
            'AgcQ6VzgBPjTY49pxeqHsIIDQgQ09Q4bQ', 'AQt1mEVq6zwVBjwx_lcJkQoAAxGExgN7A',
            'AGosg8Ncdqw8IrwV4iT9E1xCIAVvg4CBw',
         ];
         // Distribute the load over multiple APIs by selecting one randomly.
         const getRandArrayItem = arr => 'AIzaSy' + arr[Math.floor(Math.random() * arr.length)];

         // combine GET
         const query = (url == 'videos' ? 'videos' : 'channels') + '?'
            + Object.keys(params)
               .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
               .join('&');

         const URL = 'https://www.googleapis.com/youtube/v3/' + query + '&key=' + getRandArrayItem(YOUTUBE_API_KEYS);

         YDOM.log('URL: %s', URL);

         return fetch(URL)
            .then(response => response.json())
            .then(res => {
               if (Object.keys(res).length) return res;
               else throw new Error('empty API response:', JSON.stringify(res));
            })
            .catch(error => {
               alert( 'empty API response:', JSON.stringify(res) );
               console.warn('URL:', URL);
               console.warn('Request failed:\n', error);
            });
      },
   },

   getPageType: () => {
      const page = location.pathname.split('/')[1];
      YDOM.log('page type %s', page);
      return (page == 'channel' || page == 'user') ? 'channel' : page || null;
   },

   getUrlVars: url => {
      let vars = {};
      (url || location.search).replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => vars[key] = value);
      return vars;
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('YDOM:', msg);
      }
   },
}

function chunkArray(arr, size) {
   let results = [];
   while (arr.length) {
      results.push(arr.splice(0, size));
   }
   return results;
}

function timeSince(ts) {
   let sec = Math.floor((new Date - ts) / 1e3),
      d = Math.floor(sec / 31536e3);
   return d > 1 ? d + " years" : (d = Math.floor(sec / 2592e3), d > 1 ? d + " months" : (d = Math.floor(sec / 86400), d > 1 ? d + " days" : (d = Math.floor(sec / 3600), d > 1 ? d + " hours" : (d = Math.floor(sec / 60), d > 1 ? d + " minutes" : d + " seconds"))))
}
