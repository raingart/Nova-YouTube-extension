console.log('%c /• %s •/', 'color:#0096fa; font-weight:bold;', GM_info.script.name + ' v.' + GM_info.script.version);

// for Greasemonkey
// (async () => {
// if (typeof GM_setValue != 'function') {
//    GM_getValue = async (n) => await GM.getValue(n);
//    GM_setValue = (n,d) => GM.setValue(n, d);
//    GM_openInTab = (t) => GM.openInTab(t);
//    //GM_registerMenuCommand = () => GM.registerMenuCommand(...arguments);
//    GM_registerMenuCommand = (t, fn) => GM.registerMenuCommand(t, fn);
// }

const
   configPage = 'https://raingart.github.io/options.html', // ?tabs=tab-plugins
   configStoreName = 'user_settings',
   user_settings = GM_getValue(configStoreName, null);
// user_settings = await GM_getValue(configStoreName) || {}; // for Greasemonkey

// Disabled script if youtube is embedded
if (user_settings?.exclude_iframe && (window.frameElement || window.self !== window.top)) {
   return console.warn(GM_info.script.name + ': processed in the iframe disable');
}

console.debug(`current ${configStoreName}:`, user_settings);

// updateKeyStorage
// const keyRenameTemplate = {
//    // 'oldKey': 'newKey',
// }
// for (const oldKey in user_settings) {
//    if (newKey = keyRenameTemplate[oldKey]) {
//       console.log(oldKey, '=>', newKey);
//       delete Object.assign(user_settings, { [newKey]: user_settings[oldKey] })[oldKey];
//    }
//    GM_setValue(configStoreName, user_settings);
// }

registerMenuCommand();

// is configPage
if (location.hostname === new URL(configPage).hostname) setupConfigPage();
else {
   if (!user_settings?.disable_setting_button) insertSettingButton();

   // is user_settings empty
   if (!user_settings || !Object.keys(user_settings).length) {
      // if (confirm('Active plugins undetected. Open the settings page now?')) window.open(configPage);
      if (confirm('Active plugins undetected. Open the settings page now?')) GM_openInTab(configPage);

      // default plugins settings
      user_settings['report_issues'] = 'on';
      GM_setValue(configStoreName, user_settings);
   }
   else landerPlugins();
}

function setupConfigPage() {
   // form submit
   document.addEventListener('submit', event => {
      // console.debug('submit', event.target);
      event.preventDefault();

      let obj = {};
      for (const [key, value] of new FormData(event.target)) {
         // SerializedArray
         if (obj.hasOwnProperty(key)) {
            obj[key] += ',' + value; // add new
            obj[key] = obj[key].split(','); // to array [old, new]
         }
         else {
            // convert string to boolean
            switch (value) {
               case 'true': obj[key] = true; break;
               case 'false': obj[key] = false; break;
               // case 'undefined': obj[key] = undefined; break;
               case 'undefined': delete obj[key]; break; // remove unless storage
               default: obj[key] = value;
            }
         };
      }
      // fix tab reassignment
      // if (obj.tabs) delete obj.tabs;

      console.debug(`update ${configStoreName}:`, obj);
      GM_setValue(configStoreName, obj);
   });

   window.addEventListener('DOMContentLoaded', () => {
      localizePage(user_settings?.lang_code);
      storeData = user_settings; // export(sync) settings to page
      // allow to export plugins
      unsafeWindow.window.nova_plugins = window.nova_plugins;
      // unsafeWindow.Plugins.load = () => { };
      // unsafeWindow.Plugins ={ };
   });

   window.addEventListener('load', () => {
      // unlock if synchronized
      document.body?.classList?.remove('preload');
      // alert('PopulateForm:' + typeof PopulateForm); // test for Greasemonkey

      document.body.querySelector('a[href$="issues/new"]')
         .addEventListener('click', ({ target }) => {
            target.href += '?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent);
         });
   });
}

