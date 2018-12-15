_plugins.push({
   name: 'Default Channel Tab',
   id: 'set-default-channel-tab',
   section: 'channel',
   depends_page: 'channel',
   desc: 'Set default tab on YT channels',
   _runtime: user_settings => {

      // console.log('location.pathname', location.pathname);

      if (location.pathname.match(/\/channel\/UC([a-z0-9-_]{22})$/i) ||
         location.pathname.match(/\/user\/([a-z0-9-_])+$$/i)) {
         // redirect
         window.location = location.href.replace(/(\/)+$/, "") + '/' + user_settings.default_channel_tab;
      }

   },
   export_opt: (function () {
      return {
         'default_channel_tab': {
            _elementType: 'select',
            label: 'default tab',
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
