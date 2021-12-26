window.nova_plugins.push({
   id: 'channel-default-tab',
   title: 'The default tab on the channel page',
   'title:zh': '频道页默认选项卡',
   'title:ja': 'チャンネルページのデフォルトタブ',
   'title:es': 'La pestaña predeterminada en la página del canal',
   run_on_pages: 'channel',
   restart_on_transition: true,
   section: 'channel',
   // desc: '',
   _runtime: user_settings => {

      // home page channel/user
      if (location.pathname.split('/').filter(i => i).length === 2) {

         if (user_settings.channel_default_tab_mode == 'redirect') {
            location.href += '/' + user_settings.channel_default_tab;

         } else {
            // tab select
            NOVA.waitElement('#tabsContent>[role="tab"]:nth-child(2)[aria-selected="true"]')
               .then(() => {
                  let tab_nth;
                  switch (user_settings.channel_default_tab) {
                     case 'playlists': tab_nth = 6; break;
                     case 'about': tab_nth = 12; break;
                     // case 'videos':
                     default: tab_nth = 4;
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
         'label:zh': '默认标签页',
         'label:ja': 'デフォルトのタブ',
         'label:es': 'Ficha predeterminada',
         options: [
            { label: 'videos', value: 'videos', selected: true },
            { label: 'playlists', value: 'playlists' },
            { label: 'about', value: 'about' },
         ],
      },
      channel_default_tab_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:es': 'Modo',
         title: 'Redirect is safer but slower',
         'title:zh': '重定向是安全的，但速度很慢',
         'title:ja': 'リダイレクトは安全ですが遅くなります',
         'title:es': 'La redirección es más segura pero más lenta',
         options: [
            { label: 'redirect', value: 'redirect' },
            { label: 'click', /*value: '',*/ selected: true },
         ],
      },
   },
});
