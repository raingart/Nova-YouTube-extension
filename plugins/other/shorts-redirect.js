window.nova_plugins.push({
   id: 'shorts-disable',
   title: 'Disable Shorts',
   // 'title:zh': '禁用短裤',
   // 'title:ja': 'ショートパンツを無効にする',
   // 'title:ko': '반바지 비활성화',
   // 'title:es': 'Deshabilitar pantalones cortos',
   // 'title:pt': 'Desativar Shorts',
   // 'title:fr': 'Désactiver les Shorts',
   // 'title:tr': 'Şortları devre dışı bırak',
   // 'title:de': 'Kurzschlüsse deaktivieren',
   run_on_pages: 'home, results, feed, channel, shorts',
   section: 'other',
   // desc: 'Redirect Shorts video to normal URL',
   // 'desc:zh': '将短片视频重定向到正常 URL',
   // 'desc:ja': 'ショートパンツの動画を通常のURLにリダイレクトする',
   // 'desc:ko': '짧은 비디오를 일반 URL로 리디렉션',
   // 'desc:es': 'Redirigir video corto a URL normal',
   // 'desc:pt': 'Redirecionar vídeo curto para URL normal',
   // 'desc:fr': 'Rediriger la vidéo courte vers une URL normale',
   // 'desc:tr': "Kısa videoyu normal URL'ye yönlendir",
   // 'desc:de': 'Kurzvideos auf normale URL umleiten',
   _runtime: user_settings => {

      // redirect
      redirectShorts(); // init

      document.addEventListener('yt-navigate-start', redirectShorts);

      function redirectShorts() {
         if (NOVA.currentPageName() == 'shorts') {
            location.href = location.href.replace('shorts/', 'watch?v=');
         }
      }

      // hide
      hideHTML(); // init
      // on scroll update page
      document.addEventListener('yt-action', evt => {
         if (['ytd-update-grid-state-action', 'yt-append-continuation-items-action'].includes(evt.detail?.actionName)) {
            hideHTML();
         }
      });

      function hideHTML() {
         // Strategy 1
         // document.querySelectorAll('a[href*="shorts/"], ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"], #overlays [aria-label="Shorts"]')
         // .forEach(a => a.closest('ytd-grid-video-renderer')?.remove());

         // Strategy 2
         document.body.querySelectorAll('ytd-video-renderer:not([hidden]), ytd-grid-video-renderer:not([hidden]), ytm-compact-video-renderer:not([hidden])')
            .forEach(thumb => {
               if ((link = thumb.querySelector('a[href*="shorts/"]'))
                  // user_settings.shorts_disable_min_duration
                  || NOVA.timeFormatTo.hmsToSec(thumb?.querySelector('#overlays #text:not(:empty)')?.textContent.trim()) < (parseInt(user_settings.shorts_disable_min_duration) || 60)
               ) {
                  thumb.remove();
                  // thumb.style.display = 'none';
                  // console.debug('has #shorts:', link, link.textContent);
                  // thumb.style.border = `2px solid ${link ? 'red' : 'green'}`; // mark for test
               }
            });
      }

      // There is a init delay. Not an optimized way
      // NOVA.watchElement({
      //    selector: 'ytd-grid-video-renderer:not([hidden])',
      //    attr_mark: 'shorts-cleared',
      //    callback: thumb => {
      //       if ((link = thumb.querySelector('a#video-title, a[href*="shorts/"]'))
      //          && link.textContent.includes('#shorts')
      //       ) {
      //          // console.debug('has #shorts:', link, link.textContent);
      //          thumb.style.display = 'none';
      //          cleared = true;
      //       }
      //    },
      // });
   },
   options: {
      shorts_disable_min_duration: {
         _tagName: 'input',
         label: 'Min duration in sec',
         'label:zh': '最短持续时间（以秒为单位）',
         'label:ja': '秒単位の最小期間',
         'label:ko': '최소 지속 시간(초)',
         'label:es': 'Duración mínima en segundos',
         'label:pt': 'Duração mínima em segundos',
         'label:fr': 'Durée minimale en secondes',
         'label:tr': 'Saniye cinsinden minimum süre',
         'label:de': 'Mindestdauer in Sekunden',
         type: 'number',
         // title: '60 - default',
         // title: 'Minimum duration in seconds',
         placeholder: '60-300',
         step: 1,
         min: 10,
         max: 300,
         value: 60,
      },
   }
});
