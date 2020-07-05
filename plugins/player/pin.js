
// for test wide
// www.youtube.com/watch?v=B4yuZhKRW1c
// www.youtube.com/watch?v=zEk3A1fA0gc

// anomaly page url:
// www.youtube.com/watch?v=v-YQUCP-J8s
// www.youtube.com/watch?v=ctMEGAcnYjI

_plugins.push({
   name: 'Pin player while scrolling',
   id: 'fixed-player-scroll',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: '#movie_player',
         callback: videoElement => {
            const STORE_PREFIX = 'player-pin-position-';
            const PINNED_CLASS_NAME = "video-pinned";
            let initedStyle;
            // window.pageYOffset || document.documentElement.scrollTop

            window.addEventListener('scroll', () => {
               if (!initedStyle && (videoElement.scrollWidth && videoElement.scrollHeight)) {
                  initedStyle = true;
                  initStyle();

               } else if (initedStyle) {
                  onScreenToggle({
                     'switchElement': videoElement,
                     'watchElement': document.getElementById("player-theater-container"),
                  });
               }
            });

            function onScreenToggle({switchElement, watchElement}) {
               // console.log('onScreenToggle:', ...arguments);

               // no pinned
               if (YDOM.isInViewport(watchElement || switchElement)) {
                  if (!this.inViewport) {
                     // console.log('switchElement isInViewport');
                     switchElement.classList.remove(PINNED_CLASS_NAME);
                     this.inViewport = true;

                     if (user_settings.pin_player_size_position == 'float') {
                        YDOM.dragnDrop.disconnect(switchElement);
                     }
                  }
                  // pinned
               } else if (this.inViewport) {
                  // console.log('switchElement isInViewport');
                  switchElement.classList.add(PINNED_CLASS_NAME);
                  this.inViewport = false;

                  if (user_settings.pin_player_size_position == 'float') {
                     YDOM.dragnDrop.connect(switchElement, position => {
                        localStorage.setItem(STORE_PREFIX + 'top', position.top);
                        localStorage.setItem(STORE_PREFIX + 'left', position.left);
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
                     initcss.top = document.getElementById('masthead-container')?.offsetHeight || 0;
                     initcss.left = 0;
                     break;
                  case 'top-right':
                     initcss.top = document.getElementById('masthead-container')?.offsetHeight || 0;
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
                     initcss.top = localStorage.getItem(STORE_PREFIX + 'top');
                     initcss.left = localStorage.getItem(STORE_PREFIX + 'left');
                     break;
               }

               let size = {
                  // width: videoElement.clientWidth,
                  // height: videoElement.clientHeight,
                  width: videoElement.scrollWidth,
                  height: videoElement.scrollHeight,
               };

               size.calc = (function () {
                  const playerRatio = user_settings.pin_player_size_ratio;
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

               // restore original player size. Try to fix a bug with unpin player
               videoElement.style.width = Math.max(videoElement.clientWidth, videoElement.scrollWidth);
               // videoElement.style.height = size.height;

               // add calc size
               initcss.width = size.calc.width + 'px !important;';
               initcss.height = size.calc.height + 'px !important;';

               const PINNED_SELECTOR = '.' + PINNED_CLASS_NAME;

               // apply css
               YDOM.injectStyle(initcss, PINNED_SELECTOR, 'important');

               // fix video tag
               YDOM.injectStyle(`${PINNED_SELECTOR} video {
                  width: ${initcss.width};
                  height: ${initcss.height};
                  left: 0 !important;
               }`);

               // fix control-player panel
               YDOM.injectStyle(`${PINNED_SELECTOR} .ytp-chrome-bottom {
                  width: ${initcss.width};
                  left: 0 !important;
                  /*margin-left: -12px !important;*/
               }
               ${PINNED_SELECTOR} .ytp-preview,
               ${PINNED_SELECTOR} .ytp-scrubber-container,
               ${PINNED_SELECTOR} .ytp-hover-progress,
               {display:none !important;}`
               );
            }
         },
      });

   },
   export_opt: {
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
   },
});
