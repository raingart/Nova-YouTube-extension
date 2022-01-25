window.nova_plugins.push({
   id: 'video-autopause',
   title: 'Video autopause',
   'title:zh': '视频自动暂停',
   'title:ja': 'ビデオの自動一時停止',
   'title:es': 'Pausa automática de video',
   'title:pt': 'Pausa automática de vídeo',
   // 'title:de': '',
   run_on_pages: 'watch, embed',
   restart_on_transition: true,
   section: 'player',
   desc: 'Disable autoplay',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            video.addEventListener('playing', setVideoPause.bind(video), { capture: true, once: true });
         });

      function setVideoPause() {
         if (location.href.includes('list=') && !user_settings.video_autopause_ignore_playlist) return;

         this.pause();

         const forcePaused = setInterval(() => this.paused || this.pause(), 200); // 100ms
         setTimeout(() => clearInterval(forcePaused), 1000); // 1s
      }

   },
   options: {
      video_autopause_ignore_playlist: {
         _tagName: 'input',
         label: 'Ignore playlist',
         'label:zh': '忽略播放列表',
         'label:ja': 'プレイリストを無視する',
         'label:es': 'Ignorar lista de reproducción',
         'label:pt': 'Ignorar lista de reprodução',
         'label:de': 'Playlist ignorieren',
         type: 'checkbox',
      },
   },
});
