_plugins_conteiner.push({
   name: 'Clear videos thumbnails',
   id: 'thumbnail-clear',
   depends_on_pages: 'all, -embed',
   opt_section: 'other',
   desc: 'Replaces the predefined thumbnail',
   _runtime: user_settings => {

      YDOM.HTMLElement.watch({
         selector: '#thumbnail #img[src]',
         attr_mark: 'timestamps-updated',
         callback: img => {
            const re = /(hq1|hq2|hq3|hqdefault|mqdefault|hq720).jpg/i;
            if (re.test(img.src)) {
               img.src = img.src.replace(re, (user_settings.thumbnail_time_stamp || 'hq1') + '.jpg');
            }
         },
      });

   },
   opt_export: {
      'thumbnail_time_stamp': {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         title: 'Thumbnail display video timestamps',
         options: [
            { label: 'start', value: 'hq1' }, // often shows intro
            { label: 'middle', value: 'hq2', selected: true },
            { label: 'end', value: 'hq3' },
         ]
      },
   },
});
