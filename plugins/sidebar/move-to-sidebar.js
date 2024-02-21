// for test
// https://www.youtube.com/@TheGoodLiferadio/streams

window.nova_plugins.push({
   id: 'move-to-sidebar',
   title: 'Move to sidebar',
   'title:zh': '转移到侧边栏',
   'title:ja': 'サイドバーに転送',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   'title:pt': 'Transferir para a barra lateral',
   'title:fr': 'Transférer vers la barre latérale',
   // 'title:it': '',
   // 'title:tr': '',
   'title:de': 'Zur Seitenleiste übertragen',
   'title:pl': 'Przenieś na pasek boczny',
   'title:ua': 'Перенести на бічну панель',
   run_on_pages: 'watch, -mobile',
   // restart_on_location_change: true,
   section: 'sidebar',
   // desc: '',
   'plugins-conflict': 'description-popup',
   _runtime: user_settings => {

      // exclude playlists
      if (location.search.includes('list=')) return;

      const
         SELECTOR_CONTAINER = 'ytd-watch-flexy:not([fullscreen])',
         SELECTOR_BELOW = `${SELECTOR_CONTAINER} #below`,
         SELECTOR_SECONDARY = `${SELECTOR_CONTAINER} #secondary`;

      switch (user_settings.move_to_sidebar_target) {
         case 'info':
            moveChannelInfo();
            break;

         // move description on the right
         case 'description':
            // alt - https://greasyfork.org/en/scripts/452405-youtube-scrollable-right-side-description
            if (user_settings['description-popup']) return;
            // ytd-watch-metadata #description.ytd-watch-metadata
            NOVA.waitSelector(`${SELECTOR_BELOW} #description.ytd-watch-metadata`, { destroy_after_page_leaving: true })
               .then(description => {
                  // move to the right
                  NOVA.waitSelector(`${SELECTOR_SECONDARY}-inner`, { destroy_after_page_leaving: true })
                     .then(async secondary => {
                        if (document.body.querySelector('#chat:not([collapsed])')) return; // exclude opened chat

                        // document.body.querySelector('#secondary')?.append(comments);
                        secondary.prepend(description);
                        // channel info
                        moveChannelInfo();
                        // views and date
                        if (!user_settings['description-popup'] && !user_settings['video-date-format']) {
                           document.body.querySelector(`${SELECTOR_BELOW} ytd-watch-metadata #title`)
                              ?.append(document.body.querySelector(`${SELECTOR_SECONDARY} #info-container`));
                        }
                        else {
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
                           }
                           /* hide info tags */
                           #ytd-watch-info-text, #info-container a {
                              display: none;
                           }`);
                        document.body.querySelector(`${SELECTOR_SECONDARY} #description #expand`)?.click();
                     });
               });

            moveSidebar();
            break;

         // move conmments on the right
         case 'comments':
            // alt1 - https://github.com/yakisova41/move-youtube-comments-to-sidebar
            if (user_settings.comments_visibility_mode == 'disable'
               || user_settings['comments-popup']
            ) {
               return;
            }

            NOVA.waitSelector(`${SELECTOR_BELOW} #comments`, { destroy_after_page_leaving: true })
               .then(comments => {
                  if (document.body.querySelector('#chat:not([collapsed])')) return; // exclude opened chat

                  document.body.querySelector(`${SELECTOR_SECONDARY}`)?.appendChild(comments);
                  // make the conmments scrollable
                  comments.style.cssText = 'height:100vh; overflow-y:auto;';
                  // Object.assign(comments.style, {
                  //    height: '100vh',
                  //    'overflow-y': 'auto',
                  // });
                  // NOVA.css.push(
                  //    `#comments {
                  //       height: 100vh !important;
                  //       overflow-y: auto;
                  //    }`);
               });

            moveSidebar();
            break;
      }

      function moveSidebar() {
         // move related on below the video
         NOVA.waitSelector(`${SELECTOR_SECONDARY} #related`, { destroy_after_page_leaving: true })
            .then(related => {
               if (document.body.querySelector('#chat:not([collapsed])')) return; // exclude opened chat

               document.body.querySelector('#below')?.appendChild(related);
            });
      }

      function moveChannelInfo() {
         NOVA.waitSelector(`${SELECTOR_SECONDARY}-inner`, { destroy_after_page_leaving: true })
            .then(secondary => {
               // with the subscribe button
               NOVA.waitSelector(`${SELECTOR_BELOW} ytd-watch-metadata #owner`, { destroy_after_page_leaving: true })
                  // without the subscribe button
                  // NOVA.waitSelector(`${SELECTOR_BELOW} ytd-watch-metadata ytd-video-owner-renderer`, { destroy_after_page_leaving: true })
                  .then(channelInfo => {
                     secondary.prepend(channelInfo);
                     // channelInfo.style.margin = 0; // remove padding
                  });
            });

      }

   },
   options: {
      move_to_sidebar_target: {
         _tagName: 'select',
         label: 'Target of movement',
         'label:zh': '运动目标',
         'label:ja': '移動の対象',
         // 'label:ko': '',
         // 'label:vi': '',
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
            { label: 'info', value: 'info' },
            { label: 'info + description', value: 'description', selected: true },
            { label: 'comments', value: 'comments' },
         ],
      },
   },
});
