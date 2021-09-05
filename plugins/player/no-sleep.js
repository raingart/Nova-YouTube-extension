window.nova_plugins.push({
   id: 'disable-page-sleep',
   title: 'Disable page sleep',
   run_on_pages: 'watch',
   section: 'player',
   desc: "prevent 'Video paused' alert",
   _runtime: user_settings => {

      window.setInterval(() => window._lact = window._fact = Date.now(), 1000 * 60 * 5); // 5 min

      // NOVA.waitElement('yt-confirm-dialog-renderer #confirm-button')
      NOVA.waitElement('[role="dialog"] #confirm-button')
         .then(btn => {
            btn.click();
            if ((vid = document.querySelector('video')) && vid.paused) {
               vid.play();
            }
         });
   },
});
