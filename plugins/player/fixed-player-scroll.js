_plugins.push({
   name: 'Pin player while scrolling',
   id: 'fixed-player-scroll',
   section: 'player',
   depends_page: 'watch',
   // sandbox: true,
   desc: 'Fixed player position',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         let in_viewport;
         let scroll_toggle_class = "pin_video";

         initStyle();

         // PolymerYoutube.connect_DragnDrop(playerId, (position) => {
         //    localStorage.setItem('player-position-top', position.top);
         //    localStorage.setItem('player-position-left', position.left);
         // });

         window.addEventListener('scroll', function () {
            pinned_elm(
               playerId,
               // document.getElementsByTagName('video')[0],
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
               top: 'auto',
               left: 'auto',
               right: 'auto',
               bottom: 'auto',
               // top: 0,
               // right: 0,
               // width: '50%',
               // height: 'auto',
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
                  // default:
            }

            let size = (() => {
               let cssVid = window.getComputedStyle(document.getElementsByTagName('video')[0], null);
               // initStyle = document.getElementsByTagName('video')[0].style.cssText;
               return {
                  width: cssVid.getPropertyValue('width').replace(/px/i, ''),
                  height: cssVid.getPropertyValue('height').replace(/px/i, ''),
               };
            })();

            let player_ratio = user_settings['pin_player_size_ratio'] || 3;

            // calc size
            size.calc = calculateAspectRatioFit(
               size.width, size.height,
               window.innerWidth / player_ratio, window.innerWidth / player_ratio
            );

            // add calc size
            initcss.width = size.calc.width + 'px';
            initcss.height = size.calc.height + 'px';

            // apply css
            Plugins.injectStyle(initcss, '.' + scroll_toggle_class, 'important');
            // Plugins.injectStyle(initcss, '.' + scroll_toggle_class);

            // fix video tag
            Plugins.injectStyle('.' + scroll_toggle_class + ' video {' +
               'width: ' + initcss.width + ' !important;' +
               'height: ' + initcss.height + ' !important' +
               '}');
            // fix player panel
            Plugins.injectStyle('.' + scroll_toggle_class + ' .ytp-chrome-bottom {' +
               'width: ' + initcss.width + ' !important;' +
               'left: 0 !important;' +
               '}');

            function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
               let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
               return {
                  width: srcWidth * ratio,
                  height: srcHeight * ratio,
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
            value: 3,
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
