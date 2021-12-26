window.nova_plugins.push({
   id: 'comments-expand',
   title: 'Expand comments',
   'title:zh': '展开评论',
   'title:ja': 'コメントを展開',
   'title:es': 'Expandir comentarios',
   run_on_pages: 'watch',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // comment
      NOVA.watchElement({
         selector: '#contents #expander[collapsed]',
         attr_mark: 'comment-expanded',
         callback: el => {
            const moreExpand = () => el.querySelector('#more')?.click();
            // on hover auto expand
            el.addEventListener("mouseenter", moreExpand, { capture: true, once: true });
            // if (user_settings.comments_expand_mode === 'always') moreExpand();
            if (user_settings.comments_expand_mode != 'onhover') moreExpand();
         },
      });

      // comment replies
      NOVA.watchElement({
         selector: '#more-replies',
         attr_mark: 'replies-expanded',
         callback: el => {
            const moreExpand = () => el.querySelector('#button')?.click();
            // on hover auto expand
            el.addEventListener("mouseenter", moreExpand, { capture: true, once: true });
            if (user_settings.comments_view_reply == 'always') moreExpand();
         },
      });

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

   },
   options: {
      comments_expand_mode: {
         _tagName: 'select',
         label: 'Expand comment',
         'label:zh': '展开评论',
         'label:ja': 'コメントを展開',
         'title:es': 'Expandir comentarios',
         // title: '',
         options: [
            { label: 'always', value: 'always', selected: true, 'label:zh': '每次', 'label:ja': 'いつも', 'title:es': 'siempre' },
            { label: 'on hover', value: 'onhover', 'label:zh': '悬停时', 'label:ja': 'ホバー時に', 'title:es': 'en vuelo estacionario' },
         ],
      },
      comments_view_reply: {
         _tagName: 'select',
         label: 'Expand reply',
         'label:zh': '展开回复',
         'label:ja': '返信を展開',
         'title:es': 'Expandir respuesta',
         // title: '',
         options: [
            { label: 'always', value: 'always', 'label:zh': '每次', 'label:ja': 'いつも', 'title:es': 'siempre' },
            { label: 'on hover', value: 'onhover', selected: true, 'label:zh': '悬停时', 'label:ja': 'ホバー時に', 'title:es': 'en vuelo estacionario' },
         ],
      },
   },
});
