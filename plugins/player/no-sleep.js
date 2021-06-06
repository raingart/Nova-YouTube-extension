_plugins_conteiner.push({
   name: 'Disable page sleep',
   id: 'disable-page-sleep',
   depends_on_pages: 'watch',
   opt_section: 'watch',
   desc: "prevent 'Video paused' alert",
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('[role="dialog"] #confirm-button')
         .then(btn => {
            btn.click();
            const vid = document.querySelector('video'); vid?.paused && vid.play();
         });
   },
});
