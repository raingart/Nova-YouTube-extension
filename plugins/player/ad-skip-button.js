_plugins_conteiner.push({
   id: 'ad-skip-button',
   title: 'Ad Auto Skipper',
   run_on_pages: 'watch',
   restart_on_transition: true,
   section: 'player',
   desc: 'Auto click on [Skip Ad] button',
   _runtime: user_settings => {

      YDOM.waitElement('button.ytp-ad-skip-button')
         .then(btn => btn.click());

      // YDOM.watchElement({
      //    selector: 'button.ytp-ad-skip-button',
      //    // attr_mark: 'ad-skiped',
      //    callback: btn => btn.click(),
      // });

   },
});
