_plugins.push({
   name: 'Creator "heart" comments',
   id: 'hearted-comments',
   section: 'comments',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      const markedAttrName = 'hearted';

      // init style
      YDOM.injectStyle((function () {
         let initStyle;
         switch (user_settings.heart_comments) {
            case 'hide':
               initStyle = `{
                  outline: 1px dashed red;
                  opacity: .2;
               } [${markedAttrName}]:hover { opacity: 1 }`;
               break;
            case 'remove':
               initStyle = '{ display: none }';
         }
         return `[${markedAttrName}] ` + initStyle;
      }()));

      YDOM.waitHTMLElement('#comment:not([' + markedAttrName + '])', comment => {
         // has heart-button
         if (comment.querySelector('#creator-heart-button')) {
            comment.parentNode.setAttribute(markedAttrName, true); // mark

            // comment.parentNode.removeChild(comment) // remove
            // comment.style.outline = '1px dashed red';
            // bezel.style.display = 'none'
         }
      }, 'hard waitHTMLElement listener');

      // [...document.querySelectorAll('[${markedAttrName}]')]
      //    .forEach(el => el.parentNode.removeChild(bezel))
      //    // .forEach(el => el.style.display = 'none');

   },
   export_opt: (function () {
      return {
         'heart_comments': {
            _elementType: 'select',
            label: 'Display action',
            // title: '',
            options: [
               { label: 'hide', value: 'hide' },
               { label: 'remove', value: 'remove', selected: true }
            ]
         },
      };
   }()),
});
