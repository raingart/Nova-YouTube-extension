_plugins.push({
   name: 'Hide Navigation Panel',
   id: 'collapse-navigation-panel',
   section: 'channel',
   depends_page: 'channel, results, playlist, null',
   // sandbox: true,
   desc: 'Hide left panel',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#guide[opened]', function (element) {
         // console.log('#guide is opened');
         element.removeAttribute("opened");
      });

   }
});
