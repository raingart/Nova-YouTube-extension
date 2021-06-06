_plugins_conteiner.push({
   name: 'Disable comments',
   id: 'comments-disable',
   depends_on_pages: 'watch',
   restart_on_transition: true,
   opt_section: 'comments',
   desc: 'Remove comments section',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('#comments')
         .then(comments => comments.remove());

   }
});
