console.log('%c /* %s */', 'color:#0096fa; font-weight:bold;', GM_info.script.name + ' v.' + GM_info.script.version);
const
   optionsPage = 'https://raingart.github.io/options.html', // ?tabs=tab-plugins
   configStoreName = 'user_settings',
   fix_GM_getValue = v => v === 'undefined' ? undefined : v, // for Tampermonkey
   user_settings = fix_GM_getValue(GM_getValue(configStoreName));

if (!isOptionsPage()) return;
landerPlugins();
renderSettingButton();
reflectException();

function renderSettingButton() {
   YDOM.waitElement('#masthead #buttons > *:first-child')
      .then(container => {
         const a = document.createElement('a');
         a.title = 'Nova Settings';
         a.href = optionsPage + '?tabs=tab-plugins';
         a.target = '_blank';
         a.innerHTML =
            // <div style="display:inline-block;padding:var(--yt-button-icon-padding,8px);width:24px;height:24px;">
            `<yt-icon-button class="style-scope ytd-button-renderer style-default size-default">
               <svg viewBox="0 0 28 28" height="100%" width="100%" version="1.1" style="fill:deepskyblue">
                  <polygon points='21 12 3,1.8 3 22.2' />
                  <path d='M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z' />
               </svg>
            </yt-icon-button>`;
         a.addEventListener('click', () => {
            // fix hide <tp-yt-iron-dropdown>
            setTimeout(() => document.body.click(), 200);
         });
         container.prepend(a);
      });
}
// function renderSettingButton() {
//    YDOM.waitElement('#end:last-child')
//    // YDOM.waitElement('#end')
//       .then(container => {
//          const button = document.createElement('button');
//          button.innerHTML =
//             `<svg width="24" height="24" viewBox="0 0 22 22" style="fill:deepskyblue">
//                <polygon points='21 12 3,1.8 3 22.2' />
//                <path d='M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z' />
//             </svg>`;
//          button.style = 'background: transparent; border: 0; color: rgb(96,96,96); outline: 0; cursor: pointer; padding-left: 24px; padding-right: 24px;';

//          a.addEventListener('click', () => {
//             // fix hide <tp-yt-iron-dropdown>
//             setTimeout(() => document.body.click(), 200);
//          });
//          container.insertBefore(button, container.lastElementChild);
//       });
// }

