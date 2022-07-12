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

      const
         ATTR_MARK = 'nova-thumb-live-cleared',
         conteinerSelector = [
            'ytd-rich-item-renderer', // home
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed, channel
            'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile
         ].join(',');

      document.addEventListener('yt-action', evt => {
         // console.log(evt.detail?.actionName);
         if (['ytd-update-grid-state-action', 'yt-append-continuation-items-action', 'yt-service-request'].includes(evt.detail?.actionName)) {
            hideThumb();
         }
      });

      function hideThumb() {
         document.body.querySelectorAll('#badges [class*="live-now"], #thumbnail img[src*="qdefault_live.jpg"]')
            .forEach(el => el.closest(`${conteinerSelector}:not([${ATTR_MARK}])`)?.remove());
         // for test
         // .forEach(el => {
         //    if (thumb = el.closest(`${conteinerSelector}:not([${ATTR_MARK}])`)) {
         //       //thumb.remove();
         //       // thumb.style.display = 'none';

         //       console.debug('has live:', thumb);
         //       thumb.style.border = '2px solid orange'; // mark for test
         //    }
         // });
      }

      // clear before restart_on_transition
      // document.addEventListener('yt-navigate-start', () => NOVA.clear_watchElements(ATTR_MARK));

      // NOVA.watchElements({
      //    selectors: [
      //       'ytd-rich-item-renderer', // home
      //       'ytd-video-renderer', // results
      //       'ytd-grid-video-renderer', // feed, channel
      //       'ytd-compact-video-renderer', // sidepanel in watch
      //       'ytm-compact-video-renderer', // mobile

      //       // if conflict is plugin "related-visibility" try it:
      //       // '#secondary > #secondary-inner > #related:not([style="display: none;"]) ytd-compact-video-renderer', // sidepanel in watch
      //    ],
      //    attr_mark: ATTR_MARK,
      //    callback: thumb => {
      //       // live now
      //       // Doesn't work.
      //       // if (thumb.querySelector('#badges [class*="live-now"], #thumbnail img[src*="qdefault_live.jpg"]')) {
      //       //    thumb.remove();
      //       //    // thumb.style.display = 'none';

      //       //    // console.debug('has live now:', thumb);
      //       //    // thumb.style.border = '2px solid red'; // mark for test
      //       // }
      //       // Streamed
      //       if (user_settings.streamed_disable) {
      //          if (thumb.querySelector('#metadata-line')?.textContent?.includes('Streamed')
      //             || thumb.querySelector('#video-title')?.getAttribute('aria-label')?.includes('Streamed')
      //          ) {
      //             thumb.remove();
      //             // // thumb.style.display = 'none';

      //             // console.debug('has Streamed:', thumb);
      //             // thumb.style.border = '2px solid green'; // mark for test
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
         title: 'That have been completed',
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
