// fore test
// https://www.youtube.com/watch?v=bTm3kwroEyw - https://watannetwork.com/tools/blocked/#url=bTm3kwroEyw
// https://www.youtube.com/watch?v=3U2UGM0ldGg - https://watannetwork.com/tools/blocked/#url=3U2UGM0ldGg

window.nova_plugins.push({
   id: 'video-unblocker',
   title: 'Unblock video',
   'title:zh': '解锁视频',
   'title:ja': 'ビデオのブロックを解除する',
   'title:ko': '비디오 차단 해제',
   'title:es': 'Desbloquear vídeo',
   'title:pt': 'Desbloquear vídeo',
   'title:fr': 'Débloquer la vidéo',
   // 'title:tr': 'Videonun engellemesini kaldır',
   'title:de': 'Video entsperren',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: "attempt fix 'is not available in your country'",
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   _runtime: user_settings => {

      NOVA.waitElement('ytd-watch-flexy[player-unavailable]')
         .then(redirect);

      // doesn't work
      // NOVA.waitElement('video')
      //    .then(video => {
      //       video.addEventListener('emptied', redirect);
      //    });

      function redirect() {
         location.hostname = 'hooktube.com';
         // window.location.assign(`https://watannetwork.com/tools/blocked/#url=` + NOVA.queryURL.get('v'))
         // location.replace(`https://watannetwork.com/tools/blocked/#url=${NOVA.queryURL.get('v')}:~:text=Allowed%20countries`);

         // tubeunblock.com is shut down
         // location.replace(`${location.protocol}//hooktube.com/watch${location.search}`); // save time mark
      }

   },
});
