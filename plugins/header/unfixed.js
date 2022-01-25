window.nova_plugins.push({
   id: 'header-unfixed',
   title: 'Header unfixed',
   'title:zh': '标题未固定',
   'title:ja': 'ヘッダーは固定されていません',
   'title:es': 'Encabezado sin arreglar',
   'title:pt': 'Cabeçalho não corrigido',
   'title:de': 'Kopfleiste nicht fixiert',
   // run_on_pages: 'watch, channel',
   run_on_pages: 'all, -embed, -mobile',
   // restart_on_transition: true,
   section: 'header',
   desc: 'Prevent header from sticking',
   'desc:zh': '防止头部粘连',
   'desc:ja': 'ヘッダーがくっつくのを防ぎます',
   'desc:es': 'Evita que el cabezal se pegue',
   'desc:pt': 'Impede que o cabeçalho grude',
   'desc:de': 'Verhindert das Ankleben des Headers',
   _runtime: user_settings => {

      NOVA.css.push(
         `#masthead-container, ytd-mini-guide-renderer, #guide {
            position: absolute !important;
         }
         #chips-wrapper {
            position: sticky !important;
         }`);

      if (user_settings.header_scroll_after) {
         scrollAfter(); // init state

         document.addEventListener('yt-navigate-finish', () => {
            scrollAfter(); // no sense. Youtube auto-scroll up when page is transition
            NOVA.waitElement('video')
               .then(video => {
                  video.addEventListener('loadeddata', scrollAfter, { capture: true, once: true });
               });
         });

         createArrowButton();

         function scrollAfter() {
            if (topOffset = document.getElementById('masthead')?.offsetHeight) {
               window.scrollTo({ top: topOffset });
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
      header_scroll_after: {
         _tagName: 'input',
         label: 'Scroll after header',
         'label:zh': '在标题后滚动',
         'label:ja': 'ヘッダーの後にスクロール',
         'label:es': 'Desplazarse después del encabezado',
         'label:pt': 'Role após o cabeçalho',
         'label:de': 'Nach der Kopfzeile scrollen',
         title: 'Makes sense on a small screen',
         'title:zh': '在小屏幕上有意义',
         'title:ja': '小さな画面で意味があります',
         'title:es': 'Tiene sentido en una pantalla pequeña',
         'title:pt': 'Faz sentido em uma tela pequena',
         'title:de': 'Macht auf einem kleinen Bildschirm Sinn',
         type: 'checkbox',
      },
   }
});
