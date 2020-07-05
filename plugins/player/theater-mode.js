_plugins.push({
   name: 'Theater Mode',
   id: 'theater-mode',
   section: 'player',
   depends_page: 'watch',
   desc: 'Enable player full-width mode',
   _runtime: user_settings => {

      // <ytd-watch-flexy  theater-requested_="" theater=""> // enabled

      YDOM.waitHTMLElement({
         selector: 'ytd-watch-flexy',
         callback: tag => {
            // tag way
            if (!tag.theater) tag.setAttribute("theater-requested_", true);
            // cookie way
            if (/wide\=1/.test(document.cookie)) YDOM.cookie.set('wide', 1);
         },
      });

   },
});
