const App = {
   // DEBUG: true,

   // Register the event handlers.
   eventListener: (function () {
      // skip first run on page transition
      document.addEventListener('yt-navigate-start', () => App.url.isChange() && App.rerun());
   }()),

   url: {
      current: location.href, // prev state
      isChange: () => App.url.current == location.href ? false : App.url.current = location.href,
   },

   rerun() {
      App.log('page transition');
      this.run(true);
   },

   // sessionSettings: null,
   storage: {
      set(options) {
         App.log('storage.set:', options);
         App.sessionSettings = options;
         // in the iframe
         if (options?.disable_in_frame && top !== self) return console.warn('processed in the frame disable');

         const reflectException = ({ trace_name, err_stack, confirm_msg, app_ver }) => {
            if (confirm(confirm_msg || 'Error in New Horizons for YouTube™. Open popup to report the bug?')) {
               window.open(
                  'https://docs.google.com/forms/u/0/d/e/1FAIpQLScfpAvLoqWlD5fO3g-fRmj4aCeJP9ZkdzarWB8ge8oLpE5Cpg/viewform'
                  + '?entry.35504208=' + encodeURIComponent(trace_name)
                  + '&entry.151125768=' + encodeURIComponent(err_stack)
                  + '&entry.744404568=' + encodeURIComponent(location.href)
                  + '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent)
                  , '_blank');
            }
         };

         // capture promise exception
         Plugins.injectScript(
            `const _pluginsCaptureException = ${reflectException};
            window.addEventListener('unhandledrejection', err => {
               if (!err.reason.stack.toString().includes(${JSON.stringify(chrome.runtime.id)})) return;
               console.error(\`[ERROR PROMISE]\n\`, err.reason, \`\nPlease report the bug: https://github.com/raingart/New-Horizons-for-YouTube-extension/issues/new/choose\`);

               if (${options?.report_issues ? true : false})
                  _pluginsCaptureException({
                     'trace_name': 'unhandledrejection',
                     'err_stack': err.reason.stack,
                     'app_ver': '${chrome.runtime.getManifest().version}',
                     'confirm_msg': \`Failure when async-call of one Horizons for YouTube™ plugin.\n\nOpen tab to report the bug?\`,
                  });
            });`);

         App.run();
      },

      // load store user_settings
      load: callback => Storage.getParams(callback || App.storage.set, 'sync'),
   },

   init() {
      const manifest = chrome.runtime.getManifest();
      console.log('%c /* %s */', 'color: #0096fa; font-weight: bold;', manifest.name + ' v.' + manifest.version);

      this.storage.load();
      // load all Plugins
      Plugins.injectScript('var _plugins_conteiner = [];');
      Plugins.load(['ytc_lib.js']);
      Plugins.load(); // all
   },

   run(is_new_url) {
      this.log('App runing');

      Plugins.injectScript(
         `( ${this.lander.toString()} ({
            'plugins_executor': ${Plugins.run},
            'user_settings': ${JSON.stringify(this.sessionSettings)},
            'is_new_url': ${is_new_url},
            'plugins_count': ${Plugins.list.length},
            'app_ver': '${chrome.runtime.getManifest().version}',
         }));`
      );

      // console.debug('all Property', Object.getOwnPropertyNames(this));
   },

   lander: function ({ plugins_executor, user_settings, is_new_url, plugins_count, app_ver }) {
      // console.debug('lander', ...arguments);
      console.groupCollapsed('plugins status');

      let forceLander = setTimeout(() => {
         console.debug('force lander:', _plugins_conteiner.length + '/' + plugins_count);
         processLander();
      }, 1000 * 5); // 5sec

      let plugins_lander = setInterval(() => {
         const domLoaded = document?.readyState !== 'loading';

         if (!domLoaded && document.querySelectorAll("#progress[style*=transition-duration], yt-page-navigation-progress:not([hidden])").length) {
            return console.debug('waiting, page loading..');
         }

         if (_plugins_conteiner.length === plugins_count) {
            clearTimeout(forceLander);
            processLander();
         } else {
            console.debug('loading:', _plugins_conteiner.length + '/' + plugins_count);
         }

      }, 100); // 100ms

      function processLander() {
         console.debug('loaded:', _plugins_conteiner.length + '/' + plugins_count);
         clearInterval(plugins_lander);
         plugins_executor({
            'user_settings': user_settings,
            'app_ver': app_ver,
            // outdated. Replaced by "plugin.was_init"
            // 'is_new_url': is_new_url,
            // 'plugins': _plugins_conteiner,
         });
      }
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   },
}

App.init();

// document.addEventListener('yt-action', function (event) {
//    console.debug('yt-action', JSON.stringify(event.type));
//    console.debug('yt-action', JSON.stringify(event.target));
//    console.debug('yt-action', JSON.stringify(event.data));
//    console.debug('yt-action', event);
   // console.debug('yt-action', event.detail?.actionName, event);

//    yt-action ytd-update-mini-guide-state-action
//    yt-action yt-miniplayer-active-changed-action
//    yt-action ytd-update-guide-opened-action
//    yt-action yt-initial-video-aspect-ratio
//    yt-action yt-get-mdx-status
//    yt-action ytd-update-guide-state-action
//    yt-action yt-get-mdx-status
//    yt-action yt-forward-redux-action-to-live-chat-iframe
//    yt-action ytd-update-active-endpoint-action
//    yt-action yt-close-all-popups-action
//    yt-action ytd-watch-player-data-changed
//    yt-action yt-cache-miniplayer-page-action
//    yt-action yt-deactivate-miniplayer-action

//    yt-action yt-miniplayer-active
//    yt-action yt-pause-active-page-context
//    yt-action ytd-log-youthere-nav
//    yt-action yt-prepare-page-dispose
//    yt-action yt-user-activity
//    yt-action yt-deactivate-miniplayer-action
// });


// for inspect
// getEventListeners(document.querySelector('#movie_player'))
// getEventListeners(document.querySelector('video'));
// window.dispatchEvent(new Event("resize"));
// getEventListeners(window)
// getEventListeners(document)

// example url new embed page
// https://www.youtube-nocookie.com/embed/hXTqP_o_Ylw?autoplay=1&autohide=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1
