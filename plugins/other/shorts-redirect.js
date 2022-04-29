window.nova_plugins.push({
   id: 'shorts-redirect',
   title: 'Shorts to normal video',
   // 'label:zh': '',
   // 'label:ja': '',
   // 'label:ko': '',
   // 'label:es': '',
   // 'label:pt': '',
   // 'label:fr': '',
   // 'label:tr': '',
   // 'label:de': '',
   run_on_pages: 'results, feed, channel, shorts',
   restart_on_transition: true,
   section: 'other',
   desc: 'Redirect Shorts video to normal URL',
   'desc:zh': '将短片视频重定向到正常 URL',
   'desc:ja': 'ショートパンツの動画を通常のURLにリダイレクトする',
   'desc:ko': '짧은 비디오를 일반 URL로 리디렉션',
   'desc:es': 'Redirigir video corto a URL normal',
   'desc:pt': 'Redirecionar vídeo curto para URL normal',
   'desc:fr': 'Rediriger la vidéo courte vers une URL normale',
   'desc:tr': "Kısa videoyu normal URL'ye yönlendir",
   'desc:de': 'Kurzvideos auf normale URL umleiten',
   _runtime: user_settings => {

      if (user_settings['shorts-disable']) return; // conflict with plugin

      const ATTR_MARK = 'shorts-pathed';

      // clear before restart_on_transition
      document.addEventListener('yt-navigate-start', () => NOVA.clear_watchElement(ATTR_MARK));

      // fix clear thumb on page update (change sort etc.)
      // document.addEventListener('yt-page-data-updated', () =>
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK))
         , { capture: true, once: true });

      switch (NOVA.currentPageName()) {
         case 'shorts':
            location.href = location.href.replace('shorts/', 'watch?v=');
            break;

         default:
            const thumbsSelectors = [
               // 'ytd-rich-item-renderer', // home
               'ytd-video-renderer', // results
               'ytd-grid-video-renderer', // feed, channel
               // 'ytd-compact-video-renderer', // sidepanel in watch
               'ytm-compact-video-renderer', // mobile
            ];

            NOVA.watchElement({
               selectors: thumbsSelectors.map(e => e + ':not([hidden]) a[href*="shorts/"]'),
               attr_mark: ATTR_MARK,
               callback: link => {
                  link.href += '&list=RDSH'; // fix href redirect to watch
                  // link.href = link.href.replace('shorts/', 'watch?v=');

                  // console.debug('has #shorts:', link);
                  // link.style.border = '2px solid green'; // mark for test

                  // add time to overlay
                  if (user_settings.shorts_thumbnails_time && link.matches('a#thumbnail')) {
                     NOVA.waitElement('ytd-thumbnail-overlay-time-status-renderer', link)
                        .then(overlay => {
                           if ((thumb = link.closest(thumbsSelectors.join(',\n')))
                              && (time = getThumbTime(thumb.data))
                           ) {
                              // console.debug('time', time);
                              overlay.setAttribute('overlay-style', 'DEFAULT');
                              overlay.querySelector('#text').textContent = time;
                           }
                        });
                  }
               },
            });
            break;
      }

      function getThumbTime(videoData = required()) {
         // document.body.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer")
         //    .forEach(videoRenderer => {
         const
            // videoData = videoRenderer.data,
            title = videoData.title.accessibility.accessibilityData.label,
            publishedTimeText = videoData.publishedTimeText.simpleText,
            viewCountText = videoData.viewCountText.simpleText;

         let
            [minutes, seconds] = title.split(publishedTimeText)[1].split(viewCountText)[0] // "12 minutes, 17 seconds "
               .split(/\D/, 2).filter(Number).map(s => (+s === 1 ? 60 : +s) - 1); // fix minutes and offest

         if (!seconds) { // fix mixed up in places
            seconds = minutes;
            minutes = null;
         }
         // console.debug('>', [minutes, seconds]);
         return [minutes || '0', seconds].join(':');
         // });
      }

   },
   options: {
      shorts_thumbnails_time: {
         _tagName: 'input',
         label: 'Add time to overlay',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'checkbox',
         // title: '',
      },
   }
});