function landerPlugins() {
   processLander();

   // let playlist_page_transition_count = 0;

   function processLander() {
      const plugins_lander = setInterval(() => {
         // wait page loaded
         const domLoaded = document?.readyState != 'loading';
         if (!domLoaded) return console.debug('waiting, page loading..');

         clearInterval(plugins_lander);
         // force page reload. Dirty hack to page reset hack to clean up junk (for playlist)
         // playlistPageReload();

         console.groupCollapsed('plugins status');

         // PluginsFn.run({
         Plugins.run({
            'user_settings': user_settings,
            'app_ver': GM_info.script.version,
         });

      }, 500); // 500ms
   }

   let prevURL = location.href;
   const isURLChanged = () => prevURL == location.href ? false : prevURL = location.href;

   // skip first page transition
   // Strategy 1
   if (isMobile = (location.host == 'm.youtube.com')) {
      window.addEventListener('transitionend', ({ target }) => target.id == 'progress' && isURLChange() && processLander());
   }
   // Strategy 2
   else {
      document.addEventListener('yt-navigate-start', () => isURLChanged() && processLander());
   }

   // function playlistPageReload(sec = 5) {
   //    if (location.search.includes('list=')) {
   //       playlist_page_transition_count++;
   //       // console.debug('playlist_page_transition_count:', playlist_page_transition_count);

   //       if (playlist_page_transition_count === 30) {
   //          const notice = document.createElement('div');
   //          Object.assign(notice.style, {
   //             position: 'fixed',
   //             top: 0,
   //             right: '50%',
   //             transform: 'translateX(50%)',
   //             margin: '50px',
   //             'z-index': 9999,
   //             'border-radius': '2px',
   //             'background-color': 'tomato',
   //             'box-shadow': 'rgb(0 0 0 / 50%) 0px 0px 3px',
   //             'font-size': '12px',
   //             color: '#fff',
   //             padding: '10px',
   //             cursor: 'pointer',
   //          });
   //          notice.addEventListener('click', () => {
   //             playlist_page_transition_count = 0;
   //             notice.remove();
   //             clearTimeout(playlist_reload);
   //          });
   //          notice.innerHTML =
   //             `<h4 style="margin:0;">Attention! ${GM_info.script.name}</h4>
   //             <div>The page will be automatically reloaded within ${sec} sec</div>
   //             <div><i>Click for cancel</i></div>`;
   //          document.body.append(notice);

   //          const playlist_reload = setTimeout(() => location.reload(), 1000 * +sec); // 5sec
   //       }
   //    }
   // }
}

// There are problems in this way / try remove initialization plugins delay (only userscript)
// function initPlugins() {
//    // page: init
//    console.groupCollapsed('plugins status');
//    PluginsFn.run({
//       'user_settings': user_settings,
//       'app_ver': GM_info.script.version,
//    });
//    // page: url change
//    let prevURL = location.href;
//    const isURLChanged = () => (prevURL == location.href) ? false : prevURL = location.href;
//    // skip first page transition
//    document.addEventListener('yt-navigate-start', () => isURLChanged() && initPlugins());
// }

function registerMenuCommand() {
   // GM_registerMenuCommand('Settings', () => window.open(configPage));
   GM_registerMenuCommand('Settings', () => GM_openInTab(configPage));
   // GM_registerMenuCommand('Import settings', () => {
   //    if (json = JSON.parse(prompt('Enter json file context'))) {
   //       GM_setValue(configStoreName, json);
   //       alert('Settings imported');
   //       location.reload();
   //    }
   //    else alert('Import failed');
   // });
   GM_registerMenuCommand('Import settings', () => {
      const f = document.createElement('input');
      f.type = 'file';
      f.accept = 'application/JSON';
      f.style.display = 'none';
      f.addEventListener('change', function () {
         if (f.files.length !== 1) return alert('file empty');
         const rdr = new FileReader();
         rdr.addEventListener('load', function () {
            try {
               GM_setValue(configStoreName, JSON.parse(rdr.result));
               alert('Settings imported successfully!');
               location.reload();
            }
            catch (err) {
               alert(`Error parsing settings\n${err.name}: ${err.message}`);
            }
         });
         rdr.addEventListener('error', error => alert('Error loading file\n' + rdr?.error || error));
         rdr.readAsText(f.files[0]);
      });
      document.body.append(f);
      f.click();
      f.remove();
   });
   GM_registerMenuCommand('Export settings', () => {
      let d = document.createElement('a');
      d.style.display = 'none';
      d.download = 'nova-settings.json';
      d.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(user_settings));
      document.body.append(d);
      d.click();
      d.remove();
   });
}

