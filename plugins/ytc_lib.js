// 'use strict';

const YDOM = {
   // DEBUG: true,

   api_url: 'https://www.googleapis.com/youtube/v3/',

   // waitFor_test: function (selector, callback) {
   //    document.addEventListener('DOMNodeInserted', function (R) {
   //       var S = R.target || null;
   //       if (S && S.nodeName === 'VIDEO') {
   //          //  new p.videoController(S);
   //          console.log('DOMNodeInserted');
   //       }
   //    });
   // },

   listeners: [],
   waitFor: (selector, callback) => {
      // waitFor: (selector, callback) => {
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

         // return { getObserver: function () {
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
         // },};
      }

      // Check if the element is currently in the DOM
      function check(doc) {
         YDOM.log('check (left: %s count)', YDOM.listeners.length);

         // Check the DOM for elements matching a stored selector
         for (const i in YDOM.listeners) {
            let listener = YDOM.listeners[i];

            // // Query for elements matching the specified selector
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

   isInViewport: el => {
      if (!el) return;
      var bounding = el.getBoundingClientRect();
      return (
         bounding.top >= 0 &&
         bounding.left >= 0 &&
         bounding.bottom <= window.innerHeight &&
         bounding.right <= window.innerWidth
      );
      // return (
      //    bounding.top >= 0 &&
      //    bounding.left >= 0 &&
      //    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      //    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      // );
   },

   // connect_DragnDrop: function (element, callback) {
   //    // if (!element) return;
   //    element.onmousedown = function (event, callback) {
   //       let shiftX = event.clientX - this.getBoundingClientRect().left;
   //       let shiftY = event.clientY - this.getBoundingClientRect().top;

   //       this.style.position = 'absolute !important;';
   //       // act_elm.style.zIndex = 1000;

   //       Object.assign(this.style, {
   //          // 'z-index': 9999,
   //          cursor: 'move',
   //          outline: '1px dashed deepskyblue',
   //       });

   //       moveAt(event.pageX, event.pageY);
   //       // centers the active element at (pageX, pageY) coordinates
   //       function moveAt(pageX, pageY) {
   //          element.style.left = pageX - shiftX + 'px';
   //          element.style.top = pageY - shiftY + 'px';
   //       }

   //       function onMouseMove(event) {
   //          moveAt(event.pageX, event.pageY);
   //       }

   //       // (3) move the active element on mousemove
   //       document.addEventListener('mousemove', onMouseMove);

   //       // (4) drop the active element, remove unneeded handlers
   //       this.onmouseup = function () {
   //          document.removeEventListener('mousemove', onMouseMove);
   //          this.onmouseup = null;
   //          Object.assign(this.style, {
   //             // 'z-index': 'unset',
   //             cursor: 'unset',
   //             outline: 'unset',
   //          });
   //          if (callback && typeof (callback) === 'function') return callback({
   //             top: this.style.top,
   //             left: this.style.left,
   //          });
   //       };
   //    };
   // },

   // search_xpath: function (query, outer_dom, inner_dom) {
   //    // document.evaluate(".//h2", document.body, null, XPathResult.ANY_TYPE, null);
   //    //XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7
   //    outer_dom = outer_dom || document;
   //    return outer_dom.evaluate(query, inner_dom || document, null, 7, null);
   // },

   injectStyle: (styles, selector, important) => {
      if (!styles) return;

      if (typeof styles === 'object') { // is json
         if (!selector) selector = '*';

         injectCss(selector + json2css(styles));

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

      } else {
         injectCss(styles);
      }


      function injectCss(source) {
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

   getPageType: () => {
      // "*://www.youtube.com/watch?v=*",
      // "*://www.youtube.com/user/*",
      // "*://www.youtube.com/channel/*"
      // "*://www.youtube.com/results?search_query=*"
      // "*://www.youtube.com/playlist?list=PL*"
      let page = location.pathname.split('/')[1];
      YDOM.log('page type %s', page);
      return (page == 'channel' || page == 'user') ? 'channel' : page || null;
   },

   getUrlVars: v => {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
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


const RequestFetch = (url, payload, typeResponse, callback) => {
   url = YDOM.api_url + url; // for safe
   // console.log('url', url);

   fetch(url, payload)
      .then(res => {
         return (res.status >= 200 && res.status < 300) ?
            Promise.resolve(res) :
            Promise.reject(new Error(res.statusText));
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
      .catch(error => {
         console.error('Request Error: %s\n%s', error.response, error);
      });
}
