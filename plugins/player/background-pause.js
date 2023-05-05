// http://babruisk.com/ - test embed page

window.nova_plugins.push({
   id: 'pause-background-tab',
   title: 'Autopause when switching tabs',
   // title: 'Pauses playing videos in other tabs',
   // title: 'Autopause all background tabs except the active one',
   // title: 'Only one player instance playing',
   'title:zh': '自动暂停除活动选项卡以外的所有选项卡',
   'title:ja': 'アクティブなタブを除くすべてのタブを自動一時停止',
   'title:ko': '활성 탭을 제외한 모든 탭 자동 일시 중지',
   'title:id': 'Jeda otomatis semua tab latar belakang kecuali yang aktif',
   'title:es': 'Pausar automáticamente todas las pestañas excepto la activa',
   'title:pt': 'Pausar automaticamente todas as guias, exceto a ativa',
   'title:fr': "Interrompt la lecture des vidéos dans d'autres onglets",
   'title:it': 'Metti automaticamente in pausa tutte le schede in background tranne quella attiva',
   // 'title:tr': 'Etkin olan dışındaki tüm sekmeleri otomatik duraklat',
   'title:de': 'Alle Tabs außer dem aktiven automatisch pausieren',
   'title:pl': 'Zatrzymanie kart w tle oprócz aktywnej',
   'title:ua': 'Автопауза усіх фонових вкладок окрім активної',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Autopause all background tabs except the active one',
   // desc: 'Supports iframes and other windows',
   // 'desc:zh': '支持 iframe 和其他窗口',
   // 'desc:ja': 'iframeやその他のウィンドウをサポート',
   // 'desc:ko': 'iframe 및 기타 창 지원',
   // 'desc:id': 'Mendukung iframe dan jendela lainnya',
   // 'desc:es': 'Soporta iframes y otras ventanas',
   // 'desc:pt': 'Suporta iframes e outras janelas',
   // 'desc:fr': 'Prend en charge les iframes et autres fenêtres',
   // 'desc:it': 'Supporta iframe e altre finestre',
   // // 'desc:tr': "iframe'leri ve diğer pencereleri destekler",
   // 'desc:de': 'Unterstützt iframes und andere Fenster',
   // 'desc:pl': 'Obsługa ramek iframe i innych okien',
   'desc:ua': 'Автоматично призупинити всі фонові вкладки, крім активної. Підтримує iframe та інші вікна',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/444330-youtube-autoplay-mutex
      // alt2 - https://greasyfork.org/en/scripts/463632-youtube-pause-background-videos

      // redirect for localStorage common storage space
      if (location.hostname.includes('youtube-nocookie.com')) location.hostname = 'youtube.com';

      // fix - Failed to read the 'localStorage' property from 'Window': Access is denied for this document. typeof
      if (typeof window === 'undefined') return;
      // if (typeof localStorage !== 'object') return;

      // let initPageIsBackgroundTab = !document.hasFocus();

      const
         storeName = 'nova-playing-instanceIDTab',
         instanceID = String(Math.random()), // Generate a random script instance ID
         removeStorage = () => localStorage.removeItem(storeName);

      // Strategy 1. Working but dangerous method. Significant delay
      // HTMLVideoElement.prototype.play = function (c) {
      //    return function () {
      //       if (localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID) {
      //          console.debug('instanceID:', instanceID);
      //          this.pause();
      //       }
      //       else {
      //          const continuePlayingFn = c.apply(this, arguments);
      //          localStorage.setItem(storeName, instanceID, NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);
      //          return continuePlayingFn;
      //       }
      //    }
      // }(HTMLVideoElement.prototype.play);

      NOVA.waitSelector('video')
         .then(video => {
            // Strategy 2. Mark a playing
            video.addEventListener('play', checkInstance); // gaps in initialization
            video.addEventListener('playing', checkInstance); // more reliable way
            // remove mark if video stop play
            ['pause', 'suspend', 'ended'].forEach(evt => video.addEventListener(evt, removeStorage));
            // remove mark if tab closed
            window.addEventListener('beforeunload', removeStorage);

            // if tab unfocus apply pause
            window.addEventListener('storage', store => {
               // if ((!document.hasFocus()) // tab unfocus
               if ((!document.hasFocus() || NOVA.currentPage == 'embed') // tab unfocus
                  && store.key === storeName && store.storageArea === localStorage // checking store target
                  && localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID // active tab not current
                  && 'PLAYING' == NOVA.getPlayerState()
               ) {
                  // console.debug('video pause', localStorage[storeName]);
                  video.pause();
               }
            });

            // auto play on tab focus
            if (user_settings.pause_background_tab_autoplay_onfocus) {
               // document.addEventListener('visibilitychange', () => {
               //    // if other tabs are not playing
               //    if (document.visibilityState == 'visible'
               //       && !localStorage.hasOwnProperty(storeName) // store empty
               //       // && video.paused  // don't see ENDED
               //       && ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
               //    ) {
               //       // console.debug('play video in focus');
               //       video.play();
               //    }
               // });
               window.addEventListener('focus', () => {
                  // if other tabs are not playing
                  if (!localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID // store empty
                     // && video.paused  // don't see ENDED
                     && ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
                  ) {
                     // console.debug('play video in focus');
                     video.play();
                  }
               });
            }

            // pause on tab unfocuse
            if (user_settings.pause_background_tab_autopause_unfocus) {
               window.addEventListener('blur', () => {
                  // await NOVA.delay(100); // dirty fix. document.visibilityState update AFTER blur
                  // document.visibilityState == 'visible'
                  if (!document.hasFocus() && 'PLAYING' == NOVA.getPlayerState()) {
                     video.pause();
                  }
               });
            }

            function checkInstance() {
               if (localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID) {
                  // console.debug('event interception instanceID:', instanceID, movie_player.getVideoData().video_id || NOVA.queryURL.get('v'));
                  video.pause();
               }
               else {
                  localStorage.setItem(storeName, instanceID);
               }
            }

         });

      // PiP auto enable
      // alt https://chrome.google.com/webstore/detail/gcfcmfbcpibcjmcinnimklngkpkkcing
      // NOVA.waitSelector('video')
      //    .then(video => {
      //       // Detect Picture-in-Picture Support
      //       if (!document.pictureInPictureEnabled/* || video.disablePictureInPicture*/) {
      //          return alert('Picture-in-Picture not supported!');
      //       }
      //       let PiP_lock;
      //       // enable PiP
      //       document.addEventListener('visibilitychange', () => {
      //          // tab on focus - exit PiP
      //          if (document.visibilityState == 'visible'
      //             && document.pictureInPictureElement
      //             && PiP_lock
      //          ) {
      //             console.debug('exitPictureInPicture');
      //             // video.disablePictureInPicture = true;
      //             // setTimeout(() => video.disablePictureInPicture = false, 1000 * 2);
      //             // clearTimeout(timeoutPiP);
      //             return document.exitPictureInPicture();
      //          }
      //          // tab unfocus - enable PiP
      //          if (document.hasFocus()
      //             && !document.pictureInPictureElement // PiP not activated
      //             // && localStorage.hasOwnProperty(storeName) && localStorage.getItem(storeName) !== instanceID // active tab not current
      //             && ['PLAYING'].includes(NOVA.getPlayerState())
      //             // && !video.disablePictureInPicture
      //             && !PiP_lock
      //          ) {
      //             console.debug('requestPictureInPicture');
      //             // video.disablePictureInPicture = false;
      //             video.requestPictureInPicture();

      //             // timeoutPiP = setTimeout(() => video.requestPictureInPicture(), 1000 * 2);
      //          }
      //       });
      //       // exit PiP
      //       ['suspend', 'ended'].forEach(evt =>
      //          video.addEventListener(evt, () => document.pictureInPictureElement && document.exitPictureInPicture()));
      //       video.addEventListener('leavepictureinpicture', () => {
      //          console.debug('leavepictureinpicture');
      //          PiP_lock = false;
      //       });
      //       video.addEventListener('enterpictureinpicture', () => {
      //          console.debug('enterpictureinpicture');
      //          PiP_lock = true;
      //       });
      //    });

      // https://stackoverflow.com/questions/6877403/how-to-tell-if-a-video-element-is-currently-playing
      // Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
      //    get: function () {
      //       return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
      //    }
      // })
      // checks if element is playing right now
      // if (NOVA.videoElement?.playing) {
      //    // Do anything you want to
      // }


      // replaced with generic HTML5 method
      // const onPlayerStateChange = state => ('PLAYING' == NOVA.getPlayerState(state)) ? localStorage.setItem(storeName, instanceID) : removeStorage();

      // NOVA.waitSelector('#movie_player')
      //    .then(movie_player => {
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
      pause_background_tab_autoplay_onfocus: {
         _tagName: 'input',
         label: 'Autoplay on tab focus',
         'label:zh': '在标签焦点上自动播放',
         'label:ja': 'タブフォーカスでの自動再生',
         'label:ko': '탭 포커스에서 자동 재생',
         'label:id': 'Putar otomatis pada fokus tab',
         'label:es': 'Reproducción automática en el enfoque de la pestaña',
         'label:pt': 'Reprodução automática no foco da guia',
         'label:fr': "Lecture automatique sur le focus de l'onglet",
         'label:it': 'Riproduzione automatica su tab focus',
         // 'label:tr': 'Sekme odağında otomatik oynatma',
         'label:de': 'Autoplay bei Tab-Fokus',
         'label:pl': 'Autoodtwarzanie po wybraniu karty',
         'label:ua': 'Автовідтворення при виборі вкладки',
         type: 'checkbox',
         // title: '',
      },
      pause_background_tab_autopause_unfocus: {
         _tagName: 'input',
         label: 'Autopause if tab loses focus',
         'label:zh': '如果选项卡失去焦点，则自动暂停视频',
         'label:ja': 'タブがフォーカスを失った場合にビデオを自動一時停止',
         'label:ko': '탭이 초점을 잃으면 비디오 자동 일시 중지',
         'label:id': 'Jeda otomatis video jika tab kehilangan fokus',
         'label:es': 'Pausa automática del video si la pestaña pierde el foco',
         'label:pt': 'Pausar automaticamente o vídeo se a guia perder o foco',
         'label:fr': "Pause automatique de la vidéo si l'onglet perd le focus",
         'label:it': 'Metti automaticamente in pausa il video se la scheda perde la messa a fuoco',
         // 'label:tr': 'Sekme odağı kaybederse videoyu otomatik duraklat',
         'label:de': 'Video automatisch pausieren, wenn der Tab den Fokus verliert',
         'label:pl': 'Automatycznie wstrzymaj wideo, jeśli karta straci ostrość',
         'label:ua': 'Автопауза при зміні вкладки',
         type: 'checkbox',
         // title: '',
      },
   }
});
