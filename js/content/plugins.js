console.log(": init plugins.js");

// sandbox
let _plugins = [];

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

   injectScript: source => {
      let s = document.createElement('script');
      s.type = "text/javascript";

      if (source.slice(-3) === '.js') {
         s.src = source;
         // s.async = true;
      } else {
         s.textContent = source.toString() + ";";
         // s.src = "data:text/plain;base64," + btoa(source);
         // s.src = 'data:text/javascript,' + encodeURIComponent(source)
      }

      (document.head || document.documentElement || document.getElementsByTagName("script")[0].parentNode)
      .appendChild(s);

      s.onload = function () {
         console.log('script loading:', s.src);
         s.parentNode.removeChild(s);
      };

      // s.onload = s.onerror = function () {
      //    this.remove();
      // };
   },

   run: function (depends, store) {
      this.DEBUG && console.log('plugins loading count:' + String(_plugins ? _plugins.length : 'null') + ', page:' + depends);

      // console.log('store', JSON.stringify(store));
      for (const plugin of _plugins) {
         // console.log('plugin ' + JSON.stringify(plugin));

         if ((plugin.depends_page && plugin.depends_page.indexOf(depends) > -1) &&
            store && store[plugin.id]) {

            try {
               console.log('plugin executing:', plugin.name);
               //'use strict';
               plugin._runtime(store);

            } catch (error) {
               console.error('plugin error: %s\n%s', plugin.name, error);
            }
         } else this.DEBUG && console.log('plugin skiping', plugin.name);

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
