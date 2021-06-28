_plugins_conteiner.push({
   id: 'thumbnails-preview-clear',
   title: 'Clear videos thumbnails',
   run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Replaces the predefined thumbnail',
   _runtime: user_settings => {

      YDOM.watchElement({
         selector: '#thumbnail #img[src]',
         attr_mark: 'preview-cleared',
         callback: img => {
            if ((re = /(hq1|hq2|hq3|hqdefault|mqdefault|hq720).jpg/i) && re.test(img.src)) {
               img.src = img.src.replace(re, (user_settings.thumbnails_preview_timestamps || 'hq2') + '.jpg');
            }
         },
      });

   },
   options: {
      thumbnails_preview_timestamps: {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         title: 'Thumbnail display video timestamps',
         options: [
            { label: 'start', value: 'hq1' }, // often shows intro
            { label: 'middle', value: 'hq2', selected: true },
            { label: 'end', value: 'hq3' },
         ],
      },
   },
});
