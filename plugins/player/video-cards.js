window.nova_plugins.push({
   id: 'disable-video-cards',
   title: 'Hide End-Screen info cards',
   'title:zh': '隐藏最终屏幕信息卡',
   'title:ja': 'エンドスクリーン情報カードを非表示にする',
   'title:ko': '최종 화면 정보 카드 숨기기',
   'title:es': 'Ocultar tarjetas de información de la pantalla final',
   'title:pt': 'Ocultar cartões de informações da tela final',
   'title:fr': "Masquer les fiches d'information de l'écran de fin",
   // 'title:tr': 'Son Ekran bilgi kartlarını gizle',
   'title:de': 'Endbildschirm-Infokarten ausblenden',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: "turn off 'card' in https://www.youtube.com/account_playback",
   desc: 'remove the annoying stuff at the end of the videos',
   _runtime: user_settings => {

      switch (NOVA.currentPage) {
         case 'watch':
            NOVA.css.push(
               `[class^="ytp-ce-"],
               [class^="ytp-paid-content-overlay"],
               branding-img { display: none !important; }`);
            break;

         case 'embed':
            // https://stackoverflow.com/questions/52887444/hide-more-videos-within-youtube-iframe-when-stop-video
            NOVA.css.push('.ytp-scroll-min.ytp-pause-overlay { display: none !important; }');
            break;
      }

   },
});
