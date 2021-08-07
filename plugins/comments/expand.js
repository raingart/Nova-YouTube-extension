window.nova_plugins.push({
   id: 'comments-expand',
   title: 'Expand comments',
   run_on_pages: 'watch',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // old method. No hover
      // NOVA.watchElement({
      //    selector: '#contents #expander[collapsed] #more',
      //    attr_mark: 'comment-expanded',
      //    callback: btn => btn.click(),
      // });

      // if (user_settings.comments_view_reply) {
      //    NOVA.watchElement({
      //       selector: '#comment #expander #more-replies:not([hidden])',
      //       attr_mark: 'replies-expanded',
      //       callback: btn => btn.click(),

      //    });
      // }

      NOVA.watchElement({
         selector: '#contents #expander[collapsed]',
         attr_mark: 'comment-expanded',
         // callback: btn => btn.click(),
         callback: el => {
            const moreExpand = () => el.querySelector('#more')?.click();
            // on hover auto expand
            el.addEventListener("mouseenter", moreExpand, { capture: true, once: true });
            // if (user_settings.comments_expand_mode === 'always') moreExpand();
            if (user_settings.comments_expand_mode !== 'onhover') moreExpand();
         },
      });

      NOVA.watchElement({
         selector: '#more-replies',
         attr_mark: 'replies-expanded',
         callback: el => {
            const moreExpand = () => el.querySelector('#button')?.click();
            // on hover auto expand
            el.addEventListener("mouseenter", moreExpand, { capture: true, once: true });
            if (user_settings.comments_view_reply === 'always') moreExpand();
         },
      });

   },
   options: {
      comments_expand_mode: {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         title: 'Thumbnail display video timestamps',
         options: [
            { label: 'Always', value: 'always', selected: true },
            { label: 'On hover', value: 'onhover' },
         ],
      },
      comments_view_reply: {
         _tagName: 'select',
         label: 'Expand reply',
         // title: '',
         options: [
            { label: 'Always', value: 'always' },
            { label: 'On hover', value: 'onhover', selected: true },
         ],
      },
   },
});