function isOptionsPage() {
   GM_registerMenuCommand('Settings', () => window.open(optionsPage));
   GM_registerMenuCommand('Export settings', () => {
      let d = document.createElement('a');
      d.style.display = 'none';
      d.setAttribute('download', 'nova-settings.json');
      d.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(user_settings)));
      document.body.appendChild(d);
      d.click();
      document.body.removeChild(d);
   });
   GM_registerMenuCommand('Import settings', () => {
      let f = document.createElement('input');
      f.type = 'file';
      f.accept = 'application/JSON';
      f.style.display = 'none';
      f.addEventListener('change', function () {
         if (f.files.length !== 1) return;
         let rdr = new FileReader();
         rdr.addEventListener('load', function () {
            try {
               GM_setValue(configStoreName, JSON.parse(rdr.result));
               alert('Settings imported');
               document.location.reload();
            }
            catch (err) { alert('Error parsing settings\n' + err.name + ": " + err.message); }
         });
         rdr.addEventListener('error', error => alert('Error loading file\n' + rdr.error));
         rdr.readAsText(f.files[0]);
      });
      document.body.appendChild(f);
      f.click();
      document.body.removeChild(f);
   });

   if (location.hostname === new URL(optionsPage).hostname) {
      // form submit
      document.addEventListener('submit', event => {
         // console.debug('submit', event.target);
         event.preventDefault();

         let obj = {};
         for (let [key, value] of new FormData(event.target)) {
            if (obj.hasOwnProperty(key)) { // SerializedArray
               obj[key] += ',' + value; // add new
               obj[key] = obj[key].split(','); // to array [old, new]

            } else {
               obj[key] = value;
            };
         }
         // fix tab reassignment
         if (obj.tabs) delete obj.tabs;

         console.debug(`update ${configStoreName}:`, obj);
         GM_setValue(configStoreName, obj);
      });

      window.addEventListener('load', () => {
         let interval_pagesync = setInterval(() => {
            //if (document.body.classList.contains("preload")) return console.debug('page loading..');
            if (!document.querySelector("[data-dependent]")) return console.debug('page loading..');
            clearInterval(interval_pagesync);

            PopulateForm.fill(user_settings); // fill form
            attrDependencies();
            document.body.classList.remove("preload");
            // fix/ re-call // remove api warn if has api
            if (user_settings && user_settings['custom-api-key']) {
               document.querySelectorAll('.info b').forEach(el => el.parentNode.removeChild(el));
            }
         }, 500); // 500ms

         function attrDependencies() {
            document.querySelectorAll("[data-dependent]")
               .forEach(dependentItem => {
                  // let dependentsList = dependentItem.getAttribute('data-dependent').split(',').forEach(i => i.trim());
                  const dependentsJson = JSON.parse(dependentItem.getAttribute('data-dependent').toString());
                  const handler = () => showOrHide(dependentItem, dependentsJson);
                  document.getElementById(Object.keys(dependentsJson))?.addEventListener("change", handler);
                  // init state
                  handler();
               });

            function showOrHide(dependentItem, dependentsList) {
               // console.debug('showOrHide', ...arguments);
               for (const name in dependentsList) {
                  const reqParent = document.getElementsByName(name)[0];
                  if (!reqParent) return console.error('error showOrHide:', name);

                  for (const values of [dependentsList[name]]) {
                     if ((!values.toString().startsWith('!') && ((reqParent.checked && values) || values.includes(reqParent.value)))
                        // reserve
                        || (values.toString().startsWith('!') && reqParent.value !== values.toString().replace('!', ''))
                     ) {
                        // console.debug('show:', name);
                        dependentItem.classList.remove("hide");
                        childInputDisable(false);

                     } else {
                        // console.debug('hide:', name);
                        dependentItem.classList.add("hide");
                        childInputDisable(true);
                     }
                  }
               }

               function childInputDisable(status = false) {
                  dependentItem.querySelectorAll('input, textarea, select')
                     .forEach(childItem => {
                        childItem.disabled = status;
                        // dependentItem.readOnly = status;
                     });
               }
            }
         }
      });

   } else if (!user_settings || !Object.keys(user_settings).length) {
      if (confirm('Active plugins undetected. Open the settings page?')) window.open(optionsPage);

   } else return true; // is not optionsPage
}

function landerPlugins() {
   let plugins_lander = setInterval(() => {
      const domLoaded = document?.readyState !== 'loading';
      if (!domLoaded) return console.debug('waiting, page loading..');
      processLander();

   }, 100); // 100ms

   function processLander() {
      console.groupCollapsed('plugins status');
      clearInterval(plugins_lander);

      //setTimeout(() => {
      Plugins.run({
         'user_settings': user_settings,
         'app_ver': GM_info.script.version,
      });
      //}, 300);
   }

   let lastUrl = location.href;
   const isURLChanged = () => lastUrl == location.href ? false : lastUrl = location.href;
   // skip first run on page transition
   document.addEventListener('yt-navigate-start', () => isURLChanged() && landerPlugins());
}

function reflectException() {
   function _pluginsCaptureException({ trace_name, err_stack, confirm_msg, app_ver }) {
      GM_notification({ text: GM_info.script.name + '\n' + err.reason, timeout: 4000, onclick: reportBug });

      if (confirm(confirm_msg || `Error in ${GM_info.script.name}. Open popup to report the bug?`)) {
         reportBug();
      }
   };

   function reportBug() {
      window.open(
         'https://docs.google.com/forms/u/0/d/e/1FAIpQLScfpAvLoqWlD5fO3g-fRmj4aCeJP9ZkdzarWB8ge8oLpE5Cpg/viewform' +
         '?entry.35504208=' + encodeURIComponent(trace_name) +
         '&entry.151125768=' + encodeURIComponent(err_stack) +
         '&entry.744404568=' + encodeURIComponent(location.href) +
         '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent), '_blank');
   }

   window.addEventListener('unhandledrejection', err => {
      //if (!err.reason.stack.toString().includes(${JSON.stringify(chrome.runtime.id)})) return;
      console.error('[ERROR PROMISE]\n', err.reason, '\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new/choose');

      if (user_settings.report_issues)
         _pluginsCaptureException({
            'trace_name': 'unhandledrejection',
            'err_stack': err.reason.stack,
            'app_ver': GM_info.script.version,
            'confirm_msg': 'Failure when async-call of one "Nova YouTube™" plugin.\n\nOpen tab to report the bug?',
         });
   });
}
