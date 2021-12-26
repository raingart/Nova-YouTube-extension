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

// const hiddenCSS = {
//    'www.youtube.com': [
//        '#__ffYoutube1',
//        '#__ffYoutube2',
//        '#__ffYoutube3',
//        '#__ffYoutube4',
//        '#feed-pyv-container',
//        '#feedmodule-PRO',
//        '#homepage-chrome-side-promo',
//        '#merch-shelf',
//        '#offer-module',
//        '#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',
//        '#pla-shelf',
//        '#premium-yva',
//        '#promo-info',
//        '#promo-list',
//        '#promotion-shelf',
//        '#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer',
//        '#search-pva',
//        '#shelf-pyv-container',
//        '#video-masthead',
//        '#watch-branded-actions',
//        '#watch-buy-urls',
//        '#watch-channel-brand-div',
//        '#watch7-branded-banner',
//        '#YtKevlarVisibilityIdentifier',
//        '#YtSparklesVisibilityIdentifier',
//        '.carousel-offer-url-container',
//        '.companion-ad-container',
//        '.GoogleActiveViewElement',
//        '.list-view[style="margin: 7px 0pt;"]',
//        '.promoted-sparkles-text-search-root-container',
//        '.promoted-videos',
//        '.searchView.list-view',
//        '.sparkles-light-cta',
//        '.watch-extra-info-column',
//        '.watch-extra-info-right',
//        '.ytd-carousel-ad-renderer',
//        '.ytd-compact-promoted-video-renderer',
//        '.ytd-companion-slot-renderer',
//        '.ytd-merch-shelf-renderer',
//        '.ytd-player-legacy-desktop-watch-ads-renderer',
//        '.ytd-promoted-sparkles-text-search-renderer',
//        '.ytd-promoted-video-renderer',
//        '.ytd-search-pyv-renderer',
//        '.ytd-video-masthead-ad-v3-renderer',
//        '.ytp-ad-action-interstitial-background-container',
//        '.ytp-ad-action-interstitial-slot',
//        '.ytp-ad-image-overlay',
//        '.ytp-ad-overlay-container',
//        '.ytp-ad-progress',
//        '.ytp-ad-progress-list',
//        '[class*="ytd-display-ad-"]',
//        '[layout*="display-ad-"]',
//        'a[href^="http://www.youtube.com/cthru?"]',
//        'a[href^="https://www.youtube.com/cthru?"]',
//        'ytd-action-companion-ad-renderer',
//        'ytd-banner-promo-renderer',
//        'ytd-compact-promoted-video-renderer',
//        'ytd-companion-slot-renderer',
//        'ytd-display-ad-renderer',
//        'ytd-promoted-sparkles-text-search-renderer',
//        'ytd-promoted-sparkles-web-renderer',
//        'ytd-search-pyv-renderer',
//        'ytd-single-option-survey-renderer',
//        'ytd-video-masthead-ad-advertiser-info-renderer',
//        'ytd-video-masthead-ad-v3-renderer',
//        'YTM-PROMOTED-VIDEO-RENDERER',
//    ],
//    'm.youtube.com': [
//        '.companion-ad-container',
//        '.ytp-ad-action-interstitial',
//        '.ytp-cued-thumbnail-overlay > div[style*="/sddefault.jpg"]',
//        'a[href^="/watch?v="][onclick^="return koya.onEvent(arguments[0]||window.event,\'"]:not([role]):not([class]):not([id])',
//        'a[onclick*=\'"ping_url":"http://www.google.com/aclk?\']',
//        'ytm-companion-ad-renderer',
//        'ytm-companion-slot',
//        'ytm-promoted-sparkles-text-search-renderer',
//        'ytm-promoted-sparkles-web-renderer',
//        'ytm-promoted-video-renderer',
//    ],
// }

window.nova_plugins.push({
   id: 'ad-skip-button',
   title: 'Ad Video Skip',
   'title:zh': '广告视频跳过',
   'title:ja': '広告ビデオスキップ',
   'title:es': 'Saltar vídeo del anuncio',
   run_on_pages: 'watch',
   section: 'player',
   desc: 'Auto click on【Skip Ad】button',
   'desc:zh': '自动点击“Skip Ad”按钮',
   'desc:ja': '「Skip Ad」ボタンの自動クリック',
   'desc:es': 'Haga clic automáticamente en el botón 【Omitir anuncio】',
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
