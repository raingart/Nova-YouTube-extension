window.nova_plugins.push({
   id: 'comments-visibility',
   title: 'Hide comments section',
   'title:zh': '隐藏评论',
   'title:ja': 'コメントを隠す',
   'title:ko': '댓글 섹션 숨기기',
   'title:es': 'Ocultar la sección de comentarios',
   'title:pt': 'Ocultar seção de comentários',
   'title:fr': 'Masquer la section des commentaires',
   // 'title:tr': 'Yorumlar bölümünü gizle',
   'title:de': 'Kommentarbereich ausblenden',
   run_on_pages: 'watch, -mobile',
   restart_on_transition: true,
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      NOVA.preventVisibilityElement({
         selector: '#comments',
         title: 'comments',
         remove: user_settings.comments_visibility_mode == 'disable' ? true : false,
      });

   },
   options: {
      comments_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         options: [
            { label: 'collapse', value: 'hide', selected: true },
            { label: 'remove', value: 'disable' },
         ],
      },
   }
});
