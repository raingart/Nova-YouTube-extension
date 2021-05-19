_plugins_conteiner.push({
   name: 'Ad Auto Skipper',
   id: 'ad-skip-button',
   depends_on_pages: 'watch',
   // restart_on_transition: true,
   opt_section: 'player',
   desc: 'Auto click on [Skip Ad] button',
   _runtime: user_settings => {

      // YDOM.HTMLElement.wait('button.ytp-ad-skip-button')
      //    .then(btn => btn.click());

      YDOM.HTMLElement.watch({
         selector: 'button.ytp-ad-skip-button',
         // attr_mark: 'ad-skiped',
         callback: btn => btn.click(),
      });

   },
});
