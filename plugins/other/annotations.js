window.nova_plugins.push({
   id: 'disable-video-cards',
   title: 'Hide garbage: annotations, endcards etc',
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
   // 'title:pl': '',
   'title:ua': 'Приховайте сміття: анотації, кінцеві заставки тощо',
   run_on_pages: 'results, watch, embed, -mobile',
   section: 'other',
   // desc: "Turn off 'card' in https://www.youtube.com/account_playback",
   desc: 'Remove the annoying stuff',
   // desc: 'Remove the annoying stuff at the end of the videos',
   'desc:ua': 'Приховайте набридливий контент',
   _runtime: user_settings => {

      let selectorsList = [
         // '.annotation',
         '.ytp-paid-content-overlay', // message in the bottom-left corner "Includes paid promotion"
         // channel icon in the bottom-right corner
         '.iv-branding',
         // '.iv-promo',

         // mobile
         'ytm-paid-content-overlay-renderer', // message "Includes paid promotion"
      ];

      switch (NOVA.currentPage) {
         case 'embed':
            // https://stackoverflow.com/questions/52887444/hide-more-videos-within-youtube-iframe-when-stop-video
            selectorsList.push([
               '.ytp-pause-overlay', // wide-bottom block with more video list on pause

               '.ytp-info-panel-preview', // message "COVID-19 • Get the latest information from the WHO about coronavirus." - https://www.youtube.com/embed/47IwHxHVTxc?autoplay=1&wmode=opaque&fs=1&rel=0&autohide=1
            ]);
            break;

         default:
            selectorsList.push([
               // home page
               // 'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)', // Ad site


               // results page
               // 'ytd-item-section-renderer:has(ytd-ad-slot-renderer)', // ad buy
               'ytd-search-pyv-renderer', // fix blank space - https://www.youtube.com/results?search_query=Shubidua+-+Fed+Rock)

               '[class^="ytd-promoted-"]', // suggest site - https://www.youtube.com/results?search_query=mmersive+Simmulator
               // '.ytd-promoted-sparkles-text-search-renderer', // suggest something (I do not remember)
               // 'ytd-search-pyv-renderer ytd-promoted-video-renderer', // suggest ad-video

               'ytd-video-renderer + ytd-shelf-renderer', // "People also watched" block - https://greasyfork.org/en/scripts/454513-youtube-search-results-cleaner
               // 'ytd-video-renderer + ytd-horizontal-card-list-renderer', // "People also search for" block

               'ytd-video-renderer + ytd-reel-shelf-renderer', // Shorts - https://www.youtube.com/results?search_query=+WE+DON%27T+HAVE+TO+TAKE+OUR+CLOTHES+OFF


               // watch page
               '.ytp-autohide > [class^="ytp-ce-"]', // suggest video/channel for the end cards
               '.ytp-cards-teaser-text', // "next video suggestion" (title) in the top-right corner


               '.ytd-watch-flexy.attached-message', // message "BBC World Service is a British public broadcast service. Wikipedia"

               // 'ytd-popup-container tp-yt-paper-dialog yt-mealbar-promo-renderer', // 'Ambient mode' You're watching in our more immersive ambient mode.

               'ytd-popup-container tp-yt-paper-dialog ytd-single-option-survey-renderer', // "How is YouTube today?" - Absolutely outstanding, Extremely good, Very good, Good, Not good


               // results, sidebar page
               '.sparkles-light-cta', // ad buy - https://www.youtube.com/results?search_query=Canon+Pixma+MG2520


               // home, watch page
               'ytd-feed-nudge-renderer', // message "Recommendations not quite right? When you turn on watch history, you’ll get more personalized recommendations."
            ]);
      }

      if (selectorsList.length) {
         NOVA.css.push(
            selectorsList.join(',\n') + ` {
               display: none !important;
            }`);
         // NOVA.css.push({
         //    'display': 'none !important',
         // }, selectorsList.join(',\n'));
      }

   },
});
