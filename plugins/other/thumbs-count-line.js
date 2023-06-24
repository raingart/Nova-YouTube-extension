// for test
// https://www.youtube.com/watch?v=oWoWkxzeiok&list=OLAK5uy_kDx6ubTnuS4mYHCPyyX1NpXyCtoQN08M4&index=3

window.nova_plugins.push({
   id: 'thumbnails-grid-count',
   title: 'Thumbnails normal count in line',
   'title:zh': '缩略图正常计数',
   'title:ja': 'サムネイルの通常の行数',
   'title:ko': '썸네일 정상 수',
   'title:id': 'Thumbnail normal dihitung dalam antrean',
   'title:es': 'Miniaturas conteo normal en línea',
   'title:pt': 'Contagem normal de miniaturas em linha',
   'title:fr': 'Les miniatures comptent normalement dans la ligne',
   'title:it': 'Le miniature contano normalmente in linea',
   // 'title:tr': '',
   'title:de': 'Thumbnails zählen normal in Reihe',
   'title:pl': 'Miniatury normalnie liczą się w kolejce',
   'title:ua': 'Звичайна кількість ескізів у рядку',
   run_on_pages: 'channel, -mobile',
   section: 'other',
   desc: '4 pieces in a line instead of 3',
   'desc:zh': '一行 4 件而不是 3 件',
   'desc:ja': '3個ではなく4個一列に',
   'desc:ko': '3개 대신 한 줄에 4개',
   'desc:id': '4 buah dalam satu baris, bukan 3',
   'desc:es': '4 piezas en una línea en lugar de 3',
   'desc:pt': '4 peças em uma linha em vez de 3',
   'desc:fr': '4 pièces en ligne au lieu de 3',
   'desc:it': '4 pezzi in fila invece di 3',
   // 'desc:tr': '',
   'desc:de': '4 Stück in einer Reihe statt 3',
   'desc:pl': '4 sztuki w linii zamiast 3',
   'desc:ua': '4 штуки в рядку замість 3',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/391636-youtube-normal-thumbnails
      // alt2 - https://greasyfork.org/en/scripts/459337-youtube-force-compact-grid-increases-max-videos-per-row
      // alt3 - https://greasyfork.org/en/scripts/465840-youtube-videos-per-row-fix
      // alt4 - https://greasyfork.org/en/scripts/452667-youtube-subscriptions-elderly-mode
      // alt5 - https://chrome.google.com/webstore/detail/dcnjhgnfnmijfkmcddcmffeamphmmeed

      const
         origMathMin = Math.min,
         addRowCount = +user_settings.thumbnails_grid_count || 1;

      Math.min = function () {
         return origMathMin.apply(Math, arguments)
            + (/calcElementsPerRow/img.test(Error().stack || '') ? addRowCount : 0);
      };

      // ???
      NOVA.css.push(
         `ytd-rich-grid-video-renderer[mini-mode] #video-title.ytd-rich-grid-video-renderer {
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1.6rem;
         }

         #avatar-link.ytd-rich-grid-video-renderer {
            display: none !important;
         }

         ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {
            min-width: 120px !important;
            max-width: 240px !important;
         }`);

   },
   options: {
      thumbnails_grid_count: {
         _tagName: 'input',
         label: 'Add to row',
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
         // 'label:ua': '',
         type: 'number',
         // title: '',
         placeholder: '1-10',
         step: 1,
         min: 1,
         max: 10,
         value: 1,
      },
   }
});
