// for test
// https://www.youtube.com/c/TheGoodLiferadio - many live

window.nova_plugins.push({
   id: 'streams-disable',
   title: 'Hide Stream (live)',
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
   'title:pl': 'Ukryj strumień (na żywo)',
   run_on_pages: 'home, results, feed, channel, watch',
   // restart_on_transition: true,
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      const thumbsSelectors = [
         'ytd-rich-item-renderer', // home
         'ytd-video-renderer', // results
         'ytd-grid-video-renderer', // feed, channel
         'ytd-compact-video-renderer', // sidepanel in watch
         'ytm-compact-video-renderer', // mobile
      ]
         .join(',');

      // Strategy 1
      document.addEventListener('yt-action', evt => {
         // console.log(evt.detail?.actionName);
         if ([
            'ytd-update-grid-state-action',
            'yt-append-continuation-items-action',
            'yt-service-request'
         ]
            .includes(evt.detail?.actionName)
         ) {
            removeThumbLive();

            if (user_settings.streamed_disable) removeThumbStreamed();
         }
      });

      function removeThumbLive() {
         document.body.querySelectorAll('#badges [class*="live-now"], #thumbnail img[src*="qdefault_live.jpg"]')
            .forEach(el => el.closest(thumbsSelectors)?.remove());
         // for test
         // .forEach(el => {
         //    if (thumb = el.closest(thumbsSelectors)) {
         //       // thumb.remove();
         //       // thumb.style.display = 'none';

         //       console.debug('live now:', thumb);
         //       thumb.style.border = '2px solid orange'; // mark for test
         //    }
         // });
      }

      function removeThumbStreamed() {
         document.querySelectorAll('#metadata-line > span:nth-child(2)')
            .forEach(el => {
               if (el.textContent?.split(' ').length === 4 // "Streamed 5 days ago"
                  && (thumb = el.closest(thumbsSelectors))) {
                  thumb.remove();
                  // thumb.style.display = 'none';

                  // console.debug('streamed:', thumb);
                  // thumb.style.border = '2px solid green'; // mark for test
               }
            });
      }

      // Strategy 2
      // const ATTR_MARK = 'nova-thumb-live-cleared';

      // // clear before restart_on_transition
      // document.addEventListener('yt-navigate-start', () => NOVA.clear_watchElements(ATTR_MARK));

      // NOVA.watchElements({
      //    // selectors: [
      //    //    'ytd-rich-item-renderer', // home
      //    //    'ytd-video-renderer', // results
      //    //    'ytd-grid-video-renderer', // feed, channel
      //    //    'ytd-compact-video-renderer', // sidepanel in watch
      //    //    'ytm-compact-video-renderer', // mobile
      //    // ],
      //    selectors: '#thumbnail',
      //    attr_mark: ATTR_MARK,
      //    callback: thumb_ => {
      //       if (thumb = thumb_.closest(thumbsSelectors)) {
      //          // live now
      //          if (thumb.querySelector('#badges [class*="live-now"], #thumbnail img[src*="qdefault_live.jpg"]')) {
      //             thumb.remove();
      //             // thumb.style.display = 'none';

      //             // console.debug('live now:', thumb);
      //             // thumb.style.border = '2px solid red'; // mark for test
      //          }
      //          // Streamed
      //          if (user_settings.streamed_disable) {
      //             // more 1 hour
      //             // if ((time = thumb.querySelector('#overlays #text:not(:empty)')?.textContent.trim())
      //             //    && NOVA.timeFormatTo.hmsToSec(time) > 3600 // 1 hour
      //             // ) {
      //             if (thumb.querySelector('#metadata-line > span:nth-child(2)')
      //                // "Streamed 5 days ago"
      //                ?.textContent?.split(' ').length === 4
      //             ) {
      //                thumb.remove();
      //                // thumb.style.display = 'none';

      //                // console.debug('streamed:', thumb);
      //                // thumb.style.border = '2px solid green'; // mark for test
      //             }
      //          }
      //       }
      //    },
      // });

   },
   options: {
      streamed_disable: {
         _tagName: 'input',
         label: 'Also streamed',
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
         'label:pl': 'Po streamie',
         type: 'checkbox',
         title: 'Which have been completed',
         'title:zh': '已经完成的',
         'title:ja': '完了しました',
         'title:ko': '완료한 것',
         'title:id': 'Itu sudah selesai',
         'title:es': 'Que han sido completados',
         'title:pt': 'Que foram concluídos',
         'title:fr': 'Qui ont été complétés',
         'title:it': 'Che sono stati completati',
         'title:tr': 'Tamamlanmış olanlar',
         'title:de': 'Die sind abgeschlossen',
         'title:pl': 'Które zostały zakończone',
      },
   }
});
