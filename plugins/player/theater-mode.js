_plugins.push({
   name: 'Theater mode',
   id: 'theater-mode',
   section: 'player',
   depends_page: 'watch',
   desc: 'Enable player full-width mode',
   _runtime: user_settings => {

      // <ytd-watch-flexy  theater-requested_="" theater=""> // is enabled

      YDOM.HTMLElement.wait('ytd-watch-flexy')
         .then(el => {
            // tag way
            if (!el.theater) el.setAttribute("theater-requested_", true);
            // cookie way
            if (/wide\=1/.test(document.cookie)) YDOM.cookie.set('wide', 1);
         });

   },
});
