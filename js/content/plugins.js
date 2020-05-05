const Plugins = {
   // DEBUG: true,

   // filename: filepath => {
   //    return filepath.split(/[\\/]/g).pop().split('.')[0];
   // },

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
         Plugins.log('script loading:', String(s.src || s.textContent).substr(0, 100));
         // Remove <script> node after injectScript runs.
         s.parentNode.removeChild(s);
      };
   },

   run: store => {
      // console.log('plugins loading count:', _plugins.length);
      const pageType = (function () {
         const page = location.pathname.split('/')[1];
         return (page == 'channel' || page == 'user') ? 'channel' : page || 'main';
      })();

      // uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
      uniqueArray = a => a.reduce((x, y) => x.findIndex(e => e.name == y.name) < 0 ? [...x, y] : x, []);
      _plugins = uniqueArray(_plugins);

      for (const i in _plugins) {
         const plugin = _plugins[i];
         const pluginDepends = plugin.depends_page.split(',').map(i => i.trim().toLowerCase());
         if (
            (pluginDepends.includes(pageType) || (pluginDepends.includes('all') && !pluginDepends.includes('-' + pageType)))
            && store && store[plugin.id]) {

            try {
               console.log('plugin executing:', plugin.name);
               //'use strict';
               plugin._runtime(store);
               delete _plugins[i];

               // try { // for test
            } catch (err) {
               console.error(`[PLUGIN ERROR]\n${err.stack}`);
               alert('An error was detected in one of the "New Horizons for YouTube™" plugins!\n\nDetails in the console.\nPlease report a bug or disable the plugin');
            }
         }
         // else console.log('plugin skiping', plugin.name);
      }
   },

   log(...agrs) {
      this.DEBUG && agrs?.length && console.log(...agrs);
   },
}
