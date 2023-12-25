// for test
// https://www.youtube.com/watch?v=oWoWkxzeiok&list=OLAK5uy_kDx6ubTnuS4mYHCPyyX1NpXyCtoQN08M4&index=3
// https://www.youtube.com/channel/UCdNqq07dfQ_hBuOJRfWvRRA

window.nova_plugins.push({
   id: 'thumbnails-grid-count',
   title: 'Thumbnails count in row',
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
      // alt6 - https://greasyfork.org/en/scripts/465840-youtube-row-fixer

      // Strategy 1
      const
         MathMin_orig = Math.min,
         addRowCount = +user_settings.thumbnails_grid_count || 1;

      Math.min = function () {
         return MathMin_orig.apply(Math, arguments)
            + (/calcElementsPerRow/img.test(Error().stack || '') ? addRowCount - 1 : 0);
      };

      // Strategy 2
      // const videosPerRow = +user_settings.thumbnails_grid_count;
      // 4
      // `.ytd-rich-grid-renderer {
      //            --ytd-rich-grid-items-per-row: 4;
      //       }

      //       #video-title[class*="style-scope ytd-rich-grid"],
      //         ytd-game-details-renderer[is-rich-grid]:not([mini-mode]) #title.ytd-game-details-renderer {
      //              font-size: 1.4rem;
      //             line-height: 2rem;
      //             max-height: 4rem;
      //       }

      //       .ytd-rich-grid-media ytd-video-meta-block[rich-meta] #byline-container.ytd-video-meta-block,
      //         .ytd-rich-grid-media ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block {
      //           font-size: 1.2rem;
      //             line-height: 1.8rem;
      //             max-height: 3.6rem;
      //       }

      //       ytd-rich-item-renderer:nth-child(4):has(#video-title.ytd-rich-grid-media)[hidden] {
      //           display: block !important;
      //       }

      //       .ytp-inline-preview-mode .ytp-paid-content-overlay,
      //         [style="--ytd-rich-shelf-items-count: 4;"]:has(#video-title.ytd-rich-grid-media) #show-more-button .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text {
      //          display: none;
      //       }

      //       #home-page-skeleton .rich-grid-media-skeleton {
      //           max-width: calc(100%/4 - 16px);
      //           min-width: 0;
      //       }

      //       #content.ytd-rich-section-renderer > *.ytd-rich-section-renderer,
      //         ytd-rich-section-renderer {
      //           order: -1;
      //       }

      //       #dismissible.ytd-rich-shelf-renderer {
      //             border-top: none !important;
      //         }

      //       #rich-shelf-header.ytd-rich-shelf-renderer {
      //             margin: 0px 0 24px 8px;
      //         }

      //       [page-subtype="home"] .yt-core-image--content-mode-scale-aspect-fill {
      //           object-fit: fill;
      //       }

      //       .ytp-inline-preview-ui .ytp-subtitles-button, .ytp-inline-preview-ui .ytp-mute-button {
      //           display: block !important;
      //       }

      //       .ytp-inline-preview-mode button.ytp-subtitles-button.ytp-button::after {
      //           margin: 0 8px;
      //       }`,

         // 5
         // `.ytd-rich-grid-renderer {
         //        --ytd-rich-grid-items-per-row: 5;
         //    }

         //    ytd-rich-grid-row, #contents.ytd-rich-shelf-renderer:has(#video-title.ytd-rich-grid-media) {
         //        --ytd-rich-grid-item-margin: 4px;
         //    }

         //    ytd-thumbnail.ytd-rich-grid-media:before, ytd-playlist-thumbnail.ytd-rich-grid-media:before {
         //        background: none;
         //    }

         //    ytd-rich-item-renderer {
         //        margin-bottom: 24px;
         //    }

         //    #contents.ytd-rich-grid-renderer:not([page-subtype="channels"] #contents.ytd-rich-grid-renderer) {
         //        width: calc(100% - 3 * 1vw) !important;
         //    }

         //    #content.ytd-rich-section-renderer {
         //        margin: 0 2px !important;
         //    }

         //    #dismissible.ytd-rich-shelf-renderer:not([page-subtype="subscriptions"] #dismissible.ytd-rich-shelf-renderer),
         //      #dismissed.ytd-rich-shelf-renderer {
         //        width: calc(100% - 0.2 * 1vw) !important;
         //    }

         //    ytd-rich-item-renderer:nth-child(5):has(#video-title.ytd-rich-grid-media)[hidden] {
         //        display: block !important;
         //    }

         //    [style="--ytd-rich-shelf-items-count: 5;"] #dismissible.ytd-rich-shelf-renderer:has(#video-title.ytd-rich-grid-media) #show-more-button .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text {
         //        display: none;
         //    }

         //    #home-page-skeleton .rich-grid-media-skeleton {
         //       max-width: calc(100%/5 - 4px);
         //       margin: 0 2px 0 2px;
         //    }`,

         // NOVA.css.push(
         //    `.ytd-rich-grid-renderer {
         //       --ytd-rich-grid-items-per-row: ${videosPerRow};
         //    }

         //    ytd-rich-item-renderer:nth-child(${videosPerRow}):has(#video-title.ytd-rich-grid-media)[hidden] {
         //       display: block !important;
         //    }

         //    [style="--ytd-rich-shelf-items-count: ${videosPerRow};"] #dismissible.ytd-rich-shelf-renderer:has(#video-title.ytd-rich-grid-media) #show-more-button .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text {
         //       display: none;
         //    }

         //    #home-page-skeleton .rich-grid-media-skeleton {
         //       max-width: calc(100%/${videosPerRow} - 8px);
         //       margin: 0 4px 0 4px;
         //    }`);


      // set size
      // Strategy 1
      // NOVA.css.push(
      //    `#contents.ytd-rich-grid-renderer:not([page-subtype="channels"] #contents.ytd-rich-grid-renderer) {
      //       width: calc(100% - 2.4 * 1vw);
      //       max-width: calc(var(--ytd-rich-grid-items-per-row) * (var(--ytd-rich-grid-item-max-width) + var(--ytd-rich-grid-item-margin)));
      //    }`);
      // // Strategy 2
      // NOVA.css.push(
      //    `ytd-rich-grid-video-renderer[mini-mode] #video-title.ytd-rich-grid-video-renderer {
      //       font-size: 1.4rem;
      //       font-weight: 500;
      //       line-height: 1.6rem;
      //    }

      //    #avatar-link.ytd-rich-grid-video-renderer {
      //       display: none !important;
      //    }

      //    ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {
      //       min-width: 120px !important;
      //       max-width: 240px !important;
      //    }`);

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
