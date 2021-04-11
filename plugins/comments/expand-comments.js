_plugins_conteiner.push({
   name: 'Expand comments',
   id: 'expand-comments',
   depends_on_pages: 'watch',
   opt_section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      YDOM.HTMLElement.watch({
         selector: '#contents #expander[collapsed] #more',
         attr_mark: 'comment-expanded',
         callback: btn => btn.click(),
      });

      if (user_settings.comments_view_reply) {
         YDOM.HTMLElement.watch({
            selector: '#comment #expander #more-replies:not([hidden])',
            attr_mark: 'replies-expanded',
            callback: btn => btn.click(),
         });
      }

   },
   opt_export: {
      'comments_view_reply': {
         _tagName: 'input',
         label: 'Expand view reply',
         type: 'checkbox',
      },
   },
});
