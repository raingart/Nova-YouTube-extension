window.nova_plugins.push({
   id: 'player-buttons-custom',
   title: 'Custom buttons',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_BTN_CLASS_NAME = 'custom-button',
         SELECTOR_BTN = '.' + SELECTOR_BTN_CLASS_NAME, // for css
         getVideoElement = () => document.querySelector('video'),
         getPlayerElement = () => document.getElementById('movie_player'),
         getVideoId = () => NOVA.queryURL.get('v', getPlayerElement()?.getVideoUrl() || document.querySelector('link[rel="canonical"][href]')?.href); // fix for embed

      NOVA.waitElement('.ytp-right-controls')
         .then(container => {
            // global
            NOVA.css.push(
               `button${SELECTOR_BTN} {
                  padding: 0 7px;
               }

               button${SELECTOR_BTN} svg {
                  fill: white;
                  width: 80%;
               }

               button${SELECTOR_BTN}:hover svg { fill: #66afe9; }
               button${SELECTOR_BTN}:active svg { fill: #2196f3; }`);

            // Pop-up player
            if (user_settings.player_buttons_custom_items.indexOf('popup') !== -1 && !NOVA.queryURL.get('popup')) {
               const btnPopUp = document.createElement('button');
               btnPopUp.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               btnPopUp.title = 'Autoplay is off';
               // btnPopUp.setAttribute('aria-label','');
               // btnPopUp.innerHTML = `<svg viewBox="0 0 20 20" height="100%" width="100%" version="1.1">
               //    <g transform="translate(0, 2)">
               //       <polygon fill-rule="nonzero"
               //          points="1.85008844 1.51464844 18.2421138 1.51464844 18.2421138 7.74121094 19.2421138 7.74121094 19.2421138 0.514648438 0.850088443 0.514648438 0.850088443 11.7244572 9.16539331 11.7758693 9.17157603 10.7758885 1.85008844 10.7306209"
               //          fill="#ffffff" style="fill: rgb(255, 255, 255);"></polygon>
               //       <rect x="10.5" y="9" width="9.5" height="6" fill="#ffffff" style="fill: rgb(255, 255, 255);"></rect>
               //       <path
               //          d="M8.49517931,6.9934339 L4.58268904,3.10539669 L3.87780235,3.81471662 L7.75590296,7.6685791 L5.14025649,7.6685791 L5.14025649,8.6685791 L9.49517931,8.6685791 L9.49517931,4.64446771 L8.49517931,4.64446771 L8.49517931,6.9934339 Z"
               //          fill-rule="nonzero" fill="#ffffff" style="fill: rgb(255, 255, 255);"></path>
               //    </g>
               // </svg>`;
               btnPopUp.innerHTML = '<svg version="1.1" viewBox="0 0 20 20" height="100%" width="100%"><path d="M18 2H6v4H2v12h12v-4h4V2z M12 16H4V8h2v6h6V16z M16 12h-2h-2H8V8V6V4h8V12z"/></svg>';
               btnPopUp.addEventListener('click', () => {
                  const
                     width = 533,
                     height = Math.round(width / (16 / 9)),
                     left = window.innerWidth, //(window.innerWidth) / 2 - (width / 2),
                     top = window.innerHeight, //(window.innerHeight / 2) - (height / 2),
                     currentTime = Math.floor(getVideoElement()?.currentTime),
                     url = new URL(
                        document.querySelector('link[itemprop="embedUrl"][href]')?.href
                        || ('https://www.youtube.com/embed/' + getVideoId()));
                  // list param ex.
                  // https://www.youtube.com/embed/PBlOi5OVcKs?start=0&amp;playsinline=1&amp;controls=0&amp;fs=20&amp;disablekb=1&amp;rel=0&amp;origin=https%3A%2F%2Ftyping-tube.net&amp;enablejsapi=1&amp;widgetid=1

                  if (+currentTime) url.searchParams.append('start', currentTime);
                  url.searchParams.append('autoplay', 1);
                  url.searchParams.append('popup', true); // deactivate popup-button for used window

                  window.open(url.href, document.title, `width=${width},height=${height},left=${left},top=${top}`);
               });
               container.prepend(btnPopUp);
            }

            if (user_settings.player_buttons_custom_items.indexOf('screenshot') !== -1) {
               const
                  // bar
                  SELECTOR_SCREENSHOT_ID = 'screenshot-result',
                  SELECTOR_SCREENSHOT = '#' + SELECTOR_SCREENSHOT_ID; // for css

               NOVA.css.push(
                  SELECTOR_SCREENSHOT + ` {
                     --width: 400px;
                     --height: 400px;

                     position: fixed;
                     top: 0;
                     right: 0;
                     overflow: hidden;
                     margin: 30px; /* <-- possibility out of date */
                     box-shadow: 0 0 15px #000;
                     max-width: var(--width);
                     max-height: var(--height);
                     z-index: 300; /* <-- possibility out of date */
                  }

                  /*${SELECTOR_SCREENSHOT}:hover {
                     outline: 2px dashed #f69c55;
                  }*/

                  ${SELECTOR_SCREENSHOT} canvas {
                     max-width: var(--width);
                     max-height: var(--height);
                     /* object-fit: contain; */
                  }

                  ${SELECTOR_SCREENSHOT} .close-btn {
                     position: absolute;
                     bottom: 0;
                     right: 0;
                     background: rgba(0, 0, 0, .5);
                     color: #FFF;
                     cursor: pointer;
                     font-size: 12px;
                     display: grid;
                     height: 100%;
                     width: 25%;
                  }
                  ${SELECTOR_SCREENSHOT} .close-btn:hover { background: rgba(0, 0, 0, .65); }
                  ${SELECTOR_SCREENSHOT} .close-btn > * { margin: auto; }`);

               const btnScreenshot = document.createElement('button');
               btnScreenshot.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               btnScreenshot.title = 'Take screenshot';
               // btnScreenshot.setAttribute('aria-label','');
               btnScreenshot.innerHTML =
                  `<svg viewBox="0 0 512 512" height="100%" width="100%" version="1.1">
                     <g>
                        <circle cx="255.811" cy="285.309" r="75.217"/>
                        <path d="M477,137H352.718L349,108c0-16.568-13.432-30-30-30H191c-16.568,0-30,13.432-30,30l-3.718,29H34 c-11.046,0-20,8.454-20,19.5v258c0,11.046,8.954,20.5,20,20.5h443c11.046,0,20-9.454,20-20.5v-258C497,145.454,488.046,137,477,137 z M255.595,408.562c-67.928,0-122.994-55.066-122.994-122.993c0-67.928,55.066-122.994,122.994-122.994 c67.928,0,122.994,55.066,122.994,122.994C378.589,353.495,323.523,408.562,255.595,408.562z M474,190H369v-31h105V190z"/>
                     </g>
                  </svg>`;
               btnScreenshot.addEventListener('click', () => {
                  const
                     video = getVideoElement(),
                     container = document.getElementById(SELECTOR_SCREENSHOT_ID) || document.createElement('a'),
                     canvas = container.querySelector('canvas') || document.createElement('canvas'),
                     context = canvas.getContext('2d'),
                     aspectRatio = video.videoWidth / video.videoHeight,
                     width = video.videoWidth,
                     height = parseInt(width / aspectRatio, 10);

                  canvas.width = width;
                  canvas.height = height;
                  context.drawImage(video, 0, 0, width, height);
                  // container.href = canvas.toDataURL('image/png'); // does not work
                  canvas.toBlob(blob => container.href = URL.createObjectURL(blob));
                  // create
                  if (!container.id) {
                     const headerContainer = document.getElementById('masthead-container');
                     container.id = SELECTOR_SCREENSHOT_ID;
                     container.target = '_blank'; // useful link
                     container.title = 'Click to save';
                     container.style.marginTop = (headerContainer?.offsetHeight || 0) + 'px'; // fix header indent
                     container.style.zIndex = NOVA.css.getValue({ selector: headerContainer, property: 'z-index' }); // fix header overlapping
                     canvas.addEventListener('click', evt => {
                        evt.preventDefault();
                        // document.location.href = target.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                        downloadCanvasAsImage(evt.target);
                        evt.target.parentNode.remove();
                     });
                     container.appendChild(canvas);
                     const close = document.createElement('a');
                     // close.id =
                     close.className = 'close-btn'
                     // close.textContent = 'CLOSE';
                     close.innerHTML = '<span>CLOSE</span>';
                     close.addEventListener('click', evt => {
                        evt.preventDefault();
                        evt.target.parentNode.remove();
                     });
                     container.appendChild(close);
                     document.body.appendChild(container);
                  }
               });

               function downloadCanvasAsImage(canvas) {
                  const downloadLink = document.createElement('a');
                  downloadLink.setAttribute('download', (+new Date()) + '.png');
                  const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                  downloadLink.href = image;
                  downloadLink.click();
               }
               container.prepend(btnScreenshot);
            }

            if (user_settings.player_buttons_custom_items.indexOf('thumbnail') !== -1) {
               const btnThumb = document.createElement('button');
               btnThumb.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               btnThumb.title = 'Open thumbnail';
               btnThumb.innerHTML =
                  `<svg viewBox="0 0 20 20" height="100%" width="100%" version="1.1">
                     <circle cx='8' cy='7.2' r='2'/>
                     <path d='M0 2v16h20V2H0z M18 16H2V4h16V16z'/>
                     <polygon points='17 10.9 14 7.9 9 12.9 6 9.9 3 12.9 3 15 17 15'/>
                  </svg>`;
               btnThumb.addEventListener('click', () =>
                  window.open(`https://i.ytimg.com/vi/${getVideoId()}/maxresdefault.jpg`));
               container.prepend(btnThumb);
            }

            if (user_settings.player_buttons_custom_items.indexOf('toggle-speed') !== -1) {
               const
                  video = getVideoElement(),
                  player = getPlayerElement(),
                  btnSpeed = document.createElement('a'),
                  hotkey = user_settings.player_buttons_custom_hotkey_toggle_speed || 'a',
                  defaultRateText = '1x';

               let prevRate = {};

               // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
               ["ratechange", "loadeddata"].forEach(evt => {
                  video.addEventListener(evt, visibilitySwitch.bind(video));
               });

               btnSpeed.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               btnSpeed.style.textAlign = 'center';
               btnSpeed.style.fontWeight = 'bold';
               btnSpeed.title = `Toggle speed (${hotkey})`;
               btnSpeed.textContent = defaultRateText;
               document.addEventListener('keyup', evt => {
                  if (evt.key === hotkey && !['input', 'textarea'].includes(evt.target.localName) && !evt.target.isContentEditable) {
                     switchRate({ 'target': btnSpeed });
                  }
               })
               btnSpeed.addEventListener('click', switchRate);

               function switchRate({ target }) {
                  // restore
                  if (Object.keys(prevRate).length) {
                     playerRate.set(prevRate);
                     prevRate = {};
                     target.textContent = defaultRateText;

                  } else { // return default
                     const rate = video.playbackRate;
                     prevRate = (player && rate % .25) === 0
                        ? { 'default': player.getPlaybackRate() }
                        : { 'html5': rate };

                     let resetRate = Object.assign({}, prevRate); // clone obj
                     if (resetRate.hasOwnProperty('html5')) {
                        resetRate.html5 = 1;
                     } else {
                        resetRate.default = 1;
                     }
                     playerRate.set(resetRate);
                     target.textContent = prevRate[Object.keys(prevRate)[0]] + 'x';
                  }
                  btnSpeed.title = `Switch to ${target.textContent}x (${hotkey})`;
                  // console.debug('prevRate', prevRate);
               }

               function visibilitySwitch() {
                  if (Object.keys(prevRate).length) return;
                  btnSpeed.style.visibility = this.playbackRate === 1 ? 'hidden' : 'visible';
               }

               const playerRate = {
                  set(obj) {
                     if (obj.hasOwnProperty('html5')) {
                        video.playbackRate = obj.html5;
                     } else {
                        player.setPlaybackRate(obj.default);
                     }
                     this.saveInSession(obj.html5 || obj.default);
                  },

                  saveInSession(level = required()) {
                     try {
                        sessionStorage['yt-player-playback-rate'] = JSON.stringify({
                           creation: Date.now(), data: level.toString(),
                        })
                        // console.log('playbackRate save in session:', ...arguments);

                     } catch (err) {
                        console.info(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                     }
                  },
               };
               container.prepend(btnSpeed);
            }
         });

   },
   options: {
      player_buttons_custom_items: {
         _tagName: 'select',
         label: 'Items',
         title: 'Hold Ctrl+Сlick to select several',
         multiple: null, // dont use - selected: true
         size: 4, // = options.length
         options: [
            { label: 'toggle speed', value: 'toggle-speed' },
            { label: 'screenshot', value: 'screenshot' },
            { label: 'thumbnail', value: 'thumbnail' },
            { label: 'pop-up player', value: 'popup' },
         ],
      },
      player_buttons_custom_hotkey_toggle_speed: {
         _tagName: 'select',
         label: 'Hotkey toggle speed ',
         // title: '',
         options: [
            { label: 'A', value: 'a', selected: true },
            'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
         'data-dependent': '{"player_buttons_custom_items":["toggle-speed"]}',
      },
   },
});
