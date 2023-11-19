// for test
// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block
// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block

window.nova_plugins.push({
   id: 'ad-skip-button',
   // title: 'Auto click [skip ad]',
   title: 'Ad intro skip',
   'title:zh': '广告视频跳过',
   'title:ja': '広告スキップ',
   'title:ko': '광고 건너뛰기',
   'title:id': 'Intro iklan Lewati',
   'title:es': 'Saltar anuncios',
   'title:pt': 'Pular anúncios',
   'title:fr': 'Ignorer les annonces',
   'title:it': 'Salta introduttivo',
   // 'title:tr': 'Reklam Atlama',
   'title:de': 'Anzeigen überspringen',
   'title:pl': 'Pomiń początkową reklamę',
   //'title:ua': 'Натиснути пропустити рекламу',
   'title:ua': 'Кнопка пропустити рекламу',
   run_on_pages: 'watch',
   section: 'player',
   // desc: 'Clicks automatically on the “Skip Ad” buttons',
   desc: 'Auto click on the [Skip Ad] button',
   'desc:zh': '自动点击“Skip Ad”按钮',
   'desc:ja': '「Skip Ad」ボタンの自動クリック',
   'desc:ko': '【광고 건너뛰기】버튼 자동 클릭',
   'desc:id': 'Klik otomatis pada tombol [Lewati Iklan]',
   'desc:es': 'Haga clic automáticamente en el botón [Omitir anuncio]',
   'desc:pt': 'Clique automaticamente no botão [Ignorar anúncio]',
   'desc:fr': "Clic automatique sur le bouton [Ignorer l'annonce]",
   'desc:it': 'Fare clic automaticamente sul pulsante [Salta annuncio].',
   // 'desc:tr': "Clic automatique sur le bouton [Ignorer l'annonce]",
   // 'desc:de': 'Klicken Sie automatisch auf die Schaltfläche [Anzeige überspringen]',
   'desc:pl': 'Auto kliknięcie przycisku [Pomiń reklamę]',
   'desc:ua': 'Автоматично натискати кнопку для пропуску реклами',
   _runtime: user_settings => {

      // alt1 - https://github.com/MarcGuiselin/youtube-refined/blob/main/code/scripts/content/youtube.js#L1526-L1653
      // alt2 - https://chrome.google.com/webstore/detail/youtube-ad-auto-skipper/lokpenepehfdekijkebhpnpcjjpngpnd
      // alt3 - https://greasyfork.org/en/scripts/459541
      // alt4 - https://greasyfork.org/en/scripts/386925-youtube-ad-cleaner-include-non-skippable-ads-works
      // alt5 - https://greasyfork.org/en/scripts/478684-addodge

      // NOVA.css.push( // hides the appearance when playing on the next video
      //    `#movie_player.ad-showing video {
      //       visibility: hidden !important;
      //    }`);

      NOVA.waitSelector('#movie_player.ad-showing video')
         .then(video => {
            adSkip();

            movie_player.addEventListener('onAdStateChange', adSkip.bind(video));
            video.addEventListener('loadedmetadata', adSkip.bind(video));
            video.addEventListener('loadeddata', adSkip.bind(video));
            video.addEventListener('canplay', adSkip.bind(video));
            // video.addEventListener('durationupdate', adSkip.bind(video)); // stream

            // requestAnimationFrame(tick);
            // function tick() {
            //    requestAnimationFrame(tick);
            //    adSkip.apply(video);
            // }
         });

      // onSkipAdButtonClick
      function adSkip() {
         if (!movie_player.classList.contains('ad-showing')) return;

         this.currentTime = this.duration; // set end ad-video

         // NOVA.waitSelector('.videoAdUiSkipButton,.ytp-ad-skip-button')
         NOVA.waitSelector('div.ytp-ad-text.ytp-ad-skip-button-text:not([hidden]), button.ytp-ad-skip-button:not([hidden])', { destroy_if_url_changes: true })
            .then(btn => btn.click()); // click skip-ad
      }
   },
});
