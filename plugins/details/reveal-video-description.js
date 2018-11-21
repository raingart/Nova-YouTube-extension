_plugins.push({
   name: 'Video Description Expander',
   id: 'reveal-video-description',
   section: 'description',
   depends_page: 'watch',
   // sandbox: true,
   desc: 'See full description',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#container > ytd-expander[collapsed]', function (element) {
         // console.log('element1', element);
         element.removeAttribute("collapsed");
      });

   }
});
