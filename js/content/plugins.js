const Plugins = {
   // DEBUG: true,

   // filename: filepath => {
   //    return filepath.split(/[\\/]/g).pop().split('.')[0];
   // },

   load: list => list.forEach(plugin => {
      try {
         Plugins.injectScript(chrome.extension.getURL('/plugins/' + plugin));
      } catch (error) {
         console.error(`plugin loading failed: ${plugin}\n${error}`);
      }
   }),

   injectScript: (source = required()) => {
      let s = document.createElement('script');
      s.type = "text/javascript";

      if (source.slice(-3) === '.js') {
         s.src = source;
         // s.async = true;
      } else {
         s.textContent = source.toString() + ';';
         // s.src = "data:text/plain;base64," + btoa(source);
         // s.src = 'data:text/javascript,' + encodeURIComponent(source)
      }

      (document.head || document.documentElement || document.getElementsByTagName("script")[0].parentNode)
         .appendChild(s);

      s.onload = () => {
         Plugins.log('script loading: %s', String(s.src || s.textContent).substring(0, 100));
         // Remove <script> node after injectScript runs.
         s.parentNode.removeChild(s);
      };
   },

   run: (pageType = required(), store) => {
      // console.log('plugins loading count:', _plugins.length);

      // uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
      uniqueArray = a => a.reduce((x, y) => x.findIndex(e => e.name == y.name) < 0 ? [...x, y] : x, []);
      _plugins = uniqueArray(_plugins);

      for (const i in _plugins) {
         let plugin = _plugins[i];
         let pluginDepends = plugin.depends_page.split(',').map(i => i.trim().toLowerCase());
         if (
            (pluginDepends.includes(pageType) || (pluginDepends.includes('all') && !pluginDepends.includes('-' + pageType)))
            && store && store[plugin.id]) {

            try {
               console.log('plugin executing:', plugin.name);
               //'use strict';
               plugin._runtime(store);
               delete _plugins[i];

            } catch (err) {
               console.error(`plugin error: ${plugin.name}\n${err}`);
               alert(`ERROR plugin "${plugin.name}"\nTry disable this plugin\n${err}`);
            }
         }
         // else console.log('plugin skiping', plugin.name);
      }
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('Plugins:', msg);
      }
   },
}
