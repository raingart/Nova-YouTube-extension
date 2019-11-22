const App = {
   // DEBUG: true,

   // Register the event handlers.
   eventListener: (function () {

      // document.addEventListener('yt-preconnect-urls', function () {
      //    console.log('yt-preconnect-urls');
      // });
      // document.addEventListener('yt-action', function (a) {
      //    console.log('yt-action', JSON.stringify(a));
      // });

      // event.target.removeEventListener(event.type, arguments.callee);

      //window.dispatchEvent(new Event("resize"));
      //getEventListeners(window)
      //getEventListeners(document)

      // also change "APIKeysStoreName" in file '/js/background.js', '/plugins/ytc_lib.js'
      const APIKeysStoreName = 'YOUTUBE_API_KEYS';

      // set youtubeApiKeys
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         if (chrome.runtime.id != sender.id) return;
         App.log('onMessage request: %s', JSON.stringify(request.action || request));
         if (request.action === APIKeysStoreName) {
            App.log(`get and save ${APIKeysStoreName} in localStorage`, JSON.stringify(request.options));
            localStorage.setItem(APIKeysStoreName, JSON.stringify(request.options));
         }
      });

      // youtubeApiKeys dont has
      if (!Array.isArray(JSON.parse(localStorage.getItem(APIKeysStoreName) || 'null'))) {
         // Cannot access 'App' before initialization, because 'console.log' and not the 'App.log'
         console.log('onMessage REQUESTING_' + APIKeysStoreName);
         chrome.runtime.sendMessage('REQUESTING_' + APIKeysStoreName);
      }

      // skip first run on page load
      document.addEventListener('yt-navigate-start', () => App.isNewUrl() && App.rerun());
   }()),

   thisUrl: location.href, // prev state

   isNewUrl: () => App.thisUrl === location.href ? false : App.thisUrl = location.href,

   // sessionSettings: null,
   storage: {
      set: options => {
         App.log('storage.set: %s', JSON.stringify(options));
         App.sessionSettings = options;
      },

      load: callback => {
         // load store settings
         Storage.getParams(callback || App.storage.set, 'sync');
      },
   },

   rerun: () => {
      setTimeout(() => { // to avoid premature start. Dirty trick
         console.info('page transition');
         Plugins.load(Plugins_list.runOnTransition);
         App.run();
      }, 500);
   },

   init: () => {
      const manifest = chrome.runtime.getManifest();
      console.log("loaded %c %s ", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:24px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;', manifest.name, 'v ' + manifest.version);

      App.storage.load();

      Plugins.injectScript('_plugins = []');

      let pluginsExportedCount;
      // load all Plugins
      Plugins.load((() => {
         let pl = [];
         for (const i in Plugins_list) Plugins_list[i].forEach(p => pl.push(p));
         pluginsExportedCount = pl.length - 1; // with the exception of "lib"
         return pl;
      })());

      let settings_loaded = setInterval(() => {
         App.log('settings_loaded');
         // wait load setting
         if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
            clearInterval(settings_loaded);
            App.run(pluginsExportedCount);
         }
      }, 50);
   },

   getPageType: () => {
      const page = location.pathname.split('/')[1];
      return (page == 'channel' || page == 'user') ? 'channel' : page || 'main';
   },

   run: pluginsExportedCount => {
      App.log('run');
      let preparation_execute = function () {
         let _plugins_run = setInterval(() => {
            let documentLoaded = () => document.readyState === "complete" || document.readyState === "interactive";

            if (!documentLoaded && document.querySelectorAll("#progress[style*=transition-duration], yt-page-navigation-progress:not([hidden])").length) {
               console.log('waiting, page loading..');
               return;
            }

            console.log(`plugins loaded: ${_plugins.length}/${_pluginsExportedCount} | page type: ${_pageType}`);

            if (_pluginsExportedCount === undefined || _plugins.length >= _pluginsExportedCount) {
               clearInterval(_plugins_run);
               _plugins_executor(_pageType, _sessionSettings);
            }
            // force run "_plugins_executor" after 2000 ms
            setTimeout(() => {
               if (_plugins.length < _pluginsExportedCount) _pluginsExportedCount = undefined;
            }, 2000);

         }, 100);
      };

      const scriptText = [
         `let _plugins_executor = ${Plugins.run}`,
         `let _pluginsExportedCount = ${pluginsExportedCount}`,
         `let _pageType = "${App.getPageType()}"`,
         `let _sessionSettings = ${JSON.stringify(App.sessionSettings)}`,
         `( ${preparation_execute.toString()} ())`
      ].join(';\n');

      Plugins.injectScript(`(function () { ${scriptText} })()`);
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
