
// for testing wide-screen video
// www.youtube.com/watch?v=B4yuZhKRW1c
// www.youtube.com/watch?v=zEk3A1fA0gc

// for testing square-screen
// www.youtube.com/watch?v=v-YQUCP-J8s
// www.youtube.com/watch?v=ctMEGAcnYjI
// www.youtube.com/watch?v=yFsmUBLn8O0

// test z-index "Show chat replay" button
// https://www.youtube.com/watch?v=9Mv1sOp0Xg8

window.nova_plugins.push({
   id: 'player-pin-scroll',
   title: 'Pin player while scrolling',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Player stays always visible while scrolling',
   _runtime: user_settings => {

      const
         CLASS_VALUE = 'player-float',
         PINNED_SELECTOR = '.' + CLASS_VALUE, // for css
         CLOSE_BTN_CLASS_VALUE = CLASS_VALUE + '-unpin-btn',
         CLOSE_BTN_SELECTOR = '.' + CLOSE_BTN_CLASS_VALUE; // for css

      NOVA.waitElement('#movie_player')
         .then(player => {
            // init css
            const waitHeader = setInterval(() => {
               // awaiting positioning of elements to calculate positioning
               if (player.clientWidth && player.clientHeight
                  && document.getElementById('masthead-container')?.offsetHeight) {
                  clearInterval(waitHeader);
                  initStyles(player);
               }
            }, 500); // 500ms

            NOVA.waitElement('#player-theater-container')
               .then(playerContainer => {
                  window.addEventListener('scroll', () => {
                     onScreenToggle({
                        'switchElement': player,
                        'watchingElement': playerContainer,
                     });
                  });

                  // Bug: Does not accept status change on initialization
                  // isInViewport({
                  //    'element': playerContainer,
                  //    'callback_show': () => {
                  //       console.debug('run callback_show');
                  //       if (user_settings.player_fixed_scroll_pause_video) player.playVideo();
                  //       player.classList.remove(CLASS_VALUE);
                  //    },
                  //    'callback_hide': () => {
                  //       console.debug('run callback_hide');
                  //       if (user_settings.player_fixed_scroll_pause_video) player.pauseVideo()
                  //       player.classList.add(CLASS_VALUE)
                  //    },
                  //    // 'disconnectAfterMatch': true,
                  // });
               })

            // add unpin button
            NOVA.css.push(
               PINNED_SELECTOR +` {
                  --zIndex: ${(Math.max(
                     NOVA.css.getValue({ selector: 'ytd-live-chat-frame', property: 'z-index' }),
                     NOVA.css.getValue({ selector: '.ytp-chrome-top .ytp-cards-button', property: 'z-index' })
                  ) || 601) + 1};
               }

               ${CLOSE_BTN_SELECTOR} { display: none; }

               ${PINNED_SELECTOR} ${CLOSE_BTN_SELECTOR} {
                  display: initial !important;
                  position: absolute;
                  cursor: pointer;
                  top: 10px;
                  left: 10px;
                  width: 28px;
                  height: 28px;
                  color: white;
                  border: none;
                  outline: none;
                  opacity: .1;
                  /* border-radius: 100%; */
                  z-index: var(--zIndex);
                  font-size: 24px;
                  font-weight: bold;
                  background-color: rgba(0, 0, 0, 0.8);
                  /* text-transform: uppercase; */
               }

               ${PINNED_SELECTOR}:hover ${CLOSE_BTN_SELECTOR} { opacity: .7; }
               ${CLOSE_BTN_SELECTOR}:hover { opacity: 1 !important; }`);

            const btnUnpin = document.createElement('button');
            btnUnpin.className = CLOSE_BTN_CLASS_VALUE;
            btnUnpin.title = 'Unpin player';
            btnUnpin.textContent = '×'; // ✖
            btnUnpin.addEventListener('click', () => player.classList.remove(CLASS_VALUE));
            player.append(btnUnpin);
         });

      function initStyles(player = required()) {
         const scrollbarWidth = (window.innerWidth - document.documentElement.clientWidth || 0) + 'px';
         const miniSize = calculateAspectRatioFit({
            'srcWidth': player.clientWidth,
            'srcHeight': player.clientHeight,
            'maxWidth': (window.innerWidth / user_settings.player_float_scroll_size_ratio),
            'maxHeight': (window.innerHeight / user_settings.player_float_scroll_size_ratio)
         });

         let initcss = {
            width: miniSize.width + 'px',
            height: miniSize.height + 'px',
            position: 'fixed',
            'z-index': 'var(--zIndex)',
            'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, 0.14),' +
               '0 6px 30px 5px rgba(0, 0, 0, 0.12),' +
               '0 8px 10px -5px rgba(0, 0, 0, 0.4)',
         };

         // set pin player position
         switch (user_settings.player_float_scroll_position) {
            case 'top-left':
               initcss.top = (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
               initcss.left = 0;
               break;
            case 'top-right':
               initcss.top = (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
               initcss.right = scrollbarWidth;
               break;
            case 'bottom-left':
               initcss.bottom = 0;
               initcss.left = 0;
               break;
            case 'bottom-right':
               initcss.bottom = 0;
               initcss.right = scrollbarWidth;
               break;
         }

         // apply css
         NOVA.css.push(initcss, PINNED_SELECTOR, 'important');

         // variable declaration for fix
         NOVA.css.push(
            PINNED_SELECTOR + `{
               --height: ${initcss.height} !important;
               --width: ${initcss.width} !important;
            }`);
         // fix control-player panel
         NOVA.css.push(`
            ${PINNED_SELECTOR} .ytp-preview,
            ${PINNED_SELECTOR} .ytp-scrubber-container,
            ${PINNED_SELECTOR} .ytp-hover-progress,
            ${PINNED_SELECTOR} .ytp-gradient-bottom { display:none !important; }
            ${PINNED_SELECTOR} .ytp-chrome-bottom { width: var(--width) !important; }
            ${PINNED_SELECTOR} .ytp-chapters-container { display: flex; }`);

         // fix video size in pinned
         NOVA.css.push(
            `${PINNED_SELECTOR} video {
                  width: var(--width) !important;
                  height: var(--height) !important;
                  left: 0 !important;
                  top: 0 !important;
               }

               .ended-mode video {
                  visibility: hidden;
               }`);

         function calculateAspectRatioFit({ srcWidth = 0, srcHeight = 0, maxWidth = 0, maxHeight = 0 }) {
            const aspectRatio = Math.min(+maxWidth / +srcWidth, +maxHeight / +srcHeight);
            return {
               width: Math.round(+srcWidth * aspectRatio),
               height: Math.round(+srcHeight * aspectRatio),
            };
         };
      }

      function onScreenToggle({ switchElement, watchingElement }) {
         // console.debug('onScreenToggle:', ...arguments);
         if (isInViewport(watchingElement || switchElement)) {
            if (!this.inViewport) {
               // console.debug('switchElement unpin');
               switchElement.classList.remove(CLASS_VALUE);
               this.inViewport = true;
               window.dispatchEvent(new Event('resize')); // fix: restore player size if unpinned
            }
         } else if (this.inViewport) {
            // console.debug('switchElement pin');
            switchElement.classList.add(CLASS_VALUE);
            this.inViewport = false;
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

      // function isInViewport({ element = required(), callback_show, callback_hide, disconnectAfterMatch }) {
      //    // console.debug('isInViewport', ...arguments);
      //    if (!(element instanceof HTMLElement)) return;
      //    new IntersectionObserver((entries, observer) => {
      //       console.debug('IntersectionObserver');
      //       // if (entries.some(({ isIntersecting }) => isIntersecting)) {
      //       if (entries[0].isIntersecting) {
      //          if (disconnectAfterMatch) observer.disconnect();
      //          if (callback_show && typeof callback_show === 'function') callback_show();

      //       } else if (callback_hide && typeof callback_hide === 'function') callback_hide();
      //       if (entries[0].isIntersecting) console.debug('isIntersecting ok');
      //       else console.debug('isIntersecting false');
      //    }).observe(element);
      // }

   },
   options: {
      player_float_scroll_size_ratio: {
         _tagName: 'input',
         label: 'Player size aspect ratio',
         type: 'number',
         title: 'less - more size',
         placeholder: '2-5',
         step: 0.1,
         min: 2,
         max: 5,
         value: 2.5,
      },
      player_float_scroll_position: {
         _tagName: 'select',
         label: 'Fixed player position',
         options: [
            { label: 'left-top', value: 'top-left' },
            { label: 'left-bottom', value: 'bottom-left' },
            { label: 'right-top', value: 'top-right', selected: true },
            { label: 'right-bottom', value: 'bottom-right' },
         ],
      },
      // 'player_float_scroll_pause_video': {
      //    _tagName: 'input',
      //    label: 'Pause pinned video',
      //    type: 'checkbox',
      // },
   },
});
