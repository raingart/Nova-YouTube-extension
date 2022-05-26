// for test:
// https://www.youtube.com/watch?v=IvZOmE36PLc - many extra characters. Manual chapter numbering
// https://www.youtube.com/watch?v=IR0TBQV147I = lots 3-digit timestamp

window.nova_plugins.push({
   id: 'description-timestamps-scroll',
   title: 'No scroll to player on timestamps',
   'title:zh': '没有在时间戳上滚动到播放器',
   'title:ja': 'タイムスタンプでプレーヤーにスクロールしない',
   'title:ko': '타임스탬프에서 플레이어로 스크롤하지 않음',
   'title:es': 'Sin desplazamiento al jugador en marcas de tiempo',
   'title:pt': 'Sem rolar para o jogador em timestamps',
   'title:fr': 'Pas de défilement vers le joueur sur les horodatages',
   // 'title:tr': 'Zaman damgalarında oynatıcıya kaydırma yok',
   'title:de': 'Kein Scrollen zum Player bei Zeitstempeln',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   desc: 'Disable scrolling to player when clicking on timestamps',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/438943-youtube-no-scroll-to-top-on-timestamps
      document.addEventListener('click', evt => {
         // <a href="/playlist?list=XX"> - erroneous filtering "t=XX" without the character "&"
         if (!evt.target.matches('a[href*="&t="]')) return;

         if (sec = NOVA.timeFormatTo.hmsToSec(evt.target.textContent)) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            // NOVA.videoElement?.currentTime = sec;
            movie_player.seekTo(sec);
         }
      }, { capture: true });

   },
});
