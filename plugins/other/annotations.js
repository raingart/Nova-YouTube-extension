window.nova_plugins.push({
   id: 'disable-video-cards',
   title: 'Hide the annotations, endcards etc',
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
   run_on_pages: 'results, watch, embed, -mobile',
   section: 'other',
   // desc: "turn off 'card' in https://www.youtube.com/account_playback",
   desc: 'remove the annoying stuff at the end of the videos',
   _runtime: user_settings => {

      let selectorsList = [
         // '.annotation',
         '.ytp-paid-content-overlay', // message in the bottom-left corner "Includes paid promotion"
         // channel icon in the bottom-right corner
         '.iv-branding',
         // '.iv-promo',
      ];

      switch (NOVA.currentPage) {
         case 'embed':
            // https://stackoverflow.com/questions/52887444/hide-more-videos-within-youtube-iframe-when-stop-video
            selectorsList.push([
               '.ytp-pause-overlay', // wide-bottom block with more video list on pause
            ]);
            break;

         default:
            selectorsList.push([
               /* for 'results' page: */
               '.ytd-search-pyv-renderer', // fix blank space (https://www.youtube.com/results?search_query=Shubidua+-+Fed+Rock)
               '[class^="ytd-promoted-"]', // suggest site (https://www.youtube.com/results?search_query=mmersive+Simmulator)
               // '.ytd-promoted-sparkles-text-search-renderer', // suggest something (I do not remember)
               // 'ytd-promoted-video-renderer', // suggest ad-video
               'ytd-video-renderer + ytd-shelf-renderer', // "People also watched" block
               // 'ytd-video-renderer + ytd-horizontal-card-list-renderer', // "People also search for" block

               /* for 'watch' page: */
               '[class^="ytp-ce-"]', // suggest video/channel for the end cards
               '.ytp-cards-teaser-text', // "next video suggestion" (title) in the top-right corner
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