function insertSettingButton() {
   NOVA.waitSelector('#masthead #end')
      .then(menu => {
         const
            titleMsg = 'Nova Settings',
            a = document.createElement('a'),
            SETTING_BTN_ID = 'nova_settings_button';

         a.id = SETTING_BTN_ID;
         a.href = configPage + '?tabs=tab-plugins';
         a.target = '_blank';
         a.innerHTML =
            `<yt-icon-button class="style-scope ytd-button-renderer style-default size-default">
               <svg viewBox="-4 0 20 16">
                  <radialGradient id="nova-gradient" gradientUnits="userSpaceOnUse" cx="6" cy="22" r="18.5">
                     <stop class="nova-gradient-start" offset="0"/>
                     <stop class="nova-gradient-stop" offset="1"/>
                  </radialGradient>
                  <g fill="deepskyblue">
                     <polygon points="0,16 14,8 0,0"/>
                  </g>
               </svg>
            </yt-icon-button>`;
         // `<svg viewBox="0 0 24 24" style="height:24px;">
         //     <path d="M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z"/>
         // </svg>`;
         // a.textContent = '►';
         // Object.assign(a.style, {
         //    'font-size': '24px',
         //    'color': 'deepskyblue !important',
         //    'text-decoration': 'none',
         //    'padding': '0 10px',
         // });
         a.addEventListener('click', () => {
            setTimeout(() => document.body.click(), 200); // fix hide <tp-yt-iron-dropdown>
         });

         // append tooltip
         // a.setAttribute('tooltip', titleMsg); // css (ahs bug on hover search buttom)
         // yt-api
         a.title = titleMsg;
         const tooltip = document.createElement('tp-yt-paper-tooltip');
         tooltip.className = 'style-scope ytd-topbar-menu-button-renderer';
         // tooltip.setAttribute('role', 'tooltip');
         tooltip.textContent = titleMsg;

         a.appendChild(tooltip);
         menu.prepend(a);

         NOVA.css.push(
            `#${SETTING_BTN_ID}[tooltip]:hover:after {
               position: absolute;
               top: 50px;
               transform: translateX(-50%);
               content: attr(tooltip);
               text-align: center;
               min-width: 3em;
               max-width: 21em;
               white-space: nowrap;
               overflow: hidden;
               text-overflow: ellipsis;
               padding: 1.8ch 1.2ch;
               border-radius: 0.6ch;
               background-color: #616161;
               box-shadow: 0 1em 2em -0.5em rgb(0 0 0 / 35%);
               color: #fff;
               z-index: 1000;
            }

            #${SETTING_BTN_ID} {
               position: relative;
               opacity: .3;
               transition: opacity .3s ease-out;
            }

            #${SETTING_BTN_ID}:hover {
               opacity: 1 !important;
            }

            #${SETTING_BTN_ID} path,
            #${SETTING_BTN_ID} polygon {
               fill: url(#nova-gradient);
            }

            #${SETTING_BTN_ID} .nova-gradient-start,
            #${SETTING_BTN_ID} .nova-gradient-stop {
               transition: .6s;
               stop-color: #7a7cbd;
            }

            #${SETTING_BTN_ID}:hover .nova-gradient-start {
               stop-color: #0ff;
            }

            #${SETTING_BTN_ID}:hover .nova-gradient-stop {
               stop-color: #0095ff;
               /*stop-color: #fff700;*/
            }`);

         // const btn = document.createElement('button');
         // btn.className = 'ytd-topbar-menu-button-renderer';
         // btn.title = 'Nova Settings';
         // btn.innerHTML =
         //    `<svg width="24" height="24" viewBox="0 0 24 24">
         //       <g fill="deepskyblue">
         //          <polygon points='21 12 3,1.8 3 22.2' />
         //          <path d='M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z' />
         //       </g>
         //    </svg>`;
         // Object.assign(btn.style, {
         //    // color: 'var(--yt-spec-text-secondary)',
         //    padding: '0 24px',
         //    border: 0,
         //    outline: 0,
         //    cursor: 'pointer',
         // });
         // btn.addEventListener('click', () => parent.open(configPage + '?tabs=tab-plugins'));
         // // menu.insertBefore(btn, menu.lastElementChild);
         // menu.prepend(btn);
      });
}

function _pluginsCaptureException({ trace_name, err_stack, confirm_msg, app_ver }) {
   // GM_notification({ text: GM_info.script.name + ' an error occurred', timeout: 4000, onclick: openBugReport });

   if (confirm(confirm_msg || `Error in ${GM_info.script.name}. Send the bug raport to developer?`)) {
      openBugReport();
   }

   function openBugReport() {
      // window.open(
      GM_openInTab(
         'https://docs.google.com/forms/u/0/d/e/1FAIpQLScfpAvLoqWlD5fO3g-fRmj4aCeJP9ZkdzarWB8ge8oLpE5Cpg/viewform' +
         '?entry.35504208=' + encodeURIComponent(trace_name) +
         '&entry.151125768=' + encodeURIComponent(err_stack) +
         '&entry.744404568=' + encodeURIComponent(location.href) +
         '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent + ' [' + window.navigator.language + ']')
         // '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + (navigator.userAgentData?.brands.length && JSON.stringify(navigator.userAgentData?.brands)))
      );
      // , '_blank');
   }
}

window.addEventListener('unhandledrejection', err => {
   // if (user_settings.report_issues && err.reason.stack.includes('/Nova%20YouTube.user.js'))
   if (user_settings.report_issues && (err.reason?.stack || err.stack)?.includes('Nova')) {
      console.error('[ERROR PROMISE]\n', err.reason, '\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent));

      _pluginsCaptureException({
         'trace_name': 'unhandledrejection',
         'err_stack': err.reason.stack || err.stack,
         'app_ver': GM_info.script.version,
         'confirm_msg': `Failure when async-call of one "${GM_info.script.name}" plugin.\nDetails in the console\n\nOpen tab to report the bug?`,
      });
   }
});

// })(); // for Greasemonkey
