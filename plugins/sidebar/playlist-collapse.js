window.nova_plugins.push({
   id: 'playlist-collapse',
   title: 'Playlist auto-collapse',
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
   // 'title:ua': '',
   run_on_pages: 'watch, -mobile',
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {
      if (!location.search.includes('list=')) return;

      // ytd-watch-flexy.ytd-page-manager:not([hidden]) ytd-playlist-panel-renderer:not([collapsed])
      // #page-manager #playlist:not([collapsed])
      NOVA.waitElement('#secondary #playlist:not([collapsed]) #expand-button button')
         .then(btn => btn.click());
   },
});
