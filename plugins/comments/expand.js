window.nova_plugins.push({
   id: 'comments-expand',
   title: 'Expand comments',
   'title:zh': '展开评论',
   'title:ja': 'コメントを展開',
   // 'title:ko': '댓글 펼치기',
   // 'title:vi': 'Mở rộng nhận xét',
   // 'title:id': 'Perluas komentar',
   // 'title:es': 'Expandir comentarios',
   'title:pt': 'Expandir comentários',
   'title:fr': 'Développer les commentaires',
   // 'title:it': 'Espandi i commenti',
   // 'title:tr': 'Yorumları genişlet',
   'title:de': 'Kommentare erweitern',
   'title:pl': 'Rozwiń komentarze',
   'title:ua': 'Розгорнути коментарі',
   run_on_pages: 'watch, -mobile',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/467911-auto-expand-youtube-comments
      // alt2 - https://greasyfork.org/en/scripts/446954-youtube-expand-description-and-long-comments-show-all-the-replies
      // alt3 - https://greasyfork.org/en/scripts/39719-youtube-expand-all-video-comments
      // alt4 - https://greasyfork.org/en/scripts/470340-auto-click-youtube-comment-read-more-buttons
      // alt5 - https://greasyfork.org/en/scripts/407945-youtube-2020-improvements

      // Doesn't work. I don't know how to implement it better. By updating "removeEventListener/addEventListener" or reloading the entire comment block
      // dirty fix bug with not updating comments addEventListener: reset comments block
      // document.addEventListener('yt-page-data-updated', () => location.reload());

      // fixs
      NOVA.css.push(
         `#expander.ytd-comment-renderer {
            overflow-x: hidden;
         }`);

      // comment
      NOVA.watchElements({
         selectors: ['#comments #expander[collapsed] #more:not([hidden])'],
         attr_mark: 'nova-comment-expanded',
         callback: btn => {
            const moreExpand = () => btn.click();
            const comment = btn.closest('#expander[collapsed]');
            // console.debug('contents expander:', comment);
            // comment.style.border = '2px solid red'; // mark for test

            // on hover auto expand
            switch (user_settings.comments_expand_mode) {
               case 'onhover':
                  comment.addEventListener('mouseenter', moreExpand, { capture: true, once: true });
                  break;

               case 'always':
                  moreExpand();
                  break;

               // default: // disable
            }
            // btn.style.border = '2px solid red'; // mark for test
         },
      });

      // comment replies
      // const MARK_ATTR = 'asd';
      // document.addEventListener('yt-action', evt => {
      //    if (NOVA.currentPage != 'watch') return;

      //    // console.debug(evt.detail?.actionName);
      //    switch (evt.detail?.actionName) {
      //       // case 'yt-reload-continuation-items-command':
      //       case 'yt-append-continuation-items-action':
      //          // console.debug(evt.detail?.actionName); // flltered
      //          document.body.querySelectorAll(`#replies #more-replies button:not([${MARK_ATTR}])`)
      //             .forEach(btn => {
      //                btn.setAttribute(MARK_ATTR, true);

      //                const moreExpand = () => btn.click();

      //                // on hover auto expand
      //                switch (user_settings.comments_view_reply) {
      //                   case 'onhover':
      //                      btn.addEventListener('mouseenter', moreExpand, { capture: true, once: true });
      //                      break;

      //                   case 'always':
      //                      moreExpand();
      //                      break;

      //                   // default: // disable
      //                }
      //             });
      //          break;
      //    }
      // });

      // comment replies
      NOVA.watchElements({
         selectors: ['#replies #more-replies button', '#replies #expander-contents ytd-continuation-item-renderer button'],
         attr_mark: 'nova-replies-expanded',
         callback: btn => {
            const moreExpand = () => btn.click();

            // on hover auto expand
            switch (user_settings.comments_view_reply) {
               case 'onhover':
                  btn.addEventListener('mouseenter', moreExpand, { capture: true, once: true });
                  break;

               case 'always':
                  moreExpand();
                  break;

               // default: // disable
            }
            // btn.style.border = '2px solid violet'; // mark for test
         },
      });

      // old method. No hover
      // NOVA.watchElements({
      //    selector: ['#contents #expander[collapsed] #more'],
      //    attr_mark: 'nova-comment-expanded',
      //    callback: btn => btn.click(),
      // });

      // if (user_settings.comments_view_reply) {
      //    NOVA.watchElements({
      //       selector: ['#comment #expander #more-replies'],
      //       attr_mark: 'nova-replies-expanded',
      //       callback: btn => btn.click(),

      //    });
      // }

      // expand linked comment
      // if (location.search.includes('$lc=')) {
      if (NOVA.queryURL.has('lc')) {
         // expand comment
         NOVA.waitSelector('#comment #linked-comment-badge + #body #expander[collapsed] #more:not([hidden])')
            .then(btn => btn.click());
         // replies
         NOVA.waitSelector('ytd-comment-thread-renderer:has(#linked-comment-badge) #replies #more-replies button')
            .then(btn => btn.click());
      }

   },
   options: {
      comments_expand_mode: {
         _tagName: 'select',
         label: 'Expand comment',
         'label:zh': '展开评论',
         'label:ja': 'コメントを展開',
         // 'label:ko': '댓글 펼치기',
         // 'label:vi': 'Mở rộng nhận xét',
         // 'label:id': 'Perluas balasan',
         // 'label:es': 'Expandir comentarios',
         'label:pt': 'Expandir comentário',
         'label:fr': 'Développer les commentaires',
         // 'label:it': 'Espandi commento',
         // 'label:tr': 'Yorumu genişlet',
         'label:de': 'Kommentar erweitern',
         'label:pl': 'Rozwiń komentarz',
         'label:ua': 'Розгорнути коментар',
         // title: '',
         options: [
            {
               label: 'always', value: 'always', selected: true,
               'label:zh': '每次',
               'label:ja': 'いつも',
               // 'label:ko': '언제나',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': 'siempre',
               'label:pt': 'sempre',
               'label:fr': 'toujours',
               // 'label:it': '',
               // 'label:tr': 'her zaman',
               'label:de': 'stets',
               'label:pl': 'zawsze',
               'label:ua': 'завжди',
            },
            {
               label: 'on hover', value: 'onhover',
               'label:zh': '悬停时',
               'label:ja': 'ホバー時に',
               // 'label:ko': '호버에',
               // 'label:vi': '',
               // 'label:id': 'saat melayang',
               // 'label:es': 'en vuelo estacionario',
               'label:pt': 'pairando',
               'label:fr': 'en vol stationnaire',
               // 'label:it': 'quando in bilico',
               // 'label:tr': 'üzerinde gezinme',
               'label:de': 'auf schweben',
               'label:pl': 'przy najechaniu',
               'label:ua': 'при наведенні',
            },
            {
               label: 'disable', value: false,
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               'label:ua': 'вимк.',
            },
         ],
      },
      comments_view_reply: {
         _tagName: 'select',
         label: 'Expand reply',
         'label:zh': '展开回复',
         'label:ja': '返信を展開',
         // 'label:ko': '답장 펼치기',
         // 'label:vi': '',
         // 'label:id': '',
         // 'label:es': 'Expandir respuesta',
         'label:pt': 'Expandir a resposta',
         'label:fr': 'Développer la réponse',
         // 'label:it': 'Espandi risposta',
         // 'label:tr': 'Cevabı genişlet',
         'label:de': 'Antwort erweitern',
         'label:pl': 'Rozwiń odpowiedź',
         'label:ua': 'Розгорнути відповідь',
         // title: '',
         options: [
            {
               label: 'always', value: 'always',
               'label:zh': '每次',
               'label:ja': 'いつも',
               // 'label:ko': '언제나',
               // 'label:vi': 'luôn luôn',
               // 'label:vi': '',
               // 'label:id': 'selalu',
               // 'label:es': 'siempre',
               'label:pt': 'sempre',
               'label:fr': 'toujours',
               // 'label:it': 'sempre',
               // 'label:tr': 'her zaman',
               'label:de': 'stets',
               'label:pl': 'zawsze',
               'label:ua': 'завжди',
            },
            {
               label: 'on hover', value: 'onhover', selected: true,
               'label:zh': '悬停时',
               'label:ja': 'ホバー時に',
               // 'label:ko': '호버에',
               // 'label:vi': '',
               // 'label:id': 'saat melayang',
               // 'label:es': 'en vuelo estacionario',
               'label:pt': 'pairando',
               'label:fr': 'en vol stationnaire',
               // 'label:it': 'quando in bilico',
               // 'label:tr': 'üzerinde gezinme',
               'label:de': 'auf schweben',
               'label:pl': 'przy najechaniu',
               'label:ua': 'при наведенні',
            },
            {
               label: 'disable', value: false,
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
         ],
      },
   }
});
