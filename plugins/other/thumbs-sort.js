// fore test
// https://www.youtube.com/channel/UC9qr4fem8L5HEx0IDoktEpw/videos - many live
// https://www.youtube.com/channel/UCIjYyZxkFucP_W-tmXg_9Ow/videos - no sort
// https://www.youtube.com/channel/UCHzevlEL9JfsBIm86uNCJqg/videos

window.nova_plugins.push({
   id: 'thumbs-sort',
   title: 'Add button to sort thumbnails by views',
   'title:zh': '添加按钮以按视图对缩略图进行排序',
   'title:ja': 'ビューでサムネイルを並べ替えるボタンを追加',
   'title:ko': '보기별로 축소판을 정렬하는 추가 버튼',
   'title:es': 'Agregar botón para ordenar las miniaturas por vistas',
   'title:pt': 'Botão Adicionar para classificar miniaturas por visualizações',
   'title:fr': 'Ajouter un bouton pour trier les vignettes par vues',
   'title:tr': 'Küçük resimleri görünümlere göre sıralamak için Ekle düğmesi',
   'title:de': 'Schaltfläche "Hinzufügen", um Miniaturansichten nach Ansichten zu sortieren',
   'title:pl': 'Dodaj przycisk sortowania miniatur według wyświetleń',
   run_on_pages: 'channel, -mobile',
   // restart_on_transition: true, // dirty fix. required to use. But for optimization it is disabled and the code is not adapted
   section: 'other',
   desc: 'On channel page',
   _runtime: user_settings => {
      // addButton
      NOVA.waitElement('#sub-menu #sort-menu:empty') // if default sort by is empty
         .then(container => {
            const sortBtn = document.createElement('button');
            sortBtn.textContent = 'Sort by Views';
            sortBtn.addEventListener('click', () => {
               if (container = document.querySelector('#page-manager #primary #items')) {
                  container.append(...Array.from(container.childNodes).sort(sortBy));

               } else console.error('sortBtn container items is empty');
            });
            container.append(sortBtn);
         });

      function sortBy(a = required(), b = required()) {
         // switch (sortBy_type) {
         //    case 'views':
         return getViews(b) - getViews(a);

         function getViews(e) {
            const views = e.querySelector('a[aria-label]')?.getAttribute('aria-label') // #metadata
               ?.match(/([\d,]+) views/);

            return views && views[1] ? +views[1].replace(/,/g, '') : 0;
            // return views && views[1] ? parseInt(views[1].replace(/,/g, '')) : 0;
         }
         //    break;

         //    default:
         //       break;
         // }
      }

      if (user_settings.thumbs_sort_streams_ahead) {
         // alt - https://greasyfork.org/en/scripts/433860-yt-feed-sorter/code
         NOVA.waitElement('ytd-grid-video-renderer')
            .then(async () => {
               const
                  liveSelector = '#overlays [overlay-style="LIVE"], #video-badges [class*="live-now"], #thumbnail img[src*="qdefault_live.jpg"]',
                  soonSelector = '#overlays [overlay-style="UPCOMING"], #overlays [aria-label="PREMIERE"]';

               // wait all stream
               await NOVA.waitUntil(() => document.querySelectorAll(liveSelector).length > 1, 500);

               if (container = document.querySelector('#page-manager #primary #items')) {
                  container.append(...Array.from(container.childNodes).sort(sortByStream));
               }

               function sortByStream(a, b) {
                  const ai = a.querySelector(liveSelector) ? 2 : a.querySelector(soonSelector) ? 1 : 0;
                  const bi = b.querySelector(liveSelector) ? 2 : b.querySelector(soonSelector) ? 1 : 0;
                  return (ai > bi) ? -1 : (ai < bi) ? 1 : 0;
               }
            });
      }
   },
   options: {
      thumbs_sort_streams_ahead: {
         _tagName: 'input',
         label: 'Streams and premiere is first',
         'label:zh': '流媒体和首映是第一',
         'label:ja': 'ストリームとプレミアが最初です',
         'label:ko': '스트림 및 프리미어가 먼저입니다.',
         'label:es': 'Corrientes y estrenos es la primera',
         'label:pt': 'Streams e estreias é o primeiro',
         'label:fr': 'Les flux et les premières sont les premiers',
         'label:tr': 'Akışlar ve prömiyerler ilk sırada',
         'label:de': 'Streams und Premieren stehen an erster Stelle',
         'label:pl': 'Streamy i premiery jako pierwsze',
         type: 'checkbox',
      },
   }
});
