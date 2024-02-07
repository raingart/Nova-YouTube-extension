// for test
// the adjustment area depends on the video size. Problems are visible at non-standard proportions
// https://www.youtube.com/watch?v=embed%2FJVi_e - err - TypeError: Cannot read property 'playerMicroformatRenderer' of undefined

// fot "isMusic" fn test
// https://www.youtube.com/watch?v=kCHiSHxTXgg - svg icon "🎵"
// https://www.youtube.com/results?search_query=Highly+Suspect+-+Upperdrugs+-+2019 // test transition. Open firt thumb "Highly Suspect 🎵"
// https://www.youtube.com/embed/fEcGObUqzk4 - embed (music not recognized)
// https://www.youtube.com/watch?v=O6ydiX4TOFw - min 25sec

window.nova_plugins.push({
   id: 'video-rate',
   title: 'Playback speed control',
   'title:zh': '播放速度控制',
   'title:ja': '再生速度制御',
   // 'title:ko': '재생 속도 제어',
   // 'title:id': 'Kontrol kecepatan pemutaran',
   // 'title:es': 'Controle de velocidade de reprodução',
   'title:pt': 'Controle de velocidade de reprodução',
   'title:fr': 'Contrôle de la vitesse de lecture',
   // 'title:it': 'Controllo della velocità di riproduzione',
   // 'title:tr': 'Oynatma hızı kontrolü',
   'title:de': 'Steuerung der Wiedergabegeschwindigkeit',
   'title:pl': 'Kontrola prędkości odtwarzania',
   'title:ua': 'Контроль швидкості відтворення',
   // run_on_pages: 'watch, embed, -mobile',
   run_on_pages: 'home, results, feed, channel, watch, embed',
   section: 'player',
   // desc: 'Use mouse wheel to change playback speed',
   desc: 'With mouse wheel',
   'desc:zh': '带鼠标滚轮',
   'desc:ja': 'マウスホイール付き',
   // 'desc:ko': '마우스 휠로',
   // 'desc:id': 'Dengan roda mouse',
   // 'desc:es': 'Con rueda de ratón',
   'desc:pt': 'Com roda do mouse',
   'desc:fr': 'Avec molette de la souris',
   // 'desc:it': 'Con rotellina del mouse',
   // 'desc:tr': 'Fare tekerleği ile',
   'desc:de': 'Mit mausrad',
   'desc:pl': 'Za pomocą kółka myszy',
   'desc:ua': 'За допомогою колеса мишки',
   _runtime: user_settings => {

      // speed buttons (-/+)
      // alt1 - https://greasyfork.org/en/scripts/475864-youtube-playback-speed-buttons
      // alt2 - https://chrome.google.com/webstore/detail/hdannnflhlmdablckfkjpleikpphncik
      // alt3 - https://chrome.google.com/webstore/detail/gaiceihehajjahakcglkhmdbbdclbnlf

      // array
      // alt1 - https://greasyfork.org/en/scripts/30506-video-speed-buttons
      // alt2 - https://greasyfork.org/en/scripts/477218-m-youtube-com-more-playback-speeds
      // alt3 - https://greasyfork.org/en/scripts/421670-youtube-more-speeds
      // alt4 (mobile) - https://greasyfork.org/en/scripts/477218-m-youtube-com-more-playback-speeds

      // NOVA.waitSelector('#movie_player')
      //    .then(movie_player => {
      //       // trigger default indicator
      //       // Strategy 1. Default indicator doesn't work for html5 way (Strategy 2)
      //       movie_player.addEventListener('onPlaybackRateChange', rate => {
      //          console.debug('onPlaybackRateChange', rate);
      //       });
      //    });

      if (user_settings.rate_overlay_time && +user_settings.rate_default !== 1) {
         reCalcOverlayTime();
      }

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            const sliderContainer = insertSlider.apply(video);
            // console.debug('sliderContainer', sliderContainer);

            // trigger default indicator
            // Strategy 2
            video.addEventListener('ratechange', function () {
               // console.debug('ratechange', movie_player.getPlaybackRate(), this.playbackRate);
               NOVA.triggerHUD(this.playbackRate + 'x');

               // slider update
               if (Object.keys(sliderContainer).length) {
                  sliderContainer.slider.value = this.playbackRate;
                  sliderContainer.slider.title = `Speed (${this.playbackRate})`;
                  sliderContainer.sliderLabel.textContent = `Speed (${this.playbackRate})`;
                  sliderContainer.sliderCheckbox.checked = (this.playbackRate === 1) ? false : true;
               }
            });

            setDefaultRate.apply(video); // init

            video.addEventListener('loadeddata', setDefaultRate); // update

            if (Object.keys(sliderContainer).length) {
               sliderContainer.slider.addEventListener('input', ({ target }) => playerRate.set(target.value));
               sliderContainer.slider.addEventListener('change', ({ target }) => playerRate.set(target.value));
               sliderContainer.slider.addEventListener('wheel', evt => {
                  evt.preventDefault();
                  const rate = playerRate.adjust(+user_settings.rate_step * Math.sign(evt.wheelDelta));
                  // console.debug('current rate:', rate);
               });
               sliderContainer.sliderCheckbox.addEventListener('change', ({ target }) => {
                  target.checked || playerRate.set(1)
               });
            }
            // expand memu
            // alt1 - https://greasyfork.org/en/scripts/421610-youtube-speed-up
            // alt2 - https://greasyfork.org/en/scripts/387654-edx-more-video-speeds
            // NOVA.runOnPageLoad(() => (NOVA.currentPage == 'watch') && expandAvailableRatesMenu());

            NOVA.runOnPageLoad(async () => {
               if (NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed') {
                  // custom speed from [save-channel-state] plugin
                  // alt - https://greasyfork.org/en/scripts/27091-youtube-speed-rememberer
                  if (user_settings['save-channel-state']) {
                     if (userRate = await NOVA.storage_obj_manager.getParam('speed')) {
                        playerRate.set(userRate);
                        video.addEventListener('canplay', () => playerRate.set(userRate), { capture: true, once: true });
                     }
                  }
                  // expand memu
                  expandAvailableRatesMenu();
               }
            });

         });

      // keyboard
      // alt1 - https://greasyfork.org/en/scripts/466105
      // alt2 - https://greasyfork.org/en/scripts/421464-html5-video-speed-controller-vlc-like
      // alt3 - https://greasyfork.org/en/scripts/405559-youtube-playback-rate-shortcut
      // alt4 - https://greasyfork.org/en/scripts/481189-youtube-playback-speed-up
      if (user_settings.rate_hotkey == 'keyboard') {
         document.addEventListener('keydown', evt => {
            if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;

            // movie_player.contains(document.activeElement) // don't use! stay overline
            if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
            if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
            // console.debug('evt.code', evt.code);

            let delta;
            switch (user_settings.rate_hotkey_custom_up.length === 1 ? evt.key : evt.code) {
               case user_settings.rate_hotkey_custom_up: delta = 1; break;
               case user_settings.rate_hotkey_custom_down: delta = -1; break;
            }
            if (delta) {
               evt.preventDefault();
               // evt.stopPropagation();
               // evt.stopImmediatePropagation();

               if (step = +user_settings.rate_step * Math.sign(delta)) {
                  const rate = playerRate.adjust(step);
                  // console.debug('current rate:', rate);
               }
            }
         }, { capture: true });
      }
      // mousewheel in player area
      else if (user_settings.rate_hotkey) {
         // NOVA.waitSelector('#movie_player') // broken, don't use
         NOVA.waitSelector('.html5-video-container')
            .then(container => {
               container.addEventListener('wheel', evt => {
                  evt.preventDefault();

                  if (evt[user_settings.rate_hotkey] || (user_settings.rate_hotkey == 'none'
                     && !evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey)
                  ) {
                     if (step = +user_settings.rate_step * Math.sign(evt.wheelDelta)) {
                        const rate = playerRate.adjust(step);
                        // console.debug('current rate:', rate);
                     }
                  }
               }, { capture: true });
            });
      }

      // once execute
      // during initialization, the icon can be loaded after the video
      if (+user_settings.rate_default !== 1 && user_settings.rate_apply_music) {
         // 'Official Artist' badge
         NOVA.waitSelector('#upload-info #channel-name .badge-style-type-verified-artist')
            .then(icon => playerRate.set(1));

         NOVA.waitSelector('#upload-info #channel-name a[href]', { destroy_after_page_leaving: true })
            .then(channelName => {
               // channelNameVEVO
               if (/(VEVO|Topic|Records|AMV)$/.test(channelName.textContent)
                  || channelName.textContent.toUpperCase().includes('MUSIC')
               ) {
                  playerRate.set(1);
               }
               // channelNameRecords:
               // https://www.youtube.com/channel/UCQnWm_Nnn35u3QGVkcAf87Q
               // https://www.youtube.com/channel/UCpDJl2EmP7Oh90Vylx0dZtA
               // https://www.youtube.com/channel/UCC7ElkFVK3m03gEMfaq6Ung
               // channelNameAMV - https://www.youtube.com/channel/UCtrt9u1luNTxXFDuYIoK2FA
               // special case channelNameLyrics - https://www.youtube.com/channel/UCK9HbSctHJ8n-aZmJsGD7_w
            });
      }


      const playerRate = {
         // DEBUG: true,

         // default method requires a multiplicity of 0.25
         testDefault: rate => ((+rate % .25) === 0)
            && (+rate <= 2)
            // && ((+user_settings.rate_step % .25) === 0)
            && (+user_settings.rate_default <= 2)
            && (NOVA.videoElement.playbackRate <= 2)
            && ((NOVA.videoElement.playbackRate % .25) === 0)
            && (typeof movie_player !== 'undefined' && movie_player.hasOwnProperty('getPlaybackRate')),
         // && (typeof movie_player !== 'undefined' && ('getPlaybackRate' in movie_player)),

         async set(level = 1) {
            this.log('set', ...arguments);
            if (this.testDefault(level)) {
               this.log('set:default');
               movie_player.setPlaybackRate(+level) && this.saveInSession(level);
            }
            else {
               this.log('set:html5');
               // NOVA.videoElement = await NOVA.waitSelector('video');
               // fix - Uncaught SyntaxError: Invalid left-hand side in assignment
               if (NOVA.videoElement) {
                  NOVA.videoElement.playbackRate = +level;
                  this.clearInSession();
               }
            }
         },

         adjust(rate_step = required()) {
            this.log('adjust', ...arguments);
            // return this.testDefault(rate_step)
            //    ? this.default(+rate_step) || this.html5(+rate_step)
            //    : this.html5(+rate_step);

            return (this.testDefault(rate_step) && this.default(+rate_step)) || this.html5(+rate_step);
         },
         // Strategy 1
         default(playback_rate = required()) {
            this.log('default', ...arguments);
            const playbackRate = movie_player.getPlaybackRate();
            // const inRange = delta => {
            //    const rangeRate = movie_player.getAvailablePlaybackRates();
            //    const playbackRateIdx = rangeRate.indexOf(playbackRate);
            //    return rangeRate[playbackRateIdx + delta];
            // };
            // const newRate = inRange(Math.sign(+playback_rate));
            const inRange = step => {
               const setRateStep = playbackRate + step;
               return (.1 <= setRateStep && setRateStep <= 2) && +setRateStep.toFixed(2);
            };
            const newRate = inRange(+playback_rate);
            // out of limits. Transfer control for html5
            if (!newRate) return false;

            // set new rate
            if (newRate && newRate != playbackRate) {
               movie_player.setPlaybackRate(newRate);

               if (newRate === movie_player.getPlaybackRate()) {
                  this.saveInSession(newRate);
               }
               else {
                  console.error('playerRate:default different: %s!=%s', newRate, movie_player.getPlaybackRate());
               }
            }
            this.log('default return', newRate);
            return newRate === movie_player.getPlaybackRate() && newRate;
         },
         // Strategy 2
         html5(playback_rate = required()) {
            this.log('html5', ...arguments);
            if (!NOVA.videoElement) return console.error('playerRate > videoElement empty:', NOVA.videoElement);

            const playbackRate = NOVA.videoElement.playbackRate;
            const inRange = step => {
               const setRateStep = playbackRate + step;
               return (.1 <= setRateStep && setRateStep <= (+user_settings.rate_max || 2)) && +setRateStep.toFixed(2);
            };
            const newRate = inRange(+playback_rate);
            // set new rate
            if (newRate && newRate != playbackRate) {
               // NOVA.videoElement?.defaultPlaybackRate = newRate;
               NOVA.videoElement.playbackRate = newRate;

               if (newRate === NOVA.videoElement.playbackRate) {
                  this.clearInSession();
               }
               else {
                  console.error('playerRate:html5 different: %s!=%s', newRate, NOVA.videoElement.playbackRate);
               }
            }
            this.log('html5 return', newRate);
            return newRate === NOVA.videoElement.playbackRate && newRate;
         },

         saveInSession(level = required()) {
            try {
               // https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API/Using
               sessionStorage['yt-player-playback-rate'] = JSON.stringify({
                  creation: Date.now(), data: level.toString(),
               });
               this.log('playbackRate save in session:', ...arguments);

            } catch (err) {
               // maybe can fix it. But didn't check - https://greasyfork.org/en/scripts/442991-youtube-embed-use-storage-access-api
               console.warn(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
            }
         },

         clearInSession() {
            const keyName = 'yt-player-playback-rate';
            try {
               // https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API/Using
               sessionStorage.hasOwnProperty(keyName) && sessionStorage.removeItem(keyName);
               this.log('playbackRate save in session:', ...arguments);

            } catch (err) {
               console.warn(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
            }
         },

         log() {
            if (this.DEBUG && arguments.length) {
               console.groupCollapsed(...arguments);
               console.trace();
               console.groupEnd();
            }
         },
      };

      function setDefaultRate() {
         // init rate_default
         // console.debug('setDefaultRate', +user_settings.rate_default, user_settings.rate_apply_music, isMusic());
         if (+user_settings.rate_default !== 1) {
            const is_music = NOVA.isMusic();
            // console.debug('isMusic', is_music);
            if (this.playbackRate !== +user_settings.rate_default
               && (!user_settings.rate_apply_music || !is_music)
               && (!isNaN(this.duration) && this.duration > 25) // min 25sec
            ) {
               // console.debug('update rate_default');
               playerRate.set(user_settings.rate_default);
            }
            // reset
            else if (this.playbackRate !== 1 && is_music) {
               // console.debug('reset rate_default');
               playerRate.set(1);
            }
         }
      }

      // alt1 - https://greasyfork.org/en/scripts/433222-improved-speed-slider-for-youtube-fix
      // alt2 - https://greasyfork.org/en/scripts/393900-improved-speed-slider-for-youtube
      // alt3 - https://greasyfork.org/en/scripts/470633-ytspeed
      // alt4 - https://greasyfork.org/en/scripts/483341-speed
      function insertSlider() {
         const
            SELECTOR_ID = 'nova-rate-slider-menu',
            SELECTOR = '#' + SELECTOR_ID; // for css

         NOVA.css.push(
            `${SELECTOR} [type="range"] {
               vertical-align: text-bottom;
               margin: '0 5px',
            }

            ${SELECTOR} [type="checkbox"] {
               appearance: none;
               outline: none;
               cursor: pointer;
            }

            ${SELECTOR} [type="checkbox"]:checked {
               background: #f00;
            }

            ${SELECTOR} [type="checkbox"]:checked:after {
               left: 20px;
               background-color: #fff;
            }`);

         // slider
         const slider = document.createElement('input');
         slider.className = 'ytp-menuitem-slider';
         slider.type = 'range';
         slider.min = +user_settings.rate_step;
         slider.max = Math.max((+user_settings.rate_max || 2), +user_settings.rate_default);
         slider.step = +user_settings.rate_step;
         slider.value = this.playbackRate;
         // slider.addEventListener('change', () => playerRate.set(slider.value));
         // slider.addEventListener('wheel', () => playerRate.set(slider.value));

         const sliderIcon = document.createElement('div');
         sliderIcon.className = 'ytp-menuitem-icon';

         const sliderLabel = document.createElement('div');
         sliderLabel.className = 'ytp-menuitem-label';
         sliderLabel.textContent = `Speed (${this.playbackRate})`;

         const sliderCheckbox = document.createElement('input');
         sliderCheckbox.className = 'ytp-menuitem-toggle-checkbox';
         sliderCheckbox.type = 'checkbox';
         sliderCheckbox.title = 'Remember speed';
         // sliderCheckbox.addEventListener('change', function () {
         //    this.value
         // });

         const out = {};

         // appends
         const right = document.createElement('div');
         right.className = 'ytp-menuitem-content';
         out.sliderCheckbox = right.appendChild(sliderCheckbox);
         out.slider = right.appendChild(slider);

         const speedMenu = document.createElement('div');
         speedMenu.className = 'ytp-menuitem';
         speedMenu.id = SELECTOR_ID;
         speedMenu.append(sliderIcon);
         out.sliderLabel = speedMenu.appendChild(sliderLabel);
         speedMenu.append(right);

         document.body.querySelector('.ytp-panel-menu')
            ?.append(speedMenu);

         return out;

         // append final html code
         // document.body.querySelector('.ytp-panel-menu')
         //    ?.insertAdjacentHTML('beforeend',
         //       `<div class="ytp-menuitem" id="rate-slider-menu">
         //          <div class="ytp-menuitem-icon"></div>
         //          <div class="ytp-menuitem-label">Speed (${user_settings.rate_default})</div>
         //          <div class="ytp-menuitem-content">
         //             <input type="checkbox" checked="${Boolean(user_settings.rate_default)}" title="Remember speed" class="ytp-menuitem-toggle-checkbox">
         //             <input type="range" min="0.5" max="4" step="0.1" class="ytp-menuitem-slider">
         //          </div>
         //       </div>`);
      }

      // function insertSlider() {
      //    // slider
      //    const slider = document.createElement('input');
      //    // slider.className = 'ytp-menuitem-slider';
      //    slider.type = 'range';
      //    slider.min = +user_settings.rate_step;
      //    slider.max = Math.max((+user_settings.rate_max || 2), +user_settings.rate_default);
      //    slider.step = +user_settings.rate_step;
      //    slider.value = this.playbackRate;
      //    slider.style.height = '100%';
      //    // // sliderCheckbox.addEventListener('change', function () {
      //    // //    this.value
      //    // // });

      //    const out = {};
      //    out.slider = slider;

      //    document.body.querySelector('#movie_player .ytp-right-controls')
      //       ?.prepend(slider);

      //    return out;
      // }

      function expandAvailableRatesMenu() {
         if (typeof _yt_player !== 'object') {
            return console.error('expandAvailableRatesMenu > _yt_player is empty', _yt_player);
         }

         // Strategy 1. local fn
         // if (path = findPathInObj({ 'obj': _yt_player, 'keys': 'getAvailablePlaybackRates' })) {
         //    setAvailableRates(_yt_player, 0, path.split('.'));
         // }

         // function findPathInObj({ obj = required(), keys = required(), path }) {
         //    const setPath = d => (path ? path + '.' : '') + d;

         //    for (const prop in obj) {
         //       if (obj.hasOwnProperty(prop) && obj[prop]) {
         //          if (keys === prop) {
         //             return this.path = setPath(prop)
         //          }
         //          // in deeper
         //          if (obj[prop].constructor.name == 'Function' && Object.keys(obj[prop]).length) {
         //             for (const j in obj[prop]) {
         //                if (typeof obj[prop] !== 'undefined') {
         //                   // if (prop in obj) {
         //                   // recursive
         //                   findPathInObj({
         //                      'obj': obj[prop][j],
         //                      'keys': keys,
         //                      'path': setPath(prop) + '.' + j,
         //                   });
         //                }
         //                if (this.path) return this.path;
         //             }
         //          }
         //       }
         //    }
         // }

         // Strategy 2. NOVA fn
         if (Object.keys(_yt_player).length
            && (path = NOVA.seachInObjectBy.key({
               'obj': _yt_player,
               'keys': 'getAvailablePlaybackRates',
               // 'match_fn': val => (typeof val === 'function') && val,
            })?.path)) {
            setAvailableRates(_yt_player, 0, path.split('.'));
         }

         function setAvailableRates(path, idx, arr) {
            if (arr.length - 1 == idx) {
               path[arr[idx]] = () => [.25, .5, .75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 10];
            }
            else {
               setAvailableRates(path[arr[idx]], idx + 1, arr);
            }
         }

      }


      function reCalcOverlayTime() {
         const
            ATTR_MARK = 'nova-thumb-overlay-time-recalc';

         // page update event
         document.addEventListener('yt-action', evt => {
            // console.log(evt.detail?.actionName);
            switch (evt.detail?.actionName) {
               case 'yt-append-continuation-items-action': // home, results, feed, channel, watch
               case 'ytd-update-grid-state-action': // feed, channel
               case 'yt-service-request': // results, watch
               case 'ytd-rich-item-index-update-action': // home, channel

                  // console.log(evt.detail?.actionName); // flltered
                  switch (NOVA.currentPage) {
                     case 'home':
                     case 'results':
                     case 'feed':
                     case 'channel':
                     case 'watch':
                        // document.body.querySelectorAll(`#thumbnail #overlays #time-status #text:not([${ATTR_MARK}])`)
                        // document.body.querySelectorAll(`#thumbnail #overlays ytd-thumbnail-overlay-time-status-renderer:not([${ATTR_MARK}])`)
                        document.body.querySelectorAll(`#thumbnail #overlays #text:not([${ATTR_MARK}])`)
                           .forEach(overlay => {
                              if ((timeLabelEl = overlay.textContent.trim())
                                 // && !timeLabelEl.startsWith('⚡')
                              ) {
                                 overlay.setAttribute(ATTR_MARK, true); // mark
                                 // overlay.style.border = '2px solid orange'; // mark for test
                                 const timeSec = NOVA.formatTimeOut.hmsToSec(timeLabelEl);
                                 overlay.textContent = // '⚡' + // broken `thumbs_hide_min_duration` in [thumbs-hide] plugin
                                    NOVA.formatTimeOut.HMS.digit(timeSec / user_settings.rate_default);
                              }
                           });
                        break;

                     // default:
                     //    break;
                  }
                  break;

               // default:
               //    break;
            }
         });
      }

   },
   options: {
      rate_default: {
         _tagName: 'input',
         // label: 'Default rate',
         label: 'Speed at startup',
         'label:zh': '启动速度',
         'label:ja': '起動時の速度',
         // 'label:ko': '시작 시 속도',
         // 'label:id': 'Kecepatan saat startup',
         // 'label:es': 'Velocidad al inicio',
         'label:pt': 'Velocidade na inicialização',
         'label:fr': 'Rapidité au démarrage',
         // 'label:it': "Velocità all'avvio",
         // 'label:tr': 'Başlangıçta hız',
         'label:de': 'Geschwindigkeit beim Start',
         'label:pl': 'Prędkość przy uruchamianiu',
         'label:ua': 'Звичайна швидкість',
         type: 'number',
         title: '1 - default',
         step: 0.05,
         min: 1,
         max: 5, // rate_max
         value: 1,
      },
      rate_apply_music: {
         _tagName: 'select',
         label: 'For music genre',
         // 'label:zh': '音乐流派视频',
         // 'label:ja': '音楽ジャンルのビデオ',
         // 'label:ko': '음악 장르',
         // 'label:id': 'Genre musik',
         // 'label:es': 'Género musical',
         // 'label:pt': 'Gênero musical',
         // 'label:fr': 'Genre de musique',
         // 'label:it': 'Genere musicale',
         // // 'label:tr': 'Müzik tarzı',
         // 'label:de': 'Musikrichtung',
         // 'label:pl': 'Gatunek muzyczny',
         // 'label:ua': 'Жарн музики',
         title: 'Extended detection - may trigger falsely',
         'title:zh': '扩展检测 - 可能会错误触发',
         'title:ja': '拡張検出-誤ってトリガーされる可能性があります',
         // 'title:ko': '확장 감지 - 잘못 트리거될 수 있음',
         // 'title:id': 'Deteksi diperpanjang - dapat memicu salah',
         // 'title:es': 'Detección extendida - puede activarse falsamente',
         'title:pt': 'Detecção estendida - pode disparar falsamente',
         'title:fr': 'Détection étendue - peut se déclencher par erreur',
         // 'title:it': 'Rilevamento esteso - potrebbe attivarsi in modo errato',
         // 'title:tr': 'Genişletilmiş algılama - yanlış tetiklenebilir',
         'title:de': 'Erweiterte Erkennung - kann fälschlicherweise auslösen',
         'title:pl': 'Rozszerzona detekcja - może działać błędnie',
         'title:ua': 'Розширене виявлення - може спрацювати помилково',
         options: [
            {
               label: 'skip', value: true, selected: true,
               'label:zh': '跳过',
               'label:ja': 'スキップ',
               // 'label:ko': '건너 뛰기',
               // 'label:id': 'merindukan',
               // 'label:es': 'saltar',
               'label:pt': 'pular',
               'label:fr': 'sauter',
               // 'label:it': 'Perdere',
               // 'label:tr': 'atlamak',
               'label:de': 'überspringen',
               'label:pl': 'tęsknić',
               'label:ua': 'пропустити',
            },
            // {
            //    label: 'skip (extended)', value: 'expanded',
            //    'label:zh': '跳过（扩展检测）',
            //    'label:ja': 'スキップ（拡張検出）',
            //    'label:ko': '건너뛰다(확장)',
            //    'label:id': 'lewati (diperpanjang)',
            //    'label:es': 'omitir (extendida)',
            //    'label:pt': 'pular (estendido)',
            //    'label:fr': 'sauter (étendu)',
            //    'label:it': 'salta (esteso)',
            //    // 'label:tr': 'atlamak (genişletilmiş)',
            //    'label:de': 'überspringen (erweitert)',
            //    'label:pl': 'pomiń (rozszerzony)',
            //    'label:ua': 'пропустити (розширено)',
            // },
            {
               label: 'force apply', value: false,
               'label:zh': '施力',
               'label:ja': '力を加える',
               // 'label:ko': '강제 적용',
               // 'label:id': 'berlaku paksa',
               // 'label:es': 'aplicar fuerza',
               'label:pt': 'aplicar força',
               'label:fr': 'appliquer la force',
               // 'label:it': 'applicare la forza',
               // 'label:tr': 'zorlamak',
               'label:de': 'kraft anwenden',
               'label:pl': 'zastosować siłę',
               'label:ua': 'примусово активувати',
            },
         ],
         'data-dependent': { 'rate_default': '!1' },
      },
      rate_overlay_time: {
         _tagName: 'input',
         label: 'Recalculate overlay time',
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
         title: 'by startup value',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         'data-dependent': { 'rate_default': '!1' },
      },
      rate_hotkey: {
         _tagName: 'select',
         label: 'Hotkey',
         'label:zh': '热键',
         'label:ja': 'ホットキー',
         // 'label:ko': '단축키',
         // 'label:id': 'Tombol pintas',
         // 'label:es': 'Tecla de acceso rápido',
         'label:pt': 'Tecla de atalho',
         'label:fr': 'Raccourci',
         // 'label:it': 'Tasto di scelta rapida',
         // 'label:tr': 'Kısayol tuşu',
         'label:de': 'Schnelltaste',
         'label:pl': 'Klawisz skrótu',
         'label:ua': 'Гаряча клавіша',
         options: [
            // { label: 'none', /*value: false*/ },
            { label: 'none', value: false }, // need for for 'data-dependent' in rate_max
            { label: 'alt+wheel', value: 'altKey', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'wheel', value: 'none' },
            { label: 'keyboard', value: 'keyboard' },
         ],
      },
      // rate_mode: { // does not support multiple of `0.25` in "rate_default"
      //    _tagName: 'select',
      //    label: 'Mode',
      //    'label:zh': '模式',
      //    'label:ja': 'モード',
      //    // 'label:ko': '방법',
      //    // 'label:id': 'Mode',
      //    // 'label:es': 'Modo',
      //    'label:pt': 'Modo',
      //    // 'label:fr': 'Mode',
      //    // 'label:it': 'Modalità',
      //    // 'label:tr': 'Mod',
      //    'label:de': 'Modus',
      //    'label:pl': 'Tryb',
      //    'label:ua': 'Режим',
      //    options: [
      //       {
      //          label: 'collapse', value: 'hide', selected: true,
      //       },
      //       {
      //          label: 'remove', value: 'disable',
      //       },
      //    ],
      //    'data-dependent': { 'rate_hotkey': ['!false'] },
      // },
      rate_hotkey_custom_up: {
         _tagName: 'select',
         label: 'Hotkey up',
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
            { label: ']', value: ']', selected: true },
            { label: 'none', /*value: false,*/ }, // activate if no default "selected" mark
            // { label: 'none', value: false },
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'shiftL', value: 'ShiftLeft' },
            { label: 'shiftR', value: 'ShiftRight' },
            { label: 'ctrlL', value: 'ControlLeft' },
            { label: 'ctrlR', value: 'ControlRight' },
            { label: 'altL', value: 'AltLeft' },
            { label: 'altR', value: 'AltRight' },
            { label: 'ArrowUp', value: 'ArrowUp' },
            { label: 'ArrowDown', value: 'ArrowDown' },
            // { label: 'ArrowLeft', value: 'ArrowLeft' },
            // { label: 'ArrowRight', value: 'ArrowRight' },
            { label: 'A', value: 'KeyA' },
            { label: 'B', value: 'KeyB' },
            { label: 'C', value: 'KeyC' },
            { label: 'D', value: 'KeyD' },
            { label: 'E', value: 'KeyE' },
            { label: 'F', value: 'KeyF' },
            { label: 'G', value: 'KeyG' },
            { label: 'H', value: 'KeyH' },
            { label: 'I', value: 'KeyI' },
            { label: 'J', value: 'KeyJ' },
            { label: 'K', value: 'KeyK' },
            { label: 'L', value: 'KeyL' },
            { label: 'M', value: 'KeyM' },
            { label: 'N', value: 'KeyN' },
            { label: 'O', value: 'KeyO' },
            { label: 'P', value: 'KeyP' },
            { label: 'Q', value: 'KeyQ' },
            { label: 'R', value: 'KeyR' },
            { label: 'S', value: 'KeyS' },
            { label: 'T', value: 'KeyT' },
            { label: 'U', value: 'KeyU' },
            { label: 'V', value: 'KeyV' },
            { label: 'W', value: 'KeyW' },
            { label: 'X', value: 'KeyX' },
            { label: 'Y', value: 'KeyY' },
            { label: 'Z', value: 'KeyZ' },
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            /*']',*/ '[', '+', '-', ',', '.', '/', '<', ';', '\\',
         ],
         'data-dependent': { 'rate_hotkey': ['keyboard'] },
      },
      rate_hotkey_custom_down: {
         _tagName: 'select',
         label: 'Hotkey down',
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
            { label: '[', value: '[', selected: true },
            { label: 'none', /*value: false,*/ }, // activate if no default "selected" mark
            // { label: 'none', value: false },
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'shiftL', value: 'ShiftLeft' },
            { label: 'shiftR', value: 'ShiftRight' },
            { label: 'ctrlL', value: 'ControlLeft' },
            { label: 'ctrlR', value: 'ControlRight' },
            { label: 'altL', value: 'AltLeft' },
            { label: 'altR', value: 'AltRight' },
            { label: 'ArrowUp', value: 'ArrowUp' },
            { label: 'ArrowDown', value: 'ArrowDown' },
            // { label: 'ArrowLeft', value: 'ArrowLeft' },
            // { label: 'ArrowRight', value: 'ArrowRight' },
            { label: 'A', value: 'KeyA' },
            { label: 'B', value: 'KeyB' },
            { label: 'C', value: 'KeyC' },
            { label: 'D', value: 'KeyD' },
            { label: 'E', value: 'KeyE' },
            { label: 'F', value: 'KeyF' },
            { label: 'G', value: 'KeyG' },
            { label: 'H', value: 'KeyH' },
            { label: 'I', value: 'KeyI' },
            { label: 'J', value: 'KeyJ' },
            { label: 'K', value: 'KeyK' },
            { label: 'L', value: 'KeyL' },
            { label: 'M', value: 'KeyM' },
            { label: 'N', value: 'KeyN' },
            { label: 'O', value: 'KeyO' },
            { label: 'P', value: 'KeyP' },
            { label: 'Q', value: 'KeyQ' },
            { label: 'R', value: 'KeyR' },
            { label: 'S', value: 'KeyS' },
            { label: 'T', value: 'KeyT' },
            { label: 'U', value: 'KeyU' },
            { label: 'V', value: 'KeyV' },
            { label: 'W', value: 'KeyW' },
            { label: 'X', value: 'KeyX' },
            { label: 'Y', value: 'KeyY' },
            { label: 'Z', value: 'KeyZ' },
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            ']', /*'[',*/ '+', '-', ',', '.', '/', '<', ';', '\\',
         ],
         'data-dependent': { 'rate_hotkey': ['keyboard'] },
      },
      rate_step: {
         _tagName: 'input',
         label: 'Hotkey step',
         'label:zh': '步',
         'label:ja': 'ステップ',
         // 'label:ko': '단계',
         // 'label:id': 'Melangkah',
         // 'label:es': 'Paso',
         'label:pt': 'Degrau',
         'label:fr': 'Étape',
         // 'label:it': 'Fare un passo',
         // 'label:tr': 'Adım',
         'label:de': 'Schritt',
         'label:pl': 'Krok',
         'label:ua': 'Крок',
         type: 'number',
         title: '0.25 - default',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         placeholder: '0.1-1',
         step: 0.05,
         min: 0.05,
         max: 0.5,
         value: 0.25,
      },
      rate_max: {
         _tagName: 'input',
         label: 'Hotkey Max',
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
         type: 'number',
         title: '2 - default',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         placeholder: '2-5',
         step: .05,
         min: 2,
         max: 5, // rate_default
         value: 2,
         'data-dependent': { 'rate_hotkey': ['!false', '!'] },
      },
   }
});
