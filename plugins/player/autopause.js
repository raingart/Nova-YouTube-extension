window.nova_plugins.push({
   id: 'video-autopause',
   title: 'Video auto pause',
   'title:zh': '视频自动暂停',
   'title:ja': 'ビデオの自動一時停止',
   'title:ko': '비디오 자동 일시 중지',
   'title:id': 'Jeda otomatis video',
   'title:es': 'Pausa automática de video',
   'title:pt': 'Pausa automática de vídeo',
   'title:fr': 'Pause automatique de la vidéo',
   'title:it': 'Pausa automatica del video',
   // 'title:tr': 'Video otomatik duraklatma',
   'title:de': 'Automatische Pause des Videos',
   'title:pl': 'Automatyczne zatrzymanie wideo',
   'title:ua': 'Автопауза',
   run_on_pages: 'watch, embed',
   restart_on_transition: true,
   section: 'player',
   desc: 'Disable autoplay',
   'desc:zh': '禁用自动播放',
   'desc:ja': '自動再生を無効にする',
   'desc:ko': '자동 재생 비활성화',
   'desc:it': 'Nonaktifkan putar otomatis',
   'desc:es': 'Deshabilitar reproducción automática',
   'desc:pt': 'Desativar reprodução automática',
   'desc:fr': 'Désactiver la lecture automatique',
   'desc:it': 'Disabilita la riproduzione automatica',
   // 'desc:tr': 'Otomatik oynatmayı devre dışı bırak',
   'desc:de': 'Deaktiviere Autoplay',
   'desc:pl': 'Wyłącz autoodtwarzanie',
   'desc:ua': 'Вимкнути автовідтворення',
   _runtime: user_settings => {

      // better use this flag when launching the chrome/imum:
      //  --autoplay-policy=user-gesture-required

      if (user_settings['video-stop-preload'] && !user_settings.stop_preload_embed) return; // disable if a similar plugin of higher priority is active
      if (user_settings.video_autopause_embed && NOVA.currentPage != 'embed') return;

      // NOVA.waitElement('video')
      NOVA.waitElement('#movie_player video')
         .then(video => {
            if (user_settings.video_autopause_ignore_live && movie_player.getVideoData().isLive) return;

            forceVideoPause.apply(video);
            // video.addEventListener('timeupdate', forceVideoPause.bind(video), { capture: true, once: true });
         });

      function forceVideoPause() {
         if (user_settings.video_autopause_ignore_playlist && location.search.includes('list=')) return;
         // if (user_settings.video_autopause_ignore_playlist && NOVA.queryURL.has('list')) return;

         this.pause();

         const forceHoldPause = setInterval(() => this.paused || this.pause(), 200); // 200ms
         // setTimeout(() => clearInterval(forceHoldPause), 1000); // 1s

         document.addEventListener('click', stopForceHoldPause);
         document.addEventListener('keyup', keyupSpace);

         function stopForceHoldPause() {
            if (movie_player.contains(document.activeElement)) {
               clearInterval(forceHoldPause);
               document.removeEventListener('keyup', keyupSpace);
               document.removeEventListener('click', stopForceHoldPause);
            }
         }

         function keyupSpace(evt) {
            // console.debug('evt.code', evt.code); // no sense if latch wich { capture: true, once: true }
            switch (evt.code) {
               case 'Space':
                  stopForceHoldPause()
                  break;
            }
         }
      }

   },
   options: {
      video_autopause_ignore_playlist: {
         _tagName: 'input',
         label: 'Ignore playlist',
         'label:zh': '忽略播放列表',
         'label:ja': 'プレイリストを無視する',
         'label:ko': '재생목록 무시',
         'label:id': 'Abaikan daftar putar',
         'label:es': 'Ignorar lista de reproducción',
         'label:pt': 'Ignorar lista de reprodução',
         'label:fr': 'Ignorer la liste de lecture',
         'label:it': 'Ignora playlist',
         // 'label:tr': 'Oynatma listesini yoksay',
         'label:de': 'Wiedergabeliste ignorieren',
         'label:pl': 'Zignoruj listę odtwarzania',
         'label:ua': 'Ігнорувати список відтворення',
         type: 'checkbox',
         'data-dependent': { 'video_autopause_embed': false },
      },
      video_autopause_ignore_live: {
         _tagName: 'input',
         label: 'Ignore live',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         'label:ua': 'Ігнорувти живі трансляції',
         type: 'checkbox',
         'data-dependent': { 'video_autopause_embed': false },
      },
      // video_autopause_embed: {
      //    _tagName: 'input',
      //    label: 'Only for embedded videos',
      //    'label:zh': '仅适用于嵌入式视频',
      //    'label:ja': '埋め込みビデオのみ',
      //    'label:ko': '삽입된 동영상에만 해당',
      //    'label:id': 'Hanya untuk video tersemat',
      //    'label:es': 'Solo para videos incrustados',
      //    'label:pt': 'Apenas para vídeos incorporados',
      //    'label:fr': 'Uniquement pour les vidéos intégrées',
      //    'label:it': 'Solo per i video incorporati',
      //    'label:tr': 'Yalnızca gömülü videolar için',
      //    'label:de': 'Nur für eingebettete Videos',
      //    'label:pl': 'Tylko dla osadzonych filmów',
      //    'label:ua': 'Тільки для вбудованих відео',
      //    type: 'checkbox',
      // },
      video_autopause_embed: {
         _tagName: 'select',
         label: 'Apply to video',
         'label:ua': 'Застосувати до відео',
         options: [
            {
               label: 'all', value: false, selected: true,
               'label:ua': 'всіх',
            },
            {
               label: 'embed', value: 'on',
               'label:ua': 'вбудованих',
            },
         ],
      },
   }
});
