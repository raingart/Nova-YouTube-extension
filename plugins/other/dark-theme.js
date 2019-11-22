_plugins.push({
   name: 'Dark theme',
   id: 'dark-theme',
   section: 'global',
   depends_page: 'all, -embed',
   desc: 'Enable default dark theme',
   _runtime: user_settings => {

      YDOM.waitHTMLElement('html', htmlElement => {
         const switchAttrWentDark = 'dark';
         if (!htmlElement.hasAttribute(switchAttrWentDark)) {
            // console.log('enable "Dark theme"');
            htmlElement.setAttribute(switchAttrWentDark, true);  // ineffective

            // set cookies
            const new_pref = (function () {
               const pref = YDOM.cookie.get('PREF');
               const f6 = new URLSearchParams(pref).get('f6');
               return (f6 && f6 != 400)
                  ? pref.replace(f6, 400) // update
                  : pref + '&f6=400&aa=11'; // create
            }());

            if (new_pref) {
               var tryset = YDOM.cookie.set('PREF', new_pref);
               // console.log('try set document.cookie:', tryset);
               // console.log('current document.cookie:', document.cookie);
            }

         }
      });

   }
});
