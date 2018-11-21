_plugins.push({
   name: 'Fixed Video while Scrolling',
   id: 'fixed-video-scroll',
   section: 'player',
   depends_page: 'watch',
   // sandbox: true,
   // desc: '',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         let state_visible = false;
         let initStyle;

         window.addEventListener('wheel', function (event) {
            // console.log('playerId state_visible %s', state_visible);

            if (PolymerYoutube.isInViewport(document.getElementById("player-theater-container"))) {
               if (!state_visible) {
                  playerId.removeAttribute("style");
                  document.getElementsByTagName('video')[0].style.cssText = initStyle;
                  state_visible = true;
               }
            } else if (state_visible) {
               let cssVid = window.getComputedStyle(playerId, null);
               initStyle = document.getElementsByTagName('video')[0].style.cssText;
               // initStyle = cssVid.cssText;

               let size = {
                  // width: initStyle.width.slice(0, -2),
                  // height: cssVid.height.slice(0, -2),
                  width: cssVid.getPropertyValue('width').replace(/px/i, ''),
                  height: cssVid.getPropertyValue('height').replace(/px/i, ''),
               };
               size.calc = calculateAspectRatioFit(size.width, size.height, window.innerWidth / 3, window.innerWidth / 3);

               Object.assign(document.getElementsByTagName('video')[0].style, {
                  width: size.calc.width + 'px',
                  height: size.calc.height + 'px',
               });

               Object.assign(playerId.style, {
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  width: size.calc.width + 'px',
                  height: size.calc.height + 'px',
                  'z-index': 9999,
               });

               state_visible = false;
            }

         }, false);
      });

      function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
         var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
         return {
            width: srcWidth * ratio,
            height: srcHeight * ratio,
         };
      }

   },
});
