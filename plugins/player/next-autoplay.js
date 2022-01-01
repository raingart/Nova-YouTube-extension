window.nova_plugins.push({
   id: 'video-next-autoplay-disable',
   title: 'Disable next video button',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:de': '',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Warn! Do not use unnecessarily',
   'desc:zh': 'Warn! 不要不必要地使用',
   'desc:ja': 'Warn! 不必要に使用しないでください',
   'desc:es': 'Warn! no lo use innecesariamente',
   'desc:pt': 'Warn! não use desnecessariamente',
   'desc:de': 'Warn! nicht unnötig verwenden',
   _runtime: user_settings => {

      // autoplay on: f5=20000
      // autoplay off: f5=30000
      // NOVA.cookie.set('PREF', 'f5=30000'); // Other parameters will be overwritten
      NOVA.cookie.updateParam({ key: 'PREF', param: 'f5', value: 30000 });

   },
});
