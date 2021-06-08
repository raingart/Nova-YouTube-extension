_plugins_conteiner.push({
   id: 'disable-page-sleep',
   title: 'Disable page sleep',
   run_on_pages: 'watch',
   section: 'player',
   desc: "prevent 'Video paused' alert",
   _runtime: user_settings => {

      YDOM.waitElement('[role="dialog"] #confirm-button')
         .then(btn => {
            btn.click();
            const vid = document.querySelector('video'); vid?.paused && vid.play();
         });
   },
});
