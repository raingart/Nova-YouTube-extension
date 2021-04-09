_plugins_conteiner.push({
   name: 'The default tab on the channel page',
   id: 'channel-default-tab',
   depends_on_pages: 'channel',
   run_on_transition: true,
   opt_section: 'channel',
   _runtime: user_settings => {

      // home page channel/user
      if (location.pathname.split('/').filter(i => i).length === 2) {

         if (user_settings['redirect']) {
            location.href += '/' + user_settings.default_channel_tab;

         } else {
            // tab select
            YDOM.HTMLElement.wait('#tabsContent>[role="tab"]:nth-child(2)[aria-selected="true"]')
               .then(() => {
                  let tab_nth;
                  switch (user_settings.default_channel_tab) {
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
   opt_export: {
      'default_channel_tab': {
         _tagName: 'select',
         label: 'Default tab',
         options: [
            { label: 'videos', value: 'videos', selected: true },
            { label: 'playlists', value: 'playlists' },
            { label: 'about', value: 'about' },
         ],
      },
      'default_channel_tab_method': {
         _tagName: 'select',
         label: 'Mode',
         title: 'Redirect is safer but slower',
         // multiple: null,
         options: [
            { label: 'redirect', value: 'redirect' },
            { label: 'click', /*value: '',*/ selected: true },
         ],
      },
   },
});
