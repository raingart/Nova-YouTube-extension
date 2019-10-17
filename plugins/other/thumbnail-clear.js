_plugins.push({
   name: 'Clear video thumbnails',
   id: 'thumbnail-clear',
   section: 'other',
   depends_page: 'all, -embed',
   desc: 'Replaces the predefined thumbnail',
   _runtime: user_settings => {

      const switchAttrUpdated = 'thumbnail-updated';

      YDOM.waitFor('#thumbnail:not([' + switchAttrUpdated + ']) img', thumbnail => {
         // console.log('switchAttrUpdated:', thumbnail);
         thumbnail.setAttribute(switchAttrUpdated, true);

         var re = /(hq1|hq2|hq3|hqdefault|mqdefault|hq720).jpg/i;

         if (thumbnail.src.match(re)) {
            thumbnail.src = thumbnail.src.replace(re, `${(user_settings.thumbnail_time_stamp || 'hq1')}.jpg`);
         }

      }, 'hard waitFor listener');

   },
   export_opt: (function () {
      return {
         'thumbnail_time_stamp': {
            _elementType: 'select',
            label: 'Thumbnail timestamps',
            title: 'Thumbnail display video timestamps',
            options: [
               { label: 'start', value: 'hq1', selected: true },
               { label: 'middle', value: 'hq2' },
               { label: 'end', value: 'hq3' },
            ]
         },
      };
   }()),
});
