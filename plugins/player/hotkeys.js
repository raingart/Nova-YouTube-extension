window.nova_plugins.push({
   id: 'player-hotkeys-focused',
   title: 'Player shortcuts always active',
   'title:zh': '播放器热键始终处于活动状态',
   'title:ja': 'プレーヤーのホットキーは常にアクティブです',
   'title:ko': '플레이어 단축키는 항상 활성화되어 있습니다',
   'title:id': 'Tombol pintas pemain selalu aktif',
   'title:es': 'Teclas de acceso rápido del jugador siempre activas',
   'title:pt': 'Teclas de atalho do jogador sempre ativas',
   'title:fr': 'Les raccourcis clavier du joueur sont toujours actifs',
   'title:it': 'Tasti di scelta rapida del giocatore sempre attivi',
   // 'title:tr': 'Oyuncu kısayol tuşları her zaman etkin',
   'title:de': 'Player-Hotkeys immer aktiv',
   'title:pl': 'Klawisze skrótów dla graczy zawsze aktywne',
   'title:ua': 'Гарячі клавіші відтворювача завжди активні',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: 'Player hotkeys always active【SPACE/F】etc.',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/444329-youtube-fixed-actions
      // alt2 - https://greasyfork.org/en/scripts/445540-youtubedisablefocusvolume
      // alt3 - https://greasyfork.org/en/scripts/38643-youtube-key-shortcuts-fix
      // alt4 - https://greasyfork.org/en/scripts/462196-auto-focus

      document.addEventListener('keydown', evt => {
         // movie_player.contains(document.activeElement) // don't use! stay overline
         if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;

         // NOVA.videoElement?.focus(); // video
         movie_player.focus(); // player
         // document.activeElement.style.border = '2px solid red'; // mark for test
         // console.debug('active element', target.localName);

         if (user_settings.hotkeys_disable_numpad && evt.code.startsWith('Numpad')) {
            // console.debug('evt.code', evt.code);
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
         }
      });

      // fix after seeking with mouse (only for progress-bar)
      // document.addEventListener('click', ({ target }) => {
      //    // if (document.body.querySelector('.ytp-progress-bar')?.contains(document.activeElement)) {
      //    if (document.activeElement.classList.contains('ytp-progress-bar')) {
      //       alert(1)
      //       // NOVA.videoElement?.focus(); // video
      //       movie_player.focus(); // player
      //       // document.activeElement.style.border = '2px solid red'; // mark for test
      //    }
      // });

   },
   options: {
      hotkeys_disable_numpad: {
         _tagName: 'input',
         label: 'Disable numpad hotkeys',
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
      },
   }
});
