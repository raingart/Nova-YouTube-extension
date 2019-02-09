const Plugins = {
   // DEBUG: true,

   // filename: filepath => {
   //    return filepath.split(/[\\/]/g).pop().split('.')[0];
   // },

   load: list => {
      list.forEach(plugin =>
         Plugins.injectScript(chrome.extension.getURL('/plugins/' + plugin))
      );
   },

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

   run: (depends = required(), store) => {
      this.DEBUG && console.log('plugins loading count:' + (_plugins ? _plugins.length : 'null') + ', page:' + depends);

      // uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
      uniqueArray = a => a.reduce((x, y) => x.findIndex(e => e.name == y.name) < 0 ? [...x, y] : x, []);
      _plugins = uniqueArray(_plugins);

      // console.log('store', JSON.stringify(store));
      for (const i in _plugins) {
         let plugin = _plugins[i];
         // console.log('plugin ' + JSON.stringify(plugin));

         if ((plugin.depends_page && (plugin.depends_page.indexOf(depends) !== -1) || plugin.depends_page == 'all') && store && store[plugin.id]) {

            try {
               console.log('plugin executing:', plugin.name);
               //'use strict';
               plugin._runtime(store);

               delete _plugins[i];

            } catch (err) {
               console.trace();
               console.error('plugin error: %s\n%s', plugin.name, err);
               // alert(plugin.name\n + err.slice(25));
            }
         } else this.DEBUG && console.log('plugin skiping', plugin.name);
      }
      // console.log('plugin ' + JSON.stringify(_plugins));
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
