window.nova_plugins.push({
   id: 'player-control-autohide',
   // title: 'Hide controls on player',
   // title: 'Hide player controls panel',
   title: 'Hide player control panel if not hovered',
   'title:zh': '播放器上的自动隐藏控件',
   'title:ja': 'プレーヤーのコントロールを自動非表示',
   // 'title:ko': '플레이어의 자동 숨기기 컨트롤',
   // 'title:id': 'Sembunyikan kontrol pada pemutar',
   // 'title:es': 'Ocultar automáticamente los controles en el reproductor',
   'title:pt': 'Auto-ocultar controles no player',
   'title:fr': 'Masque le panneau de contrôle du lecteur',
   // 'title:it': 'Nascondi i controlli sul giocatore',
   // 'title:tr': 'Oynatıcıdaki kontrolleri otomatik gizle',
   'title:de': 'Blendet das Player-Bedienfeld aus',
   'title:pl': 'Ukrywaj elementy w odtwarzaczu',
   'title:ua': 'Приховати панель керування у відтворювачі',
   run_on_pages: 'watch, -mobile',
   section: 'control-panel',
   desc: 'Hover controls to display it',
   'desc:zh': '将鼠标悬停在它上面以显示它',
   'desc:ja': 'カーソルを合わせると表示されます',
   // 'desc:ko': '그것을 표시하려면 그 위로 마우스를 가져갑니다',
   // 'desc:id': 'Arahkan kontrol untuk menampilkannya',
   // 'desc:es': 'Coloca el cursor sobre él para mostrarlo',
   'desc:pt': 'Passe o mouse sobre ele para exibi-lo',
   'desc:fr': "Survolez-le pour l'afficher",
   // 'desc:it': 'Passa il mouse sui controlli per visualizzarlo',
   // 'desc:tr': 'Görüntülemek için üzerine gelin',
   'desc:de': 'Bewegen Sie den Mauszeiger darüber, um es anzuzeigen',
   'desc:pl': 'Najedź, aby wyświetlić',
   'desc:ua': 'Наведіть мишкою щоб показати',
   'data-conflict': 'player-control-below',
   _runtime: user_settings => {

      if (user_settings['player-control-below']) return; // conflict with [player-control-below] plugin

      // alt1 - https://greasyfork.org/en/scripts/435487-youtube-always-hoverable-progressbar
      // alt2 - https://greasyfork.org/en/scripts/446045-youtube-hide-controls-until-hover

      let selectorHover, selectorGradientHide;

      switch (user_settings.player_control_autohide_container) {
         case 'player':
            selectorHover = 'ytd-watch-flexy:not([fullscreen]) #movie_player:hover .ytp-chrome-bottom';
            selectorGradientHide = '#movie_player:not(:hover) .ytp-gradient-bottom';

            // fixControlFreeze on hover
            NOVA.waitSelector('#movie_player')
               .then(movie_player => {
                  triggerOnHoverElement({
                     'element': movie_player,
                     'callback': function (hovered) {
                        if (hovered) this.mouseMoveIntervalId = fixControlFreeze();
                        else clearInterval(this.mouseMoveIntervalId);
                     },
                  });
               });

            break;

         // case 'control':
         default:
            selectorHover = '.ytp-chrome-bottom:hover';
            selectorGradientHide = '#movie_player:has(.ytp-chrome-bottom:not(:hover)) .ytp-gradient-bottom';
            break;
      }
      // Do not forget check selector name in "player-float-progress-bar"
      NOVA.css.push(
         // `${selectorGradientHide}
         `.ytp-chrome-bottom {
            opacity: 0;
         }
         ${selectorHover} {
            opacity: 1;
         }

         /* patch for plugin [player-float-progress-bar] */
         ytd-watch-flexy:not([fullscreen]) #movie_player.ytp-autohide:hover #nova-player-float-progress-bar {
            visibility: hidden !important;
         }`);

      // To above v105 https://developer.mozilla.org/en-US/docs/Web/CSS/:has
      NOVA.css.push(
         `${selectorGradientHide} {
            opacity: 0;
         }`);


      function triggerOnHoverElement({ element = required(), callback = required() }) {
         // console.debug('triggerOnHoverElement', ...arguments);
         if (!(element instanceof HTMLElement)) return console.error('triggerOnHoverElement:', typeof element);
         if (typeof callback !== 'function') return console.error('triggerOnHoverElement callback:', typeof callback);

         const isHover = e => e.parentElement.querySelector(':hover') === e;
         document.addEventListener('mousemove', function checkHover() {
            const hovered = isHover(element);
            if (hovered !== checkHover.hovered) {
               // console.log(hovered ? 'hovered' : 'not hovered');
               checkHover.hovered = hovered;
               return callback(hovered);
            }
         });
      }

      // // moveMousePeriodic
      // // this.mouseMoveIntervalId = fixControlFreeze()
      // // a copy of the function is also in plugin [player-control-below]
      function fixControlFreeze(ms = 2000) {
         // if (typeof this.mouseMoveIntervalId === 'number') clearTimeout(this.mouseMoveIntervalId); // reset interval
         // const moveMouse = new Event('mousemove');
         // this.mouseMoveIntervalId = setInterval(() => {
         return setInterval(() => {
            if (NOVA.currentPage === 'watch'
               && document.visibilityState == 'visible'
               && movie_player.classList.contains('playing-mode')
               && !document.fullscreenElement // Doesn't work in fullscreen mode
            ) {
               // console.debug('moveMouse event');
               // movie_player.dispatchEvent(moveMouse);
               movie_player.wakeUpControls();
            }
         }, ms);
      }

   },
   options: {
      player_control_autohide_container: {
         _tagName: 'select',
         label: 'Hover container',
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
         'label:ua': 'Відображати вміст при наведенні',
         options: [
            {
               label: 'player', value: 'player', selected: true,
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
               'label:ua': 'програвач',
            },
            {
               label: 'control', value: 'control',
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
               'label:ua': 'панель керування',
            },
         ],
      },
   }
});
