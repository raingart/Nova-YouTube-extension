const PopulateForm = {
   // DEBUG: true,

   fill(obj, parent) {
      this.log("Load from Storage: %s=>%s", parent?.id, JSON.stringify(obj));

      for (const key in obj) {
         const val = obj[key];
         // const el = document.getElementsByName(key)[0] || document.getElementById(key);
         const el = (parent || document).querySelector(`[name="${key}"]`) ||
            (parent || document).querySelector('#' + key)

         if (el) {
            this.log('>opt %s[%s]: %s', key, el.tagName, val);

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

   setSelectOption(selectObj, val) {
      for (const option of selectObj.children) {
         if (option.value === val) {
            option.selected = true;
            break;
         }
      }
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   }
}
