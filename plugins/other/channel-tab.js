_plugins_conteiner.push({
   id: 'channel-default-tab',
   title: 'The default tab on the channel page',
   run_on_pages: 'channel',
   restart_on_transition: true,
   section: 'channel',
   // desc: '',
   _runtime: user_settings => {

      // home page channel/user
      if (location.pathname.split('/').filter(i => i).length === 2) {

         if (user_settings.channel_default_tab_mode === 'redirect') {
            location.href += '/' + user_settings.channel_default_tab;

         } else {
            // tab select
            YDOM.waitElement('#tabsContent>[role="tab"]:nth-child(2)[aria-selected="true"]')
               .then(() => {
                  let tab_nth;
                  switch (user_settings.channel_default_tab) {
                     case 'videos':
                        tab_nth = 4;
                        break;
                     case 'playlists':
                        tab_nth = 6;
                        break;
                     case 'about':
                        tab_nth = 12;
                        break;
                  }
                  // select tab
                  document.querySelector(`#tabsContent>[role="tab"]:nth-child(${tab_nth})[aria-selected="false"`)
                     ?.click();
               });
         }

      }

   },
   options: {
      channel_default_tab: {
         _tagName: 'select',
         label: 'Default tab',
         options: [
            { label: 'videos', value: 'videos', selected: true },
            { label: 'playlists', value: 'playlists' },
            { label: 'about', value: 'about' },
         ],
      },
      channel_default_tab_mode: {
         _tagName: 'select',
         label: 'Mode',
         title: 'Redirect is safer but slower',
         options: [
            { label: 'redirect', value: 'redirect' },
            { label: 'click', /*value: '',*/ selected: true },
         ],
      },
   },
});
