_plugins.push({
   name: 'Disable comments',
   id: 'disable-comments',
   section: 'comments',
   depends_page: 'watch',
   desc: 'Remove comments section',
   _runtime: user_settings => {

      YDOM.waitHTMLElement('#comments', comments => comments.parentNode.removeChild(comments));

   }
});
