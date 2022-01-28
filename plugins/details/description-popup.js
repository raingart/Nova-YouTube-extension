window.nova_plugins.push({
   id: 'description-popup',
   title: 'Description in popup',
   'title:zh': '弹出窗口中的说明',
   'title:ja': 'ポップアップでの説明',
   'title:ko': '팝업 설명',
   'title:es': 'Descripción en ventana emergente',
   'title:pt': 'Descrição em pop-up',
   'title:fr': 'Description dans la fenêtre contextuelle',
   'title:de': 'Beschreibung im Popup',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      const DESCRIPTION_SELECTOR = '#meta #description:not([hidden]):not(:empty)';

      NOVA.waitElement('#masthead-container')
         .then(masthead => {

            NOVA.css.push(
               `${DESCRIPTION_SELECTOR},
               ${DESCRIPTION_SELECTOR}:before {
                  position: fixed;
                  top: ${masthead.offsetHeight || 56}px;
                  right: 0;
                  z-index: ${(Math.max(NOVA.css.getValue({ selector: '.ytp-chrome-top .ytp-cards-button', property: 'z-index' }), 601)) + 1};
               }

               /* button */
               ${DESCRIPTION_SELECTOR}:not(:hover):before {
                  content: "info ▼";
                  cursor: pointer;
                  visibility: visible;
                  /*transform: rotate(-90deg) translateX(-100%);*/
                  right: 12em;
                  padding: 6px 8px;
                  line-height: normal;
                  font-family: Roboto, Arial, sans-serif;
                  font-size: 11px;
                  color: #eee;
                  background: rgba(0,0,0,0.3);
               }

               /* description section */
               ${DESCRIPTION_SELECTOR} {
                  margin: 0 1%;
                  overflow-y: auto;
                  max-height: 88vh;
                  padding: 10px 15px;
                  background-color: #222;
                  border: 1px solid #333;
               }

               ${DESCRIPTION_SELECTOR}:not(:hover) {
                  visibility: collapse;
                  overflow: hidden;
               }

               /* description section hover */
               ${DESCRIPTION_SELECTOR}:hover {
                  visibility: visible !important;
               }

               /* custom scroll */
               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar {
                  height: 8px;
                  width: 10px;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-button {
                  height: 0;
                  width: 0;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-corner {
                  background: transparent;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-thumb {
                  background: #e1e1e1;
                  border: 0;
                  border-radius: 0;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-track {
                  background: #666;
                  border: 0;
                  border-radius: 0;
               }

               ${DESCRIPTION_SELECTOR}::-webkit-scrollbar-track:hover {
                  background: #666;
               }`);
         });

   },
});
