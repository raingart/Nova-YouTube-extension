window.nova_plugins.push({
   id: 'disable-player-sleep-mode',
   title: 'Disable the [Continue watching?] popup',
   // title: 'Player stay active forever',
   // title: 'Disable player sleep mode',
   'title:zh': '玩家永远保持活跃',
   'title:ja': 'プレーヤーは永遠にアクティブなままです',
   'title:ko': '플레이어는 영원히 활성 상태를 유지',
   'title:id': 'Pemain tetap aktif selamanya',
   'title:es': 'El jugador permanece activo para siempre',
   'title:pt': 'Jogador permanece ativo para sempre',
   'title:fr': 'Le joueur reste actif pour toujours',
   'title:it': 'Il giocatore resta attivo per sempre',
   'title:tr': 'Sayfa uykusunu devre dışı bırak',
   'title:de': 'Spieler bleiben für immer aktiv',
   'title:pl': 'Wyłącz tryb uśpienia odtwarzacza',
   'title:ua': 'Вимкнути режим сну відтворювача',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   // desc: 'prevent asking you to click "yes" to continue playing?',
   // desc: 'disable [Video paused] alert',
   // 'desc:zh': '防止[视频暂停]警报',
   // 'desc:ja': '「Video paused」アラートを防止します',
   // 'desc:ko': '[Video paused] 알림을 방지합니다',
   // 'desc:id': 'mencegah peringatan [Video dijeda]',
   // 'desc:es': 'evitar la alerta de [Video en pausa]',
   // 'desc:pt': 'evitar o alerta de [Vídeo pausado]',
   // 'desc:fr': "empêcher l'alerte [Vidéo en pause]",
   // 'desc:it': "impedire l'avviso [Video in pausa].",
   // 'desc:tr': '[Video duraklatıldı] uyarısını engelle',
   // 'desc:de': 'Warnung [Video pausiert] verhindern',
   // 'desc:pl': 'zapobiega wyświetlaniu alertu [Film wstrzymany]',
   // 'desc:ua': 'Вимикає спливаюче вікно "продовжити перегляд?"',
   _runtime: user_settings => {

      window.setInterval(() => {
         // Strategy 1
         document.dispatchEvent(
            // Keyboard code - https://docs.microsoft.com/en-us/dotnet/api/android.views.keycode?view=xamarin-android-sdk-12
            new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 })
         );
         // Strategy 2
         // does work (source: https://greasyfork.org/en/scripts/447802-youtube-web-tweaks)
         // window.wrappedJSObject._lact = Date.now();
      }, 1000 * 60 * 5); // 5 min


      // Strategy 3
      // function skipConfirmDialog() {
      //    // NOVA.waitElement('[role="dialog"] #confirm-button')
      //    NOVA.waitElement('#confirm-button')
      //       .then(btn => {
      //          console.debug('page page wake up', btn);
      //          btn.click();
      //          if (NOVA.videoElement?.paused) NOVA.videoElement.play();
      //          // movie_player.playVideo();
      //          skipConfirmDialog(); // recursion init state. What would work more than once
      //       });
      // }

      // skipConfirmDialog();
   },
});
