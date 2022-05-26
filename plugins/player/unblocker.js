// fore test
// https://www.youtube.com/watch?v=bTm3kwroEyw - https://watannetwork.com/tools/blocked/#url=bTm3kwroEyw
// https://www.youtube.com/watch?v=3U2UGM0ldGg - https://watannetwork.com/tools/blocked/#url=3U2UGM0ldGg

window.nova_plugins.push({
   id: 'video-unblock-region',
   title: 'Try unblock if video not available in your country',
   'title:zh': '尝试解锁您所在地区的视频',
   'title:ja': 'お住まいの地域の動画のブロックを解除してみてください',
   'title:ko': '해당 지역의 동영상 차단을 해제해 보세요',
   'title:es': 'Intenta desbloquear videos para tu región',
   'title:pt': 'Tente desbloquear vídeos para sua região',
   'title:fr': 'Débloquer la vidéo de la région',
   // 'title:tr': 'Bölgeniz için videoların engellemesini kaldırmayı deneyin',
   'title:de': 'Versuchen Sie, Videos für Ihre Region zu entsperren',
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

      // Doesn't work
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
