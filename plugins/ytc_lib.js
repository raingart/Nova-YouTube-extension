// 'use strict';

const PolymerYoutube = {
   // DEBUG: true,

   api_url: 'https://www.googleapis.com/youtube/v3/',

   listeners: [],

   waitFor: function (selector, callback) {
      // waitFor: (selector, callback) => {
      // http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/

      // Store the selector and callback to be monitored
      PolymerYoutube.listeners.push({
         selector: selector,
         fn: callback
      });
      PolymerYoutube.log('listeners', JSON.stringify(PolymerYoutube.listeners));

      singleton_Observer(window);

      function singleton_Observer(win) {
         let observer,
            target = document.body || document,
            doc = win.document;

         function createObserver() {
            PolymerYoutube.log('create Observer');
            let MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
            let object = new MutationObserver(function () {
               startObserver()

               // stop observing
               if (!PolymerYoutube.listeners.length) {
                  PolymerYoutube.log('stop Observer');
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
            PolymerYoutube.log('init Observer');
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
         PolymerYoutube.log('check (left: %s count)', PolymerYoutube.listeners.length);

         // Check the DOM for elements matching a stored selector
         for (const i in PolymerYoutube.listeners) {
            let listener = PolymerYoutube.listeners[i];

            // // Query for elements matching the specified selector
            Array.from(doc.querySelectorAll(listener.selector))
               .forEach((element) => {
                  PolymerYoutube.log('element ready, listeners_id:%s', i);
                  PolymerYoutube.listeners.splice(i, 1); // delete element from listeners
                  // PolymerYoutube.listeners.filter(e => e !== element)
                  listener.fn(element); // cun element callback
               });
         }
      }
   },

   isInViewport: function (elem) {
      if (!elem) return;
      var bounding = elem.getBoundingClientRect();
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
         let sheet = document.createElement('style');
         sheet.type = 'text/css';

         // if (source.slice(-3) === '.css') sheet.src = source;
         // else sheet.styleSheet.cssText = source;
         // else sheet.textContent = source;

         if (source.slice(-3) === '.css') {
            sheet.src = source;
         } else if (sheet.styleSheet) {
            sheet.styleSheet.cssText = source;
         } else {
            sheet.innerHTML = source;
         }

         (document.head || document.documentElement).appendChild(sheet);

         // sheet.onload = function () {
         // PolymerYoutube.log('style loading:', sheet.src || sheet.textContent);
         // console.log('style loading:', sheet.src || sheet.textContent);
         // sheet.parentNode.removeChild(sheet);
         // };

         // sheet.onload = sheet.onerror = function () {
         //    this.remove();
         // };
      }
   },

   getUrlVars: function (v) {
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
         console.log('PolymerYoutube:', msg);
      }
   },
}


const RequestFetch = function (url, payload, typeResponse, callback) {
   url = PolymerYoutube.api_url + url; // for safe
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
