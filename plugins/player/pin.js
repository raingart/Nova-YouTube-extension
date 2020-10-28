
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
            const
               CLASS_VALUE = 'video-pinned',
               PINNED_SELECTOR = '.' + CLASS_VALUE,
               SAVE_PREFIX = 'player-pin-position-';

            let initedStyle;
            // window.pageYOffset || document.documentElement.scrollTop

            window.addEventListener('scroll', () => {
               if (!initedStyle && (videoElement.scrollWidth && videoElement.scrollHeight)) {
                  initedStyle = true;
                  createStyle();

               } else if (initedStyle) {
                  onScreenToggle({
                     'switchElement': videoElement,
                     'watchElement': document.getElementById("player-theater-container"),
                  });
               }
            });

            function onScreenToggle({ switchElement, watchElement }) {
               // console.debug('onScreenToggle:', ...arguments);

               // no pinned
               if (isInViewport(watchElement || switchElement)) {
                  if (!this.inViewport) {
                     // console.debug('switchElement isInViewport');
                     switchElement.classList.remove(CLASS_VALUE);
                     this.inViewport = true;

                     if (user_settings.pin_player_size_position == 'float') {
                        YDOM.dragnDrop.disconnect(switchElement);
                     }
                  }
                  // pinned
               } else if (this.inViewport) {
                  // console.debug('switchElement isInViewport');
                  switchElement.classList.add(CLASS_VALUE);
                  this.inViewport = false;

                  if (user_settings.pin_player_size_position == 'float') {
                     YDOM.dragnDrop.connect(switchElement, position => {
                        localStorage.setItem(SAVE_PREFIX + 'top', position.top);
                        localStorage.setItem(SAVE_PREFIX + 'left', position.left);
                     });
                  }
               }

               function isInViewport(el = required()) {
                  if (el instanceof HTMLElement) {
                     const bounding = el.getBoundingClientRect();
                     return (
                        bounding.top >= 0 &&
                        bounding.left >= 0 &&
                        bounding.bottom <= window.innerHeight &&
                        bounding.right <= window.innerWidth
                     );
                  }
               }
            }

            function createStyle() {
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
                     initcss.top = localStorage.getItem(SAVE_PREFIX + 'top');
                     initcss.left = localStorage.getItem(SAVE_PREFIX + 'left');
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
               }
               ${PINNED_SELECTOR} .ytp-preview,
               ${PINNED_SELECTOR} .ytp-scrubber-container,
               ${PINNED_SELECTOR} .ytp-hover-progress
               {display:none !important;}
               ${PINNED_SELECTOR} .ytp-chapters-container {display: flex;}
               `);
            }
         },
      });

   },
   opt_export: {
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
         ]
      },
   },
});
