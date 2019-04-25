_plugins.push({
   name: 'Remove channel trailer',
   id: 'disable-channel-trailer',
   section: 'channel',
   depends_page: 'channel',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitFor('.ytd-page-manager[page-subtype=channels] #player', trailer => trailer.remove());

   },
});
