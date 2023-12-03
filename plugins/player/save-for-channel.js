window.nova_plugins.push({
   id: 'save-channel-state',
   // title: 'Save for specific channel',
   title: 'Add button "Save params for the channel"',
   'title:zh': '특정 채널에 저장',
   'title:ja': '特定のチャンネル用に保存',
   'title:ko': '특정 채널에 저장',
   'title:id': 'Simpan untuk saluran tertentu',
   'title:es': 'Guardar para un canal específico',
   'title:pt': 'Salvar para canal específico',
   'title:fr': 'Enregistrer pour un canal spécifique',
   'title:it': 'Salva per canale specifico',
   // 'title:tr': '',
   'title:de': 'Speichern Sie für einen bestimmten Kanal',
   'title:pl': 'Zapisz dla określonego kanału',
   'title:ua': 'Зберегти для конкретного каналу',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/454696-youtube-defaulter

      const
         // container <a>
         SELECTOR_BUTTON_ID = 'nova-channels-state',
         SELECTOR_BUTTON = '#' + SELECTOR_BUTTON_ID,
         SELECTOR_BUTTON_CLASS_NAME = 'nova-right-custom-button', // same class in "player-buttons-custom" plugin
         // list <ul>
         SELECTOR_BUTTON_LIST_ID = SELECTOR_BUTTON_CLASS_NAME + '-list',
         SELECTOR_BUTTON_LIST = '#' + SELECTOR_BUTTON_LIST_ID,
         // btn <span>
         SELECTOR_BUTTON_TITLE_ID = SELECTOR_BUTTON_CLASS_NAME + '-title';


      // inset button + list
      // NOVA.waitSelector('#movie_player .ytp-left-controls .ytp-play-button')
      NOVA.waitSelector('#movie_player .ytp-right-controls')
         .then(container => {
            initStyles();

            NOVA.runOnPageInitOrTransition(async () => {
               if (NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed') {
                  // init storage
                  await NOVA.storage_obj_manager.initStorage();
                  // const
                  //    CACHE_PREFIX = 'nova-channels-state:',
                  //    channelId = NOVA.getChannelId();
                  // // init storage
                  // NOVA.storage_obj_manager.STORAGE_NAME = CACHE_PREFIX + channelId;

                  if (btn = document.getElementById(SELECTOR_BUTTON_ID)) {
                     btn.append(genList());
                  }
                  else {
                     const btn = document.createElement('button');
                     btn.id = SELECTOR_BUTTON_ID;
                     btn.className = `ytp-button ${SELECTOR_BUTTON_CLASS_NAME}`;
                     // empty opacity
                     // if (!NOVA.storage_obj_manager.read()) {
                     //    btn.style.opacity = .5;
                     // }
                     // btn.style.minWidth = getComputedStyle(container).width || '48px';
                     btn.title = 'Save channel state';
                     // btnPopup.setAttribute('aria-label','');
                     // btn.innerHTML = `save`;

                     const btnTitle = document.createElement('span');
                     btnTitle.id = SELECTOR_BUTTON_TITLE_ID;
                     btnTitle.style.display = 'flex';
                     btnTitle.innerHTML =
                        `<svg width="100%" height="100%" viewBox="-140 -140 500 500">
                           <g fill="currentColor">
                              <path d="M198.5,0h-17v83h-132V0h-49v231h230V32.668L198.5,0z M197.5,199h-165v-83h165V199z" />
                              <rect width="33" x="131.5" height="66" />
                           </g>
                        </svg>`;
                     // `<svg width="100%" height="100%" viewBox="-300 -300 1000 1000">
                     //    <g fill="currentColor">
                     //       <path d="M388.49,0H0.022v453.03h452.986V64.561L388.49,0z M385.017,221.834H110.68V25.691h274.337V221.834z"/>
                     //       <rect x="272.568" y="46.701" width="80.718" height="154.102" />
                     //    </g>
                     // </svg>`;

                     btn.prepend(btnTitle);
                     btn.append(genList());
                     // container.after(btn);
                     container.prepend(btn);
                  }
                  btnTitleStateUpdate(Boolean(NOVA.storage_obj_manager.read()));
               }
            });

         });

      function btnTitleStateUpdate(state) {
         document.getElementById(SELECTOR_BUTTON_TITLE_ID)
            // .style.color = state ? '#27a6e5' : 'unset';
            // .style.setProperty('color', state ? '#27a6e5' : '');
            .style.setProperty('opacity', state ? 1 : .3);
      }

      // document.addEventListener('yt-navigate-start', () => console.debug('yt-navigate-start'));
      // document.addEventListener('yt-navigate-finish', () => {
      //    if
      // });

      // NOVA.videoElement?.addEventListener('canplay', genList); // update

      function genList() {
         // qualityList.innerHTML = '';
         const ul = document.createElement('ul');
         ul.id = SELECTOR_BUTTON_LIST_ID;

         // append buttons based on activated plugins
         let listItem = [];
         // the same name as in the corresponding option inside the plugin
         if (user_settings['video-quality']) {
            listItem.push({ name: 'quality', getSaveDataFn: movie_player.getPlaybackQuality });
         }
         if (user_settings['rate-wheel']) {
            listItem.push({ name: 'speed', getSaveDataFn: movie_player.getPlaybackRate });
         }
         if (user_settings['volume-wheel']) {
            listItem.push({ name: 'volume', getSaveDataFn: () => ~~(movie_player.getVolume()) });
         }
         // if (user_settings['vsubtitles']) {
         listItem.push({
            name: 'subtitles',
            getSaveDataFn: () => {
               movie_player.toggleSubtitlesOn();
               return true;
            },
            // customInit: movie_player.toggleSubtitlesOn,
            customInit: () => {
               NOVA.waitUntil(() => {
                  movie_player.toggleSubtitlesOn();
                  return document.body.querySelector('.ytp-caption-window-top[id^="caption-window"]');
               }, 500); // 500ms
            },
         });
         // }
         if (user_settings['player-resume-playback']) {
            listItem.push({ name: 'ignore-playback', label: 'unsave playback time', getSaveDataFn: () => true });
         }
         if (user_settings['player-loop']) {
            listItem.push({ name: 'loop', getSaveDataFn: () => true });
         }

         // input-checkbox
         listItem.forEach(async element => {
            const storage = NOVA.storage_obj_manager._getParam(element.name);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checkbox-${element.name}`;
            checkbox.checked = Boolean(storage);
            checkbox.className = 'ytp-menuitem-toggle-checkbox';

            const li = document.createElement('li');
            li.innerHTML =
               `<label for="checkbox-${element.name}">
                  ${element.label || element.name} <span>${storage || ''}</span>
               </label>`;
            li.title = storage ? `Currently stored value ${storage}` : 'none';

            if (Boolean(storage) && element.hasOwnProperty('customInit') && typeof element.customInit === 'function') {
               element.customInit();
            }

            checkbox.addEventListener('change', () => {
               let state;
               // update state
               if (checkbox.checked && (state = element.getSaveDataFn())) {
                  NOVA.storage_obj_manager.save({ [element.name]: state });
               }
               else {
                  NOVA.storage_obj_manager.remove(element.name);
               }
               // echo state
               li.title = state ? `Currently stored value ${state}` : 'none';
               li.querySelector('span').textContent = state || '';
               btnTitleStateUpdate(Boolean(state));
            });

            li.prepend(checkbox);
            ul.append(li);
         });

         // alt - https://greasyfork.org/en/scripts/392459-youtube-automatic-bs-skip
         // input-number (skip_into_step)
         if (user_settings['time-jump']) {
            const
               SLIDER_LABEL = 'skip into',
               SLIDER_STORAGE_NAME = 'skip-into', // the same name as in the corresponding option inside the plugin [time-jump]
               storage = +NOVA.storage_obj_manager._getParam(SLIDER_STORAGE_NAME);

            const slider = document.createElement('input');
            // slider.type = 'number';
            slider.type = 'range';
            slider.min = 0;
            slider.max = 120;
            slider.step = 1;
            slider.value = storage || 0;
            // slider.placeholder = '0';
            // slider.style.width = '30px';

            const li = document.createElement('li');
            li.innerHTML =
               `<label for="checkbox-${SLIDER_STORAGE_NAME}">
                  ${SLIDER_LABEL} <span>${storage || ''}</span>
               </label>`;
            // li.title = storage ? `Currently stored value ${storage}` : 'none';
            li.title = 'Simple alternative SponsorBlock';

            slider.addEventListener('change', sliderChange);
            slider.addEventListener('input', sliderChange);
            slider.addEventListener('wheel', evt => {
               evt.preventDefault();
               evt.target.value = +evt.target.value + Math.sign(evt.wheelDelta);
               sliderChange(evt);
            });

            // fot "slider.type = 'number'"
            // const li = document.createElement('li');
            // li.innerHTML = `<label>${SLIDER_STORAGE_NAME}</label>`;
            // li.title = 'Use arrow to set sec.';

            li.prepend(slider);
            ul.append(li);

            function sliderChange({ target }) {
               // update state
               if (state = +target.value) {
                  NOVA.storage_obj_manager.save({ [SLIDER_STORAGE_NAME]: +target.value });
               }
               else {
                  NOVA.storage_obj_manager.remove(SLIDER_STORAGE_NAME);
               }
               // echo state
               li.title = state ? `Currently stored value ${state}` : 'none';
               li.querySelector('span').textContent = state || '';
               btnTitleStateUpdate(Boolean(state));
            }
         }

         return ul;
      }

      function initStyles() {
         NOVA.css.push(
            SELECTOR_BUTTON + ` {
               overflow: visible !important;
               position: relative;
               text-align: center !important;
               vertical-align: top;
               font-weight: bold;
            }

            .ytp-left-controls {
               overflow: visible !important;
            }

            ${SELECTOR_BUTTON_LIST} {
               position: absolute;
               bottom: 2.5em !important;
               left: -2.2em;
               list-style: none;
               padding-bottom: 1.5em !important;
               z-index: ${+NOVA.css.getValue('.ytp-progress-bar', 'z-index') + 1};
            }

            /* for embed */
            html[data-cast-api-enabled] ${SELECTOR_BUTTON_LIST} {
               margin: 0;
               padding: 0;
               bottom: 3.3em;
               /* --yt-spec-brand-button-background: #c00; */
            }

            ${SELECTOR_BUTTON}:not(:hover) ${SELECTOR_BUTTON_LIST} {
               display: none;
            }

            ${SELECTOR_BUTTON_LIST} li {
               cursor: pointer;
               white-space: nowrap;
               line-height: 1.4;
               background: rgba(28, 28, 28, 0.9);
               margin: .3em 0;
               padding: .5em 1em;
               border-radius: .3em;
               color: #fff;
               text-align: left !important;
               display: grid;
               grid-template-columns: auto auto;
               align-items: center;
               justify-content: start;
            }

            ${SELECTOR_BUTTON_LIST} li label {
               cursor: pointer;
               padding-left: 5px;
            }

            ${SELECTOR_BUTTON_LIST} li.active { background: #720000; }
            ${SELECTOR_BUTTON_LIST} li.disable { color: #666; }
            ${SELECTOR_BUTTON_LIST} li:not(:hover) { opacity: .8; }
            /* brackets */
            ${SELECTOR_BUTTON_LIST} li span:not(:empty):before { content: '('; }
            ${SELECTOR_BUTTON_LIST} li span:not(:empty):after { content: ')'; }

            /* checkbox */
            ${SELECTOR_BUTTON_LIST} [type="checkbox"] {
               appearance: none;
               outline: none;
               cursor: pointer;
            }

            ${SELECTOR_BUTTON_LIST} [type="checkbox"]:checked {
               background: #f00;
            }

            ${SELECTOR_BUTTON_LIST} [type="checkbox"]:checked:after {
               left: 20px;
               background-color: #fff;
            }`);
      }

   },
});
