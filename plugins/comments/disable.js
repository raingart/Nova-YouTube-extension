_plugins_conteiner.push({
   id: 'comments-disable',
   title: 'Disable comments',
   run_on_pages: 'watch',
   restart_on_transition: true,
   section: 'comments',
   desc: 'Remove comments section',
   _runtime: user_settings => {

      YDOM.waitElement('#comments')
         .then(comments => comments.remove());

   }
});
