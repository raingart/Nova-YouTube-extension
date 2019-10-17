_plugins.push({
   name: 'Normalize video title',
   id: 'normalize-video-title',
   section: 'other',
   depends_page: 'channel, results, playlist, main, watch',
   desc: 'Decapitalize video title',
   _runtime: user_settings => {

      const VIDEO_TITLE_SELECTOR = '#video-title';

      // Make lower case all
      YDOM.injectStyle({
         'text-transform': 'lowercase',
         'display': 'block', // required to "::first-letter"
      }, VIDEO_TITLE_SELECTOR, 'important');

      // Make uppercase first-letter
      YDOM.injectStyle({
         'text-transform': 'uppercase',
         // color: '#8A2BE2'
      }, VIDEO_TITLE_SELECTOR + '::first-letter', 'important');

   }
});
