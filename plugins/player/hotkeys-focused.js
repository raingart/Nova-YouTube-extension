window.nova_plugins.push({
   id: 'player-hotkeys-focused',
   title: 'Player hotkeys always active',
   'title:zh': '播放器热键始终处于活动状态',
   'title:ja': 'プレーヤーのホットキーは常にアクティブです',
   'title:es': 'Teclas de acceso rápido del jugador siempre activas',
   'title:pt': 'Teclas de atalho do jogador sempre ativas',
   'title:de': 'Player-Hotkeys immer aktiv',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'Player hotkeys always active【SPACE/F】etc.',
   _runtime: user_settings => {

      document.addEventListener('keydown', ({ target }) => {
         if (['input', 'textarea'].includes(target.localName) || target.isContentEditable) return;

         // document.activeElement.style.border = "2px solid red"; // mark for test
         // console.debug('active element', target.localName);

         document.body.querySelector('video')?.focus();
      });

   },
});
