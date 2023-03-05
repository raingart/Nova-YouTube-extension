// for test:
// https://www.youtube.com/watch?v=FSjr2H0RDsY - empty desc
// https://www.youtube.com/watch?v=CV_BR1tfdCo - empty desc
// https://www.youtube.com/watch?v=EZAr3jrPqR8 - boken "restoreDateLine"

window.nova_plugins.push({
   id: 'description-popup',
   title: 'Description section in popup',
   'title:zh': '弹出窗口中的描述部分',
   'title:ja': 'ポップアップの説明セクション',
   'title:ko': '팝업의 설명 섹션',
   'title:id': 'Bagian deskripsi dalam popup',
   'title:es': 'Sección de descripción en ventana emergente',
   'title:pt': 'Seção de descrição no pop-up',
   'title:fr': 'Section de description dans la fenêtre contextuelle',
   'title:it': 'Sezione Descrizione nel popup',
   // 'title:tr': 'Açılır pencerede açıklama bölümü',
   'title:de': 'Beschreibungsabschnitt im Popup',
   'title:pl': 'Opis w osobnym oknie',
   'title:ua': 'Розділ опису у спливаючому вікні',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/409893-youtube-widescreen-new-design-polymer-v-43
      // alt2 - https://greasyfork.org/en/scripts/446269-youtube-sticky-show-less-button

      // if (user_settings['video-description-expand']) return; // conflict with plugin. This plugin has a higher priority. that's why it's disabled/commented

      // bug if DESCRIPTION_SELECTOR is empty. Using CSS is impossible to fix. And through JS extra

      const
         DESCRIPTION_SELECTOR = 'html:not(:fullscreen) ytd-watch-metadata #description.ytd-watch-metadata:not([hidden]):not(:empty)',
         DATE_SELECTOR_ID = 'nova-description-date';

      NOVA.waitElement('#masthead-container')
         .then(masthead => {

            NOVA.css.push(
               // position: ${user_settings['header-unfixed'] ? 'absolute' : 'fixed' };
               `${DESCRIPTION_SELECTOR},
               ${DESCRIPTION_SELECTOR}:before {
                  position: fixed;
                  top: ${masthead.offsetHeight || 56}px;
                  right: 0;
                  z-index: ${Math.max(
                  getComputedStyle(masthead)['z-index'],
                  // getComputedStyle(movie_player)['z-index'], // movie_player is not defined
                  601) + 1};
               }

               /* button */
               ${DESCRIPTION_SELECTOR}:not(:hover):before {
                  content: "info ▼";
                  cursor: pointer;
                  visibility: visible;
                  /*transform: rotate(-90deg) translateX(-100%);*/
                  right: 12.5em;
                  padding: 0 8px 2px;
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
                  max-width: 55%;
                  background-color: #222;
                  border: 1px solid #333;
                  border-radius: 0 !important;
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

      NOVA.runOnPageInitOrTransition(() => (NOVA.currentPage == 'watch') && restoreDateLine());

      // expand
      NOVA.waitElement(DESCRIPTION_SELECTOR)
         .then(descriptionEl => {
            descriptionEl.addEventListener('mouseenter', evt => {
               document.body.querySelector('#meta [collapsed] #more, [description-collapsed] #description #expand')
                  ?.click();
            });
            // }, { capture: true, once: true });
         });

      // alt1 - https://greasyfork.org/en/scripts/457850-youtube-video-info
      // alt2 - https://greasyfork.org/en/scripts/424068-youtube-exact-upload
      // alt3 - https://greasyfork.org/en/scripts/457478-show-youtube-s-video-date-behind-subscription-button
      let oldDateText;
      function restoreDateLine() {
         NOVA.waitElement('#title h1')
            .then(container => {
               // date = document.body.querySelector('ytd-watch-flexy')?.playerData?.microformat?.playerMicroformatRenderer.publishDate;
               NOVA.waitElement('ytd-watch-metadata #description.ytd-watch-metadata')
                  .then(async textDateEl => {
                     await NOVA.waitUntil(() => {
                        if ((text = [...textDateEl.querySelectorAll('.bold.yt-formatted-string')]
                           // first 3 div. ex:
                           // [6,053 views] [Premiered] [Oct 8, 2022]
                           // [14,051 views] [] [Mar 2, 2017]
                           ?.slice(0, 3)
                           .map(e => e.innerText)
                           ?.join('')?.trim()
                        )
                           && text != oldDateText // new date
                        ) {
                           oldDateText = text;
                           insertToHTML({ 'text': oldDateText, 'container': container });
                           return true;
                        }
                     }, 1000); // 1sec
                  });
            });

         function insertToHTML({ text = '', container = required() }) {
            // console.debug('insertToHTML', ...arguments);
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

            (document.getElementById(DATE_SELECTOR_ID) || (function () {
               container.insertAdjacentHTML('afterend',
                  `<span id="${DATE_SELECTOR_ID}" class="style-scope yt-formatted-string bold" style="font-size: 1.35rem; line-height: 2rem; font-weight:400;">${text}</span>`);
               return document.getElementById(DATE_SELECTOR_ID);
            })())
               .textContent = text;
         }

      }

   },
});
