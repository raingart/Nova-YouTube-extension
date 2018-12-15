_plugins.push({
   name: 'Video Description Expander',
   id: 'reveal-description-video',
   section: 'details',
   depends_page: 'watch',
   desc: 'See full description',
   _runtime: user_settings => {

      YDOM.waitFor('#container > ytd-expander[collapsed]', el => el.removeAttribute("collapsed"));
      
   }
});
