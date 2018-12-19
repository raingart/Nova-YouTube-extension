_plugins.push({
   name: 'The default tab on the channel page',
   id: 'set-default-channel-tab',
   section: 'channel',
   depends_page: 'channel',
   _runtime: user_settings => {

      if (location.pathname.match(/\/channel\/UC([a-z0-9-_]{22})$/i) ||
         location.pathname.match(/\/user\/([a-z0-9-_])+$$/i)) {

         let tab_nth_child;
         switch (user_settings.default_channel_tab) {
            case 'videos':
               tab_nth_child = 4;
               break;
            case 'playlists':
               tab_nth_child = 6;
               break;
            case 'about':
               tab_nth_child = 12;
               break;
            default:
               return;
         }

         YDOM.waitFor('#tabsContent > paper-tab:nth-child(' + tab_nth_child + ')', tab => tab.click());
      }

   },
   export_opt: (function () {
      return {
         'default_channel_tab': {
            _elementType: 'select',
            label: 'Set default tab',
            options: [
               /* beautify preserve:start */
               { label: 'videos', value: 'videos' },
               { label: 'playlists', value: 'playlists' },
               { label: 'about', value: 'about' },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
