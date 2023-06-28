window.nova_plugins.push({
   id: 'details-buttons',
   title: 'Buttons',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      if (user_settings.details_buttons_hide?.includes('subscribe')) {
         stylesList.push('#below #subscribe-button');
      }

      if (user_settings.details_buttons_hide?.includes('all')) {
         return NOVA.css.push(
            `ytd-watch-metadata #actions button {
               display: none !important;
            }`);
      }

      // alt1 - https://greasyfork.org/en/scripts/443136-youtube-compact-button-labels
      // alt2 - https://greasyfork.org/en/scripts/449799-clean-yt-interface
      // alt3 - https://greasyfork.org/en/scripts/441087-youtube-watch-page-no-icon-labels
      // alt4 - https://greasyfork.org/en/scripts/440416-youtube-hide-download-and-other-buttons-under-video
      let styles = '';

      if (user_settings.details_button_no_labels) {
         styles +=
            // `ytd-watch-metadata #actions button ${user_settings.details_buttons_hide ? '' : '[class*="--button-text-content"]'} {
            // `ytd-watch-metadata #actions button ${user_settings.details_buttons_hide ? '' : '.cbox'} {
            //    display: none;
            // }
            `ytd-watch-metadata #actions button .cbox {
               display: none;
            }
            ytd-watch-metadata #actions button .yt-spec-button-shape-next__icon {
               margin: 0 !important;
            }
            /* exept like-dislike */
            ytd-watch-metadata #actions ytd-segmented-like-dislike-button-renderer ~ * button,
            ytd-watch-metadata #actions #top-level-buttons-computed ~ * button.yt-spec-button-shape-next--size-m {
               padding: 0 7px;
            }`;
      }

      if (+user_settings.details_button_no_labels_opacity) {
         styles +=
            `#subscribe-button:not(:hover),
            ytd-watch-metadata #actions #menu:not(:hover) {
               transition: opacity .2s ease-in-out;
               opacity: ${user_settings.details_button_no_labels_opacity || .1};
            }`;
      }

      if (styles) {
         NOVA.css.push(styles);
      }

      // alt - https://greasyfork.org/en/scripts/447614-youtube-hide-download-clip-and-thanks-buttons
      if (user_settings.details_buttons_hide?.length) {

         const buttonSelectors = [
            'ytd-watch-metadata #menu ytd-button-renderer',
            'ytd-watch-metadata #menu button',
            'ytd-popup-container ytd-menu-service-item-renderer',
         ];

         let stylesList = [];
         if (user_settings.details_buttons_hide.includes('join')) {
            stylesList.push('#below #sponsor-button');
         }
         if (user_settings.details_buttons_hide.includes('like_dislike')) {
            stylesList.push('ytd-watch-metadata #menu ytd-segmented-like-dislike-button-renderer');
         }
         if (user_settings.details_buttons_hide.includes('dislike')) {
            stylesList.push('ytd-watch-metadata #menu #segmented-dislike-button');
            NOVA.css.push(
               `ytd-watch-metadata #menu ytd-segmented-like-dislike-button-renderer button {
                  border-radius: 100%;
                  width: 40px;
                  border: 0;
               }`);
         }
         if (user_settings.details_buttons_hide.includes('download')) {
            stylesList.push('ytd-watch-metadata #menu ytd-download-button-renderer');
         }
         // by svg To above v105 https://developer.mozilla.org/en-US/docs/Web/CSS/:has
         if (user_settings.details_buttons_hide.includes('share')) {
            stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M15,5.63L20.66,12L15"])`));
         }
         if (user_settings.details_buttons_hide.includes('thanks')) {
            stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M16.5,3C19.02,3,21,5.19,21"])`));
         }
         if (user_settings.details_buttons_hide.includes('clip')) {
            stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M8,7c0,0.55-0.45"])`));
         }
         if (user_settings.details_buttons_hide.includes('save')) {
            stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d$="M2,16h8v-1H2V16z"])`));
         }
         if (user_settings.details_buttons_hide.includes('report')) {
            stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d$="L14,3z"])`));
         }
         if (user_settings.details_buttons_hide.includes('transcript')) {
            stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M5,11h2v2H5V11z"])`));
         }
         // final
         if (stylesList.length) {
            NOVA.css.push(
               stylesList.join(',\n').trim() + ` {
                  display: none !important;
               }`);
            // NOVA.css.push({
            //    'display': 'none !important',
            // }, stylesList.join(',\n'));
         }
      }


   },
   options: {
      details_button_no_labels: {
         _tagName: 'input',
         label: 'Buttons without labels',
         // label: 'Compact button labels',
         'label:zh': '没有标签的按钮',
         'label:ja': 'ラベルのないボタン',
         'label:ko': '라벨이 없는 버튼',
         'label:id': 'Tombol tanpa label',
         'label:es': 'Botones sin etiquetas',
         'label:pt': 'Botões sem rótulos',
         'label:fr': 'Boutons sans étiquettes',
         'label:it': 'Bottoni senza etichette',
         // 'label:tr': '',
         'label:de': 'Knöpfe ohne Beschriftung',
         'label:pl': 'Guziki bez etykiet',
         'label:ua': 'Кнопки без написів',
         type: 'checkbox',
         title: 'Requires support for css tag ":has()"',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
      },
      details_button_no_labels_opacity: {
         _tagName: 'input',
         label: 'Opacity',
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         'label:ko': '불투명',
         'label:id': 'Kegelapan',
         'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         'label:it': 'Opacità',
         // 'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         'label:pl': 'Przejrzystość',
         'label:ua': 'Прозорість',
         type: 'number',
         title: '0 - disable',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         placeholder: '0-1',
         step: .05,
         min: 0,
         max: 1,
         value: .1,
      },
      // details_buttons_hide_all: {
      //    _tagName: 'input',
      //    label: 'Hide buttons completely',
      //    'label:zh': '隐藏按钮',
      //    'label:ja': 'ボタンを隠す',
      //    'label:ko': '버튼 숨기기',
      //    'label:id': 'Sembunyikan tombol',
      //    'label:es': 'Ocultar botones',
      //    'label:pt': 'Ocultar botões',
      //    'label:fr': 'Masquer les boutons',
      //    'label:it': 'Nascondi pulsanti',
      //    // 'label:tr': 'Düğmeleri gizle',
      //    'label:de': 'Verstecken tasten',
      //    'label:pl': 'Ukryj przyciski',
      //    'label:ua': 'Сховати кнопки',
      //    type: 'checkbox',
      // },
      details_buttons_hide: {
         _tagName: 'select',
         // label: 'Hide detail buttons',
         label: 'Hide items',
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
         title: '[Ctrl+Click] to select several',
         'title:zh': '[Ctrl+Click] 选择多个',
         'title:ja': '「Ctrl+Click」して、いくつかを選択します',
         'title:ko': '[Ctrl+Click] 여러 선택',
         'title:id': '[Ctrl+Klik] untuk memilih beberapa',
         'title:es': '[Ctrl+Click] para seleccionar varias',
         'title:pt': '[Ctrl+Click] para selecionar vários',
         'title:fr': '[Ctrl+Click] pour sélectionner plusieurs',
         'title:it': '[Ctrl+Clic] per selezionarne diversi',
         // 'title:tr': 'Birkaç tane seçmek için [Ctrl+Tıkla]',
         'title:de': '[Ctrl+Click] um mehrere auszuwählen',
         'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
         'title:ua': '[Ctrl+Click] щоб обрати декілька',
         multiple: null, // don't use - selected: true
         // required: true, // don't use - selected: true
         size: 8, // = options.length
         options: [
            {
               label: 'subscribe', value: 'subscribe',
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
            },
            {
               label: 'all (below)', value: 'all',
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
            },
            {
               label: 'join', value: 'join',
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
            },
            {
               label: 'like/dislike', value: 'like_dislike',
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
            },
            {
               label: 'dislike', value: 'dislike',
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
            },
            {
               label: 'share', value: 'share',
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
            },
            {
               label: 'clip', value: 'clip',
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
            },
            {
               label: 'save', value: 'save',
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
            },
            {
               label: 'download', value: 'download',
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
            },
            {
               label: 'thanks', value: 'thanks',
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
            },
            {
               label: 'report', value: 'report',
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
            },
            {
               label: 'transcript', value: 'transcript',
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
            },
         ],
      },
   }
});
