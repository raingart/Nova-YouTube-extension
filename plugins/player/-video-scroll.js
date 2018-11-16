_plugins.push({
   name: 'Video Scroll',
   id: 'video-scroll',
   group: 'player',
   depends_page: 'watch',
   // sandbox: true,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {

      PolymerYoutube.waitFor('video', function (vid) {
         // PolymerYoutube.waitFor('#movie_player', function (vid) {
         let state_visible = false;
         let initStyle;

         window.addEventListener('scroll', function (event) {
            // console.log('vid state_visible %s', state_visible);

            if (PolymerYoutube.isInViewport(document.getElementById("player-theater-container"))) {
               if (!state_visible) {
                  vid.style.cssText = initStyle;
                  state_visible = true;
               }
            } else {
               if (state_visible) {
                  let cssVid = window.getComputedStyle(vid, null);
                  initStyle = cssVid.cssText;

                  let size = {
                     // width: initStyle.width.slice(0, -2),
                     // height: cssVid.height.slice(0, -2),
                     width: cssVid.getPropertyValue('width').replace(/px/i, ''),
                     height: cssVid.getPropertyValue('height').replace(/px/i, ''),
                  }
                  size.calc = calculateAspectRatioFit(size.width, size.height, window.innerWidth / 3, window.innerWidth / 3)

                  vid.setAttribute("style", "");
                  vid.style.setProperty('position', 'fixed');
                  vid.style.setProperty('left', (window.innerWidth - window.innerWidth / 30 - size.calc.width) + 'px');
                  vid.style.setProperty('top', (window.innerHeight - window.innerHeight / 30 - size.calc.height) + 'px');
                  vid.style.setProperty('width', size.calc.width + 'px');
                  vid.style.setProperty('height', size.calc.height + 'px');

                  state_visible = false;
               }
            }
            if (!vid.style.height) vid.style.setProperty('height', 'auto'); //crappy postfix

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
