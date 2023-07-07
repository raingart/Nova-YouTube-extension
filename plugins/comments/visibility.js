window.nova_plugins.push({
   id: 'comments-visibility',
   title: 'Collapse comments section',
   'title:zh': '收起评论区',
   'title:ja': 'コメント欄を折りたたむ',
   'title:ko': '댓글 섹션 축소',
   'title:id': 'Ciutkan bagian komentar',
   'title:es': 'Ocultar sección de comentarios',
   'title:pt': 'Recolher seção de comentários',
   'title:fr': 'Réduire la section des commentaires',
   'title:it': 'Comprimi la sezione commenti',
   // 'title:tr': 'Yorumlar bölümünü daralt',
   'title:de': 'Kommentarbereich minimieren',
   'title:pl': 'Zwiń sekcję komentarzy',
   'title:ua': 'Згорнути розділ коментарів',
   run_on_pages: 'watch, -mobile',
   restart_on_location_change: true,
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/425221-youtube-hide-video-comments

      NOVA.collapseElement({
         selector: '#comments',
         label: 'comments',
         remove: (user_settings.comments_visibility_mode == 'disable') ? true : false,
      });

   },
   options: {
      comments_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         options: [
            {
               label: 'collapse', value: 'hide', selected: true,
               'label:pl': 'zwiń',
               'label:ua': 'сховати',
            },
            {
               label: 'remove', value: 'disable',
               'label:pl': 'usuń',
               'label:ua': 'усунути',
            },
         ],
      },
   }
});
