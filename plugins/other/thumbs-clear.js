_plugins_conteiner.push({
   id: 'thumbnails-clear',
   title: 'Clear thumbnails',
   run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Replaces the predefined thumbnail',
   _runtime: user_settings => {

      YDOM.watchElement({
         selector: '#thumbnail #img[src]',
         attr_mark: 'preview-cleared',
         callback: img => {
            // hq1,hq2,hq3,hq720,default,sddefault,mqdefault,hqdefault excluding - maxresdefault
            if ((re = /(\w{1}qdefault|hq\d+).jpg/i) && re.test(img.src)) {
               img.src = img.src.replace(re, (user_settings.thumbnails_clear_amps || 'hq2') + '.jpg');
            }
         },
      });

      if (user_settings.thumbnails_clear_overlay_disable) {
         YDOM.css.push(
            `#hover-overlays {
               visibility: hidden !important;
            }`);
      }

   },
   options: {
      thumbnails_clear_timestamps: {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         title: 'Thumbnail display video timestamps',
         options: [
            { label: 'start', value: 'hq1' }, // often shows intro
            { label: 'middle', value: 'hq2', selected: true },
            { label: 'end', value: 'hq3' },
         ],
      },
      thumbnails_clear_overlay: {
         _tagName: 'input',
         label: 'Hide overlay button',
         type: 'checkbox',
         title: 'Hide [ADD TO QUEUE] [WATCH LATER]',
      },
   },
});
