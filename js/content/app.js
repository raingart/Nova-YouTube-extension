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

      document.addEventListener('yt-navigate-start', () => {
         // skip first run on page load
         App.is_new_url() && App.rerun();
      });
   }()),

   this_url: location.href,

   is_new_url: () => App.this_url === location.href ? false : App.this_url = location.href,

   getToken: (function () {
      const YOUTUBE_API_KEYS = [
         'A-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA', 'CXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA',
         'AgcQ6VzgBPjTY49pxeqHsIIDQgQ09Q4bQ', 'AQt1mEVq6zwVBjwx_lcJkQoAAxGExgN7A',
         'AGosg8Ncdqw8IrwV4iT9E1xCIAVvg4CBw',
      ];
      const getRandArrayItem = arr => arr[Math.floor(Math.random() * arr.length)];
      return 'AIzaSy' + getRandArrayItem(YOUTUBE_API_KEYS);
   }()),

   // sessionSettings: null,
   storage: {
      set: options => {
         App.log('storage.set: %s', JSON.stringify(options));
         App.sessionSettings = options;
         App.sessionSettings.api_key = App.getToken;
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
      App.log('init');
      App.storage.load();

      Plugins.injectScript('_plugins = []');

      let pluginsLoadedCount;
      // load all Plugins
      Plugins.load((() => {
         let pl = [];
         for (i in Plugins_list) Plugins_list[i].forEach(p => pl.push(p));
         pluginsLoadedCount = pl.length - 1; // with the exception of "lib"
         return pl;
      })());

      let settings_loaded = setInterval(() => {
         App.log('settings_loaded');
         // wait load setting
         if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
            clearInterval(settings_loaded);
            App.run(pluginsLoadedCount);
         }
      }, 50);
   },

   run: pluginsLoadedCount => {
      App.log('run');
      let preparation_execute = function () {
         let _plugins_run = setInterval(() => {
            console.log('plugins loaded:', _plugins.length);
            if (_plugins && (!_pluginsLoadedCount || _plugins.length === _pluginsLoadedCount)) {
               clearInterval(_plugins_run);
               _plugins_executor(_typePage, _sessionSettings);
            }

         }, 100);
      };

      let scriptText = 'let _plugins_executor = ' + Plugins.run + ';\n';
      scriptText += 'let _pluginsLoadedCount = ' + pluginsLoadedCount + ';\n';
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
