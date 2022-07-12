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
   'title:tr': "Shorts'ları normal (watch) URL'lerine yönlendirin",
   'title:de': 'Leiten Sie Shorts zu regulären (watch) URLs um',
   'title:pl': 'Przełączaj Shorts na zwykłe adresy URL',
   run_on_pages: 'results, feed, channel, shorts',
   // restart_on_transition: true,
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
   'desc:tr': 'Shorts videosunu normal oynatıcıya yönlendir',
   'desc:de': 'Shorts-Video auf normalen Player umleiten',
   'desc:pl': 'Przełącza krótkie filmy do normalnego odtwarzacza',
   _runtime: user_settings => {

      if ('shorts' == NOVA.currentPage) {
         // alt - https://greasyfork.org/en/scripts/444710-byts-better-youtube-shorts-greasyfork-edition
         return location.href = location.href.replace('shorts/', 'watch?v=');
         // location.replace(location.href.replace('/shorts/', '/watch?v='));
      }

      if (user_settings['shorts-disable']) return; // conflict with plugin. Attention! After shorts redirect

      const ATTR_MARK = 'nova-thumb-shorts-pathed';

      // clear before restart_on_transition
      // document.addEventListener('yt-navigate-start', () =>
      //    NOVA.clear_watchElements(ATTR_MARK), { capture: true, once: true });

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

      NOVA.watchElements({
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
         'label:zh': '添加时间叠加',
         'label:ja': 'オーバーレイする時間を追加する',
         'label:ko': '오버레이 시간 추가',
         'label:id': 'Tambahkan waktu untuk overlay',
         'label:es': 'Agregar tiempo para superponer',
         'label:pt': 'Adicionar tempo à sobreposição',
         'label:fr': 'Ajouter du temps à la superposition',
         'label:it': 'Aggiungi tempo per la sovrapposizione',
         'label:tr': 'Bindirme için zaman ekleyin',
         'label:de': 'Zeit zum Überlagern hinzufügen',
         'label:pl': 'Pokaż nakładkę z czasem',
         type: 'checkbox',
         // title: '',
      },
   }
});
