// for help
// https://svgtrace.com/png-to-svg - convert
// https://boxy-svg.com/app - editor

window.nova_plugins.push({
   // id: 'player-quick-controls',
   id: 'player-quick-buttons',
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

      // NOVA.waitSelector('.ytp-left-controls')
      NOVA.waitSelector('#movie_player .ytp-right-controls')
         .then(async container => {
            // container.prepend(new-el);
            // container.insertBefore(new-el, container.childNodes[0])

            NOVA.videoElement = await NOVA.waitSelector('video'); // wait load video. rewrite just in case

            // global
            NOVA.css.push(
               `${SELECTOR_BTN} {
                  user-select: none;
                  /*padding: 5px;
                  width: 25px;*/
               }
               ${SELECTOR_BTN}:hover { color: #66afe9 !important; }
               ${SELECTOR_BTN}:active { color: #2196f3 !important; }`);

            // custon tooltip (with animation)
            // NOVA.css.push(
            //    `${SELECTOR_BTN}[tooltip]::before {
            //       content: attr(tooltip);
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
            //    ${SELECTOR_BTN}[tooltip]:hover::before {
            //       --scale: 1
            //    }`);
            NOVA.css.push(
               `${SELECTOR_BTN}[tooltip]:hover::before {
                  content: attr(tooltip);
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
               html[data-cast-api-enabled] ${SELECTOR_BTN}[tooltip]:hover::before {
                  font-weight: normal;
               }`);

            // picture-in-picture player
            if (user_settings.player_buttons_custom_items?.includes('picture-in-picture')) {
               // alt - https://greasyfork.org/en/scripts/463641-enable-the-built-in-pip-button-on-youtube-media-control
               const pipBtn = document.createElement('button');
               pipBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // pipBtn.title = 'Open in PictureInPicture';
               pipBtn.setAttribute('tooltip', 'Open in PictureInPicture');
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
                  const path = document.createElement('path');
                  path.setAttribute('fill', 'currentColor');
                  path.setAttribute('d', alt
                     ? 'M18.5,11H18v1h.5A1.5,1.5,0,0,1,20,13.5v5A1.5,1.5,0,0,1,18.5,20h-8A1.5,1.5,0,0,1,9,18.5V18H8v.5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z M14.5,4H2.5A2.5,2.5,0,0,0,0,6.5v8A2.5,2.5,0,0,0,2.5,17h12A2.5,2.5,0,0,0,17,14.5v-8A2.5,2.5,0,0,0,14.5,4Z'
                     : 'M2.5,17A1.5,1.5,0,0,1,1,15.5v-9A1.5,1.5,0,0,1,2.5,5h13A1.5,1.5,0,0,1,17,6.5V10h1V6.5A2.5,2.5,0,0,0,15.5,4H2.5A2.5,2.5,0,0,0,0,6.5v9A2.5,2.5,0,0,0,2.5,18H7V17Z M18.5,11h-8A2.5,2.5,0,0,0,8,13.5v5A2.5,2.5,0,0,0,10.5,21h8A2.5,2.5,0,0,0,21,18.5v-5A2.5,2.5,0,0,0,18.5,11Z');
                  svg.append(path);
                  return svg.outerHTML;
               }
            }

            // Pop-up player
            if (user_settings.player_buttons_custom_items?.indexOf('popup') !== -1 && !NOVA.queryURL.has('popup')) {
               // alt1 - https://greasyfork.org/en/scripts/401907-youtube-popout-button-mashup
               // alt2 - https://chrome.google.com/webstore/detail/gibipneadnbflmkebnmcbgjdkngkbklb
               const popupBtn = document.createElement('button');
               popupBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // popupBtn.title = 'Open in popup';
               popupBtn.setAttribute('tooltip', 'Open in popup');
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
                  const { width, height } = NOVA.aspectRatio.sizeToFit({
                     'srcWidth': NOVA.videoElement.videoWidth,
                     'srcHeight': NOVA.videoElement.videoHeight,
                     // 'maxWidth': screen.width / (+user_settings.player_buttons_custom_popup_width || 4),
                  });

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
                  newWindow.document.title = title;
               }
            }

            if (user_settings.player_buttons_custom_items?.includes('screenshot')) {
               // alt1 - https://greasyfork.org/en/scripts/455155-youtube-screenshot
               // alt2 - https://greasyfork.org/en/scripts/466259-youtube-video-screenshot
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
               // screenshotBtn.title = 'Take screenshot';
               screenshotBtn.setAttribute('tooltip', 'Take screenshot');
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
                  canvas.title = 'Click to save';
                  try {
                     // fix Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
                     // ex: https://www.youtube.com/watch?v=FZovbrEP53o

                     canvas.toBlob(blob => {
                        container.href = URL.createObjectURL(blob);
                        // copy to clipboard
                        if (user_settings.player_buttons_custom_screenshot_to_clipboard) {
                           navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                        }
                     }, `image/${user_settings.player_buttons_custom_screenshot || 'png'}`);
                     // container.href = canvas.toDataURL(); // err in Brave browser (https://github.com/raingart/Nova-YouTube-extension/issues/8)
                  } catch (error) {
                     // alert("The video is protected. Can't take screenshot due to security policy");
                     // container.remove();
                  }
                  // create
                  if (!container.id) {
                     container.id = SELECTOR_SCREENSHOT_ID;
                     container.target = '_blank'; // useful link
                     // skip embed
                     if (headerContainer = document.getElementById('masthead-container')) {
                        // fix header indent
                        container.style.marginTop = (headerContainer?.offsetHeight || 0) + 'px';
                        // fix header overlapping
                        container.style.zIndex = +getComputedStyle(headerContainer)['z-index'] + 1;
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
                     close.title = 'Close';
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
                  downloadLink.download = downloadFileName +
                     '.' + (user_settings.player_buttons_custom_screenshot || 'png');
                  downloadLink.click();
                  // URL.revokeObjectURL(downloadLink.href);
               }
               container.prepend(screenshotBtn);
            }

            if (user_settings.player_buttons_custom_items?.includes('thumbnail')) {
               // info https://gist.github.com/iredun/a9681c46d3d74e03fb35d9ebf198b83d
               // alt1 - https://greasyfork.org/en/scripts/19151-get-youtube-thumbnail
               // alt2 - https://greasyfork.org/en/scripts/367855-youtube-com-thumbnail
               // alt3 - https://greasyfork.org/en/scripts/457800-youtube-thumbnail-viewer
               // alt4 - https://greasyfork.org/en/scripts/459456-add-youtube-thumbnail-to-video-description
               // alt5 - https://greasyfork.org/en/scripts/460610-youtube-thumbnail-viewer
               // alt6 - https://chrome.google.com/webstore/detail/bjchdihmmgfbfheblpmfpaojmjchdioi
               const thumbBtn = document.createElement('button');
               thumbBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // thumbBtn.title = 'View Thumbnail';
               // thumbBtn.setAttribute('data-tooltip', 'View Thumbnail');
               thumbBtn.setAttribute('tooltip', 'View Thumbnail');
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
                  // Strategy 1 (API). Skip embed
                  // if (NOVA.currentPage == 'watch'
                  //    && (imgUrl = document.body.querySelector('ytd-watch-flexy')?.playerData?.videoDetails?.thumbnail.thumbnails.pop().url)
                  // ) {
                  //    return window.open(imgUrl);
                  // }

                  // Strategy 2 (fetch)
                  const
                     videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id,
                     thumbsSizesTemplate = [
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
                  for (const resPrefix of thumbsSizesTemplate) {
                     const
                        imgUrl = `https://i.ytimg.com/vi/${videoId}/${resPrefix}default.jpg`,
                        response = await fetch(imgUrl);

                     if (response.status === 200) {
                        document.body.style.cursor = 'default';
                        window.open(imgUrl);
                        break;
                     }

                     // const thumbnail_image = new Image();
                     // thumbnail_image.addEventListener("load", checkHighQualityThumbnail, false);
                  }
               });
               container.prepend(thumbBtn);
            }

            if (user_settings.player_buttons_custom_items?.includes('rotate')) {
               // for test:
               // https://www.youtube.com/watch?v=RPMgLld0P58
               // alt1 - https://github.com/zhzLuke96/ytp-rotate
               // alt2 - https://greasyfork.org/en/scripts/375568
               const
                  hotkey = user_settings.player_buttons_custom_hotkey_rotate || 'r',
                  rotateBtn = document.createElement('button');

               // if (NOVA.videoElement?.videoWidth < NOVA.videoElement?.videoHeight) {
               rotateBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // rotateBtn.title = 'Rotate video';
               rotateBtn.setAttribute('tooltip', `Rotate video (${hotkey})`);
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
               rotateBtn.addEventListener('click', rotateVideo);
               // hotkey
               document.addEventListener('keyup', evt => {
                  if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if (evt.key === hotkey) {
                     rotateVideo();
                  }
               });
               function rotateVideo() {
                  // get first number part (rotate, without scale). Code: remove text before numbers, and extract first number group
                  let angle = parseInt(NOVA.videoElement.style.transform.replace(/\D+/, '')) || 0;
                  // fix ratio scale. Before angle calc
                  const scale = (angle === 0 || angle === 180) ? movie_player.clientHeight / NOVA.videoElement.clientWidth : 1;
                  angle += 90;
                  NOVA.videoElement.style.transform = (angle === 360) ? '' : `rotate(${angle}deg) scale(${scale})`;
                  // console.debug('rotate', angle, scale, NOVA.videoElement.style.transform);
               }
               container.prepend(rotateBtn);
               // }
            }

            if (user_settings.player_buttons_custom_items?.includes('aspect-ratio')) {
               // alt - https://greasyfork.org/en/scripts/370586-youtube-aspect-ratio-switcher
               const
                  aspectRatioBtn = document.createElement('a'),
                  // Strategy 1. https://codepen.io/JacobLett/pen/YWeOMo
                  // aspectRatioList = [
                  //    { '16:9': 'calc(100% / 16 * 9)' }, // HD, FHD, QHD, 4K, 8K
                  //    { '4:3': 'calc(100% / 4 * 3)' }, // HD, FHD, QHD, 4K, 8K
                  //    // { '9:16': 1.777777778 }, // mobile
                  //    { '21:9': 'calc(100% / 21 * 9)' },
                  //    // { '16:9': Math.round((NOVA.videoElement.clientWidth / 16) * 9) + 'px' }, // HD, FHD, QHD, 4K, 8K
                  //    // { '4:3': Math.round((NOVA.videoElement.clientWidth / 4) * 3) + 'px' }, // HD, FHD, QHD, 4K, 8K
                  //    // // { '9:16': 1.777777778 }, // mobile
                  //    // { '21:9': Math.round((NOVA.videoElement.clientWidth / 21) * 9) + 'px' },
                  //    // { 'default': '100%' },
                  //    // hd720: { label: '720p', badge: 'HD' },
                  // ];
                  // Strategy 2
                  aspectRatioList = [
                     { '16:9': 1.335 }, // HD, FHD, QHD, 4K, 8K
                     { '4:3': .75 }, // HD, FHD, QHD, 4K, 8K
                     { '9:16': 1.777777778 }, // mobile
                     { 'auto': 1 },
                     // hd720: { label: '720p', badge: 'HD' },
                  ],
                  genTooltip = (key = 0) => `Switch aspect ratio to ` + Object.keys(aspectRatioList[key]);

               // if (NOVA.videoElement?.videoWidth < NOVA.videoElement?.videoHeight) {
               aspectRatioBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               aspectRatioBtn.style.textAlign = 'center';
               aspectRatioBtn.style.fontWeight = 'bold';
               // aspectRatioBtn.title = genTooltip(Object.keys(aspectRatioList[0])));
               aspectRatioBtn.setAttribute('tooltip', genTooltip());
               aspectRatioBtn.innerHTML = '1:1';

               aspectRatioBtn.addEventListener('click', () => {
                  if (!NOVA.videoElement) return;
                  const getNextIdx = () => (this.listIdx < aspectRatioList.length - 1) ? this.listIdx + 1 : 0;

                  this.listIdx = getNextIdx();
                  // Strategy 1
                  // NOVA.videoElement.style.width = Object.values(aspectRatioList[this.listIdx]);
                  // Object.assign(NOVA.videoElement.style, { 'object-fit': 'fill', }); // object-fit: cover;
                  // console.debug('>', NOVA.videoElement.style.width);
                  // Strategy 2
                  NOVA.videoElement.style.transform = `scaleX(${Object.values(aspectRatioList[this.listIdx])})`;

                  aspectRatioBtn.setAttribute('tooltip', genTooltip(getNextIdx()));
                  aspectRatioBtn.textContent = Object.keys(aspectRatioList[this.listIdx]);
               });
               container.prepend(aspectRatioBtn);
               // }
            }

            if (user_settings.player_buttons_custom_items?.includes('watch-later')) {
               // alt1 https://openuserjs.org/scripts/zachhardesty7/YouTube_-_Add_Watch_Later_Button
               // alt2 https://greasyfork.org/en/scripts/419656-youtube-add-watch-later-button
               // alt3 - https://greasyfork.org/en/scripts/462336-persistent-youtube-video-queue
               NOVA.waitSelector('.ytp-watch-later-button')
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
                     // watchLaterBtn.title = 'Watch later';
                     watchLaterBtn.setAttribute('tooltip', 'Watch later');
                     renderIcon();
                     watchLaterBtn.addEventListener('click', () => {
                        watchLaterDefault.click();
                        renderIcon(); // render loading (.ytp-spinner)
                        const waitStatus = setInterval(() => {
                           // console.debug('wait svg. Current show div '.ytp-spinner'
                           if (watchLaterDefault.querySelector('svg')) {
                              // console.debug('svg ready');
                              clearInterval(waitStatus);
                              renderIcon();
                           }
                        }, 100); // check every 100ms
                        // setTimeout(renderIcon, 1000); // 1 sec
                     });
                     //
                     // container.append(watchLaterBtn);
                     [...document.getElementsByClassName(SELECTOR_BTN_CLASS_NAME)].pop() // last custom btn
                        ?.after(watchLaterBtn);

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

            // alt - https://greasyfork.org/en/scripts/434527-youtube-remove-overlays
            if (user_settings.player_buttons_custom_items?.includes('card-switch')
               // conflict with plugin [player-hide-elements] option (videowall+card)
               && !user_settings.player_hide_elements?.includes('videowall_endscreen')
               && !user_settings.player_hide_elements?.includes('card_endscreen')
            ) {
               const
                  cardAttrName = 'nova-hide-endscreen',
                  cardBtn = document.createElement('button');

               NOVA.css.push(
                  `#movie_player[${cardAttrName}] .videowall-endscreen,
                  #movie_player[${cardAttrName}] .ytp-pause-overlay,
                  #movie_player[${cardAttrName}] [class^="ytp-ce-"] {
                     display: none !important;
                  }`);

               cardBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // cardBtn.title = 'Сard display switch';
               // cardBtn.setAttribute('tooltip', 'Сard display switch');
               cardBtn.innerHTML = createSVG();
               // cardBtn.innerHTML =
               // `<svg viewBox="-300 0 1600 1000" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path
               //          d="M500.2,255c123,0,222.8,99.8,222.8,222.8c0,29-5.8,56.2-16,81.5l130.1,130.1c67.3-56.2,120.3-128.8,152.8-211.7c-77.1-195.7-267.3-334.3-490.2-334.3c-62.4,0-122.1,11.2-177.3,31.2l96.3,96.3C444.1,260.7,471.3,255,500.2,255z M54.6,133.3l101.6,101.6l20.5,20.5C102.7,312.9,44.8,389.5,10,477.8C87.1,673.4,277.4,812,500.2,812c69.1,0,135-13.3,195.2-37.4l18.7,18.7l130.6,130.1l56.6-56.6L111.2,76.6C111.2,76.7,54.6,133.3,54.6,133.3z M301,379.7l69.1,69.1c-2.2,9.4-3.6,19.1-3.6,29c0,73.9,59.7,133.7,133.7,133.7c9.8,0,19.6-1.3,29-3.6l69.1,69.1c-29.8,14.7-62.9,23.6-98,23.6c-123,0-222.8-99.8-222.8-222.8C277.4,442.5,286.3,409.6,301,379.7z M493.1,344.9l140.4,140.4l0.9-7.1c0-73.9-59.7-133.7-133.7-133.7L493.1,344.9z" />
               //    </g>
               // </svg>`;

               // `<svg viewBox="-250 0 1012 512" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path
               //          d="M 14.491 1.865 C 7.090 5.228, 2.011 13.218, 2.011 21.500 C 2.011 30.863, -11.596 16.733, 236.330 264.819 C 364.024 392.594, 470.075 497.945, 472 498.933 C 483.851 505.015, 497.892 499.705, 502.608 487.357 C 504.556 482.254, 504.054 474.939, 501.403 469.813 C 498.753 464.687, 38.357 4.733, 33.290 2.148 C 28.031 -0.535, 20.039 -0.655, 14.491 1.865 M 247.500 9.466 C 239.927 10.856, 238.422 11.437, 208.500 24.515 C 197.500 29.322, 181.975 36.055, 174 39.475 C 150.676 49.480, 149.046 50.461, 149.015 54.508 C 148.998 56.762, 324.585 233, 326.848 233 C 328.352 233, 336.658 229.531, 370 214.976 C 382.925 209.333, 396.875 203.256, 401 201.469 C 405.125 199.683, 421.100 192.731, 436.500 186.019 C 451.900 179.308, 470.800 171.100, 478.500 167.780 C 494.791 160.756, 499.835 157.553, 503.889 151.661 C 512.529 139.104, 511.731 122.736, 501.937 111.581 C 497.482 106.507, 493.923 104.411, 478.500 97.777 C 471.350 94.702, 458.300 89.053, 449.500 85.224 C 440.700 81.395, 419.775 72.311, 403 65.038 C 386.225 57.764, 370.475 50.916, 368 49.821 C 359.389 46.012, 304.413 22.165, 291.205 16.510 C 272.418 8.467, 262.046 6.795, 247.500 9.466 M 16.846 111.250 C 11.394 115.687, 7.412 127.337, 8.419 135.905 C 9.195 142.509, 12.638 150.291, 16.684 154.588 C 20.750 158.907, 26.110 161.842, 44.500 169.820 C 53.300 173.638, 65.823 179.091, 72.329 181.939 C 79.315 184.998, 85.241 186.991, 86.805 186.809 C 89.708 186.470, 92.061 182.949, 91.308 180.070 C 90.520 177.057, 22.668 110, 20.408 110 C 19.294 110, 17.691 110.563, 16.846 111.250 M 46.500 222.871 C 18.987 234.913, 16.170 236.870, 11.407 247.238 C 6.027 258.952, 7.868 272.356, 16.162 281.859 C 20.107 286.379, 23.802 288.871, 31.500 292.203 C 56.618 303.075, 69.066 308.487, 72.500 310.027 C 74.700 311.014, 87.075 316.410, 100 322.017 C 112.925 327.625, 130.700 335.370, 139.500 339.230 C 148.300 343.090, 165.400 350.531, 177.500 355.765 C 189.600 360.999, 203.550 367.059, 208.500 369.230 C 244.458 385.006, 245.742 385.383, 261.424 384.776 C 269.709 384.455, 274.264 383.736, 279.500 381.923 C 290.364 378.162, 290.277 377.930, 270.464 357.993 C 256.805 344.248, 252.828 340.819, 248.631 339.171 C 245.809 338.063, 235.850 333.803, 226.500 329.705 C 217.150 325.607, 195.775 316.297, 179 309.017 C 162.225 301.736, 136.125 290.382, 121 283.787 C 105.875 277.191, 88.821 269.796, 83.101 267.353 C 67.449 260.667, 67.976 261.069, 72.085 258.961 C 79.964 254.919, 84.263 248.049, 84.263 239.500 C 84.263 230.658, 79.697 223.639, 71.500 219.879 C 64.686 216.753, 58.894 217.446, 46.500 222.871 M 444.500 220.932 C 437.802 224.834, 434.727 229.624, 434.195 236.988 C 433.490 246.730, 436.577 252.874, 444.800 258.088 L 449.242 260.905 440.481 264.953 C 435.663 267.179, 431.549 269, 431.339 269 C 430.437 269, 389.382 287.334, 388.250 288.242 C 384.842 290.976, 386.848 294.187, 400.704 308.170 C 409.532 317.079, 415.136 321.992, 416.454 321.978 C 417.579 321.966, 425.700 318.809, 434.500 314.962 C 443.300 311.115, 457.025 305.165, 465 301.740 C 489.713 291.127, 499.050 286.053, 502.650 281.282 C 512.458 268.283, 512.166 251.232, 501.937 239.581 C 497.373 234.383, 493.998 232.452, 475.916 224.690 C 457.247 216.676, 452.732 216.136, 444.500 220.932 M 41.558 352.042 C 23.014 360.122, 19.098 362.507, 14.909 368.269 C 9.855 375.223, 8.685 378.807, 8.633 387.500 C 8.580 396.183, 10.410 401.738, 15.537 408.459 C 19.299 413.392, 24.736 416.414, 47.500 426.225 C 85.681 442.681, 93.516 446.076, 96.500 447.458 C 100.088 449.120, 135.211 464.385, 150 470.709 C 155.775 473.179, 162.300 476.014, 164.500 477.010 C 166.700 478.006, 182.225 484.753, 199 492.004 C 215.775 499.255, 231.525 506.074, 234 507.156 C 245.100 512.013, 261.527 513.378, 273.862 510.471 C 277.362 509.646, 291.762 503.965, 305.862 497.846 C 319.963 491.727, 336.675 484.508, 343 481.803 C 349.325 479.098, 358.100 475.277, 362.500 473.312 C 378.050 466.369, 378.005 465.710, 360.798 448.333 C 349.977 437.405, 347.079 435, 344.734 435 C 343.161 435, 337.289 436.981, 331.686 439.403 C 302.932 451.832, 290.330 457.320, 278.500 462.564 C 258.937 471.236, 259.134 471.258, 227 457.037 C 212.975 450.831, 191.375 441.364, 179 436.001 C 144.733 421.151, 104.287 403.580, 86.691 395.900 C 77.996 392.105, 70.458 389, 69.941 389 C 68.167 389, 68.999 387.135, 71.066 386.479 C 72.202 386.119, 74.703 384.443, 76.625 382.756 C 88.669 372.181, 86.126 353.499, 71.754 346.975 C 64.090 343.496, 59.346 344.292, 41.558 352.042 M 450 345.694 C 447.826 346.471, 446 349.075, 446 351.398 C 446 352.698, 455.310 362.752, 472.250 379.745 C 496.031 403.600, 498.781 406.049, 501.487 405.788 C 508.063 405.154, 511.975 390.307, 508.614 378.744 C 506.705 372.178, 502.051 365.678, 496.469 361.780 C 494.286 360.256, 485.222 355.857, 476.326 352.005 C 460.510 345.155, 455.122 343.863, 450 345.694" />
               //    </g>
               // </svg>`;

               // `<svg viewBox="0 0 1300 1000" height="100%" width="100%">
               //    <g fill="currentColor" transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
               //       <path
               //          d="M1419.5,3442.2c-23.7-11.9-53.4-47.5-63.3-81.1c-27.7-77.2-29.7-2423.3-2-2494.5c41.5-112.8,170.1-138.5,257.2-51.4c37.6,37.6,39.6,67.3,39.6,464.9v425.3h3966.3h3966.3V-85v-1790.3H6972.3H4359.1l-47.5-49.5c-59.3-59.3-63.3-126.6-7.9-195.8l39.6-51.4h2737.8h2737.8l39.6,51.4l41.5,53.4V631.2c0,2874.3,2,2787.3-89,2822.9C9751.6,3475.8,1466.9,3465.9,1419.5,3442.2z M9583.5,2575.7V2002H5617.2H1650.9v573.7v573.7h3966.3h3966.3V2575.7z" />
               //       <path
               //          d="M6412.4,520.4C5967.3,374,5724-102.8,5864.5-553.8c94.9-310.6,346.2-530.2,676.5-591.5c306.6-55.4,650.8,87,842.7,348.2c41.6,57.4,45.5,57.4,67.3,21.8c98.9-168.1,348.2-328.4,573.7-369.9c255.2-47.5,559.8,49.5,745.8,235.4c346.2,346.2,340.2,898.1-11.9,1232.4c-156.3,146.4-330.3,221.6-542,231.4c-294.8,13.8-486.7-65.3-690.4-286.8c-65.3-71.2-118.7-120.7-118.7-108.8c0,11.9-45.5,69.2-100.9,130.6c-71.2,77.1-146.4,132.5-249.3,184c-136.5,67.3-166.1,75.2-340.2,79.1C6572.6,556,6499.5,550,6412.4,520.4z M6907,201.9c191.9-85.1,302.7-243.3,318.5-457c11.9-170.1-27.7-286.8-142.4-409.5c-100.9-110.8-207.7-164.2-352.1-176.1c-148.4-13.8-263.1,19.8-383.7,110.8c-247.3,187.9-286.8,551.9-85.1,783.4C6438.2,253.3,6669.6,306.7,6907,201.9z M8414.4,192c187.9-93,296.7-273,298.7-484.7c0-292.8-207.7-522.2-498.5-548c-320.4-29.7-593.5,215.6-593.5,534.1C7621.1,112.9,8044.4,379.9,8414.4,192z" />
               //       <path
               //          d="M1680.6,360.1c-623.1-87-1141.4-462.9-1406.5-1020.8C147.5-925.7,100-1137.4,100-1449.9c0-215.6,9.9-288.8,53.4-449.1c91-336.3,255.2-611.3,500.5-848.6c168.1-160.2,276.9-233.4,486.6-334.3c271-128.6,435.2-164.2,767.5-164.2s496.5,35.6,767.5,164.2c209.7,100.9,318.5,174.1,486.6,334.3c245.3,237.4,421.4,538.1,508.4,872.4c63.3,237.4,63.3,611.3,2,858.5c-164.2,658.7-686.4,1183-1331.3,1337.3C2149.4,366.1,1848.7,383.9,1680.6,360.1z M2333.4,4.1c152.3-47.5,364-152.3,453-223.5c53.4-43.5,55.4-51.4,29.7-87.1c-49.5-69.2-2001.9-2142.4-2017.8-2142.4c-23.7,0-184,231.5-241.3,346.2c-182,364-199.8,834.8-47.5,1216.6c81.1,199.8,174.1,338.3,340.3,504.4c219.6,219.6,453,350.1,749.7,417.4C1777.5,75.3,2155.3,59.4,2333.4,4.1z M3150.4-593.4c160.2-233.4,241.3-476.7,255.2-767.5c15.8-286.8-25.7-482.7-156.3-751.7c-87-180-122.6-227.5-280.9-385.7c-144.4-144.4-215.6-197.8-360-273c-318.5-162.2-688.4-213.6-1022.7-140.5c-144.4,31.7-553.9,217.6-544,245.3c11.9,29.7,2017.8,2156.2,2033.6,2156.2C3085.1-510.3,3118.7-547.9,3150.4-593.4z" />
               //    </g>
               // </svg>`;

               // init state (hide)
               if (user_settings.player_buttons_custom_card_switch) {
                  switchState(movie_player.toggleAttribute(cardAttrName));
               }

               cardBtn.addEventListener('click', () => switchState(movie_player.toggleAttribute(cardAttrName)));

               function switchState(state = required()) {
                  cardBtn.innerHTML = createSVG(state)
                  cardBtn.setAttribute('tooltip', `The cards are currently ${state ? 'hidden' : 'showing'}`);
               }

               function createSVG(alt) {
                  const svg = document.createElement('svg');
                  svg.setAttribute('width', '100%');
                  svg.setAttribute('height', '100%');
                  svg.setAttribute('viewBox', '-200 0 912 512');
                  const g = document.createElement('g');
                  g.setAttribute('fill', 'currentColor');
                  g.innerHTML = alt
                     // crossed out eye
                     ? '<path d="M 409 57.104 C 407.625 57.641, 390.907 73.653, 371.848 92.687 L 337.196 127.293 323.848 120.738 C 301.086 109.561, 283.832 103.994, 265.679 101.969 C 217.447 96.591, 148.112 134.037, 59.026 213.577 C 40.229 230.361, 4.759 265.510, 2.089 270 C -0.440 274.252, -0.674 281.777, 1.575 286.516 C 4.724 293.153, 67.054 352.112, 89.003 369.217 L 92.490 371.934 63.330 401.217 C 37.873 426.781, 34.079 430.988, 33.456 434.346 C 31.901 442.720, 38.176 452.474, 46.775 455.051 C 56.308 457.907, 41.359 471.974, 244.317 269.173 C 350.152 163.421, 429.960 82.914, 431.067 80.790 C 436.940 69.517, 428.155 55.840, 415.185 56.063 C 413.158 56.098, 410.375 56.566, 409 57.104 M 245.500 137.101 C 229.456 139.393, 201.143 151.606, 177.500 166.433 C 151.339 182.839, 120.778 206.171, 89.574 233.561 C 72.301 248.723, 42 277.649, 42 278.977 C 42 280.637, 88.281 323.114, 108.367 339.890 L 117.215 347.279 139.209 325.285 L 161.203 303.292 159.601 293.970 C 157.611 282.383, 157.570 272.724, 159.465 261.881 C 165.856 225.304, 193.011 195.349, 229.712 184.389 C 241.299 180.929, 261.648 179.996, 272.998 182.405 L 280.496 183.996 295.840 168.652 L 311.183 153.309 303.342 149.583 C 292.100 144.242, 277.007 139.186, 267.205 137.476 C 257.962 135.865, 254.565 135.806, 245.500 137.101 M 377.500 163.164 C 374.231 164.968, 369.928 169.297, 368.295 172.423 C 366.203 176.431, 366.351 184.093, 368.593 187.889 C 369.597 189.587, 375.944 195.270, 382.699 200.516 C 406.787 219.226, 444.129 252.203, 462.500 270.989 L 470.500 279.170 459 290.204 C 374.767 371.030, 302.827 418.200, 259.963 420.709 C 239.260 421.921, 213.738 412.918, 179.575 392.352 C 167.857 385.298, 166.164 384.571, 161.448 384.571 C 154.702 384.571, 149.091 388.115, 146.121 394.250 C 143.531 399.600, 143.472 403.260, 145.890 408.500 C 148.270 413.656, 150.468 415.571, 162 422.535 C 198.520 444.590, 230.555 455.992, 256 455.992 C 305.062 455.992, 376.663 414.097, 462 335.458 C 483.584 315.567, 509.652 289.051, 510.931 285.685 C 512.694 281.042, 512.218 273.876, 509.889 270 C 507.494 266.017, 484.252 242.741, 463.509 223.552 C 437.964 199.922, 398.967 167.566, 391.300 163.639 C 387.656 161.773, 380.470 161.526, 377.500 163.164 M 235.651 219.459 C 231.884 220.788, 226.369 223.351, 223.395 225.153 C 216.405 229.389, 206.759 239.019, 202.502 246.010 C 198.959 251.828, 193.677 266.197, 194.194 268.611 C 194.372 269.437, 205.637 258.890, 220.993 243.519 C 249.683 214.801, 249.910 214.427, 235.651 219.459 M 316.962 223.250 C 313.710 224.890, 311.876 226.720, 310.200 230 C 307.188 235.893, 307.781 240.006, 313.805 255 C 317.867 265.109, 318.470 267.589, 318.790 275.500 C 319.554 294.378, 313.786 309.236, 300.522 322.557 C 287.282 335.854, 274.164 341.408, 256 341.408 C 244.216 341.408, 238.392 340.027, 226.837 334.489 C 214.541 328.596, 204.996 330.563, 200.250 339.966 C 191.301 357.697, 210.339 372.220, 247.484 375.998 C 301.141 381.456, 350.063 339.760, 353.664 285.500 C 354.618 271.136, 351.039 249.928, 345.577 237.579 C 342.933 231.601, 337.061 224.600, 332.875 222.435 C 328.782 220.319, 322.095 220.661, 316.962 223.250" fill-rule="evenodd" />'
                     // open eye
                     : `<path d="M 377.5 163.164 C 374.231 164.968 375.944 195.27 382.699 200.516 C 406.787 219.226 444.129 252.203 462.5 270.989 L 470.5 279.17 L 459 290.204 C 374.767 371.03 302.827 418.2 259.963 420.709 C 239.26 421.921 213.738 412.918 179.575 392.352 C 167.857 385.298 166.164 384.571 161.448 384.571 C 154.702 384.571 149.091 388.115 146.121 394.25 C 143.531 399.6 143.472 403.26 145.89 408.5 C 148.27 413.656 150.468 415.571 162 422.535 C 198.52 444.59 230.555 455.992 256 455.992 C 305.062 455.992 376.663 414.097 462 335.458 C 483.584 315.567 509.652 289.051 510.931 285.685 C 512.694 281.042 512.218 273.876 509.889 270 C 507.494 266.017 484.252 242.741 463.509 223.552 C 437.964 199.922 398.967 167.566 391.3 163.639 C 387.656 161.773 380.47 161.526 377.5 163.164 M 316.962 223.25 C 313.71 224.89 311.876 226.72 310.2 230 C 307.188 235.893 307.781 240.006 313.805 255 C 317.867 265.109 318.47 267.589 318.79 275.5 C 319.554 294.378 313.786 309.236 300.522 322.557 C 287.282 335.854 274.164 341.408 256 341.408 C 244.216 341.408 238.392 340.027 226.837 334.489 C 214.541 328.596 204.996 330.563 200.25 339.966 C 191.301 357.697 210.339 372.22 247.484 375.998 C 301.141 381.456 350.063 339.76 353.664 285.5 C 354.618 271.136 351.039 249.928 345.577 237.579 C 342.933 231.601 337.061 224.6 332.875 222.435 C 328.782 220.319 322.095 220.661 316.962 223.25"></path>
                     <path d="M 377.487 163.483 C 374.218 165.287 369.915 169.616 368.282 172.742 C 366.19 176.75 366.338 184.412 368.58 188.208 C 369.584 189.906 375.931 195.589 382.686 200.835 C 406.774 219.545 444.116 252.522 462.487 271.308 L 470.487 279.489 L 458.987 290.523 C 374.754 371.349 302.814 418.519 259.95 421.028 C 239.247 422.24 213.725 413.237 179.562 392.671 C 167.844 385.617 166.151 384.89 161.435 384.89 C 154.689 384.89 149.078 388.434 146.108 394.569 C 143.518 399.919 143.459 403.579 145.877 408.819 C 148.257 413.975 150.455 415.89 161.987 422.854 C 198.507 444.909 230.542 456.311 255.987 456.311 C 305.049 456.311 376.65 414.416 461.987 335.777 C 483.571 315.886 509.639 289.37 510.918 286.004 C 512.681 281.361 512.205 274.195 509.876 270.319 C 507.481 266.336 484.239 243.06 463.496 223.871 C 437.951 200.241 398.954 167.885 391.287 163.958 C 387.643 162.092 380.457 161.845 377.487 163.483 M 316.949 223.569 C 313.697 225.209 311.863 227.039 310.187 230.319 C 307.175 236.212 307.768 240.325 313.792 255.319 C 317.854 265.428 318.457 267.908 318.777 275.819 C 319.541 294.697 313.773 309.555 300.509 322.876 C 287.269 336.173 274.151 341.727 255.987 341.727 C 244.203 341.727 238.379 340.346 226.824 334.808 C 214.528 328.915 204.983 330.882 200.237 340.285 C 191.288 358.016 210.326 372.539 247.471 376.317 C 301.128 381.775 350.05 340.079 353.651 285.819 C 354.605 271.455 351.026 250.247 345.564 237.898 C 342.92 231.92 337.048 224.919 332.862 222.754 C 328.769 220.638 322.082 220.98 316.949 223.569" transform="matrix(-1, 0, 0, -1, 512.000305, 558.092285)"></path>`;
                  svg.append(g);
                  return svg.outerHTML;
               }

               container.prepend(cardBtn);
            }

            if (user_settings.player_buttons_custom_items?.includes('quick-quality')) {
               const
                  // container <a>
                  SELECTOR_QUALITY_CLASS_NAME = 'nova-quick-quality',
                  SELECTOR_QUALITY = '.' + SELECTOR_QUALITY_CLASS_NAME,
                  qualityContainerBtn = document.createElement('a'),
                  // list <ul>
                  SELECTOR_QUALITY_LIST_ID = SELECTOR_QUALITY_CLASS_NAME + '-list',
                  SELECTOR_QUALITY_LIST = '#' + SELECTOR_QUALITY_LIST_ID,
                  listQuality = document.createElement('ul'),
                  // btn <span>
                  SELECTOR_QUALITY_TITLE_ID = SELECTOR_QUALITY_CLASS_NAME + '-title',
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
                     bottom: 2.5em !important;
                     left: -2.2em;
                     list-style: none;
                     padding-bottom: 1.5em !important;
                     z-index: ${1 + Math.max(NOVA.css.getValue('.ytp-progress-bar', 'z-index'), 31)};
                  }

                  /* for embed */
                  html[data-cast-api-enabled] ${SELECTOR_QUALITY_LIST} {
                     margin: 0;
                     padding: 0;
                     bottom: 3.3em;
                     /* --yt-spec-brand-button-background: #c00; */
                  }

                  /* fix for fullscreen mode */
                  .ytp-big-mode .ytp-menuitem-toggle-checkbox {
                     width: 3.5em;
                     height: 1.6em;
                  }

                  ${SELECTOR_QUALITY}:not(:hover) ${SELECTOR_QUALITY_LIST} {
                     display: none;
                  }

                  ${SELECTOR_QUALITY_LIST} li {
                     cursor: pointer;
                     white-space: nowrap;
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
                  ${SELECTOR_QUALITY_LIST} li.disable { color: #666; }
                  ${SELECTOR_QUALITY_LIST} li:hover:not(.active) { background: #c00; }`);
               // ${SELECTOR_QUALITY_LIST} li:hover:not(.active) { background-color: var(--yt-spec-brand-button-background); }`);
               // container <a>
               qualityContainerBtn.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_QUALITY_CLASS_NAME}`;
               // qualityContainerBtn.title = 'Change quality';
               // qualityContainerBtn.setAttribute('tooltip', 'Change quality');
               // btn <span>
               qualityBtn.id = SELECTOR_QUALITY_TITLE_ID;
               qualityBtn.textContent = qualityFormatList[movie_player.getPlaybackQuality()]?.label || '[out of range]';
               // list <ul>
               listQuality.id = SELECTOR_QUALITY_LIST_ID;

               // show current quality
               movie_player.addEventListener('onPlaybackQualityChange', quality => {
                  document.getElementById(SELECTOR_QUALITY_TITLE_ID)
                     .textContent = qualityFormatList[quality]?.label || '[out of range]';
                  // .textContent = movie_player.getVideoData().video_quality
                  // dirty hack (clear list) replaces this prototype code
                  // document.getElementById(SELECTOR_QUALITY_LIST_ID li..) li.className = 'active';
               });

               qualityContainerBtn.prepend(qualityBtn);
               qualityContainerBtn.append(listQuality);

               container.prepend(qualityContainerBtn);

               fillQualityMenu(); // init

               NOVA.videoElement?.addEventListener('canplay', fillQualityMenu); // update
               // clear quality state after page changed
               // if (user_settings['video-quality']) {
               //    document.addEventListener('yt-navigate-start', () => delete window['nova-quality']);
               // }

               function fillQualityMenu() {
                  if (qualityList = document.getElementById(SELECTOR_QUALITY_LIST_ID)) {
                     qualityList.innerHTML = '';

                     movie_player.getAvailableQualityLevels()
                        .forEach(quality => {
                           const qualityItem = document.createElement('li');
                           // qualityList.innerHTML =
                           //    `<span class="quality-menu-item-text">1080p</span>
                           //    <span class="quality-menu-item-label-badge">HD</span>`;
                           if (qualityData = qualityFormatList[quality]) {
                              qualityItem.textContent = qualityData.label;
                              if (badge = qualityData.badge) {
                                 qualityItem.insertAdjacentHTML('beforeend',
                                    `<span class="quality-menu-item-label-badge">${badge}</span>`);
                              }
                              // if (movie_player.getVideoData().video_quality == quality) qualityItem.className = 'active';

                              if (movie_player.getPlaybackQuality() == quality) {
                                 qualityItem.className = 'active';
                              }
                              else {
                                 // set max quality limit (viewport + 30%)
                                 // if (+(+qualityData.label.replace(/[^0-9]/g, '') || 0) <= (window.innerWidth * 1.3)) {

                                 // incorrect window size definition in embed
                                 const maxWidth = (NOVA.currentPage == 'watch') ? window.screen.width : window.innerWidth;
                                 // set max quality limit (screen resolution + 30%)
                                 if (+(qualityData.label.replace(/[^0-9]/g, '') || 0) <= (maxWidth * 1.3)) {
                                    qualityItem.addEventListener('click', () => {
                                       // console.debug('setPlaybackQuality', quality);
                                       movie_player.setPlaybackQualityRange(quality, quality);
                                       // movie_player.setPlaybackQuality(quality); // Doesn't work

                                       // send data to [video-quality] plugin
                                       // if (user_settings['video-quality']) {
                                       //    window['nova-quality'] = quality;
                                       // }

                                       if (quality == 'auto') return; // fix empty qualityList. onPlaybackQualityChange and addEventListener do not trigger

                                       qualityList.innerHTML = ''; // dirty hack (clear list)
                                    });
                                 }
                                 else {
                                    qualityItem.className = 'disable';
                                    qualityItem.title = 'Max (window viewport + 30%)';
                                 }
                              }

                              qualityList.append(qualityItem);
                           }
                        });
                  }
               }
            }

            if (user_settings.player_buttons_custom_items?.includes('clock')) {
               const clockEl = document.createElement('span');
               clockEl.className = 'ytp-time-display';
               clockEl.title = 'Now time';
               // clockEl.innerText = 'time init';

               container.prepend(clockEl);

               setInterval(() => {
                  if (document.visibilityState == 'hidden' // tab inactive
                     || movie_player.classList.contains('ytp-autohide') // dubious optimization hack
                  ) {
                     return;
                  }

                  const time = new Date().toTimeString().slice(0, 8);
                  clockEl.textContent = time;
               }, 1000); // 1sec
            }

            if (user_settings.player_buttons_custom_items?.includes('range-speed')) {
               // alt1 - https://greasyfork.org/en/scripts/38575-youtube-advanced-speed-controller
               // alt2 - https://greasyfork.org/en/scripts/475864-youtube-playback-speed-buttons
               const
                  speedSlider = document.createElement('input'),
                  SELECTOR_RANGE_CLASS_NAME = 'nova-range-speed-input',
                  SELECTOR_RANGE = '.' + SELECTOR_RANGE_CLASS_NAME;

               NOVA.css.push(
                  `${SELECTOR_RANGE}[type="range"] {
                     height: 100%;
                  }`);

               // speedSlider.className = SELECTOR_RANGE_CLASS_NAME;
               speedSlider.className = `${SELECTOR_BTN_CLASS_NAME} ${SELECTOR_RANGE_CLASS_NAME}`;
               speedSlider.title = 'Playback Rate';
               speedSlider.type = 'range';
               // speedSlider.type = 'number';
               speedSlider.min = speedSlider.step = +user_settings.rate_step || .1;
               // speedSlider.max = +user_settings.rate_default || 2;
               speedSlider.max = user_settings.range_speed_unlimit ? +user_settings.rate_default : 2;
               speedSlider.value = NOVA.videoElement.playbackRate;
               updateTitleForSpeedSlider(NOVA.videoElement.playbackRate);

               NOVA.videoElement.addEventListener('ratechange', function () {
                  // console.debug('ratechange', movie_player.getPlaybackRate(), this.playbackRate);
                  speedSlider.value = this.playbackRate;
                  updateTitleForSpeedSlider(this.playbackRate);
               });
               // speedSlider.addEventListener('change', () => NOVA.videoElement.playbackRate = speedSlider.value);
               // speedSlider.addEventListener('input', ({ target }) => playerRate(target.value));
               speedSlider.addEventListener('change', ({ target }) => playerRate(target.value));
               speedSlider.addEventListener('wheel', evt => {
                  evt.preventDefault();
                  const rate = NOVA.videoElement.playbackRate + (speedSlider.step * Math.sign(evt.wheelDelta));
                  playerRate(rate);
                  speedSlider.value = rate;
               });
               container.prepend(speedSlider);

               function playerRate(rate) {
                  // console.debug('rate', rate);
                  if (!user_settings.range_speed_unlimit && rate > 2) return;
                  NOVA.videoElement.playbackRate = (+rate).toFixed(2);
                  updateTitleForSpeedSlider(rate);
               }

               function updateTitleForSpeedSlider(rate) {
                  speedSlider.title = `Speed (${rate})`;
                  speedSlider.setAttribute('tooltip', `Speed (${rate})`);
               }
            }

            if (user_settings.player_buttons_custom_items?.includes('toggle-speed')) {
               // alt1 - https://greasyfork.org/en/scripts/466690-youtube-quick-speed-interface
               // alt2 - https://greasyfork.org/en/scripts/30506-video-speed-buttons
               const
                  speedBtn = document.createElement('a'),
                  hotkey = user_settings.player_buttons_custom_hotkey_toggle_speed || 'a',
                  defaultRateText = '1x',
                  genTooltip = () => `Switch to ${NOVA.videoElement.playbackRate}>${speedBtn.textContent} (${hotkey})`;
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
               // speedBtn.title = genTooltip();
               speedBtn.setAttribute('tooltip', genTooltip());
               // hotkey
               document.addEventListener('keyup', evt => {
                  if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if (evt.key === hotkey) {
                     switchRate();
                  }
               });
               speedBtn.addEventListener('click', switchRate);

               function switchRate() {
                  // restore orig
                  if (Object.keys(rateOrig).length) {
                     playerRate.set(rateOrig);
                     rateOrig = {};
                     speedBtn.innerHTML = defaultRateText;
                  }
                  // return default
                  else {
                     rateOrig = (movie_player && NOVA.videoElement.playbackRate % .25) === 0
                        ? { 'default': movie_player.getPlaybackRate() }
                        : { 'html5': NOVA.videoElement.playbackRate };

                     let resetRate = Object.assign({}, rateOrig); // clone obj
                     resetRate[Object.keys(resetRate)[0]] = 1; // first property of object
                     playerRate.set(resetRate);

                     speedBtn.textContent = rateOrig[Object.keys(rateOrig)[0]] + 'x';
                  }
                  // speedBtn.title = `Switch to ${speedBtn.textContent} (${hotkey})`;
                  speedBtn.setAttribute('tooltip', genTooltip());
                  // console.debug('rateOrig', rateOrig);
               }

               const playerRate = {
                  set(obj) {
                     if (obj.hasOwnProperty('html5') || !movie_player) {
                        NOVA.videoElement.playbackRate = obj.html5;
                     }
                     else {
                        movie_player.setPlaybackRate(obj.default);
                     }
                     // this.saveInSession(obj.html5 || obj.default);
                  },

                  // saveInSession(level = required()) {
                  //    try {
                  //       // https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API/Using
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
               // init
               visibilitySwitch();
               // update #1
               NOVA.videoElement?.addEventListener('ratechange', visibilitySwitch);
               // // update #2. Reset speedBtn state
               NOVA.videoElement?.addEventListener('loadeddata', () => {
                  rateOrig = {};
                  speedBtn.textContent = defaultRateText;
                  visibilitySwitch();
               });

               function visibilitySwitch() {
                  if (!Object.keys(rateOrig).length) {
                     // speedBtn.style.visibility = /*movie_player.getPlaybackRate() ===*/ NOVA.videoElement.playbackRate === 1 ? 'hidden' : 'visible';
                     speedBtn.style.display = /*movie_player.getPlaybackRate() ===*/ (NOVA.videoElement?.playbackRate === 1) ? 'none' : '';
                  }
               }
            }
         });

      // /* Start Create SVG */
      // const svg = document.createElement('svg');
      // svg.setAttribute('height', '100%');
      // svg.setAttribute('version', '1.1');
      // svg.setAttribute('viewBox', '0 0 36 36');
      // svg.setAttribute('width', '100%');
      // const use = document.createElement('use');
      // use.setAttribute('class', 'ytp-svg-shadow');

      // setButton(btn, path); // Decide Which Button

      // path.setAttribute('fill', '#fff');
      // path.setAttribute('fill-rule', 'evenodd');
      // svg.appendChild(use);
      // svg.appendChild(path);

      // const btnContent = svg.outerHTML;

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
         multiple: null, // don't use - selected: true
         required: true, // don't use - selected: true
         size: 7, // = options.length
         options: [
            {
               label: 'clock', value: 'clock',
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
               label: 'range speed', value: 'range-speed',
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
               label: 'card-switch', value: 'card-switch',
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
               label: 'aspect-ratio', value: 'aspect-ratio',
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
               'label:ua': 'співвідношення сторін',
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
      // player_buttons_custom_popup_width: {
      //    _tagName: 'input',
      //    label: 'Player window size aspect ratio',
      //    'label:zh': '播放器窗口大小纵横比',
      //    'label:ja': 'プレーヤーのウィンドウサイズのアスペクト比',
      //    'label:ko': '플레이어 창 크기 종횡비',
      //    'label:id': 'Rasio aspek ukuran jendela pemutar',
      //    'label:es': 'Relación de aspecto del tamaño de la ventana del reproductor',
      //    'label:pt': 'Proporção do tamanho da janela do jogador',
      //    'label:fr': "Rapport d'aspect de la taille de la fenêtre du lecteur",
      //    'label:it': 'Proporzioni della dimensione della finestra del lettore',
      //    // 'label:tr': 'Oyuncu penceresi boyutu en boy oranı',
      //    'label:de': 'Seitenverhältnis der Player-Fenstergröße',
      //    'label:pl': 'Rozmiar okna odtwarzacza',
      //    'label:ua': 'Співвідношення розміру вікна відтворювача',
      //    type: 'number',
      //    title: 'Less value - larger size',
      //    'title:zh': '较小的值 - 较大的尺寸',
      //    'title:ja': '小さい値-大きいサイズ',
      //    'title:ko': '더 작은 값 - 더 큰 크기',
      //    'title:id': 'Nilai lebih kecil - ukuran lebih besar',
      //    'title:es': 'Valor más pequeño - tamaño más grande',
      //    'title:pt': 'Valor menor - tamanho maior',
      //    'title:fr': 'Plus petite valeur - plus grande taille',
      //    'title:it': 'Meno valore - dimensioni maggiori',
      //    // 'title:tr': 'Daha az değer - daha büyük boyut',
      //    'title:de': 'Kleiner Wert - größere Größe',
      //    'title:pl': 'Mniejsza wartość - większy rozmiar',
      //    'title:ua': 'Менше значення - більший розмір',
      //    // title: '',
      //    placeholder: '1.5-4',
      //    step: 0.1,
      //    min: 1.5,
      //    max: 4,
      //    value: 2.5,
      //    'data-dependent': { 'player_buttons_custom_items': ['popup'] },
      // },
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
            'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', /*'ArrowLeft', 'ArrowRight',*/ ']', '[', '+', '-', ',', '.', '/', '<', ';', '\\'
         ],
         'data-dependent': { 'player_buttons_custom_items': ['toggle-speed'] },
      },
      player_buttons_custom_hotkey_rotate: {
         _tagName: 'select',
         label: 'Hotkey rotate',
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
         // title: '',
         options: [
            { label: 'R', value: 'r', selected: true },
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', /*'ArrowLeft', 'ArrowRight',*/ ']', '[', '+', '-', ',', '.', '/', '<', ';', '\\'
         ],
         'data-dependent': { 'player_buttons_custom_items': ['rotate'] },
      },
      player_buttons_custom_card_switch: {
         _tagName: 'select',
         label: 'Default card state',
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
         options: [
            {
               label: 'show', value: false, selected: true,
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
               label: 'hide', value: true,
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
         'data-dependent': { 'player_buttons_custom_items': ['card-switch'] },
      },
      player_buttons_custom_screenshot: {
         _tagName: 'select',
         label: 'Screenshot format',
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
         options: [
            {
               label: 'png', value: 'png', selected: true,
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
               label: 'jpg', value: 'jpg',
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
         'data-dependent': { 'player_buttons_custom_items': ['screenshot'] },
      },
      player_buttons_custom_screenshot_to_clipboard: {
         _tagName: 'input',
         label: 'Screenshot copy to clipboard',
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
         'data-dependent': { 'player_buttons_custom_items': ['screenshot'] },
      },
      range_speed_unlimit: {
         _tagName: 'input',
         label: 'Range speed unlimit',
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
         'data-dependent': { 'player_buttons_custom_items': ['range-speed'] },
      },
   }
});
