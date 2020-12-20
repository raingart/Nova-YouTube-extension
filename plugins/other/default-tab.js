_plugins_conteiner.push({
   name: 'The default tab on the channel page',
   id: 'set-default-channel-tab',
   depends_on_pages: 'channel',
   run_on_transition: true,
   opt_section: 'channel',
   _runtime: user_settings => {

      // channel/user home page
      if (location.pathname.split('/').filter(i => i).length === 2) {
         // HOME yab selected
         YDOM.HTMLElement.wait('#tabsContent>[role="tab"]:nth-child(2)[aria-selected="true"]')
            .then(() => {
               let tab_nth;
               switch (user_settings.default_channel_tab) {
                  case 'videos':
                     tab_nth = 4;
                     break;
                  case 'playlists':
                     tab_nth = 6;
                     break;
                  case 'about':
                     tab_nth = 12;
                     break;
               }
               const tab = document.querySelector(`#tabsContent>[role="tab"]:nth-child(${tab_nth})[aria-selected="false"`);

               if (tab) tab.click();
            });
      }

   },
   opt_export: {
      'default_channel_tab': {
         _tagName: 'select',
         label: 'Set default tab',
         options: [
            { label: 'videos', value: 'videos', selected: true },
            { label: 'playlists', value: 'playlists' },
            { label: 'about', value: 'about' },
         ]
      },
   },
});
