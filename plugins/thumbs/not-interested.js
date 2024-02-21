// for test
// https://www.youtube.com/@Karujika/videos- many live

window.nova_plugins.push({
   id: 'thumbs-not-interested',
   title: 'Add "Not Interested" button on thumbnails',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'feed, channel, watch, -mobile',
   section: 'thumbs',
   opt_api_key_warn: true,
   desc: 'You must be logged in',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:vi': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   // 'desc:ua': '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/458907-youtube-video-download-buttons

      const
         SELECTOR_OVERLAY_ID_NAME = 'nova-thumb-overlay', // shared container for [thumbs-watch-later] plugin
         SELECTOR_CLASS_NAME = 'nova-thumbs-not-interested-btn',
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home, channel, feed
            'ytd-video-renderer', // results
            // 'ytd-grid-video-renderer', // feed (old)
            'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
            'ytm-item-section-renderer' // mobile /subscriptions page
         ]
            .map(i => `${i}:not(.${SELECTOR_CLASS_NAME})`)
            .join(',');

      // page update event
      document.addEventListener('yt-action', evt => {
         // console.log(evt.detail?.actionName);
         switch (evt.detail?.actionName) {
            case 'yt-append-continuation-items-action': // home, results, feed, channel, watch
            case 'ytd-update-grid-state-action': // feed, channel
            case 'yt-rich-grid-layout-refreshed': // feed
            // case 'ytd-rich-item-index-update-action': // home, channel
            case 'yt-store-grafted-ve-action': // results, watch
            // case 'ytd-update-elements-per-row-action': // feed
            case 'yt-forward-redux-action-to-live-chat-iframe': // watch test

               // universal
               // case 'ytd-update-active-endpoint-action':
               // case 'yt-window-scrolled':
               // case 'yt-service-request': // results, watch

               // console.log(evt.detail?.actionName); // flltered
               switch (NOVA.currentPage) {
                  // case 'home':
                  // case 'results':
                  case 'feed':
                  // case 'channel':
                  case 'watch':
                     document.body.querySelectorAll(thumbsSelectors)
                        .forEach(thumb => {
                           thumb.classList.add(SELECTOR_CLASS_NAME);

                           if (container = thumb.querySelector('a#thumbnail')) {
                              if (user_settings['thumbs-watch-later']) {
                                 NOVA.waitSelector(`#${SELECTOR_OVERLAY_ID_NAME}`, { 'container': container })
                                    .then(container => {
                                       container.append(renderButton(thumb));
                                    });
                              }
                              else {
                                 const div = document.createElement('div');
                                 div.id = SELECTOR_OVERLAY_ID_NAME;
                                 div.append(renderButton(thumb));
                                 container.append(div);
                              }
                           }
                           // if (vidId = NOVA.queryURL.get('v', thumb.href)) {
                           // }
                        });
                     break;

                  // default:
                  //    break;
               }
               break;

            // default:
            //    break;
         }
      });


      if (!user_settings['thumbs-watch-later']) {
         NOVA.css.push(
            `#${SELECTOR_OVERLAY_ID_NAME} {
               position: absolute;
               top: 0;
               left: 0;
               z-index: 999;
            }`);
      }

      // button style
      NOVA.css.push(
         `button.${SELECTOR_CLASS_NAME} {
            border: 0;
            cursor: pointer;
            height: 1.3em;
            font-size: 2em;
            background-color: transparent;
            background-color: var(--yt-spec-static-overlay-background-heavy);
            color: var(--yt-spec-static-overlay-text-primary);
         }`);

      function renderButton(thumb = required()) {
         const btn = document.createElement('button');
         btn.className = SELECTOR_CLASS_NAME;
         // btn.textContent = '[no int]';
         // btn.textContent = '🕓';
         btn.innerHTML =
            `<svg viewBox="0 0 24 24" height="100%" width="100%">
               <g fill="currentColor">
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM3 12c0 2.31.87 4.41 2.29 6L18 5.29C16.41 3.87 14.31 3 12 3c-4.97 0-9 4.03-9 9zm15.71-6L6 18.71C7.59 20.13 9.69 21 12 21c4.97 0 9-4.03 9-9 0-2.31-.87-4.41-2.29-6z" />
               </g>
            </svg>`;
         btn.title = 'Not Interested';
         // btn.style.cssText = '';
         // Object.assign(btn.style, {
         //    border: 0,
         //    cursor: 'pointer',
         //    // scale: .7,
         //    position: 'absolute',
         //    top: 0,
         //    left: 0,
         //    height: '30px',
         //    'z-index': 999,
         //    'background-color': 'transparent',
         // });
         btn.addEventListener('click', async evt => {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            if (menu = thumb.querySelector('#menu button')) {
               menu.click();
               await NOVA.waitSelector('#menu [menu-active]', { container: thumb, destroy_after_page_leaving: true });
               // click by original "Not interested" menu item
               if (menuItemEl = document.body.querySelector('tp-yt-iron-dropdown [role="menuitem"]:has(path[d^="M12 2c5.52"])')) {
                  menuItemEl.style.backgroundColor = 'red';
                  await NOVA.delay(500);
                  // if(confirm('click to mark red item?')) {
                  menuItemEl.click();
                  // }
                  menuItemEl.style.backgroundColor = null;
               }
               // document.body.click(); // close menu
               // menu.click();
            }
         });
         return btn;
      }

   },
});
