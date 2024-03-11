window.nova_plugins.push({
   id: 'playlist-extended',
   title: 'Playlist extended section',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   'title:ua': 'Розширена довжина списку відтворення',
   run_on_pages: 'watch, -mobile',
   section: 'playlist',
   // desc: '',
   // 'plugins-conflict': 'move-to-sidebar',
   _runtime: user_settings => {

      // conflict with plugin [playlist-collapse]?

      let height = 90;

      // Fix conflict with plugin [move-to-sidebar]
      if (user_settings['move-to-sidebar']) {
         switch (user_settings.move_to_sidebar_target) {
            case 'info': height = 84; break;
            // case 'description':
            // case 'comments':
            // break;
            // default: return;
         }
      }

      NOVA.css.push(
         `ytd-watch-flexy:not([theater]) #secondary #playlist {
            --ytd-watch-flexy-panel-max-height: ${height}vh !important;
         }`);

   },
});
