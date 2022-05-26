// for test
// https://www.youtube.com/shorts/5ndfxasp2r0

window.nova_plugins.push({
   id: 'shorts-redirect',
   title: 'Redirect Shorts to regular URLs (watch)',
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
   desc: 'Redirect Shorts video to normal player',
   'desc:zh': '将 Shorts 视频重定向到普通播放器',
   'desc:ja': 'ショートパンツのビデオを通常のプレーヤーにリダイレクトする',
   'desc:ko': 'Shorts 비디오를 일반 플레이어로 리디렉션',
   'desc:es': 'Redirigir el video de Shorts al reproductor normal',
   'desc:pt': 'Redirecionar o vídeo do Shorts para o player normal',
   'desc:fr': 'Rediriger la vidéo Short vers un lecteur normal',
   'desc:tr': 'Shorts videosunu normal oynatıcıya yönlendir',
   'desc:de': 'Shorts-Video auf normalen Player umleiten',
   _runtime: user_settings => {

      if ('shorts' == NOVA.currentPage) {
         // alt - https://greasyfork.org/en/scripts/444710-byts-better-youtube-shorts-greasyfork-edition
         return location.href = location.href.replace('shorts/', 'watch?v=');
         // location.replace(location.href.replace('/shorts/', '/watch?v='));
      }

      if (user_settings['shorts-disable']) return; // conflict with plugin. Attention! After shorts redirect

      const ATTR_MARK = 'nova-shorts-pathed';

      // clear before restart_on_transition
      document.addEventListener('yt-navigate-start', () =>
         NOVA.clear_watchElement(ATTR_MARK), { capture: true, once: true });

      // fix clear thumb on page update (change sort etc.)
      // document.addEventListener('yt-page-data-updated', () =>
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK))
         , { capture: true, once: true });

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
