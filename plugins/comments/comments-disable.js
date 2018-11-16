_plugins.push({
   name: 'Off Comments',
   id: 'comments-disable',
   group: 'comments',
   depends_page: 'watch',
   // sandbox: true,
   // desc: '',
   version: '0.1',
   runtime: function (data) {

      PolymerYoutube.waitFor('#comments', function (selector) {
         selector.parentNode.removeChild(selector);
      });

   }
});
