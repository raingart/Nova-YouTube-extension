_plugins_conteiner.push({
   id: 'disable-page-sleep',
   title: 'Disable page sleep',
   run_on_pages: 'watch',
   section: 'player',
   desc: "prevent 'Video paused' alert",
   _runtime: user_settings => {

      // YDOM.waitElement('yt-confirm-dialog-renderer #confirm-button')
      YDOM.waitElement('[role="dialog"] #confirm-button')
         .then(btn => {
            btn.click();
            if ((vid = document.querySelector('video')) && vid.paused) {
               vid.play();
            }
         });
   },
});
