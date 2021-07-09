console.log('%c /* %s */', 'color: #0096fa; font-weight: bold;', GM_info.script.name + ' v.' + GM_info.script.version);
const configStoreName = 'user_settings';
const fix_GM_getValue = v => v === 'undefined' ? undefined : v; // for Tampermonkey
const user_settings = fix_GM_getValue(GM_getValue(configStoreName));

if (!isOptionsPage()) return;
landerPlugins();
// ======
function isOptionsPage() {
   const optionsPage = 'https://raingart.github.io/options.html'; // ?tabs=tab-plugins

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
         for (let [key, value] of new FormData(form)) {
            if (obj.hasOwnProperty(key)) { // SerializedArray
               obj[key] += ',' + value; // add new
               obj[key] = obj[key].split(','); // to array [old, new]

            } else {
               obj[key] = value;
            };
         }

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
         }, 500); // 500ms
      });

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
                  // console.debug('check', name, reqParent.value + '=' + values);
                  if ((reqParent.checked && values) || values.includes(reqParent.value)) {
                     // console.debug('show:', name);
                     dependentItem.classList.remove("hide");

                  } else {
                     // console.debug('hide:', name);
                     dependentItem.classList.add("hide");
                  }
               }
            }
         }
      }

   } else if (!user_settings || !Object.keys(user_settings).length) {
      if (confirm('Active plugins undetected. Open the settings page?')) window.open(optionsPage);

   } else return true; // is not optionsPage
}

// ======
function landerPlugins() {
   let plugins_lander = setInterval(() => {
      const domLoaded = document?.readyState !== 'loading';
      if (!domLoaded) return console.debug('waiting, page loading..');

      if (_plugins_conteiner.length) {
         clearInterval(forceLander);
         processLander();
      }

   }, 100); // 100ms

   function processLander() {
      console.groupCollapsed('plugins status');
      console.debug('loaded:', _plugins_conteiner.length);
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
