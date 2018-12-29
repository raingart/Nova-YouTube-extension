_plugins.push({
   name: 'Pin player while scrolling',
   id: 'fixed-player-scroll',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitFor('.html5-video-container video[style]', vid_ => {
         let in_viewport;
         let scroll_toggle_class = "pin_video";

         initStyle();

         window.addEventListener('scroll', function () {
            onScreenToggle(
               document.getElementById('ytd-player'),
               // document.getElementById('movie_player'),
               // playerId,
               document.getElementById("player-theater-container")
            );
         });

         function onScreenToggle(scroll_target, viewer) {
            // console.log('playerId in_viewport %s', in_viewport);
            if (YDOM.isInViewport(viewer || scroll_target)) {
               if (!in_viewport) {
                  // console.log('scroll_target isInViewport');
                  scroll_target.classList.remove(scroll_toggle_class);
                  in_viewport = true;

                  if (user_settings.pin_player_size_position == 'float')
                     YDOM.dragnDrop.disconnect(scroll_target);
               }
            } else if (in_viewport) {
               // console.log('scroll_target isInViewport');
               scroll_target.classList.add(scroll_toggle_class);
               in_viewport = false;

               if (user_settings.pin_player_size_position == 'float')
                  YDOM.dragnDrop.connect(scroll_target, position => {
                     localStorage.setItem('player-pin-position-top', position.top);
                     localStorage.setItem('player-pin-position-left', position.left);
                  });
            }
         }

         function initStyle() {
            let initcss = {
               position: 'fixed',
               'z-index': 9999,
               'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, 0.14),' +
                  '0 6px 30px 5px rgba(0, 0, 0, 0.12),' +
                  '0 8px 10px -5px rgba(0, 0, 0, 0.4)',
            };

            // set pin_player_size_position
            switch (user_settings.pin_player_size_position) {
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
               case 'float':
                  initcss.top = localStorage.getItem('player-pin-position-top');
                  initcss.left = localStorage.getItem('player-pin-position-left');
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

            let player_ratio = user_settings.pin_player_size_ratio || 3;
            // calc size
            size.calc = calculateAspectRatioFit(
               size.width, size.height,
               window.innerWidth / player_ratio, window.innerWidth / player_ratio
            );

            // add calc size
            initcss.width = size.calc.width + 'px' + ' !important;';
            initcss.height = size.calc.height + 'px' + ' !important;';

            // apply css
            // YDOM.injectStyle(initcss, '.' + scroll_toggle_class, 'important');
            YDOM.injectStyle(initcss, '.' + scroll_toggle_class);

            // fix video tag
            YDOM.injectStyle('.' + scroll_toggle_class + ' video {' +
               'width: ' + initcss.width +
               'height: ' + initcss.height +
               // 'width: ' + initcss.width + ' !important;' +
               // 'height: ' + initcss.height + ' !important;' +
               '}');

            // fix control-player panel
            YDOM.injectStyle('.' + scroll_toggle_class + ' .ytp-chrome-bottom {' +
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
   export_opt: (function () {
      return {
         'pin_player_size_ratio': {
            _elementType: 'input',
            label: 'Player ratio to screen size',
            title: 'less - more player size',
            type: 'number',
            placeholder: '2-5',
            step: 0.1,
            min: 2,
            max: 5,
            value: 2.5,
         },
         'pin_player_size_position': {
            _elementType: 'select',
            label: 'Fixed player position',
            options: [
               /* beautify preserve:start */
               { label: 'left-top', value: 'top-left' },
               { label: 'left-bottom', value: 'bottom-left' },
               { label: 'right-top', value: 'top-right' },
               { label: 'right-bottom', value: 'bottom-right' },
               { label: 'drag&Drop', value: 'float', selected: true },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
