window.nova_plugins.push({
   id: 'player-loop',
   title: 'Loop playback',
   'title:zh': '循环播放',
   'title:ja': 'ループ再生',
   'title:ko': '루프 재생',
   'title:es': 'Reproducción en bucle',
   'title:pt': 'Reprodução em loop',
   'title:fr': 'Lecture en boucle',
   'title:de': 'Loop-Wiedergabe',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Loop video playback',
   'desc:zh': '循环播放视频',
   'desc:ja': 'ビデオ再生をループする',
   'desc:ko': '루프 비디오 재생',
   'desc:es': 'Reproducción de video en bucle',
   'desc:pt': 'Reprodução de vídeo em loop',
   'desc:fr': 'Lecture vidéo en boucle',
   'desc:de': 'Loop-Videowiedergabe',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            video.loop = true;
            video.addEventListener('loadeddata', ({ target }) => target.loop = true);
         });

      // does not work
      // NOVA.waitElement('#movie_player')
      //    .then(() => movie_player.setLoop());

   },
});
