window.nova_plugins.push({
   id: 'shorts-disable',
   title: 'Disable Shorts',
   'title:zh': '禁用短裤',
   'title:ja': 'ショートパンツを無効にする',
   'title:ko': '반바지 비활성화',
   'title:es': 'Deshabilitar pantalones cortos',
   'title:pt': 'Desativar Shorts',
   'title:fr': 'Désactiver les Shorts',
   'title:tr': 'Şortları devre dışı bırak',
   'title:de': 'Kurzschlüsse deaktivieren',
   run_on_pages: 'results, feed, channel',
   restart_on_transition: true,
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      const ATTR_MARK = 'shorts-cleared';

      // clear before restart_on_transition
      document.addEventListener('yt-navigate-start', () => NOVA.clear_watchElement(ATTR_MARK));

      // fix clear thumb on page update (change sort etc.)
      // document.addEventListener('yt-page-data-updated', () =>
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK))
         , { capture: true, once: true });

      NOVA.watchElement({
         selectors: [
            // 'ytd-rich-item-renderer', // home
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed, channel
            // 'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile
            // #video-badges span:has_text("LIVE NOW")
         ],
         attr_mark: ATTR_MARK,
         callback: thumb => {
            // if (thumb.querySelector('a[href*="shorts/"], ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"], #overlays [aria-label="Shorts"]')
            if (thumb.querySelector('a[href*="shorts/"]')
               // user_settings.shorts_disable_min_duration
               || NOVA.timeFormatTo.hmsToSec(thumb.querySelector('#overlays #text:not(:empty)')?.textContent.trim()) < (parseInt(user_settings.shorts_disable_min_duration) || 60)
            ) {
               thumb.remove();
               // // thumb.style.display = 'none';

               // console.debug('has #shorts:', link);
               // thumb.style.border = '2px solid blue'; // mark for test
            }
         },
      });

   },
   options: {
      shorts_disable_min_duration: {
         _tagName: 'input',
         label: 'Less duration in sec',
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
         min: 3,
         max: 3600,
         value: 60,
      },
   }
});
