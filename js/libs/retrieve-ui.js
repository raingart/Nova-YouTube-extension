const UIr = {
   // DEBUG: true,

   restoreElmValue: function (base) {
      this.log("Load from Storage:", JSON.stringify(base));

      for (var key in base) {
         var val = base[key];
         var el = document.getElementsByName(key)[0] || document.getElementById(key);
         if (el) {
            this.log('>opt %s[%s]: %s', key, el.tagName.toLowerCase(), val);

            switch (el.tagName.toLowerCase()) {
               case 'textarea':
                  el.value = val
                  break;

               case 'select':
                  this.setSelectOption(el, val);
                  break;

               case 'input':
                  this.log('>>opt %s[%s]: %s', key, el.tagName.toLowerCase(), val);
                  switch (el.type.toLowerCase()) {
                     case 'checkbox':
                        el.checked = val ? true : false; // Check/Uncheck
                        // el.value = val ? true : false; // Check/Uncheck
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
            break
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
