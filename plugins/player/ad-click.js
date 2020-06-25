_plugins.push({
   name: 'Auto click on ad skip button',
   id: 'ad-skip-button',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: 'button.ytp-ad-skip-button',
         callback: el => el.click(),
      });
   },
});
