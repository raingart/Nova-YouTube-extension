const App = {
   lastURL: location.href,

   isURLChange() {
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
         if (settings?.exclude_iframe && (window.self !== window.top)) { // window.frameElement
            return console.warn('processed in the iframe disable');
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

      // skip first page transition
      // Strategy 1
      document.addEventListener('yt-navigate-start', () => this.isURLChange() && this.run());
      // document.addEventListener('yt-navigate-finish', () => this.isURLChange() && this.run());
      // Strategy 2
      // window.addEventListener('transitionend', ({ target }) => target.id == 'progress' && this.isURLChange() && this.run());

      // for test
      // document.addEventListener('yt-navigate-start', () => console.debug('yt-navigate-start'));
      // document.addEventListener('yt-navigate-finish', () => console.debug('yt-navigate-finish'));
      // window.addEventListener('transitionend', ({ target }) => target.id == 'progress' && console.debug('transitionend'));

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
               'background-color': typeof NOVA === 'object' ? '#0099ff' : 'crimson',
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
                  : `<div>Critical Error: kernel library NOVA is "${typeof NOVA}"</div>`);
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
         alertMsg = `Failure when async-call of one "${manifest.name}" plugin.\nDetails in the console\n\nOpen tab to report the bug?`,

         openBugReport = ({ trace_name, err_stack, confirm_msg, app_ver }) => {
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
         `const _pluginsCaptureException = ${openBugReport};
         window.addEventListener('unhandledrejection', err => {
            if (!err.reason.stack?.toString().includes(${JSON.stringify(chrome.runtime.id)})) return;
            console.error(\`[PLUGIN ERROR]\n\`, err.reason, \`\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=${encodeURIComponent([chrome.runtime.getManifest().version, navigator.userAgent].join(' | '))}\`);

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

// for testing
// https://www.youtube.com/watch?v=U9mUwZ47z3E - ultra-wide
// https://www.youtube.com/watch?v=4Zivt4wbvoM - narrow
// https://www.youtube.com/watch?v=ir6nk2zrMG0- wide

// wide-screen video
// https://www.youtube.com/watch?v=B4yuZhKRW1c
// https://www.youtube.com/watch?v=zEk3A1fA0gc

// shorts
// https://www.youtube.com/shorts/5ndfxasp2r0

// clip
// https://www.youtube.com/clip/Ugkx2Z62NxoBfx_ZR2nIDpk3F2f90TV4_uht

// for testing square-screen
// https://www.youtube.com/watch?v=lx79bS-Kl78
// https://www.youtube.com/watch?v=v-YQUCP-J8s
// https://www.youtube.com/watch?v=gWqENeW7EyQ
// https://www.youtube.com/watch?v=Hlk7AzBMmOA
// https://www.youtube.com/watch?v=bDmA8qQKhMY
// https://www.youtube.com/watch?v=Ol8eMfmzpe0

// test z-index "Show chat replay" button
// https://www.youtube.com/watch?v=9Mv1sOp0Xg8

// warn "The following content may contain suicide or self-harm topics."
// https://www.youtube.com/watch?v=MEZ-0nyiago
// https://www.youtube.com/watch?v=MiQozY6jR0I

// test normal lite
// https://www.youtube.com/watch?v=eWwBkA0GqaY 144 MUSIC
// https://www.youtube.com/watch?v=v-YQUCP-J8s 144 MUSIC
// https://www.youtube.com/watch?v=FSjr2H0RDsY 240 AMV
// https://www.youtube.com/watch?v=qnLunQEcMn0 480 MUSIC (has title)
// https://www.youtube.com/watch?v=w1FUjM78HAI 480 AMV
// https://www.youtube.com/watch?v=668nUCeBHyY 720 short time
// https://www.youtube.com/watch?v=b6At_bb1PNU 1080 Trailer
// https://www.youtube.com/watch?v=rFeBMv98X30 1080 PV
// https://www.youtube.com/watch?v=s-yflRFexPc 4k short time


// example url new embed page
// https://www.youtube-nocookie.com/embed/hXTqP_o_Ylw?autoplay=1&autohide=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1
// https://www.youtube.com/embed/yWUMMg3dmFY?wmode=opaque&amp;rel=0&amp;controls=0&amp;modestbranding=1&amp;showinfo=0&amp;enablejsapi=1

// abnormal pages
// https://www.youtube.com/watch?v=DhTST3iRZyM - other elements besides the player are not loaded

// clear history
// https://www.youtube.com/feed/history/community_history

// TODO
// create such plugins:
// https://greasyfork.org/en/scripts/418605-export-youtube-playlist-in-tab-delimited-text
// https://greasyfork.org/en/scripts/34388-space-efficient-youtube
// https://greasyfork.org/en/scripts/419722-return-watched-badge-on-youtube-with-custom-text

// upgrade code to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment
