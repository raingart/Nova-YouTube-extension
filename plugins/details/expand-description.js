_plugins.push({
   name: 'Expands video description',
   id: 'expand-description-video',
   section: 'details',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: '.ytd-video-secondary-info-renderer > [collapsed] #more',
         callback: el => el.click(),
      });

   }
});
