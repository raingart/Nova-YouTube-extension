
// for test wide
// www.youtube.com/watch?v=B4yuZhKRW1c
// www.youtube.com/watch?v=zEk3A1fA0gc

// anomaly page url:
// www.youtube.com/watch?v=v-YQUCP-J8s
// www.youtube.com/watch?v=ctMEGAcnYjI

_plugins_conteiner.push({
   name: 'Pin player while scrolling',
   id: 'fixed-player-scroll',
   depends_on_pages: 'watch',
   opt_section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         CLASS_VALUE = 'video-pinned',
         PINNED_SELECTOR = '.' + CLASS_VALUE;

      YDOM.HTMLElement.wait('#movie_player')
         .then(videoPlayer => {
            let intervalStyle = setInterval(() => {
               if (videoPlayer.scrollWidth && videoPlayer.scrollHeight) {
                  clearInterval(intervalStyle);
                  createStyle();
               }
            }, 500);

            YDOM.HTMLElement.wait('#player-theater-container')
               .then(el => {
                  isInViewport({
                     'element': el,
                     'callback_hide': () => videoPlayer.classList.contains(CLASS_VALUE) || videoPlayer.classList.add(CLASS_VALUE),
                     'callback_show': () => videoPlayer.classList.remove(CLASS_VALUE),
                     // 'disconnectAfterMatch': true,
                  });

                  function isInViewport({ element = required(), callback_hide, callback_show, disconnectAfterMatch }) {
                     // console.debug('isInViewport', ...arguments);
                     if (!(element instanceof HTMLElement)) return;
                     new IntersectionObserver((entries, observer) => {
                        // if (entries.some(({ isIntersecting }) => isIntersecting)) {
                        if (entries[0].isIntersecting) {
                           if (disconnectAfterMatch) observer.disconnect();
                           if (callback_show && typeof (callback_show) === 'function') return callback_show();
                        }
                        if (callback_hide && typeof (callback_hide) === 'function') return callback_hide();
                     }).observe(element);
                  }
               })

            function createStyle() {
               let initcss = {
                  position: 'fixed',
                  'z-index': 301,
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
               }

               let size = {
                  // width: videoPlayer.clientWidth,
                  // height: videoPlayer.clientHeight,
                  width: videoPlayer.scrollWidth,
                  height: videoPlayer.scrollHeight,
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
                     (window.innerWidth / playerRatio), (window.innerHeight / playerRatio)
                  );
               })();

               // restore original player size. Try to fix a bug with unpin player
               videoPlayer.style.width = Math.max(videoPlayer.clientWidth, videoPlayer.scrollWidth);
               // videoPlayer.style.height = size.height;

               // add calc size
               initcss.width = size.calc.width + 'px';
               initcss.height = size.calc.height + 'px';

               // apply css
               YDOM.HTMLElement.addStyle(initcss, PINNED_SELECTOR, 'important');

               // fix video tag
               YDOM.HTMLElement.addStyle(
                  `${PINNED_SELECTOR} video {
                     width: ${initcss.width};
                     height: ${initcss.height};
                     left: 0 !important;
                  }`);

               // fix control-player panel
               YDOM.HTMLElement.addStyle(
                  `${PINNED_SELECTOR} .ytp-chrome-bottom {
                     width: ${initcss.width};
                     left: 0 !important;
                  }
                  ${PINNED_SELECTOR} .ytp-preview,
                  ${PINNED_SELECTOR} .ytp-scrubber-container,
                  ${PINNED_SELECTOR} .ytp-hover-progress,
                  ${PINNED_SELECTOR} .ytp-gradient-bottom { display:none !important }
                  ${PINNED_SELECTOR} .ytp-chapters-container { display: flex }`);
            }
         });

   },
   opt_export: {
      'pin_player_size_ratio': {
         _tagName: 'input',
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
         _tagName: 'select',
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
