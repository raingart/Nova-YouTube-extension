_plugins.push({
   name: 'Hide navigation panel',
   id: 'collapse-navigation-panel',
   section: 'channel',
   depends_page: 'channel, results, playlist, null',
   desc: 'Hide left (guide) panel',
   _runtime: user_settings => {

      YDOM.waitFor('#guide[opened]', el => el.removeAttribute("opened"));

   }
});
