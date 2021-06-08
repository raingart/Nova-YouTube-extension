const Plugins = {
   list: [
      // 'plugins/_blank_plugin.js', // for example

      'player/ad-skip-button.js',
      'player/rate.js',
      'player/volume.js',
      'player/hud.js',
      'player/quality.js',
      'player/autoause.js', // after quality.js
      'player/theater-mode.js',
      'player/tab-pause.js',
      'player/hotkeys-focused.js',
      'player/pin.js',
      'player/time-jump.js',
      'player/time-remaining.js',
      'player/fixed-progress-bar.js',
      'player/no-sleep.js',
      // 'player/stop.js', // incompatible with quality.js

      'other/thumbnails-clear.js',
      'other/thumbnails-title-normalize.js',
      'other/thumbnails-rating.js',
      'other/thumbnails-watched.js',
      'other/channel-tab.js',
      'other/redirect-clear.js',
      'other/scroll-to-top.js',

      'details/description.js',
      'details/videos-count.js',

      'comments/disable.js',
      'comments/expand.js',
      'comments/square-avatars.js',

      'sidebar/playlist-duration.js',
      'sidebar/livechat.js',

      'header/unfixed.js',
      'header/short.js',
   ],

   load(list) {
      (list || this.list)
         .forEach(plugin => {
            try {
               this.injectScript(chrome.extension.getURL('/plugins/' + plugin));
            } catch (error) {
               console.error(`plugin loading failed: ${plugin}\n${error.stack}`);
            }
         })
   },

   injectScript(source = required()) {
      const script = document.createElement('script');

      if (source.endsWith('.js')) {
         script.src = source;
         // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer:~:text=defer,-This
         script.defer = true;
         // script.async = true;

      } else {
         script.textContent = source.toString();
         // script.src = "data:text/plain;base64," + btoa(source);
         // script.src = 'data:text/javascript,' + encodeURIComponent(source)
      }

      (document.head || document.documentElement).appendChild(script);

      script.onload = () => {
         // console.log('script loaded:', script.src || script.textContent.substr(0, 100));
         script.remove(script); // Remove <script> node after injectScript runs.
      };
   },

   run: ({ user_settings, app_ver }) => {
      // console.debug('plugins_executor', ...arguments);
      if (!_plugins_conteiner?.length) return console.error('_plugins_conteiner empty', _plugins_conteiner);
      if (!user_settings) return console.error('user_settings empty', user_settings);

      const currentPage = (function () {
         const page = location.pathname.split('/')[1];
         return ['channel', 'c', 'user'].includes(page) ? 'channel' : page || 'main';
      })();

      let logTableArray = [],
         logTableStatus,
         logTableTime;

      // console.groupCollapsed('plugins status');

      _plugins_conteiner.forEach(plugin => {
         const pagesAllowList = plugin?.run_on_pages?.split(',').map(i => i.trim().toLowerCase());
         // reset logTable
         logTableTime = 0;
         logTableStatus = false;

         if (!pluginChecker(plugin)) {
            alert('Plugin invalid: ' + plugin?.id);
            logTableStatus = 'INVALID';

         } else if (plugin.was_init && !plugin.restart_on_transition) {
            logTableStatus = 'skiped';

         } else if (!user_settings.hasOwnProperty(plugin.id)) {
            logTableStatus = 'off';

         } else if (pagesAllowList && pagesAllowList.includes(currentPage)
            || (pagesAllowList.includes('all') && !pagesAllowList.includes('-' + currentPage))) {
            try {
               const startTableTime = performance.now();
               plugin.was_init = true;
               plugin._runtime(user_settings, currentPage);
               logTableTime = (performance.now() - startTableTime).toFixed(2);
               logTableStatus = true;

            } catch (err) {
               console.groupEnd('plugins status'); // out-of-group display
               console.error(`[ERROR PLUGIN] ${plugin.id}\n${err.stack}\n\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new/choose`);

               if (user_settings.report_issues && _pluginsCaptureException) {
                  _pluginsCaptureException({
                     'trace_name': plugin.id,
                     'err_stack': err.stack,
                     'app_ver': app_ver,
                     'confirm_msg': `Nova YouTube™\n\nCrash plugin "${plugin.id}"\nPlease report the bug or disable the plugin\n\nOpen popup to report the bug?`,
                  });
               }

               console.groupCollapsed('plugins status'); // resume console group
               logTableStatus = 'ERROR';
            }
         }

         logTableArray.push({
            'launched': logTableStatus,
            'name': plugin?.id,
            'time init (ms)': logTableTime,
         });
      });
      console.table(logTableArray);
      console.groupEnd('plugins status');

      function pluginChecker(plugin) {
         const result = plugin?.id && plugin.run_on_pages && 'function' === typeof plugin._runtime;
         if (!result) {
            console.error('plugin invalid:\n', {
               'id': plugin?.id,
               'run_on_pages': plugin?.run_on_pages,
               '_runtime': 'function' === typeof plugin?._runtime,
            });
         }
         return result;
      }
   },
}
