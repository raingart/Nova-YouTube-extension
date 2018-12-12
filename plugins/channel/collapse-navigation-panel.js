_plugins.push({
   name: 'Hide Navigation Panel',
   id: 'collapse-navigation-panel',
   section: 'channel',
   depends_page: 'channel, results, playlist, null',
   desc: 'Hide left panel',
   _runtime: user_settings => {

      YDOM.waitFor('#guide[opened]', el => el.removeAttribute("opened"));

   }
});
