// https://youtu.be/Il0S8BoucSA?t=99 - subtitle alignment bug

window.nova_plugins.push({
   id: 'subtitle-transparent',
   title: 'Transparent subtitles (captions)',
   'title:zh': '透明字幕',
   'title:ja': '透明な字幕',
   'title:es': 'Subtítulos transparentes',
   run_on_pages: 'watch',
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

      NOVA.css.push(css, `.ytp-caption-segment`, 'important');
   },
   options: {
      subtitle_bold: {
         _tagName: 'input',
         label: 'Bold text',
         'label:zh': '粗体',
         'label:ja': '太字',
         'label:es': 'Texto en negrita',
         type: 'checkbox',
      },
   },
});
