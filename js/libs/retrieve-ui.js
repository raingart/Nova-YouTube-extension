const PopulateForm = {
   // DEBUG: true,

   fill(settings, parent) {
      this.log("Load from Storage: %s=>%s", parent?.id, JSON.stringify(settings));

      for (const key in settings) {
         const val = settings[key];
         // const el = document.getElementsByName(key)[0] || document.getElementById(key);
         if (el = (parent || document).querySelector(`[name="${key}"]`)
            || (parent || document).querySelector('#' + key)) {
            this.log('>opt %s#%s=%s', el.tagName, key, val);

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
         }
      }
   },

   log() {
      if (this.DEBUG && arguments.length) {
         console.groupCollapsed(...arguments);
         console.trace();
         console.groupEnd();
      }
   }
}
