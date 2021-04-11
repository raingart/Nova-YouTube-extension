_plugins_conteiner.push({
   name: 'Disable comments',
   id: 'disable-comments',
   depends_on_pages: 'watch',
   restart_on_transition: true,
   opt_section: 'comments',
   desc: 'Remove comments section',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('#comments')
         .then(comments => comments.remove());

   }
});
