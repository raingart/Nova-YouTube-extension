// for test
// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block
// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block

window.nova_plugins.push({
   id: 'ad-skip-button',
   // title: 'Auto click skip ads',
   title: 'Ad intro Skip',
   'title:zh': '广告视频跳过',
   'title:ja': '広告スキップ',
   'title:ko': '광고 건너뛰기',
   'title:id': 'Intro iklan Lewati',
   'title:es': 'Saltar anuncios',
   'title:pt': 'Pular anúncios',
   'title:fr': 'Ignorer les annonces',
   'title:it': 'Salta introduttivo',
   'title:tr': 'Reklam Atlama',
   'title:de': 'Anzeigen überspringen',
   'title:pl': 'Pomiń początkową reklamę',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto click on [Skip Ad] button',
   'desc:zh': '自动点击“Skip Ad”按钮',
   'desc:ja': '「Skip Ad」ボタンの自動クリック',
   'desc:ko': '【광고 건너뛰기】버튼 자동 클릭',
   'desc:id': 'Klik otomatis pada tombol [Lewati Iklan]',
   'desc:es': 'Haga clic automáticamente en el botón [Omitir anuncio]',
   'desc:pt': 'Clique automaticamente no botão [Ignorar anúncio]',
   'desc:fr': "Clic automatique sur le bouton [Ignorer l'annonce]",
   'desc:it': 'Fare clic automaticamente sul pulsante [Salta annuncio].',
   'desc:tr': "Clic automatique sur le bouton [Ignorer l'annonce]",
   // 'desc:de': 'Klicken Sie automatisch auf die Schaltfläche [Anzeige überspringen]',
   'desc:pl': 'Auto kliknięcie przycisku [Pomiń reklamę]',
   _runtime: user_settings => {

      // NOVA.css.push( // hides the appearance when playing on the next video
      //    `#movie_player.ad-showing video {
      //       visibility: hidden !important;
      //    }`);

      NOVA.waitElement('#movie_player.ad-showing video')
         .then(video => {
            adSkip();

            video.addEventListener('loadeddata', adSkip.bind(video));
            video.addEventListener('canplay', adSkip.bind(video));
            // video.addEventListener('durationupdate', adSkip.bind(video)); // stream
         });

      // onSkipAdButtonClick
      function adSkip() {
         if (!movie_player.classList.contains('ad-showing')) return;

         this.currentTime = this.duration; // set end ad-video

         NOVA.waitElement('div.ytp-ad-text.ytp-ad-skip-button-text:not([hidden]), button.ytp-ad-skip-button:not([hidden])')
            .then(btn => btn.click()); // click skip-ad
      }
   },
});
