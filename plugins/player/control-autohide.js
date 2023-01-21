window.nova_plugins.push({
   id: 'player-control-autohide',
   title: 'Hide controls on player',
   'title:zh': '播放器上的自动隐藏控件',
   'title:ja': 'プレーヤーのコントロールを自動非表示',
   'title:ko': '플레이어의 자동 숨기기 컨트롤',
   'title:id': 'Sembunyikan kontrol pada pemutar',
   'title:es': 'Ocultar automáticamente los controles en el reproductor',
   'title:pt': 'Auto-ocultar controles no player',
   'title:fr': 'Masque le panneau de contrôle du lecteur',
   'title:it': 'Nascondi i controlli sul giocatore',
   // 'title:tr': 'Oynatıcıdaki kontrolleri otomatik gizle',
   'title:de': 'Blendet das Player-Bedienfeld aus',
   'title:pl': 'Ukrywaj elementy w odtwarzaczu',
   'title:ua': 'Приховати панель керування у відтворювачі',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Hover controls to display it',
   'desc:zh': '将鼠标悬停在它上面以显示它',
   'desc:ja': 'カーソルを合わせると表示されます',
   'desc:ko': '그것을 표시하려면 그 위로 마우스를 가져갑니다',
   'desc:id': 'Arahkan kontrol untuk menampilkannya',
   'desc:es': 'Coloca el cursor sobre él para mostrarlo',
   'desc:pt': 'Passe o mouse sobre ele para exibi-lo',
   'desc:fr': "Survolez-le pour l'afficher",
   'desc:it': 'Passa il mouse sui controlli per visualizzarlo',
   // 'desc:tr': 'Görüntülemek için üzerine gelin',
   'desc:de': 'Bewegen Sie den Mauszeiger darüber, um es anzuzeigen',
   'desc:pl': 'Najedź, aby wyświetlić',
   'desc:ua': 'Наведіть мишкою щоб показати',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/435487-youtube-always-hoverable-progressbar
      // alt2 - https://greasyfork.org/en/scripts/446045-youtube-hide-controls-until-hover

      let selector, selectorControlHover, selectorFloatProgressBar;

      switch (user_settings.player_control_autohide_container) {
         case 'player':
            selector = '#movie_player';
            selectorControlHover = '#movie_player:hover .ytp-chrome-bottom';
            selectorFloatProgressBar = '#movie_player:not(:hover)';
            break;

         // case 'control':
         default:
            selector = '.ytp-chrome-bottom';
            selectorControlHover = '.ytp-chrome-bottom:hover';
            selectorFloatProgressBar = '.ytp-chrome-bottom:not(:hover) ~';
            break;
      }
      // Do not forget check selector name in "player-float-progress-bar"
      NOVA.css.push(
         `.ytp-chrome-bottom, .ytp-gradient-bottom {
            opacity: 0;
         }
         ${selectorControlHover},
         ${selector}:hover .ytp-gradient-bottom {
            opacity: 1;
         }
         /* patch for plugin "player-float-progress-bar" */
         ${selectorFloatProgressBar} #nova-player-float-progress-bar {
            visibility: visible !important;
         }`);

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
         // 'label:ua': '',
         options: [
            { label: 'player', value: 'player', selected: true },
            { label: 'control', value: 'control' },
         ],
      },
   }
});
