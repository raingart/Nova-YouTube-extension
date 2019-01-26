// 'use strict';

const YDOM = {
   // DEBUG: true,

   api_url: 'https://www.googleapis.com/youtube/v3/',

   // waitFor_test: function (selector, callback) {
   //    document.addEventListener('DOMNodeInserted', function (R) {
   //       let S = R.target || null;
   //       if (S && S.nodeName === 'VIDEO') {
   //          //  new p.videoController(S);
   //          console.log('DOMNodeInserted');
   //       }
   //    });
   // },

   listeners: [],
   waitFor: (selector = required(), callback = required()) => {
      // http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/

      // Store the selector and callback to be monitored
      YDOM.listeners.push({
         selector: selector,
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
               let config = {
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
         YDOM.log('check (left: %s count)', YDOM.listeners.length);

         // Check the DOM for elements matching a stored selector
         for (const i in YDOM.listeners) {
            let listener = YDOM.listeners[i];

            // Query for elements matching the specified selector
            Array.from(doc.querySelectorAll(listener.selector))
               .forEach((element) => {
                  YDOM.log('element ready, listeners_id:%s', i);
                  YDOM.listeners.splice(i, 1); // delete element from listeners
                  // YDOM.listeners.filter(e => e !== element)
                  listener.fn(element); // cun element callback
               });
         }
      }
   },

   isInViewport: (el = required()) => {
      let bounding = el.getBoundingClientRect();
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
            let param = el.split('=');
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

   getPageType: () => {
      let page = location.pathname.split('/')[1];
      YDOM.log('page type %s', page);
      return (page == 'channel' || page == 'user') ? 'channel' : page || null;
   },

   getUrlVars: url => {
      if (url && url.indexOf('?') === -1) url = '?' + url;

      let vars = {};
      const parts = (url || window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
         vars[key] = value;
      });
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


const RequestFetch = (url = required(), payload, typeResponse, callback) => {
   url = YDOM.api_url + url; // to secure
   // console.log('url', url);

   fetch(url, payload)
      .then(res => {
         return (res.status >= 200 && res.status < 300) ? Promise.resolve(res) : Promise.reject(new Error(res.statusText));
      })
      .then(response => {
         switch (typeResponse.toLowerCase()) {
            case 'text':
               return response.text();
            case 'json':
               return response.json();
            case 'arraybuffer':
               return response.arrayBuffer();
            default:
               return response.text();
         }
      })
      .then(res => {
         // console.log('Request Succeeded:', JSON.stringify(res));
         return (callback && typeof (callback) === "function") ? callback(res) : res;
      })
      .catch(err => console.error('Request Error: %s\n%s', err.response, err));
}
