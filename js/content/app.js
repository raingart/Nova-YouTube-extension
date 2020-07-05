const App = {
   // DEBUG: true,

   // Register the event handlers.
   eventListener: (function () {
      // skip first run on page load
      document.addEventListener('yt-navigate-start', () => App.isNewUrl() && App.rerun());
   }()),

   thisUrl: location.href, // prev state

   isNewUrl: () => App.thisUrl === location.href ? false : App.thisUrl = location.href,

   rerun() {
      setTimeout(() => { // to avoid premature start. Dirty trick
         console.info('page transition');
         Plugins.load(Plugins_list.runOnTransition);
         this.run();
      }, 500);
   },

   _ytcAPIKeys: (function () {
      const APIKeysStoreName = 'YOUTUBE_API_KEYS';
      // set and store
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         App.log('onMessage request:', request);
         if (chrome.runtime.id != sender.id) return;

         if (request.action === APIKeysStoreName && Array.isArray(request.options) || !request.options.length) {
            App.log(`get and save ${APIKeysStoreName} in localStorage`, JSON.stringify(request.options));
            localStorage.setItem(APIKeysStoreName, JSON.stringify(request.options));
         }
      });
      // request
      chrome.runtime.sendMessage('REQUESTING_' + APIKeysStoreName);
   }()),

   // sessionSettings: null,
   storage: {
      set(options) {
         App.log('storage.set:', JSON.stringify(options));
         App.sessionSettings = options;
      },

      // load store settings
      load: callback => Storage.getParams(callback || App.storage.set, 'sync'),
   },

   init() {
      const manifest = chrome.runtime.getManifest();
      console.log("loading %c %s ", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:24px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;', manifest.name, 'v.' + manifest.version);

      this.storage.load();

      Plugins.injectScript('_plugins = [];');

      let pluginsExportedCount;
      // load all Plugins
      Plugins.load((function () {
         const plugins = [].concat(...Object.values(Plugins_list));
         pluginsExportedCount = plugins.length - 1; // with the exception of "lib"
         return plugins;
      })());

      let settings_loaded = setInterval(() => {
         this.log('settings loaded');
         // wait load setting
         if (this.sessionSettings && Object.keys(this.sessionSettings).length) {
            clearInterval(settings_loaded);

            // in the iframe
            if (this.sessionSettings?.disableInFrame && top !== self) {
               console.warn('processed in the frame disable')
               return;
            }

            this.run(pluginsExportedCount);
         }
      }, 125); // 125ms
   },

   run(pluginsExportedCount = 0) {
      this.log('App runing');
      const preparation_execute = function () {
         'use strict';
         let _plugins_connect = setInterval(() => {
            const docLoaded = document.readyState === "complete" || document.readyState === "interactive";

            if (!docLoaded && document.querySelectorAll("#progress[style*=transition-duration], yt-page-navigation-progress:not([hidden])").length) {
               console.log('waiting, page loading..');
               return;
            }

            console.log(`plugins loaded: ${_plugins.length}/${_pluginsExportedCount}`);

            // force run "_plugins_executor" after some time
            let _force_plugins_connect = setTimeout(() => {
               console.warn('force plugins connect');
               _pluginsExportedCount = undefined;
            }, 1000 * 6); // 6sec

            if (_plugins.length && (!_pluginsExportedCount || _plugins.length >= _pluginsExportedCount)) {
               clearInterval(_plugins_connect);
               _plugins_executor(_sessionSettings);
               clearTimeout(_force_plugins_connect);
            }

         }, 100); // 100ms
      };

      const scriptText =
         `const _plugins_executor = ${Plugins.run};
         const _pluginsExportedCount = ${pluginsExportedCount};
         const _sessionSettings = ${JSON.stringify(this.sessionSettings)};
         ( ${preparation_execute.toString()} ());`;

      Plugins.injectScript(scriptText);
   },

   log(...agrs) {
      // console.log('all Property', Object.getOwnPropertyNames(this));
      this.DEBUG && agrs?.length && console.log(...agrs);
   },
}

App.init();


// document.addEventListener('yt-action', function (event) {
//    console.log('yt-action', JSON.stringify(event.type));
//    console.log('yt-action', JSON.stringify(event.target));
//    console.log('yt-action', JSON.stringify(event.data));
//    console.log('yt-action', event);
//    console.log('yt-action', event.detail?.actionName, event);

//    yt-action ytd-update-mini-guide-state-action
//    yt-action yt-miniplayer-active-changed-action
//    yt-action ytd-update-guide-opened-action
//    yt-action yt-initial-video-aspect-ratio
//    yt-action yt-get-mdx-status
//    yt-action ytd-update-guide-state-action
//    yt-action yt-get-mdx-status
//    yt-action yt-forward-redux-action-to-live-chat-iframe
//    yt-action ytd-update-active-endpoint-action
//    yt-action yt-close-all-popups-action
//    yt-action ytd-watch-player-data-changed
//    yt-action yt-cache-miniplayer-page-action
//    yt-action yt-deactivate-miniplayer-action

//    yt-action yt-miniplayer-active
//    yt-action yt-pause-active-page-context
//    yt-action ytd-log-youthere-nav
//    yt-action yt-prepare-page-dispose
//    yt-action yt-user-activity
//    yt-action yt-deactivate-miniplayer-action
// });


// for inspect
// getEventListeners(document.querySelector('video'));
// window.dispatchEvent(new Event("resize"));
// getEventListeners(window)
// getEventListeners(document)
