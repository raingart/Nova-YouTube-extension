console.debug('init options.js');

window.addEventListener('load', () => {

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
            for (const targetName in dependentsJson) {
               // console.log(`dependent_data.${name} = ${dependent_data[name]}`);
               const targetEl = Array.from(document.getElementsByName(targetName))
                  .find(e => (e.type == 'radio') ? e.checked : e); // return radio:checked or document.getElementsByName(targetName)[0]

               if (targetEl) {
                  const targetValues = Array.isArray(dependentsJson[targetName])
                     ? dependentsJson[targetName]
                     : [dependentsJson[targetName]];

                  const targetValuesList = (function () {
                     if (options = targetEl?.selectedOptions) {
                        return Array.from(options).map(({ value }) => value);
                     }
                     return [targetEl.value];
                  })();

                  // if (targetName == 'player_full_viewport')
                  //    console.debug('targetValues', targetValuess, targetValues, dependentsJson[targetName]);

                  if (targetValues.length // filter value present
                     && ( // element has value or checked
                        (targetEl.checked && !targetEl.matches('[type="radio"]')) // skip radio (which is always checked. Unlike a checkbox)
                        || targetValues.some(i => targetValuesList.includes(i.toString())) // has value
                     )
                     // || (targetValues.startsWith('!') && targetEl.value !== targetValues.replace('!', '')) // inverse value
                     || targetValues.some(i =>
                        i.toString().startsWith('!') && !targetValuesList.includes(i.toString().replace('!', '')) // inverse value
                     )
                  ) {
                     // console.debug('show:', targetName);
                     dependentEl.classList.remove('hide');
                     childInputDisable(false);

                  } else {
                     // console.debug('hide:', targetName);
                     dependentEl.classList.add('hide');
                     childInputDisable(true);
                  }

               } else {
                  console.error('error showOrHide:', targetName);
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
               newSettings[key] = value;
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
         outputStatus: document.body.querySelectorAll('form [type=submit]'),

         _process() {
            this.outputStatus.forEach(e => {
               e.textContent = i18n('opt_btn_save_settings_process');
               e.classList.remove('unSaved');
               e.disabled = true;
               document.body.style.cursor = 'wait';
            });
         },

         _defaut() {
            setTimeout(() => {
               this.outputStatus.forEach(e => {
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
            if (this.btnSubmitAnimation.outputStatus.length && !this.btnSubmitAnimation.outputStatus[0].classList.contains('unSaved')) {
               this.btnSubmitAnimation.outputStatus.forEach(e => e.classList.add('unSaved'));
            }
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
            document.body.querySelectorAll('form input[type]') // auto selects value on focus
               .forEach(i => i.addEventListener('focus', i.select));
         }, this.storageMethod);
      },
   }

   Conf.init();
});
