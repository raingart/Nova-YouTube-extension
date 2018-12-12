_plugins.push({
   name: 'Default Channel Tab',
   id: 'set-default-channel-tab',
   section: 'channel',
   depends_page: 'channel',
   desc: 'Set default tab on YT channels',
   _runtime: user_settings => {

      pageRedirect(location.href, user_settings.default_channel_tab);

      function pageRedirect(url, target) {
         let channel_url = location.pathname.split('/').pop();
         // console.log('location.pathname', location.pathname);
         // console.log('location.href', location.href);
         // console.log('channel_url', channel_url);

         switch (channel_url) {
            /* beautify preserve:start */
            case 'featured': break;
            case 'feed': break;
            case 'videos': break;
            case 'community': break;
            case 'playlists': break;
            case 'channels': break;
            case 'discussion': break;
            case 'about': break;
            case '': break; // home page
            /* beautify preserve:end */
            default:
               window.location = url.replace(/(\/)+$/, "") + '/' + target;
         }
      }
   },

   export_opt: (function () {
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
               { label: 'about', value: 'about' },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
