_plugins.push({
   name: 'Pin player while scrolling',
   id: 'fixed-player-scroll',
   section: 'player',
   depends_page: 'watch',
   // sandbox: true,
   desc: 'Fixed player position',
   _runtime: function (user_settings) {

      // PolymerYoutube.waitFor('#ytd-player.pin_video', function (el) {
      //    console.log('1111');
      //    PolymerYoutube.connect_DragnDrop(
      //       el
      //    , position => {
      //       console.log('222');
      //       // PolymerYoutube.connect_DragnDrop(playerId, (position) => {
      //          localStorage.setItem('player-position-top', position.top);
      //          localStorage.setItem('player-position-left', position.left);
      //       });
      // })

      PolymerYoutube.waitFor('.html5-video-player video[style]', function (vid_) {
      // PolymerYoutube.waitFor('#player', function (playerId) {
      // PolymerYoutube.waitFor('#movie_player', function (playerId) {

         let in_viewport;
         let scroll_toggle_class = "pin_video";

         initStyle();

         window.addEventListener('scroll', function () {
            pinned_elm(
               document.getElementById('ytd-player'),
               // document.getElementById('movie_player'),
               // playerId,
               document.getElementById("player-theater-container")
            );
         });

         function pinned_elm(scroll_target, viewer) {
            // console.log('playerId in_viewport %s', in_viewport);
            if (PolymerYoutube.isInViewport(viewer || scroll_target)) {
               if (!in_viewport) {
                  // console.log('scroll_target isInViewport');
                  scroll_target.classList.remove(scroll_toggle_class);
                  in_viewport = true;

                  scroll_target.onmousedown = null;
               }
            } else if (in_viewport) {
               // console.log('scroll_target isInViewport');
               scroll_target.classList.add(scroll_toggle_class);
               in_viewport = false;

               // PolymerYoutube.connect_DragnDrop(scroll_target);
            }
         }

         function initStyle() {
            let initcss = {
               position: 'fixed',
               'z-index': 9999,
            };

            // initcss.top = localStorage.getItem('player-position-top');
            // initcss.left = localStorage.getItem('player-position-left');

            // set pin_player_size_position
            switch (user_settings['pin_player_size_position']) {
               case 'top-left':
                  initcss.top = 0;
                  initcss.left = 0;
                  break;
               case 'top-right':
                  initcss.top = 0;
                  initcss.right = 0;
                  break;
               case 'bottom-left':
                  initcss.bottom = 0;
                  initcss.left = 0;
                  break;
               case 'bottom-right':
                  initcss.bottom = 0;
                  initcss.right = 0;
                  break;
            }

            let size = {
                  width: vid_.style.width.replace(/px/i, ''),
                  height: vid_.style.height.replace(/px/i, ''),
               };
            // let size = (() => {
            //    let cssVid = window.getComputedStyle(vid_, null);
            //    // let cssVid = window.getComputedStyle(document.getElementsByTagName('video')[0], null);
            //    // initStyle = document.getElementsByTagName('video')[0].style.cssText;
            //    return {
            //       width: cssVid.getPropertyValue('width').replace(/px/i, ''),
            //       height: cssVid.getPropertyValue('height').replace(/px/i, ''),
            //    };
            // })();

            let player_ratio = user_settings['pin_player_size_ratio'] || 3;
            // calc size
            size.calc = calculateAspectRatioFit(
               size.width, size.height,
               window.innerWidth / player_ratio, window.innerWidth / player_ratio
            );

            // add calc size
            initcss.width = size.calc.width + 'px' + ' !important;';
            initcss.height = size.calc.height + 'px' + ' !important;';

            // apply css
            // PolymerYoutube.injectStyle(initcss, '.' + scroll_toggle_class, 'important');
            PolymerYoutube.injectStyle(initcss, '.' + scroll_toggle_class);

            // fix video tag
            PolymerYoutube.injectStyle('.' + scroll_toggle_class + ' video {' +
               'width: ' + initcss.width +
               'height: ' + initcss.height +
               // 'width: ' + initcss.width + ' !important;' +
               // 'height: ' + initcss.height + ' !important;' +
               '}');
               
            // fix control-player panel
            PolymerYoutube.injectStyle('.' + scroll_toggle_class + ' .ytp-chrome-bottom {' +
               'width: ' + initcss.width +
               // 'width: ' + initcss.width + ' !important;' +
               'left: 0 !important;' +
               '}');

            function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
               let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
               return {
                  width: Math.round(srcWidth * ratio),
                  height: Math.round(srcHeight * ratio),
               };
            }
         }

      });

   },
   export_opt: (function (data) {
      return {
         'pin_player_size_ratio': {
            _elementType: 'input',
            label: 'Player ratio to screen size',
            type: 'number',
            placeholder: '2-5',
            step: 0.1,
            min: 2,
            max: 5,
            value: 2.5,
            title: 'less - more size',
         },
         'pin_player_size_position': {
            _elementType: 'select',
            label: 'Player position',
            title: 'One of the corners of the screen',
            options: [
               /* beautify preserve:start */
               { label: 'left-top', value: 'top-left' },
               { label: 'left-bottom', value: 'bottom-left' },
               { label: 'right-top', value: 'top-right', selected: true },
               { label: 'right-bottom', value: 'bottom-right' },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
