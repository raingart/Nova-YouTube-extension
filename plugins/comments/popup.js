window.nova_plugins.push({
   id: 'comments-popup',
   title: 'Show in popup',
   'title:zh': '在弹出窗口中显示',
   'title:ja': 'ポップアップで表示',
   'title:ko': '팝업으로 표시',
   'title:es': 'Mostrar en ventana emergente',
   'title:pt': 'Mostrar em pop-up',
   'title:fr': 'Afficher dans la fenêtre contextuelle',
   'title:tr': 'Açılır pencerede göster',
   'title:de': 'Im Popup anzeigen',
   run_on_pages: 'watch, -mobile',
   section: 'comments',
   // desc: '',
   _runtime: user_settings => {

      // contents is empty
      // #comments:not([hidden]) > #sections > #contents:not(:empty)

      // bug if DESCRIPTION_SELECTOR is empty. Using CSS is impossible to fix. And through JS extra
      // test example: https://www.youtube.com/watch?v=CV_BR1tfdCo

      const COMMENTS_SELECTOR = 'html:not(:fullscreen) #comments:not([hidden])';

      NOVA.waitElement('#masthead-container')
         .then(masthead => {

            NOVA.css.push(
               `${COMMENTS_SELECTOR},
               ${COMMENTS_SELECTOR}:before {
                  position: fixed;
                  top: ${masthead.offsetHeight || 56}px;
                  right: 0;
                  z-index: ${(Math.max(NOVA.css.getValue({ selector: '#movie_player', property: 'z-index' }), 601)) + 1};
               }

               /* button */
               ${COMMENTS_SELECTOR}:not(:hover):before {
                  content: "comments ▼";
                  cursor: pointer;
                  visibility: visible;
                  /*transform: rotate(-90deg) translateX(-100%);*/
                  right: 4em;
                  padding: 6px 8px;
                  line-height: normal;
                  font-family: Roboto, Arial, sans-serif;
                  font-size: 11px;
                  color: #eee;
                  background: rgba(0,0,0,0.3);
               }

               /* comments section */
               ${COMMENTS_SELECTOR} {
                  margin: 0 1%;
                  padding: 0 15px;
                  background-color: #222;
                  border: 1px solid #333;
                  max-width: 90%;
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
                  border-top: 1px solid #333;
                  padding-top: 1em;
               }

               /* hide add comment textarea */
               ${COMMENTS_SELECTOR} #header #simple-box {
                  display: none;
               }

               /* fixs */
               ytd-comments-header-renderer {
                  height: 0;
                  margin-top: 10px;
               }
               /* size section */
               ${COMMENTS_SELECTOR} #sections {
                  max-width: fit-content;
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
                  border: 0;
                  border-radius: 0;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track {
                  background: #666;
                  border: 0;
                  border-radius: 0;
               }

               ${COMMENTS_SELECTOR} #contents::-webkit-scrollbar-track:hover {
                  background: #666;
               }`);
         });

   },
});
