// for test
// https://www.youtube.com/watch?v=XKa6TpPM70E

// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block

window.nova_plugins.push({
   id: 'ad-skip-button',
   title: 'Ad Video Skip',
   'title:zh': '广告视频跳过',
   'title:ja': '広告ビデオスキップ',
   'title:es': 'Saltar vídeo del anuncio',
   // 'title:pt': '',
   'title:de': 'Anzeigenvideo überspringen',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto click on【Skip Ad】button',
   'desc:zh': '自动点击“Skip Ad”按钮',
   'desc:ja': '「Skip Ad」ボタンの自動クリック',
   // 'desc:es': 'Haga clic automáticamente en el botón 【Omitir anuncio】',
   'desc:pt': 'Clique automaticamente no botão 【Ignorar anúncio】',
   // 'desc:de': 'Klicken Sie automatisch auf die Schaltfläche 【Anzeige überspringen .',
   _runtime: user_settings => {

      NOVA.css.push( // hides the appearance when playing on the next video
         `#movie_player.ad-showing video {
            visibility: hidden !important;
         }`);

      NOVA.waitElement('#movie_player.ad-showing video')
         .then(video => {
            adSkip();

            video.addEventListener('loadeddata', adSkip.bind(video));
            // video.addEventListener('durationupdate', adSkip.bind(video)); // stream
         });

      function adSkip() {
         if (!document.body.querySelector('#movie_player.ad-showing')) return;

         this.currentTime = this.duration; // set end ad video

         NOVA.waitElement('div.ytp-ad-text.ytp-ad-skip-button-text, button.ytp-ad-skip-button')
            .then(btn => btn.click()); // click skip-ad
      }
   },
});
