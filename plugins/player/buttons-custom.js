window.nova_plugins.push({
   id: 'player-buttons-custom',
   title: 'Custom player buttons',
   'title:zh': '自定义按钮',
   'title:ja': 'カスタムボタン',
   'title:ko': '사용자 정의 버튼',
   'title:id': 'Tombol pemutar khusus',
   'title:es': 'Botones personalizados',
   'title:pt': 'Botões personalizados',
   'title:fr': 'Boutons personnalisés',
   'title:it': 'Pulsanti personalizzati del giocatore',
   // 'title:tr': 'Özel düğmeler',
   'title:de': 'Benutzerdefinierte Schaltflächen',
   'title:pl': 'Własne przyciski odtwarzacza',
   'title:ua': 'Власні кнопки відтворювання',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_BTN_CLASS_NAME = 'nova-right-custom-button',
         SELECTOR_BTN = '.' + SELECTOR_BTN_CLASS_NAME; // for css

      // NOVA.waitElement('.ytp-left-controls')
      NOVA.waitElement('.ytp-right-controls')
         .then(async container => {
            NOVA.videoElement = await NOVA.waitElement('video'); // wait load video

            // global
            NOVA.css.push(
               `${SELECTOR_BTN} {
                  user-select: none;
                  /*padding: 5px;
                  width: 25px;*/
               }
               ${SELECTOR_BTN}:hover { color: #66afe9 !important; }
               ${SELECTOR_BTN}:active { color: #2196f3 !important; }`);

            // custon title (with animation)
            // NOVA.css.push(
            //    `${SELECTOR_BTN}[title]::before {
            //       content: attr(title);
            //       position: absolute;
            //       top: -3em;
            //       line-height: normal;
            //       background-color: rgba(28,28,28,.9);
            //       border-radius: 2px;
            //       padding: 5px 9px;
            //       color: #fff;
            //       font-weight: bold;
            //       white-space: nowrap;

            //       /*animation*/
            //       --scale: 0;
            //       transform: translateX(-25%) scale(var(--scale));
            //       transition: 50ms transform;
            //       transform-origin: bottom center;
            //    }
            //    ${SELECTOR_BTN}[title]:hover::before {
            //       --scale: 1
            //    }`);
            NOVA.css.push(
               `${SELECTOR_BTN}[title]:hover::before {
                  content: attr(title);
                  position: absolute;
                  top: -3em;
                  transform: translateX(-30%);
                  line-height: normal;
                  background-color: rgba(28,28,28,.9);
                  border-radius: 2px;
                  padding: 5px 9px;
                  color: #fff;
                  font-weight: bold;
                  white-space: nowrap;
               }
               /* for embed */
               html[data-cast-api-enabled] ${SELECTOR_BTN}[title]:hover::before {
                  font-weight: normal;
               }`);

            // picture-in-picture player
            if (user_settings.player_buttons_custom_items?.includes('picture-in-picture')) {
               const pipBtn = document.createElement('button');

               pipBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               pipBtn.title = 'Open in PictureInPicture';
               pipBtn.innerHTML = createSVG();
               // pipBtn.innerHTML =
               //    `<svg viewBox="-8 -6 36 36" height="100%" width="100%">
               //       <g fill="currentColor">
               //          <path d="M2.5,17A1.5,1.5,0,0,1,1,15.5v-9A1.5,1.5,0,0,1,2.5,5h13A1.5,1.5,0,0,1,17,6.5V10h1V6.5A2.5,2.5,0,0,0,15.5,4H2.5A2.5,2.5,0,0,0,0,6.5v9A2.5,2.5,0,0,0,2.5,18H7V17Z M18.5,11h-8A2.5,2.5,0,0,0,8,13.5v5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z" />
               //       </g>
               //    </svg>`;
               // `<svg viewBox="-3 -7 30 30" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path fill-rule="evenodd" d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
               //       <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"/>
               //    </g>
               // </svg>`;
               // `<svg viewBox="0 -5 24 30" height="100%" width="100%">
               //    <g transform="translate(0,2)">
               //       <polygon fill-rule="nonzero" points="1.85008844 1.51464844 18.2421138 1.51464844 18.2421138 7.74121094 19.2421138 7.74121094 19.2421138 0.514648438 0.850088443 0.514648438 0.850088443 11.7244572 9.16539331 11.7758693 9.17157603 10.7758885 1.85008844 10.7306209" />
               //       <rect x="10.5" y="9" width="9.5" height="6" />
               //       <path d="M8.49517931,6.9934339 L4.58268904,3.10539669 L3.87780235,3.81471662 L7.75590296,7.6685791 L5.14025649,7.6685791 L5.14025649,8.6685791 L9.49517931,8.6685791 L9.49517931,4.64446771 L8.49517931,4.64446771 L8.49517931,6.9934339 Z" fill-rule="nonzero" />
               //    </g>
               // </svg>`;
               pipBtn.addEventListener('click', () => document.pictureInPictureElement
                  ? document.exitPictureInPicture() : NOVA.videoElement.requestPictureInPicture()
               );

               container.prepend(pipBtn);

               // update icon
               NOVA.videoElement?.addEventListener('enterpictureinpicture', () => pipBtn.innerHTML = createSVG(2));
               NOVA.videoElement?.addEventListener('leavepictureinpicture', () => pipBtn.innerHTML = createSVG());

               function createSVG(alt) {
                  const svg = document.createElement('svg');
                  svg.setAttribute('width', '100%');
                  svg.setAttribute('height', '100%');
                  svg.setAttribute('viewBox', '-8 -6 36 36');
                  const path = document.createElement("path");
                  path.setAttribute('fill', '#fff');
                  path.setAttribute('d', alt
                     ? 'M18.5,11H18v1h.5A1.5,1.5,0,0,1,20,13.5v5A1.5,1.5,0,0,1,18.5,20h-8A1.5,1.5,0,0,1,9,18.5V18H8v.5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z M14.5,4H2.5A2.5,2.5,0,0,0,0,6.5v8A2.5,2.5,0,0,0,2.5,17h12A2.5,2.5,0,0,0,17,14.5v-8A2.5,2.5,0,0,0,14.5,4Z'
                     : 'M2.5,17A1.5,1.5,0,0,1,1,15.5v-9A1.5,1.5,0,0,1,2.5,5h13A1.5,1.5,0,0,1,17,6.5V10h1V6.5A2.5,2.5,0,0,0,15.5,4H2.5A2.5,2.5,0,0,0,0,6.5v9A2.5,2.5,0,0,0,2.5,18H7V17Z M18.5,11h-8A2.5,2.5,0,0,0,8,13.5v5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z');
                  svg.append(path);
                  return svg.outerHTML;
               }
            }

            // Pop-up player
            if (user_settings.player_buttons_custom_items?.indexOf('popup') !== -1 && !NOVA.queryURL.has('popup')) {
               // alt - https://greasyfork.org/en/scripts/401907-youtube-popout-button-mashup
               const popupBtn = document.createElement('button');
               popupBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               popupBtn.title = 'Open in popup';
               popupBtn.innerHTML =
                  `<svg viewBox="-8 -8 36 36" height="100%" width="100%">
                     <g fill="currentColor">
                        <path d="M18 2H6v4H2v12h12v-4h4V2z M12 16H4V8h2v6h6V16z M16 12h-2h-2H8V8V6V4h8V12z" />
                     </g>
                  </svg>`;
               // `<svg viewBox="0 -1 38 38" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path d="M 27.020989,25.020001 H 9.0209895 v -14.05 L 20.278056,10.969089 20.27853,8.9999999 H 8.9544297 c -1.0730594,0 -1.9334402,0.9 -1.9334402,2.0000001 v 14 c 0,1.1 0.8603808,2 1.9334402,2 H 27.045569 c 1.063393,0 1.97421,-0.885891 1.968683,-1.985877 l 0.0018,-7.014124 h -1.991386 z m -4.80902,-16.0200011 -0.01053,1.9774681 3.525926,-0.0018 -9.547729,9.854341 1.363076,1.41 9.481183,-9.799226 v 3.59 l 1.993516,-0.0095 0.0039,-7.0250141 z" />
               //    </g>
               // </svg>`;
               popupBtn.addEventListener('click', () => {
                  const
                     // width = window.innerWidth / 2,
                     width = screen.width / (+user_settings.player_buttons_custom_popup_width || 4),
                     // aspectRatio = NOVA.videoElement.videoWidth / NOVA.videoElement.videoHeight,
                     // height = Math.round(width / aspectRatio);
                     height = Math.round(width / (16 / 9));

                  url = new URL(
                     document.querySelector('link[itemprop="embedUrl"][href]')?.href
                     || (location.origin + '/embed/' + movie_player.getVideoData().video_id)
                  );
                  // list param ex.
                  // https://www.youtube.com/embed/PBlOi5OVcKs?start=0&amp;playsinline=1&amp;controls=0&amp;fs=20&amp;disablekb=1&amp;rel=0&amp;origin=https%3A%2F%2Ftyping-tube.net&amp;enablejsapi=1&amp;widgetid=1

                  if (currentTime = ~~NOVA.videoElement?.currentTime) url.searchParams.set('start', currentTime);
                  url.searchParams.set('autoplay', 1);
                  url.searchParams.set('popup', true); // deactivate popup-button for used window

                  openPopup({ 'url': url.href, 'title': document.title, 'width': width, 'height': height });
               });

               container.prepend(popupBtn);

               function openPopup({ url, title, width, height }) {
                  // center screen
                  const left = (screen.width / 2) - (width / 2);
                  const top = (screen.height / 2) - (height / 2);
                  // bottom right corner
                  // left = window.innerWidth;
                  // top = window.innerHeight;
                  const newWindow = window.open(url, '_blank', `popup=1,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`);
                  // win.document.title = title;
                  return;
               }
            }

            if (user_settings.player_buttons_custom_items?.includes('screenshot')) {
               // alt - https://greasyfork.org/en/scripts/455155-youtube-screenshot
               const
                  // bar
                  SELECTOR_SCREENSHOT_ID = 'nova-screenshot-result',
                  SELECTOR_SCREENSHOT = '#' + SELECTOR_SCREENSHOT_ID; // for css

               NOVA.css.push(
                  SELECTOR_SCREENSHOT + ` {
                     --width: 400px;
                     --height: 400px;

                     position: fixed;
                     top: 0;
                     right: 0;
                     overflow: hidden;
                     margin: 36px 30px; /* <-- possibility out of date */
                     box-shadow: 0 0 15px #000;
                     max-width: var(--width);
                     max-height: var(--height);
                  }
                  /* for embed */
                  /*html[data-cast-api-enabled] ${SELECTOR_SCREENSHOT} {
                     margin-right: 0;
                  }*/

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
                     background-color: rgba(0, 0, 0, .5);
                     color: #FFF;
                     cursor: pointer;
                     font-size: 12px;
                     display: grid;
                     height: 100%;
                     width: 25%;
                  }
                  ${SELECTOR_SCREENSHOT} .close-btn:hover { background-color: rgba(0, 0, 0, .65); }
                  ${SELECTOR_SCREENSHOT} .close-btn > * { margin: auto; }`);

               const screenshotBtn = document.createElement('button');
               screenshotBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               screenshotBtn.title = 'Take screenshot';
               // Doesn't work defoult title
               // screenshotBtn.setAttribute('aria-pressed', 'false');
               // screenshotBtn.setAttribute('aria-label','test');
               screenshotBtn.innerHTML =
                  `<svg viewBox="0 -166 512 860" height="100%" width="100%">
                     <g fill="currentColor">
                        <circle cx="255.811" cy="285.309" r="75.217" />
                        <path d="M477,137H352.718L349,108c0-16.568-13.432-30-30-30H191c-16.568,0-30,13.432-30,30l-3.718,29H34 c-11.046,0-20,8.454-20,19.5v258c0,11.046,8.954,20.5,20,20.5h443c11.046,0,20-9.454,20-20.5v-258C497,145.454,488.046,137,477,137 z M255.595,408.562c-67.928,0-122.994-55.066-122.994-122.993c0-67.928,55.066-122.994,122.994-122.994 c67.928,0,122.994,55.066,122.994,122.994C378.589,353.495,323.523,408.562,255.595,408.562z M474,190H369v-31h105V190z" />
                     </g>
                  </svg>`;

               // simplified implementation. Can't open images in a new tab
               // screenshotBtn.addEventListener('click', getScreenshot);
               // function getScreenshot() {
               //    var width, height, aspectRatio, container, canvas, close;
               //    container = document.getElementById(SELECTOR_SCREENSHOT_ID) || document.createElement('div');
               //    canvas = container.querySelector('canvas') || document.createElement('canvas');
               //    canvas.width = NOVA.videoElement.videoWidth;
               //    canvas.height = NOVA.videoElement.videoHeight
               //    canvas.getContext('2d').drawImage(NOVA.videoElement, 0, 0, canvas.width, canvas.height);
               //    // create
               //    if (!container.id) {
               //       canvas.addEventListener('click', ({ target }) => {
               //          downloadCanvasAsImage(target);
               //          container.remove();
               //       });
               //       container.id = SELECTOR_SCREENSHOT_ID;
               //       container.append(canvas);
               //       const close = document.createElement('div');
               //       close.className = 'close-btn';
               //       close.innerHTML = '<span>CLOSE</span>';
               //       close.addEventListener('click', evt => container.remove());
               //       container.append(close);
               //       document.body.append(container);
               //    }
               // }

               screenshotBtn.addEventListener('click', () => {
                  const
                     container = document.getElementById(SELECTOR_SCREENSHOT_ID) || document.createElement('a'),
                     canvas = container.querySelector('canvas') || document.createElement('canvas');

                  canvas.width = NOVA.videoElement.videoWidth;
                  canvas.height = NOVA.videoElement.videoHeight
                  canvas.getContext('2d').drawImage(NOVA.videoElement, 0, 0, canvas.width, canvas.height);
                  try {
                     // fix Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
                     // ex: https://www.youtube.com/watch?v=FZovbrEP53o

                     canvas.toBlob(blob => container.href = URL.createObjectURL(blob));
                     // container.href = canvas.toDataURL(); // err in Brave browser (https://github.com/raingart/Nova-YouTube-extension/issues/8)
                  } catch (error) {
                     // alert("The video is protected. Can't take screenshot due to security policy");
                     // container.remove();
                  }
                  // create
                  if (!container.id) {
                     container.id = SELECTOR_SCREENSHOT_ID;
                     container.target = '_blank'; // useful link
                     container.title = 'Click to save';
                     if (headerContainer = document.getElementById('masthead-container')) { // skip embed
                        container.style.marginTop = (headerContainer?.offsetHeight || 0) + 'px'; // fix header indent
                        container.style.zIndex = +getComputedStyle(headerContainer)['z-index'] + 1; // fix header overlapping
                     }
                     canvas.addEventListener('click', evt => {
                        evt.preventDefault();
                        downloadCanvasAsImage(evt.target);
                        container.remove();
                     });
                     container.append(canvas);
                     const close = document.createElement('a');
                     close.className = 'close-btn'
                     // close.textContent = 'CLOSE';
                     close.innerHTML = '<span>CLOSE</span>';
                     close.addEventListener('click', evt => {
                        evt.preventDefault();
                        container.remove();
                     });
                     container.append(close);
                     document.body.append(container);
                  }
               });

               function downloadCanvasAsImage(canvas) {
                  const
                     downloadLink = document.createElement('a'),
                     downloadFileName =
                        [
                           movie_player.getVideoData().title
                              .replace(/[\\/:*?"<>|]+/g, '')
                              .replace(/\s+/g, ' ').trim(),
                           `[${NOVA.timeFormatTo.HMS.abbr(NOVA.videoElement.currentTime)}]`,
                        ]
                           .join(' ');

                  downloadLink.href = canvas.toBlob(blob => URL.createObjectURL(blob));
                  // downloadLink.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                  // container.href = canvas.toDataURL(); // err in Brave browser (https://github.com/raingart/Nova-YouTube-extension/issues/8)
                  downloadLink.download = downloadFileName + '.png';
                  downloadLink.click();
               }
               container.prepend(screenshotBtn);
            }

            if (user_settings.player_buttons_custom_items?.includes('thumbnail')) {
               // alt - https://greasyfork.org/en/scripts/19151-get-youtube-thumbnail
               // alt2 - https://greasyfork.org/en/scripts/367855-youtube-com-thumbnail
               const thumbBtn = document.createElement('button');
               thumbBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // thumbBtn.setAttribute('data-tooltip', 'View Thumbnail');
               thumbBtn.title = 'View Thumbnail';
               thumbBtn.innerHTML =
                  `<svg viewBox="0 -10 21 40" height="100%" width="100%">
                     <g fill="currentColor">
                        <circle cx='8' cy='7.2' r='2'/>
                        <path d='M0 2v16h20V2H0z M18 16H2V4h16V16z'/>
                        <polygon points='17 10.9 14 7.9 9 12.9 6 9.9 3 12.9 3 15 17 15' />
                     </g>
                  </svg>`;

               // getMaxThumbnailAvailable
               thumbBtn.addEventListener('click', async () => {
                  // Strategy 1 (API). skip embed
                  if (NOVA.currentPage == 'watch'
                     && (imgUrl = document.body.querySelector('ytd-watch, ytd-watch-flexy')
                        ?.playerData?.videoDetails?.thumbnail.thumbnails.pop().url)
                  ) return window.open(imgUrl);

                  // Strategy 2 (fetch)
                  const
                     videoId = movie_player.getVideoData().video_id || NOVA.queryURL.get('v'),
                     thumbSizeTemplate = [
                        // Warn! "maxresdefault" is not available everywhere. etc:
                        // https://i.ytimg.com/vi_webp/<VIDEO_ID>/maxresdefault.webp
                        // https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg
                        // https://i.ytimg.com/vi/<VIDEO_ID>/hqdefault.jpg
                        'maxres', // width: 1280
                        'sd', // width: 640
                        'hq', // width: 480
                        'mq', // width: 320
                        '' // width: 120
                     ];

                  document.body.style.cursor = 'wait';
                  for (const resPrefix of thumbSizeTemplate) {
                     const
                        imgUrl = `https://i.ytimg.com/vi/${videoId}/${resPrefix}default.jpg`,
                        response = await fetch(imgUrl);

                     if (response.status === 200) {
                        document.body.style.cursor = 'default';
                        window.open(imgUrl);
                        break;
                     }
                  }
               });
               container.prepend(thumbBtn);
            }

            if (user_settings.player_buttons_custom_items?.includes('rotate')) {
               // alt - https://github.com/zhzLuke96/ytp-rotate
               const rotateBtn = document.createElement('button');

               // if (NOVA.videoElement?.videoWidth < NOVA.videoElement?.videoHeight) {
               rotateBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               rotateBtn.title = 'Rotate video';
               Object.assign(rotateBtn.style, {
                  padding: '0 1.1em',
               });
               rotateBtn.innerHTML =
                  `<svg viewBox="0 0 1536 1536" height="100%" width="100%">
                     <g fill="currentColor">
                        <path
                           d="M1536 128v448q0 26-19 45t-45 19h-448q-42 0-59-40-17-39 14-69l138-138Q969 256 768 256q-104 0-198.5 40.5T406 406 296.5 569.5 256 768t40.5 198.5T406 1130t163.5 109.5T768 1280q119 0 225-52t179-147q7-10 23-12 14 0 25 9l137 138q9 8 9.5 20.5t-7.5 22.5q-109 132-264 204.5T768 1536q-156 0-298-61t-245-164-164-245T0 768t61-298 164-245T470 61 768 0q147 0 284.5 55.5T1297 212l130-129q29-31 70-14 39 17 39 59z"/>
                        </path>
                     </g>
                  </svg>`;
               rotateBtn.addEventListener('click', () => {
                  let angle = parseInt(NOVA.videoElement.style.transform.replace(/^\D+/g, '')) || 0;
                  // fix ratio scale. Before angle calc
                  const scale = (angle === 0 || angle === 180) ? movie_player.clientHeight / NOVA.videoElement.clientWidth : 1;
                  angle += 90;
                  NOVA.videoElement.style.transform = (angle === 360) ? '' : `rotate(${angle}deg) scale(${scale})`;
                  console.debug('rotate', angle, scale, NOVA.videoElement.style.transform);
               });
               container.prepend(rotateBtn);
               // }
            }

            if (user_settings.player_buttons_custom_items?.includes('watch-later')) {
               // alt https://openuserjs.org/scripts/zachhardesty7/YouTube_-_Add_Watch_Later_Button

               NOVA.waitElement('.ytp-watch-later-button')
                  .then(watchLaterDefault => {

                     NOVA.css.push(
                        `.${SELECTOR_BTN_CLASS_NAME} .ytp-spinner-container {
                           position: relative;
                           top: 0;
                           left: 0;
                           scale: .5;
                           margin: 0;
                        }
                        .${SELECTOR_BTN_CLASS_NAME}.watch-later-btn svg {
                           scale: .85;
                        }`);

                     const watchLaterBtn = document.createElement('button');

                     watchLaterBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} watch-later-btn`;
                     watchLaterBtn.title = 'Watch later';
                     renderIcon();
                     watchLaterBtn.addEventListener('click', () => {
                        watchLaterDefault.click();
                        renderIcon(); // render loading (.ytp-spinner)
                        const waitStatus = setInterval(() => {
                           // console.debug('wait svg. current show div ".ytp-spinner"');
                           if (watchLaterDefault.querySelector('svg')) {
                              // console.debug('svg ready');
                              clearInterval(waitStatus);
                              renderIcon();
                           }
                        }, 100); // check evry 100ms
                        // setTimeout(renderIcon, 1000); // 1 sec
                     });
                     //
                     // container.append(watchLaterBtn);
                     [...document.getElementsByClassName(SELECTOR_BTN_CLASS_NAME)].pop() // last custom btn
                        .after(watchLaterBtn);

                     function renderIcon() {
                        // <div class="ytp-spinner-container">
                        //    <div class="ytp-spinner-rotator">
                        //       <div class="ytp-spinner-left">
                        //          <div class="ytp-spinner-circle"></div>
                        //       </div>
                        //       <div class="ytp-spinner-right">
                        //          <div class="ytp-spinner-circle"></div>
                        //       </div>
                        //    </div>
                        // </div>

                        // return alt
                        //    ? `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                        //          <use class="ytp-svg-shadow" xlink:href="#ytp-id-25"></use>
                        //          <path class="ytp-svg-fill"
                        //             d="M18,8 C12.47,8 8,12.47 8,18 C8,23.52 12.47,28 18,28 C23.52,28 28,23.52 28,18 C28,12.47 23.52,8 18,8 L18,8 Z M16,19.02 L16,12.00 L18,12.00 L18,17.86 L23.10,20.81 L22.10,22.54 L16,19.02 Z"
                        //             id="ytp-id-25"></path>
                        //       </svg>`
                        //    : watchLater.querySelector('.ytp-watch-later-icon').innerHTML;
                        watchLaterBtn.innerHTML = watchLaterDefault.querySelector('.ytp-watch-later-icon')?.innerHTML;
                     }
                  });
            }

            if (user_settings.player_buttons_custom_items?.includes('quick-quality')) {
               const
                  // conteiner <a>
                  SELECTOR_QUALITY_CLASS_NAME = 'nova-quick-quality',
                  SELECTOR_QUALITY = '.' + SELECTOR_QUALITY_CLASS_NAME,
                  qualityConteinerBtn = document.createElement('a'),
                  // list <ul>
                  SELECTOR_QUALITY_LIST_ID = SELECTOR_QUALITY_CLASS_NAME + '-list',
                  SELECTOR_QUALITY_LIST = '#' + SELECTOR_QUALITY_LIST_ID,
                  listQuality = document.createElement('ul'),
                  // btn <span>
                  SELECTOR_QUALITY_BTN_ID = SELECTOR_QUALITY_CLASS_NAME + '-btn',
                  qualityBtn = document.createElement('span'),

                  qualityFormatList = {
                     highres: { label: '4320p', badge: '8K' },
                     hd2880: { label: '2880p', badge: '5K' },
                     hd2160: { label: '2160p', badge: '4K' },
                     hd1440: { label: '1440p', badge: 'QHD' },
                     hd1080: { label: '1080p', badge: 'FHD' },
                     // hd720: { label: '720p', badge: 'HD' },
                     hd720: { label: '720p', badge: 'ᴴᴰ' },
                     large: { label: '480p' },
                     medium: { label: '360p' },
                     small: { label: '240p' },
                     tiny: { label: '144p' },
                     auto: { label: 'auto' },
                  };

               NOVA.css.push(
                  SELECTOR_QUALITY + ` {
                     overflow: visible !important;
                     position: relative;
                     text-align: center !important;
                     vertical-align: top;
                     font-weight: bold;
                  }

                  ${SELECTOR_QUALITY_LIST} {
                     position: absolute;
                     bottom: 4em;
                     left: -2em;
                     list-style: none;
                     padding-bottom: .5em;
                     z-index: ${+getComputedStyle(document.body.querySelector('.ytp-progress-bar'))['z-index'] + 1};
                  }

                  /* for embed */
                  html[data-cast-api-enabled] ${SELECTOR_QUALITY_LIST} {
                     margin: 0;
                     padding: 0;
                     bottom: 3.3em;
                     /* --yt-spec-brand-button-background: #c00; */
                  }

                  ${SELECTOR_QUALITY}:not(:hover) ${SELECTOR_QUALITY_LIST} {
                     display: none;
                  }

                  ${SELECTOR_QUALITY_LIST} li {
                     cursor: pointer;
                     line-height: 1.4;
                     background: rgba(28, 28, 28, 0.9);
                     margin: .3em 0;
                     padding: .5em 3em;
                     border-radius: .3em;
                     color: #fff;
                  }

                  ${SELECTOR_QUALITY_LIST} li .quality-menu-item-label-badge {
                     position: absolute;
                     right: 1em;
                     width: 1.7em;
                  }

                  ${SELECTOR_QUALITY_LIST} li.active { background: #720000; }
                  ${SELECTOR_QUALITY_LIST} li:hover:not(.active) { background: #c00; }`);
               // ${SELECTOR_QUALITY_LIST} li:hover:not(.active) { background-color: var(--yt-spec-brand-button-background); }`);
               // conteiner <a>
               qualityConteinerBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_QUALITY_CLASS_NAME}`;
               // qualityConteinerBtn.title = 'Change quality';
               // btn <span>
               qualityBtn.id = SELECTOR_QUALITY_BTN_ID;
               qualityBtn.textContent = qualityFormatList[movie_player.getPlaybackQuality()]?.label || '[out of range]';
               // list <ul>
               listQuality.id = SELECTOR_QUALITY_LIST_ID;

               // show current quality
               movie_player.addEventListener('onPlaybackQualityChange', quality => {
                  document.getElementById(SELECTOR_QUALITY_BTN_ID)
                     .textContent = qualityFormatList[quality]?.label || '[out of range]';
                  // .textContent = movie_player.getVideoData().video_quality
                  // dirty hack (clear list) replaces this prototype code
                  // document.getElementById(SELECTOR_QUALITY_LIST_ID li..) li.className = 'active';
               });

               qualityConteinerBtn.prepend(qualityBtn);
               qualityConteinerBtn.append(listQuality);

               container.prepend(qualityConteinerBtn);

               fillQualityMenu(); // init

               NOVA.videoElement?.addEventListener('canplay', fillQualityMenu); // update

               function fillQualityMenu() {
                  if (qualityList = document.getElementById(SELECTOR_QUALITY_LIST_ID)) {
                     qualityList.innerHTML = '';

                     movie_player.getAvailableQualityLevels()
                        .forEach(quality => {
                           const qualityItem = document.createElement('li');
                           // if (movie_player.getVideoData().video_quality == quality) qualityItem.className = 'active';
                           if (movie_player.getPlaybackQuality() == quality) qualityItem.className = 'active';
                           // qualityList.innerHTML =
                           //    `<span class="quality-menu-item-text">1080p</span>
                           //    <span class="quality-menu-item-label-badge">HD</span>`;
                           if (qualityData = qualityFormatList[quality]) {
                              qualityItem.textContent = qualityData.label;
                              if (badge = qualityData.badge) {
                                 qualityItem.insertAdjacentHTML('beforeend',
                                    `<span class="quality-menu-item-label-badge">${badge}</span>`);
                              }
                              qualityItem.addEventListener('click', () => {
                                 // console.debug('setPlaybackQuality', quality);
                                 movie_player.setPlaybackQualityRange(quality, quality);
                                 // movie_player.setPlaybackQuality(quality); // Doesn't work
                                 qualityList.innerHTML = ''; // dirty hack (clear list)
                              })
                              qualityList.append(qualityItem);
                           }
                        });
                  }
               }
            }

            if (user_settings.player_buttons_custom_items?.includes('toggle-speed')) {
               const
                  speedBtn = document.createElement('a'),
                  hotkey = user_settings.player_buttons_custom_hotkey_toggle_speed || 'a',
                  defaultRateText = '1x';
               // `<svg viewBox="0 0 36 36" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path d="m 27.526463,13.161756 -1.400912,2.107062 a 9.1116182,9.1116182 0 0 1 -0.250569,8.633258 H 10.089103 A 9.1116182,9.1116182 0 0 1 22.059491,11.202758h24.166553,9.8018471 A 11.389523,11.389523 0 0 0 8.1301049,25.041029 2.2779046,2.2779046 0 0 0 10.089103,26.179981 H 25.863592 A 2.2779046,2.2779046 0 0 0 27.845369,25.041029 11.389523,11.389523 0 0 0 27.537852,13.150367 Zs16.376119,20.95219 a 2.2779046,2.2779046 0 0 0 3.223235,0h6.446471,-9.669705 -9.669706,6.44647 a 2.2779046,2.2779046 0 0 0 0,3.223235 z" />
               //    </g>
               // </svg>`;

               let rateOrig = {};

               speedBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               speedBtn.style.textAlign = 'center';
               speedBtn.style.fontWeight = 'bold';
               speedBtn.innerHTML = defaultRateText;
               speedBtn.title = `Toggle speed to ${defaultRateText} (${hotkey})`;
               // hotkey
               document.addEventListener('keyup', evt => {
                  if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if (evt.key === hotkey) {
                     switchRate();
                  }
               })
               speedBtn.addEventListener('click', switchRate);

               function switchRate() {
                  // restore orig
                  if (Object.keys(rateOrig).length) {
                     playerRate.set(rateOrig);
                     rateOrig = {};
                     speedBtn.innerHTML = defaultRateText;

                  } else { // return default
                     rateOrig = (movie_player && NOVA.videoElement.playbackRate % .25) === 0
                        ? { 'default': movie_player.getPlaybackRate() }
                        : { 'html5': NOVA.videoElement.playbackRate };

                     let resetRate = Object.assign({}, rateOrig); // clone obj
                     resetRate[Object.keys(resetRate)[0]] = 1; // first property of object
                     playerRate.set(resetRate);

                     speedBtn.textContent = rateOrig[Object.keys(rateOrig)[0]] + 'x';
                  }
                  speedBtn.title = `Switch to ${speedBtn.textContent} (${hotkey})`;
                  // console.debug('rateOrig', rateOrig);
               }

               const playerRate = {
                  set(obj) {
                     if (obj.hasOwnProperty('html5') || !movie_player) {
                        NOVA.videoElement.playbackRate = obj.html5;

                     } else {
                        movie_player.setPlaybackRate(obj.default);
                     }
                     // this.saveInSession(obj.html5 || obj.default);
                  },

                  // saveInSession(level = required()) {
                  //    try {
                  //       sessionStorage['yt-player-playback-rate'] = JSON.stringify({
                  //          creation: Date.now(), data: level.toString(),
                  //       })
                  //       // console.log('playbackRate save in session:', ...arguments);

                  //    } catch (err) {
                  //       console.info(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
                  //    }
                  // },
               };

               container.prepend(speedBtn);

               visibilitySwitch(); // init

               NOVA.videoElement?.addEventListener('ratechange', visibilitySwitch); // update #1
               // reset speedBtn state
               NOVA.videoElement?.addEventListener('loadeddata', () => { // update #2
                  rateOrig = {};
                  speedBtn.textContent = defaultRateText;
                  visibilitySwitch();
               });

               function visibilitySwitch() {
                  if (!Object.keys(rateOrig).length) {
                     // speedBtn.style.visibility = /*movie_player.getPlaybackRate() ===*/ NOVA.videoElement.playbackRate === 1 ? 'hidden' : 'visible';
                     speedBtn.style.display = /*movie_player.getPlaybackRate() ===*/ NOVA.videoElement?.playbackRate === 1 ? 'none' : '';
                  }
               }
            }
         });

   },
   options: {
      player_buttons_custom_items: {
         _tagName: 'select',
         label: 'Buttons',
         'label:zh': '纽扣',
         'label:ja': 'ボタン',
         'label:ko': '버튼',
         'label:id': 'Tombol',
         'label:es': 'Botones',
         'label:pt': 'Botões',
         'label:fr': 'Boutons',
         'label:it': 'Bottoni',
         // 'label:tr': 'Düğmeler',
         'label:de': 'Tasten',
         'label:pl': 'Przyciski',
         'label:ua': 'Кнопки',
         title: '[Ctrl+Click] to select several',
         'title:zh': '[Ctrl+Click] 选择多个',
         'title:ja': '「Ctrl+Click」して、いくつかを選択します',
         'title:ko': '[Ctrl+Click] 여러 선택',
         'title:id': '[Ctrl+Klik] untuk memilih beberapa',
         'title:es': '[Ctrl+Click] para seleccionar varias',
         'title:pt': '[Ctrl+Click] para selecionar vários',
         'title:fr': '[Ctrl+Click] pour sélectionner plusieurs',
         'title:it': '[Ctrl+Clic] per selezionarne diversi',
         // 'title:tr': 'Birkaç tane seçmek için [Ctrl+Tıkla]',
         'title:de': '[Ctrl+Click] um mehrere auszuwählen',
         'title:pl': 'Ctrl+kliknięcie, aby zaznaczyć kilka',
         'title:ua': '[Ctrl+Click] щоб обрати декілька',
         multiple: null, // dont use - selected: true
         required: true, // dont use - selected: true
         size: 4, // = options.length
         options: [
            {
               label: 'quick quality', value: 'quick-quality',
               'label:zh': '质量',
               'label:ja': '品質',
               'label:ko': '품질',
               'label:id': 'kualitas',
               'label:es': 'calidad',
               'label:pt': 'qualidade',
               'label:fr': 'qualité',
               'label:it': 'qualità',
               // 'label:tr': 'hızlı kalite',
               'label:de': 'qualität',
               'label:pl': 'jakość',
               'label:ua': 'якість',
            },
            {
               label: 'toggle speed', value: 'toggle-speed',
               'label:zh': '切换速度',
               'label:ja': 'トグル速度',
               'label:ko': '토글 속도',
               'label:id': 'beralih kecepatan',
               'label:es': 'alternar velocidad',
               'label:pt': 'velocidade de alternância',
               'label:fr': 'basculer la vitesse',
               'label:it': 'alternare la velocità',
               // 'label:tr': 'geçiş hızı',
               'label:de': 'geschwindigkeit umschalten',
               'label:pl': 'szybkość',
               'label:ua': 'швидкість',
            },
            {
               label: 'screenshot', value: 'screenshot',
               'label:zh': '截屏',
               'label:ja': 'スクリーンショット',
               'label:ko': '스크린샷',
               'label:id': 'tangkapan layar',
               'label:es': 'captura de pantalla',
               'label:pt': 'captura de tela',
               'label:fr': "capture d'écran",
               'label:it': 'immagine dello schermo',
               // 'label:tr': 'ekran görüntüsü',
               'label:de': 'bildschirmfoto',
               // 'label:pl': 'screenshot'
               'label:ua': 'фото екрану',
            },
            {
               label: 'picture-in-picture', value: 'picture-in-picture',
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
               'label:pl': 'obraz w obrazie',
               'label:ua': 'картинка в картинці',
            },
            {
               label: 'popup', value: 'popup',
               'label:zh': '弹出式播放器',
               'label:ja': 'ポップアッププレーヤー',
               'label:ko': '썸네일',
               'label:id': 'muncul',
               // 'label:es': 'jugadora emergente',
               'label:pt': 'jogador pop-up',
               'label:fr': 'lecteur contextuel',
               'label:it': 'apparire',
               // 'label:tr': 'pop-up oynatıcı',
               'label:de': 'auftauchen',
               'label:pl': 'w okienku',
               'label:ua': 'спливаюче повідомлення',
            },
            {
               label: 'rotate', value: 'rotate',
               'label:zh': '旋转',
               'label:ja': '回転する',
               'label:ko': '회전',
               'label:id': 'memutar',
               'label:es': 'girar',
               'label:pt': 'girar',
               'label:fr': 'tourner',
               'label:it': 'ruotare',
               // 'label:tr': 'döndürmek',
               'label:de': 'drehen',
               'label:pl': 'obróć',
               'label:ua': 'повернути',
            },
            {
               label: 'watch later', value: 'watch-later',
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
               'label:ua': 'переглянути пізніше',
            },
            {
               label: 'thumbnail', value: 'thumbnail',
               'label:zh': '缩略图',
               'label:ja': 'サムネイル',
               'label:ko': '썸네일',
               // 'label:id': 'miniatura',
               'label:es': 'miniatura',
               'label:pt': 'captura de tela',
               'label:fr': 'la vignette',
               'label:it': 'miniatura',
               // 'label:tr': 'küçük resim',
               'label:de': 'bildschirmfoto',
               'label:pl': 'miniaturka',
               'label:ua': 'мініатюра',
            },
         ],
      },
      player_buttons_custom_popup_width: {
         _tagName: 'input',
         label: 'Player window size aspect ratio',
         'label:zh': '播放器窗口大小纵横比',
         'label:ja': 'プレーヤーのウィンドウサイズのアスペクト比',
         'label:ko': '플레이어 창 크기 종횡비',
         'label:id': 'Rasio aspek ukuran jendela pemutar',
         'label:es': 'Relación de aspecto del tamaño de la ventana del reproductor',
         'label:pt': 'Proporção do tamanho da janela do jogador',
         'label:fr': "Rapport d'aspect de la taille de la fenêtre du lecteur",
         'label:it': 'Proporzioni della dimensione della finestra del lettore',
         // 'label:tr': 'Oyuncu penceresi boyutu en boy oranı',
         'label:de': 'Seitenverhältnis der Player-Fenstergröße',
         'label:pl': 'Rozmiar okna odtwarzacza',
         'label:ua': 'Співвідношення розміру вікна відтворювача',
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
         // title: '',
         placeholder: '1.5-4',
         step: 0.1,
         min: 1.5,
         max: 4,
         value: 2.5,
         'data-dependent': { 'player_buttons_custom_items': ['popup'] },
      },
      player_buttons_custom_hotkey_toggle_speed: {
         _tagName: 'select',
         label: 'Hotkey toggle speed',
         'label:zh': '热键切换速度',
         'label:ja': '速度を切り替えるためのホットボタン',
         'label:ko': '단축키 토글 속도',
         'label:id': 'Kecepatan beralih tombol pintas',
         'label:es': 'Velocidad de cambio de teclas de acceso rápido',
         'label:pt': 'Velocidade de alternância da tecla de atalho',
         'label:fr': 'Vitesse de basculement des raccourcis clavier',
         'label:it': 'Tasto di scelta rapida per attivare/disattivare la velocità',
         // 'label:tr': 'Kısayol geçiş hızı',
         'label:de': 'Hotkey-Umschaltgeschwindigkeit',
         'label:pl': 'Skrót przełączania prędkości',
         'label:ua': 'Гаряча клавіша увімкнути швидкість',
         // title: '',
         options: [
            { label: 'A', value: 'a', selected: true },
            'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
         ],
         'data-dependent': { 'player_buttons_custom_items': ['toggle-speed'] },
      },
   }
});
