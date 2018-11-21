_plugins.push({
   name: 'Video Speed with MouseWheel',
   id: 'set-video-speed',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'You can control your volume with configurable',
   // version: '0.1',
   _runtime: function (user_settings) {

      // PolymerYoutube.waitFor('.html5-video-player', function (playerId) {
      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         document.getElementsByClassName("html5-video-container")[0]
            .addEventListener("wheel", MouseWheelHandler, false); //mousewheel

         function MouseWheelHandler(event) {
            if (event.ctrlKey)
               // console.log(event.target);
               event.preventDefault();
            const delta = Math.sign(event.wheelDelta);
         }
      });

      ///
      d.getAvailablePlaybackRates();
      d.getPlaybackRate();
      d.setPlaybackRate(f)
      ////
},
});
