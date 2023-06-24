// for test:
// https://www.youtube.com/watch?v=IvZOmE36PLc - many extra characters. Manual chapter numbering
// https://www.youtube.com/watch?v=IR0TBQV147I = lots 3-digit timestamp

window.nova_plugins.push({
   id: 'description-timestamps-scroll',
   title: 'No scroll to top when clicking timestamps',
   'title:zh': '没有在时间戳上滚动到播放器',
   'title:ja': 'タイムスタンプでプレーヤーにスクロールしない',
   'title:ko': '타임스탬프에서 플레이어로 스크롤하지 않음',
   'title:id': 'Tidak ada gulir ke pemain pada stempel waktu',
   'title:es': 'Sin desplazamiento al jugador en marcas de tiempo',
   'title:pt': 'Sem rolar para o jogador em timestamps',
   'title:fr': 'Pas de défilement vers le joueur sur les horodatages',
   'title:it': 'Nessun passaggio al giocatore sui timestamp',
   // 'title:tr': 'Zaman damgalarında oynatıcıya kaydırma yok',
   'title:de': 'Kein Scrollen zum Player bei Zeitstempeln',
   'title:pl': 'Brak przejścia do odtwarzacza na znacznikach czasu',
   'title:ua': 'Немає прокрутки до відтворювача на часових мітках',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   desc: 'Disable scrolling to player when clicking on timestamps',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   'desc:pl': 'Wyłącza przewijanie do odtwarzacza podczas klikania znaczników czasu',
   'desc:ua': 'Вимикає прокрутку до відтворювача при натисканні на часову мітку',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/438943-youtube-no-scroll-to-top-on-timestamps
      // alt2 - https://greasyfork.org/en/scripts/451579-youtube-scroll-lock-timestamp-in-picture-in-picture

      document.addEventListener('click', evt => {
         // <a href="/playlist?list=XX"> - erroneous filtering "t=XX" without the character "&"
         if (evt.isTrusted && !evt.target.matches('a[href*="&t="]')) return;

         // if (sec = NOVA.timeFormatTo.hmsToSec(evt.target.textContent)) {
         if (sec = parseInt(NOVA.queryURL.get('t', evt.target.href))) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            // NOVA.videoElement?.currentTime = sec;
            movie_player.seekTo(sec);
         }
      }, { capture: true });

   },
});
