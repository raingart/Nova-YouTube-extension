_plugins.push({
   name: 'Default Channel Tab',
   id: 'set-default-channel-tab',
   section: 'channel',
   depends_page: 'channel',
   // sandbox: true,
   desc: 'Set default tab on YT channels',
   // version: '0.1',
   _runtime: function (user_settings) {
      
      // pageRedirect(location.href, 'videos');
      pageRedirect(location.href, user_settings.default_channel_tab);

      function pageRedirect(url, target) {
         let channel_url = location.pathname.split('/').pop();
         switch (channel_url) {
            case 'featured':
               break;
            case 'feed':
               break;
            case 'videos':
               break;
            case 'community':
               break;
            case 'playlists':
               break;
            case 'channels':
               break;
            case 'discussion':
               break;
            case 'about':
               break;

            default:
               if (channel_url.length >= 24) window.location = url.replace(/(\/)+$/,"") + '/' + target;
               // window.open(url, '_self');
         }
      }
   },

   export_opt: (function (data) {
      return {
         'default_channel_tab': {
            _elementType: 'select',
            label: 'default tab',
            options: [
               /* beautify preserve:start */
               // { label: 'featured', value: 'featured' },
               // { label: 'feed', value: 'feed' },
               { label: 'videos', value: 'videos' },
               // { label: 'community', value: 'community' },
               { label: 'playlists', value: 'playlists' },
               { label: 'channels', value: 'channels' },
               { label: 'discussion', value: 'discussion' },
               { label: 'about', value: 'about' },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
