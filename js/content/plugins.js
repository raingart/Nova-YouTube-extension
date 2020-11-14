const Plugins = {
   // DEBUG: true,

   list: {
      lib: [ 'ytc_lib.js' ],

      runOnce: [
         'player/speed.js',
         'player/volume.js',
         'player/quality.js',
         // 'player/pause.js',
         'player/pause-tab.js',
         'player/focused.js',
         'player/pin.js',
         'player/theater-mode.js',
         'player/time-jump.js',

         'other/scroll-to-top.js',
         'other/rating-bars.js',
         'other/normalize-video-title.js',
         'other/thumbnail-clear.js',
      ],

      runOnTransition: [
         // 'player/annotations.js',
         // 'player/ad-click.js',

         'details/expand-description.js',
         'details/channel-video-count.js',

         'comments/disable-comments.js',

         'sidebar/livechat-hide.js',

         'other/default-tab.js',
         'other/disable-trailer.js',
         // 'other/collapse-navigation-panel.js',
      ],
   },

   // filename: filepath => {
   //    return filepath.split(/[\\/]/g).pop().split('.')[0];
   // },

   // load: list => list.forEach(plugin => this.injectScript(chrome.extension.getURL('/plugins/' + plugin))),

   load(list) {
      list.forEach(plugin => {
         try {
            this.injectScript(chrome.extension.getURL('/plugins/' + plugin));
         } catch (error) {
            console.error(`plugin loading failed: ${plugin}\n${error}`);
         }
      })
   },

   injectScript(source = required()) {
      let s = document.createElement('script');
      s.type = "text/javascript";

      if (source.endsWith('.js')) {
         s.src = source;
         // s.async = true;
      } else {
         s.textContent = `(function () {
            ${source.toString()};
         })();`;
         // s.src = "data:text/plain;base64," + btoa(source);
         // s.src = 'data:text/javascript,' + encodeURIComponent(source)
      }

      (document.head || document.documentElement || document.getElementsByTagName("script")[0].parentNode)
         .appendChild(s);

      s.onload = () => {
         this.log('script loading:', String(s.src || s.textContent).substr(0, 100));
         // Remove <script> node after injectScript runs.
         s.parentNode.removeChild(s);
      };
   },

   run: store => {
      // console.debug('plugins loading count:', _plugins.length);
      const pageType = (function () {
         const page = location.pathname.split('/')[1];
         return (page == 'channel' || page == 'c' || page == 'user') ? 'channel' : page || 'main';
      })();

      // uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
      const uniqueArray = a => a.reduce((x, y) => x.findIndex(e => e.id == y.id) < 0 ? [...x, y] : x, []);
      _plugins = uniqueArray(_plugins); // Important! Global store overwrite

      let logTableArray = [],
         logTableStatus,
         logTableTime;

      // console.groupCollapsed('plugins');
      for (const i in _plugins) {
         const plugin = _plugins[i];
         const pluginDepends = plugin.depends_page.split(',').map(i => i.trim().toLowerCase());

         logTableTime = 0;
         logTableStatus = false;
         if (
            (pluginDepends.includes(pageType)
               || (pluginDepends.includes('all') && !pluginDepends.includes('-' + pageType)))
            && store && store[plugin.id]) {
            try {
               //'use strict';
               const startTableTime = performance.now();
               plugin._runtime(store);
               logTableTime = (performance.now() - startTableTime).toFixed(2);
               delete _plugins[i]; // Important! Global store remove
               logTableStatus = true;

               // try { // for test
            } catch (err) {
               console.groupEnd('plugins status'); // out-of-group display
               console.error(`[ERROR PLUGIN] ${plugin.name}\n${err.stack}\n\nPlease report the bug or disable the plugin`);
               alert(`Detected error in New Horizons for YouTube™\nError from plugin - "${plugin.name}"\n\nDetails in the console.`);
               // console.dir(plugin); // show plugin structure
               console.groupCollapsed('plugins status'); // resume console group
               logTableStatus = 'ERROR';
            }
         }
         // else console.debug('plugin skiping', plugin.name);
         logTableArray.push({
            'launched': logTableStatus,
            'name': plugin.name,
            'time init (ms)': logTableTime,
         });
      }
      console.table(logTableArray);
      console.groupEnd('plugins status');
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   }
}
