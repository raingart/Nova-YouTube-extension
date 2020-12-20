_plugins_conteiner.push({
   name: 'Auto click on "Skip Ad" button',
   id: 'ad-skip-button',
   depends_on_pages: 'watch',
   run_on_transition: true, // deactivate if use YDOM.HTMLElement.watch
   opt_section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // YDOM.HTMLElement.watch({
      //    selector: 'button.ytp-ad-skip-button',
      //    // attr_mark: '',
      //    // callback: btn => btn.click(),
      //    callback: btn => {
      //       console.debug('ad-skip-button');
      //       btn.click()
      //    },
      // });

      YDOM.HTMLElement.wait('button.ytp-ad-skip-button')
         .then(btn => btn.click());

   },
});
