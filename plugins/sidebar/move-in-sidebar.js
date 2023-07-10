// for test
// https://www.youtube.com/@TheGoodLiferadio/streams

window.nova_plugins.push({
   id: 'move-in-sidebar',
   title: 'Move in sidebar',
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
   run_on_pages: 'watch, -mobile',
   // run_on_pages: 'watch, live_chat, -mobile',
   // restart_on_location_change: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // exclude playlists
      if (location.search.includes('list=')) return;

      const
         SELECTOR_CONTAINER = 'ytd-watch-flexy:not([fullscreen])',
         SELECTOR_BELOW = `${SELECTOR_CONTAINER} #below`,
         SELECTOR_SECONDARY = `${SELECTOR_CONTAINER} #secondary`;

      switch (user_settings.move_in_sidebar_target) {
         // move description on the right
         case 'description':
            // alt - https://greasyfork.org/en/scripts/452405-youtube-scrollable-right-side-description
            if (user_settings['description-popup']) return;
            // ytd-watch-metadata #description.ytd-watch-metadata
            NOVA.waitSelector(`${SELECTOR_BELOW} #description.ytd-watch-metadata`, { stop_on_page_change: true })
               .then(description => {
                  // move to the right
                  NOVA.waitSelector(`${SELECTOR_SECONDARY}-inner`, { stop_on_page_change: true })
                     .then(secondary => {
                        if (document.body.querySelector('#chat:not([collapsed])')) return; // exclude opened chat

                        // document.body.querySelector('#secondary')?.append(comments);
                        secondary.prepend(description);
                        // channel info
                        // if (channelInfo = document.body.querySelector(`${SELECTOR_BELOW} ytd-watch-metadata #owner`)) {
                        if (channelInfo = document.body.querySelector(`${SELECTOR_BELOW} ytd-watch-metadata ytd-video-owner-renderer`)) {
                           secondary.prepend(channelInfo);
                           // channelInfo.style.margin = 0; // remove padding
                        }
                        // views and date
                        if (!user_settings['description-popup'] && !user_settings['video-date-format']) {
                           document.body.querySelector(`${SELECTOR_BELOW} ytd-watch-metadata #title`)
                              ?.append(document.body.querySelector(`${SELECTOR_SECONDARY} #info-container`));
                        } else {
                           document.body.querySelector(`${SELECTOR_SECONDARY} #info-container`)?.remove();
                        }

                        NOVA.css.push(
                           SELECTOR_SECONDARY + ` #owner {
                                 margin: 0;
                           }
                           /*make the description scrollable*/
                           ${SELECTOR_SECONDARY} #description.ytd-watch-metadata {
                              height: fit-content !important;
                              max-height: 80vh !important;
                              overflow-y: auto;
                           }
                           /* hide collapse label */
                           ${SELECTOR_SECONDARY} #description #collapse {
                              display: none;
                           }`);
                        document.body.querySelector(`${SELECTOR_SECONDARY} #description #expand`)?.click();
                     });
               });
            break;

         // move conmments on the right
         case 'comments':
            // alt1 - https://github.com/yakisova41/move-youtube-comments-to-sidebar
            if (user_settings.comments_visibility_mode == 'disable'
               || user_settings['comments-popup']
            ) {
               return;
            }

            NOVA.waitSelector(`${SELECTOR_BELOW} #comments`, { stop_on_page_change: true })
               .then(comments => {
                  if (document.body.querySelector('#chat:not([collapsed])')) return; // exclude opened chat

                  document.body.querySelector(`${SELECTOR_SECONDARY}`)?.appendChild(comments);
                  // make the conmments scrollable
                  Object.assign(comments.style, {
                     height: '100vh',
                     'overflow-y': 'auto',
                  });
                  // NOVA.css.push(
                  //    `#comments {
                  //       height: 100vh !important;
                  //       overflow-y: auto;
                  //    }`);
               });
            break;
      }

      // move related on below the video
      NOVA.waitSelector(`${SELECTOR_SECONDARY} #related`, { stop_on_page_change: true })
         .then(related => {
            if (document.body.querySelector('#chat:not([collapsed])')) return; // exclude opened chat

            document.body.querySelector('#below')?.appendChild(related);
         });

   },
   options: {
      move_in_sidebar_target: {
         _tagName: 'select',
         label: 'Taget of movement',
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
         // title: '',
         options: [
            { label: 'description', value: 'description', selected: true },
            { label: 'comments', value: 'comments' },
         ],
      },
   },
});
