window.nova_plugins.push({
   id: 'disable-page-sleep',
   title: 'Disable page sleep',
   'title:zh': '禁用页面休眠',
   'title:ja': 'ページスリープを無効にする',
   'title:es': 'Desactivar la suspensión de la página',
   'title:pt': 'Desativar página suspensa',
   'title:de': 'Seitenschlaf deaktivieren',
   run_on_pages: 'watch',
   section: 'player',
   desc: "prevent 'Video paused' alert",
   'desc:zh': "防止[视频暂停]警报",
   'desc:ja': "「Video paused」アラートを防止します",
   'desc:es': "evitar la alerta de 'Video en pausa'",
   'desc:pt': "evitar o alerta de 'Vídeo pausado'",
   'desc:de': "Warnung 'Video pausiert' verhindern",
   _runtime: user_settings => {

      window.setInterval(() => window._lact = window._fact = Date.now(), 1000 * 60 * 5); // 5 min

      // NOVA.waitElement('yt-confirm-dialog-renderer #confirm-button')
      NOVA.waitElement('[role="dialog"] #confirm-button')
         .then(btn => {
            btn.click();
            if ((vid = document.body.querySelector('video')) && vid.paused) {
               vid.play();
            }
         });
   },
});
