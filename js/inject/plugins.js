console.log(": init plugins.js");

// sandbox
var _plugins = [];

const Plugins = {

   // DEBUG: true,

   list_plugins: {
      request: [
         '/js/inject/ytc_lib.js'
      ],
      direct: [
         'player/stop-video-autoplay.js',
         'player/stop-video-preload.js',
         'player/set-video-quality.js',
         'player/set-volume-mousewheel.js',
         // 'player/set-video-speed.js',
      ],
      sandbox: [
         'channel/collapse-navigation-panel.js',
         'channel/set-default-channel-tab.js',
         // 'channel/-autopause-homepage-video.js',

         'comments/disable-comments.js',

         'details/reveal-video-description.js',

         'description/show-channel-video-count.js',
         'description/show-video-age.js',

         // 'player/fixed-video-scroll.js',
         // 'player/remove-video-annotations.js',
      ],
   },

   load: {
      sandbox: () => {
         Plugins.list_plugins.sandbox.forEach(plugin => {
            Plugins.injectScript.in_sandbox('/plugins/' + plugin);
         });
         App.sandbox_loaded = true;
      },

      direct_init: () => { //opt.js - plugins.js:128 Refused to execute inline script because it violates the following Content Security Policy directive
         // init conteiner direct
         Plugins.injectScript.in_direct('var _plugins = []', 'script');

         // request
         Plugins.list_plugins.request.forEach((plugin) => {
            Plugins.injectScript.in_direct(chrome.extension.getURL(plugin));
         });
      },

      direct: arr => {
         let pl = arr && arr.length ? arr : Plugins.list_plugins.direct;

         // plugins
         pl.forEach(plugin => {
            Plugins.injectScript.in_direct(chrome.extension.getURL('/plugins/' + plugin));
         });
      },
   },

   // filename: filepath => {
   //    return filepath.split(/[\\/]/g).pop().split('.')[0];
   // },

   run: function (depends, store) {
      this.DEBUG && console.log('plugins loading count:' + String(_plugins ? _plugins.length : 'null') + ', page:' + depends);

      // console.log('store', JSON.stringify(store));
      for (const plugin of _plugins) {
         // console.log('plugin ' + JSON.stringify(plugin));

         if ((plugin.depends_page && plugin.depends_page.indexOf(depends) > -1) &&
            store[plugin.id]) {

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

   // injectStyle: src => {
   //    chrome.runtime.sendMessage({
   //       "action": "injectStyle",
   //       "code": code
   //    });
   //    // console.log('style injected:', chrome.extension.getURL(src));
   // },

   injectScript: { //runtime
      in_sandbox: src => {
         chrome.runtime.sendMessage({
            "action": "injectScript",
            "src": src
         });
         Plugins.log('script injected:', chrome.extension.getURL(src));
      },

      in_direct: (source, type) => {
         let s;
         // js
         if (type === 'script' || source.slice(-3) === '.js') {
            s = document.createElement("script");
            s.type = "text/javascript";
            // s.onload = s.onerror = function () {
            //    this.remove();
            // };
            if (source.slice(-3) === '.js') {
               s.src = source;
               // s.async = true;
               if (Plugins.DEBUG) s.addEventListener("load", () => console.log('script loading:', s.src));
            } else {
               // s.src = "data:text/plain;base64," + btoa(source);
               // s.src = 'data:text/javascript,' + encodeURIComponent(source)
               s.textContent = source.toString() + ";";
            }

            // css
         } else if (type === 'style' || source.slice(-3) === '.css') {
            s = document.createElement("style");
            s.type = 'text/css';

            if (source.slice(-3) === '.css') {
               s.src = source;
               s.addEventListener("load", () => console.log('style loading: %s', s.src));
            } else if (s.styleSheet) {
               s.styleSheet.cssText = source;
            } else {
               s.appendChild(document.createTextNode(source));
            }
         } else {
            return false;
         }

         // DOM export
         try {
            document.head.appendChild(s);
            // document.documentElement.appendChild(s);
            // document.getElementsByTagName("script")[0].parentNode.appendChild(s);
         } catch (e) {
            console.error('append script/style error: %s\n%s', s, e);
         }
      },
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('Plugins:', msg);
      }
   },




   // pre_pl_request: () => {
   //    for (const i in _plugins) {
   //       let plugin_id = _plugins[i];

   //       if (plugin_id.depends_request) {
   //          Plugins.pl_request_add(plugin_id.depends_request);
   //       }
   //       // _plugins.splice(i, 1);
   //    }
   //    Plugins.pl_request_run (
   //       function (res) {
   //       // Plugins.plugin_request_data_2 = res;
   //       console.log('Plugins.googleapis', JSON.stringify(Plugins.googleapis));
   //    }
   //    );
   // },

   // save data from request
   // googleapis: {
   //    videos: null,
   //    channels: null,
   // },

   // // request param
   // pl_request_param: {
   //    videos: [],
   //    channels: []
   // },

   // // request param add
   // pl_request_add: newItems => {
   //    for (var k in newItems) {
   //       Plugins.pl_request_param[k].push(...newItems[k])
   //       // newItems[k].toString().split(',')
   //       //    .map((v) => Plugins.pl_request_param[k].push(v));

   //       //unique
   //       Plugins.pl_request_param[k] = Plugins.pl_request_param[k].toString().split(',').filter((value, index, self) => self.indexOf(value) === index)
   //    }
   //    console.log('1pn_request_data', JSON.stringify(Plugins.pl_request_param));
   // },

   // pl_request_run: callback => {
   //    let channel_url = element.getAttribute("href").split('/');
   //    let channel_id = channel_url[channel_url.length - 1];

   //    if (!channel_id.match(/UC([a-z0-9-_]{22})/i)) {
   //       console.error('channel_id is not valid');
   //       return false;
   //    }

   //    if (pl_request_param.videos.length) {
   //       let url = "https://www.googleapis.com/youtube/v3/videos" +
   //          "?id=" + video_id +
   //          '&key=' + App.sessionSettings.api_key +
   //          // '&part=snippet';
   //          '&part=' + pl_request_param.videos.join();

   //       let _callback = (res) => {
   //          Plugins.googleapis.videos = res;
   //          if (callback && typeof (callback) === 'function') return callback();
   //       };

   //       HTTP_request.fetch(url, {}, 'json', _callback);
   //    }

   // videos[0]snippet.channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw",

   // if (pl_request_param.channels.length) {
   //    let url = "https://www.googleapis.com/youtube/v3/channels" +
   //       "?id=" + channel_id +
   //       '&key=' + App.sessionSettings.api_key +
   //       '&part=' + pl_request_param.channels.join();

   //    // let payload = request.payload || {
   //    //    /*
   //    //       'method': 'GET',
   //    //       mode: 'no-cors', 
   //    //       'payload': {
   //    //          'client': 'gtx', // official Google Translate extension
   //    //       }*/
   //    // };
   //    let _callback = (res) => {
   //       Plugins.googleapis.channels = res;
   //       if (callback && typeof (callback) === 'function') return callback();
   //    };
   //    HTTP_request.fetch(url, {}, 'json', _callback);
   // }
   // },
}
