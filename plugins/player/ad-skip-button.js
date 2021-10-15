// for test
// https://www.youtube.com/watch?v=XKa6TpPM70E

// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block

/*yt ad selector*/
// This is for the end cards
// .ytp-cards-button

// This is for the new "next video suggestion"
// .ytp-ce-element

// For the new "teasers"
// .ytp-cards-teaser

// For the new "channel suggestions"
// .iv-promo

// For the new "view more info" button in fullscreen
// ##.ytp-button.ytp-fullerscreen-edu-button
// ##.ytp-fullerscreen-edu-chevron
// ##.ytp-fullerscreen-edu-text
// ##.ytp-button.ytp-fullerscreen-edu-button

window.nova_plugins.push({
   id: 'ad-skip-button',
   title: 'Ad Video Skip',
   'title:zh': '广告视频跳过',
   'title:ja': '広告ビデオスキップ',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto click on【Skip Ad】button',
   'desc:zh': '自动点击“跳过广告”按钮',
   'desc:ja': '「Skip Ad」ボタンの自動クリック',
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
         if (!document.querySelector('#movie_player.ad-showing')) return;

         this.currentTime = this.duration; // set end ad video

         NOVA.waitElement('div.ytp-ad-text.ytp-ad-skip-button-text, button.ytp-ad-skip-button')
            .then(btn => btn.click()); // click skip-ad
      }
   },
});
