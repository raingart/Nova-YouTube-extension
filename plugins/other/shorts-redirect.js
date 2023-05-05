// for test
// https://www.youtube.com/shorts/5ndfxasp2r0

window.nova_plugins.push({
   id: 'shorts-redirect',
   title: 'Redirect Shorts to regular (watch) URLs',
   'title:zh': '将 Shorts 重定向到常规（watch）URL',
   'title:ja': 'ショートパンツを通常の（watch）URLにリダイレクトする',
   'title:ko': 'Shorts를 일반(watch) URL로 리디렉션',
   'title:id': 'Redirect Shorts ke URL reguler (watch)',
   'title:es': 'Redirigir Shorts a URL normales (watch)',
   'title:pt': 'Redirecionar Shorts para URLs regulares (watch)',
   'title:fr': 'Rediriger les shorts vers des URL normales (watch)',
   'title:it': 'Reindirizza i cortometraggi a URL normali (watch).',
   // 'title:tr': "Shorts'ları normal (watch) URL'lerine yönlendirin",
   'title:de': 'Leiten Sie Shorts zu regulären (watch) URLs um',
   'title:pl': 'Przełączaj Shorts na zwykłe adresy URL',
   'title:ua': 'Перенаправляйте прев`ю на звичайні URL-адреси (для перегляду)',
   // run_on_pages: 'results, feed, channel, shorts',
   run_on_pages: 'shorts',
   restart_on_location_change: true, // replace "redirectPageToNormal"
   section: 'other',
   desc: 'Redirect Shorts video to normal player',
   'desc:zh': '将 Shorts 视频重定向到普通播放器',
   'desc:ja': 'ショートパンツのビデオを通常のプレーヤーにリダイレクトする',
   'desc:ko': 'Shorts 비디오를 일반 플레이어로 리디렉션',
   'desc:id': 'Redirect video Shorts ke pemutar normal',
   'desc:es': 'Redirigir el video de Shorts al reproductor normal',
   'desc:pt': 'Redirecionar o vídeo do Shorts para o player normal',
   'desc:fr': 'Rediriger la vidéo Short vers un lecteur normal',
   'desc:it': 'Reindirizza il video dei cortometraggi al lettore normale',
   // 'desc:tr': 'Shorts videosunu normal oynatıcıya yönlendir',
   'desc:de': 'Shorts-Video auf normalen Player umleiten',
   'desc:pl': 'Przełącza krótkie filmy do normalnego odtwarzacza',
   'desc:ua': 'Перенаправляйте прев`ю відео у звичайний відтворювач',
   _runtime: user_settings => {

      location.href = location.href.replace('shorts/', 'watch?v=');

      // NOVA.runOnPageInitOrTransition(redirectPageToNormal);

      // function redirectPageToNormal() {
      //    if ('shorts' == NOVA.currentPage) {
      //       // alt1 - https://github.com/YukisCoffee/yt-anti-shorts/blob/main/anti-shorts.user.js
      //       // alt2 - https://openuserjs.org/scripts/Kraust/Youtube_Shorts_Redirect
      //       // alt3 - https://greasyfork.org/en/scripts/458220-better-short-player - replace to embed
      //       // alt4 - https://greasyfork.org/en/scripts/444710-byts-better-youtube-shorts-greasyfork-edition

      //       return location.href = location.href.replace('shorts/', 'watch?v=');
      //       // location.replace(location.href.replace('/shorts/', '/watch?v='));
      //    }
      // }

      // if (user_settings['shorts_disable']) return; // conflict with plugin [thumbs-hide] option (shorts_disable). Attention! After shorts redirect

      // Strategy 1

      // document.addEventListener('yt-action', evt => {
      //    // console.log(evt.detail?.actionName);
      //    if ([
      //       'yt-append-continuation-items-action', // home, results, feed, channel, watch
      //       'ytd-update-grid-state-action', // feed, channel
      //       'yt-service-request', // results, watch
      //       'ytd-rich-item-index-update-action', // home, channel
      //    ]
      //       .includes(evt.detail?.actionName)
      //    ) {
      //       if (NOVA.currentPage == 'channel' && !['shorts'].includes(NOVA.channelTab)) return;

      //       patchThumbShort();
      //    }
      // });

      // const
      //    // ATTR_MARK = 'nova-thumb-shorts-pathed',
      //    linkQueryPatch = '&list=RDSH';

      // function patchThumbShort() {
      //    document.body.querySelectorAll(`a[href*="/shorts/"]:not([href$="${linkQueryPatch}"])`)
      //       .forEach(link => {
      //          link.href += linkQueryPatch; // fix href redirect to watch
      //          // link.href = link.href.replace('shorts/', 'watch?v=');
      //       });
      // }

      // Strategy 2

      // clear before restart_on_location_change
      // document.addEventListener('yt-navigate-start', () =>
      //    NOVA.clear_watchElements(ATTR_MARK), { capture: true, once: true });

      // fix clear thumb on page update (change sort etc.)
      // document.addEventListener('yt-page-data-updated', () =>
      // document.addEventListener('yt-navigate-finish', () =>
      // document.body.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK))
      // , { capture: true, once: true });

      // NOVA.watchElements({
      //    selectors: ['a[href*="shorts/"]'],
      //    attr_mark: ATTR_MARK,
      //    callback: link => {
      //       link.href += '&list=RDSH'; // fix href redirect to watch
      //       // link.href = link.href.replace('shorts/', 'watch?v=');

      //       // console.debug('has #shorts:', link);
      //       // link.style.border = '2px solid green'; // mark for test
      //    },
      // });

   },
});
