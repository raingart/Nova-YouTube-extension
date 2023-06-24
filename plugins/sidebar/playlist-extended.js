window.nova_plugins.push({
   id: 'playlist-extended',
   // title: 'Playlist extended',
   title: 'Extended playlist length',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
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
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // conflict with plugin [playlist-collapse]?

      NOVA.css.push(
         `ytd-watch-flexy:not([theater]) #secondary #playlist {
            --ytd-watch-flexy-panel-max-height: 90vh !important;
         }`);

   },
});
