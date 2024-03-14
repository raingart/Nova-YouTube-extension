window.nova_plugins.push({
   id: 'header-unfixed',
   title: 'Header unpinned',
   'title:zh': '标题未固定',
   'title:ja': 'ヘッダーは固定されていません',
   // 'title:ko': '헤더가 고정되지 않음',
   // 'title:vi': '',
   // 'title:id': 'Tajuk tidak diperbaiki',
   // 'title:es': 'Encabezado sin arreglar',
   'title:pt': 'Cabeçalho não corrigido',
   'title:fr': 'En-tête non corrigé',
   // 'title:it': 'Intestazione non fissata',
   // 'title:tr': 'Başlık sabitlenmemiş',
   'title:de': 'Kopfleiste nicht fixiert',
   'title:pl': 'Przewijany nagłówek',
   'title:ua': 'Відкріпити шапку сайту',
   // run_on_pages: 'watch, channel',
   run_on_pages: '*, -embed, -mobile, -live_chat',
   // restart_on_location_change: true,
   section: 'header',
   desc: 'Prevent header from sticking',
   'desc:zh': '防止头部粘连',
   'desc:ja': 'ヘッダーがくっつくのを防ぎます',
   // 'desc:ko': '헤더가 달라붙는 것을 방지',
   // 'desc:vi': '',
   // 'desc:id': 'Mencegah header menempel',
   // 'desc:es': 'Evita que el cabezal se pegue',
   'desc:pt': 'Impede que o cabeçalho grude',
   'desc:fr': "Empêcher l'en-tête de coller",
   // 'desc:it': "Impedisci che l'intestazione si attacchi",
   // 'desc:tr': 'Başlığın yapışmasını önleyin',
   'desc:de': 'Verhindert das Ankleben des Headers',
   'desc:pl': 'Nagłówek będzie przewijany wraz ze stroną',
   'desc:ua': 'Відкріпляє шапку при прокрутці сайту',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/469532-youtube-show-hide-top-header-search-bar

      const
         CLASS_NAME_TOGGLE = 'nova-header-unfixed',
         SELECTOR = 'html.' + CLASS_NAME_TOGGLE;

      NOVA.css.push(
         // `${SELECTOR} ytd-mini-guide-renderer,
         `${SELECTOR} #masthead-container {
            position: absolute !important;
         }
         ${SELECTOR} #chips-wrapper {
            position: sticky !important;
         }
         ${SELECTOR} #header {
            margin-top: 0 !important;
         }`);
      // ${SELECTOR} #guide-button { // Doesn't work
      //    position: fixed !important;
      // }

      // init add CLASS_NAME_TOGGLE in html tag
      document.documentElement.classList.add(CLASS_NAME_TOGGLE);

      if (user_settings.header_unfixed_hotkey) {
         const hotkey = user_settings.header_unfixed_hotkey || 'KeyV';
         // hotkey
         document.addEventListener('keyup', evt => {
            if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
            // if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;

            if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey) {
               document.documentElement.classList.toggle(CLASS_NAME_TOGGLE);
            }
         });
      }

      if (user_settings.header_unfixed_scroll) {
         // alt1 - https://greasyfork.org/en/scripts/414234-youtube-auto-hide-header
         // alt2 - https://greasyfork.org/en/scripts/405614-youtube-polymer-engine-fixes (Unstick header bar from top of the screen)
         createArrowButton();
         // scroll
         document.addEventListener('yt-action', evt => {
            // console.debug(evt.detail?.actionName);
            switch (evt.detail?.actionName) {
               case 'yt-store-grafted-ve-action':
               case 'yt-open-popup-action': // watch
                  // console.debug(evt.detail?.actionName);
                  scrollAfter();
                  break;

               // default:
               //    break;
            }
         });

         function scrollAfter() {
            if ((masthead = document.getElementById('masthead'))
               && (topOffset = masthead.offsetHeight)
               && NOVA.isInViewport(masthead)
            ) {
               window.scrollTo({ top: topOffset });
            }
         }

         // create arrow button
         // alt1 - https://greasyfork.org/en/scripts/33218-new-youtube-obnoxious-bar-fix
         // alt2 - https://greasyfork.org/en/scripts/488486-youtube-collapsible-top-bar
         function createArrowButton() {
            const scrollDownButton = document.createElement('button');
            // scrollDownButton.textContent = '▼';
            scrollDownButton.innerHTML =
               `<svg viewBox="0 0 16 16" height="100%" width="100%">
                  <g fill="currentColor">
                     <path d="M3.35 4.97 8 9.62 12.65 4.97l.71.71L8 11.03l-5.35-5.35.7-.71z" />
                  </g>
               </svg>`;
            scrollDownButton.title = 'Scroll down';
            // scrollDownButton.style.cssText = '';
            Object.assign(scrollDownButton.style, {
               cursor: 'pointer',
               'background-color': 'transparent',
               color: 'deepskyblue',
               border: 'none',
               height: '3em',
            });
            scrollDownButton.addEventListener('click', scrollAfter);

            if (endnode = document.getElementById('end')) {
               endnode.parentElement.insertBefore(scrollDownButton, endnode);
            }
         }
      }

   },
   options: {
      header_unfixed_scroll: {
         _tagName: 'input',
         label: 'Scroll after header',
         'label:zh': '在标题后滚动',
         'label:ja': 'ヘッダーの後にスクロール',
         // 'label:ko': '헤더 뒤 스크롤',
         // 'label:vi': '',
         // 'label:id': 'Gulir setelah tajuk',
         // 'label:es': 'Desplazarse después del encabezado',
         'label:pt': 'Role após o cabeçalho',
         'label:fr': "Faire défiler après l'en-tête",
         // 'label:it': "Scorri dopo l'intestazione",
         // 'label:tr': 'Başlıktan sonra kaydır',
         'label:de': 'Nach der Kopfzeile scrollen',
         'label:pl': 'Przewiń nagłówek',
         'label:ua': 'Прокручувати після шапки сайту',
         type: 'checkbox',
         title: 'Makes sense on a small screen',
         'title:zh': '在小屏幕上有意义',
         'title:ja': '小さな画面で意味があります',
         // 'title:ko': '작은 화면에서 이해하기',
         // 'title:vi': '',
         // 'title:id': 'Masuk akal di layar kecil',
         // 'title:es': 'Tiene sentido en una pantalla pequeña',
         'title:pt': 'Faz sentido em uma tela pequena',
         'title:fr': 'A du sens sur un petit écran',
         // 'title:it': 'Ha senso su un piccolo schermo',
         // 'title:tr': 'Küçük ekranda mantıklı',
         'title:de': 'Macht auf einem kleinen Bildschirm Sinn',
         'title:pl': 'Przydatne na małym ekranie',
         'title:ua': 'Ефективно на малому екрані',
      },
      header_unfixed_hotkey: {
         _tagName: 'select',
         label: 'Hotkey toggle',
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
         'label:ua': 'Перемикання гарячою клавішею',
         // title: '',
         options: [
            // { label: 'none', /* value: false, */ }, // fill value if no "selected" mark another option
            { label: 'none', value: false },
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'ShiftL', value: 'ShiftLeft' },
            { label: 'ShiftR', value: 'ShiftRight' },
            { label: 'CtrlL', value: 'ControlLeft' },
            { label: 'CtrlR', value: 'ControlRight' },
            { label: 'AltL', value: 'AltLeft' },
            { label: 'AltR', value: 'AltRight' },
            // { label: 'ArrowUp', value: 'ArrowUp' },
            // { label: 'ArrowDown', value: 'ArrowDown' },
            // { label: 'ArrowLeft', value: 'ArrowLeft' },
            // { label: 'ArrowRight', value: 'ArrowRight' },
            { label: 'A', value: 'KeyA' },
            { label: 'B', value: 'KeyB' },
            { label: 'C', value: 'KeyC' },
            { label: 'D', value: 'KeyD' },
            { label: 'E', value: 'KeyE' },
            { label: 'F', value: 'KeyF' },
            { label: 'G', value: 'KeyG' },
            { label: 'H', value: 'KeyH' },
            { label: 'I', value: 'KeyI' },
            { label: 'J', value: 'KeyJ' },
            { label: 'K', value: 'KeyK' },
            { label: 'L', value: 'KeyL' },
            { label: 'M', value: 'KeyM' },
            { label: 'N', value: 'KeyN' },
            { label: 'O', value: 'KeyO' },
            { label: 'P', value: 'KeyP' },
            { label: 'Q', value: 'KeyQ' },
            { label: 'R', value: 'KeyR' },
            { label: 'S', value: 'KeyS' },
            { label: 'T', value: 'KeyT' },
            { label: 'U', value: 'KeyU' },
            { label: 'V', value: 'KeyV', selected: true },
            { label: 'W', value: 'KeyW' },
            { label: 'X', value: 'KeyX' },
            { label: 'Y', value: 'KeyY' },
            { label: 'Z', value: 'KeyZ' },
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            ']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
         ],
      },
      // header_unfixed_default_state: {
      //    _tagName: 'input',
      //    label: 'Default state init?',
      //    type: 'checkbox',
      // },
   },
});
