window.nova_plugins.push({
   id: 'theater-mode',
   title: 'Theater mode',
   'title:zh': '剧场模式',
   'title:ja': 'シアターモード',
   'title:ko': '극장 모드',
   'title:es': 'Modo teatro',
   'title:pt': 'Modo teatro',
   'title:fr': 'Mode théâtre',
   'title:de': 'Theatermodus',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Auto enable player full-width mode',
   'desc:zh': '自动为播放器启用全宽模式',
   'desc:ja': 'プレーヤーの全幅モードを自動有効にする',
   'desc:ko': '플레이어 전체 너비 모드 자동 활성화',
   // 'desc:pt': 'Habilitar automaticamente o modo de largura total do player',
   // 'desc:fr': 'Activer automatiquement le mode pleine largeur du lecteur',
   // 'desc:de': 'Player-Modus mit voller Breite automatisch aktivieren',
   // 'desc:es': 'Activar automáticamente el modo de ancho completo del reproductor',
   _runtime: user_settings => {

      // NOVA.waitElement('ytd-watch-flexy:not([theater])') // wrong way. Reassigns manual exit from the mode
      NOVA.waitElement('ytd-watch-flexy')
         .then(el => el.theaterModeChanged_(true));

   },
});
