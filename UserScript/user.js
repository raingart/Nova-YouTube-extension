console.log('%c /* %s */', 'color:#0096fa; font-weight:bold;', GM_info.script.name + ' v.' + GM_info.script.version);

const
   optionsPage = 'https://raingart.github.io/options.html', // ?tabs=tab-plugins
   configStoreName = 'user_settings',
   fix_undefine = v => v === 'undefined' ? undefined : v, // for Tampermonkey
   user_settings = fix_undefine(GM_getValue(configStoreName)) || {};

// Disabled script if youtube is embedded
if (user_settings?.exclude_iframe && (window.frameElement || window.self !== window.top)) {
   return console.warn(GM_info.script.name + ': processed in the iframe disable');
}

// updateKeyStorage
const keyRenameTemplate = {
   // 'oldKey': 'newKey',
   'header-short': 'header-compact',
}
for (const oldKey in user_settings) {
   if (newKey = keyRenameTemplate[oldKey]) {
      console.log(oldKey, '=>', newKey);
      delete Object.assign(user_settings, { [newKey]: user_settings[oldKey] })[oldKey];
   }
   GM_setValue(configStoreName, user_settings);
}

if (isOptionsPage()) return;

if (!user_settings?.disable_setting_button) renderSettingButton();

landerPlugins();

function isOptionsPage() {
   // GM_registerMenuCommand('Settings', () => window.open(optionsPage));
   GM_registerMenuCommand('Settings', () => GM_openInTab(optionsPage));
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
               alert('Settings imported');
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

   // is optionsPage
   if (location.hostname === new URL(optionsPage).hostname) {
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
                  case 'undefined': obj[key] = undefined; break;
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
      });

      window.addEventListener('load', () => {
         // unlock if synchronized
         document.body?.classList?.remove('preload');

         document.body.querySelector('a[href$="issues/new"]')
            .addEventListener('click', ({ target }) => {
               target.href += '?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent);
            });
      });
   }
   // is user_settings empty
   else if (!user_settings || !Object.keys(user_settings).length) {
      user_settings['report_issues'] = 'on'; // default plugins settings
      GM_setValue(configStoreName, user_settings);
      // if (confirm('Active plugins undetected. Open the settings page now?')) window.open(optionsPage);
      if (confirm('Active plugins undetected. Open the settings page now?')) GM_openInTab(optionsPage);
   }
   // is not optionsPage
   else return false;

   return true;
}

function landerPlugins() {
   processLander();

   let playlist_page_transition_count = 0;

   function processLander() {
      const plugins_lander = setInterval(() => {
         // wait page loaded
         const domLoaded = document?.readyState != 'loading';
         if (!domLoaded) return console.debug('waiting, page loading..');

         clearInterval(plugins_lander);
         // force page reload. Dirty hack to page reset hack to clean up junk (for playlist)
         // playlistPageReload();

         console.groupCollapsed('plugins status');

         Plugins.run({
            'user_settings': user_settings,
            'app_ver': GM_info.script.version,
         });

      }, 500); // 100ms
   }

   let lastUrl = location.href;
   const isURLChanged = () => lastUrl == location.href ? false : lastUrl = location.href;
   // skip first page transition
   document.addEventListener('yt-navigate-start', () => isURLChanged() && processLander());

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

function renderSettingButton() {
   NOVA.waitElement('#masthead #end')
      .then(menu => {
         const a = document.createElement('a');
         a.title = 'Nova Settings';
         a.href = optionsPage + '?tabs=tab-plugins';
         a.target = '_blank';
         a.innerHTML =
            // <div style="display:inline-block;padding:var(--yt-button-icon-padding,8px);width:24px;height:24px;">
            `<yt-icon-button class="style-scope ytd-button-renderer style-default size-default">
               <svg viewBox="0 0 20 16">
                  <g fill="deepskyblue">
                     <polygon points="0,16 14,8 0,0"/>
                  </g>
               </svg>
            </yt-icon-button>`;
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
         menu.prepend(a);

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
         // btn.addEventListener('click', () => parent.open(optionsPage + '?tabs=tab-plugins'));
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
         '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent + ' [' + window.navigator.language + ']'));
      // , '_blank');
   }
};

window.addEventListener('unhandledrejection', err => {
   //if (!err.reason.stack.toString().includes(${JSON.stringify(chrome.runtime.id)})) return;
   console.error('[ERROR PROMISE]\n', err.reason, '\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent));

   // if (user_settings.report_issues && err.reason.stack.includes('/Nova%20YouTube.user.js'))
   if (user_settings.report_issues && (err.reason?.stack || err.stack)?.includes('Nova'))
      _pluginsCaptureException({
         'trace_name': 'unhandledrejection',
         'err_stack': err.reason.stack || err.stack,
         'app_ver': GM_info.script.version,
         'confirm_msg': `Failure when async-call of one "${GM_info.script.name}" plugin.\nDetails in the console\n\nOpen tab to report the bug?`,
      });
});
