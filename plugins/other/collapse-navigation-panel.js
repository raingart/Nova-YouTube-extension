window.nova_plugins.push({
   id: 'collapse-navigation-panel',
   title: 'Collapse navigation panel',
   'title:zh': '折叠导航面板',
   'title:ja': 'ナビゲーション パネルを折りたたむ',
   // 'title:ko': '탐색 패널 접기',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': 'Contraer panel de navegación',
   'title:pt': 'Recolher painel de navegação',
   'title:fr': 'Réduire le panneau de navigation',
   // 'title:it': '',
   // 'title:tr': '',
   'title:de': 'Navigationsbereich einklappen',
   'title:pl': 'Zwiń panel nawigacyjny',
   'title:ua': 'Згорнути панель навігації',
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
