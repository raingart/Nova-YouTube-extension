_plugins.push({
   name: 'Middle click scroll to top',
   id: 'scroll-to-top',
   section: 'other',
   depends_page: 'watch',
   // sandbox: false,
   desc: 'Middle mouse click scroll to top',
   // version: '0.1',
   _runtime: function (user_settings) {

      // ytp-button ytp-cards-button
      // https://youtu.be/RwFKzJlwf8A?t=515
      PolymerYoutube.waitFor('#columns', function (elm) {
         elm.addEventListener("auxclick", function (e) {
            // console.log('target.tagName',e.target.tagName);
            // console.log('which',e.which);
            if (e.target.tagName.toLowerCase() !== 'a') {
               // e.preventDefault();
               window.scrollTo(0, 0);
            }
         });
      });

   },
});
