// for test:
// https://www.youtube.com/watch?v=d94PwdKQ3Ag
// https://www.youtube.com/watch?v=twFNTZ6Y_OI - wide
// https://www.youtube.com/watch?v=nX2anEXG0eE - square

window.nova_plugins.push({
   id: 'player-pin-scroll',
   title: 'Pin player while scrolling',
   'title:zh': '滚动时固定播放器',
   'title:ja': 'スクロール中にプレイヤーを固定する',
   'title:ko': '스크롤하는 동안 플레이어 고정',
   'title:id': 'Sematkan pemutar saat menggulir',
   'title:es': 'Fijar jugador mientras se desplaza',
   'title:pt': 'Fixar jogador enquanto rola',
   'title:fr': 'Épingler le lecteur pendant le défilement',
   'title:it': 'Blocca il lettore durante lo scorrimento',
   // 'title:tr': 'Kaydırırken oynatıcıyı sabitle',
   'title:de': 'Pin-Player beim Scrollen',
   'title:pl': 'Przypnij odtwarzacz podczas przewijania',
   'title:ua': 'Закріпити відтворювач коли гортаєш сторінку',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Mini player',
   // desc: 'Player stays always visible while scrolling',
   // 'desc:zh': '滚动时播放器始终可见',
   // 'desc:ja': 'スクロール中、プレーヤーは常に表示されたままになります',
   // 'desc:ko': '스크롤하는 동안 플레이어가 항상 표시됨',
   // 'desc:id': '',
   // // 'desc:es': 'El jugador permanece siempre visible mientras se desplaza',
   // 'desc:pt': 'O jogador fica sempre visível enquanto rola',
   // // 'desc:fr': 'Le lecteur reste toujours visible pendant le défilement',
   // 'desc:it': '',
   // 'desc:tr': 'Kaydırma sırasında oyuncu her zaman görünür kalır',
   // 'desc:de': 'Player bleibt beim Scrollen immer sichtbar',
   // 'desc:ua': 'Відтворювач завжди залишається видимим коли гортаєш',
   _runtime: user_settings => {

      // alt1 - https://chrome.google.com/webstore/detail/aeilijiaejfdnbagnpannhdoaljpkbhe
      // alt2 - https://chrome.google.com/webstore/detail/mcodbccegmndmnbpbgkpdkoleoagjpgk
      // alt3 - https://greasyfork.org/en/scripts/444382-youtube-mini-player

      if (!('IntersectionObserver' in window)) return alert('Nova\n\nPin player Error!\nIntersectionObserver not supported.');

      // alt - https://developer.chrome.com/blog/media-updates-in-chrome-73/#auto-pip
      // only for PWA
      // NOVA.waitSelector('video')
      //    .then(vid => {
      //       vid.setAttribute('autopictureinpicture', '');
      //    });
      // return;

      // Doesn't work because scroll is not part of the [user-trusted events](https://html.spec.whatwg.org/multipage/interaction.html#triggered-by-user-activation).
      // if (user_settings.player_pin_mode == 'pip') {
      //    // alt1 - https://chrome.google.com/webstore/detail/gcfcmfbcpibcjmcinnimklngkpkkcing
      //    // alt2 - https://chrome.google.com/webstore/detail/hlbdhflagoegglpdminhlpenkdgloabe
      //    if (!document.pictureInPictureEnabled) return console.error('document pip is disable');

      //    NOVA.waitSelector('video')
      //       .then(video => {
      //          if (video.disablePictureInPicture) return console.error('video pip is disable');

      //          const pipBtn = document.createElement('button');
      //          pipBtn.style.display = 'none';
      //          pipBtn.addEventListener('click', () => document.pictureInPictureElement
      //             ? document.exitPictureInPicture() : NOVA.videoElement.requestPictureInPicture()
      //          );
      //          pipBtn.addEventListener('click', () => NOVA.videoElement.requestPictureInPicture());
      //          document.body.prepend(pipBtn);

      //          new window.IntersectionObserver(async ([entry]) => {
      //             if (entry.isIntersecting) {
      //                if (video === document.pictureInPictureElement) {
      //                   console.debug('exitPictureInPicture');
      //                   // await document.exitPictureInPicture();
      //                   simulClick(pipBtn);
      //                }
      //                return
      //             }
      //             if (!document.pictureInPictureElement && video.readyState > 0) {
      //                console.debug('requestPictureInPicture');
      //                // await video.requestPictureInPicture();
      //                simulClick(pipBtn);
      //             }
      //          }, {
      //             root: null,
      //             threshold: 0.2, // set offset 0.X means trigger if atleast X0% of element in viewport
      //          })
      //             .observe(video);

      //          function simulClick(el) {
      //             const clickEvent = document.createEvent('MouseEvents');
      //             clickEvent.initEvent('click', true, true);
      //             clickEvent.artificialevent = true;
      //             el.dispatchEvent(clickEvent);
      //          }
      //       });
      //    return;
      // }

      const
         CLASS_VALUE = 'nova-player-pin',
         PINNED_SELECTOR = '.' + CLASS_VALUE, // for css
         UNPIN_BTN_CLASS_VALUE = CLASS_VALUE + '-unpin-btn',
         UNPIN_BTN_SELECTOR = '.' + UNPIN_BTN_CLASS_VALUE; // for css

      // toggle pin state
      document.addEventListener('scroll', () => { // fix bug when initial (document.documentElement.scrollHeight != window.innerHeight) and it's running IntersectionObserver
         // NOVA.waitSelector('#player-theater-container')
         NOVA.waitSelector('#ytd-player')
            .then(container => {
               // movie_player / #ytd-player
               new IntersectionObserver(([entry]) => {
                  // no horizontal scroll in page
                  // if (document.documentElement.scrollHeight < window.innerHeight) return;
                  // console.debug('', document.documentElement.scrollHeight , window.innerHeight);
                  // leave viewport
                  if (entry.isIntersecting) {
                     movie_player.classList.remove(CLASS_VALUE);
                     drag.reset(); // save old pos. Clear curr pos
                  }
                  // enter viewport.
                  else if (!movie_player.isFullscreen() // fix bug on scroll in fullscreen player mode
                     && document.documentElement.scrollTop // fix bug on exit fullscreen mode (https://github.com/raingart/Nova-YouTube-extension/issues/69)
                  ) {
                     movie_player.classList.add(CLASS_VALUE);
                     drag?.storePos?.X && drag.setTranslate(drag.storePos); // restore pos
                  }

                  window.dispatchEvent(new Event('resize')); // fix: restore player size if un/pin
               }, {
                  // https://github.com/raingart/Nova-YouTube-extension/issues/28
                  // threshold: (+user_settings.player_float_scroll_sensivity_range / 100) || .5, // set offset 0.X means trigger if atleast X0% of element in viewport
                  threshold: .5, // set offset 0.X means trigger if atleast X0% of element in viewport
               })
                  .observe(container);
            });
      }, { capture: true, once: true });

      NOVA.waitSelector(PINNED_SELECTOR)
         .then(async player => {
            // add drag
            drag.init(player);
            // dragElement(player); // incorrect work

            // wait video size
            await NOVA.waitUntil(
               // movie_player.clientWidth && movie_player.clientHeight
               () => (NOVA.videoElement?.videoWidth && !isNaN(NOVA.videoElement.videoWidth)
                  && NOVA.videoElement?.videoHeight && !isNaN(NOVA.videoElement.videoHeight)
               )
               // && document.getElementById('masthead-container')?.offsetHeight
               , 500) // 500ms

            initMiniStyles();

            // add unpin button
            insertUnpinButton(player);

            // if player fullscreen disable float mode
            document.addEventListener('fullscreenchange', () => NOVA.isFullscreen() && movie_player.classList.remove(CLASS_VALUE));
            // ytd-watch-flexy:not([fullscreen])

            // resize on video change
            NOVA.waitSelector('#movie_player video')
               .then(video => {
                  video.addEventListener('loadeddata', () => {
                     if (NOVA.currentPage != 'watch') return;

                     NOVA.waitSelector(PINNED_SELECTOR)
                        .then(() => {
                           const width = NOVA.aspectRatio.calculateWidth(
                              movie_player.clientHeight,
                              // chooseAspectRatio(NOVA.videoElement.videoWidth, NOVA.videoElement.videoHeight)
                              NOVA.aspectRatio.chooseAspectRatio({
                                 'width': NOVA.videoElement.videoWidth,
                                 'height': NOVA.videoElement.videoHeight,
                                 'layout': 'landscape',
                              }),
                           );
                           player.style.setProperty('--width', `${width}px !important;`);
                           // movie_player.style = `--width: ${width}px !important;`
                           // movie_player.style = `--width: ${width}px !important; --height: ${movie_player.clientHeight}px !important`
                        });
                  });
               });

            // save scroll code part
            if (user_settings.player_float_scroll_after_fullscreen_restore_srcoll_pos) {
               let scrollPos = 0;

               // restore scroll pos
               document.addEventListener('fullscreenchange', () => {
                  if (!NOVA.isFullscreen()
                     && scrollPos // >0
                     && drag.storePos // not cleared yet
                  ) {
                     window.scrollTo({
                        top: scrollPos,
                        // left: window.pageXOffset,
                        // behavior: user_settings.scroll_to_top_smooth ? 'smooth' : 'instant',
                     });
                  }
               });
               // save scroll pos
               document.addEventListener('yt-action', function (evt) {
                  // if (evt.detail?.actionName == 'yt-fullscreen-change-action') { // to late
                  // if (evt.detail?.actionName == 'yt-window-scrolled') {
                  if (evt.detail?.actionName == 'yt-close-all-popups-action') { // last
                     scrollPos = document.documentElement.scrollTop;
                     // console.debug('1', scrollPos, document.documentElement.scrollTop);
                  }
               });
               // clear scroll pos
               document.addEventListener('yt-navigate-start', () => scrollPos = 0);
            }
         });

      // function chooseAspectRatio(width, height) {
      //    const ratio = width / height;
      //    // return (Math.abs(ratio - 4 / 3) < Math.abs(ratio - 16 / 9)) ? '4:3' : '16:9';
      //    return (Math.abs(ratio - 1.33333) < Math.abs(ratio - 1.7778))
      //       ? 1.33333 : 1.7778;
      // }

      function initMiniStyles() {
         const scrollbarWidth = (window.innerWidth - document.documentElement.clientWidth || 0) + 'px';
         const miniSize = NOVA.aspectRatio.sizeToFit({
            // 'srcWidth': movie_player.clientWidth,
            // 'srcHeight': movie_player.clientHeight,
            'srcWidth': NOVA.videoElement.videoWidth,
            'srcHeight': NOVA.videoElement.videoHeight,
            'maxWidth': (window.innerWidth / user_settings.player_float_scroll_size_ratio),
            'maxHeight': (window.innerHeight / user_settings.player_float_scroll_size_ratio),
         });

         let initcss = {
            // width: miniSize.width + 'px',
            width: NOVA.aspectRatio.calculateWidth(
               miniSize.height,
               // chooseAspectRatio(miniSize.width, miniSize.height)
               NOVA.aspectRatio.chooseAspectRatio({ 'width': miniSize.width, 'height': miniSize.height })
            ) + 'px',
            // width: (movie_player.clientWidth / user_settings.player_float_scroll_size_ratio) + 'px',
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
               initcss.right = scrollbarWidth; // scroll right
               break;
            case 'bottom-left':
               initcss.bottom = 0;
               initcss.left = 0;
               break;
            case 'bottom-right':
               initcss.bottom = 0;
               initcss.right = scrollbarWidth; // scroll right
               break;
         }

         // apply css
         NOVA.css.push(initcss, PINNED_SELECTOR, 'important');

         // variable declaration for fix
         NOVA.css.push(
            PINNED_SELECTOR + `{
               --height: ${initcss.height} !important;
               --width: ${initcss.width} !important;

               width: var(--width) !important;
               height: var(--height) !important;

               background-color: var(--yt-spec-base-background);
            }
            ${PINNED_SELECTOR} video {
               object-fit: contain !important;
            }
            /* fix for [player-quick-buttons], [player-loop], [nova-player-time-remaining] plugins */
            ${PINNED_SELECTOR} .ytp-chrome-controls .nova-right-custom-button,
            ${PINNED_SELECTOR} .ytp-chrome-controls #nova-player-time-remaining,
            ${PINNED_SELECTOR} .ytp-chrome-controls button.ytp-size-button,
            ${PINNED_SELECTOR} .ytp-chrome-controls button.ytp-subtitles-button,
            ${PINNED_SELECTOR} .ytp-chrome-controls button.ytp-settings-button,
            ${PINNED_SELECTOR} .ytp-chrome-controls .ytp-chapter-container {
               display: none !important;
            }`);

         // fix control-player panel
         NOVA.css.push(`
            ${PINNED_SELECTOR} .ytp-preview,
            ${PINNED_SELECTOR} .ytp-scrubber-container,
            ${PINNED_SELECTOR} .ytp-hover-progress,
            ${PINNED_SELECTOR} .ytp-gradient-bottom { display:none !important; }
            /*${PINNED_SELECTOR} .ytp-chrome-bottom { width: var(--width) !important; }*/
            ${PINNED_SELECTOR} .ytp-chrome-bottom { width: 96% !important; }
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
      }

      function insertUnpinButton(player = movie_player) {
         NOVA.css.push(
            PINNED_SELECTOR + ` {
               --zIndex: ${1 + Math.max(
               NOVA.css.getValue('#chat', 'z-index'),
               NOVA.css.getValue('.ytp-chrome-top .ytp-cards-button', 'z-index'),
               NOVA.css.getValue('#chat', 'z-index'),
               // NOVA.css.getValue('#description.ytd-watch-metadata', 'z-index'), // consider plugin "description-popup"
               601)};
            }

            ${UNPIN_BTN_SELECTOR} { display: none; }

            ${PINNED_SELECTOR} ${UNPIN_BTN_SELECTOR} {
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

            ${PINNED_SELECTOR}:hover ${UNPIN_BTN_SELECTOR} { opacity: .7; }
            ${UNPIN_BTN_SELECTOR}:hover { opacity: 1 !important; }`);

         // add unpin button
         const btnUnpin = document.createElement('button');
         btnUnpin.className = UNPIN_BTN_CLASS_VALUE;
         btnUnpin.title = 'Unpin player';
         btnUnpin.textContent = '×'; // ✖
         btnUnpin.addEventListener('click', () => {
            player.classList.remove(CLASS_VALUE);
            drag.reset('clear storePos');
            window.dispatchEvent(new Event('resize')); // fix: restore player size if unpinned
         });
         player.append(btnUnpin);

         // unpin before on page change
         document.addEventListener('yt-navigate-start', () => {
            if (player.classList.contains(CLASS_VALUE)) {
               player.classList.remove(CLASS_VALUE);
               drag.reset(); // save storePos state
               // drag.reset('clear storePos'); // storePos
            }
         });
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

         init(el_target = required()) {
            this.log('drag init', ...arguments);
            if (!(el_target instanceof HTMLElement)) return console.error('el_target not HTMLElement:', el_target);

            this.dragTarget = el_target;

            // touchs
            // document.addEventListener('touchstart', this.dragStart.bind(this));
            // document.addEventListener('touchend', this.dragEnd.bind(this));
            // document.addEventListener('touchmove', this.draging.bind(this));
            // mouse
            // document.addEventListener('mousedown', this.dragStart.bind(this));
            // document.addEventListener('mouseup', this.dragEnd.bind(this));
            // document.addEventListener('mousemove', this.draging.bind(this));
            document.addEventListener('mousedown', evt => {
               if (!el_target.classList.contains(CLASS_VALUE)) return;
               this.dragStart.apply(this, [evt]);
            });
            document.addEventListener('mouseup', evt => {
               if (this.active) this.dragTarget.removeAttribute(this.attrNametoLock); // fix broken preventDefault
               this.dragEnd.apply(this, [evt]);
            });
            document.addEventListener('mousemove', evt => {
               if (this.active && !this.dragTarget.hasAttribute(this.attrNametoLock)) {
                  this.dragTarget.setAttribute(this.attrNametoLock, true); // fix broken preventDefault
               }
               this.draging.apply(this, [evt]);
            });

            // fix broken preventDefault / preventDefault patch
            NOVA.css.push(
               `[${this.attrNametoLock}]:active {
                  pointer-events: none;
               }`);
            // `[${this.attrNametoLock}]:active {
            //    pointer-events: none;
            //    cursor: grab; /* <-- Doesn't work */
            //    outline: 2px dashed #3ea6ff !important;
            // }`);
         },

         dragStart(evt) {
            // console.debug('dragStart:', evt.target, this.dragTarget);
            if (!this.dragTarget.contains(evt.target)) return;
            // if (!evt.target.querySelector(PINNED_SELECTOR)) return; // Doesn't work
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
            // document.body.style.cursor = 'grab';
            document.body.style.cursor = 'move';
         },

         dragEnd(evt) {
            if (!this.active) return;
            this.log('dragEnd');

            this.initialX = this.currentX;
            this.initialY = this.currentY;
            this.active = false;
            document.body.style.cursor = 'default';
         },

         draging(evt) {
            if (!this.active) return;
            evt.preventDefault(); // Doesn't work. Replace to preventDefault patch
            evt.stopImmediatePropagation(); // Doesn't work. Replace to preventDefault patch

            this.log('draging');

            switch (evt.type) {
               case 'touchmove':
                  this.currentX = evt.touches[0].clientX - this.initialX;
                  this.currentY = evt.touches[0].clientY - this.initialY;
                  break;
               case 'mousemove':
                  const
                     rect = this.dragTarget.getBoundingClientRect();
                  // pointOnElX = evt.clientX - rect.left,
                  // pointOnElY = evt.clientY - rect.top;
                  // console.debug('evt.clientX', evt.clientX, evt.clientX - pointOnElX);

                  // max viewport - right
                  if (rect.left >= document.body.clientWidth - this.dragTarget.offsetWidth) {
                     this.currentX = Math.min(
                        evt.clientX - this.initialX,
                        document.body.clientWidth - this.dragTarget.offsetWidth - this.dragTarget.offsetLeft
                     );
                  }
                  // max viewport - left
                  // else if (rect.left >= 0) {
                  else {
                     this.currentX = Math.max(evt.clientX - this.initialX, 0 - this.dragTarget.offsetLeft);
                  }

                  // max viewport - buttom
                  if (rect.top >= window.innerHeight - this.dragTarget.offsetHeight) {
                     this.currentY = Math.min(
                        evt.clientY - this.initialY,
                        window.innerHeight - this.dragTarget.offsetHeight - this.dragTarget.offsetTop
                     );
                  }
                  // max viewport - top
                  // else if (rect.top >= 0 - this.dragTarget.offsetTop) {
                  else {
                     this.currentY = Math.max(evt.clientY - this.initialY, 0 - this.dragTarget.offsetTop);
                  }

                  // no limit viewport
                  // this.currentX = evt.clientX - this.initialX;
                  // this.currentY = evt.clientY - this.initialY;

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

      /**
      * Makes an elemenet draggable around the screen.
      * @param {string} el Select an element from the DOM to become draggable
      */
      // function dragElement(el) {
      //    let pos1 = pos2 = pos3 = pos4 = 0;

      //    if (document.body.querySelector(".js-inject-header")) {
      //       document.body.querySelector(".js-inject-header").onmousedown = dragMouseDown;
      //    }
      //    else {
      //       el.onmousedown = dragMouseDown;
      //    }

      //    function dragMouseDown(e) {
      //       e = e || window.event;
      //       e.preventDefault();
      //       pos3 = e.clientX;
      //       pos4 = e.clientY;
      //       document.onmouseup = closeDragElement;
      //       document.onmousemove = elementDrag;
      //    }

      //    function elementDrag(e) {
      //       e = e || window.event;
      //       e.preventDefault();
      //       pos1 = pos3 - e.clientX;
      //       pos2 = pos4 - e.clientY;
      //       pos3 = e.clientX;
      //       pos4 = e.clientY;
      //       el.style.top = (el.offsetTop - pos2) + "px";
      //       el.style.left = (el.offsetLeft - pos1) + "px";
      //    }

      //    function closeDragElement() {
      //       document.onmouseup = document.onmousemove = null;
      //    }
      // }

      // function dragElement(elem) {
      //    const handler = (e) => {
      //       e = e || window.event
      //       e.preventDefault()
      //       pos3 = e.clientX
      //       pos4 = e.clientY
      //       document.onmouseup = closeDragger
      //       document.onmousemove = enableDragger
      //    }

      //    const enableDragger = (e) => {
      //       e = e || window.event
      //       e.preventDefault()
      //       pos1 = pos3 - e.clientX
      //       pos2 = pos4 - e.clientY
      //       pos3 = e.clientX
      //       pos4 = e.clientY

      //       elem.style.top = (elem.offsetTop - pos2) + "px"
      //       elem.style.left = (elem.offsetLeft - pos1) + "px"
      //    }

      //    const closeDragger = () => {
      //       document.onmouseup = null
      //       document.onmousemove = null
      //    }

      //    let pos1, pos2, pos3, pos4

      //    if (document.getElementsByClassName("drDrag").length > 0) {
      //       document.getElementsByClassName("drDrag")[0].onmousedown = handler
      //    } else {
      //       elem.onmousedown = handler
      //    }
      // }

   },
   options: {
      // player_pin_mode: {
      //    _tagName: 'select',
      //    label: ' mode',
      //    label: 'Mode',
      //    'label:zh': '模式',
      //    'label:ja': 'モード',
      //    'label:ko': '방법',
      //    // 'label:id': 'Mode',
      //    'label:es': 'Modo',
      //    'label:pt': 'Modo',
      //    // 'label:fr': 'Mode',
      //    'label:it': 'Modalità',
      //    'label:tr': 'Mod',
      //    'label:de': 'Modus',
      //    'label:pl': 'Tryb',
      //    // title: '',
      //    options: [
      //       { label: 'picture-in-picture', value: 'pip', selected: true },
      //       { label: 'float', value: 'float' },
      //    ],
      // },
      player_float_scroll_size_ratio: {
         _tagName: 'input',
         label: 'Player size',
         'label:zh': '播放器尺寸',
         'label:ja': 'プレーヤーのサイズ',
         'label:ko': '플레이어 크기',
         'label:id': 'Ukuran pemain',
         'label:es': 'Tamaño del jugador',
         'label:pt': 'Tamanho do jogador',
         'label:fr': 'Taille du joueur',
         'label:it': 'Dimensioni del giocatore',
         // 'label:tr': 'Oyuncu boyutu',
         'label:de': 'Spielergröße',
         'label:pl': 'Rozmiar odtwarzacza',
         'label:ua': 'Розмір відтворювача',
         type: 'number',
         title: 'Less value - larger size',
         'title:zh': '较小的值 - 较大的尺寸',
         'title:ja': '小さい値-大きいサイズ',
         'title:ko': '더 작은 값 - 더 큰 크기',
         'title:id': 'Nilai lebih kecil - ukuran lebih besar',
         'title:es': 'Valor más pequeño - tamaño más grande',
         'title:pt': 'Valor menor - tamanho maior',
         'title:fr': 'Plus petite valeur - plus grande taille',
         'title:it': 'Meno valore - dimensioni maggiori',
         // 'title:tr': 'Daha az değer - daha büyük boyut',
         'title:de': 'Kleiner Wert - größere Größe',
         'title:pl': 'Mniejsza wartość - większy rozmiar',
         'title:ua': 'Менше значення - більший розмір',
         placeholder: '2-5',
         step: 0.1,
         min: 1,
         max: 5,
         value: 2.5,
         // 'data-dependent': { 'player_pin_mode': ['float'] },
      },
      player_float_scroll_position: {
         _tagName: 'select',
         // label: 'Player position in the corner',
         label: 'Player position',
         'label:zh': '球员位置',
         'label:ja': 'プレイヤーの位置',
         'label:ko': '선수 위치',
         'label:id': 'Posisi pemain',
         'label:es': 'Posición de jugador',
         'label:pt': 'Posição do jogador',
         'label:fr': 'La position du joueur',
         'label:it': 'Posizione del giocatore',
         // 'label:tr': 'Oyuncu pozisyonu',
         'label:de': 'Spielerposition',
         'label:pl': 'Pozycja odtwarzacza',
         'label:ua': 'Позиція відтворювача',
         options: [
            {
               label: 'Top left', value: 'top-left',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
            {
               label: 'Top right', value: 'top-right', selected: true,
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
            {
               label: 'Bottom left', value: 'bottom-left',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
            {
               label: 'Bottom right', value: 'bottom-right',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
         ],
         // 'data-dependent': { 'player_pin_mode': ['float'] },
      },
      // player_float_scroll_sensivity_range: {
      //    _tagName: 'input',
      //    label: 'Player sensitivity visibility range',
      //    'label:zh': '播放器灵敏度可见范围',
      //    'label:ja': 'プレイヤーの感度の可視範囲',
      //    'label:ko': '플레이어 감도 가시 범위',
      //    'label:id': 'Rentang visibilitas sensitivitas pemain',
      //    'label:es': 'Rango de visibilidad de la sensibilidad del jugador',
      //    'label:pt': 'Faixa de visibilidade da sensibilidade do jogador',
      //    'label:fr': 'Plage de visibilité de la sensibilité du joueur',
      //    'label:it': 'Intervallo di visibilità della sensibilità del giocatore',
      //    'label:tr': 'Oyuncu duyarlılığı görünürlük aralığı',
      //    'label:de': 'Sichtbarkeitsbereich der Spielerempfindlichkeit',
      //    'label:pl': 'Pozycja odtwarzacza',
      //    'label:ua': 'Діапазон видимості чутливості відтворювача',
      //    type: 'number',
      //    title: 'in %',
      //    placeholder: '%',
      //    step: 10,
      //    min: 10,
      //    max: 100,
      //    value: 80,
      //    // 'data-dependent': { 'player_pin_mode': ['float'] },
      // },
      // 'player_float_scroll_pause_video': {
      //    _tagName: 'input',
      //    label: 'Pause pinned video',
      //    type: 'checkbox',
      // },
      player_float_scroll_after_fullscreen_restore_srcoll_pos: {
         _tagName: 'input',
         label: 'Restore scrolling back there after exiting fullscreen',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         type: 'checkbox',
         // title: '',
      },
   }
});
