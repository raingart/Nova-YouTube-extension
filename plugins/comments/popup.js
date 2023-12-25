window.nova_plugins.push({
   id: 'comments-popup',
   title: 'Comments section in popup',
   'title:zh': '弹出窗口中的评论部分',
   'title:ja': 'ポップアップのコメントセクション',
   'title:ko': '팝업의 댓글 섹션',
   'title:id': 'Bagian komentar di popup',
   'title:es': 'Sección de comentarios en ventana emergente',
   'title:pt': 'Seção de comentários no pop-up',
   'title:fr': 'Section des commentaires dans la fenêtre contextuelle',
   'title:it': 'Sezione commenti nel popup',
   // 'title:tr': 'Açılır pencerede yorumlar bölümü',
   'title:de': 'Kommentarbereich im Popup',
   'title:pl': 'Sekcja komentarzy w osobnym oknie',
   'title:ua': 'Розділ коментарів у спливаючому вікні',
   run_on_pages: 'watch, -mobile',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/409893-youtube-widescreen-new-design-polymer
      // alt2 - https://greasyfork.org/en/scripts/458531-move-youtube-comments-to-sidebar

      if (user_settings['comments_visibility_mode'] == 'disable') return; // conflict with plugin [comments-visibility]

      // contents is empty
      // #comments:not([hidden]) > #sections > #contents:not(:empty)

      const
         COMMENTS_SELECTOR = 'html:not(:fullscreen) #page-manager #comments:not([hidden]):not(:empty)',
         counterAttrName = 'data-counter';

      // append (recalc) count
      NOVA.runOnPageInitOrTransition(() => {
         if (NOVA.currentPage == 'watch') {
            NOVA.waitSelector('ytd-comments-header-renderer #title #count', { destroy_if_url_changes: true })
               .then(count => {
                  document.body.querySelector(COMMENTS_SELECTOR)
                     ?.setAttribute(counterAttrName,
                        NOVA.prettyRoundInt(parseInt(count.textContent.replace(/,/g, '')))
                     );
               });
         }
      });

      NOVA.waitSelector('#masthead-container')
         .then(masthead => {

            NOVA.css.push(
               `${COMMENTS_SELECTOR},
               ${COMMENTS_SELECTOR}:before {
                  position: fixed;
                  top: ${masthead.offsetHeight || 56}px;
                  right: 0;
                  z-index: ${1 + Math.max(getComputedStyle(masthead || movie_player)['z-index'], 601)};
               }

               /* button */
               ${COMMENTS_SELECTOR}:not(:hover):before {
                  content: attr(${counterAttrName}) " comments ▼";
                  cursor: pointer;
                  visibility: visible;
                  /*transform: rotate(-90deg) translateX(-100%);*/
                  right: 3em;
                  padding: 0 6px 2px;
                  line-height: normal;
                  font-family: Roboto, Arial, sans-serif;
                  font-size: 11px;
                  color: #eee;
                  background: rgba(0,0,0,0.3);
               }

               /* comments section */
               ${COMMENTS_SELECTOR} {
                  ${(user_settings.comments_popup_width === 100) ? 'margin: 0 1%;' : ''}
                  padding: 0 15px;
                  background-color: var(--yt-spec-brand-background-primary);
                  background-color: var(--yt-spec-menu-background);
                  background-color: var(--yt-spec-raised-background);
                  color: var(--yt-spec-text-primary);;
                  border: 1px solid #333;
                  max-width: ${user_settings.comments_popup_width || 40}%;
               }

               ${COMMENTS_SELECTOR}:not(:hover) {
                  visibility: collapse;
               }

               /* comments section hover */
               ${COMMENTS_SELECTOR}:hover {
                  visibility: visible !important;
               }

               /* add scroll option in comments */
               ${COMMENTS_SELECTOR} > #sections > #contents {
                  overflow-y: auto;
                  max-height: 88vh;
                  padding-top: 1em;
               }

               #expander.ytd-comment-renderer {
                  overflow-x: hidden;
               }
               /* size section */
               ${COMMENTS_SELECTOR} #sections {
                  min-width: 500px;
               }

               /* custom scroll */
               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar {
                  height: 8px;
                  width: 10px;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-button {
                  height: 0;
                  width: 0;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-corner {
                  background: transparent;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-thumb {
                  background: #e1e1e1;
                  /*background-color: var(--yt-spec-text-secondary);*/
                  border: 0;
                  border-radius: 0;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-thumb {}

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track {
                  background: #666;
                  border: 0;
                  border-radius: 0;
               }
               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track:hover {
                  background: #666;
               }
               /* fixs */
               ytd-comments-header-renderer {
                  margin: 10px 0 !important;
               }`);

            // hide add comment textarea
            if (user_settings.comments_popup_hide_textarea) {
               NOVA.css.push(
                  `${COMMENTS_SELECTOR} > #sections > #contents {
                     overflow-y: auto;
                     max-height: 88vh;
                     border-top: 1px solid #333;
                     padding-top: 1em;
                  }
                  ${COMMENTS_SELECTOR} #header #simple-box {
                     display: none;
                  }
                  /* fixs */
                  ytd-comments-header-renderer #title {
                     margin: 0 !important;
                  }`);
            }
         });

   },
   options: {
      comments_popup_width: {
         _tagName: 'input',
         label: 'Width',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         'label:ua': 'Ширина',
         type: 'number',
         // title: 'in %',
         title: '% of the screen width',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         placeholder: '%',
         step: 5,
         min: 10,
         max: 100,
         value: 40,
      },
      comments_popup_hide_textarea: {
         _tagName: 'input',
         label: 'Hide textarea',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         'label:ua': 'Приховати поле вводу',
         type: 'checkbox',
         // title: '',
      },
   }
});
