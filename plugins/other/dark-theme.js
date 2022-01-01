window.nova_plugins.push({
   id: 'dark-theme',
   title: 'Dark Theme',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:de': '',
   run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Warn! Do not use unnecessarily',
   'desc:zh': 'Warn! 不要不必要地使用',
   'desc:ja': 'Warn! 不必要に使用しないでください',
   'desc:es': 'Warn! no lo use innecesariamente',
   'desc:pt': 'Warn! não use desnecessariamente',
   'desc:de': 'Warn! nicht unnötig verwenden',
   _runtime: user_settings => {

      // NOVA.cookie.set('PREF', 'f6=400'); // Other parameters will be overwritten
      NOVA.cookie.updateParam({ key: 'PREF', param: 'f6', value: 40000400 });

   },
});
