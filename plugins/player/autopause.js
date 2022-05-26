window.nova_plugins.push({
   id: 'video-autopause',
   title: 'Video auto pause',
   'title:zh': '视频自动暂停',
   'title:ja': 'ビデオの自動一時停止',
   'title:ko': '비디오 자동 일시 중지',
   'title:es': 'Pausa automática de video',
   'title:pt': 'Pausa automática de vídeo',
   'title:fr': 'Pause automatique de la vidéo',
   // 'title:tr': 'Video otomatik duraklatma',
   'title:de': 'Automatische Pause des Videos',
   run_on_pages: 'watch, embed',
   restart_on_transition: true,
   section: 'player',
   desc: 'Disable autoplay',
   _runtime: user_settings => {

      // better use this flag when launching the browser:
      //  --autoplay-policy=user-gesture-required

      NOVA.waitElement('video')
         .then(video => {
            video.addEventListener('playing', setVideoPause.bind(video), { capture: true, once: true });
         });

      function setVideoPause() {
         if (NOVA.queryURL.has('list') && !user_settings.video_autopause_ignore_playlist) return;

         this.pause();

         const forcePaused = setInterval(() => this.paused || this.pause(), 200); // 200ms
         setTimeout(() => clearInterval(forcePaused), 1000); // 1s
      }

   },
   options: {
      video_autopause_ignore_playlist: {
         _tagName: 'input',
         label: 'Ignore playlist',
         'label:zh': '忽略播放列表',
         'label:ja': 'プレイリストを無視する',
         'label:ko': '재생목록 무시',
         'label:es': 'Ignorar lista de reproducción',
         'label:pt': 'Ignorar lista de reprodução',
         'label:fr': 'Ignorer la liste de lecture',
         // 'label:tr': 'Oynatma listesini yoksay',
         'label:de': 'Wiedergabeliste ignorieren',
         type: 'checkbox',
      },
   },
});
