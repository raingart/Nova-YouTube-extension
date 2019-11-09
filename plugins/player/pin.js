_plugins.push({
   name: 'Pin player while scrolling',
   id: 'fixed-player-scroll',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      const _this = this; // link to export_opt.pin_player_size_ratio

      YDOM.waitHTMLElement('.html5-video-container video[style]', videoElement => {
         const PINNED_CLASS_NAME = "video-pinned";
         const playerId = document.querySelector('.html5-video-player');
         let initedStyle;
         let inViewport;
         // window.pageYOffset || document.documentElement.scrollTop

         window.addEventListener('scroll', () => {
            if (!initedStyle && (videoElement.scrollWidth && videoElement.scrollHeight)) {
               initedStyle = true;
               initStyle();

            } else if (initedStyle) {
               onScreenToggle(
                  document.getElementById('ytd-player'),
                  // document.getElementById('movie_player'),
                  // playerId,
                  document.getElementById("player-theater-container")
               );
            }
         });

         function onScreenToggle(changedElement, listeningElement) {
            // console.log('playerId inViewport %s', inViewport);
            // no pinned
            if (YDOM.isInViewport(listeningElement || changedElement)) {
               if (!inViewport) {
                  // console.log('changedElement isInViewport');
                  changedElement.classList.remove(PINNED_CLASS_NAME);
                  inViewport = true;

                  if (user_settings.pin_player_size_position == 'float') YDOM.dragnDrop.disconnect(changedElement);

                  if (user_settings.pin_player_pause_pinned_video) playerId.playVideo();
               }
               // pinned
            } else if (inViewport) {
               // console.log('changedElement isInViewport');
               changedElement.classList.add(PINNED_CLASS_NAME);
               inViewport = false;

               if (user_settings.pin_player_size_position == 'float') {
                  YDOM.dragnDrop.connect(changedElement, position => {
                     localStorage.setItem('player-pin-position-top', position.top);
                     localStorage.setItem('player-pin-position-left', position.left);
                  });
               }
               if (user_settings.pin_player_pause_pinned_video) playerId.pauseVideo();
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
               // width: videoElement.clientWidth,
               // height: videoElement.clientHeight,
               width: videoElement.scrollWidth,
               height: videoElement.scrollHeight,
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

            // restore original player size. Attempt to fix a bug with unpin player
            playerId.style.width = size.width;
            // playerId.style.height = size.height;

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
         'pin_player_pause_pinned_video': {
            _elementType: 'input',
            label: 'Pause pinned video',
            type: 'checkbox',
            // checked: false,
         },
      };
   }()),
});
