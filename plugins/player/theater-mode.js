window.nova_plugins.push({
   id: 'theater-mode',
   title: 'Theater mode',
   'title:zh': '剧场模式',
   'title:ja': 'シアターモード',
   'title:es': 'Modo teatro',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto enable player full-width mode',
   'desc:zh': '自动为播放器启用全宽模式',
   'desc:ja': 'プレーヤーの全幅モードを自動有効にする',
   'desc:es': 'Activar automáticamente el modo de ancho completo del reproductor',
   _runtime: user_settings => {

      // NOVA.waitElement('ytd-watch-flexy:not([theater])') // wrong way. Reassigns manual exit from the mode
      NOVA.waitElement('ytd-watch-flexy')
         .then(el => el.theaterModeChanged_(true));

   },
});
