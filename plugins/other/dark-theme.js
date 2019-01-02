_plugins.push({
   name: 'Dark theme',
   id: 'dark-theme',
   section: 'other',
   depends_page: 'all',
   desc: 'Enable default dark theme',
   _runtime: user_settings => {

      let pref = YDOM.cookie.get('PREF'),
         f6 = YDOM.getUrlVars(pref)['f6'],
         new_pref;

      // create if not set
      if (!f6) {
         new_pref = pref + '&f6=400';

      // update if white (ex:8000)
      } else if (f6 != 400) {
         new_pref = pref.replace(f6, 400);
      }

      new_pref && YDOM.cookie.set('PREF', new_pref);

      // console.log('pref', JSON.stringify(pref));
      // console.log('f6', f6);
      // console.log('new_pref', new_pref);

   }
});
