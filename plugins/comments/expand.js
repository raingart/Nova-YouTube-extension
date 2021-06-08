_plugins_conteiner.push({
   id: 'comments-expand',
   title: 'Expand comments',
   run_on_pages: 'watch',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      YDOM.watchElement({
         selector: '#contents #expander[collapsed] #more',
         attr_mark: 'comment-expanded',
         callback: btn => btn.click(),
      });

      if (user_settings.comments_view_reply) {
         YDOM.watchElement({
            selector: '#comment #expander #more-replies:not([hidden])',
            attr_mark: 'replies-expanded',
            callback: btn => btn.click(),
         });
      }

   },
   options: {
      comments_view_reply: {
         _tagName: 'input',
         label: 'Expand view reply',
         type: 'checkbox',
      },
   },
});
