// 'use strict';

const PolymerYoutube = {
   // DEBUG: true,

   api_url: 'https://www.googleapis.com/youtube/v3/',

   // waitFor: function (selector, callback) {
   //    return new Promise(function (res, rej) {
   //       waitForElementToDisplay(selector, 300);

   //       function waitForElementToDisplay(selector, time, maxCountLoop) {
   //          if (maxCountLoop === undefined) {
   //             let sec = 20; // max wait sec
   //             maxCountLoop = sec / (time / 1000); // max loop (sec->loop count)
   //          }

   //          if (document.querySelector(selector) != null) {
   //             res(document.querySelector(selector));
   //             // if (selector) {
   //             // res(selector);
   //             PolymerYoutube.log('exist elm:', selector);

   //             if (callback && typeof (callback) === 'function') return callback(selector);
   //          } else {
   //             setTimeout(function () {
   //                if (!maxCountLoop) {
   //                   // We have run out of retries
   //                   console.warn('wait elm force stop:', selector);
   //                   res(true);
   //                } else {
   //                   // Try again
   //                   PolymerYoutube.log('wait elm:', selector);
   //                   waitForElementToDisplay(selector, time, maxCountLoop - 1);
   //                }
   //             }, time);
   //          }
   //       }
   //    });
   // },

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

   // getMatchedCSSRules: (el) => {
   //    let rules = [...document.styleSheets]
   //    rules = rules.filter(({
   //       href
   //    }) => !href)
   //    rules = rules.map((sheet) => [...(sheet.cssRules || sheet.rules || [])].map((rule) => {
   //       if (rule instanceof CSSStyleRule) {
   //          return [rule]
   //       } else if (rule instanceof CSSMediaRule && window.matchMedia(rule.conditionText)) {
   //          return [...rule.cssRules]
   //       }
   //       return []
   //    }))
   //    rules = rules.reduce((acc, rules) => acc.concat(...rules), [])
   //    rules = rules.filter((rule) => el.matches(rule.selectorText))
   //    rules = rules.map(({
   //       style
   //    }) => style)
   //    return rules
   // },

   // getMatchedStyle: (elem, property) => {
   //    // element property has highest priority
   //    var val = elem.style.getPropertyValue(property);

   //    // if it's important, we are done
   //    if (elem.style.getPropertyPriority(property))
   //       return val;

   //    // get matched rules
   //    var rules = PolymerYoutube.getMatchedCSSRules(elem);

   //    // iterate the rules backwards
   //    // rules are ordered by priority, highest last
   //    for (var i = rules.length; i-- > 0;) {
   //       var r = rules[i];

   //       var important = r.style.getPropertyPriority(property);

   //       // if set, only reset if important
   //       if (val == null || important) {
   //          val = r.style.getPropertyValue(property);

   //          // done if important
   //          if (important)
   //             break;
   //       }
   //    }

   //    return val;
   // },

   // connect_DragnDrop: function (element, callback) {
   //    // if (!element) return;
   //    element.onmousedown = function (event, callback) {
   //       let shiftX = event.clientX - this.getBoundingClientRect().left;
   //       let shiftY = event.clientY - this.getBoundingClientRect().top;
   
   //       this.style.position = 'absolute !important;';
   //       // act_elm.style.zIndex = 1000;
   
   //       Object.assign(this.style, {
   //          'z-index': 9999,
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
   //             'z-index': 'unset',
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

   // // Performs an ajax request
   // function ajaxRequest(request, callback) {
   //    var xhr = new XMLHttpRequest();
   //    xhr.onreadystatechange = function () {
   //       if (xhr.readyState == 4) {
   //          if (xhr.status == 200) {
   //             callback(xhr.responseText);
   //          } else {
   //             callback(null);
   //          }
   //       }
   //    };
   //    xhr.open(request.method, request.url, true);
   //    for (var i in request.headers) {
   //       xhr.setRequestHeader(request.headers[i].header, request.headers[i].value);
   //    }
   //    xhr.send(request.data);
   // }
}
