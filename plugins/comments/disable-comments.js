_plugins.push({
   name: 'Disable Comments',
   id: 'disable-comments',
   section: 'comments',
   depends_page: 'watch',
   // sandbox: true,
   desc: 'Remove comments section',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#comments', function (selector) {
         selector.parentNode.removeChild(selector);
      });

   }
});
