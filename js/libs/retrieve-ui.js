const PopulateForm = {
   // DEBUG: true,

   fill: function (obj) {
      this.log("Load from Storage:", JSON.stringify(obj));

      for (const key in obj) {
         const val = obj[key];
         const el = document.getElementsByName(key)[0] || document.getElementById(key);
         if (el) {
            this.log('>opt %s[%s]: %s', key, el.tagName, val);

            switch (el.tagName.toLowerCase()) {
               case 'textarea':
                  el.value = val
                  break;

               case 'select':
                  (Array.isArray(val) ? val : [val])
                     .forEach(value => this.setSelectOption(el, value)); // select multiple
                  break;

               case 'input':
                  switch (el.type.toLowerCase()) {
                     case 'checkbox':
                        (Array.isArray(val) ? val : [val])
                           .forEach(value => el.checked = value ? true : false); // multiple Check/Uncheck
                        break;

                     case 'radio':
                        (Array.isArray(val) ? val : [val])
                           .forEach(value => el.checked = value ? true : false); // multiple Check/Uncheck
                        break;

                     default:
                        el.value = val;
                  }
                  break;
            }
         }
      }
   },

   setSelectOption: (selectObj, val) => {
      for (const option of selectObj.children) {
         if (option.value === val) {
            option.selected = true;
            break;
         }
      }
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('[+]', msg);
      }
   },
}
