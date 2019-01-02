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

      document.addEventListener('yt-navigate-start', function () {
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
         Storage.getParams(null /*all*/ , callback || App.storage.set, 'sync');
      },
   },

   rerun: () => {
      console.info('page transition');
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
         App.log('sandbox_wait_loaded');
         // wait load setting
         if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
            clearInterval(sandbox_wait_loaded);
            App.run();
         }
      }, 50);
   },

   run: () => {
      App.log('run');

      let preparation_for_execute = '_plugins_executor= ' + Plugins.run + ';\n' +
         '_plugins_run = setInterval(() => {\n' +
         'try {\n' +
         'if (plugins_loaded) {\n' +
         '  clearInterval(_plugins_run);\n' +
         '  plugins_loaded = false;\n' +
         '  if (_plugins && _plugins.length) {\n' +
         '     _plugins_executor(' +
         JSON.stringify(YDOM.getPageType()) + ',' + JSON.stringify(App.sessionSettings) + ');\n' +
         '  }\n' +
         '}\n' +
         '} catch (err) { console.info("_plugins_run:", err) }\n' +
         '}, 100)';

      Plugins.injectScript(preparation_for_execute);
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
