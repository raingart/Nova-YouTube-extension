_plugins.push({
   name: 'Hide Navigation Panel',
   id: 'collapse-navigation-panel',
   section: 'channel',
   depends_page: 'channel, results',
   // sandbox: true,
   desc: 'Hide left panel',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#guide[opened]', function (element) {
         // console.log('#guide is opened');
         element.removeAttribute("opened");
      });

   }
});
