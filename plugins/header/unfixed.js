window.nova_plugins.push({
   id: 'header-unfixed',
   title: 'Header unfixed',
   'title:zh': '标题未固定',
   'title:ja': 'ヘッダーは固定されていません',
   'title:ko': '헤더가 고정되지 않음',
   'title:id': 'Tajuk tidak diperbaiki',
   'title:es': 'Encabezado sin arreglar',
   'title:pt': 'Cabeçalho não corrigido',
   'title:fr': 'En-tête non corrigé',
   'title:it': 'Intestazione non fissata',
   // 'title:tr': 'Başlık sabitlenmemiş',
   'title:de': 'Kopfleiste nicht fixiert',
   'title:pl': 'Przewijany nagłówek',
   'title:ua': 'Відкріпити шапку сайту',
   // run_on_pages: 'watch, channel',
   run_on_pages: 'all, -embed, -mobile',
   // restart_on_location_change: true,
   section: 'header',
   desc: 'Prevent header from sticking',
   'desc:zh': '防止头部粘连',
   'desc:ja': 'ヘッダーがくっつくのを防ぎます',
   'desc:ko': '헤더가 달라붙는 것을 방지',
   'desc:id': 'Mencegah header menempel',
   'desc:es': 'Evita que el cabezal se pegue',
   'desc:pt': 'Impede que o cabeçalho grude',
   'desc:fr': "Empêcher l'en-tête de coller",
   'desc:it': "Impedisci che l'intestazione si attacchi",
   // 'desc:tr': 'Başlığın yapışmasını önleyin',
   'desc:de': 'Verhindert das Ankleben des Headers',
   'desc:pl': 'Nagłówek będzie przewijany wraz ze stroną',
   'desc:ua': 'Відкріпляє шапку при прокрутці сайту',
   _runtime: user_settings => {

      const
         CLASS_NAME_TOGGLE = 'nova-header-unfixed',
         SELECTOR = 'html.' + CLASS_NAME_TOGGLE;

      NOVA.css.push(
         `${SELECTOR} #masthead-container,
         ${SELECTOR} ytd-mini-guide-renderer {
            position: absolute !important;
         }
         ${SELECTOR} #chips-wrapper {
            position: sticky !important;
         }
         ${SELECTOR} #header {
            margin-top: 0 !important;
         }`);

      // init add CLASS_NAME_TOGGLE in html tag
      document.documentElement.classList.add(CLASS_NAME_TOGGLE);

      if (user_settings.header_unfixed_hotkey) {
         const hotkey = user_settings.header_unfixed_hotkey || 'v';
         // hotkey
         document.addEventListener('keyup', evt => {
            if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;
            if (evt.key === hotkey) {
               document.documentElement.classList.toggle(CLASS_NAME_TOGGLE);
            }
         });
      }

      if (user_settings.header_unfixed_scroll) {
         createArrowButton();
         // scroll
         document.addEventListener('yt-action', evt => {
            // console.log(evt.detail?.actionName);
            if (evt.detail?.actionName == 'yt-reload-continuation-items-command') {
               scrollAfter();
            }
         });

         function scrollAfter() {
            if ((masthead = document.getElementById('masthead'))
               && (topOffset = masthead.offsetHeight)
               && isInViewport(masthead)
            ) {
               window.scrollTo({ top: topOffset });
            }

            function isInViewport(el = required()) {
               if (el instanceof HTMLElement) {
                  const bounding = el.getBoundingClientRect();
                  return (
                     bounding.top >= 0 &&
                     bounding.left >= 0 &&
                     bounding.bottom <= window.innerHeight &&
                     bounding.right <= window.innerWidth
                  );
               }
            }
         }

         // create arrow button
         function createArrowButton() {
            const scrollDownButton = document.createElement('button');
            scrollDownButton.textContent = '▼';
            scrollDownButton.title = 'Scroll down';
            Object.assign(scrollDownButton.style, {
               cursor: 'pointer',
               background: 'transparent',
               color: 'deepskyblue',
               border: 'none',
            });
            scrollDownButton.onclick = scrollAfter;

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
         'label:ko': '헤더 뒤 스크롤',
         'label:id': 'Gulir setelah tajuk',
         'label:es': 'Desplazarse después del encabezado',
         'label:pt': 'Role após o cabeçalho',
         'label:fr': "Faire défiler après l'en-tête",
         'label:it': "Scorri dopo l'intestazione",
         // 'label:tr': 'Başlıktan sonra kaydır',
         'label:de': 'Nach der Kopfzeile scrollen',
         'label:pl': 'Przewiń nagłówek',
         'label:ua': 'Прокручувати після шапки сайту',
         title: 'Makes sense on a small screen',
         'title:zh': '在小屏幕上有意义',
         'title:ja': '小さな画面で意味があります',
         'title:ko': '작은 화면에서 이해하기',
         'title:id': 'Masuk akal di layar kecil',
         'title:es': 'Tiene sentido en una pantalla pequeña',
         'title:pt': 'Faz sentido em uma tela pequena',
         'title:fr': 'A du sens sur un petit écran',
         'title:it': 'Ha senso su un piccolo schermo',
         // 'title:tr': 'Küçük ekranda mantıklı',
         'title:de': 'Macht auf einem kleinen Bildschirm Sinn',
         'title:pl': 'Przydatne na małym ekranie',
         'title:ua': 'Ефективно на малому екрані',
         type: 'checkbox',
      },
      header_unfixed_hotkey: {
         _tagName: 'select',
         label: 'Hotkey toggle',
         // title: '',
         options: [
            { label: 'V', value: 'v', selected: true },
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z',
         ],
      },
      // header_unfixed_default_state: {
      //    _tagName: 'input',
      //    label: 'Default state init?',
      //    type: 'checkbox',
      // },
   },
});
