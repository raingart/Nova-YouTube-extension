_plugins.push({
   name: 'Disable comments',
   id: 'disable-comments',
   section: 'comments',
   depends_page: 'watch',
   desc: 'Remove comments section',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: '#comments',
         callback: comments => comments.parentNode.removeChild(comments)
      });

   }
});
