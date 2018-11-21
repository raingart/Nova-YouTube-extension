console.log(i18n("app_name") + ": init options.js");

window.addEventListener('load', (evt) => {

   const Conf = {

      attrDependencies: () => {
         Array.from(document.querySelectorAll("[data-dependent]"))
            .forEach((dependentItem) => {
               // let dependentsList = dependentItem.getAttribute('data-dependent').split(',').forEach(i => i.trim());
               let dependentsJson = JSON.parse(dependentItem.getAttribute('data-dependent').toString());

               let handler = function () {
                  showOrHide(dependentItem, dependentsJson);
               };
               // init state
               handler();

               document.getElementById(Object.keys(dependentsJson)) //dependentTag
                  .addEventListener("change", handler);
            });

         function showOrHide(dependentItem, dependentsList) {
            for (const name in dependentsList)
               for (const thisVal of dependentsList[name]) {
                  let reqParent = document.getElementsByName(name)[0];

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
      saveOptions: (form, callback) => {
         let formData = new FormData(form);
         let newOptions = {};

         // add unchecked checkboxes
         // NOTE broked checkbox fill
         // let inputs = document.getElementsByTagName("input");
         // for (let i in inputs) {
         //    let el = inputs[i];
         //    if (el.type == "checkbox") {
         //       // formData.append(el.name, el.checked ? el.value : false);
         //       formData.append(el.name, el.checked ? true : false);
         //    }
         // }

         for (const [key, value] of formData.entries()) {
            // console.log(key, value);
            newOptions[key] = value;
         }

         Storage.setParams(newOptions, true /* true=sync, false=local */ );

         chrome.extension.sendMessage({
            "action": 'setOptions',
            "options": newOptions
         }, function (resp) {
            if (callback && typeof (callback) === "function") {
               return callback();
            }
         });
      },

      bthSaveAnimation: {
         outputStatus: document.querySelector("button"),

         _process: () => {
            Conf.bthSaveAnimation.outputStatus.innerHTML = i18n("opt_bth_save_settings_process");
            Conf.bthSaveAnimation.outputStatus.classList.add("disabled");
            Conf.bthSaveAnimation.outputStatus.classList.add("in-progress");
         },

         _processed: () => {
            Conf.bthSaveAnimation.outputStatus.innerHTML = i18n("opt_bth_save_settings_processed");
            Conf.bthSaveAnimation.outputStatus.classList.remove("in-progress");
         },

         _defaut: () => {
            setTimeout(function () {
               Conf.bthSaveAnimation._processed();
               Conf.bthSaveAnimation.outputStatus.innerHTML = i18n("opt_bth_save_settings");
               Conf.bthSaveAnimation.outputStatus.classList.remove("disabled");
            }, 300);
         },
      },

      // Conf.getPermissions(['notifications'], event);
      // getPermissions: (requested, event) => {
      //    if (Array.isArray(requested) && event.target.checked) {
      //       // Permissions must be requested
      //       chrome.permissions.contains({
      //          permissions: requested
      //       }, function (granted) {
      //          chrome.permissions.request({
      //             permissions: requested,
      //          }, function (granted) {
      //             // The callback argument will be true if the user granted the permissions.
      //             event.target.checked = granted ? true : false;
      //             Conf.attrDependencies(); //fix trigger
      //          });
      //       });
      //    }
      // },

      // Register the event handlers.
      eventListener: (function () {
         document.forms[0] // get form
            .addEventListener('submit', function (event) {
               event.preventDefault();
               Conf.bthSaveAnimation._process();
               Conf.saveOptions(this, Conf.bthSaveAnimation._processed);
               Conf.bthSaveAnimation._defaut();
            }, false);

         // document.getElementById('')
         //    .addEventListener("change", function (event) {
         //       // console.log('event.type:', event.type);
         //       Conf.getPermissions(['notifications'], event);
         //    });
      }()),

      init: () => {
         let callback = (res) => {
            UIr.restoreElmValue(res);
            Conf.attrDependencies();
      
            document.querySelector("body").classList.remove("preload");
         };
         Storage.getParams(null, callback, true /* true=sync, false=local */ );
      },
   }

   Conf.init();
});
