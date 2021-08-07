window.nova_plugins.push({
   id: 'theater-mode',
   title: 'Theater mode',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto enable player full-width mode',
   _runtime: user_settings => {

      // NOVA.waitElement('ytd-watch-flexy:not([theater])') // wrong way. Reassigns manual exit from the mode
      NOVA.waitElement('ytd-watch-flexy')
         .then(el => el.theaterModeChanged_(true));

   },
});
