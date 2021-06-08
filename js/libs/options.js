console.debug("init options.js");

window.addEventListener('load', evt => {

   const Conf = {
      // storageMethod: 'local',
      storageMethod: 'sync',

      attrDependencies() {
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
      },

      // Saves options to localStorage/chromeSync.
      saveOptions(form) {
         let obj = {};

         new FormData(form)
            .forEach((value, key) => {
               // SerializedArray
               if (obj.hasOwnProperty(key)) {
                  // adding another val
                  obj[key] += ';' + value; // add new
                  obj[key] = obj[key].split(';'); // to key = [old, new]

               } else obj[key] = value;
            });

         Storage.setParams(obj, this.storageMethod);

         // notify background page
         // chrome.extension.sendMessage({
         //    "action": 'setOptions',
         //    "options": obj
         // });
      },

      btnSubmitAnimation: {
         outputStatus: document.querySelector("[type=submit]"),

         _process() {
            this.outputStatus.textContent = i18n("opt_btn_save_settings_process");
            this.outputStatus.setAttribute("disabled", true);
         },

         _defaut() {
            setTimeout(() => {
               this.outputStatus.textContent = i18n("opt_btn_save_settings");
               this.outputStatus.removeAttribute("disabled");
               this.outputStatus.classList.remove('unSaved');
            }, 300);
         },
      },

      // Register the event handlers.
      registerEventListener() {
         // form submit
         document.addEventListener('submit', event => {
            // console.debug('submit', event.target);
            event.preventDefault();

            this.btnSubmitAnimation._process();
            this.saveOptions(event.target);
            this.btnSubmitAnimation._defaut();
         });
         // form unsave
         document.addEventListener('change', ({ target }) => {
            // console.debug('change', target);
            if (target.name == "tabs") return; // fix/ignore switch tabs
            if (!this.btnSubmitAnimation.outputStatus.classList.contains('unSaved')) {
               this.btnSubmitAnimation.outputStatus.classList.add('unSaved');
            }
         });
      },

      init() {
         Storage.getParams(obj => {
            PopulateForm.fill(obj);
            this.attrDependencies();
            this.registerEventListener();
            document.body.classList.remove("preload");
         }, this.storageMethod);
      },
   }

   Conf.init();
});
