// for test
// the adjustment area depends on the video size. Problems are visible at non-standard proportions
// https://www.youtube.com/watch?v=embed%2FJVi_e - err - TypeError: Cannot read property 'playerMicroformatRenderer' of undefined

// fot "isMusic" fn test
// https://www.youtube.com/watch?v=kCHiSHxTXgg - svg icon "🎵"
// https://www.youtube.com/results?search_query=Highly+Suspect+-+Upperdrugs+-+2019 // test transition. Open firt thumb "Highly Suspect 🎵"

window.nova_plugins.push({
   id: 'rate-wheel',
   title: 'Playback speed control',
   'title:zh': '播放速度控制',
   'title:ja': '再生速度制御',
   'title:ko': '재생 속도 제어',
   'title:id': 'Kontrol kecepatan pemutaran',
   'title:es': 'Controle de velocidade de reprodução',
   'title:pt': 'Controle de velocidade de reprodução',
   'title:fr': 'Contrôle de la vitesse de lecture',
   'title:it': 'Controllo della velocità di riproduzione',
   'title:tr': 'Oynatma hızı kontrolü',
   'title:de': 'Steuerung der Wiedergabegeschwindigkeit',
   'title:pl': 'Kontrola prędkości odtwarzania',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: 'Use mouse wheel to change playback speed',
   desc: 'with mouse wheel',
   'desc:zh': '带鼠标滚轮',
   'desc:ja': 'マウスホイール付き',
   'desc:ko': '마우스 휠로',
   'desc:id': 'dengan roda mouse',
   'desc:es': 'con rueda de ratón',
   'desc:pt': 'com roda do mouse',
   'desc:fr': 'avec molette de la souris',
   'desc:it': 'con rotellina del mouse',
   'desc:tr': 'fare tekerleği ile',
   'desc:de': 'mit mausrad',
   'desc:pl': 'za pomocą kółka myszy',
   _runtime: user_settings => {

      const musicIconSvgSelector = '#upload-info #channel-name svg path[d*="M12,4v9.38C11.27,12.54,10.2,12,9,12c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4V8h6V4H12z"]';

      // NOVA.waitElement('#movie_player')
      //    .then(movie_player => {
      //       // trigger default indicator
      //       // Strategy 1. Default indicator doesn't work for html5 way (Strategy 2)
      //       movie_player.addEventListener('onPlaybackRateChange', rate => {
      //          console.debug('onPlaybackRateChange', rate);
      //       });
      //    });

      NOVA.waitElement('video')
         .then(video => {
            const sliderConteiner = renderSlider.apply(video);
            // console.debug('sliderConteiner', sliderConteiner);

            // trigger default indicator
            // Strategy 2
            video.addEventListener('ratechange', function () {
               // console.debug('ratechange', movie_player.getPlaybackRate(), this.playbackRate);
               NOVA.bezelTrigger(this.playbackRate + 'x');

               // slider update
               if (Object.keys(sliderConteiner).length) {
                  sliderConteiner.slider.value = this.playbackRate;
                  sliderConteiner.sliderLabel.textContent = `Speed (${this.playbackRate})`;
                  sliderConteiner.sliderCheckbox.checked = this.playbackRate === 1 ? false : true;
               }
            });

            setDefaultRate(); // init

            video.addEventListener('loadeddata', setDefaultRate); // update

            if (Object.keys(sliderConteiner).length) {
               sliderConteiner.slider.addEventListener('input', ({ target }) => playerRate.set(target.value));
               sliderConteiner.slider.addEventListener('change', ({ target }) => playerRate.set(target.value));
               sliderConteiner.slider.addEventListener('wheel', evt => {
                  evt.preventDefault();
                  const rate = playerRate.adjust(+user_settings.rate_step * Math.sign(evt.wheelDelta));
                  // console.debug('current rate:', rate);
               });
               sliderConteiner.sliderCheckbox.addEventListener('change', ({ target }) => target.checked || playerRate.set(1));
            }
         });

      // mousewheel in player area
      if (user_settings.rate_hotkey) {
         NOVA.waitElement('.html5-video-container')
            .then(container => {
               container.addEventListener('wheel', evt => {
                  evt.preventDefault();

                  if (evt[user_settings.rate_hotkey]
                     || (user_settings.rate_hotkey == 'none' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey)) {
                     // console.debug('hotkey caught');
                     const rate = playerRate.adjust(+user_settings.rate_step * Math.sign(evt.wheelDelta));
                     // console.debug('current rate:', rate);
                  }
               });
            });
      }

      // during initialization, the icon can be loaded after the video
      if (+user_settings.rate_default !== 1 && user_settings.rate_default_apply_music) {
         NOVA.waitElement(musicIconSvgSelector)
            .then(icon => playerRate.set(1));

         NOVA.waitElement('#upload-info #channel-name a[href]')
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
         testDefault: rate => (+rate % .25) === 0
            && +rate <= 2
            && +user_settings.rate_default <= 2
            && (typeof movie_player !== 'undefined' && movie_player.hasOwnProperty('getPlaybackRate')),

         async set(level = 1) {
            this.log('set', ...arguments);
            if (this.testDefault(level)) {
               this.log('set:default');
               movie_player.setPlaybackRate(+level) && this.saveInSession(level);

            } else {
               this.log('set:html5');
               NOVA.videoElement = await NOVA.waitElement('video');
               if (NOVA.videoElement) { // fix - Uncaught SyntaxError: Invalid left-hand side in assignment
                  NOVA.videoElement.playbackRate = +level;
                  this.clearInSession();
               }
            }
         },

         adjust(rate_step = required()) {
            this.log('adjust', ...arguments);
            return this.testDefault(rate_step) ? this.default(+rate_step) : this.html5(+rate_step);
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
            // set new rate
            if (newRate && newRate != playbackRate) {
               movie_player.setPlaybackRate(newRate);

               if (newRate === movie_player.getPlaybackRate()) {
                  this.saveInSession(newRate);

               } else {
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
               return (.1 <= setRateStep && setRateStep <= 3) && +setRateStep.toFixed(2);
            };
            const newRate = inRange(+playback_rate);
            // set new rate
            if (newRate && newRate != playbackRate) {
               // NOVA.videoElement?.defaultPlaybackRate = newRate;
               NOVA.videoElement.playbackRate = newRate;

               if (newRate === NOVA.videoElement.playbackRate) {
                  this.clearInSession();

               } else {
                  console.error('playerRate:html5 different: %s!=%s', newRate, NOVA.videoElement.playbackRate);
               }
            }
            this.log('html5 return', newRate);
            return newRate === NOVA.videoElement.playbackRate && newRate;
         },

         saveInSession(level = required()) {
            try {
               sessionStorage['yt-player-playback-rate'] = JSON.stringify({
                  creation: Date.now(), data: level.toString(),
               })
               this.log('playbackRate save in session:', ...arguments);

            } catch (err) {
               console.warn(`${err.name}: save "rate" in sessionStorage failed. It seems that "Block third-party cookies" is enabled`, err.message);
            }
         },

         clearInSession() {
            const keyName = 'yt-player-playback-rate';
            try {
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
         // console.debug('setDefaultRate', +user_settings.rate_default, user_settings.rate_default_apply_music, isMusic());
         if (+user_settings.rate_default !== 1) {
            const is_music = isMusic();
            if (NOVA.videoElement?.playbackRate !== +user_settings.rate_default
               && (!user_settings.rate_default_apply_music || !is_music)
            ) {
               // console.debug('update rate_default');
               playerRate.set(user_settings.rate_default);

            } else if (NOVA.videoElement?.playbackRate !== 1 && is_music) { // reset
               // console.debug('reset rate_default');
               playerRate.set(1);
            }
         }

         function isMusic() {
            const
               channelName = document.body.querySelector('#upload-info #channel-name a:not(:empty)')?.textContent,
               titleStr = movie_player.getVideoData().title
                  // add playlist title check
                  + ((playlistTitle = document.querySelector('#secondary #playlist #header-description a[href*="/playlist"]:not(:empty)')?.textContent) ? '.' + playlistTitle : ''), // https://www.youtube.com/watch?v=cEdVLDfV1e0&list=PLVrIzE02N3EE9mplAPO8BGleeenadCSNv&index=2
               titleWords = titleStr?.match(/\w+/g);

            if (user_settings.rate_default_apply_music == 'expanded') {
               // 【MAD】,『MAD』,「MAD」
               // warn false finding ex: "AUDIO visualizer" 'underCOVER','VOCALoid','write THEME','UI THEME','photo ALBUM', 'lolyPOP', 'ascENDING', speeED, 'LapOP' 'Ambient AMBILIGHT lighting', 'CD Projekt RED', TEASER
               if (titleStr.split(' - ').length === 2  // search for a hyphen. Ex.:"Artist - Song"
                  || ['【', '『', '「', 'CD', 'AUDIO', 'FULL', 'TOP', 'TRACK', 'TRAP', 'THEME', 'PIANO', 'POP', '8-BIT'].some(i => titleWords?.map(w => w.toUpperCase()).includes(i))
               ) {
                  return true;
               }
            }

            return [
               titleStr,
               location.href, // 'music.youtube.com' or 'youtube.com#music'
               channelName,

               // ALL BELOW - not updated after page transition!
               // window.ytplayer?.config?.args.title,
               // document.querySelector('meta[itemprop="genre"][content]')?.content,
               // window.ytplayer?.config?.args.raw_player_response.microformat?.playerMicroformatRenderer.category,
               document.body.querySelector('ytd-player')?.player_?.getCurrentVideoConfig()?.args.raw_player_response?.microformat.playerMicroformatRenderer.category
            ]
               .some(i => i?.toUpperCase().includes('MUSIC') || i?.toUpperCase().includes('SOUND'))
               // has svg icon "🎵"
               || document.body.querySelector(musicIconSvgSelector)
               // channelNameVEVO
               || /(VEVO|Topic|Records|AMV)$/.test(channelName) // https://www.youtube.com/channel/UCHV1I4axw-6pCeQTUu7YFhA
               // word
               || titleWords?.length && ['🎵', '♫', 'SONG', 'SOUND', 'SOUNDTRACK', 'LYRIC', 'LYRICS', 'AMBIENT', 'MIX', 'REMIX', 'VEVO', 'CLIP', 'KARAOKE', 'OPENING', 'COVER', 'VOCAL', 'INSTRUMENTAL', 'DNB', 'BASS', 'BEAT', 'ALBUM', 'PLAYLIST', 'DUBSTEP', 'CHILL', 'RELAX', 'EXTENDED', 'CINEMATIC']
                  .some(i => titleWords.map(w => w.toUpperCase()).includes(i))
               // words
               || ['OFFICIAL VIDEO', 'OFFICIAL AUDIO', 'FEAT.', 'FT.', 'LIVE RADIO', 'DANCE VER', 'HIP HOP', 'HOUR VER', 'HOURS VER'] // 'FULL ALBUM'
                  .some(i => titleStr.toUpperCase().includes(i))
               // word (case sensitive)
               || titleWords?.length && ['OP', 'ED', 'MV', 'PV', 'OST', 'NCS', 'BGM', 'EDM', 'GMV', 'AMV', 'MMD', 'MAD']
                  .some(i => titleWords.includes(i));
         }
      }

      function renderSlider() {
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
         slider.max = Math.max(2, +user_settings.rate_default);
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

   },
   options: {
      rate_default: {
         _tagName: 'input',
         // label: 'Default rate',
         label: 'Speed at startup',
         'label:zh': '启动速度',
         'label:ja': '起動時の速度',
         'label:ko': '시작 시 속도',
         'label:id': '',
         'label:es': 'Velocidad al inicio',
         'label:pt': 'Velocidade na inicialização',
         'label:fr': 'Rapidité au démarrage',
         'label:it': '',
         'label:tr': 'Başlangıçta hız',
         'label:de': 'Geschwindigkeit beim Start',
         'label:pl': 'Prędkość przy uruchamianiu',
         type: 'number',
         title: '1 - default',
         // placeholder: '1-3',
         step: 0.05,
         min: 1,
         // max: 3,
         value: 1,
      },
      rate_default_apply_music: {
         _tagName: 'select',
         label: 'Music genre',
         'label:zh': '音乐流派视频',
         'label:ja': '音楽ジャンルのビデオ',
         'label:ko': '음악 장르',
         'label:id': 'Genre musik',
         'label:es': 'Género musical',
         'label:pt': 'Gênero musical',
         'label:fr': 'Genre de musique',
         'label:it': 'Genere musicale',
         'label:tr': 'Müzik tarzı',
         'label:de': 'Musikrichtung',
         'label:pl': 'Gatunek muzyczny',
         title: 'extended detection - may trigger falsely',
         'title:zh': '扩展检测 - 可能会错误触发',
         'title:ja': '拡張検出-誤ってトリガーされる可能性があります',
         'title:ko': '확장 감지 - 잘못 트리거될 수 있음',
         'title:id': 'deteksi diperpanjang - dapat memicu salah',
         // 'title:es': 'detección extendida - puede activarse falsamente',
         'title:pt': 'detecção estendida - pode disparar falsamente',
         'title:fr': 'détection étendue - peut se déclencher par erreur',
         'title:it': 'rilevamento esteso - potrebbe attivarsi in modo errato',
         'title:tr': 'genişletilmiş algılama - yanlış tetiklenebilir',
         'title:de': 'erweiterte Erkennung - kann fälschlicherweise auslösen',
         'title:pl': 'rozszerzona detekcja - może działać błędnie',
         options: [
            { label: 'skip', value: true, selected: true, 'label:zh': '跳过', 'label:ja': 'スキップ', 'label:ko': '건너 뛰기', /*'label:id': '',*/ 'label:es': 'saltar', 'label:pt': 'pular', 'label:fr': 'sauter', /*'label:it': '',*/ 'label:tr': 'atlamak', 'label:de': 'überspringen'/*, 'label:pl': ''*/ },
            { label: 'skip (extended)', value: 'expanded', 'label:zh': '跳过（扩展检测）', 'label:ja': 'スキップ（拡張検出）', 'label:ko': '건너뛰다(확장)', /*'label:id': '',*/ 'label:es': 'omitir (extendida)', 'label:pt': 'pular (estendido)', 'label:fr': 'sauter (étendu)', /*'label:it': '',*/ 'label:tr': 'atlamak (genişletilmiş)', 'label:de': 'überspringen (erweitert)'/*, 'label:pl': ''*/ },
            { label: 'force apply', value: false, 'label:zh': '施力', 'label:ja': '力を加える', 'label:ko': '강제 적용', /*'label:id': '',*/ 'label:es': 'aplicar fuerza', 'label:pt': 'aplicar força', 'label:fr': 'appliquer la force', /*'label:it': '',*/ 'label:tr': 'zorlamak', 'label:de': 'kraft anwenden'/*, 'label:pl': ''*/ },
         ],
         'data-dependent': { 'rate_default': '!1' },
      },
      rate_step: {
         _tagName: 'input',
         label: 'Step',
         'label:zh': '步',
         'label:ja': 'ステップ',
         'label:ko': '단계',
         'label:id': 'Melangkah',
         'label:es': 'Paso',
         'label:pt': 'Degrau',
         'label:fr': 'Étape',
         'label:it': 'Fare un passo',
         'label:tr': 'Adım',
         'label:de': 'Schritt',
         'label:pl': 'Krok',
         type: 'number',
         title: '0.25 - default',
         placeholder: '0.1-1',
         step: 0.05,
         min: 0.1,
         max: 0.5,
         value: 0.25,
      },
      rate_hotkey: {
         _tagName: 'select',
         label: 'Hotkey',
         'label:zh': '热键',
         'label:ja': 'ホットキー',
         'label:ko': '단축키',
         'label:id': 'Tombol pintas',
         'label:es': 'Tecla de acceso rápido',
         'label:pt': 'Tecla de atalho',
         'label:fr': 'Raccourci',
         'label:it': 'Tasto di scelta rapida',
         'label:tr': 'Kısayol tuşu',
         'label:de': 'Schnelltaste',
         'label:pl': 'Klawisz skrótu',
         options: [
            { label: 'alt+wheel', value: 'altKey', selected: true },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'wheel', value: 'none' },
            { label: 'disable', value: false },
         ],
      },
   }
});
