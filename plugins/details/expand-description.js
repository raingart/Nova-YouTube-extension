_plugins_conteiner.push({
   name: 'Expands video description',
   id: 'expand-description-video',
   depends_on_pages: 'watch',
   restart_on_transition: true,
   opt_section: 'details',
   // desc: '',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('.ytd-video-secondary-info-renderer > [collapsed] #more')
         .then(el => el.click());

   }
});
