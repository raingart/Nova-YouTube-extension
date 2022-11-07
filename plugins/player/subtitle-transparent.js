// https://www.youtube.com/watch?v=9EvbqxBUG_c - great for testing
// https://www.youtube.com/watch?v=Il0S8BoucSA&t=99 - subtitle alignment bug
// https://youtu.be/XvJRE6Sm-lM - has sub

window.nova_plugins.push({
   id: 'subtitle-transparent',
   title: 'Transparent subtitles (captions)',
   'title:zh': '透明字幕',
   'title:ja': '透明な字幕',
   'title:ko': '투명한 자막',
   'title:id': 'Subtitle transparan',
   'title:es': 'Subtítulos transparentes',
   'title:pt': 'Legendas transparentes',
   'title:fr': 'Sous-titres transparents',
   'title:it': 'Sottotitoli trasparenti',
   'title:tr': 'Şeffaf altyazılar',
   'title:de': 'Transparente Untertitel',
   'title:pl': 'Napisy przezroczyste',
   'title:ua': 'Прозорі субтитри',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // movie_player.getSubtitlesUserSettings();
      // movie_player.updateSubtitlesUserSettings({ background: 'transparent',}); // Uncaught Error: 'transparent' is not a valid hex color

      let css = {
         'background': 'transparent',
         'text-shadow':
            `rgb(0, 0, 0) 0 0 .1em,
            rgb(0, 0, 0) 0 0 .2em,
            rgb(0, 0, 0) 0 0 .4em`,
      };

      if (user_settings.subtitle_bold) css['font-weight'] = 'bold';

      NOVA.css.push(css, `.ytp-caption-segment`, 'important');

      if (user_settings.subtitle_fixed) {
         // alt - https://greasyfork.org/en/scripts/442033-fix-youtube-caption-position
         NOVA.css.push(
            // `.ytp-larger-tap-buttons .caption-window.ytp-caption-window-bottom {
            `.caption-window {
               margin-bottom: 1px !important;
               bottom: 1% !important;
            }`);
      }

      if (user_settings.subtitle_selectable) {
         // alt - https://greasyfork.org/en/scripts/451626-make-youtube-caption-selectable
         // alt2 - https://greasyfork.org/en/scripts/435955-youtube%E5%AD%97%E5%B9%95%E5%8D%95%E8%AF%8D%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E9%80%89%E4%B8%AD-%E6%96%B9%E4%BE%BFmac%E7%94%B5%E8%84%91%E5%BF%AB%E9%80%9F%E9%80%89%E4%B8%AD%E7%BF%BB%E8%AF%91%E5%8D%95%E8%AF%8D
         NOVA.watchElements({
            selectors: [
               '.ytp-caption-segment:not([selectable="true"]',
               //    'div.caption-window',
               //    '#caption-window-1:not([selectable="true"]'
            ],
            // attr_mark: ATTR_MARK,
            callback: el => {
               el.addEventListener('mousedown', evt => evt.stopPropagation(), true);
               el.setAttribute('draggable', 'false');
               el.setAttribute('selectable', 'true');
               el.style.userSelect = 'text';
               elem.style.WebkitUserSelect = 'text'; // for Safari
               el.style.cursor = 'text';
            }
         });
      }

   },
   options: {
      subtitle_bold: {
         _tagName: 'input',
         label: 'Bold text',
         'label:zh': '粗体',
         'label:ja': '太字',
         'label:ko': '굵은 텍스트',
         'label:id': 'Teks tebal',
         'label:es': 'Texto en negrita',
         'label:pt': 'Texto em negrito',
         'label:fr': 'Texte en gras',
         'label:it': 'Testo grassetto',
         'label:tr': 'Kalın yazı',
         'label:de': 'Fetter Text',
         'label:pl': 'Tekst pogrubiony',
         'label:ua': 'Жирний текст',
         type: 'checkbox',
      },
      subtitle_fixed: {
         _tagName: 'input',
         label: 'Fixed from below',
         'label:zh': '从下方固定',
         'label:ja': '下から固定',
         'label:ko': '아래에서 고정',
         'label:id': 'Diperbaiki dari bawah',
         'label:es': 'Fijado desde abajo',
         'label:pt': 'Fixo por baixo',
         'label:fr': 'Fixé par le bas',
         'label:it': 'Risolto dal basso',
         'label:tr': 'Risolto dal basso',
         'label:de': 'Von unten befestigt',
         'label:pl': 'Przyklejone na dole',
         'label:ua': 'Фіксація знизу',
         type: 'checkbox',
      },
      subtitle_selectable: {
         _tagName: 'input',
         label: 'Make subtitles selectable',
         'label:zh': '使字幕可选',
         'label:ja': '字幕を選択可能にする',
         'label:ko': '자막을 선택 가능하게 만들기',
         'label:id': 'Jadikan subtitle dapat dipilih',
         'label:es': 'Hacer subtítulos seleccionables',
         'label:pt': 'Faça legendas selecionáveis',
         'label:fr': 'Rendre les sous-titres sélectionnables',
         'label:it': 'Rendi selezionabili i sottotitoli',
         'label:tr': 'Altyazıları seçilebilir yap',
         'label:de': 'Untertitel wählbar machen',
         'label:pl': 'Ustaw napisy do wyboru',
         'label:ua': 'Зробити субтитри доступними для вибору',
         type: 'checkbox',
      },
   }
});
