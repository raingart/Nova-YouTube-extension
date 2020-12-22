_plugins_conteiner.push({
   name: 'The default tab on the channel page',
   id: 'set-default-channel-tab',
   depends_on_pages: 'channel',
   run_on_transition: true,
   opt_section: 'channel',
   _runtime: user_settings => {

      // home page channel/user
      if (location.pathname.split('/').filter(i => i).length === 2) {
         location.href += '/' + user_settings.default_channel_tab;
      }

   },
   opt_export: {
      'default_channel_tab': {
         _tagName: 'select',
         label: 'Set default tab',
         options: [
            { label: 'videos', value: 'videos', selected: true },
            { label: 'playlists', value: 'playlists' },
            { label: 'about', value: 'about' },
         ]
      },
   },
});
