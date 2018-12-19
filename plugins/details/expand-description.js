_plugins.push({
   name: 'Expand video description',
   id: 'expand-description-video',
   section: 'details',
   depends_page: 'watch',
   desc: 'See full description',
   _runtime: user_settings => {

      YDOM.waitFor('.ytd-video-secondary-info-renderer > [collapsed] #more', el => el.click());
      
   }
});
