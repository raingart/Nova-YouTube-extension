_plugins.push({
   name: 'The default tab on the channel page',
   id: 'set-default-channel-tab',
   section: 'channel',
   depends_page: 'channel',
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
