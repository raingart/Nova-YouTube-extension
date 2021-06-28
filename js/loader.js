const App = {
   lastURL: location.href,

   isURLChanged() {
      return this.lastURL === location.href ? false : this.lastURL = location.href;
   },

   // sessionSettings: null,
   storage: {
      set(options) {
         this.sessionSettings = options;
         // in the iframe
         if (options?.disable_in_frame && window.self !== window.top) {
            return console.warn('processed in the frame disable');
         }
         if (options?.report_issues) this.reflectException();
         this.run();
      },

      // load store user_settings
      load(callback) {
         Storage.getParams(callback || this.storage.set.bind(this), 'sync')
      },
   },

   init() {
      const manifest = chrome.runtime.getManifest();
      console.log('%c /* %s */', 'color: #0096fa; font-weight: bold;', manifest.name + ' v.' + manifest.version);

      // skip first run
      document.addEventListener('yt-navigate-start', () => this.isURLChanged() && this.run());
      // document.addEventListener('yt-navigate-finish', App.run); // does not work correctly

      this.storage.load.apply(this);
      // load all Plugins
      Plugins.injectScript('var _plugins_conteiner = [];');
      Plugins.load(['ytc_lib.js']);
      Plugins.load(); // all
   },

   run() {
      Plugins.injectScript(
         `( ${this.lander.toString()} ({
            'plugins_executor': ${Plugins.run},
            'user_settings': ${JSON.stringify(this.sessionSettings)},
            'plugins_count': ${Plugins.list.length},
            'app_name': '${chrome?.runtime?.getManifest()?.name}',
            'app_ver': '${chrome?.runtime?.getManifest()?.version}',
         }));`
      );

      // console.debug('all Property', Object.getOwnPropertyNames(this));
   },

   lander: function ({ plugins_executor, user_settings, plugins_count, app_name, app_ver }) {
      // console.debug('lander', ...arguments);
      console.groupCollapsed('plugins status');

      const forceLander = setTimeout(() => {
         console.debug('force lander:', _plugins_conteiner.length + '/' + plugins_count);
         processLander();

         // show notice
         // container.insertAdjacentHTML("beforeend",
         //       `<div style="position:fixed; top:0; right:50%; transform:translateX(50%); margin-top:50px; z-index:9999; cursor:pointer; border-radius:2px; color:#fff; padding:10px; background-color:#0099ff; box-shadow:rgb(0 0 0 / 50%) 0px 0px 3px; font-size:12px;">
         //          <h4>Failure on initialization ${app_name}</h4>
         //          <div>plugins loaded: ${_plugins_conteiner.length + '/' + plugins_count}</div>
         //       </div>`);
         const notice = document.createElement('div');
         Object.assign(notice.style, {
            position: 'fixed',
            top: 0,
            right: '50%',
            transform: 'translateX(50%)',
            'margin-top': '50px',
            // bottom-right in the corner
            // bottom: 0,
            // right: 0,
            // transform: 'none',
            // 'margin': '50px',
            'z-index': 9999,
            'border-radius': '2px',
            'background-color': '#0099ff',
            'box-shadow': 'rgb(0 0 0 / 50%) 0px 0px 3px',
            'font-size': '12px',
            color: '#fff',
            padding: '10px',
            cursor: 'pointer',
         });
         notice.addEventListener('click', evt => evt.target.remove());
         notice.innerHTML =
            `<h4>Failure on initialization ${app_name}</h4>
            <div>plugins loaded: ${_plugins_conteiner.length + '/' + plugins_count}</div>`;
         document.documentElement.appendChild(notice);
      }, 1000 * 3); // 3sec

      const interval_lander = setInterval(() => {
         const domLoaded = document?.readyState !== 'loading';
         if (!domLoaded) return console.debug('waiting, page loading..');

         if (YDOM && _plugins_conteiner.length === plugins_count) {
            clearInterval(forceLander);
            processLander();

         } else console.debug('loading:', _plugins_conteiner.length + '/' + plugins_count);

      }, 100); // 100ms

      function processLander() {
         console.debug('loaded:', _plugins_conteiner.length + '/' + plugins_count);
         clearInterval(interval_lander);
         plugins_executor({
            'user_settings': user_settings,
            'app_ver': app_ver, // need reflectException
         });
      }
   },

   reflectException() {
      const
         manifest = chrome.runtime.getManifest(),
         alertMsg = manifest.name + '\nCrash in one of the plugins\nDetails in the console\n\nOpen tab to report the bug?',
         senderException = ({ trace_name, err_stack, confirm_msg, app_ver }) => {
            if (confirm(confirm_msg || alertMsg)) {
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
         `const _pluginsCaptureException = ${senderException};
         window.addEventListener('unhandledrejection', err => {
            if (!err.reason.stack.toString().includes(${JSON.stringify(chrome.runtime.id)})) return;
            console.error(\`[PLUGIN ERROR]\n\`, err.reason, \`\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new/choose\`);

            _pluginsCaptureException({
               'trace_name': 'unhandledrejection',
               'err_stack': err.reason.stack,
               'app_ver': '${chrome.runtime.getManifest().version}',
               'confirm_msg': \`${alertMsg}\`,
            });
         });`);
   },
}

App.init();
