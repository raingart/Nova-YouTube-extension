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

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         if (chrome.runtime.id != sender.id) return;
         App.log('onMessage request: %s', JSON.stringify(request.action || request));
         if (request.action === "YOUTUBE_API_KEYS") {
            sessionStorage.setItem('YOUTUBE_API_KEYS', JSON.stringify(request.options));
         }
      });

      chrome.runtime.sendMessage("get_YOUTUBE_API_KEYS");

      document.addEventListener('yt-navigate-start', () => {
         // skip first run on page load
         App.is_new_url() && App.rerun();
      });
   }()),

   this_url: location.href,

   is_new_url: () => App.this_url === location.href ? false : App.this_url = location.href,

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
      console.info('page transition');
      Plugins.load(Plugins_list.runOnTransition);
      App.run();
   },

   init: () => {
      const manifest = chrome.runtime.getManifest();
      console.log("init: %c %s ", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:24px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;', manifest.name, 'v ' + manifest.version);
      // App.log('init');
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

   run: pluginsExportedCount => {
      App.log('run');
      let preparation_execute = function () {
         let _plugins_run = setInterval(() => {
            let documentLoaded = () => document.readyState === "complete" || document.readyState === "interactive";

            if (!documentLoaded && document.querySelectorAll("#progress[style*=transition-duration], yt-page-navigation-progress:not([hidden])").length) {
               console.log('waiting page load..');
               return;
            }

            console.log(`plugins loaded: ${_plugins.length}/${_pluginsExportedCount} | page type: ${_typePage}`);

            if (_pluginsExportedCount === undefined || _plugins.length >= _pluginsExportedCount) {
               clearInterval(_plugins_run);
               _plugins_executor(_typePage, _sessionSettings);
            }
            // force run "_plugins_executor" after 2000 ms
            setTimeout(() => {
               if (_plugins.length < _pluginsExportedCount) _pluginsExportedCount = undefined;
            }, 2000);

         }, 100);
      };

      let scriptText = 'let _plugins_executor = ' + Plugins.run + ';\n';
      scriptText += 'let _pluginsExportedCount = ' + pluginsExportedCount + ';\n';
      scriptText += 'let _typePage = "' + YDOM.getPageType() + '";\n';
      scriptText += 'let _sessionSettings = ' + JSON.stringify(App.sessionSettings) + ';\n';
      scriptText += '(' + preparation_execute.toString() + '())';

      Plugins.injectScript('(function () {' + scriptText + '})()');
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
