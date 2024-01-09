window.nova_plugins.push({
   id: 'metadata-hide',
   title: 'Hide metadata',
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
   'title:ua': 'Приховати метадані',
   run_on_pages: 'watch',
   section: 'details',
   desc: 'Cover link to games, movies, etc.',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   'desc:ua': 'Посилання на ігри, фільми тощо.',
   _runtime: user_settings => {

      NOVA.css.push(
         `ytd-watch-metadata > ytd-metadata-row-container-renderer,
         ytd-merch-shelf-renderer {
            display: none;
         }`);

   },
});
