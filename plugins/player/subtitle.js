// https://www.youtube.com/watch?v=Il0S8BoucSA&t=99 - subtitle alignment bug
// https://youtu.be/XvJRE6Sm-lM - has sub

window.nova_plugins.push({
   id: 'subtitle-transparent',
   title: 'Transparent subtitles (captions)',
   'title:zh': '透明字幕',
   'title:ja': '透明な字幕',
   'title:ko': '투명한 자막',
   'title:es': 'Subtítulos transparentes',
   'title:pt': 'Legendas transparentes',
   'title:fr': 'Sous-titres transparents',
   'title:tr': 'Şeffaf altyazılar',
   'title:de': 'Transparente Untertitel',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      let css = {
         'background': 'transparent',
         'text-shadow':
            `rgb(0, 0, 0) 0 0 .1em,
            rgb(0, 0, 0) 0 0 .2em,
            rgb(0, 0, 0) 0 0 .4em`,
      };

      if (user_settings.subtitle_bold) css['font-weight'] = 'bold';

      if (user_settings.subtitle_fixed) {
         NOVA.css.push(
            // `.ytp-larger-tap-buttons .caption-window.ytp-caption-window-bottom {
            `.caption-window {
               margin-bottom: 1px !important;
               bottom: 1% !important;
               left: 50% !important;
            }`);
      }

      NOVA.css.push(css, `.ytp-caption-segment`, 'important');
   },
   options: {
      subtitle_bold: {
         _tagName: 'input',
         label: 'Bold text',
         'label:zh': '粗体',
         'label:ja': '太字',
         'label:ko': '굵은 텍스트',
         'label:es': 'Texto en negrita',
         'label:pt': 'Texto em negrito',
         'label:fr': 'Texte en gras',
         'label:tr': 'Kalın yazı',
         'label:de': 'Fetter Text',
         type: 'checkbox',
      },
      subtitle_fixed: {
         _tagName: 'input',
         label: 'Fixed bottom',
         // 'label:zh': '粗体',
         // 'label:ja': '太字',
         // 'label:ko': '굵은 텍스트',
         // 'label:es': 'Texto en negrita',
         // 'label:pt': 'Texto em negrito',
         // 'label:fr': 'Texte en gras',
         // 'label:tr': 'Kalın yazı',
         // 'label:de': 'Fetter Text',
         type: 'checkbox',
      },
   }
});
