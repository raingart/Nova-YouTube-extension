window.nova_plugins.push({
   id: 'player-hotkeys-focused',
   title: 'Player hotkeys always active',
   'title:zh': '播放器热键始终处于活动状态',
   'title:ja': 'プレーヤーのホットキーは常にアクティブです',
   'title:ko': '플레이어 단축키는 항상 활성화되어 있습니다',
   'title:es': 'Teclas de acceso rápido del jugador siempre activas',
   'title:pt': 'Teclas de atalho do jogador sempre ativas',
   'title:fr': 'Les raccourcis clavier du joueur sont toujours actifs',
   'title:tr': 'Oyuncu kısayol tuşları her zaman etkin',
   'title:de': 'Player-Hotkeys immer aktiv',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'Player hotkeys always active【SPACE/F】etc.',
   _runtime: user_settings => {

      document.addEventListener('keydown', ({ target }) => {
         if (['input', 'textarea'].includes(target.localName) || target.isContentEditable) return;

         document.body.querySelector('video')?.focus();
         // document.activeElement.style.border = '2px solid red'; // mark for test
         // console.debug('active element', target.localName);
      });

   },
});
