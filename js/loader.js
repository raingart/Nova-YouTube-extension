const App = {
   lastURL: location.href,

   isURLChanged() {
      return this.lastURL === location.href ? false : this.lastURL = location.href;
   },

   // settingsStore: null,
   storage: {
      set(settings) {
         for (const property in settings) { // convert string to boolean
            switch (settings[property]) {
               case 'true': settings[property] = true; break;
               case 'false': settings[property] = false; break;
            }
         }
         this.settingsStore = settings;
         // in the iframe
         if (settings?.disable_in_frame && window.self !== window.top) {
            return console.warn('processed in the frame disable');
         }
         if (settings?.report_issues) this.reflectException();
         this.run();
      },

      // load store user_settings
      load(callback) {
         Storage.getParams(callback || this.storage.set.bind(this), 'sync')
      },
   },

   init() {
      const manifest = chrome.runtime.getManifest();
      console.log('%c /* %s */', 'color:#0096fa; font-weight:bold;', manifest.name + ' v.' + manifest.version);

      // skip first run on page transition
      document.addEventListener('yt-navigate-start', () => this.isURLChanged() && this.run());
      // document.addEventListener('transitionend', () => this.isURLChanged() && this.run()); // not work correctly
      // document.addEventListener('yt-navigate-finish', this.run); // does not work correctly

      this.storage.load.apply(this);
      // load all Plugins
      Plugins.injectScript('window.nova_plugins = [];');
      Plugins.load(['common-lib.js']);
      Plugins.load(); // all
   },

   run() {
      Plugins.injectScript(
         `( ${this.lander.toString()} ({
            'plugins_executor': ${Plugins.run},
            'user_settings': ${JSON.stringify(this.settingsStore)},
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
         console.warn('force lander:', window.nova_plugins.length + '/' + plugins_count);
         clearInterval(landerInterval);

         if (!document.body) return;

         if (typeof NOVA === 'object' && window.nova_plugins.length) {
            processLander();
         }
         // if delay load domLoaded
         if (window.nova_plugins.length !== plugins_count) {
            // show notice
            const notice = document.createElement('div');
            Object.assign(notice.style, {
               position: 'fixed',
               top: 0,
               right: '50%',
               transform: 'translateX(50%)',
               margin: '50px',
               'z-index': 9999,
               'border-radius': '2px',
               'background-color': typeof NOVA === 'object' ? '#0099ff' : '#f00',
               'box-shadow': 'rgb(0 0 0 / 50%) 0px 0px 3px',
               'font-size': '12px',
               color: '#fff',
               padding: '10px',
               cursor: 'pointer',
            });
            // notice.addEventListener('click', ({ target }) => target.remove());
            notice.addEventListener('click', () => notice.remove());
            notice.innerHTML =
               `<h4 style="margin:0;">Failure on initialization ${app_name}</h4>`
               + (typeof NOVA === 'object'
                  ? `<div>plugins loaded: ${window.nova_plugins.length + '/' + plugins_count}</div>`
                  : `<div>Сritical Error: kernel library NOVA is "${typeof NOVA}"</div>`);
            document.body.append(notice);
         }
      }, 1000 * 3); // 3sec

      const landerInterval = setInterval(() => {
         const domLoaded = document?.readyState != 'loading';
         if (!domLoaded) return console.debug('waiting, page loading..');

         if (typeof NOVA === 'object' && window.nova_plugins.length === plugins_count) {
            clearInterval(forceLander);
            processLander();

         } else console.debug('loading plugins:', window.nova_plugins.length + '/' + plugins_count);

      }, 100); // 100ms

      function processLander() {
         console.assert(window.nova_plugins.length === plugins_count, 'loaded:', window.nova_plugins.length + '/' + plugins_count);
         clearInterval(landerInterval);
         plugins_executor({
            'user_settings': user_settings,
            'app_ver': app_ver, // need for reflectException
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

// test normal lite
// https://www.youtube.com/watch?v=4ldjbjwim4k 240
// https://www.youtube.com/watch?v=aCyGvGEtOwc 360
// https://www.youtube.com/watch?v=rFeBMv98X30 1080

// example url new embed page
// https://www.youtube.com/embed/JVi_e8g7K4A
// https://www.youtube-nocookie.com/embed/hXTqP_o_Ylw?autoplay=1&autohide=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1
// https://www.youtube.com/embed/JVi_e8g7K4A?wmode=opaque&amp;rel=0&amp;controls=0&amp;modestbranding=1&amp;showinfo=0&amp;enablejsapi=1

// abnormal pages
// https://www.youtube.com/watch?v=DhTST3iRZyM - other elements besides the player are not loaded
// https://www.youtube.com/channel/UCYPymLmMIXZEbPGZCep2P9A - no have sorting button
// https://www.youtube.com/watch?v=LhKT9NTH9HA - dont have 480p quality

// TODO
// upgrade code to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment
