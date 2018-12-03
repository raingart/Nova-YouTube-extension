_plugins.push({
   name: 'Middle click scroll to top',
   id: 'scroll-to-top',
   section: 'other',
   depends_page: 'watch',
   // sandbox: false,
   desc: 'Middle mouse click scroll to top',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#columns', function (element) {

         element.addEventListener("auxclick", scrollTop);

         function scrollTop(event) {
            // console.log('auxclick tagName',event.target.tagName);
            if (event.target.tagName.toLowerCase() !== 'a')
               window.scrollTo(0, 0);
         }

      });

   },
});
