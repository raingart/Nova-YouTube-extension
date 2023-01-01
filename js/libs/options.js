console.debug('init options.js');

// window.addEventListener('load', () => {

const Conf = {
   // storageMethod: 'local',
   storageMethod: 'sync',

   attrDependencies() {
      document.body.querySelectorAll('[data-dependent]')
         .forEach(dependentEl => {
            // let dependentsList = dependentEl.getAttribute('data-dependent').split(',').forEach(i => i.trim());
            const dependentsJson = JSON.parse(dependentEl.getAttribute('data-dependent').toString());
            const handler = () => showOrHide(dependentEl, dependentsJson);
            // document.getElementById(Object.keys(dependentsJson))?.addEventListener('change', handler);
            document.getElementsByName(Object.keys(dependentsJson))
               .forEach(el => el.addEventListener('change', handler));
            // init state
            handler();
         });

      function showOrHide(dependentEl, dependentsJson) {
         // console.debug('showOrHide', ...arguments);
         for (const parrentName in dependentsJson) {
            // console.log(`dependent_data.${name} = ${dependent_data[name]}`);
            const parrentEl = Array.from(document.getElementsByName(parrentName))
               .find(e => (e.type == 'radio') ? e.checked : e); // return radio:checked or document.getElementsByName(parrentName)[0]

            if (parrentEl) {
               const ruleValues = Array.isArray(dependentsJson[parrentName])
                  ? dependentsJson[parrentName]
                  : [dependentsJson[parrentName]];

               const currentValuesList = (function () {
                  // for options
                  if (options = parrentEl?.selectedOptions) {
                     return Array.from(options).map(({ value }) => value);
                  }
                  return [parrentEl.value];
                  // return [parrentEl.type == 'checkbox' ? parrentEl.checked : parrentEl.value];
               })();

               // if (parrentName == 'stop_preload_embed')
               //    console.debug(parrentName, ruleValues, currentValuesList);

               if (ruleValues.length // filter value present
                  && ( // element has value or checked
                     (parrentEl.checked && !parrentEl.matches('[type="radio"]')) // skip radio (which is always checked. Unlike a checkbox)
                     || ruleValues.some(i => currentValuesList.includes(i.toString())) // has value
                  )
                  // || (ruleValues.startsWith('!') && parrentEl.value !== ruleValues.replace('!', '')) // inverse value
                  || ruleValues.some(i =>
                     i.toString().startsWith('!') && !currentValuesList.includes(i.toString().replace('!', '')) // inverse value
                  )
               ) {
                  // console.debug('show:', parrentName);
                  dependentEl.classList.remove('hide');
                  childInputDisable(false);

               } else {
                  // console.debug('hide:', parrentName);
                  dependentEl.classList.add('hide');
                  childInputDisable(true);
               }

            } else {
               console.error('error showOrHide:', parrentName);
            }
         }

         function childInputDisable(status = false) {
            dependentEl.querySelectorAll('input, textarea, select')
               .forEach(el => {
                  el.disabled = Boolean(status);
                  // dependentEl.readOnly = Boolean(status);
               });
         }
      }
   },

   // Saves options to localStorage/chromeSync.
   saveOptions(form) {
      let newSettings = {};

      for (let [key, value] of new FormData(form)) {
         if (newSettings.hasOwnProperty(key)) { // SerializedArray
            newSettings[key] += ',' + value; // add new
            newSettings[key] = newSettings[key].split(','); // to array [old, new]

         } else {
            // convert string to boolean
            switch (value) {
               case 'true': newSettings[key] = true; break;
               case 'false': newSettings[key] = false; break;
               case 'undefined': newSettings[key] = undefined; break;
               default: newSettings[key] = value;
            }
         };
      }

      Storage.setParams(newSettings, this.storageMethod);

      // notify background page
      // chrome.extension.sendMessage({ // manifest v2
      // chrome.runtime.sendMessage({ // manifest v3
      //    "action": 'setOptions',
      //    "settings": newSettings
      // });
   },

   btnSubmitAnimation: {
      // submitBtns: document.body.querySelectorAll('form [type=submit]'),

      _process() {
         this.submitBtns.forEach(e => {
            e.textContent = i18n('opt_btn_save_settings_process');
            e.classList.remove('unSaved');
            e.disabled = true;
            document.body.style.cursor = 'wait';
         });
      },

      _defaut() {
         setTimeout(() => {
            this.submitBtns.forEach(e => {
               e.textContent = i18n('opt_btn_save_settings');
               e.removeAttribute('disabled');
               document.body.style.cursor = 'default';
            });
         }, 300); // 300ms
      },
   },

   // Register the event handlers.
   registerEventListener() {
      // form submit
      document.addEventListener('submit', evt => {
         // console.debug('submit', event.target);
         evt.preventDefault();

         this.btnSubmitAnimation._process();
         this.saveOptions(evt.target);
         this.btnSubmitAnimation._defaut();
      });
      // form unsave
      document.addEventListener('change', ({ target }) => {
         // console.debug('change', target, 'name:', target.name);
         // if (!target.matches('input[type=search]')) return;
         if (!target.name || target.name == 'tabs') return; // fix/ignore switch tabs
         this.btnSubmitAnimation.submitBtns.forEach(e => e.classList.add('unSaved'));
         // textarea trim value
         if (target.tagName.toLowerCase() == 'textarea') target.value = target.value.trim();
      });
   },

   init() {
      Storage.getParams(settings => {
         PopulateForm.fill(settings);
         this.attrDependencies();
         this.registerEventListener();
         document.body.classList.remove('preload');
         // auto selects value on focus
         document.body.querySelectorAll('form input[type]').forEach(i => i.addEventListener('focus', i.select));
         this.btnSubmitAnimation.submitBtns = document.body.querySelectorAll('form [type=submit]');
      }, this.storageMethod);
   },
}

//    Conf.init();
// });
