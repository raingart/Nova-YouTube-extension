_plugins.push({
   name: 'Hide navigation panel',
   id: 'collapse-navigation-panel',
   section: 'other',
   depends_page: 'channel, results, playlist, main', // everywhere except watch/embed
   desc: 'Hide left (guide) panel',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: '#guide[opened]',
         callback: el => {
            document.getElementById('guide-button').click();
            el.removeAttribute("opened"); // just in case
         },
      });

   }
});
