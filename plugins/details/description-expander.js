_plugins.push({
   name: 'Video Description Expander',
   id: 'video-description-expande',
   group: 'description',
   depends_page: 'watch',
   // sandbox: true,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {

      PolymerYoutube.waitFor('#container > ytd-expander', function (element) {
         // If the element has a attribute, delete it
         if (element.hasAttribute("collapsed")) {
            element.removeAttribute("collapsed");
         }
      });
      
   }
});
