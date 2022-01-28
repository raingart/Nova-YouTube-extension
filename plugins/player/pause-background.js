// http://babruisk.com/ - test embed page

window.nova_plugins.push({
   id: 'pause-background-tab',
   title: 'Pauses playing videos in other tabs',
   'title:zh': '在其他选项卡上暂停视频播放',
   'title:ja': '他のタブで動画の再生を一時停止します',
   'title:ko': '다른 탭에서 비디오 재생 일시 중지',
   'title:es': 'Pausa la reproducción de videos en otras pestañas',
   'title:pt': 'Pausa a reprodução de vídeos em outras guias',
   'title:fr': "Interrompt la lecture des vidéos dans d'autres onglets",
   'title:de': 'Unterbricht die Wiedergabe von Videos in anderen Tabs',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Supports iframes and other windows',
   'desc:zh': '支持 iframe 和其他窗口',
   'desc:ja': 'iframeやその他のウィンドウをサポート',
   'desc:ko': 'iframe 및 기타 창 지원',
   'desc:es': 'Soporta iframes y otras ventanas',
   'desc:pt': 'Suporta iframes e outras janelas',
   'desc:fr': 'Prend en charge les iframes et autres fenêtres',
   'desc:de': 'Unterstützt iframes und andere Fenster',
   _runtime: user_settings => {

      // redirection for localStorage common storage space
      if (location.hostname.includes('youtube-nocookie.com')) location.hostname = 'youtube.com';

      const
         storeName = 'playngInstanceIDTab',
         currentPageName = NOVA.currentPageName(), // watch or embed. Unchanged during the transition
         instanceID = Math.random(), // Generate a random script instance ID
         removeStorage = () => localStorage.removeItem(storeName);

      NOVA.waitElement('video')
         .then(video => {
            // on playing set mark
            video.addEventListener('playing', () => localStorage.setItem(storeName, instanceID));

            // remove mark - video not play
            ['pause', 'suspend', 'ended'].forEach(evt => video.addEventListener(evt, removeStorage));
            // remove mark - on tab closed
            window.addEventListener('beforeunload', removeStorage);

            // auto play on tab focus
            if (user_settings.pause_background_tab_onfocus) {
               document.addEventListener("visibilitychange", () => {
                  //   if other tabs are not playing
                  if (document.visibilityState == 'visible'
                     && !localStorage.hasOwnProperty(storeName)
                     // && video.paused  // dont see ENDED
                     && ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
                  ) {
                     // console.debug('play video in focus');
                     video.play();
                  }
               });
            }
            // if tab unfocus apply pause
            window.addEventListener('storage', store => {
               if ((document.visibilityState == 'hidden' || currentPageName == 'embed') // tab unfocus
                  && store.key === storeName && store.storageArea === localStorage // checking now store
                  && localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID // has storage
               ) {
                  // console.debug('video pause', localStorage[storeName]);
                  video.pause();
               }
            });

         });

      // replaced with generic HTML5 method
      // const onPlayerStateChange = state => ('PLAYING' == NOVA.getPlayerState(state)) ? localStorage.setItem(storeName, instanceID) : removeStorage();

      // NOVA.waitElement('#movie_player')
      //    .then(() => {
      //       movie_player.addEventListener('onStateChange', onPlayerStateChange);

      //       // remove storage if this tab closed
      //       window.addEventListener('beforeunload', removeStorage);

      //       window.addEventListener('storage', store => {
      //          if (
      //             // checking the right item
      //             store.key === storeName && store.storageArea === localStorage
      //             // has storage
      //             && localStorage[storeName] && localStorage[storeName] !== instanceID
      //             // this player is playing
      //             && 'PLAYING' == NOVA.getPlayerState()
      //          ) {
      //             console.debug('pause player', localStorage[storeName]);
      //             movie_player.pauseVideo();
      //          }
      //       });

      //    });

   },
   options: {
      pause_background_tab_onfocus: {
         _tagName: 'input',
         label: 'Autoplay if tab has focus',
         'label:zh': '如果选项卡具有焦点，则自动播放',
         'label:ja': 'タブにフォーカスがある場合は自動再生',
         'label:ko': '탭에 포커스가 있으면 자동 재생',
         'label:es': 'Reproducción automática si la pestaña tiene el foco',
         'label:pt': 'Reprodução automática se a guia estiver em foco',
         'label:fr': "Lecture automatique si l'onglet a le focus",
         'label:de': 'Autoplay, wenn die Registerkarte den Fokus hat',
         type: 'checkbox',
         // title: '',
      },
   }
});
