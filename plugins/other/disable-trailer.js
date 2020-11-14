_plugins.push({
   name: 'Stop channel trailer',
   id: 'disable-channel-trailer',
   section: 'channel',
   depends_page: 'channel',
   // desc: '',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('.ytd-page-manager[page-subtype=channels] #movie_player')
         .then(player => player.stopVideo());

   },
});
