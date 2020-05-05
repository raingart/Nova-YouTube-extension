_plugins.push({
   name: 'Theater Mode',
   id: 'theater-mode',
   section: 'player',
   depends_page: 'watch',
   desc: 'Enable player full-width mode',
   _runtime: user_settings => {

      // <ytd-watch-flexy  theater-requested_="" theater="">
      // document.getElementsByTagName('ytd-watch-flexy').item(0).theater

      YDOM.waitHTMLElement({
         selector: 'ytd-watch-flexy',
         callback: tag => {
            if (!tag.theater) {
               // console.log('enable "Theater Mode"');
               tag.setAttribute("theater-requested_", true);
               YDOM.cookie.set('wide', 1);
            }
         },
      });
   },
});
