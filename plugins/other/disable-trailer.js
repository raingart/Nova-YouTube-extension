_plugins.push({
   name: 'Stop channel trailer',
   id: 'disable-channel-trailer',
   section: 'channel',
   depends_page: 'channel',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitHTMLElement('.ytd-page-manager[page-subtype=channels] .html5-video-player', trailerPlayer => trailerPlayer.stopVideo());

   },
});
