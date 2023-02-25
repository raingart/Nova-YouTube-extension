console.debug('init options.js');

// window.addEventListener('load', () => {

const PopulateForm = {
   // storageMethod: 'local',
   storageMethod: 'sync',

   fill(settings, container) {
      // console.log("Load from Storage: %s=>%s", container?.id, JSON.stringify(settings));

      for (const key in settings) {
         const val = settings[key];
         // const el = document.body.getElementsByName(key)[0] || document.getElementById(key);
         if (el = (container || document.body).querySelector(`[name="${key}"]`)
            || (container || document.body).querySelector('#' + key)) {
            // console.log('>opt %s#%s=%s', el.tagName, key, val);

            switch (el.tagName.toLowerCase()) {
               case 'div':
                  // el.innerHTML += val;
                  el.textContent = val;
                  break;

               case 'textarea':
                  el.value = val;
                  break;

               case 'select':
                  (Array.isArray(val) ? val : [val])
                     .forEach(value => setSelectOption(el, value)); // select multiple
                  break;

               case 'input':
                  switch (el.type.toLowerCase()) {
                     case 'checkbox':
                        (Array.isArray(val) ? val : [val])
                           .forEach(value => (el.checked = value) ? true : false); // multiple Check/Uncheck
                        break;

                     case 'radio':
                        [...document.getElementsByName(key)]?.some(e => e.value == val && (e.checked = true));
                        break;

                     default:
                        el.value = val;
                  }
                  break;
            }
         }
      }

      function setSelectOption(selectObj, val) {
         for (const option of selectObj.children) {
            if (option.value === String(val)) {
               option.selected = true;
               break;
            }
         }
      }
   },

   attrDependencies() {
      document.body.querySelectorAll('[data-dependent]')
         .forEach(targetEl => {
            // let dependentsList = targetEl.getAttribute('data-dependent').split(',').forEach(i => i.trim());
            const rules = JSON.parse(targetEl.getAttribute('data-dependent').toString());
            const handler = () => showOrHide(targetEl, rules);
            // document.getElementById(Object.keys(rules))?.addEventListener('change', handler);
            document.getElementsByName(Object.keys(rules))
               .forEach(el => el.addEventListener('change', handler));
            // init state
            handler();
         });

      function showOrHide(targetEl, rules) {
         // console.debug('showOrHide', ...arguments);
         for (const parrentName in rules) {
            // console.log(`dependent_data.${name} = ${dependent_data[name]}`);
            const subtargetEl = Array.from(document.getElementsByName(parrentName))
               .find(e => (e.type == 'radio') ? e.checked : e); // return radio:checked or document.getElementsByName(parrentName)[0]

            if (subtargetEl) {
               const ruleValues = Array.isArray(rules[parrentName])
                  ? rules[parrentName]
                  : [rules[parrentName]];

               const currentValuesList = (function () {
                  // for options
                  if (options = subtargetEl?.selectedOptions) {
                     return Array.from(options).map(({ value }) => value);
                  }
                  return [subtargetEl.value];
                  // return [(subtargetEl.type == 'checkbox') ? subtargetEl.checked : subtargetEl.value];
               })();

               // if (parrentName == 'stop_preload_embed')
               //    console.debug(parrentName, ruleValues, currentValuesList);

               if (ruleValues.length // filter value present
                  && ( // element has value or checked
                     (subtargetEl.checked && !subtargetEl.matches('[type="radio"]')) // skip radio (which is always checked. Unlike a checkbox)
                     || ruleValues.some(i => currentValuesList.includes(i.toString())) // has value
                  )
                  // || (ruleValues.startsWith('!') && subtargetEl.value !== ruleValues.replace('!', '')) // inverse value
                  || ruleValues.some(i =>
                     i.toString().startsWith('!') && !currentValuesList.includes(i.toString().replace('!', '')) // inverse value
                  )
               ) {
                  // console.debug('show:', parrentName);
                  targetEl.classList.remove('hide');
                  childInputDisable(false);
               }
               else {
                  // console.debug('hide:', parrentName);
                  targetEl.classList.add('hide');
                  childInputDisable(true);
               }
            }
            else console.error('error showOrHide:', parrentName);
         }

         function childInputDisable(status = false) {
            targetEl.querySelectorAll('input, textarea, select')
               .forEach(el => {
                  el.disabled = Boolean(status);
                  // targetEl.readOnly = Boolean(status);
               });
         }
      }
   },

   // Saves options to localStorage/chromeSync.
   saveOptions(form) {
      let newSettings = {};

      for (const [key, value] of new FormData(form)) {
         // SerializedArray
         if (newSettings.hasOwnProperty(key)) {
            newSettings[key] += ',' + value; // add new
            newSettings[key] = newSettings[key].split(','); // to array [old, new]
         }
         else {
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
   registerEventListeners() {
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
         this.fill(settings);
         this.attrDependencies();
         this.registerEventListeners();
         document.body.classList.remove('preload');
         // auto selects value on focus
         document.body.querySelectorAll('form input[type]').forEach(i => i.addEventListener('focus', i.select));
         this.btnSubmitAnimation.submitBtns = document.body.querySelectorAll('form [type=submit]');
      }, this.storageMethod);
   },
}

//    Form.init();
// });
