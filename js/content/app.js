const App = {
   // DEBUG: true,

   // Register the event handlers.
   eventListener: (function () {
      // skip first run on page load
      document.addEventListener('yt-navigate-start', () => App.URL.isChange() && App.rerun());
   }()),

   URL: {
      current: location.href, // prev state
      isChange: () => this.current == location.href ? false : this.current = location.href,
   },

   rerun() {
      setTimeout(() => { // to avoid premature start. Dirty trick
         console.info('page transition');
         Plugins.load(Plugins.list.runOnTransition);
         this.run();
      }, 600);
   },

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
      // console.log('%c /* %s */', 'color: #0096fa; font-weight: bold;', manifest.name + ' v.' + manifest.version);
      console.log("loading %c %s", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;', manifest.name, 'v.' + manifest.version);

      this.storage.load();

      Plugins.injectScript('_plugins = [];');

      let pluginsExportedCount;
      // load all Plugins
      Plugins.load((function () {
         const plugins = [].concat(...Object.values(Plugins.list));
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
      const script_lander = function () {
         'use strict';

         let forceLander = setTimeout(() => {
            console.warn('force plugins lander:', `${_plugins.length}/${_pluginsExportedCount}`);
            processLander();
         }, 1000 * 6); // 6sec

         let plugins_lander = setInterval(() => {
            const docLoaded = document.readyState === "complete" || document.readyState === "interactive";

            if (!docLoaded && document.querySelectorAll("#progress[style*=transition-duration], yt-page-navigation-progress:not([hidden])").length) {
               console.debug('waiting, page loading..');
               return;
            }

            if (_plugins.length && _plugins.length >= _pluginsExportedCount) {
               clearTimeout(forceLander);
               processLander();
            } else {
               console.debug('plugins loading:', `${_plugins.length}/${_pluginsExportedCount}`);
            }

         }, 100); // 100ms

         function processLander () {
            console.groupCollapsed('plugins status');
            clearInterval(plugins_lander);
            _plugins_executor(_sessionSettings);
         }
      };

      const scriptText =
         `const
            _plugins_executor = ${Plugins.run},
            _pluginsExportedCount = ${pluginsExportedCount},
            _sessionSettings = ${JSON.stringify(this.sessionSettings)};

         ( ${script_lander.toString()} ());`;

      Plugins.injectScript(scriptText);

      // console.debug('all Property', Object.getOwnPropertyNames(this));
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   },
}

App.init();

// document.addEventListener('yt-action', function (event) {
//    console.debug('yt-action', JSON.stringify(event.type));
//    console.debug('yt-action', JSON.stringify(event.target));
//    console.debug('yt-action', JSON.stringify(event.data));
//    console.debug('yt-action', event);
//    console.debug('yt-action', event.detail?.actionName, event);

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

// example url new embed page
// https://www.youtube-nocookie.com/embed/hXTqP_o_Ylw?autoplay=1&autohide=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1
