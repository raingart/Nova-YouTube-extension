_plugins.push({
   name: 'Default Channel Tab',
   id: 'channel_default_page',
   // group: '',
   depends_page: 'channel',
   // sandbox: true,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {
      
      pageRedirect(location.href, 'videos');

      function pageRedirect(url, data) {
         let channel_url = location.pathname.split('/');
         switch (channel_url[channel_url.length - 1]) {
            // switch (data.toLowerCase()) {
            case 'feed':
               break;
            case 'videos':
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
               window.location = url.replace(/(\/)+$/,"") + '/' + data;
               // window.open(url, '_self');
               // break;
         }
      }

   }
});
