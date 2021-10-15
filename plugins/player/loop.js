window.nova_plugins.push({
   id: 'player-loop',
   title: 'Loop playback',
   'title:zh': '循环播放',
   'title:ja': 'ループ再生',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Loop video playback',
   'desc:zh': '循环播放视频',
   'desc:ja': 'ビデオ再生をループする',
   _runtime: user_settings => {

      NOVA.waitElement('video')
         .then(video => {
            video.addEventListener('loadeddata', ({ target }) => target.loop = true);
         });
   },
});
