const App = {
   prevURL: location.href,

   isURLChange() {
      return (this.prevURL === location.href) ? false : this.prevURL = location.href;
   },

   isMobile: location.host == 'm.youtube.com',

   // settingsStore: null,
   storage: {
      set(settings) {
         this.settingsStore = settings;
         // Disabled script if youtube is embedded
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
      if (this.isMobile) {
         window.addEventListener('transitionend', ({ target }) => target.id == 'progress' && this.isURLChange() && this.run());
      }
      // Strategy 2
      else {
         document.addEventListener('yt-navigate-start', () => this.isURLChange() && this.run());
      }

      // for test
      // document.addEventListener('yt-navigate-start', () => console.debug('yt-navigate-start'));
      // document.addEventListener('yt-navigate-finish', () => console.debug('yt-navigate-finish'));
      // document.addEventListener('yt-page-data-updated', () => console.debug('yt-page-data-updated'));
      // window.addEventListener('transitionend', ({ target }) => target.id == 'progress' && console.debug('transitionend'));
      // window.addEventListener('load', () => console.debug('window load')); // once on page init
      // window.addEventListener('urlchange', () => console.debug('urlchange')); // once on page init (only working in userscript space)

      this.storage.load.apply(this);
      // load all Plugins
      Plugins.injectScript('window.nova_plugins = [];');
      Plugins.load(['nova-api.js']);
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
               + ((typeof NOVA === 'object')
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
         }
         else console.debug('loading plugins:', window.nova_plugins.length + '/' + plugins_count);

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
                  + '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent + ' [' + window.navigator.language + ']')
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

// grid row
// force play video
// fix playlist playback for unlogged
// https://gist.github.com/lbmaian

// resume playlist
// https://greasyfork.org/en/scripts/459412-youtube-playlists-playback-tracker

// for testing
// https://www.youtube.com/watch?v=9xp1XWmJ_Wo - 30sec
// https://www.youtube.com/watch?v=U9mUwZ47z3E - ultra-wide
// https://www.youtube.com/watch?v=4Zivt4wbvoM - narrow
// https://www.youtube.com/watch?v=ir6nk2zrMG0 - wide

// live
// https://www.youtube.com/watch?v=tNkZsRW7h2c - live

// wide-screen video
// https://www.youtube.com/watch?v=B4yuZhKRW1c
// https://www.youtube.com/watch?v=zEk3A1fA0gc
// https://www.youtube.com/watch?v=YKKuLzYzH2E

// shorts
// https://www.youtube.com/shorts/5ndfxasp2r0

// clip
// https://www.youtube.com/clip/Ugkx2Z62NxoBfx_ZR2nIDpk3F2f90TV4_uht

// for testing square-screen
// https://www.youtube.com/watch?v=lx79bS-Kl78
// https://www.youtube.com/watch?v=v-YQUCP-J8s
// https://www.youtube.com/watch?v=gWqENeW7EyQ
// https://www.youtube.com/watch?v=Hlk7AzBMmOA
// https://www.youtube.com/watch?v=Ol8eMfmzpe0

// test z-index "Show chat replay" button
// https://www.youtube.com/watch?v=9Mv1sOp0Xg8

// test normal lite
// https://www.youtube.com/watch?v=eWwBkA0GqaY 144 MUSIC
// https://www.youtube.com/watch?v=v-YQUCP-J8s 144 MUSIC
// https://www.youtube.com/watch?v=FSjr2H0RDsY 240 AMV
// https://www.youtube.com/watch?v=YSXwreNIuYE 240
// https://www.youtube.com/channel/UCl3Cj2of3Il3j-RAs_WFtQA - all video in 240p
// https://www.youtube.com/watch?v=qnLunQEcMn0 480 MUSIC (has title)
// https://www.youtube.com/watch?v=w1FUjM78HAI 480 AMV
// https://www.youtube.com/watch?v=668nUCeBHyY 720 short time
// https://www.youtube.com/watch?v=b6At_bb1PNU 1080 Trailer
// https://www.youtube.com/watch?v=rFeBMv98X30 1080 PV
// https://www.youtube.com/watch?v=s-yflRFexPc 4k short time

// Fundraiser badge
// https://www.youtube.com/watch?v=Rz1Xn1vzOM4

// example url new embed page
// https://www.youtube-nocookie.com/embed/hXTqP_o_Ylw?autoplay=1&autohide=1&fs=1&rel=0&hd=1&wmode=transparent&enablejsapi=1&html5=1
// https://www.youtube.com/embed/yWUMMg3dmFY?wmode=opaque&amp;rel=0&amp;controls=0&amp;modestbranding=1&amp;showinfo=0&amp;enablejsapi=1
// https://www.youtube.com/embed/yWUMMg3dmFY?enablejsapi=1&autoplay=0&cc_load_policy=0&cc_lang_pref=&iv_load_policy=1&loop=0&modestbranding=0&rel=1&fs=1&playsinline=0&autohide=2&theme=dark&color=red&controls=1&
// https://www.youtube.com/embed/IiJ3m82AOFg?rel=0&wmode=opaque&enablejsapi=1

// abnormal pages
// https://www.youtube.com/watch?v=DhTST3iRZyM - other elements besides the player are not loaded
// https://www.youtube.com/channel/UCG6TrwqzkWwvWiY2eUny8TA - does not have a "video" tab


// error open channel in new tab
// https://www.youtube.com/watch?v=R_uS0aT0bG8 (redirect to 404 - https://www.youtube.com/user/diversityrecordings)

// clear history
// https://www.youtube.com/feed/history/community_history

// TODO
// create such plugins:
// https://greasyfork.org/en/scripts/418605-export-youtube-playlist-in-tab-delimited-text
// https://greasyfork.org/en/scripts/34388-space-efficient-youtube
// https://greasyfork.org/en/scripts/419722-return-watched-badge-on-youtube-with-custom-text

// upgrade code to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment
