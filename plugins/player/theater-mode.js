_plugins_conteiner.push({
   name: 'Theater mode',
   id: 'theater-mode',
   depends_on_pages: 'watch',
   opt_section: 'player',
   desc: 'Enable player full-width mode',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('ytd-watch-flexy')
         .then(el => el.theaterModeChanged_(true));

   },
});
