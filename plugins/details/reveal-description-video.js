_plugins.push({
   name: 'Video Description Expander',
   id: 'reveal-description-video',
   section: 'details',
   depends_page: 'watch',
   // sandbox: true,
   desc: 'See full description',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#container > ytd-expander[collapsed]', function (element) {
         element.removeAttribute("collapsed");
      });

   }
});
