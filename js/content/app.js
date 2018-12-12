// 'use strict';
// console.log(": init content.js");

const App = {
   // DEBUG: true,

   // Register the event handlers.
   eventListener: (function () {
      // DOM (HTML+CSS) ready
      // window.addEventListener("DOMContentLoaded", () => {
      //    console.log('DOMContentLoaded');
      //    // window.removeEventListener("DOMContentLoaded", null);
      // });

      // window.addEventListener("loadstart", function (evt) {
      //    console.log('loadstart');
      //    // if (!(evt.target instanceof window.HTMLMediaElement)) return;
      //    // console.log("loadstart load");
      //    // window.removeEventListener("loadstart", null);
      //    // App.connect();
      // }, true);

      // CSS ready
      // document.addEventListener('transitionend', function (event) {
      //    console.log('transitionend', JSON.stringify(event.target.id));
      //    // console.log('event.propertyName', event.propertyName);
      //    // if (event.target.id === 'progress')
      //    // if (event.propertyName == 'top')
      // });

      // document.addEventListener('yt-preconnect-urls', function () {
      //    console.log('yt-preconnect-urls');
      //    // if (App.rerun && typeof (App.rerun) === 'function') return App.rerun();
      //    App.rerun();
      // });
      // document.addEventListener('yt-action', function (a) {
      //    console.log('yt-action', JSON.stringify(a));
      //    // if (App.rerun && typeof (App.rerun) === 'function') return App.rerun();
      // });

      // window.addEventListener('blur', function () {
      //    console.log('window blur');
      // });

      // window.addEventListener('focus', function () {
      //    console.log('window focus');
      // });
      // window.addEventListener('yt-preconnect-urls', function () {
      //    console.log('yt-preconnect-urls');
      // });

      // window.addEventListener("message", function (event) {
      //    // console.log('message', event.source);
      //    // if (event.source !== window) return;
      //    if (event.source !== window) console.warn('message warn');

      //    if (event.data.type) {
      //       console.log('event.data.value;', JSON.stringify(event.data.value));
      //    }
      // });

      // event.target.removeEventListener(event.type, arguments.callee);

      // window.dispatchEvent(new Event("resize"));
      //getEventListeners(window)
      //getEventListeners(document)

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         App.log("Message from the background script: %s", JSON.stringify(request));

         switch (request.action) {
            // case 'getOptions':
            //   let defaults = {};
            //   let resp = {};
            //   for (let key in defaults) {
            //       if (!(key in localStorage)) {
            //           localStorage[key] = defaults[key];
            //       }
            //       resp[key] = localStorage[key];
            //   }
            //   sendResponse(resp);
            // break;

            // if options is update
            case 'setOptions':
               // console.log('setOptions', JSON.stringify(request));

               App.storage.set(request.options);
               App.reversal_plugins(request.options);

               sendResponse({
                  reaction: "setOptions gotMessage"
               });
               break;

            case 'tabUpdated':
               // console.log('request.url', JSON.stringify(request.url));
               // App.rerun();
               break;

            case 'sendMessage':
               console.log(request.message);
               break;

            default:
               console.log('App onMessage switch default')
         }
      });

      document.addEventListener('yt-navigate-start', function () {
         // console.log('yt-navigate-start');
         // skip first run on page load
         if (App.is_new_url()) {
            App.rerun();
         }
      });
   }()),

   this_url: location.href,
   is_new_url: () => App.this_url === location.href ? false : App.this_url = location.href,

   // sessionSettings: null,
   storage: {
      set: options => {
         App.log('storage.set: %s', JSON.stringify(options));
         App.sessionSettings = options;

         let apiKeys = [
            "AIzaSyA-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA",
            "AIzaSyCXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA",
            "AIzaSyAgcQ6VzgBPjTY49pxeqHsIIDQgQ09Q4bQ"
         ];
         let getRandArrayItem = arr => arr[Math.floor(Math.random() * arr.length)];
         App.sessionSettings.api_key = getRandArrayItem(apiKeys);
      },

      load: callback => {
         // load store settings
         Storage.getParams(null /*all*/ , callback || App.storage.set, 'sync');
      },
      // load: callback => {
      //    // exclude re-receive settings
      //    chrome.runtime.sendMessage({
      //       action: 'getOptions'
      //    }, resp => {
      //       // if (callback && typeof (callback) === 'function') return callback(resp);
      //    });
      // }
   },

   reversal_plugins: sessionSettings => {
      if (sessionSettings && Object.keys(sessionSettings).length && sessionSettings['restart-app']) {
         App.log('reversal setting');

         if (sessionSettings['restart-app'] === 'soft') {
            console.log('soft restart');
            // App.rerun();

         } else if (sessionSettings['restart-app'] === 'full') {
            window.location.reload();
         }
      }
   },

   rerun: () => {
      App.log('page transition');
      Plugins.load(Plugins_list.one_off.concat(Plugins_list.plugins_end));
      App.run();
   },

   init: () => {
      App.log('init');
      App.storage.load();

      // load all Plugins
      Plugins.load((() => {
         let pl = [];
         for (i in Plugins_list) {
            for (p of Plugins_list[i]) pl.push(p);
         }
         return pl;
      })());

      let sandbox_wait_loaded = setInterval(() => {
         console.log('sandbox_wait_loaded');
         // wait load setting
         if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
            clearInterval(sandbox_wait_loaded);
            App.run();
         }
      }, 50);
   },

   run: () => {
      App.log('run');

      // if onYouTubePlayerReady is ready after init = ALL BROKEN
      // let plugins_execute = function (a, x) {
      //    return "//window.onYouTubePlayerReady = function (player) {\
      //          //console.log('onYouTubePlayerReady');\
      //          //if (!player) return;\
      //          // do staff
      //       //}";
      // };

      let preparation_for_execute = function (a, x) {
         return "plugins_run=" + Plugins.run + ";\
               _plugins_run = setInterval(() => {\
                  if (plugins_loaded) {\
                     clearInterval(_plugins_run);\
                     plugins_loaded = false;\
                     if (_plugins && _plugins.length) {\
                        plugins_run(" + a + "," + x + ");\
                     }\
                  }\
               }, 100)";
      };

      Plugins.injectScript(
         preparation_for_execute(
            JSON.stringify(YDOM.getPageType()),
            JSON.stringify(App.sessionSettings)
         )
      );
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('App:', msg);
      }
   },
}

App.init();
