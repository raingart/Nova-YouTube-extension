window.nova_plugins.push({
   id: 'player-buttons-custom',
   title: 'Custom buttons',
   'title:zh': '自定义按钮',
   'title:ja': 'カスタムボタン',
   'title:ko': '사용자 정의 버튼',
   'title:es': 'Botones personalizados',
   'title:pt': 'Botões personalizados',
   'title:fr': 'Boutons personnalisés',
   'title:de': 'Benutzerdefinierte Schaltflächen',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_BTN_CLASS_NAME = 'right-custom-button',
         SELECTOR_BTN = '.' + SELECTOR_BTN_CLASS_NAME, // for css
         getVideoElement = () => movie_player.querySelector('video');

      NOVA.waitElement('.ytp-right-controls')
         .then(container => {
            // global
            NOVA.css.push(
               `/* button${SELECTOR_BTN} { padding: 5px; } */
               ${SELECTOR_BTN}:hover { color: #66afe9 !important; }
               ${SELECTOR_BTN}:active { color: #2196f3 !important; }`);

            // Pop-up player
            if (user_settings.player_buttons_custom_items?.indexOf('popup') !== -1 && !NOVA.queryURL.has('popup')) {
               const btnPopUp = document.createElement('button');
               btnPopUp.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               btnPopUp.title = 'Open in popup';
               // btnPopUp.setAttribute('aria-label','');
               btnPopUp.innerHTML =
                  `<svg version="1.1" viewBox="-8 -8 36 36" height="100%" width="100%">
                     <g fill="currentColor">
                        <path d="M18 2H6v4H2v12h12v-4h4V2z M12 16H4V8h2v6h6V16z M16 12h-2h-2H8V8V6V4h8V12z" />
                     </g>
                  </svg>`;
               // `<svg version="1.1" viewBox="0 -5 24 30" height="100%" width="100%">
               //    <g transform="translate(0,2)">
               //       <polygon fill-rule="nonzero" points="1.85008844 1.51464844 18.2421138 1.51464844 18.2421138 7.74121094 19.2421138 7.74121094 19.2421138 0.514648438 0.850088443 0.514648438 0.850088443 11.7244572 9.16539331 11.7758693 9.17157603 10.7758885 1.85008844 10.7306209" />
               //       <rect x="10.5" y="9" width="9.5" height="6" />
               //       <path d="M8.49517931,6.9934339 L4.58268904,3.10539669 L3.87780235,3.81471662 L7.75590296,7.6685791 L5.14025649,7.6685791 L5.14025649,8.6685791 L9.49517931,8.6685791 L9.49517931,4.64446771 L8.49517931,4.64446771 L8.49517931,6.9934339 Z" fill-rule="nonzero" />
               //    </g>
               // </svg>`;
               btnPopUp.addEventListener('click', () => {
                  const
                     video = getVideoElement(),
                     // width = window.innerWidth / 2,
                     width = screen.width / (+user_settings.player_buttons_custom_popup_width || 4),
                     // aspectRatio = video.videoWidth / video.videoHeight,
                     // height = Math.round(width / aspectRatio);
                     height = Math.round(width / (16 / 9));

                  url = new URL(document.head.querySelector('link[itemprop="embedUrl"][href]')?.href || ('https://www.youtube.com/embed/' + movie_player.getVideoData().video_id));
                  // list param ex.
                  // https://www.youtube.com/embed/PBlOi5OVcKs?start=0&amp;playsinline=1&amp;controls=0&amp;fs=20&amp;disablekb=1&amp;rel=0&amp;origin=https%3A%2F%2Ftyping-tube.net&amp;enablejsapi=1&amp;widgetid=1

                  if (currentTime = Math.floor(video?.currentTime)) url.searchParams.append('start', currentTime);
                  url.searchParams.append('autoplay', 1);
                  url.searchParams.append('popup', true); // deactivate popup-button for used window

                  openPopup({ 'url': url.href, 'title': document.title, 'width': width, 'height': height });
               });
               container.prepend(btnPopUp);

               function openPopup({ url, title, width, height }) {
                  // center screen
                  const left = (screen.width / 2) - (width / 2);
                  const top = (screen.height / 2) - (height / 2);
                  // bottom right corner
                  // left = window.innerWidth;
                  // top = window.innerHeight;
                  return window.open(url, title, `toolbar=no,location=no,directories=no,status=no,menubar=no, scrollbars=no,resizable=yes,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`);
               }
            }

            if (user_settings.player_buttons_custom_items?.indexOf('screenshot') !== -1) {
               const
                  // bar
                  SELECTOR_SCREENSHOT_ID = 'screenshot-result',
                  SELECTOR_SCREENSHOT = '#' + SELECTOR_SCREENSHOT_ID, // for css
                  video = getVideoElement();

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
                  `<svg version="1.1" viewBox="0 -155 512 860" height="100%" width="100%">
                     <g fill="currentColor">
                        <circle cx="255.811" cy="285.309" r="75.217" />
                        <path d="M477,137H352.718L349,108c0-16.568-13.432-30-30-30H191c-16.568,0-30,13.432-30,30l-3.718,29H34 c-11.046,0-20,8.454-20,19.5v258c0,11.046,8.954,20.5,20,20.5h443c11.046,0,20-9.454,20-20.5v-258C497,145.454,488.046,137,477,137 z M255.595,408.562c-67.928,0-122.994-55.066-122.994-122.993c0-67.928,55.066-122.994,122.994-122.994 c67.928,0,122.994,55.066,122.994,122.994C378.589,353.495,323.523,408.562,255.595,408.562z M474,190H369v-31h105V190z" />
                     </g>
                  </svg>`;
               btnScreenshot.addEventListener('click', () => {
                  const
                     container = document.getElementById(SELECTOR_SCREENSHOT_ID) || document.createElement('a'),
                     canvas = container.querySelector('canvas') || document.createElement('canvas'),
                     context = canvas.getContext('2d');

                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  context.drawImage(video, 0, 0, canvas.width, canvas.height);
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
                        container.remove();
                     });
                     container.append(canvas);
                     const btnClose = document.createElement('a');
                     // btnClose.id =
                     btnClose.className = 'close-btn'
                     // btnClose.textContent = 'CLOSE';
                     btnClose.innerHTML = '<span>CLOSE</span>';
                     btnClose.addEventListener('click', evt => {
                        evt.preventDefault();
                        container.remove();
                     });
                     container.append(btnClose);
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
                           `[${NOVA.timeFormatTo.HMS.abbr(video.currentTime)}]`,
                        ]
                           .join(' ');

                  downloadLink.download = downloadFileName + '.png';
                  downloadLink.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                  downloadLink.click();
               }
               container.prepend(btnScreenshot);
            }

            if (user_settings.player_buttons_custom_items?.indexOf('thumbnail') !== -1) {
               const btnThumb = document.createElement('button');
               btnThumb.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               // btnThumb.setAttribute('data-tooltip', 'Open thumbnail');
               btnThumb.title = 'Open thumbnail';
               btnThumb.innerHTML =
                  `<svg version="1.1" viewBox="0 -9 21 40" height="100%" width="100%">
                     <g fill="currentColor">
                        <circle cx='8' cy='7.2' r='2'/>
                        <path d='M0 2v16h20V2H0z M18 16H2V4h16V16z'/>
                        <polygon points='17 10.9 14 7.9 9 12.9 6 9.9 3 12.9 3 15 17 15' />
                     </g>
                  </svg>`;
               btnThumb.addEventListener('click', () => {
                  // https://i.ytimg.com/vi_webp/<VIDEO_ID>/maxresdefault.webp
                  // https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg
                  // https://i.ytimg.com/vi/<VIDEO_ID>/hqdefault.jpg

                  // window.open(`https://i.ytimg.com/vi/${movie_player.getVideoData().video_id}/maxresdefault.jpg`);

                  // Warn! "maxresdefault" is not available everywhere. etc:
                  // https://i.ytimg.com/vi/cPzpTvVPTII/maxresdefault.jpg
                  // https://i.ytimg.com/vi/cPzpTvVPTII/hqdefault.jpg
                  // Check the size of an image. And then replace "maxresdefault" with "hqdefault"
                  const
                     tmpImg = document.createElement('img'),
                     genImgURL = res_prefix => `https://i.ytimg.com/vi/${movie_player.getVideoData().video_id}/${res_prefix}default.jpg`;

                  document.body.style.cursor = 'wait';
                  tmpImg.src = genImgURL('maxres');
                  tmpImg.addEventListener('load', function () {
                     document.body.style.cursor = 'default';
                     window.open(genImgURL(
                        (this.naturalWidth === 120 && this.naturalHeight === 90) ? 'hq' : 'maxres')
                     );
                  });
               });
               container.prepend(btnThumb);
            }

            if (user_settings.player_buttons_custom_items?.indexOf('toggle-speed') !== -1) {
               const
                  video = getVideoElement(),
                  btnSpeed = document.createElement('a'),
                  hotkey = user_settings.player_buttons_custom_hotkey_toggle_speed || 'a',
                  defaultRateText = '1x';
               // `<svg version="1.1" viewBox="0 0 36 36" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path d="m 27.526463,13.161756 -1.400912,2.107062 a 9.1116182,9.1116182 0 0 1 -0.250569,8.633258 H 10.089103 A 9.1116182,9.1116182 0 0 1 22.059491,11.202758h24.166553,9.8018471 A 11.389523,11.389523 0 0 0 8.1301049,25.041029 2.2779046,2.2779046 0 0 0 10.089103,26.179981 H 25.863592 A 2.2779046,2.2779046 0 0 0 27.845369,25.041029 11.389523,11.389523 0 0 0 27.537852,13.150367 Zs16.376119,20.95219 a 2.2779046,2.2779046 0 0 0 3.223235,0h6.446471,-9.669705 -9.669706,6.44647 a 2.2779046,2.2779046 0 0 0 0,3.223235 z" />
               //    </g>
               // </svg>`;

               let origRate = {};

               btnSpeed.className = `ytp-button ${SELECTOR_BTN_CLASS_NAME}`;
               btnSpeed.style.textAlign = 'center';
               btnSpeed.style.fontWeight = 'bold';
               btnSpeed.innerHTML = defaultRateText;
               btnSpeed.title = `Toggle speed to ${defaultRateText} (${hotkey})`;
               // hotkey
               document.addEventListener('keyup', evt => {
                  if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if (evt.key === hotkey) {
                     switchRate();
                  }
               })
               btnSpeed.addEventListener('click', switchRate);

               function switchRate() {
                  // restore orig
                  if (Object.keys(origRate).length) {
                     playerRate.set(origRate);
                     origRate = {};
                     btnSpeed.innerHTML = defaultRateText;

                  } else { // return default
                     origRate = (movie_player && video.playbackRate % .25) === 0
                        ? { 'default': movie_player.getPlaybackRate() }
                        : { 'html5': video.playbackRate };

                     let resetRate = Object.assign({}, origRate); // clone obj
                     resetRate[Object.keys(resetRate)[0]] = 1; // first property of object
                     playerRate.set(resetRate);

                     btnSpeed.textContent = origRate[Object.keys(origRate)[0]] + 'x';
                  }
                  btnSpeed.title = `Switch to ${btnSpeed.textContent} (${hotkey})`;
                  // console.debug('origRate', origRate);
               }

               const playerRate = {
                  set(obj) {
                     if (obj.hasOwnProperty('html5') || !movie_player) {
                        video.playbackRate = obj.html5;

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

               video.addEventListener('ratechange', visibilitySwitch);
               // reset btnSpeed state
               video.addEventListener('loadeddata', () => {
                  origRate = {};
                  btnSpeed.textContent = defaultRateText;
                  visibilitySwitch();
               });

               function visibilitySwitch() {
                  if (!Object.keys(origRate).length) {
                     btnSpeed.style.visibility = /*movie_player.getPlaybackRate() ===*/ video.playbackRate === 1 ? 'hidden' : 'visible';
                  }
               }

               container.prepend(btnSpeed);
            }
         });

   },
   options: {
      player_buttons_custom_items: {
         _tagName: 'select',
         label: 'Items',
         'label:zh': '元素',
         'label:ja': '要素',
         'label:ko': '아이템',
         'label:es': 'Elementos',
         'label:pt': 'Itens',
         'label:fr': 'Articles',
         'label:de': 'Produkte',
         title: 'Hold [Ctrl+Click] to select several',
         'title:zh': '按住[Ctrl+Click]并选择一些',
         'title:ja': '「Ctrl+Click」を押したままにして、いくつかを選択します',
         'title:ko': '[Ctrl+Click]을 길게 눌러 여러 개 선택',
         // 'title:es': 'Mantenga presionado  [Ctrl+Click] para seleccionar varios',
         'title:fr': 'Maintenez [Ctrl+Click]pour sélectionner plusieurs',
         // 'title:de': 'Halten Sie [Ctrl+Click] gedrückt, um mehrere auszuwählen',
         multiple: null, // dont use - selected: true
         required: true, // dont use - selected: true
         size: 4, // = options.length
         options: [
            { label: 'toggle speed', value: 'toggle-speed', 'label:zh': '切换速度', 'label:ja': 'トグル速度', 'label:ko': '토글 속도', 'label:es': 'alternar velocidad', 'label:pt': 'velocidade de alternância', 'label:fr': 'basculer la vitesse', 'label:de': 'geschwindigkeit umschalten' },
            { label: 'screenshot', value: 'screenshot', 'label:zh': '截屏', 'label:ja': 'スクリーンショット', 'label:ko': '스크린샷', 'label:es': 'captura de pantalla', 'label:pt': 'captura de tela', 'label:fr': "capture d'écran", 'label:de': 'bildschirmfoto' },
            { label: 'thumbnail', value: 'thumbnail', 'label:zh': '缩略图', 'label:ja': 'サムネイル', 'label:ko': '썸네일', 'label:es': 'miniatura', 'label:pt': 'captura de tela', 'label:fr': 'la vignette', 'label:de': 'bildschirmfoto' },
            { label: 'popup player', value: 'popup', 'label:zh': '弹出式播放器', 'label:ja': 'ポップアッププレーヤー', 'label:ko': '썸네일', /*'label:es': 'jugadora emergente',*/ 'label:pt': 'jogador pop-up', 'label:fr': 'lecteur contextuel'/*, 'label:de': ''*/ },
         ],
      },
      player_buttons_custom_popup_width: {
         _tagName: 'input',
         label: 'Player window size aspect ratio',
         'label:zh': '播放器窗口大小纵横比',
         'label:ja': 'プレーヤーのウィンドウサイズのアスペクト比',
         'label:ko': '플레이어 창 크기 종횡비',
         'label:es': 'Relación de aspecto del tamaño de la ventana del reproductor',
         'label:pt': 'Proporção do tamanho da janela do jogador',
         'label:fr': "Rapport d'aspect de la taille de la fenêtre du lecteur",
         'label:de': 'Seitenverhältnis der Player-Fenstergröße',
         type: 'number',
         title: 'less value - larger size',
         'title:zh': '较小的值 - 较大的尺寸',
         'title:ja': '小さい値-大きいサイズ',
         'title:ko': '더 작은 값 - 더 큰 크기',
         'title:es': 'Valor más pequeño - tamaño más grande',
         'title:pt': 'Valor menor - tamanho maior',
         'title:fr': 'Plus petite valeur - plus grande taille',
         'title:de': 'Kleiner Wert - größere Größe',
         // title: '',
         placeholder: '1.5-4',
         step: 0.1,
         min: 1.5,
         max: 4,
         value: 2.5,
         'data-dependent': '{"player_buttons_custom_items":["popup"]}',
      },
      player_buttons_custom_hotkey_toggle_speed: {
         _tagName: 'select',
         label: 'Hotkey toggle speed',
         'label:zh': '热键切换速度',
         'label:ja': '速度を切り替えるためのホットボタン',
         'label:ko': '단축키 토글 속도',
         'label:es': 'Velocidad de cambio de teclas de acceso rápido',
         'label:pt': 'Velocidade de alternância da tecla de atalho',
         'label:fr': 'Vitesse de basculement des raccourcis clavier',
         'label:de': 'Hotkey-Umschaltgeschwindigkeit',
         // title: '',
         options: [
            { label: 'A', value: 'a', selected: true },
            'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
         'data-dependent': '{"player_buttons_custom_items":["toggle-speed"]}',
      },
   }
});
