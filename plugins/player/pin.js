
// for testing wide-screen video
// www.youtube.com/watch?v=B4yuZhKRW1c
// www.youtube.com/watch?v=zEk3A1fA0gc

// for testing square-screen
// www.youtube.com/watch?v=v-YQUCP-J8s
// www.youtube.com/watch?v=ctMEGAcnYjI

_plugins_conteiner.push({
   id: 'player-fixed-scroll',
   title: 'Pin player while scrolling',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         CLASS_VALUE = 'player-fixed',
         PINNED_SELECTOR = '.' + CLASS_VALUE;

      YDOM.waitElement('.html5-video-player')
         .then(player => {
            // init css
            let interval_initStyle = setInterval(() => {
               if (player.clientWidth && player.clientHeight
                  && document.getElementById('masthead-container')?.offsetHeight) {
                  clearInterval(interval_initStyle);
                  createStyle(player);
               }
            }, 500); // 500ms

            YDOM.waitElement('#player-theater-container')
               .then(playerContainer => {
                  window.addEventListener('scroll', () => {
                     onScreenToggle({
                        'switchElement': document.getElementById('movie_player'),
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
         });

      function createStyle(player = required()) {
         const scrollbarWidth = (window.innerWidth - document.documentElement.clientWidth || 0) + 'px';
         const miniSize = calculateAspectRatioFit({
            'srcWidth': player.clientWidth,
            'srcHeight': player.clientHeight,
            'maxWidth': (window.innerWidth / user_settings.player_fixed_scroll_size_ratio),
            'maxHeight': (window.innerHeight / user_settings.player_fixed_scroll_size_ratio)
         });

         let initcss = {
            width: miniSize.width + 'px',
            height: miniSize.height + 'px',
            position: 'fixed',
            'z-index': 301,
            'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, 0.14),' +
               '0 6px 30px 5px rgba(0, 0, 0, 0.12),' +
               '0 8px 10px -5px rgba(0, 0, 0, 0.4)',
         };

         // set player_fixed_scroll_size_position
         switch (user_settings.player_fixed_scroll_size_position) {
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
         YDOM.css.push(initcss, PINNED_SELECTOR, 'important');

         // var fix
         YDOM.css.push(
            PINNED_SELECTOR + `{
               --height: ${initcss.height} !important;
               --width: ${initcss.width} !important;
            }`);
         // fix control-player panel
         YDOM.css.push(`
            ${PINNED_SELECTOR} .ytp-preview,
            ${PINNED_SELECTOR} .ytp-scrubber-container,
            ${PINNED_SELECTOR} .ytp-hover-progress,
            ${PINNED_SELECTOR} .ytp-gradient-bottom { display:none !important; }
            ${PINNED_SELECTOR} .ytp-chrome-bottom { width: var(--width) !important; }
            ${PINNED_SELECTOR} .ytp-chapters-container { display: flex; }`);

         // fix video size
         YDOM.css.push(
            `${PINNED_SELECTOR} video {
                  width: var(--width) !important;
                  height: var(--height) !important;
               }`);

         function calculateAspectRatioFit({ srcWidth = 0, srcHeight = 0, maxWidth = 0, maxHeight = 0 }) {
            const ratio = Math.min(+maxWidth / +srcWidth, +maxHeight / +srcHeight);
            return {
               width: Math.round(+srcWidth * ratio),
               height: Math.round(+srcHeight * ratio),
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
      player_fixed_scroll_size_ratio: {
         _tagName: 'input',
         label: 'Player ratio to screen size',
         type: 'number',
         title: 'less - more player size',
         placeholder: '2-5',
         step: 0.1,
         min: 2,
         max: 5,
         value: 2.5,
      },
      player_fixed_scroll_size_position: {
         _tagName: 'select',
         label: 'Fixed player position',
         options: [
            { label: 'left-top', value: 'top-left' },
            { label: 'left-bottom', value: 'bottom-left' },
            { label: 'right-top', value: 'top-right', selected: true },
            { label: 'right-bottom', value: 'bottom-right' },
         ],
      },
      // 'player_fixed_scroll_pause_video': {
      //    _tagName: 'input',
      //    label: 'Pause pinned video',
      //    type: 'checkbox',
      // },
   },
});
