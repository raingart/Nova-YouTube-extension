// for test
// https://www.youtube.com/watch?v=bTm3kwroEyw - https://watannetwork.com/tools/blocked/#url=bTm3kwroEyw
// https://www.youtube.com/watch?v=3U2UGM0ldGg - https://watannetwork.com/tools/blocked/#url=3U2UGM0ldGg
// https://www.youtube.com/watch?v=OztVDJXEfpo - https://watannetwork.com/tools/blocked/#url=OztVDJXEfpo

// warn "The following content may contain suicide or self-harm topics."
// https://www.youtube.com/watch?v=MEZ-0nyiago
// https://www.youtube.com/watch?v=MiQozY6jR0I
// https://www.youtube.com/watch?v=ek7JK6pattE
// https://www.youtube.com/watch?v=qAYlTiV-Zf8

window.nova_plugins.push({
   id: 'video-unblock-region',
   title: 'Try unblock if video not available in your country',
   'title:zh': '尝试解锁您所在地区的视频',
   'title:ja': 'お住まいの地域の動画のブロックを解除してみてください',
   'title:ko': '해당 지역의 동영상 차단을 해제해 보세요',
   'title:id': 'Coba buka blokir jika video tidak tersedia di negara Anda',
   'title:es': 'Intenta desbloquear videos para tu región',
   'title:pt': 'Tente desbloquear vídeos para sua região',
   'title:fr': 'Débloquer la vidéo de la région',
   'title:it': 'Prova a sbloccare se il video non è disponibile nel tuo paese',
   // 'title:tr': 'Bölgeniz için videoların engellemesini kaldırmayı deneyin',
   'title:de': 'Versuchen Sie, Videos für Ihre Region zu entsperren',
   'title:pl': 'Spróbuj odblokować, jeśli film nie jest dostępny w Twoim kraju',
   'title:ua': 'Спробувати розблокувати якщо відео не доступне у країні',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: "Attempt fix 'is not available in your country'",
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   'desc:pl': 'Próba naprawienia nie jest dostępna w Twoim kraju',
   'desc:ua': 'Спроба розблокувати доступ до відео',
   _runtime: user_settings => {

      NOVA.waitElement('ytd-watch-flexy[player-unavailable]')
         .then(redirect);

      // Doesn't work
      // NOVA.waitElement('video')
      //    .then(video => {
      //       video.addEventListener('emptied', redirect);
      //    });

      function redirect() {
         // location.hostname = 'hooktube.com'; // cinemaphile.com
         // or
         location.assign(`${location.protocol}//hooktube.com/watch${location.search}`); // currect tab

         window.open(`https://watannetwork.com/tools/blocked/#url=${NOVA.queryURL.get('v')}:~:text=Allowed%20countries`); // new tab and focus

         // tubeunblock.com is shut down
         // location.assign(`${location.protocol}//hooktube.com/watch${location.search}`);
      }

   },
});
