_plugins.push({
   name: 'The default tab on the channel page',
   id: 'set-default-channel-tab',
   section: 'other',
   depends_page: 'channel',
   _runtime: user_settings => {

      // tabs are not open
      if (/\/channel\/UC([a-z0-9-_]{22})$/i.test(location.pathname) ||
      /\/user\/([a-z0-9-_]+)$/i.test(location.pathname)) {

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
            default:
               return;
         }

         YDOM.waitHTMLElement('#tabsContent > [role="tab"]:nth-child(' + tab_nth + ')[aria-selected="false"]',
            tab => tab.click());
      }

   },
   export_opt: (function () {
      return {
         'default_channel_tab': {
            _elementType: 'select',
            label: 'Set default tab',
            options: [
               { label: 'videos', value: 'videos', selected: true },
               { label: 'playlists', value: 'playlists' },
               { label: 'about', value: 'about' },
            ]
         },
      };
   }()),
});
