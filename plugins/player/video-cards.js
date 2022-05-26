window.nova_plugins.push({
   id: 'disable-video-cards',
   title: 'Hide End-Screen info cards',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
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
