console.debug('init options.js');

window.addEventListener('load', () => {

   const Conf = {
      // storageMethod: 'local',
      storageMethod: 'sync',

      attrDependencies() {
         document.querySelectorAll('[data-dependent]')
            .forEach(dependentItem => {
               // let dependentsList = dependentItem.getAttribute('data-dependent').split(',').forEach(i => i.trim());
               const dependentsJson = JSON.parse(dependentItem.getAttribute('data-dependent').toString());
               const handler = () => showOrHide(dependentItem, dependentsJson);
               document.getElementById(Object.keys(dependentsJson))?.addEventListener('change', handler);
               // init state
               handler();
            });

         function showOrHide(dependentItem, dependentsJson) {
            // console.debug('showOrHide', ...arguments);
            for (const name in dependentsJson) {
               // console.log(`dependent_data.${name} = ${dependent_data[name]}`);
               if (dependentOnEl = document.getElementsByName(name)[0]) {
                  const val = dependentsJson[name].toString();
                  const dependentOnValues = (function () {
                     if (options = dependentOnEl?.selectedOptions) {
                        return Array.from(options).map(({ value }) => value);
                     }
                     return [dependentOnEl.value];
                  })();

                  if (val && (dependentOnEl.checked || dependentOnValues.includes(val))
                     || (val?.startsWith('!') && dependentOnEl.value !== val.replace('!', '')) // inverse
                  ) {
                     // console.debug('show:', name);
                     dependentItem.classList.remove('hide');
                     childInputDisable(false);

                  } else {
                     // console.debug('hide:', name);
                     dependentItem.classList.add('hide');
                     childInputDisable(true);
                  }

               } else {
                  console.error('error showOrHide:', name);
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
      },

      // Saves options to localStorage/chromeSync.
      saveOptions(form) {
         let obj = {};

         for (let [key, value] of new FormData(form)) {
            if (obj.hasOwnProperty(key)) { // SerializedArray
               obj[key] += ',' + value; // add new
               obj[key] = obj[key].split(','); // to array [old, new]

            } else {
               obj[key] = value;
            };
         }

         Storage.setParams(obj, this.storageMethod);

         // notify background page
         // chrome.extension.sendMessage({
         //    "action": 'setOptions',
         //    "options": obj
         // });
      },

      btnSubmitAnimation: {
         outputStatus: document.querySelectorAll('[type=submit]'),

         _process() {
            this.outputStatus.forEach(e => {
               e.textContent = i18n('opt_btn_save_settings_process');
               e.disabled = true;
            });
         },

         _defaut() {
            setTimeout(() => {
               this.outputStatus.forEach(e => {
                  e.textContent = i18n('opt_btn_save_settings');
                  e.removeAttribute('disabled');
                  e.classList.remove('unSaved');
               });
            }, 300);
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
            // console.debug('change', target);
            if (target.name == 'tabs') return; // fix/ignore switch tabs
            if (this.btnSubmitAnimation.outputStatus.length && !this.btnSubmitAnimation.outputStatus[0].classList.contains('unSaved')) {
               this.btnSubmitAnimation.outputStatus.forEach(e => e.classList.add('unSaved'));
            }
         });
      },

      init() {
         Storage.getParams(obj => {
            PopulateForm.fill(obj);
            this.attrDependencies();
            this.registerEventListener();
            document.body.classList.remove('preload');
            document.querySelectorAll('input[type]') // auto selects value on focus
               .forEach(i => i.addEventListener('focus', i.select));
         }, this.storageMethod);
      },
   }

   Conf.init();
});
