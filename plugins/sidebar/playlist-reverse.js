window.nova_plugins.push({
   id: 'playlist-reverse',
   title: 'Reverse playlist order',
   'title:zh': '反转播放列表顺序',
   'title:ja': 'プレイリストの順序を逆にする',
   'title:es': 'Orden inverso de la lista de reproducción',
   run_on_pages: 'watch, playlist',
   // restart_on_transition: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_BTN_ID = 'reverse-playlist-button',
         SELECTOR_BTN = '#' + SELECTOR_BTN_ID, // for css
         CLASS_NAME_ACTIVE = 'reverse-on';

      let idx, reverseEnable;

      NOVA.css.push(
         SELECTOR_BTN + ` {
            background: none;
            border: 0;
            margin-left: 8px;
         }

         yt-icon-button {
            width: 40px;
            height: 40px;
            padding: 10px;
         }

         ${SELECTOR_BTN} svg {
            fill: white;
            fill: var(--yt-spec-text-secondary);
         }

         ${SELECTOR_BTN}:hover svg { fill: #66afe9; }

         ${SELECTOR_BTN}:active svg,
         ${SELECTOR_BTN}.${CLASS_NAME_ACTIVE} svg { fill: #2196f3; }`);

      // add reverse button
      // missed work half the time
      document.addEventListener('yt-navigate-finish', () => {
         NOVA.waitElement('#playlist-action-menu #top-level-buttons-computed')
            .then(e => appendReverseBtn(e));
      });
      // // not optimal but stable
      // document.addEventListener('yt-visibility-refresh', () => {
      //    if (!document.getElementById(SELECTOR_BTN_ID)) {
      //       NOVA.waitElement('#playlist-action-menu #top-level-buttons-computed')
      //          .then(e => appendReverseBtn(e));
      //    }
      // });

      function appendReverseBtn(container) {
         document.getElementById(SELECTOR_BTN_ID)?.remove(); // clear old

         const reverseControl = document.createElement('div');
         // style="cursor: pointer; margin-left: 8px;" id="pytplir_btn"
         if (reverseEnable) reverseControl.className = CLASS_NAME_ACTIVE;
         reverseControl.id = SELECTOR_BTN_ID;
         reverseControl.title = 'Reverse playlist order';
         reverseControl.innerHTML =
            `<yt-icon-button>
               <svg x="0px" y="0px" viewBox="0 0 381.399 381.399" xml:space="preserve" height="100%" width="100%" version="1.1">
                  <g>
                  <path d="M233.757,134.901l-63.649-25.147v266.551c0,2.816-2.286,5.094-5.104,5.094h-51.013c-2.82,0-5.099-2.277-5.099-5.094 V109.754l-63.658,25.147c-2.138,0.834-4.564,0.15-5.946-1.669c-1.389-1.839-1.379-4.36,0.028-6.187L135.452,1.991 C136.417,0.736,137.91,0,139.502,0c1.576,0,3.075,0.741,4.041,1.991l96.137,125.061c0.71,0.919,1.061,2.017,1.061,3.109 c0,1.063-0.346,2.158-1.035,3.078C238.333,135.052,235.891,135.735,233.757,134.901z M197.689,378.887h145.456v-33.62H197.689 V378.887z M197.689,314.444h145.456v-33.622H197.689V314.444z M197.689,218.251v33.619h145.456v-33.619H197.689z"/>
               </g>
               </svg>
            </yt-icon-button>`;
         reverseControl.addEventListener('click', () => {
            reverseElement(document.querySelector('#playlist #items.playlist-items'));
            scrollToElement(document.querySelector('#playlist-items[selected]'));
            // document.querySelector('#playlist[collapsed] #expand-icon').click(); // uncollapse. Bug with unlimited playlist

            // NOVA.waitElement('video')
            //    .then(video => {
            //       reverseControl.classList.toggle(CLASS_NAME_ACTIVE);

            //       video.addEventListener('ended', () => {
            //          if (NOVA.queryURL.get('list')) {
            //             player = document.getElementById('movie_player'),
            //                player.previousVideo();
            //          }
            //       });

            //       video.addEventListener('playing', () => {
            //          if (!NOVA.queryURL.get('list')) return;

            //          let idxNew = NOVA.queryURL.get('index');
            //          if (idxNew !== idx) {
            //             idx = idxNew;
            //             reverseElement(document.querySelector('#playlist #items.playlist-items'));
            //             scrollToElement(document.querySelector('#playlist-items[selected]'));
            //             updateNextButton();
            //          }
            //       });
            //    });

            NOVA.waitElement('#movie_player')
               .then(player => {
                  if (reverseEnable) {
                     location.reload(); // force apply removeEventListener
                     // does not work
                     // player.removeEventListener('onStateChange', onPlayerStateChange.bind(player), true);
                     // reverseEnable = false;

                  } else {
                     player.addEventListener('onStateChange', onPlayerStateChange.bind(player));
                     reverseEnable = true;
                  }
                  reverseControl.classList.toggle(CLASS_NAME_ACTIVE);
               });
         });
         container.append(reverseControl);
      }

      function onPlayerStateChange(state) {
         if (!NOVA.queryURL.get('list')) return;
         // console.debug('playerState', NOVA.PLAYERSTATE[state]);

         switch (NOVA.PLAYERSTATE[state]) {
            case 'ENDED': // video ended
               this.previousVideo();
               break;

            case 'PLAYING': // on hover "next button"
               let idxNew = NOVA.queryURL.get('index');
               if (idxNew !== idx) {
                  idx = idxNew;
                  reverseElement(document.querySelector('#playlist #items.playlist-items'));
                  scrollToElement(document.querySelector('#playlist-items[selected]'));
                  updateNextButton();
               }
               break;
         }
      }

      function updateNextButton() {
         const
            nextItem = document.querySelector('#playlist [selected] + *'),
            nextURL = nextItem?.querySelector('a').href;

         if (!nextURL) return;

         if (next_button = document.querySelector('.ytp-next-button')) {
            next_button.href = nextURL;
            next_button.dataset.preview = nextItem.querySelector('img').src;
            next_button.dataset.tooltipText = nextItem.querySelector('#video-title').textContent;
         }
         if (playlistManager = document.querySelector('yt-playlist-manager')?.autoplayData.sets[0].nextButtonVideo) {
            playlistManager.commandMetadata.webCommandMetadata.url = nextURL.replace(location.origin, '');
            playlistManager.watchEndpoint.videoId = NOVA.queryURL.get('v', nextURL);

         }
      }

      function reverseElement(container) {
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
         container.append(...Array.from(container.childNodes).reverse());
      }

      function scrollToElement(targetEl) {
         if (!(targetEl instanceof HTMLElement)) return console.error('targetEl not HTMLElement:', targetEl);
         const container = targetEl.parentElement;
         container.scrollTop = targetEl.offsetTop - container.offsetTop;
      }

      // scroll does not work
      // NOVA.css.push(
      //    `#playlist #items.playlist-items {
      //       display: flex;
      //       flex-direction: column-reverse;
      //     }`);
      // NOVA.waitElement('#movie_player')
      //    .then(player => {
      //       // 0: ended
      //       const onPlayerStateChange = state => (state === 0) && player.previousVideo();
      //    });
   },
});
