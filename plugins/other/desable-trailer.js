_plugins.push({
   name: 'Remove channel trailer',
   id: 'disable-channel-trailer',
   section: 'channel',
   depends_page: 'channel',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitFor('.html5-video-player', trailer => trailer.remove());

   },
});
