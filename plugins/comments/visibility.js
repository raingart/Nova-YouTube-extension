window.nova_plugins.push({
   id: 'comments-visibility',
   title: 'Hide/remove comments section',
   'title:zh': '隐藏评论',
   'title:ja': 'コメントを隠す',
   'title:es': 'Ocultar la sección de comentarios',
   run_on_pages: 'watch',
   restart_on_transition: true,
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      NOVA.preventVisibilityElement({
         selector: '#comments',
         id_name: 'comments',
         remove: user_settings.comments_visibility_mode == 'remove' ? true : false,
      });

   },
   options: {
      comments_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:es': 'Modo',
         options: [
            { label: 'hide', value: 'hide', selected: true },
            { label: 'remove', value: 'remove' },
         ],
      },
   },
});
