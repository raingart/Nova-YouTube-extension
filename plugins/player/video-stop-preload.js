_plugins.push({
   name: 'Stop-Preload',
   id: 'video-stop-preload',
   group: 'player',
   depends_page: 'watch',
   // sandbox: false,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {

      PolymerYoutube.waitFor('#movie_player', function (vid) {
         vid.stopVideo();
      })
      
   },
});
