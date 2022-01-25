window.nova_plugins.push({
   id: 'description-timestamps-scroll',
   title: 'Disable timestamps scrolling to player',
   'title:zh': '禁用滚动到播放器的时间戳',
   'title:ja': 'プレーヤーへのタイムスタンプのスクロールを無効にする',
   'title:es': 'Desactivar marcas de tiempo desplazándose al jugador',
   'title:pt': 'Desativar carimbos de data/hora rolando para o player',
   'title:de': 'Deaktivieren Sie Zeitstempel, die zum Player scrollen',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   desc: 'Stop scrolling to player when clicking on timestamps',
   'desc:zh': '单击时间戳时停止滚动到播放器',
   'desc:ja': 'タイムスタンプをクリックすると、プレーヤーへのスクロールを停止します',
   'desc:es': 'Deja de desplazarte al jugador al hacer clic en marcas de tiempo',
   'desc:pt': 'Pare de rolar para o player ao clicar em timestamps',
   'desc:de': 'Beenden Sie das Scrollen zum Player, wenn Sie auf Zeitstempel klicken',
   _runtime: user_settings => {

      document.addEventListener('click', evt => {
         if (!evt.target.matches('a[href*="t="]')) return;

         evt.preventDefault();
         evt.stopPropagation();
         evt.stopImmediatePropagation();

         const sec = NOVA.timeFormatTo.hmsToSec(evt.target.textContent);

         movie_player.querySelector('video').currentTime = sec;
         // movie_player.seekTo(sec);

      }, true);

   },
});
