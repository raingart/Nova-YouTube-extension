_plugins_conteiner.push({
   id: 'theater-mode',
   title: 'Theater mode',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto enable player full-width mode',
   _runtime: user_settings => {

      YDOM.waitElement('ytd-watch-flexy')
         .then(el => el.theaterModeChanged_(true));

   },
});
