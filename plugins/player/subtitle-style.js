// https://www.youtube.com/watch?v=9EvbqxBUG_c - great for testing
// https://www.youtube.com/watch?v=Il0S8BoucSA&t=99 - subtitle alignment bug
// https://youtu.be/XvJRE6Sm-lM - has sub
// https://www.youtube.com/watch?v=s1ipx-4oTKA - color (red) subtitles

window.nova_plugins.push({
   id: 'subtitle-style',
   title: 'Subtitles (captions) style',
   'title:zh': '字幕样式',
   'title:ja': '字幕スタイル',
   // 'title:ko': '자막 스타일',
   // 'title:vi': '',
   // 'title:id': 'Gaya subtitel',
   // 'title:es': 'Estilo de subtítulos',
   'title:pt': 'estilo de legenda',
   'title:fr': 'Style de sous-titre',
   // 'title:it': 'Stile dei sottotitoli',
   // 'title:tr': 'Altyazı stili',
   'title:de': 'Untertitelstil',
   'title:pl': 'Styl napisów',
   'title:ua': 'Стиль субтитрів',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: async user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/458161-youtube-subtitle-caption-stylish
      // alt2 - https://chrome.google.com/webstore/detail/oanhbddbfkjaphdibnebkklpplclomal

      // under video
      // alt1 - https://greasyfork.org/en/scripts/433440-youtube-subtitles-under-video-frame
      // alt2 - https://greasyfork.org/en/scripts/390669-move-youtube-subtitle-to-the-bottom-of-the-viewport

      // alt (download) - https://greasyfork.org/en/scripts/5368-youtube-subtitle-downloader-v36

      // dual subtitle
      // https://chromewebstore.google.com/detail/youtube-dual-subtitles/hkbdddpiemdeibjoknnofflfgbgnebcm
      // https://greasyfork.org/en/scripts/464879-youtube-dual-subtitle
      // translate subtitle inside in the video - https://greasyfork.org/en/scripts/482236-youtube-subtitle-pc-version - (test - https://www.youtube.com/watch?v=4_YTgbH2xps)

      // alt caption style
      // const storeName = 'yt-player-caption-display-settings';
      // if (data = localStorage.getItem(storeName)) {
      //    obj = JSON.parse(data) || {};
      // }
      // else {
      //    obj = {};
      //    now = Date.now();
      //    obj.data = { creation: now, expiration: now + 30 * 864e5 };
      // }
      // localStorage.setItem(storeName, JSON.stringify(
      //    Object.assign({ fontSizeIncrement: 1, color: '#ff0' }, obj.data)
      // ));

      // reset style
      // movie_player.resetSubtitlesUserSettings();

      const SELECTOR = '.ytp-caption-segment';

      let cssObj = {};

      if (user_settings.subtitle_transparent) {
         // alt - https://greasyfork.org/en/scripts/408929-youtube-bolder-subtitles
         cssObj = {
            'background': 'Transparent',
            'text-shadow':
               `rgb(0, 0, 0) 0 0 .1em,
               rgb(0, 0, 0) 0 0 .2em,
               rgb(0, 0, 0) 0 0 .4em`,
         };
      }
      if (user_settings.subtitle_bold) cssObj['font-weight'] = 'bold';

      if (Object.keys(cssObj).length) {
         NOVA.css.push(cssObj, SELECTOR, 'important');
      }


      if (user_settings.subtitle_fixed) {
         // alt1 - https://greasyfork.org/en/scripts/442033-fix-youtube-caption-position
         // alt2 - https://greasyfork.org/en/scripts/402598-fixed-youtube-captions

         NOVA.css.push(
            // `.ytp-larger-tap-buttons .caption-window.ytp-caption-window-bottom {
            `.caption-window {
               margin-bottom: 1px !important;
               bottom: 1% !important;
            }`);
      }

      if (user_settings.subtitle_selectable) {
         // alt1 - https://greasyfork.org/en/scripts/451626-make-youtube-caption-selectable
         // alt2 - https://greasyfork.org/en/scripts/456140-youtube-caption-selector
         // alt3 - https://greasyfork.org/en/scripts/435955
         // alt4 - https://greasyfork.org/en/scripts/472979-hover-on-youtube-subtitles-for-translating-words/code

         NOVA.watchElements({
            selectors: [
               SELECTOR,
               '[id^="caption-window-"]',
            ]
               .map(i => i + ':not(:empty)'),
            // attr_mark: ATTR_MARK,
            callback: el => {
               el.addEventListener('mousedown', evt => evt.stopPropagation(), { capture: true });
               el.setAttribute('draggable', 'false');
               el.setAttribute('selectable', 'true');
               el.style.userSelect = 'text';
               el.style.WebkitUserSelect = 'text'; // for Safari
               el.style.cursor = 'text';
            }
         });
      }

      if (user_settings.subtitle_color != '#ffffff') {
         // color: rgba(255, 255, 255, .8) !important;
         // color: ${user_settings.subtitle_color}cc !important;
         NOVA.css.push(
            `.ytp-caption-segment {
               color: ${user_settings.subtitle_color} !important;
            }`);
      }

      // api method
      if (+user_settings.subtitle_font_size) {
         // Strategy 1
         NOVA.css.push(
            // `.ytp-larger-tap-buttons .caption-window.ytp-caption-window-bottom {
            `.ytp-caption-segment {
               font-size: calc(32px * ${+user_settings.subtitle_font_size || 1}) !important;
            }`);
         // Strategy 2. API
         // NOVA.waitUntil(() => typeof movie_player === 'object' && typeof movie_player.getSubtitlesUserSettings === 'function', 1000) // 1sec
         //    .then(() => {
         //       // settings = {
         //       //    "background": "#080808",
         //       //    "backgroundOpacity": 0.75,
         //       //    "charEdgeStyle": 0,
         //       //    "color": "#fff",
         //       //    "fontFamily": 4,
         //       //    "fontSizeIncrement": 0,
         //       //    "fontStyle": 0,
         //       //    "textOpacity": 1,
         //       //    "windowColor": "#080808",
         //       //    "windowOpacity": 0
         //       // }
         //       // settings.fontSizeIncrement = +user_settings.subtitle_font_size;
         //       movie_player.updateSubtitlesUserSettings({ fontSizeIncrement: +user_settings.subtitle_font_size });
         //       movie_player.updateSubtitlesUserSettings(settings);
         //    });
      }

      if (user_settings.subtitle) {
         await NOVA.waitUntil(() => typeof movie_player === 'object' && typeof movie_player.toggleSubtitlesOn === 'function', 500); // 500ms
         movie_player.toggleSubtitlesOn();
      }

   },
   options: {
      subtitle: {
         _tagName: 'input',
         // label: 'Default enabled',
         label: 'Automatically enable the subtitles',
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
         type: 'checkbox',
         // title: '',
      },
      subtitle_transparent: {
         _tagName: 'input',
         label: 'Transparent',
         'label:zh': '透明的',
         'label:ja': '透明',
         // 'label:ko': '투명한',
         // 'label:vi': '',
         // 'label:id': 'Transparan',
         // 'label:es': 'Transparentes',
         'label:pt': 'Transparentes',
         'label:fr': 'Transparents',
         // 'label:it': 'Trasparenti',
         // 'label:tr': 'Şeffaf',
         'label:de': 'Transparente',
         // 'label:pl': 'Przezroczysty',
         'label:pl': 'Przezroczyste',
         'label:ua': 'Прозорі',
         type: 'checkbox',
         // title: '',
      },
      subtitle_bold: {
         _tagName: 'input',
         label: 'Bold text',
         'label:zh': '粗体',
         'label:ja': '太字',
         // 'label:ko': '굵은 텍스트',
         // 'label:vi': '',
         // 'label:id': 'Teks tebal',
         // 'label:es': 'Texto en negrita',
         'label:pt': 'Texto em negrito',
         'label:fr': 'Texte en gras',
         // 'label:it': 'Testo grassetto',
         // 'label:tr': 'Kalın yazı',
         'label:de': 'Fetter Text',
         'label:pl': 'Tekst pogrubiony',
         'label:ua': 'Жирний текст',
         type: 'checkbox',
         // title: '',
      },
      subtitle_fixed: {
         _tagName: 'input',
         label: 'Fixed from below',
         'label:zh': '从下方固定',
         'label:ja': '下から固定',
         // 'label:ko': '아래에서 고정',
         // 'label:vi': '',
         // 'label:id': 'Diperbaiki dari bawah',
         // 'label:es': 'Fijado desde abajo',
         'label:pt': 'Fixo por baixo',
         'label:fr': 'Fixé par le bas',
         // 'label:it': 'Risolto dal basso',
         // 'label:tr': 'Risolto dal basso',
         'label:de': 'Von unten befestigt',
         'label:pl': 'Przyklejone na dole',
         'label:ua': 'Фіксація знизу',
         type: 'checkbox',
         title: 'Preventing captions jumping up/down when pause/resume',
         'title:zh': '暂停/恢复时防止字幕跳上/跳下',
         'title:ja': '一時停止/再開時にキャプションが上下にジャンプしないようにする',
         // 'title:ko': '일시 중지/다시 시작 시 캡션이 위/아래로 점프하는 것을 방지',
         // 'title:vi': '',
         // 'title:id': 'Mencegah teks melompat ke atas/bawah saat menjeda/melanjutkan',
         // 'title:es': 'Evitar que los subtítulos salten hacia arriba/abajo al pausar/reanudar',
         'title:pt': 'Evitando que as legendas subam/descem ao pausar/reiniciar',
         'title:fr': "Empêcher les sous-titres de sauter vers le haut/bas lors d'une pause/reprise",
         // 'title:it': 'Prevenire i sottotitoli che saltano su/giù durante la pausa/ripresa',
         // 'title:tr': '',
         'title:de': 'Verhindern, dass Untertitel beim Anhalten/Fortsetzen nach oben/unten springen',
         'title:pl': 'Zapobieganie przeskakiwaniu napisów w górę/w dół podczas pauzy/wznowienia',
         'title:ua': 'Запобігання стрибкам титрів вгору/вниз під час паузи/продовження',
      },
      subtitle_selectable: {
         _tagName: 'input',
         label: 'Make selectable',
         'label:zh': '使字幕可选',
         'label:ja': '字幕を選択可能にする',
         // 'label:ko': '자막 선택 가능',
         // 'label:vi': '',
         // 'label:id': 'Jadikan subtitle dapat dipilih',
         // 'label:es': 'Hacer subtítulos seleccionables',
         'label:pt': 'Tornar as legendas selecionáveis',
         'label:fr': 'Rendre les sous-titres sélectionnables',
         // 'label:it': 'Rendi i sottotitoli selezionabili',
         // 'label:tr': 'Altyazıları seçilebilir yap',
         'label:de': 'Untertitel auswählbar machen',
         'label:pl': 'Ustaw napisy do wyboru',
         'label:ua': 'Зробити субтитри доступними для виділення',
         type: 'checkbox',
         // title: '',
      },
      subtitle_font_size: {
         _tagName: 'input',
         label: 'Font size',
         'label:zh': '字体大小',
         'label:ja': 'フォントサイズ',
         // 'label:ko': '글꼴 크기',
         // 'label:vi': '',
         // 'label:id': '',
         // 'label:es': 'Tamaño de fuente',
         'label:pt': 'Tamanho da fonte',
         'label:fr': 'Taille de police',
         // 'label:it': '',
         // 'label:tr': '',
         'label:de': 'Schriftgröße',
         'label:pl': 'Rozmiar czcionki',
         'label:ua': 'Розмір шрифту',
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
         placeholder: '0-5',
         step: 1,
         min: 0,
         max: 5,
         value: 0,
      },
      subtitle_color: {
         _tagName: 'input',
         type: 'color',
         value: '#ffffff',
         label: 'Color',
         'label:zh': '颜色',
         'label:ja': '色',
         // 'label:ko': '색깔',
         // 'label:vi': '',
         // 'label:id': 'Warna',
         // 'label:es': 'Color',
         'label:pt': 'Cor',
         'label:fr': 'Couleur',
         // 'label:it': 'Colore',
         // 'label:tr': 'Renk',
         'label:de': 'Farbe',
         'label:pl': 'Kolor',
         'label:ua': 'Колір',
         title: 'default - #FFF',
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
   }
});
