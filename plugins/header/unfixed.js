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
   'title:tr': 'Başlık sabitlenmemiş',
   'title:de': 'Kopfleiste nicht fixiert',
   'title:pl': 'Przewijany nagłówek',
   // run_on_pages: 'watch, channel',
   run_on_pages: 'all, -embed, -mobile',
   // restart_on_transition: true,
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
   'desc:tr': 'Başlığın yapışmasını önleyin',
   'desc:de': 'Verhindert das Ankleben des Headers',
   'desc:pl': 'Nagłówek będzie przewijany wraz ze stroną',
   _runtime: user_settings => {

      NOVA.css.push(
         `#masthead-container, ytd-mini-guide-renderer, #guide {
            position: absolute !important;
         }
         #chips-wrapper {
            position: sticky !important;
         }`);

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
         'label:tr': 'Başlıktan sonra kaydır',
         'label:de': 'Nach der Kopfzeile scrollen',
         'label:pl': 'Przewiń nagłówek',
         title: 'Makes sense on a small screen',
         'title:zh': '在小屏幕上有意义',
         'title:ja': '小さな画面で意味があります',
         'title:ko': '작은 화면에서 이해하기',
         'title:id': 'Masuk akal di layar kecil',
         'title:es': 'Tiene sentido en una pantalla pequeña',
         'title:pt': 'Faz sentido em uma tela pequena',
         'title:fr': 'A du sens sur un petit écran',
         'title:it': 'Ha senso su un piccolo schermo',
         'title:tr': 'Küçük ekranda mantıklı',
         'title:de': 'Macht auf einem kleinen Bildschirm Sinn',
         'title:pl': 'Przydatne na małym ekranie',
         type: 'checkbox',
      },
   }
});
