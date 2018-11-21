_plugins.push({
   name: 'Stop Autoplay Homepage Video',
   id: 'autoplay-homepage-video',
   section: 'channel',
   depends_page: 'channel',
   // sandbox: true,
   // desc: '',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#player', function (selector) { 
         selector.remove();
         // d.pauseVideo();
         // d.stopVideo();
         // d.destroy();
      });

   }
});
