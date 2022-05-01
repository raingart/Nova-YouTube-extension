
// for testing wide-screen video
// https://www.youtube.com/watch?v=B4yuZhKRW1c
// https://www.youtube.com/watch?v=zEk3A1fA0gc

// for testing square-screen
// https://www.youtube.com/watch?v=v-YQUCP-J8s
// https://www.youtube.com/watch?v=yFsmUBLn8O0

// test z-index "Show chat replay" button
// https://www.youtube.com/watch?v=9Mv1sOp0Xg8

window.nova_plugins.push({
   id: 'player-pin-scroll',
   title: 'Pin player while scrolling',
   'title:zh': '滚动时固定播放器',
   'title:ja': 'スクロール中にプレイヤーを固定する',
   'title:ko': '스크롤하는 동안 플레이어 고정',
   'title:es': 'Fijar jugador mientras se desplaza',
   'title:pt': 'Fixar jogador enquanto rola',
   'title:fr': 'Épingler le lecteur pendant le défilement',
   // 'title:tr': 'Kaydırırken oynatıcıyı sabitle',
   'title:de': 'Pin-Player beim Scrollen',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Player stays always visible while scrolling',
   'desc:zh': '滚动时播放器始终可见',
   'desc:ja': 'スクロール中、プレーヤーは常に表示されたままになります',
   'desc:ko': '스크롤하는 동안 플레이어가 항상 표시됨',
   // 'desc:es': 'El jugador permanece siempre visible mientras se desplaza',
   'desc:pt': 'O jogador fica sempre visível enquanto rola',
   // 'desc:fr': 'Le lecteur reste toujours visible pendant le défilement',
   'desc:tr': 'Kaydırma sırasında oyuncu her zaman görünür kalır',
   'desc:de': 'Player bleibt beim Scrollen immer sichtbar',
   _runtime: user_settings => {

      if (user_settings.player_pip_scroll) {

         NOVA.waitElement('#movie_player video')
            .then(video => {
               new window.IntersectionObserver(([entry]) => {
                  if (entry.isIntersecting) {
                     if (document.pictureInPictureElement) {
                        // console.log('enter pip')
                        document.exitPictureInPicture();
                        video.disablePictureInPicture = true;
                     }
                     return
                  }
                  if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
                     // console.log('leave pip')
                     video.disablePictureInPicture = false;
                     video.requestPictureInPicture();
                  }
               }, {
                  root: null,
                  threshold: 0.2, // set offset 0.1 means trigger if atleast 10% of element in viewport
               })
                  .observe(video);
            });
         return;
      }

      const
         CLASS_VALUE = 'player-float',
         PINNED_SELECTOR = '.' + CLASS_VALUE, // for css
         CLOSE_BTN_CLASS_VALUE = CLASS_VALUE + '-unpin-btn',
         CLOSE_BTN_SELECTOR = '.' + CLOSE_BTN_CLASS_VALUE; // for css

      NOVA.waitElement('#movie_player')
         .then(player => {
            // if player fullscreen desable float mode
            document.addEventListener('fullscreenchange', () =>
               (document.fullscreen || movie_player.isFullscreen()) && player.classList.remove(CLASS_VALUE), false);

            // init css
            const waitHeader = setInterval(() => {
               // awaiting positioning of elements to calculate positioning
               if (player.clientWidth && player.clientHeight
                  && document.getElementById('masthead-container')?.offsetHeight) {
                  clearInterval(waitHeader);
                  initStyles();
               }
            }, 500); // 500ms

            NOVA.waitElement('#player-theater-container')
               .then(playerContainer => {
                  document.addEventListener('scroll', () => {
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
                  //       if (user_settings.player_fixed_scroll_pause_video) movie_player.playVideo();
                  //       player.classList.remove(CLASS_VALUE);
                  //    },
                  //    'callback_hide': () => {
                  //       console.debug('run callback_hide');
                  //       if (user_settings.player_fixed_scroll_pause_video) movie_player.pauseVideo()
                  //       player.classList.add(CLASS_VALUE)
                  //    },
                  //    // 'disconnectAfterMatch': true,
                  // });
               })

            // add unpin button
            NOVA.css.push(
               PINNED_SELECTOR + ` {
                  --zIndex: ${(Math.max(
                  NOVA.css.getValue({ selector: '#chat', property: 'z-index' }),
                  NOVA.css.getValue({ selector: '.ytp-chrome-top .ytp-cards-button', property: 'z-index' }),
                  601
               )) + 1};
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
            btnUnpin.addEventListener('click', () => {
               player.classList.remove(CLASS_VALUE);
               drag.reset('clear_storePos');
               window.dispatchEvent(new Event('resize')); // fix: restore player size if unpinned
            });
            player.append(btnUnpin);
         });

      // add drag
      NOVA.waitElement(PINNED_SELECTOR)
         .then(player => {
            drag.init(player);

            // doesn't work both. Try fix preventDefault. Replace to preventDefault patch
            // document.addEventListener('click', evt => {
            //    evt.preventDefault()
            //    console.debug('click', drag.active);
            //    if (drag.active) {
            //       evt.preventDefault()
            //       console.debug('', 111);
            //    };
            // });
            // movie_player.addEventListener('onStateChange', state => {
            //    if (drag.active/* && ['PLAYING', 'PAUSED'].includes(NOVA.getPlayerState())*/) {
            //       console.debug('onStateChange', state);
            //       switch (NOVA.getPlayerState(state)) {
            //          case 'PLAYING': movie_player.pauseVideo(); break;
            //          case 'PAUSED': movie_player.playVideo(); break;
            //       }
            //    }
            // });
         });

      function initStyles() {
         const scrollbarWidth = (window.innerWidth - document.documentElement.clientWidth || 0) + 'px';
         const miniSize = calculateAspectRatioFit({
            'srcWidth': movie_player.clientWidth,
            'srcHeight': movie_player.clientHeight,
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
            // if enable header-unfixed plugin. masthead-container is unfixed
            case 'top-left':
               initcss.top = user_settings['header-unfixed'] ? 0
                  : (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
               initcss.left = 0;
               break;
            case 'top-right':
               initcss.top = user_settings['header-unfixed'] ? 0
                  : (document.getElementById('masthead-container')?.offsetHeight || 0) + 'px';
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

               drag.reset(); // save and clear pos
            }
         } else if (this.inViewport
            && !movie_player.classList.contains('ytp-fullscreen') // fix bug on fullscreen in "header_scroll_after"
         ) {
            // console.debug('switchElement pin');
            switchElement.classList.add(CLASS_VALUE);
            drag?.storePos?.X && drag.setTranslate(drag.storePos); // restore pos
            this.inViewport = false;

            window.dispatchEvent(new Event('resize')); // fix: .ytp-chrome-bottom size if pinned
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

      const drag = {
         // DEBUG: true,

         // xOffset: 0,
         // yOffset: 0,
         // currentX: 0,
         // currentY: 0,
         // dragTarget: HTMLElement,
         // active: false,
         // storePos: { X, Y },
         attrNametoLock: 'force_fix_preventDefault', // preventDefault patch

         reset(clear_storePos) {
            // switchElement.style.transform = ''; // clear drag state
            this.dragTarget?.style.removeProperty('transform');// clear drag state
            if (clear_storePos) this.storePos = this.xOffset = this.yOffset = 0;
            else this.storePos = { 'X': this.xOffset, 'Y': this.yOffset }; // save pos
         },

         init(el_target = required(), callbackExport) { // init
            this.log('drag init', ...arguments);
            if (!(el_target instanceof HTMLElement)) return console.error('el_target not HTMLElement:', el_target);

            this.dragTarget = el_target;

            // touchs
            // document.addEventListener('touchstart', this.dragStart.bind(this), false);
            // document.addEventListener('touchend', this.dragEnd.bind(this), false);
            // document.addEventListener('touchmove', this.draging.bind(this), false);
            // mouse
            // document.addEventListener('mousedown', this.dragStart.bind(this), false);
            // document.addEventListener('mouseup', this.dragEnd.bind(this), false);
            // document.addEventListener('mousemove', this.draging.bind(this), false);
            document.addEventListener('mousedown', evt => {
               if (!el_target.classList.contains(CLASS_VALUE)) return;
               this.dragStart.apply(this, [evt]);
            }, false);
            document.addEventListener('mouseup', evt => {
               if (this.active) this.dragTarget.removeAttribute(this.attrNametoLock); // fix broken preventDefault
               this.dragEnd.apply(this, [evt]);
            }, false);
            document.addEventListener('mousemove', evt => {
               if (this.active && !this.dragTarget.hasAttribute(this.attrNametoLock)) {
                  this.dragTarget.setAttribute(this.attrNametoLock, true); // fix broken preventDefault
               }
               this.draging.apply(this, [evt]);
            }, false);

            // fix broken preventDefault / preventDefault patch
            NOVA.css.push(
               `[${this.attrNametoLock}]:active {
                  pointer-events: none;
                  cursor: grab; /* <-- doesn't work */
                  outline: 2px dashed #3ea6ff !important;
               }`);
         },

         dragStart(evt) {
            if (!this.dragTarget.contains(evt.target)) return;
            this.log('dragStart');

            switch (evt.type) {
               case 'touchstart':
                  this.initialX = evt.touches[0].clientX - (this.xOffset || 0);
                  this.initialY = evt.touches[0].clientY - (this.yOffset || 0);
                  break;
               case 'mousedown':
                  this.initialX = evt.clientX - (this.xOffset || 0);
                  this.initialY = evt.clientY - (this.yOffset || 0);
                  break;
            }
            this.active = true;
         },

         dragEnd(evt) {
            if (!this.active) return;
            this.log('dragEnd');

            this.initialX = this.currentX;
            this.initialY = this.currentY;
            this.active = false;
         },

         draging(evt) {
            if (!this.active) return;
            evt.preventDefault(); // doesn't work. Replace to preventDefault patch
            evt.stopImmediatePropagation(); // doesn't work. Replace to preventDefault patch

            this.log('draging');

            switch (evt.type) {
               case 'touchmove':
                  this.currentX = evt.touches[0].clientX - this.initialX;
                  this.currentY = evt.touches[0].clientY - this.initialY;
                  break;
               case 'mousemove':
                  this.currentX = evt.clientX - this.initialX;
                  this.currentY = evt.clientY - this.initialY;
                  break;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate({ 'X': this.currentX, 'Y': this.currentY });
         },

         setTranslate({ X = required(), Y = required() }) {
            this.log('setTranslate', ...arguments);
            this.dragTarget.style.transform = `translate3d(${X}px, ${Y}px, 0)`;
         },

         log() {
            if (this.DEBUG && arguments.length) {
               console.groupCollapsed(...arguments);
               console.trace();
               console.groupEnd();
            }
         },
      };

   },
   options: {
      player_float_scroll_size_ratio: {
         _tagName: 'input',
         label: 'Player size',
         'label:zh': '播放器尺寸',
         'label:ja': 'プレーヤーのサイズ',
         'label:ko': '플레이어 크기',
         'label:es': 'Tamaño del jugador',
         'label:pt': 'Tamanho do jogador',
         'label:fr': 'Taille du joueur',
         // 'label:tr': 'Oyuncu boyutu',
         'label:de': 'Spielergröße',
         type: 'number',
         title: 'less value - larger size',
         'title:zh': '较小的值 - 较大的尺寸',
         'title:ja': '小さい値-大きいサイズ',
         'title:ko': '더 작은 값 - 더 큰 크기',
         'title:es': 'Valor más pequeño - tamaño más grande',
         'title:pt': 'Valor menor - tamanho maior',
         'title:fr': 'Plus petite valeur - plus grande taille',
         // 'title:tr': 'Daha az değer - daha büyük boyut',
         'title:de': 'Kleiner Wert - größere Größe',
         placeholder: '2-5',
         step: 0.1,
         min: 2,
         max: 5,
         value: 2.5,
      },
      player_float_scroll_position: {
         _tagName: 'select',
         label: 'Player fixing position',
         'label:zh': '玩家固定位置',
         'label:ja': 'プレーヤーの固定位置',
         'label:ko': '선수 고정 위치',
         'label:es': 'Posición de fijación del jugador',
         'label:pt': 'Posição de fixação do jogador',
         'label:fr': 'Position de fixation du joueur',
         // 'label:tr': 'Oyuncu sabitleme pozisyonu',
         'label:de': 'Spielerfixierungsposition',
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
      player_pip_scroll: {
         _tagName: 'input',
         label: 'Picture-in-Picture mode',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         'title:zh': 'Caution! Experimental function',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:tr': '',
         // 'title:de': '',
      },
   }
});
