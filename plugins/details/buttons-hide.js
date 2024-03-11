// for test:
// https://www.youtube.com/watch?v=J07l-Qe9xgs - thanks button

window.nova_plugins.push({
   id: 'details-buttons',
   title: 'Buttons hide',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
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
   section: 'details-buttons',
   // desc: '',
   // 'plugins-conflict': 'return-dislike',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/488224-control-panel-for-youtube
      // alt2 - https://greasyfork.org/en/scripts/472081-youtube-hide-tool

      const SELECTOR_BTN_CONTAINER = 'ytd-watch-metadata #actions';

      // alt - https://greasyfork.org/en/scripts/447614-youtube-hide-download-clip-and-thanks-buttons
      if (user_settings.details_buttons_hide?.length
         && (stylesList = getHideButtonsList())
         && stylesList.length
      ) {
         NOVA.css.push(stylesList.join(',\n') + ` { display: none !important; }`);
         // NOVA.css.push({
         //    'display': 'none !important',
         // }, stylesList.join(',\n'));
      }

      function getHideButtonsList() {
         let stylesList = [];

         if (user_settings.details_buttons_hide?.includes('subscribe')) {
            stylesList.push('#owner #subscribe-button'); // consider the [comments-sidebar-exchange] plugin
         }
         if (user_settings.details_buttons_hide.includes('join')) {
            // stylesList.push('#below #sponsor-button');
            stylesList.push('#sponsor-button'); // fix for [comments-sidebar-exchange] plugin
         }

         // for optimozation
         if (user_settings.details_buttons_hide?.includes('all')) {
            stylesList.push(`${SELECTOR_BTN_CONTAINER} button`);
            return stylesList; // out
         }

         if (user_settings.details_buttons_hide.includes('like_dislike')) {
            // stylesList.push(`${SELECTOR_BTN_CONTAINER} ytd-segmented-like-dislike-button-renderer`); // old
            stylesList.push(`${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model`);
         }
         else if (user_settings.details_buttons_hide.includes('dislike')) {
            // stylesList.push(`${SELECTOR_BTN_CONTAINER} #segmented-dislike-button, .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after`);
            stylesList.push(`${SELECTOR_BTN_CONTAINER} dislike-button-view-model, ${SELECTOR_BTN_CONTAINER} .yt-spec-button-shape-next--segmented-start::after`);
            // fix add round(radius)
            NOVA.css.push(
               // `${SELECTOR_BTN_CONTAINER} ytd-segmented-like-dislike-button-renderer button,
               `${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model button {
               border-radius: 20px;
            }`);
         }

         if (user_settings.details_buttons_hide.includes('download')) {
            stylesList.push(`${SELECTOR_BTN_CONTAINER} ytd-download-button-renderer`);
         }

         // To above v105 https://developer.mozilla.org/en-US/docs/Web/CSS/:has
         if (CSS.supports('selector(:has(*))')) {
            const buttonSelectors = [
               `${SELECTOR_BTN_CONTAINER} ytd-button-renderer`,
               `${SELECTOR_BTN_CONTAINER} button`,
               'ytd-popup-container ytd-menu-service-item-renderer', // thanks overflow menu
               `${SELECTOR_BTN_CONTAINER} #flexible-item-buttons`, // download button
            ];

            if (user_settings.details_buttons_hide.includes('share')) {
               stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M15 5.63 20.66"])`));
            }
            if (user_settings.details_buttons_hide.includes('thanks')) {
               stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M11 17h2v-1h1c.55"])`));
            }
            if (user_settings.details_buttons_hide.includes('clip')) {
               stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M8 7c0 .55-.45"])`));
            }
            if (user_settings.details_buttons_hide.includes('save')) {
               stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M22 13h-4v4h"])`));
            }
            if (user_settings.details_buttons_hide.includes('report')) {
               stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="m13.18 4 .24 "])`));
            }
            if (user_settings.details_buttons_hide.includes('transcript')) {
               stylesList.push(buttonSelectors.map(e => `\n${e}:has(path[d^="M5,11h2v2H5V11z"])`));
            }
         }

         return stylesList;
      }

      // alt1 - https://greasyfork.org/en/scripts/443136-youtube-compact-button-labels
      // alt2 - https://greasyfork.org/en/scripts/449799-clean-yt-interface
      // alt3 - https://greasyfork.org/en/scripts/441087-youtube-watch-page-no-icon-labels
      // alt4 - https://greasyfork.org/en/scripts/440416-youtube-hide-download-and-other-buttons-under-video
      // alt5 - https://greasyfork.org/en/scripts/446771-youtube-helper

      let stylesTextHideLabel = '';

      if (user_settings.details_buttons_label_hide) {
         stylesTextHideLabel +=
            // `${SELECTOR_BTN_CONTAINER} button ${user_settings.details_buttons_hide ? '' : '[class*="--button-text-content"]'} {
            // `${SELECTOR_BTN_CONTAINER} button ${user_settings.details_buttons_hide ? '' : '.cbox'} {
            //    display: none;
            // }
            `${SELECTOR_BTN_CONTAINER} button [class*=text] {
               display: none;
            }
            ${SELECTOR_BTN_CONTAINER} button .yt-spec-button-shape-next__icon {
               margin: 0 !important;
            }
            /* exept like-dislike */
            /* ${SELECTOR_BTN_CONTAINER} ytd-segmented-like-dislike-button-renderer ~ * button,*/
            ${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model button,
            ${SELECTOR_BTN_CONTAINER} segmented-like-dislike-button-view-model ~ * button,
            ${SELECTOR_BTN_CONTAINER} button.yt-spec-button-shape-next--size-m {
               padding: 0 7px;
            }
            ${SELECTOR_BTN_CONTAINER} ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer {
               margin: 0 !important;
            }`;
      }

      if (+user_settings.details_buttons_opacity) {
         stylesTextHideLabel +=
            `#owner #subscribe-button:not(:hover),
            ${SELECTOR_BTN_CONTAINER} #menu:not(:hover) {
               transition: opacity .2s ease-in-out;
               opacity: ${user_settings.details_buttons_opacity || .1};
            }`;
      }
      // final
      if (stylesTextHideLabel.length) {
         NOVA.css.push(stylesTextHideLabel);
      }

   },
   options: {
      details_buttons_label_hide: {
         _tagName: 'input',
         label: 'Buttons without labels',
         // label: 'Compact button labels',
         'label:zh': '没有标签的按钮',
         'label:ja': 'ラベルのないボタン',
         // 'label:ko': '라벨이 없는 버튼',
         // 'label:vi': '',
         // 'label:id': 'Tombol tanpa label',
         // 'label:es': 'Botones sin etiquetas',
         'label:pt': 'Botões sem rótulos',
         'label:fr': 'Boutons sans étiquettes',
         // 'label:it': 'Bottoni senza etichette',
         // 'label:tr': '',
         'label:de': 'Knöpfe ohne Beschriftung',
         'label:pl': 'Guziki bez etykiet',
         'label:ua': 'Кнопки без написів',
         type: 'checkbox',
         title: 'Requires support for css tag ":has()"',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:vi': '',
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
      details_buttons_opacity: {
         _tagName: 'input',
         label: 'Opacity',
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         // 'label:ko': '불투명',
         // 'label:vi': '',
         // 'label:id': 'Kegelapan',
         // 'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         // 'label:it': 'Opacità',
         // 'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         'label:pl': 'Przejrzystość',
         'label:ua': 'Прозорість',
         type: 'number',
         title: '0 - disable',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:vi': '',
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
         value: .9,
      },
      // details_buttons_hide_all: {
      //    _tagName: 'input',
      //    label: 'Hide buttons completely',
      //    'label:zh': '隐藏按钮',
      //    'label:ja': 'ボタンを隠す',
      //    'label:ko': '버튼 숨기기',
      //    'label:vi': '',
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
         // 'label:vi': '',
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
         // 'title:ko': '[Ctrl+Click] 여러 선택',
         // 'title:vi': '',
         // 'title:id': '[Ctrl+Klik] untuk memilih beberapa',
         // 'title:es': '[Ctrl+Click] para seleccionar varias',
         'title:pt': '[Ctrl+Click] para selecionar vários',
         'title:fr': '[Ctrl+Click] pour sélectionner plusieurs',
         // 'title:it': '[Ctrl+Clic] per selezionarne diversi',
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
               // 'label:vi': '',
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
               // 'label:vi': '',
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
               // 'label:vi': '',
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
               label: 'like+dislike', value: 'like_dislike',
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
               // 'label:ua': '',
            },
            {
               label: 'dislike', value: 'dislike',
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
               // 'label:ua': '',
            },
            {
               label: 'share', value: 'share',
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
               // 'label:ua': '',
            },
            {
               label: 'clip', value: 'clip',
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
               // 'label:ua': '',
            },
            {
               label: 'save', value: 'save',
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
               // 'label:ua': '',
            },
            {
               label: 'download', value: 'download',
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
               // 'label:ua': '',
            },
            {
               label: 'thanks', value: 'thanks',
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
               // 'label:ua': '',
            },
            {
               label: 'report', value: 'report',
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
               // 'label:ua': '',
            },
            {
               label: 'transcript', value: 'transcript',
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
               // 'label:ua': '',
            },
         ],
      },
   }
});
