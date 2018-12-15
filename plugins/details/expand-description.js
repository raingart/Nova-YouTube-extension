_plugins.push({
   name: 'Expand video description',
   id: 'expand-description-video',
   section: 'details',
   depends_page: 'watch',
   desc: 'See full description',
   _runtime: user_settings => {

      YDOM.waitFor('#container > ytd-expander[collapsed]', el => el.removeAttribute("collapsed"));
      
   }
});
