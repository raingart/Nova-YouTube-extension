window.nova_plugins.push({
   id: 'collapse-navigation-panel',
   title: 'Hide navigation panel',
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
   run_on_pages: '*, -watch, -embed, -live_chat',
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/467029-youtube-collapse-sidebar

      NOVA.waitSelector('#guide[opened]')
         .then(el => {
            document.getElementById('guide-button').click();
            el.removeAttribute('opened'); // just in case
         });

   },
});
