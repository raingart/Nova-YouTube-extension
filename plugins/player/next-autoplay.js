window.nova_plugins.push({
   id: 'video-next-autoplay-disable',
   title: 'Disable autoplay next video',
   'title:zh': '禁用自动播放下一个视频',
   'title:ja': '次の動画の自動再生を無効にする',
   'title:es': 'Desactivar la reproducción automática del siguiente video',
   'title:pt': 'Desativar a reprodução automática do próximo vídeo',
   'title:de': 'Deaktivieren Sie die automatische Wiedergabe des nächsten Videos',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // autoplay on: f5=20000
      // autoplay off: f5=30000
      // NOVA.cookie.set('PREF', 'f5=30000'); // Other parameters will be overwritten
      NOVA.cookie.updateParam({ key: 'PREF', param: 'f5', value: 30000 });

   },
});
