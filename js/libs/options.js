console.log(i18n("app_name") + ": init options.js");

window.addEventListener('load', (evt) => {

   const Conf = {

      attrDependencies() {
         [...document.querySelectorAll("[data-dependent]")].forEach(dependentItem => {
            // let dependentsList = dependentItem.getAttribute('data-dependent').split(',').forEach(i => i.trim());
            let dependentsJson = JSON.parse(dependentItem.getAttribute('data-dependent').toString());

            let handler = () => showOrHide(dependentItem, dependentsJson);
            // init state
            handler();

            let dependentTag = document.getElementById(Object.keys(dependentsJson))
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
                     // console.log('reqParent.checked');
                     dependentItem.classList.remove("hide");

                  } else if (reqParent.value == thisVal) {
                     dependentItem.classList.remove("hide");
                     // console.log(reqParent.value + '==' + thisVal);
                     break;

                  } else {
                     dependentItem.classList.add("hide");
                     // console.log(reqParent.value + '!=' + thisVal);
                  }
               }
         }
      },

      // Saves options to localStorage/chromeSync.
      saveOptions(form) {
         let obj = {};

         new FormData(form).forEach((value, key) => {
            // SerializedArray
            if (obj.hasOwnProperty(key)) {
               // adding another val
               obj[key] += ';' + value; // add new
               obj[key] = obj[key].split(';'); // to key = [old, new]

            } else obj[key] = value;
         });

         Storage.setParams(obj, 'sync');

         chrome.extension.sendMessage({
            "action": 'setOptions',
            "options": obj
         });
      },

      bthSubmitAnimation: {
         outputStatus: document.querySelector("button[type=submit]"),

         _process: () => {
            Conf.bthSubmitAnimation.outputStatus.textContent = i18n("opt_bth_save_settings_process");
            Conf.bthSubmitAnimation.outputStatus.setAttribute("disabled", true);
         },

         _defaut: () => {
            setTimeout(function () {
               Conf.bthSubmitAnimation.outputStatus.textContent = i18n("opt_bth_save_settings");
               Conf.bthSubmitAnimation.outputStatus.removeAttribute("disabled");
            }, 300);
         },
      },

      // getPermissions: (requested, event) => {
      //    if (Array.isArray(requested) && (event.target.checked || event.target.options)) {
      //       // Permissions must be requested
      //       chrome.permissions.contains({
      //          permissions: requested
      //       }, granted => {
      //          chrome.permissions.request({
      //             permissions: requested,
      //          }, granted => {
      //             // The callback argument will be true if the user granted the permissions.
      //             event.target.checked = granted ? true : false;
      //             event.target.selectedIndex = granted ? event.target.selectedIndex : event.target.selectedIndex === 0 ? -1 : 0;
      //             Conf.attrDependencies(); //fix trigger
      //          });
      //       });
      //    }
      // },

      // Register the event handlers.
      eventListener: (function () {
         // Array.from(document.forms)
         //    .forEach((form) => {
         document.forms[0] // get form
            .addEventListener('submit', function (event) {
               event.preventDefault();
               Conf.bthSubmitAnimation._process();
               Conf.saveOptions(this);
               Conf.bthSubmitAnimation._defaut();
            });
         // });

         // document.getElementById('')
         //    .addEventListener("change", function (event) {
         //       // console.log('event.type:', event.type);
         //       Conf.getPermissions(['notifications'], event);
         //    });
      }()),

      init() {
         let callback = obj => {
            PopulateForm.fill(obj);

            this.attrDependencies();

            document.querySelector("body").classList.remove("preload");
         };
         Storage.getParams(callback, 'sync');

         // // Bug reload page. Need fix options.html
         // // save callback event
         // let form = document.forms[0];
         // let submitted = e => {
         //    e.preventDefault();
         //    this.saveOptions(form);
         // }
         // form.onsubmit = submitted.bind(form);

         // // auto submit form
         // Array.from(form.getElementsByTagName("input"))
         //    .forEach(input =>
         //       input.addEventListener('change', () => {
         //          form.submit()
         //       })
         //    );
      },
   }

   Conf.init();
});
