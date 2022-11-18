// for test:
// https://www.youtube.com/watch?v=9JzmYISeRMA&list=OLAK5uy_kDx6ubTnuS4mYHCPyyX1NpXyCtoQN08M4

window.nova_plugins.push({
   id: 'playlist-toggle-autoplay',
   title: 'Playlist autoplay control button',
   'title:zh': '播放列表自动播放控制',
   'title:ja': 'プレイリストの自動再生コントロール',
   'title:ko': '재생 목록 자동 재생 제어',
   'title:id': 'Tombol kontrol putar otomatis daftar putar',
   'title:es': 'Control de reproducción automática de listas de reproducción',
   'title:pt': 'Controle de reprodução automática da lista de reprodução',
   'title:fr': 'Contrôle de lecture automatique de la liste de lecture',
   'title:it': 'Pulsante di controllo della riproduzione automatica della playlist',
   'title:tr': 'Oynatma listesi otomatik oynatma kontrolü',
   'title:de': 'Steuerung der automatischen Wiedergabe von Wiedergabelisten',
   'title:pl': 'Kontrola autoodtwarzania listy odtwarzania',
   'title:ua': 'Кнопка керування автовідтворенням',
   run_on_pages: 'watch, -mobile',
   // restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/415542-youtube-prevent-playlist-autoplay

      if (window.nova_playlistReversed) return; // conflict with plugin

      const
         SELECTOR_ID = 'nova-playlist-autoplay-btn', // .switcher
         SELECTOR = '#' + SELECTOR_ID; // for css

      let sesionAutoplayState = user_settings.playlist_autoplay;

      // init checkboxBtn style
      NOVA.css.push(
         `#playlist-action-menu .top-level-buttons {
            align-items: center;
         }
         ${SELECTOR}[type=checkbox] {
            --height: 1em;
            width: 2.2em;
         }
         ${SELECTOR}[type=checkbox]:after {
            transform: scale(1.5);
         }
         ${SELECTOR}[type=checkbox] {
            --opacity: .7;
            --color: #fff;
            height: var(--height);
            line-height: 1.6em;
            border-radius: 3em;
            background-color: var(--paper-toggle-button-unchecked-bar-color, #000000);
            appearance: none;
            -webkit-appearance: none;
            position: relative;
            cursor: pointer;
            outline: 0;
            border: none;
         }
         ${SELECTOR}[type=checkbox]:after {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: var(--height);
            height: var(--height);
            border-radius: 50%;
            background-color: var(--color);
            box-shadow: 0 0 .25em rgba(0, 0, 0, .3);
            /* box-shadow: 0 .1em .25em #999999; */
         }
         ${SELECTOR}[type=checkbox]:checked:after {
            left: calc(100% - var(--height));
            --color: var(--paper-toggle-button-checked-button-color, var(--primary-color));
         }
         ${SELECTOR}[type=checkbox]:focus, input[type=checkbox]:focus:after {
            transition: all 200ms ease-in-out;
         }
         ${SELECTOR}[type=checkbox]:disabled {
            opacity: .3;
         }`);

      NOVA.runOnEveryPageTransition(insertButton);

      function insertButton() {
         // if (!NOVA.queryURL.has('list')/* || !movie_player?.getPlaylistId()*/) return;
         if (!location.search.includes('list=')) return;
         if (window.nova_playlistReversed) return; // conflict with plugin

         NOVA.waitElement('ytd-watch-flexy.ytd-page-manager:not([hidden]) ytd-playlist-panel-renderer:not([collapsed]) #playlist-action-menu .top-level-buttons:not([hidden]), #secondary #playlist #playlist-action-menu #top-level-buttons-computed')
            .then(el => renderCheckbox(el));

         function renderCheckbox(container = required()) {
            if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

            document.getElementById(SELECTOR_ID)?.remove(); // clear old

            const checkboxBtn = document.createElement('input');
            // checkboxBtn.className = '';
            checkboxBtn.id = SELECTOR_ID;
            checkboxBtn.type = 'checkbox';
            checkboxBtn.title = 'Playlist toggle autoplay';
            checkboxBtn.addEventListener('change', ({ target }) => {
               // setAssociatedAutoplay(target.checked);
               sesionAutoplayState = target.checked;
               setAssociatedAutoplay();
            });
            container.append(checkboxBtn);

            checkboxBtn.checked = sesionAutoplayState; // set default state
            // setAssociatedAutoplay(sesionAutoplayState);
            setAssociatedAutoplay();

            // function setAssociatedAutoplay(state) {
            function setAssociatedAutoplay() {
               // get playlist manager
               if (manager = document.body.querySelector('yt-playlist-manager')) {
                  manager.interceptedForAutoplay = true;
                  manager.canAutoAdvance_ = checkboxBtn.checked;
                  // let currentExpected = true
                  // manager.onYtNavigateStart_ = function () { this.canAutoAdvance_ = currentExpected = false }
                  // manager.onYtNavigateFinish_ = function () { currentExpected = true; this.canAutoAdvance_ = checkboxBtn.checked ? currentExpected : false }
                  // checkbox update state
                  checkboxBtn.checked = manager?.canAutoAdvance_;
                  checkboxBtn.title = `Playlist Autoplay is ${manager?.canAutoAdvance_ ? 'ON' : 'OFF'}`;

               } else console.error('Error playlist-autoplay. Playlist manager is', manager);
            }

         }
      }

   },
   options: {
      playlist_autoplay: {
         _tagName: 'select',
         label: 'Default state',
         'label:zh': '默认状态',
         'label:ja': 'デフォルト状態',
         'label:ko': '기본 상태',
         // 'label:id': 'Status default',
         'label:es': 'Estado predeterminado',
         'label:pt': 'Estado padrão',
         'label:fr': 'État par défaut',
         'label:it': 'Stato predefinito',
         'label:tr': 'Varsayılan',
         'label:de': 'Standardzustand',
         'label:pl': 'Stan domyślny',
         'label:ua': 'Cтан за замовчуваням',
         options: [
            { label: 'play', value: true, selected: true },
            { label: 'stop', value: false },
         ],
      },
   }
});
