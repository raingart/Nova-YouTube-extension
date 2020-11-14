console.debug("init options.js");

window.addEventListener('load', evt => {

   const Conf = {
      // storageMethod: 'local',
      storageMethod: 'sync',

      attrDependencies() {
         [...document.querySelectorAll("[data-dependent]")]
            .forEach(dependentItem => {
               // let dependentsList = dependentItem.getAttribute('data-dependent').split(',').forEach(i => i.trim());
               const dependentsJson = JSON.parse(dependentItem.getAttribute('data-dependent').toString());
               const handler = () => showOrHide(dependentItem, dependentsJson);
               // init state
               handler();

               const dependentTag = document.getElementById(Object.keys(dependentsJson))
               if (dependentTag) dependentTag.addEventListener("change", handler);
            });

         function showOrHide(dependentItem, dependentsList) {
            for (const name in dependentsList)
               for (const thisVal of dependentsList[name]) {
                  let reqParent = document.getElementsByName(name)[0];
                  if (!reqParent) {
                     console.error('error showOrHide:', name);
                     continue;
                  }

                  if (reqParent.checked && thisVal) {
                     // console.debug('reqParent.checked');
                     dependentItem.classList.remove("hide");

                  } else if (reqParent.value == thisVal) {
                     dependentItem.classList.remove("hide");
                     // console.debug(reqParent.value + '==' + thisVal);
                     break;

                  } else {
                     dependentItem.classList.add("hide");
                     // console.debug(reqParent.value + '!=' + thisVal);
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
      eventListener: (function () {
         [...document.forms]
            .forEach(form => {
               form.addEventListener('submit', function (event) {
                  event.preventDefault();
                  Conf.btnSubmitAnimation._process();
                  Conf.saveOptions(this);
                  Conf.btnSubmitAnimation._defaut();
               });
            });
      }()),

      init() {
         Storage.getParams(obj => {
            PopulateForm.fill(obj);
            this.attrDependencies();
            document.body.classList.remove("preload");

            // unSaved form
            [...document.forms[0].elements]
               .filter(i => i.type == 'checkbox')
               .forEach(i => {
                  i.addEventListener('change', event => {
                     if (!Conf.btnSubmitAnimation.outputStatus.classList.contains('unSaved')) {
                        Conf.btnSubmitAnimation.outputStatus.classList.add('unSaved');
                     }
                  });
               });
         }, this.storageMethod);
      },
   }

   Conf.init();
});
