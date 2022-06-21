// for test:
// https://www.youtube.com/watch?v=FSjr2H0RDsY - empty desc

window.nova_plugins.push({
   id: 'description-popup',
   title: 'Description section in popup',
   'title:zh': '弹出窗口中的描述部分',
   'title:ja': 'ポップアップの説明セクション',
   'title:ko': '팝업의 설명 섹션',
   'title:es': 'Sección de descripción en ventana emergente',
   'title:pt': 'Seção de descrição no pop-up',
   'title:fr': 'Section de description dans la fenêtre contextuelle',
   'title:tr': 'Açılır pencerede açıklama bölümü',
   'title:de': 'Beschreibungsabschnitt im Popup',
   'title:pl': 'Opis w osobnym oknie',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      // bug if DESCRIPTION_SELECTOR is empty. Using CSS is impossible to fix. And through JS extra

      const DESCRIPTION_SELECTOR = 'html:not(:fullscreen) #primary-inner #description:not([hidden]):not(:empty)';

      NOVA.waitElement('#masthead-container')
         .then(masthead => {

            NOVA.css.push(
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
                  right: 12em;
                  padding: 0 8px 3px;
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

      // expand
      // document.addEventListener('yt-navigate-finish', () => {
      NOVA.waitElement(DESCRIPTION_SELECTOR)
         .then(descriptionEl => {
            descriptionEl.addEventListener('mouseenter', evt => {
               document.querySelector('#meta [collapsed] #more, [description-collapsed] #description-and-actions #description #expand')?.click()
            }, false);
            // }, { capture: true, once: true });

            // restore date line
            NOVA.waitElement('#title h1')
               .then(container => {
                  const
                     // Strategy 1 regex
                     text = descriptionEl.textContent.trim(),
                     textDate = text.substring(0, text.search(/\d{4}/) + 4);
                  // Strategy 2 HTML
                  // textDate = [...descriptionEl.querySelectorAll('.bold.yt-formatted-string')]
                  //    .map(e => e.textContent)
                  //    .join('');

                  // console.debug('textDate', textDate);

                  container.insertAdjacentHTML('afterend',
                     `<div id="nova-description-date" class="style-scope yt-formatted-string bold" style="font-size:1.2rem; line-height:1.8rem; font-weight:400;">${textDate}</div>`);
               });
         });
      // });
   },
});
