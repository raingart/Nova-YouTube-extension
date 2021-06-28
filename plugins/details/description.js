_plugins_conteiner.push({
   id: 'video-description-expand',
   title: 'Expands video description',
   run_on_pages: 'watch',
   restart_on_transition: true,
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitElement('#meta [collapsed] #more')
         .then(el => el.click());

   }
});
