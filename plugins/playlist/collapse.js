window.nova_plugins.push({
   id: 'playlist-collapse',
   title: 'Collapse playlist',
   'title:zh': '播放列表自动折叠',
   'title:ja': 'プレイリストの自動折りたたみ',
   // 'title:ko': '재생목록 자동 축소',
   // 'title:vi': '',
   // 'title:id': 'Penciutan otomatis daftar putar',
   // 'title:es': 'Contraer automáticamente la lista de reproducción',
   'title:pt': 'Recolhimento automático da lista de reprodução',
   'title:fr': 'Réduction automatique de la liste de lecture',
   // 'title:it': 'Comprimi automaticamente la playlist',
   // 'title:tr': '',
   'title:de': 'Automatische Minimierung der Wiedergabeliste',
   'title:pl': 'Automatyczne zwijanie listy odtwarzania',
   'title:ua': 'Автоматичне згортання списку відтворення',
   run_on_pages: 'watch, -mobile',
   section: 'playlist',
   // desc: '',
   _runtime: user_settings => {

      // conflict with plugin [playlist-extended]?

      if (!location.search.includes('list=')) return;

      // ytd-watch-flexy.ytd-page-manager:not([hidden]) ytd-playlist-panel-renderer:not([collapsed])
      // #page-manager #playlist:not([collapsed])
      NOVA.waitSelector('#secondary #playlist:not([collapsed]) #expand-button button')
         .then(btn => {
            // if (user_settings.playlist_collapse_ignore_theater
            //    && document.body.querySelector('ytd-watch-flexy[theater]')
            // ) return;
            // if (user_settings.playlist_collapse_ignore_music && NOVA.isMusic()) return;

            btn.click();
         });
      // .then(btn => btn.click());

   },
   // options: {
   //    playlist_collapse_ignore_theater: {
   //       _tagName: 'input',
   //       label: 'Ignore in theater mode',
   //       'label:zh': '在影院模式下忽略',
   //       'label:ja': 'シアターモードでは無視',
   //       'label:ko': '극장 모드에서 무시',
   //       'label:vi': '',
   //       'label:id': 'Abaikan dalam mode teater',
   //       'label:es': 'Ignorar en modo teatro',
   //       'label:pt': 'Ignorar no modo teatro',
   //       'label:fr': 'Ignorer en mode théâtre',
   //       'label:it': 'Ignora in modalità teatro',
   //       // 'label:tr': 'Tiyatro modunda yoksay',
   //       'label:de': 'Im Kinomodus ignorieren',
   //       'label:pl': 'Ignoruj w trybie kinowym',
   //       'label:ua': 'Ігнорувати в режимі театру',
   //       type: 'checkbox',
   //       // title: '',
   //    },
   //    playlist_collapse_ignore_music: {
   //       _tagName: 'input',
   //       label: 'Ignore music',
   //       'label:zh': '忽略音乐',
   //       'label:ja': '音楽を無視',
   //       'label:ko': '음악 무시',
   //       'label:vi': '',
   //       'label:id': 'Abaikan musik',
   //       'label:es': 'ignorar la musica',
   //       'label:pt': 'Ignorar música',
   //       'label:fr': 'Ignorer la musique',
   //       'label:it': 'Ignora la musica',
   //       // 'label:tr': 'Müziği yoksay',
   //       'label:de': 'Musik ignorieren',
   //       'label:pl': 'Ignoruj ​​muzykę',
   //       'label:ua': 'Ігноруйте музику',
   //       type: 'checkbox',
   //    },
   // }
});
