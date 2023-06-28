// for test
// https://www.youtube.com/watch?v=oWoWkxzeiok&list=OLAK5uy_kDx6ubTnuS4mYHCPyyX1NpXyCtoQN08M4&index=3

window.nova_plugins.push({
   id: 'thumbnails-grid-count',
   title: 'Thumbnails count in line',
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
   // 'title:ua': '',
   run_on_pages: 'feed, channel, -mobile',
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/391636-youtube-normal-thumbnails
      // alt2 - https://greasyfork.org/en/scripts/459337-youtube-force-compact-grid-increases-max-videos-per-row
      // alt3 - https://greasyfork.org/en/scripts/465840-youtube-videos-per-row-fix
      // alt4 - https://greasyfork.org/en/scripts/452667-youtube-subscriptions-elderly-mode
      // alt5 - https://chrome.google.com/webstore/detail/dcnjhgnfnmijfkmcddcmffeamphmmeed

      const
         origMathMin = Math.min,
         addRowCount = +user_settings.thumbnails_grid_count || 1;

      Math.min = function () {
         return origMathMin.apply(Math, arguments)
            + (/calcElementsPerRow/img.test(Error().stack || '') ? addRowCount : 0);
      };

      // ???
      NOVA.css.push(
         `ytd-rich-grid-video-renderer[mini-mode] #video-title.ytd-rich-grid-video-renderer {
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1.6rem;
         }

         #avatar-link.ytd-rich-grid-video-renderer {
            display: none !important;
         }

         ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {
            min-width: 120px !important;
            max-width: 240px !important;
         }`);

   },
   options: {
      thumbnails_grid_count: {
         _tagName: 'input',
         label: 'Add to row',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         type: 'number',
         // title: '',
         placeholder: '1-10',
         step: 1,
         min: 1,
         max: 10,
         value: 1,
      },
   }
});
