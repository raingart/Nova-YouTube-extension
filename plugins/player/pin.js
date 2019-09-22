_plugins.push({
   name: 'Pin player while scrolling',
   id: 'fixed-player-scroll',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      const _this = this; // link to export_opt.pin_player_size_ratio

      YDOM.waitFor('.html5-video-container video', videoEl => {
         const PINNED_CLASS_NAME = "video-pinned";
         let inViewport;

         initStyle();

         window.addEventListener('scroll', function () {
            onScreenToggle(
               document.getElementById('ytd-player'),
               // document.getElementById('movie_player'),
               // playerId,
               document.getElementById("player-theater-container")
            );
         });

         function onScreenToggle(targetEl, viewer) {
            // console.log('playerId inViewport %s', inViewport);
            if (YDOM.isInViewport(viewer || targetEl)) {
               if (!inViewport) {
                  // console.log('targetEl isInViewport');
                  targetEl.classList.remove(PINNED_CLASS_NAME);
                  inViewport = true;

                  if (user_settings.pin_player_size_position == 'float') YDOM.dragnDrop.disconnect(targetEl);
               }
            } else if (inViewport) {
               // console.log('targetEl isInViewport');
               targetEl.classList.add(PINNED_CLASS_NAME);
               inViewport = false;

               if (user_settings.pin_player_size_position == 'float') {
                  YDOM.dragnDrop.connect(targetEl, position => {
                     localStorage.setItem('player-pin-position-top', position.top);
                     localStorage.setItem('player-pin-position-left', position.left);
                  });
               }
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
               // width: videoEl.clientWidth,
               // height: videoEl.clientHeight,
               width: videoEl.scrollWidth,
               height: videoEl.scrollHeight,
            };

            size.calc = (() => {
               const playerRatio = user_settings.pin_player_size_ratio || _this.export_opt['pin_player_size_ratio'];
               const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
                  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
                  return {
                     width: Math.round(srcWidth * ratio),
                     height: Math.round(srcHeight * ratio),
                  };
               };
               return calculateAspectRatioFit(
                  size.width, size.height,
                  (window.innerWidth / playerRatio), (window.innerWidth / playerRatio)
               );
            })();

            // add calc size
            initcss.width = size.calc.width + 'px !important;';
            initcss.height = size.calc.height + 'px !important;';

            const PINNED_SELECTOR = '.' + PINNED_CLASS_NAME;

            // apply css
            YDOM.injectStyle(initcss, PINNED_SELECTOR, 'important');

            // fix video tag
            YDOM.injectStyle(`${PINNED_SELECTOR} video {
                  width:${initcss.width} !important;
                  height:${initcss.height} !important;
                  left: 0 !important;
               }`);

            // fix control-player panel
            YDOM.injectStyle(`${PINNED_SELECTOR} .ytp-chrome-bottom {
                  width: ${initcss.width} !important;
                  left: 0 !important;
                  /*margin-left: -12px !important;*/
               }
               ${PINNED_SELECTOR} .ytp-preview,
               ${PINNED_SELECTOR} .ytp-scrubber-container,
               ${PINNED_SELECTOR} .ytp-hover-progress,
               {display:none !important;}`
            );
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
               { label: 'left-top', value: 'top-left' },
               { label: 'left-bottom', value: 'bottom-left' },
               { label: 'right-top', value: 'top-right', selected: true },
               { label: 'right-bottom', value: 'bottom-right' },
               { label: 'drag&Drop', value: 'float' },
            ]
         },
      };
   }()),
});
