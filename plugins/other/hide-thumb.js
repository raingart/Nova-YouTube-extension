window.nova_plugins.push({
   id: 'thumbs-hide',
   title: 'Hide some thumbs',
   run_on_pages: 'home, results, feed, channel, watch',
   // restart_on_transition: true,
   section: 'other',
   _runtime: user_settings => {

      const
         // ATTR_MARK = 'nova-thumb-shorts-pathed',
         thumbsSelectors = [
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
            if (user_settings.shorts_disable) removeThumbShorts();
            if (user_settings.premieres_disable) removeThumbPremieres();
            if (user_settings.streams_disable) removeThumbLive();
            if (user_settings.streamed_disable) removeThumbStreamed();
         }
      });

      if (user_settings.thumbnails_mix_hide) {
         removeThumbMix();
      }

      function removeThumbShorts() {
         document.body.querySelectorAll('a#thumbnail[href*="shorts/"]')
            .forEach(el => el.closest(thumbsSelectors)?.remove());
         // for test
         // .forEach(el => {
         //       if (thumb = el.closest(thumbsSelectors)) {
         //          // thumb.remove();
         //          // thumb.style.display = 'none';

         //          // console.debug('#shorts:', thumb);
         //          thumb.style.border = '2px solid orange'; // mark for test
         //       }
         //    });

         if (+user_settings.shorts_disable_min_duration) {
            document.body.querySelectorAll('#thumbnail #overlays #text:not(:empty)')
               .forEach(el => {
                  if ((thumb = el.closest(thumbsSelectors))
                     && NOVA.timeFormatTo.hmsToSec(el.textContent.trim()) < (+user_settings.shorts_disable_min_duration || 60)
                  ) {
                     thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('#shorts:', thumb);
                     // thumb.style.border = '2px solid blue'; // mark for test
                  }
               });
         }
      }

      function removeThumbPremieres() {
         const thumbsSelector = 'ytd-grid-video-renderer:not([hidden])';

         document.body.querySelectorAll(
            `#thumbnail #overlays [overlay-style="UPCOMING"],
               #thumbnail  #overlays [aria-label="PREMIERE"]`
         )
            .forEach(el => el.closest(thumbsSelector)?.remove());
         // for test
         // .forEach(el => {
         //    if (thumb = el.closest(thumbsSelector)) {
         //       thumb.remove();
         //       // thumb.style.display = 'none';

         //       console.debug('Premieres:', thumb);
         //       thumb.style.border = '2px solid red'; // mark for test
         //    }
         // });
      }

      function removeThumbMix() {
         // for home page
         document.addEventListener('yt-action', evt => {
            if (evt.detail?.actionName == 'ytd-rich-item-index-update-action' && NOVA.currentPage == 'home') {

               document.body.querySelectorAll('a[href*="list="][href*="start_radio="]:not([hidden]), a[title^="Mix -"]:not([hidden])')
                  .forEach(el => el.closest('ytd-rich-item-renderer')?.remove());
               // for test
               // .forEach(el => {
               //    if (thumb = el.closest('ytd-rich-item-renderer')) {
               //       // thumb.style.display = 'none';
               //       console.debug('has Mix:', thumb);
               //       thumb.style.border = '2px solid red'; // mark for test
               //    }
               // });
            }
         });
      }

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

   },
   options: {
      shorts_disable: {
         _tagName: 'input',
         label: 'Hide Shorts',
         'label:zh': '隐藏短裤',
         'label:ja': 'ショーツを隠す',
         'label:ko': '반바지 숨기기',
         'label:id': 'Sembunyikan Celana Pendek',
         'label:es': 'Ocultar pantalones cortos',
         'label:pt': 'Ocultar shorts',
         'label:fr': 'Masquer les shorts',
         'label:it': 'Nascondi pantaloncini',
         'label:tr': 'Şort Gizle',
         'label:de': 'Shorts verstecken',
         'label:pl': 'Ukryj YouTube Shorts',
         type: 'checkbox',
         // title: '',
      },
      shorts_disable_min_duration: {
         _tagName: 'input',
         label: 'Min duration in sec',
         'label:zh': '最短持续时间（以秒为单位）',
         'label:ja': '秒単位の最小期間',
         'label:ko': '최소 지속 시간(초)',
         'label:id': 'Durasi lebih sedikit dalam detik',
         'label:es': 'Duración mínima en segundos',
         'label:pt': 'Duração mínima em segundos',
         'label:fr': 'Durée minimale en secondes',
         'label:it': 'Meno durata in sec',
         'label:tr': 'Saniye cinsinden minimum süre',
         'label:de': 'Mindestdauer in Sekunden',
         'label:pl': 'Poniżej czasu trwania w sekundach',
         type: 'number',
         // title: '60 - default',
         // title: 'Minimum duration in seconds',
         title: '0 - disable',
         placeholder: '60-300',
         step: 1,
         min: 3,
         max: 3600,
         value: 60,
         'data-dependent': { 'shorts-disable': true },
      },
      premieres_disable: {
         _tagName: 'input',
         label: 'Hide Premieres',
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
         'title:pl': 'Ukrywaj premiery',
         type: 'checkbox',
      },
      streams_disable: {
         _tagName: 'input',
         label: 'Hide Stream (live)',
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
         'label:pl': 'Ukryj strumień (na żywo)',
         type: 'checkbox',
      },
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
         'data-dependent': { 'streams-disable': true },
      },
      thumbnails_mix_hide: {
         _tagName: 'input',
         label: "Hide 'Mix' thumbnails",
         'label:zh': '隐藏[混合]缩略图',
         'label:ja': '「Mix」サムネイルを非表示',
         'label:ko': '"믹스" 썸네일 숨기기',
         'label:id': 'Sembunyikan gambar mini "Mix"',
         'label:es': "Ocultar miniaturas de 'Mix'",
         'label:pt': "Ocultar miniaturas de 'Mix'",
         'label:fr': 'Masquer les vignettes "Mix"',
         'label:it': 'Nascondi le miniature "Mix".',
         'label:tr': "'Karıştır' küçük resimlerini gizle",
         'label:de': '„Mix“-Thumbnails ausblenden',
         'label:pl': 'Ukryj miniaturki "Mix"',
         type: 'checkbox',
         title: '[Mix] offers to rewatch what has already saw',
         'title:zh': '[混合]提供重新观看已经看过的内容',
         'title:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
         'title:ko': '[Mix]는 이미 본 것을 다시 볼 것을 제안합니다',
         'title:id': '[Mix] menawarkan untuk menonton ulang apa yang telah dilihat',
         'title:es': '[Mix] ofrece volver a ver lo que ya vio',
         'title:pt': '[Mix] se oferece para rever o que já viu',
         'title:it': '[Mix] si offre di rivedere ciò che ha già visto',
         'title:tr': '[Mix], daha önce görmüş olanı yeniden izlemeyi teklif ediyor',
         'title:de': '[Mix] bietet an, bereits Gesehenes noch einmal anzuschauen',
         'title:pl': '[Mix] proponuje ponowne obejrzenie już obejrzanych filmów',
      },
   }
});
